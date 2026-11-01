// Música 2.º ESO: exame do 3 de novembro. Entra o resaltado en amarelo das 15 primeiras páxinas dos apuntes.
import type { ComponentType } from 'react'
import { motion } from 'motion/react'
import type { Progreso } from '../../lib/progreso'
import { estrellas } from '../../componentes/Prueba'
import { IdiomaUnidade, PREGUNTAS_PROBA, Proba, barallar, notaSobre10, type Pregunta } from '../../primaria/pezas'
import { Altura, Compases, Cualidades, Figuras, Intensidade, OSon, PREGUNTAS_MUSICA1, Silenzo, Tempo, Tons } from './paradas'

export const RUTA_MUSICA1 = '#/2eso/musica/musica1'

export const PARADAS: { id: string; titulo: string; resumen: string; bloque: string; icono: string; Compoñente: ComponentType<{ ruta: string; modo?: string }> }[] = [
  { id: 'son', titulo: 'O son', resumen: 'Vibración, reverberación, eco, tímpano, ruído e son.', bloque: 'O son', icono: '🔊', Compoñente: OSon },
  { id: 'silenzo', titulo: 'O silenzo e a contaminación acústica', resumen: 'O silenzo absoluto non existe. Efectos do ruído.', bloque: 'O son', icono: '🤫', Compoñente: Silenzo },
  { id: 'cualidades', titulo: 'As cualidades do son', resumen: 'Altura, duración, intensidade e timbre, para oílas.', bloque: 'O son', icono: '〰️', Compoñente: Cualidades },
  { id: 'altura', titulo: 'A altura: notas, escala, pentagrama e claves', resumen: "Diapasón, as sete claves e Guido d'Arezzo.", bloque: 'A altura', icono: '🎼', Compoñente: Altura },
  { id: 'tons', titulo: 'Tons, semitóns e alteracións', resumen: 'Intervalos, sostido, bemol, becuadro e enarmónicas.', bloque: 'A altura', icono: '🎹', Compoñente: Tons },
  { id: 'figuras', titulo: 'Figuras e silenzos', resumen: 'De redonda a semifusa, e as partes da figura.', bloque: 'A duración', icono: '🎵', Compoñente: Figuras },
  { id: 'compases', titulo: 'Os compases', resumen: 'Numerador, denominador, tipos e anacrusa.', bloque: 'A duración', icono: '🥁', Compoñente: Compases },
  { id: 'tempo', titulo: 'Prolongación e tempo', resumen: 'Punto, ligadura, caldeirón, de Largo a Prestissimo, metrónomo.', bloque: 'A duración', icono: '⏱️', Compoñente: Tempo },
  { id: 'intensidade', titulo: 'A intensidade e a expresión', resumen: 'De ppp a fff, crescendo, termos de carácter, picado e stacatto.', bloque: 'A intensidade', icono: '📢', Compoñente: Intensidade },
]

export const BANCOS: Record<string, Pregunta[]> = PREGUNTAS_MUSICA1
// Simulacro: 3 preguntas de cada parada.
const CANTAS = 3
export const PREGUNTAS_EXAME = PARADAS.length * CANTAS
export const xerarExame = (): Pregunta[] => PARADAS.flatMap((p) => barallar(BANCOS[p.id]).slice(0, CANTAS))

const clave = (parada: string) => `musica1/${parada}`

export function avanceMusica1(progreso: Progreso): string {
  const n = PARADAS.reduce((t, p) => t + estrellas(progreso.pruebas[clave(p.id)], PREGUNTAS_PROBA), 0)
  return `★ ${n} de ${PARADAS.length * 3} estrelas`
}

function Mapa({ progreso }: { progreso: Progreso }) {
  const mellor = progreso.pruebas[clave('exame')]
  return (
    <>
      <h1 className="text-3xl font-bold text-white">Música · 1.ª avaliación</h1>
      <p className="mt-1 text-indigo-200">O resaltado en amarelo das 15 primeiras páxinas dos apuntes. O exame é o martes 3 de novembro.</p>
      <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 font-bold text-amber-200">{avanceMusica1(progreso)}</p>
      {['O son', 'A altura', 'A duración', 'A intensidade'].map((bloque) => (
        <section key={bloque}>
          <h2 className="mt-8 mb-3 text-sm font-bold tracking-widest text-indigo-300 uppercase">{bloque}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {PARADAS.filter((p) => p.bloque === bloque).map((p, i) => {
              const n = estrellas(progreso.pruebas[clave(p.id)], PREGUNTAS_PROBA)
              return (
                <motion.a
                  key={p.id}
                  href={`${RUTA_MUSICA1}/${p.id}/descubre`}
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
      <motion.a href={`${RUTA_MUSICA1}/exame`} whileHover={{ y: -4 }} className="cristal flex items-center gap-4 border-amber-300/70 p-4 hover:bg-white/[0.12]">
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

export default function Musica1({ parada, modo, progreso }: { parada?: string; modo?: string; progreso: Progreso }) {
  const P = PARADAS.find((p) => p.id === parada)?.Compoñente
  return (
    <IdiomaUnidade idioma="gl" guia="cohete" modos={{ descubre: 'Aprende', xoga: 'Practica', proba: '★ Proba' }}>
      {parada === 'exame' ? (
        <div className="tablero">
          <a href={RUTA_MUSICA1} className="text-lg font-semibold text-violet-700">
            ← Mapa da unidade
          </a>
          <h1 className="mt-2 mb-5 text-3xl font-black text-slate-800 sm:text-4xl">Simulacro do exame</h1>
          <Proba id={clave('exame')} xerar={xerarExame} />
        </div>
      ) : P ? (
        <div className="tablero">
          <P key={parada} ruta={`${RUTA_MUSICA1}/${parada}`} modo={modo} />
        </div>
      ) : (
        <Mapa progreso={progreso} />
      )}
    </IdiomaUnidade>
  )
}
