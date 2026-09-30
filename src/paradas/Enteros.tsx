import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Parada, { PasoAPaso, Tarjetas, type PropsParada, type Tarjeta } from '../componentes/Parada'
import Practica from '../componentes/Practica'
import { ent, leerEntero, Recta } from '../componentes/piezas'
import { ENTEROS, nuevaEnteros } from '../contenido/preguntas'

const ROJO = '#dc2626'
const AZUL = '#2563eb'
const VERDE = '#16a34a'

// Toca un número: se ve su distancia al 0 (valor absoluto) y su opuesto, al otro lado.
function RectaOpuesto({ inicial }: { inicial: number }) {
  const [a, setA] = useState(inicial)
  return (
    <>
      <div className="max-w-full overflow-x-auto">
        <Recta
          min={-10}
          max={10}
          elegir={setA}
          puntos={a === 0 ? [{ v: 0, color: AZUL }] : [{ v: a, color: AZUL }, { v: -a, color: VERDE, etq: 'opuesto' }]}
          saltos={a === 0 ? [] : [{ de: 0, a, color: AZUL }]}
        />
      </div>
      <p className="nota">
        Toca un número. |{ent(a)}| = <b>{Math.abs(a)}</b> (pasos hasta el 0) · op({ent(a)}) = <b>{ent(-a)}</b>
      </p>
    </>
  )
}

const TARJETAS: Tarjeta[] = [
  {
    titulo: 'Qué son los números enteros',
    texto: (
      <>
        <p>
          Los <b>números enteros</b> son los positivos (+1, +2, +3…), los negativos (−1, −2, −3…) y el cero. Se representan con la letra ℤ.
        </p>
        <p>Hacen falta para cosas de todos los días: temperaturas bajo cero, deudas, plantas de un garaje.</p>
        <p>En la recta, los positivos van a la derecha del 0 y los negativos a la izquierda.</p>
      </>
    ),
    visual: (
      <div className="max-w-full overflow-x-auto">
        <Recta min={-10} max={10} />
      </div>
    ),
  },
  {
    titulo: 'Valor absoluto: la distancia al 0',
    texto: (
      <>
        <p>
          El <b>valor absoluto</b> de un número, |a|, es su distancia al 0. Como es una distancia, nunca es negativo.
        </p>
        <p>En la práctica es el número sin el signo: |+4| = 4 y |−6| = 6.</p>
      </>
    ),
    visual: <RectaOpuesto inicial={-6} />,
  },
  {
    titulo: 'Opuesto: el del otro lado',
    texto: (
      <>
        <p>
          El <b>opuesto</b> de un número, op(a), tiene el mismo valor absoluto y el signo contrario. Está a la misma distancia del 0, pero al otro lado.
        </p>
        <p>op(4) = −4 y op(−6) = +6. El único número que coincide con su opuesto es el 0.</p>
      </>
    ),
    visual: <RectaOpuesto inicial={4} />,
  },
  {
    titulo: 'Ordenar: más a la derecha, mayor',
    texto: (
      <>
        <p>Un número es mayor que otro si está más a la derecha en la recta.</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Cualquier positivo es mayor que cualquier negativo.</li>
          <li>El 0 es mayor que los negativos y menor que los positivos.</li>
          <li>
            Entre dos negativos es mayor el de <b>menor</b> valor absoluto: −2 es mayor que −9.
          </li>
        </ul>
      </>
    ),
    visual: (
      <>
        <div className="max-w-full overflow-x-auto">
          <Recta min={-10} max={10} puntos={[{ v: -9, color: ROJO, etq: '−9' }, { v: -2, color: ROJO, etq: '−2' }, { v: 3, color: AZUL, etq: '3' }]} />
        </div>
        <p className="text-xl font-bold">−9 &lt; −2 &lt; 3</p>
      </>
    ),
  },
]

// Coloca dos números en la recta y compara: cuál es mayor, valor absoluto y opuesto de cada uno.
function Probar() {
  const [a, setA] = useState(-7)
  const [b, setB] = useState(3)
  const [mueve, setMueve] = useState<'a' | 'b'>('a')
  const menor = Math.min(a, b)
  const mayor = Math.max(a, b)

  function elegir(v: number) {
    if (mueve === 'a') setA(v)
    else setB(v)
    setMueve(mueve === 'a' ? 'b' : 'a')
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">Coloca dos números y compáralos</h2>
      <p className="text-lg">
        Toca la recta para mover <b style={{ color: mueve === 'a' ? ROJO : AZUL }}>{mueve === 'a' ? 'A' : 'B'}</b>. Se van turnando.
      </p>
      <div className="lienzo">
        <div className="max-w-full overflow-x-auto">
          <Recta min={-12} max={12} elegir={elegir} puntos={[{ v: a, color: ROJO, etq: 'A' }, ...(b === a ? [] : [{ v: b, color: AZUL, etq: 'B' }])]} />
        </div>
      </div>

      <motion.p key={`${a},${b}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-center text-3xl font-bold">
        {a === b ? `${ent(a)} = ${ent(b)}` : `${ent(menor)} < ${ent(mayor)}`}
      </motion.p>
      <p className="text-center text-lg">
        {a === b ? 'Son el mismo número.' : `${ent(mayor)} es mayor porque está más a la derecha en la recta.`}
        {a < 0 && b < 0 && a !== b && ` Los dos son negativos: es mayor el de menor valor absoluto (${Math.abs(mayor)} < ${Math.abs(menor)}).`}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {[
          ['A', a, ROJO] as const,
          ['B', b, AZUL] as const,
        ].map(([nombre, v, color]) => (
          <div key={nombre} className="rounded-2xl border border-slate-200 bg-white p-4 text-lg">
            <b style={{ color }}>
              {nombre} = {ent(v)}
            </b>
            <p>
              Valor absoluto: |{ent(v)}| = <b>{Math.abs(v)}</b>
            </p>
            <p>
              Opuesto: op({ent(v)}) = <b>{ent(-v)}</b>
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

const EJEMPLOS = [
  [-38, -500, 37, -39, 10, 22, -499],
  [-13, 12, 20, -2, -14, -5, 6, 0],
  [-2, 7, 3, -6, 0, 8, -5],
]

function Fichas({ nums, color }: { nums: number[]; color?: string }) {
  return (
    <div className="flex min-h-11 flex-wrap items-center gap-2">
      {nums.map((n) => (
        <motion.span key={n} layout layoutId={`f${n}`} className="rounded-xl px-3 py-1.5 text-lg font-bold text-white" style={{ background: color ?? (n < 0 ? ROJO : n > 0 ? AZUL : '#475569') }}>
          {ent(n)}
        </motion.span>
      ))}
    </div>
  )
}

function Desmenuzar() {
  const [nums, setNums] = useState(EJEMPLOS[0])
  const [k, setK] = useState(0)
  const [otro, setOtro] = useState('')
  const neg = nums.filter((n) => n < 0)
  const pos = nums.filter((n) => n > 0)
  const cero = nums.filter((n) => n === 0)
  const negOrd = [...neg].sort((a, b) => a - b)
  const posOrd = [...pos].sort((a, b) => a - b)

  function verOtro(ev: FormEvent) {
    ev.preventDefault()
    const leidos = otro.split(/[\s,;]+/).filter(Boolean).map(leerEntero)
    const unicos = [...new Set(leidos)]
    if (unicos.length >= 3 && unicos.length <= 9 && unicos.every((n): n is number => n !== null)) {
      setNums(unicos)
      setK(0)
      setOtro('')
    }
  }

  const PASOS = [
    ['Los números, tal como vienen', 'Hay que ordenarlos de menor a mayor. No hace falta dibujar la recta: basta con tres ideas.'],
    ['Separar negativos, cero y positivos', 'Cualquier negativo es menor que el 0, y el 0 es menor que cualquier positivo. Así que los negativos van todos antes.'],
    ['Ordenar los negativos', 'Entre negativos es menor el que tiene mayor valor absoluto, porque está más lejos del 0 por la izquierda. Se ordenan «al revés» de como lo harías sin el signo.'],
    ['Ordenar los positivos', 'Entre positivos es mayor el que tiene mayor valor absoluto, como siempre.'],
    ['Juntar', 'Primero los negativos, luego el 0 si está, y después los positivos.'],
  ]

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">Ordenar enteros, paso a paso</h2>
      <div className="flex flex-wrap items-center gap-2">
        {EJEMPLOS.map((e, i) => (
          <button
            key={i}
            className={`btn ${e === nums ? 'btn-activo' : ''}`}
            onClick={() => {
              setNums(e)
              setK(0)
            }}
          >
            Ejemplo {i + 1}
          </button>
        ))}
        <form onSubmit={verOtro} className="flex items-center gap-2">
          <input className="campo w-52 text-left" placeholder="otros: -4, 7, -12, 0" aria-label="Otros números" value={otro} onChange={(e) => setOtro(e.target.value)} />
          <button className="btn">Ver</button>
        </form>
      </div>

      <div className="lienzo items-start">
        {k === 0 && <Fichas nums={nums} />}
        {k >= 1 && k <= 3 && (
          <>
            <Fichas nums={k >= 2 ? negOrd : neg} />
            <Fichas nums={cero} />
            <Fichas nums={k >= 3 ? posOrd : pos} />
          </>
        )}
        {k === 4 && (
          <>
            <Fichas nums={[...negOrd, ...cero, ...posOrd]} />
            <p className="text-xl font-bold">{[...negOrd, ...cero, ...posOrd].map(ent).join('  <  ')}</p>
          </>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={k} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="min-h-24 space-y-1 text-lg leading-relaxed">
          <h3 className="font-bold">{PASOS[k][0]}</h3>
          <p>{PASOS[k][1]}</p>
          {k === 2 && negOrd.length > 1 && (
            <p>
              Aquí: |{ent(negOrd[0])}| = {Math.abs(negOrd[0])} es el mayor valor absoluto, así que {ent(negOrd[0])} es el más pequeño.
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      <PasoAPaso k={k} total={4} setK={setK} />
    </section>
  )
}

export default function Enteros({ modo, progreso, apuntar }: PropsParada) {
  return (
    <Parada
      id="enteros"
      titulo="Los números enteros"
      modo={modo}
      paneles={{
        entender: <Tarjetas tarjetas={TARJETAS} parada="enteros" />,
        probar: <Probar />,
        desmenuzar: <Desmenuzar />,
        practicar: <Practica clase={ENTEROS} generar={nuevaEnteros} progreso={progreso} apuntar={apuntar} />,
      }}
    />
  )
}
