// Modo Practicar común: ejercicios de clase y nuevos, con pistas graduales y aviso de dónde está el fallo.
import { useState, type FormEvent, type ReactNode } from 'react'
import type { Progreso } from '../lib/progreso'
import { Aviso, type Mensaje } from './visuales'
import { CampoEntero, leerEntero } from './piezas'

export type Entrada =
  | 'numero'
  /** Elegir una. */
  | { opciones: string[] }
  /** Marcar todas las que valgan. */
  | { multi: string[] }
  /** Tocar las fichas en el orden pedido. */
  | { orden: string[]; sep?: '<' | '>' }

export interface Pregunta {
  /** Único en toda la app: «parada:hoja-número». Vacío en los ejercicios generados. */
  id: string
  /** Lo que se ve en la ficha: «5a». */
  etq: string
  /** Hoja de la que sale, para agrupar las fichas. */
  grupo?: string
  enunciado: ReactNode
  entrada: Entrada
  /** Número, opción, o varias unidas con «|» en el orden de las opciones. */
  correcta: string
  pistas: ReactNode[]
  /** Explicación que se muestra al acertar. */
  acierto?: ReactNode
  /** Diagnóstico de un fallo concreto; si no devuelve nada se usa el genérico. */
  fallo?: (resp: string) => ReactNode | undefined
}

interface Estado {
  serie: 'clase' | 'nuevos'
  i: number
  q: Pregunta
  pista: number
  msg: Mensaje | null
  intentos: number
  hecho: boolean
}

interface Props {
  clase: Pregunta[]
  generar: () => Pregunta
  progreso: Progreso
  apuntar: (id?: string) => void
}

export default function Practica({ clase, generar, progreso, apuntar }: Props) {
  const pendiente = () => Math.max(0, clase.findIndex((q) => !progreso.hechos[q.id]))
  const abrir = (serie: Estado['serie'], i: number): Estado => ({
    serie,
    i,
    q: serie === 'clase' ? clase[i] : generar(),
    pista: 0,
    msg: null,
    intentos: 0,
    hecho: false,
  })

  const [st, setSt] = useState(() => abrir('clase', pendiente()))
  const [resp, setResp] = useState('')
  const [sel, setSel] = useState<string[]>([])
  const { q } = st
  const hechos = clase.filter((x) => progreso.hechos[x.id]).length
  const grupos = [...new Set(clase.map((x) => x.grupo ?? ''))]

  function ir(nuevo: Estado) {
    setSt(nuevo)
    setResp('')
    setSel([])
  }

  const fallo = (texto: ReactNode) => setSt((s) => ({ ...s, msg: { tipo: 'mal', texto }, intentos: s.intentos + 1 }))

  function comprobar(respuesta: string) {
    if (respuesta === q.correcta) {
      setSt((s) => ({ ...s, hecho: true, msg: { tipo: 'bien', texto: q.acierto ?? '¡Correcto!' }, intentos: s.intentos + 1 }))
      apuntar(st.serie === 'clase' ? q.id : undefined)
      return
    }
    const propio = q.fallo?.(respuesta)
    if (propio) return fallo(propio)

    if (typeof q.entrada === 'object' && 'multi' in q.entrada) {
      const buenas = q.correcta ? q.correcta.split('|') : []
      const sobran = sel.filter((x) => !buenas.includes(x))
      const faltan = buenas.filter((x) => !sel.includes(x)).length
      fallo(
        [
          sobran.length ? `${sobran.join(', ')} no ${sobran.length > 1 ? 'valen' : 'vale'}.` : '',
          faltan ? `Te ${faltan > 1 ? 'faltan' : 'falta'} ${faltan} por marcar.` : '',
        ]
          .join(' ')
          .trim(),
      )
    } else if (typeof q.entrada === 'object' && 'orden' in q.entrada) {
      const buenas = q.correcta.split('|')
      const bien = sel.findIndex((x, i) => x !== buenas[i])
      fallo(bien === 0 ? 'El primero no es ese. Imagina dónde está cada uno en la recta.' : bien === 1 ? 'El primero está bien. Revisa a partir de ahí.' : `Los ${bien} primeros están bien. Revisa a partir de ahí.`)
    } else {
      fallo(`No es ${respuesta}. Inténtalo de nuevo o pide una pista.`)
    }
  }

  function enviarNumero(ev: FormEvent) {
    ev.preventDefault()
    const n = leerEntero(resp)
    if (n === null) fallo('Escribe un número entero.')
    else comprobar(String(n))
  }

  const alternar = (x: string) => setSel(sel.includes(x) ? sel.filter((y) => y !== x) : [...sel, x])

  function entrada() {
    const e = q.entrada
    if (e === 'numero') {
      return (
        <form onSubmit={enviarNumero} className="flex flex-wrap items-center gap-2">
          <span className="font-semibold">Respuesta</span>
          <CampoEntero valor={resp} cambiar={setResp} etiqueta="Respuesta" />
          <button className="btn btn-primario">Comprobar</button>
        </form>
      )
    }
    if ('opciones' in e) {
      return (
        <div className="flex flex-wrap gap-2">
          {e.opciones.map((x) => (
            <button key={x} className="btn" onClick={() => comprobar(x)}>
              {x}
            </button>
          ))}
        </div>
      )
    }
    if ('multi' in e) {
      return (
        <div className="space-y-3">
          <p className="text-sm text-slate-500">Marca todas las que valgan. Si no vale ninguna, comprueba sin marcar.</p>
          <div className="flex flex-wrap gap-2">
            {e.multi.map((x) => (
              <button key={x} className={`btn ${sel.includes(x) ? 'btn-primario' : ''}`} aria-pressed={sel.includes(x)} onClick={() => alternar(x)}>
                {x}
              </button>
            ))}
          </div>
          <button className="btn btn-primario" onClick={() => comprobar(e.multi.filter((x) => sel.includes(x)).join('|'))}>
            Comprobar
          </button>
        </div>
      )
    }
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-500">Toca los números en el orden pedido.</p>
        <div className="flex flex-wrap gap-2">
          {e.orden.map((x) => (
            <button key={x} className="btn text-lg" disabled={sel.includes(x)} onClick={() => setSel([...sel, x])}>
              {x}
            </button>
          ))}
        </div>
        <p className="min-h-11 rounded-xl border border-dashed border-slate-300 px-4 py-2 text-xl font-semibold">{sel.join(`  ${e.sep ?? '<'}  `) || '…'}</p>
        <div className="flex gap-2">
          <button className="btn" disabled={!sel.length} onClick={() => setSel(sel.slice(0, -1))}>
            ← Quitar el último
          </button>
          <button className="btn btn-primario" disabled={sel.length < e.orden.length} onClick={() => comprobar(sel.join('|'))}>
            Comprobar
          </button>
        </div>
      </div>
    )
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">Ahora tú</h2>

      <div className="flex flex-wrap gap-2">
        <button className={`btn ${st.serie === 'clase' ? 'btn-activo' : ''}`} onClick={() => ir(abrir('clase', pendiente()))}>
          De clase ({hechos}/{clase.length})
        </button>
        <button className={`btn ${st.serie === 'nuevos' ? 'btn-activo' : ''}`} onClick={() => ir(abrir('nuevos', 0))}>
          Nuevos, sin límite
        </button>
      </div>

      {st.serie === 'clase' &&
        grupos.map((g) => (
          <div key={g} className="flex flex-wrap items-center gap-1.5">
            {g && <span className="mr-1 w-full text-sm font-semibold text-slate-500 sm:w-auto">{g}</span>}
            {clase.map(
              (x, i) =>
                (x.grupo ?? '') === g && (
                  <button
                    key={x.id}
                    onClick={() => ir(abrir('clase', i))}
                    className={`h-10 min-w-11 cursor-pointer rounded-lg border px-2 text-sm font-semibold ${
                      progreso.hechos[x.id] ? 'border-green-300 bg-green-100 text-green-800' : 'border-slate-300 bg-white text-slate-600'
                    } ${i === st.i ? 'ring-2 ring-indigo-500' : ''}`}
                  >
                    {x.etq}
                    {progreso.hechos[x.id] && ' ✓'}
                  </button>
                ),
            )}
          </div>
        ))}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-5 text-lg leading-relaxed">{q.enunciado}</div>

      {!st.hecho && entrada()}

      <Aviso msg={st.msg} clave={st.intentos} />

      {st.hecho ? (
        <div className="flex justify-end">
          <button className="btn btn-primario" onClick={() => ir(abrir(st.serie, (st.i + 1) % clase.length))}>
            {st.serie === 'clase' ? 'Siguiente ejercicio →' : 'Otro ejercicio →'}
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <button className="btn" disabled={st.pista >= q.pistas.length} onClick={() => setSt((s) => ({ ...s, pista: s.pista + 1 }))}>
            Dame una pista ({st.pista}/{q.pistas.length})
          </button>
          {q.pistas.slice(0, st.pista).map((t, i) => (
            <p key={i} className="overflow-x-auto rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-amber-900">
              {t}
            </p>
          ))}
        </div>
      )}
    </section>
  )
}
