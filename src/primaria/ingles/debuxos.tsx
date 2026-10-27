// Dibujos propios de la unidad de inglés de Olivia: los animales de la unidad 1, las cosas del dormitorio de la unidad 2
// y las preposiciones. Cada uno es un pictograma sencillo en un cuadro de 100 × 100.
import type { ReactNode } from 'react'
import type { Debuxo, Marca } from '../pezas'
import { VERDE, VERMELLO } from '../paisaxes/debuxos'

const P: Record<string, ReactNode> = {
  // ——— Animales ———
  scorpion: (
    <g stroke="#7c2d12" strokeWidth="2.5" fill="#c2410c" strokeLinecap="round">
      <ellipse cx="50" cy="62" rx="16" ry="10" />
      {[-1, 1].map((s) => [0, 1, 2].map((i) => <path key={`${s}${i}`} d={`M${50 + s * 10} ${62 + i * 3} l${s * 14} ${6 + i * 4}`} fill="none" />))}
      <path d="M50 52 C50 30, 70 22, 74 34 L68 36" fill="none" strokeWidth="5" />
      <path d="M40 58 L24 44 M60 58 L76 66" fill="none" strokeWidth="3" />
      <circle cx="22" cy="42" r="5" />
      <circle cx="78" cy="67" r="5" />
    </g>
  ),
  dolphin: (
    <g>
      <path d="M12 60 C24 32, 62 28, 84 44 L96 42 L88 52 C80 66, 46 72, 22 66 L10 76 L14 62 Z" fill="#94a3b8" stroke="#475569" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M48 36 L56 22 L62 38" fill="#94a3b8" stroke="#475569" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="78" cy="46" r="2.5" fill="#1e293b" />
      <path d="M30 62 C46 64, 64 60, 80 52" stroke="#e2e8f0" strokeWidth="4" fill="none" />
    </g>
  ),
  snake: (
    <g>
      <path d="M18 82 C10 62, 40 60, 50 70 C62 82, 90 74, 80 54 C72 40, 40 50, 34 34 C30 22, 46 14, 58 20" stroke="#15803d" strokeWidth="12" fill="none" strokeLinecap="round" />
      <circle cx="62" cy="20" r="9" fill="#15803d" />
      <circle cx="64" cy="17" r="2" fill="#fff" />
      <path d="M70 22 l8 2 m-8 -2 l7 5" stroke="#dc2626" strokeWidth="2" />
    </g>
  ),
  frog: (
    <g>
      <ellipse cx="50" cy="62" rx="30" ry="22" fill="#4ade80" stroke="#166534" strokeWidth="2.5" />
      <circle cx="36" cy="38" r="11" fill="#4ade80" stroke="#166534" strokeWidth="2.5" />
      <circle cx="64" cy="38" r="11" fill="#4ade80" stroke="#166534" strokeWidth="2.5" />
      <circle cx="36" cy="38" r="5" fill="#1e293b" />
      <circle cx="64" cy="38" r="5" fill="#1e293b" />
      <path d="M36 66 Q50 76 64 66" stroke="#166534" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M22 80 l-8 6 M78 80 l8 6" stroke="#166534" strokeWidth="5" strokeLinecap="round" />
    </g>
  ),
  parrot: (
    <g>
      <path d="M44 88 L50 96 L56 88" fill="#2563eb" />
      <ellipse cx="50" cy="58" rx="18" ry="28" fill="#dc2626" stroke="#7f1d1d" strokeWidth="2.5" />
      <path d="M36 52 C26 64, 30 80, 40 84 L46 60 Z" fill="#facc15" stroke="#a16207" strokeWidth="2" />
      <path d="M40 66 C32 76, 36 86, 44 86" fill="#2563eb" />
      <circle cx="54" cy="28" r="14" fill="#dc2626" stroke="#7f1d1d" strokeWidth="2.5" />
      <circle cx="56" cy="25" r="5" fill="#fff" />
      <circle cx="57" cy="25" r="2.5" fill="#1e293b" />
      <path d="M64 26 C80 26, 78 42, 68 40 L64 34 Z" fill="#1e293b" />
    </g>
  ),
  lizard: (
    <g fill="#84cc16" stroke="#3f6212" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M50 14 C60 14, 60 30, 56 40 L58 70 C60 82, 70 86, 74 94 C62 92, 50 84, 46 70 L44 40 C40 30, 40 14, 50 14 Z" />
      <path d="M44 44 L26 36 M56 44 L74 36 M46 64 L28 74 M56 64 L74 72" fill="none" strokeWidth="5" />
      <circle cx="45" cy="22" r="2" fill="#1e293b" stroke="none" />
      <circle cx="55" cy="22" r="2" fill="#1e293b" stroke="none" />
    </g>
  ),
  butterfly: (
    <g stroke="#1e3a8a" strokeWidth="2.5" strokeLinejoin="round">
      <path d="M50 46 C34 18, 8 20, 14 42 C18 56, 40 54, 50 50 Z" fill="#60a5fa" />
      <path d="M50 46 C66 18, 92 20, 86 42 C82 56, 60 54, 50 50 Z" fill="#60a5fa" />
      <path d="M50 52 C36 58, 18 70, 30 82 C40 90, 48 70, 50 56 Z" fill="#93c5fd" />
      <path d="M50 52 C64 58, 82 70, 70 82 C60 90, 52 70, 50 56 Z" fill="#93c5fd" />
      <rect x="47" y="34" width="6" height="40" rx="3" fill="#1e293b" />
      <path d="M48 34 L40 20 M52 34 L60 20" fill="none" stroke="#1e293b" />
    </g>
  ),
  worm: (
    <g>
      <path d="M14 70 C24 50, 38 50, 46 64 C54 78, 70 78, 80 58 C84 50, 88 46, 92 46" stroke="#f472b6" strokeWidth="14" fill="none" strokeLinecap="round" />
      {[24, 36, 50, 62, 74].map((x) => (
        <path key={x} d={`M${x} 52 l3 22`} stroke="#be185d" strokeWidth="1.5" opacity="0.6" transform={`rotate(${x > 46 ? -20 : 20} ${x} 62)`} />
      ))}
      <circle cx="90" cy="44" r="2" fill="#1e293b" />
    </g>
  ),
  // ——— El dormitorio ———
  bed: (
    <g stroke="#1e3a8a" strokeWidth="2.5" strokeLinejoin="round">
      <rect x="10" y="30" width="10" height="56" rx="3" fill="#a16207" />
      <rect x="80" y="50" width="10" height="36" rx="3" fill="#a16207" />
      <rect x="18" y="50" width="66" height="22" rx="4" fill="#60a5fa" />
      <rect x="22" y="40" width="22" height="14" rx="6" fill="#fff" />
      <path d="M50 50 L84 50 L84 72 L50 72" fill="#3b82f6" />
    </g>
  ),
  rug: (
    <g>
      <rect x="14" y="30" width="72" height="44" rx="4" fill="#db2777" stroke="#831843" strokeWidth="2.5" />
      <rect x="22" y="38" width="56" height="28" fill="none" stroke="#fbcfe8" strokeWidth="3" />
      <path d="M30 52 L40 44 L50 52 L60 44 L70 52" stroke="#fde047" strokeWidth="3" fill="none" />
      {[20, 28, 36, 44, 52, 60, 68, 76].map((x) => (
        <g key={x} stroke="#831843" strokeWidth="2">
          <line x1={x + 2} y1="22" x2={x + 2} y2="30" />
          <line x1={x + 2} y1="74" x2={x + 2} y2="82" />
        </g>
      ))}
    </g>
  ),
  'alarm clock': (
    <g stroke="#0f766e" strokeWidth="2.5">
      <circle cx="30" cy="22" r="10" fill="#2dd4bf" />
      <circle cx="70" cy="22" r="10" fill="#2dd4bf" />
      <circle cx="50" cy="54" r="30" fill="#2dd4bf" />
      <circle cx="50" cy="54" r="23" fill="#fff" />
      <path d="M50 54 L50 38 M50 54 L62 60" strokeWidth="4" strokeLinecap="round" stroke="#1e293b" />
      <path d="M30 82 L24 92 M70 82 L76 92" strokeWidth="5" strokeLinecap="round" />
    </g>
  ),
  guitar: (
    <g stroke="#78350f" strokeWidth="2.5" strokeLinejoin="round">
      <rect x="64" y="8" width="10" height="44" rx="2" fill="#92400e" transform="rotate(35 69 30)" />
      <path d="M44 42 C28 34, 14 48, 22 60 C14 72, 28 92, 44 82 C56 90, 70 76, 62 64 C72 54, 58 38, 44 42 Z" fill="#f59e0b" />
      <circle cx="44" cy="62" r="7" fill="#78350f" />
      <rect x="74" y="4" width="14" height="10" rx="2" fill="#78350f" transform="rotate(35 81 9)" />
    </g>
  ),
  photos: (
    <g stroke="#475569" strokeWidth="2.5">
      <rect x="12" y="20" width="34" height="40" fill="#fff" transform="rotate(-8 29 40)" />
      <rect x="17" y="25" width="24" height="22" fill="#fda4af" stroke="none" transform="rotate(-8 29 40)" />
      <rect x="52" y="34" width="36" height="44" fill="#fff" transform="rotate(6 70 56)" />
      <rect x="57" y="39" width="26" height="26" fill="#93c5fd" stroke="none" transform="rotate(6 70 56)" />
      <circle cx="69" cy="48" r="5" fill="#facc15" stroke="none" />
    </g>
  ),
  speaker: (
    <g>
      <rect x="28" y="14" width="44" height="74" rx="12" fill="#facc15" stroke="#a16207" strokeWidth="2.5" />
      <circle cx="50" cy="38" r="10" fill="#fef9c3" stroke="#a16207" strokeWidth="2.5" />
      <circle cx="50" cy="66" r="14" fill="#fef9c3" stroke="#a16207" strokeWidth="2.5" />
      <path d="M80 38 q8 12 0 24 M86 32 q12 18 0 36" stroke="#64748b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </g>
  ),
  cushions: (
    <g stroke="#1e293b" strokeWidth="2" strokeLinejoin="round">
      <path d="M10 50 Q30 42 50 50 Q56 66 50 84 Q30 90 10 84 Q4 66 10 50 Z" fill="#f472b6" />
      <path d="M44 34 Q66 26 88 34 Q94 52 88 72 Q66 78 44 72 Q38 52 44 34 Z" fill="#a855f7" />
      {[54, 66, 78].map((x) => [44, 58].map((y) => <circle key={`${x}${y}`} cx={x} cy={y} r="3" fill="#fde047" stroke="none" />))}
    </g>
  ),
  lights: (
    <g>
      <path d="M6 30 Q28 52 50 30 Q72 52 94 30" stroke="#475569" strokeWidth="2" fill="none" />
      {[
        [14, 37, '#ef4444'],
        [26, 42, '#facc15'],
        [38, 39, '#22c55e'],
        [62, 39, '#3b82f6'],
        [74, 42, '#ec4899'],
        [86, 37, '#f97316'],
      ].map(([x, y, c]) => (
        <g key={x as number}>
          <ellipse cx={x as number} cy={(y as number) + 10} rx="5" ry="8" fill={c as string} />
          <circle cx={x as number} cy={(y as number) + 10} r="11" fill={c as string} opacity="0.25" />
        </g>
      ))}
    </g>
  ),
}

/** Las palabras que tienen dibujo. */
export const CON_DIBUJO = Object.keys(P)

/** Un pictograma. */
export function Picto({ id, tam = 96 }: { id: string; tam?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={tam} height={tam} role="img" aria-label={id}>
      {P[id]}
    </svg>
  )
}

/** Lámina para tocar: los dibujos de una lista en cuadrícula, sin rótulos. */
export const lamina = (ids: string[]): Debuxo =>
  function Lamina({ onToca, marcas = {} }: { onToca?: (id: string) => void; marcas?: Record<string, Marca> }) {
    const cols = 4
    const filas = Math.ceil(ids.length / cols)
    return (
      <svg viewBox={`0 0 ${cols * 110} ${filas * 110}`} className="block h-auto w-full touch-manipulation select-none" role="img" aria-label="Dibujos">
        {ids.map((id, i) => {
          const x = (i % cols) * 110
          const y = Math.floor(i / cols) * 110
          const m = marcas[id]
          return (
            <g key={id} data-id={id} onClick={onToca ? () => onToca(id) : undefined} className={onToca ? 'cursor-pointer' : ''}>
              <rect x={x + 4} y={y + 4} width="102" height="102" rx="14" fill={m === 'ben' ? '#d1fae5' : m === 'mal' ? '#ffe4e6' : '#fff'} stroke={m === 'ben' ? VERDE : m === 'mal' ? VERMELLO : '#ddd6fe'} strokeWidth={m ? 4 : 2} />
              <g transform={`translate(${x + 5} ${y + 5})`}>{P[id]}</g>
            </g>
          )
        })}
      </svg>
    )
  }

// ——— Preposiciones: una pelota y una caja ———

const Caja = () => (
  <g>
    <path d="M30 50 L70 50 L70 86 L30 86 Z" fill="#fbbf24" stroke="#92400e" strokeWidth="2.5" />
    <path d="M30 50 L40 40 L80 40 L70 50 Z M70 50 L80 40 L80 76 L70 86 Z" fill="#f59e0b" stroke="#92400e" strokeWidth="2.5" strokeLinejoin="round" />
  </g>
)
const Pelota = ({ x, y, r = 9 }: { x: number; y: number; r?: number }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill="#ef4444" stroke="#7f1d1d" strokeWidth="2" />
    <path d={`M${x - r} ${y} Q${x} ${y + 5} ${x + r} ${y}`} stroke="#fff" strokeWidth="2" fill="none" />
  </g>
)
export const PREPOSICIONES: Record<string, ReactNode> = {
  in: (
    <>
      <Caja />
      <Pelota x={50} y={70} />
    </>
  ),
  on: (
    <>
      <Caja />
      <Pelota x={55} y={32} />
    </>
  ),
  under: (
    <>
      <g transform="translate(0 -22)">
        <path d="M24 56 L76 56 L76 62 L24 62 Z" fill="#a16207" stroke="#451a03" strokeWidth="2" />
        <path d="M28 62 L28 92 M72 62 L72 92" stroke="#451a03" strokeWidth="5" />
      </g>
      <Pelota x={50} y={80} />
    </>
  ),
  'next to': (
    <>
      <g transform="translate(-14 0)">
        <Caja />
      </g>
      <Pelota x={82} y={77} />
    </>
  ),
}
export function PictoPrep({ id, tam = 96 }: { id: string; tam?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={tam} height={tam} role="img" aria-label={id}>
      {PREPOSICIONES[id]}
    </svg>
  )
}
