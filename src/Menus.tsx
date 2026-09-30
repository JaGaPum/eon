// Menús de entrada: curso → materia → lección. El aspecto es el de un viaje por el espacio y el tiempo.
import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { CURSOS, type Curso, type Materia } from './contenido/catalogo'

export function Logo({ grande }: { grande?: boolean }) {
  const lado = grande ? 72 : 36
  return (
    <svg viewBox="0 0 64 64" width={lado} height={lado} aria-hidden="true">
      <defs>
        <linearGradient id="eon-planeta" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a5b4fc" />
          <stop offset="1" stopColor="#c026d3" />
        </linearGradient>
      </defs>
      <ellipse cx="32" cy="32" rx="29" ry="10" fill="none" stroke="#fde68a" strokeWidth="3" transform="rotate(-24 32 32)" opacity="0.55" />
      <circle cx="32" cy="32" r="15" fill="url(#eon-planeta)" />
      <path d="M 5.5 43.8 A 29 10 -24 0 0 58.5 20.2" fill="none" stroke="#fde68a" strokeWidth="3" strokeLinecap="round" />
      <circle cx="58.5" cy="20.2" r="3.5" fill="#fff" />
    </svg>
  )
}

interface Tarjeta {
  href?: string
  icono: string
  titulo: string
  detalle: string
  estado?: ReactNode
}

function Rejilla({ tarjetas }: { tarjetas: Tarjeta[] }) {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2">
      {tarjetas.map((t, i) => {
        const dentro = (
          <>
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10 text-3xl" aria-hidden="true">
              {t.icono}
            </span>
            <span className="flex min-w-0 flex-col">
              <b className="text-lg text-white">{t.titulo}</b>
              <span className="text-sm text-indigo-200">{t.detalle}</span>
              {t.estado && <span className="mt-1 text-sm font-semibold text-amber-200">{t.estado}</span>}
            </span>
          </>
        )
        return t.href ? (
          <motion.a
            key={t.titulo}
            href={t.href}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ y: -4 }}
            className="cristal flex items-center gap-4 border-indigo-300/50 p-4 hover:bg-white/[0.12]"
          >
            {dentro}
          </motion.a>
        ) : (
          <motion.div
            key={t.titulo}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 0.55, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="cristal flex items-center gap-4 border-dashed p-4"
          >
            {dentro}
          </motion.div>
        )
      })}
    </div>
  )
}

export function Cursos() {
  return (
    <>
      <div className="flex flex-col items-center gap-2 pt-6 text-center">
        <motion.div animate={{ rotate: [0, 6, -6, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}>
          <Logo grande />
        </motion.div>
        <h1 className="bg-gradient-to-r from-indigo-200 via-white to-fuchsia-200 bg-clip-text text-6xl font-black tracking-tight text-transparent">Eón</h1>
        <p className="text-lg text-indigo-200">Un viaje por el conocimiento, a través del espacio y del tiempo.</p>
      </div>
      <h2 className="mt-10 text-sm font-bold tracking-widest text-indigo-300 uppercase">Elige tu curso</h2>
      <Rejilla
        tarjetas={CURSOS.map((c) => ({
          href: c.materias.length ? `#/${c.id}` : undefined,
          icono: c.icono,
          titulo: c.nombre,
          detalle: c.era,
          estado: c.materias.length ? undefined : 'Próximamente',
        }))}
      />
    </>
  )
}

export function Materias({ curso }: { curso: Curso }) {
  return (
    <>
      <h1 className="text-3xl font-bold text-white">{curso.nombre}</h1>
      <p className="mt-1 text-indigo-200">{curso.era}. Cada materia es un mundo: elige a cuál viajamos.</p>
      <Rejilla
        tarjetas={curso.materias.map((m) => ({
          href: m.lecciones.length ? `#/${curso.id}/${m.id}` : undefined,
          icono: m.icono,
          titulo: m.nombre,
          detalle: m.lecciones.length === 0 ? 'Aún sin explorar' : m.lecciones.length === 1 ? '1 lección' : `${m.lecciones.length} lecciones`,
        }))}
      />
    </>
  )
}

export function Lecciones({ curso, materia, avance }: { curso: Curso; materia: Materia; avance: (leccion: string) => string }) {
  return (
    <>
      <h1 className="text-3xl font-bold text-white">
        <span aria-hidden="true">{materia.icono}</span> {materia.nombre}
      </h1>
      <p className="mt-1 text-indigo-200">{curso.nombre}. Cada lección es una misión.</p>
      <Rejilla
        tarjetas={materia.lecciones.map((l, i) => ({
          href: `#/${curso.id}/${materia.id}/${l.id}`,
          icono: String(i + 1),
          titulo: l.titulo,
          detalle: l.resumen,
          estado: avance(l.id),
        }))}
      />
      <p className="mt-6 text-sm text-indigo-300">Las siguientes lecciones aparecerán aquí a medida que se añadan.</p>
    </>
  )
}
