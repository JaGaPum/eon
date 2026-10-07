// Atallos para escribir as preguntas das probas.
import type { ReactNode } from 'react'
import type { Debuxo, Pregunta } from '../pezas'

/** Pregunta de escoller: a correcta e as outras opcións, que se barallan. */
export const elixe = (texto: ReactNode, correcta: string, outras: string[], explica: ReactNode, visual?: ReactNode): Pregunta => ({ tipo: 'elixe', texto, correcta, outras, explica, visual })

/** Pregunta de tocar no debuxo o elemento `correcta`. */
export const toca = (texto: ReactNode, Debuxo: Debuxo, nomes: Record<string, string>, correcta: string, explica: ReactNode, oir?: string): Pregunta => ({ tipo: 'toca', texto, correcta, Debuxo, nomes, explica, oir })
