// Lengua Castellana 2.º ESO, global de la 1.ª evaluación: lo nuevo (lenguas de España, el español en el mundo, niveles,
// relaciones semánticas, actividades de funciones y el resumen) y un simulacro que lo mezcla con lo del parcial.
import type { ComponentType } from 'react'
import { motion } from 'motion/react'
import type { Progreso } from '../../lib/progreso'
import { estrellas } from '../../componentes/Prueba'
import { IdiomaUnidade, PREGUNTAS_PROBA, Proba, barallar, notaSobre10, type Pregunta } from '../../primaria/pezas'
import { BANCOS as BANCOS1, PARADAS as PARADAS1, RUTA_LENGUA1 } from '../examen1/Unidade'
import { Funciones2, Lenguas, Mundo, Niveles, PREGUNTAS_LENGUA2, Resumen, Semantica } from './paradas'

export const RUTA_LENGUA2 = '#/2eso/lengua-castellana/lengua2'

const PARADAS: { id: string; titulo: string; resumen: string; icono: string; Compoñente: ComponentType<{ ruta: string; modo?: string }> }[] = [
  { id: 'lenguas', titulo: 'Lenguaje, lengua y habla. Las lenguas de España', resumen: 'Historia, lenguas cooficiales, variedades del castellano, bilingüismo y diglosia.', icono: '🗣️', Compoñente: Lenguas },
  { id: 'mundo', titulo: 'El español en el mundo y de América', resumen: 'Seseo, yeísmo, voseo, lenguas indígenas y quinientos millones de hablantes.', icono: '🌎', Compoñente: Mundo },
  { id: 'niveles', titulo: 'Los niveles del lenguaje y las jergas', resumen: 'Culto, estándar, coloquial y vulgar; vulgarismos, tecnicismos y jergas.', icono: '🎚️', Compoñente: Niveles },
  { id: 'semantica', titulo: 'Relaciones semánticas', resumen: 'Sinónimos, antónimos, hiperónimos, monosemia, polisemia y homonimia (páginas 158 y 159).', icono: '🔀', Compoñente: Semantica },
  { id: 'funciones', titulo: 'Funciones del lenguaje: las actividades', resumen: 'Los mensajes de la página 45, Platero y el esquema (la del código es metalingüística).', icono: '💬', Compoñente: Funciones2 },
  { id: 'resumen', titulo: 'Cómo hacer un buen resumen', resumen: 'Leer, subrayar, esquema y redactar sin opinar ni empezar por «Este texto».', icono: '📝', Compoñente: Resumen },
]

// Simulacro: tres preguntas de cada parada nueva y tres de cada parada del parcial.
const POR_PARADA = 3
export const PREGUNTAS_GLOBAL = POR_PARADA * (PARADAS.length + PARADAS1.length)
const xerarGlobal = (): Pregunta[] => [...PARADAS.flatMap((p) => barallar(PREGUNTAS_LENGUA2[p.id]).slice(0, POR_PARADA)), ...PARADAS1.flatMap((p) => barallar(BANCOS1[p.id]).slice(0, POR_PARADA))]

const clave = (parada: string) => `lengua2/${parada}`

export function avanceLengua2(progreso: Progreso): string {
  const n = PARADAS.reduce((t, p) => t + estrellas(progreso.pruebas[clave(p.id)], PREGUNTAS_PROBA), 0)
  return `★ ${n} de ${PARADAS.length * 3} estrellas`
}

function Tarjeta({ href, icono, titulo, resumen, n }: { href: string; icono: string; titulo: string; resumen: string; n?: number }) {
  return (
    <motion.a href={href} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4 }} className="cristal flex gap-4 border-indigo-300/50 p-4 hover:bg-white/[0.12]">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 text-2xl shadow-lg shadow-indigo-500/30" aria-hidden="true">
        {icono}
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="flex flex-wrap items-center justify-between gap-x-2">
          <b className="text-lg text-white">{titulo}</b>
          {n !== undefined && (
            <span className="text-lg" role="img" aria-label={`${n} de 3 estrellas`}>
              <span className="text-amber-300">{'★'.repeat(n)}</span>
              <span className="text-white/20">{'★'.repeat(3 - n)}</span>
            </span>
          )}
        </span>
        <span className="text-sm text-indigo-200">{resumen}</span>
      </span>
    </motion.a>
  )
}

function Mapa({ progreso }: { progreso: Progreso }) {
  const mejor = progreso.pruebas[clave('global')]
  return (
    <>
      <h1 className="text-3xl font-bold text-white">Global de la 1.ª evaluación · Lengua Castellana</h1>
      <p className="mt-1 text-indigo-200">Todo lo que entra: lo nuevo aquí y lo del parcial abajo. El examen es el viernes 27 de noviembre.</p>
      <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 font-bold text-amber-200">{avanceLengua2(progreso)}</p>
      <h2 className="mt-8 mb-3 text-sm font-bold tracking-widest text-indigo-300 uppercase">Lo nuevo</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {PARADAS.map((p, i) => (
          <Tarjeta key={p.id} href={`${RUTA_LENGUA2}/${p.id}/descubre`} icono={p.icono} titulo={`${i + 1}. ${p.titulo}`} resumen={p.resumen} n={estrellas(progreso.pruebas[clave(p.id)], PREGUNTAS_PROBA)} />
        ))}
      </div>
      <h2 className="mt-8 mb-3 text-sm font-bold tracking-widest text-indigo-300 uppercase">Lo del parcial (también entra)</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {PARADAS1.map((p) => (
          <Tarjeta key={p.id} href={`${RUTA_LENGUA1}/${p.id}/descubre`} icono={p.icono} titulo={p.titulo} resumen={p.resumen} n={estrellas(progreso.pruebas[`lengua1/${p.id}`], PREGUNTAS_PROBA)} />
        ))}
      </div>
      <h2 className="mt-8 mb-3 text-sm font-bold tracking-widest text-indigo-300 uppercase">Misión final</h2>
      <motion.a href={`${RUTA_LENGUA2}/global`} whileHover={{ y: -4 }} className="cristal flex items-center gap-4 border-amber-300/70 p-4 hover:bg-white/[0.12]">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-600 text-2xl shadow-lg shadow-orange-500/30" aria-hidden="true">
          🏆
        </span>
        <span className="flex flex-col">
          <b className="text-lg text-white">Simulacro del global</b>
          <span className="text-sm text-indigo-200">{PREGUNTAS_GLOBAL} preguntas de todo lo que entra, mezcladas, con nota sobre 10.</span>
          {mejor !== undefined && <span className="mt-1 text-sm font-semibold text-amber-200">Tu mejor nota: {String(notaSobre10(mejor, PREGUNTAS_GLOBAL)).replace('.', ',')}</span>}
        </span>
      </motion.a>
    </>
  )
}

export default function Lengua2({ parada, modo, progreso }: { parada?: string; modo?: string; progreso: Progreso }) {
  const P = PARADAS.find((p) => p.id === parada)?.Compoñente
  return (
    <IdiomaUnidade idioma="es" guia="cohete">
      {parada === 'global' ? (
        <div className="tablero">
          <a href={RUTA_LENGUA2} className="text-lg font-semibold text-violet-700">
            ← Mapa de la unidad
          </a>
          <h1 className="mt-2 mb-5 text-3xl font-black text-slate-800 sm:text-4xl">Simulacro del global</h1>
          <Proba id={clave('global')} xerar={xerarGlobal} />
        </div>
      ) : P ? (
        <div className="tablero">
          <P key={parada} ruta={`${RUTA_LENGUA2}/${parada}`} modo={modo} />
        </div>
      ) : (
        <Mapa progreso={progreso} />
      )}
    </IdiomaUnidade>
  )
}
