// Piezas pequeñas que usan varias paradas: recta numérica, expresión escrita, campos y contadores.
import { motion } from 'motion/react'
import type { Trozo, Nodo } from '../lib/expresion'

/** Escribe un entero como en el libro: con el signo menos largo. */
export const ent = (v: number) => (v < 0 ? `−${-v}` : String(v))
/** Igual, pero con paréntesis si es negativo: para escribirlo detrás de una operación. */
export const entP = (v: number) => (v < 0 ? `(−${-v})` : String(v))

/** Lee lo que escribe el alumno como entero. Devuelve null si no lo es. */
export function leerEntero(s: string): number | null {
  const limpio = s.replace(/[−–]/g, '-').replace(/\s+/g, '').replace(/^\+/, '')
  return /^-?\d+$/.test(limpio) ? Number(limpio) : null
}

/** Campo para un entero, con botón ± porque el teclado numérico de la tablet no siempre tiene el menos. */
export function CampoEntero({ valor, cambiar, etiqueta }: { valor: string; cambiar: (v: string) => void; etiqueta: string }) {
  const alternar = () => cambiar(/^[-−]/.test(valor) ? valor.slice(1) : `-${valor}`)
  return (
    <span className="inline-flex items-center gap-1">
      <button type="button" className="btn w-11 px-0 text-lg" onClick={alternar} aria-label="Cambiar el signo">
        ±
      </button>
      <input className="campo w-28" inputMode="numeric" aria-label={etiqueta} value={valor} onChange={(e) => cambiar(e.target.value)} />
    </span>
  )
}

/** Contador con − y + para elegir un número sin teclado. */
export function Contador({ valor, cambiar, min, max, etiqueta }: { valor: number; cambiar: (v: number) => void; min: number; max: number; etiqueta: string }) {
  return (
    <span className="inline-flex items-center gap-1" aria-label={etiqueta}>
      <button type="button" className="btn w-11 px-0 text-xl" disabled={valor <= min} onClick={() => cambiar(valor - 1)} aria-label={`Bajar ${etiqueta}`}>
        −
      </button>
      <span className="w-14 text-center text-2xl font-bold tabular-nums">{ent(valor)}</span>
      <button type="button" className="btn w-11 px-0 text-xl" disabled={valor >= max} onClick={() => cambiar(valor + 1)} aria-label={`Subir ${etiqueta}`}>
        +
      </button>
    </span>
  )
}

/** Una expresión escrita, con la parte que toca resaltada y, si se pide, los signos de operación tocables. */
export function Expr({ trozos, tocar, grande }: { trozos: Trozo[]; tocar?: (n: Nodo) => void; grande?: boolean }) {
  return (
    <span className={`font-semibold whitespace-nowrap tabular-nums ${grande ? 'text-2xl' : 'text-xl'}`}>
      {trozos.map((t, i) =>
        tocar && t.op ? (
          <button
            key={i}
            onClick={() => tocar(t.op!)}
            className={`mx-0.5 inline-flex h-10 min-w-10 cursor-pointer items-center justify-center rounded-lg border-2 px-1 text-indigo-700 hover:bg-indigo-100 ${
              t.m ? 'border-amber-500 bg-amber-200' : 'border-indigo-300 bg-indigo-50'
            }`}
          >
            {t.s.trim()}
          </button>
        ) : (
          <span key={i} className={`whitespace-pre ${t.m ? 'bg-amber-200' : ''}`}>
            {t.s}
          </span>
        ),
      )}
    </span>
  )
}

export interface Punto {
  v: number
  color: string
  etq?: string
}

export interface Salto {
  de: number
  a: number
  color: string
}

/** Recta numérica. Los puntos marcan números; los saltos dibujan un arco con flecha de un número a otro. */
export function Recta({
  min,
  max,
  puntos = [],
  saltos = [],
  elegir,
  numeros,
}: {
  min: number
  max: number
  puntos?: Punto[]
  saltos?: Salto[]
  elegir?: (v: number) => void
  /** Si se da, solo estos números llevan su cifra escrita debajo. */
  numeros?: number[]
}) {
  const u = 28
  const margen = 24
  const ancho = (max - min) * u + margen * 2
  const y = 66
  const x = (v: number) => margen + (v - min) * u

  return (
    <svg viewBox={`0 0 ${ancho} 112`} width={ancho} height={112} className="max-w-none shrink-0" role="img" aria-label="Recta numérica">
      <line x1={margen - 14} y1={y} x2={ancho - margen + 14} y2={y} stroke="#64748b" strokeWidth={2} />
      {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((v) => (
        <g key={v} onClick={elegir && (() => elegir(v))} className={elegir ? 'cursor-pointer' : undefined}>
          <rect x={x(v) - u / 2} y={0} width={u} height={112} fill="transparent" />
          <line x1={x(v)} y1={y - (v === 0 ? 9 : 5)} x2={x(v)} y2={y + (v === 0 ? 9 : 5)} stroke="#64748b" strokeWidth={v === 0 ? 3 : 2} />
          {(!numeros || numeros.includes(v)) && (
            <text x={x(v)} y={y + 24} textAnchor="middle" fontSize={12} fontWeight={v === 0 ? 700 : 500} fill={v < 0 ? '#dc2626' : v > 0 ? '#2563eb' : '#0f172a'}>
              {ent(v)}
            </text>
          )}
        </g>
      ))}
      {saltos.map((s, i) => {
        const alto = Math.min(46, 14 + Math.abs(s.a - s.de) * 5)
        const x1 = x(s.de)
        const x2 = x(s.a)
        const base = y - 13
        const cx = (x1 + x2) / 2
        const cy = base - alto * 2
        // La punta sigue la dirección con la que el arco llega a su destino.
        const ang = Math.atan2(base - cy, x2 - cx)
        const ala = (giro: number) => `${x2 - 11 * Math.cos(ang + giro)} ${base - 11 * Math.sin(ang + giro)}`
        return (
          <motion.g key={`${i}-${s.de}-${s.a}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 * i }}>
            <motion.path
              d={`M ${x1} ${base} Q ${cx} ${cy} ${x2} ${base}`}
              fill="none"
              stroke={s.color}
              strokeWidth={3}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.15 * i }}
            />
            <path d={`M ${ala(0.5)} L ${x2} ${base} L ${ala(-0.5)}`} stroke={s.color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </motion.g>
        )
      })}
      {puntos.map((p, i) => (
        <motion.g key={`${i}-${p.v}`} initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ transformOrigin: `${x(p.v)}px ${y}px` }} pointerEvents="none">
          <circle cx={x(p.v)} cy={y} r={8} fill={p.color} stroke="#fff" strokeWidth={2} />
          {p.etq && (
            <text x={x(p.v)} y={y + 42} textAnchor="middle" fontSize={13} fontWeight={700} fill={p.color}>
              {p.etq}
            </text>
          )}
        </motion.g>
      ))}
    </svg>
  )
}
