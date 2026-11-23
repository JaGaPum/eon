// Tema 3 · Parada 6: operaciones combinadas con potencias, exponentes negativos y raíces (ejercicios 36 y 37).
import Parada, { Tarjetas, type PropsParada, type Tarjeta } from '../../componentes/Parada'
import Practica from '../../componentes/Practica'
import { F } from '../../componentes/mat'
import { DesmenuzaFr, ProbarOrdenFr } from '../../componentes/fraccionesUI'
import { COMBINADAS3, COMBINADAS_HOJA, nuevaCombinadas3 } from '../../contenido/tema3'
import { Pot } from './comun'

const C = 'text-xl leading-loose'

const TARJETAS: Tarjeta[] = [
  {
    titulo: 'La jerarquía, ahora con potencias y raíces',
    texto: (
      <>
        <p>El orden es el de siempre:</p>
        <ol className="list-decimal space-y-1 pl-5">
          <li>
            <b>Paréntesis y corchetes</b>, de dentro afuera. Lo de dentro de una raíz cuenta como un paréntesis.
          </li>
          <li>
            <b>Potencias y raíces</b>.
          </li>
          <li>
            <b>Multiplicaciones y divisiones</b>, de izquierda a derecha.
          </li>
          <li>
            <b>Sumas y restas</b>, de izquierda a derecha.
          </li>
        </ol>
      </>
    ),
  },
  {
    titulo: 'Un ejemplo de la hoja (36a)',
    texto: (
      <>
        <p className={C}>
          <Pot b="(−3)" e="2" /> · √16 − (<Pot b="5" e="2" /> − 11) : √49 + <Pot b="(10 − 8)" e="2" />
        </p>
        <p className={C}>= 9 · 4 − (25 − 11) : 7 + <Pot b="2" e="2" /></p>
        <p className={C}>= 36 − 14 : 7 + 4 = 36 − 2 + 4 = 38</p>
        <p className="text-base text-slate-600">Paréntesis primero (5² − 11 = 14, 10 − 8 = 2), luego potencias y raíces, luego la división y al final sumas y restas.</p>
      </>
    ),
  },
  {
    titulo: 'Trucos',
    texto: (
      <ul className="list-disc space-y-2 pl-5">
        <li>
          Un exponente negativo se quita dando la vuelta: <Pot b={<>(<F n={3} d={2} />)</>} e="−2" /> = <Pot b={<>(<F n={2} d={3} />)</>} e="2" /> = <F n={4} d={9} />.
        </li>
        <li>
          La raíz de algo con operaciones dentro: primero las operaciones. √(5² − 4²) = √(25 − 16) = √9 = 3. ¡No es 5 − 4!
        </li>
        <li>
          Raíz de una fracción: simplifica primero. √(2/18) = √(1/9) = <F n={1} d={3} />.
        </li>
        <li>Una sola cosa por línea; lo que no tocas se copia igual.</li>
      </ul>
    ),
  },
]

const EJEMPLOS = COMBINADAS_HOJA.map(([, e]) => e)

export default function Combinadas3({ modo, progreso, apuntar }: PropsParada) {
  return (
    <Parada
      id="combinadas"
      titulo="Operaciones combinadas"
      modo={modo}
      paneles={{
        entender: <Tarjetas tarjetas={TARJETAS} parada="combinadas" />,
        probar: <ProbarOrdenFr ejemplos={EJEMPLOS} />,
        desmenuzar: <DesmenuzaFr ejemplos={EJEMPLOS} />,
        practicar: <Practica clase={COMBINADAS3} generar={nuevaCombinadas3} progreso={progreso} apuntar={apuntar} />,
      }}
    />
  )
}
