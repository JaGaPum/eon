// Tecnología 2.º ESO, tema 1 «Electricidad»: examen de ejercicios y problemas.
import type { ComponentType } from 'react'
import { motion } from 'motion/react'
import type { Progreso } from '../../lib/progreso'
import { estrellas } from '../../componentes/Prueba'
import { IdiomaUnidade, PREGUNTAS_PROBA, Proba, barallar, notaSobre10, type Pregunta } from '../../primaria/pezas'
import { Carga, Circuitos, Esquemas, Hilos, Ohm, PREGUNTAS_ELECTRICIDAD } from './paradas'

export const RUTA_ELECTRICIDAD = '#/2eso/tecnoloxia/electricidad'

export const PARADAS: { id: string; titulo: string; resumen: string; ejercicios: string; icono: string; Componente: ComponentType<{ ruta: string; modo?: string }> }[] = [
  { id: 'carga', titulo: 'Carga e intensidad', resumen: 'I = Q / t, minutos a segundos y electrones a culombios.', ejercicios: 'Ejercicios 2, 3 y 14 a 17', icono: '⚡', Componente: Carga },
  { id: 'ohm', titulo: 'La ley de Ohm', resumen: 'El triángulo V = I · R para calcular I, V o R.', ejercicios: 'Ejercicios 5 a 7 y 18 a 20, y los 100 problemas', icono: '🔺', Componente: Ohm },
  { id: 'hilo', titulo: 'La resistencia de un hilo', resumen: 'R = ρ · L / s, con la sección del círculo.', ejercicios: 'Ejercicio 4', icono: '🧵', Componente: Hilos },
  { id: 'circuitos', titulo: 'Serie, paralelo y mixto', resumen: 'Resistencia equivalente simplificando dibujo a dibujo, e intensidades.', ejercicios: 'Ejercicios 8 a 11 y 21', icono: '🔌', Componente: Circuitos },
  { id: 'esquemas', titulo: 'Esquemas, símbolos y pilas', resumen: 'Los símbolos, dibujar circuitos en serie y en paralelo, y asociar pilas.', ejercicios: 'Ejercicios 1, 12 y 13', icono: '📐', Componente: Esquemas },
]

export const BANCOS: Record<string, Pregunta[]> = PREGUNTAS_ELECTRICIDAD
// Examen de prueba: más problemas de Ohm y de circuitos, que son los que más cuentan.
const CANTAS: Record<string, number> = { carga: 3, ohm: 5, hilo: 3, circuitos: 6, esquemas: 3 }
export const PREGUNTAS_EXAME = Object.values(CANTAS).reduce((a, b) => a + b, 0)
export const xerarExame = (): Pregunta[] => PARADAS.flatMap((p) => barallar(BANCOS[p.id]).slice(0, CANTAS[p.id]))

const clave = (parada: string) => `electricidad/${parada}`

export function avanceElectricidad(progreso: Progreso): string {
  const n = PARADAS.reduce((t, p) => t + estrellas(progreso.pruebas[clave(p.id)], PREGUNTAS_PROBA), 0)
  return `★ ${n} de ${PARADAS.length * 3} estrellas`
}

function Mapa({ progreso }: { progreso: Progreso }) {
  const mejor = progreso.pruebas[clave('exame')]
  return (
    <>
      <h1 className="text-3xl font-bold text-white">Tema 1 · Electricidad</h1>
      <p className="mt-1 text-indigo-200">El examen es de ejercicios y problemas. En cada parada: aprende con ejemplos resueltos, resuelve conmigo paso a paso y, al final, tú solo.</p>
      <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 font-bold text-amber-200">{avanceElectricidad(progreso)}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {PARADAS.map((p, i) => {
          const n = estrellas(progreso.pruebas[clave(p.id)], PREGUNTAS_PROBA)
          return (
            <motion.a
              key={p.id}
              href={`${RUTA_ELECTRICIDAD}/${p.id}/descubre`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="cristal flex gap-4 border-yellow-300/50 p-4 hover:bg-white/[0.12]"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 to-orange-600 text-2xl shadow-lg shadow-orange-500/30" aria-hidden="true">
                {p.icono}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="flex flex-wrap items-center justify-between gap-x-2">
                  <b className="text-lg text-white">
                    {i + 1}. {p.titulo}
                  </b>
                  <span className="text-lg" role="img" aria-label={`${n} de 3 estrellas`}>
                    <span className="text-amber-300">{'★'.repeat(n)}</span>
                    <span className="text-white/20">{'★'.repeat(3 - n)}</span>
                  </span>
                </span>
                <span className="text-sm text-indigo-200">{p.resumen}</span>
                <span className="mt-1 text-sm font-semibold text-indigo-300">{p.ejercicios}</span>
              </span>
            </motion.a>
          )
        })}
      </div>
      <h2 className="mt-8 mb-3 text-sm font-bold tracking-widest text-indigo-300 uppercase">Misión final</h2>
      <motion.a href={`${RUTA_ELECTRICIDAD}/exame`} whileHover={{ y: -4 }} className="cristal flex items-center gap-4 border-amber-300/70 p-4 hover:bg-white/[0.12]">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-600 text-2xl shadow-lg shadow-orange-500/30" aria-hidden="true">
          🚀
        </span>
        <span className="flex flex-col">
          <b className="text-lg text-white">Examen de prueba</b>
          <span className="text-sm text-indigo-200">{PREGUNTAS_EXAME} ejercicios y problemas de todo el tema, con nota sobre 10.</span>
          {mejor !== undefined && <span className="mt-1 text-sm font-semibold text-amber-200">Tu mejor nota: {String(notaSobre10(mejor, PREGUNTAS_EXAME)).replace('.', ',')}</span>}
        </span>
      </motion.a>
    </>
  )
}

export default function Electricidad({ parada, modo, progreso }: { parada?: string; modo?: string; progreso: Progreso }) {
  const P = PARADAS.find((p) => p.id === parada)?.Componente
  return (
    <IdiomaUnidade idioma="es" guia="cohete">
      {parada === 'exame' ? (
        <div className="tablero">
          <a href={RUTA_ELECTRICIDAD} className="text-lg font-semibold text-violet-700">
            ← Mapa de la unidad
          </a>
          <h1 className="mt-2 mb-5 text-3xl font-black text-slate-800 sm:text-4xl">Examen de prueba</h1>
          <Proba id={clave('exame')} xerar={xerarExame} />
        </div>
      ) : P ? (
        <div className="tablero">
          <P key={parada} ruta={`${RUTA_ELECTRICIDAD}/${parada}`} modo={modo} />
        </div>
      ) : (
        <Mapa progreso={progreso} />
      )}
    </IdiomaUnidade>
  )
}
