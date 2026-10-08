// Modo Practicar común: ejercicios de clase y nuevos, con pistas graduales y aviso de dónde está el fallo.
import { useState, type ReactNode } from 'react'
import type { Progreso } from '../lib/progreso'
import { Aviso, type Mensaje } from './visuales'
import { TextoMat } from './mat'
import { CampoRespuesta, esCorrecta, escribirRespuesta, revisarFracciones, type Pregunta } from './Respuesta'

export type { Entrada, Pregunta } from './Respuesta'

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

/** Qué decir cuando falla y la pregunta no trae un diagnóstico propio. */
function falloGenerico(q: Pregunta, respuesta: string): ReactNode {
  const e = q.entrada
  const dadas = respuesta ? respuesta.split('|') : []
  const buenas = q.correcta ? q.correcta.split('|') : []
  if (typeof e === 'object' && 'multi' in e) {
    const sobran = dadas.filter((x) => !buenas.includes(x))
    const faltan = buenas.filter((x) => !dadas.includes(x)).length
    return [sobran.length ? `${sobran.join(', ')} no ${sobran.length > 1 ? 'valen' : 'vale'}.` : '', faltan ? `Te ${faltan > 1 ? 'faltan' : 'falta'} ${faltan} por marcar.` : '']
      .join(' ')
      .trim()
  }
  if (typeof e === 'object' && 'orden' in e) {
    const bien = dadas.findIndex((x, i) => x !== buenas[i])
    if (bien === 0) return 'El primero no es ese. Imagina dónde está cada uno en la recta.'
    return bien === 1 ? 'El primero está bien. Revisa a partir de ahí.' : `Los ${bien} primeros están bien. Revisa a partir de ahí.`
  }
  if (typeof e === 'object' && 'primos' in e) return 'Esos no son sus factores primos. Comprueba que al multiplicarlos sale el número.'
  if (typeof e === 'object' && ('fraccion' in e || 'fracciones' in e || 'mixto' in e)) {
    const r = revisarFracciones(q, respuesta)
    if (r.valor && !r.forma) {
      if ('fraccion' in e) return 'Vale lo mismo, pero no es irreducible: todavía se puede simplificar.'
      if ('fracciones' in e) return `Son equivalentes, pero el denominador común tiene que ser el m.c.m. de los denominadores: ${q.correcta.split('|')[0].split('/')[1]}.`
      return 'La fracción que acompaña a la parte entera tiene que ser más pequeña que la unidad.'
    }
    if ('fracciones' in e) return 'Alguna de las fracciones no vale lo mismo que la original. Comprueba por cuánto has multiplicado cada una.'
  }
  return (
    <>
      No es <TextoMat s={escribirRespuesta(q, respuesta)} />. Inténtalo de nuevo o pide una pista.
    </>
  )
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
  // Cada ejercicio abierto estrena campo de respuesta, aunque sea el mismo de antes.
  const [abiertos, setAbiertos] = useState(0)
  const { q } = st
  const hechos = clase.filter((x) => progreso.hechos[x.id]).length
  const grupos = [...new Set(clase.map((x) => x.grupo ?? ''))]

  function ir(nuevo: Estado) {
    setSt(nuevo)
    setAbiertos((n) => n + 1)
  }

  function comprobar(respuesta: string) {
    if (esCorrecta(q, respuesta)) {
      setSt((s) => ({ ...s, hecho: true, msg: { tipo: 'bien', texto: q.acierto ?? '¡Correcto!' }, intentos: s.intentos + 1 }))
      apuntar(st.serie === 'clase' ? q.id : undefined)
      return
    }
    const texto: ReactNode = q.fallo?.(respuesta) ?? falloGenerico(q, respuesta)
    setSt((s) => ({ ...s, msg: { tipo: 'mal', texto }, intentos: s.intentos + 1 }))
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

      {!st.hecho && <CampoRespuesta key={abiertos} q={q} responder={comprobar} />}

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
