// Dibujos de las paradas de montaña, chaira y costa. Como en debuxos.tsx, cada elemento se toca por su id y las
// etiquetas, en galego, salen con `etiquetas` o al marcar un acierto o un fallo.
import { useId } from 'react'
import type { Marca } from '../pezas'
import { Arbore, Casa, Pilula, tocable } from './debuxos'

interface Props {
  onToca?: (id: string) => void
  marcas?: Record<string, Marca>
  etiquetas?: boolean
  /** Solo estas etiquetas, si se indica. */
  so?: string[]
}

/** Etiquetas de una escena: las pedidas y las de los elementos marcados. */
function Etiquetas({ sitios, marcas = {}, etiquetas, so, tam = 14 }: { sitios: Record<string, [number, number, string]>; marcas?: Record<string, Marca>; etiquetas?: boolean; so?: string[]; tam?: number }) {
  return (
    <>
      {Object.entries(sitios)
        .filter(([id]) => (etiquetas && (!so || so.includes(id))) || marcas[id])
        .map(([id, [x, y, t]]) => (
          <Pilula key={id} x={x} y={y} texto={t} marca={marcas[id]} tam={tam} />
        ))}
    </>
  )
}

function Ceo({ alto = 300 }: { alto?: number }) {
  const id = useId()
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7dd3fc" />
          <stop offset="1" stopColor="#e0f2fe" />
        </linearGradient>
      </defs>
      <rect width="480" height={alto} fill={`url(#${id})`} />
    </>
  )
}

// ——— Montaña ———

export const NOMES_PARTES: Record<string, string> = { cima: 'a cima', ladeira: 'a ladeira', pe: 'o pé' }

/** As partes dunha montaña: cima, ladeira e pé. */
export function PartesMontana({ onToca, marcas = {}, etiquetas = true }: Props) {
  const el = tocable(onToca, marcas)
  return (
    <svg viewBox="0 0 480 270" className="block h-auto w-full touch-manipulation select-none" role="img" aria-label="As partes dunha montaña">
      <Ceo alto={270} />
      <rect y="240" width="480" height="30" fill="#86c06c" />
      {el('pe', <path d="M70 242 L130 190 L350 190 L410 242 Z" fill="#65a30d" stroke="#3f6212" strokeWidth="1.5" strokeLinejoin="round" />)}
      {el('ladeira', <path d="M130 190 L208 88 L272 88 L350 190 Z" fill="#a8a29e" stroke="#57534e" strokeWidth="1.5" strokeLinejoin="round" />)}
      {el('cima', <path d="M208 88 L240 40 L272 88 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" strokeLinejoin="round" />)}
      <Arbore x={110} y={226} s={0.8} />
      <Arbore x={380} y={228} s={0.8} />
      <Etiquetas sitios={{ cima: [240, 22, 'cima'], ladeira: [340, 128, 'ladeira'], pe: [420, 200, 'pé'] }} marcas={marcas} etiquetas={etiquetas} tam={20} />
    </svg>
  )
}

/** Montaña, serra e cordilleira, unha ao lado da outra. */
export function SerraCordilleira() {
  const pico = (x: number, y: number, a: number, cor: string) => (
    <path key={`${x}-${y}`} d={`M${x - a * 0.7} ${y} L${x} ${y - a} L${x + a * 0.7} ${y} Z`} fill={cor} stroke="#57534e" strokeWidth="1" strokeLinejoin="round" />
  )
  return (
    <svg viewBox="0 0 480 190" className="block h-auto w-full" role="img" aria-label="Montaña, serra e cordilleira">
      <rect width="480" height="190" fill="#f0f9ff" />
      <g>{pico(70, 140, 70, '#a8a29e')}</g>
      <g>{[175, 210, 245, 280].map((x, i) => pico(x, 140, 50 + (i % 2) * 15, '#a8a29e'))}</g>
      <g>
        {[352, 382, 412, 442].map((x, i) => pico(x, 110, 36 + (i % 2) * 10, '#d6d3d1'))}
        {[344, 372, 400, 428, 452].map((x, i) => pico(x, 125, 34 + (i % 2) * 9, '#c4b5fd'))}
        {[356, 386, 416, 446].map((x, i) => pico(x, 140, 36 + (i % 2) * 10, '#a8a29e'))}
      </g>
      <rect y="140" width="480" height="50" fill="#86c06c" />
      <text x="70" y="168" textAnchor="middle" fontSize="17" fontWeight="800" fill="#1e293b">
        montaña
      </text>
      <text x="228" y="168" textAnchor="middle" fontSize="17" fontWeight="800" fill="#1e293b">
        serra
      </text>
      <text x="404" y="168" textAnchor="middle" fontSize="17" fontWeight="800" fill="#1e293b">
        cordilleira
      </text>
      <text x="142" y="100" textAnchor="middle" fontSize="26" fill="#7c3aed">
        →
      </text>
      <text x="318" y="70" textAnchor="middle" fontSize="26" fill="#7c3aed">
        →
      </text>
    </svg>
  )
}

export const NOMES_MONTANA: Record<string, string> = {
  serra: 'a serra',
  montana: 'a montaña',
  val: 'o val',
  rio: 'o río',
  encoro: 'o encoro',
  aldea: 'a aldea',
  pista: 'a pista de esquí',
  canteira: 'a canteira',
  camping: 'o cámping',
  estrada: 'a estrada con curvas',
  tunel: 'o túnel',
}

const SITIOS_MONTANA: Record<string, [number, number, string]> = {
  serra: [118, 52, 'serra'],
  montana: [440, 205, 'montaña'],
  val: [215, 268, 'val'],
  rio: [292, 226, 'río'],
  encoro: [128, 182, 'encoro'],
  aldea: [70, 238, 'aldea'],
  pista: [356, 52, 'pista de esquí'],
  canteira: [40, 150, 'canteira'],
  camping: [420, 290, 'cámping'],
  estrada: [318, 282, 'estrada'],
  tunel: [262, 186, 'túnel'],
}

/** Unha paisaxe de montaña, como a do libro: serra, val, encoro, aldea, pista de esquí, canteira, cámping... */
export function PaisaxeMontana({ onToca, marcas = {}, etiquetas = false, so }: Props) {
  const el = tocable(onToca, marcas)
  return (
    <svg viewBox="0 0 480 310" className="block h-auto w-full touch-manipulation select-none" role="img" aria-label="Unha paisaxe de montaña">
      <Ceo alto={310} />
      <circle cx="40" cy="30" r="16" fill="#fde047" />
      {el(
        'serra',
        <path d="M0 150 L40 95 L80 125 L125 70 L170 118 L215 78 L260 125 L300 90 L340 130 L340 180 L0 180 Z" fill="#a5a3c9" stroke="#6d6a99" strokeWidth="1.5" strokeLinejoin="round" />,
      )}
      {el(
        'montana',
        <>
          <path d="M240 215 L370 40 L480 170 L480 240 L240 240 Z" fill="#8f8a85" stroke="#57534e" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M346 72 L370 40 L394 68 L380 64 L370 76 L358 66 Z" fill="#fff" />
        </>,
      )}
      {el(
        'pista',
        <>
          <path d="M366 56 L386 60 L438 160 L404 166 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
          <path d="M372 60 L430 150" stroke="#475569" strokeWidth="1.5" strokeDasharray="2 6" />
          {[
            [380, 80],
            [396, 108],
            [412, 132],
          ].map(([x, y]) => (
            <rect key={x} x={x + 4} y={y} width="6" height="5" rx="1" fill="#ef4444" />
          ))}
        </>,
      )}
      {el(
        'canteira',
        <>
          <path d="M0 240 L0 120 L60 110 L130 175 L150 240 Z" fill="#78716c" stroke="#44403c" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M18 168 L62 160 L72 185 L30 196 Z" fill="#d6d3d1" stroke="#57534e" strokeWidth="1.2" />
          <path d="M22 176 L64 168 M26 186 L68 177" stroke="#a8a29e" strokeWidth="2" />
          <rect x="40" y="194" width="16" height="8" fill="#f59e0b" />
          <circle cx="44" cy="203" r="2.5" fill="#1e293b" />
          <circle cx="53" cy="203" r="2.5" fill="#1e293b" />
        </>,
      )}
      {el('val', <path d="M0 236 Q120 215 250 228 Q370 236 480 232 L480 310 L0 310 Z" fill="#8fcf6f" />)}
      {el(
        'encoro',
        <>
          <path d="M150 196 Q190 186 232 196 Q236 210 196 212 Q156 212 150 196 Z" fill="#3b9de3" stroke="#1d72b8" strokeWidth="1" />
          <path d="M228 194 L240 196 L238 214 L226 214 Z" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
        </>,
      )}
      {el(
        'rio',
        <path d="M232 212 C244 224 270 226 282 240 C296 256 270 274 286 310 L304 310 C292 276 314 258 296 236 C284 222 256 220 242 210 Z" fill="#3b9de3" stroke="#1d72b8" strokeWidth="1" />,
      )}
      {el(
        'tunel',
        <>
          <path d="M252 228 A12 12 0 0 1 276 228 L276 234 L252 234 Z" fill="#1e293b" stroke="#57534e" strokeWidth="2" />
        </>,
      )}
      {el('estrada', <path d="M264 234 L264 244 C300 250 360 246 340 262 C320 276 280 270 300 286 C312 296 340 300 330 310" stroke="#6b7280" strokeWidth="9" fill="none" strokeLinecap="round" strokeLinejoin="round" />)}
      {el(
        'aldea',
        <>
          <Casa x={62} y={276} cor="#dc2626" />
          <Casa x={98} y={268} cor="#ea580c" />
          <Casa x={132} y={280} cor="#7c3aed" />
          <rect x="84" y="226" width="10" height="20" fill="#e7e5e4" stroke="#78350f" strokeWidth="1" />
          <path d="M82 227 L89 214 L96 227 Z" fill="#7c3aed" />
        </>,
      )}
      {el(
        'camping',
        <>
          <path d="M392 278 L408 254 L424 278 Z" fill="#f59e0b" stroke="#92400e" strokeWidth="1" />
          <path d="M420 284 L438 258 L456 284 Z" fill="#22c55e" stroke="#166534" strokeWidth="1" />
          <path d="M440 300 L456 278 L472 300 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
        </>,
      )}
      <Arbore x={180} y={250} s={0.8} />
      <Arbore x={350} y={230} s={0.75} />
      <Arbore x={232} y={286} s={0.8} />
      <Etiquetas sitios={SITIOS_MONTANA} marcas={marcas} etiquetas={etiquetas} so={so} />
    </svg>
  )
}

// ——— Chaira ———

export const NOMES_PERFIL: Record<string, string> = { meseta: 'a meseta', depresion: 'a depresión', outeiro: 'o outeiro' }

/** Corte do terreo, visto de lado: meseta, depresión e outeiro. */
export function PerfilChaira({ onToca, marcas = {}, etiquetas = true }: Props) {
  const el = tocable(onToca, marcas)
  return (
    <svg viewBox="0 0 480 240" className="block h-auto w-full touch-manipulation select-none" role="img" aria-label="Meseta, depresión e outeiro">
      <Ceo alto={240} />
      <path d="M0 240 L0 75 L150 75 L190 175 L300 175 L322 120 L350 120 L372 170 L480 170 L480 240 Z" fill="#c08457" />
      {el(
        'meseta',
        <>
          <path d="M0 240 L0 75 L150 75 L190 175 L190 240 Z" fill="#d6a06a" stroke="#7c2d12" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M0 75 L150 75" stroke="#65a30d" strokeWidth="7" />
        </>,
      )}
      {el(
        'depresion',
        <>
          <path d="M190 175 L300 175 L300 240 L190 240 Z" fill="#d6a06a" stroke="#7c2d12" strokeWidth="1.5" />
          <path d="M190 175 L300 175" stroke="#65a30d" strokeWidth="7" />
          <path d="M215 175 Q245 170 275 175" stroke="#3b9de3" strokeWidth="4" fill="none" />
        </>,
      )}
      {el(
        'outeiro',
        <>
          <path d="M380 172 L398 138 L432 138 L450 172 Z" fill="#d6a06a" stroke="#7c2d12" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M398 138 L432 138" stroke="#65a30d" strokeWidth="6" />
        </>,
      )}
      <path d="M300 175 L322 120 L350 120 L372 170" stroke="#65a30d" strokeWidth="5" fill="none" />
      <path d="M372 170 L380 172 M450 172 L480 170" stroke="#65a30d" strokeWidth="5" fill="none" />
      <Arbore x={40} y={62} s={0.7} />
      <Arbore x={110} y={62} s={0.7} />
      <Arbore x={330} y={108} s={0.6} />
      <Etiquetas sitios={{ meseta: [75, 40, 'meseta'], depresion: [245, 145, 'depresión'], outeiro: [415, 108, 'outeiro'] }} marcas={marcas} etiquetas={etiquetas} tam={19} />
    </svg>
  )
}

export const NOMES_CHAIRA: Record<string, string> = {
  meseta: 'a meseta',
  outeiro: 'o outeiro',
  cidade: 'a cidade',
  fabrica: 'a fábrica',
  aldea: 'a aldea',
  cultivos: 'os cultivos',
  rio: 'o río',
  estrada: 'a estrada recta',
  tren: 'a vía do tren',
  aeroporto: 'o aeroporto',
}

const SITIOS_CHAIRA: Record<string, [number, number, string]> = {
  meseta: [390, 56, 'meseta'],
  outeiro: [70, 118, 'outeiro'],
  cidade: [170, 46, 'cidade'],
  fabrica: [262, 92, 'fábrica'],
  aldea: [372, 168, 'aldea'],
  cultivos: [100, 228, 'cultivos'],
  rio: [300, 230, 'río'],
  estrada: [52, 160, 'estrada'],
  tren: [52, 192, 'vía do tren'],
  aeroporto: [408, 252, 'aeroporto'],
}

/** Unha paisaxe de chaira: cidade, aldea, cultivos, estradas e vías rectas, aeroporto... */
export function PaisaxeChaira({ onToca, marcas = {}, etiquetas = false, so }: Props) {
  const el = tocable(onToca, marcas)
  return (
    <svg viewBox="0 0 480 300" className="block h-auto w-full touch-manipulation select-none" role="img" aria-label="Unha paisaxe de chaira">
      <Ceo />
      <circle cx="40" cy="30" r="16" fill="#fde047" />
      {el('meseta', <path d="M320 125 L338 72 L448 72 L466 125 Z" fill="#c08457" stroke="#7c2d12" strokeWidth="1.5" strokeLinejoin="round" />)}
      <rect y="122" width="480" height="178" fill="#a3d977" />
      {el('outeiro', <path d="M30 140 L52 120 L92 120 L114 140 Z" fill="#84a65a" stroke="#3f6212" strokeWidth="1.5" strokeLinejoin="round" />)}
      {el(
        'cidade',
        <>
          {[
            [120, 70, 22, 56, '#94a3b8'],
            [144, 54, 20, 72, '#64748b'],
            [166, 78, 24, 48, '#cbd5e1'],
            [192, 62, 18, 64, '#94a3b8'],
            [212, 84, 22, 42, '#64748b'],
          ].map(([x, y, w, h, c]) => (
            <g key={String(x)}>
              <rect x={x} y={y} width={w} height={h} fill={String(c)} stroke="#334155" strokeWidth="1" />
              {Array.from({ length: Math.floor(Number(h) / 12) }, (_, i) => (
                <rect key={i} x={Number(x) + 4} y={Number(y) + 5 + i * 12} width={Number(w) - 8} height="4" fill="#e0f2fe" />
              ))}
            </g>
          ))}
        </>,
      )}
      {el(
        'fabrica',
        <>
          <rect x="242" y="104" width="44" height="22" fill="#a8a29e" stroke="#44403c" strokeWidth="1" />
          <path d="M242 104 L253 96 L253 104 L264 96 L264 104 L275 96 L275 104" fill="#a8a29e" stroke="#44403c" strokeWidth="1" />
          <rect x="278" y="80" width="7" height="24" fill="#78716c" />
          <circle cx="284" cy="72" r="5" fill="#e5e7eb" />
          <circle cx="292" cy="64" r="6" fill="#e5e7eb" />
        </>,
      )}
      {el('estrada', <path d="M0 160 L480 148" stroke="#6b7280" strokeWidth="10" />)}
      {el(
        'tren',
        <>
          <path d="M0 192 L480 178" stroke="#78350f" strokeWidth="6" strokeDasharray="3 5" />
          <path d="M0 189 L480 175 M0 195 L480 181" stroke="#57534e" strokeWidth="1.5" />
          <rect x="150" y="172" width="34" height="14" rx="3" fill="#dc2626" transform="rotate(-1.7 150 172)" />
          <rect x="186" y="171" width="30" height="13" rx="3" fill="#f59e0b" transform="rotate(-1.7 186 171)" />
          <rect x="218" y="170" width="30" height="13" rx="3" fill="#f59e0b" transform="rotate(-1.7 218 170)" />
        </>,
      )}
      {el(
        'aldea',
        <>
          <Casa x={340} y={210} cor="#dc2626" />
          <Casa x={374} y={204} cor="#ea580c" />
          <rect x="398" y="176" width="12" height="28" fill="#fef3c7" stroke="#78350f" strokeWidth="1" />
          <path d="M396 177 L404 162 L412 177 Z" fill="#dc2626" />
        </>,
      )}
      {el(
        'cultivos',
        <>
          <path d="M10 210 L90 205 L80 245 L0 250 Z" fill="#facc15" stroke="#a16207" strokeWidth="1" />
          <path d="M92 205 L180 200 L172 238 L82 245 Z" fill="#65a30d" stroke="#3f6212" strokeWidth="1" />
          <path d="M0 252 L80 247 L70 290 L0 296 Z" fill="#84cc16" stroke="#3f6212" strokeWidth="1" />
          <path d="M82 247 L172 240 L164 284 L72 290 Z" fill="#b45309" stroke="#78350f" strokeWidth="1" />
          {[214, 224, 234].map((y) => (
            <path key={y} d={`M98 ${y} L168 ${y - 4}`} stroke="#bef264" strokeWidth="2" />
          ))}
        </>,
      )}
      {el('rio', <path d="M480 196 C420 206 330 230 300 250 C270 270 250 285 240 300 L270 300 C282 286 300 274 320 262 C360 240 430 220 480 214 Z" fill="#3b9de3" stroke="#1d72b8" strokeWidth="1" />)}
      {el(
        'aeroporto',
        <>
          <path d="M330 280 L470 262 L474 280 L334 298 Z" fill="#9ca3af" stroke="#4b5563" strokeWidth="1" />
          <path d="M346 288 L460 273" stroke="#fff" strokeWidth="2" strokeDasharray="8 6" />
          <g transform="translate(430 240) rotate(-8)">
            <path d="M-20 0 L20 0 L26 -3 L20 -6 L-20 -4 Z" fill="#f8fafc" stroke="#475569" strokeWidth="1" />
            <path d="M-4 -2 L-12 -14 L-6 -14 L6 -2 Z M-4 -2 L-12 10 L-6 10 L6 -2 Z M-18 -2 L-24 -10 L-20 -10 L-14 -3 Z" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
          </g>
        </>,
      )}
      <Arbore x={300} y={120} s={0.6} />
      <Arbore x={230} y={232} s={0.7} />
      <Etiquetas sitios={SITIOS_CHAIRA} marcas={marcas} etiquetas={etiquetas} so={so} />
    </svg>
  )
}

// ——— Costa ———

export const NOMES_COSTA: Record<string, string> = {
  cabo: 'o cabo',
  golfo: 'o golfo',
  baia: 'a baía',
  illa: 'a illa',
  arquipelago: 'o arquipélago',
  peninsula: 'a península',
  istmo: 'o istmo',
  acantilado: 'o acantilado',
  praia: 'a praia',
  cidade: 'a cidade',
  porto: 'o porto',
}

const SITIOS_COSTA: Record<string, [number, number, string]> = {
  cabo: [262, 22, 'cabo'],
  golfo: [372, 152, 'golfo'],
  baia: [356, 296, 'baía'],
  illa: [158, 108, 'illa'],
  arquipelago: [86, 18, 'arquipélago'],
  peninsula: [176, 236, 'península'],
  istmo: [262, 264, 'istmo'],
  acantilado: [312, 50, 'acantilado'],
  praia: [452, 194, 'praia'],
  cidade: [430, 30, 'cidade'],
  porto: [432, 272, 'porto'],
}

const MAR = '#60b4ec'
const TERRA = '#7cc35a'

/** Unha costa vista dende arriba, coma no libro: cabo, golfo, baía, illa, arquipélago, península e istmo. */
export function PaisaxeCosta({ onToca, marcas = {}, etiquetas = false, so }: Props) {
  const el = tocable(onToca, marcas)
  const costa =
    'M480 0 L330 0 C325 25 290 40 240 55 C228 60 228 70 240 72 C270 78 295 85 305 95 C380 90 450 130 440 160 C432 195 360 205 300 205 C285 210 275 215 262 222 C230 195 150 200 140 235 C132 268 220 275 262 244 C275 242 288 244 300 246 C340 236 400 256 380 282 C365 300 320 292 316 320 L480 320 Z'
  return (
    <svg viewBox="0 0 480 320" className="block h-auto w-full touch-manipulation select-none" role="img" aria-label="Unha paisaxe de costa">
      <rect width="480" height="320" fill={MAR} />
      <path d={costa} fill={TERRA} stroke="#3f6212" strokeWidth="1.5" />
      {el(
        'golfo',
        <path d="M305 95 C380 90 450 130 440 160 C432 195 360 205 300 205 C320 170 320 130 305 95 Z" fill={MAR} />,
      )}
      {el('baia', <path d="M300 246 C340 236 400 256 380 282 C365 300 320 292 316 320 L300 320 C310 296 312 270 300 246 Z" fill={MAR} />)}
      {el(
        'praia',
        <path d="M398 118 C430 132 446 150 438 168 C432 186 412 196 388 201" stroke="#fde68a" strokeWidth="9" fill="none" strokeLinecap="round" />,
      )}
      {el(
        'cabo',
        <path d="M330 0 C325 25 290 40 240 55 C228 60 228 70 240 72 C270 78 295 85 305 95 C330 90 340 60 345 0 Z" fill={TERRA} stroke="#3f6212" strokeWidth="1.5" />,
      )}
      {el(
        'acantilado',
        <path d="M328 4 C322 26 292 40 246 54" stroke="#92400e" strokeWidth="7" fill="none" strokeLinecap="round" strokeDasharray="7 3" />,
      )}
      {/* Faro na punta do cabo. */}
      <g pointerEvents="none">
        <path d="M242 64 L246 44 L252 44 L256 64 Z" fill="#fff" stroke="#991b1b" strokeWidth="1" />
        <rect x="245.5" y="50" width="7" height="4" fill="#dc2626" />
        <rect x="245" y="40" width="8" height="5" fill="#fde047" stroke="#991b1b" strokeWidth="1" />
      </g>
      {el(
        'peninsula',
        <path d="M262 222 C230 195 150 200 140 235 C132 268 220 275 262 244 Z" fill={TERRA} stroke="#3f6212" strokeWidth="1.5" />,
      )}
      {el(
        'istmo',
        <>
          <rect x="254" y="218" width="24" height="30" fill="transparent" />
          <path d="M262 222 L262 244" stroke="#fde68a" strokeWidth="3" strokeDasharray="3 3" />
        </>,
      )}
      {el('illa', <path d="M130 130 C140 112 178 112 188 126 C196 140 170 150 150 148 C134 146 124 140 130 130 Z" fill={TERRA} stroke="#3f6212" strokeWidth="1.5" />)}
      {el(
        'arquipelago',
        <>
          <ellipse cx="50" cy="48" rx="18" ry="11" fill={TERRA} stroke="#3f6212" strokeWidth="1.5" />
          <ellipse cx="92" cy="40" rx="14" ry="9" fill={TERRA} stroke="#3f6212" strokeWidth="1.5" />
          <ellipse cx="112" cy="70" rx="16" ry="10" fill={TERRA} stroke="#3f6212" strokeWidth="1.5" />
          <ellipse cx="66" cy="80" rx="11" ry="7" fill={TERRA} stroke="#3f6212" strokeWidth="1.5" />
        </>,
      )}
      {el(
        'cidade',
        <>
          {[
            [392, 46, '#cbd5e1'],
            [410, 40, '#94a3b8'],
            [428, 50, '#e2e8f0'],
            [446, 42, '#94a3b8'],
            [400, 66, '#e2e8f0'],
            [420, 64, '#cbd5e1'],
            [440, 70, '#94a3b8'],
          ].map(([x, y, c]) => (
            <rect key={`${x}-${y}`} x={Number(x)} y={Number(y)} width="16" height="16" fill={String(c)} stroke="#334155" strokeWidth="1" />
          ))}
        </>,
      )}
      {el(
        'porto',
        <>
          <path d="M386 268 L410 262 M390 278 L414 272" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
          <path d="M368 266 l10 0 l-3 5 l-5 0 z M372 280 l10 0 l-3 5 l-5 0 z" fill="#f8fafc" stroke="#334155" strokeWidth="1" />
        </>,
      )}
      <Etiquetas sitios={SITIOS_COSTA} marcas={marcas} etiquetas={etiquetas} so={so} />
    </svg>
  )
}

/** Costa alta e costa baixa, vistas de lado. */
export function CostaAltaBaixa() {
  return (
    <svg viewBox="0 0 480 190" className="block h-auto w-full" role="img" aria-label="Costa alta e costa baixa">
      <rect width="480" height="190" fill="#e0f2fe" />
      <rect x="0" y="120" width="235" height="70" fill={MAR} />
      <path d="M120 190 L120 60 L140 52 L235 52 L235 190 Z" fill="#a16207" stroke="#78350f" strokeWidth="1.5" />
      <path d="M140 52 L235 52" stroke="#65a30d" strokeWidth="7" />
      <path d="M120 70 L126 100 L118 130 L124 160" stroke="#78350f" strokeWidth="2" fill="none" />
      <rect x="245" y="120" width="235" height="70" fill={MAR} />
      <path d="M300 190 L322 132 Q372 114 430 108 L480 106 L480 190 Z" fill="#fde68a" stroke="#ca8a04" strokeWidth="1.5" />
      <path d="M430 108 L480 104 L480 190 L462 190 Q456 140 430 108 Z" fill={TERRA} />
      {[338, 356, 374].map((x) => (
        <circle key={x} cx={x} cy={128 - (x - 338) * 0.25} r="3" fill="#a8a29e" />
      ))}
      <rect x="240" y="0" width="5" height="190" fill="#fff" />
      <text x="118" y="24" textAnchor="middle" fontSize="18" fontWeight="800" fill="#1e293b">
        costa alta
      </text>
      <text x="118" y="44" textAnchor="middle" fontSize="13" fill="#334155">
        acantilados
      </text>
      <text x="362" y="24" textAnchor="middle" fontSize="18" fontWeight="800" fill="#1e293b">
        costa baixa
      </text>
      <text x="362" y="44" textAnchor="middle" fontSize="13" fill="#334155">
        praias de area ou de cantos
      </text>
    </svg>
  )
}
