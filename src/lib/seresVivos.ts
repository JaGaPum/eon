// Ciencias da Natureza de 3.º: os seres vivos e os cinco reinos, co que di o libro. As solucións calcúlanse aquí.

export const REINOS = ['plantas', 'animais', 'fungos', 'protistas', 'bacterias'] as const
export type Reino = (typeof REINOS)[number]

export const NOME_REINO: Record<Reino, string> = { plantas: 'Plantas', animais: 'Animais', fungos: 'Fungos', protistas: 'Protistas', bacterias: 'Bacterias' }

export type Celulas = 'uni' | 'pluri'
export type Alimento = 'fabrican' | 'toman'

/**
 * Os grupos de seres vivos do libro, coas súas características. Cando un grupo ten de todo (fungos unicelulares e
 * pluricelulares, bacterias que fabrican e que toman), van as dúas.
 */
export interface Grupo {
  id: string
  nome: string
  reino: Reino
  celulas: Celulas[]
  alimento: Alimento[]
  /** Se se poden desprazar; `null` se o libro non o di. */
  desprazanse: boolean | null
  /** Hai algúns que viven baixo a auga. */
  auga: boolean
  /** Hai algúns que viven na terra. */
  terra: boolean
  /** A célula máis pequena e simple coñecida. */
  celulaSimple?: boolean
}

export const GRUPOS: Grupo[] = [
  { id: 'plantas', nome: 'as plantas', reino: 'plantas', celulas: ['pluri'], alimento: ['fabrican'], desprazanse: false, auga: false, terra: true },
  { id: 'animais', nome: 'os animais', reino: 'animais', celulas: ['pluri'], alimento: ['toman'], desprazanse: true, auga: true, terra: true },
  { id: 'cogomelo', nome: 'os fungos con cogomelo', reino: 'fungos', celulas: ['pluri'], alimento: ['toman'], desprazanse: false, auga: false, terra: true },
  { id: 'mofos', nome: 'os mofos', reino: 'fungos', celulas: ['pluri'], alimento: ['toman'], desprazanse: false, auga: false, terra: true },
  { id: 'fermentos', nome: 'os fermentos', reino: 'fungos', celulas: ['uni'], alimento: ['toman'], desprazanse: false, auga: false, terra: true },
  { id: 'protozoos', nome: 'os protozoos', reino: 'protistas', celulas: ['uni'], alimento: ['toman'], desprazanse: null, auga: true, terra: false },
  { id: 'algas', nome: 'as algas', reino: 'protistas', celulas: ['uni', 'pluri'], alimento: ['fabrican'], desprazanse: null, auga: true, terra: false },
  { id: 'bacterias', nome: 'as bacterias', reino: 'bacterias', celulas: ['uni'], alimento: ['fabrican', 'toman'], desprazanse: null, auga: true, terra: true, celulaSimple: true },
]

export const grupo = (id: string) => GRUPOS.find((g) => g.id === id)!

/** O que se sabe de cada reino, para a táboa da páxina 20. */
export function celulasDe(r: Reino): Celulas[] {
  return [...new Set(GRUPOS.filter((g) => g.reino === r).flatMap((g) => g.celulas))]
}
export function alimentoDe(r: Reino): Alimento[] {
  return [...new Set(GRUPOS.filter((g) => g.reino === r).flatMap((g) => g.alimento))]
}
export const textoCelulas = (c: Celulas[]) => (c.length === 2 ? 'Unicelulares ou pluricelulares' : c[0] === 'uni' ? 'Unicelulares' : 'Pluricelulares')
export const textoAlimento = (a: Alimento[]) => (a.length === 2 ? 'Algúns fabrican o seu alimento e outros tómano' : a[0] === 'fabrican' ? 'Fabrican o seu alimento' : 'Toman o alimento doutros seres vivos')

/** Un cartel coma os da páxina 21: só o que di. */
export interface Cartel {
  celulas?: Celulas
  alimento?: Alimento
  desprazanse?: boolean
  auga?: boolean
  terra?: boolean
  celulaSimple?: boolean
}

/** Os grupos que encaixan cun cartel. */
export function quenE(c: Cartel): Grupo[] {
  return GRUPOS.filter(
    (g) =>
      (c.celulas === undefined || g.celulas.includes(c.celulas)) &&
      (c.alimento === undefined || g.alimento.includes(c.alimento)) &&
      (c.desprazanse === undefined || g.desprazanse === null || g.desprazanse === c.desprazanse) &&
      (!c.auga || g.auga) &&
      (!c.terra || g.terra) &&
      (c.celulaSimple === undefined || !!g.celulaSimple === c.celulaSimple),
  )
}

/** O reino que describe un cartel, se só hai un. */
export function reinoDoCartel(c: Cartel): Reino | null {
  const reinos = [...new Set(quenE(c).map((g) => g.reino))]
  return reinos.length === 1 ? reinos[0] : null
}

/** O texto dun cartel. */
export function textoCartel(c: Cartel): string {
  const p: string[] = []
  if (c.celulas) p.push(c.celulas === 'uni' ? 'Son unicelulares' : 'Son pluricelulares')
  if (c.celulaSimple) p.push('a súa célula é moi simple')
  if (c.alimento) p.push(c.alimento === 'fabrican' ? 'fabrican o seu propio alimento' : 'necesitan alimento')
  if (c.desprazanse !== undefined) p.push(c.desprazanse ? 'desprázanse' : 'non se poden desprazar')
  if (c.auga) p.push('viven baixo a auga')
  if (c.terra) p.push('viven na terra')
  const fin = p.pop()!
  return p.length ? `${p.join(', ')} e ${fin}.` : `${fin}.`
}

// ——— Seres vivos con debuxo ———

export interface Ser {
  id: string
  nome: string
  grupo: string
  /** Só se ve co microscopio. */
  micro?: boolean
}

export const SERES: Ser[] = [
  { id: 'amapola', nome: 'a papoula', grupo: 'plantas' },
  { id: 'arbore', nome: 'a árbore', grupo: 'plantas' },
  { id: 'palmeira', nome: 'a palmeira', grupo: 'plantas' },
  { id: 'xirasol', nome: 'o xirasol', grupo: 'plantas' },
  { id: 'paporrubio', nome: 'o paporrubio', grupo: 'animais' },
  { id: 'pinguin', nome: 'o pingüín', grupo: 'animais' },
  { id: 'bolboreta', nome: 'a bolboreta', grupo: 'animais' },
  { id: 'xirafa', nome: 'a xirafa', grupo: 'animais' },
  { id: 'polbo', nome: 'o polbo', grupo: 'animais' },
  { id: 'niscaro', nome: 'o níscaro', grupo: 'cogomelo' },
  { id: 'amanita', nome: 'o cogomelo vermello', grupo: 'cogomelo' },
  { id: 'champinon', nome: 'o champiñón', grupo: 'cogomelo' },
  { id: 'mofo', nome: 'o mofo do pan', grupo: 'mofos' },
  { id: 'fermento', nome: 'os fermentos do pan', grupo: 'fermentos', micro: true },
  { id: 'ameba', nome: 'a ameba', grupo: 'protozoos', micro: true },
  { id: 'protozoo', nome: 'o protozoo', grupo: 'protozoos', micro: true },
  { id: 'algaVerde', nome: 'a alga verde', grupo: 'algas' },
  { id: 'algaVermella', nome: 'a alga vermella', grupo: 'algas' },
  { id: 'algaMicro', nome: 'a alga unicelular', grupo: 'algas', micro: true },
  { id: 'bacteriaIogur', nome: 'a bacteria do iogur', grupo: 'bacterias', micro: true },
  { id: 'bacteriaTetano', nome: 'a bacteria do tétano', grupo: 'bacterias', micro: true },
]

export const ser = (id: string) => SERES.find((s) => s.id === id)!
export const reinoDe = (id: string): Reino => grupo(ser(id).grupo).reino
export const seresDo = (r: Reino) => SERES.filter((s) => reinoDe(s.id) === r)

// ——— Biodiversidade ———

export type Nivel = 'baixa' | 'media' | 'alta'

/** A escala da páxina 16: menos de 10, baixa; entre 10 e 20, media; máis de 20, alta. */
export const nivelBiodiversidade = (seres: number): Nivel => (seres < 10 ? 'baixa' : seres <= 20 ? 'media' : 'alta')

// ——— Formas das bacterias ———

export const FORMAS = ['circular', 'alongada', 'coma', 'espiral'] as const
export type Forma = (typeof FORMAS)[number]
export const NOME_FORMA: Record<Forma, string> = { circular: 'circular', alongada: 'alongada', coma: 'de coma', espiral: 'en espiral' }

/** Os catro carteis da páxina 21 (A, B, C e D) e outros coma eles. */
export const CARTEIS: Cartel[] = [
  { celulas: 'pluri', alimento: 'toman', desprazanse: false },
  { celulas: 'uni', celulaSimple: true },
  { celulas: 'pluri', alimento: 'fabrican', auga: true },
  { celulas: 'pluri', alimento: 'toman', desprazanse: true },
  { celulas: 'pluri', alimento: 'fabrican', terra: true },
  { celulas: 'uni', celulaSimple: true, alimento: 'fabrican' },
  { celulas: 'pluri', alimento: 'toman', desprazanse: true, auga: true },
  { celulas: 'pluri', alimento: 'toman', desprazanse: false, terra: true },
]
