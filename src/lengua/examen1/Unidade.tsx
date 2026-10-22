// Lengua Castellana 2.º ESO: parcial del 23 de octubre. Entran los recuadros azules de las páginas 8, 10, 11, 22 y 23
// del cuaderno, en el orden de las páginas.
import type { ComponentType } from 'react'
import { motion } from 'motion/react'
import type { Progreso } from '../../lib/progreso'
import { estrellas } from '../../componentes/Prueba'
import { IdiomaUnidade, PREGUNTAS_PROBA, Proba, barallar, notaSobre10, type Pregunta } from '../../primaria/pezas'
import { Acentuacion, Funciones, PREGUNTAS_LENGUA1, Significado, Silaba, Unidades } from './paradas'

export const RUTA_LENGUA1 = '#/2eso/lengua-castellana/lengua1'

export const PARADAS: { id: string; titulo: string; resumen: string; bloque: string; icono: string; Compoñente: ComponentType<{ ruta: string; modo?: string }> }[] = [
  { id: 'funciones', titulo: 'Las funciones del lenguaje', resumen: 'Referencial, expresiva, conativa, fática, poética y metalingüística (página 8).', bloque: 'Unidad 1', icono: '💬', Compoñente: Funciones },
  { id: 'silaba', titulo: 'La sílaba. Diptongo, triptongo e hiato', resumen: 'Dividir en sílabas y vocales abiertas y cerradas (página 10).', bloque: 'Unidad 1', icono: '✂️', Compoñente: Silaba },
  { id: 'unidades', titulo: 'La lengua y sus unidades', resumen: 'Fonema, morfema, palabra, enunciado y texto (página 11).', bloque: 'Unidad 1', icono: '🧱', Compoñente: Unidades },
  { id: 'acentuacion', titulo: 'Las reglas de acentuación', resumen: 'Agudas, llanas y esdrújulas; tildes en diptongos e hiatos (página 22).', bloque: 'Unidad 2', icono: '✍️', Compoñente: Acentuacion },
  { id: 'significado', titulo: 'La palabra. Significado y sentido', resumen: 'Denotativo y connotativo, literal y figurado, monosémicas y polisémicas (página 23).', bloque: 'Unidad 2', icono: '📖', Compoñente: Significado },
]

export const BANCOS: Record<string, Pregunta[]> = PREGUNTAS_LENGUA1
// Simulacro: 4 preguntas de cada parada.
const CANTAS = 4
export const PREGUNTAS_EXAME = PARADAS.length * CANTAS
export const xerarExame = (): Pregunta[] => PARADAS.flatMap((p) => barallar(BANCOS[p.id]).slice(0, CANTAS))

const clave = (parada: string) => `lengua1/${parada}`

export function avanceLengua1(progreso: Progreso): string {
  const n = PARADAS.reduce((t, p) => t + estrellas(progreso.pruebas[clave(p.id)], PREGUNTAS_PROBA), 0)
  return `★ ${n} de ${PARADAS.length * 3} estrellas`
}

function Mapa({ progreso }: { progreso: Progreso }) {
  const mellor = progreso.pruebas[clave('exame')]
  return (
    <>
      <h1 className="text-3xl font-bold text-white">Parcial · Lengua Castellana</h1>
      <p className="mt-1 text-indigo-200">Los recuadros azules de las páginas 8, 10, 11, 22 y 23. El examen es el viernes 23 de octubre.</p>
      <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 font-bold text-amber-200">{avanceLengua1(progreso)}</p>
      {['Unidad 1', 'Unidad 2'].map((bloque) => (
        <section key={bloque}>
          <h2 className="mt-8 mb-3 text-sm font-bold tracking-widest text-indigo-300 uppercase">{bloque}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {PARADAS.filter((p) => p.bloque === bloque).map((p, i) => {
              const n = estrellas(progreso.pruebas[clave(p.id)], PREGUNTAS_PROBA)
              return (
                <motion.a
                  key={p.id}
                  href={`${RUTA_LENGUA1}/${p.id}/descubre`}
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
      <motion.a href={`${RUTA_LENGUA1}/exame`} whileHover={{ y: -4 }} className="cristal flex items-center gap-4 border-amber-300/70 p-4 hover:bg-white/[0.12]">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-600 text-2xl shadow-lg shadow-orange-500/30" aria-hidden="true">
          🚀
        </span>
        <span className="flex flex-col">
          <b className="text-lg text-white">Simulacro del examen</b>
          <span className="text-sm text-indigo-200">{PREGUNTAS_EXAME} preguntas de todo lo que entra, con nota sobre 10.</span>
          {mellor !== undefined && <span className="mt-1 text-sm font-semibold text-amber-200">Tu mejor nota: {String(notaSobre10(mellor, PREGUNTAS_EXAME)).replace('.', ',')}</span>}
        </span>
      </motion.a>
    </>
  )
}

export default function Lengua1({ parada, modo, progreso }: { parada?: string; modo?: string; progreso: Progreso }) {
  const P = PARADAS.find((p) => p.id === parada)?.Compoñente
  return (
    <IdiomaUnidade idioma="es" guia="cohete">
      {parada === 'exame' ? (
        <div className="tablero">
          <a href={RUTA_LENGUA1} className="text-lg font-semibold text-violet-700">
            ← Mapa de la unidad
          </a>
          <h1 className="mt-2 mb-5 text-3xl font-black text-slate-800 sm:text-4xl">Simulacro del examen</h1>
          <Proba id={clave('exame')} xerar={xerarExame} />
        </div>
      ) : P ? (
        <div className="tablero">
          <P key={parada} ruta={`${RUTA_LENGUA1}/${parada}`} modo={modo} />
        </div>
      ) : (
        <Mapa progreso={progreso} />
      )}
    </IdiomaUnidade>
  )
}
