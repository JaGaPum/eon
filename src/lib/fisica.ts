// Física y Química de 2.º de ESO: cambio de unidades por factores de conversión, densidad, ley de Boyle-Mariotte y
// cambios de estado. Todo lo que sale en los ejercicios se calcula aquí.

// ——— Unidades ———

type Magnitud = 'longitud' | 'masa' | 'tiempo' | 'superficie' | 'volumen'
interface Unidad {
  /** Cómo se escribe en pantalla: «km», «m²», «cm³», «L». */
  s: string
  magnitud: Magnitud
  /** Cuántas unidades del SI (m, kg, s, m², m³) vale una. */
  si: number
}

const U: Unidad[] = [
  ...(['km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm'] as const).map((s, i) => ({ s, magnitud: 'longitud' as const, si: 10 ** (3 - i) })),
  ...(['kg', 'hg', 'dag', 'g', 'dg', 'cg', 'mg'] as const).map((s, i) => ({ s, magnitud: 'masa' as const, si: 10 ** -i })),
  { s: 's', magnitud: 'tiempo', si: 1 },
  { s: 'min', magnitud: 'tiempo', si: 60 },
  { s: 'h', magnitud: 'tiempo', si: 3600 },
  ...(['km²', 'hm²', 'dam²', 'm²', 'dm²', 'cm²', 'mm²'] as const).map((s, i) => ({ s, magnitud: 'superficie' as const, si: 10 ** (6 - 2 * i) })),
  ...(['km³', 'hm³', 'dam³', 'm³', 'dm³', 'cm³', 'mm³'] as const).map((s, i) => ({ s, magnitud: 'volumen' as const, si: 10 ** (9 - 3 * i) })),
  ...(['kL', 'hL', 'daL', 'L', 'dL', 'cL', 'mL'] as const).map((s, i) => ({ s, magnitud: 'volumen' as const, si: 10 ** -i })),
]
const unidad = (s: string) => {
  const u = U.find((x) => x.s === s)
  if (!u) throw new Error(`Unidad desconocida: ${s}`)
  return u
}

/** Una unidad simple («km») o compuesta («km/h», «g/cm³»). */
const partes = (s: string): [Unidad, Unidad | null] => {
  const [a, b] = s.split('/')
  return [unidad(a), b ? unidad(b) : null]
}
const valorSI = (s: string) => {
  const [a, b] = partes(s)
  return a.si / (b ? b.si : 1)
}

/** Pasa una cantidad de una unidad a otra de la misma magnitud. */
export function convertir(valor: number, de: string, a: string): number {
  const [da, db] = partes(de)
  const [aa, ab] = partes(a)
  if (da.magnitud !== aa.magnitud || (db?.magnitud ?? null) !== (ab?.magnitud ?? null)) throw new Error(`${de} y ${a} no miden lo mismo`)
  return redondea((valor * valorSI(de)) / valorSI(a))
}

/** Quita el ruido de coma flotante (0,1 + 0,2): 12 cifras significativas. */
export const redondea = (n: number) => (n === 0 ? 0 : Number(n.toPrecision(12)))

/** Un número como en el libro: coma decimal y espacio cada tres cifras (1 000 000). */
export function escribe(n: number, dec = 4): string {
  const [ent, frac = ''] = Math.abs(n).toFixed(dec).split('.')
  const f = frac.replace(/0+$/, '')
  const r = ent.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (f ? ',' + f : '')
  return (n < 0 && Number(r.replace(/[ ,]/g, '')) !== 0 ? '−' : '') + r
}

export interface Factor {
  /** Arriba y abajo del factor: [cantidad, unidad]. */
  arriba: [number, string]
  abajo: [number, string]
}

/** El factor que cambia la unidad `de` por `a` (en el numerador si `arriba`, en el denominador si no). */
function factor(de: Unidad, a: Unidad, enNumerador: boolean): Factor {
  // Se escribe con un 1 en la unidad más grande: 1 km = 1000 m, 1 h = 3600 s.
  const grande = de.si >= a.si ? de : a
  const peque = grande === de ? a : de
  const n = redondea(grande.si / peque.si)
  const g: [number, string] = [1, grande.s]
  const p: [number, string] = [n, peque.s]
  // La unidad de partida tiene que quedar en el lado contrario para tacharse.
  const deArriba = grande === de ? g : p
  const aArriba = grande === a ? g : p
  return enNumerador ? { arriba: aArriba, abajo: deArriba } : { arriba: deArriba, abajo: aArriba }
}

/** Los factores de conversión, uno por cada unidad que cambia, como en el cuaderno. */
export function factores(de: string, a: string): Factor[] {
  const [da, db] = partes(de)
  const [aa, ab] = partes(a)
  const r: Factor[] = []
  if (da.s !== aa.s) r.push(factor(da, aa, true))
  if (db && ab && db.s !== ab.s) r.push(factor(db, ab, false))
  return r
}

/** «82 km/h · (1000 m / 1 km) · (1 h / 3600 s) = 22,78 m/s» en texto. */
export function cadena(valor: number, de: string, a: string): string {
  const fs = factores(de, a).map((f) => `(${escribe(f.arriba[0])} ${f.arriba[1]} / ${escribe(f.abajo[0])} ${f.abajo[1]})`)
  return `${escribe(valor)} ${de} · ${fs.join(' · ')} = ${escribe(convertir(valor, de, a))} ${a}`
}

// ——— Densidad ———

/** d = m / V, en g/cm³ si m va en g y V en cm³ (o mL). */
export const densidad = (m: number, V: number) => redondea(m / V)
export const masa = (d: number, V: number) => redondea(d * V)
export const volumen = (m: number, d: number) => redondea(m / d)

// ——— Ley de Boyle-Mariotte ———

/** A temperatura constante, p₁·V₁ = p₂·V₂. Se pasa la que falta como null. */
export function boyle(p1: number, V1: number, p2: number | null, V2: number | null): number {
  if (p2 === null && V2 !== null) return redondea((p1 * V1) / V2)
  if (V2 === null && p2 !== null) return redondea((p1 * V1) / p2)
  throw new Error('Falta una sola magnitud')
}

export const kelvin = (c: number) => c + 273

// ——— Cambios de estado ———

export type Estado = 'sólido' | 'líquido' | 'gas'
export const CAMBIOS = [
  { id: 'fusion', nombre: 'fusión', de: 'sólido', a: 'líquido', progresivo: true },
  { id: 'solidificacion', nombre: 'solidificación', de: 'líquido', a: 'sólido', progresivo: false },
  { id: 'vaporizacion', nombre: 'vaporización', de: 'líquido', a: 'gas', progresivo: true },
  { id: 'condensacion', nombre: 'condensación', de: 'gas', a: 'líquido', progresivo: false },
  { id: 'sublimacion', nombre: 'sublimación', de: 'sólido', a: 'gas', progresivo: true },
  { id: 'inversa', nombre: 'sublimación inversa', de: 'gas', a: 'sólido', progresivo: false },
] as const
export const cambioEntre = (de: Estado, a: Estado) => CAMBIOS.find((c) => c.de === de && c.a === a)!

/** Temperaturas de fusión y ebullición a 1 atm (tablas de las páginas 40 y 41 del libro). */
export const SUSTANCIAS = [
  { nombre: 'oxígeno', fusion: -219, ebullicion: -183 },
  { nombre: 'alcohol', fusion: -114, ebullicion: 78 },
  { nombre: 'mercurio', fusion: -39, ebullicion: 357 },
  { nombre: 'agua', fusion: 0, ebullicion: 100 },
  { nombre: 'hierro', fusion: 1538, ebullicion: 2861 },
  { nombre: 'diamante', fusion: 3823, ebullicion: 4827 },
  { nombre: 'aluminio', fusion: 660, ebullicion: 2519 },
  { nombre: 'oro', fusion: 1064, ebullicion: 2856 },
] as const
export type Sustancia = (typeof SUSTANCIAS)[number]
export const sustancia = (nombre: string) => SUSTANCIAS.find((s) => s.nombre === nombre)!

/** Estado a una temperatura; justo en el punto de fusión o ebullición, está cambiando de estado. */
export function estadoA(s: Sustancia, T: number): string {
  if (T < s.fusion) return 'sólido'
  if (T === s.fusion) return 'sólido y líquido (fundiéndose)'
  if (T < s.ebullicion) return 'líquido'
  if (T === s.ebullicion) return 'líquido y gas (hirviendo)'
  return 'gas'
}

/** Las sustancias de la tabla que cumplen una condición de estado a una temperatura. */
export const queSustancias = (estado: Estado, T: number) => SUSTANCIAS.filter((s) => estadoA(s, T) === estado).map((s) => s.nombre)

export interface Punto {
  t: number
  T: number
}

/**
 * Los tramos horizontales de una gráfica o tabla de temperatura frente al tiempo: ahí hay un cambio de estado y su
 * temperatura es el punto de fusión o de ebullición.
 */
export function mesetas(puntos: Punto[]): number[] {
  const r: number[] = []
  for (let i = 1; i < puntos.length; i++) if (puntos[i].T === puntos[i - 1].T && !r.includes(puntos[i].T)) r.push(puntos[i].T)
  return r
}

/** La sustancia de la tabla con ese punto de fusión o de ebullición. */
export const quienFundeA = (T: number) => SUSTANCIAS.find((s) => s.fusion === T)?.nombre
export const quienHierveA = (T: number) => SUSTANCIAS.find((s) => s.ebullicion === T)?.nombre

/** Curva de calentamiento de una sustancia entre dos temperaturas, con una meseta de `pausa` minutos en cada cambio. */
export function calentamiento(s: Sustancia, desde: number, hasta: number, ritmo = 10, pausa = 3): Punto[] {
  const p: Punto[] = [{ t: 0, T: desde }]
  let t = 0
  let T = desde
  for (const c of [s.fusion, s.ebullicion]) {
    if (c <= T || c >= hasta) continue
    t += (c - T) / ritmo
    p.push({ t: redondea(t), T: c })
    t += pausa
    p.push({ t: redondea(t), T: c })
    T = c
  }
  t += (hasta - T) / ritmo
  p.push({ t: redondea(t), T: hasta })
  return p
}

/** Qué hay en cada tramo de una curva de calentamiento: «sólido», «sólido + líquido», «líquido»… */
export function tramos(s: Sustancia, puntos: Punto[]): string[] {
  const r: string[] = []
  for (let i = 1; i < puntos.length; i++) {
    const a = puntos[i - 1]
    const b = puntos[i]
    if (a.T === b.T) r.push(a.T === s.fusion ? 'sólido + líquido' : 'líquido + gas')
    else r.push(estadoA(s, (a.T + b.T) / 2))
  }
  return r
}
