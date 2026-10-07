// Dibujos de la unidad de Francés: el árbol de la familia, el cuerpo y la cara. Cada parte se toca por su id;
// las etiquetas, en francés, salen con `etiquetas` o al marcar un acierto o un fallo.
import type { ReactNode } from 'react'
import type { Marca } from '../../primaria/pezas'
import { Pilula, tocable } from '../../primaria/paisaxes/debuxos'

interface Props {
  onToca?: (id: string) => void
  marcas?: Record<string, Marca>
  etiquetas?: boolean
}

function Etiquetas({ sitios, marcas = {}, etiquetas, tam = 15 }: { sitios: Record<string, [number, number, string]>; marcas?: Record<string, Marca>; etiquetas?: boolean; tam?: number }) {
  return (
    <>
      {Object.entries(sitios)
        .filter(([id]) => etiquetas || marcas[id])
        .map(([id, [x, y, t]]) => (
          <Pilula key={id} x={x} y={y} texto={t} marca={marcas[id]} tam={tam} />
        ))}
    </>
  )
}

// ——— La familia ———

export const NOMES_FAMILIA: Record<string, string> = {
  grandpere: 'le grand-père',
  grandmere: 'la grand-mère',
  pere: 'le père',
  mere: 'la mère',
  oncle: "l'oncle",
  tante: 'la tante',
  frere: 'le frère',
  moi: 'moi',
  soeur: 'la sœur',
  cousin: 'le cousin',
  cousine: 'la cousine',
}

interface Persoa {
  x: number
  y: number
  pelo: string
  pel: string
  longo?: boolean
  vello?: boolean
  neno?: boolean
}

// Moi y sus hermanos; sus padres; la familia de su madre: abuelos, tío, tía y primos.
const ARBORE: Record<string, Persoa> = {
  grandpere: { x: 160, y: 52, pelo: '#e5e7eb', pel: '#f2c6a0', vello: true },
  grandmere: { x: 300, y: 52, pelo: '#e5e7eb', pel: '#f6d3b3', vello: true, longo: true },
  pere: { x: 75, y: 168, pelo: '#3f2a1d', pel: '#e9b98f' },
  mere: { x: 180, y: 168, pelo: '#7c3f1d', pel: '#f6d3b3', longo: true },
  oncle: { x: 300, y: 168, pelo: '#1f2937', pel: '#f2c6a0' },
  tante: { x: 410, y: 168, pelo: '#d4a017', pel: '#f6d3b3', longo: true },
  frere: { x: 45, y: 290, pelo: '#7c3f1d', pel: '#f2c6a0', neno: true },
  moi: { x: 130, y: 290, pelo: '#5b3a1e', pel: '#f2c6a0', neno: true },
  soeur: { x: 215, y: 290, pelo: '#7c3f1d', pel: '#f6d3b3', neno: true, longo: true },
  cousin: { x: 315, y: 290, pelo: '#d4a017', pel: '#f2c6a0', neno: true },
  cousine: { x: 420, y: 290, pelo: '#1f2937', pel: '#f6d3b3', neno: true, longo: true },
}

function Cara({ p, eu }: { p: Persoa; eu?: boolean }) {
  const r = p.neno ? 22 : 26
  return (
    <g transform={`translate(${p.x} ${p.y})`}>
      {eu && <circle r={r + 7} fill="#fde68a" stroke="#f59e0b" strokeWidth="2.5" />}
      {p.longo && <path d={`M${-r - 2} ${-4} Q${-r - 4} ${r + 6} ${-r + 6} ${r + 4} L${r - 6} ${r + 4} Q${r + 4} ${r + 6} ${r + 2} ${-4} Z`} fill={p.pelo} />}
      <circle r={r} fill={p.pel} stroke="#b45309" strokeOpacity="0.4" />
      <path d={`M${-r} ${-2} Q${-r + 2} ${-r - 6} 0 ${-r - 4} Q${r - 2} ${-r - 6} ${r} ${-2} Q${r * 0.4} ${-r * 0.55} ${-r} ${-2} Z`} fill={p.pelo} />
      <circle cx={-r * 0.35} cy={2} r={2.6} fill="#1e293b" />
      <circle cx={r * 0.35} cy={2} r={2.6} fill="#1e293b" />
      {p.vello && (
        <g fill="none" stroke="#475569" strokeWidth="1.5">
          <circle cx={-r * 0.35} cy={2} r={6} />
          <circle cx={r * 0.35} cy={2} r={6} />
          <path d="M-3 2 h6" />
        </g>
      )}
      <path d={`M${-r * 0.3} ${r * 0.4} Q0 ${r * 0.62} ${r * 0.3} ${r * 0.4}`} stroke="#9f1239" strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  )
}

const ETIQUETAS_FAMILIA: Record<string, [number, number, string]> = Object.fromEntries(
  Object.entries(ARBORE).map(([id, p]) => [id, [p.x, p.y + (p.neno ? 40 : 46), NOMES_FAMILIA[id]]]),
)

/** O árbore da familia, visto dende «moi». */
export function Arbore({ onToca, marcas = {}, etiquetas = false }: Props) {
  const el = tocable(onToca, marcas)
  const liña = (d: string) => <path d={d} stroke="#94a3b8" strokeWidth="2.5" fill="none" />
  return (
    <svg viewBox="0 0 470 345" className="block h-auto w-full touch-manipulation select-none" role="img" aria-label="La familia">
      <rect width="470" height="345" fill="#f8fafc" />
      {liña('M186 52 H274 M230 52 V112 H180 V140 M230 112 H300 V140')}
      {liña('M101 168 H154 M128 168 V236 H45 V266 M128 236 V264 M128 236 H215 V266')}
      {liña('M326 168 H384 M355 168 V236 H315 V266 M355 236 H420 V266')}
      {Object.entries(ARBORE).map(([id, p]) => el(id, <Cara p={p} eu={id === 'moi'} />))}
      <Etiquetas sitios={ETIQUETAS_FAMILIA} marcas={marcas} etiquetas={etiquetas} tam={14} />
    </svg>
  )
}

// ——— El cuerpo ———

export const NOMES_CORPO: Record<string, string> = {
  tete: 'la tête',
  cou: 'le cou',
  epaule: "l'épaule",
  bras: 'le bras',
  coude: 'le coude',
  main: 'la main',
  doigts: 'les doigts',
  pouce: 'le pouce',
  torse: 'le torse',
  jambe: 'la jambe',
  genou: 'le genou',
  pied: 'le pied',
  orteils: 'les orteils',
}

const PEL = '#f2c6a0'
const BORDE = '#b45309'

/** Dibuja algo y su reflejo al otro lado del cuerpo (que está centrado en x = 150). */
const dobre = (f: (lado: 1 | -1) => ReactNode) => (
  <>
    <g>{f(-1)}</g>
    <g transform="translate(300 0) scale(-1 1)">{f(1)}</g>
  </>
)

/** El cuerpo entero, de frente, con las partes de la ficha. */
export function Corpo({ onToca, marcas = {}, etiquetas = false }: Props) {
  const el = tocable(onToca, marcas)
  return (
    <svg viewBox="0 0 300 480" className="mx-auto block h-auto w-full max-w-md touch-manipulation select-none" role="img" aria-label="El cuerpo">
      <rect width="300" height="480" fill="#f0f9ff" />
      {el('cou', <rect x="137" y="96" width="26" height="30" fill={PEL} stroke={BORDE} strokeOpacity="0.5" />)}
      {el(
        'bras',
        dobre(() => (
          <>
            <path d="M92 142 L110 150 L102 208 L82 204 Z" fill={PEL} stroke={BORDE} strokeOpacity="0.5" />
            <path d="M80 214 L100 218 L94 272 L76 270 Z" fill={PEL} stroke={BORDE} strokeOpacity="0.5" />
          </>
        )),
      )}
      {el('coude', dobre(() => <circle cx="90" cy="210" r="11" fill="#eab38a" stroke={BORDE} strokeOpacity="0.6" />))}
      {el(
        'doigts',
        dobre(() => (
          <>
            {[72, 79, 86, 93].map((x) => (
              <rect key={x} x={x - 2.8} y="288" width="5.6" height="20" rx="2.8" fill={PEL} stroke={BORDE} strokeOpacity="0.6" />
            ))}
          </>
        )),
      )}
      {el('pouce', dobre(() => <rect x="95" y="266" width="9" height="20" rx="4.5" fill="#eab38a" stroke={BORDE} strokeOpacity="0.7" transform="rotate(-32 99 276)" />))}
      {el('main', dobre(() => <ellipse cx="84" cy="284" rx="14" ry="13" fill={PEL} stroke={BORDE} strokeOpacity="0.6" />))}
      {el('torse', <path d="M106 124 Q150 116 194 124 L188 252 L112 252 Z" fill="#f5c9a5" stroke={BORDE} strokeOpacity="0.5" />)}
      <path d="M128 168 Q140 176 150 168 Q160 176 172 168 M150 200 V236" stroke={BORDE} strokeOpacity="0.35" strokeWidth="1.5" fill="none" pointerEvents="none" />
      {el('epaule', dobre(() => <circle cx="104" cy="136" r="16" fill="#eab38a" stroke={BORDE} strokeOpacity="0.6" />))}
      <rect x="110" y="250" width="80" height="44" rx="6" fill="#3b82f6" stroke="#1e40af" pointerEvents="none" />
      {el('jambe', dobre(() => <path d="M114 292 L146 292 L142 440 L120 440 Z" fill={PEL} stroke={BORDE} strokeOpacity="0.5" />))}
      {el('genou', dobre(() => <circle cx="130" cy="360" r="12" fill="#eab38a" stroke={BORDE} strokeOpacity="0.6" />))}
      {el('pied', dobre(() => <ellipse cx="126" cy="448" rx="20" ry="11" fill={PEL} stroke={BORDE} strokeOpacity="0.6" />))}
      {el(
        'orteils',
        dobre(() => (
          <>
            {[108, 115, 122, 129, 136].map((x, i) => (
              <circle key={x} cx={x} cy={459 - (i === 0 ? 1 : 0)} r={i === 0 ? 4.5 : 3.6} fill={PEL} stroke={BORDE} strokeOpacity="0.7" />
            ))}
          </>
        )),
      )}
      {el(
        'tete',
        <>
          <circle cx="150" cy="60" r="40" fill={PEL} stroke={BORDE} strokeOpacity="0.5" />
          <path d="M110 56 Q112 14 150 16 Q190 14 190 56 Q170 34 150 38 Q128 34 110 56 Z" fill="#5b3a1e" />
          <circle cx="136" cy="62" r="3.5" fill="#1e293b" />
          <circle cx="164" cy="62" r="3.5" fill="#1e293b" />
          <path d="M138 80 Q150 88 162 80" stroke="#9f1239" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>,
      )}
      <Etiquetas
        sitios={{
          tete: [228, 40, 'la tête'],
          cou: [222, 104, 'le cou'],
          epaule: [252, 140, "l'épaule"],
          bras: [42, 170, 'le bras'],
          coude: [258, 206, 'le coude'],
          main: [40, 250, 'la main'],
          doigts: [256, 300, 'les doigts'],
          pouce: [250, 258, 'le pouce'],
          torse: [150, 186, 'le torse'],
          jambe: [62, 390, 'la jambe'],
          genou: [236, 352, 'le genou'],
          pied: [52, 446, 'le pied'],
          orteils: [240, 446, 'les orteils'],
        }}
        marcas={marcas}
        etiquetas={etiquetas}
        tam={14}
      />
    </svg>
  )
}

export const NOMES_CARA: Record<string, string> = {
  cheveux: 'les cheveux',
  oeil: "l'œil",
  oreille: "l'oreille",
  nez: 'le nez',
  bouche: 'la bouche',
  dents: 'les dents',
  langue: 'la langue',
}

/** La cara de cerca, con la boca abierta para ver los dientes y la lengua. */
export function Cara2({ onToca, marcas = {}, etiquetas = false }: Props) {
  const el = tocable(onToca, marcas)
  return (
    <svg viewBox="0 0 400 320" className="mx-auto block h-auto w-full max-w-lg touch-manipulation select-none" role="img" aria-label="La cara">
      <rect width="400" height="320" fill="#f0f9ff" />
      <rect x="170" y="250" width="60" height="70" fill={PEL} stroke={BORDE} strokeOpacity="0.5" pointerEvents="none" />
      {el(
        'oreille',
        <>
          <ellipse cx="102" cy="160" rx="18" ry="28" fill="#eab38a" stroke={BORDE} strokeOpacity="0.6" />
          <ellipse cx="298" cy="160" rx="18" ry="28" fill="#eab38a" stroke={BORDE} strokeOpacity="0.6" />
        </>,
      )}
      <ellipse cx="200" cy="160" rx="100" ry="112" fill={PEL} stroke={BORDE} strokeOpacity="0.5" pointerEvents="none" />
      {el('cheveux', <path d="M98 150 Q92 40 200 38 Q308 40 302 150 Q286 92 240 84 Q200 112 150 86 Q112 100 98 150 Z" fill="#5b3a1e" />)}
      {el(
        'oeil',
        <>
          {[158, 242].map((x) => (
            <g key={x}>
              <ellipse cx={x} cy="150" rx="20" ry="13" fill="#fff" stroke="#334155" strokeWidth="1.5" />
              <circle cx={x} cy="151" r="8" fill="#0369a1" />
              <circle cx={x} cy="151" r="4" fill="#0f172a" />
            </g>
          ))}
        </>,
      )}
      <path d="M140 124 Q158 116 176 124 M224 124 Q242 116 260 124" stroke="#5b3a1e" strokeWidth="4" fill="none" strokeLinecap="round" pointerEvents="none" />
      {el('nez', <path d="M200 160 Q188 196 182 204 Q200 212 218 204 Q212 196 200 160 Z" fill="#eab38a" stroke={BORDE} strokeOpacity="0.6" />)}
      {el('bouche', <path d="M152 226 Q200 214 248 226 Q240 268 200 270 Q160 268 152 226 Z" fill="#9f1239" stroke="#881337" strokeWidth="2" />)}
      {el('dents', <path d="M162 228 Q200 220 238 228 L236 240 Q200 234 164 240 Z" fill="#fff" stroke="#e2e8f0" />)}
      {el('langue', <ellipse cx="200" cy="256" rx="26" ry="11" fill="#fb7185" />)}
      <Etiquetas
        sitios={{
          cheveux: [200, 22, 'les cheveux'],
          oeil: [326, 108, "l'œil"],
          oreille: [354, 196, "l'oreille"],
          nez: [290, 186, 'le nez'],
          bouche: [80, 246, 'la bouche'],
          dents: [322, 230, 'les dents'],
          langue: [306, 280, 'la langue'],
        }}
        marcas={marcas}
        etiquetas={etiquetas}
        tam={16}
      />
    </svg>
  )
}
