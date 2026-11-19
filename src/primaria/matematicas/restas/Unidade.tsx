// Matemáticas de 3.º (Olivia, Mateo González e Irene): las restas. De las hojas de la libreta: restas con llevadas,
// «Comprueba si las siguientes restas están bien realizadas» y los problemas de dos pasos.
import type { ComponentType } from 'react'
import { motion } from 'motion/react'
import type { Progreso } from '../../../lib/progreso'
import { estrellas } from '../../../componentes/Prueba'
import { IdiomaUnidade, PREGUNTAS_PROBA, Proba, barallar, notaSobre10, type Pregunta } from '../../pezas'
import { Llevadas, PREGUNTAS_LLEVADAS, PREGUNTAS_PROBLEMAS, PREGUNTAS_PRUEBA, Problemas, PruebaResta } from './paradas'

export const RUTA_RESTAS = '#/3primaria/matematicas/restas'

export const PARADAS: { id: string; titulo: string; resumen: string; paginas: string; icono: string; Componente: ComponentType<{ ruta: string; modo?: string }> }[] = [
  { id: 'llevadas', titulo: 'Restar con llevadas', resumen: 'Columna a columna: pongo un 1 delante y me llevo una.', paginas: 'Restas con llevadas', icono: '✏️', Componente: Llevadas },
  { id: 'prueba', titulo: 'La prueba de la resta', resumen: 'Resultado + número de abajo = número de arriba.', paginas: 'Comprueba si las restas están bien', icono: '🔍', Componente: PruebaResta },
  { id: 'problemas', titulo: 'Problemas de dos pasos', resumen: '¿Sumo o resto? Dos cuentas y la solución.', paginas: 'Resuelve (problemas)', icono: '🧩', Componente: Problemas },
]

export const BANCOS: Record<string, Pregunta[]> = { llevadas: PREGUNTAS_LLEVADAS, prueba: PREGUNTAS_PRUEBA, problemas: PREGUNTAS_PROBLEMAS }
// Examen de prueba: 6 preguntas de cada parada.
const CANTAS = 6
export const PREGUNTAS_EXAME = PARADAS.length * CANTAS
export const xerarExame = (): Pregunta[] => PARADAS.flatMap((p) => barallar(BANCOS[p.id]).slice(0, CANTAS))

const clave = (parada: string) => `restas/${parada}`

export function avanceRestas(progreso: Progreso): string {
  const n = PARADAS.reduce((t, p) => t + estrellas(progreso.pruebas[clave(p.id)], PREGUNTAS_PROBA), 0)
  return `★ ${n} de ${PARADAS.length * 3} estrellas`
}

function Mapa({ progreso }: { progreso: Progreso }) {
  const mejor = progreso.pruebas[clave('exame')]
  return (
    <>
      <h1 className="text-3xl font-bold text-white">Las restas</h1>
      <p className="mt-1 text-lg text-indigo-200">Tres paradas. Puedes entrar, salir y volver cuando quieras. ¡Al final, el examen de prueba!</p>
      <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-lg font-bold text-amber-200">{avanceRestas(progreso)}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {PARADAS.map((p, i) => {
          const n = estrellas(progreso.pruebas[clave(p.id)], PREGUNTAS_PROBA)
          return (
            <motion.a
              key={p.id}
              href={`${RUTA_RESTAS}/${p.id}/descubre`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="cristal flex gap-4 border-rose-300/50 p-4 hover:bg-white/[0.12]"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-fuchsia-600 text-2xl shadow-lg shadow-rose-500/30" aria-hidden="true">
                {p.icono}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="flex flex-wrap items-center justify-between gap-x-2">
                  <b className="text-xl text-white">
                    {i + 1}. {p.titulo}
                  </b>
                  <span className="text-xl" role="img" aria-label={`${n} de 3 estrellas`}>
                    <span className="text-amber-300">{'★'.repeat(n)}</span>
                    <span className="text-white/20">{'★'.repeat(3 - n)}</span>
                  </span>
                </span>
                <span className="text-indigo-200">{p.resumen}</span>
                <span className="mt-1 text-sm font-semibold text-indigo-300">Hoja: {p.paginas}</span>
              </span>
            </motion.a>
          )
        })}
      </div>
      <h2 className="mt-8 mb-3 text-sm font-bold tracking-widest text-indigo-300 uppercase">Misión final</h2>
      <motion.a href={`${RUTA_RESTAS}/exame`} whileHover={{ y: -4 }} className="cristal flex items-center gap-4 border-amber-300/70 p-4 hover:bg-white/[0.12]">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-600 text-2xl shadow-lg shadow-orange-500/30" aria-hidden="true">
          🦄
        </span>
        <span className="flex flex-col">
          <b className="text-xl text-white">Examen de prueba</b>
          <span className="text-indigo-200">{PREGUNTAS_EXAME} preguntas de toda la unidad, con nota sobre 10.</span>
          {mejor !== undefined && <span className="mt-1 text-sm font-semibold text-amber-200">Tu mejor nota: {String(notaSobre10(mejor, PREGUNTAS_EXAME)).replace('.', ',')}</span>}
        </span>
      </motion.a>
    </>
  )
}

export default function Restas({ parada, modo, progreso }: { parada?: string; modo?: string; progreso: Progreso }) {
  const P = PARADAS.find((p) => p.id === parada)?.Componente
  return (
    <IdiomaUnidade idioma="es" falar="es-ES" guia="estrela">
      {parada === 'exame' ? (
        <div className="tablero">
          <a href={RUTA_RESTAS} className="text-lg font-semibold text-violet-700">
            ← Mapa de la unidad
          </a>
          <h1 className="mt-2 mb-5 text-3xl font-black text-slate-800 sm:text-4xl">Examen de prueba</h1>
          <Proba id={clave('exame')} xerar={xerarExame} />
        </div>
      ) : P ? (
        <div className="tablero">
          <P key={parada} ruta={`${RUTA_RESTAS}/${parada}`} modo={modo} />
        </div>
      ) : (
        <Mapa progreso={progreso} />
      )}
    </IdiomaUnidade>
  )
}
