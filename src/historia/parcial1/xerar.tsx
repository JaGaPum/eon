// Preguntas e xogos que saen das datas: o código decide que foi antes, a orde boa e en que etapa cae cada feito.
import type { ReactNode } from 'react'
import { barallar, type Pregunta } from '../../primaria/pezas'
import { elixe } from '../../primaria/paisaxes/preguntas'
import { enOrde, etapaDe, periodoDe, romano, seculo, type Feito } from './datos'

/** «Que pasou antes?» con dous feitos de datas distintas. */
export function queFoiAntes(fs: Feito[], cantas: number): Pregunta[] {
  const pares: [Feito, Feito][] = []
  for (let i = 0; i < fs.length; i++) for (let j = i + 1; j < fs.length; j++) if (fs[i].ano !== fs[j].ano) pares.push([fs[i], fs[j]])
  return barallar(pares)
    .slice(0, cantas)
    .map(([a, b]) => {
      const [primeiro, despois] = a.ano < b.ano ? [a, b] : [b, a]
      return elixe('Que pasou antes?', primeiro.texto, [despois.texto], `${primeiro.curto}: ${primeiro.data}. ${despois.curto}: ${despois.data}.`)
    })
}

/** Series para o xogo de ordenar: grupos de `tam` feitos, cada un xa en orde. */
export function seriesOrde(fs: Feito[], series: number, tam: number): { palabras: string[]; traducion: string }[] {
  return Array.from({ length: series }, () => ({ palabras: enOrde(barallar(fs).slice(0, tam)).map((x) => x.curto), traducion: 'Do máis antigo ao máis recente' }))
}

/** En que etapa de Roma pasou un feito (Monarquía, República ou Imperio). */
export const enQueEtapa = (x: Feito, explica?: ReactNode): Pregunta => {
  const etapa = etapaDe(x.ano)!
  return elixe(
    <>
      «{x.texto}» ({x.data}). En que etapa de Roma foi?
    </>,
    etapa,
    ['Monarquía', 'República', 'Imperio'].filter((e) => e !== etapa),
    explica ?? `${x.data} cae na ${etapa}.`,
  )
}

/** En que período da Idade Media pasou un feito, a partir do seu século. */
export const enQuePeriodo = (x: Feito): Pregunta => {
  const s = seculo(x.ano)
  const p = periodoDe(s)!
  return elixe(
    <>
      «{x.texto}» ({x.data}). En que período da Idade Media foi?
    </>,
    p,
    ['Alta Idade Media', 'Plena Idade Media', 'Baixa Idade Media'].filter((e) => e !== p),
    `É do século ${romano(s)}: ${p}.`,
  )
}
