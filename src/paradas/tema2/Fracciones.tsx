// Tema 2 · Parada 1: qué es una fracción, fracciones equivalentes, simplificar, inversa y número mixto.
import { useState } from 'react'
import Parada, { Tarjetas, type PropsParada, type Tarjeta } from '../../componentes/Parada'
import Practica from '../../componentes/Practica'
import { Contador } from '../../componentes/piezas'
import { F } from '../../componentes/mat'
import { Barra, COLORES, PasosGuiados, type PasoG } from '../../componentes/fraccionesUI'
import { FRACCIONES, nuevaFracciones } from '../../contenido/tema2'
import { fr, leer, mcdDe } from '../../lib/fracciones'
import { factores } from '../../lib/mates'

const G = 'text-2xl font-bold'

const TARJETAS: Tarjeta[] = [
  {
    titulo: '¿Qué es una fracción?',
    texto: (
      <>
        <p>
          Una <b>fracción</b> <span className={G}><F n={3} d={4} /></span> es el cociente de dos números enteros: 3 : 4.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            El <b>denominador</b> (abajo) dice en cuántas partes iguales se divide la unidad. Nunca puede ser 0.
          </li>
          <li>
            El <b>numerador</b> (arriba) dice cuántas de esas partes se cogen.
          </li>
        </ul>
      </>
    ),
    visual: (
      <div className="w-full space-y-3">
        <Barra n={3} d={4} />
        <p className="text-center text-lg">
          4 partes iguales, 3 coloreadas: <span className={G}><F n={3} d={4} /></span>
        </p>
      </div>
    ),
  },
  {
    titulo: 'Fracciones equivalentes',
    texto: (
      <>
        <p>
          Dos fracciones son <b>equivalentes</b> si representan la misma cantidad. Se comprueba multiplicando en cruz: <b>a · d = b · c</b>.
        </p>
        <p className="text-xl">
          <F n={4} d={6} /> y <F n={8} d={12} /> → 4 · 12 = 6 · 8 = 48 ✓
        </p>
      </>
    ),
    visual: (
      <div className="w-full space-y-3">
        <Barra n={4} d={6} />
        <Barra n={8} d={12} color={COLORES[1]} />
        <p className="text-center">Coloreada, la misma cantidad.</p>
      </div>
    ),
  },
  {
    titulo: 'Amplificar y simplificar',
    texto: (
      <>
        <p>
          Si se <b>multiplican</b> o se <b>dividen</b> el numerador y el denominador por el mismo número, sale una fracción equivalente.
        </p>
        <p>
          Cuando ya no se pueden dividir más entre un mismo número, se ha llegado a la <b>fracción irreducible</b>. Lo más rápido es dividir entre el m.c.d. de los dos.
        </p>
        <p className="text-xl">
          <F n={3} d={9} /> → : 3 → <F n={1} d={3} /> (irreducible)
        </p>
        <p className="text-xl">
          <F n={3} d={9} /> → · 2 → <F n={6} d={18} />
        </p>
      </>
    ),
    visual: (
      <div className="w-full space-y-3">
        <Barra n={1} d={3} color={COLORES[3]} />
        <Barra n={3} d={9} />
        <Barra n={6} d={18} color={COLORES[1]} />
      </div>
    ),
  },
  {
    titulo: 'La fracción inversa',
    texto: (
      <>
        <p>
          La <b>inversa</b> de <F n={2} d={3} /> es <F n={3} d={2} />: se le da la vuelta.
        </p>
        <p>Se comprueba porque, al multiplicarlas, da 1:</p>
        <p className="text-xl">
          <F n={2} d={3} /> · <F n={3} d={2} /> = <F n={6} d={6} /> = 1
        </p>
        <p className="text-base text-slate-600">💡 No la confundas con la opuesta: la opuesta de 2/3 es −2/3.</p>
      </>
    ),
    visual: (
      <p className="text-center text-5xl font-bold">
        <F n={2} d={3} /> ⇄ <F n={3} d={2} />
      </p>
    ),
  },
  {
    titulo: 'Fracción impropia y número mixto',
    texto: (
      <>
        <p>
          Una fracción es <b>impropia</b> si el numerador es mayor que el denominador: vale más que la unidad.
        </p>
        <p>Para pasarla a número mixto se divide el numerador entre el denominador:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>el cociente es la parte entera,</li>
          <li>el resto es el numerador de la fracción que sobra, con el mismo denominador.</li>
        </ul>
        <p className="text-xl">
          <F n={9} d={2} /> → 9 : 2 = 4, resto 1 → 4 <F n={1} d={2} />
        </p>
      </>
    ),
    visual: (
      <div className="w-full space-y-1">
        <Barra n={9} d={2} alto="h-8" />
        <p className="text-center">4 unidades enteras y media.</p>
      </div>
    ),
  },
]

/** Elige una fracción, colorea sus partes y mira cómo cambia al amplificarla o simplificarla. */
function Probar() {
  const [n, setN] = useState(3)
  const [d, setD] = useState(4)
  const [k, setK] = useState(1)
  const f = fr(n, d)
  const m = mcdDe(n, d)
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">Juega con una fracción</h2>
      <p className="text-lg">Elige el numerador y el denominador. Después amplifícala o simplifícala: la cantidad coloreada no cambia.</p>
      <div className="flex flex-wrap items-center gap-4">
        <span className="font-semibold">Numerador</span>
        <Contador valor={n} cambiar={(v) => (setN(v), setK(1))} min={0} max={30} etiqueta="numerador" />
        <span className="font-semibold">Denominador</span>
        <Contador valor={d} cambiar={(v) => (setD(v), setK(1))} min={1} max={12} etiqueta="denominador" />
      </div>
      <div className="lienzo items-stretch gap-4">
        <p className="text-center text-3xl font-bold">
          <F n={n} d={d} />
          {n > d && (
            <span className="ml-4 text-xl font-semibold text-slate-600">
              = {Math.floor(n / d)} {n % d > 0 && <F n={n % d} d={d} />} (número mixto)
            </span>
          )}
        </p>
        <Barra n={n} d={d} />
        <div className="flex flex-wrap justify-center gap-2">
          {[2, 3, 4].map((x) => (
            <button key={x} className={`btn ${k === x ? 'btn-activo' : ''}`} onClick={() => setK(x)}>
              Amplificar · {x}
            </button>
          ))}
          <button className={`btn ${k === -1 ? 'btn-activo' : ''}`} disabled={m === 1} onClick={() => setK(-1)}>
            Simplificar (: {m})
          </button>
        </div>
        {k !== 1 && (
          <>
            <p className="text-center text-2xl font-bold">
              <F n={n} d={d} /> = <F n={k > 0 ? n * k : f.n} d={k > 0 ? d * k : f.d} />
            </p>
            <Barra n={k > 0 ? n * k : f.n} d={k > 0 ? d * k : f.d} color={COLORES[1]} />
            <p className="text-center text-slate-600">
              {k > 0 ? `Cada parte se ha partido en ${k}: hay ${k} veces más partes y se cogen ${k} veces más.` : `Se juntan las partes de ${m} en ${m}: ${f.d === 1 ? 'sale un entero.' : 'es la fracción irreducible.'}`}
            </p>
          </>
        )}
      </div>
    </section>
  )
}

/** Simplificar paso a paso, dividiendo entre los primos que comparten, y pasar a número mixto si es impropia. */
export function pasosSimplificar(entrada: string): PasoG[] {
  const x = leer(entrada.replace(/\s+/g, ''))
  if (!x || x.d === 1) throw new Error('Escribe una fracción con barra, por ejemplo 48/64.')
  let { n, d } = x
  if (n < 0) throw new Error('Para este paso a paso, usa una fracción positiva.')
  const pasos: PasoG[] = [
    {
      linea: (
        <span className={G}>
          <F n={n} d={d} />
        </span>
      ),
      explica: <p>Vamos a simplificarla dividiendo arriba y abajo entre los números que comparten.</p>,
    },
  ]
  const fn = factores(n)
  const fd = factores(d)
  const comunes: number[] = []
  const resto = [...fd]
  for (const p of fn) {
    const i = resto.indexOf(p)
    if (i >= 0) {
      comunes.push(p)
      resto.splice(i, 1)
    }
  }
  for (const p of comunes) {
    const [a, b] = [n / p, d / p]
    pasos.push({
      linea: (
        <span className={G}>
          = <F n={a} d={b} /> <span className="text-base font-semibold text-slate-500">(: {p})</span>
        </span>
      ),
      explica: (
        <p>
          {n} y {d} se pueden dividir entre {p}: {n} : {p} = {a} y {d} : {p} = {b}.
        </p>
      ),
    })
    n = a
    d = b
  }
  pasos.push({
    linea: (
      <span className="text-lg text-slate-600">
        m.c.d. = {mcdDe(x.n, x.d)} → <F n={x.n} d={x.d} /> = <F n={n} d={d} />
      </span>
    ),
    explica: comunes.length ? (
      <p>
        Ya no comparten ningún divisor: <F n={n} d={d} /> es la fracción irreducible. Si lo haces de golpe, divide los dos entre su m.c.d., {mcdDe(x.n, x.d)}.
      </p>
    ) : (
      <p>No comparten ningún divisor: ya era irreducible.</p>
    ),
  })
  if (n > d && d > 1)
    pasos.push({
      linea: (
        <span className={G}>
          = {Math.floor(n / d)} <F n={n % d} d={d} />
        </span>
      ),
      explica: (
        <p>
          Es impropia (numerador mayor que denominador). {n} : {d} da {Math.floor(n / d)} de cociente y {n % d} de resto: {Math.floor(n / d)} <F n={n % d} d={d} />.
        </p>
      ),
    })
  return pasos
}

const EJEMPLOS = ['48/64', '120/3600', '483/46', '36/99', '27/5'].map((s) => ({ nombre: s, pasos: pasosSimplificar(s) }))

export default function Fracciones({ modo, progreso, apuntar }: PropsParada) {
  return (
    <Parada
      id="fracciones"
      titulo="Fracciones y fracciones equivalentes"
      modo={modo}
      paneles={{
        entender: <Tarjetas tarjetas={TARJETAS} parada="fracciones" />,
        probar: <Probar />,
        desmenuzar: <PasosGuiados titulo="Simplificar hasta la fracción irreducible" ejemplos={EJEMPLOS} crear={pasosSimplificar} placeholder="O escribe la tuya: 84/126" />,
        practicar: <Practica clase={FRACCIONES} generar={nuevaFracciones} progreso={progreso} apuntar={apuntar} />,
      }}
    />
  )
}
