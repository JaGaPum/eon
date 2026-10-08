// Tema 2 · Parada 6: truncamiento, redondeo, por exceso o por defecto, error absoluto y relativo.
import { useState } from 'react'
import Parada, { Tarjetas, type PropsParada, type Tarjeta } from '../../componentes/Parada'
import Practica from '../../componentes/Practica'
import { F } from '../../componentes/mat'
import { PasosGuiados, type PasoG } from '../../componentes/fraccionesUI'
import { APROXIMAR, nuevaAproximar } from '../../contenido/tema2'
import { decimalAFr, errores, fr, leer, nombreOrden, redondear, truncar, valorDe, type Fr } from '../../lib/fracciones'

const C = 'text-xl leading-loose'
const coma = (x: number, c = 4) => Number(x.toFixed(c)).toString().replace('.', ',')

const TARJETAS: Tarjeta[] = [
  {
    titulo: 'Truncamiento',
    texto: (
      <>
        <p>
          <b>Truncar</b> es cortar: se quitan todas las cifras decimales que van después de un orden (décimas, centésimas, milésimas…), sin mirar cuáles son.
        </p>
        <p className={C}>A las centésimas: 23,456 → 23,45 · 342,6743 → 342,67</p>
      </>
    ),
  },
  {
    titulo: 'Redondeo',
    texto: (
      <>
        <p>
          Para <b>redondear</b> se mira la <b>primera cifra que se quita</b>:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Si es menor que 5, se deja como al truncar.</li>
          <li>Si es 5, 6, 7, 8 o 9, se suma uno a la última cifra que queda.</li>
        </ul>
        <p className={C}>
          A las centésimas: 23,4<b className="text-rose-600">5</b>6 → 23,4<b className="text-rose-600">6</b> · 342,67<b>4</b>3 → 342,67
        </p>
      </>
    ),
  },
  {
    titulo: 'Por exceso o por defecto',
    texto: (
      <>
        <p>
          Si la aproximación es <b>mayor</b> que el número exacto, es <b>por exceso</b>. Si es <b>menor</b>, es <b>por defecto</b>.
        </p>
        <p className={C}>23,456 → 23,46 por exceso · 23,456 → 23,45 por defecto</p>
        <p className="text-base text-slate-600">💡 Truncar un número positivo siempre es por defecto: le quitas cifras.</p>
      </>
    ),
  },
  {
    titulo: 'Error absoluto',
    texto: (
      <>
        <p>
          Es la diferencia entre el valor exacto y la aproximación, siempre en positivo (en valor absoluto):
        </p>
        <p className="text-2xl font-bold">E<sub>abs</sub> = |V<sub>exacto</sub> − V<sub>aprox</sub>|</p>
        <p className={C}>Tomar 2,3 por 2,34: E<sub>abs</sub> = |2,34 − 2,3| = 0,04</p>
      </>
    ),
  },
  {
    titulo: 'Error relativo',
    texto: (
      <>
        <p>
          Es el error absoluto dividido entre el valor exacto. Se suele dar en <b>porcentaje</b> (multiplicando por 100):
        </p>
        <p className="text-2xl font-bold">
          E<sub>rel</sub> = <span className="inline-flex flex-col items-center align-middle text-[0.8em]"><span>E<sub>abs</sub></span><span className="h-0.5 w-full bg-current" /><span>V<sub>exacto</sub></span></span> · 100 %
        </p>
        <p className={C}>
          0,04 : 2,34 = 0,017 → 1,7 %
        </p>
        <p className="text-base text-slate-600">💡 Sirve para saber si un error es grande o pequeño: equivocarse en 1 cm al medir un lápiz es mucho, y al medir una casa, nada.</p>
      </>
    ),
  },
]

const ORDENES = [1, 2, 3]

/** Escribe un número y elige el orden: se ve qué cifra decide, el truncamiento, el redondeo y sus errores. */
function Probar() {
  const [s, setS] = useState('23,456')
  const [txt, setTxt] = useState('23,456')
  const [c, setC] = useState(2)
  const [error, setError] = useState('')
  const [e, d = ''] = s.split(',')
  const t = truncar(s, c)
  const r = redondear(s, c)
  const exacto = decimalAFr(s)
  const et = errores(exacto, decimalAFr(t))
  const er = errores(exacto, decimalAFr(r.r))
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">Truncar y redondear</h2>
      <form
        className="flex flex-wrap items-center gap-2"
        onSubmit={(ev) => {
          ev.preventDefault()
          const limpio = txt.trim().replace('.', ',')
          if (!/^\d+,\d{2,}$/.test(limpio)) return setError('Escribe un número positivo con al menos dos decimales, por ejemplo 7,3456.')
          setError('')
          setS(limpio)
        }}
      >
        <input className="campo w-40" inputMode="decimal" aria-label="Número" value={txt} onChange={(ev) => setTxt(ev.target.value)} />
        <button className="btn">Usar</button>
      </form>
      {error && <p className="text-red-700">{error}</p>}
      <div className="flex flex-wrap gap-2">
        {ORDENES.filter((o) => o < d.length).map((o) => (
          <button key={o} className={`btn ${o === c ? 'btn-activo' : ''}`} onClick={() => setC(o)}>
            A las {nombreOrden(o)}
          </button>
        ))}
      </div>
      <div className="lienzo items-start gap-3">
        <p className="text-4xl font-bold tabular-nums">
          {e},<span className="text-indigo-700">{d.slice(0, c)}</span>
          <span className="rounded bg-amber-200 text-rose-600">{d[c]}</span>
          <span className="text-slate-400">{d.slice(c + 1)}</span>
        </p>
        <p className="text-lg">
          La primera cifra que se quita es un <b className="text-rose-600">{d[c]}</b>.
        </p>
        <div className="grid w-full gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="font-bold">Truncamiento</p>
            <p className="text-2xl font-bold">{t}</p>
            <p className="text-sm text-slate-600">Por defecto. E<sub>abs</sub> = {coma(valorDe(et.eabs), 6)}; E<sub>rel</sub> ≈ {coma(valorDe(et.erel) * 100, 3)} %</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="font-bold">Redondeo</p>
            <p className="text-2xl font-bold">{r.r}</p>
            <p className="text-sm text-slate-600">
              {r.decide >= 5 ? 'Es 5 o más: sube la última cifra. ' : 'Es menor que 5: queda igual que truncando. '}
              {r.exceso ? 'Por exceso.' : 'Por defecto.'} E<sub>abs</sub> = {coma(valorDe(er.eabs), 6)}; E<sub>rel</sub> ≈ {coma(valorDe(er.erel) * 100, 3)} %
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Errores paso a paso: «valor exacto; valor aproximado». El exacto puede ser una fracción o un decimal. */
export function pasosErrores(entrada: string): PasoG[] {
  const [a, b] = entrada.split(/;|\s+por\s+|\s+y\s+/).map((x) => x.trim())
  if (!a || !b) throw new Error('Escribe el valor exacto y el aproximado separados por «;»: 2,34; 2,3')
  const exacto: Fr = a.includes('/') ? (() => { const x = leer(a); if (!x) throw new Error('No entiendo el valor exacto.'); return fr(x.n, x.d) })() : decimalAFr(a)
  const aprox = decimalAFr(b)
  const { eabs, erel } = errores(exacto, aprox)
  const vex = valorDe(exacto)
  const nombre = a.includes('/') ? <F n={exacto.n} d={exacto.d} /> : a
  return [
    { linea: <span className={C}>Valor exacto: {nombre}{a.includes('/') && <> = {coma(vex, 5)}{exacto.d % 3 === 0 ? '…' : ''}</>} · Aproximado: {b}</span>, explica: <p>Vamos a ver cuánto nos equivocamos al tomar {b} en lugar del valor exacto.</p> },
    {
      linea: (
        <span className={C}>
          E<sub>abs</sub> = |{coma(vex, 5)} − {b}| = {coma(valorDe(eabs), 6)}
        </span>
      ),
      explica: <p>El error absoluto es la diferencia entre el exacto y el aproximado, sin signo.</p>,
    },
    {
      linea: (
        <span className={C}>
          E<sub>rel</sub> = {coma(valorDe(eabs), 6)} : {coma(vex, 5)} ≈ {coma(valorDe(erel), 5)}
        </span>
      ),
      explica: <p>El error relativo es el absoluto dividido entre el valor exacto.</p>,
    },
    { linea: <span className={C}>E<sub>rel</sub> ≈ {coma(valorDe(erel) * 100, 2)} %</span>, explica: <p>Multiplicado por 100 se lee en porcentaje: nos hemos equivocado en un {coma(valorDe(erel) * 100, 2)} % del valor.</p> },
  ]
}

const EJEMPLOS = ['2,34; 2,3', '18/8; 2,2', '19/16; 1,18', '2,25; 2,3'].map((s) => ({ nombre: s, pasos: pasosErrores(s) }))

export default function Aproximar({ modo, progreso, apuntar }: PropsParada) {
  return (
    <Parada
      id="aproximar"
      titulo="Aproximaciones y errores"
      modo={modo}
      paneles={{
        entender: <Tarjetas tarjetas={TARJETAS} parada="aproximar" />,
        probar: <Probar />,
        desmenuzar: <PasosGuiados titulo="Error absoluto y relativo, paso a paso" ejemplos={EJEMPLOS} crear={pasosErrores} placeholder="O escribe el tuyo: 5/9; 0,56" ayuda="Valor exacto (decimal o fracción) y aproximado, separados por punto y coma." />,
        practicar: <Practica clase={APROXIMAR} generar={nuevaAproximar} progreso={progreso} apuntar={apuntar} />,
      }}
    />
  )
}

