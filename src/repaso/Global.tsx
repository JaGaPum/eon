// Repaso para el global de Matemáticas de la 1.ª evaluación (2.º ESO): los temas 1, 2 y 3 mezclados.
// · Práctica mezclada: rondas de preguntas de todas las paradas revueltas; la que se falla vuelve a salir un poco
//   después (repetición espaciada), y al final se ve qué tema y qué paradas conviene repasar.
// · Simulacro: como un examen de verdad, cinco preguntas de cada tema, sin pistas y con nota.
import { useMemo, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useAvance, type Progreso } from '../lib/progreso'
import { CampoRespuesta, esCorrecta, escribirRespuesta, type Pregunta } from '../componentes/Respuesta'
import { TextoMat } from '../componentes/mat'
import { estrellas, PREGUNTAS_PRUEBA } from '../componentes/Prueba'
import { estacionesDe, type Tema } from '../componentes/tema'
import { TEMA1, TEMA2, TEMA3 } from '../contenido/temas'

export const RUTA_GLOBAL = '#/2eso/matematicas/global1'
const TEMAS: { tema: Tema; corto: string; color: string }[] = [
  { tema: TEMA1, corto: 'Tema 1 · Enteros y divisibilidad', color: '#0ea5e9' },
  { tema: TEMA2, corto: 'Tema 2 · Fracciones y decimales', color: '#a855f7' },
  { tema: TEMA3, corto: 'Tema 3 · Potencias y raíces', color: '#f59e0b' },
]
const CLAVE_SIMULACRO = 'global1/simulacro'
const POR_TEMA = 5
const RONDA = 12

interface Item {
  q: Pregunta
  /** Índice en TEMAS. */
  t: number
  parada: string
  /** Si es una que se falló y vuelve. */
  vuelve?: boolean
}

const azar = <T,>(xs: readonly T[]): T => xs[Math.floor(Math.random() * xs.length)]
function barajar<T>(xs: readonly T[]): T[] {
  const a = [...xs]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Una pregunta de una parada: la mitad de las veces de las hojas de clase y la otra mitad nueva. */
function preguntaDe(t: number, parada: string, examen = false): Item {
  const banco = TEMAS[t].tema.bancos[parada]
  const preferidas = examen && banco.examen?.length ? banco.examen : banco.clase
  const q = Math.random() < 0.5 && preferidas.length ? azar(preferidas) : banco.generar()
  return { q, t, parada }
}

const nombreParada = (t: number, parada: string) => estacionesDe(TEMAS[t].tema).find((e) => e.id === parada)?.titulo ?? parada
const enlaceParada = (t: number, parada: string, modo = 'desmenuzar') => `${TEMAS[t].tema.ruta}/${parada}/${modo}`

/** Una ronda de práctica: los tres temas a partes iguales y paradas al azar, sin repetir parada seguida. */
export function crearRonda(): Item[] {
  const items: Item[] = []
  for (let k = 0; k < RONDA; k++) {
    const t = k % 3
    const paradas = estacionesDe(TEMAS[t].tema).map((e) => e.id)
    items.push(preguntaDe(t, azar(paradas)))
  }
  return barajar(items)
}

/** El simulacro: cinco paradas distintas de cada tema, una pregunta de cada una. */
export function crearSimulacro(): Item[] {
  return TEMAS.flatMap((_, t) =>
    barajar(estacionesDe(TEMAS[t].tema).map((e) => e.id))
      .slice(0, POR_TEMA)
      .map((p) => preguntaDe(t, p, true)),
  )
}

export function avanceGlobal1(progreso: Progreso): string {
  const mejor = progreso.pruebas[CLAVE_SIMULACRO]
  return mejor === undefined ? 'Simulacro sin hacer todavía' : `Mejor nota del simulacro: ${nota(mejor)}`
}
/** Nota sobre 10 con una cifra decimal y coma: «9,3». */
const nota = (aciertos: number) => String(Math.round((aciertos / (POR_TEMA * TEMAS.length)) * 100) / 10).replace('.', ',')

// ===================================================================================================

export default function Global({ parada, progreso }: { parada?: string; modo?: string; progreso: Progreso }) {
  if (parada === 'mezcla')
    return (
      <div className="tablero">
        <Volver />
        <Mezcla />
      </div>
    )
  if (parada === 'simulacro')
    return (
      <div className="tablero">
        <Volver />
        <Simulacro />
      </div>
    )
  return <Portada progreso={progreso} />
}

const Volver = () => (
  <a href={RUTA_GLOBAL} className="font-semibold text-indigo-700">
    ← Repaso para el global
  </a>
)

/** Las paradas con menos estrellas de los tres temas: por donde conviene empezar. */
function flojas(progreso: Progreso) {
  return TEMAS.flatMap(({ tema }, t) => estacionesDe(tema).map((e) => ({ t, e, n: estrellas(progreso.pruebas[tema.prefijo + e.id], PREGUNTAS_PRUEBA) })))
    .sort((a, b) => a.n - b.n || a.t - b.t)
    .slice(0, 4)
}

function Portada({ progreso }: { progreso: Progreso }) {
  const mejor = progreso.pruebas[CLAVE_SIMULACRO]
  const lista = flojas(progreso)
  return (
    <>
      <h1 className="text-3xl font-bold text-white">Repaso para el global</h1>
      <p className="mt-1 text-lg text-indigo-200">Matemáticas de la 1.ª evaluación: los temas 1, 2 y 3 mezclados, como en el examen.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <motion.a href={`${RUTA_GLOBAL}/mezcla`} whileHover={{ y: -4 }} className="cristal flex flex-col gap-2 border-indigo-300/40 p-5 hover:bg-white/[0.12]">
          <span className="text-4xl">🔀</span>
          <b className="text-xl text-white">Práctica mezclada</b>
          <span className="text-indigo-200">Rondas de {RONDA} preguntas de los tres temas revueltos, con pistas. Las que falles vuelven a salir un poco después, hasta que las aciertes.</span>
        </motion.a>
        <motion.a href={`${RUTA_GLOBAL}/simulacro`} whileHover={{ y: -4 }} className="cristal flex flex-col gap-2 border-amber-300/50 p-5 hover:bg-white/[0.12]">
          <span className="text-4xl">📝</span>
          <b className="text-xl text-white">Simulacro de examen</b>
          <span className="text-indigo-200">
            {POR_TEMA * TEMAS.length} preguntas, {POR_TEMA} de cada tema, sin pistas y con un intento. Nota sobre 10 y qué repasar.
          </span>
          <span className="font-bold text-amber-200">{mejor === undefined ? 'Todavía no lo has hecho' : `Tu mejor nota: ${nota(mejor)}`}</span>
        </motion.a>
      </div>

      <h2 className="mt-8 mb-3 text-sm font-bold tracking-widest text-indigo-300 uppercase">Cómo vas en cada tema</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        {TEMAS.map(({ tema, corto, color }) => {
          const est = estacionesDe(tema)
          const n = est.reduce((s, e) => s + estrellas(progreso.pruebas[tema.prefijo + e.id], PREGUNTAS_PRUEBA), 0)
          return (
            <a key={tema.ruta} href={tema.ruta} className="cristal block p-4 hover:bg-white/[0.12]">
              <b className="text-white">{corto}</b>
              <span className="mt-2 block h-2 overflow-hidden rounded-full bg-white/15">
                <span className="block h-full rounded-full" style={{ width: `${(100 * n) / (est.length * 3)}%`, background: color }} />
              </span>
              <span className="mt-1 block text-sm font-semibold text-amber-200">
                ★ {n} de {est.length * 3}
              </span>
            </a>
          )
        })}
      </div>

      <h2 className="mt-8 mb-3 text-sm font-bold tracking-widest text-indigo-300 uppercase">Por dónde empezar</h2>
      <p className="mb-3 text-indigo-200">Las paradas con menos estrellas en su prueba:</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {lista.map(({ t, e, n }) => (
          <a key={`${t}${e.id}`} href={enlaceParada(t, e.id, 'entender')} className="cristal flex items-center justify-between gap-2 px-4 py-3 hover:bg-white/[0.12]">
            <span>
              <span className="block text-xs font-bold text-indigo-300">{TEMAS[t].corto}</span>
              <b className="text-white">{e.titulo}</b>
            </span>
            <span className="text-lg text-amber-300">
              {'★'.repeat(n)}
              <span className="text-white/20">{'★'.repeat(3 - n)}</span>
            </span>
          </a>
        ))}
      </div>
    </>
  )
}

const Etiqueta = ({ it }: { it: Item }) => (
  <p className="flex flex-wrap items-center gap-2 text-sm font-bold">
    <span className="rounded-full px-3 py-1 text-white" style={{ background: TEMAS[it.t].color }}>
      {TEMAS[it.t].corto.split(' · ')[0]}
    </span>
    <span className="text-slate-600">{nombreParada(it.t, it.parada)}</span>
    {it.vuelve && <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-800">🔁 Una parecida a la que fallaste</span>}
  </p>
)

// ===================================================================================================
// Práctica mezclada
// ===================================================================================================

interface Hecha {
  it: Item
  /** Acertada al primer intento. */
  primera: boolean
}

function Mezcla() {
  const { apuntar } = useAvance()
  const [cola, setCola] = useState<Item[]>(crearRonda)
  const [hechas, setHechas] = useState<Hecha[]>([])
  const [intentos, setIntentos] = useState(0)
  const [pista, setPista] = useState(0)
  const [estado, setEstado] = useState<'pregunta' | 'bien' | 'solucion'>('pregunta')
  const [ultima, setUltima] = useState<string | null>(null)
  const [abiertos, setAbiertos] = useState(0)
  const [vista, setVista] = useState(0)
  const it = cola[0]

  function siguiente(reponer: boolean) {
    const resto = cola.slice(1)
    // La fallada vuelve tres preguntas más tarde (o al final si quedan menos), con otros números para no memorizarla.
    if (reponer) resto.splice(Math.min(3, resto.length), 0, { t: it.t, parada: it.parada, q: TEMAS[it.t].tema.bancos[it.parada].generar(), vuelve: true })
    setCola(resto)
    setVista((n) => n + 1)
    setIntentos(0)
    setPista(0)
    setEstado('pregunta')
    setUltima(null)
    setAbiertos((n) => n + 1)
  }

  function responder(resp: string) {
    if (esCorrecta(it.q, resp)) {
      setEstado('bien')
      if (!it.vuelve) setHechas((h) => [...h, { it, primera: intentos === 0 }])
      apuntar(it.q.id || undefined)
      return
    }
    setUltima(resp)
    setAbiertos((n) => n + 1)
    if (intentos >= 1) {
      setEstado('solucion')
      if (!it.vuelve) setHechas((h) => [...h, { it, primera: false }])
    }
    setIntentos(intentos + 1)
  }

  if (!it) return <ResumenMezcla hechas={hechas} otra={() => (setCola(crearRonda()), setHechas([]), setAbiertos((n) => n + 1))} />

  const total = RONDA
  const llevadas = hechas.length
  return (
    <section className="mt-3 space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-slate-500">{it.vuelve ? 'Repaso' : `${Math.min(hechas.length + (estado === 'pregunta' ? 1 : 0), total)} de ${total}`}</span>
        <span className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
          <motion.span className="block h-full rounded-full bg-indigo-500" animate={{ width: `${(100 * llevadas) / total}%` }} />
        </span>
        <span className="text-sm font-bold text-emerald-700">✓ {hechas.filter((h) => h.primera).length}</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={vista} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="space-y-4">
          <Etiqueta it={it} />
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-5 text-lg leading-relaxed">{it.q.enunciado}</div>
        </motion.div>
      </AnimatePresence>

      {estado === 'pregunta' && <CampoRespuesta key={abiertos} q={it.q} responder={responder} />}

      {estado === 'pregunta' && ultima !== null && (
        <p className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-rose-800">
          No es <TextoMat s={escribirRespuesta(it.q, ultima)} />. Te queda otro intento: pide una pista si quieres.
        </p>
      )}

      {estado === 'bien' && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-3 rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-900">
          <p className="text-xl font-bold">{intentos === 0 ? '¡Bien a la primera!' : '¡Ahora sí!'}</p>
          {it.q.acierto && <div>{it.q.acierto}</div>}
          <button className="btn btn-primario" onClick={() => siguiente(intentos > 0 && !it.vuelve)}>
            Siguiente →
          </button>
        </motion.div>
      )}

      {estado === 'solucion' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 rounded-2xl border border-amber-300 bg-amber-50 p-4">
          <p className="text-lg">
            La respuesta era <b><TextoMat s={escribirRespuesta(it.q, it.q.correcta)} /></b>. Así se hace:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            {it.q.pistas.map((p, k) => (
              <li key={k} className="overflow-x-auto">
                {p}
              </li>
            ))}
          </ul>
          <p className="text-slate-700">Dentro de un rato te pondré una parecida.</p>
          <div className="flex flex-wrap gap-2">
            <button className="btn btn-primario" onClick={() => siguiente(true)}>
              Seguir →
            </button>
            <a className="btn" href={enlaceParada(it.t, it.parada)}>
              Repasarlo en Desmenuzar
            </a>
          </div>
        </motion.div>
      )}

      {estado === 'pregunta' && (
        <div className="space-y-2">
          <button className="btn" disabled={pista >= it.q.pistas.length} onClick={() => setPista(pista + 1)}>
            Dame una pista ({pista}/{it.q.pistas.length})
          </button>
          {it.q.pistas.slice(0, pista).map((p, k) => (
            <p key={k} className="overflow-x-auto rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-amber-900">
              {p}
            </p>
          ))}
        </div>
      )}
    </section>
  )
}

/** Al acabar la ronda: aciertos por tema y las paradas donde ha fallado. */
function ResumenMezcla({ hechas, otra }: { hechas: Hecha[]; otra: () => void }) {
  const bien = hechas.filter((h) => h.primera).length
  const fallos = useMemo(() => {
    const m = new Map<string, { t: number; parada: string; n: number }>()
    for (const h of hechas)
      if (!h.primera) {
        const k = `${h.it.t}:${h.it.parada}`
        m.set(k, { t: h.it.t, parada: h.it.parada, n: (m.get(k)?.n ?? 0) + 1 })
      }
    return [...m.values()].sort((a, b) => b.n - a.n)
  }, [hechas])
  return (
    <section className="mt-3 space-y-5">
      <div className="flex flex-col items-center gap-2 rounded-2xl bg-slate-900 p-6 text-center text-white">
        <motion.p initial={{ scale: 0.3 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }} className="text-6xl font-black text-amber-300">
          {bien} / {hechas.length}
        </motion.p>
        <p className="text-lg text-indigo-200">{bien === hechas.length ? '¡Ronda perfecta!' : bien >= hechas.length * 0.7 ? '¡Muy bien! Mira abajo qué afinar.' : 'Vas cogiendo el ritmo. Repasa lo de abajo y haz otra ronda.'}</p>
      </div>
      <BarrasPorTema items={hechas.map((h) => ({ t: h.it.t, bien: h.primera }))} />
      {fallos.length > 0 && (
        <>
          <h3 className="text-lg font-bold">Para repasar</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {fallos.map((f) => (
              <a key={`${f.t}${f.parada}`} href={enlaceParada(f.t, f.parada)} className="flex items-center justify-between rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 font-semibold">
                <span>
                  <span className="block text-xs text-slate-500">{TEMAS[f.t].corto}</span>
                  {nombreParada(f.t, f.parada)}
                </span>
                <span className="text-amber-700">Desmenuzar →</span>
              </a>
            ))}
          </div>
        </>
      )}
      <button className="btn btn-primario text-lg" onClick={otra}>
        Otra ronda
      </button>
    </section>
  )
}

function BarrasPorTema({ items }: { items: { t: number; bien: boolean }[] }) {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {TEMAS.map((x, t) => {
        const suyas = items.filter((i) => i.t === t)
        const ok = suyas.filter((i) => i.bien).length
        return (
          <div key={t} className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-sm font-bold">{x.corto}</p>
            <span className="mt-2 block h-3 overflow-hidden rounded-full bg-slate-200">
              <motion.span className="block h-full rounded-full" style={{ background: x.color }} initial={{ width: 0 }} animate={{ width: `${suyas.length ? (100 * ok) / suyas.length : 0}%` }} />
            </span>
            <p className="mt-1 text-sm font-semibold text-slate-600">
              {ok} de {suyas.length} bien
            </p>
          </div>
        )
      })}
    </div>
  )
}

// ===================================================================================================
// Simulacro de examen
// ===================================================================================================

function Simulacro() {
  const { progreso, marcar } = useAvance()
  const mejor = progreso.pruebas[CLAVE_SIMULACRO]
  const [items, setItems] = useState<(Item & { resp?: string })[] | null>(null)
  const [i, setI] = useState(0)
  const total = POR_TEMA * TEMAS.length

  if (!items)
    return (
      <section className="mt-3 space-y-4">
        <h1 className="text-3xl font-bold">Simulacro del global</h1>
        <p className="text-lg">
          {total} preguntas: {POR_TEMA} de cada tema, de paradas distintas. Sin pistas y con un solo intento, como en el examen. Al final verás tu nota sobre 10, cómo vas en cada tema y la corrección.
        </p>
        <p className="text-lg">
          Tu mejor nota: <b>{mejor === undefined ? 'todavía no lo has hecho' : nota(mejor)}</b>
        </p>
        <p className="text-slate-600">💡 Ten a mano papel y lápiz: en las combinadas y los problemas, hazlo en el cuaderno y escribe aquí el resultado.</p>
        <button
          className="btn btn-primario text-lg"
          onClick={() => {
            setItems(barajar(crearSimulacro()))
            setI(0)
          }}
        >
          Empezar el simulacro
        </button>
      </section>
    )

  const bien = (x: { q: Pregunta; resp?: string }) => esCorrecta(x.q, x.resp)

  if (i < total) {
    const it = items[i]
    const responder = (resp: string) => {
      const nuevos = items.map((x, j) => (j === i ? { ...x, resp } : x))
      setItems(nuevos)
      setI(i + 1)
      if (i + 1 === total) marcar(CLAVE_SIMULACRO, nuevos.filter(bien).length)
    }
    return (
      <section className="mt-3 space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-slate-500">
            Pregunta {i + 1} de {total}
          </span>
          <span className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
            <motion.span className="block h-full rounded-full bg-indigo-500" animate={{ width: `${(100 * i) / total}%` }} />
          </span>
        </div>
        <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <Etiqueta it={it} />
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-5 text-lg leading-relaxed">{it.q.enunciado}</div>
          <CampoRespuesta key={i} q={it.q} responder={responder} boton={i + 1 === total ? 'Terminar' : 'Siguiente →'} />
        </motion.div>
        <p className="text-sm text-slate-500">Sin pistas y con un solo intento. La corrección llega al final.</p>
      </section>
    )
  }

  const aciertos = items.filter(bien).length
  const n = nota(aciertos)
  return (
    <section className="mt-3 space-y-5">
      <div className="flex flex-col items-center gap-2 rounded-2xl bg-slate-900 p-6 text-center text-white">
        <motion.p initial={{ scale: 0.3 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }} className="text-7xl font-black text-amber-300">
          {n}
        </motion.p>
        <p className="text-xl font-bold">
          {aciertos} de {total} aciertos
        </p>
        <p className="text-lg text-indigo-200">{aciertos >= total * 0.9 ? '¡Listo para el global!' : aciertos >= total * 0.5 ? '¡Aprobado! Mira abajo qué tema afinar.' : 'Todavía no. Repasa lo de abajo y vuelve a intentarlo.'}</p>
      </div>
      <BarrasPorTema items={items.map((x) => ({ t: x.t, bien: bien(x) }))} />
      <button className="btn btn-primario" onClick={() => setItems(null)}>
        Repetir con otras preguntas
      </button>
      <h3 className="text-lg font-bold">Corrección</h3>
      <ol className="space-y-3">
        {items.map((x, j) => (
          <Correccion key={j} n={j + 1} it={x} bien={bien(x)} />
        ))}
      </ol>
    </section>
  )
}

function Correccion({ n, it, bien }: { n: number; it: Item & { resp?: string }; bien: boolean }): ReactNode {
  return (
    <li className={`rounded-2xl border p-4 ${bien ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
      <p className="text-sm font-bold text-slate-500">
        {n}. {bien ? '✓ Bien' : '✗ Mal'} · {TEMAS[it.t].corto.split(' · ')[0]} · {nombreParada(it.t, it.parada)}
      </p>
      <div className="mt-1 overflow-x-auto">{it.q.enunciado}</div>
      <p className="mt-2">
        Tu respuesta: <b><TextoMat s={escribirRespuesta(it.q, it.resp ?? '')} /></b>
        {!bien && (
          <>
            {' · '}Correcta: <b><TextoMat s={escribirRespuesta(it.q, it.q.correcta)} /></b>
          </>
        )}
      </p>
      {!bien && (
        <details className="mt-2">
          <summary className="cursor-pointer font-semibold text-indigo-700">Ver cómo se hace</summary>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {it.q.pistas.map((p, k) => (
              <li key={k} className="overflow-x-auto">
                {p}
              </li>
            ))}
          </ul>
          <a className="mt-2 inline-block font-semibold text-indigo-700 underline" href={enlaceParada(it.t, it.parada)}>
            Repasarlo en Desmenuzar →
          </a>
        </details>
      )}
    </li>
  )
}
