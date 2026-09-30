import { useState } from 'react'
import { motion } from 'motion/react'
import Parada, { Tarjetas, type PropsParada, type Tarjeta } from '../componentes/Parada'
import Practica from '../componentes/Practica'
import { DesmenuzaExpr } from '../componentes/expresiones'
import { Aviso, type Mensaje } from '../componentes/visuales'
import { Contador, ent, entP, Recta } from '../componentes/piezas'
import { nuevaSumas, SUMAS } from '../contenido/preguntas'

const ROJO = '#dc2626'
const AZUL = '#2563eb'
const VERDE = '#16a34a'

/** Una suma o resta dibujada como un salto en la recta: a la derecha si se suma, a la izquierda si se resta. */
function Salto({ a, op, b }: { a: number; op: '+' | '-'; b: number }) {
  const paso = op === '+' ? b : -b
  const r = a + paso
  const lim = Math.max(10, Math.abs(a), Math.abs(r)) + 1
  return (
    <div className="max-w-full overflow-x-auto">
      <Recta
        min={-lim}
        max={lim}
        puntos={[{ v: a, color: '#475569', etq: r === a ? undefined : 'sales' }, ...(r === a ? [] : [{ v: r, color: VERDE, etq: 'llegas' }])]}
        saltos={paso === 0 ? [] : [{ de: a, a: r, color: paso > 0 ? AZUL : ROJO }]}
      />
    </div>
  )
}

const TARJETAS: Tarjeta[] = [
  {
    titulo: 'Sumar enteros del mismo signo',
    texto: (
      <>
        <p>
          Se suman los valores absolutos y se deja <b>el mismo signo</b>.
        </p>
        <p className="text-xl font-bold">(−10) + (−9) = −19</p>
        <p>En la recta: estás en −10 y sumar −9 es dar 9 pasos más hacia la izquierda.</p>
      </>
    ),
    visual: <Salto a={-4} op="+" b={-5} />,
  },
  {
    titulo: 'Sumar enteros de distinto signo',
    texto: (
      <>
        <p>
          Se restan los valores absolutos y se deja el signo <b>del que tiene mayor valor absoluto</b>.
        </p>
        <p className="text-xl font-bold">(−10) + (+9) = −(10 − 9) = −1</p>
        <p>Es como una deuda de 10 y 9 euros en el bolsillo: sigues debiendo 1.</p>
      </>
    ),
    visual: <Salto a={-8} op="+" b={5} />,
  },
  {
    titulo: 'Restar es sumar el opuesto',
    texto: (
      <>
        <p>Para restar un entero se suma su opuesto.</p>
        <p className="text-xl font-bold">(−10) − (+9) = (−10) + (−9) = −19</p>
        <p className="text-xl font-bold">3 − (−4) = 3 + 4 = 7</p>
        <p>Restar un negativo es avanzar hacia la derecha: quitar una deuda te deja con más.</p>
      </>
    ),
    visual: <Salto a={3} op="-" b={-4} />,
  },
  {
    titulo: 'Quitar paréntesis',
    texto: (
      <>
        <p>Cuando dentro de un paréntesis solo hay sumas y restas, se puede quitar mirando el signo que tiene delante:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Delante hay un <b>+</b>: los sumandos <b>conservan</b> su signo.
          </li>
          <li>
            Delante hay un <b>−</b>: <b>todos</b> los sumandos cambian de signo.
          </li>
        </ul>
        <p>El fallo más habitual es cambiar solo el primero.</p>
      </>
    ),
    visual: (
      <p className="text-center text-xl leading-loose font-bold">
        −33 − (28 − 45 + 49)
        <br />= −33 <span className="bg-amber-200">− 28 + 45 − 49</span>
        <br />= −65
      </p>
    ),
  },
]

interface Reto {
  a: number
  delante: 1 | -1
  terminos: number[]
}

function nuevoReto(): Reto {
  const n = () => (Math.random() < 0.5 ? -1 : 1) * (1 + Math.floor(Math.random() * 20))
  return { a: n(), delante: Math.random() < 0.7 ? -1 : 1, terminos: [Math.abs(n()), n(), n()] }
}

// Dos experimentos: ver una suma o resta en la recta, y quitar un paréntesis eligiendo el signo de cada sumando.
function Probar() {
  const [a, setA] = useState(3)
  const [b, setB] = useState(-4)
  const [op, setOp] = useState<'+' | '-'>('-')
  const r = op === '+' ? a + b : a - b
  const equivalente = op === '+' ? (b < 0 ? `${ent(a)} − ${-b}` : null) : b < 0 ? `${ent(a)} + ${-b}` : null

  const [reto, setReto] = useState(nuevoReto)
  const [signos, setSignos] = useState<(1 | -1 | 0)[]>([0, 0, 0])
  const [msg, setMsg] = useState<Mensaje | null>(null)
  const [intentos, setIntentos] = useState(0)
  const dentro = reto.terminos.map((t, i) => (i === 0 ? ent(t) : `${t < 0 ? '−' : '+'} ${Math.abs(t)}`)).join(' ')

  function comprobar() {
    const buenos = reto.terminos.map((t) => (Math.sign(t) * reto.delante) as 1 | -1)
    const fallos = signos.filter((s, i) => s !== buenos[i]).length
    setIntentos(intentos + 1)
    if (signos.includes(0)) setMsg({ tipo: 'mal', texto: 'Toca cada hueco para elegir su signo.' })
    else if (!fallos) setMsg({ tipo: 'bien', texto: reto.delante < 0 ? '¡Bien! Delante había un −: han cambiado todos los signos.' : '¡Bien! Delante había un +: todos conservan su signo.' })
    else
      setMsg({
        tipo: 'mal',
        texto: `Hay ${fallos} ${fallos > 1 ? 'signos' : 'signo'} mal. Delante del paréntesis hay un ${reto.delante < 0 ? '−: todos los sumandos cambian de signo, no solo el primero' : '+: todos conservan su signo'}. Recuerda que el primero, ${reto.terminos[0]}, es positivo aunque no lleve el + escrito.`,
      })
  }

  function otro() {
    setReto(nuevoReto())
    setSignos([0, 0, 0])
    setMsg(null)
  }

  return (
    <section className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-bold">1. Una suma o una resta es un salto en la recta</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Contador valor={a} cambiar={setA} min={-10} max={10} etiqueta="primer número" />
          <button className="btn w-14 text-2xl" onClick={() => setOp(op === '+' ? '-' : '+')} aria-label="Cambiar entre suma y resta">
            {op === '+' ? '+' : '−'}
          </button>
          <Contador valor={b} cambiar={setB} min={-10} max={10} etiqueta="segundo número" />
        </div>
        <div className="lienzo">
          <Salto a={a} op={op} b={b} />
        </div>
        <motion.p key={`${a}${op}${b}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-center text-2xl font-bold">
          {ent(a)} {op === '+' ? '+' : '−'} {entP(b)} {equivalente && <>= {equivalente} </>}= {ent(r)}
        </motion.p>
        <p className="text-center text-lg">
          {b === 0
            ? 'Sumar o restar 0 no mueve nada.'
            : op === '+'
              ? b > 0
                ? `Sumar un positivo: ${b} pasos a la derecha.`
                : `Sumar un negativo es restar: ${-b} pasos a la izquierda.`
              : b > 0
                ? `Restar un positivo: ${b} pasos a la izquierda.`
                : `Restar un negativo es sumar su opuesto: ${-b} pasos a la derecha.`}
        </p>
      </div>

      <div className="space-y-4 border-t border-slate-200 pt-5">
        <h2 className="text-xl font-bold">2. Quita el paréntesis</h2>
        <p className="text-lg">Toca cada hueco para elegir el signo que le queda a cada sumando.</p>
        <div className="lienzo">
          <p className="text-2xl font-bold whitespace-nowrap">
            {ent(reto.a)} {reto.delante < 0 ? '−' : '+'} ({dentro})
          </p>
          <p className="flex flex-wrap items-center justify-center gap-2 text-2xl font-bold">
            = {ent(reto.a)}
            {reto.terminos.map((t, i) => (
              <span key={i} className="flex items-center gap-1">
                <button
                  className={`btn w-12 px-0 text-2xl ${signos[i] === 0 ? 'border-dashed text-slate-400' : 'btn-activo'}`}
                  onClick={() => setSignos(signos.map((s, j) => (j === i ? (s === 1 ? -1 : 1) : s)))}
                  aria-label={`Signo del sumando ${Math.abs(t)}`}
                >
                  {signos[i] === 0 ? '?' : signos[i] === 1 ? '+' : '−'}
                </button>
                {Math.abs(t)}
              </span>
            ))}
          </p>
        </div>
        <Aviso msg={msg} clave={intentos} />
        <div className="flex gap-2">
          <button className="btn btn-primario" onClick={comprobar}>
            Comprobar
          </button>
          <button className="btn" onClick={otro}>
            Otro paréntesis
          </button>
        </div>
      </div>
    </section>
  )
}

const EJEMPLOS = [
  '(-33) - (28 - 45 + 49)',
  '(-12) + (-5) - (-7) + (-10)',
  '120 - (16 - 5) - [38 - (-6)]',
  '-40 - (-20 - 33 + 15) - (-80) + (13 - 91)',
  '25 + (41 - 25) - [16 - (-25) - 4]',
]

export default function Sumas({ modo, progreso, apuntar }: PropsParada) {
  return (
    <Parada
      id="sumas"
      titulo="Sumas y restas de enteros"
      modo={modo}
      paneles={{
        entender: <Tarjetas tarjetas={TARJETAS} parada="sumas" />,
        probar: <Probar />,
        desmenuzar: <DesmenuzaExpr ejemplos={EJEMPLOS} modo="quitar" />,
        practicar: <Practica clase={SUMAS} generar={nuevaSumas} progreso={progreso} apuntar={apuntar} />,
      }}
    />
  )
}
