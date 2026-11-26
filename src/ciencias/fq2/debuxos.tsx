// Dibujos propios del global de Física y Química: las rectas de Gay-Lussac y Charles, las bolitas de átomos y
// moléculas (página 67), el átomo con sus capas (página 66) y la tabla periódica, que se dibuja a partir de
// src/lib/materia.ts.
import { escribe } from '../../lib/fisica'
import { atomos, posicion, type Representacion } from '../../lib/materia'

// ——— Gráfica de una ley directamente proporcional (Gay-Lussac y Charles) ———

export function GraficaRecta({ puntos, ejeX, ejeY }: { puntos: [number, number][]; ejeX: string; ejeY: string }) {
  const W = 480
  const H = 280
  const x0 = 52
  const y0 = H - 36
  const x1 = W - 14
  const y1 = 14
  const xmax = Math.max(...puntos.map((p) => p[0])) * 1.12
  const ymax = Math.max(...puntos.map((p) => p[1])) * 1.15
  const X = (v: number) => x0 + (v / xmax) * (x1 - x0)
  const Y = (v: number) => y0 - (v / ymax) * (y0 - y1)
  const [px, py] = puntos[0]
  const [ux, uy] = puntos[puntos.length - 1]
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label={`Gráfica de ${ejeY} frente a ${ejeX}: una recta que pasa por el (0, 0)`}>
      <rect width={W} height={H} fill="#fff" />
      <line x1={x0} x2={x1} y1={y0} y2={y0} stroke="#475569" />
      <line x1={x0} x2={x0} y1={y0} y2={y1} stroke="#475569" />
      <text x={x0 + 6} y={y1 + 4} fontSize="12" fontWeight="700" fill="#1e293b">
        {ejeY}
      </text>
      <text x={x1} y={y0 + 30} textAnchor="end" fontSize="12" fontWeight="700" fill="#1e293b">
        {ejeX}
      </text>
      <text x={x0 - 6} y={y0 + 14} textAnchor="end" fontSize="11" fill="#475569">
        0
      </text>
      <line x1={X(0)} y1={Y(0)} x2={X(px)} y2={Y(py)} stroke="#2563eb" strokeWidth="3" strokeDasharray="6 5" />
      <line x1={X(px)} y1={Y(py)} x2={X(ux)} y2={Y(uy)} stroke="#2563eb" strokeWidth="4" strokeLinecap="round" />
      {puntos.map(([x, y]) => (
        <g key={x}>
          <line x1={X(x)} x2={X(x)} y1={y0} y2={Y(y)} stroke="#94a3b8" strokeDasharray="4 4" />
          <line x1={x0} x2={X(x)} y1={Y(y)} y2={Y(y)} stroke="#94a3b8" strokeDasharray="4 4" />
          <circle cx={X(x)} cy={Y(y)} r={5} fill="#1e293b" />
          <text x={X(x)} y={y0 + 15} textAnchor="middle" fontSize="11" fill="#475569">
            {escribe(x, 2)}
          </text>
          <text x={x0 - 6} y={Y(y) + 4} textAnchor="end" fontSize="11" fill="#475569">
            {escribe(y, 2)}
          </text>
        </g>
      ))}
    </svg>
  )
}

// ——— Bolitas: átomos, moléculas y cristales ———

const COLOR: Record<string, string> = { O: '#dc2626', H: '#facc15', C: '#334155', N: '#f97316', Cl: '#16a34a', Fe: '#eab308', Na: '#a78bfa', He: '#7dd3fc', Ne: '#f472b6', Au: '#f59e0b' }
const RADIO: Record<string, number> = { H: 7, Fe: 7, Na: 8 }
const color = (s: string) => COLOR[s] ?? '#94a3b8'
const radio = (s: string) => RADIO[s] ?? 10

/** Los átomos de una molécula colocados alrededor del central (el que va solo) o en fila si son dos. */
function molecula(formula: string): { s: string; x: number; y: number }[] {
  const lista = Object.entries(atomos(formula)).flatMap(([s, n]) => Array<string>(n).fill(s))
  if (lista.length === 1) return [{ s: lista[0], x: 0, y: 0 }]
  if (lista.length === 2) return [{ s: lista[0], x: -9, y: 0 }, { s: lista[1], x: 9, y: 0 }]
  const cuenta = atomos(formula)
  const central = Object.keys(cuenta).find((s) => cuenta[s] === 1 && s !== 'H') ?? lista[0]
  const otros = [...lista]
  otros.splice(otros.indexOf(central), 1)
  // El agua es angular; con dos átomos alrededor, en línea (CO₂); con tres, en estrella (NCl₃).
  const angulos = otros.length === 2 ? (otros[0] === 'H' ? [35, 145] : [0, 180]) : otros.map((_, i) => -90 + (360 / otros.length) * i)
  const d = 15
  return [{ s: central, x: 0, y: 0 }, ...otros.map((s, i) => ({ s, x: d * Math.cos((angulos[i] * Math.PI) / 180), y: d * Math.sin((angulos[i] * Math.PI) / 180) }))].sort((a, b) => (a.s === central ? 1 : 0) - (b.s === central ? 1 : 0))
}

const Bola = ({ s, x, y }: { s: string; x: number; y: number }) => (
  <g>
    <circle cx={x} cy={y} r={radio(s)} fill={color(s)} stroke="#1e293b" strokeWidth="1.2" />
    <circle cx={x - radio(s) / 3} cy={y - radio(s) / 3} r={radio(s) / 3.5} fill="#fff" opacity="0.45" />
  </g>
)

/** Un recuadro con lo que se ve al microscopio: átomos sueltos, moléculas o un cristal. */
export function Bolitas({ r, tam = 200 }: { r: Representacion; tam?: number }) {
  const W = 200
  if (r.agrupacion === 'cristal') {
    const s = Object.keys(atomos(r.formulas[0]))
    const n = 5
    const paso = 34
    const o = (W - paso * (n - 1)) / 2
    const celdas = Array.from({ length: n * n }, (_, i) => ({ i: i % n, j: Math.floor(i / n) }))
    return (
      <svg viewBox={`0 0 ${W} ${W}`} width={tam} height={tam} role="img" aria-label="Un cristal: átomos ordenados en el espacio" className="rounded-2xl border-2 border-slate-200 bg-white">
        {celdas.map(({ i, j }) => (
          <g key={`l${i}-${j}`} stroke="#94a3b8" strokeWidth="2">
            {i < n - 1 && <line x1={o + i * paso} y1={o + j * paso} x2={o + (i + 1) * paso} y2={o + j * paso} />}
            {j < n - 1 && <line x1={o + i * paso} y1={o + j * paso} x2={o + i * paso} y2={o + (j + 1) * paso} />}
          </g>
        ))}
        {celdas.map(({ i, j }) => (
          <Bola key={`b${i}-${j}`} s={s[(i + j) % s.length]} x={o + i * paso} y={o + j * paso} />
        ))}
      </svg>
    )
  }
  // Átomos sueltos o moléculas, repartidos en una rejilla con un pequeño desorden (siempre el mismo).
  const huecos = Array.from({ length: 9 }, (_, k) => ({ x: 38 + (k % 3) * 62 + ((k * 7) % 5) * 3 - 6, y: 38 + Math.floor(k / 3) * 62 + ((k * 11) % 7) * 2 - 6, giro: (k * 47) % 180 }))
  return (
    <svg viewBox={`0 0 ${W} ${W}`} width={tam} height={tam} role="img" aria-label={r.agrupacion === 'moléculas' ? 'Moléculas' : 'Átomos aislados'} className="rounded-2xl border-2 border-slate-200 bg-white">
      {huecos.map((h, k) => (
        <g key={k} transform={`translate(${h.x} ${h.y}) rotate(${h.giro})`}>
          {molecula(r.formulas[k % r.formulas.length]).map((a, i) => (
            <Bola key={i} {...a} />
          ))}
        </g>
      ))}
    </svg>
  )
}

/** Leyenda de colores de las bolitas. */
export function LeyendaBolitas({ simbolos }: { simbolos: string[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-3 text-base font-bold text-slate-700">
      {simbolos.map((s) => (
        <span key={s} className="flex items-center gap-1">
          <svg width="22" height="22" viewBox="-11 -11 22 22" aria-hidden="true">
            <Bola s={s} x={0} y={0} />
          </svg>
          {s}
        </span>
      ))}
    </div>
  )
}

// ——— El átomo (página 66) ———

/** Núcleo con protones (rojo) y neutrones (verde) y los electrones en sus capas (2 en la primera, el resto en la segunda). */
export function Atomo({ protones, neutrones, electrones, tam = 200 }: { protones: number; neutrones: number; electrones: number; tam?: number }) {
  const capas = [Math.min(2, electrones), Math.max(0, electrones - 2)].filter((n) => n > 0)
  // Protones y neutrones alternados y en espiral, sin taparse, para que se puedan contar.
  const tipos = Array.from({ length: protones + neutrones }, (_, i) => (i % 2 === 0 ? (i / 2 < protones ? 'p' : 'n') : Math.floor(i / 2) < neutrones ? 'n' : 'p'))
  const nucleo = tipos.map((t, i) => {
    const ang = i * 2.39996
    const rr = tipos.length === 1 ? 0 : 7.2 * Math.sqrt(i + 0.5)
    return { t, x: rr * Math.cos(ang), y: rr * Math.sin(ang) }
  })
  return (
    <svg viewBox="-100 -100 200 200" width={tam} height={tam} role="img" aria-label={`Átomo con ${protones} protones, ${neutrones} neutrones y ${electrones} electrones`}>
      {capas.map((n, c) => {
        const R = 50 + c * 32
        return (
          <g key={c}>
            <circle r={R} fill="none" stroke="#94a3b8" strokeWidth="1.5" />
            {Array.from({ length: n }, (_, i) => {
              const a = (2 * Math.PI * i) / n - Math.PI / 2
              return <circle key={i} cx={R * Math.cos(a)} cy={R * Math.sin(a)} r={5} fill="#2563eb" />
            })}
          </g>
        )
      })}
      {nucleo.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={5.5} fill={p.t === 'p' ? '#dc2626' : '#16a34a'} stroke="#1e293b" strokeWidth="0.8" />
      ))}
    </svg>
  )
}

// ——— La tabla periódica (dibujada con los números atómicos del 1 al 118) ———

/** Cada casilla sale de posicion(z). Los gases nobles (grupo 18) van en verde; los que se marcan, en morado. */
export function TablaPeriodica({ marca = [], simbolos = {} }: { marca?: number[]; simbolos?: Record<number, string> }) {
  const c = 24
  const x0 = 30
  const y0 = 26
  const casillas = Array.from({ length: 118 }, (_, i) => ({ z: i + 1, ...posicion(i + 1) })).filter((e) => e.grupo !== null)
  return (
    <svg viewBox={`0 0 ${x0 + 18 * c + 4} ${y0 + 7 * c + 4}`} className="block h-auto w-full" role="img" aria-label="Tabla periódica: siete periodos y dieciocho grupos">
      {Array.from({ length: 18 }, (_, g) => (
        <text key={g} x={x0 + g * c + c / 2} y={y0 - 8} textAnchor="middle" fontSize="10" fontWeight="700" fill="#475569">
          {g + 1}
        </text>
      ))}
      {Array.from({ length: 7 }, (_, p) => (
        <text key={p} x={x0 - 10} y={y0 + p * c + c / 2 + 4} textAnchor="middle" fontSize="10" fontWeight="700" fill="#475569">
          {p + 1}
        </text>
      ))}
      {casillas.map((e) => {
        const x = x0 + (e.grupo! - 1) * c
        const y = y0 + (e.periodo - 1) * c
        const fondo = marca.includes(e.z) ? '#a78bfa' : e.grupo === 18 ? '#bbf7d0' : '#f1f5f9'
        return (
          <g key={e.z}>
            <rect x={x + 1} y={y + 1} width={c - 2} height={c - 2} rx={3} fill={fondo} stroke="#cbd5e1" />
            <text x={x + c / 2} y={y + c / 2 + 4} textAnchor="middle" fontSize={simbolos[e.z] ? 10 : 8} fontWeight={simbolos[e.z] ? 800 : 400} fill="#334155">
              {simbolos[e.z] ?? e.z}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
