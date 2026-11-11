// Dibujos de electricidad hechos con código: esquemas de circuitos a partir de su estructura (serie y paralelo), los
// símbolos de la tabla del tema y el triángulo de la ley de Ohm.
import { useState, type ReactNode } from 'react'
import type { Debuxo, Marca } from '../../primaria/pezas'
import { tocable } from '../../primaria/paisaxes/debuxos'
import { esElemento, hijos, num, type Circuito, type Magnitud } from '../../lib/electricidad'

const TINTA = '#1e293b'
const RESALTE = '#f59e0b'

// ——— Esquemas de circuitos ———

const ANCHO_EL = 96
const ALTO_EL = 68
const MARGEN_PAR = 22

interface Caja {
  w: number
  h: number
}
function medida(c: Circuito): Caja {
  if (esElemento(c)) return { w: ANCHO_EL, h: ALTO_EL }
  const ms = hijos(c).map(medida)
  if ('serie' in c) return { w: ms.reduce((s, m) => s + m.w, 0), h: Math.max(...ms.map((m) => m.h)) }
  return { w: Math.max(...ms.map((m) => m.w)) + 2 * MARGEN_PAR, h: ms.reduce((s, m) => s + m.h, 0) }
}

/** Dibuja un trozo de circuito entre (x, y) y (x + w, y); devuelve sus trazos. */
function trozo(c: Circuito, x: number, y: number, resalta: Set<Circuito>, conValores: boolean): ReactNode[] {
  const { w, h } = medida(c)
  const out: ReactNode[] = []
  const k = `${x}-${y}`
  if (resalta.has(c)) out.push(<rect key={`r${k}`} x={x + 4} y={y - h / 2 + 3} width={w - 8} height={h - 6} rx={12} fill="#fef3c7" stroke={RESALTE} strokeWidth={2.5} strokeDasharray="6 4" />)
  if (esElemento(c)) {
    const cx = x + w / 2
    out.push(<line key={`a${k}`} x1={x} y1={y} x2={cx - 20} y2={y} stroke={TINTA} strokeWidth={2} />, <line key={`b${k}`} x1={cx + 20} y1={y} x2={x + w} y2={y} stroke={TINTA} strokeWidth={2} />)
    if (c.tipo === 'lampara')
      out.push(
        <g key={`l${k}`}>
          <line x1={cx - 20} y1={y} x2={cx - 13} y2={y} stroke={TINTA} strokeWidth={2} />
          <line x1={cx + 13} y1={y} x2={cx + 20} y2={y} stroke={TINTA} strokeWidth={2} />
          <circle cx={cx} cy={y} r={13} fill="#fff" stroke={TINTA} strokeWidth={2} />
          <path d={`M${cx - 9} ${y - 9} L${cx + 9} ${y + 9} M${cx + 9} ${y - 9} L${cx - 9} ${y + 9}`} stroke={TINTA} strokeWidth={2} />
        </g>,
      )
    else out.push(<rect key={`z${k}`} x={cx - 20} y={y - 8} width={40} height={16} rx={2} fill={c.equivalente ? '#ddd6fe' : '#fff'} stroke={c.equivalente ? '#7c3aed' : TINTA} strokeWidth={2} />)
    out.push(
      <text key={`t${k}`} x={cx} y={y - 16} textAnchor="middle" fontSize={14} fontWeight={800} fill={c.equivalente ? '#6d28d9' : TINTA}>
        {conValores ? `${c.nombre} = ${num(c.r)} Ω` : c.nombre}
      </text>,
    )
    return out
  }
  if ('serie' in c) {
    let xi = x
    for (const hh of c.serie) {
      const m = medida(hh)
      out.push(...trozo(hh, xi, y, resalta, conValores))
      xi += m.w
    }
    return out
  }
  // En paralelo: cada rama en su fila, unidas por dos barras verticales.
  let yi = y - h / 2
  const centros: number[] = []
  const xa = x + MARGEN_PAR / 2
  const xb = x + w - MARGEN_PAR / 2
  for (const hh of c.paralelo) {
    const m = medida(hh)
    const yc = yi + m.h / 2
    centros.push(yc)
    out.push(...trozo(hh, x + MARGEN_PAR, yc, resalta, conValores))
    out.push(<line key={`p${k}-${yc}a`} x1={xa} y1={yc} x2={x + MARGEN_PAR} y2={yc} stroke={TINTA} strokeWidth={2} />)
    out.push(<line key={`p${k}-${yc}b`} x1={x + MARGEN_PAR + m.w} y1={yc} x2={xb} y2={yc} stroke={TINTA} strokeWidth={2} />)
    yi += m.h
  }
  const [y0, y1] = [centros[0], centros[centros.length - 1]]
  out.push(
    <line key={`v${k}a`} x1={xa} y1={y0} x2={xa} y2={y1} stroke={TINTA} strokeWidth={2} />,
    <line key={`v${k}b`} x1={xb} y1={y0} x2={xb} y2={y1} stroke={TINTA} strokeWidth={2} />,
    <line key={`e${k}a`} x1={x} y1={y} x2={xa} y2={y} stroke={TINTA} strokeWidth={2} />,
    <line key={`e${k}b`} x1={xb} y1={y} x2={x + w} y2={y} stroke={TINTA} strokeWidth={2} />,
    <circle key={`n${k}a`} cx={xa} cy={y} r={3.5} fill={TINTA} />,
    <circle key={`n${k}b`} cx={xb} cy={y} r={3.5} fill={TINTA} />,
  )
  return out
}

/**
 * El esquema completo: el circuito arriba y el generador abajo cerrando el circuito. `resalta`: grupos que se
 * marcan con un recuadro (el que se va a simplificar). `V`: la tensión del generador, si se conoce.
 */
export function Esquema({ c, resalta = [], V, conValores = true, max = 560, interruptor }: { c: Circuito; resalta?: Circuito[]; V?: number; conValores?: boolean; max?: number; interruptor?: boolean }) {
  const { w, h } = medida(c)
  const pad = 26
  const W = Math.max(w, 200) + 2 * pad
  const yTop = pad + h / 2
  const yBot = pad + h + 40
  const H = yBot + 44
  const x0 = (W - w) / 2
  const xm = W / 2
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: Math.min(max, W * 1.6) }} className="mx-auto block" role="img" aria-label="Esquema del circuito">
      <line x1={pad} y1={yTop} x2={x0} y2={yTop} stroke={TINTA} strokeWidth={2} />
      <line x1={x0 + w} y1={yTop} x2={W - pad} y2={yTop} stroke={TINTA} strokeWidth={2} />
      {trozo(c, x0, yTop, new Set(resalta), conValores)}
      <path d={`M${pad} ${yTop} V${yBot} H${xm - 8} M${xm + 8} ${yBot} H${W - pad} V${yTop}`} fill="none" stroke={TINTA} strokeWidth={2} />
      {interruptor && (
        <g>
          <rect x={pad + 30} y={yBot - 4} width={44} height={8} fill="#fff" />
          <circle cx={pad + 34} cy={yBot} r={3} fill={TINTA} />
          <circle cx={pad + 70} cy={yBot} r={3} fill={TINTA} />
          <line x1={pad + 34} y1={yBot} x2={pad + 66} y2={yBot - 16} stroke={TINTA} strokeWidth={2} />
        </g>
      )}
      <line x1={xm - 8} y1={yBot - 18} x2={xm - 8} y2={yBot + 18} stroke={TINTA} strokeWidth={2.5} />
      <line x1={xm + 8} y1={yBot - 9} x2={xm + 8} y2={yBot + 9} stroke={TINTA} strokeWidth={5} />
      <text x={xm - 22} y={yBot - 8} fontSize={13} fontWeight={800} fill="#dc2626" textAnchor="middle">
        +
      </text>
      <text x={xm} y={yBot + 34} fontSize={15} fontWeight={800} fill={TINTA} textAnchor="middle">
        {V !== undefined ? `${num(V)} V` : 'Generador'}
      </text>
    </svg>
  )
}

// ——— Símbolos (tabla del tema) ———

export const SIMBOLOS = ['pila', 'lampara', 'interruptor', 'conmutador', 'pulsador', 'motor', 'zumbador', 'led', 'resistencia', 'conexion', 'cruce'] as const
export type Simbolo = (typeof SIMBOLOS)[number]
export const NOMBRE_SIMBOLO: Record<Simbolo, string> = {
  pila: 'Pila',
  lampara: 'Lámpara',
  interruptor: 'Interruptor',
  conmutador: 'Conmutador',
  pulsador: 'Pulsador',
  motor: 'Motor',
  zumbador: 'Zumbador',
  led: 'LED',
  resistencia: 'Resistencia',
  conexion: 'Conexión',
  cruce: 'Cruce (sin conexión)',
}

/** Un símbolo dibujado en una caja de 100 × 60, con cables a los lados. */
function trazos(s: Simbolo): ReactNode {
  const l = (x1: number, y1: number, x2: number, y2: number, w = 2.5) => <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={TINTA} strokeWidth={w} />
  const p = (cx: number, cy: number) => <circle cx={cx} cy={cy} r={3.5} fill="#fff" stroke={TINTA} strokeWidth={2} />
  switch (s) {
    case 'pila':
      return (
        <>
          {l(10, 30, 45, 30)}
          {l(45, 12, 45, 48)}
          {l(55, 21, 55, 39, 5)}
          {l(55, 30, 90, 30)}
        </>
      )
    case 'lampara':
      return (
        <>
          {l(10, 30, 36, 30)}
          {l(64, 30, 90, 30)}
          <circle cx={50} cy={30} r={14} fill="#fff" stroke={TINTA} strokeWidth={2.5} />
          <path d="M40 20 L60 40 M60 20 L40 40" stroke={TINTA} strokeWidth={2.5} />
        </>
      )
    case 'interruptor':
      return (
        <>
          {l(10, 34, 34, 34)}
          {p(38, 34)}
          {l(41, 32, 62, 18)}
          {p(66, 34)}
          {l(70, 34, 90, 34)}
        </>
      )
    case 'conmutador':
      return (
        <>
          {l(10, 36, 34, 36)}
          {p(38, 36)}
          {l(41, 34, 62, 22)}
          {p(66, 20)}
          {p(66, 44)}
          {l(70, 20, 90, 20)}
          {l(70, 44, 90, 44)}
        </>
      )
    case 'pulsador':
      return (
        <>
          {l(10, 40, 34, 40)}
          {p(38, 40)}
          {p(62, 40)}
          {l(66, 40, 90, 40)}
          {l(34, 30, 66, 30)}
          {l(50, 30, 50, 14)}
        </>
      )
    case 'motor':
      return (
        <>
          {l(10, 30, 36, 30)}
          {l(64, 30, 90, 30)}
          <circle cx={50} cy={30} r={14} fill="#fff" stroke={TINTA} strokeWidth={2.5} />
          <text x={50} y={35.5} textAnchor="middle" fontSize={15} fontWeight={800} fill={TINTA}>
            M
          </text>
        </>
      )
    case 'zumbador':
      return (
        <>
          {l(30, 52, 30, 30)}
          {l(30, 30, 40, 30)}
          {l(70, 52, 70, 30)}
          {l(70, 30, 60, 30)}
          <path d="M40 14 V34 Q50 44 60 34 V14 Z" fill="#fff" stroke={TINTA} strokeWidth={2.5} />
        </>
      )
    case 'led':
      return (
        <>
          {l(10, 34, 40, 34)}
          <path d="M40 22 L40 46 L60 34 Z" fill="#fff" stroke={TINTA} strokeWidth={2.5} />
          {l(60, 22, 60, 46)}
          {l(60, 34, 90, 34)}
          <path d="M54 18 L64 8 M60 8 h4 v4 M62 22 L72 12 M68 12 h4 v4" stroke={TINTA} strokeWidth={1.8} fill="none" />
        </>
      )
    case 'resistencia':
      return (
        <>
          {l(10, 30, 30, 30)}
          <rect x={30} y={22} width={40} height={16} fill="#fff" stroke={TINTA} strokeWidth={2.5} />
          {l(70, 30, 90, 30)}
        </>
      )
    case 'conexion':
      return (
        <>
          {l(10, 22, 90, 22)}
          {l(50, 22, 50, 54)}
          <circle cx={50} cy={22} r={5} fill={TINTA} />
        </>
      )
    case 'cruce':
      return (
        <>
          {l(10, 30, 90, 30)}
          {l(50, 6, 50, 54)}
        </>
      )
  }
}

export function SimboloSvg({ s, tam = 120 }: { s: Simbolo; tam?: number }) {
  return (
    <svg viewBox="0 0 100 60" width={tam} height={(tam * 60) / 100} role="img" aria-label="Símbolo eléctrico" className="mx-auto block">
      {trazos(s)}
    </svg>
  )
}

/** Varios símbolos para tocar el que se pide. */
export const tablaSimbolos =
  (ids: readonly Simbolo[]): Debuxo =>
  ({ onToca, marcas = {} }) => {
    const t = tocable(onToca, marcas as Record<string, Marca>)
    const cols = 4
    return (
      <svg viewBox={`0 0 ${cols * 110} ${Math.ceil(ids.length / cols) * 80}`} width="100%" className="block">
        {ids.map((s, i) =>
          t(
            s,
            <g transform={`translate(${(i % cols) * 110 + 5} ${Math.floor(i / cols) * 80 + 10})`}>
              <rect x={0} y={-4} width={100} height={68} rx={10} fill="#fff" stroke="#c4b5fd" strokeWidth={1.5} />
              {trazos(s)}
            </g>,
          ),
        )}
      </svg>
    )
  }

/** Tres esquemas para tocar el que corresponde a lo que se describe. */
export const variosEsquemas =
  (opciones: { id: string; c: Circuito }[]): Debuxo =>
  ({ onToca, marcas = {} }) => (
    <div className="grid gap-2 sm:grid-cols-3">
      {opciones.map((o) => (
        <button
          key={o.id}
          data-id={o.id}
          type="button"
          onClick={() => onToca?.(o.id)}
          className={`cursor-pointer rounded-2xl border-2 bg-white p-1 ${marcas[o.id] === 'ben' ? 'border-emerald-500 ring-4 ring-emerald-200' : marcas[o.id] === 'mal' ? 'border-rose-400 ring-4 ring-rose-200' : 'border-violet-200 hover:bg-violet-50'}`}
        >
          <Esquema c={o.c} conValores={false} max={260} interruptor />
        </button>
      ))}
    </div>
  )

// ——— El triángulo de la ley de Ohm ———

const DESPEJE: Record<Magnitud, ReactNode> = {
  V: <>V = I · R</>,
  I: (
    <>
      I = <Frac a="V" b="R" />
    </>
  ),
  R: (
    <>
      R = <Frac a="V" b="I" />
    </>
  ),
}

export function Frac({ a, b }: { a: ReactNode; b: ReactNode }) {
  return (
    <span className="mx-1 inline-flex flex-col items-center align-middle leading-none">
      <span className="border-b-2 border-current px-1 pb-0.5">{a}</span>
      <span className="px-1 pt-0.5">{b}</span>
    </span>
  )
}

/** El triángulo V / I · R: se tapa con el dedo lo que se busca y queda la fórmula. */
export function Triangulo({ inicial, fijo }: { inicial?: Magnitud; fijo?: boolean }) {
  const [tapa, setTapa] = useState<Magnitud | null>(inicial ?? null)
  const zona = (m: Magnitud, d: string, tx: number, ty: number, cor: string) => (
    <g onClick={fijo ? undefined : () => setTapa(tapa === m ? null : m)} className={fijo ? '' : 'cursor-pointer'}>
      <path d={d} fill={tapa === m ? '#475569' : cor} stroke="#fff" strokeWidth={3} />
      <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle" fontSize={34} fontWeight={900} fill={tapa === m ? '#94a3b8' : '#1e1b4b'}>
        {tapa === m ? '👆' : m}
      </text>
    </g>
  )
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <svg viewBox="0 0 200 175" width={200} role="img" aria-label="Triángulo de la ley de Ohm">
        {zona('V', 'M100 5 L150 90 L50 90 Z', 100, 60, '#fde047')}
        {zona('I', 'M50 90 L100 90 L100 172 L2 172 Z', 66, 135, '#fdba74')}
        {zona('R', 'M100 90 L150 90 L198 172 L100 172 Z', 134, 135, '#86efac')}
      </svg>
      <div className="min-w-40 text-center">
        {tapa ? (
          <p className="text-3xl font-black text-violet-900">{DESPEJE[tapa]}</p>
        ) : (
          <p className="text-lg text-slate-600">{fijo ? '' : 'Toca la letra que buscas: tápala con el dedo y mira lo que queda.'}</p>
        )}
        {tapa && <p className="mt-1 text-sm text-slate-500">{tapa === 'V' ? 'I y R están una al lado de la otra: se multiplican.' : `V está encima de ${tapa === 'I' ? 'R' : 'I'}: se divide.`}</p>}
      </div>
    </div>
  )
}

/** Un hilo de cobre con su longitud L y su sección s. */
export function Hilo({ L, d }: { L: string; d: string }) {
  return (
    <svg viewBox="0 0 320 110" width="100%" style={{ maxWidth: 380 }} className="mx-auto block" role="img" aria-label="Hilo de cobre">
      <defs>
        <linearGradient id="cobre" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fdba74" />
          <stop offset="0.5" stopColor="#c2410c" />
          <stop offset="1" stopColor="#7c2d12" />
        </linearGradient>
      </defs>
      <rect x={40} y={50} width={240} height={34} fill="url(#cobre)" />
      <ellipse cx={280} cy={67} rx={10} ry={17} fill="#9a3412" />
      <ellipse cx={40} cy={67} rx={10} ry={17} fill="#fed7aa" stroke="#9a3412" />
      <path d="M40 30 H280 M40 24 V36 M280 24 V36" stroke={TINTA} strokeWidth={2} />
      <text x={160} y={22} textAnchor="middle" fontSize={15} fontWeight={800} fill={TINTA}>
        L = {L}
      </text>
      <path d="M22 50 V84 M16 50 H28 M16 84 H28" stroke={TINTA} strokeWidth={2} />
      <text x={14} y={104} fontSize={14} fontWeight={800} fill={TINTA}>
        d = {d}
      </text>
      <text x={160} y={72} textAnchor="middle" fontSize={15} fontWeight={800} fill="#fff">
        ρ cobre
      </text>
    </svg>
  )
}
