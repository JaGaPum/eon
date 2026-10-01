// Vídeos explicativos de una parada: una tarjeta para verlos antes de empezar y un recuadro flotante
// para tenerlos a la vista mientras resuelve.
import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { Video } from '../contenido/tema1'

// Modo de privacidad mejorada de YouTube: sin cookies hasta que se pulsa reproducir.
const insertar = (id: string) => `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`
const miniatura = (id: string) => `https://i.ytimg.com/vi/${id}/mqdefault.jpg`

/** Tarjeta de Entender: «antes de empezar, mira el vídeo». */
export function TarjetaVideos({ videos, abrir }: { videos: Video[]; abrir: (i: number) => void }) {
  return (
    <div className="mb-5 rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
      <p className="font-bold text-indigo-900">Antes de empezar, puedes verlo explicado en vídeo</p>
      <p className="text-sm text-indigo-800">Se abre en un recuadro que puedes dejar a la vista mientras haces los ejercicios.</p>
      <div className="mt-3 flex flex-wrap gap-3">
        {videos.map((v, i) => (
          <button key={v.id} onClick={() => abrir(i)} className="flex w-full max-w-xs cursor-pointer items-center gap-3 rounded-xl bg-white p-2 text-left shadow-sm hover:bg-indigo-100 sm:w-auto">
            <span className="relative shrink-0">
              <img src={miniatura(v.id)} alt="" className="h-16 w-28 rounded-lg object-cover" loading="lazy" />
              <span className="absolute inset-0 flex items-center justify-center text-2xl text-white drop-shadow" aria-hidden="true">
                ▶
              </span>
            </span>
            <span className="min-w-0">
              <b className="block text-sm leading-tight">{v.titulo}</b>
              <span className="text-xs text-slate-500">
                {v.canal} · {v.minutos} min
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

/** Recuadro flotante con el vídeo. Se puede agrandar, achicar y cerrar sin perder el ejercicio. */
export function VentanaVideo({ videos, actual, elegir, cerrar }: { videos: Video[]; actual: number; elegir: (i: number) => void; cerrar: () => void }) {
  const [grande, setGrande] = useState(false)
  const v = videos[actual]
  return (
    <AnimatePresence>
      <motion.div
        key="video"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className={`fixed right-3 bottom-3 z-50 overflow-hidden rounded-2xl bg-slate-900 shadow-2xl ring-1 ring-white/20 ${
          grande ? 'w-[min(860px,calc(100vw-1.5rem))]' : 'w-[min(400px,calc(100vw-1.5rem))]'
        }`}
        role="dialog"
        aria-label="Vídeo explicativo"
      >
        <div className="flex items-center gap-2 px-3 py-2 text-white">
          <span className="min-w-0 flex-1">
            <b className="block truncate text-sm">{v.titulo}</b>
            <span className="block truncate text-xs text-indigo-200">
              {v.canal} · {v.minutos} min
            </span>
          </span>
          <button className="cursor-pointer rounded-lg px-2 py-1 text-sm font-semibold hover:bg-white/10" onClick={() => setGrande(!grande)}>
            {grande ? 'Más pequeño' : 'Más grande'}
          </button>
          <button className="cursor-pointer rounded-lg px-2 py-1 text-lg font-bold hover:bg-white/10" onClick={cerrar} aria-label="Cerrar el vídeo">
            ✕
          </button>
        </div>
        {videos.length > 1 && (
          <div className="flex gap-1 px-3 pb-2">
            {videos.map((x, i) => (
              <button
                key={x.id}
                onClick={() => elegir(i)}
                className={`cursor-pointer rounded-lg px-2 py-1 text-xs font-semibold ${i === actual ? 'bg-white text-slate-900' : 'bg-white/10 text-white hover:bg-white/20'}`}
              >
                Vídeo {i + 1}
              </button>
            ))}
          </div>
        )}
        <div className="aspect-video bg-black">
          <iframe
            key={v.id}
            className="h-full w-full"
            src={insertar(v.id)}
            title={v.titulo}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        {typeof navigator !== 'undefined' && !navigator.onLine && <p className="px-3 py-2 text-sm text-amber-200">Sin conexión a internet: el vídeo no se puede cargar.</p>}
      </motion.div>
    </AnimatePresence>
  )
}
