import { motion } from 'motion/react'
import { BLOQUES, CLASE, TITULO } from './contenido/tema1'
import { RUTA_TEMA1 } from './contenido/catalogo'
import { IDS } from './contenido/preguntas'
import type { Progreso } from './lib/progreso'

// Ejercicios de clase de cada parada, para pintar el avance en el mapa.
export const EJERCICIOS: Record<string, string[]> = { ...IDS, descomposicion: CLASE.map((e) => e.id) }

export default function Mapa({ progreso }: { progreso: Progreso }) {
  return (
    <>
      <h1 className="text-3xl font-bold text-white">{TITULO}</h1>
      <p className="mt-1 text-indigo-200">Ocho paradas en la ruta. Puedes entrar, salir y volver cuando quieras.</p>

      {BLOQUES.map((bloque) => (
        <section key={bloque.titulo}>
          <h2 className="mt-8 mb-3 text-sm font-bold tracking-widest text-indigo-300 uppercase">{bloque.titulo}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {bloque.estaciones.map((e, i) => {
              const ids = EJERCICIOS[e.id] ?? []
              const hechos = ids.filter((id) => progreso.hechos[id]).length
              const completa = ids.length > 0 && hechos === ids.length
              return (
                <motion.a
                  key={e.id}
                  href={`${RUTA_TEMA1}/${e.id}/entender`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                  className={`cristal flex gap-4 p-4 hover:bg-white/[0.12] ${completa ? 'border-emerald-300/70' : 'border-indigo-300/40'}`}
                >
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white shadow-lg ${
                      completa ? 'bg-gradient-to-br from-emerald-400 to-teal-600 shadow-emerald-500/40' : 'bg-gradient-to-br from-indigo-400 to-fuchsia-600 shadow-fuchsia-500/30'
                    }`}
                  >
                    {completa ? '✓' : e.num}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <b className="text-lg text-white">{e.titulo}</b>
                    <span className="text-sm text-indigo-200">{e.resumen}</span>
                    <span className="mt-2 h-2 overflow-hidden rounded-full bg-white/15">
                      <span className={`block h-full rounded-full ${completa ? 'bg-emerald-400' : 'bg-amber-300'}`} style={{ width: `${ids.length ? (100 * hechos) / ids.length : 0}%` }} />
                    </span>
                    <span className="mt-1 text-sm font-semibold text-indigo-200">
                      {hechos} de {ids.length} ejercicios de clase
                    </span>
                  </span>
                </motion.a>
              )
            })}
          </div>
        </section>
      ))}
    </>
  )
}
