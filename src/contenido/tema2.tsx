// Contenido del Tema 2 (Fracciones y decimales): los ejercicios de las hojas del profesor, repartidos por paradas,
// y los generadores de ejercicios nuevos. Las soluciones las calcula el motor, no se escriben a mano.
import type { ReactNode } from 'react'
import type { Entrada, Pregunta } from '../componentes/Respuesta'
import { F, Per, TextoMat } from '../componentes/mat'
import { ExprFr, Op } from '../componentes/fraccionesUI'
import { resolverFr, calcularFr } from '../lib/exprFr'
import {
  comparar,
  decimalAFr,
  errores,
  escribirDecimal,
  expansion,
  fr,
  generatriz,
  inversa,
  mcdDe,
  mcmLista,
  mixto,
  NOMBRE_TIPO,
  nombreOrden,
  redondear,
  texto,
  tipoDe,
  truncar,
  valorDe,
  type Fr,
} from '../lib/fracciones'

// ---------- Ayudas ----------

const HOJA = {
  act: 'Actividades y ejercicios',
  h1: 'Hoja del tema 2',
  con: 'Consolidación',
  prob: 'Problemas',
  auto: 'Autoevaluación',
} as const
type Hoja = keyof typeof HOJA

export const azar = <T,>(xs: readonly T[]): T => xs[Math.floor(Math.random() * xs.length)]
export const entre = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1))
export function barajar<T>(xs: readonly T[]): T[] {
  const a = [...xs]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Texto de una fracción para las opciones: «3/4», «−3/4» o «5». */
const tx = (f: Fr) => texto(f).replace('-', '−')
const Fx = ({ f }: { f: Fr }) => <F n={f.n} d={f.d} />
const leerF = (s: string) => {
  const [n, d = '1'] = s.replace('−', '-').split('/')
  return { n: Number(n), d: Number(d) }
}
/** Una fracción escrita «a/b» sin simplificar, para los enunciados. */
const Fs = ({ s }: { s: string }) => {
  const { n, d } = leerF(s)
  return <F n={n} d={d} />
}

interface Base {
  parada: string
  hoja: Hoja
  etq: string
  enunciado: ReactNode
  pistas: ReactNode[]
  acierto?: ReactNode
  fallo?: Pregunta['fallo']
}
function q(b: Base, entrada: Entrada, correcta: string): Pregunta {
  return { id: b.parada ? `t2:${b.parada}:${b.hoja}-${b.etq}` : '', etq: b.etq, grupo: HOJA[b.hoja], enunciado: b.enunciado, entrada, correcta, pistas: b.pistas, acierto: b.acierto, fallo: b.fallo }
}
const fracQ = (b: Base, f: Fr, irreducible = true) => q(b, { fraccion: true, irreducible }, texto(f))
const opcQ = (b: Base, opciones: string[], correcta: string) => q(b, { opciones }, correcta)
const numQ = (b: Base, n: number) => q(b, 'numero', String(n))
const decQ = (b: Base, x: number, tol?: number, unidad?: string) => q(b, { decimal: true, tol, unidad }, String(x))
const ordQ = (b: Base, valores: [string, number][], sep: '<' | '>') => {
  const orden = [...valores].sort((a, c) => (sep === '<' ? a[1] - c[1] : c[1] - a[1])).map((v) => v[0])
  return q(b, { orden: barajar(valores.map((v) => v[0])), sep }, orden.join('|'))
}
const SI_NO = ['Sí, son equivalentes', 'No son equivalentes']
const VF = ['Verdadera', 'Falsa']

const Grande = ({ children }: { children: ReactNode }) => <span className="mx-1 inline-flex items-center text-2xl font-bold">{children}</span>

// ---------- Pistas que se repiten ----------

function pistasSimplificar(n: number, d: number): ReactNode[] {
  const k = mcdDe(n, d)
  const f = fr(n, d)
  return [
    'Busca un número que divida a la vez al numerador y al denominador (mira si los dos son pares, si sus cifras suman múltiplo de 3...).',
    <>
      Lo más rápido: divide los dos entre su m.c.d. El m.c.d.({Math.abs(n)}, {d}) = {k}.
    </>,
    <>
      {n} : {k} = {f.n} y {d} : {k} = {f.d}. Queda <Fx f={f} />.
    </>,
  ]
}

function pistasEquivalentes(a: string, b: string): ReactNode[] {
  const x = leerF(a)
  const y = leerF(b)
  return [
    'Multiplica en cruz: el numerador de cada una por el denominador de la otra.',
    <>
      {x.n} · {y.d} = {x.n * y.d} y {x.d} · {y.n} = {x.d * y.n}.
    </>,
    x.n * y.d === x.d * y.n ? 'Dan lo mismo: son equivalentes.' : 'No dan lo mismo: no son equivalentes.',
  ]
}

function pistasComun(fs: string[]): ReactNode[] {
  const vs = fs.map(leerF)
  const m = mcmLista(vs.map((v) => v.d))
  return [
    <>Calcula el m.c.m. de los denominadores: m.c.m.({vs.map((v) => v.d).join(', ')}).</>,
    <>El m.c.m. es {m}. Ese es el denominador común.</>,
    <>
      Cada fracción se multiplica arriba y abajo por lo que le falta a su denominador para llegar a {m}:{' '}
      {vs.map((v, i) => (
        <span key={i} className="mr-3 inline-flex items-center">
          {m} : {v.d} = {m / v.d} → <F n={v.n * (m / v.d)} d={m} />
        </span>
      ))}
    </>,
  ]
}

/** Pistas de una operación: la jerarquía y luego cada paso del cuaderno. */
function pistasOperacion(e: string): ReactNode[] {
  const r = resolverFr(e)
  return [
    'Orden: 1.º paréntesis y corchetes, 2.º potencias, 3.º multiplicaciones y divisiones de izquierda a derecha, 4.º sumas y restas. Al final, simplifica.',
    ...r.pasos.map((p, i) => (
      <span key={i} className="flex flex-wrap items-center gap-2">
        <b>Paso {i + 1}.</b> {p.porque} <ExprFr toks={p.cuenta} />
      </span>
    )),
  ]
}

const opQ = (b: Omit<Base, 'enunciado' | 'pistas'> & { pistas?: ReactNode[] }, e: string, texto2 = 'Calcula y da el resultado en fracción irreducible:') =>
  fracQ({ ...b, enunciado: <>{texto2} <Grande><Op e={e} /></Grande></>, pistas: b.pistas ?? pistasOperacion(e) }, calcularFr(e))

function pistasDecimal(n: number, d: number): ReactNode[] {
  const x = expansion(n, d)
  const tipo = tipoDe(x)
  return [
    <>Divide el numerador entre el denominador: {n} : {d}.</>,
    <>
      Sale <TextoMat s={`${escribirDecimal(x)}${x.per ? '…' : ''}`} />
      {x.per && <> (se repite «{x.per}»)</>}.
    </>,
    tipo === 'exacto'
      ? 'Tiene un número limitado de cifras decimales: es un decimal exacto.'
      : tipo === 'entero'
        ? 'La división es exacta y no hay decimales: es un número entero.'
        : tipo === 'puro'
          ? `El período (${x.per}) empieza justo después de la coma: es periódico puro.`
          : `Antes del período hay cifras que no se repiten (el anteperíodo, ${x.ante}): es periódico mixto.`,
  ]
}

function pistasGeneratriz(ent: number, ante: string, per: string): ReactNode[] {
  const g = generatriz(ent, ante, per)
  if (!per)
    return [
      'Es un decimal exacto: arriba, el número sin la coma; abajo, un 1 con tantos ceros como cifras decimales.',
      <>
        <F n={g.sinComa} d={g.den} /> y luego simplifica.
      </>,
      <>
        Queda <Fx f={g.f} />.
      </>,
    ]
  return [
    'Arriba: el número sin la coma menos la parte que no se repite (sin la coma). Abajo: tantos nueves como cifras tiene el período y tantos ceros como cifras tiene el anteperíodo.',
    <>
      Arriba: {g.sinComa} − {g.noPer} = {g.num}. Abajo: {g.den}.
    </>,
    <>
      <F n={g.num} d={g.den} /> = <Fx f={g.f} /> al simplificar.
    </>,
  ]
}

const NombreDec = ({ ent, ante, per }: { ent: number; ante: string; per: string }) =>
  per ? <Per ent={String(ent)} ante={ante} per={per} /> : <span className="tabular-nums">{`${ent},${ante}`}</span>

// ===================================================================================================
// Parada 1 · Fracciones y fracciones equivalentes
// ===================================================================================================

const P1 = 'fracciones'
export const FRACCIONES: Pregunta[] = [
  ...(
    [
      ['1a', 'Un quinto del público del teatro es de Toledo.', '1/5'],
      ['1b', 'Ochenta y cinco de cada 100 estudiantes aprueba todo.', '85/100'],
      ['1c', 'Ana ha comido un octavo de tarta.', '1/8'],
      ['1d', 'Tres cuartos de los 20 alumnos de 12 años tienen teléfono móvil.', '3/4'],
      ['2a', 'He recorrido 16 km de una ruta de 63 km.', '16/63'],
      ['2b', 'El bizcocho tarda en hacerse una hora y media (en horas).', '3/2'],
      ['2c', 'En la botella quedan 4 décimas partes de aceite.', '4/10'],
      ['2d', 'Existe una probabilidad de 1 entre 10.000 de que me toque el premio.', '1/10000'],
    ] as const
  ).map(([etq, frase, f]) =>
    fracQ(
      {
        parada: P1,
        hoja: 'h1',
        etq,
        enunciado: <>Escribe la fracción que se utiliza: «{frase}»</>,
        pistas: ['El denominador dice en cuántas partes iguales se divide el todo; el numerador, cuántas se cogen.', <>Es <Fs s={f} />.</>],
        acierto: <>Correcto: <Fs s={f} />. Vale también cualquier fracción equivalente.</>,
      },
      fr(leerF(f).n, leerF(f).d),
      false,
    ),
  ),
  ...(
    [
      ['act', '1a', '4/6', '6/9'],
      ['act', '1b', '5/10', '6/12'],
      ['act', '1c', '7/10', '8/11'],
      ['act', '1d', '3/6', '7/14'],
      ['auto', '2a', '16/54', '24/81'],
      ['auto', '2b', '15/75', '12/72'],
      ['auto', '2c', '36/92', '45/115'],
    ] as const
  ).map(([hoja, etq, a, b]) => {
    const x = leerF(a)
    const y = leerF(b)
    return opcQ(
      {
        parada: P1,
        hoja,
        etq,
        enunciado: (
          <>
            ¿Son equivalentes <Grande><Fs s={a} /></Grande> y <Grande><Fs s={b} /></Grande>?
          </>
        ),
        pistas: pistasEquivalentes(a, b),
      },
      SI_NO,
      x.n * y.d === x.d * y.n ? SI_NO[0] : SI_NO[1],
    )
  }),
  ...(
    [
      ['5a', '15/□', 6],
      ['5b', '□/2', 5],
      ['5c', '80/□', 32],
      ['5d', '□/40', 100],
    ] as const
  ).map(([etq, hueco, n]) =>
    numQ(
      {
        parada: P1,
        hoja: 'h1',
        etq,
        enunciado: (
          <>
            Completa para que sean equivalentes: <Grande><F n={20} d={8} /></Grande> = <Grande>{hueco.replace('/', ' / ')}</Grande>. ¿Qué número va en el hueco?
          </>
        ),
        pistas: [<>Simplifica primero: <F n={20} d={8} /> = <F n={5} d={2} />.</>, 'Mira por cuánto se ha multiplicado el número que conoces y multiplica el otro por lo mismo.', `Va el ${n}.`],
      },
      n,
    ),
  ),
  ...(
    [
      ['1a', 48, 64],
      ['1b', 36, 99],
      ['1c', 120, 3600],
      ['1d', 63, 91],
      ['1e', 483, 46],
      ['1f', 266, 114],
    ] as const
  ).map(([etq, n, d]) =>
    fracQ({ parada: P1, hoja: 'auto', etq, enunciado: <>Simplifica hasta obtener la fracción irreducible: <Grande><F n={n} d={d} /></Grande></>, pistas: pistasSimplificar(n, d) }, fr(n, d)),
  ),
  ...(
    [
      ['8a', 2, 3],
      ['8b', 1, 4],
      ['8c', 7, 5],
      ['8d', 10, 11],
      ['8e', 3, 5],
    ] as const
  ).map(([etq, n, d]) =>
    fracQ(
      {
        parada: P1,
        hoja: 'act',
        etq,
        enunciado: <>Calcula la fracción inversa de <Grande><F n={n} d={d} /></Grande></>,
        pistas: ['La inversa se obtiene dando la vuelta a la fracción: el numerador pasa abajo y el denominador arriba.', <>Comprueba que al multiplicarlas da 1: <F n={n} d={d} /> · <F n={d} d={n} /> = 1.</>],
      },
      inversa(fr(n, d)),
    ),
  ),
  ...(
    [
      ['12a', 10, 3],
      ['12b', 9, 2],
      ['12c', 33, 10],
      ['12d', 27, 5],
      ['12e', 14, 10],
    ] as const
  ).map(([etq, n, d]) => {
    const m = { ent: Math.floor(n / d), n: n % d, d }
    return q(
      {
        parada: P1,
        hoja: 'h1',
        etq,
        enunciado: <>Expresa como número mixto: <Grande><F n={n} d={d} /></Grande></>,
        pistas: [<>Divide el numerador entre el denominador: {n} : {d}.</>, `El cociente es ${m.ent} y el resto ${m.n}.`, <>El cociente es la parte entera y el resto, el numerador de la fracción: {m.ent} <F n={m.n} d={d} />.</>],
      },
      { mixto: true },
      `${m.ent} ${m.n}/${d}`,
    )
  }),
]

export function nuevaFracciones(): Pregunta {
  const tipo = azar(['simplificar', 'simplificar', 'equivalentes', 'inversa', 'mixto'] as const)
  const b = { parada: '', hoja: 'act' as const, etq: '' }
  if (tipo === 'simplificar') {
    const f = fr(entre(1, 9), entre(2, 12))
    const k = azar([2, 3, 4, 5, 6, 8, 9, 10, 12])
    const n = f.n * k
    const d = f.d * k
    return fracQ({ ...b, enunciado: <>Simplifica hasta obtener la fracción irreducible: <Grande><F n={n} d={d} /></Grande></>, pistas: pistasSimplificar(n, d) }, f)
  }
  if (tipo === 'equivalentes') {
    const f = fr(entre(1, 7), entre(2, 9))
    const k = entre(2, 5)
    const otra = Math.random() < 0.5 ? `${f.n * k}/${f.d * k}` : `${f.n * k + azar([-1, 1])}/${f.d * k}`
    const a = `${f.n}/${f.d}`
    const x = leerF(otra)
    return opcQ({ ...b, enunciado: <>¿Son equivalentes <Grande><Fs s={a} /></Grande> y <Grande><Fs s={otra} /></Grande>?</>, pistas: pistasEquivalentes(a, otra) }, SI_NO, f.n * x.d === f.d * x.n ? SI_NO[0] : SI_NO[1])
  }
  if (tipo === 'inversa') {
    const f = fr(entre(1, 12), entre(2, 12))
    return fracQ({ ...b, enunciado: <>Calcula la fracción inversa de <Grande><Fx f={f} /></Grande></>, pistas: ['Se le da la vuelta: el numerador pasa abajo y el denominador arriba.'] }, inversa(f))
  }
  const d = entre(2, 9)
  const n = d * entre(1, 6) + entre(1, d - 1)
  return q(
    { ...b, enunciado: <>Expresa como número mixto: <Grande><F n={n} d={d} /></Grande></>, pistas: [<>Divide {n} : {d}.</>, `Cociente ${Math.floor(n / d)} y resto ${n % d}.`] },
    { mixto: true },
    `${Math.floor(n / d)} ${n % d}/${d}`,
  )
}

// ===================================================================================================
// Parada 2 · Comparación y ordenación
// ===================================================================================================

const P2 = 'comparar'
const fsNum = (fs: string[]) => fs.map((s) => [s.replace('-', '−'), valorDe(fr(leerF(s).n, leerF(s).d))] as [string, number])

function comunQ(hoja: Hoja, etq: string, fs: string[]): Pregunta {
  const vs = fs.map(leerF)
  const m = mcmLista(vs.map((v) => v.d))
  return q(
    {
      parada: P2,
      hoja,
      etq,
      enunciado: (
        <>
          Reduce a común denominador:{' '}
          {fs.map((s, i) => (
            <Grande key={i}>
              <Fs s={s} />
              {i < fs.length - 1 && ','}
            </Grande>
          ))}
        </>
      ),
      pistas: pistasComun(fs),
    },
    { fracciones: fs.length },
    vs.map((v) => `${v.n * (m / v.d)}/${m}`).join('|'),
  )
}

function pistasOrden(fs: string[]): ReactNode[] {
  const conDec = fs.some((s) => s.includes(','))
  if (conDec) return ['Pasa todos a número decimal dividiendo numerador entre denominador.', 'Recuerda: los negativos son menores que todos los positivos, y entre negativos es menor el que está más lejos del 0.']
  const vs = fs.map(leerF)
  const m = mcmLista(vs.map((v) => v.d))
  return [
    'Reduce todas a común denominador y compara los numeradores.',
    <>
      Con denominador {m}:{' '}
      {vs.map((v, i) => (
        <span key={i} className="mr-3 inline-flex items-center">
          <F n={v.n} d={v.d} /> = <F n={v.n * (m / v.d)} d={m} />
        </span>
      ))}
    </>,
    'Es mayor la que tiene mayor numerador. Cuidado con las negativas: −9 es menor que −8.',
  ]
}

const ordenQ = (hoja: Hoja, etq: string, fs: string[], sep: '<' | '>') =>
  ordQ({ parada: P2, hoja, etq, enunciado: <>Ordena de {sep === '<' ? 'menor a mayor' : 'mayor a menor'}.</>, pistas: pistasOrden(fs) }, fsNum(fs), sep)

export const COMPARAR: Pregunta[] = [
  comunQ('act', '2a', ['2/21', '1/6', '5/14']),
  comunQ('act', '2b', ['3/5', '2/9', '4/15']),
  comunQ('act', '2c', ['3/4', '1/6', '7/8']),
  comunQ('h1', '6a', ['2/21', '1/6', '3/14']),
  comunQ('h1', '6b', ['3/5', '2/9', '1/15']),
  comunQ('h1', '6c', ['3/4', '1/6', '6/8']),
  ...(
    [
      ['3a', '5/6', '6/7'],
      ['3b', '2/5', '5/8'],
      ['3c', '3/4', '5/6'],
      ['3d', '10/4', '15/6'],
    ] as const
  ).map(([etq, a, b]) => {
    const c = comparar(fr(leerF(a).n, leerF(a).d), fr(leerF(b).n, leerF(b).d))
    return opcQ(
      { parada: P2, hoja: 'act', etq, enunciado: <>¿Cuál es mayor, <Grande><Fs s={a} /></Grande> o <Grande><Fs s={b} /></Grande>?</>, pistas: pistasOrden([a, b]) },
      [a, b, 'Son iguales'],
      c > 0 ? a : c < 0 ? b : 'Son iguales',
    )
  }),
  ordenQ('act', '4', ['4/3', '2/5', '-3/4', '6/1', '-2/3', '1/10'], '>'),
  ordenQ('h1', '7', ['4/3', '2/5', '-3/4', '6/1', '-2/3', '1/10'], '<'),
  ordenQ('act', '5a', ['2/21', '1/6', '5/14'], '<'),
  ordenQ('act', '5b', ['3/5', '2/9', '4/15'], '<'),
  ordenQ('act', '5c', ['3/4', '1/6', '7/8'], '<'),
  ordenQ('h1', '8a', ['4/7', '2/3', '3/5'], '>'),
  ordenQ('h1', '8b', ['5/11', '6/10', '4/9'], '>'),
  ordenQ('h1', '8c', ['9/16', '7/12', '13/24'], '>'),
  ordenQ('auto', '3', ['5/8', '12/25', '7/10', '5/12'], '<'),
  ordQ(
    {
      parada: P2,
      hoja: 'auto',
      etq: '9',
      enunciado: (
        <>
          El agua de una provincia procede de tres embalses. El primero aporta <F n={3} d={8} /> del total; el segundo, <F n={7} d={18} />, y el tercero, el resto. Ordena los embalses de mayor a menor según el agua que aportan.
        </>
      ),
      pistas: [
        <>Lo del tercero: 1 − <F n={3} d={8} /> − <F n={7} d={18} />.</>,
        <>Con denominador 72: primero <F n={27} d={72} />, segundo <F n={28} d={72} />, tercero <F n={17} d={72} />.</>,
      ],
    },
    [
      ['Primero', 27],
      ['Segundo', 28],
      ['Tercero', 17],
    ],
    '>',
  ),
  opcQ(
    {
      parada: P2,
      hoja: 'prob',
      etq: '7a',
      enunciado: (
        <>
          Dos automóviles, A y B, hacen el mismo trayecto de 572 km. A lleva recorridos <F n={5} d={11} /> del trayecto cuando B ha recorrido <F n={6} d={13} />. ¿Cuál va primero?
        </>
      ),
      pistas: [<>Compara <F n={5} d={11} /> y <F n={6} d={13} /> con común denominador: 143.</>, <><F n={65} d={143} /> y <F n={66} d={143} />.</>],
    },
    ['El A', 'El B', 'Van a la par'],
    'El B',
  ),
  numQ({ parada: P2, hoja: 'prob', etq: '7b', enunciado: <>En el mismo problema, ¿cuántos kilómetros lleva recorridos el automóvil A (<F n={5} d={11} /> de 572 km)?</>, pistas: ['Para calcular una fracción de un número: se divide entre el denominador y se multiplica por el numerador.', '572 : 11 = 52; 52 · 5 = 260.'] }, 260),
  numQ({ parada: P2, hoja: 'prob', etq: '7c', enunciado: <>¿Y el automóvil B (<F n={6} d={13} /> de 572 km)?</>, pistas: ['572 : 13 = 44; 44 · 6 = 264.'] }, 264),
]

function fraccionAzar(neg = false): Fr {
  for (;;) {
    const f = fr(entre(1, 11) * (neg && Math.random() < 0.3 ? -1 : 1), azar([2, 3, 4, 5, 6, 7, 8, 9, 10, 12]))
    if (f.d !== 1) return f
  }
}

export function nuevaComparar(): Pregunta {
  const tipo = azar(['orden', 'mayor', 'comun'] as const)
  const b = { parada: '', hoja: 'act' as const, etq: '' }
  if (tipo === 'comun') {
    const fs = Array.from({ length: entre(2, 3) }, () => fraccionAzar())
    const ss = fs.map((f) => `${f.n}/${f.d}`)
    if (new Set(fs.map((f) => f.d)).size < fs.length) return nuevaComparar()
    const m = mcmLista(fs.map((f) => f.d))
    return q(
      { ...b, enunciado: <>Reduce a común denominador: {ss.map((s, i) => <Grande key={i}><Fs s={s} /></Grande>)}</>, pistas: pistasComun(ss) },
      { fracciones: fs.length },
      fs.map((f) => `${f.n * (m / f.d)}/${m}`).join('|'),
    )
  }
  if (tipo === 'mayor') {
    const [x, y] = [fraccionAzar(), fraccionAzar()]
    const c = comparar(x, y)
    if (c === 0) return nuevaComparar()
    return opcQ({ ...b, enunciado: <>¿Cuál es mayor, <Grande><Fx f={x} /></Grande> o <Grande><Fx f={y} /></Grande>?</>, pistas: pistasOrden([texto(x), texto(y)]) }, [texto(x), texto(y), 'Son iguales'], c > 0 ? texto(x) : texto(y))
  }
  const fs = Array.from({ length: 4 }, () => fraccionAzar(true))
  const vals = fs.map(valorDe)
  if (new Set(vals).size < 4) return nuevaComparar()
  const sep = azar(['<', '>'] as const)
  return ordQ({ ...b, enunciado: <>Ordena de {sep === '<' ? 'menor a mayor' : 'mayor a menor'}.</>, pistas: pistasOrden(fs.map(texto)) }, fs.map((f) => [tx(f), valorDe(f)] as [string, number]), sep)
}

// ===================================================================================================
// Parada 3 · Operaciones con fracciones
// ===================================================================================================

const P3 = 'operaciones'
const o3 = (hoja: Hoja, etq: string, e: string) => opQ({ parada: P3, hoja, etq }, e)

export const OPERACIONES: Pregunta[] = [
  o3('h1', '9a', '3/6 + 5/4'),
  o3('h1', '9b', '7/2 + 4/3'),
  o3('h1', '9c', '9/5 + 9/8'),
  o3('h1', '9d', '1/7 + 1/2 - 1/15'),
  o3('h1', '9e', '2/3 - 4/6 - 5/12'),
  o3('h1', '9f', '10/5 + 2/10 - 6/15 - 7'),
  o3('h1', '9g', '-2/11 - 5 + 9 + 3/2'),
  o3('h1', '9h', '4/3 + 6/6 - 8/7'),
  opQ({ parada: P3, hoja: 'act', etq: '7a' }, '2/5 + 1/6 + 3/10', 'Dadas las fracciones 2/5, 1/6 y 3/10, calcula su suma:'),
  fracQ(
    {
      parada: P3,
      hoja: 'act',
      etq: '7b',
      enunciado: <>La suma de <F n={2} d={5} />, <F n={1} d={6} /> y <F n={3} d={10} /> es <F n={13} d={15} />. ¿Cuánto le falta para llegar a la unidad?</>,
      pistas: [<>Lo que falta es 1 − <F n={13} d={15} />.</>, <>1 = <F n={15} d={15} />.</>],
    },
    fr(2, 15),
  ),
  o3('act', '9a', '1/3 · 6/5'),
  o3('act', '9b', '4/7 · 3/2'),
  o3('act', '9c', '5/3 · 9/2'),
  o3('act', '9d', '2/33 · 11/4'),
  o3('act', '6a', '3/4 : 5/2'),
  o3('act', '6b', '1/6 : 7/3'),
  o3('act', '6c', '12/5 : 4/3'),
  o3('act', '6d', '2/3 : 4/9'),
  o3('con', '1a', '1/2 - 2/5 + 3/4'),
  o3('con', '1b', '1/3 - 2 - 3/4'),
  o3('con', '1c', '2/5 + 3/4 + 1 - 1/6'),
  o3('con', '1d', '5/2 - 3/5 + 1/6'),
  o3('con', '1e', '-15/2 - 4/5 + 4'),
  o3('con', '1f', '1/2 + 2/3 - 3/4 + 5/6'),
  o3('con', '2a', '12/5 · 4/9 · 1/6'),
  o3('con', '2b', '4/7 : 2/15'),
  o3('con', '2c', '(12/25)^2'),
  o3('con', '2d', '2 · 7/5 · (-3/4)'),
  o3('con', '2e', '(-15/8) : 1/4'),
  o3('con', '2f', '(-3/2)^5'),
  opQ({ parada: P3, hoja: 'h1', etq: '15a' }, '(10/3)^3'),
  numQ({ parada: P3, hoja: 'h1', etq: '15b' + '1', enunciado: <>Completa: (<F n={10} d={9} />)² … ¿qué denominador hace que (10/□)² = □/81? Escribe el denominador de dentro.</>, pistas: ['Se eleva el denominador al cuadrado y da 81.', '9² = 81.'] }, 9),
  numQ({ parada: P3, hoja: 'h1', etq: '15b' + '2', enunciado: <>Completa: (<F n={10} d={9} />)² = □/81. ¿Qué numerador va?</>, pistas: ['Se eleva el numerador al cuadrado.', '10² = 100.'] }, 100),
  numQ({ parada: P3, hoja: 'h1', etq: '15c', enunciado: <>Completa el exponente: (<F n={1} d={5} />)<sup>□</sup> = <F n={1} d={625} /></>, pistas: ['¿Cuántas veces hay que multiplicar el 5 para llegar a 625?', '5 · 5 · 5 · 5 = 625.'] }, 4),
  numQ({ parada: P3, hoja: 'act', etq: '12a', enunciado: <>Completa: <F n={5} d={2} /> : <span className="inline-flex flex-col items-center align-middle"><span>3</span><span className="h-0.5 w-full bg-current" /><span>□</span></span> = <F n={5} d={3} /></>, pistas: ['Dividir es multiplicar en cruz: 5 · □ arriba y 2 · 3 abajo.', <>5·□ / 6 = 5/3 = 10/6, así que 5 · □ = 10.</>] }, 2),
  numQ({ parada: P3, hoja: 'act', etq: '12c', enunciado: <>Completa: <span className="inline-flex flex-col items-center align-middle"><span>□</span><span className="h-0.5 w-full bg-current" /><span>7</span></span> : <F n={3} d={7} /> = <F n={4} d={3} /></>, pistas: ['En cruz: □ · 7 arriba y 7 · 3 abajo, o sea □/3.', '□/3 = 4/3.'] }, 4),
  fracQ({ parada: P3, hoja: 'act', etq: '12d', enunciado: <>¿Por qué fracción hay que multiplicar <F n={12} d={35} /> para obtener <F n={1} d={10} />?</>, pistas: ['Esa fracción es la división 1/10 : 12/35.', <>En cruz: <F n={35} d={120} />, y se simplifica.</>] }, fr(7, 24)),
  ...(
    [
      ['13a', 'Dividendo de la 1.ª fila: divisor 2/3 y cociente 15/4', fr(5, 2), 'Dividendo = cociente · divisor.'],
      ['13b', 'Inversa del divisor de la 1.ª fila (divisor 2/3)', fr(3, 2), 'Se le da la vuelta.'],
      ['13c', 'Divisor de la 2.ª fila: dividendo 3/7 y cociente 6/5', fr(5, 14), 'Divisor = dividendo : cociente.'],
      ['13d', 'Inversa del divisor de la 2.ª fila', fr(14, 5), 'El divisor es 5/14: se le da la vuelta.'],
      ['13e', 'Divisor de la 3.ª fila: la inversa del divisor es 3/5', fr(5, 3), 'Si la inversa es 3/5, el divisor es su inversa.'],
      ['13f', 'Dividendo de la 3.ª fila: divisor 5/3 y cociente 3/10', fr(1, 2), 'Dividendo = cociente · divisor.'],
      ['13g', 'Cociente de la 4.ª fila: dividendo 5/3 y divisor 1/6', fr(10), 'Se multiplica por la inversa del divisor, 6.'],
    ] as const
  ).map(([etq, frase, f, pista]) => fracQ({ parada: P3, hoja: 'act', etq, enunciado: <>Completa la tabla de divisiones. <TextoMat s={frase} />.</>, pistas: [pista] }, f)),
  ...(
    [
      ['29a', 'El doble de 5/4 es lo mismo que la mitad de 5.', 'Verdadera', 'El doble de 5/4 es 10/4 = 5/2, y la mitad de 5 es 5/2.'],
      ['29b', 'Los 2/5 de los 2/5 de los 2/5 de una cantidad son los 3 · 2/5 = 6/5 de esa cantidad.', 'Falsa', '«De» es multiplicar: (2/5)³ = 8/125, no 6/5.'],
      ['29c', 'Para multiplicar dos fracciones de distinto denominador, primero hay que reducirlas a común denominador.', 'Falsa', 'Para multiplicar no hace falta: se multiplica en línea. El común denominador es para sumar y restar.'],
      ['29d', 'El inverso de 3/5 es −3/5.', 'Falsa', 'Eso es el opuesto. El inverso es 5/3.'],
    ] as const
  ).map(([etq, frase, c, pista]) => opcQ({ parada: P3, hoja: 'act', etq, enunciado: <>¿Verdadera o falsa? <TextoMat s={frase} /></>, pistas: [pista] }, VF, c)),
  // Problemas de una sola operación (o dos muy seguidas).
  ...(
    [
      ['1a', 'la mitad de la mitad', fr(1, 4)],
      ['1b', 'la mitad de la tercera parte', fr(1, 6)],
      ['1c', 'la tercera parte de la mitad', fr(1, 6)],
      ['1d', 'la mitad de la cuarta parte', fr(1, 8)],
      ['1e', 'las tres quintas partes de la tercera parte', fr(1, 5)],
    ] as const
  ).map(([etq, frase, f]) => fracQ({ parada: P3, hoja: 'prob', etq: 'F' + etq, enunciado: <>¿Qué fracción de la unidad es {frase}?</>, pistas: ['«La mitad de», «la tercera parte de»... es multiplicar: la mitad de algo es 1/2 · algo.'] }, f)),
  numQ({ parada: P3, hoja: 'prob', etq: 'F3', enunciado: <>El depósito de gasoil del instituto tiene 1500 litros. Este trimestre se han consumido <F n={2} d={5} />. ¿Cuántos litros quedan?</>, pistas: [<>Si se han gastado <F n={2} d={5} />, quedan <F n={3} d={5} />.</>, '1500 : 5 · 3 = 900.'] }, 900),
  numQ({ parada: P3, hoja: 'prob', etq: 'F4', enunciado: <>En una competición se pueden obtener 75 puntos. Juan ha conseguido <F n={3} d={5} /> del total. ¿Cuántos puntos le han faltado?</>, pistas: [<>Le han faltado <F n={2} d={5} /> del total.</>, '75 : 5 · 2 = 30.'] }, 30),
  numQ({ parada: P3, hoja: 'prob', etq: 'F2a', enunciado: <>Un pastel para 4 personas lleva <F n={1} d={3} /> de un paquete de 750 g de azúcar. ¿Cuántos gramos de azúcar hacen falta para 6 personas?</>, pistas: ['Para 4: 750 : 3 = 250 g.', 'Para 6 es una vez y media: 250 · 6 : 4 = 375.'] }, 375),
  numQ({ parada: P3, hoja: 'prob', etq: 'F2b', enunciado: <>El mismo pastel lleva <F n={3} d={4} /> de un paquete de harina de un kilo (1000 g). ¿Cuántos gramos para 6 personas?</>, pistas: ['Para 4: 1000 : 4 · 3 = 750 g.', 'Para 6: 750 · 6 : 4 = 1125.'] }, 1125),
  numQ({ parada: P3, hoja: 'prob', etq: 'F2c', enunciado: <>Y lleva <F n={3} d={5} /> de una barra de mantequilla de 200 g. ¿Cuántos gramos para 6 personas?</>, pistas: ['Para 4: 200 : 5 · 3 = 120 g.', 'Para 6: 120 · 6 : 4 = 180.'] }, 180),
  numQ({ parada: P3, hoja: 'prob', etq: 'G3', enunciado: <>Con un bidón de agua se han llenado 40 botellas de <F n={3} d={4} /> de litro. ¿Cuántos litros había en el bidón?</>, pistas: [<>40 · <F n={3} d={4} />.</>, '40 : 4 · 3 = 30.'] }, 30),
  numQ({ parada: P3, hoja: 'prob', etq: 'G4', enunciado: <>Un frasco de perfume tiene <F n={1} d={20} /> de litro. ¿Cuántos frascos se llenan con una botella de <F n={3} d={4} /> de litro?</>, pistas: [<>Es una división: <F n={3} d={4} /> : <F n={1} d={20} />.</>, <>En cruz: <F n={60} d={4} /> = 15.</>] }, 15),
  numQ({ parada: P3, hoja: 'prob', etq: 'H3', enunciado: <>¿Cuánto vino hay en 7 cajas y media de botellas, si cada caja tiene 24 botellas de <F n={3} d={4} /> de litro? (en litros)</>, pistas: ['Botellas: 7,5 · 24 = 180.', <>Litros: 180 · <F n={3} d={4} /> = 135.</>] }, 135),
  numQ({ parada: P3, hoja: 'prob', etq: 'H9a', enunciado: <>El paso de Mercedes mide <F n={7} d={8} /> de metro. ¿Cuántos metros recorre con 1000 pasos?</>, pistas: [<>1000 · <F n={7} d={8} /> = 7000 : 8.</>] }, 875),
  numQ({ parada: P3, hoja: 'prob', etq: 'H9b', enunciado: <>¿Cuántos pasos de <F n={7} d={8} /> de metro tiene que dar para recorrer 1400 m?</>, pistas: [<>Es una división: 1400 : <F n={7} d={8} /> = 1400 · 8 : 7.</>] }, 1600),
  numQ({ parada: P3, hoja: 'prob', etq: 'H10', enunciado: <>Tres cuartos de kilo de queso cuestan lo mismo que dos quintos de kilo de jamón. Si el jamón está a 30 €/kg, ¿a cuánto está el kilo de queso (en €)?</>, pistas: [<>El jamón: <F n={2} d={5} /> · 30 = 12 €.</>, <>Eso cuestan <F n={3} d={4} /> kg de queso: 12 : <F n={3} d={4} /> = 16.</>] }, 16),
  fracQ({ parada: P3, hoja: 'con', etq: '5a', enunciado: <>En un hotel hay 120 habitaciones, de las que <F n={1} d={5} /> están vacías. ¿Qué fracción de las habitaciones está ocupada?</>, pistas: [<>1 − <F n={1} d={5} />.</>] }, fr(4, 5)),
  numQ({ parada: P3, hoja: 'con', etq: '5b', enunciado: <>En ese hotel de 120 habitaciones, ¿cuántas están vacías (<F n={1} d={5} />)?</>, pistas: ['120 : 5.'] }, 24),
  decQ({ parada: P3, hoja: 'prob', etq: 'H7a', enunciado: <>Una familia gasta cada día <F n={13} d={4} /> litros de leche en el desayuno, <F n={3} d={4} /> en la comida y <F n={3} d={2} /> en la cena. ¿Cuántos litros gasta en un mes de 30 días?</>, pistas: [<>Al día: <F n={13} d={4} /> + <F n={3} d={4} /> + <F n={3} d={2} /> = <F n={11} d={2} /> litros.</>, <>Al mes: 30 · <F n={11} d={2} /> = 165.</>] }, 165),
  decQ({ parada: P3, hoja: 'prob', etq: 'H7b', enunciado: <>Si el litro de esa leche cuesta 0,85 €, ¿cuánto paga al mes por los 165 litros?</>, pistas: ['165 · 0,85.'] }, 140.25, 0.001, '€'),
]

function nuevaOperacionesExpr(): string {
  const f = () => {
    const x = fraccionAzar(true)
    return x.n < 0 ? `(${texto(x)})` : texto(x)
  }
  const tipo = azar(['suma', 'suma', 'mul', 'div', 'pot'] as const)
  if (tipo === 'suma') return Array.from({ length: entre(2, 3) }, (_, i) => (i === 0 ? texto(fraccionAzar()) : `${azar(['+', '-'])} ${texto(fraccionAzar())}`)).join(' ')
  if (tipo === 'mul') return `${texto(fraccionAzar())} · ${f()}`
  if (tipo === 'div') return `${texto(fraccionAzar())} : ${f()}`
  return `(${texto(fr(entre(1, 5) * azar([1, 1, -1]), entre(2, 5)))})^${entre(2, 3)}`
}
export const nuevaOperaciones = (): Pregunta => opQ({ parada: '', hoja: 'act', etq: '' }, nuevaOperacionesExpr())

// ===================================================================================================
// Parada 4 · Operaciones combinadas y problemas
// ===================================================================================================

const P4 = 'combinadas'
const o4 = (hoja: Hoja, etq: string, e: string) => opQ({ parada: P4, hoja, etq }, e)

const prob = (etq: string, enunciado: ReactNode, pistas: ReactNode[], n: number, hoja: Hoja = 'prob') => numQ({ parada: P4, hoja, etq, enunciado, pistas }, n)

export const COMBINADAS2: Pregunta[] = [
  o4('act', '25a', '2/5 - 3/10 : 1/2'),
  o4('act', '25b', '5/4 - (3/2 + 3/2 + 3/2) · 1/3'),
  o4('act', '25c', '(1 - 4/5) · (1 + 4/5) + 3/10'),
  o4('act', '25d', '(3/7 - 2) · 7/2'),
  o4('act', '11a', '-1/6 + 3/7 - (1 - 1/3)'),
  o4('act', '11b', '2 - 3/5 + (1/10 - 1)'),
  o4('act', '11c', '(1/4 - 7/8) - (5/6 - 1/3)'),
  o4('act', '10a', '(2/3 - 1/6) - (3/4 + 5/8 - 2)'),
  o4('act', '10b', '-(2 - 1/7) + 1 - (5/2 - 3 + 5/14)'),
  o4('h1', '21h', '(3/4) : (16/25)'),
  o4('act', '27a', '1/5 + 2/3 · (1 + 4/5) - 2/3 : 1/4'),
  o4('act', '27b', '1/3 - 1/4 · (5/3 : 1/2 + 2)'),
  o4('act', '30a', '3 + 2 · (7/4 · 1/3) + (9/5 : 27/10)'),
  o4('act', '30b', '(1/5 - (1 - 2/3) · 2) : (1/3 - 1/10)'),
  o4('act', '32a', '3 - (5/√36 - 2/3) + (3/2 - 1) · (3/2 + 1)'),
  o4('act', '32b', '-2 · (2/3 - 5/4 : 3/2) + 5/4'),
  o4('act', '33a', '9/4 - 2 + (1/3 - 1/6) + (1 - 5/8) · (1 - 1/3)'),
  o4('act', '33b', '2 - 1/4 · (5/9 + 1/3 - 1/2) - 4/6 · (3 - 4/3)'),
  o4('h1', '22a', '5/4 - 3/4 · (1 + 4/5)'),
  o4('h1', '22b', '(7/8 - 1/6 : 5/3) - (5/6 - 1/3)'),
  o4('h1', '22c', '(5/16 - 35/12 : 6) - (2/6 · 1/3)'),
  o4('h1', '22d', '(5/9 · 1/6 : 5/3) · (5/6 : 1/3)'),
  o4('con', '3a', '(1/2)^3 - 2/5 · 3/4'),
  o4('con', '3b', '4/5 + 3/2 · 7/4 - 3/5 · 1/2'),
  o4('con', '3c', '4 · 3/7 - 2/5 : (-7/4)'),
  o4('con', '3d', '1/2 : 3 · 4/5 + 2 : (-3/4)^2'),
  o4('con', '4a', '1/3 : 4/5 + 3/5 · (5 - 8/3)'),
  o4('con', '4b', '[1/3 : (2 · 7/3) + 1] · (3/5)^2'),
  o4('con', '4c', '4 - 7/2 : [3/5 · (5 - 8/3)]'),
  o4('con', '4d', '(7/10 - 3/5 · 2) · [4 + 3/8 : (5/2 - 1)^2]'),
  o4('auto', '4a', '3/8 + 5/6 · 12/25'),
  o4('auto', '4b', '19/36 : 5/4 - 11/20'),
  o4('auto', '4c', '2/5 + 3/5 · (7/9 - 1/6 · 8/3)'),
  o4('auto', '4d', '4/9 · 3 - [5/8 - 1] : 3/4'),
  o4('auto', '5a', '[3/2 : (5/2 - 1)] + 3/2 : 5/4 · 5/6'),
  o4('auto', '5b', '2 : 15/8 · [11/6 - 4/3 · (3/2 - 2)]'),
  // Problemas de varios pasos.
  prob('26', <>Bernardo compra 3 botellas de leche de litro y medio, 4 latas de refresco de un tercio de litro y una botella de zumo de tres cuartos de litro. Por el camino, con un amigo, se toman una lata y la tercera parte del zumo. ¿Cuántos litros llegan a casa?</>, [<>Compra: 3 · <F n={3} d={2} /> + 4 · <F n={1} d={3} /> + <F n={3} d={4} /> = <F n={79} d={12} /> litros.</>, <>Se toman <F n={1} d={3} /> + <F n={1} d={3} /> · <F n={3} d={4} /> = <F n={7} d={12} />.</>, <><F n={79} d={12} /> − <F n={7} d={12} /> = <F n={72} d={12} />.</>], 6, 'act'),
  prob('31a', <>Entre Silvia y Sergio han cogido 42 setas. Sergio ha cogido <F n={3} d={4} /> de las que ha cogido Silvia. ¿Cuántas ha cogido Silvia?</>, [<>Si Silvia coge 4 partes, Sergio coge 3: en total 7 partes.</>, '42 : 7 = 6 setas cada parte. Silvia: 4 · 6.'], 24, 'act'),
  prob('31b', <>En el mismo problema de las 42 setas, ¿cuántas ha cogido Sergio?</>, ['Cada parte son 6 setas y Sergio tiene 3 partes.'], 18, 'act'),
  prob('28a', <>En una parcela, la casa ocupa <F n={3} d={5} />, el jardín la tercera parte y el resto es piscina. El jardín tiene 75 m². ¿Cuántos m² tiene la parcela?</>, [<>El jardín es <F n={1} d={3} /> de la parcela: la parcela es 3 · 75.</>], 225, 'act'),
  prob('28b', <>En esa parcela de 225 m², ¿cuántos m² ocupa la casa (<F n={3} d={5} />)?</>, ['225 : 5 · 3.'], 135, 'act'),
  prob('28c', <>¿Y cuántos m² tiene la piscina?</>, ['Lo que sobra: 225 − 135 − 75.'], 15, 'act'),
  fracQ({ parada: P4, hoja: 'act', etq: '34a', enunciado: <>Un grifo da <F n={7} d={4} /> de litro por minuto, otro <F n={23} d={16} /> y un tercero <F n={121} d={36} />. ¿Cuántos litros por minuto dan los tres juntos?</>, pistas: ['Súmalos con común denominador: m.c.m.(4, 16, 36) = 144.', <><F n={252} d={144} /> + <F n={207} d={144} /> + <F n={484} d={144} />.</>] }, fr(943, 144)),
  prob('34b', <>Los tres grifos juntos dan <F n={943} d={144} /> litros por minuto. ¿Cuántos minutos tardan en llenar un depósito de 6601 litros?</>, [<>6601 : <F n={943} d={144} /> = 6601 · 144 : 943.</>, '6601 : 943 = 7.'], 1008, 'act'),
  fracQ({ parada: P4, hoja: 'prob', etq: 'F5a', enunciado: <>Andrés se comió <F n={1} d={5} /> de los bombones de una caja y Ana <F n={1} d={2} />. ¿Qué fracción de la caja se comieron entre los dos?</>, pistas: [<><F n={1} d={5} /> + <F n={1} d={2} />.</>] }, fr(7, 10)),
  prob('F5b', <>Si quedaron 12 bombones (lo que no se comieron, <F n={3} d={10} />), ¿cuántos tenía la caja?</>, [<><F n={3} d={10} /> de la caja son 12 bombones: <F n={1} d={10} /> son 4.</>]  , 40),
  prob('F6a', <>Antonio lleva <F n={5} d={7} /> del camino al instituto y le quedan 300 m. ¿Cuántos metros mide el camino?</>, [<>Le quedan <F n={2} d={7} />, que son 300 m: <F n={1} d={7} /> son 150 m.</>], 1050),
  prob('F6b', <>¿Y cuántos metros lleva recorridos?</>, ['5 · 150.'], 750),
  ...(
    [
      ['F8a', 'A', 3, 11, 210],
      ['F8b', 'B', 3, 10, 231],
      ['F8c', 'C', 5, 14, 275],
    ] as const
  ).map(([etq, c, n, d, r]) => prob(etq, <>En unas elecciones con 770 votos, el candidato {c} obtuvo <F n={n} d={d} /> de los votos. ¿Cuántos votos tuvo?</>, [<>770 : {d} · {n}.</>], r)),
  prob('F8d', <>Con 770 votos, A tuvo 210, B 231 y C 275. ¿Cuántos tuvo D, que se llevó el resto?</>, ['770 − 210 − 231 − 275.'], 54),
  prob('F9', <>Hace unos años Pedro tenía 24 años, que son <F n={2} d={3} /> de su edad actual. ¿Qué edad tiene?</>, [<><F n={2} d={3} /> son 24: <F n={1} d={3} /> son 12.</>], 36),
  prob('F10a', <>Tres hermanas se reparten un premio: Luisa <F n={1} d={4} />, María <F n={1} d={3} /> y Eva se lleva 500 €. ¿De cuánto era el premio (en €)?</>, [<>Luisa y María: <F n={1} d={4} /> + <F n={1} d={3} /> = <F n={7} d={12} />. Eva: <F n={5} d={12} />.</>, <><F n={5} d={12} /> son 500 €: <F n={1} d={12} /> son 100 €.</>], 1200),
  prob('F10b', <>Del premio de 1200 €, ¿cuánto se lleva Luisa (<F n={1} d={4} />)?</>, ['1200 : 4.'], 300),
  prob('F10c', <>¿Y María (<F n={1} d={3} />)?</>, ['1200 : 3.'], 400),
  prob('F11a', <>Alicia tiene 300 €. El jueves gasta <F n={2} d={5} /> y el sábado <F n={3} d={4} /> de lo que le quedaba. ¿Cuánto gastó el jueves?</>, ['300 : 5 · 2.'], 120),
  prob('F11b', <>¿Cuánto gastó el sábado (<F n={3} d={4} /> de lo que le quedaba)?</>, ['Le quedaban 300 − 120 = 180 €.', '180 : 4 · 3.'], 135),
  prob('F11c', <>¿Cuánto le queda al final?</>, ['180 − 135.'], 45),
  prob('F12', <>Me gasté <F n={1} d={5} /> de mi dinero en el cine y <F n={1} d={3} /> en la cena, y me quedaron 7 €. ¿Cuánto dinero tenía (en €)?</>, [<>Gasté <F n={1} d={5} /> + <F n={1} d={3} /> = <F n={8} d={15} />; me queda <F n={7} d={15} />.</>, <><F n={7} d={15} /> son 7 €: <F n={1} d={15} /> es 1 €.</>], 15),
  prob('G1a', <>Raquel se ha gastado <F n={3} d={10} /> de su dinero en un cómic y le quedan 21 €. ¿Cuánto tenía (en €)?</>, [<>Le quedan <F n={7} d={10} />, que son 21 €.</>], 30),
  prob('G1b', <>¿Cuánto le costó el cómic?</>, ['30 − 21.'], 9),
  prob('G2', <>Una familia gasta <F n={2} d={5} /> de su presupuesto en vivienda y <F n={1} d={3} /> en comida. Si en vivienda gasta 5400 € al año, ¿cuánto gasta en comida?</>, [<><F n={2} d={5} /> son 5400: el presupuesto es 5400 : 2 · 5 = 13 500 €.</>, '13 500 : 3.'], 4500),
  prob('G5', <>De un depósito lleno se sacan primero <F n={2} d={3} /> del total y después <F n={1} d={5} /> del total. Quedan 400 litros. ¿Qué capacidad tiene?</>, [<>Se han sacado <F n={2} d={3} /> + <F n={1} d={5} /> = <F n={13} d={15} />; queda <F n={2} d={15} />.</>, <><F n={2} d={15} /> son 400 L.</>], 3000),
  fracQ({ parada: P4, hoja: 'prob', etq: 'G6a', enunciado: <>Jacinto se come <F n={2} d={7} /> de una tarta y Gabriela <F n={3} d={5} /> del resto. ¿Qué fracción de la tarta se ha comido Gabriela?</>, pistas: [<>El resto es <F n={5} d={7} />.</>, <><F n={3} d={5} /> de <F n={5} d={7} /> = <F n={3} d={5} /> · <F n={5} d={7} />.</>] }, fr(3, 7)),
  fracQ({ parada: P4, hoja: 'prob', etq: 'G6b', enunciado: <>¿Qué fracción de la tarta queda?</>, pistas: [<>1 − <F n={2} d={7} /> − <F n={3} d={7} />.</>] }, fr(2, 7)),
  prob('G7', <>Aurora sale con 25 €. Se gasta <F n={2} d={5} /> en un libro y <F n={4} d={5} /> de lo que le quedaba en un disco. ¿Con cuánto vuelve a casa (en €)?</>, ['Libro: 10 €; le quedan 15 €.', 'Disco: 15 : 5 · 4 = 12 €.'], 3),
  prob('G8', <>Un vendedor vende por la mañana <F n={3} d={4} /> de sus naranjas y por la tarde <F n={4} d={5} /> de las que le quedaban. Le sobran 100 kg. ¿Cuántos kilos tenía?</>, [<>Tras la mañana queda <F n={1} d={4} />; por la tarde vende <F n={4} d={5} /> de eso, y sobra <F n={1} d={5} /> de <F n={1} d={4} /> = <F n={1} d={20} />.</>, <><F n={1} d={20} /> son 100 kg.</>], 2000),
  prob('G9', <>Pasando un escrito a ordenador, el primer día pasé <F n={1} d={4} />, el segundo <F n={1} d={3} /> de lo restante, el tercero <F n={1} d={6} /> de lo que faltaba y el cuarto terminé con 30 folios. ¿Cuántos folios tenía?</>, [<>Tras el 1.º falta <F n={3} d={4} />; el 2.º pasa <F n={1} d={4} /> y falta <F n={1} d={2} />; el 3.º pasa <F n={1} d={12} /> y falta <F n={5} d={12} />.</>, <><F n={5} d={12} /> son 30 folios.</>], 72),
  prob('G10', <>Un propietario vendió <F n={3} d={7} /> de un solar, luego la mitad de lo restante, y le quedaron 244 m². ¿Qué superficie tenía el solar?</>, [<>Quedan <F n={4} d={7} />; vende la mitad, <F n={2} d={7} />; sobran <F n={2} d={7} />.</>, <><F n={2} d={7} /> son 244 m².</>], 854),
  prob('H1', <>En una mezcla de tres vinos, el primero es <F n={2} d={7} /> del total, el segundo <F n={4} d={9} /> y del tercero hay 34 litros. ¿Cuántos litros tiene la mezcla?</>, [<><F n={2} d={7} /> + <F n={4} d={9} /> = <F n={46} d={63} />; el tercero es <F n={17} d={63} />.</>, <><F n={17} d={63} /> son 34 L.</>], 126),
  decQ({ parada: P4, hoja: 'prob', etq: 'H2', enunciado: <>Una persona con 595 € pierde primero <F n={2} d={9} /> del total y después <F n={3} d={20} /> de lo que le quedaba. ¿Cuántos euros tiene ahora? (con dos decimales)</>, pistas: [<>Le queda <F n={7} d={9} /> de 595 y luego <F n={17} d={20} /> de eso.</>, <>595 · <F n={7} d={9} /> · <F n={17} d={20} /> ≈ 393,36.</>] }, 393.36, 0.011, '€'),
  prob('H4', <>Los <F n={1} d={5} /> más los <F n={3} d={10} /> más los <F n={5} d={49} /> de la fortuna de una persona son 5900 €. ¿Cuál es su fortuna?</>, [<><F n={1} d={5} /> + <F n={3} d={10} /> + <F n={5} d={49} /> = <F n={59} d={98} />.</>, <>5900 : <F n={59} d={98} /> = 5900 · 98 : 59.</>], 9800),
  prob('H5', <>Los <F n={2} d={3} /> más los <F n={3} d={4} /> de un número suman 340. ¿Cuál es el número?</>, [<><F n={2} d={3} /> + <F n={3} d={4} /> = <F n={17} d={12} />.</>, <>340 : <F n={17} d={12} />.</>], 240),
  prob('H6', <>Una cuba de vino se llenó hasta la mitad. Después de sacar <F n={3} d={5} /> de su contenido quedaron 36 litros. ¿Qué capacidad tiene la cuba?</>, [<>Queda <F n={2} d={5} /> de la mitad: <F n={1} d={5} /> de la cuba.</>, <><F n={1} d={5} /> son 36 L.</>], 180),
  prob('7', <>Daniela gasta <F n={3} d={7} /> de su dinero en libros y <F n={1} d={3} /> del resto en un bocadillo. Le quedan 8 €. ¿Cuánto llevaba?</>, [<>Tras los libros queda <F n={4} d={7} />; el bocadillo, <F n={1} d={3} /> de eso, y queda <F n={8} d={21} />.</>, <><F n={8} d={21} /> son 8 €.</>], 21, 'con'),
  prob('10', <>De los músicos de una banda, <F n={1} d={5} /> tocan percusión. De los que quedan, la mitad tocan cuerda, y los 8 restantes, viento. ¿Cuántos músicos hay?</>, [<>Quedan <F n={4} d={5} />; la mitad (<F n={2} d={5} />) cuerda y la otra mitad (<F n={2} d={5} />) viento.</>, <><F n={2} d={5} /> son 8 músicos.</>], 20, 'auto'),
]

// Plantillas de combinadas para los ejercicios nuevos: los huecos se llenan con fracciones al azar.
const PLANTILLAS = ['a - b · c', '(a + b) · c', 'a : (b - c)', 'a + b : c - d', '(a - b) : (c + d)', 'a · (b + c) - d', '(a)^2 - b · c', 'a - [b - (c + d)]', '(a + b)^2 : c']
export function nuevaCombinadas2(): Pregunta {
  for (;;) {
    const e = azar(PLANTILLAS).replace(/[abcd]/g, () => {
      const x = fr(entre(1, 7), azar([1, 2, 3, 4, 5, 6]))
      return texto(x)
    })
    try {
      const r = calcularFr(e)
      if (Math.abs(r.n) <= 400 && r.d <= 200) return opQ({ parada: '', hoja: 'act', etq: '' }, e)
    } catch {
      // División entre 0: se prueba otra.
    }
  }
}

// ===================================================================================================
// Parada 5 · Expresión decimal y fraccionaria
// ===================================================================================================

const P5 = 'decimales'
const TIPOS = ['Decimal exacto', 'Periódico puro', 'Periódico mixto']

function tipoQ(hoja: Hoja, etq: string, n: number, d: number): Pregunta {
  return opcQ({ parada: P5, hoja, etq, enunciado: <>Pasa a decimal <Grande><F n={n} d={d} /></Grande> e indica de qué tipo es.</>, pistas: pistasDecimal(n, d) }, TIPOS, NOMBRE_TIPO[tipoDe(expansion(n, d))])
}
function periodoQ(hoja: Hoja, etq: string, n: number, d: number): Pregunta {
  const x = expansion(n, d)
  return numQ({ parada: P5, hoja, etq, enunciado: <>¿Cuál es el período de <Grande><F n={n} d={d} /></Grande> en forma decimal?</>, pistas: pistasDecimal(n, d), acierto: <>Correcto: <TextoMat s={escribirDecimal(x)} />.</> }, Number(x.per))
}
function generatrizQ(hoja: Hoja, etq: string, ent: number, ante: string, per: string): Pregunta {
  return fracQ({ parada: P5, hoja, etq, enunciado: <>Calcula la fracción generatriz (irreducible) de <Grande><NombreDec ent={ent} ante={ante} per={per} /></Grande></>, pistas: pistasGeneratriz(ent, ante, per) }, generatriz(ent, ante, per).f)
}

export const DECIMALES: Pregunta[] = [
  tipoQ('act', '19a', 16, 11),
  periodoQ('act', '19a2', 16, 11),
  tipoQ('act', '19b', 26, 5),
  tipoQ('act', '19c', 7, 6),
  periodoQ('act', '19c2', 7, 6),
  tipoQ('act', '19d', 3, 8),
  tipoQ('act', '24a', 7, 5),
  tipoQ('act', '24b', 5, 6),
  tipoQ('act', '24c', 2, 3),
  tipoQ('act', '24d', 7, 4),
  ...(
    [
      ['3a', 1, 5],
      ['3b', 2, 11],
      ['3c', 7, 9],
      ['3d', 3, 2],
      ['3e', 7, 3],
      ['3f', 11, 90],
      ['3g', 13, 9],
      ['3h', 91, 75],
      ['3i', 1, 8],
    ] as const
  ).map(([etq, n, d]) => tipoQ('con', etq, n, d)),
  generatrizQ('act', '18a', 3, '15', ''),
  generatrizQ('act', '18b', 0, '', '4'),
  generatrizQ('act', '18c', 2, '5', '1'),
  generatrizQ('act', '18d', 0, '77', '2'),
  generatrizQ('auto', '6a', 9, '25', ''),
  generatrizQ('auto', '6b', 12, '', '36'),
  generatrizQ('auto', '6c', 1, '19', '4'),
  generatrizQ('con', '4a', 2, '', '5'),
  generatrizQ('con', '4b', 5, '4', ''),
  generatrizQ('con', '4c', 0, '145', ''),
  generatrizQ('con', '4g', 12, '04', ''),
  generatrizQ('con', '4h', 0, '7', '16'),
  generatrizQ('con', '4i', 6, '', '9'),
  decQ({ parada: P5, hoja: 'act', etq: '20a', enunciado: <>Expresión decimal de <Grande><F n={5} d={4} /></Grande></>, pistas: ['5 : 4.'] }, 1.25),
  numQ({ parada: P5, hoja: 'act', etq: '20b', enunciado: <>¿Cuál es el período de <Grande><F n={13} d={12} /></Grande>?</>, pistas: pistasDecimal(13, 12) }, 3),
  fracQ({ parada: P5, hoja: 'act', etq: '20c', enunciado: <>¿De qué fracción viene <Grande><Per ent="3" per="1" /></Grande>?</>, pistas: pistasGeneratriz(3, '', '1') }, fr(28, 9)),
  fracQ({ parada: P5, hoja: 'act', etq: '20d', enunciado: <>¿De qué fracción viene <Grande><Per ent="0" per="5" /></Grande>?</>, pistas: pistasGeneratriz(0, '', '5') }, fr(5, 9)),
  ...(
    [
      ['21a', 'Si la parte decimal no periódica de un número es 3 y su período 13, el número es periódico puro.', 'Falsa', 'Si hay parte que no se repite (anteperíodo), es periódico mixto.'],
      ['21b', 'Si el período está formado por dos cifras iguales, se puede decir que el período es un número de una cifra.', 'Verdadera', '0,3333… tiene período «33», que es lo mismo que «3».'],
      ['21c', 'Si la parte decimal no periódica es igual al período, el número es periódico puro.', 'Verdadera', 'Por ejemplo 0,3(3) = 0,333… = 0,(3): en realidad no hay anteperíodo.'],
      ['21d', 'Si el período tiene tres cifras y las dos últimas coinciden, se puede decir que el período es de dos cifras.', 'Falsa', 'Por ejemplo, el período 122 (0,122122…) no se puede escribir con dos cifras.'],
    ] as const
  ).map(([etq, frase, c, pista]) => opcQ({ parada: P5, hoja: 'act', etq, enunciado: <>¿Verdadera o falsa? {frase}</>, pistas: [pista] }, VF, c)),
  ordQ(
    { parada: P5, hoja: 'act', etq: '22', enunciado: <>Ordena de mayor a menor, pasándolos antes a decimal.</>, pistas: ['2/9 = 0,222…; 1/5 = 0,2; −2/3 = −0,666…; 1/2 = 0,5; −1/3 = −0,333…', 'Primero los positivos, del más grande al más pequeño; luego los negativos, del más cercano a 0 al más lejano.'] },
    [
      ['2/9', 2 / 9],
      ['0,4', 0.4],
      ['1/5', 0.2],
      ['−0,2', -0.2],
      ['−2/3', -2 / 3],
      ['1/2', 0.5],
      ['−1/3', -1 / 3],
      ['0,13', 0.13],
    ],
    '>',
  ),
  opcQ({ parada: P5, hoja: 'act', etq: '23a', enunciado: <>El período del número 0,020220220220… es:</>, pistas: ['Busca qué grupo de cifras se repite una y otra vez.', 'Después del primer 0 decimal se repite «202»: 0,0 202 202 202…'] }, ['No es periódico', '02', '202', '2022'], '202'),
  opcQ(
    { parada: P5, hoja: 'act', etq: '23b', enunciado: <>La fracción de 3,9545454… es:</>, pistas: ['Es 3,9(54): anteperíodo 9 y período 54.', '(3954 − 39) / 990 = 3915/990. Ninguna de las opciones lo dice así.'] },
    ['3 + 954/900', '3954/990', '3 + (954 − 9)/900', 'Ninguna de las anteriores'],
    'Ninguna de las anteriores',
  ),
  ...(
    [
      ['1a', '23,6666…', 'Periódico puro', '6'],
      ['1b', '24,5', 'Decimal exacto', ''],
      ['1c', '12,73333…', 'Periódico mixto', '3'],
      ['1d', '127,135', 'Decimal exacto', ''],
      ['1e', '2,4656565…', 'Periódico mixto', '65'],
      ['1f', '−12,4535353…', 'Periódico mixto', '53'],
    ] as const
  ).flatMap(([etq, numero, tipo, per]) => [
    opcQ({ parada: P5, hoja: 'con', etq, enunciado: <>¿De qué tipo es el número {numero}?</>, pistas: ['¿Se repite algo? ¿Empieza a repetirse justo después de la coma?'] }, TIPOS, tipo),
    ...(per ? [numQ({ parada: P5, hoja: 'con', etq: etq + '2', enunciado: <>¿Cuál es el período de {numero}?</>, pistas: ['Las cifras que se repiten sin fin.'] }, Number(per))] : []),
  ]),
  ...(
    [
      ['26a', 'Parte entera 2, período 35, anteperíodo 8', '2,8(35)', ['2,35(8)', '2,(835)', '8,2(35)']],
      ['26b', 'Anteperíodo 40, parte entera 0, período 7', '0,40(7)', ['0,7(40)', '0,(407)', '40,(7)']],
      ['26c', 'Anteperíodo 152, período 87, parte entera 6', '6,152(87)', ['6,87(152)', '152,6(87)', '6,(15287)']],
    ] as const
  ).map(([etq, datos, c, otras]) => opcQ({ parada: P5, hoja: 'h1', etq, enunciado: <>¿Qué número tiene estos datos? {datos}.</>, pistas: ['Se escribe: parte entera, coma, anteperíodo y el período con el arco encima.'] }, barajar([c, ...otras]), c)),
  fracQ({ parada: P5, hoja: 'con', etq: '5a', enunciado: <>Calcula pasando antes el decimal a fracción: 1 + <Per ent="3" per="5" /></>, pistas: [<><Per ent="3" per="5" /> = <F n={32} d={9} />.</>, <>1 + <F n={32} d={9} />.</>] }, fr(41, 9)),
]

export function nuevaDecimales(): Pregunta {
  const b = { parada: '', hoja: 'act' as const, etq: '' }
  if (Math.random() < 0.5) {
    const d = azar([2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 15, 18, 20, 25, 30, 45])
    const n = entre(1, 2 * d)
    if (n % d === 0) return nuevaDecimales()
    return opcQ({ ...b, enunciado: <>Pasa a decimal <Grande><F n={n} d={d} /></Grande> e indica de qué tipo es.</>, pistas: pistasDecimal(n, d) }, TIPOS, NOMBRE_TIPO[tipoDe(expansion(n, d))])
  }
  const ent = entre(0, 12)
  const tipo = azar(['exacto', 'puro', 'mixto'] as const)
  const cifras = (k: number) => Array.from({ length: k }, () => entre(0, 9)).join('')
  const per = tipo === 'exacto' ? '' : cifras(entre(1, 2))
  const ante = tipo === 'puro' ? '' : cifras(entre(1, 2))
  if (per && /^(\d)\1*$/.test(per) && per.length > 1) return nuevaDecimales()
  if (tipo === 'exacto' && ante.endsWith('0')) return nuevaDecimales()
  if (per === '9' || (tipo === 'mixto' && ante.slice(-1) === per.slice(-1))) return nuevaDecimales()
  return fracQ({ ...b, enunciado: <>Calcula la fracción generatriz (irreducible) de <Grande><NombreDec ent={ent} ante={ante} per={per} /></Grande></>, pistas: pistasGeneratriz(ent, ante, per) }, generatriz(ent, ante, per).f)
}

// ===================================================================================================
// Parada 6 · Aproximaciones y errores
// ===================================================================================================

const P6 = 'aproximar'
const num = (s: string) => Number(s.replace(',', '.'))
const EXC = ['Por exceso', 'Por defecto']

function truncQ(hoja: Hoja, etq: string, s: string, cifras: number) {
  const r = truncar(s, cifras)
  return decQ({ parada: P6, hoja, etq, enunciado: <>Aproxima {s} a las {nombreOrden(cifras)} por truncamiento.</>, pistas: [`Las ${nombreOrden(cifras)} son la ${cifras}.ª cifra decimal.`, 'Truncar es cortar: te quedas con las cifras hasta ahí y quitas todas las demás, sin mirar cuáles son.', `Queda ${r}.`] }, num(r))
}
function redQ(hoja: Hoja, etq: string, s: string, cifras: number, conExceso = true): Pregunta[] {
  const { r, decide, exceso } = redondear(s, cifras)
  const base = { parada: P6, hoja }
  return [
    decQ({ ...base, etq, enunciado: <>Redondea {s} a las {nombreOrden(cifras)}.</>, pistas: [`Mira la primera cifra que vas a quitar: es un ${decide}.`, decide >= 5 ? 'Como es 5 o más, se suma uno a la última cifra que queda.' : 'Como es menor que 5, se deja como está: es igual que truncar.', `Queda ${r}.`] }, num(r)),
    ...(conExceso
      ? [opcQ({ ...base, etq: etq + '2', enunciado: <>Al redondear {s} a las {nombreOrden(cifras)} sale {r}. ¿Es una aproximación por exceso o por defecto?</>, pistas: ['Compara: si el valor aproximado es mayor que el exacto, es por exceso; si es menor, por defecto.'] }, EXC, exceso ? EXC[0] : EXC[1])]
      : []),
  ]
}

function errorQ(hoja: Hoja, etq: string, exacto: Fr, nombreExacto: ReactNode, aprox: string): Pregunta[] {
  const { eabs, erel } = errores(exacto, decimalAFr(aprox))
  const ea = valorDe(eabs)
  const pc = valorDe(erel) * 100
  return [
    decQ({ parada: P6, hoja, etq, enunciado: <>Valor real {nombreExacto}, valor aproximado {aprox}. Calcula el error absoluto.</>, pistas: ['Error absoluto = |valor exacto − valor aproximado|: la diferencia, siempre positiva.', <>Valor exacto ≈ {conComa(valorDe(exacto), 5)}. La diferencia es {conComa(ea, 5)}.</>] }, Number(ea.toFixed(5)), Math.max(0.0005, ea * 0.01)),
    decQ({ parada: P6, hoja, etq: etq + '2', enunciado: <>En la misma aproximación ({aprox} en lugar de {nombreExacto}), calcula el error relativo en porcentaje (con dos decimales).</>, pistas: ['Error relativo = error absoluto : valor exacto, y luego por 100 para el porcentaje.', <>{conComa(ea, 5)} : {conComa(valorDe(exacto), 5)} · 100 ≈ {conComa(pc, 2)} %.</>] }, Number(pc.toFixed(2)), 0.06, '%'),
  ]
}
const conComa = (x: number, c: number) => Number(x.toFixed(c)).toString().replace('.', ',')

export const APROXIMAR: Pregunta[] = [
  truncQ('act', '14a', '18,71493', 3),
  truncQ('act', '14b', '0,078041', 3),
  truncQ('act', '14c', '4,6547', 3),
  truncQ('act', '14d', '25,69831', 3),
  ...redQ('act', '15a', '7,3456', 2),
  ...redQ('act', '15b', '16,4321', 2),
  ...redQ('act', '15c', '2,1372', 2),
  ...redQ('act', '15d', '6,3957', 2),
  ...(
    [
      ['16a', 6, 14],
      ['16b', 9, 12],
      ['16c', 12, 11],
      ['16d', 5, 9],
    ] as const
  ).flatMap(([etq, n, d]) => {
    const v = (n / d).toFixed(6)
    return [1, 0].map((c) =>
      decQ(
        {
          parada: P6,
          hoja: 'act',
          etq: etq + (c ? 'd' : 'e'),
          enunciado: <>Redondea <F n={n} d={d} /> {c ? 'a las décimas' : 'al entero'}.</>,
          pistas: [<>Primero pásala a decimal: {n} : {d} ≈ {v.replace('.', ',')}.</>, `Mira la primera cifra que quitas: si es 5 o más, sube la última que queda.`],
        },
        num(redondear(v.replace('.', ','), c).r),
      ),
    )
  }),
  ...errorQ('act', '17a', fr(18, 8), <F n={18} d={8} />, '2,2'),
  ...errorQ('act', '17b', fr(19, 16), <F n={19} d={16} />, '1,18'),
  ...errorQ('h1', '32', fr(7, 3), <Per ent="2" per="3" />, '2,3'),
  decQ({ parada: P6, hoja: 'h1', etq: '33', enunciado: <>Al medir un listón de 5,567 m se comete un error relativo de 0,03. ¿Qué error absoluto se ha cometido (en metros)?</>, pistas: ['Error relativo = error absoluto : valor exacto, así que error absoluto = error relativo · valor exacto.', '0,03 · 5,567.'] }, 0.16701, 0.0006, 'm'),
  ...(
    [
      ['7a', '3,55877'],
      ['7b', '0,35621'],
      ['7c', '2,0624'],
      ['7d', '11,0230'],
      ['7e', '19,195'],
      ['7f', '21,2121'],
    ] as const
  ).flatMap(([etq, s]) => redQ('auto', etq, s, 2)),
  ...redQ('auto', '8', '2,25', 1, false),
  ...errorQ('auto', '8b', fr(9, 4), '2,25', '2,3'),
]

export function nuevaAproximar(): Pregunta {
  const b = { hoja: 'act' as const }
  const entero = entre(0, 40)
  const dec = Array.from({ length: entre(4, 5) }, () => entre(0, 9)).join('')
  const s = `${entero},${dec}`
  const cifras = entre(1, 3)
  const tipo = azar(['truncar', 'redondear', 'redondear', 'error'] as const)
  if (tipo === 'truncar') return { ...truncQ(b.hoja, '', s, cifras), id: '' }
  // Error: se aproxima redondeando y se piden los errores.
  if (tipo === 'redondear') return { ...azar(redQ(b.hoja, '', s, cifras)), id: '' }
  const aprox = redondear(s, cifras).r
  if (aprox === s || num(s) === 0) return nuevaAproximar()
  return { ...azar(errorQ(b.hoja, '', decimalAFr(s), s, aprox)), id: '' }
}

// ---------- Para el mapa y la prueba ----------

export const BANCOS2 = {
  fracciones: { clase: FRACCIONES, generar: nuevaFracciones },
  comparar: { clase: COMPARAR, generar: nuevaComparar },
  operaciones: { clase: OPERACIONES, generar: nuevaOperaciones },
  combinadas: { clase: COMBINADAS2, generar: nuevaCombinadas2 },
  decimales: { clase: DECIMALES, generar: nuevaDecimales },
  aproximar: { clase: APROXIMAR, generar: nuevaAproximar },
}
// La autoevaluación del libro, preferida para el examen.
for (const b of Object.values(BANCOS2)) (b as { examen?: Pregunta[] }).examen = b.clase.filter((x) => x.grupo === HOJA.auto)

export const IDS2: Record<string, string[]> = Object.fromEntries(Object.entries(BANCOS2).map(([k, v]) => [k, v.clase.map((x) => x.id)]))

/** Para Desmenuzar y para comprobar en las pruebas automáticas. */
export const mixtoDe = mixto
export { tx }
