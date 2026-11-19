// La cuenta en columna, como en la libreta, y la resta guiada cifra a cifra. Las llevadas se ven igual que las
// escriben en clase: un 1 pequeño delante de la cifra de arriba (le sumamos 10) y otro junto a la cifra de abajo de
// la columna siguiente (la que me llevo).
import { useMemo, useState, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { Burbulla, barallar } from '../../pezas'
import { LETRA_COLUMNA, NOMBRE_COLUMNA, cifras, conPunto, pasosResta, pasosSuma } from '../../../lib/restas'

export function Cuenta({
  a,
  b,
  op = '−',
  hasta,
  marcas,
  actual,
  resultado,
  etiquetas,
  pequena,
}: {
  a: number
  b: number
  op?: '+' | '−'
  /** Cuántas cifras del resultado se ven, empezando por las unidades. Por defecto, todas; 0, ninguna. */
  hasta?: number
  /** Hasta qué columna se ven las llevadas (por defecto, las mismas que el resultado). */
  marcas?: number
  /** La columna que se está haciendo, resaltada. */
  actual?: number
  /** Un resultado escrito (puede estar mal, como en «Comprueba si…»). Sin esto, el resultado bueno. */
  resultado?: number
  /** Las letras U, D, C… encima. */
  etiquetas?: boolean
  pequena?: boolean
}) {
  const bien = op === '−' ? a - b : a + b
  const r = resultado ?? bien
  const n = Math.max(String(a).length, String(b).length, String(r).length)
  const ver = hasta ?? n
  const verMarcas = marcas ?? ver
  const ca = cifras(a)
  const cb = cifras(b)
  const cr = cifras(r)
  // Llevadas: en la resta, el 1 de arriba (columna i) y el de abajo (columna i + 1); en la suma, el 1 arriba de la siguiente.
  const unoArriba = new Set<number>()
  const unoAbajo = new Set<number>()
  const unoSuma = new Set<number>()
  if (op === '−' && a >= b && resultado === undefined)
    for (const p of pasosResta(a, b))
      if (p.pide && p.columna < verMarcas) {
        unoArriba.add(p.columna)
        unoAbajo.add(p.columna + 1)
      }
  if (op === '+' && resultado === undefined) for (const p of pasosSuma(a, b)) if (p.meLlevo && p.columna < verMarcas) unoSuma.add(p.columna + 1)

  // Columnas de izquierda a derecha: la primera es la más alta.
  const cols = Array.from({ length: n }, (_, k) => n - 1 - k)
  const tam = pequena ? 'text-3xl' : 'text-4xl sm:text-5xl'
  const celda = (i: number, alto = 'h-[1.35em]') => `relative flex ${alto} w-[1.15em] items-center justify-center rounded-md ${i === actual ? 'bg-amber-200' : ''}`
  const uno = 'absolute font-sans text-[0.4em] leading-none font-black text-rose-600'
  return (
    <div className={`mx-auto w-max font-mono font-bold text-slate-800 tabular-nums ${tam}`} role="img" aria-label={`${conPunto(a)} ${op} ${conPunto(b)}${ver ? ` = ${conPunto(r)}` : ''}`}>
      {etiquetas && (
        <div className="flex">
          <span className="w-[0.8em]" />
          {cols.map((i) => (
            <span key={i} className={celda(i, 'h-[0.7em]')}>
              <span className="font-sans text-[0.35em] text-sky-700">{LETRA_COLUMNA[i]}</span>
            </span>
          ))}
        </div>
      )}
      <div className="flex">
        <span className="w-[0.8em]" />
        {cols.map((i) => (
          <span key={i} className={celda(i)}>
            {unoSuma.has(i) && <span className={`${uno} -top-[0.15em] left-1/2 -translate-x-1/2`}>1</span>}
            {unoArriba.has(i) && <span className={`${uno} top-[0.1em] left-0`}>1</span>}
            {ca[i] ?? ''}
          </span>
        ))}
      </div>
      <div className="flex">
        <span className="flex w-[0.8em] items-center justify-center">{op}</span>
        {cols.map((i) => (
          <span key={i} className={celda(i)}>
            {unoAbajo.has(i) && <span className={`${uno} top-[0.1em] left-0`}>1</span>}
            {cb[i] ?? ''}
          </span>
        ))}
      </div>
      <div className="flex border-t-4 border-slate-700">
        <span className="w-[0.8em]" />
        {cols.map((i) => (
          <span key={i} className={`${celda(i)} text-violet-700`}>
            {i < ver && i < cr.length ? cr[i] : i === actual ? '?' : ''}
          </span>
        ))}
      </div>
    </div>
  )
}

/** Una resta y, con una flecha, su prueba (como en la hoja «Comprueba si…»). */
export function RestaYPrueba({ a, b, r, prueba = true }: { a: number; b: number; r: number; prueba?: boolean }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
      <Cuenta a={a} b={b} resultado={r} pequena />
      <span className="text-4xl text-slate-400" aria-hidden="true">
        ➜
      </span>
      {prueba ? <Cuenta a={r} b={b} op="+" pequena /> : <Cuenta a={r} b={b} op="+" hasta={0} pequena />}
    </div>
  )
}

/** Ver una resta hecha paso a paso: cada botón destapa una columna y explica lo que se hace. */
export function MiraComo({ a, b }: { a: number; b: number }) {
  const pasos = useMemo(() => pasosResta(a, b), [a, b])
  const [k, setK] = useState(0)
  const p = pasos[k - 1]
  return (
    <div className="space-y-3">
      <Cuenta a={a} b={b} hasta={k} actual={k > 0 && k <= pasos.length ? k - 1 : undefined} etiquetas />
      <div className="min-h-20 rounded-2xl bg-violet-50 p-3 text-lg text-slate-800">{p ? <Explica p={p} ultima={k === pasos.length} /> : 'Empezamos siempre por la derecha: las unidades.'}</div>
      {k < pasos.length ? (
        <button className="btn btn-primario min-h-12 w-full border-violet-600 bg-violet-600 text-lg hover:bg-violet-700" onClick={() => setK(k + 1)}>
          Siguiente columna: {NOMBRE_COLUMNA[k]} →
        </button>
      ) : (
        <button className="btn min-h-12 w-full text-lg" onClick={() => setK(0)}>
          ✓ {a} − {b} = {a - b}. Verlo otra vez ↻
        </button>
      )}
    </div>
  )
}

/** Lo que se dice en una columna. */
function Explica({ p, ultima }: { p: ReturnType<typeof pasosResta>[number]; ultima?: boolean }) {
  const col = <b className="capitalize">{NOMBRE_COLUMNA[p.columna]}</b>
  const quito = p.llevada ? (
    <>
      {p.abajo} + 1 que me llevaba = <b>{p.quito}</b>
    </>
  ) : (
    <b>{p.quito}</b>
  )
  if (ultima && p.quito === 0)
    return (
      <>
        {col}: abajo no queda nada que quitar. Bajo el <b>{p.arriba}</b>.
      </>
    )
  return p.pide ? (
    <>
      {col}: tengo que quitar {quito}, pero arriba solo hay <b>{p.arriba}</b>. Pongo un <b className="text-rose-600">1</b> delante: <b>{p.arribaFinal}</b> − {p.quito} = <b className="text-violet-700">{p.cifra}</b>. Y <b className="text-rose-600">me llevo una</b> para la columna siguiente.
    </>
  ) : (
    <>
      {col}: {p.arriba} − {quito} = <b className="text-violet-700">{p.cifra}</b>. Hay bastante, no me llevo nada.
    </>
  )
}

/**
 * Resta conmigo: en cada columna, primero se decide si arriba hay bastante o hay que poner un 1 delante; después se
 * toca la cifra del resultado en un teclado. Al terminar, se ve la resta entera con sus llevadas.
 */
export function RestaGuiada({ restas, acabar }: { restas: [number, number][]; acabar: () => void }) {
  const lista = useMemo(() => barallar(restas), [restas])
  const [i, setI] = useState(0)
  const [col, setCol] = useState(0)
  const [fase, setFase] = useState<'pide' | 'cifra'>('pide')
  const [aviso, setAviso] = useState<{ texto: ReactNode; ton: 'ben' | 'mal' } | null>(null)
  const actual = lista[i]
  const pasos = useMemo(() => (actual ? pasosResta(actual[0], actual[1]) : []), [actual])
  if (!actual) return <Burbulla ton="ben">¡Genial! Has hecho todas las restas columna a columna.</Burbulla>
  const [a, b] = actual
  const p = pasos[col]
  const fin = !p

  function pide(si: boolean) {
    if (si === p.pide) {
      setFase('cifra')
      setAviso(
        p.pide
          ? { texto: <>¡Eso es! {p.arriba} es menos que {p.quito}. Pongo un 1 delante: {p.arribaFinal}. Y me llevo una para la columna siguiente.</>, ton: 'ben' }
          : { texto: <>¡Bien! {p.arriba} es mayor o igual que {p.quito}: hay bastante.</>, ton: 'ben' },
      )
    } else
      setAviso({
        texto: p.pide ? <>Mira bien: arriba hay {p.arriba} y tengo que quitar {p.quito}. ¿Se puede quitar {p.quito} de {p.arriba}?</> : <>Arriba hay {p.arriba} y solo tengo que quitar {p.quito}: ¡sí hay bastante!</>,
        ton: 'mal',
      })
  }
  function cifra(c: number) {
    if (c === p.cifra) {
      setCol(col + 1)
      setFase('pide')
      setAviso({ texto: <>¡Muy bien! {p.arribaFinal} − {p.quito} = {p.cifra}.</>, ton: 'ben' })
    } else setAviso({ texto: <>{c} no. Cuenta desde {p.quito} hasta {p.arribaFinal}: ¿cuántos saltos das?</>, ton: 'mal' })
  }
  // En la última columna, si abajo no queda nada que quitar, solo se baja la cifra.
  const soloBajar = p && p.columna === pasos.length - 1 && p.quito === 0

  return (
    <div className="space-y-4">
      <p className="text-center text-sm font-semibold text-slate-500">
        Resta {i + 1} de {lista.length}
      </p>
      <div className="rounded-2xl border-2 border-violet-100 bg-white p-3">
        <Cuenta a={a} b={b} hasta={col} marcas={fase === 'cifra' ? col + 1 : col} actual={fin ? undefined : col} etiquetas />
      </div>
      {fin ? (
        <>
          <Burbulla ton="ben">
            ¡Resuelta! {a} − {b} = <b>{a - b}</b>. {String(a - b).length < String(a).length && 'Los ceros de la izquierda no se escriben. '}
          </Burbulla>
          <button
            className="btn btn-primario min-h-14 w-full border-violet-600 bg-violet-600 text-xl hover:bg-violet-700"
            onClick={() => {
              setI(i + 1)
              setCol(0)
              setFase('pide')
              setAviso(null)
              if (i + 1 === lista.length) acabar()
            }}
          >
            {i + 1 === lista.length ? 'Terminar' : 'Siguiente resta →'}
          </button>
        </>
      ) : (
        <>
          {aviso && <Burbulla ton={aviso.ton}>{aviso.texto}</Burbulla>}
          <motion.div key={`${i}-${col}-${fase}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border-2 border-violet-300 bg-white p-4">
            {fase === 'pide' && !soloBajar ? (
              <>
                <p className="text-xl font-bold text-slate-800">
                  <span className="capitalize">{NOMBRE_COLUMNA[col]}</span>: arriba hay <b className="text-violet-700">{p.arriba}</b> y tengo que quitar{' '}
                  <b className="text-violet-700">{p.quito}</b>
                  {p.llevada ? ` (${p.abajo} + 1 que me llevaba)` : ''}. ¿Hay bastante?
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <button className="min-h-14 cursor-pointer rounded-2xl border-2 border-violet-200 bg-white px-4 text-lg font-semibold hover:bg-violet-50" onClick={() => pide(false)}>
                    Sí, hay bastante
                  </button>
                  <button className="min-h-14 cursor-pointer rounded-2xl border-2 border-violet-200 bg-white px-4 text-lg font-semibold hover:bg-violet-50" onClick={() => pide(true)}>
                    No: pongo un 1 delante y me llevo una
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-xl font-bold text-slate-800">
                  {soloBajar ? (
                    <>
                      <span className="capitalize">{NOMBRE_COLUMNA[col]}</span>: abajo no hay nada que quitar. ¿Qué cifra bajo?
                    </>
                  ) : (
                    <>
                      ¿Cuánto es {p.arribaFinal} − {p.quito}?
                    </>
                  )}
                </p>
                <Teclado onToca={cifra} />
              </>
            )}
          </motion.div>
        </>
      )}
    </div>
  )
}

/** Diez botones grandes para contestar una cifra tocando. */
export function Teclado({ onToca }: { onToca: (c: number) => void }) {
  return (
    <div className="mt-3 grid grid-cols-5 gap-2">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((c) => (
        <button key={c} aria-label={`Cifra ${c}`} onClick={() => onToca(c)} className="min-h-14 cursor-pointer rounded-2xl border-2 border-violet-200 bg-white font-mono text-3xl font-black text-violet-800 hover:bg-violet-50 active:scale-95">
          {c}
        </button>
      ))}
    </div>
  )
}
