// Una pregunta y el campo con el que se responde. Lo comparten el modo Practicar y las pruebas.
import { useState, type FormEvent, type ReactNode } from 'react'
import { agrupar, esPrimo, valor, type Potencia } from '../lib/mates'
import { CampoEntero, ent, leerEntero } from './piezas'
import { colorPrimo } from './visuales'
import { TextoMat } from './mat'
import { leer as leerFr, leerDecimal, mcdDe } from '../lib/fracciones'

export type Entrada =
  | 'numero'
  /** Elegir una. */
  | { opciones: string[] }
  /** Marcar todas las que valgan. */
  | { multi: string[] }
  /** Tocar las fichas en el orden pedido. */
  | { orden: string[]; sep?: '<' | '>' }
  /** Dar la descomposición en factores primos, con exponentes. */
  | { primos: true }
  /** Un número que se puede dar tal cual o en potencias, como el m.c.d. y el m.c.m. */
  | { numeroOPotencias: true }
  /** Una fracción (o un entero). Con `irreducible`, tiene que estar simplificada del todo. */
  | { fraccion: true; irreducible?: boolean }
  /** Varias fracciones reducidas a común denominador (el m.c.m.), en el orden en que se dan. */
  | { fracciones: number }
  /** Un número mixto: parte entera y fracción propia. */
  | { mixto: true }
  /** Un número decimal. `tol`: cuánto se puede separar del correcto; `unidad`: lo que va detrás (%, m, €). */
  | { decimal: true; tol?: number; unidad?: string }

export interface Pregunta {
  /** Único en toda la app: «parada:hoja-número». Vacío en los ejercicios generados. */
  id: string
  /** Lo que se ve en la ficha: «5a». */
  etq: string
  /** Hoja de la que sale, para agrupar las fichas. */
  grupo?: string
  enunciado: ReactNode
  entrada: Entrada
  /** Número, opción, o varias unidas con «|» (en el orden de las opciones, o de menor a mayor los primos). */
  correcta: string
  pistas: ReactNode[]
  /** Explicación que se muestra al acertar. */
  acierto?: ReactNode
  /** Diagnóstico de un fallo concreto; si no devuelve nada se usa el genérico. */
  fallo?: (resp: string) => ReactNode | undefined
}

// Una respuesta en potencias viaja como «p:2^2*3^1».
const EN_POTENCIAS = 'p:'
const codificar = (pot: Potencia[]) => EN_POTENCIAS + pot.map(([p, e]) => `${p}^${e}`).join('*')

/** Las potencias de una respuesta dada en potencias, o null si se dio con un número. */
export function potenciasDe(resp: string): Potencia[] | null {
  if (!resp.startsWith(EN_POTENCIAS)) return null
  return resp
    .slice(EN_POTENCIAS.length)
    .split('*')
    .filter(Boolean)
    .map((t): Potencia => {
      const [p, e] = t.split('^').map(Number)
      return [p, e]
    })
}

/** El número que representa una respuesta, la diera con un número o en potencias. */
export const valorRespuesta = (resp: string) => {
  const pot = potenciasDe(resp)
  return pot ? valor(pot) : Number(resp)
}

/** Dos fracciones valen lo mismo (productos cruzados iguales). */
const mismoValor = (a: { n: number; d: number }, b: { n: number; d: number }) => a.n * b.d === b.n * a.d

/** Cómo es una respuesta con fracciones: si vale lo mismo que la correcta y si está como se pide. */
export function revisarFracciones(q: Pregunta, resp: string): { valor: boolean; forma: boolean } {
  const e = q.entrada
  if (typeof e !== 'object') return { valor: false, forma: false }
  if ('fraccion' in e) {
    const a = leerFr(resp)
    const c = leerFr(q.correcta)!
    if (!a) return { valor: false, forma: false }
    return { valor: mismoValor(a, c), forma: !e.irreducible || mcdDe(a.n, a.d) === 1 }
  }
  if ('fracciones' in e) {
    const as = resp.split('|').map(leerFr)
    const cs = q.correcta.split('|').map((x) => leerFr(x)!)
    if (as.length !== cs.length || as.some((a) => !a)) return { valor: false, forma: false }
    return { valor: as.every((a, k) => mismoValor(a!, cs[k])), forma: as.every((a, k) => a!.d === cs[k].d) }
  }
  if ('mixto' in e) {
    const [ae, an, ad] = resp.split('|').map(Number)
    const [ce, cn, cd] = q.correcta.split(/[ /]/).map(Number)
    return { valor: ae === ce && ad > 0 && an * cd === cn * ad, forma: an < ad }
  }
  return { valor: false, forma: false }
}

export function esCorrecta(q: Pregunta, resp: string | undefined): boolean {
  if (resp === undefined) return false
  const e = q.entrada
  if (typeof e === 'object' && 'numeroOPotencias' in e) return valorRespuesta(resp) === Number(q.correcta)
  if (typeof e === 'object' && ('fraccion' in e || 'fracciones' in e || 'mixto' in e)) {
    const r = revisarFracciones(q, resp)
    return r.valor && r.forma
  }
  if (typeof e === 'object' && 'decimal' in e) {
    const x = leerDecimal(resp)
    return x !== null && Math.abs(x - Number(q.correcta)) <= (e.tol ?? 1e-9)
  }
  return resp === q.correcta
}

const VOLADOS = '⁰¹²³⁴⁵⁶⁷⁸⁹'
const elevado = (e: number) => (e > 1 ? String(e).split('').map((c) => VOLADOS[Number(c)]).join('') : '')
const escribirPotencias = (pot: Potencia[]) => pot.map(([p, e]) => p + elevado(e)).join(' · ')

/** Una respuesta (la suya o la correcta) escrita para leerla. */
export function escribirRespuesta(q: Pregunta, resp: string): string {
  const e = q.entrada
  const menos = (x: string) => x.replace(/-/g, '−')
  if (typeof e === 'object' && 'fraccion' in e) return menos(resp || '—')
  if (typeof e === 'object' && 'fracciones' in e) return menos(resp.split('|').join(',  '))
  if (typeof e === 'object' && 'mixto' in e) {
    if (resp.includes('|')) {
      const [a, n, d] = resp.split('|')
      return `${a} ${n}/${d}`
    }
    return resp
  }
  if (typeof e === 'object' && 'decimal' in e) return menos(resp.replace('.', ',')) + (e.unidad ? ` ${e.unidad}` : '')
  const pot = potenciasDe(resp)
  if (pot) return `${escribirPotencias(pot)} = ${valor(pot)}`
  if (e === 'numero' || 'numeroOPotencias' in e) return ent(Number(resp))
  if ('opciones' in e) return resp
  const partes = resp ? resp.split('|') : []
  if ('multi' in e) return partes.length ? partes.join(', ') : 'ninguna'
  if ('orden' in e) return partes.join(`  ${e.sep ?? '<'}  `)
  return escribirPotencias(agrupar(partes.map(Number)))
}

const BOTONES_PRIMOS = [2, 3, 5, 7, 11, 13]

/** Fichas de primo con su exponente: se toca un primo para añadirlo y se ajusta cuántas veces va con − y +. */
function ComponerPotencias({ pot, cambiar }: { pot: Potencia[]; cambiar: (pot: Potencia[]) => void }) {
  const [otro, setOtro] = useState('')
  const [error, setError] = useState('')

  function anadir(p: number) {
    if (!Number.isInteger(p) || !esPrimo(p)) return setError(`${Number.isInteger(p) && p > 1 ? p : 'Eso'} no es un número primo: aquí solo van primos.`)
    setError('')
    const ya = pot.find(([q]) => q === p)
    cambiar(ya ? pot.map(([q, e]): Potencia => [q, q === p ? e + 1 : e]) : [...pot, [p, 1] as Potencia].sort((a, b) => a[0] - b[0]))
  }

  const exponente = (p: number, d: number) => cambiar(pot.map(([q, e]): Potencia => [q, q === p ? e + d : e]).filter(([, e]) => e > 0))

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-slate-500">Añadir primo:</span>
        {BOTONES_PRIMOS.map((p) => (
          <button
            key={p}
            type="button"
            aria-label={`Añadir el primo ${p}`}
            className="btn w-12 px-0 text-lg text-white hover:brightness-110"
            style={{ background: colorPrimo(p), borderColor: colorPrimo(p) }}
            onClick={() => anadir(p)}
          >
            {p}
          </button>
        ))}
        <form
          className="flex items-center gap-2"
          onSubmit={(ev) => {
            ev.preventDefault()
            anadir(Number(otro))
            setOtro('')
          }}
        >
          <input className="campo" inputMode="numeric" placeholder="otro" aria-label="Otro primo" value={otro} onChange={(ev) => setOtro(ev.target.value)} />
          <button className="btn">Añadir</button>
        </form>
      </div>
      {error && <p className="text-red-700">{error}</p>}

      <div className="flex min-h-20 flex-wrap items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3">
        {pot.length === 0 && <span className="text-slate-400">Aquí aparecerán las potencias que vayas añadiendo.</span>}
        {pot.map(([p, e], i) => (
          <span key={p} className="flex items-center gap-1">
            {i > 0 && <span className="mr-2 text-2xl font-bold text-slate-400">·</span>}
            <span className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
              <button type="button" className="btn min-h-9 w-9 px-0" onClick={() => exponente(p, -1)} aria-label={`Bajar el exponente del ${p}`}>
                −
              </button>
              <span className="px-1 text-3xl font-bold" style={{ color: colorPrimo(p) }}>
                {p}
                <sup className="text-xl">{e}</sup>
              </span>
              <button type="button" className="btn min-h-9 w-9 px-0" onClick={() => exponente(p, 1)} aria-label={`Subir el exponente del ${p}`}>
                +
              </button>
            </span>
          </span>
        ))}
      </div>
      {pot.length > 0 && (
        <p className="text-lg">
          Has escrito: <b>{escribirPotencias(pot)}</b>
        </p>
      )}
    </div>
  )
}

/** El campo adecuado a cada tipo de pregunta, con la explicación de cómo se responde. */
export function CampoRespuesta({ q, responder, boton = 'Comprobar' }: { q: Pregunta; responder: (resp: string) => void; boton?: string }) {
  const [texto, setTexto] = useState('')
  const [sel, setSel] = useState<string[]>([])
  const [pot, setPot] = useState<Potencia[]>([])
  const [forma, setForma] = useState<'numero' | 'potencias'>('numero')
  const [error, setError] = useState('')
  const e = q.entrada
  const aviso = error && <p className="text-red-700">{error}</p>

  const campoNumero = (explicacion: string) => {
    const enviar = (ev: FormEvent) => {
      ev.preventDefault()
      const n = leerEntero(texto)
      if (n === null) setError('Escribe un número entero, sin letras ni espacios.')
      else responder(String(n))
    }
    return (
      <form onSubmit={enviar} className="space-y-2">
        <p className="text-sm text-slate-500">{explicacion}</p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold">Respuesta</span>
          <CampoEntero valor={texto} cambiar={setTexto} etiqueta="Respuesta" />
          <button className="btn btn-primario">{boton}</button>
        </div>
        {aviso}
      </form>
    )
  }

  if (e === 'numero') return campoNumero('Escribe solo el número. Si es negativo, pulsa ± para ponerle el signo menos.')

  if ('fraccion' in e || 'fracciones' in e || 'mixto' in e || 'decimal' in e) return <CampoFracciones q={q} responder={responder} boton={boton} />

  if ('numeroOPotencias' in e) {
    return (
      <div className="space-y-3">
        <p className="text-slate-600">
          Puedes responder de dos formas, como en el cuaderno: con el <b>número final</b> (por ejemplo, 12) o con su <b>descomposición en potencias</b> (por ejemplo, 2² · 3). Elige cómo:
        </p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={`btn ${forma === 'numero' ? 'btn-activo' : ''}`} aria-pressed={forma === 'numero'} onClick={() => setForma('numero')}>
            Con un número
          </button>
          <button type="button" className={`btn ${forma === 'potencias' ? 'btn-activo' : ''}`} aria-pressed={forma === 'potencias'} onClick={() => setForma('potencias')}>
            En potencias
          </button>
        </div>
        {forma === 'numero' ? (
          campoNumero('Escribe el resultado ya multiplicado.')
        ) : (
          <>
            <p className="text-sm text-slate-500">
              Toca cada primo que entra en el resultado. Si va elevado a algo, pulsa + hasta que el exponente sea el correcto; con − lo bajas, y si llega a 0 el primo se quita. Si no hay ningún factor que coger, el resultado es 1: respóndelo con un número.
            </p>
            <ComponerPotencias pot={pot} cambiar={setPot} />
            <button className="btn btn-primario" disabled={!pot.length} onClick={() => responder(codificar(pot))}>
              {boton}
            </button>
          </>
        )}
      </div>
    )
  }

  if ('opciones' in e) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-slate-500">Toca la respuesta que creas correcta.</p>
        <div className="flex flex-wrap gap-2">
          {e.opciones.map((x) => (
            <button key={x} className="btn min-h-14 text-lg" onClick={() => responder(x)}>
              <TextoMat s={x} />
            </button>
          ))}
        </div>
      </div>
    )
  }

  if ('multi' in e) {
    const alternar = (x: string) => setSel((s) => (s.includes(x) ? s.filter((y) => y !== x) : [...s, x]))
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-500">Toca todas las que valgan (se vuelven moradas; tócala otra vez para quitarla). Si no vale ninguna, pulsa el botón sin marcar nada.</p>
        <div className="flex flex-wrap gap-2">
          {e.multi.map((x) => (
            <button key={x} className={`btn ${sel.includes(x) ? 'btn-primario' : ''}`} aria-pressed={sel.includes(x)} onClick={() => alternar(x)}>
              {x}
            </button>
          ))}
        </div>
        <button className="btn btn-primario" onClick={() => responder(e.multi.filter((x) => sel.includes(x)).join('|'))}>
          {boton}
        </button>
      </div>
    )
  }

  if ('orden' in e) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-500">
          Toca los números uno a uno en el orden pedido, empezando por el {e.sep === '>' ? 'mayor' : 'menor'}. Si te equivocas, quita el último.
        </p>
        <div className="flex flex-wrap gap-2">
          {e.orden.map((x) => (
            <button key={x} className="btn min-h-14 text-lg" disabled={sel.includes(x)} onClick={() => setSel((s) => (s.includes(x) ? s : [...s, x]))}>
              <TextoMat s={x} />
            </button>
          ))}
        </div>
        <p className="min-h-14 rounded-xl border border-dashed border-slate-300 px-4 py-2 text-xl font-semibold">
          {sel.length ? <TextoMat s={sel.join(`  ${e.sep ?? '<'}  `)} /> : '…'}
        </p>
        <div className="flex gap-2">
          <button className="btn" disabled={!sel.length} onClick={() => setSel(sel.slice(0, -1))}>
            ← Quitar el último
          </button>
          <button className="btn btn-primario" disabled={sel.length < e.orden.length} onClick={() => responder(sel.join('|'))}>
            {boton}
          </button>
        </div>
      </div>
    )
  }

  // Descomposición: se da en potencias y se compara como lista de primos de menor a mayor.
  return (
    <div className="space-y-3">
      <p className="text-slate-600">
        Responde con la descomposición en potencias, como en el cuaderno (por ejemplo, 56 = 2³ · 7). Toca cada primo que aparezca y, si se repite, pulsa + hasta que su exponente diga cuántas veces va.
      </p>
      <ComponerPotencias pot={pot} cambiar={setPot} />
      <button className="btn btn-primario" disabled={!pot.length} onClick={() => responder(pot.flatMap(([p, ex]) => Array<number>(ex).fill(p)).join('|'))}>
        {boton}
      </button>
    </div>
  )
}

/** El numerador con su signo: vale el botón ± y también escribir el menos con el teclado. */
const signoTecleado = (negativo: boolean, v: string) => (negativo || /[-−]/.test(v) ? '-' : '') + v.replace(/[-−]/g, '')

/** Una fracción para escribir: numerador encima del denominador, con ± para el signo. */
function CasillaFraccion({ n, d, cambiar, signo = true, etiqueta }: { n: string; d: string; cambiar: (n: string, d: string) => void; signo?: boolean; etiqueta: string }) {
  const negativo = /^[-−]/.test(n)
  return (
    <span className="inline-flex items-center gap-1" role="group" aria-label={etiqueta}>
      {signo && (
        <button type="button" className={`btn w-11 px-0 text-lg ${negativo ? 'btn-activo' : ''}`} onClick={() => cambiar(negativo ? n.replace(/^[-−]/, '') : `-${n}`, d)} aria-label="Cambiar el signo">
          ±
        </button>
      )}
      {negativo && <span className="text-2xl font-bold">−</span>}
      <span className="inline-flex flex-col items-center gap-1">
        <input className="campo h-10 w-20" inputMode="numeric" aria-label={`${etiqueta}: numerador`} value={n.replace(/^[-−]/, '')} onChange={(ev) => cambiar(signoTecleado(negativo, ev.target.value), d)} />
        <span className="h-0.5 w-20 rounded bg-slate-700" />
        <input className="campo h-10 w-20" inputMode="numeric" aria-label={`${etiqueta}: denominador`} value={d} onChange={(ev) => cambiar(n, ev.target.value)} />
      </span>
    </span>
  )
}

/** Los campos de las respuestas del Tema 2: fracción, varias fracciones, número mixto o decimal. */
function CampoFracciones({ q, responder, boton }: { q: Pregunta; responder: (resp: string) => void; boton: string }) {
  const e = q.entrada as Exclude<Entrada, 'numero'>
  const cuantas = 'fracciones' in e ? e.fracciones : 1
  const [fs, setFs] = useState<[string, string][]>(() => Array.from({ length: cuantas }, (): [string, string] => ['', '']))
  const [entero, setEntero] = useState('')
  const [dec, setDec] = useState('')
  const [error, setError] = useState('')

  const leerUna = ([n, d]: [string, string]) => {
    const limpio = `${n.replace(/\s+/g, '')}${d.trim() ? `/${d.trim()}` : ''}`
    const x = leerFr(limpio)
    return x ? `${x.n}${d.trim() ? `/${x.d}` : ''}` : null
  }

  function enviar(ev: FormEvent) {
    ev.preventDefault()
    if ('decimal' in e) {
      const x = leerDecimal(dec)
      if (x === null) return setError('Escribe un número, con coma para los decimales (por ejemplo 2,35).')
      return responder(String(x))
    }
    if ('mixto' in e) {
      const a = leerEntero(entero)
      const n = leerEntero(fs[0][0])
      const d = leerEntero(fs[0][1])
      if (a === null || n === null || d === null || d <= 0) return setError('Rellena la parte entera, el numerador y el denominador.')
      return responder(`${a}|${n}|${d}`)
    }
    const leidas = fs.map(leerUna)
    if (leidas.some((x) => x === null))
      return setError(cuantas > 1 ? 'Rellena todas las fracciones: numerador arriba y denominador abajo.' : 'Escribe el numerador arriba y el denominador abajo. Si es un entero, deja el denominador vacío.')
    responder(leidas.join('|'))
  }

  const explicacion =
    'decimal' in e
      ? `Escribe el número con coma para los decimales${e.unidad ? ` (sin escribir «${e.unidad}»)` : ''}. Si es negativo, empieza por −.`
      : 'mixto' in e
        ? 'Escribe la parte entera y, al lado, la fracción que sobra (más pequeña que la unidad).'
        : 'fracciones' in e
          ? 'Escribe cada fracción ya pasada al denominador común, en el mismo orden.'
          : `Escribe el numerador arriba y el denominador abajo; si es negativa, pulsa ±. Si el resultado es un entero, deja el denominador vacío.${'fraccion' in e && e.irreducible ? ' Simplifícala hasta la fracción irreducible.' : ''}`

  return (
    <form onSubmit={enviar} className="space-y-3">
      <p className="text-sm text-slate-500">{explicacion}</p>
      <div className="flex flex-wrap items-center gap-4">
        {'decimal' in e ? (
          <span className="inline-flex items-center gap-2">
            <input className="campo w-40" inputMode="decimal" aria-label="Respuesta" value={dec} onChange={(ev) => setDec(ev.target.value)} />
            {e.unidad && <span className="text-xl font-semibold">{e.unidad}</span>}
          </span>
        ) : 'mixto' in e ? (
          <span className="inline-flex items-center gap-2">
            <input className="campo w-20" inputMode="numeric" aria-label="Parte entera" value={entero} onChange={(ev) => setEntero(ev.target.value)} />
            <CasillaFraccion n={fs[0][0]} d={fs[0][1]} signo={false} etiqueta="Fracción" cambiar={(n, d) => setFs([[n, d]])} />
          </span>
        ) : (
          fs.map(([n, d], k) => (
            <CasillaFraccion
              key={k}
              n={n}
              d={d}
              etiqueta={cuantas > 1 ? `Fracción ${k + 1}` : 'Respuesta'}
              cambiar={(n2, d2) => setFs(fs.map((x, j): [string, string] => (j === k ? [n2, d2] : x)))}
            />
          ))
        )}
        <button className="btn btn-primario">{boton}</button>
      </div>
      {error && <p className="text-red-700">{error}</p>}
    </form>
  )
}
