// Tema 3 de Matemáticas de 2.º ESO: potencias y raíces. Aquí se calculan las respuestas y los pasos que se enseñan:
// el signo de una potencia, las propiedades (misma base y mismo exponente), la descomposición en factores primos, la
// notación científica y la raíz cuadrada entera con su resto.
import { fr, inversa, pot, type Fr } from './fracciones'
import { agrupar, factores } from './mates'

const factorizar = (n: number) => (n <= 1 ? [] : agrupar(factores(n)))

const VOLADOS: Record<string, string> = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻', '+': '⁺', '(': '⁽', ')': '⁾' }
/** Un exponente escrito en pequeño y arriba: −3 → ⁻³. */
export const sup = (e: number | string) =>
  String(e)
    .split('')
    .map((c) => VOLADOS[c] ?? c)
    .join('')
export const menos = (s: string) => s.replace(/-/g, '−')

// ===================================================================================================
// Valor y signo
// ===================================================================================================

/** El valor de una potencia de base entera o fraccionaria y exponente entero (puede ser negativo o 0). */
export function potencia(base: Fr, e: number): Fr {
  if (e === 0) {
    if (base.n === 0) throw new Error('0⁰ no tiene valor')
    return fr(1)
  }
  return e > 0 ? pot(base, e) : pot(inversa(base), -e)
}

/** El signo de una potencia: base positiva, siempre +; base negativa, + con exponente par y − con impar. */
export const signoPotencia = (base: number, e: number): 1 | -1 => (base < 0 && Math.abs(e) % 2 === 1 ? -1 : 1)

// ===================================================================================================
// Expresiones con potencias: «2^4·2^2·2», «(2^4·2^3·2^7) / (2^5·2^6)», «((−2)^3)^5», «x^6 : (x^-1)^2 · x^5»
// ===================================================================================================

export type NodoP =
  | { t: 'base'; n?: Fr; letra?: string }
  | { t: 'pow'; a: NodoP; e: number }
  | { t: 'mul'; fs: NodoP[] }
  | { t: 'div'; a: NodoP; b: NodoP; barra?: boolean }
  | { t: 'grp'; a: NodoP }

export function analizarP(entrada: string): NodoP {
  const s = entrada
    .replace(/[−–—]/g, '-')
    .replace(/[·x×*]/g, (c) => (c === 'x' ? c : '*'))
    .replace(/[÷]/g, ':')
    .replace(/\[/g, '(')
    .replace(/\]/g, ')')
    .replace(/\s+/g, '')
  let i = 0
  // Fracción entera: (A) / (B) con barra, solo en el nivel de arriba.
  const producto = (): NodoP => {
    let n: NodoP = factor()
    const fs: NodoP[] = [n]
    let actual: NodoP | null = null
    while (s[i] === '*' || s[i] === ':') {
      const op = s[i++]
      const sig = factor()
      if (op === '*') fs.push(sig)
      else {
        // a · b : c se lee de izquierda a derecha: (a · b) : c
        actual = { t: 'div', a: fs.length === 1 ? fs[0] : { t: 'mul', fs: [...fs] }, b: sig }
        fs.length = 0
        fs.push(actual)
      }
    }
    n = fs.length === 1 ? fs[0] : { t: 'mul', fs }
    return n
  }
  const factor = (): NodoP => {
    let a = atomo()
    while (s[i] === '^') {
      i++
      const m = /^(\(-?\d+\)|-?\d+)/.exec(s.slice(i))
      if (!m) throw new Error('Después de ^ va el exponente, un número entero.')
      i += m[0].length
      a = { t: 'pow', a, e: Number(m[0].replace(/[()]/g, '')) }
    }
    return a
  }
  const atomo = (): NodoP => {
    if (s[i] === '(') {
      i++
      // (−3), (5/7): números entre paréntesis
      const m = /^(-?\d+)(?:\/(\d+))?\)/.exec(s.slice(i))
      if (m) {
        i += m[0].length
        return { t: 'base', n: { n: Number(m[1]), d: Number(m[2] ?? 1) } }
      }
      const a = producto()
      if (s[i] !== ')') throw new Error('Hay un paréntesis sin cerrar.')
      i++
      return { t: 'grp', a }
    }
    const l = /^[a-z]/.exec(s.slice(i))
    if (l) {
      i++
      return { t: 'base', letra: l[0] }
    }
    const m = /^\d+/.exec(s.slice(i))
    if (!m) throw new Error('La expresión no está bien escrita.')
    i += m[0].length
    return { t: 'base', n: { n: Number(m[0]), d: 1 } }
  }
  let raiz = producto()
  if (s[i] === '/') {
    i++
    raiz = { t: 'div', a: raiz, b: producto(), barra: true }
  }
  if (i < s.length) throw new Error('La expresión no está bien escrita.')
  return raiz
}

const textoBase = (b: { n?: Fr; letra?: string }) => (b.letra ? b.letra : b.n!.d === 1 ? menos(String(b.n!.n)) : `${menos(String(b.n!.n))}/${b.n!.d}`)
const conParentesis = (b: { n?: Fr; letra?: string }) => (b.n && (b.n.n < 0 || b.n.d !== 1) ? `(${textoBase(b)})` : textoBase(b))

/** La expresión escrita en una línea, con exponentes volados. */
export function escribirP(n: NodoP): string {
  switch (n.t) {
    case 'base':
      return conParentesis(n)
    case 'pow':
      return `${n.a.t === 'pow' ? `(${escribirP(n.a)})` : escribirP(n.a)}${sup(n.e)}`
    case 'mul':
      return n.fs.map(escribirP).join(' · ')
    case 'div':
      return n.barra ? `(${escribirP(n.a)}) / (${escribirP(n.b)})` : `${escribirP(n.a)} : ${escribirP(n.b)}`
    case 'grp':
      return `(${escribirP(n.a)})`
  }
}

/** Una potencia ya reducida: base (número, fracción o letra) y exponente. */
export interface Pot {
  b: { n?: Fr; letra?: string }
  e: number
}
export const escribirPot = (p: Pot) => `${conParentesis(p.b)}${sup(p.e)}`
/** Como se guarda la respuesta: «-2^15», «5/7^3», «a^4». */
export const clavePot = (p: Pot) => `${p.b.letra ?? (p.b.n!.d === 1 ? p.b.n!.n : `${p.b.n!.n}/${p.b.n!.d}`)}^${p.e}`
const mismaBase = (a: Pot['b'], b: Pot['b']) => (a.letra || b.letra ? a.letra === b.letra : a.n!.n * b.n!.d === b.n!.n * a.n!.d)

export interface ResultadoP {
  pot: Pot
  /** Lo que se escribe en el cuaderno, de dentro afuera. */
  pasos: { linea: string; porque: string }[]
}

/**
 * Reduce una expresión a una única potencia con las propiedades: misma base (se suman o restan los exponentes),
 * potencia de una potencia (se multiplican) y mismo exponente (se multiplican o dividen las bases).
 */
export function unicaPotencia(entrada: string | NodoP): ResultadoP {
  const nodo = typeof entrada === 'string' ? analizarP(entrada) : entrada
  const pasos: ResultadoP['pasos'] = []
  const ev = (n: NodoP): Pot => {
    switch (n.t) {
      case 'base':
        return { b: n, e: 1 }
      case 'grp':
        return ev(n.a)
      case 'pow': {
        const a = ev(n.a)
        if (n.a.t === 'base') return { b: a.b, e: n.e }
        const r = { b: a.b, e: a.e * n.e }
        pasos.push({ linea: `(${escribirPot(a)})${sup(n.e)} = ${conParentesis(a.b)}${sup(`${a.e}·${n.e < 0 ? `(${n.e})` : n.e}`)} = ${escribirPot(r)}`, porque: 'Potencia de una potencia: se deja la base y se multiplican los exponentes.' })
        return r
      }
      case 'mul': {
        const ps = n.fs.map(ev)
        if (ps.every((p) => mismaBase(p.b, ps[0].b))) {
          const e = ps.reduce((t, p) => t + p.e, 0)
          const r = { b: ps[0].b, e }
          pasos.push({
            linea: `${ps.map(escribirPot).join(' · ')} = ${conParentesis(r.b)}${sup(ps.map((p, k) => (k > 0 && p.e < 0 ? `(${p.e})` : p.e)).join('+'))} = ${escribirPot(r)}`,
            porque: 'Producto de potencias de la misma base: se deja la base y se suman los exponentes.',
          })
          return r
        }
        if (ps.every((p) => p.e === ps[0].e) && ps.every((p) => p.b.n)) {
          const b = ps.reduce((t, p) => fr(t.n * p.b.n!.n, t.d * p.b.n!.d), fr(1))
          const r = { b: { n: b }, e: ps[0].e }
          pasos.push({
            linea: `${ps.map(escribirPot).join(' · ')} = (${ps.map((p) => conParentesis(p.b)).join(' · ')})${sup(r.e)} = ${escribirPot(r)}`,
            porque: 'Producto de potencias con el mismo exponente: se multiplican las bases y se deja el exponente.',
          })
          return r
        }
        throw new Error('Esas potencias no tienen ni la misma base ni el mismo exponente: no se pueden juntar en una sola.')
      }
      case 'div': {
        const a = ev(n.a)
        const b = ev(n.b)
        if (mismaBase(a.b, b.b)) {
          const r = { b: a.b, e: a.e - b.e }
          pasos.push({
            linea: `${escribirPot(a)} : ${escribirPot(b)} = ${conParentesis(r.b)}${sup(`${a.e}-${b.e < 0 ? `(${b.e})` : b.e}`)} = ${escribirPot(r)}`,
            porque: 'Cociente de potencias de la misma base: se deja la base y se restan los exponentes (el de arriba menos el de abajo).',
          })
          return r
        }
        if (a.e === b.e && a.b.n && b.b.n) {
          const q = fr(a.b.n.n * b.b.n.d, a.b.n.d * b.b.n.n)
          const r = { b: { n: q }, e: a.e }
          pasos.push({ linea: `${escribirPot(a)} : ${escribirPot(b)} = (${conParentesis(a.b)} : ${conParentesis(b.b)})${sup(a.e)} = ${escribirPot(r)}`, porque: 'Cociente de potencias con el mismo exponente: se dividen las bases y se deja el exponente.' })
          return r
        }
        throw new Error('Esas potencias no tienen ni la misma base ni el mismo exponente: no se pueden juntar en una sola.')
      }
    }
  }
  return { pot: ev(nodo), pasos }
}

/** El valor de una potencia reducida (solo con base numérica). */
export const valorPot = (p: Pot) => potencia(fr(p.b.n!.n, p.b.n!.d), p.e)

/** Lee una respuesta «base^exponente». */
export function leerPot(s: string): Pot | null {
  const m = /^\s*\(?\s*([−-]?\d+(?:\/\d+)?|[a-z])\s*\)?\s*\^\s*\(?([−-]?\d+)\)?\s*$/.exec(s)
  if (!m) return null
  const e = Number(m[2].replace('−', '-'))
  if (/^[a-z]$/.test(m[1])) return { b: { letra: m[1] }, e }
  const [n, d = '1'] = m[1].replace('−', '-').split('/')
  if (Number(d) === 0) return null
  return { b: { n: { n: Number(n), d: Number(d) } }, e }
}

/**
 * Si una respuesta en potencia vale: mismo exponente y mismo valor (así (−24)⁶ y 24⁶ valen las dos). Con letras, la
 * misma letra. Con exponente 0 vale cualquier base (todo da 1).
 */
export function mismaPotencia(a: Pot, b: Pot): boolean {
  if (a.e !== b.e) return false
  if (a.e === 0) return true
  if (a.b.letra || b.b.letra) return a.b.letra === b.b.letra
  const x = valorPot(a)
  const y = valorPot(b)
  return x.n === y.n && x.d === y.d
}

// ===================================================================================================
// Factores primos de una expresión: «6^2·3^5·12^4» → 2^10 · 3^13
// ===================================================================================================

/** Los exponentes de cada primo del resultado (pueden salir negativos si hay división). */
export function primosDe(entrada: string | NodoP): Map<number, number> {
  const nodo = typeof entrada === 'string' ? analizarP(entrada) : entrada
  const suma = (a: Map<number, number>, b: Map<number, number>, k = 1) => {
    const r = new Map(a)
    for (const [p, e] of b) r.set(p, (r.get(p) ?? 0) + k * e)
    for (const [p, e] of r) if (e === 0) r.delete(p)
    return r
  }
  const ev = (n: NodoP): Map<number, number> => {
    switch (n.t) {
      case 'base': {
        if (!n.n) throw new Error('Con letras no hay factores primos.')
        const r = new Map<number, number>()
        for (const [p, e] of factorizar(Math.abs(n.n.n))) r.set(p, e)
        for (const [p, e] of factorizar(n.n.d)) r.set(p, (r.get(p) ?? 0) - e)
        return r
      }
      case 'grp':
        return ev(n.a)
      case 'pow':
        return new Map([...ev(n.a)].map(([p, e]) => [p, e * n.e]))
      case 'mul':
        return n.fs.map(ev).reduce((t, m) => suma(t, m), new Map())
      case 'div':
        return suma(ev(n.a), ev(n.b), -1)
    }
  }
  return new Map([...ev(nodo)].sort((a, b) => a[0] - b[0]))
}

export const escribirPrimos = (m: Map<number, number>) => [...m].map(([p, e]) => `${p}${e === 1 ? '' : sup(e)}`).join(' · ') || '1'

// ===================================================================================================
// Notación científica
// ===================================================================================================

export interface Cientifica {
  /** La mantisa: un número con una sola cifra (no nula) delante de la coma. */
  m: number
  e: number
}

/** Quita el ruido de los decimales del ordenador: 2.1799999999 → 2.18. */
export const limpio = (x: number, cifras = 12) => Number(x.toPrecision(cifras))

/** Un número escrito («0,000005», «13 800 000», «4.800.000.000») a notación científica, sin perder cifras. */
export function aCientifica(entrada: string | number): Cientifica {
  if (typeof entrada === 'number') {
    if (entrada === 0) return { m: 0, e: 0 }
    const e = Math.floor(Math.log10(Math.abs(entrada)))
    let m = limpio(entrada / 10 ** e)
    // Por redondeo puede salir 10: 9,9999… → 1 · 10^(e+1).
    if (Math.abs(m) >= 10) return { m: limpio(m / 10), e: e + 1 }
    if (Math.abs(m) < 1) m = limpio(m * 10)
    return { m, e: Math.abs(entrada / 10 ** e) < 1 ? e - 1 : e }
  }
  let s = entrada.replace(/\s+/g, '').replace(/[−–]/g, '-')
  const neg = s.startsWith('-')
  s = s.replace('-', '')
  // En España el punto separa los miles y la coma es la decimal.
  if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.')
  else if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '')
  const [ent, dec = ''] = s.split('.')
  const cifras = (ent + dec).replace(/^0+/, '')
  if (!cifras) return { m: 0, e: 0 }
  const significativas = cifras.replace(/0+$/, '') || '0'
  const e = ent.replace(/^0+/, '').length > 0 ? ent.replace(/^0+/, '').length - 1 : -(dec.length - dec.replace(/^0+/, '').length + 1)
  const m = Number(`${significativas[0]}.${significativas.slice(1) || '0'}`)
  return { m: neg ? -m : m, e }
}

/** El valor de un número en notación científica. */
export const valorCientifica = (c: Cientifica) => limpio(c.m * 10 ** c.e)

/** «2,18 · 10⁻⁵». */
export const escribirCientifica = (c: Cientifica) => `${menos(String(c.m).replace('.', ','))} · 10${sup(c.e)}`

/** Un número con todas sus cifras, como en el libro: «13 800 000», «0,0000173». */
export function todasLasCifras(c: Cientifica): string {
  const neg = c.m < 0
  const [ent, dec = ''] = String(Math.abs(c.m)).split('.')
  const digitos = ent + dec
  // La coma va detrás de la cifra 1 + e.
  const pos = 1 + c.e
  let entero: string
  let decimales: string
  if (pos <= 0) {
    entero = '0'
    decimales = '0'.repeat(-pos) + digitos
  } else if (pos >= digitos.length) {
    entero = digitos + '0'.repeat(pos - digitos.length)
    decimales = ''
  } else {
    entero = digitos.slice(0, pos)
    decimales = digitos.slice(pos)
  }
  decimales = decimales.replace(/0+$/, '')
  const miles = entero.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return (neg ? '−' : '') + miles + (decimales ? `,${decimales}` : '')
}

export interface PasoCientifica {
  linea: string
  porque: string
}

/** Producto o cociente en notación científica: mantisas por un lado, potencias de 10 por otro, y se reajusta. */
export function operarCientifica(a: Cientifica, op: '·' | ':', b: Cientifica): { r: Cientifica; pasos: PasoCientifica[] } {
  const m = limpio(op === '·' ? a.m * b.m : a.m / b.m, 10)
  const e = op === '·' ? a.e + b.e : a.e - b.e
  const pasos: PasoCientifica[] = [
    {
      linea: `(${escribirCientifica(a)}) ${op} (${escribirCientifica(b)}) = (${menos(String(a.m).replace('.', ','))} ${op} ${menos(String(b.m).replace('.', ','))}) · 10${sup(`${a.e}${op === '·' ? '+' : '-'}${(op === '·' ? b.e : b.e) < 0 ? `(${b.e})` : b.e}`)}`,
      porque: op === '·' ? 'Se multiplican los números por un lado y las potencias de 10 por otro (sumando los exponentes).' : 'Se dividen los números por un lado y las potencias de 10 por otro (restando los exponentes).',
    },
    { linea: `= ${menos(String(m).replace('.', ','))} · 10${sup(e)}`, porque: 'Se hacen las dos cuentas.' },
  ]
  const r = aCientifica(m * 10 ** e)
  const exacto = { m: limpio(r.m, 10), e: r.e }
  if (exacto.e !== e) {
    pasos.push({
      linea: `= ${escribirCientifica(exacto)}`,
      porque: Math.abs(m) >= 10 ? 'Delante de la coma solo puede haber una cifra: se corre la coma a la izquierda y el exponente sube.' : 'Delante de la coma tiene que haber una cifra que no sea 0: se corre la coma a la derecha y el exponente baja.',
    })
  }
  return { r: exacto, pasos }
}

/** Suma o resta en notación científica: se igualan los exponentes al mayor, se opera y se reajusta. */
export function sumarCientifica(a: Cientifica, op: '+' | '−', b: Cientifica): { r: Cientifica; pasos: PasoCientifica[] } {
  const e = Math.max(a.e, b.e)
  const ma = limpio(a.m * 10 ** (a.e - e))
  const mb = limpio(b.m * 10 ** (b.e - e))
  const m = limpio(op === '+' ? ma + mb : ma - mb)
  const c = (x: number) => menos(String(x).replace('.', ','))
  const pasos: PasoCientifica[] = []
  if (a.e !== b.e)
    pasos.push({
      linea: `${escribirCientifica(a)} ${op} ${escribirCientifica(b)} = ${c(ma)} · 10${sup(e)} ${op} ${c(mb)} · 10${sup(e)}`,
      porque: `Para sumar o restar hace falta la misma potencia de 10: se pasa la pequeña a 10${sup(e)} corriendo la coma.`,
    })
  pasos.push({ linea: `= (${c(ma)} ${op} ${c(mb)}) · 10${sup(e)} = ${c(m)} · 10${sup(e)}`, porque: 'Con la misma potencia de 10, se suman o restan los números y la potencia se queda igual.' })
  const r = aCientifica(m * 10 ** e)
  if (r.e !== e || r.m !== m) pasos.push({ linea: `= ${escribirCientifica(r)}`, porque: 'Se reajusta para que delante de la coma quede una sola cifra que no sea 0.' })
  return { r, pasos }
}

// ===================================================================================================
// Raíces cuadradas
// ===================================================================================================

/** Raíz entera y resto: el mayor número cuyo cuadrado no pasa del número, y lo que sobra. */
export function raizEntera(n: number): { r: number; resto: number } {
  if (n < 0) throw new Error('Un número negativo no tiene raíz cuadrada.')
  let r = Math.floor(Math.sqrt(n))
  while (r * r > n) r--
  while ((r + 1) * (r + 1) <= n) r++
  return { r, resto: n - r * r }
}

export const esCuadrado = (n: number) => n >= 0 && raizEntera(n).resto === 0

/** La última cifra del cuadrado de un número que acaba en c. */
export const ultimaCifraCuadrado = (c: number) => (c * c) % 10

/** Lo que falta para el cuadrado siguiente: con 77 baldosas, el siguiente es 9² = 81 y faltan 4. */
export function cuadradoSiguiente(n: number): { lado: number; faltan: number } {
  const { r, resto } = raizEntera(n)
  if (resto === 0) return { lado: r, faltan: 0 }
  return { lado: r + 1, faltan: (r + 1) ** 2 - n }
}
