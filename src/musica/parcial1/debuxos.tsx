// Debuxos propios de Música: figuras e silenzos, pentagrama, teclado, claves, signos e ondas. O aria-label é o nome do
// que se debuxa.
import type { ReactNode } from 'react'
import { FIGURAS, type Figura } from '../../lib/musica'
import { tocable } from '../../primaria/paisaxes/debuxos'
import { Etiquetas, Svg, type Props } from '../../historia/parcial1/debuxos'

const T = '#1e293b'
const Caixa = ({ nome, tam = 90, children }: { nome: string; tam?: number; children: ReactNode }) => (
  <svg viewBox="0 0 100 100" width={tam} height={tam} role="img" aria-label={nome}>
    {children}
  </svg>
)
const Pauta = ({ y = 30, paso = 10 }: { y?: number; paso?: number }) => (
  <g stroke="#64748b" strokeWidth="1.3">
    {[0, 1, 2, 3, 4].map((i) => (
      <line key={i} x1="4" x2="96" y1={y + i * paso} y2={y + i * paso} />
    ))}
  </g>
)

/** Unha figura musical. */
export function DebuxoFigura({ f, tam }: { f: Figura; tam?: number }) {
  const i = FIGURAS.indexOf(f)
  const oca = i < 2
  const y = 74
  return (
    <Caixa nome={f} tam={tam}>
      <ellipse cx="44" cy={y} rx="11" ry="8" transform={`rotate(-20 44 ${y})`} fill={oca ? 'none' : T} stroke={T} strokeWidth={oca ? 3.5 : 1} />
      {i > 0 && <line x1="54" y1={y - 3} x2="54" y2="14" stroke={T} strokeWidth="3" />}
      {Array.from({ length: Math.max(0, i - 2) }, (_, k) => (
        <path key={k} d={`M54 ${14 + k * 11} q16 10 12 26`} stroke={T} strokeWidth="3.5" fill="none" />
      ))}
    </Caixa>
  )
}

/** O silenzo de cada figura, sobre o pentagrama, no sitio onde vai. */
export function DebuxoSilenzo({ f, tam }: { f: Figura; tam?: number }) {
  const i = FIGURAS.indexOf(f)
  let s: ReactNode
  if (i === 0) s = <rect x="36" y="40" width="28" height="7" fill={T} />
  else if (i === 1) s = <rect x="36" y="43" width="28" height="7" fill={T} />
  else if (i === 2) s = <path d="M46 32 L56 46 L46 56 L56 68 C46 64 42 70 50 78 C36 72 38 58 48 60 L42 50 L50 42 Z" fill={T} />
  else
    s = (
      <>
        <line x1="60" y1="36" x2={46 - (i - 3) * 3} y2={72 + (i - 3) * 6} stroke={T} strokeWidth="3" />
        {Array.from({ length: i - 2 }, (_, k) => (
          <g key={k}>
            <circle cx={44 - k * 3} cy={38 + k * 11} r="4.5" fill={T} />
            <path d={`M44 ${41 + k * 11} Q${50 - k * 3} ${45 + k * 11} ${60 - k * 3} ${36 + k * 11}`} stroke={T} strokeWidth="2.5" fill="none" />
          </g>
        ))}
      </>
    )
  return (
    <Caixa nome={`silenzo de ${f}`} tam={tam}>
      <Pauta />
      {s}
    </Caixa>
  )
}

// ——— Claves ———
export function DebuxoClave({ c, tam }: { c: 'sol' | 'fa' | 'do'; tam?: number }) {
  return (
    <Caixa nome={`clave de ${c}`} tam={tam}>
      <Pauta />
      {c === 'sol' && (
        <g fill="none" stroke={T} strokeWidth="3.2" strokeLinecap="round">
          <path d="M52 94 C58 100 44 104 42 96 M50 96 L46 12 C46 4 54 8 54 18 C54 34 28 44 28 62 C28 76 58 80 62 62 C64 48 42 44 38 58 C36 66 44 72 50 68" />
        </g>
      )}
      {c === 'fa' && (
        <g fill={T}>
          <path d="M26 42 C30 26 62 26 62 46 C62 66 40 78 26 84 C42 72 50 60 50 46 C50 32 36 32 34 42 Z" />
          <circle cx="32" cy="44" r="6" />
          <circle cx="72" cy="35" r="3.5" />
          <circle cx="72" cy="55" r="3.5" />
        </g>
      )}
      {c === 'do' && (
        <g fill={T}>
          <rect x="26" y="30" width="7" height="40" />
          <rect x="37" y="30" width="2.5" height="40" />
          <path d="M40 50 L50 42 C52 38 54 34 60 32 C70 30 74 44 62 44 C58 44 56 40 60 37 M40 50 L50 58 C52 62 54 66 60 68 C70 70 74 56 62 56 C58 56 56 60 60 63" stroke={T} strokeWidth="3" fill="none" />
        </g>
      )}
    </Caixa>
  )
}

// ——— Signos ———
const Nota = ({ x, y = 60 }: { x: number; y?: number }) => (
  <g>
    <ellipse cx={x} cy={y} rx="8" ry="6" transform={`rotate(-20 ${x} ${y})`} fill={T} />
    <line x1={x + 7} y1={y - 2} x2={x + 7} y2={y - 34} stroke={T} strokeWidth="2.5" />
  </g>
)
export const SIGNOS: Record<string, ReactNode> = {
  punto: (
    <>
      <Pauta />
      <Nota x={40} />
      <circle cx="58" cy="58" r="4" fill={T} />
    </>
  ),
  ligadura: (
    <>
      <Pauta />
      <Nota x={28} />
      <Nota x={68} />
      <path d="M28 70 Q48 88 68 70" stroke={T} strokeWidth="3" fill="none" />
    </>
  ),
  caldeirón: (
    <>
      <Pauta y={40} paso={9} />
      <Nota x={46} y={70} />
      <path d="M32 26 A18 18 0 0 1 68 26" stroke={T} strokeWidth="3.5" fill="none" />
      <circle cx="50" cy="23" r="3" fill={T} />
    </>
  ),
  'ligadura de expresión': (
    <>
      <Pauta />
      <Nota x={22} y={70} />
      <Nota x={46} y={60} />
      <Nota x={70} y={50} />
      <path d="M18 18 Q50 0 84 14" stroke={T} strokeWidth="3" fill="none" />
    </>
  ),
  'apóstrofe ou coma': (
    <>
      <Pauta />
      <Nota x={36} />
      <path d="M70 18 a4 4 0 1 1 3 6 q0 5 -5 8" fill={T} stroke={T} strokeWidth="1.5" />
    </>
  ),
  picado: (
    <>
      <Pauta />
      <Nota x={44} />
      <circle cx="44" cy="78" r="3.5" fill={T} />
    </>
  ),
  stacatto: (
    <>
      <Pauta />
      <Nota x={44} />
      <path d="M40 76 L48 76 L44 90 Z" fill={T} />
    </>
  ),
  crescendo: <path d="M90 34 L12 50 L90 66" stroke={T} strokeWidth="3" fill="none" />,
  decrescendo: <path d="M10 34 L88 50 L10 66" stroke={T} strokeWidth="3" fill="none" />,
}
export const DebuxoSigno = ({ s, tam }: { s: string; tam?: number }) => (
  <Caixa nome={s} tam={tam}>
    {SIGNOS[s]}
  </Caixa>
)

// ——— Ondas ———
/** Unha onda: `ciclos` vibracións, de altura `amp`, que dura `lonx` (de 0 a 1). */
export function Onda({ ciclos = 3, amp = 26, lonx = 1, cor = '#7c3aed', nome = 'onda' }: { ciclos?: number; amp?: number; lonx?: number; cor?: string; nome?: string }) {
  const W = 300
  const pts: string[] = []
  for (let x = 0; x <= W * lonx; x += 1.5) pts.push(`${x.toFixed(1)},${(40 - amp * Math.sin((x / (W * lonx)) * ciclos * 2 * Math.PI)).toFixed(1)}`)
  return (
    <svg viewBox={`0 0 ${W} 80`} className="block h-auto w-full" role="img" aria-label={nome}>
      <line x1="0" x2={W} y1="40" y2="40" stroke="#cbd5e1" />
      <polyline points={pts.join(' ')} fill="none" stroke={cor} strokeWidth="3" />
    </svg>
  )
}

// ——— Para tocar ———
export const NOMES_PENTAGRAMA: Record<string, string> = {
  l1: 'a 1.ª liña',
  l2: 'a 2.ª liña',
  l3: 'a 3.ª liña',
  l4: 'a 4.ª liña',
  l5: 'a 5.ª liña',
  e1: 'o 1.º espazo',
  e2: 'o 2.º espazo',
  e3: 'o 3.º espazo',
  e4: 'o 4.º espazo',
}
/** O pentagrama: 5 liñas e 4 espazos, que se contan de abaixo a arriba. */
export function Pentagrama({ onToca, marcas = {}, etiquetas = true }: Props) {
  const el = tocable(onToca, marcas)
  const yL = (n: number) => 200 - n * 32
  return (
    <Svg alto={210} etiqueta="Pentagrama">
      <rect width="480" height="210" fill="#fff" />
      {[1, 2, 3, 4].map((n) => el(`e${n}`, <rect x="20" y={yL(n + 1) + 4} width="440" height="24" fill={marcas[`e${n}`] ? '#fde68a' : 'transparent'} />))}
      {[1, 2, 3, 4, 5].map((n) =>
        el(
          `l${n}`,
          <>
            <rect x="20" y={yL(n) - 5} width="440" height="10" fill="transparent" />
            <line x1="20" x2="460" y1={yL(n)} y2={yL(n)} stroke={T} strokeWidth="3" />
          </>,
        ),
      )}
      <Etiquetas
        sitios={
          {
            ...Object.fromEntries([1, 2, 3, 4, 5].map((n) => [`l${n}`, [90, yL(n) + 4, `${n}.ª liña`]])),
            ...Object.fromEntries([1, 2, 3, 4].map((n) => [`e${n}`, [340, yL(n + 1) + 20, `${n}.º espazo`]])),
          } as Record<string, [number, number, string]>
        }
        marcas={marcas}
        etiquetas={etiquetas}
        tam={13}
      />
    </Svg>
  )
}

export const NOMES_PARTES: Record<string, string> = { cabeza: 'a cabeza', plica: 'a plica', corchete: 'o corchete' }
/** As partes dunha figura. */
export function PartesFigura({ onToca, marcas = {}, etiquetas = true }: Props) {
  const el = tocable(onToca, marcas)
  return (
    <Svg alto={240} etiqueta="Partes da figura">
      <rect width="480" height="240" fill="#fff" />
      {el('cabeza', <ellipse cx="210" cy="195" rx="32" ry="23" transform="rotate(-20 210 195)" fill={T} />)}
      {el(
        'plica',
        <>
          <rect x="226" y="24" width="30" height="165" fill="transparent" />
          <line x1="240" y1="188" x2="240" y2="24" stroke={T} strokeWidth="7" />
        </>,
      )}
      {el('corchete', <path d="M244 24 q60 40 44 106" stroke={T} strokeWidth="12" fill="none" />)}
      <Etiquetas sitios={{ cabeza: [110, 200, 'cabeza'], plica: [150, 100, 'plica'], corchete: [370, 70, 'corchete'] }} marcas={marcas} etiquetas={etiquetas} tam={17} />
    </Svg>
  )
}

const BRANCAS = ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si']
const NEGRAS: [number, string][] = [
  [1, 'Do♯ / Re♭'],
  [2, 'Re♯ / Mi♭'],
  [4, 'Fa♯ / Sol♭'],
  [5, 'Sol♯ / La♭'],
  [6, 'La♯ / Si♭'],
]
export const NOMES_TECLADO: Record<string, string> = { ...Object.fromEntries(BRANCAS.map((n) => [n, n])), ...Object.fromEntries(NEGRAS.map(([, n]) => [n, n])) }
/** Un teclado dunha oitava: as teclas negras teñen dous nomes (notas enarmónicas). */
export function Teclado({ onToca, marcas = {}, etiquetas = true }: Props) {
  const el = tocable(onToca, marcas)
  const w = 480 / 7
  const cor = (id: string, base: string) => (marcas[id] === 'ben' ? '#34d399' : marcas[id] === 'mal' ? '#fb7185' : base)
  return (
    <Svg alto={230} etiqueta="Teclado">
      {BRANCAS.map((n, i) => el(n, <rect x={i * w} y="0" width={w} height="230" fill={cor(n, '#fff')} stroke={T} strokeWidth="2" />))}
      {NEGRAS.map(([i, n]) => el(n, <rect x={i * w - 22} y="0" width="44" height="135" rx="3" fill={cor(n, T)} />))}
      {etiquetas && (
        <g pointerEvents="none" textAnchor="middle" fontWeight="800">
          {BRANCAS.map((n, i) => (
            <text key={n} x={i * w + w / 2} y="212" fontSize="19" fill={T}>
              {n}
            </text>
          ))}
          {NEGRAS.map(([i, n]) => (
            <text key={n} fill="#fff" fontSize="12" y="105">
              <tspan x={i * w}>{n.split(' / ')[0]}</tspan>
              <tspan x={i * w} dy="15">
                {n.split(' / ')[1]}
              </tspan>
            </text>
          ))}
        </g>
      )}
    </Svg>
  )
}
