// Calendario del curso: un mes con los días de examen marcados y, debajo, las próximas tareas con lo que falta.
import { useState } from 'react'
import type { Curso } from '../contenido/catalogo'
import { dia, diasHasta, faltan, hoy, type Tarefa } from '../contenido/tarefas'

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
const DIAS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo']
const clave = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const fechaLarga = (f: string) => {
  const d = dia(f)
  return `${DIAS[(d.getDay() + 6) % 7]} ${d.getDate()} de ${MESES[d.getMonth()]}`
}

function Mes({ tarefas, curso }: { tarefas: Tarefa[]; curso: Curso }) {
  const [desfase, setDesfase] = useState(0)
  const h = hoy()
  const primero = new Date(h.getFullYear(), h.getMonth() + desfase, 1)
  const dias = new Date(primero.getFullYear(), primero.getMonth() + 1, 0).getDate()
  const hueco = (primero.getDay() + 6) % 7
  const porDia = new Map<string, Tarefa[]>()
  for (const t of tarefas) porDia.set(t.fecha, [...(porDia.get(t.fecha) ?? []), t])
  const [elegido, setElegido] = useState<string | null>(null)
  const delDia = elegido ? (porDia.get(elegido) ?? []) : []

  return (
    <div className="cristal min-w-0 p-4">
      <div className="mb-3 flex items-center justify-between">
        <button className="cursor-pointer rounded-lg px-3 py-1 text-xl text-white hover:bg-white/10" onClick={() => setDesfase(desfase - 1)} aria-label="Mes anterior">
          ‹
        </button>
        <b className="text-lg text-white capitalize">
          {MESES[primero.getMonth()]} {primero.getFullYear()}
        </b>
        <button className="cursor-pointer rounded-lg px-3 py-1 text-xl text-white hover:bg-white/10" onClick={() => setDesfase(desfase + 1)} aria-label="Mes siguiente">
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-indigo-300">
        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {Array.from({ length: hueco }, (_, i) => (
          <span key={`h${i}`} />
        ))}
        {Array.from({ length: dias }, (_, i) => {
          const d = new Date(primero.getFullYear(), primero.getMonth(), i + 1)
          const k = clave(d)
          const ts = porDia.get(k)
          const esHoy = k === clave(h)
          const examen = ts?.some((t) => t.tipo === 'examen')
          return (
            <button
              key={k}
              disabled={!ts}
              onClick={() => setElegido(elegido === k ? null : k)}
              className={`relative flex h-10 items-center justify-center rounded-lg text-sm font-semibold ${
                ts ? (examen ? 'cursor-pointer bg-rose-500/80 text-white hover:bg-rose-500' : 'cursor-pointer bg-amber-400/80 text-slate-900 hover:bg-amber-400') : 'text-indigo-100'
              } ${esHoy ? 'ring-2 ring-white' : ''} ${elegido === k ? 'outline-2 outline-offset-1 outline-white' : ''} ${d < h && !ts ? 'opacity-40' : ''}`}
              aria-label={`${i + 1}${ts ? `: ${ts.map((t) => t.titulo).join(', ')}` : ''}`}
            >
              {i + 1}
            </button>
          )
        })}
      </div>
      <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-indigo-200">
        <span>
          <span className="mr-1 inline-block h-3 w-3 rounded bg-rose-500/80 align-middle" /> Examen
        </span>
        <span>
          <span className="mr-1 inline-block h-3 w-3 rounded bg-amber-400/80 align-middle" /> Recordatorio
        </span>
        <span>
          <span className="mr-1 inline-block h-3 w-3 rounded ring-2 ring-white align-middle" /> Hoy
        </span>
      </p>
      {delDia.length > 0 && (
        <div className="mt-3 space-y-1 rounded-xl bg-white/10 p-3 text-white">
          <b className="capitalize">{fechaLarga(elegido!)}</b>
          {delDia.map((t) => (
            <p key={t.titulo}>
              {t.tipo === 'examen' ? '📝' : '🔔'} {curso.materias.find((m) => m.id === t.materia)?.nombre}: {t.titulo}
              {t.nota && <span className="block pl-6 text-sm text-indigo-200">{t.nota}</span>}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

/** Lista de lo que viene, como en Abalar, con lo que falta y un acceso para estudiar si hay lección. */
function Proximas({ tarefas, curso }: { tarefas: Tarefa[]; curso: Curso }) {
  const vienen = tarefas.filter((t) => diasHasta(t.fecha) >= 0).sort((a, b) => a.fecha.localeCompare(b.fecha))
  if (!vienen.length) return <p className="text-indigo-200">No hay exámenes ni tareas apuntados.</p>
  return (
    <div className="min-w-0 space-y-2">
      {vienen.map((t) => {
        const m = curso.materias.find((x) => x.id === t.materia)
        const n = diasHasta(t.fecha)
        return (
          <div key={t.fecha + t.titulo} className={`cristal flex items-center gap-3 p-3 ${n <= 2 && t.tipo === 'examen' ? 'border-rose-300/70' : 'border-indigo-300/30'}`}>
            <span className="text-3xl" aria-hidden="true">
              {m?.icono ?? '📚'}
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-xs font-bold tracking-wide break-words text-indigo-300 uppercase">
                {t.tipo === 'examen' ? 'Examen' : 'Recordatorio'} · {m?.nombre ?? t.materia}
              </span>
              <b className="text-white">{t.titulo}</b>
              <span className="text-sm text-indigo-200 first-letter:uppercase">{fechaLarga(t.fecha)}</span>
              {t.nota && <span className="mt-1 rounded-lg bg-white/10 px-2 py-1 text-sm text-white">📌 {t.nota}</span>}
            </span>
            <span className="flex flex-col items-end gap-1">
              <span className={`rounded-full px-3 py-1 text-sm font-bold whitespace-nowrap ${n <= 1 ? 'bg-rose-500 text-white' : n <= 3 ? 'bg-amber-400 text-slate-900' : 'bg-white/15 text-white'}`}>{faltan(t.fecha)}</span>
              {t.leccion && m && (
                <a href={`#/${curso.id}/${m.id}/${t.leccion}`} className="rounded-full bg-indigo-500 px-3 py-1 text-sm font-bold whitespace-nowrap text-white hover:bg-indigo-400">
                  Estudiar →
                </a>
              )}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export function Calendario({ tarefas, curso }: { tarefas: Tarefa[]; curso: Curso }) {
  return (
    <section className="mt-6">
      <h2 className="mb-3 text-sm font-bold tracking-widest text-indigo-300 uppercase">Exámenes y tareas</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1.2fr]">
        <Mes tarefas={tarefas} curso={curso} />
        <Proximas tarefas={tarefas} curso={curso} />
      </div>
    </section>
  )
}
