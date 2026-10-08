// Tema 2 · Parada 3: sumas y restas, multiplicación «en línea», división «en cruz» y potencias de fracciones.
import { useState } from 'react'
import Parada, { Tarjetas, type PropsParada, type Tarjeta } from '../../componentes/Parada'
import Practica from '../../componentes/Practica'
import { Contador } from '../../componentes/piezas'
import { F } from '../../componentes/mat'
import { Barra, COLORES, DesmenuzaFr } from '../../componentes/fraccionesUI'
import { nuevaOperaciones, OPERACIONES } from '../../contenido/tema2'
import { fr, mcmLista } from '../../lib/fracciones'

const C = 'text-xl leading-loose'

const TARJETAS: Tarjeta[] = [
  {
    titulo: 'Sumar y restar con el mismo denominador',
    texto: (
      <>
        <p>Se deja el denominador y se suman (o restan) los numeradores.</p>
        <p className={C}>
          <F n={2} d={7} /> + <F n={3} d={7} /> = <F n={5} d={7} />
        </p>
        <p className="text-base text-slate-600">💡 Nunca se suman los denominadores: 2/7 + 3/7 no es 5/14.</p>
      </>
    ),
    visual: (
      <div className="w-full space-y-2">
        <Barra n={2} d={7} />
        <Barra n={3} d={7} color={COLORES[1]} />
        <Barra n={5} d={7} color={COLORES[3]} />
      </div>
    ),
  },
  {
    titulo: 'Sumar y restar con distinto denominador',
    texto: (
      <>
        <p>Se reducen a común denominador (con el m.c.m.) y después se suman y restan los numeradores. Un entero es una fracción con denominador 1.</p>
        <p className={C}>
          <F n={2} d={3} /> − 1 + <F n={7} d={4} /> = <F n={8} d={12} /> − <F n={12} d={12} /> + <F n={21} d={12} /> = <F n={17} d={12} />
        </p>
      </>
    ),
  },
  {
    titulo: 'Multiplicar: en línea',
    texto: (
      <>
        <p>Numerador por numerador y denominador por denominador. No hace falta común denominador.</p>
        <p className={C}>
          <F n={3} d={4} /> · <F n={5} d={3} /> = <span className="inline-flex flex-col items-center align-middle text-[0.85em] leading-tight"><span>3 · 5</span><span className="h-0.5 w-full bg-current" /><span>4 · 3</span></span> = <F n={15} d={12} /> = <F n={5} d={4} />
        </p>
        <p className="text-base text-slate-600">
          💡 «Los 3/5 de 1500» es multiplicar: <F n={3} d={5} /> · 1500 = 1500 : 5 · 3 = 900.
        </p>
      </>
    ),
  },
  {
    titulo: 'Dividir: en cruz',
    texto: (
      <>
        <p>El numerador de la primera por el denominador de la segunda va arriba, y al revés abajo. Es lo mismo que multiplicar por la inversa.</p>
        <p className={C}>
          <F n={3} d={2} /> : (−<F n={1} d={4} />) = −<span className="inline-flex flex-col items-center align-middle text-[0.85em] leading-tight"><span>3 · 4</span><span className="h-0.5 w-full bg-current" /><span>2 · 1</span></span> = −<F n={12} d={2} /> = −6
        </p>
        <p className="text-base text-slate-600">💡 Los signos van como con los enteros: más entre menos da menos.</p>
      </>
    ),
  },
  {
    titulo: 'Potencia de una fracción',
    texto: (
      <>
        <p>Se elevan el numerador y el denominador al exponente.</p>
        <p className={C}>
          (<F n={2} d={5} />)³ = <span className="inline-flex flex-col items-center align-middle text-[0.85em] leading-tight"><span>2³</span><span className="h-0.5 w-full bg-current" /><span>5³</span></span> = <span className="inline-flex flex-col items-center align-middle text-[0.85em] leading-tight"><span>2 · 2 · 2</span><span className="h-0.5 w-full bg-current" /><span>5 · 5 · 5</span></span> = <F n={8} d={125} />
        </p>
        <p className="text-base text-slate-600">💡 Con base negativa: exponente par da positivo y exponente impar, negativo. (−3/2)⁵ = −243/32.</p>
      </>
    ),
  },
]

/** Suma con barras: primero cada fracción con sus partes, luego partidas en partes iguales y al final juntas. */
function Probar() {
  const [a, setA] = useState<[number, number]>([1, 2])
  const [b, setB] = useState<[number, number]>([1, 3])
  const [paso, setPaso] = useState(0)
  const m = mcmLista([a[1], b[1]])
  const na = a[0] * (m / a[1])
  const nb = b[0] * (m / b[1])
  const total = fr(na + nb, m)
  const cambiar = (set: typeof setA, x: [number, number], i: 0 | 1, v: number) => {
    const y: [number, number] = [...x]
    y[i] = v
    set(y)
    setPaso(0)
  }
  const marcadas = Array.from({ length: Math.max(1, Math.ceil((na + nb) / m)) * m }, (_, k) => k < na + nb)
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">Suma con barras</h2>
      <p className="text-lg">Elige dos fracciones y súmalas paso a paso. Verás por qué hace falta el mismo denominador.</p>
      {(
        [
          ['Primera', a, setA],
          ['Segunda', b, setB],
        ] as const
      ).map(([nombre, x, set]) => (
        <div key={nombre} className="flex flex-wrap items-center gap-3">
          <span className="w-24 font-semibold">{nombre}</span>
          <Contador valor={x[0]} cambiar={(v) => cambiar(set, x, 0, v)} min={0} max={10} etiqueta="numerador" />
          <span className="text-2xl">/</span>
          <Contador valor={x[1]} cambiar={(v) => cambiar(set, x, 1, v)} min={1} max={10} etiqueta="denominador" />
        </div>
      ))}
      <div className="lienzo items-stretch gap-3">
        <p className="text-center text-3xl font-bold">
          <F n={a[0]} d={a[1]} /> + <F n={b[0]} d={b[1]} />
          {paso >= 1 && (
            <>
              {' '}
              = <F n={na} d={m} /> + <F n={nb} d={m} />
            </>
          )}
          {paso >= 2 && (
            <>
              {' '}
              = <F n={na + nb} d={m} />
              {total.d !== m && (
                <>
                  {' '}
                  = <F n={total.n} d={total.d} />
                </>
              )}
            </>
          )}
        </p>
        {paso < 2 ? (
          <>
            <Barra n={paso ? na : a[0]} d={paso ? m : a[1]} />
            <Barra n={paso ? nb : b[0]} d={paso ? m : b[1]} color={COLORES[1]} />
          </>
        ) : (
          <Barra n={na + nb} d={m} color={COLORES[3]} marcadas={marcadas} />
        )}
        <p className="text-center text-slate-600">
          {paso === 0 && 'Las partes de cada barra son de distinto tamaño: así no se pueden juntar.'}
          {paso === 1 && `Con el m.c.m. de los denominadores (${m}), las dos barras tienen partes iguales.`}
          {paso === 2 && `Ahora sí: ${na} + ${nb} = ${na + nb} partes de ${m}.`}
        </p>
        <div className="flex justify-center gap-2">
          <button className="btn" disabled={paso === 0} onClick={() => setPaso(paso - 1)}>
            ← Atrás
          </button>
          <button className="btn btn-primario" disabled={paso === 2} onClick={() => setPaso(paso + 1)}>
            {paso === 0 ? 'Reducir a común denominador →' : 'Sumar →'}
          </button>
        </div>
      </div>
    </section>
  )
}

const EJEMPLOS = ['2/3 - 1 + 7/4', '1/7 + 1/2 - 1/15', '3/4 · 5/3', '3/2 : (-1/4)', '(2/5)^3', '12/5 · 4/9 · 1/6']

export default function Operaciones({ modo, progreso, apuntar }: PropsParada) {
  return (
    <Parada
      id="operaciones"
      titulo="Operaciones con fracciones"
      modo={modo}
      paneles={{
        entender: <Tarjetas tarjetas={TARJETAS} parada="operaciones" />,
        probar: <Probar />,
        desmenuzar: <DesmenuzaFr ejemplos={EJEMPLOS} />,
        practicar: <Practica clase={OPERACIONES} generar={nuevaOperaciones} progreso={progreso} apuntar={apuntar} />,
      }}
    />
  )
}
