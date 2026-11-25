// Inglés de 2.º ESO, Module 2: lo que va en los cuadros azules (Past Simple, la pasiva y used to), su examen y el
// simulacro del global de la 1.ª evaluación, que mezcla los Modules 1 y 2.
import type { ComponentType } from 'react'
import { motion } from 'motion/react'
import type { Progreso } from '../../../lib/progreso'
import { estrellas } from '../../../componentes/Prueba'
import { IdiomaUnidade, PREGUNTAS_PROBA, Proba, barallar, notaSobre10, type Pregunta } from '../../../primaria/pezas'
import { PREGUNTAS as P_PRESENTES } from '../presentes'
import { PREGUNTAS as P_THERE } from '../thereis'
import { PREGUNTAS as P_QUESTIONS } from '../preguntas'
import { PREGUNTAS as P_HOW } from '../howmuch'
import Pasado, { PREGUNTAS as P_PASADO } from './pasado'
import Pasiva, { HUECOS_LIBRO, PREGUNTAS as P_PASIVA } from './pasiva'
import UsedTo, { PREGUNTAS as P_USED } from './usedto'

export const RUTA_MODULE2 = '#/2eso/ingles/module2'

const PARADAS: { id: string; titulo: string; resumen: string; pagina?: number; Compoñente: ComponentType<{ ruta: string; modo?: string }> }[] = [
  { id: 'pasado', titulo: 'Past Simple', resumen: 'Regulares e irregulares, didn’t / Did…?, ortografía y there was / there were.', pagina: 31, Compoñente: Pasado },
  { id: 'pasiva', titulo: 'Present Simple Passive / Past Simple Passive', resumen: 'is/are o was/were + participio, by y de activa a pasiva.', Compoñente: Pasiva },
  { id: 'usedto', titulo: 'used to', resumen: 'Costumbres del pasado que ya no son verdad.', Compoñente: UsedTo },
]

const clave = (parada: string) => `ingles2/${parada}`

// Examen del módulo: seis preguntas de cada parada.
const BANCOS2 = [P_PASADO, [...P_PASIVA, ...HUECOS_LIBRO], P_USED]
const POR_PARADA = 6
export const PREGUNTAS_EXAME2 = POR_PARADA * BANCOS2.length
const xerarExame = (): Pregunta[] => barallar(BANCOS2.flatMap((banco) => barallar(banco).slice(0, POR_PARADA)))

// Simulacro del global: lo de los dos módulos, cuatro preguntas de cada parada del Module 1 y cinco del Module 2.
const BANCOS1 = [P_PRESENTES, P_THERE, P_QUESTIONS, P_HOW]
export const PREGUNTAS_GLOBAL = 4 * BANCOS1.length + 5 * BANCOS2.length
const xerarGlobal = (): Pregunta[] => barallar([...BANCOS1.flatMap((b) => barallar(b).slice(0, 4)), ...BANCOS2.flatMap((b) => barallar(b).slice(0, 5))])

export function avanceModule2(progreso: Progreso): string {
  const n = PARADAS.reduce((t, p) => t + estrellas(progreso.pruebas[clave(p.id)], PREGUNTAS_PROBA), 0)
  return `★ ${n} de ${PARADAS.length * 3} estrellas`
}

function Mision({ href, icono, titulo, texto, mejor, total }: { href: string; icono: string; titulo: string; texto: string; mejor?: number; total: number }) {
  return (
    <motion.a href={href} whileHover={{ y: -4 }} className="cristal flex items-center gap-4 border-amber-300/70 p-4 hover:bg-white/[0.12]">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-600 text-2xl shadow-lg shadow-orange-500/30" aria-hidden="true">
        {icono}
      </span>
      <span className="flex flex-col">
        <b className="text-lg text-white">{titulo}</b>
        <span className="text-sm text-indigo-200">{texto}</span>
        {mejor !== undefined && <span className="mt-1 text-sm font-semibold text-amber-200">Tu mejor nota: {String(notaSobre10(mejor, total)).replace('.', ',')}</span>}
      </span>
    </motion.a>
  )
}

function Mapa({ progreso }: { progreso: Progreso }) {
  return (
    <>
      <h1 className="text-3xl font-bold text-white">Module 2 · Inglés</h1>
      <p className="mt-1 text-indigo-200">Los cuadros azules del Module 2. En el global entran el Module 1 y el Module 2. Cada frase en inglés tiene 🔊 para oírla.</p>
      <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 font-bold text-amber-200">{avanceModule2(progreso)}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {PARADAS.map((p, i) => {
          const n = estrellas(progreso.pruebas[clave(p.id)], PREGUNTAS_PROBA)
          return (
            <motion.a
              key={p.id}
              href={`${RUTA_MODULE2}/${p.id}/descubre`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="cristal flex gap-4 border-indigo-300/50 p-4 hover:bg-white/[0.12]"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 text-xl font-black text-white shadow-lg shadow-indigo-500/30">
                {i + 1}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="flex flex-wrap items-center justify-between gap-x-2">
                  <b className="text-lg text-white" lang="en">
                    {p.titulo}
                  </b>
                  <span className="text-lg" role="img" aria-label={`${n} de 3 estrellas`}>
                    <span className="text-amber-300">{'★'.repeat(n)}</span>
                    <span className="text-white/20">{'★'.repeat(3 - n)}</span>
                  </span>
                </span>
                <span className="text-sm text-indigo-200">{p.resumen}</span>
                {p.pagina && <span className="mt-1 text-sm font-semibold text-indigo-300">Libro, página {p.pagina}</span>}
              </span>
            </motion.a>
          )
        })}
      </div>
      <h2 className="mt-8 mb-3 text-sm font-bold tracking-widest text-indigo-300 uppercase">Misiones finales</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <Mision href={`${RUTA_MODULE2}/examen`} icono="🚀" titulo="Examen del Module 2" texto={`${PREGUNTAS_EXAME2} preguntas, seis de cada parada, con nota sobre 10.`} mejor={progreso.pruebas[clave('examen')]} total={PREGUNTAS_EXAME2} />
        <Mision href={`${RUTA_MODULE2}/global`} icono="🏆" titulo="Simulacro del global" texto={`${PREGUNTAS_GLOBAL} preguntas de los Modules 1 y 2 mezclados, con nota sobre 10.`} mejor={progreso.pruebas[clave('global')]} total={PREGUNTAS_GLOBAL} />
      </div>
      <p className="mt-4 text-sm text-indigo-200">
        Para repasar el Module 1: <a href="#/2eso/ingles/module1" className="font-semibold text-amber-200 underline">Present Simple/Continuous, There is/are, Subject/Object questions y How much/many…</a>
      </p>
    </>
  )
}

export default function Module2({ parada, modo, progreso }: { parada?: string; modo?: string; progreso: Progreso }) {
  const P = PARADAS.find((p) => p.id === parada)?.Compoñente
  const examen = parada === 'examen' || parada === 'global'
  return (
    <IdiomaUnidade idioma="es" falar="en-GB">
      {examen ? (
        <div className="tablero">
          <a href={RUTA_MODULE2} className="text-lg font-semibold text-violet-700">
            ← Mapa de la unidad
          </a>
          <h1 className="mt-2 mb-5 text-3xl font-black text-slate-800 sm:text-4xl">{parada === 'global' ? 'Simulacro del global · Modules 1 y 2' : 'Examen del Module 2'}</h1>
          <Proba key={parada} id={clave(parada)} xerar={parada === 'global' ? xerarGlobal : xerarExame} />
        </div>
      ) : P ? (
        <div className="tablero">
          <P key={parada} ruta={`${RUTA_MODULE2}/${parada}`} modo={modo} />
        </div>
      ) : (
        <Mapa progreso={progreso} />
      )}
    </IdiomaUnidade>
  )
}
