// Lingua Galega 2.º ESO, global da 1.ª avaliación: o que pide a profesora (texto descritivo e narrativo, variedades
// e bloques, o adxectivo, as relacións semánticas, a acentuación e o vocabulario) e un simulacro que mestura as unidades 1 e 2.
import type { ComponentType } from 'react'
import { motion } from 'motion/react'
import type { Progreso } from '../../../lib/progreso'
import { estrellas } from '../../../componentes/Prueba'
import { IdiomaUnidade, PREGUNTAS_PROBA, Proba, barallar, notaSobre10, type Pregunta } from '../../../primaria/pezas'
import { PREGUNTAS_TEXTOS } from '../textos'
import { PREGUNTAS_ACENTOS } from '../acentos'
import { RUTA_GALEGO1 } from '../Unidade'
import { Descricion2, Narracion, PREGUNTAS_TEXTOS2 } from './textos'
import { Adxectivo, Bloques, PREGUNTAS_LINGUA2, Semantica, Variedades, Vocabulario } from './lingua'

export const RUTA_GALEGO2 = '#/2eso/lingua-galega/galego2'

const PARADAS: { id: string; titulo: string; resumen: string; bloque: string; Compoñente: ComponentType<{ ruta: string; modo?: string }> }[] = [
  { id: 'descricion', titulo: 'Tipos de descrición e de texto', resumen: 'Prosopografía, etopea, retrato, topografía… e os cinco tipos de texto.', bloque: 'O texto', Compoñente: Descricion2 },
  { id: 'narracion', titulo: 'A narración', resumen: 'Narrador, personaxes, espazo, tempo e acción, co conto «O tigre enfermo».', bloque: 'O texto', Compoñente: Narracion },
  { id: 'variedades', titulo: 'Variedades, niveis e rexistros', resumen: 'Lingua estándar, os catro factores, as frases feitas e o príncipe Tanis.', bloque: 'A lingua por dentro', Compoñente: Variedades },
  { id: 'bloques', titulo: 'Os bloques dialectais', resumen: 'Occidental, central e oriental: o boletín 2 resolto.', bloque: 'A lingua por dentro', Compoñente: Bloques },
  { id: 'adxectivo', titulo: 'O adxectivo', resumen: 'Xénero e número, graos, superlativos, tipos e colocación.', bloque: 'A lingua por dentro', Compoñente: Adxectivo },
  { id: 'semantica', titulo: 'Homónimas, parónimas e falsos amigos', resumen: 'E as palabras que cambian co til ou co b / v.', bloque: 'A lingua por dentro', Compoñente: Semantica },
  { id: 'vocabulario', titulo: 'Vocabulario e castelanismos', resumen: 'O corpo, o pé e a perna, as aves e os 20 castelanismos.', bloque: 'A lingua por dentro', Compoñente: Vocabulario },
]

const BANCOS2: Record<string, Pregunta[]> = { ...PREGUNTAS_TEXTOS2, ...PREGUNTAS_LINGUA2 }
// Simulacro do global: tres preguntas de cada parada da unidade 2, dúas de tema, resumo e definir e tres de cada parada de acentuación.
const UNIDADE1: [Pregunta[], number][] = [
  [PREGUNTAS_TEXTOS.tema, 2],
  [PREGUNTAS_TEXTOS.resumo, 2],
  [PREGUNTAS_TEXTOS.definir, 2],
  [PREGUNTAS_ACENTOS.acentuacion, 3],
  [PREGUNTAS_ACENTOS.diacriticos, 3],
]
const POR_PARADA = 3
export const PREGUNTAS_GLOBAL = POR_PARADA * PARADAS.length + UNIDADE1.reduce((t, [, n]) => t + n, 0)
const xerarGlobal = (): Pregunta[] => [...PARADAS.flatMap((p) => barallar(BANCOS2[p.id]).slice(0, POR_PARADA)), ...UNIDADE1.flatMap(([banco, n]) => barallar(banco).slice(0, n))]

const clave = (parada: string) => `galego2/${parada}`

export function avanceGalego2(progreso: Progreso): string {
  const n = PARADAS.reduce((t, p) => t + estrellas(progreso.pruebas[clave(p.id)], PREGUNTAS_PROBA), 0)
  return `★ ${n} de ${PARADAS.length * 3} estrelas`
}

function Tarxeta({ href, num, titulo, resumen, n }: { href: string; num: number | string; titulo: string; resumen: string; n?: number }) {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="cristal flex gap-4 border-indigo-300/50 p-4 hover:bg-white/[0.12]"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 text-xl font-black text-white shadow-lg shadow-indigo-500/30">
        {num}
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="flex flex-wrap items-center justify-between gap-x-2">
          <b className="text-lg text-white">{titulo}</b>
          {n !== undefined && (
            <span className="text-lg" role="img" aria-label={`${n} de 3 estrelas`}>
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
  const mellor = progreso.pruebas[clave('global')]
  return (
    <>
      <h1 className="text-3xl font-bold text-white">Global da 1.ª avaliación · Lingua Galega</h1>
      <p className="mt-1 text-indigo-200">O que dixo a profesora: un texto con preguntas e a lingua por dentro. Entran as unidades 1 e 2.</p>
      <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 font-bold text-amber-200">{avanceGalego2(progreso)}</p>
      {['O texto', 'A lingua por dentro'].map((bloque) => (
        <section key={bloque}>
          <h2 className="mt-8 mb-3 text-sm font-bold tracking-widest text-indigo-300 uppercase">{bloque}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {PARADAS.filter((p) => p.bloque === bloque).map((p) => (
              <Tarxeta key={p.id} href={`${RUTA_GALEGO2}/${p.id}/descubre`} num={PARADAS.indexOf(p) + 1} titulo={p.titulo} resumen={p.resumen} n={estrellas(progreso.pruebas[clave(p.id)], PREGUNTAS_PROBA)} />
            ))}
            {bloque === 'O texto' && <Tarxeta href={`${RUTA_GALEGO1}/tema/descubre`} num="↩" titulo="Tema, título, resumo e definir" resumen="Da unidade 1: repásao alí." />}
            {bloque !== 'O texto' && <Tarxeta href={`${RUTA_GALEGO1}/acentuacion/descubre`} num="↩" titulo="Acentuación e til diacrítico" resumen="Da unidade 1: as regras e os 28 diacríticos." />}
          </div>
        </section>
      ))}
      <h2 className="mt-8 mb-3 text-sm font-bold tracking-widest text-indigo-300 uppercase">Misión final</h2>
      <motion.a href={`${RUTA_GALEGO2}/global`} whileHover={{ y: -4 }} className="cristal flex items-center gap-4 border-amber-300/70 p-4 hover:bg-white/[0.12]">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-600 text-2xl shadow-lg shadow-orange-500/30" aria-hidden="true">
          🏆
        </span>
        <span className="flex flex-col">
          <b className="text-lg text-white">Simulacro do global</b>
          <span className="text-sm text-indigo-200">{PREGUNTAS_GLOBAL} preguntas das unidades 1 e 2 mesturadas, con nota sobre 10.</span>
          {mellor !== undefined && <span className="mt-1 text-sm font-semibold text-amber-200">A túa mellor nota: {String(notaSobre10(mellor, PREGUNTAS_GLOBAL)).replace('.', ',')}</span>}
        </span>
      </motion.a>
    </>
  )
}

export default function Galego2({ parada, modo, progreso }: { parada?: string; modo?: string; progreso: Progreso }) {
  const P = PARADAS.find((p) => p.id === parada)?.Compoñente
  return (
    <IdiomaUnidade idioma="gl" guia="cohete" modos={{ descubre: 'Aprende', xoga: 'Practica', proba: '★ Proba' }}>
      {parada === 'global' ? (
        <div className="tablero">
          <a href={RUTA_GALEGO2} className="text-lg font-semibold text-violet-700">
            ← Mapa da unidade
          </a>
          <h1 className="mt-2 mb-5 text-3xl font-black text-slate-800 sm:text-4xl">Simulacro do global</h1>
          <Proba id={clave('global')} xerar={xerarGlobal} />
        </div>
      ) : P ? (
        <div className="tablero">
          <P key={parada} ruta={`${RUTA_GALEGO2}/${parada}`} modo={modo} />
        </div>
      ) : (
        <Mapa progreso={progreso} />
      )}
    </IdiomaUnidade>
  )
}
