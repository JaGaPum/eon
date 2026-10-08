import { motion } from 'motion/react'
import type { Progreso } from './lib/progreso'
import { estrellas, examenAbierto, notaExamen, PREGUNTAS_PRUEBA } from './componentes/Prueba'
import { estacionesDe, preguntasExamen, useTema, type Tema } from './componentes/tema'

/** Lo que se ve de un tema en la lista de lecciones: estrellas y ejercicios de clase hechos. */
export function avanceTema(tema: Tema, progreso: Progreso): string {
  const ids = Object.values(tema.ejercicios).flat()
  const est = estacionesDe(tema)
  const conseguidas = est.reduce((t, e) => t + estrellas(progreso.pruebas[tema.prefijo + e.id], PREGUNTAS_PRUEBA), 0)
  return `★ ${conseguidas} de ${est.length * 3} · ${ids.filter((id) => progreso.hechos[id]).length} de ${ids.length} ejercicios de clase`
}

const NUMEROS = ['', 'Una', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis', 'Siete', 'Ocho', 'Nueve', 'Diez']

function EstrellasMapa({ n }: { n: number }) {
  return (
    <span className="text-lg tracking-wide" role="img" aria-label={`${n} de 3 estrellas`}>
      <span className="text-amber-300">{'★'.repeat(n)}</span>
      <span className="text-white/20">{'★'.repeat(3 - n)}</span>
    </span>
  )
}

export default function Mapa({ progreso }: { progreso: Progreso }) {
  const tema = useTema()
  const { bloques: BLOQUES, ruta: RUTA_TEMA1, titulo: TITULO, ejercicios: EJERCICIOS, prefijo } = tema
  const paradas = estacionesDe(tema).length
  const abierto = examenAbierto(tema, progreso.pruebas)
  const mejor = progreso.pruebas[prefijo + 'examen']
  const total = estacionesDe(tema).reduce((t, e) => t + estrellas(progreso.pruebas[prefijo + e.id], PREGUNTAS_PRUEBA), 0)

  return (
    <>
      <h1 className="text-3xl font-bold text-white">{TITULO}</h1>
      <p className="mt-1 text-indigo-200">{tema.intro || `${NUMEROS[paradas] ?? paradas} paradas en la ruta. Puedes entrar, salir y volver cuando quieras.`}</p>
      <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 font-bold text-amber-200">
        <span className="text-xl">★</span> {total} de {paradas * 3} estrellas
      </p>

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
                    <span className="flex flex-wrap items-center justify-between gap-x-2">
                      <b className="text-lg text-white">{e.titulo}</b>
                      <EstrellasMapa n={estrellas(progreso.pruebas[prefijo + e.id], PREGUNTAS_PRUEBA)} />
                    </span>
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

      <h2 className="mt-8 mb-3 text-sm font-bold tracking-widest text-indigo-300 uppercase">Misión final</h2>
      <motion.a
        href={`${RUTA_TEMA1}/examen`}
        whileHover={{ y: -4 }}
        className={`cristal flex items-center gap-4 p-4 hover:bg-white/[0.12] ${abierto ? 'border-amber-300/70' : 'border-dashed opacity-70'}`}
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-600 text-2xl shadow-lg shadow-orange-500/30" aria-hidden="true">
          {abierto ? '🚀' : '🔒'}
        </span>
        <span className="flex flex-col">
          <b className="text-lg text-white">Examen de todo el tema</b>
          <span className="text-sm text-indigo-200">
            {abierto ? `${preguntasExamen(tema)} preguntas, ${tema.examen[0] + tema.examen[1] === 2 ? 'dos' : 'tres'} de cada parada, con nota sobre 10.` : 'Se abre con al menos una estrella en la prueba de cada parada.'}
          </span>
          {mejor !== undefined && <span className="mt-1 text-sm font-semibold text-amber-200">Tu mejor nota: {notaExamen(tema, mejor)}</span>}
        </span>
      </motion.a>
    </>
  )
}
