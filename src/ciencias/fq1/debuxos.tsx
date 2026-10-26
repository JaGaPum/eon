// Dibujos propios de Física y Química: el esquema de los cambios de estado (cada flecha se toca), las partículas de
// cada estado y las gráficas de temperatura y de la ley de Boyle-Mariotte, dibujadas a partir de los datos.
import type { ReactNode } from 'react'
import type { Marca } from '../../primaria/pezas'
import { Pilula, tocable } from '../../primaria/paisaxes/debuxos'
import { escribe, type Punto } from '../../lib/fisica'

interface Props {
  onToca?: (id: string) => void
  marcas?: Record<string, Marca>
  etiquetas?: boolean
}

// ——— Esquema de los cambios de estado (página 44) ———

export const NOMES_CAMBIOS: Record<string, string> = {
  fusion: 'la fusión (sólido → líquido)',
  solidificacion: 'la solidificación (líquido → sólido)',
  vaporizacion: 'la vaporización (líquido → gas)',
  condensacion: 'la condensación (gas → líquido)',
  sublimacion: 'la sublimación (sólido → gas)',
  inversa: 'la sublimación inversa (gas → sólido)',
}

const ROJO = '#dc2626'
const AZUL = '#2563eb'

export function EsquemaCambios({ onToca, marcas = {}, etiquetas = true }: Props) {
  const el = tocable(onToca, marcas)
  const caja = (x: number, texto: string, fondo: string) => (
    <g pointerEvents="none">
      <rect x={x - 56} y={128} width={112} height={44} rx={12} fill={fondo} />
      <text x={x} y={156} textAnchor="middle" fontSize="17" fontWeight="800" fill="#1e293b">
        {texto}
      </text>
    </g>
  )
  const flecha = (id: string, d: string, cor: string, lx: number, ly: number, texto: string) =>
    el(
      id,
      <>
        <path d={d} stroke="transparent" strokeWidth="22" fill="none" />
        <path d={d} stroke={cor} strokeWidth="4" fill="none" markerEnd={`url(#punta-${cor === ROJO ? 'r' : 'a'})`} />
        {etiquetas && (
          <text x={lx} y={ly} textAnchor="middle" fontSize="13" fontWeight="800" fill={cor} pointerEvents="none">
            {texto}
          </text>
        )}
      </>,
    )
  return (
    <svg viewBox="0 0 480 300" className="block h-auto w-full touch-manipulation select-none" role="img" aria-label="Esquema de los cambios de estado">
      <defs>
        {[
          ['r', ROJO],
          ['a', AZUL],
        ].map(([k, c]) => (
          <marker key={k} id={`punta-${k}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0 0 L10 5 L0 10 Z" fill={c} />
          </marker>
        ))}
      </defs>
      <rect width="480" height="300" fill="#f8fafc" />
      <text x="240" y="22" textAnchor="middle" fontSize="12" fontWeight="700" fill={ROJO}>
        CALENTANDO → progresivos
      </text>
      <text x="240" y="292" textAnchor="middle" fontSize="12" fontWeight="700" fill={AZUL}>
        ← ENFRIANDO: regresivos
      </text>
      {caja(70, 'SÓLIDO', '#fdba74')}
      {caja(240, 'LÍQUIDO', '#cbd5e1')}
      {caja(410, 'GAS', '#86efac')}
      {flecha('fusion', 'M128 140 L180 140', ROJO, 154, 128, 'fusión')}
      {flecha('solidificacion', 'M182 162 L130 162', AZUL, 156, 186, 'solidificación')}
      {flecha('vaporizacion', 'M298 140 L350 140', ROJO, 324, 128, 'vaporización')}
      {flecha('condensacion', 'M352 162 L300 162', AZUL, 326, 186, 'condensación')}
      {flecha('sublimacion', 'M70 126 C70 50, 410 50, 410 124', ROJO, 240, 52, 'sublimación')}
      {flecha('inversa', 'M410 174 C410 252, 70 252, 70 176', AZUL, 240, 256, 'sublimación inversa')}
      {!etiquetas &&
        Object.entries({ fusion: [154, 120], solidificacion: [156, 190], vaporizacion: [324, 120], condensacion: [326, 190], sublimacion: [240, 56], inversa: [240, 250] })
          .filter(([id]) => marcas[id])
          .map(([id, [x, y]]) => <Pilula key={id} x={x} y={y} texto={NOMES_CAMBIOS[id].split(' (')[0]} marca={marcas[id]} tam={12} />)}
    </svg>
  )
}

// ——— Partículas de cada estado ———

/** Las partículas en un recipiente: muy juntas y ordenadas, en grupos que deslizan o libres y separadas. */
export function Particulas({ estado, tam = 150 }: { estado: 'sólido' | 'líquido' | 'gas'; tam?: number }) {
  const bolas: ReactNode[] = []
  if (estado === 'sólido') for (let i = 0; i < 6; i++) for (let j = 0; j < 5; j++) bolas.push(<circle key={`${i}${j}`} cx={38 + i * 15} cy={70 + j * 15} r={7} fill="#3b82f6" stroke="#1e3a8a" />)
  if (estado === 'líquido') {
    const pos = [
      [30, 120], [44, 126], [58, 118], [74, 126], [90, 120], [106, 126], [120, 118], [36, 106], [52, 102], [68, 108], [84, 102], [100, 108], [116, 102],
      [28, 90], [44, 88], [62, 92], [80, 86], [96, 92], [112, 88], [124, 96], [40, 74], [58, 76], [76, 72], [92, 76], [108, 74],
    ]
    pos.forEach(([x, y], i) => bolas.push(<circle key={i} cx={x} cy={y} r={7} fill="#3b82f6" stroke="#1e3a8a" />))
  }
  if (estado === 'gas') {
    const pos = [
      [30, 40, 1, -1], [80, 30, -1, 1], [120, 60, 1, 1], [50, 90, -1, -1], [100, 110, 1, -1], [30, 125, 1, 1], [75, 70, 0, 1], [120, 125, -1, -1],
    ]
    pos.forEach(([x, y, dx, dy], i) =>
      bolas.push(
        <g key={i}>
          <line x1={x} y1={y} x2={x + dx * 14} y2={y + dy * 14} stroke="#64748b" strokeWidth="2" />
          <circle cx={x} cy={y} r={7} fill="#3b82f6" stroke="#1e3a8a" />
        </g>,
      ),
    )
  }
  return (
    <svg viewBox="0 0 150 150" width={tam} height={tam} role="img" aria-label={`Partículas en estado ${estado}`}>
      <path d="M18 14 L18 140 L132 140 L132 14" fill="#f1f5f9" stroke="#475569" strokeWidth="3" />
      {bolas}
    </svg>
  )
}

// ——— Gráficas ———

const ejes = (W: number, H: number, m: number) => ({ x0: m + 8, y0: H - m, x1: W - 10, y1: 12 })

/** Gráfica de temperatura (°C) frente al tiempo (min) a partir de los puntos; las mesetas se marcan en verde. */
export function GraficaT({ puntos, rotulos }: { puntos: Punto[]; rotulos?: string[] }) {
  const W = 480
  const H = 280
  const { x0, y0, x1, y1 } = ejes(W, H, 36)
  const tMax = Math.max(...puntos.map((p) => p.t))
  const Ts = puntos.map((p) => p.T)
  const Tmin = Math.min(0, ...Ts)
  const Tmax = Math.max(...Ts)
  const paso = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000].find((s) => (Tmax - Tmin) / s <= 8) ?? 1000
  const lo = Math.floor(Tmin / paso) * paso
  const hi = Math.ceil(Tmax / paso) * paso
  const X = (t: number) => x0 + (t / tMax) * (x1 - x0)
  const Y = (T: number) => y0 - ((T - lo) / (hi - lo)) * (y0 - y1)
  const marcasT: number[] = []
  for (let v = lo; v <= hi; v += paso) marcasT.push(v)
  const pasoT = [1, 2, 5, 10, 20, 50].find((s) => tMax / s <= 10) ?? 50
  const marcasX: number[] = []
  for (let v = 0; v <= tMax + 1e-9; v += pasoT) marcasX.push(v)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label="Gráfica de temperatura frente al tiempo">
      <rect width={W} height={H} fill="#fff" />
      {marcasT.map((v) => (
        <g key={v}>
          <line x1={x0} x2={x1} y1={Y(v)} y2={Y(v)} stroke="#e2e8f0" />
          <text x={x0 - 6} y={Y(v) + 4} textAnchor="end" fontSize="11" fill="#475569">
            {v}
          </text>
        </g>
      ))}
      {marcasX.map((v) => (
        <g key={v}>
          <line y1={y0} y2={y1} x1={X(v)} x2={X(v)} stroke="#f1f5f9" />
          <text x={X(v)} y={y0 + 15} textAnchor="middle" fontSize="11" fill="#475569">
            {escribe(v, 1)}
          </text>
        </g>
      ))}
      <line x1={x0} x2={x1} y1={Y(0)} y2={Y(0)} stroke="#475569" />
      <line x1={x0} x2={x0} y1={y0} y2={y1} stroke="#475569" />
      <text x={x0 + 4} y={y1 + 2} fontSize="12" fontWeight="700" fill="#1e293b">
        T (°C)
      </text>
      <text x={x1} y={y0 + 28} textAnchor="end" fontSize="12" fontWeight="700" fill="#1e293b">
        t (min)
      </text>
      {puntos.slice(1).map((p, i) => {
        const a = puntos[i]
        const meseta = a.T === p.T
        return (
          <g key={i}>
            <line x1={X(a.t)} y1={Y(a.T)} x2={X(p.t)} y2={Y(p.T)} stroke={meseta ? '#16a34a' : '#ea580c'} strokeWidth="4" strokeLinecap="round" />
            {rotulos?.[i] && (
              <text x={(X(a.t) + X(p.t)) / 2} y={(Y(a.T) + Y(p.T)) / 2 - 9} textAnchor="middle" fontSize="11" fontWeight="700" fill={meseta ? '#166534' : '#9a3412'}>
                {rotulos[i]}
              </text>
            )}
          </g>
        )
      })}
      {puntos.map((p, i) => (
        <circle key={i} cx={X(p.t)} cy={Y(p.T)} r={3.5} fill="#1e293b" />
      ))}
    </svg>
  )
}

/** La hipérbola de Boyle-Mariotte para p·V = k, con algunos puntos marcados. */
export function GraficaBoyle({ k, puntos }: { k: number; puntos: number[] }) {
  const W = 480
  const H = 280
  const { x0, y0, x1, y1 } = ejes(W, H, 36)
  const Vmax = Math.max(...puntos) * 1.25
  const pmax = k / (Math.min(...puntos) * 0.8)
  const X = (V: number) => x0 + (V / Vmax) * (x1 - x0)
  const Y = (p: number) => y0 - (p / pmax) * (y0 - y1)
  const curva: string[] = []
  for (let V = k / pmax; V <= Vmax; V += Vmax / 120) curva.push(`${X(V).toFixed(1)},${Y(k / V).toFixed(1)}`)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label="Gráfica de la presión frente al volumen">
      <rect width={W} height={H} fill="#fff" />
      <line x1={x0} x2={x1} y1={y0} y2={y0} stroke="#475569" />
      <line x1={x0} x2={x0} y1={y0} y2={y1} stroke="#475569" />
      <text x={x0 + 4} y={y1 + 2} fontSize="12" fontWeight="700" fill="#1e293b">
        p (atm)
      </text>
      <text x={x1} y={y0 + 28} textAnchor="end" fontSize="12" fontWeight="700" fill="#1e293b">
        V (L)
      </text>
      <polyline points={curva.join(' ')} fill="none" stroke="#ea580c" strokeWidth="4" />
      {puntos.map((V) => (
        <g key={V}>
          <line x1={X(V)} x2={X(V)} y1={y0} y2={Y(k / V)} stroke="#94a3b8" strokeDasharray="4 4" />
          <line x1={x0} x2={X(V)} y1={Y(k / V)} y2={Y(k / V)} stroke="#94a3b8" strokeDasharray="4 4" />
          <circle cx={X(V)} cy={Y(k / V)} r={5} fill="#1e293b" />
          <text x={X(V)} y={y0 + 15} textAnchor="middle" fontSize="11" fill="#475569">
            {escribe(V, 2)}
          </text>
          <text x={x0 - 6} y={Y(k / V) + 4} textAnchor="end" fontSize="11" fill="#475569">
            {escribe(k / V, 2)}
          </text>
        </g>
      ))}
    </svg>
  )
}
