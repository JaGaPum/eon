import Parada, { Tarjetas, type PropsParada, type Tarjeta } from '../componentes/Parada'
import Practica from '../componentes/Practica'
import { DesmenuzaExpr, ProbarOrden } from '../componentes/expresiones'
import { COMBINADAS, nuevaCombinadas } from '../contenido/preguntas'

const cuaderno = 'text-center text-xl leading-loose font-bold whitespace-nowrap'
const M = ({ children }: { children: string }) => <span className="bg-amber-200">{children}</span>

const TARJETAS: Tarjeta[] = [
  {
    titulo: 'La jerarquía: qué va primero',
    texto: (
      <>
        <p>Cuando en una operación se mezclan varias cosas, el orden no se elige: está fijado.</p>
        <ol className="list-decimal space-y-1 pl-5">
          <li>
            <b>Paréntesis y corchetes</b>. Si hay unos dentro de otros, se empieza por los de más adentro.
          </li>
          <li>
            <b>Multiplicaciones y divisiones</b>, de izquierda a derecha.
          </li>
          <li>
            <b>Sumas y restas</b>.
          </li>
        </ol>
      </>
    ),
    visual: (
      <p className={cuaderno}>
        2 − 3 · [4 − <M>(5 − 7)</M>]
        <br />= 2 − 3 · <M>[4 − (−2)]</M>
        <br />= 2 − <M>3 · 6</M>
        <br />= <M>2 − 18</M>
        <br />= −16
      </p>
    ),
  },
  {
    titulo: 'Un paso por línea',
    texto: (
      <>
        <p>El truco para no equivocarse es de orden, no de cálculo:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>En cada línea se hace una sola cosa.</li>
          <li>Todo lo que no se toca se copia igual, con su signo.</li>
          <li>Un negativo detrás de un signo de operación va entre paréntesis: 4 − (−2).</li>
        </ul>
        <p>Así, si hay un fallo, se encuentra mirando la línea en la que aparece.</p>
      </>
    ),
    visual: (
      <p className={cuaderno}>
        6 − <M>3 · 2</M> + 8 : 4
        <br />= 6 − 6 + <M>8 : 4</M>
        <br />= <M>6 − 6</M> + 2
        <br />= <M>0 + 2</M>
        <br />= 2
      </p>
    ),
  },
  {
    titulo: 'Propiedad distributiva',
    texto: (
      <>
        <p>Multiplicar un número por una suma es lo mismo que multiplicarlo por cada sumando y sumar los resultados:</p>
        <p className="text-xl font-bold">a · (b + c) = a · b + a · c</p>
        <p>Por eso una misma operación se puede hacer de dos formas y tiene que dar lo mismo.</p>
      </>
    ),
    visual: (
      <p className={cuaderno}>
        (−12) · [5 + (−8)]
        <br />= (−12) · (−3) = 36
        <br />
        <span className="text-slate-400">o también</span>
        <br />= (−12) · 5 + (−12) · (−8)
        <br />= −60 + 96 = 36
      </p>
    ),
  },
  {
    titulo: 'Extraer factor común',
    texto: (
      <>
        <p>
          Es la distributiva al revés: si un factor se repite en todos los sumandos, se saca fuera y se multiplica una sola vez.
        </p>
        <p>Sirve para hacer cuentas largas con números más pequeños.</p>
      </>
    ),
    visual: (
      <p className={cuaderno}>
        −120 + 180 + 60 − 30
        <br />= <M>10</M> · (−12 + 18 + 6 − 3)
        <br />= 10 · 9
        <br />= 90
      </p>
    ),
  },
]

const EJEMPLOS = [
  '6 - 3*2 + 4*1 - 5 + 13 - 8/4 - 9*2/3 - 1',
  '3 - [-5*6 - 4*(12/4 - 5*2) - 24/3]',
  '[3*(5 - 2) - 10/2] * [5*(1 - 4) - (3 - 7)]',
  '5 - 3*[(1 - 4)*(2 - 7 + 3) - 5*(-2 + 12/4)]',
  '-{1 - [1 - (-1)]} - {-1 - [-(-1) - 1] - 1}',
  '3*{2*[4 - 2*(5 - 7)] + 3*(1 - 2*5)}',
]

export default function Combinadas({ modo, progreso, apuntar }: PropsParada) {
  return (
    <Parada
      id="combinadas"
      titulo="Operaciones combinadas"
      modo={modo}
      paneles={{
        entender: <Tarjetas tarjetas={TARJETAS} parada="combinadas" />,
        probar: <ProbarOrden ejemplos={EJEMPLOS} />,
        desmenuzar: <DesmenuzaExpr ejemplos={EJEMPLOS} />,
        practicar: <Practica clase={COMBINADAS} generar={nuevaCombinadas} progreso={progreso} apuntar={apuntar} />,
      }}
    />
  )
}
