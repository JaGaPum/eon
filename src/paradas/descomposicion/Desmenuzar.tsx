import { useMemo, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { descomponer, MAXIMO, type Paso } from '../../lib/mates'
import { EJEMPLOS } from '../../contenido/tema1'
import { Columna, colorPrimo, Resultado } from '../../componentes/visuales'

// Qué se hace en el paso k y por qué. k = 0 es preparar la columna; el último, escribir el resultado.
function Explicacion({ n, pasos, k }: { n: number; pasos: Paso[]; k: number }) {
  if (k === 0) {
    return (
      <>
        <h3 className="text-lg font-bold">Preparar la columna</h3>
        <p>
          Se escribe <b>{n}</b> y se traza una barra vertical a su derecha.
        </p>
        <p>A la izquierda irán los cocientes y a la derecha los primos por los que dividimos.</p>
      </>
    )
  }
  if (k > pasos.length) {
    return (
      <>
        <h3 className="text-lg font-bold">Escribir el resultado</h3>
        <p>El cociente es 1, así que hemos terminado. Los primos de la derecha son los factores.</p>
        <Resultado n={n} primos={pasos.map((s) => s.primo)} />
        <p>Los primos repetidos se agrupan en una potencia.</p>
      </>
    )
  }
  const s = pasos[k - 1]
  return (
    <>
      <h3 className="text-lg font-bold">
        Paso {k}: ¿entre qué primo se divide {s.n}?
      </h3>
      <p>{s.texto}</p>
      {s.cociente > 1 && (
        <p className="text-center text-2xl font-bold">
          {s.n} : <span style={{ color: colorPrimo(s.primo) }}>{s.primo}</span> = {s.cociente}
        </p>
      )}
      <p>
        Se escribe <b>{s.primo}</b> a la derecha y <b>{s.cociente}</b> debajo.
      </p>
      {s.descartes.length > 0 && (
        <details className="rounded-xl bg-slate-100 px-4 py-2">
          <summary className="cursor-pointer font-semibold text-indigo-700">¿Por qué no un primo más pequeño?</summary>
          <ul className="mt-2 space-y-1 text-base">
            {s.descartes.map((d) => (
              <li key={d.primo}>
                <b>{d.primo}:</b> {d.texto}
              </li>
            ))}
          </ul>
        </details>
      )}
    </>
  )
}

export default function Desmenuzar() {
  const [n, setN] = useState(126)
  const [k, setK] = useState(0)
  const [otro, setOtro] = useState('')
  const pasos = useMemo(() => descomponer(n), [n])
  const total = pasos.length + 1

  const filas = pasos.slice(0, Math.min(k, pasos.length))
  const resto = k === 0 ? n : k > pasos.length ? 1 : pasos[k - 1].cociente

  function elegir(nuevo: number) {
    setN(nuevo)
    setK(0)
  }

  function verOtro(ev: FormEvent) {
    ev.preventDefault()
    const nuevo = Number(otro)
    if (Number.isInteger(nuevo) && nuevo >= 2 && nuevo <= MAXIMO) {
      elegir(nuevo)
      setOtro('')
    }
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">Un ejemplo resuelto, paso a paso</h2>

      <div className="flex flex-wrap items-center gap-2">
        {EJEMPLOS.map((e) => (
          <button key={e} className={`btn ${e === n ? 'btn-activo' : ''}`} onClick={() => elegir(e)}>
            {e}
          </button>
        ))}
        <form onSubmit={verOtro} className="flex items-center gap-2">
          <input className="campo" inputMode="numeric" placeholder="otro" aria-label="Otro número" value={otro} onChange={(e) => setOtro(e.target.value)} />
          <button className="btn">Ver</button>
        </form>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="lienzo">
          <Columna key={n} filas={filas} resto={resto} marca={k - 1} />
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${n}-${k}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="space-y-3 text-lg leading-relaxed"
          >
            <Explicacion n={n} pasos={pasos} k={k} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button className="btn" disabled={k === 0} onClick={() => setK(k - 1)}>
          ← Atrás
        </button>
        <div className="flex flex-wrap justify-center gap-2">
          {Array.from({ length: total + 1 }, (_, i) => (
            <button
              key={i}
              aria-label={`Ir al paso ${i}`}
              onClick={() => setK(i)}
              className={`h-4 w-4 cursor-pointer rounded-full transition ${
                i === k ? 'scale-125 bg-indigo-600' : i < k ? 'bg-indigo-300' : 'bg-slate-300'
              }`}
            />
          ))}
        </div>
        <button className="btn btn-primario" disabled={k === total} onClick={() => setK(k + 1)}>
          Siguiente →
        </button>
      </div>
    </section>
  )
}
