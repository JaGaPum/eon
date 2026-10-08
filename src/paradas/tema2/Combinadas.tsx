// Tema 2 · Parada 4: operaciones combinadas con fracciones (jerarquía) y problemas.
import Parada, { Tarjetas, type PropsParada, type Tarjeta } from '../../componentes/Parada'
import Practica from '../../componentes/Practica'
import { F } from '../../componentes/mat'
import type { ReactNode } from 'react'
import { DesmenuzaFr, ProbarOrdenFr } from '../../componentes/fraccionesUI'
import { COMBINADAS2, nuevaCombinadas2 } from '../../contenido/tema2'

const C = 'text-xl leading-loose'
const M = ({ children }: { children: ReactNode }) => <span className="rounded bg-amber-200 px-0.5">{children}</span>

const TARJETAS: Tarjeta[] = [
  {
    titulo: 'La jerarquía de las operaciones',
    texto: (
      <>
        <p>Igual que con los enteros, el orden está fijado:</p>
        <ol className="list-decimal space-y-1 pl-5">
          <li>
            <b>Paréntesis y corchetes</b> (de dentro afuera).
          </li>
          <li>
            <b>Potencias</b> (y raíces).
          </li>
          <li>
            <b>Multiplicaciones y divisiones</b>, de izquierda a derecha.
          </li>
          <li>
            <b>Sumas y restas</b>, de izquierda a derecha.
          </li>
          <li>
            El resultado, en <b>fracción irreducible</b>.
          </li>
        </ol>
      </>
    ),
  },
  {
    titulo: 'El ejemplo del profesor',
    texto: (
      <>
        <p className={C}>
          (<F n={1} d={3} /> − <M><F n={1} d={3} /> · <F n={1} d={2} /></M>) : (<F n={5} d={4} />)²
        </p>
        <p className={C}>
          = <M>(<F n={1} d={3} /> − <F n={1} d={6} />)</M> : <M><F n={25} d={16} /></M>
        </p>
        <p className={C}>
          = (<F n={2} d={6} /> − <F n={1} d={6} />) : <F n={25} d={16} /> = <M><F n={1} d={6} /> : <F n={25} d={16} /></M>
        </p>
        <p className={C}>
          = <span className="inline-flex flex-col items-center align-middle text-[0.85em] leading-tight"><span>1 · 16</span><span className="h-0.5 w-full bg-current" /><span>6 · 25</span></span> = <F n={16} d={150} /> = <F n={8} d={75} />
        </p>
        <p className="text-base text-slate-600">Dentro del paréntesis, primero la multiplicación y luego la resta. Fuera, la potencia antes que la división.</p>
      </>
    ),
  },
  {
    titulo: 'Trucos para no equivocarse',
    texto: (
      <ul className="list-disc space-y-2 pl-5">
        <li>Una sola cosa por línea; lo que no tocas se copia igual.</li>
        <li>Simplifica cada resultado en cuanto puedas: los números se quedan pequeños.</li>
        <li>
          Un menos delante de un paréntesis cambia el signo de lo que sale: −(<F n={5} d={8} /> − 1) = −<F n={5} d={8} /> + 1.
        </li>
        <li>Un entero es una fracción con denominador 1: 2 = 2/1.</li>
      </ul>
    ),
  },
  {
    titulo: 'Problemas: la fracción del resto',
    texto: (
      <>
        <p>Muchos problemas dicen «gasta una parte y luego una fracción de lo que queda». El truco:</p>
        <ol className="list-decimal space-y-1 pl-5">
          <li>Lo que queda tras la primera parte: 1 − la fracción.</li>
          <li>«De lo que queda» es multiplicar las fracciones.</li>
          <li>Al final, la fracción que sobra corresponde al dato que te dan: con ella sacas el total.</li>
        </ol>
        <p>
          Ejemplo: gasta <F n={3} d={7} /> en libros y <F n={1} d={3} /> del resto en un bocadillo. Queda <F n={4} d={7} /> · <F n={2} d={3} /> = <F n={8} d={21} />. Si eso son 8 €, <F n={1} d={21} /> es 1 € y llevaba 21 €.
        </p>
      </>
    ),
  },
]

const EJEMPLOS = [
  '(1/3 - 1/3·1/2) : (5/4)^2',
  '2/5 - 3/10 : 1/2',
  '1/5 + 2/3 · (1 + 4/5) - 2/3 : 1/4',
  '[1/3 : (2 · 7/3) + 1] · (3/5)^2',
  '(7/10 - 3/5 · 2) · [4 + 3/8 : (5/2 - 1)^2]',
  '2 : 15/8 · [11/6 - 4/3 · (3/2 - 2)]',
]

export default function Combinadas2({ modo, progreso, apuntar }: PropsParada) {
  return (
    <Parada
      id="combinadas"
      titulo="Operaciones combinadas y problemas"
      modo={modo}
      paneles={{
        entender: <Tarjetas tarjetas={TARJETAS} parada="combinadas" />,
        probar: <ProbarOrdenFr ejemplos={EJEMPLOS} />,
        desmenuzar: <DesmenuzaFr ejemplos={EJEMPLOS} />,
        practicar: <Practica clase={COMBINADAS2} generar={nuevaCombinadas2} progreso={progreso} apuntar={apuntar} />,
      }}
    />
  )
}

