// Una pregunta y el campo con el que se responde. Lo comparten el modo Practicar y las pruebas.
import { useState, type FormEvent, type ReactNode } from 'react'
import { esPrimo } from '../lib/mates'
import { CampoEntero, ent, leerEntero } from './piezas'
import { colorPrimo } from './visuales'

export type Entrada =
  | 'numero'
  /** Elegir una. */
  | { opciones: string[] }
  /** Marcar todas las que valgan. */
  | { multi: string[] }
  /** Tocar las fichas en el orden pedido. */
  | { orden: string[]; sep?: '<' | '>' }
  /** Dar los factores primos de un número. */
  | { primos: true }

export interface Pregunta {
  /** Único en toda la app: «parada:hoja-número». Vacío en los ejercicios generados. */
  id: string
  /** Lo que se ve en la ficha: «5a». */
  etq: string
  /** Hoja de la que sale, para agrupar las fichas. */
  grupo?: string
  enunciado: ReactNode
  entrada: Entrada
  /** Número, opción, o varias unidas con «|» (en el orden de las opciones, o de menor a mayor los primos). */
  correcta: string
  pistas: ReactNode[]
  /** Explicación que se muestra al acertar. */
  acierto?: ReactNode
  /** Diagnóstico de un fallo concreto; si no devuelve nada se usa el genérico. */
  fallo?: (resp: string) => ReactNode | undefined
}

/** Una respuesta (la suya o la correcta) escrita para leerla. */
export function escribirRespuesta(q: Pregunta, resp: string): string {
  const e = q.entrada
  if (e === 'numero') return ent(Number(resp))
  if ('opciones' in e) return resp
  const partes = resp ? resp.split('|') : []
  if ('multi' in e) return partes.length ? partes.join(', ') : 'ninguna'
  if ('orden' in e) return partes.join(`  ${e.sep ?? '<'}  `)
  return partes.join(' · ')
}

const BOTONES_PRIMOS = [2, 3, 5, 7, 11, 13]

/** El campo adecuado a cada tipo de pregunta. Avisa con la respuesta ya normalizada. */
export function CampoRespuesta({ q, responder, boton = 'Comprobar' }: { q: Pregunta; responder: (resp: string) => void; boton?: string }) {
  const [texto, setTexto] = useState('')
  const [sel, setSel] = useState<string[]>([])
  const [otro, setOtro] = useState('')
  const [error, setError] = useState('')
  const e = q.entrada
  const aviso = error && <p className="text-red-700">{error}</p>

  if (e === 'numero') {
    const enviar = (ev: FormEvent) => {
      ev.preventDefault()
      const n = leerEntero(texto)
      if (n === null) setError('Escribe un número entero.')
      else responder(String(n))
    }
    return (
      <form onSubmit={enviar} className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold">Respuesta</span>
          <CampoEntero valor={texto} cambiar={setTexto} etiqueta="Respuesta" />
          <button className="btn btn-primario">{boton}</button>
        </div>
        {aviso}
      </form>
    )
  }

  if ('opciones' in e) {
    return (
      <div className="flex flex-wrap gap-2">
        {e.opciones.map((x) => (
          <button key={x} className="btn" onClick={() => responder(x)}>
            {x}
          </button>
        ))}
      </div>
    )
  }

  if ('multi' in e) {
    const alternar = (x: string) => setSel(sel.includes(x) ? sel.filter((y) => y !== x) : [...sel, x])
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-500">Marca todas las que valgan. Si no vale ninguna, déjalo sin marcar.</p>
        <div className="flex flex-wrap gap-2">
          {e.multi.map((x) => (
            <button key={x} className={`btn ${sel.includes(x) ? 'btn-primario' : ''}`} aria-pressed={sel.includes(x)} onClick={() => alternar(x)}>
              {x}
            </button>
          ))}
        </div>
        <button className="btn btn-primario" onClick={() => responder(e.multi.filter((x) => sel.includes(x)).join('|'))}>
          {boton}
        </button>
      </div>
    )
  }

  if ('orden' in e) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-500">Toca los números en el orden pedido.</p>
        <div className="flex flex-wrap gap-2">
          {e.orden.map((x) => (
            <button key={x} className="btn text-lg" disabled={sel.includes(x)} onClick={() => setSel((s) => (s.includes(x) ? s : [...s, x]))}>
              {x}
            </button>
          ))}
        </div>
        <p className="min-h-11 rounded-xl border border-dashed border-slate-300 px-4 py-2 text-xl font-semibold">{sel.join(`  ${e.sep ?? '<'}  `) || '…'}</p>
        <div className="flex gap-2">
          <button className="btn" disabled={!sel.length} onClick={() => setSel(sel.slice(0, -1))}>
            ← Quitar el último
          </button>
          <button className="btn btn-primario" disabled={sel.length < e.orden.length} onClick={() => responder(sel.join('|'))}>
            {boton}
          </button>
        </div>
      </div>
    )
  }

  // Factores primos: se van añadiendo uno a uno, repetidos si hace falta.
  const anadir = (p: number) => {
    if (!Number.isInteger(p) || !esPrimo(p)) return setError(`${Number.isInteger(p) && p > 1 ? p : 'Eso'} no es un número primo.`)
    setError('')
    setSel((s) => [...s, String(p)])
  }
  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-500">Toca los factores primos uno a uno. Si un primo se repite, tócalo varias veces.</p>
      <div className="flex flex-wrap items-center gap-2">
        {BOTONES_PRIMOS.map((p) => (
          <button key={p} className="btn w-14 text-lg text-white hover:brightness-110" style={{ background: colorPrimo(p), borderColor: colorPrimo(p) }} onClick={() => anadir(p)}>
            {p}
          </button>
        ))}
        <form
          className="flex items-center gap-2"
          onSubmit={(ev) => {
            ev.preventDefault()
            anadir(Number(otro))
            setOtro('')
          }}
        >
          <input className="campo" inputMode="numeric" placeholder="otro" aria-label="Otro primo" value={otro} onChange={(ev) => setOtro(ev.target.value)} />
          <button className="btn">Añadir</button>
        </form>
      </div>
      <p className="min-h-11 rounded-xl border border-dashed border-slate-300 px-4 py-2 text-xl font-semibold">{sel.join(' · ') || '…'}</p>
      {aviso}
      <div className="flex gap-2">
        <button className="btn" disabled={!sel.length} onClick={() => setSel(sel.slice(0, -1))}>
          ← Quitar el último
        </button>
        <button
          className="btn btn-primario"
          disabled={!sel.length}
          onClick={() =>
            responder(
              [...sel]
                .map(Number)
                .sort((a, b) => a - b)
                .join('|'),
            )
          }
        >
          {boton}
        </button>
      </div>
    </div>
  )
}
