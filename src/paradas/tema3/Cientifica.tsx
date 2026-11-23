// Tema 3 · Parada 4: notación científica. Escribir números muy grandes y muy pequeños, pasarlos a cifras, operar y
// comparar.
import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Parada, { Tarjetas, type PropsParada, type Tarjeta } from '../../componentes/Parada'
import Practica from '../../componentes/Practica'
import { PasosGuiados, type PasoG } from '../../componentes/fraccionesUI'
import { CIENTIFICA, Ci, nuevaCientifica } from '../../contenido/tema3'
import { aCientifica, operarCientifica, sumarCientifica, todasLasCifras, type Cientifica } from '../../lib/potencias'

const G = 'text-2xl font-bold'

const TARJETAS: Tarjeta[] = [
  {
    titulo: '¿Para qué sirve?',
    texto: (
      <>
        <p>Para escribir números muy grandes o muy pequeños sin una fila de ceros:</p>
        <p className={G}>
          150 000 000 km = <Ci c={{ m: 1.5, e: 8 }} /> km
        </p>
        <p className={G}>
          0,000005 = <Ci c={{ m: 5, e: -6 }} />
        </p>
        <p>
          Un número en notación científica es <b>a · 10ⁿ</b>, donde <b>a</b> tiene <b>una sola cifra, que no sea 0, delante de la coma</b> (1 ≤ a &lt; 10) y n es un entero.
        </p>
      </>
    ),
  },
  {
    titulo: 'Números grandes: exponente positivo',
    texto: (
      <>
        <p>Se corre la coma a la <b>izquierda</b> hasta dejar una cifra delante. Los lugares que se mueve son el exponente.</p>
        <p className={G}>
          13 800 000 → 1,38 · 10<sup>7</sup>
        </p>
        <p className="text-base text-slate-600">La coma (que está al final, 13 800 000,) salta 7 cifras a la izquierda.</p>
      </>
    ),
  },
  {
    titulo: 'Números pequeños: exponente negativo',
    texto: (
      <>
        <p>Se corre la coma a la <b>derecha</b> hasta pasar la primera cifra que no es 0. El exponente es negativo.</p>
        <p className={G}>
          0,0000173 → 1,73 · 10<sup>−5</sup>
        </p>
        <p className="text-base text-slate-600">La coma salta 5 lugares a la derecha: 0,0000173 → 00000,173 → 1,73.</p>
        <p>Y al revés: con exponente positivo la coma vuelve a la derecha y con negativo, a la izquierda, rellenando con ceros.</p>
      </>
    ),
  },
  {
    titulo: 'Multiplicar y dividir',
    texto: (
      <>
        <p>Los números por un lado y las potencias de 10 por otro. Al final, se reajusta si hace falta.</p>
        <p className="text-xl leading-loose">
          (3 · 10<sup>5</sup>) · (2 · 10<sup>6</sup>) = 6 · 10<sup>11</sup>
        </p>
        <p className="text-xl leading-loose">
          (8 · 10<sup>11</sup>) : (5 · 10<sup>3</sup>) = 1,6 · 10<sup>8</sup>
        </p>
        <p className="text-xl leading-loose">
          (5 · 10<sup>−7</sup>) · (8 · 10<sup>−9</sup>) = 40 · 10<sup>−16</sup> = 4 · 10<sup>−15</sup>
        </p>
        <p className="text-base text-slate-600">40 tiene dos cifras: la coma salta una a la izquierda y el exponente sube uno.</p>
      </>
    ),
  },
  {
    titulo: 'Sumar y restar',
    texto: (
      <>
        <p>Solo se puede con <b>la misma potencia de 10</b>: se pasan todas a la mayor, se suman o restan los números y la potencia se queda.</p>
        <p className="text-xl leading-loose">2 · 10⁻⁵ + 1,8 · 10⁻⁶ = 20 · 10⁻⁶ + 1,8 · 10⁻⁶ = 21,8 · 10⁻⁶ = 2,18 · 10⁻⁵</p>
        <p className="text-xl leading-loose">3,6 · 10¹² − 4 · 10¹¹ = 3,6 · 10¹² − 0,4 · 10¹² = 3,2 · 10¹²</p>
      </>
    ),
  },
  {
    titulo: 'Comparar',
    texto: (
      <>
        <p>
          Primero se mira el <b>exponente</b>: el que lo tiene mayor es el mayor. Si el exponente es igual, se mira el número de delante.
        </p>
        <p className="text-xl leading-loose">
          <Ci c={{ m: 6.39, e: 23 }} /> &lt; <Ci c={{ m: 5.97, e: 24 }} />
        </p>
        <p className="text-base text-slate-600">💡 Antes, pásalos todos a la misma unidad y bien escritos (3285 · 10²⁰ = 3,285 · 10²³).</p>
      </>
    ),
  },
]

/** Del más pequeño al más grande, en metros. Sin marcas ni personajes: cosas de la naturaleza y distancias. */
const ESCALA: { cosa: string; icono: string; m: number }[] = [
  { cosa: 'Un virus', icono: '🦠', m: 1e-7 },
  { cosa: 'Una célula', icono: '🔬', m: 2e-5 },
  { cosa: 'Un grano de arena', icono: '⏳', m: 5e-4 },
  { cosa: 'Una hormiga', icono: '🐜', m: 5e-3 },
  { cosa: 'Una persona', icono: '🧍', m: 1.7 },
  { cosa: 'Una ballena azul', icono: '🐋', m: 30 },
  { cosa: 'La catedral de Santiago (de alta)', icono: '⛪', m: 74 },
  { cosa: 'El Everest', icono: '🏔️', m: 8.85e3 },
  { cosa: 'De Santiago a Madrid', icono: '🚗', m: 6e5 },
  { cosa: 'El radio de la Tierra', icono: '🌍', m: 6.37e6 },
  { cosa: 'De la Tierra a la Luna', icono: '🌙', m: 3.84e8 },
  { cosa: 'De la Tierra al Sol', icono: '☀️', m: 1.5e11 },
  { cosa: 'Un año luz', icono: '💫', m: 9.46e15 },
  { cosa: 'Hasta Alfa Centauro', icono: '⭐', m: 4.07e16 },
  { cosa: 'Hasta la galaxia de Andrómeda', icono: '🌌', m: 2.4e22 },
]

/** El viaje de escalas: se desliza y se ve cada cosa con su tamaño en notación científica. */
function Escalas() {
  const [i, setI] = useState(4)
  const x = ESCALA[i]
  const c = aCientifica(x.m)
  const ant = i > 0 ? ESCALA[i - 1] : null
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold">De un virus a una galaxia</h3>
      <input type="range" min={0} max={ESCALA.length - 1} value={i} onChange={(ev) => setI(Number(ev.target.value))} className="w-full accent-indigo-600" aria-label="Tamaño" />
      <div className="flex justify-between text-2xl" aria-hidden="true">
        {ESCALA.map((y, k) => (
          <button key={k} className={`cursor-pointer transition ${k === i ? 'scale-150' : 'opacity-40'}`} onClick={() => setI(k)} aria-label={y.cosa}>
            {y.icono}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="lienzo min-h-0 gap-2 text-center">
          <span className="text-6xl">{x.icono}</span>
          <b className="text-xl">{x.cosa}</b>
          <span className="text-3xl font-black text-indigo-700">
            <Ci c={c} /> m
          </span>
          <span className="max-w-full text-lg break-all text-slate-500 tabular-nums">{todasLasCifras(c)} m</span>
          {ant && <span className="text-slate-600">Unas {Math.round(x.m / ant.m).toLocaleString('es-ES')} veces lo anterior ({ant.cosa.toLowerCase()}).</span>}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/** Mueve la coma: se escribe un número y se ven los saltos de la coma hasta la notación científica. */
function MueveLaComa() {
  const [txt, setTxt] = useState('0,0000173')
  const [n, setN] = useState('0,0000173')
  const [error, setError] = useState('')
  const limpio = n.replace(/\s+/g, '')
  const [ent, dec = ''] = limpio.split(',')
  const digitos = (ent + dec).split('')
  const c = aCientifica(limpio)
  // Dónde está la coma ahora (después de cuántas cifras) y dónde acaba.
  const desde = ent.length
  const primera = digitos.findIndex((d) => d !== '0')
  const hasta = primera + 1
  const [paso, setPaso] = useState(0)
  const saltos = Math.abs(hasta - desde)
  const pos = desde + Math.sign(hasta - desde) * Math.min(paso, saltos)

  function usar(ev: FormEvent) {
    ev.preventDefault()
    const s = txt.trim().replace(/\./g, '')
    if (!/^\d[\d\s]*(,\d+)?$/.test(s) || !/[1-9]/.test(s)) return setError('Escribe un número positivo, con coma para los decimales: 4 800 000 o 0,00045.')
    setError('')
    setN(s.replace(/\s+/g, ''))
    setPaso(0)
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold">La coma que salta</h3>
      <form onSubmit={usar} className="flex flex-wrap items-center gap-2">
        <input className="campo w-56" inputMode="decimal" aria-label="Número" value={txt} onChange={(ev) => setTxt(ev.target.value)} />
        <button className="btn">Usar</button>
        {['13800000', '0,0000173', '54900000000', '0,00045'].map((s) => (
          <button
            key={s}
            type="button"
            className="btn"
            onClick={() => {
              setTxt(s)
              setN(s)
              setPaso(0)
            }}
          >
            {todasLasCifras(aCientifica(s))}
          </button>
        ))}
      </form>
      {error && <p className="text-red-700">{error}</p>}
      <div className="lienzo min-h-0 items-start gap-3">
        <div className="flex max-w-full flex-wrap items-end font-mono text-3xl font-bold">
          {digitos.map((d, k) => (
            <span key={k} className="flex items-end">
              {k === pos && k > 0 && <motion.span layoutId="coma" className="text-rose-600">,</motion.span>}
              <span className={`${k >= Math.min(pos, desde) && k < Math.max(pos, desde) ? 'rounded bg-amber-200' : ''} ${k < primera ? 'text-slate-400' : ''}`}>{d}</span>
            </span>
          ))}
          {pos >= digitos.length && <motion.span layoutId="coma" className="text-rose-600">,</motion.span>}
        </div>
        <p className="text-lg">
          {paso === 0 ? (
            <>La coma está {desde >= digitos.length ? 'al final' : `después de la cifra ${desde}`}. Tiene que quedar una sola cifra (no 0) delante.</>
          ) : (
            <>
              {Math.min(paso, saltos)} {Math.min(paso, saltos) === 1 ? 'salto' : 'saltos'} a la {hasta < desde ? 'izquierda' : 'derecha'}.
            </>
          )}
        </p>
        <div className="flex flex-wrap gap-2">
          <button className="btn btn-primario" disabled={paso >= saltos} onClick={() => setPaso(paso + 1)}>
            Saltar →
          </button>
          <button className="btn" disabled={paso >= saltos} onClick={() => setPaso(saltos)}>
            Todos los saltos
          </button>
          <button className="btn" disabled={paso === 0} onClick={() => setPaso(0)}>
            Volver a empezar
          </button>
        </div>
        {paso >= saltos && (
          <motion.p initial={{ scale: 0.7 }} animate={{ scale: 1 }} className="text-3xl font-black text-indigo-700">
            = <Ci c={c} />
            <span className="ml-3 text-base font-semibold text-slate-600">
              {saltos} saltos a la {hasta < desde ? 'izquierda: exponente positivo' : 'derecha: exponente negativo'}
            </span>
          </motion.p>
        )}
      </div>
    </div>
  )
}

function Probar() {
  return (
    <section className="space-y-8">
      <MueveLaComa />
      <Escalas />
    </section>
  )
}

const linea = (s: string) => <span className="text-xl font-semibold">{s}</span>

/** Pasar a notación científica, paso a paso. */
export function pasosACientifica(entrada: string): PasoG[] {
  const s = entrada.trim()
  if (!/^-?\d[\d\s.]*(,\d+)?$/.test(s) || !/[1-9]/.test(s)) throw new Error('Escribe un número, con coma para los decimales.')
  const c = aCientifica(s)
  return [
    { linea: linea(s), explica: <p>Hay que dejar una sola cifra, que no sea 0, delante de la coma.</p> },
    { linea: linea(`${String(Math.abs(c.m)).replace('.', ',')} …`), explica: <p>Las cifras que importan empiezan en la primera que no es 0: {String(Math.abs(c.m)).replace('.', '').replace(',', '')}. La coma va detrás de la primera.</p> },
    {
      linea: <span className="text-xl font-semibold">= <Ci c={c} /></span>,
      explica: <p>{c.e >= 0 ? `La coma se ha movido ${c.e} lugares a la izquierda: el exponente es ${c.e}.` : `La coma se ha movido ${-c.e} lugares a la derecha: el exponente es −${-c.e}.`}</p>,
    },
  ]
}

const pasosOp = (a: Cientifica, op: '·' | ':' | '+' | '−', b: Cientifica): PasoG[] => {
  const r = op === '·' || op === ':' ? operarCientifica(a, op, b) : sumarCientifica(a, op, b)
  return [
    {
      linea: (
        <span className="text-xl font-semibold">
          {op === '·' || op === ':' ? '(' : ''}
          <Ci c={a} />
          {op === '·' || op === ':' ? ')' : ''} {op} {op === '·' || op === ':' ? '(' : ''}
          <Ci c={b} />
          {op === '·' || op === ':' ? ')' : ''}
        </span>
      ),
      explica: <p>{op === '+' || op === '−' ? 'Para sumar o restar, hace falta la misma potencia de 10.' : 'Se agrupan los números por un lado y las potencias de 10 por otro.'}</p>,
    },
    ...r.pasos.map((p) => ({ linea: linea(p.linea), explica: <p>{p.porque}</p> })),
  ]
}

const EJEMPLOS = [
  { nombre: '13 800 000', pasos: pasosACientifica('13 800 000') },
  { nombre: '0,0000173', pasos: pasosACientifica('0,0000173') },
  { nombre: '7e', pasos: pasosOp({ m: 8, e: 11 }, ':', { m: 5, e: 3 }) },
  { nombre: '12h', pasos: pasosOp({ m: 5, e: -7 }, '·', { m: 8, e: -9 }) },
  { nombre: 'Ejemplo de la hoja', pasos: pasosOp({ m: 2, e: -5 }, '+', { m: 1.8, e: -6 }) },
  { nombre: '6a', pasos: pasosOp({ m: 3.6, e: 12 }, '−', { m: 4, e: 11 }) },
]

export default function CientificaParada({ modo, progreso, apuntar }: PropsParada) {
  return (
    <Parada
      id="cientifica"
      titulo="Notación científica"
      modo={modo}
      paneles={{
        entender: <Tarjetas tarjetas={TARJETAS} parada="cientifica" />,
        probar: <Probar />,
        desmenuzar: <PasosGuiados titulo="Notación científica, paso a paso" ejemplos={EJEMPLOS} crear={pasosACientifica} placeholder="O pasa el tuyo: 0,00000826" ayuda="Escribe un número muy grande o muy pequeño (con coma para los decimales) y verás cómo se pasa." />,
        practicar: <Practica clase={CIENTIFICA} generar={nuevaCientifica} progreso={progreso} apuntar={apuntar} />,
      }}
    />
  )
}

