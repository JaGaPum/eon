// Electricidad de Tecnología de 2.º de ESO: carga e intensidad (I = Q / t), ley de Ohm (V = I · R), resistencia de
// un hilo (R = ρ · L / s) y asociaciones de resistencias en serie, en paralelo y mixtas. Todo lo que sale en los
// problemas se calcula aquí, también los pasos que se enseñan al resolverlos.

export const ELECTRONES_POR_CULOMBIO = 6.24e18
/** Resistividad del cobre en Ω·m (ejercicio 4). */
export const RHO_COBRE = 1.68e-8

/** Quita el ruido de coma flotante. */
export const limpia = (n: number) => (n === 0 ? 0 : Number(n.toPrecision(12)))

/**
 * Un número para leerlo: con coma, hasta dos decimales y, si es muy pequeño, con tres cifras significativas
 * (0,0107). Los números enormes o diminutos, en potencias de 10 (6,24 · 10¹⁸).
 */
export function num(n: number): string {
  const a = Math.abs(n)
  if (a !== 0 && (a >= 1e7 || a < 1e-4)) {
    const e = Math.floor(Math.log10(a))
    const m = limpia(n / 10 ** e)
    return `${num(Math.round(m * 1000) / 1000)} · 10${superindice(e)}`
  }
  const r = a !== 0 && a < 0.1 ? Number(n.toPrecision(3)) : Math.round(n * 100) / 100
  return String(r).replace('.', ',')
}
const SUP: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' }
const superindice = (e: number) => [...String(e)].map((c) => SUP[c]).join('')

// ——— Carga e intensidad ———

export const intensidad = (Q: number, t: number) => limpia(Q / t)
export const carga = (I: number, t: number) => limpia(I * t)
export const cargaDeElectrones = (n: number) => limpia(n / ELECTRONES_POR_CULOMBIO)

// ——— Ley de Ohm ———

export type Magnitud = 'V' | 'I' | 'R'
export const UNIDAD: Record<Magnitud, string> = { V: 'V', I: 'A', R: 'Ω' }
export const NOMBRE: Record<Magnitud, string> = { V: 'tensión (voltaje)', I: 'intensidad', R: 'resistencia' }
export const FORMULA: Record<Magnitud, string> = { I: 'I = V / R', V: 'V = I · R', R: 'R = V / I' }

/** Lo que se busca con la ley de Ohm, a partir de las otras dos magnitudes. */
export function ohm(busca: Magnitud, d: Partial<Record<Magnitud, number>>): number {
  const { V, I, R } = d
  if (busca === 'I') return limpia(V! / R!)
  if (busca === 'V') return limpia(I! * R!)
  return limpia(V! / I!)
}

/** La sustitución escrita: «I = 30 V / 10 Ω = 3 A». */
export function sustitucionOhm(busca: Magnitud, d: Partial<Record<Magnitud, number>>): string {
  const v = (m: Magnitud) => `${num(d[m]!)} ${UNIDAD[m]}`
  const r = `${num(ohm(busca, d))} ${UNIDAD[busca]}`
  if (busca === 'I') return `I = ${v('V')} / ${v('R')} = ${r}`
  if (busca === 'V') return `V = ${v('I')} · ${v('R')} = ${r}`
  return `R = ${v('V')} / ${v('I')} = ${r}`
}

// ——— Resistencia de un hilo ———

/** Sección de un hilo redondo, en m², a partir del diámetro en mm. */
export const seccion = (diametroMm: number) => limpia(Math.PI * (diametroMm / 1000 / 2) ** 2)
/** R = ρ · L / s, con ρ en Ω·m, L en m y el diámetro en mm. */
export const resistenciaHilo = (rho: number, L: number, diametroMm: number) => limpia((rho * L) / seccion(diametroMm))

// ——— Asociación de resistencias ———

/** Un circuito: una resistencia (o lámpara) suelta, o un grupo en serie o en paralelo. */
export type Circuito = Elemento | { serie: Circuito[] } | { paralelo: Circuito[] }
export interface Elemento {
  nombre: string
  r: number
  /** Cómo se dibuja; por defecto, una resistencia. */
  tipo?: 'resistencia' | 'lampara'
  /** Es la equivalente de un grupo ya simplificado. */
  equivalente?: boolean
}

export const esElemento = (c: Circuito): c is Elemento => 'r' in c
export const hijos = (c: Circuito): Circuito[] => (esElemento(c) ? [] : 'serie' in c ? c.serie : c.paralelo)

/** Resistencia equivalente: en serie se suman; en paralelo se suman los inversos. */
export function req(c: Circuito): number {
  if (esElemento(c)) return c.r
  if ('serie' in c) return limpia(c.serie.reduce((s, x) => s + req(x), 0))
  return limpia(1 / c.paralelo.reduce((s, x) => s + 1 / req(x), 0))
}

export interface Paso {
  /** El circuito antes de este paso; `grupo` es la parte que se simplifica. */
  antes: Circuito
  grupo: Circuito
  tipo: 'serie' | 'paralelo'
  /** La cuenta escrita: «R₂ y R₃ en paralelo: 1/Rₐ = 1/4 + 1/12 → Rₐ = 3 Ω». */
  cuenta: string
  nueva: Elemento
  despues: Circuito
}

const LETRAS = ['a', 'b', 'c', 'd', 'e', 'f', 'g']

/** El primer grupo (de dentro afuera) que solo tiene elementos sueltos: es el que se simplifica antes. */
function grupoSimple(c: Circuito): Circuito | null {
  if (esElemento(c)) return null
  for (const h of hijos(c)) {
    const g = grupoSimple(h)
    if (g) return g
  }
  return c
}

const sustituye = (c: Circuito, viejo: Circuito, nuevo: Circuito): Circuito =>
  c === viejo ? nuevo : esElemento(c) ? c : 'serie' in c ? { serie: c.serie.map((x) => sustituye(x, viejo, nuevo)) } : { paralelo: c.paralelo.map((x) => sustituye(x, viejo, nuevo)) }

/** La cuenta de un grupo, con los valores de sus resistencias. */
export function cuentaGrupo(g: Circuito, nombre: string): string {
  const hs = hijos(g) as Elemento[]
  const nombres = hs.map((h) => h.nombre)
  const lista = nombres.length === 2 ? `${nombres[0]} y ${nombres[1]}` : `${nombres.slice(0, -1).join(', ')} y ${nombres[nombres.length - 1]}`
  const valor = `${num(req(g))} Ω`
  if ('serie' in g) return `${lista} en serie: ${nombre} = ${hs.map((h) => num(h.r)).join(' + ')} = ${valor}`
  return `${lista} en paralelo: 1/${nombre} = ${hs.map((h) => `1/${num(h.r)}`).join(' + ')} → ${nombre} = ${valor}`
}

/** Simplifica el circuito paso a paso hasta que queda una sola resistencia, la equivalente. */
export function simplificar(c: Circuito): Paso[] {
  const pasos: Paso[] = []
  let actual = c
  for (let i = 0; !esElemento(actual); i++) {
    const grupo = grupoSimple(actual)!
    const ultimo = grupo === actual
    const nombre = ultimo ? 'Req' : `R${LETRAS[i]}`
    const nueva: Elemento = { nombre, r: req(grupo), equivalente: true }
    const despues = sustituye(actual, grupo, nueva)
    pasos.push({ antes: actual, grupo, tipo: 'serie' in grupo ? 'serie' : 'paralelo', cuenta: cuentaGrupo(grupo, nombre), nueva, despues })
    actual = despues
  }
  return pasos
}

export interface Reparto {
  nombre: string
  r: number
  I: number
  V: number
}

/**
 * Intensidad y tensión en cada resistencia con un generador de tensión V. En serie, la intensidad es la misma y la
 * tensión se reparte; en paralelo, la tensión es la misma y la intensidad se reparte.
 */
export function repartir(c: Circuito, V: number): Reparto[] {
  const I = limpia(V / req(c))
  if (esElemento(c)) return [{ nombre: c.nombre, r: c.r, I, V: limpia(V) }]
  if ('serie' in c) return c.serie.flatMap((x) => repartir(x, I * req(x)))
  return c.paralelo.flatMap((x) => repartir(x, V))
}

/** Todos los elementos del circuito, en orden. */
export const elementos = (c: Circuito): Elemento[] => (esElemento(c) ? [c] : hijos(c).flatMap(elementos))

// ——— Generadores ———

/** Pilas iguales: en serie se suman sus tensiones; en paralelo, la tensión es la de una sola. */
export const pilas = (n: number, V: number, como: 'serie' | 'paralelo') => limpia(como === 'serie' ? n * V : V)
