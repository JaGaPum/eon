// Tema 3 · Parada 2: operaciones con potencias. Misma base (producto, cociente, potencia de potencia), mismo exponente
// y descomposición en factores primos para simplificar.
import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Parada, { Tarjetas, type PropsParada, type Tarjeta } from '../../componentes/Parada'
import Practica from '../../componentes/Practica'
import { Contador } from '../../componentes/piezas'
import { PasosGuiados, type PasoG } from '../../componentes/fraccionesUI'
import { Ep, PROPIEDADES, nuevaPropiedades } from '../../contenido/tema3'
import { escribirPot, primosDe, sup, unicaPotencia } from '../../lib/potencias'
import { Ficha, Pot } from './comun'

const G = 'text-2xl font-bold'
const A = '#6366f1'
const B = '#f59e0b'

const TARJETAS: Tarjeta[] = [
  {
    titulo: 'Producto de potencias de la misma base',
    texto: (
      <>
        <p>Se deja la misma base y se <b>suman</b> los exponentes:</p>
        <p className={G}>
          <Pot b="a" e="m" /> · <Pot b="a" e="n" /> = <Pot b="a" e="m+n" />
        </p>
        <p className={G}>
          <Pot b="2" e="3" /> · <Pot b="2" e="2" /> = <Pot b="2" e="5" />
        </p>
        <p className="text-base text-slate-600">¿Por qué? Hay 3 doses y luego 2 doses: en total, 5 doses multiplicados.</p>
      </>
    ),
    visual: (
      <div className="flex flex-wrap items-center gap-1">
        {[A, A, A].map((c, i) => (
          <Ficha key={`a${i}`} texto="2" color={c} />
        ))}
        <span className="mx-1 text-2xl font-bold">·</span>
        {[B, B].map((c, i) => (
          <Ficha key={`b${i}`} texto="2" color={c} />
        ))}
        <span className="ml-2 text-2xl font-bold">
          = <Pot b="2" e="5" />
        </span>
      </div>
    ),
  },
  {
    titulo: 'Cociente de potencias de la misma base',
    texto: (
      <>
        <p>Se deja la base y se <b>restan</b> los exponentes (el de arriba menos el de abajo):</p>
        <p className={G}>
          <Pot b="a" e="m" /> : <Pot b="a" e="n" /> = <Pot b="a" e="m−n" />
        </p>
        <p className={G}>
          <Pot b="2" e="5" /> : <Pot b="2" e="2" /> = <Pot b="2" e="3" />
        </p>
        <p className="text-base text-slate-600">Cada 2 de abajo se va con un 2 de arriba. Quedan 3.</p>
      </>
    ),
    visual: (
      <div className="flex flex-col items-center gap-1">
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <Ficha key={i} texto="2" color={A} tachada={i < 2} />
          ))}
        </div>
        <span className="h-1 w-full rounded bg-slate-700" />
        <div className="flex gap-1">
          {[0, 1].map((i) => (
            <Ficha key={i} texto="2" color={B} tachada />
          ))}
        </div>
      </div>
    ),
  },
  {
    titulo: 'Potencia de una potencia',
    texto: (
      <>
        <p>Se deja la base y se <b>multiplican</b> los exponentes:</p>
        <p className={G}>
          (<Pot b="a" e="m" />)<sup className="text-[0.6em]">n</sup> = <Pot b="a" e="m·n" />
        </p>
        <p className={G}>
          (<Pot b="2" e="3" />)<sup className="text-[0.6em]">2</sup> = <Pot b="2" e="6" />
        </p>
        <p className="text-base text-slate-600">Son dos grupos de tres doses: 3 · 2 = 6 doses.</p>
      </>
    ),
  },
  {
    titulo: 'Potencias con el mismo exponente',
    texto: (
      <>
        <p>Si tienen el mismo exponente, se operan las <b>bases</b> y se deja el exponente:</p>
        <p className={G}>
          <Pot b="a" e="n" /> · <Pot b="b" e="n" /> = <Pot b="(a · b)" e="n" />
        </p>
        <p className={G}>
          <Pot b="a" e="n" /> : <Pot b="b" e="n" /> = <Pot b="(a : b)" e="n" />
        </p>
        <p className={G}>
          <Pot b="2" e="4" /> · <Pot b="5" e="4" /> · <Pot b="3" e="4" /> = <Pot b="30" e="4" />
        </p>
      </>
    ),
  },
  {
    titulo: 'Ni misma base ni mismo exponente: factores primos',
    texto: (
      <>
        <p>Si no se puede juntar nada, se descompone cada base en factores primos y entonces sí aparecen bases iguales:</p>
        <p className="text-xl leading-loose">
          <Pot b="6" e="2" /> · <Pot b="3" e="3" /> = <Pot b="(2 · 3)" e="2" /> · <Pot b="3" e="3" /> = <Pot b="2" e="2" /> · <Pot b="3" e="2" /> · <Pot b="3" e="3" /> = <Pot b="2" e="2" /> · <Pot b="3" e="5" />
        </p>
        <p>En una fracción, lo que se repite arriba y abajo se va.</p>
      </>
    ),
  },
  {
    titulo: 'Errores típicos',
    texto: (
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <Pot b="2" e="3" /> · <Pot b="2" e="4" /> no es <Pot b="4" e="7" /> ni <Pot b="2" e="12" />: la base no se multiplica y los exponentes se suman.
        </li>
        <li>
          <Pot b="2" e="3" /> · <Pot b="3" e="4" /> no se puede juntar: ni misma base ni mismo exponente.
        </li>
        <li>
          Las propiedades son para multiplicar y dividir. <Pot b="2" e="3" /> + <Pot b="2" e="4" /> no es <Pot b="2" e="7" />: hay que calcular (8 + 16).
        </li>
        <li>
          Un número sin exponente lleva exponente 1: 2 = <Pot b="2" e="1" />.
        </li>
      </ul>
    ),
  },
]

type Op = 'producto' | 'cociente' | 'potencia'
const BASES = ['2', '3', 'a', '(−2)']

/** La máquina de exponentes: se eligen la operación y los exponentes y se ven las fichas juntarse o irse. */
function Probar() {
  const [op, setOp] = useState<Op>('producto')
  const [base, setBase] = useState('2')
  const [m, setM] = useState(4)
  const [n, setN] = useState(3)
  const b = base.replace('(', '').replace(')', '')
  const resultado = op === 'producto' ? m + n : op === 'cociente' ? m - n : m * n
  const escrito = op === 'producto' ? <><Pot b={base} e={m} /> · <Pot b={base} e={n} /></> : op === 'cociente' ? <><Pot b={base} e={m} /> : <Pot b={base} e={n} /></> : <>(<Pot b={base} e={m} />)<sup className="text-[0.6em]">{n}</sup></>
  const regla = op === 'producto' ? `${m} + ${n}` : op === 'cociente' ? `${m} − ${n}` : `${m} · ${n}`

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">La máquina de exponentes</h2>
      <div className="flex flex-wrap gap-2">
        {(
          [
            ['producto', 'Multiplicar'],
            ['cociente', 'Dividir'],
            ['potencia', 'Potencia de potencia'],
          ] as const
        ).map(([o, t]) => (
          <button key={o} className={`btn ${op === o ? 'btn-activo' : ''}`} onClick={() => setOp(o)}>
            {t}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <span className="flex flex-wrap items-center gap-1 font-semibold">
          Base:
          {BASES.map((x) => (
            <button key={x} className={`btn min-w-12 px-2 ${x === base ? 'btn-activo' : ''}`} onClick={() => setBase(x)}>
              {x}
            </button>
          ))}
        </span>
        <span className="flex items-center gap-2 font-semibold">
          {op === 'potencia' ? 'Exponente de dentro' : 'Primer exponente'} <Contador valor={m} cambiar={setM} min={1} max={7} etiqueta="el primer exponente" />
        </span>
        <span className="flex items-center gap-2 font-semibold">
          {op === 'potencia' ? 'Exponente de fuera' : 'Segundo exponente'} <Contador valor={n} cambiar={setN} min={1} max={op === 'potencia' ? 4 : 7} etiqueta="el segundo exponente" />
        </span>
      </div>

      <div className="lienzo items-start gap-4">
        <p className="text-3xl font-black text-indigo-700">{escrito}</p>
        {op === 'producto' && (
          <div className="flex flex-wrap items-center gap-1">
            <AnimatePresence>
              {Array.from({ length: m + n }, (_, k) => (
                <motion.span key={k} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: k * 0.04 }}>
                  <Ficha texto={b} color={k < m ? A : B} />
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        )}
        {op === 'cociente' && (
          <div className="flex flex-col items-start gap-1">
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: m }, (_, k) => (
                <Ficha key={k} texto={b} color={A} tachada={k < Math.min(m, n)} />
              ))}
            </div>
            <span className="h-1 w-full min-w-24 rounded bg-slate-700" />
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: n }, (_, k) => (
                <Ficha key={k} texto={b} color={B} tachada={k < Math.min(m, n)} />
              ))}
            </div>
            <p className="mt-1 text-slate-600">
              {m > n
                ? `Se van ${n} parejas: quedan ${m - n} arriba.`
                : m === n
                  ? 'Se va todo: queda 1. Por eso cualquier número elevado a 0 da 1.'
                  : `Se van ${m} parejas: quedan ${n - m} abajo. Eso se escribe con exponente negativo (lo verás en la parada siguiente).`}
            </p>
          </div>
        )}
        {op === 'potencia' && (
          <div className="flex flex-wrap items-center gap-3">
            {Array.from({ length: n }, (_, g) => (
              <span key={g} className="flex gap-1 rounded-2xl border-2 border-dashed border-indigo-300 p-1">
                {Array.from({ length: m }, (_, k) => (
                  <Ficha key={k} texto={b} color={g % 2 ? B : A} pequeña />
                ))}
              </span>
            ))}
          </div>
        )}
        <p className="text-3xl font-black">
          = {base}
          <sup className="text-[0.6em] text-fuchsia-600">{regla.replace(/-/g, '−')}</sup> = <Pot b={base} e={resultado < 0 ? `−${-resultado}` : resultado} color="#4338ca" />
        </p>
      </div>
    </section>
  )
}

/** Una única potencia, paso a paso, con el motor. */
export function pasosUnica(entrada: string): PasoG[] {
  const r = unicaPotencia(entrada.replace(/·/g, '*'))
  return [
    { linea: <span className={G}><Ep e={entrada.replace(/·/g, '*')} /></span>, explica: <p>Mira qué operaciones hay y si las potencias comparten base o exponente. Se empieza por lo de dentro de los paréntesis.</p> },
    ...r.pasos.map((p) => ({ linea: <span className="text-xl font-semibold">{p.linea}</span>, explica: <p>{p.porque}</p> })),
    { linea: <span className={`${G} text-indigo-700`}>= {escribirPot(r.pot)}</span>, explica: <p>Ya es una única potencia.</p> },
  ]
}

/** Simplificar con factores primos (el 12 de la hoja). */
export function pasosPrimos(entrada: string): PasoG[] {
  const e = entrada.replace(/·/g, '*')
  const m = primosDe(e)
  const v = [...m].reduce((t, [p, x]) => t * p ** x, 1)
  return [
    { linea: <span className={G}><Ep e={e} /></span>, explica: <p>Las bases son distintas: así no se puede juntar nada.</p> },
    { linea: <span className="text-xl font-semibold">Cada número, en factores primos</span>, explica: <p>Descompón cada número (o cada base) en factores primos. Por ejemplo, 72 = 2³ · 3² y 128 = 2⁷.</p> },
    {
      linea: <span className="text-xl font-semibold">= {[...m].map(([p, x]) => `${p}${x === 1 ? '' : sup(x)}`).join(' · ') || '1'}</span>,
      explica: <p>Junta las potencias de cada primo: arriba se suman los exponentes y, al dividir, se restan los de abajo. Lo que está arriba y abajo a la vez se va.</p>,
    },
    { linea: <span className={`${G} text-indigo-700`}>= {Number.isInteger(v) ? v : v.toFixed(4).replace('.', ',')}</span>, explica: <p>Se calcula lo que queda.</p> },
  ]
}

const EJEMPLOS = [
  { nombre: '9a', pasos: pasosUnica('(2^4*2^3*2^7)/(2^5*2^6)') },
  { nombre: '9b', pasos: pasosUnica('(x^3*(x^4)^2)/(x^6*x*x^2)') },
  { nombre: '8i', pasos: pasosUnica('((-2)^3)^5') },
  { nombre: '13d', pasos: pasosUnica('(-3)^6*(-2)^6*(-4)^6') },
  { nombre: '12a', pasos: pasosPrimos('(32*25*72)/(90*128)') },
  { nombre: '6²·3³·12²', pasos: pasosPrimos('6^2*3^3*12^2') },
]

export default function Propiedades({ modo, progreso, apuntar }: PropsParada) {
  return (
    <Parada
      id="propiedades"
      titulo="Operaciones con potencias"
      modo={modo}
      paneles={{
        entender: <Tarjetas tarjetas={TARJETAS} parada="propiedades" />,
        probar: <Probar />,
        desmenuzar: (
          <PasosGuiados
            titulo="Una única potencia, paso a paso"
            ejemplos={EJEMPLOS}
            crear={pasosUnica}
            placeholder="O escribe la tuya: (3^4·3^2)^3 : 3^5"
            ayuda="Escribe ^ para el exponente, · o * para multiplicar, : para dividir y paréntesis. Las bases negativas, entre paréntesis: (−2)^3."
          />
        ),
        practicar: <Practica clase={PROPIEDADES} generar={nuevaPropiedades} progreso={progreso} apuntar={apuntar} />,
      }}
    />
  )
}
