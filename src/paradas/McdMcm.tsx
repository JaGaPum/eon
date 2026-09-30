// Máximo común divisor y mínimo común múltiplo: misma parada con dos reglas distintas.
import { useMemo, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { agrupar, comunes, descomponer, divisores, factores, MAXIMO, productoDe, type ColumnaPrimo } from '../lib/mates'
import Parada, { PasoAPaso, Tarjetas, type PropsParada, type Tarjeta } from '../componentes/Parada'
import Practica from '../componentes/Practica'
import { Aviso, colorPrimo, Columna, Potencias, type Mensaje } from '../componentes/visuales'
import { MCD, MCM, nuevaMcd, nuevaMcm } from '../contenido/preguntas'

type Modo = 'mcd' | 'mcm'
const NOMBRE = { mcd: 'm.c.d.', mcm: 'm.c.m.' }
const REGLA = {
  mcd: 'Solo los factores comunes, elevados al menor exponente.',
  mcm: 'Los factores comunes y los no comunes, elevados al mayor exponente.',
}

/** Lee «12, 18» o «12 18 30»: dos o tres números entre 2 y el máximo. */
function leerNumeros(s: string): number[] | null {
  const nums = s.split(/[\s,;y]+/).filter(Boolean).map(Number)
  const vale = nums.length >= 2 && nums.length <= 3 && nums.every((n) => Number.isInteger(n) && n >= 2 && n <= MAXIMO)
  return vale ? nums : null
}

/** Tabla con un primo por columna y un número por fila: se ve de un vistazo qué es común y qué exponente tiene cada uno. */
function Tabla({ nums, cols, elegidos, marca }: { nums: number[]; cols: ColumnaPrimo[]; elegidos?: (number | undefined)[]; marca?: number }) {
  return (
    <table className="border-collapse text-center text-lg">
      <thead>
        <tr>
          <th />
          {cols.map((c, j) => (
            <th key={c.primo} className={`px-3 py-1 ${j === marca ? 'bg-amber-100' : ''}`} style={{ color: colorPrimo(c.primo) }}>
              {c.primo}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {nums.map((n, i) => (
          <tr key={i} className="border-t border-slate-200">
            <th className="pr-3 text-right font-bold">{n}</th>
            {cols.map((c, j) => (
              <td key={c.primo} className={`px-3 py-1.5 ${j === marca ? 'bg-amber-100' : ''}`}>
                {c.exps[i] ? (
                  <span className="font-semibold" style={{ color: colorPrimo(c.primo) }}>
                    {c.primo}
                    {c.exps[i] > 1 && <sup>{c.exps[i]}</sup>}
                  </span>
                ) : (
                  <span className="text-slate-300">—</span>
                )}
              </td>
            ))}
          </tr>
        ))}
        {elegidos && (
          <tr className="border-t-4 border-slate-700">
            <th className="pr-3 text-right font-bold">Se coge</th>
            {cols.map((c, j) => (
              <td key={c.primo} className={`px-3 py-1.5 font-bold ${j === marca ? 'bg-amber-100' : ''}`} style={{ color: colorPrimo(c.primo) }}>
                {elegidos[j] === undefined ? (
                  <span className="text-slate-300">?</span>
                ) : elegidos[j] === 0 ? (
                  <span className="text-slate-400">no</span>
                ) : (
                  <motion.span initial={{ scale: 0.3 }} animate={{ scale: 1 }} className="inline-block">
                    {c.primo}
                    {elegidos[j]! > 1 && <sup>{elegidos[j]}</sup>}
                  </motion.span>
                )}
              </td>
            ))}
          </tr>
        )}
      </tbody>
    </table>
  )
}

function Producto({ modo, nums, cols }: { modo: Modo; nums: number[]; cols: ColumnaPrimo[] }) {
  const elegidas = cols.filter((c) => c.elegido > 0).map((c): [number, number] => [c.primo, c.elegido])
  return (
    <motion.p initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center text-2xl font-bold">
      {NOMBRE[modo]} ({nums.join(', ')}) = {elegidas.length ? <Potencias potencias={elegidas} /> : '1'}
      {(elegidas.length > 1 || (elegidas[0]?.[1] ?? 0) > 1) && <> = {productoDe(cols)}</>}
    </motion.p>
  )
}

// Para cada primo decide él con qué exponente entra. Si falla, se le dice por qué.
function Probar({ modo }: { modo: Modo }) {
  const [nums, setNums] = useState(modo === 'mcd' ? [12, 18] : [30, 45])
  const [escrito, setEscrito] = useState(nums.join(', '))
  const [elegidos, setElegidos] = useState<(number | undefined)[]>([])
  const [msg, setMsg] = useState<Mensaje | null>(null)
  const [intentos, setIntentos] = useState(0)
  const cols = useMemo(() => comunes(nums, modo), [nums, modo])
  const j = cols.findIndex((_, i) => elegidos[i] === undefined)
  const actual = cols[j]

  const avisar = (tipo: Mensaje['tipo'], texto: string) => {
    setMsg({ tipo, texto })
    setIntentos((i) => i + 1)
  }

  function cambiar(ev: FormEvent) {
    ev.preventDefault()
    const nuevos = leerNumeros(escrito)
    if (!nuevos) return avisar('mal', `Escribe dos o tres números entre 2 y ${MAXIMO}, separados por comas.`)
    setNums(nuevos)
    setElegidos([])
    setMsg(null)
  }

  function elegir(e: number) {
    if (e !== actual.elegido) return avisar('mal', `No. ${actual.razon}`)
    const nuevos = [...elegidos]
    nuevos[j] = e
    setElegidos(nuevos)
    avisar('bien', actual.razon)
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">Decide tú qué factores se cogen</h2>
      <form onSubmit={cambiar} className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 font-semibold">
          Números
          <input className="campo w-44" value={escrito} onChange={(e) => setEscrito(e.target.value)} />
        </label>
        <button className="btn">Cambiar</button>
      </form>

      <p className="text-lg">
        Regla del {NOMBRE[modo]}: <b>{REGLA[modo]}</b>
      </p>

      <div className="lienzo">
        <Tabla nums={nums} cols={cols} elegidos={elegidos} marca={j} />
      </div>

      {actual ? (
        <>
          <p className="text-lg">
            ¿Con qué exponente entra el <b style={{ color: colorPrimo(actual.primo) }}>{actual.primo}</b> en el {NOMBRE[modo]}?
          </p>
          <div className="flex flex-wrap gap-2">
            <button className="btn" onClick={() => elegir(0)}>
              No se coge
            </button>
            {Array.from({ length: Math.max(...actual.exps) }, (_, i) => i + 1).map((e) => (
              <button key={e} className="btn text-lg" onClick={() => elegir(e)}>
                {actual.primo}
                {e > 1 && <sup>{e}</sup>}
              </button>
            ))}
          </div>
        </>
      ) : (
        <Producto modo={modo} nums={nums} cols={cols} />
      )}

      <Aviso msg={msg} clave={intentos} />

      <button
        className="btn"
        disabled={!elegidos.length}
        onClick={() => {
          setElegidos(elegidos.slice(0, -1))
          setMsg(null)
        }}
      >
        ← Deshacer
      </button>
    </section>
  )
}

const EJEMPLOS: Record<Modo, number[][]> = {
  mcd: [[12, 18], [81, 99], [120, 320], [40, 64, 90], [280, 840], [256, 96]],
  mcm: [[30, 45], [21, 28], [4, 9, 12], [15, 16], [28, 48, 60], [18, 15, 8]],
}

function Desmenuzar({ modo }: { modo: Modo }) {
  const [nums, setNums] = useState(EJEMPLOS[modo][0])
  const [k, setK] = useState(0)
  const [otro, setOtro] = useState('')
  const cols = useMemo(() => comunes(nums, modo), [nums, modo])
  // Pasos: 0 presentación · uno por número (su columna) · uno por primo (decisión) · resultado.
  const total = nums.length + cols.length + 1
  const iNum = k - 1
  const iCol = k - 1 - nums.length
  const decididos = cols.map((c, i) => (i <= iCol ? c.elegido : undefined))

  function elegir(nuevos: number[]) {
    setNums(nuevos)
    setK(0)
  }

  function verOtro(ev: FormEvent) {
    ev.preventDefault()
    const nuevos = leerNumeros(otro)
    if (nuevos) {
      elegir(nuevos)
      setOtro('')
    }
  }

  let explicacion
  if (k === 0) {
    explicacion = (
      <>
        <h3 className="font-bold">Qué vamos a hacer</h3>
        <p>
          Calcular el {NOMBRE[modo]} de {nums.join(', ')} en dos fases: primero se descompone cada número en factores primos y después se eligen los factores.
        </p>
      </>
    )
  } else if (iNum < nums.length) {
    const n = nums[iNum]
    explicacion = (
      <>
        <h3 className="font-bold">Descomponer {n}</h3>
        <p>Se divide entre primos, empezando por los más pequeños, hasta llegar a 1.</p>
        <p className="text-2xl font-bold">
          {n} = <Potencias potencias={agrupar(factores(n))} />
        </p>
      </>
    )
  } else if (iCol < cols.length) {
    const c = cols[iCol]
    explicacion = (
      <>
        <h3 className="font-bold">
          ¿Qué pasa con el <span style={{ color: colorPrimo(c.primo) }}>{c.primo}</span>?
        </h3>
        <p>{c.razon}</p>
        <p>
          Exponentes del {c.primo} en cada número: {c.exps.join(', ')}.
        </p>
      </>
    )
  } else {
    explicacion = (
      <>
        <h3 className="font-bold">Multiplicar lo elegido</h3>
        <Producto modo={modo} nums={nums} cols={cols} />
        <p>{REGLA[modo]}</p>
      </>
    )
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">Un ejemplo resuelto, paso a paso</h2>
      <div className="flex flex-wrap items-center gap-2">
        {EJEMPLOS[modo].map((e) => (
          <button key={e.join()} className={`btn ${e.join() === nums.join() ? 'btn-activo' : ''}`} onClick={() => elegir(e)}>
            {e.join(', ')}
          </button>
        ))}
        <form onSubmit={verOtro} className="flex items-center gap-2">
          <input className="campo w-36" placeholder="otros: 24, 60" aria-label="Otros números" value={otro} onChange={(e) => setOtro(e.target.value)} />
          <button className="btn">Ver</button>
        </form>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="lienzo">
          {k >= 1 && iNum < nums.length ? (
            <Columna key={nums[iNum]} filas={descomponer(nums[iNum])} resto={1} />
          ) : k === 0 ? (
            <p className="text-3xl font-bold">{nums.join('   ·   ')}</p>
          ) : (
            <Tabla nums={nums} cols={cols} elegidos={decididos} marca={iCol < cols.length ? iCol : undefined} />
          )}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={`${nums.join()}-${k}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="space-y-3 text-lg leading-relaxed">
            {explicacion}
          </motion.div>
        </AnimatePresence>
      </div>

      <PasoAPaso k={k} total={total} setK={setK} />
    </section>
  )
}

function Listas({ modo }: { modo: Modo }) {
  const [a, b] = modo === 'mcd' ? [12, 18] : [4, 6]
  const lista = (n: number) => (modo === 'mcd' ? divisores(n) : Array.from({ length: 8 }, (_, i) => n * (i + 1)))
  const comunesAB = lista(a).filter((x) => lista(b).includes(x))
  const buscado = modo === 'mcd' ? Math.max(...comunesAB) : Math.min(...comunesAB)
  return (
    <>
      {[a, b].map((n) => (
        <div key={n} className="flex flex-wrap items-center gap-1.5">
          <span className="w-32 text-sm font-semibold text-slate-500">
            {modo === 'mcd' ? 'Divisores' : 'Múltiplos'} de {n}
          </span>
          {lista(n).map((x) => (
            <span
              key={x}
              className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-1.5 text-sm font-bold ${
                x === buscado ? 'bg-amber-400 text-slate-900' : comunesAB.includes(x) ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {x}
            </span>
          ))}
          {modo === 'mcm' && <span className="text-slate-400">…</span>}
        </div>
      ))}
      <p className="nota">
        En azul, los comunes. En amarillo, el {modo === 'mcd' ? 'mayor' : 'menor'}: {NOMBRE[modo]} ({a}, {b}) = {buscado}.
      </p>
    </>
  )
}

function tarjetas(modo: Modo): Tarjeta[] {
  const nums = modo === 'mcd' ? [12, 18] : [30, 45]
  const cols = comunes(nums, modo)
  return [
    {
      titulo: modo === 'mcd' ? 'El mayor de los divisores comunes' : 'El menor de los múltiplos comunes',
      texto:
        modo === 'mcd' ? (
          <>
            <p>
              El <b>máximo común divisor</b> (m.c.d.) de varios números es el mayor número que los divide a todos.
            </p>
            <p>Con números pequeños se puede ver haciendo las listas de divisores y buscando el mayor que se repite.</p>
          </>
        ) : (
          <>
            <p>
              El <b>mínimo común múltiplo</b> (m.c.m.) de varios números es el menor número, distinto de cero, que es múltiplo de todos.
            </p>
            <p>Con números pequeños se puede ver haciendo las listas de múltiplos y buscando el primero que se repite.</p>
          </>
        ),
      visual: <Listas modo={modo} />,
    },
    {
      titulo: 'El método: descomponer y elegir',
      texto: (
        <>
          <p>Con números grandes las listas no acaban nunca. El método que funciona siempre tiene dos pasos:</p>
          <ol className="list-decimal space-y-1 pl-5">
            <li>Se descompone cada número en factores primos.</li>
            <li>
              Se multiplican <b>{modo === 'mcd' ? 'los factores comunes, elevados al menor exponente' : 'los factores comunes y no comunes, elevados al mayor exponente'}</b>.
            </li>
          </ol>
        </>
      ),
      visual: (
        <>
          <Tabla nums={nums} cols={cols} elegidos={cols.map((c) => c.elegido)} />
          <Producto modo={modo} nums={nums} cols={cols} />
        </>
      ),
    },
    {
      titulo: 'Ten en cuenta',
      texto:
        modo === 'mcd' ? (
          <>
            <p>
              Si un número es múltiplo del otro, el m.c.d. es <b>el pequeño</b>: m.c.d. (280, 840) = 280.
            </p>
            <p>
              Si no tienen ningún factor primo común, el m.c.d. es <b>1</b>. Se dice que son primos entre sí: m.c.d. (35, 48) = 1.
            </p>
          </>
        ) : (
          <>
            <p>
              Si un número es múltiplo del otro, el m.c.m. es <b>el grande</b>: m.c.m. (320, 640) = 640.
            </p>
            <p>
              Si son primos entre sí, el m.c.m. es <b>su producto</b>: m.c.m. (15, 16) = 240.
            </p>
            <p>Para dos números cualesquiera: m.c.d. (A, B) · m.c.m. (A, B) = A · B.</p>
          </>
        ),
      visual:
        modo === 'mcd' ? (
          <Tabla nums={[35, 48]} cols={comunes([35, 48], 'mcd')} elegidos={comunes([35, 48], 'mcd').map((c) => c.elegido)} />
        ) : (
          <Tabla nums={[15, 16]} cols={comunes([15, 16], 'mcm')} elegidos={comunes([15, 16], 'mcm').map((c) => c.elegido)} />
        ),
    },
    {
      titulo: '¿Cuándo se usa en un problema?',
      texto:
        modo === 'mcd' ? (
          <>
            <p>
              Cuando hay que <b>repartir o cortar en partes iguales lo más grandes posible</b>, sin que sobre nada: bandejas, collares, parcelas, listones.
            </p>
            <p>El número buscado tiene que dividir a todos los datos, y se quiere el mayor: es el m.c.d.</p>
          </>
        ) : (
          <>
            <p>
              Cuando algo se repite cada cierto tiempo y se pregunta <b>cuándo vuelve a coincidir</b>, o cuál es la menor cantidad que sirve para todos: visitas, relojes, columnas de cubos.
            </p>
            <p>El número buscado tiene que ser múltiplo de todos los datos, y se quiere el menor: es el m.c.m.</p>
          </>
        ),
      visual:
        modo === 'mcd' ? (
          <p className="text-center text-lg">
            Una plancha de 256 × 96 cm se corta en cuadrados lo más grandes posible.
            <br />
            <b>m.c.d. (256, 96) = 32 cm</b> de lado.
          </p>
        ) : (
          <p className="text-center text-lg">
            Tres viajantes van a Sevilla cada 18, 15 y 8 días.
            <br />
            <b>m.c.m. (18, 15, 8) = 360 días</b> hasta que vuelven a coincidir.
          </p>
        ),
    },
  ]
}

function ParadaComun({ modoParada, modo, progreso, apuntar }: PropsParada & { modoParada: Modo }) {
  const mcd = modoParada === 'mcd'
  const lista = useMemo(() => tarjetas(modoParada), [modoParada])
  return (
    <Parada
      id={modoParada}
      titulo={mcd ? 'Máximo común divisor' : 'Mínimo común múltiplo'}
      modo={modo}
      paneles={{
        entender: <Tarjetas tarjetas={lista} parada={modoParada} />,
        probar: <Probar modo={modoParada} />,
        desmenuzar: <Desmenuzar modo={modoParada} />,
        practicar: <Practica clase={mcd ? MCD : MCM} generar={mcd ? nuevaMcd : nuevaMcm} progreso={progreso} apuntar={apuntar} />,
      }}
    />
  )
}

export const Mcd = (p: PropsParada) => <ParadaComun {...p} modoParada="mcd" />
export const Mcm = (p: PropsParada) => <ParadaComun {...p} modoParada="mcm" />
