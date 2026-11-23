// Tema 3 · Parada 1: qué es una potencia, base y exponente, el signo y la trampa del paréntesis.
import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Parada, { Tarjetas, type PropsParada, type Tarjeta } from '../../componentes/Parada'
import Practica from '../../componentes/Practica'
import { Contador } from '../../componentes/piezas'
import { PasosGuiados, type PasoG } from '../../componentes/fraccionesUI'
import { SIGNO, nuevaSigno } from '../../contenido/tema3'
import { potencia } from '../../lib/potencias'
import { fr } from '../../lib/fracciones'
import { Ficha, Pot, conPunto } from './comun'

const G = 'text-2xl font-bold'
const ent = (n: number) => (n < 0 ? `−${conPunto(-n)}` : conPunto(n))
const entP = (n: number) => (n < 0 ? `(−${-n})` : String(n))

const TARJETAS: Tarjeta[] = [
  {
    titulo: '¿Qué es una potencia?',
    texto: (
      <>
        <p>
          Una <b>potencia</b> es una multiplicación de factores iguales escrita en corto:
        </p>
        <p className={G}>
          3 · 3 · 3 · 3 = <Pot b="3" e="4" /> = 81
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            La <b>base</b> (3) es el número que se repite.
          </li>
          <li>
            El <b>exponente</b> (4) dice cuántas veces se multiplica.
          </li>
        </ul>
        <p className="text-base text-slate-600">Se lee «tres elevado a cuatro». Con exponente 2 se dice «al cuadrado» y con 3, «al cubo».</p>
      </>
    ),
    visual: (
      <div className="flex items-start gap-1 text-7xl font-black text-indigo-700">
        <span className="flex flex-col items-center">
          3<span className="mt-2 rounded-full bg-indigo-100 px-3 py-1 text-base font-bold text-indigo-700">base</span>
        </span>
        <span className="flex flex-col items-center text-4xl text-fuchsia-600">
          4<span className="mt-1 rounded-full bg-fuchsia-100 px-3 py-1 text-base font-bold">exponente</span>
        </span>
      </div>
    ),
  },
  {
    titulo: 'El signo de una potencia',
    texto: (
      <>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <b>Base positiva</b>: el resultado siempre es positivo.
          </li>
          <li>
            <b>Base negativa y exponente par</b>: positivo. Los negativos se emparejan y cada pareja da +.
          </li>
          <li>
            <b>Base negativa y exponente impar</b>: negativo. Queda uno sin pareja.
          </li>
        </ul>
        <p className={G}>
          <Pot b="(−2)" e="4" /> = 16 · <Pot b="(−2)" e="3" /> = −8
        </p>
      </>
    ),
    visual: (
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-1">
          {[0, 1, 2, 3].map((i) => (
            <Ficha key={i} texto="−2" color={i < 2 ? '#6366f1' : '#a855f7'} />
          ))}
          <span className="ml-2 text-2xl font-bold text-emerald-600">= +16</span>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {[0, 1, 2].map((i) => (
            <Ficha key={i} texto="−2" color={i < 2 ? '#6366f1' : '#e11d48'} />
          ))}
          <span className="ml-2 text-2xl font-bold text-rose-600">= −8</span>
        </div>
        <p className="nota">Cada pareja (mismo color) da positivo; el que se queda solo pone el −.</p>
      </div>
    ),
  },
  {
    titulo: '¡Cuidado con el paréntesis!',
    texto: (
      <>
        <p>No es lo mismo:</p>
        <p className={G}>
          <Pot b="(−2)" e="6" /> = (−2)·(−2)·(−2)·(−2)·(−2)·(−2) = 64
        </p>
        <p className={G}>
          −<Pot b="2" e="6" /> = −(2·2·2·2·2·2) = −64
        </p>
        <p>
          Sin paréntesis, la base es solo el 2: el exponente no «ve» el signo menos. Con paréntesis, el menos es parte de la base.
        </p>
      </>
    ),
  },
  {
    titulo: 'Potencias que se hacen de cabeza',
    texto: (
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <Pot b="1" e="n" /> = 1 siempre.
        </li>
        <li>
          <Pot b="(−1)" e="n" /> = 1 si n es par y −1 si es impar.
        </li>
        <li>
          <Pot b="10" e="n" /> = un 1 seguido de n ceros: <Pot b="10" e="4" /> = 10 000.
        </li>
        <li>
          Una potencia de base 2 (con exponente 1 o más) siempre es par: 2, 4, 8, 16, 32…
        </li>
      </ul>
    ),
  },
  {
    titulo: 'Problemas: cuadrados y cubos',
    texto: (
      <>
        <p>Las potencias salen solas al medir:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            El <b>área de un cuadrado</b> es lado · lado = <Pot b="lado" e="2" />. Un salón de 11 m de lado tiene <Pot b="11" e="2" /> = 121 m².
          </li>
          <li>
            El <b>volumen de un cubo</b> es <Pot b="arista" e="3" />. Un cubo de 10 cm de arista tiene <Pot b="10" e="3" /> = 1000 cm³.
          </li>
        </ul>
      </>
    ),
  },
]

/** Fábrica de potencias: se eligen base y exponente y se ve la multiplicación, el signo de cada paso y el resultado. */
function Probar() {
  const [b, setB] = useState(-2)
  const [e, setE] = useState(5)
  const [conParen, setConParen] = useState(true)
  const base = b < 0 && !conParen ? -b : b
  const parciales = Array.from({ length: e }, (_, k) => potencia(fr(base), k + 1).n)
  const final = b < 0 && !conParen ? -parciales[e - 1] : parciales[e - 1]
  const escrito = b < 0 && !conParen ? <>−<Pot b={String(-b)} e={String(e)} /></> : <Pot b={entP(b)} e={String(e)} />

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">La fábrica de potencias</h2>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <span className="flex items-center gap-2 font-semibold">
          Base <Contador valor={b} cambiar={(v) => setB(v === 0 ? (v > b ? 1 : -1) : v)} min={-10} max={10} etiqueta="la base" />
        </span>
        <span className="flex items-center gap-2 font-semibold">
          Exponente <Contador valor={e} cambiar={setE} min={1} max={10} etiqueta="el exponente" />
        </span>
      </div>
      {b < 0 && (
        <div className="flex flex-wrap gap-2">
          <button className={`btn ${conParen ? 'btn-activo' : ''}`} onClick={() => setConParen(true)}>
            Con paréntesis: (−{-b})<sup>{e}</sup>
          </button>
          <button className={`btn ${!conParen ? 'btn-activo' : ''}`} onClick={() => setConParen(false)}>
            Sin paréntesis: −{-b}
            <sup>{e}</sup>
          </button>
        </div>
      )}
      <div className="lienzo items-start gap-4">
        <p className="text-4xl font-black text-indigo-700">{escrito}</p>
        <div className="flex flex-wrap items-center gap-1">
          {b < 0 && !conParen && <span className="mr-1 text-3xl font-bold text-rose-600">−(</span>}
          <AnimatePresence initial={false}>
            {parciales.map((_, k) => (
              <motion.span key={k} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className="flex items-center gap-1.5">
                {k > 0 && <span className="px-0.5 text-xl font-bold text-slate-400">·</span>}
                <Ficha texto={entP(base)} color={base < 0 ? (k % 2 === 0 && k === e - 1 ? '#e11d48' : Math.floor(k / 2) % 2 === 0 ? '#6366f1' : '#a855f7') : '#0ea5e9'} />
              </motion.span>
            ))}
          </AnimatePresence>
          {b < 0 && !conParen && <span className="ml-1 text-3xl font-bold text-rose-600">)</span>}
        </div>
        <div className="w-full overflow-x-auto">
          <table className="text-lg">
            <tbody>
              {parciales.map((p, k) => (
                <tr key={k}>
                  <td className="pr-3 text-slate-500">
                    {k + 1} {k === 0 ? 'factor' : 'factores'}
                  </td>
                  <td className={`font-bold tabular-nums ${p < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>{ent(p)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <motion.p key={`${b}${e}${conParen}`} initial={{ scale: 0.6 }} animate={{ scale: 1 }} className={`text-4xl font-black tabular-nums ${final < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
          = {ent(final)}
        </motion.p>
        <p className="text-lg">
          {b < 0 && !conParen
            ? 'Sin paréntesis, la base es positiva y el − se queda fuera: el resultado es negativo siempre.'
            : b > 0
              ? 'Base positiva: el resultado es positivo.'
              : e % 2 === 0
                ? `Base negativa y exponente par (${e}): todos los factores se emparejan y sale positivo.`
                : `Base negativa y exponente impar (${e}): queda un factor sin pareja y sale negativo.`}
        </p>
      </div>
    </section>
  )
}

/** «(−2)^6» o «−2^6»: qué es la base, la multiplicación y el signo. */
export function pasosSigno(entrada: string): PasoG[] {
  const s = entrada.replace(/\s+/g, '').replace(/[−–]/g, '-')
  const m = /^(-?)(\(-?\d+\)|\d+)\^(\d+)$/.exec(s)
  if (!m) throw new Error('Escribe una potencia como (−2)^6 o −2^6.')
  const fuera = m[1] === '-'
  const b = Number(m[2].replace(/[()]/g, ''))
  const e = Number(m[3])
  if (e < 1 || e > 12) throw new Error('Usa un exponente entre 1 y 12.')
  if (Math.abs(b) > 20) throw new Error('Usa una base pequeña, entre −20 y 20.')
  const v = potencia(fr(b), e).n
  const total = fuera ? -v : v
  const escrito = <>{fuera ? '−' : ''}<Pot b={m[2].replace('-', '−')} e={String(e)} /></>
  const factores = Array.from({ length: e }, () => entP(b)).join(' · ')
  return [
    { linea: <span className={G}>{escrito}</span>, explica: <p>Vamos a calcularla. Lo primero: ¿cuál es la base?</p> },
    {
      linea: (
        <span className={G}>
          {escrito} = {fuera ? '−(' : ''}
          {factores}
          {fuera ? ')' : ''}
        </span>
      ),
      explica: fuera ? <p>No hay paréntesis alrededor del −: la base es {Math.abs(b)} y el − se queda fuera, esperando.</p> : <p>La base es {entP(b)}: se multiplica {e} veces.</p>,
    },
    {
      linea: (
        <span className={G}>
          = {fuera ? '−' : ''}
          {ent(Math.abs(v))}
          {(fuera || v < 0) && <span className="text-base font-normal text-slate-500"> (falta el signo)</span>}
        </span>
      ),
      explica: <p>Primero el número, sin pensar en el signo: {Math.abs(b)} multiplicado {e} veces da {ent(Math.abs(v))}.</p>,
    },
    {
      linea: <span className={`${G} ${total < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>= {ent(total)}</span>,
      explica: (
        <p>
          {fuera
            ? 'El menos de fuera se pone al final: el resultado es negativo.'
            : b > 0
              ? 'Base positiva: positivo.'
              : e % 2 === 0
                ? 'Base negativa con exponente par: positivo.'
                : 'Base negativa con exponente impar: negativo.'}
        </p>
      ),
    },
  ]
}

const EJEMPLOS = ['(-2)^6', '-2^6', '(-3)^5', '(-1)^7', '(-10)^4'].map((s) => ({ nombre: s, pasos: pasosSigno(s) }))

export default function Signo({ modo, progreso, apuntar }: PropsParada) {
  return (
    <Parada
      id="signo"
      titulo="Potencias y su signo"
      modo={modo}
      paneles={{
        entender: <Tarjetas tarjetas={TARJETAS} parada="signo" />,
        probar: <Probar />,
        desmenuzar: <PasosGuiados titulo="Una potencia, paso a paso" ejemplos={EJEMPLOS} crear={pasosSigno} placeholder="O escribe la tuya: (−4)^3" ayuda="Escribe la potencia con ^ para el exponente; si la base es negativa, ponla entre paréntesis." />,
        practicar: <Practica clase={SIGNO} generar={nuevaSigno} progreso={progreso} apuntar={apuntar} />,
      }}
    />
  )
}
