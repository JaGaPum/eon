// Piezas del Tema 2: expresiones con fracciones (para leer o tocando el signo que toca), el paso a paso del
// cuaderno, barras que representan fracciones y un desmenuzador genérico de pasos.
import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { analizarFr, aplicarFr, motivoFr, resolverFr, siguienteFr, tokens, type NodoF, type ResueltaFr, type Tok } from '../lib/exprFr'
import { F } from './mat'
import { Aviso, type Mensaje } from './visuales'
import { PasoAPaso } from './Parada'

const fondo = (m?: boolean) => (m ? 'bg-amber-200 rounded' : '')

/** Una expresión con fracciones. Con `tocar`, los signos de operación son botones. */
export function ExprFr({ toks, tocar, grande }: { toks: Tok[]; tocar?: (n: NodoF) => void; grande?: boolean }) {
  return (
    <span className={`inline-flex flex-wrap items-center gap-y-2 font-semibold tabular-nums ${grande ? 'text-2xl' : 'text-xl'}`}>
      {toks.map((t, i) => {
        if (t.k === 'fr')
          return (
            <span key={i} className={`inline-flex items-center ${fondo(t.m)}`}>
              {t.paren && '('}
              <F n={t.v.n} d={t.v.d} />
              {t.paren && ')'}
            </span>
          )
        if (t.k === 'frs')
          return (
            <span key={i} className={`mx-0.5 inline-flex flex-col items-center align-middle text-[0.85em] leading-tight ${fondo(t.m)}`}>
              <span className="px-1 whitespace-nowrap">{t.arriba}</span>
              <span className="h-0.5 w-full rounded bg-current" />
              <span className="px-1 whitespace-nowrap">{t.abajo}</span>
            </span>
          )
        if (t.k === 'op' && tocar)
          return (
            <button
              key={i}
              onClick={() => tocar(t.nodo)}
              className={`mx-0.5 inline-flex cursor-pointer items-center justify-center rounded-lg border-2 px-1 text-indigo-700 hover:bg-indigo-100 ${t.sup ? 'h-9 min-w-9 self-start text-3xl leading-none' : 'h-10 min-w-10'} ${
                t.m ? 'border-amber-500 bg-amber-200' : 'border-indigo-300 bg-indigo-50'
              }`}
              aria-label={t.sup ? `Elevar a ${t.s}` : `Operación ${t.s.trim()}`}
            >
              {t.s.trim()}
            </button>
          )
        if (t.k === 'op' || t.k === 'sup')
          return (
            <span key={i} className={`whitespace-pre ${t.k === 'op' && t.sup ? 'self-start text-[1.3em] leading-none' : ''} ${fondo(t.m)}`}>
              {t.s}
            </span>
          )
        return (
          <span key={i} className={`whitespace-pre ${fondo(t.m)}`}>
            {t.s}
          </span>
        )
      })}
    </span>
  )
}

/** Una operación escrita a partir de texto («3/4 + 1/2»), para los enunciados. */
export const Op = ({ e }: { e: string }) => <ExprFr toks={tokens(analizarFr(e))} />

function intentar<T>(f: () => T): { ok: T } | { error: string } {
  try {
    return { ok: f() }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'La operación no está bien escrita.' }
  }
}

function Selector({ ejemplos, actual, elegir, placeholder }: { ejemplos: string[]; actual: string; elegir: (s: string) => string | null; placeholder: string }) {
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
        <input className="campo w-full max-w-md text-left" placeholder={placeholder} aria-label="Tu operación" value={otro} onChange={(e) => setOtro(e.target.value)} />
        <button className="btn">Usar</button>
      </form>
      <p className="text-sm text-slate-500">Escribe las fracciones con barra (3/4), multiplica con · o *, divide con : y eleva con ^ (por ejemplo (2/5)^3).</p>
      {error && <p className="text-red-700">{error}</p>}
    </div>
  )
}

/** Paso a paso en formato cuaderno, con fracciones. */
export function DesmenuzaFr({ ejemplos }: { ejemplos: string[] }) {
  const [entrada, setEntrada] = useState(ejemplos[0])
  const [k, setK] = useState(0)
  const r = useMemo(() => resolverFr(entrada), [entrada])
  const total = r.pasos.length
  const paso = k > 0 ? r.pasos[k - 1] : null

  function elegir(s: string): string | null {
    const res = intentar(() => resolverFr(s))
    if ('error' in res) return res.error
    if (!res.ok.pasos.length) return 'Ahí no hay nada que operar.'
    setEntrada(s)
    setK(0)
    return null
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">Una operación resuelta, paso a paso</h2>
      <Selector ejemplos={ejemplos} actual={entrada} elegir={elegir} placeholder="O escribe la tuya: (1/2 - 1/3) : 5/6" />
      <div className="lienzo items-start justify-start gap-4">
        <Linea r={r} k={0} actual={k} />
        {r.pasos.slice(0, k).map((_, i) => (
          <Linea key={i} r={r} k={i + 1} actual={k} />
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={`${entrada}-${k}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="min-h-28 space-y-2 text-lg leading-relaxed">
          {k === 0 ? (
            <p>Esta es la operación. Pulsa «Siguiente» para ver qué se hace primero y por qué.</p>
          ) : (
            <>
              <h3 className="font-bold">
                Paso {k} de {total}
              </h3>
              <p>{paso!.porque}</p>
              <div className="overflow-x-auto rounded-xl bg-indigo-50 px-3 py-2">
                <ExprFr toks={paso!.cuenta} />
              </div>
              {k === total && (
                <p>
                  Ya no queda nada por operar. El resultado, en fracción irreducible, es <F n={r.resultado.n} d={r.resultado.d} />.
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

function Linea({ r, k, actual }: { r: ResueltaFr; k: number; actual: number }) {
  const sig = r.pasos[k]
  const resaltar = sig && k === actual - 1
  const toks = resaltar ? sig.antes : k === 0 ? r.inicial : r.pasos[k - 1].despues
  return (
    <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className={`flex items-center gap-2 overflow-x-auto ${k < actual - 1 ? 'opacity-50' : ''}`}>
      <span className="w-5 text-xl font-semibold text-slate-400">{k > 0 ? '=' : ''}</span>
      <ExprFr toks={toks} />
    </motion.div>
  )
}

/** El alumno toca el signo de la operación que toca; la cuenta la hace la app. */
export function ProbarOrdenFr({ ejemplos }: { ejemplos: string[] }) {
  const [entrada, setEntrada] = useState(ejemplos[0])
  const [historia, setHistoria] = useState<NodoF[]>(() => [analizarFr(ejemplos[0])])
  const [msg, setMsg] = useState<Mensaje | null>(null)
  const [cuenta, setCuenta] = useState<Tok[] | null>(null)
  const [intentos, setIntentos] = useState(0)
  const [resaltar, setResaltar] = useState(false)
  const raiz = historia[historia.length - 1]
  const terminado = raiz.t === 'num'

  const avisar = (tipo: Mensaje['tipo'], texto: ReactNode) => {
    setMsg({ tipo, texto })
    setIntentos((i) => i + 1)
  }

  function elegir(s: string): string | null {
    const res = intentar(() => {
      resolverFr(s)
      return analizarFr(s)
    })
    if ('error' in res) return res.error
    setEntrada(s)
    setHistoria([res.ok])
    setMsg(null)
    setCuenta(null)
    return null
  }

  function tocar(n: NodoF) {
    setResaltar(false)
    const espera = motivoFr(raiz, n)
    if (espera) {
      setCuenta(null)
      return avisar('mal', espera)
    }
    const hecho = aplicarFr(raiz, n)
    setHistoria([...historia, hecho.raiz])
    setCuenta(hecho.paso.cuenta)
    avisar('bien', hecho.paso.porque)
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">¿Qué se hace primero?</h2>
      <p className="text-lg">Toca el signo de la operación que toca hacer ahora (para una potencia, toca el exponente). La cuenta la hace la app: tú decides el orden.</p>
      <Selector ejemplos={ejemplos} actual={entrada} elegir={elegir} placeholder="O escribe la tuya: 2/3 - 1/2 · (1 + 1/4)" />
      <div className="lienzo items-start justify-start gap-3">
        {historia.slice(0, -1).map((n, i) => (
          <div key={i} className="flex items-center gap-2 overflow-x-auto opacity-50">
            <span className="w-5 text-xl font-semibold text-slate-400">{i > 0 ? '=' : ''}</span>
            <ExprFr toks={tokens(n)} />
          </div>
        ))}
        <motion.div key={historia.length} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 overflow-x-auto">
          <span className="w-5 text-xl font-semibold text-slate-400">{historia.length > 1 ? '=' : ''}</span>
          <ExprFr toks={tokens(raiz, resaltar ? siguienteFr(raiz) : null)} tocar={terminado ? undefined : tocar} grande />
        </motion.div>
      </div>
      {terminado && <p className="text-lg font-semibold">¡Resuelta! Has elegido bien el orden de todas las operaciones.</p>}
      <Aviso msg={msg} clave={intentos} />
      {cuenta && (
        <div className="overflow-x-auto rounded-xl bg-indigo-50 px-3 py-2">
          <ExprFr toks={cuenta} />
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <button
          className="btn"
          disabled={historia.length < 2}
          onClick={() => {
            setHistoria(historia.slice(0, -1))
            setMsg(null)
            setCuenta(null)
          }}
        >
          ← Deshacer
        </button>
        <button
          className="btn"
          disabled={terminado}
          onClick={() => {
            setResaltar(true)
            avisar('bien', 'Mira lo que está resaltado en amarillo: eso es lo que toca ahora.')
          }}
        >
          No sé cuál toca
        </button>
      </div>
    </section>
  )
}

const COLORES = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#0ea5e9']

/**
 * Una fracción dibujada: barras divididas en `d` partes con `n` coloreadas (varias barras si pasa de la unidad).
 * Con `tocar`, cada parte se puede pulsar.
 */
export function Barra({ n, d, color = COLORES[0], tocar, alto = 'h-12', marcadas }: { n: number; d: number; color?: string; tocar?: (i: number) => void; alto?: string; marcadas?: boolean[] }) {
  const barras = Math.max(1, Math.ceil(Math.abs(n) / d))
  return (
    <div className="flex w-full flex-col gap-1.5">
      {Array.from({ length: barras }, (_, b) => (
        <div key={b} className={`flex w-full overflow-hidden rounded-lg border-2 border-slate-700 ${alto}`}>
          {Array.from({ length: d }, (_, i) => {
            const k = b * d + i
            const lleno = marcadas ? marcadas[k] : k < Math.abs(n)
            return (
              <button
                key={i}
                type="button"
                disabled={!tocar}
                onClick={() => tocar?.(k)}
                aria-label={`Parte ${k + 1}`}
                className={`flex-1 border-slate-700 transition-colors ${i > 0 ? 'border-l' : ''} ${tocar ? 'cursor-pointer' : 'cursor-default'}`}
                style={{ background: lleno ? color : '#fff' }}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}

export { COLORES }

export interface PasoG {
  /** Lo que se escribe en el cuaderno en este paso. */
  linea: ReactNode
  explica: ReactNode
}

/**
 * Desmenuzar genérico: ejemplos con sus pasos y, si se quiere, uno propio escrito por el alumno. Las líneas del
 * cuaderno se van añadiendo y la explicación es la del último paso.
 */
export function PasosGuiados({
  titulo,
  ejemplos,
  crear,
  placeholder,
  ayuda,
}: {
  titulo: string
  ejemplos: { nombre: string; pasos: PasoG[] }[]
  crear?: (s: string) => PasoG[]
  placeholder?: string
  ayuda?: string
}) {
  const [actual, setActual] = useState<{ nombre: string; pasos: PasoG[] }>(ejemplos[0])
  const [k, setK] = useState(0)
  const [otro, setOtro] = useState('')
  const [error, setError] = useState<string | null>(null)
  const total = actual.pasos.length - 1

  function usar(ev: FormEvent) {
    ev.preventDefault()
    if (!crear) return
    const r = intentar(() => crear(otro))
    if ('error' in r) return setError(r.error)
    setError(null)
    setActual({ nombre: otro, pasos: r.ok })
    setK(0)
    setOtro('')
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">{titulo}</h2>
      <div className="flex flex-wrap gap-2">
        {ejemplos.map((e, i) => (
          <button
            key={e.nombre}
            className={`btn ${e.nombre === actual.nombre ? 'btn-activo' : ''}`}
            onClick={() => {
              setActual(e)
              setK(0)
              setError(null)
            }}
          >
            Ejemplo {i + 1}
          </button>
        ))}
      </div>
      {crear && (
        <form onSubmit={usar} className="flex flex-wrap items-center gap-2">
          <input className="campo w-full max-w-md text-left" placeholder={placeholder} aria-label="Tu ejemplo" value={otro} onChange={(e) => setOtro(e.target.value)} />
          <button className="btn">Usar</button>
        </form>
      )}
      {ayuda && <p className="text-sm text-slate-500">{ayuda}</p>}
      {error && <p className="text-red-700">{error}</p>}
      <div className="lienzo items-start justify-start gap-3 text-xl">
        {actual.pasos.slice(0, k + 1).map((p, i) => (
          <motion.div key={`${actual.nombre}-${i}`} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className={`w-full overflow-x-auto ${i < k ? 'opacity-60' : ''}`}>
            {p.linea}
          </motion.div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={`${actual.nombre}-${k}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="min-h-20 text-lg leading-relaxed">
          {k > 0 && (
            <h3 className="font-bold">
              Paso {k} de {total}
            </h3>
          )}
          {actual.pasos[k].explica}
        </motion.div>
      </AnimatePresence>
      <PasoAPaso k={k} total={total} setK={setK} />
    </section>
  )
}
