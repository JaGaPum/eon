// Contenido del Tema 3 (Potencias y raíces): los ejercicios de las hojas del profesor («Ejercicios tema 3», «Ejercicios
// notación científica», «Problemas: potencias» y «Problemas: raíces»), repartidos por paradas, y los generadores de
// ejercicios nuevos. Las soluciones las calcula el motor (src/lib/potencias.ts y src/lib/exprFr.ts).
//
// Fuera, porque el dato no cuadra o no se lee: el 9c, 10, 11, 14, 17 (menos el c), 20, 26, 33, 35, 36d, 36e y 40a de
// la hoja del tema; el 11 y el 12 de «Problemas: potencias» y el de Plutón de la hoja de notación científica (sus datos
// están muy lejos de los reales). Los de las fotos borrosas tienen ejercicios parecidos con otros números.
import type { ReactNode } from 'react'
import type { Entrada, Pregunta } from '../componentes/Respuesta'
import { F } from '../componentes/mat'
import { ExprFr, Op } from '../componentes/fraccionesUI'
import { calcularFr, resolverFr } from '../lib/exprFr'
import { fr, texto, type Fr } from '../lib/fracciones'
import {
  aCientifica,
  analizarP,
  clavePot,
  cuadradoSiguiente,
  escribirCientifica,
  escribirPot,
  limpio,
  menos,
  operarCientifica,
  potencia,
  primosDe,
  raizEntera,
  signoPotencia,
  sumarCientifica,
  sup,
  todasLasCifras,
  ultimaCifraCuadrado,
  unicaPotencia,
  type Cientifica,
  type NodoP,
} from '../lib/potencias'
import { azar, barajar, entre } from './tema2'

// ---------- Ayudas ----------

const HOJA = {
  h: 'Ejercicios tema 3',
  par: 'Parecidos a los de la hoja',
  nc: 'Ejercicios de notación científica',
  pp: 'Problemas de potencias',
  pr: 'Problemas de raíces',
} as const
type Hoja = keyof typeof HOJA

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
  return { id: b.parada ? `t3:${b.parada}:${b.hoja}-${b.etq}` : '', etq: b.etq, grupo: HOJA[b.hoja], enunciado: b.enunciado, entrada, correcta, pistas: b.pistas, acierto: b.acierto, fallo: b.fallo }
}
const numQ = (b: Base, n: number) => q(b, 'numero', String(n))
const opcQ = (b: Base, opciones: string[], correcta: string) => q(b, { opciones }, correcta)
const potQ = (b: Base, p: { b: { n?: Fr; letra?: string }; e: number }) => q(b, { potencia: true }, clavePot(p))
const cienQ = (b: Base, c: Cientifica, tol?: number, unidad?: string) => q(b, { cientifica: true, tol, unidad }, `${c.m}|${c.e}`)
const fracQ = (b: Base, f: Fr) => q(b, { fraccion: true, irreducible: true }, texto(f))
const decQ = (b: Base, x: number, tol?: number, unidad?: string) => q(b, { decimal: true, tol, unidad }, String(x))
const entQ = (b: Base, etiquetas: string[], vs: number[]) => q(b, { enteros: etiquetas }, vs.join('|'))

const Grande = ({ children }: { children: ReactNode }) => <span className="mx-1 inline-flex flex-wrap items-center text-2xl font-bold">{children}</span>
const coma = (x: number) => menos(String(limpio(x)).replace('.', ','))
const ent = (n: number) => menos(String(n))
const entP = (n: number) => (n < 0 ? `(${ent(n)})` : String(n))
const P = ({ b, e }: { b: number | string; e: number | string }) => (
  <span className="whitespace-nowrap">
    {typeof b === 'number' ? entP(b) : b}
    <sup className="text-[0.65em]">{menos(String(e))}</sup>
  </span>
)
/** Notación científica para leer: 2,18 · 10⁻⁵. */
export const Ci = ({ c }: { c: Cientifica }) => (
  <span className="whitespace-nowrap">
    {coma(c.m)} · 10<sup className="text-[0.65em]">{menos(String(c.e))}</sup>
  </span>
)

/** Una expresión con potencias como en el cuaderno: exponentes arriba y, si la hay, la raya de fracción. */
export function ExprP({ n }: { n: NodoP }): ReactNode {
  switch (n.t) {
    case 'base':
      if (n.letra) return <i>{n.letra}</i>
      if (n.n!.d !== 1)
        return (
          <span className="inline-flex items-center">
            (<F n={n.n!.n} d={n.n!.d} />)
          </span>
        )
      return <span>{entP(n.n!.n)}</span>
    case 'pow':
      return (
        <span className="whitespace-nowrap">
          {n.a.t === 'pow' ? (
            <>
              (<ExprP n={n.a} />)
            </>
          ) : (
            <ExprP n={n.a} />
          )}
          <sup className="text-[0.6em]">{menos(String(n.e))}</sup>
        </span>
      )
    case 'mul':
      return (
        <span className="inline-flex flex-wrap items-center">
          {n.fs.map((f, k) => (
            <span key={k} className="inline-flex items-center">
              {k > 0 && <span className="mx-1">·</span>}
              <ExprP n={f} />
            </span>
          ))}
        </span>
      )
    case 'div':
      if (n.barra)
        return (
          <span className="mx-1 inline-flex flex-col items-center align-middle">
            <span className="px-1">
              <ExprP n={n.a.t === 'grp' ? n.a.a : n.a} />
            </span>
            <span className="h-0.5 w-full rounded bg-current" />
            <span className="px-1">
              <ExprP n={n.b.t === 'grp' ? n.b.a : n.b} />
            </span>
          </span>
        )
      return (
        <span className="inline-flex flex-wrap items-center">
          <ExprP n={n.a} />
          <span className="mx-1">:</span>
          <ExprP n={n.b} />
        </span>
      )
    case 'grp':
      return (
        <span className="inline-flex items-center">
          (<ExprP n={n.a} />)
        </span>
      )
  }
}
export const Ep = ({ e }: { e: string }) => <ExprP n={analizarP(e)} />

// ===================================================================================================
// Parada 1 · Potencias y su signo
// ===================================================================================================

const P1 = 'signo'
const SIGNOS = ['Positivo', 'Negativo']

function pistasValor(b: number, e: number): ReactNode[] {
  const v = potencia(fr(b), e).n
  return [
    <>
      La base es {ent(b)} y el exponente {e}: se multiplica {ent(b)} por sí mismo {e} veces.
    </>,
    <>
      {Array.from({ length: e }, () => entP(b)).join(' · ')} = {ent(v)}
    </>,
    b < 0 ? (e % 2 === 0 ? 'Base negativa y exponente par: el resultado es positivo.' : 'Base negativa y exponente impar: el resultado es negativo.') : 'Base positiva: el resultado es positivo.',
  ]
}
const valorQ = (hoja: Hoja, etq: string, b: number, e: number) =>
  numQ({ parada: P1, hoja, etq, enunciado: <>Calcula el valor de la potencia <Grande><P b={b} e={e} /></Grande></>, pistas: pistasValor(b, e) }, potencia(fr(b), e).n)
const signoQ = (hoja: Hoja, etq: string, b: number, e: number) =>
  opcQ(
    {
      parada: P1,
      hoja,
      etq,
      enunciado: <>Sin hacer la operación, ¿qué signo tiene el resultado? <Grande><P b={b} e={e} /></Grande></>,
      pistas: [b < 0 ? <>La base es negativa: mira si el exponente, {e}, es par o impar.</> : 'La base es positiva.', 'Base negativa con exponente par → positivo; con exponente impar → negativo.'],
    },
    SIGNOS,
    signoPotencia(b, e) > 0 ? 'Positivo' : 'Negativo',
  )
const baseExpQ = (etq: string, b: number, e: number) =>
  q(
    {
      parada: P1,
      hoja: 'h',
      etq,
      enunciado: <>Identifica la base y el exponente de <Grande><P b={b} e={e} /></Grande></>,
      pistas: ['La base es el número que se multiplica (con su signo si va entre paréntesis); el exponente, el número pequeño de arriba: cuántas veces se multiplica.'],
      acierto: <>Además, como {b < 0 ? `la base es negativa y el exponente es ${e % 2 ? 'impar' : 'par'}` : 'la base es positiva'}, el resultado es {signoPotencia(b, e) > 0 ? 'positivo' : 'negativo'}: {ent(potencia(fr(b), e).n)}.</>,
    },
    { enteros: ['Base', 'Exponente'] },
    `${b}|${e}`,
  )
const productoQ = (hoja: Hoja, etq: string, b: number, e: number) =>
  potQ(
    {
      parada: P1,
      hoja,
      etq,
      enunciado: <>Expresa en forma de potencia: <Grande>{Array.from({ length: e }, () => entP(b)).join(' · ')}</Grande></>,
      pistas: ['¿Qué número se repite? Esa es la base (si es negativo, la base lleva el −).', <>¿Cuántas veces aparece? Ese es el exponente: {e}.</>],
    },
    { b: { n: fr(b) }, e },
  )
const vf = (b: Omit<Base, 'parada'>, cierto: boolean) => opcQ({ ...b, parada: P1 }, ['Verdadera', 'Falsa'], cierto ? 'Verdadera' : 'Falsa')

export const SIGNO: Pregunta[] = [
  baseExpQ('1a', -6, 5),
  baseExpQ('1b', -8, 3),
  baseExpQ('1c', 4, 6),
  baseExpQ('1d', -3, 2),
  productoQ('h', '2a', 6, 5),
  productoQ('h', '2b', 2, 8),
  productoQ('h', '2c', -1, 6),
  productoQ('h', '2d', -5, 3),
  ...(
    [
      ['3a', 3, 5],
      ['3b', -4, 3],
      ['3c', 5, 3],
      ['3d', -1, 7],
      ['3e', 2, 10],
      ['3f', -12, 2],
      ['3g', 3, 4],
      ['3h', -10, 4],
    ] as const
  ).map(([etq, b, e]) => valorQ('h', etq, b, e)),
  signoQ('h', '4a', -2, 3),
  signoQ('h', '4b', -6, 10),
  signoQ('h', '4c', -4, 8),
  signoQ('h', '4d', -1, 5),
  entQ(
    {
      parada: P1,
      hoja: 'h',
      etq: '5',
      enunciado: (
        <>
          Calcula <Grande><P b={-2} e={6} /></Grande> y <Grande>−2<sup className="text-[0.65em]">6</sup></Grande>. ¿Se obtiene el mismo resultado?
        </>
      ),
      pistas: [
        <>
          En (−2)<sup>6</sup> el paréntesis dice que la base es −2: (−2) · (−2) · (−2) · (−2) · (−2) · (−2).
        </>,
        <>
          En −2<sup>6</sup> no hay paréntesis: la base es 2 y el − se queda fuera: −(2 · 2 · 2 · 2 · 2 · 2).
        </>,
      ],
      acierto: 'No es lo mismo: el paréntesis decide si el − forma parte de la base.',
    },
    ['(−2)⁶', '−2⁶'],
    [potencia(fr(-2), 6).n, -potencia(fr(2), 6).n],
  ),
  ...(
    [
      ['6a', 3, 243],
      ['6c', -6, -216],
      ['6d', -3, -27],
    ] as const
  ).map(([etq, b, v]) => {
    const e = Array.from({ length: 12 }, (_, k) => k + 1).find((k) => potencia(fr(b), k).n === v)!
    return numQ(
      {
        parada: P1,
        hoja: 'h',
        etq,
        enunciado: <>¿Qué exponente falta? <Grande><P b={b} e="?" /> = {ent(v)}</Grande></>,
        pistas: [<>Ve multiplicando {entP(b)} por sí mismo hasta llegar a {ent(v)}, y cuenta las veces.</>, <>{Array.from({ length: e }, () => entP(b)).join(' · ')} = {ent(v)}</>],
      },
      e,
    )
  }),
  valorQ('h', '6b', -4, 5),
  potQ({ parada: P1, hoja: 'h', etq: '7a', enunciado: <>En la tabla, el resultado es −8. Escribe la potencia (de exponente mayor que 1).</>, pistas: ['¿Qué número multiplicado por sí mismo varias veces da 8? 2 · 2 · 2.', 'Para que salga negativo, la base tiene que ser negativa y el exponente impar.'] }, { b: { n: fr(-2) }, e: 3 }),
  valorQ('h', '7b', -3, 4),
  valorQ('h', '7c', -6, 4),
  valorQ('h', '7d', -1, 9),
  potQ({ parada: P1, hoja: 'h', etq: '7e', enunciado: <>En la tabla: (−5) × (−5) × (−5) = −125. Escribe la potencia.</>, pistas: ['La base es lo que se repite, −5, y el exponente, cuántas veces: 3.'] }, { b: { n: fr(-5) }, e: 3 }),
  potQ(
    {
      parada: P1,
      hoja: 'h',
      etq: '38',
      enunciado: <>En una papelería hay 4 estanterías con 8 baldas en cada una y, sobre cada balda, 16 libros. Expresa en forma de potencia (de base 2) el total de libros.</>,
      pistas: ['Total = 4 · 8 · 16.', <>4 = 2², 8 = 2³ y 16 = 2⁴.</>, <>2² · 2³ · 2⁴ = 2<sup>2+3+4</sup>.</>],
    },
    unicaPotencia('2^2*2^3*2^4').pot,
  ),
  vf({ hoja: 'h', etq: '39a', enunciado: <>¿Es cierta esta igualdad? <Grande><P b={-6} e={4} /> = −6<sup className="text-[0.65em]">4</sup></Grande></>, pistas: [<>(−6)⁴ = {potencia(fr(-6), 4).n} y −6⁴ = −{potencia(fr(6), 4).n}.</>] }, potencia(fr(-6), 4).n === -potencia(fr(6), 4).n),
  vf({ hoja: 'h', etq: '39b', enunciado: <>¿Es cierta esta igualdad? <Grande><P b={-3} e={5} /> = −3<sup className="text-[0.65em]">5</sup></Grande></>, pistas: [<>(−3)⁵ = {potencia(fr(-3), 5).n} y −3⁵ = −{potencia(fr(3), 5).n}: con exponente impar dan lo mismo.</>] }, potencia(fr(-3), 5).n === -potencia(fr(3), 5).n),
  vf({ hoja: 'h', etq: '39c', enunciado: <>¿Es cierta esta igualdad? <Grande>8 = <P b={-8} e={2} /></Grande></>, pistas: [<>(−8)² = (−8) · (−8) = {potencia(fr(-8), 2).n}.</>] }, potencia(fr(-8), 2).n === 8),
  vf({ hoja: 'h', etq: '40b', enunciado: <>¿Verdadero o falso? «Las potencias de base negativa y exponente par son siempre positivas».</>, pistas: ['Al multiplicar los negativos de dos en dos, cada pareja da positivo.'] }, true),
  // Problemas de potencias.
  numQ({ parada: P1, hoja: 'pp', etq: '1a', enunciado: <>El salón de actos de un centro es cuadrado y su lado mide 11 m. ¿Cuál es su área (en m²)?</>, pistas: ['El área de un cuadrado es lado · lado = lado².', '11² = 11 · 11.'] }, 11 ** 2),
  numQ({ parada: P1, hoja: 'pp', etq: '1b', enunciado: <>Si el salón tuviera 12 m de lado en vez de 11, ¿cuántos m² aumentaría su área?</>, pistas: ['12² − 11².', `${12 ** 2} − ${11 ** 2}.`] }, 12 ** 2 - 11 ** 2),
  numQ({ parada: P1, hoja: 'pp', etq: '3', enunciado: <>La cara de un cubo de madera tiene 40 cm de perímetro. ¿Cuál es su volumen (en cm³)?</>, pistas: ['La cara es un cuadrado: 4 lados iguales. Lado = 40 : 4 = 10 cm.', 'Volumen del cubo = lado³ = 10³.'] }, 10 ** 3),
  numQ({ parada: P1, hoja: 'pp', etq: '4', enunciado: <>Una parcela cuadrada tiene 100 m de lado. ¿Cuánto mide su superficie (en m²)?</>, pistas: ['100² = 100 · 100.'] }, 100 ** 2),
  numQ({ parada: P1, hoja: 'pp', etq: '5', enunciado: <>La plaza de una ciudad es cuadrada, de 100 m de lado. Si en cada m² caben 4 personas, ¿cuántas personas caben?</>, pistas: ['Superficie: 100² = 10 000 m².', '4 personas por cada m²: 10 000 · 4.'] }, 100 ** 2 * 4),
  numQ({ parada: P1, hoja: 'pp', etq: '6a', enunciado: <>Un edificio tiene forma de cubo de un hectómetro (100 m) de arista. ¿Cuántos m³ tiene?</>, pistas: ['Volumen = arista³ = 100³.', '100³ = 10⁶.'] }, 100 ** 3),
  numQ({ parada: P1, hoja: 'pp', etq: '6b', enunciado: <>En ese edificio cúbico de 100 m de arista, ¿cuál es la superficie de una fachada (en m²)?</>, pistas: ['Una fachada es un cuadrado de 100 m de lado.'] }, 100 ** 2),
]

export function nuevaSigno(): Pregunta {
  const b = azar([-9, -8, -7, -6, -5, -4, -3, -2, -1, 2, 3, 4, 5, 10, -10])
  const e = Math.abs(b) >= 7 ? entre(2, 3) : Math.abs(b) === 1 ? entre(5, 13) : entre(2, 5)
  const tipo = entre(0, 3)
  const vacio = { parada: '', hoja: 'h' as Hoja, etq: '' }
  if (tipo === 0) return { ...valorQ('h', '', b, e), id: '' }
  if (tipo === 1) return { ...signoQ('h', '', b, entre(2, 15)), id: '' }
  if (tipo === 2) return { ...productoQ('h', '', b, e), id: '' }
  // (−a)ⁿ frente a −aⁿ
  const a = entre(2, 5)
  const n = entre(2, 5)
  const conParen = Math.random() < 0.5
  return numQ(
    {
      ...vacio,
      enunciado: <>Calcula <Grande>{conParen ? <P b={-a} e={n} /> : <>−{a}<sup className="text-[0.65em]">{n}</sup></>}</Grande></>,
      pistas: conParen ? [<>Con paréntesis, la base es −{a}.</>, ...pistasValor(-a, n).slice(1)] : [<>Sin paréntesis, la base es {a} y el − se queda fuera: −({Array.from({ length: n }, () => a).join(' · ')}).</>],
    },
    conParen ? potencia(fr(-a), n).n : -potencia(fr(a), n).n,
  )
}

// ===================================================================================================
// Parada 2 · Propiedades (misma base, mismo exponente) y factores primos
// ===================================================================================================

const P2 = 'propiedades'

/** Pistas a partir de los pasos del motor. */
const pistasUnica = (e: string): ReactNode[] => {
  const r = unicaPotencia(e)
  return ['Mira si las potencias tienen la misma base (sumas o restas exponentes) o el mismo exponente (multiplicas o divides las bases). Una potencia de potencia multiplica los exponentes.', ...r.pasos.map((p, k) => <span key={k}>{p.porque} <b className="whitespace-nowrap">{p.linea}</b></span>)]
}
const unicaQ = (parada: string, hoja: Hoja, etq: string, e: string, texto2 = 'Escribe como una única potencia:') =>
  potQ({ parada, hoja, etq, enunciado: <>{texto2} <Grande><Ep e={e} /></Grande></>, pistas: pistasUnica(e) }, unicaPotencia(e).pot)

function pistasPrimos(e: string): ReactNode[] {
  const m = primosDe(e)
  return [
    'Descompón cada base en factores primos (6 = 2 · 3, 12 = 2² · 3…).',
    'Con las propiedades, junta las potencias de cada primo: misma base, se suman los exponentes; en la división, se restan.',
    <>Queda {[...m].map(([p, x]) => `${p}${x === 1 ? '' : sup(x)}`).join(' · ') || '1'}.</>,
  ]
}
const primosQ = (hoja: Hoja, etq: string, e: string, texto2 = 'Escribe como producto de potencias de factores primos y calcula:') => {
  const m = primosDe(e)
  if ([...m.values()].some((x) => x < 0)) throw new Error(`${e}: sale con exponentes negativos`)
  const v = [...m].reduce((t, [p, x]) => t * p ** x, 1)
  return q({ parada: P2, hoja, etq, enunciado: <>{texto2} <Grande><Ep e={e} /></Grande></>, pistas: pistasPrimos(e) }, { numeroOPotencias: true }, String(v))
}

export const PROPIEDADES: Pregunta[] = [
  ...(
    [
      ['8a', '2^4*2^2*2'],
      ['8b', '(-4)^7*(-4)^5'],
      ['8c', 'a^4*a^3*a^5'],
      ['8d', '(-2)^6*(-2)'],
      ['8e', '2^10:2^3'],
      ['8f', '(-2)^8:(-2)'],
      ['8g', '4^10:4^6'],
      ['8h', '(-3)^10:(-3)^10'],
      ['8i', '((-2)^3)^5'],
      ['8j', '(2^3)^3'],
      ['8k', '((-3)^5)^4'],
      ['8l', '((-5)^2)^5'],
    ] as const
  ).map(([etq, e]) => unicaQ(P2, 'h', etq, e)),
  unicaQ(P2, 'h', '9a', '(2^4*2^3*2^7)/(2^5*2^6)'),
  unicaQ(P2, 'h', '9b', '(x^3*(x^4)^2)/(x^6*x*x^2)'),
  q(
    { parada: P2, hoja: 'h', etq: '12a', enunciado: <>Resuelve usando las potencias y sus propiedades: <Grande><Ep e="(32*25*72)/(90*128)" /></Grande></>, pistas: [...pistasPrimos('(32*25*72)/(90*128)').slice(0, 2), '32 = 2⁵, 25 = 5², 72 = 2³ · 3², 90 = 2 · 3² · 5, 128 = 2⁷.', 'Arriba: 2⁸ · 3² · 5². Abajo: 2⁸ · 3² · 5. Se va todo menos un 5.'] },
    'numero',
    String(32 * 25 * 72 / (90 * 128)),
  ),
  fracQ({ parada: P2, hoja: 'h', etq: '12b', enunciado: <>Resuelve usando las potencias y sus propiedades: <Grande><Ep e="(512*625)/(10000*64)" /></Grande></>, pistas: ['512 = 2⁹, 625 = 5⁴, 10 000 = 2⁴ · 5⁴, 64 = 2⁶.', 'Arriba: 2⁹ · 5⁴. Abajo: 2¹⁰ · 5⁴.', 'Queda 1 / 2.'] }, fr(512 * 625, 10000 * 64)),
  ...(
    [
      ['13a', '2^4*5^4*3^4'],
      ['13b', '(-15)^9:(-3)^9'],
      ['13c', '25^2:5^2'],
      ['13d', '(-3)^6*(-2)^6*(-4)^6'],
    ] as const
  ).map(([etq, e]) => unicaQ(P2, 'h', etq, e, 'Expresa como única potencia:')),
  // Parecidos a los 10, 11 y 14 (en la hoja salen borrosos).
  primosQ('par', 'P1', '6^2*3^3*12^2'),
  primosQ('par', 'P2', '20^3:(25*8^2)'),
  primosQ('par', 'P3', '(2*3*7)^2'),
  primosQ('par', 'P4', '14^3'),
  primosQ('par', 'P5', '30^2'),
  primosQ('par', 'P6', '(2^2*3)^3*(2*3^2)', 'Simplifica con las propiedades y calcula:'),
  primosQ('par', 'P7', '(3*5^2)^2:(3*5)', 'Simplifica con las propiedades y calcula:'),
  numQ(
    {
      parada: P2,
      hoja: 'pp',
      etq: '8',
      enunciado: (
        <>
          Dos parcelas miden <P b={3} e={8} /> y <P b={3} e={4} /> m². Ángeles duda si la primera es el doble que la segunda. ¿Cuántas veces es mayor la primera que la segunda?
        </>
      ),
      pistas: ['«Cuántas veces» es dividir: 3⁸ : 3⁴.', 'Misma base: se restan los exponentes, 3⁴.', 'No es el doble: es 3⁴ = 81 veces mayor.'],
    },
    valorDe(unicaPotencia('3^8:3^4').pot),
  ),
  numQ(
    {
      parada: P2,
      hoja: 'pp',
      etq: '9',
      enunciado: (
        <>
          La masa del Sol es de unos 2 · 10<sup>30</sup> kg y la de Júpiter, de 2 · 10<sup>27</sup> kg. ¿Cuántas veces es mayor la masa del Sol?
        </>
      ),
      pistas: ['Divide: (2 · 10³⁰) : (2 · 10²⁷).', '2 : 2 = 1 y 10³⁰ : 10²⁷ = 10³.'],
    },
    10 ** 3,
  ),
  potQ(
    {
      parada: P2,
      hoja: 'pp',
      etq: '10',
      enunciado: (
        <>
          En un metro cúbico de aire hay del orden de 10<sup>25</sup> moléculas. ¿Cuántas habrá en 1 cm³? (Escríbelo como potencia de 10.)
        </>
      ),
      pistas: ['1 m = 100 cm = 10² cm, así que 1 m³ = (10²)³ cm³ = 10⁶ cm³.', '10²⁵ : 10⁶.'],
    },
    unicaPotencia('10^25:(10^2)^3').pot,
  ),
]
function valorDe(p: { b: { n?: Fr }; e: number }) {
  return potencia(fr(p.b.n!.n, p.b.n!.d), p.e).n
}

const BASES_PROP: (number | string)[] = [2, 3, 5, 7, -2, -3, -5, 'a', 'x']
const bt = (b: number | string) => (typeof b === 'number' ? (b < 0 ? `(${b})` : String(b)) : b)
export function nuevaPropiedades(): Pregunta {
  const b = bt(azar(BASES_PROP))
  const [m, n, k] = [entre(2, 9), entre(2, 9), entre(2, 6)]
  const plantillas = [
    `${b}^${m}*${b}^${n}`,
    `${b}^${m + n}:${b}^${n}`,
    `(${b}^${m})^${k}`,
    `${b}^${m}*${b}^${n}:${b}^${k}`,
    `(${b}^${m}*${b})^${k}`,
    `(${b}^${m}*${b}^${n})/(${b}^${k}*${b})`,
    `${azar([2, 3, 4])}^${m}*${azar([5, 3, 7])}^${m}`,
    (([x, y]) => `${bt(x)}^${m}:${y}^${m}`)(azar([[12, 2], [18, 3], [20, 4], [24, 3], [30, 5], [-12, 4]])),
  ]
  const e = azar(plantillas)
  return { ...unicaQ('', 'h', '', e), id: '' }
}

// ===================================================================================================
// Parada 3 · Exponente cero y negativo; potencias de fracciones
// ===================================================================================================

const P3 = 'negativos'

function pistasNeg(b: Fr, e: number): ReactNode[] {
  const v = potencia(b, e)
  const bb = b.d === 1 ? entP(b.n) : `(${texto(b)})`
  if (e === 0) return ['Todo número (menos el 0) elevado a 0 da 1.']
  return [
    'Un exponente negativo es la inversa: a⁻ⁿ = 1 / aⁿ.',
    <>
      {bb}
      {sup(e)} = 1 / {bb}
      {sup(-e)}
    </>,
    <>
      Queda <F n={v.n} d={v.d} />.
    </>,
  ]
}
const negQ = (hoja: Hoja, etq: string, b: number, e: number) =>
  fracQ({ parada: P3, hoja, etq, enunciado: <>Calcula: <Grande><P b={b} e={e} /></Grande></>, pistas: pistasNeg(fr(b), e) }, potencia(fr(b), e))

const opuestoQ = (etq: string, enunciado: ReactNode, pistas: ReactNode[], p: { b: { n: Fr }; e: number }) => potQ({ parada: P3, hoja: 'h', etq, enunciado, pistas }, p)

export const NEGATIVOS: Pregunta[] = [
  ...(
    [
      ['15a', 4, -3],
      ['15b', 2, -5],
      ['15c', 3, -10],
      ['15d', -3, -1],
      ['15e', -2, -2],
      ['15f', 5, 0],
      ['15g', -3, -7],
      ['15h', -3, 0],
    ] as const
  ).map(([etq, b, e]) => negQ('h', etq, b, e)),
  unicaQ(P3, 'h', '16a', '5^-2*5^0*5^5', 'Resuelve usando las propiedades (deja una única potencia):'),
  unicaQ(P3, 'h', '16b', '(-1)^-3*(-1)^2*(-1)', 'Resuelve usando las propiedades (deja una única potencia):'),
  unicaQ(P3, 'h', '16c', '2^3*2^-5*2^4', 'Resuelve usando las propiedades (deja una única potencia):'),
  unicaQ(P3, 'h', '16d', '2^-2*2^0', 'Resuelve usando las propiedades (deja una única potencia):'),
  unicaQ(P3, 'h', '17c', '(2^3*2^-5*2^4)/(2^-2*2^0)', 'Resuelve usando las propiedades (deja una única potencia):'),
  opuestoQ('18a', <>Escribe <Grande><F n={1} d={5} /></Grande> como una potencia de exponente negativo.</>, ['1/a = a⁻¹.'], { b: { n: fr(5) }, e: -1 }),
  opuestoQ('18b', <>Escribe <Grande><P b={2} e={-6} /></Grande> como potencia de una fracción con exponente positivo.</>, ['a⁻ⁿ = (1/a)ⁿ: se da la vuelta a la base y el exponente cambia de signo.'], { b: { n: fr(1, 2) }, e: 6 }),
  opuestoQ('18c', <>Escribe <Grande><F n={1} d={16} /></Grande> como potencia de base 2 con exponente negativo.</>, ['16 = 2⁴.', '1/2⁴ = 2⁻⁴.'], { b: { n: fr(2) }, e: -4 }),
  opuestoQ('18d', <>Escribe <Grande><span className="inline-flex flex-col items-center text-[0.85em] leading-tight"><span>1</span><span className="h-0.5 w-full bg-current" /><span>2<sup>5</sup></span></span></Grande> con un exponente negativo.</>, ['1/aⁿ = a⁻ⁿ.'], { b: { n: fr(2) }, e: -5 }),
  opuestoQ('18e', <>Escribe <Grande><P b={7} e={-3} /></Grande> como potencia de una fracción con exponente positivo.</>, ['7⁻³ = 1/7³ = (1/7)³.'], { b: { n: fr(1, 7) }, e: 3 }),
  opuestoQ('18f', <>Escribe <Grande><P b={9} e={-2} /></Grande> como potencia de una fracción con exponente positivo.</>, ['9⁻² = (1/9)².'], { b: { n: fr(1, 9) }, e: 2 }),
  // Parecidos al 20 y al 35 (en la hoja salen borrosos).
  ...(
    [
      ['P1', '5^-4*5^2*5'],
      ['P2', '2^-4:2^-8*2^3'],
      ['P3', '(7^2)^-3*7^-4*7'],
      ['P4', '(4^5*4^-3)^2'],
      ['P5', '(a^-2*a^6)^3'],
      ['P6', '11^-6:11^4'],
      ['P7', '((3^-2)^-2)^-2'],
      ['P8', 'x^6:(x^-1)^2*x^5'],
      ['P9', '(3^-3:3^-4)^5'],
      ['P10', '(5/7)^4*(5/7)^3*(5/7)^2'],
      ['P11', '(3/5)^8:(3/5)^3'],
      ['P12', '((3/4)^3)^2'],
      ['P13', '(2/5)^3:(2/5)^2*(2/5)'],
    ] as const
  ).map(([etq, e]) => unicaQ(P3, 'par', etq, e)),
]

export function nuevaNegativos(): Pregunta {
  if (Math.random() < 0.45) {
    const b = azar([2, 3, 4, 5, 10, -2, -3, -5])
    const e = Math.abs(b) >= 5 ? azar([-1, -2, -3, 0]) : azar([-1, -2, -3, -4, 0])
    return { ...negQ('h', '', b, e), id: '' }
  }
  const b = bt(azar([2, 3, 5, -2, 'a']))
  const [m, n] = [entre(2, 7), entre(2, 7)]
  const e = azar([`${b}^-${m}*${b}^${n}`, `${b}^${m}:${b}^${m + n}`, `(${b}^-${m})^${n}`, `${b}^-${m}:${b}^-${n}`, `(${b}^${m}*${b}^-${n})^-1`, `${b}^0*${b}^-${m}`])
  return { ...unicaQ('', 'h', '', e), id: '' }
}

// ===================================================================================================
// Parada 4 · Notación científica
// ===================================================================================================

const P4 = 'cientifica'

function pistasACientifica(s: string): ReactNode[] {
  const c = aCientifica(s)
  return [
    'Corre la coma hasta que quede una sola cifra (que no sea 0) delante de ella.',
    c.e >= 0 ? <>La coma se mueve {c.e} lugares a la izquierda: el exponente es +{c.e}.</> : <>La coma se mueve {-c.e} lugares a la derecha: el exponente es {menos(String(c.e))}.</>,
    <>Queda <Ci c={c} />.</>,
  ]
}
const aCiQ = (hoja: Hoja, etq: string, s: string, enunciado?: ReactNode, unidad?: string) =>
  cienQ({ parada: P4, hoja, etq, enunciado: enunciado ?? <>Escribe en notación científica: <Grande>{s}</Grande></>, pistas: pistasACientifica(s) }, aCientifica(s), undefined, unidad)

const cifrasQ = (hoja: Hoja, etq: string, c: Cientifica) => {
  const t = todasLasCifras(c)
  const v = limpio(c.m * 10 ** c.e)
  const base: Base = {
    parada: P4,
    hoja,
    etq,
    enunciado: <>Escribe con todas sus cifras: <Grande><Ci c={c} /></Grande></>,
    pistas: [c.e >= 0 ? <>Exponente positivo: la coma se corre {c.e} lugares a la derecha (rellenando con ceros).</> : <>Exponente negativo: la coma se corre {-c.e} lugares a la izquierda (rellenando con ceros).</>, <>Queda {t}.</>],
  }
  return Number.isInteger(v) ? numQ(base, v) : decQ(base, v, Math.abs(v) * 1e-9)
}

const opCiQ = (hoja: Hoja, etq: string, a: Cientifica, op: '·' | ':', b: Cientifica, texto2 = 'Calcula y da el resultado en notación científica:') => {
  const r = operarCientifica(a, op, b)
  return cienQ({ parada: P4, hoja, etq, enunciado: <>{texto2} <Grande>(<Ci c={a} />) {op} (<Ci c={b} />)</Grande></>, pistas: r.pasos.map((p, k) => <span key={k}>{p.porque} <b className="whitespace-nowrap">{p.linea}</b></span>) }, r.r)
}
const sumCiQ = (hoja: Hoja, etq: string, a: Cientifica, op: '+' | '−', b: Cientifica) => {
  const r = sumarCientifica(a, op, b)
  return cienQ({ parada: P4, hoja, etq, enunciado: <>Calcula y da el resultado en notación científica: <Grande><Ci c={a} /> {op} <Ci c={b} /></Grande></>, pistas: r.pasos.map((p, k) => <span key={k}>{p.porque} <b className="whitespace-nowrap">{p.linea}</b></span>) }, r.r)
}
const c = (m: number, e: number): Cientifica => ({ m, e })
const decimal = (s: string) => Number(s.replace(/\s|\./g, '').replace(',', '.'))
const sumaDecQ = (etq: string, a: string, op: '+' | '−', b: string) => {
  const v = limpio(op === '+' ? decimal(a) + decimal(b) : decimal(a) - decimal(b))
  return cienQ({ parada: P4, hoja: 'h', etq, enunciado: <>Opera y expresa el resultado en notación científica: <Grande>{a} {op} {b}</Grande></>, pistas: [<>Primero la cuenta: {a} {op} {b} = {coma(v)}.</>, ...pistasACientifica(String(v).replace('.', ',')).slice(1)] }, aCientifica(v))
}

/** El exponente que falta en «número = mantisa · 10ⁿ». */
function nQ(etq: string, izq: ReactNode, valor: number, m: number) {
  const e = Math.round(Math.log10(valor / m))
  return numQ(
    {
      parada: P4,
      hoja: 'nc',
      etq,
      enunciado: <>¿Qué valor tiene que tener n para que se cumpla la igualdad? <Grande>{izq} = {coma(m)} · 10<sup className="text-[0.65em]">n</sup></Grande></>,
      pistas: ['Mira cuántos lugares hay que correr la coma para pasar de un número al otro.', 'Si el número de la izquierda tiene potencia de 10, súmale (o réstale) los lugares que corres la coma.'],
    },
    e,
  )
}

const AÑO_S = 365 * 24 * 3600
const LUZ = 3e8

/** Masas de los planetas del ejercicio 44, en kg (como vienen en la hoja). */
const MASAS: Record<string, number> = {
  Tierra: 5.9722e21 * 1e3,
  Marte: 6.39e23,
  Mercurio: 3285e20,
  Júpiter: 1898000e21,
  Saturno: 568300000000000000000 * 1e6,
  Venus: 4.867e24,
}
function ordenMasas(nombres: string[], sep: '<' | '>') {
  return [...nombres].sort((a, b) => (sep === '<' ? MASAS[a] - MASAS[b] : MASAS[b] - MASAS[a])).join('|')
}

export const CIENTIFICA: Pregunta[] = [
  ...(
    [
      ['21a', '820.000'],
      ['21b', '690.000.000'],
      ['21c', '76.000'],
      ['21d', '0,000000826'],
      ['21e', '0,0000000071'],
      ['21f', '0,00045'],
    ] as const
  ).map(([etq, s]) => aCiQ('h', etq, s)),
  aCiQ('h', '22a', '6 000 000', <>Expresa en notación científica: el radio de la Tierra es aproximadamente de 6 millones (de metros).</>, 'm'),
  aCiQ('h', '22b', '7 500 000', <>Expresa en notación científica: el peso de un elefante es de siete millones y medio de gramos.</>, 'g'),
  aCiQ('h', '22c', '4 600 000', <>Expresa en notación científica: Vietnam vende más de 4,6 millones de toneladas de arroz.</>, 't'),
  aCiQ('h', '22d', '650 000 000', <>Expresa en notación científica: la capacidad del embalse de Belesar es de 650 millones de metros cúbicos.</>, 'm³'),
  ...(
    [
      ['23a', 5.4, 6],
      ['23b', 6.3, 3],
      ['23c', 8.3, 5],
      ['23d', 6.9, 4],
    ] as const
  ).map(([etq, m, e]) => cifrasQ('h', etq, c(m, e))),
  sumaDecQ('24a', '0,0004', '+', '0,00012'),
  sumaDecQ('24b', '0,0025', '−', '0,00014'),
  sumaDecQ('24c', '0,0625', '+', '0,0215'),
  sumaDecQ('24d', '0,0036', '−', '0,0095'),
  // Hoja de notación científica.
  ...(
    [
      ['1a', 4, 7],
      ['1b', 5, -4],
      ['1c', 9.73, 8],
      ['1d', 8.5, -6],
      ['1e', 3.8, 10],
      ['1f', 1.5, -5],
    ] as const
  ).map(([etq, m, e]) => cifrasQ('nc', etq, c(m, e))),
  ...(
    [
      ['2a', '13 800 000'],
      ['2b', '0,000005'],
      ['2c', '4 800 000 000'],
      ['2d', '0,0000173'],
    ] as const
  ).map(([etq, s]) => aCiQ('nc', etq, s)),
  aCiQ('nc', '3a', '150 000 000', <>Expresa en notación científica la distancia Tierra-Sol: 150 000 000 km.</>, 'km'),
  aCiQ('nc', '3b', '1 200 000', <>Expresa en notación científica el caudal de una catarata: 1 200 000 l/s.</>, 'l/s'),
  aCiQ('nc', '3c', '300 000 000', <>Expresa en notación científica la velocidad de la luz: 300 000 000 m/s.</>, 'm/s'),
  aCiQ('nc', '3d', '54 900 000 000', <>Expresa en notación científica la emisión de CO₂ en un año en España: 54 900 000 000 kg.</>, 'kg'),
  nQ('4a', '3 570 000', 3570000, 3.57),
  nQ('4b', '0,000083', 0.000083, 8.3),
  nQ('4c', <>157,4 · 10<sup className="text-[0.65em]">3</sup></>, 157.4e3, 1.574),
  nQ('4d', <>93,8 · 10<sup className="text-[0.65em]">−5</sup></>, 93.8e-5, 9.38),
  nQ('4e', <>14 700 · 10<sup className="text-[0.65em]">5</sup></>, 14700e5, 1.47),
  nQ('4f', <>0,003 · 10<sup className="text-[0.65em]">8</sup></>, 0.003e8, 3),
  ...(
    [
      ['5a', '0,00054 · 12 000 000', '250 000 · 0,00002', (0.00054 * 12000000) / (250000 * 0.00002)],
      ['5b', '1 320 000 · 25 000', '0,000002 · 0,0011', (1320000 * 25000) / (0.000002 * 0.0011)],
      ['5c', '0,000015 · 0,000004', '1 250 000 · 600 000', (0.000015 * 0.000004) / (1250000 * 600000)],
    ] as const
  ).map(([etq, arriba, abajo, v]) =>
    cienQ(
      {
        parada: P4,
        hoja: 'nc',
        etq,
        enunciado: (
          <>
            Expresa en notación científica y calcula:{' '}
            <Grande>
              <span className="inline-flex flex-col items-center">
                <span>{arriba}</span>
                <span className="h-0.5 w-full bg-current" />
                <span>{abajo}</span>
              </span>
            </Grande>
          </>
        ),
        pistas: ['Pasa cada número a notación científica.', 'Multiplica arriba y abajo: los números por un lado y las potencias de 10 por otro.', <>Divide y reajusta: sale <Ci c={aCientifica(v)} />.</>],
      },
      aCientifica(v),
    ),
  ),
  cienQ({ parada: P4, hoja: 'nc', etq: '5d', enunciado: <>Expresa en notación científica y calcula: <Grande>(0,0008)² · (30 000)²</Grande></>, pistas: ['0,0008 = 8 · 10⁻⁴ y 30 000 = 3 · 10⁴.', '(8 · 10⁻⁴)² = 64 · 10⁻⁸ y (3 · 10⁴)² = 9 · 10⁸.', '64 · 9 = 576 y 10⁻⁸ · 10⁸ = 10⁰: 576 = 5,76 · 10².'] }, aCientifica(0.0008 ** 2 * 30000 ** 2)),
  sumCiQ('nc', '6a', c(3.6, 12), '−', c(4, 11)),
  sumCiQ('nc', '6b', c(5, 9), '+', c(8.1, 10)),
  sumCiQ('nc', '6c', c(8, -8), '−', c(5, -9)),
  sumCiQ('nc', '6d', c(5.32, -4), '+', c(8, -6)),
  opCiQ('nc', '7a', c(3, 5), '·', c(2, 6)),
  opCiQ('nc', '7b', c(2, -8), '·', c(1.5, 12)),
  sumCiQ('nc', '7c', c(4, 8), '+', c(5, 7)),
  sumCiQ('nc', '7d', c(4, -3), '−', c(5, -4)),
  opCiQ('nc', '7e', c(8, 11), ':', c(5, 3)),
  opCiQ('nc', '7f', c(8.5, -6), ':', c(2, 4)),
  cienQ(
    {
      parada: P4,
      hoja: 'nc',
      etq: '8',
      enunciado: (
        <>
          El diámetro de un virus es 5 · 10<sup>−4</sup> mm. ¿Cuántos de esos virus hacen falta para rodear la Tierra? (Radio medio de la Tierra: 6370 km.) Da el resultado en notación científica, redondeado.
        </>
      ),
      pistas: ['La vuelta a la Tierra es la longitud de la circunferencia: 2 · π · r = 2 · 3,14 · 6370 ≈ 40 000 km.', '40 000 km = 4 · 10⁴ km = 4 · 10¹⁰ mm (1 km = 10⁶ mm).', '(4 · 10¹⁰) : (5 · 10⁻⁴) = 0,8 · 10¹⁴ = 8 · 10¹³.'],
    },
    aCientifica((2 * Math.PI * 6370 * 1e6) / 5e-4),
    0.02,
  ),
  cienQ(
    {
      parada: P4,
      hoja: 'nc',
      etq: '9a',
      enunciado: (
        <>
          La velocidad de la luz es 3 · 10<sup>8</sup> m/s. ¿Qué distancia recorre la luz en un año (en metros)? Redondea.
        </>
      ),
      pistas: ['Un año en segundos: 365 · 24 · 3600 = 31 536 000 ≈ 3,15 · 10⁷ s.', 'Distancia = velocidad · tiempo = (3 · 10⁸) · (3,15 · 10⁷).', '≈ 9,46 · 10¹⁵ m.'],
    },
    aCientifica(LUZ * AÑO_S),
    0.01,
    'm',
  ),
  cienQ(
    {
      parada: P4,
      hoja: 'nc',
      etq: '10',
      enunciado: <>La estrella Alfa Centauro está a 4,3 años luz de la Tierra. Expresa esa distancia en kilómetros (año luz: lo que recorre la luz en un año). Redondea.</>,
      pistas: ['Un año luz ≈ 9,46 · 10¹⁵ m = 9,46 · 10¹² km.', '4,3 · 9,46 · 10¹² ≈ 40,7 · 10¹² km.', '≈ 4,07 · 10¹³ km.'],
    },
    aCientifica((4.3 * LUZ * AÑO_S) / 1000),
    0.01,
    'km',
  ),
  ...(
    [
      ['11a', 'Mil millones', '10^9'],
      ['11b', 'Una milésima', '10^-3'],
      ['11c', '0,0000001', '10^-7'],
      ['11d', '10⁻¹² · 10⁷', '10^-12*10^7'],
      ['11e', '10 : 10⁻⁵', '10:10^-5'],
      ['11f', '1 : 100 000', '10^0:10^5'],
    ] as const
  ).map(([etq, t, e]) => potQ({ parada: P4, hoja: 'nc', etq, enunciado: <>Expresa mentalmente como potencia de base 10: <Grande>{t}</Grande></>, pistas: ['Cuenta los ceros: 1 seguido de n ceros es 10ⁿ; 0,00…01 con la coma n lugares a la izquierda es 10⁻ⁿ.', 'Para multiplicar potencias de 10 se suman los exponentes; para dividir, se restan.'] }, /\^/.test(e) && !/[*:]/.test(e) ? { b: { n: fr(10) }, e: Number(e.split('^')[1]) } : unicaPotencia(e).pot)),
  ...(
    [
      ['12a', c(2, 5), '·', c(3, 12)],
      ['12b', c(1.5, -7), '·', c(2, -5)],
      ['12c', c(3.4, -8), '·', c(2, 17)],
      ['12d', c(8, 12), ':', c(2, 17)],
      ['12e', c(9, -7), ':', c(3, 7)],
      ['12f', c(4.4, 8), ':', c(2, -5)],
      ['12g', c(5, 3), '·', c(2, 8)],
      ['12h', c(5, -7), '·', c(8, -9)],
    ] as const
  ).map(([etq, a, op, b]) => opCiQ('nc', etq, a, op, b, 'Calcula mentalmente (en notación científica):')),
  // Problemas.
  entQ(
    {
      parada: P4,
      hoja: 'pp',
      etq: '2',
      enunciado: <>La distancia media de la Tierra al Sol es de unos 150 millones de kilómetros. Exprésala en metros como un número natural por la mayor potencia de 10 posible (como 15 · 10ⁿ).</>,
      pistas: ['150 millones de km = 150 000 000 km = 150 000 000 000 m.', 'Quita todos los ceros del final y cuéntalos: 15 seguido de 10 ceros.'],
    },
    ['Número natural', 'Exponente de 10'],
    [15, 10],
  ),
  numQ(
    {
      parada: P4,
      hoja: 'pp',
      etq: '7',
      enunciado: <>El césped de un campo de fútbol mide, como máximo, 110 por 90 metros. Si se quema un monte de 2000 hectáreas, ¿a cuántos campos de fútbol equivale, aproximadamente? (1 ha = 10 000 m²; redondea a las unidades.)</>,
      pistas: ['Un campo: 110 · 90 = 9900 m².', '2000 ha = 2000 · 10 000 = 2 · 10⁷ m².', '20 000 000 : 9900 ≈ 2020.'],
    },
    Math.round((2000 * 10000) / (110 * 90)),
  ),
  q(
    {
      parada: P4,
      hoja: 'h',
      etq: '44a',
      enunciado: (
        <>
          La Tierra tiene una masa de 5,9722 · 10<sup>21</sup> t; Marte, de 6,39 · 10<sup>23</sup> kg, y Mercurio, de 3285 · 10<sup>20</sup> kg. Ordena los planetas de mayor a menor masa.
        </>
      ),
      pistas: ['Pásalo todo a kg y a notación científica: 1 t = 10³ kg.', 'Tierra: 5,9722 · 10²⁴ kg. Marte: 6,39 · 10²³ kg. Mercurio: 3,285 · 10²³ kg.', 'Primero se mira el exponente (más grande, más masa); si es igual, el número de delante.'],
    },
    { orden: barajar(['Tierra', 'Marte', 'Mercurio']), sep: '>' },
    ordenMasas(['Tierra', 'Marte', 'Mercurio'], '>'),
  ),
  q(
    {
      parada: P4,
      hoja: 'h',
      etq: '44b',
      enunciado: (
        <>
          Además, Júpiter tiene una masa de 1 898 000 · 10<sup>21</sup> kg; Saturno, de 568 300 000 000 000 000 000 · 10<sup>6</sup> kg, y Venus, de 4,867 · 10<sup>24</sup> kg. Ordena los seis planetas de menor a mayor masa.
        </>
      ),
      pistas: ['Júpiter: 1,898 · 10²⁷ kg. Saturno: 5,683 · 10²⁶ kg. Venus: 4,867 · 10²⁴ kg.', 'Con los tres del apartado a: compara primero los exponentes.'],
    },
    { orden: barajar(Object.keys(MASAS)), sep: '<' },
    ordenMasas(Object.keys(MASAS), '<'),
  ),
  cienQ(
    {
      parada: P4,
      hoja: 'h',
      etq: '45',
      enunciado: (
        <>
          El ser vivo más pequeño conocido es un virus que pesa de media 3,5 · 10<sup>−18</sup> g, y el más grande, la ballena azul, unas 140 toneladas. ¿Cuántos virus hacen falta para igualar el peso de la ballena?
        </>
      ),
      pistas: ['140 t = 140 000 kg = 140 000 000 g = 1,4 · 10⁸ g.', '(1,4 · 10⁸) : (3,5 · 10⁻¹⁸).', '1,4 : 3,5 = 0,4 y 10⁸ : 10⁻¹⁸ = 10²⁶: 0,4 · 10²⁶ = 4 · 10²⁵.'],
    },
    operarCientifica(c(1.4, 8), ':', c(3.5, -18)).r,
  ),
]

const numeroGrande = (e: number) => {
  const cifras = entre(2, 4)
  const m = limpio(entre(10 ** (cifras - 1), 10 ** cifras - 1) / 10 ** (cifras - 1))
  return c(m, e)
}
export function nuevaCientifica(): Pregunta {
  const tipo = entre(0, 4)
  const vacio = (x: Pregunta) => ({ ...x, id: '' })
  if (tipo === 0) {
    const x = numeroGrande(azar([-9, -7, -6, -5, -4, -3, 4, 5, 6, 7, 8, 9, 11]))
    const s = todasLasCifras(x)
    return vacio(aCiQ('h', '', s))
  }
  if (tipo === 1) return vacio(cifrasQ('h', '', numeroGrande(azar([-6, -5, -4, -3, 3, 4, 5, 6, 7]))))
  if (tipo === 2) return vacio(opCiQ('h', '', c(azar([2, 3, 4, 1.5, 2.5, 6]), entre(-12, 15)), '·', c(azar([2, 3, 4, 5, 1.2]), entre(-12, 15))))
  if (tipo === 3) return vacio(opCiQ('h', '', c(azar([8, 6, 9, 4.8, 3.6, 2]), entre(-12, 15)), ':', c(azar([2, 3, 4, 1.2]), entre(-12, 15))))
  const e = entre(-8, 12)
  // Restas que no den 0 ni negativo: el segundo, con exponente menor o con un número más pequeño.
  const a = azar([3, 4.5, 6, 7.2, 9.1])
  const d = entre(0, 2)
  const b = d === 0 ? azar([1.2, 2, 2.5]) : azar([2, 3, 5, 8])
  return vacio(sumCiQ('h', '', c(a, e), azar(['+', '−'] as const), c(b, e - d)))
}

// ===================================================================================================
// Parada 5 · Raíces cuadradas
// ===================================================================================================

const P5 = 'raices'

const cuadradoQ = (etq: string, n: number) => numQ({ parada: P5, hoja: 'h', etq, enunciado: <>Calcula el cuadrado de <Grande>{n}</Grande></>, pistas: [<>{n}² = {n} · {n}.</>] }, n * n)
const raizQ = (hoja: Hoja, etq: string, n: number, enunciado?: ReactNode, unidad?: string) => {
  const { r } = raizEntera(n)
  return numQ({ parada: P5, hoja, etq, enunciado: enunciado ?? <>Halla la raíz cuadrada: <Grande>√{n}</Grande></>, pistas: [<>Busca el número que, multiplicado por sí mismo, da {n}.</>, <>{r} · {r} = {n}.</>], acierto: unidad ? undefined : <>√{n} = {r}. (También vale −{r}, porque (−{r})² = {n}.)</> }, r)
}
const enteraQ = (hoja: Hoja, etq: string, n: number) => {
  const { r, resto } = raizEntera(n)
  return entQ(
    {
      parada: P5,
      hoja,
      etq,
      enunciado: <>Calcula la raíz cuadrada entera de <Grande>{n}</Grande> y su resto.</>,
      pistas: ['La raíz entera es el mayor número cuyo cuadrado no pasa de ese número.', <>{r}² = {r * r} y {r + 1}² = {(r + 1) ** 2}: la raíz entera es {r}.</>, <>Resto = {n} − {r * r} = {resto}.</>],
    },
    ['Raíz entera', 'Resto'],
    [r, resto],
  )
}
const raizFrQ = (etq: string, n: number, d: number) => {
  const s = fr(n, d)
  const v = fr(Math.round(Math.sqrt(s.n)), Math.round(Math.sqrt(s.d)))
  return fracQ(
    {
      parada: P5,
      hoja: 'h',
      etq,
      enunciado: <>Calcula: <Grande>√<span className="border-t-2 border-current pl-0.5"><F n={n} d={d} /></span></Grande></>,
      pistas: [...(s.n !== n ? [<>Primero simplifica: <F n={n} d={d} /> = <F n={s.n} d={s.d} />.</>] : []), <>La raíz de una fracción es la raíz de arriba entre la raíz de abajo: √{s.n} = {v.n} y √{s.d} = {v.d}.</>],
    },
    v,
  )
}

export const RAICES: Pregunta[] = [
  ...(
    [
      ['27a', 12],
      ['27b', 5],
      ['27c', 10],
      ['27d', 100],
      ['27e', 9],
      ['27f', 35],
    ] as const
  ).map(([etq, n]) => cuadradoQ(etq, n)),
  q(
    {
      parada: P5,
      hoja: 'h',
      etq: '28',
      enunciado: <>Indica qué números son cuadrados perfectos (el cuadrado de un número entero).</>,
      pistas: ['Busca para cada uno un número que multiplicado por sí mismo lo dé: 8 · 8 = 64…', 'Los que acaban en 2, 3, 7 u 8 nunca son cuadrados perfectos.'],
    },
    { multi: ['10 000', '78', '64', '144', '35', '256', '900', '1525'] },
    ['10 000', '78', '64', '144', '35', '256', '900', '1525'].filter((x) => raizEntera(Number(x.replace(/\s/g, ''))).resto === 0).join('|'),
  ),
  numQ({ parada: P5, hoja: 'h', etq: '29a', enunciado: <>Si un número acaba en 2, ¿en qué cifra termina su cuadrado?</>, pistas: ['La última cifra del cuadrado solo depende de la última cifra del número: 2 · 2.'] }, ultimaCifraCuadrado(2)),
  numQ({ parada: P5, hoja: 'h', etq: '29b', enunciado: <>Y si acaba en 9, ¿en qué cifra termina su cuadrado?</>, pistas: ['9 · 9 = 81.'] }, ultimaCifraCuadrado(9)),
  ...(
    [
      ['30a', 81],
      ['30b', 1000000],
      ['30e', 256],
      ['30f', 900],
      ['30g', 144],
    ] as const
  ).map(([etq, n]) => raizQ('h', etq, n)),
  ...(
    [
      ['30c', 25],
      ['30d', 49],
    ] as const
  ).map(([etq, n]) =>
    opcQ(
      { parada: P5, hoja: 'h', etq, enunciado: <>Halla la raíz cuadrada: <Grande>√−{n}</Grande></>, pistas: ['¿Hay algún número que multiplicado por sí mismo dé negativo? Positivo por positivo da positivo, y negativo por negativo, también.'] },
      [String(Math.sqrt(n)), `−${Math.sqrt(n)}`, 'No tiene raíz'],
      'No tiene raíz',
    ),
  ),
  opcQ({ parada: P5, hoja: 'h', etq: '31a', enunciado: <>9 y 16 son cuadrados perfectos. ¿Su suma es un cuadrado perfecto?</>, pistas: ['9 + 16 = 25.', '25 = 5 · 5.'] }, ['Sí', 'No'], raizEntera(9 + 16).resto === 0 ? 'Sí' : 'No'),
  opcQ({ parada: P5, hoja: 'h', etq: '31b', enunciado: <>¿La suma de dos cuadrados perfectos es siempre un cuadrado perfecto? Prueba cambiando el 16 por otro cuadrado perfecto, como 25.</>, pistas: ['9 + 25 = 34.', '5² = 25 y 6² = 36: 34 no es el cuadrado de ningún entero.'] }, ['Sí, siempre', 'No, no siempre'], raizEntera(9 + 25).resto === 0 ? 'Sí, siempre' : 'No, no siempre'),
  ...(
    [
      ['32a', 98],
      ['32b', 229],
      ['32c', 500],
      ['32d', 1526],
      ['32e', 78956],
    ] as const
  ).map(([etq, n]) => enteraQ('h', etq, n)),
  raizFrQ('34a', 169, 144),
  raizFrQ('34b', 1, 729),
  raizFrQ('34c', 1125, 245),
  entQ(
    {
      parada: P5,
      hoja: 'h',
      etq: '42',
      enunciado: <>¿Con 77 baldosas cuadradas puedo solar una superficie cuadrada? Di cuántas baldosas habría en cada lado del cuadrado más grande que se puede hacer y cuántas sobran.</>,
      pistas: ['Busca la raíz entera de 77.', '8² = 64 y 9² = 81: el cuadrado más grande es de 8 por lado.', '77 − 64 = 13 sobran.'],
    },
    ['Baldosas por lado', 'Sobran'],
    [raizEntera(77).r, raizEntera(77).resto],
  ),
  numQ({ parada: P5, hoja: 'h', etq: '42b', enunciado: <>Con esas 77 baldosas, ¿cuántas faltan para hacer un cuadrado con una baldosa más por lado?</>, pistas: ['Un cuadrado de 9 por lado necesita 9² = 81.', '81 − 77.'] }, cuadradoSiguiente(77).faltan),
  entQ(
    {
      parada: P5,
      hoja: 'h',
      etq: '43',
      enunciado: <>Con 195 árboles se quiere formar un cuadrado de filas y columnas. ¿Cuántos árboles tiene que haber en cada lado? ¿Cuántos sobran? ¿Cuántos más harían falta para un cuadrado de un árbol más de lado?</>,
      pistas: ['13² = 169 y 14² = 196.', '195 − 169 = 26 sobran.', '196 − 195 = 1 falta para el de 14.'],
    },
    ['Por lado', 'Sobran', 'Faltarían'],
    [raizEntera(195).r, raizEntera(195).resto, cuadradoSiguiente(195).faltan],
  ),
  // Problemas de raíces.
  raizQ('pr', '1', 4900, <>Una parcela cuadrada mide 4900 m². ¿Cuánto mide cada lado (en m)?</>, 'm'),
  raizQ('pr', '2', 16 * 9, <>Una sala de lectura mide 16 m de largo y 9 m de ancho. ¿Cuánto mediría el lado de una sala cuadrada con la misma área (en m)?</>, 'm'),
  raizQ('pr', '3', 100 / 4, <>La habitación de Estíbaliz es cuadrada. Dice que el producto de la longitud de su lado por su cuádruple es 100. ¿Cuánto mide el lado (en m)?</>, 'm'),
  numQ({ parada: P5, hoja: 'pr', etq: '4', enunciado: <>Ángela puede formar con sus sellos un cuadrado de 13 sellos de lado y le sobran 12. ¿Cuántos le faltan para formar un cuadrado (de un sello más de lado) sin que le sobre ni le falte ninguno?</>, pistas: ['Tiene 13² + 12 = 181 sellos.', 'El cuadrado siguiente es 14² = 196.', '196 − 181.'] }, cuadradoSiguiente(13 ** 2 + 12).faltan),
  decQ({ parada: P5, hoja: 'pr', etq: '5a', enunciado: <>René tiene 144 baldosas cuadradas de 40 cm de lado para cubrir el suelo de su garaje cuadrado. ¿Cuánto mide el perímetro del garaje (en m)?</>, pistas: ['√144 = 12 baldosas por lado.', '12 · 40 cm = 480 cm = 4,8 m de lado.', 'Perímetro: 4 · 4,8.'] }, limpio(4 * raizEntera(144).r * 0.4), 0.001, 'm'),
  decQ({ parada: P5, hoja: 'pr', etq: '5b', enunciado: <>¿Y cuál es el área del garaje de René (en m²)?</>, pistas: ['El lado mide 4,8 m.', '4,8² = 4,8 · 4,8.'] }, limpio((raizEntera(144).r * 0.4) ** 2), 0.001, 'm²'),
  entQ({ parada: P5, hoja: 'pr', etq: '6', enunciado: <>Una sala rectangular tiene 128 m², y un lado es el doble que el otro. ¿Cuáles son sus dimensiones? (Así se puede dividir en dos salas cuadradas.)</>, pistas: ['Si se parte por la mitad, quedan dos cuadrados de 64 m² cada uno.', '√64 = 8: el lado corto mide 8 m y el largo, 16 m.'] }, ['Lado corto (m)', 'Lado largo (m)'], [raizEntera(128 / 2).r, 2 * raizEntera(128 / 2).r]),
  raizQ('pr', '7', 6400, <>Calcula el lado de una plaza cuadrada de 6400 m² de superficie (en m).</>, 'm'),
  decQ({ parada: P5, hoja: 'pr', etq: '8', enunciado: <>¿Cuánto mide el lado de un polideportivo cuadrado de 975,25 m² de superficie? (En m, con dos decimales.)</>, pistas: ['Lado = √975,25.', '31² = 961 y 32² = 1024: está entre 31 y 32.', 'Con la calculadora: ≈ 31,23 m.'] }, Number(Math.sqrt(975.25).toFixed(2)), 0.006, 'm'),
  decQ({ parada: P5, hoja: 'pr', etq: '9', enunciado: <>Calcula, aproximando hasta las centésimas, el lado de una parcela cuadrada de 2345,25 m² (en m).</>, pistas: ['Lado = √2345,25.', '48² = 2304 y 49² = 2401.', 'Con la calculadora: ≈ 48,43 m.'] }, Number(Math.sqrt(2345.25).toFixed(2)), 0.006, 'm'),
  decQ({ parada: P5, hoja: 'pr', etq: '10', enunciado: <>Una cartulina mide 21,3 cm por 29,7 cm. ¿Cuánto mediría el lado de una cartulina cuadrada con la misma área? (En cm, con dos decimales.)</>, pistas: ['Área: 21,3 · 29,7 = 632,61 cm².', 'Lado = √632,61 ≈ 25,15 cm.'] }, Number(Math.sqrt(21.3 * 29.7).toFixed(2)), 0.006, 'cm'),
  raizQ('pr', '11', 25 * 81, <>Calcula el lado de un cuadrado con la misma área que un rectángulo de 25 cm por 81 cm (en cm).</>, 'cm'),
  entQ(
    {
      parada: P5,
      hoja: 'pr',
      etq: '12',
      enunciado: (
        <>
          Raquel tiene que multiplicar el número 2<sup>3</sup> · 5<sup>2</sup> · 7<sup>2</sup> por el menor número posible para que sea un cuadrado perfecto. ¿Por qué número lo multiplica? ¿Cuál es la raíz cuadrada del nuevo número?
        </>
      ),
      pistas: ['Un cuadrado perfecto tiene todos los exponentes pares en su descomposición.', 'El 2 tiene exponente 3: falta otro 2 para que quede 2⁴.', '√(2⁴ · 5² · 7²) = 2² · 5 · 7.'],
    },
    ['Multiplica por', 'Raíz cuadrada'],
    [2, raizEntera(2 ** 4 * 5 ** 2 * 7 ** 2).r],
  ),
]

export function nuevaRaices(): Pregunta {
  const vacio = (x: Pregunta) => ({ ...x, id: '' })
  const tipo = entre(0, 3)
  if (tipo === 0) {
    const r = azar([...Array.from({ length: 19 }, (_, k) => k + 6), 30, 40, 50, 60, 70, 80, 90, 100])
    return vacio(raizQ('h', '', r * r))
  }
  if (tipo === 1) return vacio(enteraQ('h', '', entre(20, 2000)))
  if (tipo === 2) {
    const [a, b] = [entre(1, 12), entre(2, 15)]
    const k = azar([1, 1, 4, 9])
    return vacio(raizFrQ('', a * a * k, b * b * k))
  }
  const n = entre(30, 400)
  const { r, resto } = raizEntera(n)
  if (resto === 0) return nuevaRaices()
  return vacio(
    entQ(
      { parada: '', hoja: 'h', etq: '', enunciado: <>Tienes {n} baldosas y quieres formar el cuadrado más grande posible. ¿Cuántas van en cada lado y cuántas sobran?</>, pistas: [<>{r}² = {r * r} y {r + 1}² = {(r + 1) ** 2}.</>, <>Sobran {n} − {r * r}.</>] },
      ['Por lado', 'Sobran'],
      [r, resto],
    ),
  )
}

// ===================================================================================================
// Parada 6 · Operaciones combinadas (jerarquía con potencias y raíces)
// ===================================================================================================

const P6 = 'combinadas'

function pistasOp(e: string): ReactNode[] {
  const r = resolverFr(e)
  return [
    'Orden: 1.º paréntesis y corchetes (y lo de dentro de las raíces), 2.º potencias y raíces, 3.º multiplicaciones y divisiones de izquierda a derecha, 4.º sumas y restas.',
    ...r.pasos.map((p, i) => (
      <span key={i} className="flex flex-wrap items-center gap-2">
        <b>Paso {i + 1}.</b> {p.porque} <ExprFr toks={p.cuenta} />
      </span>
    )),
  ]
}
const opQ = (hoja: Hoja, etq: string, e: string) =>
  fracQ({ parada: hoja === 'h' ? P6 : '', hoja, etq, enunciado: <>Calcula y da el resultado en fracción irreducible (o entero): <Grande><Op e={e} /></Grande></>, pistas: pistasOp(e) }, calcularFr(e))

/** Los ejemplos de la hoja (36 y 37) que se leen bien. */
export const COMBINADAS_HOJA: [string, string][] = [
  ['36a', '(-3)^2·√16 - (5^2-11):√49 + (10-8)^2'],
  ['36b', '(3^2-4)^3·√(13-2^2) : (5+3·(-5))'],
  ['36c', '5/6 - (4/7)^2·[3/5 - 1/10:(-2)^3]'],
  ['36f', '[(-3/2)^3·(-4/9)^3 + (1/3)^3] - 2^-1·1/3 + √(1/9)'],
  ['37a', '3/4 - (1/2)^2·[(5/2)^2 - 2/3·(3/2)^3] - √(49/16)'],
  ['37b', '3/4 - (1/2)^2·√(5^2-4^2):(3/2)^-2'],
  ['37c', '4^-1 + √(2/18)·(3^2-2^3·3)·5^-1'],
]

export const COMBINADAS3: Pregunta[] = [
  ...COMBINADAS_HOJA.map(([etq, e]) => opQ('h', etq, e)),
  // Más, del mismo estilo, para practicar.
  ...(
    [
      ['P1', '2^3 - 3^2 + √25 · (-1)^5'],
      ['P2', '(-2)^4 : 2^3 + √(81) - 10^0'],
      ['P3', '√(64) - (3 - 5)^3 : 2^2'],
      ['P4', '(1/2)^-2 + (2/3)^2 · 9/4'],
      ['P5', '[2^-1 + 3^-1] · √(36/25)'],
      ['P6', '5 - 2 · (3^2 - √(4·4)) : 5'],
    ] as const
  ).map(([etq, e]) => ({ ...opQ('par', etq, e), id: `t3:${P6}:par-${etq}` })),
]

const PLANTILLAS3 = [
  '(a)^2 - √R · b',
  'a^3 : b + √R',
  '√R - (a - b)^2 : c',
  '(a/b)^2 · √R',
  'a^-1 + b^-1',
  '(a/b)^-2 - c',
  '√(R/S) + (a - b)^2',
  '[a^2 - √R] · (b)^-1',
  '(-a)^3 + b^2 · √R',
]
export function nuevaCombinadas3(): Pregunta {
  for (;;) {
    const e = azar(PLANTILLAS3)
      .replace(/R/g, () => String(entre(1, 10) ** 2))
      .replace(/S/g, () => String(entre(2, 9) ** 2))
      .replace(/[abc]/g, () => String(entre(1, 6)))
    try {
      const r = calcularFr(e)
      if (Math.abs(r.n) <= 300 && r.d <= 100) return { ...opQ('par', '', e), id: '' }
    } catch {
      // División entre 0 o raíz imposible: se prueba otra.
    }
  }
}

// ---------- Para el mapa y la prueba ----------

export const BANCOS3 = {
  signo: { clase: SIGNO, generar: nuevaSigno },
  propiedades: { clase: PROPIEDADES, generar: nuevaPropiedades },
  negativos: { clase: NEGATIVOS, generar: nuevaNegativos },
  cientifica: { clase: CIENTIFICA, generar: nuevaCientifica },
  raices: { clase: RAICES, generar: nuevaRaices },
  combinadas: { clase: COMBINADAS3, generar: nuevaCombinadas3 },
}

export const IDS3: Record<string, string[]> = Object.fromEntries(Object.entries(BANCOS3).map(([k, v]) => [k, v.clase.map((x) => x.id)]))

export { escribirPot, escribirCientifica }
