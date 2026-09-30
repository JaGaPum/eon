// Operaciones con enteros: lee una expresión, decide qué se hace primero y la resuelve paso a paso.

export type Op = '+' | '-' | '*' | '/'

export type Nodo =
  | { t: 'num'; v: number }
  | { t: 'bin'; op: Op; a: Nodo; b: Nodo }
  /** Paréntesis (0), corchete (1) o llave (2). Nunca contiene un número suelto: se simplifica al crearlo. */
  | { t: 'grp'; br: number; a: Nodo }
  /** Un menos delante de un paréntesis. */
  | { t: 'neg'; a: Nodo }

/** Trozo de la expresión escrita: `m` si va resaltado, `op` si es un signo de operación que se puede tocar. */
export interface Trozo {
  s: string
  m?: boolean
  op?: Nodo
}

export interface PasoExpr {
  antes: Trozo[]
  /** Por qué toca esta operación ahora. */
  porque: string
  /** La cuenta que se hace. */
  cuenta: string
  despues: string
}

export interface Resuelta {
  inicial: string
  pasos: PasoExpr[]
  resultado: number
}

const ABRE = '([{'
const CIERRA = ')]}'
const SIMBOLO: Record<Op, string> = { '+': '+', '-': '−', '*': '·', '/': ':' }
const DENTRO = ['del paréntesis', 'del corchete', 'de la llave']
const num = (v: number): Nodo => ({ t: 'num', v: v || 0 })
const texto = (tr: Trozo[]) => tr.map((t) => t.s).join('')

// ---------- Leer ----------

export function analizar(entrada: string): Nodo {
  const s = entrada
    .replace(/[−–—]/g, '-')
    .replace(/[·x×]/gi, '*')
    .replace(/[:÷]/g, '/')
    .replace(/\s+/g, '')
  if (!s) throw new Error('Escribe una operación.')
  if (/\d\s+\d/.test(entrada)) throw new Error('Hay dos números seguidos sin ningún signo entre ellos.')
  if (/[^0-9+\-*/()[\]{}]/.test(s)) throw new Error('Solo valen números, los signos + − · : y paréntesis.')
  let i = 0

  const expr = (): Nodo => {
    let n = termino()
    while (s[i] === '+' || s[i] === '-') {
      const op = s[i++] as Op
      n = { t: 'bin', op, a: n, b: termino() }
    }
    return n
  }
  const termino = (): Nodo => {
    let n = unario()
    while (s[i] === '*' || s[i] === '/') {
      const op = s[i++] as Op
      n = { t: 'bin', op, a: n, b: unario() }
    }
    return n
  }
  const unario = (): Nodo => {
    if (s[i] === '+') {
      i++
      return unario()
    }
    if (s[i] === '-') {
      i++
      const deGrupo = i < s.length && ABRE.includes(s[i])
      const u = unario()
      // −(−3) se conserva como paso propio; −5 y −(5) son directamente el número −5.
      return u.t === 'num' && (!deGrupo || u.v >= 0) ? num(-u.v) : { t: 'neg', a: u }
    }
    return atomo()
  }
  const atomo = (): Nodo => {
    const br = i < s.length ? ABRE.indexOf(s[i]) : -1
    if (br >= 0) {
      i++
      const a = expr()
      if (s[i] !== CIERRA[br]) throw new Error('Hay un paréntesis sin cerrar o mal cerrado.')
      i++
      return a.t === 'num' ? a : { t: 'grp', br, a }
    }
    const m = /^\d+/.exec(s.slice(i))
    if (!m) throw new Error('La operación no está bien escrita.')
    i += m[0].length
    return num(Number(m[0]))
  }

  const raiz = expr()
  if (i < s.length) throw new Error('La operación no está bien escrita.')
  return raiz
}

// ---------- Escribir ----------

/** Un negativo lleva paréntesis salvo que abra la expresión o un paréntesis. */
const conSigno = (v: number, inicio: boolean) => (v < 0 ? (inicio ? `−${-v}` : `(−${-v})`) : String(v))

export function trozos(n: Nodo, marcado?: Nodo, inicio = true, m = false): Trozo[] {
  m = m || n === marcado
  switch (n.t) {
    case 'num':
      return [{ s: conSigno(n.v, inicio), m }]
    case 'neg':
      return [{ s: '−', m, op: n }, ...trozos(n.a, marcado, false, m)]
    case 'grp':
      return [{ s: ABRE[n.br], m }, ...trozos(n.a, marcado, true, m), { s: CIERRA[n.br], m }]
    case 'bin':
      return [...trozos(n.a, marcado, inicio, m), { s: ` ${SIMBOLO[n.op]} `, m, op: n }, ...trozos(n.b, marcado, false, m)]
  }
}

export const escribir = (n: Nodo) => texto(trozos(n))

// ---------- Decidir qué va primero ----------

const esProd = (n: Nodo): boolean => n.t === 'bin' && (n.op === '*' || n.op === '/')
const lista = (n: Nodo): boolean => (n.t === 'bin' ? n.a.t === 'num' && n.b.t === 'num' : n.t === 'neg' && n.a.t === 'num')

/** Primer nodo, de izquierda a derecha, que cumple la condición. */
function hallar(n: Nodo, vale: (x: Nodo) => boolean): Nodo | null {
  if (n.t === 'bin') return hallar(n.a, vale) ?? (vale(n) ? n : null) ?? hallar(n.b, vale)
  if (n.t === 'neg') return vale(n) ? n : hallar(n.a, vale)
  if (n.t === 'grp') return hallar(n.a, vale)
  return null
}

function grupoDentro(n: Nodo): Nodo | null {
  if (n.t === 'neg') return n.a.t === 'grp' ? n.a : grupoDentro(n.a)
  if (n.t === 'bin') return (n.a.t === 'grp' ? n.a : grupoDentro(n.a)) ?? (n.b.t === 'grp' ? n.b : grupoDentro(n.b))
  return null
}

/** La operación que toca según la jerarquía: paréntesis interiores, luego · y :, luego + y −. */
export function siguiente(n: Nodo): Nodo | null {
  if (n.t === 'num') return null
  if (n.t === 'grp') return siguiente(n.a)
  const g = grupoDentro(n)
  if (g) return siguiente(g)
  return hallar(n, (x) => x.t === 'neg' && lista(x)) ?? hallar(n, (x) => esProd(x) && lista(x)) ?? hallar(n, (x) => x.t === 'bin' && lista(x))
}

/** Si una operación se puede hacer ya (null) o, si no, por qué hay que esperar. */
export function motivo(n: Nodo): string | null {
  if (lista(n)) return null
  const hijos = n.t === 'bin' ? [n.a, n.b] : n.t === 'neg' ? [n.a] : []
  const pendiente = hijos.find((h) => h.t !== 'num')!
  if (pendiente.t === 'grp' || grupoDentro(pendiente) || (pendiente.t === 'neg' && pendiente.a.t !== 'num')) {
    return 'Todavía no: antes hay que resolver lo que está dentro del paréntesis.'
  }
  if (pendiente.t === 'neg') return 'Todavía no: antes hay que quitar el menos de delante del paréntesis.'
  if (esProd(pendiente) && !esProd(n)) return 'Todavía no: las multiplicaciones y divisiones van antes que las sumas y restas.'
  return 'Todavía no: se va de izquierda a derecha, y antes hay una operación a su izquierda.'
}

// ---------- Calcular ----------

function calcular(n: Nodo): { v: number; cuenta: string } {
  if (n.t === 'neg' && n.a.t === 'num') {
    const v = -n.a.v
    return { v, cuenta: `El menos de delante cambia el signo: −(${conSigno(n.a.v, true)}) = ${v}.` }
  }
  if (n.t !== 'bin' || n.a.t !== 'num' || n.b.t !== 'num') throw new Error('Operación no preparada.')
  const a = n.a.v
  const b = n.b.v
  const A = conSigno(a, true)
  const B = conSigno(b, false)
  if (n.op === '*' || n.op === '/') {
    if (n.op === '/' && b === 0) throw new Error('No se puede dividir entre 0.')
    if (n.op === '/' && a % b !== 0) throw new Error(`La división ${A} : ${B} no es exacta.`)
    const v = n.op === '*' ? a * b : a / b
    const signos =
      a < 0 && b < 0
        ? ` Menos ${n.op === '*' ? 'por' : 'entre'} menos: más.`
        : (a < 0 || b < 0) && v !== 0
          ? ' Signos distintos: el resultado es negativo.'
          : ''
    return { v, cuenta: `${A} ${SIMBOLO[n.op]} ${B} = ${conSigno(v, true)}.${signos}` }
  }
  const v = n.op === '+' ? a + b : a - b
  const R = conSigno(v, true)
  if (b < 0) {
    return n.op === '+'
      ? { v, cuenta: `Sumar un negativo es restar: ${A} − ${-b} = ${R}.` }
      : { v, cuenta: `Restar un negativo es sumar su opuesto: ${A} + ${-b} = ${R}.` }
  }
  return { v, cuenta: `${A} ${SIMBOLO[n.op]} ${B} = ${R}.` }
}

function reemplazar(n: Nodo, objetivo: Nodo, nuevo: Nodo): Nodo {
  if (n === objetivo) return nuevo
  if (n.t === 'grp') {
    const a = reemplazar(n.a, objetivo, nuevo)
    return a === n.a ? n : a.t === 'num' ? a : { ...n, a }
  }
  if (n.t === 'neg') {
    const a = reemplazar(n.a, objetivo, nuevo)
    return a === n.a ? n : a.t === 'num' && a.v >= 0 ? num(-a.v) : { ...n, a }
  }
  if (n.t === 'bin') {
    const a = reemplazar(n.a, objetivo, nuevo)
    const b = reemplazar(n.b, objetivo, nuevo)
    return a === n.a && b === n.b ? n : { ...n, a, b }
  }
  return n
}

/** Hace una operación concreta y devuelve la expresión resultante. */
export function aplicar(raiz: Nodo, objetivo: Nodo): { raiz: Nodo; cuenta: string } {
  const { v, cuenta } = calcular(objetivo)
  return { raiz: reemplazar(raiz, objetivo, num(v)), cuenta }
}

function camino(n: Nodo, objetivo: Nodo): Nodo[] | null {
  if (n === objetivo) return [n]
  for (const h of n.t === 'bin' ? [n.a, n.b] : n.t === 'num' ? [] : [n.a]) {
    const c = camino(h, objetivo)
    if (c) return [n, ...c]
  }
  return null
}

function porque(raiz: Nodo, objetivo: Nodo): string {
  const grupo = camino(raiz, objetivo)!.filter((x) => x.t === 'grp').pop()
  const ambito = grupo && grupo.t === 'grp' ? grupo.a : raiz
  const frases: string[] = []
  if (grupo && grupo.t === 'grp') frases.push(`Primero lo de dentro ${DENTRO[grupo.br]}.`)
  if (objetivo.t === 'bin') {
    const haySumas = hallar(ambito, (x) => x.t === 'bin' && !esProd(x))
    if (esProd(objetivo)) {
      if (haySumas) frases.push('Las multiplicaciones y divisiones van antes que las sumas y restas.')
      else if (ambito !== objetivo) frases.push('De izquierda a derecha.')
    } else if (ambito !== objetivo) {
      frases.push('Solo quedan sumas y restas: de izquierda a derecha.')
    }
  }
  return frases.join(' ')
}

function resolverArbol(raiz: Nodo): Resuelta {
  const pasos: PasoExpr[] = []
  let r = raiz
  for (let obj = siguiente(r); obj; obj = siguiente(r)) {
    const hecho = aplicar(r, obj)
    pasos.push({ antes: trozos(r, obj), porque: porque(r, obj), cuenta: hecho.cuenta, despues: escribir(hecho.raiz) })
    r = hecho.raiz
  }
  if (r.t !== 'num') throw new Error('La operación no está bien escrita.')
  return { inicial: escribir(raiz), pasos, resultado: r.v }
}

// ---------- Sumas y restas: quitar paréntesis como en el libro ----------

type Signo = 1 | -1
type Item = { s: Signo; v: number } | { s: Signo; g: Item[]; br: number }

function aItems(n: Nodo, s: Signo): Item[] | null {
  switch (n.t) {
    case 'num':
      return [{ s, v: n.v }]
    case 'grp': {
      const g = aItems(n.a, 1)
      return g && [{ s, g, br: n.br }]
    }
    case 'neg':
      return aItems(n.a, -s as Signo)
    case 'bin': {
      if (esProd(n)) return null
      const a = aItems(n.a, s)
      const b = aItems(n.b, n.op === '+' ? s : (-s as Signo))
      return a && b && [...a, ...b]
    }
  }
}

/** −40 al principio se escribe tal cual, no como + (−40). */
function normalizar(items: Item[]): Item[] {
  return items.map((it, i) => {
    if ('g' in it) return { ...it, g: normalizar(it.g) }
    return i === 0 && it.s === 1 && it.v < 0 ? { s: -1, v: -it.v } : it
  })
}

function trozosItems(items: Item[], marca?: (it: Item) => boolean, m = false): Trozo[] {
  return items.flatMap((it, i): Trozo[] => {
    const mm = m || !!marca?.(it)
    const signo = i === 0 ? (it.s < 0 ? '−' : '') : it.s < 0 ? ' − ' : ' + '
    return 'g' in it
      ? [{ s: signo + ABRE[it.br], m: mm }, ...trozosItems(it.g, marca, mm), { s: CIERRA[it.br], m: mm }]
      : [{ s: signo + (it.v < 0 ? `(−${-it.v})` : it.v), m: mm }]
  })
}

const planos = (items: Item[]): Item[] => items.flatMap((it) => ('g' in it ? planos(it.g) : [it]))
const mapear = (items: Item[], f: (it: Item) => Item[]): Item[] =>
  items.flatMap((it) => f('g' in it ? { ...it, g: mapear(it.g, f) } : it))

const sustituir = (items: Item[], objetivo: Item, por: Item[]): Item[] =>
  items.flatMap((it) => (it === objetivo ? por : 'g' in it ? [{ ...it, g: sustituir(it.g, objetivo, por) }] : [it]))

function grupoInterior(items: Item[]): Item | null {
  for (const it of items) if ('g' in it) return grupoInterior(it.g) ?? it
  return null
}

function resolverQuitando(raiz: Nodo): Resuelta | null {
  const crudo = aItems(raiz, 1)
  if (!crudo) return null
  let items = normalizar(crudo)
  const inicial = texto(trozosItems(items))
  const pasos: PasoExpr[] = []

  const dobles = planos(items).filter((it) => !('g' in it) && it.v < 0)
  if (dobles.length) {
    const antes = trozosItems(items, (it) => dobles.includes(it))
    const reglas = new Set(dobles.map((it) => (it.s < 0 ? '− (−a) = + a' : '+ (−a) = − a')))
    items = mapear(items, (it) => ('g' in it || it.v >= 0 ? [it] : [{ s: -it.s as Signo, v: -it.v }]))
    pasos.push({
      antes,
      porque: 'Primero se juntan los signos que van seguidos.',
      cuenta: [...reglas].join('   y   ') + '.',
      despues: texto(trozosItems(items)),
    })
  }

  for (let g = grupoInterior(items); g && 'g' in g; g = grupoInterior(items)) {
    const objetivo = g
    const dentro = objetivo.g.map((it) => ({ ...it, s: (it.s * objetivo.s) as Signo }))
    const antes = trozosItems(items, (it) => it === objetivo)
    items = sustituir(items, objetivo, dentro)
    pasos.push({
      antes,
      porque:
        objetivo.s > 0
          ? `Delante ${DENTRO[objetivo.br]} hay un + (o nada): los sumandos de dentro conservan su signo.`
          : `Delante ${DENTRO[objetivo.br]} hay un −: todos los sumandos de dentro cambian de signo.`,
      cuenta: `${texto(trozosItems([objetivo]))}  →  ${texto(trozosItems(dentro))}`,
      despues: texto(trozosItems(items)),
    })
  }

  const sueltos = planos(items) as { s: Signo; v: number }[]
  const pos = sueltos.filter((it) => it.s > 0).map((it) => it.v)
  const neg = sueltos.filter((it) => it.s < 0).map((it) => it.v)
  const P = pos.reduce((a, b) => a + b, 0)
  const N = neg.reduce((a, b) => a + b, 0)
  const resultado = P - N
  if (sueltos.length > 1) {
    const R = conSigno(resultado, true)
    const cuenta = !neg.length
      ? `${pos.join(' + ')} = ${R}.`
      : !pos.length
        ? `Todos son negativos: se suman sus valores absolutos (${neg.join(' + ')} = ${N}) y se deja el signo −. Resultado: ${R}.`
        : `Positivos: ${pos.join(' + ')} = ${P}. Negativos: ${neg.join(' + ')} = ${N}. Y ahora ${P} − ${N} = ${R}.`
    pasos.push({
      antes: trozosItems(items),
      porque: 'Ya no hay paréntesis: se suman por un lado los positivos y por otro los negativos.',
      cuenta,
      despues: R,
    })
  }
  return { inicial, pasos, resultado }
}

/**
 * Resuelve una expresión paso a paso. Con modo «quitar» y solo sumas y restas,
 * quita los paréntesis cambiando signos (método del libro) en vez de operar dentro.
 */
export function resolver(entrada: string, modo?: 'quitar'): Resuelta {
  const raiz = analizar(entrada)
  return (modo === 'quitar' && resolverQuitando(raiz)) || resolverArbol(raiz)
}
