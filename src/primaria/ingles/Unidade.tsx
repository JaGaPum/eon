// Inglés de 3.º de Primaria (Olivia): unidades 1 y 2 del libro y el vocabulario de la libreta, para el examen.
import type { ComponentType } from 'react'
import { motion } from 'motion/react'
import type { Progreso } from '../../lib/progreso'
import { estrellas } from '../../componentes/Prueba'
import { IdiomaUnidade, PREGUNTAS_PROBA, Proba, barallar, notaSobre10, type Pregunta } from '../pezas'
import { Animals, Bedroom, Describe, Feelings, Libreta, PREGUNTAS_INGLES3, ThisIs } from './paradas'

export const RUTA_INGLES3 = '#/3primaria/ingles/ingles3'

export const PARADAS: { id: string; titulo: string; resumen: string; bloque: string; icono: string; Compoñente: ComponentType<{ ruta: string; modo?: string }> }[] = [
  { id: 'animals', titulo: 'Animals', resumen: 'scorpion, dolphin, snake, frog, parrot, lizard, butterfly, worm', bloque: 'Unit 1 · Animals', icono: '🦋', Compoñente: Animals },
  { id: 'describe', titulo: "It's… They're…", resumen: "It's noisy. They aren't quiet. Are they big?", bloque: 'Unit 1 · Animals', icono: '🐸', Compoñente: Describe },
  { id: 'bedroom', titulo: 'Bedroom', resumen: 'bed, rug, alarm clock, guitar, photos, speaker, cushions, lights', bloque: 'Unit 2 · Bedroom', icono: '🛏️', Compoñente: Bedroom },
  { id: 'thisis', titulo: 'This is my… These are our…', resumen: 'This is / These are, my / our, Have you got…? y in, on, under, next to', bloque: 'Unit 2 · Bedroom', icono: '🎸', Compoñente: ThisIs },
  { id: 'feelings', titulo: 'Feelings', resumen: 'energetic, bored, upset, strong, shy, brave, tired, excited', bloque: 'Mi libreta', icono: '😴', Compoñente: Feelings },
  { id: 'libreta', titulo: 'Las palabras de mi libreta', resumen: 'Todas las palabras que has apuntado, para oírlas y saber qué significan.', bloque: 'Mi libreta', icono: '📒', Compoñente: Libreta },
]

export const BANCOS: Record<string, Pregunta[]> = PREGUNTAS_INGLES3
// Simulacro: 3 preguntas de cada parada.
const CANTAS = 3
export const PREGUNTAS_EXAME = PARADAS.length * CANTAS
export const xerarExame = (): Pregunta[] => PARADAS.flatMap((p) => barallar(BANCOS[p.id]).slice(0, CANTAS))

const clave = (parada: string) => `ingles3/${parada}`

export function avanceIngles3(progreso: Progreso): string {
  const n = PARADAS.reduce((t, p) => t + estrellas(progreso.pruebas[clave(p.id)], PREGUNTAS_PROBA), 0)
  return `★ ${n} de ${PARADAS.length * 3} estrellas`
}

function Mapa({ progreso }: { progreso: Progreso }) {
  const mellor = progreso.pruebas[clave('exame')]
  return (
    <>
      <h1 className="text-3xl font-bold text-white">English · Units 1 and 2</h1>
      <p className="mt-1 text-indigo-200">Escucha, aprende a escribir las palabras y gana estrellas. Al final, ¡el examen de prueba!</p>
      <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 font-bold text-amber-200">{avanceIngles3(progreso)}</p>
      {['Unit 1 · Animals', 'Unit 2 · Bedroom', 'Mi libreta'].map((bloque) => (
        <section key={bloque}>
          <h2 className="mt-8 mb-3 text-sm font-bold tracking-widest text-indigo-300 uppercase">{bloque}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {PARADAS.filter((p) => p.bloque === bloque).map((p, i) => {
              const n = estrellas(progreso.pruebas[clave(p.id)], PREGUNTAS_PROBA)
              return (
                <motion.a
                  key={p.id}
                  href={`${RUTA_INGLES3}/${p.id}/descubre`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="cristal flex gap-4 border-indigo-300/50 p-4 hover:bg-white/[0.12]"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 text-2xl shadow-lg shadow-indigo-500/30" aria-hidden="true">
                    {p.icono}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="flex flex-wrap items-center justify-between gap-x-2">
                      <b className="text-lg text-white">
                        {PARADAS.indexOf(p) + 1}. {p.titulo}
                      </b>
                      <span className="text-lg" role="img" aria-label={`${n} de 3 estrellas`}>
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
      <motion.a href={`${RUTA_INGLES3}/exame`} whileHover={{ y: -4 }} className="cristal flex items-center gap-4 border-amber-300/70 p-4 hover:bg-white/[0.12]">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-600 text-2xl shadow-lg shadow-orange-500/30" aria-hidden="true">
          🦄
        </span>
        <span className="flex flex-col">
          <b className="text-lg text-white">Examen de prueba</b>
          <span className="text-sm text-indigo-200">{PREGUNTAS_EXAME} preguntas de todo lo que entra, con nota sobre 10.</span>
          {mellor !== undefined && <span className="mt-1 text-sm font-semibold text-amber-200">Tu mejor nota: {String(notaSobre10(mellor, PREGUNTAS_EXAME)).replace('.', ',')}</span>}
        </span>
      </motion.a>
    </>
  )
}

export default function Ingles3({ parada, modo, progreso }: { parada?: string; modo?: string; progreso: Progreso }) {
  const P = PARADAS.find((p) => p.id === parada)?.Compoñente
  return (
    <IdiomaUnidade idioma="es" falar="en-GB" guia="estrela">
      {parada === 'exame' ? (
        <div className="tablero">
          <a href={RUTA_INGLES3} className="text-lg font-semibold text-violet-700">
            ← Mapa de la unidad
          </a>
          <h1 className="mt-2 mb-5 text-3xl font-black text-slate-800 sm:text-4xl">Examen de prueba</h1>
          <Proba id={clave('exame')} xerar={xerarExame} />
        </div>
      ) : P ? (
        <div className="tablero">
          <P key={parada} ruta={`${RUTA_INGLES3}/${parada}`} modo={modo} />
        </div>
      ) : (
        <Mapa progreso={progreso} />
      )}
    </IdiomaUnidade>
  )
}
