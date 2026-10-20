// Xeografía e Historia 2.º ESO, tema 2: o feudalismo, a sociedade estamental, o románico e o Camiño de Santiago.
// Non entra no parcial do 26 de outubro: está para ir adiantando ou para despois.
import type { ComponentType } from 'react'
import { motion } from 'motion/react'
import type { Progreso } from '../../lib/progreso'
import { estrellas } from '../../componentes/Prueba'
import { IdiomaUnidade, PREGUNTAS_PROBA, Proba, barallar, notaSobre10, type Pregunta } from '../../primaria/pezas'
import { CaminoSantiago, Estamentos, Feudalismo, PREGUNTAS_TEMA2, Romanico } from './paradas'

export const RUTA_HISTORIA2 = '#/2eso/xeografia-historia/historia2'

export const PARADAS2: { id: string; titulo: string; resumen: string; icono: string; Compoñente: ComponentType<{ ruta: string; modo?: string }> }[] = [
  { id: 'feudalismo', titulo: 'O sistema feudal', resumen: 'Antecedentes, orixe, pacto feudo-vasalático, investidura e homenaxe.', icono: '🏰', Compoñente: Feudalismo },
  { id: 'estamentos', titulo: 'A sociedade estamental', resumen: 'Nobreza, clero e non privilexiados: a pirámide feudal.', icono: '🔺', Compoñente: Estamentos },
  { id: 'romanico', titulo: 'A arte románica', resumen: 'Biblias de pedra: muros grosos, cruz latina, Pórtico da Gloria e Pantocrátor.', icono: '⛪', Compoñente: Romanico },
  { id: 'camino', titulo: 'O Camiño de Santiago', resumen: 'De Roncesvalles a Compostela: peregrinos, cidades e comercio.', icono: '🐚', Compoñente: CaminoSantiago },
]

export const BANCOS2: Record<string, Pregunta[]> = PREGUNTAS_TEMA2
const CANTAS = 5
export const PREGUNTAS_EXAME2 = PARADAS2.length * CANTAS
export const xerarExame2 = (): Pregunta[] => PARADAS2.flatMap((p) => barallar(BANCOS2[p.id]).slice(0, CANTAS))

const clave = (parada: string) => `historia2/${parada}`

export function avanceHistoria2(progreso: Progreso): string {
  const n = PARADAS2.reduce((t, p) => t + estrellas(progreso.pruebas[clave(p.id)], PREGUNTAS_PROBA), 0)
  return `★ ${n} de ${PARADAS2.length * 3} estrelas`
}

function Mapa({ progreso }: { progreso: Progreso }) {
  const mellor = progreso.pruebas[clave('exame')]
  return (
    <>
      <h1 className="text-3xl font-bold text-white">Tema 2 · O feudalismo e o románico</h1>
      <p className="mt-1 text-indigo-200">O sistema feudal, a sociedade estamental, a arte románica e o Camiño de Santiago.</p>
      <p className="mt-3 rounded-2xl border border-amber-300/60 bg-amber-300/15 px-4 py-2 text-amber-100">
        ⚠️ Este tema <b>non entra</b> no parcial do 26 de outubro. Para ese exame, estuda «Parcial 1.ª avaliación».
      </p>
      <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 font-bold text-amber-200">{avanceHistoria2(progreso)}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {PARADAS2.map((p, i) => {
          const n = estrellas(progreso.pruebas[clave(p.id)], PREGUNTAS_PROBA)
          return (
            <motion.a
              key={p.id}
              href={`${RUTA_HISTORIA2}/${p.id}/descubre`}
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
                    {i + 1}. {p.titulo}
                  </b>
                  <span className="text-lg" role="img" aria-label={`${n} de 3 estrelas`}>
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
      <h2 className="mt-8 mb-3 text-sm font-bold tracking-widest text-indigo-300 uppercase">Misión final</h2>
      <motion.a href={`${RUTA_HISTORIA2}/exame`} whileHover={{ y: -4 }} className="cristal flex items-center gap-4 border-amber-300/70 p-4 hover:bg-white/[0.12]">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-600 text-2xl shadow-lg shadow-orange-500/30" aria-hidden="true">
          🚀
        </span>
        <span className="flex flex-col">
          <b className="text-lg text-white">Simulacro do tema 2</b>
          <span className="text-sm text-indigo-200">{PREGUNTAS_EXAME2} preguntas, con nota sobre 10.</span>
          {mellor !== undefined && <span className="mt-1 text-sm font-semibold text-amber-200">A túa mellor nota: {String(notaSobre10(mellor, PREGUNTAS_EXAME2)).replace('.', ',')}</span>}
        </span>
      </motion.a>
    </>
  )
}

export default function Historia2({ parada, modo, progreso }: { parada?: string; modo?: string; progreso: Progreso }) {
  const P = PARADAS2.find((p) => p.id === parada)?.Compoñente
  return (
    <IdiomaUnidade idioma="gl" guia="cohete" modos={{ descubre: 'Aprende', xoga: 'Practica', proba: '★ Proba' }}>
      {parada === 'exame' ? (
        <div className="tablero">
          <a href={RUTA_HISTORIA2} className="text-lg font-semibold text-violet-700">
            ← Mapa da unidade
          </a>
          <h1 className="mt-2 mb-5 text-3xl font-black text-slate-800 sm:text-4xl">Simulacro do tema 2</h1>
          <Proba id={clave('exame')} xerar={xerarExame2} />
        </div>
      ) : P ? (
        <div className="tablero">
          <P key={parada} ruta={`${RUTA_HISTORIA2}/${parada}`} modo={modo} />
        </div>
      ) : (
        <Mapa progreso={progreso} />
      )}
    </IdiomaUnidade>
  )
}
