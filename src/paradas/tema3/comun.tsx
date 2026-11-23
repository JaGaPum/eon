// Piezas que comparten las paradas del Tema 3: fichas de colores para los factores y potencias escritas con su
// exponente arriba.
import type { ReactNode } from 'react'
import { motion } from 'motion/react'

/** Número con espacio de miles, como en el libro: 10 000. */
export const conPunto = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

/** Una potencia escrita: base y exponente volado. */
export function Pot({ b, e, color }: { b: ReactNode; e: ReactNode; color?: string }) {
  return (
    <span className="whitespace-nowrap" style={{ color }}>
      {b}
      <sup className="text-[0.6em] font-bold">{e}</sup>
    </span>
  )
}

/** Una ficha redonda con un número o letra: un factor de la multiplicación. */
export function Ficha({ texto, color = '#6366f1', tachada, pequeña }: { texto: string; color?: string; tachada?: boolean; pequeña?: boolean }) {
  return (
    <motion.span
      className={`relative inline-flex items-center justify-center rounded-full font-bold text-white shadow ${pequeña ? 'h-8 min-w-8 px-1 text-sm' : 'h-11 min-w-11 px-1.5 text-lg'}`}
      style={{ background: color, opacity: tachada ? 0.35 : 1 }}
    >
      {texto}
      {tachada && <span className="absolute inset-x-0 top-1/2 h-1 -rotate-45 rounded bg-rose-600" />}
    </motion.span>
  )
}
