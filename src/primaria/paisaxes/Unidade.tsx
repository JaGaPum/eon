// Unidade 1 de Coñecemento do Medio de 3º: «Descubrimos as paisaxes». Mapa da unidade e as súas paradas.
import { motion } from 'motion/react'
import type { Progreso } from '../../lib/progreso'
import { estrellas } from '../../componentes/Prueba'
import { PREGUNTAS_PROBA } from '../pezas'
import type { ComponentType } from 'react'
import Chaira from './Chaira'
import Costa from './Costa'
import Montana from './Montana'
import Terra from './Terra'

export const RUTA_PAISAXES = '#/3primaria/conecemento-medio/paisaxes'

const PARADAS = [
  { id: 'terra', titulo: 'Como é a Terra?', resumen: 'Océanos, continentes e que é a paisaxe.', paxinas: '14 e 15', feita: true },
  { id: 'montana', titulo: 'Paisaxes de montaña', resumen: 'Montañas, serras e vales. Como é a vida na montaña.', paxinas: '16 e 17', feita: true },
  { id: 'chaira', titulo: 'Paisaxes de chaira', resumen: 'Mesetas, depresións e outeiros. Como é a vida na chaira.', paxinas: '18 e 19', feita: true },
  { id: 'costa', titulo: 'Paisaxes de costa', resumen: 'Cabos, golfos, illas e penínsulas. Como é a vida na costa.', paxinas: '20 e 21', feita: true },
]

const clave = (parada: string) => `paisaxes/${parada}`

/** Estrelas conseguidas na unidade, para a lista de leccións. */
export function avancePaisaxes(progreso: Progreso): string {
  const conseguidas = PARADAS.reduce((t, p) => t + estrellas(progreso.pruebas[clave(p.id)], PREGUNTAS_PROBA), 0)
  return `★ ${conseguidas} de ${PARADAS.length * 3} estrelas`
}

function Mapa({ progreso }: { progreso: Progreso }) {
  return (
    <>
      <h1 className="text-3xl font-bold text-white">Descubrimos as paisaxes</h1>
      <p className="mt-1 text-lg text-indigo-200">Catro paradas. Podes entrar, saír e volver cando queiras.</p>
      <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-lg font-bold text-amber-200">{avancePaisaxes(progreso)}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {PARADAS.map((p, i) => {
          const n = estrellas(progreso.pruebas[clave(p.id)], PREGUNTAS_PROBA)
          const dentro = (
            <>
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-600 text-2xl font-black text-white shadow-lg shadow-fuchsia-500/30">
                {i + 1}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="flex flex-wrap items-center justify-between gap-x-2">
                  <b className="text-xl text-white">{p.titulo}</b>
                  {p.feita && (
                    <span className="text-xl" role="img" aria-label={`${n} de 3 estrelas`}>
                      <span className="text-amber-300">{'★'.repeat(n)}</span>
                      <span className="text-white/20">{'★'.repeat(3 - n)}</span>
                    </span>
                  )}
                </span>
                <span className="text-indigo-200">{p.resumen}</span>
                <span className="mt-1 text-sm font-semibold text-indigo-300">{p.feita ? `Libro, páxinas ${p.paxinas}` : 'Moi pronto'}</span>
              </span>
            </>
          )
          return p.feita ? (
            <motion.a
              key={p.id}
              href={`${RUTA_PAISAXES}/${p.id}/descubre`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="cristal flex gap-4 border-violet-300/50 p-4 hover:bg-white/[0.12]"
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
    </>
  )
}

const COMPOÑENTES: Record<string, ComponentType<{ ruta: string; modo?: string }>> = { terra: Terra, montana: Montana, chaira: Chaira, costa: Costa }

export default function Paisaxes({ parada, modo, progreso }: { parada?: string; modo?: string; progreso: Progreso }) {
  const Parada = parada ? COMPOÑENTES[parada] : undefined
  if (Parada)
    return (
      <div className="tablero">
        <Parada key={parada} ruta={`${RUTA_PAISAXES}/${parada}`} modo={modo} />
      </div>
    )
  return <Mapa progreso={progreso} />
}
