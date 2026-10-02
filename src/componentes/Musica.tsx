// Música para concentrarse mientras trabaja. Se pausa sola al abrir un vídeo explicativo y vuelve al cerrarlo.
import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'

interface Sesion {
  id: string
  titulo: string
  minutos: number
}

// Sesiones instrumentales y largas, comprobadas que YouTube deja insertarlas. Las suben terceros, así que alguna
// puede desaparecer: si pasa, se cambia aquí.
const SESIONES: Sesion[] = [
  {
    id: 'y0Q0jTXhil0',
    titulo: 'Proyecto Salvación · suite tranquila',
    minutos: 29,
  },
  {
    id: 'v-Hb0UknaMg',
    titulo: 'Proyecto Salvación · banda sonora',
    minutos: 36,
  },
  {
    id: 'u0Riy2fTBvU',
    titulo: 'Interstellar · música para estudiar',
    minutos: 60,
  },
  { id: 'UeypVBNjst4', titulo: 'Interstellar · ambiente', minutos: 180 },
  { id: 'n9KUVbwzj9o', titulo: 'Ambiente del espacio', minutos: 60 },
]

/** Con qué sesión empieza cada alumno la primera vez. */
const PRIMERA: Record<string, string> = {
  mateo: 'y0Q0jTXhil0',
  olivia: 'n9KUVbwzj9o',
}

/** Volumen de partida: de fondo, por debajo de la voz de los vídeos. */
const VOLUMEN = 35

/** Evento que lanza una parada al abrir o cerrar su vídeo explicativo. */
export const EVENTO_VIDEO = 'eon:video'

export function avisarVideo(abierto: boolean) {
  window.dispatchEvent(new CustomEvent(EVENTO_VIDEO, { detail: abierto }))
}

const clave = (alumno: string) => `eon.musica.${alumno}`

function leerSesion(alumno: string): string {
  try {
    const id = localStorage.getItem(clave(alumno))
    if (id && SESIONES.some((s) => s.id === id)) return id
  } catch {
    // Sin almacenamiento: se usa la de partida.
  }
  return PRIMERA[alumno] ?? SESIONES[0].id
}

/** Botón para la cabecera y, al pulsarlo, el reproductor flotante. */
export function Musica({ alumno }: { alumno: string }) {
  const [abierta, setAbierta] = useState(false)
  const [sesion, setSesion] = useState(() => leerSesion(alumno))
  const [enPausa, setEnPausa] = useState(false)
  // Pequeño, para que no tape el ejercicio; el reproductor sigue a la vista, como pide YouTube.
  const [mini, setMini] = useState(false)
  const marco = useRef<HTMLIFrameElement>(null)
  const sonando = useRef(false)
  const reanudar = useRef(false)

  useEffect(() => setSesion(leerSesion(alumno)), [alumno])

  function orden(func: string, args: unknown[] = []) {
    marco.current?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func, args }), '*')
  }

  // Lo que cuenta el reproductor de YouTube: cuándo está listo y si suena o no.
  useEffect(() => {
    if (!abierta) return
    function alRecibir(e: MessageEvent) {
      if (e.source !== marco.current?.contentWindow || typeof e.data !== 'string') return
      try {
        const d = JSON.parse(e.data)
        if (d.event === 'onReady') orden('setVolume', [VOLUMEN])
        const estado = d.info?.playerState ?? (d.event === 'onStateChange' ? d.info : undefined)
        if (typeof estado === 'number') sonando.current = estado === 1
      } catch {
        // Mensaje que no es del reproductor.
      }
    }
    window.addEventListener('message', alRecibir)
    return () => window.removeEventListener('message', alRecibir)
  }, [abierta])

  // Al abrir un vídeo explicativo, la música se calla; al cerrarlo, sigue donde iba.
  useEffect(() => {
    function alVideo(e: Event) {
      const abierto = (e as CustomEvent<boolean>).detail
      if (abierto && sonando.current) {
        reanudar.current = true
        orden('pauseVideo')
        setEnPausa(true)
      } else if (!abierto && reanudar.current) {
        reanudar.current = false
        orden('playVideo')
        setEnPausa(false)
      }
    }
    window.addEventListener(EVENTO_VIDEO, alVideo)
    return () => window.removeEventListener(EVENTO_VIDEO, alVideo)
  }, [])

  function elegir(id: string) {
    setSesion(id)
    try {
      localStorage.setItem(clave(alumno), id)
    } catch {
      // Si no se puede guardar, la próxima vez empieza por la de partida.
    }
  }

  function cerrar() {
    setAbierta(false)
    sonando.current = false
    reanudar.current = false
    setEnPausa(false)
  }

  const actual = SESIONES.find((s) => s.id === sesion) ?? SESIONES[0]
  // enablejsapi deja pausarla desde la app; loop con playlist la repite al terminar.
  const src = `https://www.youtube-nocookie.com/embed/${actual.id}?autoplay=1&enablejsapi=1&loop=1&playlist=${actual.id}&rel=0&playsinline=1&origin=${encodeURIComponent(location.origin)}`

  return (
    <>
      <button
        className="ml-auto cursor-pointer rounded-xl bg-white/10 px-3 py-1.5 text-sm font-semibold text-white hover:bg-white/20"
        onClick={() => (abierta ? cerrar() : setAbierta(true))}
        aria-pressed={abierta}
      >
        {abierta ? '■ Parar música' : '🎵 Música'}
      </button>
      {abierta && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed bottom-3 left-3 z-40 overflow-hidden ${mini ? 'w-56' : 'w-[min(356px,calc(100vw-1.5rem))]'} rounded-2xl bg-slate-900 shadow-2xl ring-1 ring-white/20`}
          role="region"
          aria-label="Música para concentrarse"
        >
          <div className="flex items-center gap-2 px-3 pt-2 text-white">
            <b className="flex-1 truncate text-sm">{mini ? '🎵' : '🎵 Música para concentrarse'}</b>
            <button className="cursor-pointer rounded-lg px-2 py-1 text-sm font-semibold hover:bg-white/10" onClick={() => setMini(!mini)}>
              {mini ? 'Más grande' : 'Más pequeño'}
            </button>
            <button className="cursor-pointer rounded-lg px-2 py-1 text-lg font-bold hover:bg-white/10" onClick={cerrar} aria-label="Parar la música">
              ✕
            </button>
          </div>
          {!mini && (
            <select
              className="mx-3 my-2 w-[calc(100%-1.5rem)] rounded-lg bg-white/10 px-2 py-1.5 text-sm text-white"
              value={actual.id}
              onChange={(e) => elegir(e.target.value)}
              aria-label="Elige la música"
            >
              {SESIONES.map((s) => (
                <option key={s.id} value={s.id} className="text-slate-900">
                  {s.titulo} · {s.minutos} min
                </option>
              ))}
            </select>
          )}
          {enPausa && (
            <p className="px-3 pb-2 text-xs text-indigo-200">{mini ? 'En pausa durante el vídeo' : 'En pausa mientras ves el vídeo. Seguirá al cerrarlo.'}</p>
          )}
          {mini && !enPausa && <div className="h-2" />}
          <div className="aspect-video bg-black">
            <iframe
              key={actual.id}
              ref={marco}
              className="h-full w-full"
              src={src}
              title={actual.titulo}
              allow="autoplay; encrypted-media"
              // Pide al reproductor que cuente su estado; sin esto no se sabe si está sonando.
              onLoad={() => marco.current?.contentWindow?.postMessage(JSON.stringify({ event: 'listening' }), '*')}
            />
          </div>
        </motion.div>
      )}
    </>
  )
}
