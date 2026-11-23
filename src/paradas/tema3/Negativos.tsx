// Tema 3 · Parada 3: exponente cero, exponente negativo y potencias de fracciones.
import { useState } from 'react'
import { motion } from 'motion/react'
import Parada, { Tarjetas, type PropsParada, type Tarjeta } from '../../componentes/Parada'
import Practica from '../../componentes/Practica'
import { F } from '../../componentes/mat'
import { PasosGuiados, type PasoG } from '../../componentes/fraccionesUI'
import { NEGATIVOS, nuevaNegativos } from '../../contenido/tema3'
import { potencia } from '../../lib/potencias'
import { fr, inversa, type Fr } from '../../lib/fracciones'
import { Pot } from './comun'
import { pasosUnica } from './Propiedades'

const G = 'text-2xl font-bold'
const menos = (n: number) => (n < 0 ? `−${-n}` : String(n))

const TARJETAS: Tarjeta[] = [
  {
    titulo: 'Exponente cero',
    texto: (
      <>
        <p>Cualquier número (menos el 0) elevado a 0 da <b>1</b>:</p>
        <p className={G}>
          <Pot b="a" e="0" /> = 1
        </p>
        <p>¿Por qué? Divide una potencia entre sí misma: da 1, y con la regla de los exponentes sale exponente 0.</p>
        <p className={G}>
          <Pot b="5" e="3" /> : <Pot b="5" e="3" /> = <Pot b="5" e="3−3" /> = <Pot b="5" e="0" /> = 1
        </p>
      </>
    ),
  },
  {
    titulo: 'Exponente negativo',
    texto: (
      <>
        <p>Un exponente negativo significa <b>la inversa</b>: uno partido por la potencia con el exponente positivo.</p>
        <p className={G}>
          <Pot b="a" e="−n" /> = <span className="inline-flex flex-col items-center align-middle text-[0.8em]"><span>1</span><span className="h-0.5 w-full bg-current" /><Pot b="a" e="n" /></span>
        </p>
        <p className={G}>
          <Pot b="2" e="−3" /> = <span className="inline-flex flex-col items-center align-middle text-[0.8em]"><span>1</span><span className="h-0.5 w-full bg-current" /><Pot b="2" e="3" /></span> = <F n={1} d={8} />
        </p>
        <p className="text-base text-slate-600">💡 El exponente negativo no hace negativo el resultado: 2⁻³ es positivo, 1/8.</p>
      </>
    ),
  },
  {
    titulo: 'Fracciones con exponente negativo',
    texto: (
      <>
        <p>Se le da la vuelta a la fracción y el exponente pasa a positivo:</p>
        <p className={G}>
          <Pot b={<>(<F n={2} d={3} />)</>} e="−2" /> = <Pot b={<>(<F n={3} d={2} />)</>} e="2" /> = <F n={9} d={4} />
        </p>
        <p>Y para elevar una fracción, se elevan el numerador y el denominador:</p>
        <p className={G}>
          <Pot b={<>(<F n={2} d={5} />)</>} e="3" /> = <F n={8} d={125} />
        </p>
      </>
    ),
  },
  {
    titulo: 'Las propiedades valen igual',
    texto: (
      <>
        <p>Con exponentes negativos se suman, restan y multiplican igual, con cuidado con los signos:</p>
        <p className="text-xl leading-loose">
          <Pot b="5" e="−2" /> · <Pot b="5" e="0" /> · <Pot b="5" e="5" /> = <Pot b="5" e="−2+0+5" /> = <Pot b="5" e="3" />
        </p>
        <p className="text-xl leading-loose">
          <Pot b="2" e="−4" /> : <Pot b="2" e="−8" /> = <Pot b="2" e="−4−(−8)" /> = <Pot b="2" e="4" />
        </p>
        <p className="text-xl leading-loose">
          (<Pot b="3" e="−2" />)<sup className="text-[0.6em]">−2</sup> = <Pot b="3" e="(−2)·(−2)" /> = <Pot b="3" e="4" />
        </p>
      </>
    ),
  },
]

const BASES: { nombre: string; v: Fr }[] = [
  { nombre: '2', v: fr(2) },
  { nombre: '3', v: fr(3) },
  { nombre: '10', v: fr(10) },
  { nombre: '−2', v: fr(-2) },
  { nombre: '1/2', v: fr(1, 2) },
]

/** La escalera: bajando un escalón se divide entre la base; así se llega a exponente 0 y a los negativos. */
function Probar() {
  const [b, setB] = useState(BASES[0])
  const [sel, setSel] = useState(-2)
  const exps = [4, 3, 2, 1, 0, -1, -2, -3, -4]
  const conBase = (e: number | string) => <Pot b={b.v.d !== 1 ? <>(<F n={b.v.n} d={b.v.d} />)</> : b.v.n < 0 ? `(${b.nombre})` : b.nombre} e={typeof e === 'number' ? menos(e) : e} />
  const v = potencia(b.v, sel)
  const inv = inversa(b.v)

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">La escalera de las potencias</h2>
      <div className="flex flex-wrap items-center gap-1 font-semibold">
        Base:
        {BASES.map((x) => (
          <button key={x.nombre} className={`btn min-w-12 px-2 ${x === b ? 'btn-activo' : ''}`} onClick={() => setB(x)}>
            {x.nombre}
          </button>
        ))}
      </div>
      <p className="text-slate-600">Toca un escalón. Al bajar, cada escalón divide entre {b.nombre}.</p>
      <div className="lienzo items-start gap-1">
        {exps.map((e, k) => {
          const x = potencia(b.v, e)
          return (
            <div key={e} className="flex w-full items-center gap-2">
              <motion.button
                onClick={() => setSel(e)}
                animate={{ scale: e === sel ? 1.04 : 1 }}
                className={`flex h-12 cursor-pointer items-center gap-3 rounded-xl border-2 px-3 text-xl font-bold ${e === sel ? 'border-indigo-600 bg-indigo-50' : e === 0 ? 'border-amber-400 bg-amber-50' : e < 0 ? 'border-fuchsia-200 bg-fuchsia-50' : 'border-slate-200 bg-white'}`}
                style={{ marginLeft: `calc(${k} * min(1.1rem, 2vw))` }}
              >
                {conBase(e)} <span className="text-slate-400">=</span> <F n={x.n} d={x.d} />
              </motion.button>
              {k < exps.length - 1 && <span className="hidden text-sm font-semibold text-slate-400 sm:inline">↓ : {b.nombre}</span>}
            </div>
          )
        })}
      </div>
      <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4 text-xl">
        {sel > 0 && (
          <p>
            {conBase(sel)} = {Array.from({ length: sel }, () => (b.v.d !== 1 || b.v.n < 0 ? `(${b.nombre})` : b.nombre)).join(' · ')} = <F n={v.n} d={v.d} />
          </p>
        )}
        {sel === 0 && <p>{conBase(0)} = 1: bajando desde {conBase(1)} = {b.nombre} y dividiendo entre {b.nombre}, sale 1.</p>}
        {sel < 0 && (
          <p>
            {conBase(sel)} = 1 : {conBase(-sel)} = <Pot b={inv.d !== 1 ? <>(<F n={inv.n} d={inv.d} />)</> : inv.n < 0 ? `(${menos(inv.n)})` : String(inv.n)} e={-sel} /> = <F n={v.n} d={v.d} />. Se le da la vuelta a la base y el exponente pasa a positivo.
          </p>
        )}
      </div>
    </section>
  )
}

/** El valor de una potencia con exponente negativo o cero, paso a paso. */
export function pasosValorNeg(entrada: string): PasoG[] {
  const s = entrada.replace(/\s+/g, '').replace(/[−–]/g, '-')
  const m = /^\((-?\d+)(?:\/(\d+))?\)\^\(?(-?\d+)\)?$|^(\d+)\^\(?(-?\d+)\)?$/.exec(s)
  if (!m) throw new Error('Escribe una potencia como 4^-3, (−2)^-2 o (2/3)^-2.')
  const b = m[4] ? fr(Number(m[4])) : fr(Number(m[1]), Number(m[2] ?? 1))
  const e = Number(m[5] ?? m[3])
  if (Math.abs(e) > 8) throw new Error('Usa un exponente entre −8 y 8.')
  const v = potencia(b, e)
  const B = (x: Fr) => (x.d !== 1 ? <>(<F n={x.n} d={x.d} />)</> : x.n < 0 ? `(${menos(x.n)})` : String(x.n))
  if (e === 0) return [{ linea: <span className={G}><Pot b={B(b)} e="0" /></span>, explica: <p>Exponente 0.</p> }, { linea: <span className={G}>= 1</span>, explica: <p>Todo número (menos el 0) elevado a 0 da 1.</p> }]
  const i = e < 0 ? inversa(b) : b
  return [
    { linea: <span className={G}><Pot b={B(b)} e={menos(e)} /></span>, explica: <p>{e < 0 ? 'El exponente es negativo: primero hay que quitarlo.' : 'El exponente es positivo: se eleva directamente.'}</p> },
    ...(e < 0 ? [{ linea: <span className={G}>= <Pot b={B(i)} e={-e} /></span>, explica: <p>Se da la vuelta a la base (su inversa) y el exponente cambia de signo.</p> }] : []),
    { linea: <span className={G}>= <F n={v.n} d={v.d} /></span>, explica: <p>Se elevan el numerador y el denominador{i.n < 0 ? `; la base es negativa y el exponente ${Math.abs(e) % 2 ? 'impar: sale negativo' : 'par: sale positivo'}` : ''}.</p> },
  ]
}

const EJEMPLOS = [
  { nombre: '15a', pasos: pasosValorNeg('4^-3') },
  { nombre: '15g', pasos: pasosValorNeg('(-3)^-7') },
  { nombre: '(2/3)⁻²', pasos: pasosValorNeg('(2/3)^-2') },
  { nombre: '16a', pasos: pasosUnica('5^-2*5^0*5^5') },
  { nombre: '17c', pasos: pasosUnica('(2^3*2^-5*2^4)/(2^-2*2^0)') },
  { nombre: '((3⁻²)⁻²)⁻²', pasos: pasosUnica('((3^-2)^-2)^-2') },
]

/** Lo que escribe el alumno: si es una sola potencia, su valor; si no, una única potencia. */
const crear = (s: string) => {
  try {
    return pasosValorNeg(s)
  } catch {
    return pasosUnica(s)
  }
}

export default function Negativos({ modo, progreso, apuntar }: PropsParada) {
  return (
    <Parada
      id="negativos"
      titulo="Exponente cero y negativo"
      modo={modo}
      paneles={{
        entender: <Tarjetas tarjetas={TARJETAS} parada="negativos" />,
        probar: <Probar />,
        desmenuzar: <PasosGuiados titulo="Exponentes negativos, paso a paso" ejemplos={EJEMPLOS} crear={crear} placeholder="O escribe la tuya: (−2)^-3 o 3^-2 · 3^5" ayuda="Una potencia sola (sale su valor) o varias con · y : (sale una única potencia)." />,
        practicar: <Practica clase={NEGATIVOS} generar={nuevaNegativos} progreso={progreso} apuntar={apuntar} />,
      }}
    />
  )
}
