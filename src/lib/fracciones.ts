// Tema 2: fracciones, decimales y aproximaciones. Todo con enteros para no arrastrar errores de redondeo.

/** Una fracción irreducible con el signo en el numerador y el denominador positivo. */
export interface Fr {
  n: number
  d: number
}

export const mcdDe = (a: number, b: number): number => {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) [a, b] = [b, a % b]
  return a || 1
}
export const mcmDe = (a: number, b: number) => Math.abs(a * b) / mcdDe(a, b)
export const mcmLista = (xs: number[]) => xs.reduce((m, x) => mcmDe(m, x), 1)

/** Construye la fracción ya simplificada. */
export function fr(n: number, d = 1): Fr {
  if (d === 0) throw new Error('El denominador no puede ser 0.')
  if (d < 0) [n, d] = [-n, -d]
  const k = mcdDe(n, d)
  return { n: n / k || 0, d: d / k }
}

export const suma = (a: Fr, b: Fr) => fr(a.n * b.d + b.n * a.d, a.d * b.d)
export const resta = (a: Fr, b: Fr) => fr(a.n * b.d - b.n * a.d, a.d * b.d)
export const mul = (a: Fr, b: Fr) => fr(a.n * b.n, a.d * b.d)
export function div(a: Fr, b: Fr) {
  if (b.n === 0) throw new Error('No se puede dividir entre 0.')
  return fr(a.n * b.d, a.d * b.n)
}
export const pot = (a: Fr, e: number) => fr(a.n ** e, a.d ** e)
export const inversa = (a: Fr) => fr(a.d, a.n)
export const igual = (a: Fr, b: Fr) => a.n === b.n && a.d === b.d
export const comparar = (a: Fr, b: Fr) => a.n * b.d - b.n * a.d
export const valorDe = (a: Fr) => a.n / a.d
export const esEntera = (a: Fr) => a.d === 1

/** «3/4», «−3/4» escrito con guion normal («-3/4») o «5»: la forma en que viajan las respuestas. */
export const texto = (a: Fr) => (a.d === 1 ? String(a.n) : `${a.n}/${a.d}`)

/** Lee «3/4», «-3/4», «−3/4» o «5». Sin simplificar: devuelve numerador y denominador tal cual. */
export function leer(s: string): { n: number; d: number } | null {
  const m = /^\s*([-−]?)\s*(\d+)\s*(?:\/\s*([-−]?\d+))?\s*$/.exec(s)
  if (!m) return null
  const n = Number(m[2]) * (m[1] ? -1 : 1)
  const d = m[3] ? Number(m[3].replace('−', '-')) : 1
  if (d === 0) return null
  return d < 0 ? { n: -n, d: -d } : { n, d }
}

/** Número mixto de una fracción impropia positiva: 9/2 = 4 y 1/2. */
export function mixto(a: Fr): { ent: number; n: number; d: number } {
  return { ent: Math.floor(a.n / a.d), n: a.n % a.d, d: a.d }
}

// ---------- Expresión decimal ----------

export interface Expansion {
  signo: '' | '-'
  ent: number
  /** Cifras decimales que no se repiten (anteperíodo). */
  ante: string
  /** Cifras que se repiten (período); vacío si es exacto. */
  per: string
  /** La división, cifra a cifra: el resto antes de cada cifra decimal y la cifra que sale. */
  pasos: { resto: number; cifra: number }[]
}

/** Divide n entre d y encuentra el período al ver repetirse un resto. */
export function expansion(n: number, d: number): Expansion {
  const signo = n * d < 0 ? '-' : ''
  n = Math.abs(n)
  d = Math.abs(d)
  const ent = Math.floor(n / d)
  let resto = n % d
  const visto = new Map<number, number>()
  const pasos: Expansion['pasos'] = []
  while (resto !== 0 && !visto.has(resto)) {
    visto.set(resto, pasos.length)
    const cifra = Math.floor((resto * 10) / d)
    pasos.push({ resto, cifra })
    resto = (resto * 10) % d
  }
  const cifras = pasos.map((p) => p.cifra).join('')
  if (resto === 0) return { signo, ent, ante: cifras, per: '', pasos }
  const k = visto.get(resto)!
  return { signo, ent, ante: cifras.slice(0, k), per: cifras.slice(k), pasos }
}

export type TipoDecimal = 'entero' | 'exacto' | 'puro' | 'mixto'
export function tipoDe(e: Expansion): TipoDecimal {
  if (e.per) return e.ante ? 'mixto' : 'puro'
  return e.ante ? 'exacto' : 'entero'
}
export const NOMBRE_TIPO: Record<TipoDecimal, string> = {
  entero: 'Entero',
  exacto: 'Decimal exacto',
  puro: 'Periódico puro',
  mixto: 'Periódico mixto',
}

/** Escrito para leer y para las respuestas: «1,25», «0,(6)» o «1,08(3)». TextoMat pone el arco. */
export const escribirDecimal = (e: { signo?: string; ent: number | string; ante: string; per: string }) =>
  `${e.signo === '-' ? '−' : ''}${e.ent}${e.ante || e.per ? ',' : ''}${e.ante}${e.per ? `(${e.per})` : ''}`

/**
 * Fracción generatriz con la regla del libro: numerador, el número sin la coma menos la parte no periódica sin
 * la coma; denominador, tantos nueves como cifras del período y tantos ceros como cifras del anteperíodo.
 */
export function generatriz(ent: number, ante: string, per: string) {
  const sinComa = Number(`${ent}${ante}${per}`)
  const noPer = per ? Number(`${ent}${ante}`) : 0
  const den = per ? Number('9'.repeat(per.length) + '0'.repeat(ante.length)) : 10 ** ante.length
  return { sinComa, noPer, num: sinComa - noPer, den, f: fr(sinComa - noPer, den) }
}

// ---------- Aproximaciones ----------

/** Un decimal exacto escrito con coma o punto, como fracción: «2,25» = 9/4. */
export function decimalAFr(s: string): Fr {
  const m = /^\s*([-−]?)(\d*)(?:[.,](\d*))?\s*$/.exec(s)
  if (!m || (!m[2] && !m[3])) throw new Error(`«${s}» no es un número decimal.`)
  const dec = m[3] ?? ''
  return fr(Number(`${m[2] || '0'}${dec}`) * (m[1] ? -1 : 1), 10 ** dec.length)
}

/** Lee un número escrito por el alumno: con coma o punto, y quizá con un % al final. */
export function leerDecimal(s: string): number | null {
  const limpio = s.replace(/[−–]/g, '-').replace(/\s+/g, '').replace(/%$/, '').replace(',', '.')
  return /^-?(\d+\.?\d*|\.\d+)$/.test(limpio) ? Number(limpio) : null
}

const ORDEN = ['unidades', 'décimas', 'centésimas', 'milésimas', 'diezmilésimas']
export const nombreOrden = (cifras: number) => ORDEN[cifras] ?? `${cifras} cifras decimales`

/** Corta un decimal positivo (escrito como texto) en la cifra pedida. */
export function truncar(s: string, cifras: number): string {
  const [e, d = ''] = s.replace('.', ',').split(',')
  return cifras ? `${e},${(d + '0'.repeat(cifras)).slice(0, cifras)}` : e
}

/** Redondea un decimal positivo: si la primera cifra que se quita es 5 o más, se suma uno a la última. */
export function redondear(s: string, cifras: number): { r: string; decide: number; exceso: boolean } {
  const [e, d = ''] = s.replace('.', ',').split(',')
  const decide = Number((d + '0'.repeat(cifras + 1))[cifras])
  const base = BigInt(e + (d + '0'.repeat(cifras)).slice(0, cifras)) + (decide >= 5 ? 1n : 0n)
  const t = base.toString().padStart(cifras + 1, '0')
  const r = cifras ? `${t.slice(0, -cifras)},${t.slice(-cifras)}` : t
  return { r, decide, exceso: decide >= 5 && comparar(decimalAFr(r), decimalAFr(s)) > 0 }
}

/** Errores de una aproximación, en fracción para no perder exactitud. El relativo, en tanto por uno. */
export function errores(exacto: Fr, aprox: Fr) {
  const eabs = fr(Math.abs(resta(exacto, aprox).n), resta(exacto, aprox).d)
  return { eabs, erel: div(eabs, fr(Math.abs(exacto.n), exacto.d)) }
}

/** Un número con coma y las cifras justas: 0,05 y no 0,05000000001. */
export function conComa(x: number, maxCifras = 4): string {
  const s = Number(x.toFixed(maxCifras)).toString()
  return s.replace('.', ',').replace('-', '−')
}
