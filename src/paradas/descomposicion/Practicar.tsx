import { useState, type FormEvent, type ReactNode } from 'react'
import { agrupar, divisores, esPrimo, factores, paso, porque, valor } from '../../lib/mates'
import { CLASE, type Ejercicio } from '../../contenido/tema1'
import type { Progreso } from '../../lib/progreso'
import { Aviso, Columna, Potencias, Resultado, type Fila, type Mensaje } from '../../componentes/visuales'

type Serie = 'clase' | 'nuevos'

interface Estado {
  serie: Serie
  /** Posición en CLASE; no se usa en la serie de nuevos. */
  i: number
  e: Ejercicio
  filas: Fila[]
  pista: number
  msg: Mensaje | null
  intentos: number
  hecho: boolean
}

const azar = <T,>(lista: T[]) => lista[Math.floor(Math.random() * lista.length)]

/** Ejercicio nuevo del mismo tipo que los de clase, con otros números. */
function generar(): Ejercicio {
  const tipo = azar(['descomponer', 'descomponer', 'valor', 'divisores'] as const)
  const tope = tipo === 'divisores' ? 400 : 3000
  let primos: number[]
  let n: number
  do {
    const cuantos = 3 + Math.floor(Math.random() * 3)
    primos = Array.from({ length: cuantos }, () => azar([2, 2, 2, 3, 3, 3, 5, 5, 7, 7, 11, 13]))
    n = primos.reduce((a, b) => a * b, 1)
  } while (n > tope)
  return tipo === 'valor' ? { id: '', tipo, f: agrupar(primos) } : { id: '', tipo, n }
}

function abrir(serie: Serie, i: number): Estado {
  return { serie, i, e: serie === 'clase' ? CLASE[i] : generar(), filas: [], pista: 0, msg: null, intentos: 0, hecho: false }
}

function primeroPendiente(progreso: Progreso): number {
  const i = CLASE.findIndex((e) => !progreso.hechos[e.id])
  return i < 0 ? 0 : i
}

/** Tres pistas, de menos a más ayuda. La última casi da el paso hecho. */
function pistas(e: Ejercicio, m: number): ReactNode[] {
  if (e.tipo === 'descomponer') {
    const s = paso(m)
    return [
      `Prueba los primos en orden: 2, 3, 5, 7, 11… y usa los criterios de divisibilidad con ${m}.`,
      s.texto,
      `${s.n} : ${s.primo} = ${s.cociente}`,
    ]
  }
  if (e.tipo === 'valor') {
    return [
      'Calcula primero cada potencia por separado.',
      <>
        {e.f.map(([p, exp], i) => (
          <span key={p}>
            {i > 0 && ' | '}
            {exp > 1 ? (
              <>
                {p}
                <sup>{exp}</sup> = {Array(exp).fill(p).join(' · ')} = {p ** exp}
              </>
            ) : (
              p
            )}
          </span>
        ))}
      </>,
      `Ahora multiplica: ${e.f.map(([p, exp]) => p ** exp).join(' · ')}`,
    ]
  }
  const potencias = agrupar(factores(e.n))
  return [
    `Primero descompón ${e.n} en factores primos.`,
    <>
      {e.n} = <Potencias potencias={potencias} />
    </>,
    `Suma 1 a cada exponente y multiplica los resultados: ${potencias.map(([, exp]) => `(${exp} + 1)`).join(' · ')}`,
  ]
}

interface Props {
  progreso: Progreso
  apuntar: (id?: string) => void
}

export default function Practicar({ progreso, apuntar }: Props) {
  const [st, setSt] = useState(() => abrir('clase', primeroPendiente(progreso)))
  const [primo, setPrimo] = useState('')
  const [cociente, setCociente] = useState('')
  const [resp, setResp] = useState('')

  const { e } = st
  const m = e.tipo === 'descomponer' ? st.filas.reduce((resto, f) => resto / f.primo, e.n) : 0
  const hechosClase = CLASE.filter((x) => progreso.hechos[x.id]).length
  const lista = pistas(e, m)
  const etiqueta = st.serie === 'clase' ? `Ejercicio ${e.id}. ` : ''

  function ir(nuevo: Estado) {
    setSt(nuevo)
    setPrimo('')
    setCociente('')
    setResp('')
  }

  const fallo = (texto: ReactNode) => setSt((s) => ({ ...s, msg: { tipo: 'mal', texto }, intentos: s.intentos + 1 }))

  function terminar(texto: ReactNode, filas = st.filas) {
    setSt((s) => ({ ...s, filas, hecho: true, msg: { tipo: 'bien', texto }, intentos: s.intentos + 1 }))
    apuntar(st.serie === 'clase' ? e.id : undefined)
  }

  function comprobarFila(ev: FormEvent) {
    ev.preventDefault()
    const p = Number(primo)
    const q = Number(cociente)
    if (primo === '' || cociente === '' || !Number.isInteger(p) || !Number.isInteger(q) || p < 2) {
      fallo('Rellena los dos huecos: el primo por el que divides y el cociente.')
    } else if (!esPrimo(p)) {
      fallo(`${p} no es primo (${p} = ${factores(p).join(' · ')}). En la columna solo se divide entre primos.`)
    } else if (m % p !== 0) {
      fallo(`El fallo está en el primo elegido. ${porque(m, p).texto}`)
    } else if (q !== m / p) {
      fallo(`El primo está bien: ${p} divide a ${m}. El fallo está en la división: ${m} : ${p} no es ${q}. Repásala.`)
    } else {
      const filas = [...st.filas, { n: m, primo: p }]
      setPrimo('')
      setCociente('')
      if (q === 1) {
        terminar('¡Conseguido! El cociente es 1, así que la descomposición está completa.', filas)
      } else {
        const menor = paso(m).primo
        const orden = menor < p ? ` Vale así, aunque es más ordenado empezar por el primo más pequeño (${menor}).` : ''
        setSt((s) => ({ ...s, filas, pista: 0, msg: { tipo: 'bien', texto: `Bien: ${m} : ${p} = ${q}.${orden}` }, intentos: s.intentos + 1 }))
      }
    }
  }

  function comprobarRespuesta(ev: FormEvent) {
    ev.preventDefault()
    const r = Number(resp)
    if (resp.trim() === '' || Number.isNaN(r)) {
      fallo('Escribe un número.')
    } else if (e.tipo === 'valor') {
      // El error típico: leer 2³ como 2 · 3.
      const confundido = e.f.reduce((t, [p, exp]) => t * (exp > 1 ? p * exp : p), 1)
      const conExponente = e.f.find(([, exp]) => exp > 1)
      if (r === valor(e.f)) {
        terminar(
          <>
            ¡Correcto! <Potencias potencias={e.f} /> = {r}.
          </>,
        )
      } else if (r === confundido && conExponente) {
        const [p, exp] = conExponente
        fallo(
          <>
            Creo que has multiplicado la base por el exponente. {p}
            <sup>{exp}</sup> no es {p} · {exp}: es el {p} multiplicado por sí mismo {exp} veces.
          </>,
        )
      } else {
        fallo(`No es ${r}. Calcula cada potencia por separado y luego multiplica.`)
      }
    } else if (e.tipo === 'divisores') {
      const d = divisores(e.n)
      const potencias = agrupar(factores(e.n))
      if (r === d.length) {
        terminar(
          <>
            ¡Correcto! {e.n} = <Potencias potencias={potencias} />, y tiene {d.length} divisores: {d.join(', ')}.
          </>,
        )
      } else if (r === potencias.length) {
        fallo('Has contado solo los factores primos distintos. También son divisores el 1, el propio número y los productos de esos primos entre sí.')
      } else {
        fallo(`No son ${r}. Descompón el número, suma 1 a cada exponente y multiplica.`)
      }
    }
  }

  const respuesta = !st.hecho && (
    <form onSubmit={comprobarRespuesta} className="flex flex-wrap items-center gap-2">
      <label className="flex items-center gap-2 font-semibold">
        Respuesta
        <input className="campo w-28" inputMode="numeric" value={resp} onChange={(ev) => setResp(ev.target.value)} />
      </label>
      <button className="btn btn-primario">Comprobar</button>
    </form>
  )

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">Ahora tú</h2>

      <div className="flex flex-wrap gap-2">
        <button className={`btn ${st.serie === 'clase' ? 'btn-activo' : ''}`} onClick={() => ir(abrir('clase', primeroPendiente(progreso)))}>
          De clase ({hechosClase}/{CLASE.length})
        </button>
        <button className={`btn ${st.serie === 'nuevos' ? 'btn-activo' : ''}`} onClick={() => ir(abrir('nuevos', 0))}>
          Nuevos ({progreso.nuevos} hechos)
        </button>
      </div>

      {st.serie === 'clase' && (
        <div className="flex flex-wrap gap-1.5">
          {CLASE.map((x, i) => (
            <button
              key={x.id}
              onClick={() => ir(abrir('clase', i))}
              className={`h-10 min-w-12 cursor-pointer rounded-lg border px-2 text-sm font-semibold ${
                progreso.hechos[x.id] ? 'border-green-300 bg-green-100 text-green-800' : 'border-slate-300 bg-white text-slate-600'
              } ${i === st.i ? 'ring-2 ring-indigo-500' : ''}`}
            >
              {x.id}
              {progreso.hechos[x.id] && ' ✓'}
            </button>
          ))}
        </div>
      )}

      {e.tipo === 'descomponer' && (
        <>
          <p className="text-lg">
            {etiqueta}Descompón en factores primos: <b>{e.n}</b>
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="lienzo">
              <Columna key={`${st.serie}-${st.i}-${e.n}`} filas={st.filas} resto={m} />
            </div>
            <div className="flex flex-col justify-center gap-3">
              {st.hecho ? (
                <Resultado n={e.n} primos={st.filas.map((f) => f.primo)} />
              ) : (
                <form onSubmit={comprobarFila} className="space-y-3">
                  <p className="font-semibold">Siguiente fila de la columna:</p>
                  <div className="flex flex-wrap items-center gap-2 text-2xl font-bold">
                    {m} :
                    <input className="campo" inputMode="numeric" aria-label="Primo" placeholder="primo" value={primo} onChange={(ev) => setPrimo(ev.target.value)} />
                    =
                    <input className="campo" inputMode="numeric" aria-label="Cociente" placeholder="cociente" value={cociente} onChange={(ev) => setCociente(ev.target.value)} />
                  </div>
                  <button className="btn btn-primario">Comprobar</button>
                </form>
              )}
            </div>
          </div>
        </>
      )}

      {e.tipo === 'valor' && (
        <>
          <p className="text-lg">{etiqueta}¿Qué número tiene esta descomposición?</p>
          <p className="text-center text-3xl font-bold">
            <Potencias potencias={e.f} />
          </p>
          {respuesta}
        </>
      )}

      {e.tipo === 'divisores' && (
        <>
          <p className="text-lg">
            {etiqueta}¿Cuántos divisores tiene <b>{e.n}</b>?
          </p>
          {respuesta}
        </>
      )}

      <Aviso msg={st.msg} clave={st.intentos} />

      {st.hecho ? (
        <div className="flex justify-end">
          <button className="btn btn-primario" onClick={() => ir(abrir(st.serie, (st.i + 1) % CLASE.length))}>
            {st.serie === 'clase' ? 'Siguiente ejercicio →' : 'Otro ejercicio →'}
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <button className="btn" disabled={st.pista >= lista.length} onClick={() => setSt((s) => ({ ...s, pista: s.pista + 1 }))}>
            Dame una pista ({st.pista}/{lista.length})
          </button>
          {lista.slice(0, st.pista).map((texto, i) => (
            <p key={i} className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-amber-900">
              {texto}
            </p>
          ))}
        </div>
      )}
    </section>
  )
}
