// Escritura matemática del Tema 2: fracciones una encima de otra y decimales periódicos con su arco.
import type { ReactNode } from 'react'

/** Una fracción como en el cuaderno. Si el denominador es 1 se escribe el entero (salvo con `tal`); el signo va delante. */
export function F({ n, d, color, tal }: { n: number; d: number; color?: string; tal?: boolean }) {
  const neg = n * d < 0
  const a = Math.abs(n)
  const b = Math.abs(d)
  if (b === 1 && !tal)
    return (
      <span className="tabular-nums" style={{ color }}>
        {neg ? '−' : ''}
        {a}
      </span>
    )
  return (
    <span className="inline-flex items-center align-middle" style={{ color }}>
      {neg && <span className="mr-0.5">−</span>}
      <span className="mx-0.5 inline-flex flex-col items-center text-[0.85em] leading-tight tabular-nums">
        <span className="px-0.5">{a}</span>
        <span className="h-0.5 w-full rounded bg-current" />
        <span className="px-0.5">{b}</span>
      </span>
    </span>
  )
}

/** Un decimal periódico: parte entera, anteperíodo y período con el arco del libro. */
export function Per({ ent, ante = '', per, signo = '' }: { ent: string; ante?: string; per: string; signo?: string }) {
  return (
    <span className="whitespace-nowrap tabular-nums">
      {signo}
      {ent},{ante}
      <span className="relative inline-block px-px">
        <svg className="pointer-events-none absolute -top-[0.45em] left-0 h-[0.5em] w-full overflow-visible" viewBox="0 0 10 4" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0.6 3.6 Q5 -1.6 9.4 3.6" fill="none" stroke="currentColor" strokeWidth="1.6" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
        </svg>
        {per}
      </span>
    </span>
  )
}

// «3/4» pasa a fracción y «2,1(6)» a periódico con arco. Lo demás se deja como está.
const PATRON = /(\d+\/\d+)|(\d+),(\d*)\((\d+)\)/g

/** Un texto con fracciones y periódicos escritos en línea, puesto bonito. */
export function TextoMat({ s }: { s: string }) {
  const partes: ReactNode[] = []
  let ultimo = 0
  for (const m of s.matchAll(PATRON)) {
    if (m.index! > ultimo) partes.push(s.slice(ultimo, m.index))
    if (m[1]) {
      const [n, d] = m[1].split('/').map(Number)
      partes.push(<F key={m.index} n={n} d={d} tal />)
    } else partes.push(<Per key={m.index} ent={m[2]} ante={m[3]} per={m[4]} />)
    ultimo = m.index! + m[0].length
  }
  if (ultimo < s.length) partes.push(s.slice(ultimo))
  return <>{partes}</>
}
