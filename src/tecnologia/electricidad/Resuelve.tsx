// Problemas resueltos paso a paso. Cada problema es una lista de pasos (qué te piden, qué fórmula, cambiar unidades,
// sustituir, calcular). Con «Resuelve conmigo», Mateo contesta cada paso y los pasos hechos se quedan escritos en la
// pantalla, como en el cuaderno. Con «Ejemplo resuelto», solo se van destapando.
import { useMemo, useState, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { Burbulla, Campo, barallar, numeroBen } from '../../primaria/pezas'
import { num } from '../../lib/electricidad'

export type PasoGuiado =
  /** Solo se lee: datos, sustitución… */
  | { tipo: 'info'; titulo: string; contenido: ReactNode; visual?: ReactNode }
  | { tipo: 'elige'; titulo: string; pregunta: ReactNode; correcta: string; otras: string[]; luego: ReactNode; visual?: ReactNode }
  | { tipo: 'numero'; titulo: string; pregunta: ReactNode; valor: number; unidad: string; luego: ReactNode; visual?: ReactNode; marxe?: number }

export interface ProblemaGuiado {
  enunciado: ReactNode
  visual?: ReactNode
  pasos: PasoGuiado[]
}

/** Lo que queda escrito de un paso ya hecho. */
const hecho = (p: PasoGuiado) => (p.tipo === 'info' ? p.contenido : p.luego)

function PasoHecho({ p, n }: { p: PasoGuiado; n: number }) {
  return (
    <motion.li initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 rounded-2xl border-2 border-emerald-200 bg-emerald-50/60 p-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-base font-black text-white">{n}</span>
      <div className="min-w-0 flex-1">
        <b className="block text-sm tracking-wide text-emerald-800 uppercase">{p.titulo}</b>
        <div className="text-lg text-slate-800">{hecho(p)}</div>
      </div>
    </motion.li>
  )
}

/** La solución entera escrita, para enseñarla al corregir una pregunta de la prueba. */
export function Solucion({ problema }: { problema: ProblemaGuiado }) {
  return (
    <ol className="mt-2 space-y-1.5 text-base font-normal">
      {problema.pasos.map((p, i) => (
        <li key={i}>
          <b>
            {i + 1}. {p.titulo}:
          </b>{' '}
          {hecho(p)}
        </li>
      ))}
    </ol>
  )
}

/** El enunciado en un recuadro, con su dibujo. */
export function Enunciado({ problema }: { problema: ProblemaGuiado }) {
  return (
    <div className="space-y-3 rounded-2xl border-2 border-sky-200 bg-sky-50 p-4">
      <p className="text-xl leading-snug text-slate-800">{problema.enunciado}</p>
      {problema.visual && <div className="rounded-xl bg-white p-2">{problema.visual}</div>}
    </div>
  )
}

/** Un problema que se va destapando paso a paso, sin contestar (para Aprende). */
export function EjemploResuelto({ problema }: { problema: ProblemaGuiado }) {
  const [k, setK] = useState(0)
  const p = problema.pasos[k]
  return (
    <div className="space-y-3">
      <Enunciado problema={problema} />
      <ol className="space-y-2">
        {problema.pasos.slice(0, k).map((x, i) => (
          <PasoHecho key={i} p={x} n={i + 1} />
        ))}
      </ol>
      {p && (
        <>
          {p.visual && <div className="rounded-2xl border-2 border-violet-100 bg-white p-2">{p.visual}</div>}
          <button className="btn btn-primario min-h-12 w-full border-violet-600 bg-violet-600 text-lg hover:bg-violet-700" onClick={() => setK(k + 1)}>
            Ver el paso {k + 1}: {p.titulo} ↓
          </button>
        </>
      )}
      {!p && <p className="text-center text-lg font-bold text-emerald-700">✓ Problema resuelto</p>}
    </div>
  )
}

/** Un paso para contestar: elegir una opción o escribir un número. Al tercer fallo enseña la solución. */
function PasoActivo({ p, n, hecho: listo }: { p: Exclude<PasoGuiado, { tipo: 'info' }>; n: number; hecho: () => void }) {
  const opciones = useMemo(() => (p.tipo === 'elige' ? barallar([p.correcta, ...p.otras]) : []), [p])
  const [fallos, setFallos] = useState(0)
  const [mal, setMal] = useState<string | null>(null)
  const [campo, setCampo] = useState(0)
  function fallo(r: string) {
    setMal(r)
    setFallos(fallos + 1)
    setCampo(campo + 1)
  }
  const solucion = p.tipo === 'elige' ? p.correcta : `${num(p.valor)} ${p.unidad}`
  return (
    <div className="space-y-3 rounded-2xl border-2 border-violet-300 bg-white p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600 text-base font-black text-white">{n}</span>
        <b className="text-sm tracking-wide text-violet-800 uppercase">{p.titulo}</b>
      </div>
      {p.visual && <div className="rounded-xl bg-slate-50 p-2">{p.visual}</div>}
      <p className="text-xl font-bold text-slate-800">{p.pregunta}</p>
      {p.tipo === 'elige' ? (
        <div className="grid gap-2 sm:grid-cols-2">
          {opciones.map((o) => (
            <button
              key={o}
              onClick={() => (o === p.correcta ? listo() : fallo(o))}
              className={`min-h-14 cursor-pointer rounded-2xl border-2 px-4 py-2 text-left text-lg font-semibold ${mal === o ? 'border-rose-300 bg-rose-50 text-rose-900' : 'border-violet-200 bg-white hover:bg-violet-50'}`}
            >
              {o}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Campo key={campo} onEnviar={(t) => (numeroBen(t, p.valor, p.marxe ?? 0.02) ? listo() : fallo(t))} />
          </div>
          <span className="text-xl font-bold text-slate-600">{p.unidad}</span>
        </div>
      )}
      {mal !== null && (
        <Burbulla ton="mal">
          {fallos >= 3 ? (
            <>
              Es <b>{solucion}</b>.{' '}
              <button className="underline" onClick={listo}>
                Seguir →
              </button>
            </>
          ) : (
            <>
              {p.tipo === 'elige' ? `«${mal}» no.` : `${mal} no.`} {fallos === 2 ? 'Mira el paso anterior y el dibujo. Último intento.' : 'Inténtalo otra vez.'}
            </>
          )}
        </Burbulla>
      )}
    </div>
  )
}

/** Resuelve conmigo: una serie de problemas que se contestan paso a paso. */
export function ResuelveConmigo({ problemas, acabar }: { problemas: ProblemaGuiado[]; acabar: () => void }) {
  const [i, setI] = useState(0)
  const [k, setK] = useState(0)
  const pr = problemas[i]
  if (!pr) return <Burbulla ton="ben">¡Muy bien! Has resuelto todos los problemas paso a paso.</Burbulla>
  // Los pasos que solo se leen se dan por hechos en cuanto se llega a ellos.
  let actual = k
  while (pr.pasos[actual]?.tipo === 'info') actual++
  const p = pr.pasos[actual]
  const fin = !p
  return (
    <div className="space-y-3">
      <p className="text-center text-sm font-semibold text-slate-500">
        Problema {i + 1} de {problemas.length}
      </p>
      <Enunciado problema={pr} />
      <ol className="space-y-2">
        {pr.pasos.slice(0, actual).map((x, n) => (
          <PasoHecho key={n} p={x} n={n + 1} />
        ))}
      </ol>
      {p && p.tipo !== 'info' && <PasoActivo key={`${i}-${actual}`} p={p} n={actual + 1} hecho={() => setK(actual + 1)} />}
      {fin && (
        <>
          <Burbulla ton="ben">¡Resuelto! Así se escribe en el examen: datos, fórmula, sustitución y resultado con su unidad.</Burbulla>
          <button
            className="btn btn-primario min-h-14 w-full border-violet-600 bg-violet-600 text-xl hover:bg-violet-700"
            onClick={() => {
              setI(i + 1)
              setK(0)
              if (i + 1 === problemas.length) acabar()
            }}
          >
            {i + 1 === problemas.length ? 'Terminar' : 'Siguiente problema →'}
          </button>
        </>
      )}
    </div>
  )
}
