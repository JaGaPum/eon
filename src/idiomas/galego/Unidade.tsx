// Lingua Galega 2.º ESO, proba de aula 1: tratamento de textos e acentuación (o que dixo a profesora en Classroom).
import type { ComponentType } from 'react'
import { motion } from 'motion/react'
import type { Progreso } from '../../lib/progreso'
import { estrellas } from '../../componentes/Prueba'
import { IdiomaUnidade, PREGUNTAS_PROBA, Proba, barallar, notaSobre10, type Pregunta } from '../../primaria/pezas'
import { Definir, Descricion, PREGUNTAS_TEXTOS, Resumo, Tema } from './textos'
import { Acentuacion, Diacriticos, PREGUNTAS_ACENTOS } from './acentos'

export const RUTA_GALEGO1 = '#/2eso/lingua-galega/proba1'

const PARADAS: { id: string; titulo: string; resumen: string; bloque: string; Compoñente: ComponentType<{ ruta: string; modo?: string }> }[] = [
  { id: 'descricion', titulo: 'Descrición obxectiva e subxectiva', resumen: 'Datos comprobables ou sentimentos e opinións.', bloque: 'Tratamento de textos', Compoñente: Descricion },
  { id: 'tema', titulo: 'Tema e título', resumen: 'O tema nunha frase nominal; o título, breve e sen verbos.', bloque: 'Tratamento de textos', Compoñente: Tema },
  { id: 'resumo', titulo: 'O resumo', resumen: 'Un terzo, un parágrafo, palabras propias e sen opinións.', bloque: 'Tratamento de textos', Compoñente: Resumo },
  { id: 'definir', titulo: 'Definir palabras', resumen: 'Segundo a categoría, sen palabras da mesma familia.', bloque: 'Tratamento de textos', Compoñente: Definir },
  { id: 'acentuacion', titulo: 'Regras de acentuación', resumen: 'Agudas, graves, esdrúxulas, hiatos e casos especiais.', bloque: 'Acentuación', Compoñente: Acentuacion },
  { id: 'diacriticos', titulo: 'O til diacrítico', resumen: 'Os 28 pares en tres días e frases para acentuar.', bloque: 'Acentuación', Compoñente: Diacriticos },
]

const BANCOS: Record<string, Pregunta[]> = { ...PREGUNTAS_TEXTOS, ...PREGUNTAS_ACENTOS }
// Simulacro: 3 preguntas de cada parada de textos e 4 de cada unha de acentuación.
const CANTAS: Record<string, number> = { descricion: 3, tema: 3, resumo: 3, definir: 3, acentuacion: 4, diacriticos: 4 }
export const PREGUNTAS_EXAME = Object.values(CANTAS).reduce((a, b) => a + b, 0)
const xerarExame = (): Pregunta[] => PARADAS.flatMap((p) => barallar(BANCOS[p.id]).slice(0, CANTAS[p.id]))

const clave = (parada: string) => `galego1/${parada}`

export function avanceGalego1(progreso: Progreso): string {
  const n = PARADAS.reduce((t, p) => t + estrellas(progreso.pruebas[clave(p.id)], PREGUNTAS_PROBA), 0)
  return `★ ${n} de ${PARADAS.length * 3} estrelas`
}

function Mapa({ progreso }: { progreso: Progreso }) {
  const mellor = progreso.pruebas[clave('exame')]
  return (
    <>
      <h1 className="text-3xl font-bold text-white">Proba de aula 1 · Lingua Galega</h1>
      <p className="mt-1 text-indigo-200">Tratamento de textos e acentuación. A proba é o venres 16 de outubro.</p>
      <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 font-bold text-amber-200">{avanceGalego1(progreso)}</p>
      {['Tratamento de textos', 'Acentuación'].map((bloque) => (
        <section key={bloque}>
          <h2 className="mt-8 mb-3 text-sm font-bold tracking-widest text-indigo-300 uppercase">{bloque}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {PARADAS.filter((p) => p.bloque === bloque).map((p, i) => {
              const n = estrellas(progreso.pruebas[clave(p.id)], PREGUNTAS_PROBA)
              return (
                <motion.a
                  key={p.id}
                  href={`${RUTA_GALEGO1}/${p.id}/descubre`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="cristal flex gap-4 border-indigo-300/50 p-4 hover:bg-white/[0.12]"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 text-xl font-black text-white shadow-lg shadow-indigo-500/30">
                    {PARADAS.indexOf(p) + 1}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="flex flex-wrap items-center justify-between gap-x-2">
                      <b className="text-lg text-white">{p.titulo}</b>
                      <span className="text-lg" role="img" aria-label={`${n} de 3 estrelas`}>
                        <span className="text-amber-300">{'★'.repeat(n)}</span>
                        <span className="text-white/20">{'★'.repeat(3 - n)}</span>
                      </span>
                    </span>
                    <span className="text-sm text-indigo-200">{p.resumen}</span>
                  </span>
                </motion.a>
              )
            })}
          </div>
        </section>
      ))}
      <h2 className="mt-8 mb-3 text-sm font-bold tracking-widest text-indigo-300 uppercase">Misión final</h2>
      <motion.a href={`${RUTA_GALEGO1}/exame`} whileHover={{ y: -4 }} className="cristal flex items-center gap-4 border-amber-300/70 p-4 hover:bg-white/[0.12]">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-600 text-2xl shadow-lg shadow-orange-500/30" aria-hidden="true">
          🚀
        </span>
        <span className="flex flex-col">
          <b className="text-lg text-white">Simulacro da proba de aula</b>
          <span className="text-sm text-indigo-200">{PREGUNTAS_EXAME} preguntas de todo o que entra, con nota sobre 10.</span>
          {mellor !== undefined && <span className="mt-1 text-sm font-semibold text-amber-200">A túa mellor nota: {String(notaSobre10(mellor, PREGUNTAS_EXAME)).replace('.', ',')}</span>}
        </span>
      </motion.a>
    </>
  )
}

export default function Galego1({ parada, modo, progreso }: { parada?: string; modo?: string; progreso: Progreso }) {
  const P = PARADAS.find((p) => p.id === parada)?.Compoñente
  return (
    <IdiomaUnidade idioma="gl" guia="cohete" modos={{ descubre: 'Aprende', xoga: 'Practica', proba: '★ Proba' }}>
      {parada === 'exame' ? (
        <div className="tablero">
          <a href={RUTA_GALEGO1} className="text-lg font-semibold text-violet-700">
            ← Mapa da unidade
          </a>
          <h1 className="mt-2 mb-5 text-3xl font-black text-slate-800 sm:text-4xl">Simulacro da proba de aula</h1>
          <Proba id={clave('exame')} xerar={xerarExame} />
        </div>
      ) : P ? (
        <div className="tablero">
          <P key={parada} ruta={`${RUTA_GALEGO1}/${parada}`} modo={modo} />
        </div>
      ) : (
        <Mapa progreso={progreso} />
      )}
    </IdiomaUnidade>
  )
}
