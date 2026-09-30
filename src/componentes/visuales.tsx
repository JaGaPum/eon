// Piezas visuales compartidas por los cuatro modos de una parada.
import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { agrupar, esPrimo, type Potencia } from '../lib/mates'

export interface Fila {
  n: number
  primo: number
}

export interface Mensaje {
  tipo: 'bien' | 'mal'
  texto: ReactNode
}

// Cada primo tiene siempre el mismo color, en la columna, en el árbol y en las fichas.
const COLORES: Record<number, string> = { 2: '#2563eb', 3: '#16a34a', 5: '#ea580c', 7: '#9333ea', 11: '#db2777', 13: '#0d9488' }
export const colorPrimo = (p: number) => COLORES[p] ?? '#475569'

/** 2³ · 7 */
export function Potencias({ potencias }: { potencias: Potencia[] }) {
  return (
    <>
      {potencias.map(([p, e], i) => (
        <span key={p}>
          {i > 0 && ' · '}
          <span style={{ color: colorPrimo(p) }}>
            {p}
            {e > 1 && <sup>{e}</sup>}
          </span>
        </span>
      ))}
    </>
  )
}

/** 56 = 2 · 2 · 2 · 7 = 2³ · 7 */
export function Resultado({ n, primos }: { n: number; primos: number[] }) {
  const potencias = agrupar(primos)
  return (
    <motion.p initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center text-2xl font-bold">
      {n} = {primos.join(' · ')}
      {potencias.length < primos.length && (
        <>
          {' = '}
          <Potencias potencias={potencias} />
        </>
      )}
    </motion.p>
  )
}

/** La columna con la barra vertical, como en el libro. */
export function Columna({ filas, resto, marca }: { filas: Fila[]; resto: number; marca?: number }) {
  return (
    <table className="border-collapse text-2xl font-semibold tabular-nums">
      <tbody>
        {filas.map((f, i) => (
          <motion.tr
            key={i}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={i === marca ? 'bg-amber-100' : undefined}
          >
            <td className="border-r-4 border-slate-700 px-4 py-1 text-right">{f.n}</td>
            <td className="px-4 py-1" style={{ color: colorPrimo(f.primo) }}>
              {f.primo}
            </td>
          </motion.tr>
        ))}
        <motion.tr key={`resto-${filas.length}`} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <td className="border-r-4 border-slate-700 px-4 py-1 text-right">{resto}</td>
          <td className="px-4 py-1 text-slate-300">{resto === 1 ? '' : '?'}</td>
        </motion.tr>
      </tbody>
    </table>
  )
}

/** El mismo proceso dibujado como árbol: cada número se parte en un primo y lo que queda. */
export function Arbol({ filas, resto }: { filas: Fila[]; resto: number }) {
  const cortes = filas.filter((f) => f.n !== f.primo)
  const ultimo = cortes[cortes.length - 1]
  const fin = ultimo ? ultimo.n / ultimo.primo : (filas[0]?.n ?? resto)
  const dx = 46
  const dy = 56
  const x0 = 78
  const y0 = 24
  const k = cortes.length
  const ancho = x0 + k * dx + 40
  const alto = y0 + k * dy + 26

  const nodo = (clave: string, x: number, y: number, v: number, primo: boolean) => (
    <motion.g
      key={clave}
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
      style={{ transformOrigin: `${x}px ${y}px` }}
    >
      <rect
        x={x - 26}
        y={y - 16}
        width={52}
        height={32}
        rx={primo ? 16 : 6}
        fill={primo ? colorPrimo(v) : '#fff'}
        stroke={primo ? colorPrimo(v) : '#94a3b8'}
        strokeWidth={2}
      />
      <text x={x} y={y + 5} textAnchor="middle" fontSize={15} fontWeight={700} fill={primo ? '#fff' : '#1e293b'}>
        {v}
      </text>
    </motion.g>
  )

  return (
    <svg viewBox={`0 0 ${ancho} ${alto}`} width={ancho} height={alto} className="max-w-none" role="img" aria-label="Árbol de factores">
      {cortes.map((_, i) => {
        const x = x0 + i * dx
        const y = y0 + i * dy
        return (
          <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} stroke="#94a3b8" strokeWidth={2}>
            <line x1={x} y1={y} x2={x - dx} y2={y + dy} />
            <line x1={x} y1={y} x2={x + dx} y2={y + dy} />
          </motion.g>
        )
      })}
      {cortes.map((f, i) => [
        nodo(`n${i}`, x0 + i * dx, y0 + i * dy, f.n, false),
        nodo(`p${i}`, x0 + (i - 1) * dx, y0 + (i + 1) * dy, f.primo, true),
      ])}
      {nodo(`fin${k}`, x0 + k * dx, y0 + k * dy, fin, esPrimo(fin))}
    </svg>
  )
}

/** Los primos ya encontrados, agrupados: cada montón es una potencia. */
export function Fichas({ primos }: { primos: number[] }) {
  if (primos.length === 0) return <p className="nota">Aquí se irán juntando los primos que encuentres.</p>
  return (
    <div className="flex flex-wrap items-end justify-center gap-4">
      {agrupar(primos).map(([p, e]) => (
        <div key={p} className="flex flex-col items-center gap-1">
          <div className="flex gap-1">
            <AnimatePresence>
              {Array.from({ length: e }, (_, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: -24, scale: 0.4 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.4 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 16 }}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ background: colorPrimo(p) }}
                >
                  {p}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
          <span className="text-lg font-bold" style={{ color: colorPrimo(p) }}>
            {p}
            {e > 1 && <sup>{e}</sup>}
          </span>
        </div>
      ))}
    </div>
  )
}

/** Respuesta de la app: verde si acierta; si falla, tiembla y dice dónde está el fallo. */
export function Aviso({ msg, clave }: { msg: Mensaje | null; clave?: number }) {
  if (!msg) return null
  const bien = msg.tipo === 'bien'
  return (
    <motion.p
      key={clave}
      role="status"
      initial={{ opacity: 0, x: 0 }}
      animate={{ opacity: 1, x: bien ? 0 : [0, -8, 8, -5, 5, 0] }}
      transition={{ duration: 0.4 }}
      className={`rounded-xl border px-4 py-3 ${bien ? 'border-green-300 bg-green-50 text-green-900' : 'border-red-300 bg-red-50 text-red-900'}`}
    >
      {msg.texto}
    </motion.p>
  )
}
