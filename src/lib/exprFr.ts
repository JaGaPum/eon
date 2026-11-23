// Operaciones combinadas con fracciones: lee la expresión, decide qué toca según la jerarquía (paréntesis,
// potencias, multiplicaciones y divisiones de izquierda a derecha, sumas y restas) y la resuelve paso a paso.
// Se escribe como en el cuaderno: «3/4» es una fracción, «:» es dividir, «·» multiplicar y «^» elevar.
import { div, fr, inversa, mcdDe, mcmLista, mul, pot, type Fr } from './fracciones'

export type NodoF =
  | { t: 'num'; v: Fr }
  /** Sumas y restas seguidas: se hacen todas a la vez con común denominador. */
  | { t: 'sum'; items: { s: 1 | -1; n: NodoF }[] }
  | { t: 'prod'; op: '*' | '/'; a: NodoF; b: NodoF }
  | { t: 'pow'; a: NodoF; e: number }
  /** Raíz cuadrada de un número, de una fracción o de lo que hay dentro de un paréntesis: √36, √(4/81), √(5² − 4²). */
  | { t: 'raiz'; a: NodoF }
  /** Paréntesis (0), corchete (1) o llave (2). Nunca contiene un número suelto. */
  | { t: 'grp'; br: number; a: NodoF }

/** Trozo de lo que se escribe. `nodo` si es un signo que se puede tocar; `m` si va resaltado. */
export type Tok =
  | { k: 'txt'; s: string; m?: boolean }
  | { k: 'fr'; v: Fr; m?: boolean; paren?: boolean }
  /** Una fracción con cuentas arriba y abajo, sin hacer: (3·5)/(4·3). */
  | { k: 'frs'; arriba: string; abajo: string; m?: boolean }
  | { k: 'op'; s: string; nodo: NodoF; m?: boolean; sup?: boolean }
  | { k: 'sup'; s: string; m?: boolean }
  /** Raíz con su raya encima de lo de dentro; el «√» se puede tocar. */
  | { k: 'rad'; toks: Tok[]; nodo: NodoF; m?: boolean }

const ABRE = '([{'
const CIERRA = ')]}'
const num = (v: Fr): NodoF => ({ t: 'num', v })
const VOLADOS = '⁰¹²³⁴⁵⁶⁷⁸⁹'
export const volado = (e: number) =>
  String(e)
    .split('')
    .map((c) => (c === '-' ? '⁻' : VOLADOS[Number(c)]))
    .join('')
const signo = (v: number) => (v < 0 ? `−${-v}` : String(v))
const conPar = (v: number) => (v < 0 ? `(−${-v})` : String(v))

// ---------- Leer ----------

export function analizarFr(entrada: string): NodoF {
  const s = entrada
    .replace(/[−–—]/g, '-')
    .replace(/[·x×*]/gi, '*')
    .replace(/[÷]/g, ':')
    .replace(/\s+/g, '')
  if (!s) throw new Error('Escribe una operación.')
  if (/[^0-9+\-*:/^()[\]{}√]/.test(s)) throw new Error('Solo valen números, fracciones como 3/4 y los signos + − · : ^ y paréntesis.')
  let i = 0

  const expr = (): NodoF => {
    const items: { s: 1 | -1; n: NodoF }[] = []
    let sg: 1 | -1 = 1
    if (s[i] === '-' || s[i] === '+') sg = s[i++] === '-' ? -1 : 1
    items.push({ s: sg, n: termino() })
    while (s[i] === '+' || s[i] === '-') {
      sg = s[i++] === '-' ? -1 : 1
      items.push({ s: sg, n: termino() })
    }
    // Un menos delante de un número se queda en el número: −3/4 es la fracción negativa.
    const limpios = items.map((it, k) => (k === 0 && it.s === -1 && it.n.t === 'num' ? { s: 1 as const, n: num({ n: -it.n.v.n, d: it.n.v.d }) } : it))
    return limpios.length === 1 && limpios[0].s === 1 ? limpios[0].n : { t: 'sum', items: limpios }
  }
  const termino = (): NodoF => {
    let n = potencia()
    // «5/√36» es una fracción con una raíz abajo: se lee como 5 : √36.
    while (s[i] === '*' || s[i] === ':' || (s[i] === '/' && s[i + 1] === '√')) {
      const op = s[i++] === '*' ? '*' : '/'
      n = { t: 'prod', op, a: n, b: potencia() }
    }
    if (s[i] === '/') throw new Error('Para dividir usa «:». La barra «/» es solo para escribir fracciones como 3/4.')
    return n
  }
  const potencia = (): NodoF => {
    const a = atomo()
    if (s[i] !== '^') return a
    i++
    // El exponente puede ser negativo: 2^-3 o 2^(-3).
    const m = /^(\(-\d+\)|-?\d+)/.exec(s.slice(i))
    if (!m) throw new Error('Después de ^ va el exponente, un número entero.')
    i += m[0].length
    return { t: 'pow', a, e: Number(m[0].replace(/[()]/g, '')) }
  }
  const atomo = (): NodoF => {
    if (s[i] === '√') {
      i++
      if (s[i] === '(') {
        i++
        const a = expr()
        if (s[i] !== ')') throw new Error('Hay un paréntesis sin cerrar o mal cerrado.')
        i++
        if (a.t === 'num') raizFr(a.v)
        return { t: 'raiz', a }
      }
      const m = /^\d+/.exec(s.slice(i))
      if (!m) throw new Error('Después de √ va un número o un paréntesis: √36 o √(4/81).')
      i += m[0].length
      // Una raíz que no es exacta se avisa ya al leerla.
      raizFr(fr(Number(m[0])))
      return { t: 'raiz', a: num(fr(Number(m[0]))) }
    }
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
    let d = 1
    if (s[i] === '/' && s[i + 1] !== '√') {
      const md = /^\/(\d+)/.exec(s.slice(i))
      if (!md) throw new Error('Una fracción se escribe con números arriba y abajo: 3/4.')
      d = Number(md[1])
      if (d === 0) throw new Error('El denominador no puede ser 0.')
      i += md[0].length
    }
    // Tal como se escribe: 3/6 se queda en 3/6 en el enunciado; los resultados ya salen simplificados.
    return num({ n: Number(m[0]), d })
  }

  const raiz = expr()
  if (i < s.length) throw new Error('La operación no está bien escrita.')
  return raiz
}

// ---------- Escribir ----------

/** Los trozos de la expresión, con `marcado` resaltado. `inicio`: si un negativo puede ir sin paréntesis. */
export function tokens(n: NodoF, marcado?: NodoF | null, inicio = true, m = false): Tok[] {
  m = m || n === marcado
  switch (n.t) {
    case 'num':
      return [{ k: 'fr', v: n.v, m, paren: n.v.n < 0 && !inicio }]
    case 'raiz':
      return [{ k: 'rad', toks: tokens(n.a, marcado, true, m), nodo: n, m }]
    case 'grp':
      return [{ k: 'txt', s: ABRE[n.br], m }, ...tokens(n.a, marcado, true, m), { k: 'txt', s: CIERRA[n.br], m }]
    case 'pow': {
      const base: Tok[] =
        n.a.t === 'num'
          ? n.a.v.d !== 1 || n.a.v.n < 0
            ? [{ k: 'txt', s: '(', m }, { k: 'fr', v: n.a.v, m }, { k: 'txt', s: ')', m }]
            : [{ k: 'fr', v: n.a.v, m }]
          : tokens(n.a, marcado, true, m)
      return [...base, { k: 'op', s: volado(n.e), nodo: n, m, sup: true }]
    }
    case 'prod':
      return [...tokens(n.a, marcado, inicio, m), { k: 'op', s: n.op === '*' ? ' · ' : ' : ', nodo: n, m }, ...tokens(n.b, marcado, false, m)]
    case 'sum':
      return n.items.flatMap((it, k): Tok[] => {
        const signoTok: Tok[] =
          k === 0 ? (it.s === -1 ? [{ k: 'txt', s: '−', m }] : []) : [{ k: 'op', s: it.s === 1 ? ' + ' : ' − ', nodo: n, m }]
        return [...signoTok, ...tokens(it.n, marcado, k === 0 && it.s === 1 ? inicio : false, m)]
      })
  }
}

/** La expresión como texto plano, para las pruebas y para compararla. */
export function escribirFr(n: NodoF): string {
  return tokens(n)
    .map((t) =>
      plano(t),
    )
    .join('')
}

function plano(t: Tok): string {
  if (t.k === 'fr') return t.paren ? `(${signo(t.v.n)}${t.v.d === 1 ? '' : `/${t.v.d}`})` : `${signo(t.v.n)}${t.v.d === 1 ? '' : `/${t.v.d}`}`
  if (t.k === 'frs') return `${t.arriba}/${t.abajo}`
  if (t.k === 'rad') {
    const dentro = t.toks.map(plano).join('')
    return /^\d+$/.test(dentro) ? `√${dentro}` : `√(${dentro})`
  }
  return t.s
}

// ---------- Qué toca ----------

const listo = (n: NodoF): boolean => {
  if (n.t === 'raiz' || n.t === 'pow') return n.a.t === 'num'
  if (n.t === 'prod') return n.a.t === 'num' && n.b.t === 'num'
  if (n.t === 'sum') return n.items.every((it) => it.n.t === 'num')
  return false
}

/** Grupos que cuelgan directamente de este nivel (sin entrar en otros grupos). */
function grupos(n: NodoF): NodoF[] {
  switch (n.t) {
    case 'grp':
      return [n]
    case 'sum':
      return n.items.flatMap((it) => grupos(it.n))
    case 'prod':
      return [...grupos(n.a), ...grupos(n.b)]
    case 'pow':
      return grupos(n.a)
    // Lo de dentro de una raíz se resuelve antes, como un paréntesis.
    case 'raiz':
      return n.a.t === 'num' ? [] : [n]
    default:
      return []
  }
}

/** Operaciones listas de este nivel, de izquierda a derecha, sin entrar en grupos. */
function listas(n: NodoF): NodoF[] {
  switch (n.t) {
    case 'sum':
      return [...n.items.flatMap((it) => listas(it.n)), ...(listo(n) ? [n] : [])]
    case 'prod':
      return [...listas(n.a), ...(listo(n) ? [n] : []), ...listas(n.b)]
    case 'pow':
    case 'raiz':
      return listo(n) ? [n] : []
    default:
      return []
  }
}

const prioridad = (n: NodoF) => (n.t === 'pow' || n.t === 'raiz' ? 0 : n.t === 'prod' ? 1 : 2)

/** La operación que se hace ahora al resolverla en orden: primero el grupo de más a la izquierda, por dentro. */
export function siguienteFr(n: NodoF): NodoF | null {
  if (n.t === 'num') return null
  if (n.t === 'grp') return siguienteFr(n.a)
  if (n.t === 'raiz' && n.a.t !== 'num') return siguienteFr(n.a)
  const g = grupos(n)
  if (g.length) return siguienteFr(g[0])
  const l = listas(n)
  if (!l.length) return null
  const mejor = Math.min(...l.map(prioridad))
  return l.find((x) => prioridad(x) === mejor) ?? null
}

/** Todas las operaciones que se pueden hacer ya sin saltarse la jerarquía (los paréntesis, en cualquier orden). */
export function validasFr(n: NodoF): NodoF[] {
  if (n.t === 'num') return []
  if (n.t === 'grp' || (n.t === 'raiz' && n.a.t !== 'num')) return validasFr(n.a)
  const g = grupos(n)
  const l = listas(n)
  if (g.length) return [...g.flatMap((x) => validasFr(x)), ...l.filter((x) => x.t === 'pow' || x.t === 'raiz')]
  const mejor = Math.min(...l.map(prioridad))
  return l.filter((x) => prioridad(x) === mejor)
}

/** Por qué no se puede hacer todavía la operación tocada. */
export function motivoFr(raiz: NodoF, x: NodoF): string | null {
  if (validasFr(raiz).includes(x)) return null
  const lado = (y: NodoF): string | null =>
    y.t === 'grp'
      ? 'Antes hay que resolver el paréntesis que tiene al lado.'
      : y.t === 'pow' || y.t === 'raiz'
        ? 'Antes va la potencia (o la raíz) que tiene al lado.'
        : y.t === 'prod'
          ? 'Las multiplicaciones y divisiones van de izquierda a derecha: primero la que tiene a su izquierda.'
          : y.t === 'sum'
            ? 'Antes hay que terminar lo de al lado.'
            : null
  if (x.t === 'raiz') return 'Antes hay que resolver lo de dentro de la raíz.'
  if (x.t === 'pow') return lado(x.a) ?? 'Antes hay que terminar lo de dentro.'
  if (x.t === 'prod') return x.a.t !== 'num' ? lado(x.a) : x.b.t !== 'num' ? lado(x.b) : 'Antes van las potencias.'
  if (x.t === 'sum') {
    const pend = x.items.map((it) => it.n).find((y) => y.t !== 'num')
    if (pend?.t === 'grp') return 'Las sumas y restas van al final: antes hay que resolver los paréntesis.'
    if (pend?.t === 'pow' || pend?.t === 'raiz') return 'Las sumas y restas van al final: antes van las potencias.'
    return 'Las sumas y restas van al final: antes van las multiplicaciones y divisiones.'
  }
  return 'Eso todavía no toca.'
}

// ---------- Hacer una operación ----------

export interface PasoFr {
  antes: Tok[]
  porque: string
  /** La cuenta hecha, en el formato del cuaderno. */
  cuenta: Tok[]
  despues: Tok[]
}

const t = (s: string): Tok => ({ k: 'txt', s })
const f = (v: Fr): Tok => ({ k: 'fr', v })
const fs = (arriba: string, abajo: string): Tok => ({ k: 'frs', arriba, abajo })

/** «= 15/12 = 5/4»: el resultado sin simplificar y, si se puede, simplificado. */
function simplificado(n: number, d: number): Tok[] {
  if (d < 0) [n, d] = [-n, -d]
  const k = mcdDe(n, d)
  const sin: Tok = d === 1 ? t(signo(n)) : f({ n, d })
  return k > 1 && n !== 0 ? [sin, t(' = '), f(fr(n, d))] : [sin]
}

/** La raíz cuadrada exacta de una fracción (ya simplificada). Si no es exacta o es de un negativo, avisa. */
export function raizFr(a0: Fr): Fr {
  const a = fr(a0.n, a0.d)
  if (a.n < 0) throw new Error('La raíz cuadrada de un número negativo no existe: ningún número multiplicado por sí mismo da negativo.')
  const rn = Math.round(Math.sqrt(a.n))
  const rd = Math.round(Math.sqrt(a.d))
  if (rn * rn !== a.n || rd * rd !== a.d) throw new Error(`La raíz de ${a.d === 1 ? a.n : `${a.n}/${a.d}`} no es exacta: aquí solo valen raíces exactas.`)
  return fr(rn, rd)
}

function hacer(x: NodoF): { v: Fr; cuenta: Tok[]; porque: string } {
  switch (x.t) {
    case 'raiz': {
      const a = (x.a as { v: Fr }).v
      const v = raizFr(a)
      const radical: Tok = { k: 'rad', toks: [f(a)], nodo: x }
      const porque = 'Las raíces, como las potencias, van antes que multiplicar, dividir, sumar y restar.'
      if (a.d === 1) return { v, cuenta: [radical, t(` = ${signo(v.n)}`)], porque }
      const s0 = fr(a.n, a.d)
      const simpl: Tok[] = s0.n !== a.n ? [{ k: 'rad', toks: [f(s0)], nodo: x }, t(' = ')] : []
      return {
        v,
        cuenta: [radical, t(' = '), ...simpl, fs(`√${s0.n}`, `√${s0.d}`), t(' = '), f(v)],
        porque: `${porque} La raíz de una fracción es la raíz del numerador entre la raíz del denominador.`,
      }
    }
    case 'pow': {
      const a0 = (x.a as { v: Fr }).v
      const conParen = (y: Fr): Tok[] => (y.d === 1 && y.n >= 0 ? [f(y)] : [t('('), f(y), t(')')])
      if (x.e < 0) {
        if (a0.n === 0) throw new Error('0 no se puede elevar a un exponente negativo.')
        const a = inversa(a0)
        const v = pot(a, -x.e)
        const fin: Tok[] = a.d === 1 ? [t(signo(v.n))] : [fs(`${conPar(a.n)}${volado(-x.e)}`, `${a.d}${volado(-x.e)}`), t(' = '), f(v)]
        const cuenta: Tok[] = [...conParen(a0), t(volado(x.e) + ' = '), ...conParen(a), t(volado(-x.e) + ' = '), ...fin]
        return { v, cuenta, porque: 'Un exponente negativo se quita dando la vuelta a la base (su inversa) y cambiando el signo del exponente.' }
      }
      if (x.e === 0) {
        if (a0.n === 0) throw new Error('0⁰ no tiene valor.')
        return { v: fr(1), cuenta: [...conParen(a0), t('⁰ = 1')], porque: 'Cualquier número (menos el 0) elevado a 0 da 1.' }
      }
      const a = a0
      const v = pot(a, x.e)
      const base: Tok[] = a.d === 1 && a.n >= 0 ? [f(a)] : [t('('), f(a), t(')')]
      const cuenta: Tok[] =
        a.d === 1
          ? [...base, t(volado(x.e) + ' = '), t(signo(v.n))]
          : [...base, t(volado(x.e) + ' = '), fs(`${conPar(a.n)}${volado(x.e)}`, `${a.d}${volado(x.e)}`), t(' = '), ...simplificado(a.n ** x.e, a.d ** x.e)]
      return { v, cuenta, porque: 'Las potencias van antes que multiplicar, dividir, sumar y restar: se elevan el numerador y el denominador.' }
    }
    case 'prod': {
      const a = (x.a as { v: Fr }).v
      const b = (x.b as { v: Fr }).v
      if (x.op === '*') {
        const v = mul(a, b)
        return {
          v,
          cuenta: [f(a), t(' · '), b.n < 0 ? t('(') : t(''), f(b), b.n < 0 ? t(')') : t(''), t(' = '), fs(`${signo(a.n)} · ${conPar(b.n)}`, `${a.d} · ${b.d}`), t(' = '), ...simplificado(a.n * b.n, a.d * b.d)],
          porque: 'Multiplicar: numerador por numerador y denominador por denominador, «en línea».',
        }
      }
      if (b.n === 0) throw new Error('Hay una división entre 0.')
      const v = div(a, b)
      return {
        v,
        cuenta: [f(a), t(' : '), b.n < 0 ? t('(') : t(''), f(b), b.n < 0 ? t(')') : t(''), t(' = '), fs(`${signo(a.n)} · ${b.d}`, `${a.d} · ${conPar(b.n)}`), t(' = '), ...simplificado(a.n * b.d, a.d * b.n)],
        porque: 'Dividir: se multiplica «en cruz», el numerador de la primera por el denominador de la segunda, y al revés.',
      }
    }
    case 'sum': {
      const vs = x.items.map((it) => ({ s: it.s, v: (it.n as { v: Fr }).v }))
      const m = mcmLista(vs.map((y) => y.v.d))
      const nums = vs.map((y) => y.s * y.v.n * (m / y.v.d))
      const total = nums.reduce((a, b) => a + b, 0)
      const mismo = vs.every((y) => y.v.d === m)
      const conv: Tok[] = vs.flatMap((y, k): Tok[] => {
        const n = y.v.n * (m / y.v.d)
        const sg = k === 0 ? (y.s * Math.sign(n) < 0 ? '−' : '') : y.s * Math.sign(n) < 0 ? ' − ' : ' + '
        return [t(sg), m === 1 ? t(String(Math.abs(n))) : f({ n: Math.abs(n), d: m })]
      })
      const arriba = nums.map((n, k) => (k === 0 ? signo(n) : n < 0 ? ` − ${-n}` : ` + ${n}`)).join('')
      const cuenta: Tok[] =
        m === 1
          ? [t(`${arriba} = ${signo(total)}`)]
          : [...(mismo ? [] : [t(`m.c.m. = ${m}:  `), ...conv, t(' = ')]), fs(arriba, String(m)), t(' = '), ...simplificado(total, m)]
      return {
        v: fr(total, m),
        cuenta,
        porque:
          m === 1
            ? 'Solo quedan sumas y restas de enteros.'
            : mismo
              ? 'Solo quedan sumas y restas, y ya tienen el mismo denominador: se suman y restan los numeradores.'
              : 'Solo quedan sumas y restas: se reducen a común denominador (el m.c.m. de los denominadores) y se operan los numeradores.',
      }
    }
    default:
      throw new Error('Esa operación no se puede hacer todavía.')
  }
}

/** Cambia el nodo `x` por su resultado y limpia: grupos con un número dentro y sumas de un solo término. */
function sustituir(n: NodoF, x: NodoF, v: Fr): NodoF {
  if (n === x) return num(v)
  switch (n.t) {
    case 'grp': {
      const a = sustituir(n.a, x, v)
      return a.t === 'num' ? a : a === n.a ? n : { ...n, a }
    }
    case 'pow':
    case 'raiz': {
      const a = sustituir(n.a, x, v)
      return a === n.a ? n : { ...n, a }
    }
    case 'prod': {
      const a = sustituir(n.a, x, v)
      const b = sustituir(n.b, x, v)
      return a === n.a && b === n.b ? n : { ...n, a, b }
    }
    case 'sum': {
      const items = n.items.map((it) => {
        const m = sustituir(it.n, x, v)
        return m === it.n ? it : { ...it, n: m }
      })
      if (items.every((it, k) => it === n.items[k])) return n
      // −(algo) al principio: cuando «algo» ya es un número, el signo pasa al número.
      const limpios = items.map((it, k) => (k === 0 && it.s === -1 && it.n.t === 'num' ? { s: 1 as const, n: num(fr(-it.n.v.n, it.n.v.d)) } : it))
      return limpios.length === 1 && limpios[0].s === 1 ? limpios[0].n : { ...n, items: limpios }
    }
    default:
      return n
  }
}

/** Dentro de qué está una operación, para decirlo en la explicación. */
function dentroDe(raiz: NodoF, x: NodoF): number | null {
  let res: number | null = null
  const ir = (n: NodoF, br: number | null) => {
    if (n === x) res = br
    if (n.t === 'grp') ir(n.a, n.br)
    else if (n.t === 'sum') n.items.forEach((it) => ir(it.n, br))
    else if (n.t === 'prod') {
      ir(n.a, br)
      ir(n.b, br)
    } else if (n.t === 'pow') ir(n.a, br)
    else if (n.t === 'raiz') ir(n.a, -1)
  }
  ir(raiz, null)
  return res
}
const DENTRO = ['Dentro del paréntesis', 'Dentro del corchete', 'Dentro de la llave']

export function aplicarFr(raiz: NodoF, x: NodoF): { raiz: NodoF; paso: PasoFr } {
  const h = hacer(x)
  const dentro = dentroDe(raiz, x)
  const nueva = sustituir(raiz, x, h.v)
  return {
    raiz: nueva,
    paso: {
      antes: tokens(raiz, x),
      porque: (dentro === -1 ? 'Dentro de la raíz. ' : dentro !== null ? `${DENTRO[dentro]}. ` : '') + h.porque,
      cuenta: h.cuenta,
      despues: tokens(nueva),
    },
  }
}

export interface ResueltaFr {
  inicial: Tok[]
  pasos: PasoFr[]
  resultado: Fr
}

export function resolverFr(entrada: string): ResueltaFr {
  let n = analizarFr(entrada)
  const inicial = tokens(n)
  const pasos: PasoFr[] = []
  for (let k = 0; n.t !== 'num'; k++) {
    if (k > 60) throw new Error('La operación es demasiado larga.')
    const x = siguienteFr(n)
    if (!x) throw new Error('La operación no está bien escrita.')
    const r = aplicarFr(n, x)
    n = r.raiz
    pasos.push(r.paso)
  }
  return { inicial, pasos, resultado: n.v }
}

/** El resultado de una expresión, como fracción irreducible. */
export const calcularFr = (entrada: string) => resolverFr(entrada).resultado
