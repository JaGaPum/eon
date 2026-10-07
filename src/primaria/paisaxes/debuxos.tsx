// Dibujos de la unidad de las paisaxes. Cada elemento se puede tocar por su identificador y resaltar como acierto
// o fallo. Los textos que se ven van en galego.
import { useId, type MouseEvent, type ReactNode } from 'react'
import { ALTO_MAPA, ANCHO_MAPA, CONTINENTES_SVG, GLOBO_SVG, lonLat, punto } from '../mundo'
import type { Marca } from '../pezas'

const VERDE = '#059669'
const VERMELLO = '#e11d48'

/** Etiqueta redondeada sobre un dibujo; verde si es un acierto, roja si es un fallo. */
function Pilula({ x, y, texto, marca, cor = '#ffffff', tam = 15, cursiva }: { x: number; y: number; texto: string; marca?: Marca; cor?: string; tam?: number; cursiva?: boolean }) {
  const ancho = texto.length * tam * 0.58 + 18
  const fondo = marca === 'ben' ? VERDE : marca === 'mal' ? VERMELLO : cor
  const tinta = marca ? '#fff' : '#1e293b'
  return (
    <g pointerEvents="none">
      <rect x={x - ancho / 2} y={y - tam * 0.95} width={ancho} height={tam * 1.6} rx={tam * 0.8} fill={fondo} stroke="#1e293b" strokeOpacity={0.25} />
      <text x={x} y={y + tam * 0.1} textAnchor="middle" dominantBaseline="middle" fontSize={tam} fontWeight={800} fontStyle={cursiva ? 'italic' : undefined} fill={tinta}>
        {texto}
      </text>
    </g>
  )
}

// ——— Mapamundi ———

export const CONTINENTES = ['europa', 'asia', 'africa', 'america', 'oceania', 'antartida'] as const
export const OCEANOS = ['pacifico', 'atlantico', 'indico', 'artico', 'antartico'] as const

export const NOMES_MAPA: Record<string, string> = {
  europa: 'Europa',
  asia: 'Asia',
  africa: 'África',
  america: 'América',
  oceania: 'Oceanía',
  antartida: 'a Antártida',
  pacifico: 'o océano Pacífico',
  atlantico: 'o océano Atlántico',
  indico: 'o océano Índico',
  artico: 'o océano Glacial Ártico',
  antartico: 'o océano Glacial Antártico',
  mar: 'un mar pequeno, non un océano',
}

/** Nome curto, sen artigo, para as etiquetas do mapa. */
const ETIQUETA: Record<string, string> = {
  europa: 'Europa',
  asia: 'Asia',
  africa: 'África',
  america: 'América',
  oceania: 'Oceanía',
  antartida: 'Antártida',
  pacifico: 'Pacífico',
  atlantico: 'Atlántico',
  indico: 'Índico',
  artico: 'Glacial Ártico',
  antartico: 'Glacial Antártico',
}

const COR_CONTINENTE: Record<string, string> = {
  europa: '#f87171',
  asia: '#fbbf24',
  africa: '#a3e635',
  america: '#f472b6',
  oceania: '#2dd4bf',
  antartida: '#f8fafc',
}

// Dónde va cada etiqueta, en longitud y latitud. El Pacífico sale a los dos lados, como en el libro.
const SITIO: [string, number, number][] = [
  ['europa', 18, 53],
  ['asia', 95, 52],
  ['africa', 20, 5],
  ['america', -100, 45],
  ['america', -60, -12],
  ['oceania', 134, -25],
  ['antartida', 40, -80],
  ['pacifico', -135, 5],
  ['pacifico', 157, 18],
  ['atlantico', -38, 28],
  ['indico', 78, -22],
  ['artico', 0, 84],
  ['antartico', -20, -64],
]

/** Qué océano (o mar) hay en un punto de agua. Las fronteras entre océanos son las de los libros escolares. */
export function oceanoEn(lon: number, lat: number): string {
  const entre = (a: number, b: number, c: number, d: number) => lon >= a && lon <= b && lat >= c && lat <= d
  // Mares pequeños rodeados de tierra: no son océanos.
  if (entre(-6, 37, 30, 46) || entre(27, 42, 40.5, 47.5) || entre(46, 55, 36, 47.5) || entre(32, 44, 12, 30) || entre(47, 57, 23, 30.5) || entre(9, 31, 53, 66) || entre(-96, -76, 51, 64.5)) return 'mar'
  if (lat >= 66) return 'artico'
  if (lat <= -60) return 'antartico'
  if (lon >= 20 && lon <= 147 && lat < 30 && (lon <= 100 || lat < -10)) return 'indico'
  const oeste = lat >= 18 ? -98 : lat >= 8 ? -84 : -70
  if (lon >= oeste && lon < 20) return 'atlantico'
  return 'pacifico'
}

export type ModoMapa = 'todo' | 'oceanos' | 'continentes'

/** Mapamundi para tocar continentes y océanos. Sin etiquetas, sirve de juego; con ellas, de lámina. */
export function Mapamundi({ onToca, marcas = {}, etiquetas = true, ver = 'todo' }: { onToca?: (id: string) => void; marcas?: Record<string, Marca>; etiquetas?: boolean; ver?: ModoMapa }) {
  function auga(e: MouseEvent<SVGRectElement>) {
    if (!onToca) return
    const svg = e.currentTarget.ownerSVGElement
    const m = svg?.getScreenCTM()
    if (!svg || !m) return
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse())
    const [lon, lat] = lonLat(p.x, p.y)
    onToca(oceanoEn(lon, lat))
  }
  // Cada dibujo con sus propios ids: los de una pestaña oculta no se pintan y dejarían el mar sin color.
  const mar = useId()
  const apagado = (id: string) => (ver === 'oceanos' && (CONTINENTES as readonly string[]).includes(id)) || (ver === 'continentes' && (OCEANOS as readonly string[]).includes(id))

  return (
    <svg viewBox={`0 0 ${ANCHO_MAPA} ${ALTO_MAPA}`} className="block h-auto w-full touch-manipulation select-none" role="img" aria-label="Mapamundi">
      <defs>
        <linearGradient id={mar} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bae6fd" />
          <stop offset="0.5" stopColor="#7dd3fc" />
          <stop offset="1" stopColor="#bae6fd" />
        </linearGradient>
      </defs>
      <rect width={ANCHO_MAPA} height={ALTO_MAPA} fill={`url(#${mar})`} pointerEvents="all" onClick={auga} className={onToca ? 'cursor-pointer' : ''} />
      {CONTINENTES.map((c) => {
        const cor = marcas[c] === 'ben' ? '#10b981' : marcas[c] === 'mal' ? '#9f1239' : ver === 'oceanos' ? '#d6d3d1' : COR_CONTINENTE[c]
        return (
          <path
            key={c}
            data-id={c}
            d={CONTINENTES_SVG[c]}
            fill={cor}
            stroke={cor}
            strokeWidth={0.8}
            strokeLinejoin="round"
            onClick={onToca ? () => onToca(c) : undefined}
            className={onToca ? 'cursor-pointer' : ''}
          />
        )
      })}
      {/* Oceanos con fallo: un círculo para ver dónde se tocó. */}
      {SITIO.filter(([id]) => (etiquetas && !apagado(id)) || marcas[id]).map(([id, lon, lat], i) => {
        const [x, y] = punto(lon, lat)
        const oceano = (OCEANOS as readonly string[]).includes(id)
        return <Pilula key={i} x={x} y={y} texto={ETIQUETA[id]} marca={marcas[id]} cor={oceano ? '#e0f2fe' : '#ffffff'} tam={id === 'artico' ? 19 : 25} cursiva={oceano} />
      })}
    </svg>
  )
}

// ——— Globo ———

const L0 = (15 * Math.PI) / 180
const P0 = (20 * Math.PI) / 180
/** Proyección del globo (la misma que GLOBO_SVG): centrado en 15° E, 20° N, radio 100. */
function globo(lon: number, lat: number): [number, number] {
  const l = (lon * Math.PI) / 180 - L0
  const p = (lat * Math.PI) / 180
  return [100 + 100 * Math.cos(p) * Math.sin(l), 100 - 100 * (Math.cos(P0) * Math.sin(p) - Math.sin(P0) * Math.cos(p) * Math.cos(l))]
}

// Manchas de roca y desierto (marrón) y de hielo (blanco) sobre la tierra verde.
const MANCHAS: [number, number, number, number, string][] = [
  [8, 23, 40, 13, '#b45309'],
  [47, 22, 12, 10, '#b45309'],
  [18, -24, 9, 9, '#b45309'],
  [62, 42, 22, 8, '#a16207'],
  [-4, 40, 6, 4, '#a16207'],
  [10, 46, 6, 2.5, '#92400e'],
  [-42, 72, 20, 12, '#f8fafc'],
]

/** La Tierra vista desde el espacio: azul, verde y marrón. */
export function Globo({ marcar }: { marcar?: 'auga' | 'rochas' | 'vexetacion' }) {
  const op = (que: string) => (marcar && marcar !== que ? 0.35 : 1)
  const terra = useId()
  const luz = useId()
  return (
    <svg viewBox="-10 -10 220 220" className="mx-auto block h-auto w-full max-w-xs" role="img" aria-label="A Terra vista dende o espazo">
      <defs>
        <clipPath id={terra}>
          <path d={GLOBO_SVG} />
        </clipPath>
        <radialGradient id={luz} cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#0f172a" stopOpacity="0.45" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="106" fill="#c7d2fe" opacity="0.5" />
      <circle cx="100" cy="100" r="100" fill="#2563eb" opacity={op('auga')} />
      <path d={GLOBO_SVG} fill="#16a34a" opacity={op('vexetacion')} />
      <g clipPath={`url(#${terra})`} opacity={op('rochas')}>
        {MANCHAS.map(([lon, lat, rx, ry, cor], i) => {
          const [x, y] = globo(lon, lat)
          return <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill={cor} opacity={cor === '#f8fafc' ? 0.95 : 0.85} />
        })}
      </g>
      <circle cx="100" cy="100" r="100" fill={`url(#${luz})`} pointerEvents="none" />
    </svg>
  )
}

// ——— Paisaxe ———

export const NOMES_PAISAXE: Record<string, string> = {
  montana: 'a montaña',
  chaira: 'a chaira',
  neve: 'a neve',
  rio: 'o río',
  lago: 'o lago',
  arbores: 'as árbores',
  flores: 'as flores',
  ponte: 'a ponte',
  horta: 'a horta',
  casas: 'as casas',
  estrada: 'a estrada',
}

/** Qué tipo de elemento es cada cosa de la paisaxe. */
export const TIPO_PAISAXE: Record<string, 'relevo' | 'vexetacion' | 'augas' | 'persoas'> = {
  montana: 'relevo',
  chaira: 'relevo',
  arbores: 'vexetacion',
  flores: 'vexetacion',
  rio: 'augas',
  lago: 'augas',
  neve: 'augas',
  ponte: 'persoas',
  horta: 'persoas',
  casas: 'persoas',
  estrada: 'persoas',
}

export const COR_TIPO = { relevo: '#fcd9a8', vexetacion: '#bbf7d0', augas: '#bae6fd', persoas: '#e9d5ff' }

const ETIQUETA_PAISAXE: Record<string, [number, number, string]> = {
  montana: [128, 112, 'montaña'],
  neve: [200, 40, 'neve'],
  chaira: [60, 254, 'chaira'],
  rio: [262, 196, 'río'],
  lago: [92, 228, 'lago'],
  arbores: [44, 172, 'árbores'],
  flores: [150, 292, 'flores'],
  ponte: [196, 222, 'ponte'],
  horta: [342, 286, 'horta'],
  casas: [420, 192, 'casas'],
  estrada: [330, 236, 'estrada'],
}

function Arbore({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-2.5" y="0" width="5" height="12" fill="#92400e" />
      <circle cx="0" cy="-6" r="11" fill="#15803d" />
      <circle cx="-5" cy="-9" r="5" fill="#22c55e" opacity="0.7" />
    </g>
  )
}

function Casa({ x, y, cor }: { x: number; y: number; cor: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-14" y="-16" width="28" height="22" fill="#fef3c7" stroke="#78350f" strokeWidth="1" />
      <path d="M-18 -15 L0 -31 L18 -15 Z" fill={cor} stroke="#78350f" strokeWidth="1" />
      <rect x="-4" y="-6" width="8" height="12" fill="#92400e" />
      <rect x="-11" y="-12" width="5" height="5" fill="#7dd3fc" />
      <rect x="6" y="-12" width="5" height="5" fill="#7dd3fc" />
    </g>
  )
}

function Vaca({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="0" rx="14" ry="8" fill="#b45309" />
      <rect x="-10" y="5" width="3" height="9" fill="#78350f" />
      <rect x="7" y="5" width="3" height="9" fill="#78350f" />
      <ellipse cx="15" cy="-5" rx="6" ry="5" fill="#92400e" />
      <path d="M12 -9 q-4 -8 2 -10 M18 -9 q4 -8 -2 -10" stroke="#fef3c7" strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  )
}

/**
 * Una paisaxe con relevo, vegetación, aguas y cosas construidas. Con `etiquetas` nombra cada elemento con el
 * color de su tipo; `parque` quita lo construido y pone el cartel de un parque natural.
 */
export function Paisaxe({ onToca, marcas = {}, etiquetas = false, parque = false, tipos }: { onToca?: (id: string) => void; marcas?: Record<string, Marca>; etiquetas?: boolean; parque?: boolean; tipos?: string[] }) {
  // Cada elemento es un grupo que se puede tocar.
  const el = (id: string, dentro: ReactNode) => (
    <g
      key={id}
      data-id={id}
      onClick={onToca ? (e) => (e.stopPropagation(), onToca(id)) : undefined}
      className={onToca ? 'cursor-pointer' : ''}
      style={marcas[id] ? { filter: `drop-shadow(0 0 5px ${marcas[id] === 'ben' ? VERDE : VERMELLO})` } : undefined}
    >
      {dentro}
    </g>
  )
  const construidos = !parque
  const ceo = useId()
  const conEtiqueta = Object.keys(ETIQUETA_PAISAXE).filter((id) => (construidos || TIPO_PAISAXE[id] !== 'persoas') && ((etiquetas && (!tipos || tipos.includes(TIPO_PAISAXE[id]))) || marcas[id]))

  return (
    <svg viewBox="0 0 480 300" className="block h-auto w-full touch-manipulation select-none" role="img" aria-label="Unha paisaxe">
      <defs>
        <linearGradient id={ceo} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7dd3fc" />
          <stop offset="1" stopColor="#e0f2fe" />
        </linearGradient>
      </defs>
      <rect width="480" height="300" fill={`url(#${ceo})`} />
      <circle cx="430" cy="45" r="20" fill="#fde047" />
      <path d="M40 40 q10 -12 22 -4 q10 -10 20 2 q10 0 8 10 h-52 q-6 -6 2 -8z" fill="#fff" opacity="0.9" />

      {el(
        'montana',
        <path d="M0 175 L70 85 L120 140 L200 55 L280 150 L340 90 L420 168 L480 130 L480 190 L0 190 Z" fill="#a8a29e" stroke="#78716c" strokeWidth="1.5" strokeLinejoin="round" />,
      )}
      {el(
        'neve',
        <>
          <path d="M55 104 L70 85 L85 104 L77 100 L70 107 L63 100 Z" fill="#fff" />
          <path d="M181 77 L200 55 L219 77 L209 72 L200 81 L191 72 Z" fill="#fff" />
          <path d="M326 104 L340 90 L354 104 L346 101 L340 107 L334 101 Z" fill="#fff" />
        </>,
      )}
      {el('chaira', <path d="M0 180 Q120 168 240 178 T480 172 L480 300 L0 300 Z" fill="#86c06c" />)}
      {el(
        'rio',
        <path d="M232 150 C236 170 214 186 222 208 C230 232 262 248 252 300 L292 300 C298 262 262 236 252 212 C244 192 262 172 246 150 Z" fill="#3b9de3" stroke="#1d72b8" strokeWidth="1" />,
      )}
      {el('lago', <ellipse cx="92" cy="232" rx="54" ry="17" fill="#4fb0ee" stroke="#1d72b8" strokeWidth="1" />)}
      {el(
        'arbores',
        <>
          <Arbore x={20} y={196} />
          <Arbore x={44} y={202} s={1.15} />
          <Arbore x={70} y={194} />
          <Arbore x={150} y={196} s={0.9} />
          <Arbore x={172} y={204} />
          <Arbore x={300} y={196} s={0.9} />
          {parque && (
            <>
              <Arbore x={380} y={200} s={1.1} />
              <Arbore x={420} y={210} />
              <Arbore x={455} y={198} s={1.2} />
            </>
          )}
        </>,
      )}
      {el(
        'flores',
        <g>
          {[
            [118, 270, '#f43f5e'],
            [130, 278, '#facc15'],
            [142, 268, '#a855f7'],
            [154, 280, '#f43f5e'],
            [166, 270, '#facc15'],
            [178, 278, '#a855f7'],
            [124, 288, '#facc15'],
            [148, 290, '#f43f5e'],
            [172, 290, '#a855f7'],
          ].map(([x, y, c], i) => (
            <g key={i}>
              <path d={`M${x} ${Number(y) + 6} v6`} stroke="#15803d" strokeWidth="1.5" />
              <circle cx={x} cy={y} r="4.5" fill={String(c)} />
              <circle cx={x} cy={y} r="1.6" fill="#fff7ed" />
            </g>
          ))}
        </g>,
      )}
      {construidos && (
        <>
          {el(
            'estrada',
            <path d="M266 228 Q320 222 352 240 T480 252" stroke="#6b7280" strokeWidth="11" fill="none" strokeLinecap="round" />,
          )}
          {el(
            'ponte',
            <g>
              <path d="M200 222 L290 222 L290 232 L200 232 Z" fill="#a1a1aa" stroke="#52525b" strokeWidth="1.2" />
              <path d="M214 232 Q245 210 276 232" fill="none" stroke="#52525b" strokeWidth="3" />
              <path d="M200 222 L290 222" stroke="#52525b" strokeWidth="2" />
            </g>,
          )}
          {el(
            'casas',
            <>
              <Casa x={392} y={226} cor="#dc2626" />
              <Casa x={428} y={218} cor="#ea580c" />
              <Casa x={462} y={230} cor="#dc2626" />
            </>,
          )}
          {el(
            'horta',
            <g>
              <path d="M300 262 L390 262 L400 296 L310 296 Z" fill="#a16207" stroke="#713f12" strokeWidth="1" />
              {[270, 279, 288].map((y) => (
                <g key={y}>
                  {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                    <circle key={i} cx={312 + i * 12 + (y - 262) * 0.3} cy={y} r="3.5" fill="#4ade80" />
                  ))}
                </g>
              ))}
            </g>,
          )}
        </>
      )}
      {parque && (
        <g pointerEvents="none">
          <Vaca x={150} y={238} />
          <Vaca x={330} y={256} s={1.1} />
          <rect x="398" y="246" width="4" height="34" fill="#78350f" />
          <rect x="452" y="246" width="4" height="34" fill="#78350f" />
          <rect x="386" y="232" width="82" height="30" rx="4" fill="#166534" stroke="#fef3c7" strokeWidth="2" />
          <text x="427" y="246" textAnchor="middle" fontSize="10" fontWeight="800" fill="#fef3c7">
            PARQUE
          </text>
          <text x="427" y="257" textAnchor="middle" fontSize="10" fontWeight="800" fill="#fef3c7">
            NATURAL
          </text>
        </g>
      )}
      {conEtiqueta.map((id) => {
        const [x, y, t] = ETIQUETA_PAISAXE[id]
        return <Pilula key={id} x={x} y={y} texto={t} marca={marcas[id]} cor={COR_TIPO[TIPO_PAISAXE[id]]} tam={14} />
      })}
    </svg>
  )
}
