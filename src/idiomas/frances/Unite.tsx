// Francés de 2º de ESO, unidad 1: lo que entra en el primer examen según la profesora.
import type { ComponentType } from 'react'
import { motion } from 'motion/react'
import type { Progreso } from '../../lib/progreso'
import { estrellas } from '../../componentes/Prueba'
import { IdiomaUnidade, PREGUNTAS_PROBA, Proba, barallar, notaSobre10, type Pregunta } from '../../primaria/pezas'
import Corps, { PREGUNTAS as P_CORPS } from './corps'
import Demonstratifs, { PREGUNTAS as P_DEMONSTRATIFS } from './demonstratifs'
import Famille, { PREGUNTAS as P_FAMILLE } from './famille'
import Metiers, { PREGUNTAS as P_METIERS } from './metiers'
import Questions, { PREGUNTAS as P_QUESTIONS } from './questions'
import Verbes, { PREGUNTAS as P_VERBES } from './verbes'

export const RUTA_UNITE1 = '#/2eso/frances/unite1'

const PARADAS: { id: string; titulo: string; resumen: string; Compoñente?: ComponentType<{ ruta: string; modo?: string }> }[] = [
  { id: 'verbes', titulo: 'Les verbes en ‑er', resumen: 'Marcher y los verbos de la ficha. Cuidado con manger y nager.', Compoñente: Verbes },
  { id: 'famille', titulo: 'La famille', resumen: 'Abuelos, padres, tíos, primos… y mon, ma, mes.', Compoñente: Famille },
  { id: 'corps', titulo: 'Les parties du corps', resumen: 'La cabeza, la cara y el cuerpo, con su artículo.', Compoñente: Corps },
  { id: 'metiers', titulo: 'Les métiers', resumen: 'Las profesiones y cómo se forma el femenino.', Compoñente: Metiers },
  { id: 'questions', titulo: 'Poser des questions', resumen: 'Qu’est-ce que, comment, où, qui, pourquoi… parce que.', Compoñente: Questions },
  { id: 'demonstratifs', titulo: 'Les démonstratifs', resumen: 'Ce, cet, cette, ces, con la ropa.', Compoñente: Demonstratifs },
]

// El examen coge tres preguntas de cada parada: 18 en total, con nota sobre 10.
const POR_PARADA = 3
const BANCOS = [P_VERBES, P_FAMILLE, P_CORPS, P_METIERS, P_QUESTIONS, P_DEMONSTRATIFS]
export const PREGUNTAS_EXAME = POR_PARADA * BANCOS.length
const xerarExame = (): Pregunta[] => barallar(BANCOS.flatMap((banco) => barallar(banco).slice(0, POR_PARADA)))

const clave = (parada: string) => `frances1/${parada}`
const feitas = PARADAS.filter((p) => p.Compoñente)

/** Estrellas conseguidas en la unidad, para la lista de lecciones. */
export function avanceUnite1(progreso: Progreso): string {
  const conseguidas = feitas.reduce((t, p) => t + estrellas(progreso.pruebas[clave(p.id)], PREGUNTAS_PROBA), 0)
  return `★ ${conseguidas} de ${feitas.length * 3} estrellas`
}

function Mapa({ progreso }: { progreso: Progreso }) {
  return (
    <>
      <h1 className="text-3xl font-bold text-white">Unité 1 · Francés</h1>
      <p className="mt-1 text-indigo-200">Lo que entra en el primer examen. Cada palabra en francés tiene 🔊 para oírla.</p>
      <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 font-bold text-amber-200">{avanceUnite1(progreso)}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {PARADAS.map((p, i) => {
          const n = estrellas(progreso.pruebas[clave(p.id)], PREGUNTAS_PROBA)
          const dentro = (
            <>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 text-xl font-black text-white shadow-lg shadow-indigo-500/30">
                {i + 1}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="flex flex-wrap items-center justify-between gap-x-2">
                  <b className="text-lg text-white" lang="fr">
                    {p.titulo}
                  </b>
                  {p.Compoñente && (
                    <span className="text-lg" role="img" aria-label={`${n} de 3 estrellas`}>
                      <span className="text-amber-300">{'★'.repeat(n)}</span>
                      <span className="text-white/20">{'★'.repeat(3 - n)}</span>
                    </span>
                  )}
                </span>
                <span className="text-sm text-indigo-200">{p.resumen}</span>
              </span>
            </>
          )
          return p.Compoñente ? (
            <motion.a
              key={p.id}
              href={`${RUTA_UNITE1}/${p.id}/descubre`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="cristal flex gap-4 border-indigo-300/50 p-4 hover:bg-white/[0.12]"
            >
              {dentro}
            </motion.a>
          ) : (
            <div key={p.id} className="cristal flex gap-4 border-dashed p-4 opacity-55">
              {dentro}
            </div>
          )
        })}
      </div>

      <h2 className="mt-8 mb-3 text-sm font-bold tracking-widest text-indigo-300 uppercase">Misión final</h2>
      <motion.a href={`${RUTA_UNITE1}/examen`} whileHover={{ y: -4 }} className="cristal flex items-center gap-4 border-amber-300/70 p-4 hover:bg-white/[0.12]">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-600 text-2xl shadow-lg shadow-orange-500/30" aria-hidden="true">
          🚀
        </span>
        <span className="flex flex-col">
          <b className="text-lg text-white">Examen de la unidad</b>
          <span className="text-sm text-indigo-200">{PREGUNTAS_EXAME} preguntas, tres de cada parada, con nota sobre 10.</span>
          {progreso.pruebas[clave('examen')] !== undefined && (
            <span className="mt-1 text-sm font-semibold text-amber-200">Tu mejor nota: {String(notaSobre10(progreso.pruebas[clave('examen')], PREGUNTAS_EXAME)).replace('.', ',')}</span>
          )}
        </span>
      </motion.a>
    </>
  )
}

export default function Unite1({ parada, modo, progreso }: { parada?: string; modo?: string; progreso: Progreso }) {
  const P = PARADAS.find((p) => p.id === parada)?.Compoñente
  return (
    <IdiomaUnidade idioma="es" falar="fr-FR">
      {parada === 'examen' ? (
        <div className="tablero">
          <a href={RUTA_UNITE1} className="text-lg font-semibold text-violet-700">
            ← Mapa de la unidad
          </a>
          <h1 className="mt-2 mb-5 text-3xl font-black text-slate-800 sm:text-4xl">Examen de la unidad</h1>
          <Proba id={clave('examen')} xerar={xerarExame} />
        </div>
      ) : P ? (
        <div className="tablero">
          <P key={parada} ruta={`${RUTA_UNITE1}/${parada}`} modo={modo} />
        </div>
      ) : (
        <Mapa progreso={progreso} />
      )}
    </IdiomaUnidade>
  )
}
