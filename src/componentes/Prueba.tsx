// Pruebas: la de cada parada (con estrellas) y el examen final de la lección (con nota).
// Sin pistas y con un intento por pregunta; la corrección llega al final.
import { useState, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { useAvance } from '../lib/progreso'
import { RUTA_TEMA1 } from '../contenido/catalogo'
import { BLOQUES } from '../contenido/tema1'
import { BANCOS } from '../contenido/preguntas'
import { CampoRespuesta, escribirRespuesta, type Pregunta } from './Respuesta'

export const PREGUNTAS_PRUEBA = 8
export const PREGUNTAS_EXAMEN = 16
const ESTACIONES = BLOQUES.flatMap((b) => b.estaciones)
const nombreDe = (parada: string) => ESTACIONES.find((e) => e.id === parada)?.titulo ?? parada

/** Estrellas que da una prueba: una desde el 60 %, dos desde el 85 % y tres con todo bien. */
export function estrellas(aciertos: number | undefined, total: number): number {
  if (aciertos === undefined) return 0
  const r = aciertos / total
  return r >= 1 ? 3 : r >= 0.85 ? 2 : r >= 0.6 ? 1 : 0
}

/** El examen final se abre con al menos una estrella en todas las paradas. */
export const examenAbierto = (pruebas: Record<string, number>) => ESTACIONES.every((e) => estrellas(pruebas[e.id], PREGUNTAS_PRUEBA) > 0)
export const notaExamen = (aciertos: number) => Math.round((aciertos / PREGUNTAS_EXAMEN) * 100) / 10

export function Estrellas({ n, grande }: { n: number; grande?: boolean }) {
  return (
    <span className={`inline-flex gap-0.5 ${grande ? 'text-6xl' : 'text-xl'}`} role="img" aria-label={`${n} de 3 estrellas`}>
      {[1, 2, 3].map((i) => (
        <motion.span
          key={i}
          initial={grande ? { scale: 0, rotate: -90 } : false}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: grande ? 0.25 * i : 0, type: 'spring', stiffness: 260, damping: 12 }}
          className={i <= n ? 'text-amber-400' : 'text-slate-300'}
        >
          ★
        </motion.span>
      ))}
    </span>
  )
}

interface Item {
  q: Pregunta
  parada: string
  resp?: string
}

function barajar<T>(lista: T[]): T[] {
  const copia = [...lista]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

/** Preguntas de una parada: unas de las hojas de clase y otras nuevas, para que no valga memorizar. */
function elegir(parada: string, deClase: number, nuevas: number): Item[] {
  const banco = BANCOS[parada]
  return [...barajar(banco.clase).slice(0, deClase), ...Array.from({ length: nuevas }, banco.generar)].map((q) => ({ q, parada }))
}

interface PropsCuestionario {
  crear: () => Item[]
  portada: ReactNode
  /** Se llama una vez al terminar, con el número de aciertos. */
  alTerminar: (aciertos: number) => void
  resultado: (aciertos: number, items: Item[]) => ReactNode
  /** En el examen cada pregunta dice de qué parada es. */
  conParada?: boolean
}

function Cuestionario({ crear, portada, alTerminar, resultado, conParada }: PropsCuestionario) {
  const [items, setItems] = useState<Item[] | null>(null)
  const [i, setI] = useState(0)

  if (!items) {
    return (
      <div className="space-y-4">
        {portada}
        <button
          className="btn btn-primario text-lg"
          onClick={() => {
            setItems(crear())
            setI(0)
          }}
        >
          Empezar
        </button>
      </div>
    )
  }

  const total = items.length
  const bien = (it: Item) => it.resp === it.q.correcta
  const aciertos = items.filter(bien).length

  if (i < total) {
    const { q, parada } = items[i]
    const responder = (resp: string) => {
      const nuevos = items.map((it, j) => (j === i ? { ...it, resp } : it))
      setItems(nuevos)
      setI(i + 1)
      if (i + 1 === total) alTerminar(nuevos.filter(bien).length)
    }
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-slate-500">
            Pregunta {i + 1} de {total}
          </span>
          <span className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
            <motion.span className="block h-full rounded-full bg-indigo-500" animate={{ width: `${(100 * i) / total}%` }} />
          </span>
        </div>
        {conParada && <p className="text-sm font-semibold text-indigo-700">{nombreDe(parada)}</p>}
        <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-5 text-lg leading-relaxed">{q.enunciado}</div>
          <CampoRespuesta q={q} responder={responder} boton={i + 1 === total ? 'Terminar' : 'Siguiente →'} />
        </motion.div>
        <p className="text-sm text-slate-500">Sin pistas y con un solo intento por pregunta. La corrección llega al final.</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {resultado(aciertos, items)}

      <button className="btn btn-primario" onClick={() => setItems(null)}>
        Repetir con otras preguntas
      </button>

      <h3 className="text-lg font-bold">Corrección</h3>
      <ol className="space-y-3">
        {items.map((it, j) => (
          <li key={j} className={`rounded-2xl border p-4 ${bien(it) ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
            <p className="text-sm font-bold text-slate-500">
              {j + 1}. {bien(it) ? '✓ Bien' : '✗ Mal'}
              {conParada && ` · ${nombreDe(it.parada)}`}
            </p>
            <div className="mt-1 overflow-x-auto">{it.q.enunciado}</div>
            <p className="mt-2">
              Tu respuesta: <b>{escribirRespuesta(it.q, it.resp ?? '')}</b>
              {!bien(it) && (
                <>
                  {' · '}Correcta: <b>{escribirRespuesta(it.q, it.q.correcta)}</b>
                </>
              )}
            </p>
            {!bien(it) && (
              <details className="mt-2">
                <summary className="cursor-pointer font-semibold text-indigo-700">Ver cómo se hace</summary>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {it.q.pistas.map((p, k) => (
                    <li key={k} className="overflow-x-auto">
                      {p}
                    </li>
                  ))}
                </ul>
                <a className="mt-2 inline-block font-semibold text-indigo-700 underline" href={`${RUTA_TEMA1}/${it.parada}/desmenuzar`}>
                  Repasarlo en Desmenuzar →
                </a>
              </details>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}

/** Prueba de una parada: ocho preguntas y hasta tres estrellas. */
export function Prueba({ parada }: { parada: string }) {
  const { progreso, marcar } = useAvance()
  const mejor = progreso.pruebas[parada]

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">Prueba de la parada</h2>
      <Cuestionario
        crear={() => barajar(elegir(parada, PREGUNTAS_PRUEBA / 2, PREGUNTAS_PRUEBA / 2))}
        alTerminar={(aciertos) => marcar(parada, aciertos)}
        portada={
          <>
            <p className="text-lg">
              {PREGUNTAS_PRUEBA} preguntas de esta parada, sin pistas y con un intento cada una. Al final verás la corrección y cuántas estrellas consigues.
            </p>
            <ul className="text-lg">
              <li>★ con 5 aciertos · ★★ con 7 · ★★★ con los 8</li>
            </ul>
            <p className="flex flex-wrap items-center gap-2 text-lg">
              Tu mejor marca: <Estrellas n={estrellas(mejor, PREGUNTAS_PRUEBA)} />
              <span className="text-slate-500">{mejor === undefined ? 'todavía no la has hecho' : `${mejor} de ${PREGUNTAS_PRUEBA}`}</span>
            </p>
          </>
        }
        resultado={(aciertos) => {
          const n = estrellas(aciertos, PREGUNTAS_PRUEBA)
          return (
            <div className="flex flex-col items-center gap-2 rounded-2xl bg-slate-900 p-6 text-center text-white">
              <Estrellas n={n} grande />
              <p className="text-3xl font-bold">
                {aciertos} de {PREGUNTAS_PRUEBA}
              </p>
              <p className="text-lg text-indigo-200">
                {n === 3 ? '¡Perfecto! Parada dominada.' : n > 0 ? '¡Prueba superada! Repasa los fallos y ve a por las tres estrellas.' : 'Todavía no. Mira la corrección, repasa y vuelve a intentarlo.'}
              </p>
            </div>
          )
        }}
      />
    </section>
  )
}

/** Examen final de la lección: dos preguntas de cada parada y nota sobre 10. */
export function Examen() {
  const { progreso, marcar } = useAvance()
  const abierto = examenAbierto(progreso.pruebas)
  const mejor = progreso.pruebas.examen

  return (
    <section className="space-y-4">
      <a href={RUTA_TEMA1} className="font-semibold text-indigo-700">
        ← Mapa del tema
      </a>
      <h1 className="text-3xl font-bold">Misión final</h1>
      {!abierto ? (
        <>
          <p className="text-lg">La misión final se abre cuando tengas al menos una estrella en la prueba de cada parada. Te faltan estas:</p>
          <ul className="space-y-2">
            {ESTACIONES.filter((e) => estrellas(progreso.pruebas[e.id], PREGUNTAS_PRUEBA) === 0).map((e) => (
              <li key={e.id}>
                <a className="btn" href={`${RUTA_TEMA1}/${e.id}/prueba`}>
                  {e.num}. {e.titulo} →
                </a>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <Cuestionario
          conParada
          crear={() => ESTACIONES.flatMap((e) => elegir(e.id, 1, 1))}
          alTerminar={(aciertos) => marcar('examen', aciertos)}
          portada={
            <>
              <p className="text-lg">
                El examen de todo el tema: {PREGUNTAS_EXAMEN} preguntas, dos de cada parada, sin pistas y con un intento cada una. Al final verás tu nota sobre 10 y qué paradas conviene repasar.
              </p>
              <p className="text-lg">
                Tu mejor nota: <b>{mejor === undefined ? 'todavía no lo has hecho' : notaExamen(mejor)}</b>
              </p>
            </>
          }
          resultado={(aciertos, items) => {
            const nota = notaExamen(aciertos)
            return (
              <>
                <div className="flex flex-col items-center gap-2 rounded-2xl bg-slate-900 p-6 text-center text-white">
                  <motion.p initial={{ scale: 0.3 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }} className="text-7xl font-black text-amber-300">
                    {nota}
                  </motion.p>
                  <p className="text-xl font-bold">
                    {aciertos} de {PREGUNTAS_EXAMEN} aciertos
                  </p>
                  <p className="text-lg text-indigo-200">
                    {nota >= 9 ? '¡Misión cumplida con honores!' : nota >= 5 ? '¡Misión cumplida! Mira abajo qué paradas puedes afinar.' : 'Misión sin completar. Repasa las paradas marcadas y vuelve a intentarlo.'}
                  </p>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {ESTACIONES.map((e) => {
                    const suyas = items.filter((it) => it.parada === e.id)
                    const ok = suyas.filter((it) => it.resp === it.q.correcta).length
                    return (
                      <a
                        key={e.id}
                        href={`${RUTA_TEMA1}/${e.id}/entender`}
                        className={`flex items-center justify-between rounded-xl border px-4 py-2 font-semibold ${ok === suyas.length ? 'border-green-300 bg-green-50' : 'border-amber-300 bg-amber-50'}`}
                      >
                        <span>
                          {e.num}. {e.titulo}
                        </span>
                        <span>
                          {ok}/{suyas.length}
                        </span>
                      </a>
                    )
                  })}
                </div>
              </>
            )
          }}
        />
      )}
    </section>
  )
}
