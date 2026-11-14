// Dibujos propios de la unidad 2 de francés: los muebles y objetos de la casa (pictogramas de 100 × 100) y el plano
// de una casa con sus piezas, que se pueden tocar.
import type { ReactNode } from 'react'
import type { Debuxo, Marca } from '../../../primaria/pezas'
import { VERDE, VERMELLO } from '../../../primaria/paisaxes/debuxos'

const L = '#334155'
const s = { stroke: L, strokeWidth: 2.5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const }

const P: Record<string, ReactNode> = {
  canapé: (
    <g {...s}>
      <rect x="14" y="34" width="72" height="26" rx="6" fill="#4ade80" />
      <rect x="8" y="46" width="14" height="28" rx="5" fill="#22c55e" />
      <rect x="78" y="46" width="14" height="28" rx="5" fill="#22c55e" />
      <rect x="20" y="56" width="60" height="18" rx="4" fill="#86efac" />
      <path d="M16 74 v8 M84 74 v8" />
    </g>
  ),
  fauteuil: (
    <g {...s}>
      <path d="M28 20 h44 a6 6 0 0 1 6 6 v30 h-56 v-30 a6 6 0 0 1 6 -6 z" fill="#f87171" />
      <rect x="14" y="44" width="14" height="30" rx="5" fill="#ef4444" />
      <rect x="72" y="44" width="14" height="30" rx="5" fill="#ef4444" />
      <rect x="26" y="56" width="48" height="18" rx="4" fill="#fca5a5" />
      <path d="M22 74 v10 M78 74 v10" />
    </g>
  ),
  chaise: (
    <g {...s} fill="none">
      <path d="M34 12 v74 M66 12 v36" strokeWidth="4" />
      <path d="M34 16 h32 M34 28 h32 M34 40 h32" />
      <path d="M26 50 h48" strokeWidth="5" />
      <path d="M30 50 l-4 36 M70 50 l4 36" strokeWidth="4" />
    </g>
  ),
  table: (
    <g {...s}>
      <rect x="10" y="36" width="80" height="10" rx="2" fill="#a16207" />
      <path d="M18 46 v38 M82 46 v38 M30 46 v30 M70 46 v30" strokeWidth="5" stroke="#713f12" />
    </g>
  ),
  lit: (
    <g {...s}>
      <rect x="10" y="26" width="10" height="56" rx="2" fill="#78716c" />
      <rect x="20" y="52" width="72" height="16" rx="3" fill="#cbd5e1" />
      <rect x="22" y="42" width="18" height="12" rx="4" fill="#a3e635" />
      <rect x="40" y="46" width="52" height="8" rx="2" fill="#e2e8f0" />
      <path d="M90 68 v14 M20 68 v14" strokeWidth="4" />
    </g>
  ),
  bureau: (
    <g {...s}>
      <rect x="8" y="34" width="84" height="8" rx="1" fill="#92400e" />
      <rect x="60" y="42" width="28" height="42" fill="#b45309" />
      <path d="M60 56 h28 M60 70 h28" />
      <circle cx="74" cy="49" r="1.5" fill={L} />
      <circle cx="74" cy="63" r="1.5" fill={L} />
      <circle cx="74" cy="77" r="1.5" fill={L} />
      <path d="M14 42 v42" strokeWidth="5" stroke="#78350f" />
    </g>
  ),
  étagère: (
    <g {...s}>
      <rect x="22" y="8" width="56" height="84" fill="#93c5fd" />
      <path d="M22 30 h56 M22 52 h56 M22 74 h56" />
      <rect x="28" y="14" width="6" height="16" fill="#f43f5e" />
      <rect x="36" y="16" width="6" height="14" fill="#facc15" />
      <rect x="56" y="36" width="6" height="16" fill="#22c55e" />
      <rect x="30" y="58" width="16" height="16" fill="#a78bfa" />
    </g>
  ),
  armoire: (
    <g {...s}>
      <rect x="20" y="8" width="60" height="80" rx="3" fill="#fb923c" />
      <path d="M50 8 v80" />
      <path d="M44 44 v10 M56 44 v10" strokeWidth="4" />
      <path d="M26 88 v6 M74 88 v6" />
    </g>
  ),
  coussin: (
    <g {...s}>
      <path d="M18 24 Q50 32 82 24 Q74 50 82 76 Q50 68 18 76 Q26 50 18 24 Z" fill="#fb7185" />
      <circle cx="50" cy="50" r="3" fill="#be123c" />
    </g>
  ),
  tapis: (
    <g {...s}>
      <path d="M10 66 L66 46 L92 58 L36 80 Z" fill="#a78bfa" />
      <path d="M20 66 L66 50 M28 70 L74 54 M36 74 L82 58" stroke="#7c3aed" />
      <ellipse cx="80" cy="44" rx="8" ry="12" fill="#8b5cf6" />
    </g>
  ),
  rideau: (
    <g {...s}>
      <path d="M12 12 h76" strokeWidth="4" />
      <path d="M18 12 Q14 50 22 88 h22 Q36 50 44 12 Z" fill="#16a34a" />
      <path d="M56 12 Q64 50 56 88 h22 Q86 50 82 12 Z" fill="#16a34a" />
    </g>
  ),
  lampe: (
    <g {...s}>
      <path d="M32 18 h36 l10 30 h-56 z" fill="#f97316" />
      <path d="M50 48 v34" strokeWidth="4" />
      <ellipse cx="50" cy="86" rx="16" ry="5" fill="#94a3b8" />
    </g>
  ),
  miroir: (
    <g {...s}>
      <ellipse cx="50" cy="48" rx="28" ry="38" fill="#e0f2fe" />
      <path d="M38 30 l12 -10 M36 44 l22 -18" stroke="#fff" strokeWidth="4" />
    </g>
  ),
  réveil: (
    <g {...s}>
      <circle cx="50" cy="54" r="30" fill="#fde68a" />
      <path d="M50 54 v-18 M50 54 l12 8" strokeWidth="3.5" />
      <path d="M26 30 a12 12 0 0 1 14 -10 M74 30 a12 12 0 0 0 -14 -10" strokeWidth="5" />
      <path d="M32 82 l-6 8 M68 82 l6 8" />
    </g>
  ),
  ordinateur: (
    <g {...s}>
      <rect x="16" y="14" width="68" height="48" rx="4" fill="#1e293b" />
      <rect x="22" y="20" width="56" height="36" fill="#38bdf8" />
      <path d="M44 62 l-4 14 h20 l-4 -14" fill="#94a3b8" />
      <rect x="22" y="80" width="56" height="8" rx="2" fill="#cbd5e1" />
    </g>
  ),
  tableau: (
    <g {...s}>
      <rect x="14" y="18" width="72" height="56" fill="#d97706" />
      <rect x="22" y="26" width="56" height="40" fill="#bae6fd" />
      <path d="M22 62 l16 -18 l12 12 l10 -10 l18 18 z" fill="#22c55e" stroke="none" />
      <circle cx="66" cy="36" r="5" fill="#facc15" stroke="none" />
    </g>
  ),
  fenêtre: (
    <g {...s}>
      <rect x="18" y="12" width="64" height="76" fill="#bae6fd" />
      <path d="M50 12 v76 M18 50 h64" strokeWidth="4" />
    </g>
  ),
  vase: (
    <g {...s}>
      <path d="M38 40 q-12 20 0 46 h24 q12 -26 0 -46 z" fill="#60a5fa" />
      <path d="M50 40 v-20 M44 40 l-8 -16 M56 40 l8 -18" stroke="#16a34a" />
      <circle cx="50" cy="18" r="6" fill="#f472b6" />
      <circle cx="35" cy="22" r="5" fill="#facc15" />
      <circle cx="65" cy="20" r="5" fill="#f87171" />
    </g>
  ),
  corbeille: (
    <g {...s}>
      <path d="M26 24 h48 l-6 62 h-36 z" fill="#94a3b8" />
      <path d="M38 24 l2 62 M50 24 v62 M62 24 l-2 62" stroke="#64748b" />
      <circle cx="44" cy="20" r="6" fill="#fff" />
    </g>
  ),
  tiroirs: (
    <g {...s}>
      <rect x="20" y="16" width="60" height="70" rx="2" fill="#c08457" />
      <path d="M20 39 h60 M20 62 h60" />
      <path d="M44 28 h12 M44 51 h12 M44 74 h12" strokeWidth="4" />
    </g>
  ),
  'table de chevet': (
    <g {...s}>
      <rect x="28" y="40" width="44" height="44" rx="2" fill="#a16207" />
      <path d="M28 60 h44" />
      <circle cx="50" cy="72" r="2" fill={L} />
      <path d="M42 40 v-12 h16 v12" fill="#fde047" />
      <path d="M36 28 h28 l-6 -14 h-16 z" fill="#f97316" />
    </g>
  ),
}

export const CON_DIBUJO = Object.keys(P)

export function Picto({ id, tam = 96 }: { id: string; tam?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={tam} height={tam} aria-hidden="true" className="mx-auto block">
      {P[id]}
    </svg>
  )
}

/** Varios dibujos en fila para tocar el que se pide. */
export const lamina =
  (ids: string[]): Debuxo =>
  ({ onToca, marcas = {} }) => {
    const cols = Math.min(ids.length, 4)
    return (
      <svg viewBox={`0 0 ${cols * 110} ${Math.ceil(ids.length / cols) * 110}`} width="100%" className="block">
        {ids.map((id, i) => {
          const m = (marcas as Record<string, Marca>)[id]
          return (
            <g key={id} data-id={id} transform={`translate(${(i % cols) * 110 + 5} ${Math.floor(i / cols) * 110 + 5})`} onClick={onToca ? () => onToca(id) : undefined} className={onToca ? 'cursor-pointer' : ''}>
              <rect width="100" height="100" rx="14" fill="#fff" stroke={m === 'ben' ? VERDE : m === 'mal' ? VERMELLO : '#ddd6fe'} strokeWidth={m ? 5 : 2} />
              {P[id]}
            </g>
          )
        })}
      </svg>
    )
  }

// ——— El plano de la casa ———

/** Las piezas del plano: [id, x, y, ancho, alto, color, emoji]. */
const PIEZAS: [string, number, number, number, number, string, string][] = [
  ['entrée', 160, 170, 80, 90, '#fef3c7', '🚪'],
  ['cuisine', 10, 10, 150, 110, '#fde68a', '🍳'],
  ['salle à manger', 10, 120, 150, 140, '#fed7aa', '🍽️'],
  ['salon', 160, 10, 180, 160, '#bbf7d0', '🛋️'],
  ['salle de bains', 340, 10, 130, 100, '#bae6fd', '🛁'],
  ['toilettes', 340, 110, 70, 60, '#c7d2fe', '🚽'],
  ['chambre', 240, 170, 230, 90, '#fbcfe8', '🛏️'],
  ['balcon', 410, 110, 60, 60, '#d9f99d', '🌸'],
  ['terrasse', 10, 260, 460, 60, '#bef264', '☀️'],
]
export const PIEZAS_PLANO = PIEZAS.map((p) => p[0])

export const PlanoCasa: Debuxo = ({ onToca, marcas = {}, etiquetas = true }) => (
  <svg viewBox="0 0 480 330" width="100%" className="block" role="img" aria-label="Plano de una casa">
    {PIEZAS.map(([id, x, y, w, h, cor, emoji]) => {
      const m = (marcas as Record<string, Marca>)[id]
      return (
        <g key={id} data-id={id} onClick={onToca ? () => onToca(id) : undefined} className={onToca ? 'cursor-pointer' : ''}>
          <rect x={x} y={y} width={w} height={h} fill={m === 'ben' ? '#86efac' : m === 'mal' ? '#fca5a5' : cor} stroke={L} strokeWidth="3" />
          <text x={x + w / 2} y={y + h / 2 + (etiquetas ? -4 : 8)} textAnchor="middle" fontSize="26">
            {emoji}
          </text>
          {etiquetas && (
            <text x={x + w / 2} y={y + h / 2 + 22} textAnchor="middle" fontSize="14" fontWeight="800" fill="#1e293b" lang="fr">
              {id}
            </text>
          )}
        </g>
      )
    })}
  </svg>
)
