// Xeografía e Historia 2.º ESO: parcial da 1.ª avaliación. Entra Roma e o tema 1 (Bizancio, o Islam e o Imperio
// carolinxio), segundo dixo o profesor. Todo en galego, coma as súas clases.
import type { ComponentType } from 'react'
import { motion } from 'motion/react'
import type { Progreso } from '../../lib/progreso'
import { estrellas } from '../../componentes/Prueba'
import { IdiomaUnidade, PREGUNTAS_PROBA, Proba, barallar, notaSobre10, type Pregunta } from '../../primaria/pezas'
import { Cidade, Etapas, Goberno, PREGUNTAS_ROMA, Romanizacion } from './roma'
import { Bizancio, Carolinxio, IdadeMedia, Islam, Islam2, PREGUNTAS_MEDIEVO } from './medievo'

export const RUTA_HISTORIA1 = '#/2eso/xeografia-historia/parcial1'

export const PARADAS: { id: string; titulo: string; resumen: string; bloque: string; icono: string; Compoñente: ComponentType<{ ruta: string; modo?: string }> }[] = [
  { id: 'etapas', titulo: 'As etapas de Roma', resumen: 'Monarquía, República e Imperio: 753, 509, 27 a.C. e 476 d.C.', bloque: 'Roma', icono: '🦅', Compoñente: Etapas },
  { id: 'goberno', titulo: 'O goberno e a sociedade', resumen: 'Senado, comicios, maxistrados e a pirámide social.', bloque: 'Roma', icono: '⚖️', Compoñente: Goberno },
  { id: 'cidade', titulo: 'A cidade romana e o legado', resumen: 'Foro, termas, cardo e decumano… e o que nos deixou Roma.', bloque: 'Roma', icono: '🏛️', Compoñente: Cidade },
  { id: 'romanizacion', titulo: 'A romanización de Hispania e Galicia', resumen: 'Tres fases de conquista, provincias, galaicos e Lucus Augusti.', bloque: 'Roma', icono: '🗺️', Compoñente: Romanizacion },
  { id: 'idademedia', titulo: 'A Idade Media e as tres civilizacións', resumen: 'Alta, Plena e Baixa Idade Media; Occidente, Bizancio e Islam.', bloque: 'Tema 1', icono: '🏰', Compoñente: IdadeMedia },
  { id: 'bizancio', titulo: 'A civilización bizantina', resumen: 'Constantinopla, Xustiniano, Santa Sofía e o Cisma de Oriente.', bloque: 'Tema 1', icono: '☦️', Compoñente: Bizancio },
  { id: 'islam', titulo: 'O Islam: orixe e doutrina', resumen: 'Mahoma, a héxira, o Corán, os cinco preceptos e a expansión.', bloque: 'Tema 1', icono: '☪️', Compoñente: Islam },
  { id: 'islam2', titulo: 'O Islam: economía, sociedade e cultura', resumen: 'Regadío, números, árabes e muladís, e as partes da mezquita.', bloque: 'Tema 1', icono: '🕌', Compoñente: Islam2 },
  { id: 'carolinxio', titulo: 'O Imperio carolinxio', resumen: 'Poitiers, Carlomagno, Aquisgrán, condados e marcas, e Verdún.', bloque: 'Tema 1', icono: '👑', Compoñente: Carolinxio },
]

export const BANCOS: Record<string, Pregunta[]> = { ...PREGUNTAS_ROMA, ...PREGUNTAS_MEDIEVO }
// Simulacro: 3 preguntas de cada parada.
const CANTAS = 3
export const PREGUNTAS_EXAME = PARADAS.length * CANTAS
export const xerarExame = (): Pregunta[] => PARADAS.flatMap((p) => barallar(BANCOS[p.id]).slice(0, CANTAS))

const clave = (parada: string) => `historia1/${parada}`

export function avanceHistoria1(progreso: Progreso): string {
  const n = PARADAS.reduce((t, p) => t + estrellas(progreso.pruebas[clave(p.id)], PREGUNTAS_PROBA), 0)
  return `★ ${n} de ${PARADAS.length * 3} estrelas`
}

function Mapa({ progreso }: { progreso: Progreso }) {
  const mellor = progreso.pruebas[clave('exame')]
  return (
    <>
      <h1 className="text-3xl font-bold text-white">Parcial da 1.ª avaliación · Xeografía e Historia</h1>
      <p className="mt-1 text-indigo-200">Roma + tema 1: Bizancio, o Islam e o Imperio carolinxio. O exame é o luns 26 de outubro.</p>
      <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 font-bold text-amber-200">{avanceHistoria1(progreso)}</p>
      {['Roma', 'Tema 1'].map((bloque) => (
        <section key={bloque}>
          <h2 className="mt-8 mb-3 text-sm font-bold tracking-widest text-indigo-300 uppercase">{bloque === 'Roma' ? 'Roma' : 'Tema 1 · Bizancio, o Islam e o Imperio carolinxio'}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {PARADAS.filter((p) => p.bloque === bloque).map((p, i) => {
              const n = estrellas(progreso.pruebas[clave(p.id)], PREGUNTAS_PROBA)
              return (
                <motion.a
                  key={p.id}
                  href={`${RUTA_HISTORIA1}/${p.id}/descubre`}
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
        </section>
      ))}
      <h2 className="mt-8 mb-3 text-sm font-bold tracking-widest text-indigo-300 uppercase">Misión final</h2>
      <motion.a href={`${RUTA_HISTORIA1}/exame`} whileHover={{ y: -4 }} className="cristal flex items-center gap-4 border-amber-300/70 p-4 hover:bg-white/[0.12]">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-600 text-2xl shadow-lg shadow-orange-500/30" aria-hidden="true">
          🚀
        </span>
        <span className="flex flex-col">
          <b className="text-lg text-white">Simulacro do exame</b>
          <span className="text-sm text-indigo-200">{PREGUNTAS_EXAME} preguntas de todo o que entra, con nota sobre 10.</span>
          {mellor !== undefined && <span className="mt-1 text-sm font-semibold text-amber-200">A túa mellor nota: {String(notaSobre10(mellor, PREGUNTAS_EXAME)).replace('.', ',')}</span>}
        </span>
      </motion.a>
    </>
  )
}

export default function Historia1({ parada, modo, progreso }: { parada?: string; modo?: string; progreso: Progreso }) {
  const P = PARADAS.find((p) => p.id === parada)?.Compoñente
  return (
    <IdiomaUnidade idioma="gl" guia="cohete" modos={{ descubre: 'Aprende', xoga: 'Practica', proba: '★ Proba' }}>
      {parada === 'exame' ? (
        <div className="tablero">
          <a href={RUTA_HISTORIA1} className="text-lg font-semibold text-violet-700">
            ← Mapa da unidade
          </a>
          <h1 className="mt-2 mb-5 text-3xl font-black text-slate-800 sm:text-4xl">Simulacro do exame</h1>
          <Proba id={clave('exame')} xerar={xerarExame} />
        </div>
      ) : P ? (
        <div className="tablero">
          <P key={parada} ruta={`${RUTA_HISTORIA1}/${parada}`} modo={modo} />
        </div>
      ) : (
        <Mapa progreso={progreso} />
      )}
    </IdiomaUnidade>
  )
}
