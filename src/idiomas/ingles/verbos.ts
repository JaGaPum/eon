// Verbos para el Present Simple y el Present Continuous, con sus formas escritas a mano (studies, swimming…) para
// no depender de reglas que fallan en los casos raros.

export interface Verbo {
  base: string
  s: string
  ing: string
  es: string
  /** Lo que va detrás en las frases de ejemplo. */
  obj: string
  /** Verbo de estado: no se usa en continuo (like, know…). */
  estado?: boolean
}

export const VERBOS: Verbo[] = [
  { base: 'play', s: 'plays', ing: 'playing', es: 'jugar', obj: 'football' },
  { base: 'read', s: 'reads', ing: 'reading', es: 'leer', obj: 'a comic' },
  { base: 'watch', s: 'watches', ing: 'watching', es: 'ver', obj: 'TV' },
  { base: 'eat', s: 'eats', ing: 'eating', es: 'comer', obj: 'pizza' },
  { base: 'wear', s: 'wears', ing: 'wearing', es: 'llevar puesto', obj: 'trainers' },
  { base: 'go', s: 'goes', ing: 'going', es: 'ir', obj: 'to the park' },
  { base: 'swim', s: 'swims', ing: 'swimming', es: 'nadar', obj: 'in the sea' },
  { base: 'write', s: 'writes', ing: 'writing', es: 'escribir', obj: 'an email' },
  { base: 'study', s: 'studies', ing: 'studying', es: 'estudiar', obj: 'English' },
  { base: 'do', s: 'does', ing: 'doing', es: 'hacer', obj: 'homework' },
  { base: 'have', s: 'has', ing: 'having', es: 'tomar', obj: 'breakfast' },
  { base: 'ride', s: 'rides', ing: 'riding', es: 'montar', obj: 'a bike' },
  { base: 'run', s: 'runs', ing: 'running', es: 'correr', obj: 'in the park' },
  { base: 'cook', s: 'cooks', ing: 'cooking', es: 'cocinar', obj: 'dinner' },
  { base: 'listen', s: 'listens', ing: 'listening', es: 'escuchar', obj: 'to music' },
  { base: 'send', s: 'sends', ing: 'sending', es: 'enviar', obj: 'text messages' },
  { base: 'like', s: 'likes', ing: 'liking', es: 'gustar', obj: 'chocolate', estado: true },
  { base: 'love', s: 'loves', ing: 'loving', es: 'encantar', obj: 'music', estado: true },
  { base: 'hate', s: 'hates', ing: 'hating', es: 'odiar', obj: 'spiders', estado: true },
  { base: 'know', s: 'knows', ing: 'knowing', es: 'saber, conocer', obj: 'the answer', estado: true },
  { base: 'understand', s: 'understands', ing: 'understanding', es: 'entender', obj: 'English', estado: true },
  { base: 'want', s: 'wants', ing: 'wanting', es: 'querer', obj: 'a new phone', estado: true },
  { base: 'need', s: 'needs', ing: 'needing', es: 'necesitar', obj: 'help', estado: true },
]

/** Sujeto y si va en tercera persona del singular. */
export const SUJETOS: [string, boolean][] = [
  ['I', false],
  ['You', false],
  ['He', true],
  ['She', true],
  ['We', false],
  ['They', false],
  ['My brother', true],
  ['Anna', true],
  ['My parents', false],
  ['Tom and Lucy', false],
]

const BE: Record<string, string> = { I: 'am' }
export const be = (suj: string, tercera: boolean) => BE[suj] ?? (tercera ? 'is' : 'are')

/** Las formas válidas del hueco (sin el sujeto). */
export function simple(v: Verbo, tercera: boolean, neg = false): string[] {
  if (!neg) return [tercera ? v.s : v.base]
  return tercera ? [`doesn't ${v.base}`, `does not ${v.base}`] : [`don't ${v.base}`, `do not ${v.base}`]
}

export function continuo(v: Verbo, suj: string, tercera: boolean, neg = false): string[] {
  const b = be(suj, tercera)
  if (!neg) return [`${b} ${v.ing}`, ...(suj === 'I' ? [`'m ${v.ing}`] : [])]
  if (b === 'am') return [`am not ${v.ing}`, `'m not ${v.ing}`]
  return [`${b}n't ${v.ing}`, `${b} not ${v.ing}`]
}

export const SIMPLE_TIEMPO = ['every day', 'every weekend', 'on Mondays', 'once a week', 'twice a week', 'after school', 'in the summer']
export const ADV_FRECUENCIA = ['usually', 'often', 'always', 'sometimes', 'never']
export const CONTINUO_TIEMPO = ['now', 'right now', 'at the moment']
