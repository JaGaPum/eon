// Francés de 2.º de ESO, unidad 2: los artículos de las palabras de la casa y los verbos pronominales en presente
// (afirmativo y negativo). Las respuestas de los ejercicios salen de aquí.

export type Genero = 'm' | 'f'

/** Empieza por vocal o h muda: se apostrofa (l'armoire, je m'habille). */
export const empiezaPorVocal = (s: string) => /^[aeiouyâàéèêëîïôûùh]/i.test(s)

/** Artículo determinado: le, la, l' o les. */
export function articuloDeterminado(nombre: string, genero: Genero, plural = false): string {
  if (plural) return `les ${nombre}`
  if (empiezaPorVocal(nombre)) return `l'${nombre}`
  return `${genero === 'm' ? 'le' : 'la'} ${nombre}`
}

/** Artículo indeterminado: un, une o des. */
export function articuloIndeterminado(nombre: string, genero: Genero, plural = false): string {
  if (plural) return `des ${nombre}`
  return `${genero === 'm' ? 'un' : 'une'} ${nombre}`
}

/** La palabra con huecos en las vocales, como en el bilan: cuisine → c__s_n_. */
export const sinVocales = (s: string) => s.replace(/[aeiouyâàéèêëîïôûù]/gi, '_')

// ——— Verbos pronominales ———

export const PERSONAS = ['je', 'tu', 'il', 'elle', 'on', 'nous', 'vous', 'ils', 'elles'] as const
export type Persona = (typeof PERSONAS)[number]

const REFLEXIVO: Record<Persona, string> = { je: 'me', tu: 'te', il: 'se', elle: 'se', on: 'se', nous: 'nous', vous: 'vous', ils: 'se', elles: 'se' }
const TERMINACION: Record<Persona, string> = { je: 'e', tu: 'es', il: 'e', elle: 'e', on: 'e', nous: 'ons', vous: 'ez', ils: 'ent', elles: 'ent' }

/** Los verbos que cambian la e por è, como acheter (página 31: «se lever se conjugue comme acheter»). */
const VERBOS_COMO_ACHETER = ['lever', 'acheter', 'promener']

/** El verbo sin el pronombre: «se lever» → «lever», «s'habiller» → «habiller». */
export const sinPronombre = (inf: string) => inf.replace(/^(se |s')/, '')

/**
 * La forma del verbo: los verbos en -er regulares. «Lever» se conjuga como «acheter»: la e pasa a è cuando la
 * terminación no suena (je lève, tu lèves, ils lèvent), pero no con nous y vous (nous levons).
 */
export function formaVerbo(inf: string, p: Persona): string {
  const v = sinPronombre(inf)
  const raiz = v.slice(0, -2)
  const conAcento = VERBOS_COMO_ACHETER.includes(v) && p !== 'nous' && p !== 'vous'
  return (conAcento ? raiz.replace(/e([^e]*)$/, 'è$1') : raiz) + TERMINACION[p]
}

/** El pronombre reflexivo delante del verbo, apostrofado si el verbo empieza por vocal: je me lève, je m'habille. */
function reflexivoYVerbo(inf: string, p: Persona): string {
  const f = formaVerbo(inf, p)
  const r = REFLEXIVO[p]
  return (r === 'me' || r === 'te' || r === 'se') && empiezaPorVocal(f) ? `${r[0]}'${f}` : `${r} ${f}`
}

/** Presente afirmativo: je me lève, tu t'habilles, nous nous levons. */
export const pronominal = (inf: string, p: Persona) => `${p} ${reflexivoYVerbo(inf, p)}`

/** Presente negativo: ne delante del pronombre reflexivo y pas detrás del verbo. Je ne me lève pas, je ne m'habille pas. */
export const pronominalNegativo = (inf: string, p: Persona) => `${p} ne ${reflexivoYVerbo(inf, p)} pas`

/** Solo el pronombre reflexivo que va en el hueco: me, m', te, t', se, s', nous, vous. */
export function reflexivo(inf: string, p: Persona): string {
  const rv = reflexivoYVerbo(inf, p)
  return rv.includes("'") ? rv.slice(0, 2) : REFLEXIVO[p]
}
