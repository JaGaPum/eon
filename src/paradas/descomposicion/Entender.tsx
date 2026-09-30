import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { descomponer, divisores, esPrimo, factores } from '../../lib/mates'
import { Arbol, Columna, Fichas, Resultado } from '../../componentes/visuales'
import { RUTA_TEMA1 } from '../../contenido/catalogo'

const PASOS_56 = descomponer(56)

// Toca un número y ve sus divisores: así se ve qué hace primo a un primo.
function Criba() {
  const [sel, setSel] = useState(12)
  const d = divisores(sel)
  const clase = sel === 1 ? 'ni primo ni compuesto' : d.length === 2 ? 'primo' : 'compuesto'
  return (
    <>
      <div className="grid grid-cols-10 gap-1">
        {Array.from({ length: 50 }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            onClick={() => setSel(n)}
            className={`h-9 w-9 cursor-pointer rounded-lg text-sm font-semibold ${
              esPrimo(n) ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
            } ${n === sel ? 'ring-4 ring-amber-400' : ''}`}
          >
            {n}
          </button>
        ))}
      </div>
      <p className="nota">
        Divisores de <b>{sel}</b>: {d.join(', ')}. Es <b>{clase}</b>.
      </p>
    </>
  )
}

const TARJETAS: { titulo: string; texto: ReactNode; visual: ReactNode }[] = [
  {
    titulo: 'Primos y compuestos',
    texto: (
      <>
        <p>
          Un número es <b>primo</b> si solo tiene dos divisores: el 1 y él mismo. Es <b>compuesto</b> si tiene más de dos. El 1 no es ni
          primo ni compuesto.
        </p>
        <p>Toca un número para ver sus divisores. Los primos están resaltados.</p>
      </>
    ),
    visual: <Criba />,
  },
  {
    titulo: 'La idea: romper el número',
    texto: (
      <>
        <p>
          Cualquier número compuesto se puede romper en trozos más pequeños que, multiplicados, vuelven a darlo. Si sigues rompiendo, llega
          un momento en que todos los trozos son <b>primos</b> y ya no se pueden romper más.
        </p>
        <p>
          Esos primos son la <b>descomposición factorial</b> del número.
        </p>
      </>
    ),
    visual: (
      <>
        <Arbol filas={PASOS_56} resto={1} />
        <p className="nota">56 = 2 · 28 → 28 = 2 · 14 → 14 = 2 · 7. Los de color son primos.</p>
      </>
    ),
  },
  {
    titulo: 'Los tres pasos',
    texto: (
      <>
        <ol className="list-decimal space-y-1 pl-5">
          <li>Se busca un divisor primo del número. Conviene empezar por los primos más pequeños.</li>
          <li>Se divide el número entre ese primo.</li>
          <li>Se repite con el cociente hasta que el cociente sea 1.</li>
        </ol>
        <p>Se escribe en columna: a la izquierda los cocientes y a la derecha los primos.</p>
      </>
    ),
    visual: (
      <>
        <Columna filas={PASOS_56} resto={1} />
        <p className="nota">56 : 2 = 28 · 28 : 2 = 14 · 14 : 2 = 7 · 7 : 7 = 1</p>
      </>
    ),
  },
  {
    titulo: 'Se escribe con potencias',
    texto: (
      <>
        <p>
          Los primos que se repiten se agrupan en una potencia: el exponente dice <b>cuántas veces</b> aparece el primo.
        </p>
        <p>
          Ojo: 2<sup>3</sup> es 2 · 2 · 2 = 8, no 2 · 3.
        </p>
        <p>Esta forma es la que usarás después para el m.c.d. y el m.c.m.</p>
      </>
    ),
    visual: (
      <>
        <Fichas primos={factores(56)} />
        <Resultado n={56} primos={factores(56)} />
      </>
    ),
  },
]

export default function Entender() {
  const [i, setI] = useState(0)
  const t = TARJETAS[i]

  return (
    <section>
      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.18 }}>
          <h2 className="mb-3 text-xl font-bold">{t.titulo}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3 text-lg leading-relaxed">{t.texto}</div>
            <div className="lienzo">{t.visual}</div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-5 flex items-center justify-between">
        <button className="btn" disabled={i === 0} onClick={() => setI(i - 1)}>
          ← Atrás
        </button>
        <span className="text-sm text-slate-500">
          {i + 1} de {TARJETAS.length}
        </span>
        {i < TARJETAS.length - 1 ? (
          <button className="btn btn-primario" onClick={() => setI(i + 1)}>
            Siguiente →
          </button>
        ) : (
          <a className="btn btn-primario" href={`${RUTA_TEMA1}/descomposicion/probar`}>
            Pruébalo tú →
          </a>
        )}
      </div>
    </section>
  )
}
