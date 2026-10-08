// Tema 2 · Parada 2: comparar y ordenar fracciones reduciendo a común denominador.
import { useState } from 'react'
import Parada, { Tarjetas, type PropsParada, type Tarjeta } from '../../componentes/Parada'
import Practica from '../../componentes/Practica'
import { Contador } from '../../componentes/piezas'
import { F } from '../../componentes/mat'
import { Barra, COLORES, PasosGuiados, type PasoG } from '../../componentes/fraccionesUI'
import { COMPARAR, nuevaComparar } from '../../contenido/tema2'
import { leer, mcmLista } from '../../lib/fracciones'
import { factores, agrupar } from '../../lib/mates'

const G = 'text-2xl font-bold'

const TARJETAS: Tarjeta[] = [
  {
    titulo: 'Con el mismo denominador',
    texto: (
      <>
        <p>Si las fracciones tienen el mismo denominador, las partes son del mismo tamaño: es mayor la que tiene más partes, es decir, el numerador mayor.</p>
        <p className="text-xl">
          <F n={5} d={8} /> &gt; <F n={3} d={8} />
        </p>
      </>
    ),
    visual: (
      <div className="w-full space-y-3">
        <Barra n={5} d={8} />
        <Barra n={3} d={8} color={COLORES[1]} />
      </div>
    ),
  },
  {
    titulo: 'Con distinto denominador',
    texto: (
      <>
        <p>
          Primero se buscan fracciones equivalentes con el <b>mismo denominador</b>: se <b>reducen a común denominador</b>. Como denominador común se usa el <b>m.c.m.</b> de los denominadores.
        </p>
        <p className="text-xl">
          <F n={3} d={4} /> y <F n={5} d={6} /> → m.c.m.(4, 6) = 12
        </p>
        <p className="text-xl">
          <F n={3} d={4} /> = <F n={9} d={12} /> &lt; <F n={10} d={12} /> = <F n={5} d={6} />
        </p>
      </>
    ),
    visual: (
      <div className="w-full space-y-3">
        <Barra n={9} d={12} />
        <Barra n={10} d={12} color={COLORES[1]} />
      </div>
    ),
  },
  {
    titulo: 'Cómo se reduce a común denominador',
    texto: (
      <>
        <ol className="list-decimal space-y-1 pl-5">
          <li>Se calcula el m.c.m. de los denominadores (lo que aprendiste en el Tema 1).</li>
          <li>Ese es el nuevo denominador de todas.</li>
          <li>Cada numerador se multiplica por lo mismo que su denominador: m.c.m. : denominador.</li>
        </ol>
        <p className="text-xl">
          m.c.m.(7, 5, 9) = 315
        </p>
        <p className="text-xl">
          <F n={3} d={7} /> = <F n={135} d={315} />, <F n={2} d={5} /> = <F n={126} d={315} />, <F n={7} d={9} /> = <F n={245} d={315} />
        </p>
        <p className="text-xl">
          <F n={2} d={5} /> &lt; <F n={3} d={7} /> &lt; <F n={7} d={9} />
        </p>
      </>
    ),
  },
  {
    titulo: 'Fracciones negativas',
    texto: (
      <>
        <p>Igual que con los enteros: las negativas son menores que todas las positivas, y entre dos negativas es menor la que está más lejos del 0.</p>
        <p className="text-xl">
          −<F n={3} d={4} /> &lt; −<F n={2} d={3} /> porque −<F n={9} d={12} /> &lt; −<F n={8} d={12} />
        </p>
        <p className="text-base text-slate-600">💡 Una fracción mayor que 1 (impropia) siempre es mayor que una menor que 1: 4/3 &gt; 2/5 sin hacer cuentas.</p>
      </>
    ),
  },
]

/** Dos fracciones lado a lado: al reducirlas, las partes pasan a ser del mismo tamaño y se pueden comparar. */
function Probar() {
  const [a, setA] = useState<[number, number]>([2, 3])
  const [b, setB] = useState<[number, number]>([3, 5])
  const [reducir, setReducir] = useState(false)
  const m = mcmLista([a[1], b[1]])
  const na = a[0] * (m / a[1])
  const nb = b[0] * (m / b[1])
  const sig = na > nb ? '>' : na < nb ? '<' : '='
  const elegir = (cual: 'a' | 'b', i: 0 | 1, v: number) => {
    setReducir(false)
    const x = cual === 'a' ? [...a] : [...b]
    x[i] = v
    ;(cual === 'a' ? setA : setB)(x as [number, number])
  }
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">¿Cuál es mayor?</h2>
      <p className="text-lg">Elige dos fracciones. Con distinto denominador las partes no son iguales y cuesta compararlas; redúcelas a común denominador y fíjate en las partes.</p>
      {(['a', 'b'] as const).map((cual, k) => {
        const x = cual === 'a' ? a : b
        return (
          <div key={cual} className="flex flex-wrap items-center gap-3">
            <span className="w-24 font-semibold">{k === 0 ? 'Primera' : 'Segunda'}</span>
            <Contador valor={x[0]} cambiar={(v) => elegir(cual, 0, v)} min={0} max={12} etiqueta="numerador" />
            <span className="text-2xl">/</span>
            <Contador valor={x[1]} cambiar={(v) => elegir(cual, 1, v)} min={1} max={12} etiqueta="denominador" />
          </div>
        )
      })}
      <div className="lienzo items-stretch gap-3">
        <Barra n={reducir ? na : a[0]} d={reducir ? m : a[1]} />
        <Barra n={reducir ? nb : b[0]} d={reducir ? m : b[1]} color={COLORES[1]} />
        <p className="text-center text-3xl font-bold">
          <F n={a[0]} d={a[1]} />
          {reducir && (
            <>
              {' '}
              = <F n={na} d={m} />
            </>
          )}{' '}
          <span className="text-indigo-700">{reducir ? sig : '?'}</span> {reducir && <><F n={nb} d={m} /> = </>}
          <F n={b[0]} d={b[1]} />
        </p>
        <button className="btn btn-primario self-center" onClick={() => setReducir(!reducir)}>
          {reducir ? 'Volver a como estaban' : `Reducir a común denominador (m.c.m. = ${m})`}
        </button>
        {reducir && <p className="text-center text-slate-600">Ahora las dos barras tienen {m} partes iguales: es mayor la que tiene más coloreadas.</p>}
      </div>
    </section>
  )
}

const potencias = (n: number) =>
  agrupar(factores(n))
    .map(([p, e]) => (e > 1 ? `${p}^${e}` : String(p)))
    .join(' · ')

/** Ordenar fracciones paso a paso: m.c.m., fracciones equivalentes y comparar numeradores. */
export function pasosOrdenar(entrada: string): PasoG[] {
  const partes = entrada.split(/[,;]\s*|\s+y\s+|\s+/).filter(Boolean)
  const fs = partes.map((p) => leer(p.replace('−', '-')))
  if (fs.length < 2 || fs.some((f) => !f || f.d === 1)) throw new Error('Escribe dos o más fracciones separadas por comas: 3/7, 2/5, 7/9')
  const vs = fs as { n: number; d: number }[]
  const m = mcmLista(vs.map((v) => v.d))
  const eq = vs.map((v) => ({ ...v, nn: v.n * (m / v.d) }))
  const orden = [...eq].sort((x, y) => x.nn - y.nn)
  return [
    {
      linea: (
        <span className={G}>
          {vs.map((v, i) => (
            <span key={i} className="mr-4">
              <F n={v.n} d={v.d} />
            </span>
          ))}
        </span>
      ),
      explica: <p>Tienen distinto denominador: hay que reducirlas a común denominador para poder compararlas.</p>,
    },
    {
      linea: <span className="text-lg">m.c.m.({vs.map((v) => v.d).join(', ')}) = {m}</span>,
      explica: (
        <p>
          El denominador común es el m.c.m. de los denominadores.{' '}
          {vs.map((v) => (
            <span key={v.d} className="mr-2">
              {v.d} = {potencias(v.d)};
            </span>
          ))}{' '}
          comunes y no comunes con el mayor exponente: {m}.
        </p>
      ),
    },
    {
      linea: (
        <span className={G}>
          {eq.map((v, i) => (
            <span key={i} className="mr-4">
              <F n={v.n} d={v.d} /> = <F n={v.nn} d={m} />
            </span>
          ))}
        </span>
      ),
      explica: (
        <p>
          Cada una se multiplica arriba y abajo por lo que le falta a su denominador para llegar a {m}:{' '}
          {eq.map((v) => `${m} : ${v.d} = ${m / v.d}`).join('; ')}.
        </p>
      ),
    },
    {
      linea: (
        <span className={G}>
          {orden.map((v, i) => (
            <span key={i}>
              {i > 0 && <span className="mx-3 text-indigo-700">&lt;</span>}
              <F n={v.n} d={v.d} />
            </span>
          ))}
        </span>
      ),
      explica: <p>Con el mismo denominador, es mayor la que tiene mayor numerador ({orden.map((v) => v.nn).join(' < ')}). De menor a mayor queda así.</p>,
    },
  ]
}

const EJEMPLOS = ['3/7, 2/5, 7/9', '5/8, 12/25, 7/10, 5/12', '4/7, 2/3, 3/5', '-3/4, -2/3, 1/10'].map((s) => ({ nombre: s, pasos: pasosOrdenar(s) }))

export default function Comparar({ modo, progreso, apuntar }: PropsParada) {
  return (
    <Parada
      id="comparar"
      titulo="Comparación y ordenación"
      modo={modo}
      paneles={{
        entender: <Tarjetas tarjetas={TARJETAS} parada="comparar" />,
        probar: <Probar />,
        desmenuzar: <PasosGuiados titulo="Ordenar fracciones, paso a paso" ejemplos={EJEMPLOS} crear={pasosOrdenar} placeholder="O escribe las tuyas: 2/3, 5/6, 3/4" ayuda="Separa las fracciones con comas." />,
        practicar: <Practica clase={COMPARAR} generar={nuevaComparar} progreso={progreso} apuntar={apuntar} />,
      }}
    />
  )
}
