import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CRITERIOS, criterio, MAXIMO } from '../lib/mates'
import Parada, { PasoAPaso, Tarjetas, type PropsParada, type Tarjeta } from '../componentes/Parada'
import Practica from '../componentes/Practica'
import { nuevaReglas, REGLAS } from '../contenido/preguntas'

const REGLA: Record<number, string> = {
  2: 'Termina en cifra par.',
  3: 'La suma de sus cifras es múltiplo de 3.',
  4: 'Sus dos últimas cifras son 00 o forman un múltiplo de 4.',
  5: 'Acaba en 0 o en 5.',
  9: 'La suma de sus cifras es múltiplo de 9.',
  10: 'Acaba en 0.',
  11: 'Suma de las cifras en posiciones impares menos suma de las de posiciones pares: da 0 o un múltiplo de 11.',
  25: 'Sus dos últimas cifras son 00 o forman un múltiplo de 25.',
  100: 'Sus dos últimas cifras son 00.',
}

/** Cifras en las que se fija el criterio: 'a' y 'b' distinguen posiciones impares y pares para el 11. */
function cifrasClave(n: number, d: number): ('a' | 'b' | '')[] {
  const c = String(n).split('')
  return c.map((_, i) => {
    const desdeElFinal = c.length - 1 - i
    if (d === 2 || d === 5 || d === 10) return desdeElFinal === 0 ? 'a' : ''
    if (d === 4 || d === 25 || d === 100) return desdeElFinal < 2 ? 'a' : ''
    if (d === 11) return i % 2 === 0 ? 'a' : 'b'
    return 'a'
  })
}

function Cifras({ n, d }: { n: number; d: number }) {
  const clave = cifrasClave(n, d)
  return (
    <div className="flex gap-1.5">
      {String(n)
        .split('')
        .map((c, i) => (
          <motion.span
            key={`${d}-${i}`}
            initial={{ y: -6 }}
            animate={{ y: 0 }}
            className={`flex h-14 w-11 items-center justify-center rounded-xl text-3xl font-bold ${
              clave[i] === 'a' ? 'bg-indigo-600 text-white' : clave[i] === 'b' ? 'bg-amber-400 text-slate-900' : 'bg-slate-100 text-slate-400'
            }`}
          >
            {c}
          </motion.span>
        ))}
    </div>
  )
}

// Toca un divisor y se iluminan sus múltiplos: se ven los patrones que hay detrás de cada criterio.
function Multiplos() {
  const [k, setK] = useState(3)
  return (
    <>
      <div className="flex flex-wrap justify-center gap-1.5">
        {[2, 3, 4, 5, 9, 10, 11, 25].map((d) => (
          <button key={d} className={`btn min-h-9 px-3 ${d === k ? 'btn-primario' : ''}`} onClick={() => setK(d)}>
            {d}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-10 gap-1">
        {Array.from({ length: 100 }, (_, i) => i + 1).map((n) => (
          <span key={n} className={`flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold ${n % k === 0 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
            {n}
          </span>
        ))}
      </div>
      <p className="nota">Múltiplos de {k} hasta el 100.</p>
    </>
  )
}

const TARJETAS: Tarjeta[] = [
  {
    titulo: 'Múltiplos y divisores',
    texto: (
      <>
        <p>
          Un número es <b>múltiplo</b> de otro si sale de multiplicarlo por algún número natural: 24 es múltiplo de 3 porque 3 · 8 = 24.
        </p>
        <p>
          Un número es <b>divisor</b> de otro si lo divide de forma exacta: 3 es divisor de 24 porque 24 : 3 = 8 y no sobra nada.
        </p>
        <p>Son la misma relación vista desde los dos lados. Toca un número y mira el dibujo que forman sus múltiplos.</p>
      </>
    ),
    visual: <Multiplos />,
  },
  {
    titulo: 'Los criterios: fijarse en las cifras',
    texto: (
      <>
        <p>Los criterios de divisibilidad dicen si un número es divisible por otro sin hacer la división. Casi todos miran solo una parte del número:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <b>2, 5 y 10</b>: la última cifra.
          </li>
          <li>
            <b>4, 25 y 100</b>: las dos últimas cifras.
          </li>
          <li>
            <b>3 y 9</b>: la suma de todas las cifras.
          </li>
        </ul>
      </>
    ),
    visual: (
      <table className="text-left text-sm">
        <tbody>
          {CRITERIOS.map((d) => (
            <tr key={d} className="border-b border-slate-100 last:border-0">
              <th className="py-1.5 pr-3 text-lg text-indigo-700">{d}</th>
              <td className="py-1.5">{REGLA[d]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ),
  },
  {
    titulo: 'El del 11, despacio',
    texto: (
      <>
        <ol className="list-decimal space-y-1 pl-5">
          <li>Se suman las cifras que ocupan posiciones impares (1.ª, 3.ª…).</li>
          <li>Se suman las que ocupan posiciones pares (2.ª, 4.ª…).</li>
          <li>Se restan los dos resultados.</li>
          <li>Si da 0 o un múltiplo de 11, el número es divisible por 11.</li>
        </ol>
        <p>{criterio(4554, 11).texto}</p>
      </>
    ),
    visual: (
      <>
        <Cifras n={4554} d={11} />
        <p className="nota">Azul: posiciones impares. Amarillo: posiciones pares.</p>
      </>
    ),
  },
]

function useNumero(inicial: number, escritoInicial = String(inicial)) {
  const [n, setN] = useState(inicial)
  const [escrito, setEscrito] = useState(escritoInicial)
  const [error, setError] = useState(false)
  function enviar(ev: FormEvent, alCambiar: () => void) {
    ev.preventDefault()
    const nuevo = Number(escrito)
    const vale = Number.isInteger(nuevo) && nuevo >= 2 && nuevo <= MAXIMO
    setError(!vale)
    if (vale) {
      setN(nuevo)
      alCambiar()
    }
  }
  return { n, setN, escrito, setEscrito, error, enviar }
}

// Primero opina él (sí o no) y después se le enseña el criterio aplicado.
function Probar() {
  const num = useNumero(4510)
  const [dicho, setDicho] = useState<Record<number, boolean>>({})
  const aciertos = CRITERIOS.filter((d) => d in dicho && dicho[d] === (num.n % d === 0)).length

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">¿Es divisible? Opina tú primero</h2>
      <form onSubmit={(ev) => num.enviar(ev, () => setDicho({}))} className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 font-semibold">
          Número
          <input className="campo w-28" inputMode="numeric" value={num.escrito} onChange={(e) => num.setEscrito(e.target.value)} />
        </label>
        <button className="btn">Cambiar</button>
        {num.error && <span className="text-red-700">Escribe un entero entre 2 y {MAXIMO}.</span>}
      </form>

      <div className="space-y-2">
        {CRITERIOS.map((d) => {
          const r = criterio(num.n, d)
          const respondido = d in dicho
          const acierto = respondido && dicho[d] === r.divide
          return (
            <div key={d} className="rounded-2xl border border-slate-200 bg-white p-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-lg">
                  ¿<b>{num.n}</b> es divisible por <b className="text-indigo-700">{d}</b>?
                </span>
                {respondido ? (
                  <span className={`font-bold ${acierto ? 'text-green-700' : 'text-red-700'}`}>
                    {acierto ? '✓ Bien' : '✗ No'}: {r.divide ? 'sí lo es' : 'no lo es'}
                  </span>
                ) : (
                  <span className="flex gap-2">
                    <button className="btn min-h-9" onClick={() => setDicho({ ...dicho, [d]: true })}>
                      Sí
                    </button>
                    <button className="btn min-h-9" onClick={() => setDicho({ ...dicho, [d]: false })}>
                      No
                    </button>
                  </span>
                )}
              </div>
              <AnimatePresence>
                {respondido && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
                    <div className="mt-3 flex flex-wrap items-center gap-4">
                      <Cifras n={num.n} d={d} />
                      <p className="min-w-52 flex-1">{r.texto}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-between">
        <p className="font-semibold">
          {Object.keys(dicho).length === CRITERIOS.length ? `Has acertado ${aciertos} de ${CRITERIOS.length}.` : 'Responde a los nueve.'}
        </p>
        <button className="btn" onClick={() => setDicho({})}>
          Borrar mis respuestas
        </button>
      </div>
    </section>
  )
}

const EJEMPLOS = [48, 75, 319, 4510, 7392]

function Desmenuzar() {
  const num = useNumero(48, '')
  const [k, setK] = useState(0)
  const d = CRITERIOS[k]
  const r = criterio(num.n, d)

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">Un número, criterio a criterio</h2>
      <div className="flex flex-wrap items-center gap-2">
        {EJEMPLOS.map((e) => (
          <button
            key={e}
            className={`btn ${e === num.n ? 'btn-activo' : ''}`}
            onClick={() => {
              num.setN(e)
              setK(0)
            }}
          >
            {e}
          </button>
        ))}
        <form onSubmit={(ev) => num.enviar(ev, () => setK(0))} className="flex items-center gap-2">
          <input className="campo" inputMode="numeric" placeholder="otro" aria-label="Otro número" value={num.escrito} onChange={(e) => num.setEscrito(e.target.value)} />
          <button className="btn">Ver</button>
        </form>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="lienzo">
          <Cifras n={num.n} d={d} />
          <p className="nota">En color, las cifras en las que se fija el criterio del {d}.</p>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={`${num.n}-${d}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="space-y-3 text-lg leading-relaxed">
            <h3 className="font-bold">
              ¿{num.n} es divisible por {d}?
            </h3>
            <p>
              <b>Criterio del {d}:</b> {REGLA[d]}
            </p>
            <p>{r.texto}</p>
            <p className={`text-xl font-bold ${r.divide ? 'text-green-700' : 'text-red-700'}`}>{r.divide ? `Sí: ${num.n} : ${d} = ${num.n / d}` : 'No es divisible.'}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <PasoAPaso k={k} total={CRITERIOS.length - 1} setK={setK} />
    </section>
  )
}

export default function Reglas({ modo, progreso, apuntar }: PropsParada) {
  return (
    <Parada
      id="reglas"
      titulo="Reglas de divisibilidad"
      modo={modo}
      paneles={{
        entender: <Tarjetas tarjetas={TARJETAS} parada="reglas" />,
        probar: <Probar />,
        desmenuzar: <Desmenuzar />,
        practicar: <Practica clase={REGLAS} generar={nuevaReglas} progreso={progreso} apuntar={apuntar} />,
      }}
    />
  )
}
