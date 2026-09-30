// Modos Probar y Desmenuzar para operaciones con enteros. Los comparten sumas, productos y combinadas.
import { useMemo, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { analizar, aplicar, escribir, motivo, resolver, siguiente, trozos, type Nodo, type Resuelta } from '../lib/expresion'
import { Aviso, type Mensaje } from './visuales'
import { Expr } from './piezas'
import { PasoAPaso } from './Parada'

function intentar<T>(f: () => T): { ok: T } | { error: string } {
  try {
    return { ok: f() }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'La operación no está bien escrita.' }
  }
}

function Selector({ ejemplos, actual, elegir }: { ejemplos: string[]; actual: string; elegir: (s: string) => string | null }) {
  const [otro, setOtro] = useState('')
  const [error, setError] = useState<string | null>(null)

  function enviar(ev: FormEvent) {
    ev.preventDefault()
    const e = elegir(otro)
    setError(e)
    if (!e) setOtro('')
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {ejemplos.map((e, i) => (
          <button
            key={e}
            className={`btn ${e === actual ? 'btn-activo' : ''}`}
            onClick={() => {
              setError(null)
              elegir(e)
            }}
          >
            Ejemplo {i + 1}
          </button>
        ))}
      </div>
      <form onSubmit={enviar} className="flex flex-wrap items-center gap-2">
        <input
          className="campo w-full max-w-md text-left"
          placeholder="O escribe la tuya: 3 - 2*(5 - 8) : 3"
          aria-label="Tu operación"
          value={otro}
          onChange={(e) => setOtro(e.target.value)}
        />
        <button className="btn">Usar</button>
      </form>
      <p className="text-sm text-slate-500">Para multiplicar vale · o *, y para dividir : o /. Valen paréntesis, corchetes y llaves.</p>
      {error && <p className="text-red-700">{error}</p>}
    </div>
  )
}

/** Paso a paso en formato cuaderno: cada línea es la operación un poco más resuelta. */
export function DesmenuzaExpr({ ejemplos, modo }: { ejemplos: string[]; modo?: 'quitar' }) {
  const [entrada, setEntrada] = useState(ejemplos[0])
  const [k, setK] = useState(0)
  const r = useMemo(() => resolver(entrada, modo), [entrada, modo])
  const total = r.pasos.length
  const paso = k > 0 ? r.pasos[k - 1] : null

  function elegir(s: string): string | null {
    const res = intentar(() => resolver(s, modo))
    if ('error' in res) return res.error
    setEntrada(s)
    setK(0)
    return null
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">Una operación resuelta, paso a paso</h2>
      <Selector ejemplos={ejemplos} actual={entrada} elegir={elegir} />

      <div className="lienzo items-start justify-start">
        <Linea r={r} k={0} actual={k} />
        {r.pasos.slice(0, k).map((_, i) => (
          <Linea key={i} r={r} k={i + 1} actual={k} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${entrada}-${k}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="min-h-24 space-y-1 text-lg leading-relaxed"
        >
          {k === 0 ? (
            <p>Esta es la operación. Pulsa «Siguiente» para ver qué se hace primero y por qué.</p>
          ) : (
            <>
              <h3 className="font-bold">
                Paso {k} de {total}
              </h3>
              {paso!.porque && <p>{paso!.porque}</p>}
              <p className="font-semibold">{paso!.cuenta}</p>
              {k === total && (
                <p>
                  Ya no queda nada por operar. El resultado es <b>{paso!.despues}</b>.
                </p>
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <PasoAPaso k={k} total={total} setK={setK} />
    </section>
  )
}

/** Línea k del cuaderno. La que se está explicando lleva resaltado lo que se va a operar en el paso siguiente. */
function Linea({ r, k, actual }: { r: Resuelta; k: number; actual: number }) {
  const siguientePaso = r.pasos[k]
  const resaltar = siguientePaso && k === actual - 1
  return (
    <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className={`flex items-baseline gap-2 ${k < actual - 1 ? 'opacity-50' : ''}`}>
      <span className="w-5 text-xl font-semibold text-slate-400">{k > 0 ? '=' : ''}</span>
      {resaltar ? (
        <Expr trozos={siguientePaso.antes} />
      ) : (
        <Expr trozos={[{ s: k === 0 ? r.inicial : r.pasos[k - 1].despues }]} />
      )}
    </motion.div>
  )
}

/** El alumno decide qué operación va ahora tocando su signo. Si no toca todavía, se le dice por qué. */
export function ProbarOrden({ ejemplos }: { ejemplos: string[] }) {
  const [entrada, setEntrada] = useState(ejemplos[0])
  const [historia, setHistoria] = useState<Nodo[]>(() => [analizar(ejemplos[0])])
  const [msg, setMsg] = useState<Mensaje | null>(null)
  const [intentos, setIntentos] = useState(0)
  const [resaltar, setResaltar] = useState(false)
  const raiz = historia[historia.length - 1]
  const terminado = raiz.t === 'num'

  const avisar = (tipo: Mensaje['tipo'], texto: string) => {
    setMsg({ tipo, texto })
    setIntentos((i) => i + 1)
  }

  function elegir(s: string): string | null {
    const res = intentar(() => {
      resolver(s)
      return analizar(s)
    })
    if ('error' in res) return res.error
    setEntrada(s)
    setHistoria([res.ok])
    setMsg(null)
    return null
  }

  function tocar(n: Nodo) {
    const espera = motivo(n)
    if (espera) return avisar('mal', espera)
    const hecho = aplicar(raiz, n)
    setHistoria([...historia, hecho.raiz])
    avisar('bien', hecho.cuenta)
  }

  function pista() {
    setResaltar(true)
    avisar('bien', 'Mira lo que está resaltado en amarillo: eso es lo que toca ahora.')
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">¿Qué se hace primero?</h2>
      <p className="text-lg">Toca el signo de la operación que toca hacer ahora. La cuenta la hace la app: tú decides el orden.</p>
      <Selector ejemplos={ejemplos} actual={entrada} elegir={elegir} />

      <div className="lienzo items-start justify-start">
        {historia.slice(0, -1).map((n, i) => (
          <div key={i} className="flex items-baseline gap-2 opacity-50">
            <span className="w-5 text-xl font-semibold text-slate-400">{i > 0 ? '=' : ''}</span>
            <Expr trozos={[{ s: escribir(n) }]} />
          </div>
        ))}
        <motion.div key={historia.length} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
          <span className="w-5 text-xl font-semibold text-slate-400">{historia.length > 1 ? '=' : ''}</span>
          <Expr trozos={trozos(raiz, resaltar ? (siguiente(raiz) ?? undefined) : undefined)} tocar={terminado ? undefined : (n) => (setResaltar(false), tocar(n))} grande />
        </motion.div>
      </div>

      {terminado && <p className="text-lg font-semibold">¡Resuelta! Has elegido bien el orden de todas las operaciones.</p>}
      <Aviso msg={msg} clave={intentos} />

      <div className="flex flex-wrap gap-2">
        <button
          className="btn"
          disabled={historia.length < 2}
          onClick={() => {
            setHistoria(historia.slice(0, -1))
            setMsg(null)
            setResaltar(false)
          }}
        >
          ← Deshacer
        </button>
        <button className="btn" disabled={terminado} onClick={pista}>
          No sé cuál toca
        </button>
      </div>
    </section>
  )
}
