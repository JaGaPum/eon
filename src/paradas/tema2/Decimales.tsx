// Tema 2 · Parada 5: expresión decimal de una fracción (exacto, periódico puro y mixto) y fracción generatriz.
import { useState, type ReactNode } from 'react'
import { motion } from 'motion/react'
import Parada, { Tarjetas, type PropsParada, type Tarjeta } from '../../componentes/Parada'
import Practica from '../../componentes/Practica'
import { Contador } from '../../componentes/piezas'
import { F, Per } from '../../componentes/mat'
import { PasosGuiados, type PasoG } from '../../componentes/fraccionesUI'
import { DECIMALES, nuevaDecimales } from '../../contenido/tema2'
import { expansion, generatriz, NOMBRE_TIPO, tipoDe } from '../../lib/fracciones'

const C = 'text-xl leading-loose'

// Colores de la plantilla de «Organiza tus ideas»: rojo, amarillo, morado y turquesa.
const ROJO = '#dc2626'
const AMARILLO = '#ca8a04'
const MORADO = '#7c3aed'
const TURQUESA = '#0891b2'
const Caja = ({ color, children }: { color: string; children: ReactNode }) => (
  <span className="rounded-md border-2 px-1.5 py-0.5 font-bold" style={{ borderColor: color, color }}>
    {children}
  </span>
)

const TARJETAS: Tarjeta[] = [
  {
    titulo: 'De fracción a decimal',
    texto: (
      <>
        <p>Al dividir el numerador entre el denominador sale un número que puede ser:</p>
        <ul className="space-y-2">
          <li>
            <b>Entero</b>, si el numerador es múltiplo del denominador: <F n={32} d={8} /> = 4.
          </li>
          <li>
            <b>Decimal exacto</b>, con un número limitado de cifras: <F n={3} d={4} /> = 0,75.
          </li>
          <li>
            <b>Periódico puro</b>, si se repiten todas las cifras desde la coma: <F n={71} d={3} /> = 23,666… = <Per ent="23" per="6" />.
          </li>
          <li>
            <b>Periódico mixto</b>, si antes del período hay cifras que no se repiten: <F n={611} d={495} /> = 1,2343434… = <Per ent="1" ante="2" per="34" />.
          </li>
        </ul>
      </>
    ),
  },
  {
    titulo: 'Las partes de un decimal periódico',
    texto: (
      <>
        <p className="text-center text-4xl">
          <Per ent="1" ante="2" per="34" />
        </p>
        <ul className="space-y-1">
          <li>
            <b>Parte entera</b>: lo de antes de la coma, 1.
          </li>
          <li>
            <b>Anteperíodo</b>: las cifras decimales que no se repiten, 2.
          </li>
          <li>
            <b>Período</b>: las que se repiten sin fin, 34. Se escribe con un arco encima.
          </li>
        </ul>
        <p className="text-base text-slate-600">💡 Si no hay anteperíodo es periódico puro; si lo hay, mixto.</p>
      </>
    ),
  },
  {
    titulo: 'Los números decimales',
    texto: (
      <ul className="space-y-2">
        <li>
          <b>Exactos</b> (limitados): 1,75.
        </li>
        <li>
          <b>Ilimitados periódicos</b>: puros como <Per ent="0" per="48" /> y mixtos como <Per ent="2" ante="1" per="6" />. Todos vienen de una fracción.
        </li>
        <li>
          <b>Ilimitados no periódicos</b>: no se repite nada, como π = 3,141592654… Estos no vienen de ninguna fracción.
        </li>
      </ul>
    ),
  },
  {
    titulo: 'Fracción generatriz de un decimal exacto',
    texto: (
      <>
        <p>
          <b>Numerador</b>: el número sin la coma. <b>Denominador</b>: un 1 con tantos ceros como cifras decimales. Después se simplifica.
        </p>
        <p className={C}>
          2,15 = <F n={215} d={100} /> = <F n={43} d={20} />
        </p>
      </>
    ),
  },
  {
    titulo: 'Fracción generatriz de un periódico',
    texto: (
      <>
        <p className="space-x-1">
          <b>Numerador</b>: <Caja color={ROJO}>el número sin la coma</Caja> − <Caja color={AMARILLO}>la parte que no se repite, sin la coma</Caja>
        </p>
        <p className="space-x-1">
          <b>Denominador</b>: <Caja color={MORADO}>tantos 9 como cifras del período</Caja> y <Caja color={TURQUESA}>tantos 0 como cifras del anteperíodo</Caja>
        </p>
        <p className={C}>
          Puro: <Per ent="1" per="05" /> = <span className="inline-flex flex-col items-center align-middle"><span><Caja color={ROJO}>105</Caja> − <Caja color={AMARILLO}>1</Caja></span><span className="my-1 h-0.5 w-full bg-current" /><Caja color={MORADO}>99</Caja></span> = <F n={104} d={99} />
        </p>
        <p className={C}>
          Mixto: <Per ent="1" ante="0" per="2" /> = <span className="inline-flex flex-col items-center align-middle"><span><Caja color={ROJO}>102</Caja> − <Caja color={AMARILLO}>10</Caja></span><span className="my-1 h-0.5 w-full bg-current" /><span><Caja color={MORADO}>9</Caja><Caja color={TURQUESA}>0</Caja></span></span> = <F n={92} d={90} /> = <F n={46} d={45} />
        </p>
      </>
    ),
  },
]

/** La división hecha cifra a cifra: cada cifra sale del resto anterior. Cuando un resto se repite, hay período. */
function Probar() {
  const [n, setN] = useState(7)
  const [d, setD] = useState(6)
  const [k, setK] = useState(0)
  const x = expansion(n, d)
  const total = x.pasos.length
  const repite = x.per ? x.pasos.length - x.per.length : -1
  const cambiar = (f: (v: number) => void) => (v: number) => {
    f(v)
    setK(0)
  }
  const cifras = x.pasos.slice(0, k).map((p) => p.cifra).join('')
  const terminado = k === total
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">Dividir cifra a cifra</h2>
      <p className="text-lg">Elige una fracción y haz la división paso a paso. Fíjate en los restos: si alguno se repite, las cifras también se repetirán siempre.</p>
      <div className="flex flex-wrap items-center gap-4">
        <span className="font-semibold">Numerador</span>
        <Contador valor={n} cambiar={cambiar(setN)} min={1} max={99} etiqueta="numerador" />
        <span className="font-semibold">Denominador</span>
        <Contador valor={d} cambiar={cambiar(setD)} min={2} max={30} etiqueta="denominador" />
      </div>
      <div className="lienzo items-start gap-3">
        <p className="text-3xl font-bold tabular-nums">
          <F n={n} d={d} /> = {x.ent}
          {k > 0 && ','}
          {cifras}
          {!terminado && k > 0 && '…'}
        </p>
        <div className="flex flex-wrap gap-2">
          {x.pasos.slice(0, k).map((p, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-lg border px-2 py-1 text-sm ${terminado && i >= repite && repite >= 0 ? 'border-amber-400 bg-amber-50' : 'border-slate-200 bg-slate-50'}`}
            >
              resto {p.resto} → {p.resto * 10} : {d} = <b>{p.cifra}</b>
            </motion.span>
          ))}
        </div>
        {terminado && (
          <p className="text-lg">
            {x.per ? (
              <>
                El resto {x.pasos[repite].resto} ya había salido: a partir de ahí todo se repite. <F n={n} d={d} /> = <Per ent={String(x.ent)} ante={x.ante} per={x.per} />, <b>{NOMBRE_TIPO[tipoDe(x)].toLowerCase()}</b>
                {x.ante && <> (anteperíodo {x.ante})</>}, período {x.per}.
              </>
            ) : total === 0 ? (
              <>La división es exacta desde el principio: es un número <b>entero</b>.</>
            ) : (
              <>El resto ha llegado a 0: la división acaba. Es un <b>decimal exacto</b>.</>
            )}
          </p>
        )}
        <div className="flex gap-2">
          <button className="btn" disabled={k === 0} onClick={() => setK(0)}>
            Empezar de nuevo
          </button>
          <button className="btn btn-primario" disabled={terminado} onClick={() => setK(k + 1)}>
            Siguiente cifra →
          </button>
          <button className="btn" disabled={terminado} onClick={() => setK(total)}>
            Hasta el final
          </button>
        </div>
      </div>
    </section>
  )
}

/** Generatriz paso a paso. Se escribe el período entre paréntesis: 1,0(2). */
export function pasosGeneratriz(entrada: string): PasoG[] {
  const m = /^\s*(\d+)(?:[,.](\d*)(?:\((\d+)\))?)?\s*$/.exec(entrada)
  if (!m || (!m[2] && !m[3])) throw new Error('Escribe el decimal con coma y el período entre paréntesis: 2,15 o 1,0(2).')
  const ent = Number(m[1])
  const ante = m[2] ?? ''
  const per = m[3] ?? ''
  const g = generatriz(ent, ante, per)
  const numero = per ? <Per ent={String(ent)} ante={ante} per={per} /> : <span>{`${ent},${ante}`}</span>
  const tipo = per ? (ante ? 'periódico mixto' : 'periódico puro') : 'decimal exacto'
  const pasos: PasoG[] = [
    { linea: <span className="text-3xl">{numero}</span>, explica: <p>Es un {tipo}. Parte entera {ent}{ante && <>, {per ? 'anteperíodo' : 'parte decimal'} {ante}</>}{per && <>, período {per}</>}.</p> },
  ]
  if (!per) {
    pasos.push({
      linea: (
        <span className={C}>
          = <span className="inline-flex flex-col items-center align-middle"><Caja color={ROJO}>{g.sinComa}</Caja><span className="my-1 h-0.5 w-full bg-current" /><span>1<Caja color={TURQUESA}>{'0'.repeat(ante.length)}</Caja></span></span>
        </span>
      ),
      explica: <p>Arriba, el número sin la coma: {g.sinComa}. Abajo, un 1 con tantos ceros como cifras decimales ({ante.length}).</p>,
    })
  } else {
    pasos.push({
      linea: (
        <span className={C}>
          = <span className="inline-flex flex-col items-center align-middle"><span><Caja color={ROJO}>{g.sinComa}</Caja> − <Caja color={AMARILLO}>{g.noPer}</Caja></span><span className="my-1 h-0.5 w-full bg-current" /><span><Caja color={MORADO}>{'9'.repeat(per.length)}</Caja>{ante && <Caja color={TURQUESA}>{'0'.repeat(ante.length)}</Caja>}</span></span>
        </span>
      ),
      explica: (
        <p>
          Arriba, el número sin la coma ({g.sinComa}) menos lo que no se repite ({g.noPer}). Abajo, {per.length} nueve{per.length > 1 ? 's' : ''} por las cifras del período
          {ante ? ` y ${ante.length} cero${ante.length > 1 ? 's' : ''} por las del anteperíodo` : ''}.
        </p>
      ),
    })
    pasos.push({ linea: <span className={C}>= <F n={g.num} d={g.den} /></span>, explica: <p>{g.sinComa} − {g.noPer} = {g.num}.</p> })
  }
  pasos.push({
    linea: (
      <span className={C}>
        = <F n={g.f.n} d={g.f.d} />
      </span>
    ),
    explica: g.f.d === g.den ? <p>No se puede simplificar: esa es la fracción generatriz.</p> : <p>Se simplifica hasta la irreducible: esa es la fracción generatriz.</p>,
  })
  return pasos
}

const EJEMPLOS = ['2,15', '1,(05)', '1,0(2)', '2,5(1)', '0,77(2)', '12,(36)'].map((s) => ({ nombre: s, pasos: pasosGeneratriz(s) }))

function Desmenuzar() {
  return (
    <PasosGuiados
      titulo="Fracción generatriz, paso a paso"
      ejemplos={EJEMPLOS}
      crear={pasosGeneratriz}
      placeholder="O escribe el tuyo: 3,1(6)"
      ayuda="Escribe el período entre paréntesis: 0,(4) es 0,444…, y 2,5(1) es 2,5111…"
    />
  )
}

export default function Decimales({ modo, progreso, apuntar }: PropsParada) {
  return (
    <Parada
      id="decimales"
      titulo="Expresión decimal y fraccionaria"
      modo={modo}
      paneles={{
        entender: <Tarjetas tarjetas={TARJETAS} parada="decimales" />,
        probar: <Probar />,
        desmenuzar: <Desmenuzar />,
        practicar: <Practica clase={DECIMALES} generar={nuevaDecimales} progreso={progreso} apuntar={apuntar} />,
      }}
    />
  )
}

