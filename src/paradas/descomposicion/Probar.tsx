import { useState, type FormEvent } from 'react'
import { esPrimo, factores, MAXIMO, porque } from '../../lib/mates'
import { Arbol, Aviso, colorPrimo, Columna, Fichas, Resultado, type Fila, type Mensaje } from '../../componentes/visuales'

const BOTONES = [2, 3, 5, 7, 11, 13]

export default function Probar() {
  const [n, setN] = useState(126)
  const [filas, setFilas] = useState<Fila[]>([])
  const [msg, setMsg] = useState<Mensaje | null>(null)
  const [intentos, setIntentos] = useState(0)
  const [escrito, setEscrito] = useState('126')
  const [otro, setOtro] = useState('')

  const primos = filas.map((f) => f.primo)
  const m = primos.reduce((resto, p) => resto / p, n)

  function avisar(tipo: Mensaje['tipo'], texto: string) {
    setMsg({ tipo, texto })
    setIntentos((i) => i + 1)
  }

  function empezar(ev: FormEvent) {
    ev.preventDefault()
    const nuevo = Number(escrito)
    if (!Number.isInteger(nuevo) || nuevo < 2 || nuevo > MAXIMO) {
      avisar('mal', `Escribe un número entero entre 2 y ${MAXIMO}.`)
      return
    }
    setN(nuevo)
    setFilas([])
    setMsg(null)
  }

  function dividir(p: number) {
    if (!Number.isInteger(p) || p < 2) {
      avisar('mal', 'Escribe un número primo: 2, 3, 5, 7, 11…')
    } else if (!esPrimo(p)) {
      avisar('mal', `${p} no es primo (${p} = ${factores(p).join(' · ')}). En la columna solo se divide entre primos.`)
    } else {
      const r = porque(m, p)
      if (r.divide) {
        setFilas([...filas, { n: m, primo: p }])
        avisar('bien', m === p ? r.texto : `${r.texto} ${m} : ${p} = ${m / p}.`)
      } else {
        avisar('mal', r.texto)
      }
    }
  }

  function deshacer() {
    setFilas(filas.slice(0, -1))
    setMsg(null)
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">Rompe tú el número</h2>

      <form onSubmit={empezar} className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 font-semibold">
          Número
          <input className="campo w-28" inputMode="numeric" value={escrito} onChange={(e) => setEscrito(e.target.value)} />
        </label>
        <button className="btn">Empezar</button>
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="lienzo">
          <Columna filas={filas} resto={m} />
        </div>
        <div className="lienzo">
          <Arbol filas={filas} resto={m} />
        </div>
      </div>

      <div className="lienzo min-h-0">
        <Fichas primos={primos} />
      </div>

      {m > 1 ? (
        <>
          <p className="text-lg">
            ¿Entre qué primo divides <b>{m}</b>?
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {BOTONES.map((p) => (
              <button
                key={p}
                className="btn w-14 text-lg text-white hover:brightness-110"
                style={{ background: colorPrimo(p), borderColor: colorPrimo(p) }}
                onClick={() => dividir(p)}
              >
                {p}
              </button>
            ))}
            <form
              className="flex items-center gap-2"
              onSubmit={(ev) => {
                ev.preventDefault()
                dividir(Number(otro))
                setOtro('')
              }}
            >
              <input className="campo" inputMode="numeric" placeholder="otro" aria-label="Otro primo" value={otro} onChange={(e) => setOtro(e.target.value)} />
              <button className="btn">Dividir</button>
            </form>
          </div>
        </>
      ) : (
        <>
          <p className="text-lg">El cociente es 1: has terminado.</p>
          <Resultado n={n} primos={primos} />
        </>
      )}

      <Aviso msg={msg} clave={intentos} />

      <button className="btn" disabled={filas.length === 0} onClick={deshacer}>
        ← Deshacer
      </button>
    </section>
  )
}
