import { useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { Progreso } from '../lib/progreso'
import { useTema } from './tema'
import { Prueba } from './Prueba'
import { avisarVideo } from './Musica'
import { TarjetaVideos, VentanaVideo } from './Videos'

export const MODOS = [
  ['entender', 'Entender'],
  ['probar', 'Probar'],
  ['desmenuzar', 'Desmenuzar'],
  ['practicar', 'Practicar'],
  ['prueba', 'Prueba'],
] as const

/** Los modos que aporta cada parada; la prueba es común y la pone el armazón. */
export type Modo = Exclude<(typeof MODOS)[number][0], 'prueba'>

/** Lo que recibe cada parada desde la aplicación. */
export interface PropsParada {
  modo?: string
  progreso: Progreso
  apuntar: (id?: string) => void
}

/** Armazón común: título, pestañas y los cuatro modos. */
export default function Parada({ id, titulo, modo, paneles }: { id: string; titulo: string; modo?: string; paneles: Record<Modo, ReactNode> }) {
  const { ruta, videos: VIDEOS } = useTema()
  const activo = MODOS.find(([m]) => m === modo)?.[0] ?? 'entender'
  const videos = VIDEOS[id] ?? []
  const [video, setVideo] = useState<number | null>(null)
  // En la prueba no hay ayudas: el vídeo se oculta mientras está en esa pestaña.
  const conVideo = videos.length > 0 && activo !== 'prueba'
  const viendo = conVideo && video !== null

  // La música de fondo se calla mientras hay un vídeo abierto.
  useEffect(() => {
    avisarVideo(viendo)
    return () => avisarVideo(false)
  }, [viendo])

  return (
    <>
      <a href={ruta} className="font-semibold text-indigo-700">
        ← Mapa del tema
      </a>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">{titulo}</h1>
        {conVideo && (
          <button className="btn border-red-600 bg-red-600 text-white hover:bg-red-700" onClick={() => setVideo(video === null ? 0 : null)}>
            {video === null ? '▶ Ver vídeo' : 'Cerrar vídeo'}
          </button>
        )}
      </div>
      {conVideo && video !== null && <VentanaVideo videos={videos} actual={video} elegir={setVideo} cerrar={() => setVideo(null)} />}

      <nav className="mt-4 grid grid-cols-5 gap-1 rounded-2xl bg-slate-200 p-1">
        {MODOS.map(([m, nombre]) => (
          <a
            key={m}
            href={`${ruta}/${id}/${m}`}
            className={`truncate rounded-xl px-1 py-2.5 text-center text-xs font-semibold sm:text-base ${
              m === activo ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600'
            }`}
          >
            {m === 'prueba' && '★ '}
            {nombre}
          </a>
        ))}
      </nav>

      {/* Todos los modos siguen montados: al cambiar de pestaña no se pierde por dónde iba. */}
      <div className="mt-5">
        {MODOS.map(([m]) => (
          <div key={m} hidden={m !== activo}>
            {m === 'entender' && videos.length > 0 && <TarjetaVideos videos={videos} abrir={setVideo} />}
            {m === 'prueba' ? <Prueba parada={id} /> : paneles[m]}
          </div>
        ))}
      </div>
    </>
  )
}

export interface Tarjeta {
  titulo: string
  texto: ReactNode
  /** Sin dibujo, el texto ocupa todo el ancho. */
  visual?: ReactNode
}

/** Modo Entender: una idea por tarjeta, con adelante y atrás. */
export function Tarjetas({ tarjetas, parada }: { tarjetas: Tarjeta[]; parada: string }) {
  const { ruta } = useTema()
  const [i, setI] = useState(0)
  const t = tarjetas[i]

  return (
    <section>
      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.18 }}>
          <h2 className="mb-3 text-xl font-bold">{t.titulo}</h2>
          <div className={`grid gap-4 ${t.visual ? 'md:grid-cols-2' : ''}`}>
            <div className="space-y-3 overflow-x-auto text-lg leading-relaxed">{t.texto}</div>
            {t.visual && <div className="lienzo">{t.visual}</div>}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-5 flex items-center justify-between">
        <button className="btn" disabled={i === 0} onClick={() => setI(i - 1)}>
          ← Atrás
        </button>
        <span className="text-sm text-slate-500">
          {i + 1} de {tarjetas.length}
        </span>
        {i < tarjetas.length - 1 ? (
          <button className="btn btn-primario" onClick={() => setI(i + 1)}>
            Siguiente →
          </button>
        ) : (
          <a className="btn btn-primario" href={`${ruta}/${parada}/probar`}>
            Pruébalo tú →
          </a>
        )}
      </div>
    </section>
  )
}

/** Controles de un paso a paso: atrás, puntos para saltar a cualquier paso y siguiente. */
export function PasoAPaso({ k, total, setK }: { k: number; total: number; setK: (k: number) => void }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <button className="btn" disabled={k === 0} onClick={() => setK(k - 1)}>
        ← Atrás
      </button>
      <div className="flex flex-wrap justify-center gap-2">
        {Array.from({ length: total + 1 }, (_, i) => (
          <button
            key={i}
            aria-label={`Ir al paso ${i}`}
            onClick={() => setK(i)}
            className={`h-4 w-4 cursor-pointer rounded-full transition ${i === k ? 'scale-125 bg-indigo-600' : i < k ? 'bg-indigo-300' : 'bg-slate-300'}`}
          />
        ))}
      </div>
      <button className="btn btn-primario" disabled={k === total} onClick={() => setK(k + 1)}>
        Siguiente →
      </button>
    </div>
  )
}
