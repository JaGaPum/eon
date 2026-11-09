// Debuxos propios de «O planeta da vida»: os seres vivos, as funcións vitais, as células, os fungos e as bacterias.
// Os seres que só se ven co microscopio debúxanse dentro dunha lente redonda, coma no libro.
import type { ReactNode } from 'react'
import type { Debuxo } from '../pezas'
import { tocable } from '../paisaxes/debuxos'
import { Etiquetas, Svg, type Props } from '../../historia/parcial1/debuxos'
import { NOME_FORMA, NOME_REINO, REINOS, ser, type Forma, type Reino } from '../../lib/seresVivos'

const T = '#1e293b'

/** Fondo de lente de microscopio. */
const Lente = ({ children }: { children: ReactNode }) => (
  <>
    <circle cx="50" cy="50" r="46" fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="4" />
    {children}
    <circle cx="50" cy="50" r="46" fill="none" stroke="#0369a1" strokeWidth="1.5" />
  </>
)

const Varas = ({ cor, pts }: { cor: string; pts: [number, number, number][] }) => (
  <g fill={cor} stroke="#1e1b4b" strokeWidth="0.8">
    {pts.map(([x, y, a], i) => (
      <rect key={i} x={x - 9} y={y - 3.5} width="18" height="7" rx="3.5" transform={`rotate(${a} ${x} ${y})`} />
    ))}
  </g>
)

/** O debuxo de cada ser vivo, nun cadrado de 100 × 100. */
const ARTE: Record<string, ReactNode> = {
  amapola: (
    <>
      <path d="M50 96 C48 80 52 66 50 50" stroke="#15803d" strokeWidth="4" fill="none" />
      <path d="M50 78 q12 -6 16 -16" stroke="#15803d" strokeWidth="3" fill="none" />
      <ellipse cx="68" cy="58" rx="4" ry="7" fill="#4d7c0f" transform="rotate(30 68 58)" />
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="50" cy="26" rx="14" ry="17" fill="#dc2626" transform={`rotate(${a} 50 36)`} />
      ))}
      <circle cx="50" cy="36" r="8" fill="#111827" />
    </>
  ),
  arbore: (
    <>
      <path d="M46 96 L48 56 L36 44 M48 60 L62 44 L54 40 M52 96 L52 58" stroke="#78350f" strokeWidth="6" fill="none" strokeLinejoin="round" />
      <ellipse cx="50" cy="36" rx="44" ry="13" fill="#4d7c0f" />
      <ellipse cx="44" cy="28" rx="30" ry="9" fill="#65a30d" />
      <path d="M2 96 H98" stroke="#ca8a04" strokeWidth="5" />
    </>
  ),
  palmeira: (
    <>
      <path d="M2 96 Q50 84 98 96 Z" fill="#fbbf24" />
      <path d="M50 92 C52 70 48 50 52 30" stroke="#92400e" strokeWidth="7" fill="none" />
      {[
        'M52 30 Q30 14 10 30',
        'M52 30 Q34 30 18 50',
        'M52 30 Q72 14 92 30',
        'M52 30 Q70 30 84 50',
        'M52 30 Q50 12 40 4',
      ].map((d) => (
        <path key={d} d={d} stroke="#15803d" strokeWidth="7" fill="none" strokeLinecap="round" />
      ))}
    </>
  ),
  xirasol: (
    <>
      <path d="M50 96 V54" stroke="#15803d" strokeWidth="5" />
      <ellipse cx="38" cy="74" rx="11" ry="5" fill="#16a34a" transform="rotate(-30 38 74)" />
      {Array.from({ length: 12 }, (_, i) => (
        <ellipse key={i} cx="50" cy="12" rx="6" ry="13" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" transform={`rotate(${i * 30} 50 32)`} />
      ))}
      <circle cx="50" cy="32" r="13" fill="#78350f" />
    </>
  ),
  paporrubio: (
    <>
      <path d="M30 80 L18 92 M40 80 L40 94" stroke="#57534e" strokeWidth="3" />
      <path d="M20 86 L88 86" stroke="#78350f" strokeWidth="5" />
      <ellipse cx="48" cy="58" rx="30" ry="24" fill="#a16207" />
      <path d="M22 62 L4 72 L20 52 Z" fill="#854d0e" />
      <circle cx="64" cy="40" r="17" fill="#a16207" />
      <path d="M50 52 C56 38 76 36 80 50 C80 66 64 78 50 74 Z" fill="#ea580c" />
      <circle cx="68" cy="36" r="3" fill={T} />
      <path d="M80 40 L92 43 L80 46 Z" fill="#422006" />
    </>
  ),
  pinguin: (
    <>
      <ellipse cx="50" cy="56" rx="26" ry="36" fill="#1f2937" />
      <ellipse cx="52" cy="62" rx="17" ry="27" fill="#fff" />
      <circle cx="50" cy="24" r="16" fill="#1f2937" />
      <circle cx="56" cy="22" r="3" fill="#fff" />
      <circle cx="57" cy="22" r="1.5" fill={T} />
      <path d="M62 26 L76 30 L62 32 Z" fill="#f97316" />
      <path d="M38 92 L30 97 L48 97 Z M60 92 L54 97 L72 97 Z" fill="#f97316" />
      <path d="M26 52 Q16 70 24 82" stroke="#1f2937" strokeWidth="7" fill="none" strokeLinecap="round" />
    </>
  ),
  bolboreta: (
    <>
      <path d="M48 46 C30 14 4 20 10 44 C14 58 34 56 48 50 Z M52 46 C70 14 96 20 90 44 C86 58 66 56 52 50 Z" fill="#f97316" stroke={T} strokeWidth="2.5" />
      <path d="M48 52 C34 60 22 80 34 86 C44 90 48 70 49 56 Z M52 52 C66 60 78 80 66 86 C56 90 52 70 51 56 Z" fill="#ea580c" stroke={T} strokeWidth="2.5" />
      {[
        [20, 36],
        [28, 28],
        [80, 36],
        [72, 28],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="3.5" fill="#fef3c7" />
      ))}
      <ellipse cx="50" cy="54" rx="4" ry="22" fill={T} />
      <path d="M48 34 Q42 20 36 16 M52 34 Q58 20 64 16" stroke={T} strokeWidth="2" fill="none" />
    </>
  ),
  xirafa: (
    <>
      <path d="M40 62 L38 96 M48 64 L48 96 M68 64 L70 96 M76 60 L80 96" stroke="#ca8a04" strokeWidth="6" />
      <ellipse cx="58" cy="60" rx="26" ry="12" fill="#facc15" />
      <path d="M38 58 L26 14 L36 12 L48 54 Z" fill="#facc15" />
      <ellipse cx="26" cy="12" rx="12" ry="7" fill="#facc15" />
      <path d="M22 6 l-2 -6 M30 5 l1 -6" stroke="#92400e" strokeWidth="2.5" />
      <circle cx="24" cy="10" r="1.8" fill={T} />
      {[
        [50, 58],
        [62, 64],
        [70, 56],
        [34, 34],
        [31, 22],
        [40, 46],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="3.5" fill="#b45309" />
      ))}
    </>
  ),
  polbo: (
    <>
      <rect x="0" y="0" width="100" height="100" rx="12" fill="#bae6fd" />
      {[14, 28, 42, 58, 72, 86].map((x, i) => (
        <path key={x} d={`M50 52 Q${x} 70 ${x + (i % 2 ? 6 : -6)} 92`} stroke="#e11d48" strokeWidth="7" fill="none" strokeLinecap="round" />
      ))}
      <ellipse cx="50" cy="36" rx="24" ry="24" fill="#f43f5e" />
      <circle cx="42" cy="40" r="4" fill="#fff" />
      <circle cx="58" cy="40" r="4" fill="#fff" />
      <circle cx="42" cy="41" r="2" fill={T} />
      <circle cx="58" cy="41" r="2" fill={T} />
    </>
  ),
  niscaro: (
    <>
      <path d="M8 92 Q50 82 92 92" stroke="#4d7c0f" strokeWidth="6" fill="none" />
      <path d="M42 54 L40 90 L60 90 L58 54 Z" fill="#f4a460" stroke="#b45309" strokeWidth="1.5" />
      <path d="M8 46 C10 20 90 20 92 46 C80 40 62 52 50 56 C38 52 20 40 8 46 Z" fill="#ea7a2a" stroke="#9a3412" strokeWidth="2" />
      {[16, 26, 36, 46, 56, 66, 76, 86].map((x) => (
        <path key={x} d={`M${x} 46 L50 ${54}`} stroke="#c2410c" strokeWidth="1.2" />
      ))}
    </>
  ),
  amanita: (
    <>
      <path d="M8 92 Q50 84 92 92" stroke="#4d7c0f" strokeWidth="6" fill="none" />
      <path d="M43 50 L41 90 L59 90 L57 50 Z" fill="#fff7ed" stroke="#a8a29e" strokeWidth="1.5" />
      <path d="M40 66 h20" stroke="#a8a29e" strokeWidth="3" />
      <path d="M6 52 C8 12 92 12 94 52 Z" fill="#dc2626" stroke="#7f1d1d" strokeWidth="2" />
      {[
        [24, 34],
        [40, 24],
        [58, 26],
        [74, 36],
        [48, 40],
        [30, 46],
        [68, 46],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="4" fill="#fff" />
      ))}
    </>
  ),
  champinon: (
    <>
      <path d="M8 90 Q50 80 92 90" stroke="#78350f" strokeWidth="8" fill="none" />
      <path d="M40 56 L38 86 L62 86 L60 56 Z" fill="#f5f5f4" stroke="#a8a29e" strokeWidth="1.5" />
      <ellipse cx="50" cy="48" rx="36" ry="24" fill="#fafaf9" stroke="#a8a29e" strokeWidth="2" />
      <ellipse cx="40" cy="40" rx="12" ry="6" fill="#fff" />
    </>
  ),
  mofo: (
    <>
      <path d="M14 40 C10 18 40 12 50 22 C60 12 90 18 86 40 L86 90 L14 90 Z" fill="#d6a15d" stroke="#92400e" strokeWidth="3" />
      <path d="M22 44 L22 82 L78 82 L78 44" fill="#fde7c0" />
      {[
        [34, 56, 11],
        [60, 66, 13],
        [46, 34, 9],
        [66, 46, 7],
        [30, 74, 6],
      ].map(([x, y, r]) => (
        <g key={`${x}${y}`}>
          <circle cx={x} cy={y} r={r} fill="#65a30d" opacity="0.75" />
          <circle cx={x} cy={y} r={r * 0.6} fill="#94a3b8" />
          <circle cx={x - 2} cy={y - 2} r={r * 0.25} fill="#e2e8f0" />
        </g>
      ))}
    </>
  ),
  fermento: (
    <Lente>
      {[
        [32, 36],
        [56, 30],
        [70, 54],
        [44, 60],
        [28, 66],
        [58, 76],
      ].map(([x, y], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y} rx="10" ry="8" fill="#fde68a" stroke="#b45309" strokeWidth="1.5" />
          {i % 2 === 0 && <ellipse cx={x + 9} cy={y - 6} rx="4.5" ry="3.5" fill="#fde68a" stroke="#b45309" strokeWidth="1.2" />}
        </g>
      ))}
    </Lente>
  ),
  ameba: (
    <Lente>
      <path d="M30 40 C26 22 46 28 50 20 C58 10 66 30 76 30 C88 32 76 48 80 56 C86 70 66 70 60 78 C52 90 42 72 30 76 C16 78 24 60 18 54 C12 46 32 50 30 40 Z" fill="#a7f3d0" stroke="#047857" strokeWidth="2.5" />
      <circle cx="52" cy="52" r="8" fill="#f97316" />
      <circle cx="38" cy="62" r="3" fill="#047857" opacity="0.5" />
      <circle cx="66" cy="44" r="3.5" fill="#047857" opacity="0.5" />
    </Lente>
  ),
  protozoo: (
    <Lente>
      <path d="M22 62 C14 40 42 22 64 24 C84 26 86 44 78 56 C68 72 34 82 22 62 Z" fill="#c7d2fe" stroke="#4338ca" strokeWidth="2.5" />
      {Array.from({ length: 22 }, (_, i) => {
        const a = (i / 22) * 2 * Math.PI
        const x = 52 + Math.cos(a) * 32
        const y = 50 + Math.sin(a) * 24
        return <path key={i} d={`M${x} ${y} l${Math.cos(a) * 6} ${Math.sin(a) * 6}`} stroke="#4338ca" strokeWidth="1.3" />
      })}
      <ellipse cx="54" cy="48" rx="8" ry="6" fill="#818cf8" />
      <path d="M40 60 q6 -6 12 0" stroke="#4338ca" strokeWidth="2" fill="none" />
    </Lente>
  ),
  algaVerde: (
    <>
      <path d="M10 94 Q50 86 90 94" stroke="#d6a15d" strokeWidth="6" fill="none" />
      {[
        'M50 92 C40 70 58 50 44 20',
        'M48 92 C30 74 30 50 22 34',
        'M52 92 C66 74 74 56 72 28',
        'M50 92 C58 72 50 56 60 40',
      ].map((d) => (
        <path key={d} d={d} stroke="#16a34a" strokeWidth="8" fill="none" strokeLinecap="round" />
      ))}
      <circle cx="30" cy="22" r="3" fill="#7dd3fc" />
      <circle cx="78" cy="16" r="2.5" fill="#7dd3fc" />
    </>
  ),
  algaVermella: (
    <>
      <rect x="0" y="0" width="100" height="100" rx="12" fill="#bae6fd" />
      <ellipse cx="50" cy="88" rx="30" ry="9" fill="#a8a29e" />
      {Array.from({ length: 9 }, (_, i) => {
        const a = -150 + i * 15
        const r = (a * Math.PI) / 180
        return (
          <g key={i} stroke="#e11d48" strokeWidth="3" fill="none" strokeLinecap="round">
            <path d={`M50 82 L${50 + Math.cos(r) * 40} ${82 + Math.sin(r) * 60}`} />
            <path d={`M${50 + Math.cos(r) * 22} ${82 + Math.sin(r) * 33} l${Math.cos(r - 0.6) * 10} ${Math.sin(r - 0.6) * 10}`} />
            <path d={`M${50 + Math.cos(r) * 30} ${82 + Math.sin(r) * 45} l${Math.cos(r + 0.6) * 9} ${Math.sin(r + 0.6) * 9}`} />
          </g>
        )
      })}
    </>
  ),
  algaMicro: (
    <Lente>
      <path d="M50 14 C80 14 86 46 50 50 C86 54 80 86 50 86 C20 86 14 54 50 50 C14 46 20 14 50 14 Z" fill="#86efac" stroke="#15803d" strokeWidth="2.5" />
      <path d="M18 50 H82" stroke="#15803d" strokeWidth="2" />
      <path d="M40 24 L50 44 L60 24 M40 76 L50 56 L60 76" stroke="#166534" strokeWidth="4" fill="none" />
    </Lente>
  ),
  bacteriaIogur: (
    <Lente>
      <Varas
        cor="#a78bfa"
        pts={[
          [26, 40, 0],
          [44, 40, 0],
          [62, 42, 10],
          [30, 62, -20],
          [46, 66, 0],
          [64, 64, 0],
          [78, 58, -40],
          [50, 22, 30],
          [40, 82, 15],
        ]}
      />
    </Lente>
  ),
  bacteriaTetano: (
    <Lente>
      <rect x="4" y="4" width="92" height="92" rx="46" fill="#1e293b" />
      {[
        [34, 34, 40],
        [62, 30, -30],
        [30, 64, -60],
        [60, 64, 20],
        [48, 50, 80],
        [76, 50, 70],
      ].map(([x, y, a], i) => (
        <g key={i} transform={`rotate(${a} ${x} ${y})`}>
          <path d={`M${x - 16} ${y} l-6 -5 M${x + 16} ${y} l6 4`} stroke="#bef264" strokeWidth="1" />
          <ellipse cx={x} cy={y} rx="16" ry="6" fill="#fb7185" />
        </g>
      ))}
    </Lente>
  ),
  persoa: (
    <>
      <circle cx="50" cy="22" r="14" fill="#fcd34d" stroke="#92400e" strokeWidth="1.5" />
      <path d="M36 18 C38 4 62 4 64 18 C58 12 42 12 36 18 Z" fill="#78350f" />
      <circle cx="45" cy="22" r="1.8" fill={T} />
      <circle cx="55" cy="22" r="1.8" fill={T} />
      <path d="M45 28 q5 4 10 0" stroke={T} strokeWidth="1.5" fill="none" />
      <path d="M30 70 C30 46 70 46 70 70 L66 70 L64 56 L62 96 L54 96 L50 72 L46 96 L38 96 L36 56 L34 70 Z" fill="#7c3aed" />
    </>
  ),
}

/** Un ser vivo debuxado. Se só se ve co microscopio, vai dentro dunha lente. */
export function DebuxoSer({ id, tam = 110 }: { id: string; tam?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={tam} height={tam} role="img" aria-label={id === 'persoa' ? 'unha persoa' : ser(id).nome} className="inline-block">
      {ARTE[id]}
    </svg>
  )
}

/** Un ser dentro doutro debuxo. */
const SerEn = ({ id, x, y, tam }: { id: string; x: number; y: number; tam: number }) => (
  <svg x={x} y={y} width={tam} height={tam} viewBox="0 0 100 100" pointerEvents="none">
    {ARTE[id]}
  </svg>
)

export const nomeSer = (id: string) => (id === 'persoa' ? 'unha persoa' : ser(id).nome)

/** Unha fila de seres vivos que se poden tocar. Cada un, co seu nome debaixo cando hai etiquetas. */
export function galeria(ids: string[]): Debuxo {
  return function Galeria({ onToca, marcas = {}, etiquetas = true }: Props) {
    const el = tocable(onToca, marcas)
    const porFila = Math.min(ids.length, 5)
    const filas = Math.ceil(ids.length / porFila)
    const w = 480 / porFila
    const tam = Math.min(w - 12, 84)
    const altoFila = tam + 34
    return (
      <Svg alto={filas * altoFila + 6} etiqueta="Seres vivos">
        <rect width="480" height={filas * altoFila + 6} fill="#fff" />
        {ids.map((id, i) => {
          const x = (i % porFila) * w
          const y = Math.floor(i / porFila) * altoFila + 4
          return el(
            id,
            <>
              <rect x={x + 2} y={y} width={w - 4} height={altoFila - 4} rx="12" fill={marcas[id] === 'ben' ? '#d1fae5' : marcas[id] === 'mal' ? '#ffe4e6' : '#f8fafc'} stroke="#e2e8f0" />
              <SerEn id={id} x={x + (w - tam) / 2} y={y + 4} tam={tam} />
            </>,
          )
        })}
        <Etiquetas
          sitios={Object.fromEntries(ids.map((id, i) => [id, [(i % porFila) * w + w / 2, Math.floor(i / porFila) * altoFila + tam + 20, nomeSer(id).replace(/^(o|a|os|as|unha) /, '')]])) as Record<string, [number, number, string]>}
          marcas={marcas}
          etiquetas={etiquetas}
          tam={12}
        />
      </Svg>
    )
  }
}

// ——— Os cinco reinos ———

const MOSTRA: Record<Reino, string> = { plantas: 'amapola', animais: 'paporrubio', fungos: 'amanita', protistas: 'ameba', bacterias: 'bacteriaIogur' }
const COR_REINO: Record<Reino, string> = { plantas: '#dcfce7', animais: '#ffe4e6', fungos: '#fef3c7', protistas: '#ede9fe', bacterias: '#ccfbf1' }
export const NOMES_REINOS: Record<string, string> = Object.fromEntries(REINOS.map((r) => [r, `o reino ${r === 'plantas' || r === 'bacterias' ? 'das' : 'dos'} ${r}`]))

/** Os cinco reinos, cada un cun ser vivo de mostra. */
export function CincoReinos({ onToca, marcas = {}, etiquetas = true }: Props) {
  const el = tocable(onToca, marcas)
  const w = 96
  return (
    <Svg alto={150} etiqueta="Os cinco reinos">
      {REINOS.map((r, i) =>
        el(
          r,
          <>
            <rect x={i * w + 2} y="2" width={w - 4} height="146" rx="14" fill={COR_REINO[r]} stroke="#cbd5e1" />
            <SerEn id={MOSTRA[r]} x={i * w + 8} y={8} tam={80} />
          </>,
        ),
      )}
      <Etiquetas sitios={Object.fromEntries(REINOS.map((r, i) => [r, [i * w + w / 2, 122, NOME_REINO[r]]])) as Record<string, [number, number, string]>} marcas={marcas} etiquetas={etiquetas} tam={14} />
    </Svg>
  )
}

// ——— As funcións vitais ———

export const NOMES_FUNCIONS: Record<string, string> = { nutricion: 'a nutrición', relacion: 'a relación', reproducion: 'a reprodución' }

/** Tres escenas: un coello come (nutrición), un paxaro ve o gato e foxe (relación) e unha semente xermola (reprodución). */
export function FuncionsVitais({ onToca, marcas = {}, etiquetas = true }: Props) {
  const el = tocable(onToca, marcas)
  const fondo = (id: string) => (marcas[id] === 'ben' ? '#d1fae5' : marcas[id] === 'mal' ? '#ffe4e6' : '#f0fdf4')
  return (
    <Svg alto={200} etiqueta="As funcións vitais">
      {el(
        'nutricion',
        <g>
          <rect x="2" y="2" width="154" height="196" rx="14" fill={fondo('nutricion')} stroke="#bbf7d0" />
          <path d="M10 160 H150" stroke="#84cc16" strokeWidth="6" />
          <ellipse cx="62" cy="128" rx="34" ry="26" fill="#a8a29e" />
          <circle cx="96" cy="106" r="18" fill="#a8a29e" />
          <ellipse cx="88" cy="74" rx="6" ry="18" fill="#a8a29e" transform="rotate(-15 88 74)" />
          <ellipse cx="100" cy="72" rx="6" ry="18" fill="#a8a29e" transform="rotate(10 100 72)" />
          <circle cx="102" cy="102" r="3" fill={T} />
          <circle cx="30" cy="132" r="7" fill="#f5f5f4" />
          <path d="M108 116 L140 130 L112 122 Z" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" />
          <path d="M140 130 l8 -6 M140 130 l9 2" stroke="#16a34a" strokeWidth="3" />
        </g>,
      )}
      {el(
        'relacion',
        <g>
          <rect x="163" y="2" width="154" height="196" rx="14" fill={fondo('relacion')} stroke="#bbf7d0" />
          <path d="M171 160 H311" stroke="#84cc16" strokeWidth="6" />
          {/* gato */}
          <ellipse cx="206" cy="140" rx="24" ry="16" fill="#f59e0b" />
          <circle cx="226" cy="120" r="13" fill="#f59e0b" />
          <path d="M218 110 l2 -12 l6 8 M230 108 l4 -11 l3 11" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2" />
          <circle cx="230" cy="118" r="2.5" fill={T} />
          <path d="M182 136 q-12 -16 -4 -30" stroke="#f59e0b" strokeWidth="5" fill="none" strokeLinecap="round" />
          {/* paxaro que foxe */}
          <path d="M262 64 q10 -18 22 -6 q12 -16 20 2" stroke="#2563eb" strokeWidth="5" fill="none" strokeLinecap="round" />
          <circle cx="284" cy="62" r="7" fill="#2563eb" />
          <path d="M248 86 l-12 8 M254 96 l-14 4 M256 76 l-14 2" stroke="#64748b" strokeWidth="2" />
          <text x="244" y="48" fontSize="26" fontWeight="900" fill="#dc2626">!</text>
        </g>,
      )}
      {el(
        'reproducion',
        <g>
          <rect x="324" y="2" width="154" height="196" rx="14" fill={fondo('reproducion')} stroke="#bbf7d0" />
          <rect x="332" y="150" width="138" height="40" rx="6" fill="#78350f" />
          <ellipse cx="400" cy="152" rx="16" ry="10" fill="#d97706" stroke="#92400e" strokeWidth="1.5" />
          <path d="M400 146 C398 120 402 100 400 84" stroke="#16a34a" strokeWidth="5" fill="none" />
          <path d="M400 92 C384 74 362 78 360 86 C374 92 390 94 400 92 Z" fill="#22c55e" />
          <path d="M400 88 C414 66 438 70 440 78 C426 86 410 90 400 88 Z" fill="#4ade80" />
          <path d="M400 156 l-10 24 M400 156 l6 26 M400 156 l16 18" stroke="#fde68a" strokeWidth="2" />
        </g>,
      )}
      <Etiquetas sitios={{ nutricion: [79, 30, 'nutrición'], relacion: [240, 30, 'relación'], reproducion: [401, 30, 'reprodución'] }} marcas={marcas} etiquetas={etiquetas} tam={15} />
    </Svg>
  )
}

// ——— As células ———

export const NOMES_CELULAS: Record<string, string> = { uni: 'o ser vivo unicelular', pluri: 'o ser vivo pluricelular' }

/** Unicelular (unha soa célula, vista co microscopio) e pluricelular (unha folla feita de moitas células). */
export function Celulas({ onToca, marcas = {}, etiquetas = true }: Props) {
  const el = tocable(onToca, marcas)
  const celas: ReactNode[] = []
  for (let f = 0; f < 7; f++)
    for (let c = 0; c < 9; c++) {
      const x = 286 + c * 18 + (f % 2) * 9
      const y = 48 + f * 18
      const dx = x - 360
      const dy = y - 104
      if ((dx * dx) / (82 * 82) + (dy * dy) / (60 * 60) < 1) celas.push(<rect key={`${f}-${c}`} x={x} y={y} width="16" height="16" rx="4" fill="#4ade80" stroke="#166534" strokeWidth="1.2" />)
    }
  return (
    <Svg alto={210} etiqueta="Unicelulares e pluricelulares">
      <rect width="480" height="210" fill="#fff" />
      {el(
        'uni',
        <g>
          <circle cx="120" cy="104" r="86" fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="5" />
          <path d="M84 88 C80 60 120 66 130 56 C150 44 160 80 166 96 C172 120 150 140 124 142 C96 144 74 124 84 88 Z" fill="#a7f3d0" stroke="#047857" strokeWidth="3" />
          <circle cx="124" cy="100" r="13" fill="#f97316" />
        </g>,
      )}
      {el(
        'pluri',
        <g>
          <path d="M276 104 C290 40 420 30 446 104 C420 178 290 168 276 104 Z" fill="#bbf7d0" />
          {celas}
          <path d="M270 104 H452" stroke="#166534" strokeWidth="3" />
        </g>,
      )}
      <Etiquetas sitios={{ uni: [120, 196, 'unha soa célula'], pluri: [362, 196, 'moitas células'] }} marcas={marcas} etiquetas={etiquetas} tam={14} />
    </Svg>
  )
}

// ——— Os fungos ———

export const NOMES_FUNGO: Record<string, string> = { cogomelo: 'o cogomelo', fungo: 'o fungo baixo a terra', restos: 'os restos doutros seres vivos' }

/** Un fungo con cogomelo: a maior parte vive baixo a terra e o cogomelo sae nalgunhas épocas. */
export function FungoCogomelo({ onToca, marcas = {}, etiquetas = true }: Props) {
  const el = tocable(onToca, marcas)
  const fios = ['M240 140 C200 160 160 150 120 180', 'M240 140 C280 170 330 160 370 190', 'M240 140 C230 180 250 200 236 230', 'M200 160 C190 190 160 200 150 230', 'M300 164 C320 190 300 210 316 236', 'M150 176 C120 190 90 200 60 196', 'M340 178 C380 180 410 196 430 214']
  return (
    <Svg alto={250} etiqueta="Un fungo con cogomelo">
      <rect width="480" height="120" fill="#e0f2fe" />
      <rect y="120" width="480" height="130" fill="#92400e" />
      {el(
        'restos',
        <g>
          <path d="M60 120 l40 -14 l20 14 Z" fill="#a16207" />
          <ellipse cx="380" cy="116" rx="30" ry="7" fill="#ca8a04" transform="rotate(-8 380 116)" />
          <ellipse cx="420" cy="118" rx="22" ry="5" fill="#b45309" transform="rotate(12 420 118)" />
          <ellipse cx="110" cy="230" rx="16" ry="5" fill="#a16207" />
        </g>,
      )}
      {el(
        'fungo',
        <g>
          <rect x="40" y="128" width="400" height="116" fill="transparent" />
          {fios.map((d) => (
            <path key={d} d={d} stroke="#fef3c7" strokeWidth="3.5" fill="none" />
          ))}
        </g>,
      )}
      {el(
        'cogomelo',
        <g>
          <path d="M228 140 L232 70 L250 70 L254 140 Z" fill="#fef3c7" stroke="#a16207" strokeWidth="2" />
          <path d="M180 76 C186 20 296 20 302 76 Z" fill="#b45309" stroke="#78350f" strokeWidth="2.5" />
        </g>,
      )}
      <Etiquetas sitios={{ cogomelo: [330, 48, 'o cogomelo'], fungo: [240, 214, 'o fungo, baixo a terra'], restos: [80, 96, 'restos'] }} marcas={marcas} etiquetas={etiquetas} tam={15} />
    </Svg>
  )
}

export const NOMES_GRUPOS_FUNGOS: Record<string, string> = { cogomelo: 'os fungos con cogomelo', mofo: 'os mofos', fermento: 'os fermentos' }

/** Os tres grupos de fungos: con cogomelo e mofos (pluricelulares) e fermentos (unicelulares). */
export function GruposFungos({ onToca, marcas = {}, etiquetas = true }: Props) {
  const el = tocable(onToca, marcas)
  const caixa = (id: string, x: number, ser: string, cor: string) =>
    el(
      id,
      <>
        <rect x={x} y="40" width="152" height="150" rx="14" fill={marcas[id] === 'ben' ? '#d1fae5' : marcas[id] === 'mal' ? '#ffe4e6' : cor} stroke="#d9f99d" strokeWidth="2" />
        <SerEn id={ser} x={x + 26} y={48} tam={100} />
      </>,
    )
  return (
    <Svg alto={230} etiqueta="Os grupos de fungos">
      <rect width="480" height="230" fill="#fff" />
      <rect x="4" y="4" width="312" height="30" rx="10" fill="#d9f99d" />
      <text x="160" y="25" textAnchor="middle" fontSize="15" fontWeight="800" fill="#365314">
        PLURICELULARES
      </text>
      <rect x="324" y="4" width="152" height="30" rx="10" fill="#fde68a" />
      <text x="400" y="25" textAnchor="middle" fontSize="15" fontWeight="800" fill="#713f12">
        UNICELULARES
      </text>
      {caixa('cogomelo', 4, 'niscaro', '#f7fee7')}
      {caixa('mofo', 164, 'mofo', '#f7fee7')}
      {caixa('fermento', 324, 'fermento', '#fefce8')}
      <Etiquetas sitios={{ cogomelo: [80, 212, 'con cogomelo'], mofo: [240, 212, 'mofos'], fermento: [400, 212, 'fermentos'] }} marcas={marcas} etiquetas={etiquetas} tam={15} />
    </Svg>
  )
}

// ——— As formas das bacterias ———

export const NOMES_FORMAS: Record<string, string> = { circular: 'a bacteria circular', alongada: 'a bacteria alongada', coma: 'a bacteria de coma', espiral: 'a bacteria en espiral' }

const FORMA_ARTE: Record<Forma, (x: number) => ReactNode> = {
  circular: (x) =>
    [
      [30, 50],
      [52, 42],
      [74, 54],
      [42, 72],
      [64, 76],
      [36, 30],
      [80, 32],
    ].map(([a, b], i) => <circle key={i} cx={x + a} cy={b + 10} r="10" fill="#a3e635" stroke="#3f6212" strokeWidth="1.5" />),
  alongada: (x) =>
    [
      [34, 34, 30],
      [70, 38, -20],
      [40, 72, -50],
      [74, 78, 10],
      [56, 56, 80],
    ].map(([a, b, r], i) => <rect key={i} x={x + a - 16} y={b + 10 - 5} width="32" height="10" rx="5" fill="#f472b6" transform={`rotate(${r} ${x + a} ${b + 10})`} />),
  coma: (x) =>
    [
      [34, 34, 0],
      [70, 44, 40],
      [40, 74, -30],
      [76, 80, 10],
    ].map(([a, b, r], i) => <path key={i} d={`M${x + a - 14} ${b + 10} q14 -16 28 0`} stroke="#facc15" strokeWidth="9" fill="none" strokeLinecap="round" transform={`rotate(${r} ${x + a} ${b + 10})`} />),
  espiral: (x) =>
    [
      [16, 36],
      [28, 68],
      [16, 100],
    ].map(([a, b], i) => <path key={i} d={`M${x + a} ${b} q6 -8 12 0 t12 0 t12 0 t12 0 t12 0 t12 0`} stroke="#fb7185" strokeWidth="4" fill="none" strokeLinecap="round" />),
}

/** As formas das bacterias: circular, alongada, de coma e en espiral. */
export function FormasBacterias({ onToca, marcas = {}, etiquetas = true }: Props) {
  const el = tocable(onToca, marcas)
  const formas: Forma[] = ['circular', 'alongada', 'coma', 'espiral']
  return (
    <Svg alto={160} etiqueta="Formas das bacterias">
      {formas.map((f, i) =>
        el(
          f,
          <>
            <rect x={i * 120 + 3} y="3" width="114" height="124" rx="14" fill="#312e81" stroke={marcas[f] === 'ben' ? '#10b981' : marcas[f] === 'mal' ? '#e11d48' : '#c7d2fe'} strokeWidth="4" />
            {FORMA_ARTE[f](i * 120 + 6)}
          </>,
        ),
      )}
      <Etiquetas sitios={Object.fromEntries(formas.map((f, i) => [f, [i * 120 + 60, 144, NOME_FORMA[f]]])) as Record<string, [number, number, string]>} marcas={marcas} etiquetas={etiquetas} tam={14} />
    </Svg>
  )
}

// ——— A gota de auga de Leeuwenhoek ———

export const NOMES_GOTA: Record<string, string> = { ameba: 'a ameba', protozoo: 'o protozoo', algaMicro: 'a alga unicelular', bacteriaIogur: 'as bacterias' }

/** Unha gota de auga vista co microscopio: está chea de seres vivos unicelulares. */
export function GotaDeAuga({ onToca, marcas = {}, etiquetas = true }: Props) {
  const el = tocable(onToca, marcas)
  const sitios: [string, number, number, number][] = [
    ['ameba', 100, 50, 130],
    ['protozoo', 250, 30, 120],
    ['algaMicro', 150, 170, 110],
    ['bacteriaIogur', 262, 150, 104],
  ]
  return (
    <Svg alto={300} etiqueta="Unha gota de auga ao microscopio">
      <circle cx="240" cy="150" r="146" fill="#e0f2fe" stroke="#0ea5e9" strokeWidth="6" />
      {sitios.map(([id, x, y, tam]) =>
        el(
          id,
          <>
            <circle cx={x + tam / 2} cy={y + tam / 2} r={tam / 2} fill="transparent" />
            <SerEn id={id} x={x} y={y} tam={tam} />
          </>,
        ),
      )}
      <Etiquetas
        sitios={Object.fromEntries(sitios.map(([id, x, y, tam]) => [id, [x + tam / 2, y + tam + 4, NOMES_GOTA[id].replace(/^(o|a|as) /, '')]])) as Record<string, [number, number, string]>}
        marcas={marcas}
        etiquetas={etiquetas}
        tam={13}
      />
    </Svg>
  )
}
