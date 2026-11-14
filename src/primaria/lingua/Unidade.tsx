// Lingua Galega de 3.º (Olivia), unidade 2 «Somos o que comemos». Páxinas 22 a 37 do libro e a libreta.
import type { ComponentType } from 'react'
import { motion } from 'motion/react'
import type { Progreso } from '../../lib/progreso'
import { estrellas } from '../../componentes/Prueba'
import { IdiomaUnidade, PREGUNTAS_PROBA, Proba, barallar, notaSobre10, type Pregunta } from '../pezas'
import { Clases, Dicionario, Lectura, PREGUNTAS_COMEMOS, Silabas, SonK } from './paradas'

export const RUTA_COMEMOS = '#/3primaria/lingua-galega/comemos'

export const PARADAS: { id: string; titulo: string; resumen: string; paginas: string; icono: string; Componente: ComponentType<{ ruta: string; modo?: string }> }[] = [
  { id: 'lectura', titulo: 'O conto e a noticia', resumen: '«Espinacas con perexil» e a noticia das hortas.', paginas: '24 a 26 e 32 a 34', icono: '🥬', Componente: Lectura },
  { id: 'dicionario', titulo: 'O dicionario', resumen: 's., adx., v., m. e f., e como aparece cada palabra.', paginas: '27 e 36', icono: '📖', Componente: Dicionario },
  { id: 'sonk', titulo: 'O son K', resumen: 'c, qu e k. Cunquiña, vaqueiro e caquis.', paginas: '28, 29 e 36', icono: '🧀', Componente: SonK },
  { id: 'silabas', titulo: 'As sílabas', resumen: 'Contar, a sílaba tónica, o ditongo e as árbores froiteiras.', paginas: '30 e as fichas', icono: '👏', Componente: Silabas },
  { id: 'clases', titulo: 'As clases de palabras', resumen: 'Substantivos, adxectivos e verbos. E os dígrafos.', paginas: '31 e 34', icono: '🏷️', Componente: Clases },
]

export const BANCOS: Record<string, Pregunta[]> = PREGUNTAS_COMEMOS
// Exame de proba: 4 preguntas de cada parada.
const CANTAS = 4
export const PREGUNTAS_EXAME = PARADAS.length * CANTAS
export const xerarExame = (): Pregunta[] => PARADAS.flatMap((p) => barallar(BANCOS[p.id]).slice(0, CANTAS))

const clave = (parada: string) => `comemos/${parada}`

export function avanceComemos(progreso: Progreso): string {
  const n = PARADAS.reduce((t, p) => t + estrellas(progreso.pruebas[clave(p.id)], PREGUNTAS_PROBA), 0)
  return `★ ${n} de ${PARADAS.length * 3} estrelas`
}

function Mapa({ progreso }: { progreso: Progreso }) {
  const mellor = progreso.pruebas[clave('exame')]
  return (
    <>
      <h1 className="text-3xl font-bold text-white">Somos o que comemos</h1>
      <p className="mt-1 text-lg text-indigo-200">Cinco paradas. Podes entrar, saír e volver cando queiras. Ao final, o exame de proba!</p>
      <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-lg font-bold text-amber-200">{avanceComemos(progreso)}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {PARADAS.map((p, i) => {
          const n = estrellas(progreso.pruebas[clave(p.id)], PREGUNTAS_PROBA)
          return (
            <motion.a
              key={p.id}
              href={`${RUTA_COMEMOS}/${p.id}/descubre`}
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
                  <span className="text-xl" role="img" aria-label={`${n} de 3 estrelas`}>
                    <span className="text-amber-300">{'★'.repeat(n)}</span>
                    <span className="text-white/20">{'★'.repeat(3 - n)}</span>
                  </span>
                </span>
                <span className="text-indigo-200">{p.resumen}</span>
                <span className="mt-1 text-sm font-semibold text-indigo-300">Libro, páxinas {p.paginas}</span>
              </span>
            </motion.a>
          )
        })}
      </div>
      <h2 className="mt-8 mb-3 text-sm font-bold tracking-widest text-indigo-300 uppercase">Misión final</h2>
      <motion.a href={`${RUTA_COMEMOS}/exame`} whileHover={{ y: -4 }} className="cristal flex items-center gap-4 border-amber-300/70 p-4 hover:bg-white/[0.12]">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-600 text-2xl shadow-lg shadow-orange-500/30" aria-hidden="true">
          🦄
        </span>
        <span className="flex flex-col">
          <b className="text-xl text-white">Exame de proba</b>
          <span className="text-indigo-200">{PREGUNTAS_EXAME} preguntas de toda a unidade, coa nota sobre 10.</span>
          {mellor !== undefined && <span className="mt-1 text-sm font-semibold text-amber-200">A túa mellor nota: {String(notaSobre10(mellor, PREGUNTAS_EXAME)).replace('.', ',')}</span>}
        </span>
      </motion.a>
    </>
  )
}

export default function Comemos({ parada, modo, progreso }: { parada?: string; modo?: string; progreso: Progreso }) {
  const P = PARADAS.find((p) => p.id === parada)?.Componente
  return (
    <IdiomaUnidade idioma="gl" guia="estrela">
      {parada === 'exame' ? (
        <div className="tablero">
          <a href={RUTA_COMEMOS} className="text-lg font-semibold text-violet-700">
            ← Mapa da unidade
          </a>
          <h1 className="mt-2 mb-5 text-3xl font-black text-slate-800 sm:text-4xl">Exame de proba</h1>
          <Proba id={clave('exame')} xerar={xerarExame} />
        </div>
      ) : P ? (
        <div className="tablero">
          <P key={parada} ruta={`${RUTA_COMEMOS}/${parada}`} modo={modo} />
        </div>
      ) : (
        <Mapa progreso={progreso} />
      )}
    </IdiomaUnidade>
  )
}
