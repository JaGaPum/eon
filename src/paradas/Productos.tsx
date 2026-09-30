import { useState } from 'react'
import { motion } from 'motion/react'
import Parada, { Tarjetas, type PropsParada, type Tarjeta } from '../componentes/Parada'
import Practica from '../componentes/Practica'
import { DesmenuzaExpr } from '../componentes/expresiones'
import { Contador, ent, entP } from '../componentes/piezas'
import { nuevaProductos, PRODUCTOS } from '../contenido/preguntas'

const SIG = (positivo: boolean) => (positivo ? '+' : '−')

/** La tabla de la regla de los signos, con la casilla que se está usando resaltada. */
function TablaSignos({ a, b, simbolo }: { a?: boolean; b?: boolean; simbolo: string }) {
  return (
    <table className="border-collapse text-center text-2xl font-bold">
      <tbody>
        {[true, false].map((fa) =>
          [true, false].map((fb) => {
            const activa = a === fa && b === fb
            return (
              <tr key={`${fa}${fb}`} className={activa ? 'bg-amber-200' : undefined}>
                <td className="px-3 py-1">{SIG(fa)}</td>
                <td className="px-2 py-1 text-slate-400">{simbolo}</td>
                <td className="px-3 py-1">{SIG(fb)}</td>
                <td className="px-2 py-1 text-slate-400">=</td>
                <td className={`px-3 py-1 ${fa === fb ? 'text-blue-600' : 'text-red-600'}`}>{SIG(fa === fb)}</td>
              </tr>
            )
          }),
        )}
      </tbody>
    </table>
  )
}

const TARJETAS: Tarjeta[] = [
  {
    titulo: 'La regla de los signos',
    texto: (
      <>
        <p>Para multiplicar o dividir enteros, el signo del resultado solo depende de si los dos signos son iguales o distintos:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Signos <b>iguales</b>: resultado <b>positivo</b>.
          </li>
          <li>
            Signos <b>distintos</b>: resultado <b>negativo</b>.
          </li>
        </ul>
        <p>Vale igual para la multiplicación y para la división.</p>
      </>
    ),
    visual: <TablaSignos simbolo="·" />,
  },
  {
    titulo: 'Multiplicar: primero el número, luego el signo',
    texto: (
      <>
        <ol className="list-decimal space-y-1 pl-5">
          <li>Se multiplican los valores absolutos.</li>
          <li>Se pone el signo con la regla.</li>
        </ol>
        <p className="text-xl font-bold">(−4) · (+3) = −12</p>
        <p className="text-xl font-bold">(−4) · (−3) = +12</p>
      </>
    ),
    visual: <TablaSignos a={false} b={false} simbolo="·" />,
  },
  {
    titulo: 'Dividir: exactamente igual',
    texto: (
      <>
        <ol className="list-decimal space-y-1 pl-5">
          <li>Se dividen los valores absolutos.</li>
          <li>Se pone el signo con la misma regla.</li>
        </ol>
        <p className="text-xl font-bold">(−30) : (−6) = +5</p>
        <p className="text-xl font-bold">(+28) : (−7) = −4</p>
      </>
    ),
    visual: <TablaSignos a={true} b={false} simbolo=":" />,
  },
  {
    titulo: 'Cadenas: de izquierda a derecha',
    texto: (
      <>
        <p>Cuando hay varias multiplicaciones y divisiones seguidas, se hacen en orden, de izquierda a derecha.</p>
        <p>
          Truco para no liarse con el signo: <b>cuenta los negativos</b>. Si hay un número par, el resultado es positivo; si es impar, negativo.
        </p>
      </>
    ),
    visual: (
      <p className="text-center text-xl leading-loose font-bold">
        24 : (−3) · (+5) · (−2)
        <br />= (−8) · (+5) · (−2)
        <br />= (−40) · (−2)
        <br />= 80
      </p>
    ),
  },
]

// Dos experimentos: la regla con dos números, y contar negativos en una cadena.
function Probar() {
  const [a, setA] = useState(-4)
  const [b, setB] = useState(3)
  const [dividir, setDividir] = useState(false)
  const [cadena, setCadena] = useState([true, false, true, false, false])
  const negativos = cadena.filter((s) => !s).length
  // En la división se enseña (a · b) : b = a, para que siempre sea exacta.
  const izq = dividir ? a * b : a
  const resultado = dividir ? a : a * b
  const igualSigno = izq === 0 || b === 0 ? null : izq > 0 === b > 0

  return (
    <section className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-bold">1. Cambia los números y mira el signo</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Contador valor={a} cambiar={setA} min={-12} max={12} etiqueta="primer número" />
          <button className="btn w-14 text-2xl" onClick={() => setDividir(!dividir)} aria-label="Cambiar entre multiplicar y dividir">
            {dividir ? ':' : '·'}
          </button>
          <Contador valor={b} cambiar={(v) => setB(dividir && v === 0 ? (b > 0 ? -1 : 1) : v)} min={-12} max={12} etiqueta="segundo número" />
        </div>
        {dividir && <p className="text-sm text-slate-500">En la división, el primer contador fija el resultado para que siempre salga exacta.</p>}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="lienzo">
            <TablaSignos a={igualSigno === null ? undefined : izq > 0} b={igualSigno === null ? undefined : b > 0} simbolo={dividir ? ':' : '·'} />
          </div>
          <div className="flex flex-col justify-center gap-3 text-lg">
            {dividir && b === 0 ? (
              <p className="text-xl font-bold">No se puede dividir entre 0.</p>
            ) : (
              <>
                <motion.p key={`${izq}${dividir}${b}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold">
                  {entP(izq)} {dividir ? ':' : '·'} {entP(b)} = {ent(resultado)}
                </motion.p>
                <p>
                  Valores absolutos: {Math.abs(izq)} {dividir ? ':' : '·'} {Math.abs(b)} = {Math.abs(resultado)}.
                </p>
                <p>{igualSigno === null ? 'Con un 0 el resultado es 0, que no tiene signo.' : igualSigno ? 'Signos iguales: resultado positivo.' : 'Signos distintos: resultado negativo.'}</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4 border-t border-slate-200 pt-5">
        <h2 className="text-xl font-bold">2. En una cadena, cuenta los negativos</h2>
        <p className="text-lg">Toca los signos para cambiarlos y mira qué signo sale al final.</p>
        <div className="lienzo">
          <div className="flex flex-wrap items-center justify-center gap-2 text-2xl font-bold">
            {cadena.map((s, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span className="text-slate-400">·</span>}
                <button
                  className={`btn w-14 text-2xl text-white ${s ? 'border-blue-600 bg-blue-600 hover:bg-blue-700' : 'border-red-600 bg-red-600 hover:bg-red-700'}`}
                  onClick={() => setCadena(cadena.map((x, j) => (j === i ? !x : x)))}
                  aria-label={`Signo ${i + 1}`}
                >
                  {SIG(s)}
                </button>
              </span>
            ))}
            <span className="text-slate-400">=</span>
            <motion.span
              key={negativos}
              initial={{ scale: 0.4 }}
              animate={{ scale: 1 }}
              className={`flex h-14 w-14 items-center justify-center rounded-full text-3xl text-white ${negativos % 2 === 0 ? 'bg-blue-600' : 'bg-red-600'}`}
            >
              {SIG(negativos % 2 === 0)}
            </motion.span>
          </div>
          <p className="text-lg">
            Hay <b>{negativos}</b> {negativos === 1 ? 'negativo' : 'negativos'}: número <b>{negativos % 2 === 0 ? 'par' : 'impar'}</b>, resultado{' '}
            <b>{negativos % 2 === 0 ? 'positivo' : 'negativo'}</b>.
          </p>
        </div>
      </div>
    </section>
  )
}

const EJEMPLOS = ['24 / (-3) * (+5) * (-2)', '(-35) * (+10) / (-7) * 4', '1460 / (-10) / (-73) * (-3)', '(-231) * (-1) / (-3) * (-5) / (-11)', '(-12 / 3) * (-10 / 2)']

export default function Productos({ modo, progreso, apuntar }: PropsParada) {
  return (
    <Parada
      id="productos"
      titulo="Multiplicación y división de enteros"
      modo={modo}
      paneles={{
        entender: <Tarjetas tarjetas={TARJETAS} parada="productos" />,
        probar: <Probar />,
        desmenuzar: <DesmenuzaExpr ejemplos={EJEMPLOS} />,
        practicar: <Practica clase={PRODUCTOS} generar={nuevaProductos} progreso={progreso} apuntar={apuntar} />,
      }}
    />
  )
}
