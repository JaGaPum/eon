// Lengua Castellana de 3.º (Olivia), unidad 2 «¿Somos iguales?». Páginas 24 a 39 del libro y la libreta.
import type { ComponentType } from 'react'
import { motion } from 'motion/react'
import type { Progreso } from '../../lib/progreso'
import { estrellas } from '../../componentes/Prueba'
import { IdiomaUnidade, PREGUNTAS_PROBA, Proba, barallar, notaSobre10, type Pregunta } from '../pezas'
import { Antonimos, GSuave, LaOracion, PREGUNTAS_IGUALES, SujetoPredicado, Textos } from './paradas'

export const RUTA_IGUALES = '#/3primaria/lengua-castellana/iguales'

export const PARADAS: { id: string; titulo: string; resumen: string; paginas: string; icono: string; Componente: ComponentType<{ ruta: string; modo?: string }> }[] = [
  { id: 'textos', titulo: 'Los textos', resumen: 'El cuento «Todo es valioso» y el texto de los perros guía.', paginas: '26 a 28 y 34 a 36', icono: '🏺', Componente: Textos },
  { id: 'antonimos', titulo: 'Los antónimos', resumen: 'Palabras con significados contrarios: viejo y nuevo.', paginas: '29 y 38', icono: '↔️', Componente: Antonimos },
  { id: 'gsuave', titulo: 'El sonido G suave', resumen: 'g, gu y gü. Y un repaso de c y qu.', paginas: '30, 31 y 36', icono: '🐧', Componente: GSuave },
  { id: 'oracion', titulo: 'La oración', resumen: 'Qué es una oración y cómo se ordenan sus palabras.', paginas: '32 y 33', icono: '💬', Componente: LaOracion },
  { id: 'sujeto', titulo: 'Sujeto y predicado', resumen: 'De quién se dice algo y qué se dice. Uno o varios.', paginas: '32, 33 y 38', icono: '🔵', Componente: SujetoPredicado },
]

export const BANCOS: Record<string, Pregunta[]> = PREGUNTAS_IGUALES
// Examen de prueba: 4 preguntas de cada parada.
const CANTAS = 4
export const PREGUNTAS_EXAME = PARADAS.length * CANTAS
export const xerarExame = (): Pregunta[] => PARADAS.flatMap((p) => barallar(BANCOS[p.id]).slice(0, CANTAS))

const clave = (parada: string) => `iguales/${parada}`

export function avanceIguales(progreso: Progreso): string {
  const n = PARADAS.reduce((t, p) => t + estrellas(progreso.pruebas[clave(p.id)], PREGUNTAS_PROBA), 0)
  return `★ ${n} de ${PARADAS.length * 3} estrellas`
}

function Mapa({ progreso }: { progreso: Progreso }) {
  const mejor = progreso.pruebas[clave('exame')]
  return (
    <>
      <h1 className="text-3xl font-bold text-white">¿Somos iguales?</h1>
      <p className="mt-1 text-lg text-indigo-200">Cinco paradas. Puedes entrar, salir y volver cuando quieras. ¡Al final, el examen de prueba!</p>
      <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-lg font-bold text-amber-200">{avanceIguales(progreso)}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {PARADAS.map((p, i) => {
          const n = estrellas(progreso.pruebas[clave(p.id)], PREGUNTAS_PROBA)
          return (
            <motion.a
              key={p.id}
              href={`${RUTA_IGUALES}/${p.id}/descubre`}
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
                <span className="mt-1 text-sm font-semibold text-indigo-300">Libro, páginas {p.paginas}</span>
              </span>
            </motion.a>
          )
        })}
      </div>
      <h2 className="mt-8 mb-3 text-sm font-bold tracking-widest text-indigo-300 uppercase">Misión final</h2>
      <motion.a href={`${RUTA_IGUALES}/exame`} whileHover={{ y: -4 }} className="cristal flex items-center gap-4 border-amber-300/70 p-4 hover:bg-white/[0.12]">
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

export default function Iguales({ parada, modo, progreso }: { parada?: string; modo?: string; progreso: Progreso }) {
  const P = PARADAS.find((p) => p.id === parada)?.Componente
  return (
    <IdiomaUnidade idioma="es" falar="es-ES" guia="estrela">
      {parada === 'exame' ? (
        <div className="tablero">
          <a href={RUTA_IGUALES} className="text-lg font-semibold text-violet-700">
            ← Mapa de la unidad
          </a>
          <h1 className="mt-2 mb-5 text-3xl font-black text-slate-800 sm:text-4xl">Examen de prueba</h1>
          <Proba id={clave('exame')} xerar={xerarExame} />
        </div>
      ) : P ? (
        <div className="tablero">
          <P key={parada} ruta={`${RUTA_IGUALES}/${parada}`} modo={modo} />
        </div>
      ) : (
        <Mapa progreso={progreso} />
      )}
    </IdiomaUnidade>
  )
}
