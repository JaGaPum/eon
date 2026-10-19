// Inglés de 2.º ESO, Module 1: lo que entra en el primer examen (lo que va en azul en las páginas 13, 17, 21 y 22).
import type { ComponentType } from 'react'
import { motion } from 'motion/react'
import type { Progreso } from '../../lib/progreso'
import { estrellas } from '../../componentes/Prueba'
import { IdiomaUnidade, PREGUNTAS_PROBA, Proba, barallar, notaSobre10, type Pregunta } from '../../primaria/pezas'
import Preguntas, { PREGUNTAS as P_QUESTIONS } from './preguntas'
import HowMuch, { PREGUNTAS as P_HOW } from './howmuch'
import ThereIs, { PREGUNTAS as P_THERE } from './thereis'
import Presentes, { PREGUNTAS as P_PRESENTES } from './presentes'

export const RUTA_MODULE1 = '#/2eso/ingles/module1'

const PARADAS: { id: string; titulo: string; resumen: string; pagina: number; Compoñente: ComponentType<{ ruta: string; modo?: string }> }[] = [
  { id: 'presentes', titulo: 'Present Simple / Present Continuous', resumen: 'Rutinas o lo que pasa ahora, y los verbos de estado.', pagina: 13, Compoñente: Presentes },
  { id: 'thereis', titulo: 'There is / There are, articles and quantifiers', resumen: 'a/an, some/any, much/many, a few/a little, a lot of.', pagina: 17, Compoñente: ThereIs },
  { id: 'questions', titulo: 'Subject / Object questions', resumen: 'Who y What: preguntar por el sujeto o por el objeto.', pagina: 21, Compoñente: Preguntas },
  { id: 'how', titulo: 'How much / many / far / long / often', resumen: 'Cantidad, distancia, longitud y frecuencia.', pagina: 22, Compoñente: HowMuch },
]

// El examen: cinco preguntas de cada parada, con nota sobre 10.
const POR_PARADA = 5
const BANCOS = [P_PRESENTES, P_THERE, P_QUESTIONS, P_HOW]
export const PREGUNTAS_EXAME = POR_PARADA * BANCOS.length
const xerarExame = (): Pregunta[] => barallar(BANCOS.flatMap((banco) => barallar(banco).slice(0, POR_PARADA)))

const clave = (parada: string) => `ingles1/${parada}`

export function avanceModule1(progreso: Progreso): string {
  const n = PARADAS.reduce((t, p) => t + estrellas(progreso.pruebas[clave(p.id)], PREGUNTAS_PROBA), 0)
  return `★ ${n} de ${PARADAS.length * 3} estrellas`
}

function Mapa({ progreso }: { progreso: Progreso }) {
  const mejor = progreso.pruebas[clave('examen')]
  return (
    <>
      <h1 className="text-3xl font-bold text-white">Module 1 · Inglés</h1>
      <p className="mt-1 text-indigo-200">Lo que va en azul en el libro para el primer examen. Cada frase en inglés tiene 🔊 para oírla.</p>
      <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 font-bold text-amber-200">{avanceModule1(progreso)}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {PARADAS.map((p, i) => {
          const n = estrellas(progreso.pruebas[clave(p.id)], PREGUNTAS_PROBA)
          return (
            <motion.a
              key={p.id}
              href={`${RUTA_MODULE1}/${p.id}/descubre`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="cristal flex gap-4 border-indigo-300/50 p-4 hover:bg-white/[0.12]"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 text-xl font-black text-white shadow-lg shadow-indigo-500/30">
                {i + 1}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="flex flex-wrap items-center justify-between gap-x-2">
                  <b className="text-lg text-white" lang="en">
                    {p.titulo}
                  </b>
                  <span className="text-lg" role="img" aria-label={`${n} de 3 estrellas`}>
                    <span className="text-amber-300">{'★'.repeat(n)}</span>
                    <span className="text-white/20">{'★'.repeat(3 - n)}</span>
                  </span>
                </span>
                <span className="text-sm text-indigo-200">{p.resumen}</span>
                <span className="mt-1 text-sm font-semibold text-indigo-300">Libro, página {p.pagina}</span>
              </span>
            </motion.a>
          )
        })}
      </div>
      <h2 className="mt-8 mb-3 text-sm font-bold tracking-widest text-indigo-300 uppercase">Misión final</h2>
      <motion.a href={`${RUTA_MODULE1}/examen`} whileHover={{ y: -4 }} className="cristal flex items-center gap-4 border-amber-300/70 p-4 hover:bg-white/[0.12]">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-600 text-2xl shadow-lg shadow-orange-500/30" aria-hidden="true">
          🚀
        </span>
        <span className="flex flex-col">
          <b className="text-lg text-white">Examen del módulo</b>
          <span className="text-sm text-indigo-200">{PREGUNTAS_EXAME} preguntas, cinco de cada parada, con nota sobre 10.</span>
          {mejor !== undefined && <span className="mt-1 text-sm font-semibold text-amber-200">Tu mejor nota: {String(notaSobre10(mejor, PREGUNTAS_EXAME)).replace('.', ',')}</span>}
        </span>
      </motion.a>
    </>
  )
}

export default function Module1({ parada, modo, progreso }: { parada?: string; modo?: string; progreso: Progreso }) {
  const P = PARADAS.find((p) => p.id === parada)?.Compoñente
  return (
    <IdiomaUnidade idioma="es" falar="en-GB">
      {parada === 'examen' ? (
        <div className="tablero">
          <a href={RUTA_MODULE1} className="text-lg font-semibold text-violet-700">
            ← Mapa de la unidad
          </a>
          <h1 className="mt-2 mb-5 text-3xl font-black text-slate-800 sm:text-4xl">Examen del módulo</h1>
          <Proba id={clave('examen')} xerar={xerarExame} />
        </div>
      ) : P ? (
        <div className="tablero">
          <P key={parada} ruta={`${RUTA_MODULE1}/${parada}`} modo={modo} />
        </div>
      ) : (
        <Mapa progreso={progreso} />
      )}
    </IdiomaUnidade>
  )
}
