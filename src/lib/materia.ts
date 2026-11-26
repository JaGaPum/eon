// Física y Química de 2.º de ESO, tema 3: cómo se presenta la materia, disoluciones, átomos y tabla periódica.
// Lo que se puede calcular (fórmulas, sustancia simple o compuesto, grupo y periodo, disolvente) se calcula aquí.

// ——— Tabla periódica ———

export interface Elemento {
  z: number
  simbolo: string
  nombre: string
}

/** Los elementos que salen en los ejercicios, con el nombre del libro. */
export const ELEMENTOS: Elemento[] = (
  [
    [1, 'H', 'hidrógeno'], [2, 'He', 'helio'], [3, 'Li', 'litio'], [4, 'Be', 'berilio'], [5, 'B', 'boro'], [6, 'C', 'carbono'], [7, 'N', 'nitrógeno'],
    [8, 'O', 'oxígeno'], [9, 'F', 'flúor'], [10, 'Ne', 'neón'], [11, 'Na', 'sodio'], [12, 'Mg', 'magnesio'], [13, 'Al', 'aluminio'], [14, 'Si', 'silicio'],
    [15, 'P', 'fósforo'], [16, 'S', 'azufre'], [17, 'Cl', 'cloro'], [18, 'Ar', 'argón'], [19, 'K', 'potasio'], [20, 'Ca', 'calcio'], [22, 'Ti', 'titanio'],
    [24, 'Cr', 'cromo'], [25, 'Mn', 'manganeso'], [26, 'Fe', 'hierro'], [27, 'Co', 'cobalto'], [28, 'Ni', 'níquel'], [29, 'Cu', 'cobre'], [30, 'Zn', 'cinc'],
    [35, 'Br', 'bromo'], [36, 'Kr', 'kriptón'], [46, 'Pd', 'paladio'], [47, 'Ag', 'plata'], [50, 'Sn', 'estaño'], [53, 'I', 'yodo'], [54, 'Xe', 'xenón'],
    [74, 'W', 'wolframio'], [78, 'Pt', 'platino'], [79, 'Au', 'oro'], [80, 'Hg', 'mercurio'], [82, 'Pb', 'plomo'], [86, 'Rn', 'radón'], [92, 'U', 'uranio'],
  ] as [number, string, string][]
).map(([z, simbolo, nombre]) => ({ z, simbolo, nombre }))

export const elemento = (s: string) => {
  const e = ELEMENTOS.find((x) => x.simbolo === s || x.nombre === s)
  if (!e) throw new Error(`Elemento desconocido: ${s}`)
  return e
}

/** Último número atómico de cada periodo (los gases nobles). */
const FIN_PERIODO = [2, 10, 18, 36, 54, 86, 118]

/** Periodo (fila) y grupo (columna) a partir del número atómico. Lantánidos y actínidos no tienen grupo (null). */
export function posicion(z: number): { periodo: number; grupo: number | null } {
  const periodo = FIN_PERIODO.findIndex((f) => z <= f) + 1
  if (periodo === 1) return { periodo, grupo: z === 1 ? 1 : 18 }
  const k = z - FIN_PERIODO[periodo - 2] - 1 // posición dentro de la fila, desde 0
  if (periodo <= 3) return { periodo, grupo: k < 2 ? k + 1 : k + 11 }
  if (periodo <= 5) return { periodo, grupo: k + 1 }
  // Periodos 6 y 7: tras el grupo 2 vienen los 15 lantánidos o actínidos (del 57 al 71 y del 89 al 103).
  if (k < 2) return { periodo, grupo: k + 1 }
  if (k < 17) return { periodo, grupo: null }
  return { periodo, grupo: k - 13 }
}

export const esGasNoble = (z: number) => posicion(z).grupo === 18

/** El símbolo bien escrito: primera letra en mayúscula y, si hay segunda, en minúscula. */
export const simboloBienEscrito = (s: string) => /^[A-Z][a-z]?$/.test(s)

/** Formas mal escritas de un símbolo (para las opciones falsas): «CU», «cu», «cU»… */
export function simbolosMal(s: string): string[] {
  const otras = s.length === 2 ? [s.toUpperCase(), s.toLowerCase(), s[0].toLowerCase() + s[1].toUpperCase()] : [s.toLowerCase()]
  return [...new Set(otras)].filter((x) => x !== s)
}

// ——— Fórmulas ———

/** Los átomos de una fórmula: «C2H6O» → { C: 2, H: 6, O: 1 }. */
export function atomos(formula: string): Record<string, number> {
  const r: Record<string, number> = {}
  let leido = ''
  for (const m of formula.matchAll(/([A-Z][a-z]?)(\d*)/g)) {
    elemento(m[1])
    r[m[1]] = (r[m[1]] ?? 0) + (m[2] ? Number(m[2]) : 1)
    leido += m[0]
  }
  if (leido !== formula) throw new Error(`Fórmula mal escrita: ${formula}`)
  return r
}

export const totalAtomos = (formula: string) => Object.values(atomos(formula)).reduce((a, b) => a + b, 0)

/** Sustancia simple si todos sus átomos son del mismo elemento; compuesto si hay de dos o más. */
export const clase = (formula: string): 'sustancia simple' | 'compuesto' => (Object.keys(atomos(formula)).length === 1 ? 'sustancia simple' : 'compuesto')

/** «H2O» → «H₂O». */
export const conSubindices = (formula: string) => formula.replace(/\d/g, (d) => '₀₁₂₃₄₅₆₇₈₉'[Number(d)])

export type Agrupacion = 'átomos aislados' | 'moléculas' | 'cristal'

/** Lo que se ve en un dibujo de partículas: cómo se agrupan y qué sustancias hay. */
export interface Representacion {
  agrupacion: Agrupacion
  formulas: string[]
}

/** «Sustancia simple molecular (O₂)», «Compuesto que forma un cristal (NaCl)», «Mezcla de O₂ y NCl₃». */
export function describe(r: Representacion): string {
  if (r.formulas.length > 1) return `Mezcla de ${r.formulas.map(conSubindices).join(' y ')}`
  const f = r.formulas[0]
  const quien = clase(f) === 'compuesto' ? 'Compuesto' : 'Sustancia simple'
  const como = r.agrupacion === 'cristal' ? 'que forma un cristal' : r.agrupacion === 'moléculas' ? 'molecular' : 'de átomos aislados'
  return `${quien} ${como} (${conSubindices(f)})`
}

// ——— Disoluciones ———

export type EstadoFisico = 'sólido' | 'líquido' | 'gas'

export interface Componente {
  nombre: string
  estado: EstadoFisico
  /** Porcentaje en la mezcla. */
  porcentaje: number
}

/** El disolvente es el componente en mayor proporción; los demás son solutos. */
export function papeles(cs: Componente[]): { disolvente: Componente; solutos: Componente[] } {
  const orden = [...cs].sort((a, b) => b.porcentaje - a.porcentaje)
  return { disolvente: orden[0], solutos: orden.slice(1) }
}

/** La disolución tiene el mismo estado físico que su disolvente. */
export const estadoDisolucion = (cs: Componente[]) => papeles(cs).disolvente.estado

/** Porcentajes finales al mezclar: cada parte es [su porcentaje en la mezcla, sus componentes con el % dentro de ella]. */
export function mezclar(partes: [number, Componente[]][]): Componente[] {
  return partes.flatMap(([pc, cs]) => cs.map((c) => ({ ...c, porcentaje: Math.round(pc * c.porcentaje * 10) / 1000 })))
}
