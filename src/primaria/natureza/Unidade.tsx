// Ciencias da Natureza de 3.º (Olivia), unidade 1: «O planeta da vida». Páxinas 6 a 21 do libro.
import type { ComponentType } from 'react'
import { motion } from 'motion/react'
import type { Progreso } from '../../lib/progreso'
import { estrellas } from '../../componentes/Prueba'
import { IdiomaUnidade, PREGUNTAS_PROBA, Proba, barallar, notaSobre10, type Pregunta } from '../pezas'
import { Biodiversidade, Fungos, Microscopico, PREGUNTAS_PLANETA, Protistas, Reinos, SerVivo } from './paradas'

export const RUTA_PLANETA = '#/3primaria/ciencias-natureza/planeta'

export const PARADAS: { id: string; titulo: string; resumen: string; paxinas: string; icono: string; Compoñente: ComponentType<{ ruta: string; modo?: string }> }[] = [
  { id: 'servivo', titulo: 'Que é un ser vivo?', resumen: 'As tres funcións vitais e as células: unicelulares e pluricelulares.', paxinas: '6 a 9', icono: '🐇', Compoñente: SerVivo },
  { id: 'reinos', titulo: 'Os reinos da vida', resumen: 'Plantas, animais, fungos, bacterias e protistas.', paxinas: '10 e 11', icono: '👑', Compoñente: Reinos },
  { id: 'fungos', titulo: 'Os fungos', resumen: 'Con cogomelo, mofos e fermentos. Para que serven.', paxinas: '12 e 13', icono: '🍄', Compoñente: Fungos },
  { id: 'protistas', titulo: 'Os protistas e as bacterias', resumen: 'Protozoos, algas e bacterias, boas e malas.', paxinas: '14 e 15', icono: '🦠', Compoñente: Protistas },
  { id: 'biodiversidade', titulo: 'A biodiversidade e o iogur', resumen: 'Avaliar a biodiversidade e facer iogur con bacterias.', paxinas: '16 e 17', icono: '🌳', Compoñente: Biodiversidade },
  { id: 'microscopico', titulo: 'Un mundo microscópico', resumen: 'Leeuwenhoek, adiviña o reino e os carteis.', paxinas: '18 a 21', icono: '🔬', Compoñente: Microscopico },
]

export const BANCOS: Record<string, Pregunta[]> = PREGUNTAS_PLANETA
// Exame de proba: 3 preguntas de cada parada.
const CANTAS = 3
export const PREGUNTAS_EXAME = PARADAS.length * CANTAS
export const xerarExame = (): Pregunta[] => PARADAS.flatMap((p) => barallar(BANCOS[p.id]).slice(0, CANTAS))

const clave = (parada: string) => `planeta/${parada}`

export function avancePlaneta(progreso: Progreso): string {
  const n = PARADAS.reduce((t, p) => t + estrellas(progreso.pruebas[clave(p.id)], PREGUNTAS_PROBA), 0)
  return `★ ${n} de ${PARADAS.length * 3} estrelas`
}

function Mapa({ progreso }: { progreso: Progreso }) {
  const mellor = progreso.pruebas[clave('exame')]
  return (
    <>
      <h1 className="text-3xl font-bold text-white">O planeta da vida</h1>
      <p className="mt-1 text-lg text-indigo-200">Seis paradas. Podes entrar, saír e volver cando queiras. Ao final, o exame de proba!</p>
      <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-lg font-bold text-amber-200">{avancePlaneta(progreso)}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {PARADAS.map((p, i) => {
          const n = estrellas(progreso.pruebas[clave(p.id)], PREGUNTAS_PROBA)
          return (
            <motion.a
              key={p.id}
              href={`${RUTA_PLANETA}/${p.id}/descubre`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="cristal flex gap-4 border-emerald-300/50 p-4 hover:bg-white/[0.12]"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 text-2xl shadow-lg shadow-emerald-500/30" aria-hidden="true">
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
                <span className="mt-1 text-sm font-semibold text-indigo-300">Libro, páxinas {p.paxinas}</span>
              </span>
            </motion.a>
          )
        })}
      </div>
      <h2 className="mt-8 mb-3 text-sm font-bold tracking-widest text-indigo-300 uppercase">Misión final</h2>
      <motion.a href={`${RUTA_PLANETA}/exame`} whileHover={{ y: -4 }} className="cristal flex items-center gap-4 border-amber-300/70 p-4 hover:bg-white/[0.12]">
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

export default function Planeta({ parada, modo, progreso }: { parada?: string; modo?: string; progreso: Progreso }) {
  const P = PARADAS.find((p) => p.id === parada)?.Compoñente
  return (
    <IdiomaUnidade idioma="gl" guia="estrela">
      {parada === 'exame' ? (
        <div className="tablero">
          <a href={RUTA_PLANETA} className="text-lg font-semibold text-violet-700">
            ← Mapa da unidade
          </a>
          <h1 className="mt-2 mb-5 text-3xl font-black text-slate-800 sm:text-4xl">Exame de proba</h1>
          <Proba id={clave('exame')} xerar={xerarExame} />
        </div>
      ) : P ? (
        <div className="tablero">
          <P key={parada} ruta={`${RUTA_PLANETA}/${parada}`} modo={modo} />
        </div>
      ) : (
        <Mapa progreso={progreso} />
      )}
    </IdiomaUnidade>
  )
}
