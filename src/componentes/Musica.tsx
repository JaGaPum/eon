// Música para concentrarse mientras trabaja. Se pausa sola al abrir un vídeo explicativo y vuelve al cerrarlo.
// Por defecto suena música propia sin imagen; las bandas sonoras van en el reproductor de YouTube, que debe verse.
import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'

interface Emisora {
  id: string
  titulo: string
  detalle: string
  /** Pistas en public/musica/, que se repiten en bucle. Autores y licencias en public/musica/CREDITOS.txt. */
  pistas: string[]
}

const EMISORAS: Emisora[] = [
  { id: 'espacio-profundo', titulo: 'Espacio profundo', detalle: 'Muy tranquila, notas largas', pistas: ['long-note-four', 'long-note-one', 'long-note-two'] },
  { id: 'viaje-estelar', titulo: 'Viaje estelar', detalle: 'Ambiente con algo más de ritmo', pistas: ['frozen-star', 'out-there', 'observing-the-star', 'outer-space'] },
]

interface Sesion {
  id: string
  titulo: string
  minutos: number
}

// Sesiones de YouTube instrumentales y largas, comprobadas que se dejan insertar. Las suben terceros, así que
// alguna puede desaparecer: si pasa, se cambia aquí.
const SESIONES: Sesion[] = [
  { id: 'y0Q0jTXhil0', titulo: 'Proyecto Salvación · suite tranquila', minutos: 29 },
  { id: 'v-Hb0UknaMg', titulo: 'Proyecto Salvación · banda sonora', minutos: 36 },
  { id: 'u0Riy2fTBvU', titulo: 'Interstellar · música para estudiar', minutos: 60 },
  { id: 'UeypVBNjst4', titulo: 'Interstellar · ambiente', minutos: 180 },
  { id: 'n9KUVbwzj9o', titulo: 'Ambiente del espacio', minutos: 60 },
]

/** Lo que suena: «a:» música propia, «y:» una sesión de YouTube. */
type Fuente = `a:${string}` | `y:${string}`

const PRIMERA: Fuente = 'a:espacio-profundo'

/** Volumen de partida, de 0 a 100: de fondo, por debajo de la voz de los vídeos. */
const VOLUMEN = 35

/** Evento que lanza una parada al abrir o cerrar su vídeo explicativo. */
export const EVENTO_VIDEO = 'eon:video'

export function avisarVideo(abierto: boolean) {
  window.dispatchEvent(new CustomEvent(EVENTO_VIDEO, { detail: abierto }))
}

const clave = (alumno: string) => `eon.musica.${alumno}`
const existe = (f: string) =>
  f.startsWith('a:') ? EMISORAS.some((e) => `a:${e.id}` === f) : f.startsWith('y:') && SESIONES.some((s) => `y:${s.id}` === f)

function leerFuente(alumno: string): Fuente {
  try {
    const f = localStorage.getItem(clave(alumno))
    if (f && existe(f)) return f as Fuente
  } catch {
    // Sin almacenamiento: se usa la de partida.
  }
  return PRIMERA
}

/** Botón para la cabecera con su menú, el audio propio y, si se elige, el reproductor de YouTube. */
export function Musica({ alumno }: { alumno: string }) {
  const [menu, setMenu] = useState(false)
  const [elegida, setElegida] = useState(() => leerFuente(alumno))
  const [activa, setActiva] = useState(false)
  const [enPausa, setEnPausa] = useState(false)
  const [pista, setPista] = useState(0)
  // El reproductor de YouTube, pequeño para que no tape el ejercicio; no puede ocultarse del todo.
  const [mini, setMini] = useState(true)
  const audio = useRef<HTMLAudioElement>(null)
  const marco = useRef<HTMLIFrameElement>(null)
  const caja = useRef<HTMLDivElement>(null)
  const sonandoYT = useRef(false)
  /** Qué se pausó al abrir un vídeo, para reanudar eso y no otra cosa. */
  const reanudar = useRef<'audio' | 'yt' | null>(null)

  useEffect(() => setElegida(leerFuente(alumno)), [alumno])

  const emisora = elegida.startsWith('a:') ? EMISORAS.find((e) => `a:${e.id}` === elegida) : undefined
  const sesion = elegida.startsWith('y:') ? SESIONES.find((s) => `y:${s.id}` === elegida) : undefined

  function ordenYT(func: string, args: unknown[] = []) {
    marco.current?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func, args }), '*')
  }

  // Arranca la música propia al elegirla y pasa a la pista siguiente al acabar cada una.
  useEffect(() => {
    const a = audio.current
    if (!a) return
    if (activa && emisora) {
      a.volume = VOLUMEN / 100
      a.play().catch(() => setActiva(false))
    } else a.pause()
  }, [activa, emisora, pista])

  // Lo que cuenta el reproductor de YouTube: cuándo está listo y si suena o no.
  useEffect(() => {
    if (!activa || !sesion) return
    function alRecibir(e: MessageEvent) {
      if (e.source !== marco.current?.contentWindow || typeof e.data !== 'string') return
      try {
        const d = JSON.parse(e.data)
        if (d.event === 'onReady') ordenYT('setVolume', [VOLUMEN])
        const estado = d.info?.playerState ?? (d.event === 'onStateChange' ? d.info : undefined)
        if (typeof estado === 'number') sonandoYT.current = estado === 1
      } catch {
        // Mensaje que no es del reproductor.
      }
    }
    window.addEventListener('message', alRecibir)
    return () => window.removeEventListener('message', alRecibir)
  }, [activa, sesion])

  // Al abrir un vídeo explicativo, la música se calla; al cerrarlo, sigue donde iba.
  useEffect(() => {
    function alVideo(e: Event) {
      const abierto = (e as CustomEvent<boolean>).detail
      const a = audio.current
      if (abierto && a && !a.paused) {
        reanudar.current = 'audio'
        a.pause()
        setEnPausa(true)
      } else if (abierto && sonandoYT.current) {
        reanudar.current = 'yt'
        ordenYT('pauseVideo')
        setEnPausa(true)
      } else if (!abierto && reanudar.current) {
        if (reanudar.current === 'audio') a?.play().catch(() => {})
        else ordenYT('playVideo')
        reanudar.current = null
        setEnPausa(false)
      }
    }
    window.addEventListener(EVENTO_VIDEO, alVideo)
    return () => window.removeEventListener(EVENTO_VIDEO, alVideo)
  }, [])

  // El menú se cierra al tocar fuera de él.
  useEffect(() => {
    if (!menu) return
    const fuera = (e: PointerEvent) => !caja.current?.contains(e.target as Node) && setMenu(false)
    document.addEventListener('pointerdown', fuera)
    return () => document.removeEventListener('pointerdown', fuera)
  }, [menu])

  function poner(f: Fuente) {
    setElegida(f)
    setPista(0)
    setActiva(true)
    setEnPausa(false)
    reanudar.current = null
    sonandoYT.current = false
    setMenu(false)
    try {
      localStorage.setItem(clave(alumno), f)
    } catch {
      // Si no se puede guardar, la próxima vez empieza por la de partida.
    }
  }

  function parar() {
    setActiva(false)
    setEnPausa(false)
    reanudar.current = null
    sonandoYT.current = false
    setMenu(false)
  }

  const opcion = (f: Fuente, titulo: string, detalle: string) => (
    <button
      key={f}
      onClick={() => poner(f)}
      className={`block w-full cursor-pointer rounded-lg px-3 py-2 text-left hover:bg-white/10 ${activa && elegida === f ? 'bg-white/15' : ''}`}
    >
      <b className="block text-sm">
        {activa && elegida === f && '▶ '}
        {titulo}
      </b>
      <span className="text-xs text-indigo-200">{detalle}</span>
    </button>
  )

  // enablejsapi deja pausarla desde la app; loop con playlist la repite al terminar.
  const src =
    sesion &&
    `https://www.youtube-nocookie.com/embed/${sesion.id}?autoplay=1&enablejsapi=1&loop=1&playlist=${sesion.id}&rel=0&playsinline=1&origin=${encodeURIComponent(location.origin)}`

  return (
    <div ref={caja} className="relative ml-auto">
      <button
        className="cursor-pointer rounded-xl bg-white/10 px-3 py-1.5 text-sm font-semibold text-white hover:bg-white/20"
        onClick={() => setMenu(!menu)}
        aria-expanded={menu}
        aria-label={activa ? 'Música: cambiar o parar' : 'Poner música'}
      >
        🎵{activa ? (enPausa ? ' En pausa' : ' ●') : ' Música'}
      </button>

      {menu && (
        <div className="absolute top-full right-0 z-50 mt-2 w-72 rounded-2xl bg-slate-900 p-2 text-white shadow-2xl ring-1 ring-white/20">
          <p className="px-3 pt-1 pb-1 text-xs font-bold tracking-wider text-indigo-300 uppercase">Música tranquila · sin imagen</p>
          {EMISORAS.map((e) => opcion(`a:${e.id}`, e.titulo, e.detalle))}
          <p className="px-3 pt-3 pb-1 text-xs font-bold tracking-wider text-indigo-300 uppercase">Bandas sonoras · con reproductor</p>
          {SESIONES.map((s) => opcion(`y:${s.id}`, s.titulo, `${s.minutos} min · YouTube`))}
          {activa && (
            <button className="mt-2 block w-full cursor-pointer rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/20" onClick={parar}>
              ■ Parar música
            </button>
          )}
          <p className="px-3 pt-2 text-[11px] leading-snug text-indigo-300">
            Música tranquila: Kevin MacLeod (incompetech.com), CC BY 4.0; yd y wipics (OpenGameArt), CC0.{' '}
            <a href="/musica/CREDITOS.txt" target="_blank" className="underline">
              Créditos
            </a>
          </p>
        </div>
      )}

      <audio ref={audio} src={emisora && `/musica/${emisora.pistas[pista % emisora.pistas.length]}.mp3`} onEnded={() => setPista((p) => p + 1)} preload="none" />

      {activa && sesion && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed bottom-3 left-3 z-40 overflow-hidden ${mini ? 'w-56' : 'w-[min(356px,calc(100vw-1.5rem))]'} rounded-2xl bg-slate-900 shadow-2xl ring-1 ring-white/20`}
          role="region"
          aria-label="Música para concentrarse"
        >
          <div className="flex items-center gap-1 px-2 pt-1 text-white">
            <b className="flex-1 truncate text-xs">{enPausa ? 'En pausa durante el vídeo' : sesion.titulo}</b>
            <button className="cursor-pointer rounded-lg px-2 py-1 text-xs font-semibold hover:bg-white/10" onClick={() => setMini(!mini)}>
              {mini ? 'Más grande' : 'Más pequeño'}
            </button>
            <button className="cursor-pointer rounded-lg px-2 py-1 text-base font-bold hover:bg-white/10" onClick={parar} aria-label="Parar la música">
              ✕
            </button>
          </div>
          <div className="aspect-video bg-black">
            <iframe
              key={sesion.id}
              ref={marco}
              className="h-full w-full"
              src={src}
              title={sesion.titulo}
              allow="autoplay; encrypted-media"
              // Pide al reproductor que cuente su estado; sin esto no se sabe si está sonando.
              onLoad={() => marco.current?.contentWindow?.postMessage(JSON.stringify({ event: 'listening' }), '*')}
            />
          </div>
        </motion.div>
      )}
    </div>
  )
}
