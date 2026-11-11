// Tecnología 2.º ESO, tema 1 «Electricidad»: el examen es de ejercicios y problemas. Cada problema se aprende
// resuelto paso a paso (qué te piden, fórmula, unidades, sustitución y resultado) y los circuitos se ven simplificarse
// dibujo a dibujo. Los problemas son los de las hojas del profesor; las soluciones las calcula src/lib/electricidad.ts.
import type { ReactNode } from 'react'
import { Clasifica, Proba, VerdadeiroFalso, barallar, type Pregunta, type Tarxeta, type Xogo } from '../../primaria/pezas'
import { elixe, toca } from '../../primaria/paisaxes/preguntas'
import { Caixa, Lista, Parada, Truco, b } from '../../historia/parcial1/roma'
import {
  FORMULA,
  NOMBRE,
  RHO_COBRE,
  UNIDAD,
  carga,
  cargaDeElectrones,
  elementos,
  intensidad,
  num,
  ohm,
  pilas,
  repartir,
  req,
  resistenciaHilo,
  seccion,
  simplificar,
  sustitucionOhm,
  type Circuito,
  type Elemento,
  type Magnitud,
} from '../../lib/electricidad'
import { EjemploResuelto, ResuelveConmigo, Solucion, type PasoGuiado, type ProblemaGuiado } from './Resuelve'
import { Esquema, Frac, Hilo, NOMBRE_SIMBOLO, SIMBOLOS, SimboloSvg, Triangulo, tablaSimbolos, variosEsquemas } from './debuxos'

type PropsParada = { ruta: string; modo?: string }
const U = 'electricidad'
const Practica = ({ preguntas, acabar }: { preguntas: Pregunta[]; acabar: () => void }) => <Proba practica cantas={6} preguntas={preguntas} acabar={acabar} />
const Formula = ({ children }: { children: ReactNode }) => <div className="my-2 rounded-2xl bg-violet-50 p-3 text-center font-mono text-2xl font-bold text-violet-900">{children}</div>
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const COLOR: Record<string, string> = {
  V: 'bg-yellow-100 border-yellow-400 text-yellow-900',
  I: 'bg-orange-100 border-orange-400 text-orange-900',
  R: 'bg-green-100 border-green-500 text-green-900',
  Q: 'bg-sky-100 border-sky-400 text-sky-900',
  t: 'bg-slate-100 border-slate-400 text-slate-800',
  L: 'bg-amber-100 border-amber-500 text-amber-900',
  d: 'bg-amber-100 border-amber-500 text-amber-900',
  ρ: 'bg-rose-100 border-rose-400 text-rose-900',
}
/** Un dato del problema en una pastilla de color: cada magnitud siempre del mismo color. */
const Dato = ({ s, children }: { s: string; children: ReactNode }) => <span className={`mx-0.5 inline-block rounded-full border-2 px-2.5 py-0.5 font-mono text-lg font-bold whitespace-nowrap ${COLOR[s] ?? COLOR.t}`}>{children}</span>
const Datos = ({ items, busca }: { items: [string, string][]; busca?: string }) => (
  <span className="flex flex-wrap items-center gap-1">
    {items.map(([s, v]) => (
      <Dato key={s} s={s}>
        {s} = {v}
      </Dato>
    ))}
    {busca && (
      <>
        <span className="mx-1 text-slate-500">→</span>
        <Dato s={busca}>{busca} = ?</Dato>
      </>
    )}
  </span>
)

/** El último paso con número es el resultado del problema: con él se hace la pregunta de la prueba. */
function pregunta(pr: ProblemaGuiado): Pregunta {
  const ultimo = [...pr.pasos].reverse().find((p) => p.tipo !== 'info')!
  const texto = (
    <span className="block w-full text-xl leading-snug font-semibold">
      {pr.enunciado}
      {pr.visual && <span className="mt-2 block rounded-xl bg-white p-2">{pr.visual}</span>}
    </span>
  )
  if (ultimo.tipo === 'numero') return { tipo: 'numero', texto, valor: ultimo.valor, unidade: ultimo.unidad, marxe: ultimo.marxe ?? 0.02, explica: <Solucion problema={pr} /> }
  if (ultimo.tipo === 'elige') return { tipo: 'elixe', texto, correcta: ultimo.correcta, outras: ultimo.otras, explica: <Solucion problema={pr} /> }
  throw new Error('Problema sin resultado')
}

// ===================================================================================================
// 1. Carga e intensidad: I = Q / t
// ===================================================================================================

interface ProbCarga {
  n: string
  texto: string
  busca: 'I' | 'Q'
  I?: number
  Q?: number
  t: number
  /** El tiempo viene en minutos y hay que pasarlo a segundos. */
  minutos?: boolean
  /** La carga viene en electrones y hay que pasarla a culombios. */
  electrones?: number
}

export const CARGA: ProbCarga[] = [
  { n: 'Ejercicio 2', texto: 'Calcula la carga que pasa por un conductor si está circulando una corriente de 2 A durante 2 minutos.', busca: 'Q', I: 2, t: 2, minutos: true },
  { n: 'Ejercicio 3', texto: '¿Cuál es la intensidad de corriente que pasa por un dispositivo si lo atraviesan 1000 C en 25 s?', busca: 'I', Q: 1000, t: 25 },
  { n: 'Ejercicio 14', texto: 'Por la sección de un alambre pasan 10 culombios en 4 s. Calcula la intensidad de corriente.', busca: 'I', Q: 10, t: 4 },
  { n: 'Ejercicio 15', texto: 'La intensidad que atraviesa un conductor es 5 A. Calcula la carga que pasa en 2 s.', busca: 'Q', I: 5, t: 2 },
  { n: 'Ejercicio 16 a', texto: 'Por un conductor circulan 6,24 · 10¹⁸ electrones en 2 segundos. Calcula la carga y la intensidad.', busca: 'I', electrones: 6.24e18, t: 2 },
  { n: 'Ejercicio 16 b', texto: 'Por un conductor circulan 12,48 · 10¹⁸ electrones en 1 segundo. Calcula la carga y la intensidad.', busca: 'I', electrones: 12.48e18, t: 1 },
  { n: 'Ejercicio 17 a', texto: 'Calcula la carga que circula por un conductor en 5 s si la intensidad es de 2 A.', busca: 'Q', I: 2, t: 5 },
  { n: 'Ejercicio 17 b', texto: 'Calcula la carga que circula por un conductor en 5 s si la intensidad es de 0,5 A.', busca: 'Q', I: 0.5, t: 5 },
  { n: 'Más práctica', texto: 'Por una bombilla pasa una corriente de 0,5 A durante 3 minutos. ¿Qué carga la atraviesa?', busca: 'Q', I: 0.5, t: 3, minutos: true },
  { n: 'Más práctica', texto: 'Por un cable pasan 360 C en 1 minuto. ¿Cuál es la intensidad?', busca: 'I', Q: 360, t: 1, minutos: true },
  { n: 'Más práctica', texto: 'Por un motor pasan 3,12 · 10¹⁹ electrones en 10 s. Calcula la intensidad.', busca: 'I', electrones: 3.12e19, t: 10 },
  { n: 'Más práctica', texto: 'Por un conductor pasan 90 C en 30 s. ¿Cuál es la intensidad de corriente?', busca: 'I', Q: 90, t: 30 },
  { n: 'Más práctica', texto: 'Un móvil se carga con una corriente de 1,5 A durante 10 minutos. ¿Qué carga recibe?', busca: 'Q', I: 1.5, t: 10, minutos: true },
]

export function guiadoCarga(p: ProbCarga): ProblemaGuiado {
  const t = p.minutos ? p.t * 60 : p.t
  const Q = p.electrones !== undefined ? cargaDeElectrones(p.electrones) : p.Q
  const pasos: PasoGuiado[] = []
  const datos: [string, string][] = [...(p.I !== undefined ? [['I', `${num(p.I)} A`] as [string, string]] : []), ...(p.electrones !== undefined ? [['n', `${num(p.electrones)} e⁻`] as [string, string]] : p.Q !== undefined ? [['Q', `${num(p.Q)} C`] as [string, string]] : []), ['t', `${num(p.t)} ${p.minutos ? 'min' : 's'}`]]
  pasos.push({
    tipo: 'elige',
    titulo: 'Qué te piden',
    pregunta: '¿Qué tienes que calcular al final?',
    correcta: p.busca === 'I' ? 'La intensidad (I)' : 'La carga (Q)',
    otras: [p.busca === 'I' ? 'La carga (Q)' : 'La intensidad (I)', 'El tiempo (t)'],
    luego: <Datos items={datos} busca={p.busca} />,
  })
  if (p.minutos)
    pasos.push({
      tipo: 'numero',
      titulo: 'Unidades',
      pregunta: <>El tiempo tiene que ir en segundos. ¿Cuántos segundos son {num(p.t)} min?</>,
      valor: t,
      unidad: 's',
      luego: (
        <>
          t = {num(p.t)} min · <Frac a="60 s" b="1 min" /> = <Dato s="t">{num(t)} s</Dato>
        </>
      ),
    })
  if (p.electrones !== undefined)
    pasos.push({
      tipo: 'numero',
      titulo: 'Electrones a culombios',
      pregunta: <>1 C son 6,24 · 10¹⁸ electrones. ¿Cuántos culombios son {num(p.electrones)} electrones?</>,
      valor: Q!,
      unidad: 'C',
      luego: (
        <>
          Q = <Frac a={`${num(p.electrones)} e⁻`} b="6,24 · 10¹⁸ e⁻/C" /> = <Dato s="Q">{num(Q!)} C</Dato>
        </>
      ),
    })
  pasos.push({
    tipo: 'elige',
    titulo: 'Fórmula',
    pregunta: '¿Qué fórmula usas?',
    correcta: p.busca === 'I' ? 'I = Q / t' : 'Q = I · t',
    otras: p.busca === 'I' ? ['I = Q · t', 'I = t / Q'] : ['Q = I / t', 'Q = t / I'],
    luego: <Formula>{p.busca === 'I' ? 'I = Q / t' : 'Q = I · t'}</Formula>,
  })
  const res = p.busca === 'I' ? intensidad(Q!, t) : carga(p.I!, t)
  const sust = p.busca === 'I' ? `I = ${num(Q!)} C / ${num(t)} s` : `Q = ${num(p.I!)} A · ${num(t)} s`
  pasos.push({
    tipo: 'numero',
    titulo: 'Sustituye y calcula',
    pregunta: <>{sust} = ?</>,
    valor: res,
    unidad: p.busca === 'I' ? 'A' : 'C',
    luego: (
      <>
        {sust} = <Dato s={p.busca}>{`${num(res)} ${p.busca === 'I' ? 'A' : 'C'}`}</Dato>
      </>
    ),
  })
  return { enunciado: <>{p.texto} <span className="text-base text-slate-500">({p.n})</span></>, pasos }
}

const CARGA_GUIADOS = CARGA.map(guiadoCarga)
const CARGA_PREG: Pregunta[] = [
  ...CARGA_GUIADOS.map(pregunta),
  elixe('¿Qué es la intensidad de corriente?', 'La carga que atraviesa una sección del conductor en una unidad de tiempo', ['La energía para mover la carga entre dos puntos', 'La dificultad al paso de la corriente'], 'I = Q / t. Se mide en amperios (A).'),
  elixe('¿En qué unidad se mide la carga eléctrica?', 'Culombios (C)', ['Amperios (A)', 'Voltios (V)', 'Ohmios (Ω)'], 'Q en culombios; I en amperios; t en segundos.'),
  elixe('¿Cuántos electrones hay en 1 culombio?', '6,24 · 10¹⁸', ['6,24 · 10⁻¹⁸', '1000', '1,6 · 10¹⁸'], 'Por eso 6,24 · 10¹⁸ electrones son 1 C.'),
]

export function Carga(p: PropsParada) {
  const tarjetas: Tarxeta[] = [
    {
      titulo: 'La intensidad: cuánta carga pasa cada segundo',
      texto: (
        <>
          <Formula>
            I = <Frac a="Q" b="t" />
          </Formula>
          <div className="flex flex-wrap justify-center gap-2">
            <Dato s="I">I en amperios (A)</Dato>
            <Dato s="Q">Q en culombios (C)</Dato>
            <Dato s="t">t en segundos (s)</Dato>
          </div>
          <Lista items={[<>Si te piden la carga, despeja: {b('Q = I · t')}.</>, <>El tiempo, {b('siempre en segundos')}: 1 min = 60 s, 1 h = 3600 s.</>, <>Si te dan electrones, pásalos a culombios: {b('1 C = 6,24 · 10¹⁸ electrones')}.</>]} />
        </>
      ),
    },
    { titulo: 'Ejemplo resuelto: ejercicio 2', texto: <EjemploResuelto problema={CARGA_GUIADOS[0]} /> },
    { titulo: 'Ejemplo resuelto: ejercicio 16 a', texto: <EjemploResuelto problema={CARGA_GUIADOS[4]} /> },
  ]
  const xogos: Xogo[] = [
    { id: 'conmigo', titulo: 'Resuelve conmigo', icono: '👣', explica: 'Los ejercicios 2, 3 y 14 a 17, paso a paso.', crear: (acabar) => <ResuelveConmigo problemas={CARGA_GUIADOS.slice(0, 8)} acabar={acabar} /> },
    { id: 'mas', titulo: 'Más problemas paso a paso', icono: '➕', explica: 'Otros con minutos y electrones.', crear: (acabar) => <ResuelveConmigo problemas={barallar(CARGA_GUIADOS.slice(8))} acabar={acabar} /> },
    { id: 'solo', titulo: 'Ahora tú solo', icono: '🎯', explica: 'Escribe solo el resultado.', crear: (acabar) => <Practica preguntas={CARGA_GUIADOS.map(pregunta)} acabar={acabar} /> },
  ]
  return <Parada {...p} unidade={U} id="carga" titulo="Carga e intensidad" tarxetas={tarjetas} xogos={xogos} preguntas={CARGA_PREG} />
}

// ===================================================================================================
// 2. La ley de Ohm
// ===================================================================================================

interface ProbOhm {
  n: string
  texto: string
  d: Partial<Record<Magnitud, number>>
  busca: Magnitud
  /** La solución que trae la hoja cuando está mal calculada. */
  hoja?: string
}
const oh = (n: string, texto: string, d: Partial<Record<Magnitud, number>>, busca: Magnitud, hoja?: string): ProbOhm => ({ n, texto, d, busca, hoja })

/** Los de la hoja del colegio y los de «100 problemas de la ley de Ohm» que tienen todos los datos. */
export const OHM: ProbOhm[] = [
  oh('Ejercicio 5', 'Calcula la resistencia de un horno cuando pasa una corriente de 5 A y está conectado a una tensión de 230 V.', { I: 5, V: 230 }, 'R'),
  oh('Ejercicio 6', 'Calcula la intensidad que circula por un conductor de 500 Ω cuando el voltaje es de 50 V.', { R: 500, V: 50 }, 'I'),
  oh('Ejercicio 7', 'Calcula el voltaje de una bombilla que tiene una resistencia de 93 Ω y por la que circula una corriente de 2,5 A.', { R: 93, I: 2.5 }, 'V'),
  oh('Ejercicio 18', 'Calcula la intensidad que alimenta a una lavadora de juguete de 10 Ω que funciona con una batería de 30 V.', { R: 10, V: 30 }, 'I'),
  oh('Ejercicio 19', 'Calcula el voltaje entre dos puntos del circuito de una plancha por el que pasan 4 A y que tiene una resistencia de 10 Ω.', { I: 4, R: 10 }, 'V'),
  oh('Ejercicio 20', 'Calcula la resistencia atravesada por una corriente de 5 A con una diferencia de potencial de 11 V.', { I: 5, V: 11 }, 'R'),
  oh('Problema 3', 'Calcula la resistencia atravesada por una corriente de 5 A con una diferencia de potencial de 10 V.', { I: 5, V: 10 }, 'R'),
  oh('Problema 4', 'Un conductor tiene una tensión de 15 V y una intensidad de 3 A. Calcula su resistencia.', { V: 15, I: 3 }, 'R'),
  oh('Problema 5', 'En un circuito hay una resistencia de 25 Ω y una diferencia de potencial de 80 V. Calcula la intensidad.', { R: 25, V: 80 }, 'I'),
  oh('Problema 6', 'Una cámara frigorífica tiene una intensidad de 2,5 A y una resistencia de 500 Ω. Calcula la tensión.', { I: 2.5, R: 500 }, 'V'),
  oh('Problema 7', 'Una corriente atraviesa una resistencia de 5 Ω con una diferencia de potencial de 105 V. Calcula la intensidad.', { R: 5, V: 105 }, 'I'),
  oh('Problema 8', 'Por un circuito pasan 8,4 A y hay una resistencia de 56 Ω. Calcula la diferencia de potencial.', { I: 8.4, R: 56 }, 'V'),
  oh('Problema 10', 'Por un circuito pasan 3 A y hay una resistencia de 38 Ω. Calcula la diferencia de potencial.', { I: 3, R: 38 }, 'V'),
  oh('Problema 11', 'Una corriente de 2 A sale de una pila de 4 V. Calcula la resistencia.', { I: 2, V: 4 }, 'R'),
  oh('Problema 12', 'Un frigorífico tiene una resistencia de 50 Ω y una diferencia de potencial de 250 V. Calcula la intensidad.', { R: 50, V: 250 }, 'I'),
  oh('Problema 13', 'Por el circuito de un congelador pasan 20 A y hay una resistencia de 30 Ω. Calcula la diferencia de potencial.', { I: 20, R: 30 }, 'V'),
  oh('Problema 15', 'La corriente de una lavadora es de 220 V y su resistencia de 22 Ω. ¿Cuál es la intensidad?', { V: 220, R: 22 }, 'I'),
  oh('Problema 16', 'Una lavadora tiene un voltaje de 230 V y una intensidad de 16 A. Calcula su resistencia.', { V: 230, I: 16 }, 'R'),
  oh('Problema 17', 'Un microondas tiene una resistencia de 125 Ω y un voltaje de 220 V. Averigua la intensidad.', { R: 125, V: 220 }, 'I'),
  oh('Problema 18', 'Por una resistencia de 1,5 Ω circula una corriente de 0,8 A. Calcula el voltaje.', { R: 1.5, I: 0.8 }, 'V'),
  oh('Problema 20', 'Un horno necesita una corriente de 35 A y tiene una resistencia de 21 Ω. ¿Cuál será la tensión necesaria?', { I: 35, R: 21 }, 'V'),
  oh('Problema 21', 'Un ordenador requiere una intensidad de 35 A y una diferencia de potencial de 50 V. Calcula su resistencia.', { I: 35, V: 50 }, 'R'),
  oh('Problema 22', 'Un móvil tiene una diferencia de potencial de 57 V y una resistencia de 15 Ω. ¿Cuál es la intensidad?', { V: 57, R: 15 }, 'I'),
  oh('Problema 23', 'Un televisor necesita una intensidad de 4 A y una diferencia de potencial de 125 V. ¿Qué resistencia presenta?', { I: 4, V: 125 }, 'R'),
  oh('Problema 24', 'Una batidora tiene una tensión de 40 V y una resistencia de 20 Ω. Calcula la intensidad.', { V: 40, R: 20 }, 'I'),
  oh('Problema 25', 'Un circuito tiene una pila de 9 V y una intensidad de 5 A. Calcula la resistencia.', { V: 9, I: 5 }, 'R'),
  oh('Problema 26', 'Un pastor eléctrico tiene una intensidad de 7 A y una resistencia de 3 Ω. Calcula la tensión.', { I: 7, R: 3 }, 'V'),
  oh('Problema 33', 'Calcula la resistencia de un circuito por el que pasan 5,5 A si entre sus extremos hay 100 V.', { I: 5.5, V: 100 }, 'R'),
  oh('Problema 35', 'Calcula la resistencia de un circuito por el que pasan 100 A si entre sus extremos hay 30 V.', { I: 100, V: 30 }, 'R', '0,33 Ω'),
  oh('Problema 36 a', 'Calcula la intensidad que atraviesa una resistencia de 90 Ω si entre sus extremos hay 30 V.', { R: 90, V: 30 }, 'I', '3 A'),
  oh('Problema 36 b', 'Calcula la intensidad que atraviesa una resistencia de 120 Ω si entre sus extremos hay 4 V.', { R: 120, V: 4 }, 'I', '30 A'),
  oh('Problema 38', 'Se conecta a una batería de 12 V un circuito de 100 Ω. ¿Cuál es la intensidad?', { V: 12, R: 100 }, 'I'),
  oh('Problema 39', 'Por un circuito de 50 Ω pasa una corriente de 0,1 A. ¿Cuál es la tensión?', { R: 50, I: 0.1 }, 'V'),
  oh('Problema 41', 'Un frigorífico tiene un voltaje de 220 V y una intensidad de 30 A. ¿Cuál es su resistencia?', { V: 220, I: 30 }, 'R'),
  oh('Problema 44', 'La diferencia de potencial de un circuito es de 90 V y la intensidad de 5 A. Calcula la resistencia.', { V: 90, I: 5 }, 'R', '450 Ω'),
  oh('Problema 45', 'Una corriente pasa por una resistencia de 70 Ω con una diferencia de potencial de 100 V. Calcula la intensidad.', { R: 70, V: 100 }, 'I'),
  oh('Problema 46', 'Calcula el voltaje de un circuito de intensidad 20 A y resistencia 60 Ω.', { I: 20, R: 60 }, 'V'),
  oh('Problema 51', 'La pila de un coche teledirigido es de 20 V y el circuito tiene 4 Ω. ¿Qué intensidad tendrá la corriente?', { V: 20, R: 4 }, 'I', '0,5 A'),
  oh('Problema 52', 'Calcula la diferencia de potencial en un circuito de 80 Ω con una intensidad de 5 A.', { R: 80, I: 5 }, 'V', '0,14 Ω'),
  oh('Problema 53', 'Calcula la resistencia de un circuito por el que pasan 50 A con un voltaje de 7 V.', { I: 50, V: 7 }, 'R'),
  oh('Problema 54', 'Entre los extremos de un circuito de 40 Ω hay 130 V. Calcula la intensidad.', { R: 40, V: 130 }, 'I'),
  oh('Problema 62', 'Un circuito tiene una lámpara de 3 Ω y la pila es de 8,2 V. Calcula la intensidad.', { R: 3, V: 8.2 }, 'I'),
  oh('Problema 63', 'Un motor consume 0,06 A cuando la tensión es de 7 V. ¿Qué resistencia ofrece?', { I: 0.06, V: 7 }, 'R'),
  oh('Problema 67', 'Por una resistencia de 175 Ω circulan 0,5 A. Calcula la diferencia de potencial en sus extremos.', { R: 175, I: 0.5 }, 'V'),
  oh('Problema 71', 'Una pila de 8 V da una corriente de 0,004 A. Calcula la resistencia del circuito.', { V: 8, I: 0.004 }, 'R'),
  oh('Problema 78', 'Un lavavajillas está alimentado con 330 V y tiene una resistencia de 600 Ω. ¿Qué corriente circula?', { V: 330, R: 600 }, 'I'),
  oh('Problema 85 a', 'Por un circuito pasan 4,5 A y entre sus extremos hay 265 V. Calcula la resistencia.', { I: 4.5, V: 265 }, 'R'),
  oh('Problema 88', 'Una lavadora industrial trabaja a 400 V y presenta una resistencia de 2000 Ω. Calcula la intensidad.', { V: 400, R: 2000 }, 'I', '50 A'),
  oh('Problema 89', 'Un circuito está conectado a una batería de 5 V y tiene 15 Ω. Calcula la intensidad.', { V: 5, R: 15 }, 'I', '3 A'),
  oh('Problema 93', 'Por un aparato pasa una corriente de 220 V con una intensidad de 0,5 A. Calcula su resistencia.', { V: 220, I: 0.5 }, 'R'),
  oh('Problema 97', 'Con una tensión de 30 V tenemos una bombilla de 9 Ω. Calcula la intensidad.', { V: 30, R: 9 }, 'I', '0,33 A'),
]

const ETIQUETA: Record<Magnitud, string> = { V: 'La tensión (V)', I: 'La intensidad (I)', R: 'La resistencia (R)' }
const MAL_FORMULA: Record<Magnitud, string[]> = { I: ['I = V · R', 'I = R / V'], V: ['V = I / R', 'V = R / I'], R: ['R = V · I', 'R = I / V'] }

export function guiadoOhm(p: ProbOhm): ProblemaGuiado {
  const dados = (['V', 'I', 'R'] as Magnitud[]).filter((m) => p.d[m] !== undefined)
  const res = ohm(p.busca, p.d)
  const s = sustitucionOhm(p.busca, p.d)
  const sinResultado = s.slice(0, s.lastIndexOf(' = '))
  return {
    enunciado: (
      <>
        {p.texto} <span className="text-base text-slate-500">({p.n})</span>
      </>
    ),
    pasos: [
      {
        tipo: 'elige',
        titulo: 'Datos y qué te piden',
        pregunta: '¿Qué tienes que calcular?',
        correcta: ETIQUETA[p.busca],
        otras: (['V', 'I', 'R'] as Magnitud[]).filter((m) => m !== p.busca).map((m) => ETIQUETA[m]),
        luego: <Datos items={dados.map((m) => [m, `${num(p.d[m]!)} ${UNIDAD[m]}`])} busca={p.busca} />,
      },
      {
        tipo: 'elige',
        titulo: 'Fórmula',
        pregunta: <>Tapa la {p.busca} en el triángulo. ¿Qué fórmula queda?</>,
        correcta: FORMULA[p.busca],
        otras: MAL_FORMULA[p.busca],
        visual: <Triangulo />,
        luego: <Formula>{FORMULA[p.busca]}</Formula>,
      },
      {
        tipo: 'numero',
        titulo: 'Sustituye y calcula',
        pregunta: <>{sinResultado} = ?</>,
        valor: res,
        unidad: UNIDAD[p.busca],
        luego: (
          <>
            {sinResultado} = <Dato s={p.busca}>{`${num(res)} ${UNIDAD[p.busca]}`}</Dato>
            {p.hoja && <span className="mt-1 block text-base text-amber-800">⚠️ En la hoja pone {p.hoja}, pero está mal: es {num(res)} {UNIDAD[p.busca]}.</span>}
          </>
        ),
      },
    ],
  }
}

const OHM_GUIADOS = OHM.map(guiadoOhm)
const OHM_PREG: Pregunta[] = [
  ...OHM_GUIADOS.map(pregunta),
  ...(['V', 'I', 'R'] as Magnitud[]).map((m) => elixe(<>Para calcular la {NOMBRE[m]}, ¿qué fórmula usas?</>, FORMULA[m], MAL_FORMULA[m], <>Tapa la {m} en el triángulo: {FORMULA[m]}.</>, <Triangulo inicial={m} fijo />)),
  elixe('¿Qué dice la ley de Ohm?', 'La intensidad es proporcional a la tensión e inversamente proporcional a la resistencia', ['La intensidad es proporcional a la resistencia', 'La tensión no depende de la intensidad'], 'I = V / R: más tensión, más intensidad; más resistencia, menos intensidad.'),
  elixe('Si la resistencia de un circuito se duplica y la tensión no cambia, la intensidad…', 'se reduce a la mitad', ['se duplica', 'no cambia'], 'I = V / R: R el doble → I la mitad.'),
  elixe('¿En qué se mide la resistencia?', 'En ohmios (Ω)', ['En voltios (V)', 'En amperios (A)', 'En culombios (C)'], 'V en voltios, I en amperios, R en ohmios.'),
]

export function Ohm(p: PropsParada) {
  const tarjetas: Tarxeta[] = [
    {
      titulo: 'La ley de Ohm: el triángulo',
      texto: (
        <>
          <Triangulo />
          <div className="flex flex-wrap justify-center gap-2">
            <Dato s="V">V en voltios (V)</Dato>
            <Dato s="I">I en amperios (A)</Dato>
            <Dato s="R">R en ohmios (Ω)</Dato>
          </div>
          <Truco>Tapa con el dedo la letra que buscas. Si las otras dos quedan una encima de la otra, se divide; si quedan una al lado de la otra, se multiplica.</Truco>
        </>
      ),
    },
    {
      titulo: 'Los tres pasos de siempre',
      texto: (
        <Lista
          items={[
            <>
              <b>1. Datos:</b> apunta lo que te dan con su unidad y lo que te piden: <Datos items={[['R', '10 Ω'], ['V', '30 V']]} busca="I" />
            </>,
            <>
              <b>2. Fórmula:</b> la que sale del triángulo: <b>I = V / R</b>.
            </>,
            <>
              <b>3. Sustituye y calcula</b>, y pon la unidad al resultado: I = 30 V / 10 Ω = <Dato s="I">3 A</Dato>
            </>,
          ]}
        />
      ),
    },
    { titulo: 'Ejemplo resuelto: calcular la intensidad', texto: <EjemploResuelto problema={OHM_GUIADOS[3]} /> },
    { titulo: 'Ejemplo resuelto: calcular el voltaje', texto: <EjemploResuelto problema={OHM_GUIADOS[2]} /> },
    { titulo: 'Ejemplo resuelto: calcular la resistencia', texto: <EjemploResuelto problema={OHM_GUIADOS[0]} /> },
    {
      titulo: 'Ojo con la hoja de los 100 problemas',
      texto: (
        <>
          <p>Algunas soluciones de la hoja están mal calculadas. Si no te coincide, no te asustes:</p>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {OHM.filter((x) => x.hoja).map((x) => (
              <span key={x.n} className="rounded-xl bg-white px-3 py-1.5 text-base">
                {x.n}: pone <s>{x.hoja}</s>, es <b>{num(ohm(x.busca, x.d))} {UNIDAD[x.busca]}</b>
              </span>
            ))}
          </div>
        </>
      ),
    },
  ]
  const porTipo = (m: Magnitud) => OHM_GUIADOS.filter((_, i) => OHM[i].busca === m)
  const xogos: Xogo[] = [
    { id: 'I', titulo: 'Calcular la intensidad', icono: '🟠', explica: 'Paso a paso: I = V / R.', crear: (acabar) => <ResuelveConmigo problemas={barallar(porTipo('I')).slice(0, 4)} acabar={acabar} /> },
    { id: 'V', titulo: 'Calcular el voltaje', icono: '🟡', explica: 'Paso a paso: V = I · R.', crear: (acabar) => <ResuelveConmigo problemas={barallar(porTipo('V')).slice(0, 4)} acabar={acabar} /> },
    { id: 'R', titulo: 'Calcular la resistencia', icono: '🟢', explica: 'Paso a paso: R = V / I.', crear: (acabar) => <ResuelveConmigo problemas={barallar(porTipo('R')).slice(0, 4)} acabar={acabar} /> },
    { id: 'mezcla', titulo: 'Mezclados paso a paso', icono: '🔀', explica: 'Tienes que saber qué te piden.', crear: (acabar) => <ResuelveConmigo problemas={barallar(OHM_GUIADOS).slice(0, 5)} acabar={acabar} /> },
    { id: 'solo', titulo: 'Ahora tú solo', icono: '🎯', explica: 'Escribe solo el resultado.', crear: (acabar) => <Practica preguntas={OHM_GUIADOS.map(pregunta)} acabar={acabar} /> },
  ]
  return <Parada {...p} unidade={U} id="ohm" titulo="La ley de Ohm" tarxetas={tarjetas} xogos={xogos} preguntas={OHM_PREG} />
}

// ===================================================================================================
// 3. La resistencia de un hilo: R = ρ · L / s
// ===================================================================================================

export const HILOS: { n: string; L: number; d: number }[] = [
  { n: 'Ejercicio 4 a', L: 2, d: 2 },
  { n: 'Ejercicio 4 b', L: 20, d: 2 },
  { n: 'Ejercicio 4 c', L: 2, d: 20 },
  { n: 'Más práctica', L: 5, d: 1 },
  { n: 'Más práctica', L: 10, d: 0.5 },
  { n: 'Más práctica', L: 100, d: 4 },
  { n: 'Más práctica', L: 50, d: 2 },
]

/** Las cuentas mal hechas más típicas: no dividir el diámetro entre 2 o no pasar los mm a metros. */
function hiloMal(L: number, d: number): string[] {
  const R = resistenciaHilo(RHO_COBRE, L, d)
  const sinRadio = (RHO_COBRE * L) / (Math.PI * (d / 1000) ** 2)
  const sinMetros = (RHO_COBRE * L) / (Math.PI * (d / 2) ** 2)
  return [...new Set([sinRadio, sinMetros, R * 10].map((x) => `${num(x)} Ω`))].filter((x) => x !== `${num(R)} Ω`)
}

export function guiadoHilo(h: { n: string; L: number; d: number }): ProblemaGuiado {
  const dm = h.d / 1000
  const r = dm / 2
  const s = seccion(h.d)
  const R = resistenciaHilo(RHO_COBRE, h.L, h.d)
  const malS = [...new Set([Math.PI * dm ** 2, Math.PI * (h.d / 2) ** 2, 2 * Math.PI * r].map((x) => `${num(x)} m²`))].filter((x) => x !== `${num(s)} m²`)
  return {
    enunciado: (
      <>
        Calcula la resistencia de un hilo de cobre de {num(h.L)} m de largo y {num(h.d)} mm de diámetro. La resistividad del cobre es 1,68 · 10⁻⁸ Ω·m.{' '}
        <span className="text-base text-slate-500">({h.n})</span>
      </>
    ),
    visual: <Hilo L={`${num(h.L)} m`} d={`${num(h.d)} mm`} />,
    pasos: [
      {
        tipo: 'info',
        titulo: 'Datos',
        contenido: (
          <>
            <Datos
              items={[
                ['L', `${num(h.L)} m`],
                ['d', `${num(h.d)} mm`],
                ['ρ', '1,68 · 10⁻⁸ Ω·m'],
              ]}
              busca="R"
            />
            <Formula>
              R = ρ · <Frac a="L" b="s" />
            </Formula>
          </>
        ),
      },
      {
        tipo: 'numero',
        titulo: 'Diámetro en metros',
        pregunta: <>ρ está en Ω·m, así que todo va en metros. ¿Cuántos metros son {num(h.d)} mm?</>,
        valor: dm,
        unidad: 'm',
        luego: (
          <>
            d = {num(h.d)} mm / 1000 = <Dato s="d">{num(dm)} m</Dato>
          </>
        ),
      },
      {
        tipo: 'numero',
        titulo: 'Radio',
        pregunta: '¿Cuánto mide el radio? (la mitad del diámetro)',
        valor: r,
        unidad: 'm',
        luego: (
          <>
            r = d / 2 = {num(dm)} / 2 = <Dato s="d">{num(r)} m</Dato>
          </>
        ),
      },
      {
        tipo: 'elige',
        titulo: 'Sección (el círculo del corte)',
        pregunta: <>s = π · r². ¿Cuánto vale la sección?</>,
        correcta: `${num(s)} m²`,
        otras: malS,
        luego: (
          <>
            s = π · r² = 3,14 · ({num(r)})² = <b>{num(s)} m²</b>
          </>
        ),
      },
      {
        tipo: 'elige',
        titulo: 'Sustituye y calcula',
        pregunta: <>R = 1,68 · 10⁻⁸ · {num(h.L)} / {num(s)} = ?</>,
        correcta: `${num(R)} Ω`,
        otras: hiloMal(h.L, h.d),
        luego: (
          <>
            R = 1,68 · 10⁻⁸ Ω·m · <Frac a={`${num(h.L)} m`} b={`${num(s)} m²`} /> = <Dato s="R">{num(R)} Ω</Dato>
          </>
        ),
      },
    ],
  }
}

const HILO_GUIADOS = HILOS.map(guiadoHilo)
const HILO_PREG: Pregunta[] = [
  ...HILO_GUIADOS.map(pregunta),
  ...HILOS.map((h) => elixe(<>¿Cuánto mide en metros el radio de un hilo de {num(h.d)} mm de diámetro?</>, `${num(h.d / 2000)} m`, [`${num(h.d / 1000)} m`, `${num(h.d / 2)} m`, `${num(h.d / 200)} m`].filter((x) => x !== `${num(h.d / 2000)} m`), <>La mitad del diámetro, en metros: {num(h.d)} mm / 2 / 1000 = {num(h.d / 2000)} m.</>)),
  elixe('Si un hilo es 10 veces más largo, su resistencia…', 'se multiplica por 10', ['se divide entre 10', 'no cambia', 'se multiplica por 100'], 'R es proporcional a la longitud: compara los ejercicios 4 a y 4 b.'),
  elixe('Si el diámetro de un hilo es 10 veces mayor, su resistencia…', 'se divide entre 100', ['se divide entre 10', 'se multiplica por 10', 'no cambia'], 'La sección (π · r²) se hace 100 veces mayor: compara los ejercicios 4 a y 4 c.'),
  elixe('¿Qué hilo tiene más resistencia?', 'Uno largo y fino', ['Uno corto y grueso', 'Uno largo y grueso', 'Uno corto y fino'], 'Más longitud y menos sección, más resistencia.'),
  elixe('¿De qué depende la resistividad ρ?', 'Del material', ['De la longitud', 'Del diámetro', 'De la pila'], 'Cada material tiene la suya: la del cobre es 1,68 · 10⁻⁸ Ω·m.'),
]

export function Hilos(p: PropsParada) {
  const tarjetas: Tarxeta[] = [
    {
      titulo: 'La resistencia de un hilo',
      texto: (
        <>
          <Hilo L="longitud" d="diámetro" />
          <Formula>
            R = ρ · <Frac a="L" b="s" />
          </Formula>
          <Lista items={[<>Más {b('largo')} → más resistencia.</>, <>Más {b('grueso')} (más sección) → menos resistencia.</>, <>ρ es la {b('resistividad')}: depende del material.</>]} />
        </>
      ),
    },
    {
      titulo: 'La sección es un círculo',
      texto: (
        <>
          <Formula>s = π · r² y r = d / 2</Formula>
          <Truco>Lo que más se falla: pasar los mm a metros (÷ 1000) y dividir el diámetro entre 2 antes de elevar al cuadrado.</Truco>
          <Caixa titulo="Ejemplo: 2 mm de diámetro">
            d = 2 mm = 0,002 m → r = 0,001 m → s = 3,14 · 0,001² = 3,14 · 10⁻⁶ m²
          </Caixa>
        </>
      ),
    },
    { titulo: 'Ejemplo resuelto: ejercicio 4 a', texto: <EjemploResuelto problema={HILO_GUIADOS[0]} /> },
    {
      titulo: 'Compara los tres del ejercicio 4',
      texto: (
        <div className="grid gap-2 sm:grid-cols-3">
          {HILOS.slice(0, 3).map((h) => (
            <Caixa key={h.n} titulo={h.n}>
              L = {num(h.L)} m, d = {num(h.d)} mm
              <br />R = <b>{num(resistenciaHilo(RHO_COBRE, h.L, h.d))} Ω</b>
            </Caixa>
          ))}
          <p className="sm:col-span-3">10 veces más largo → 10 veces más resistencia. 10 veces más ancho → 100 veces menos.</p>
        </div>
      ),
    },
  ]
  const xogos: Xogo[] = [
    { id: 'conmigo', titulo: 'Resuelve conmigo', icono: '👣', explica: 'El ejercicio 4, paso a paso.', crear: (acabar) => <ResuelveConmigo problemas={HILO_GUIADOS.slice(0, 3)} acabar={acabar} /> },
    { id: 'mas', titulo: 'Más hilos paso a paso', icono: '🧵', explica: 'Otras longitudes y grosores.', crear: (acabar) => <ResuelveConmigo problemas={HILO_GUIADOS.slice(3)} acabar={acabar} /> },
    { id: 'solo', titulo: 'Ahora tú solo', icono: '🎯', explica: 'Radios, secciones y resistencias.', crear: (acabar) => <Practica preguntas={HILO_PREG} acabar={acabar} /> },
  ]
  return <Parada {...p} unidade={U} id="hilo" titulo="La resistencia de un hilo" tarxetas={tarjetas} xogos={xogos} preguntas={HILO_PREG} />
}

// ===================================================================================================
// 4. Serie, paralelo y mixto
// ===================================================================================================

const R = (nombre: string, r: number): Elemento => ({ nombre, r })
const serie = (...c: Circuito[]): Circuito => ({ serie: c })
const par = (...c: Circuito[]): Circuito => ({ paralelo: c })

export interface ProbCircuito {
  n: string
  c: Circuito
  V?: number
  texto?: string
}

export const CIRCUITOS: ProbCircuito[] = [
  { n: 'Ejercicio 8', c: serie(R('R1', 5), par(R('R2', 4), R('R3', 12)), R('R4', 10)) },
  { n: 'Ejercicio 9', c: serie(par(serie(R('R1', 6), R('R2', 4)), serie(R('R3', 5), R('R4', 8))), R('R5', 7)) },
  { n: 'Ejercicio 11', c: serie(par(R('R1', 20), R('R2', 10), R('R3', 20)), R('R4', 15), R('R5', 20)), V: 12, texto: 'Calcula la intensidad total del circuito. (En la hoja, la última resistencia también se llama R3; aquí la llamamos R5.)' },
  { n: 'Ejercicio 21 a', c: serie(R('R1', 3), R('R2', 8), R('R3', 4)) },
  { n: 'Ejercicio 21 b', c: par(R('R1', 7), R('R2', 7)) },
  { n: 'Ejercicio 21 c', c: par(serie(R('R1', 6), R('R2', 6)), R('R3', 12), R('R4', 12)) },
  { n: 'Ejercicio 21 d', c: serie(par(R('R1', 12), R('R2', 6)), par(R('R3', 10), R('R4', 5))) },
  { n: 'Ejercicio 21 e', c: serie(R('R1', 5), par(R('R2', 10), R('R3', 10))) },
  { n: 'Ejercicio 21 f', c: serie(R('R1', 7), par(R('R2', 5), R('R3', 10))) },
  { n: 'Más práctica', c: serie(R('R1', 2), R('R2', 4)), V: 12 },
  { n: 'Más práctica', c: par(R('R1', 6), R('R2', 12)), V: 12 },
  { n: 'Más práctica', c: serie(R('R1', 4), par(R('R2', 6), R('R3', 3))), V: 9 },
  { n: 'Más práctica', c: serie(par(R('R1', 20), R('R2', 30)), R('R3', 8)), V: 40 },
  { n: 'Más práctica', c: par(R('R1', 10), R('R2', 15), R('R3', 30)), V: 30 },
  { n: 'Más práctica', c: serie(R('R1', 1), par(serie(R('R2', 2), R('R3', 4)), R('R4', 3)), R('R5', 5)), V: 24 },
]

const valores = (c: Circuito) =>
  elementos(c)
    .map((e) => `${e.nombre} = ${num(e.r)} Ω`)
    .join(', ')

/** Simplificar el circuito dibujo a dibujo: en cada paso, ¿serie o paralelo? y ¿cuánto vale la nueva resistencia? */
export function guiadoCircuito(p: ProbCircuito): ProblemaGuiado {
  const pasos: PasoGuiado[] = []
  for (const [i, s] of simplificar(p.c).entries()) {
    const visual = <Esquema c={s.antes} resalta={[s.grupo]} V={p.V} />
    pasos.push({
      tipo: 'elige',
      titulo: `Paso ${i + 1}: mira el recuadro`,
      pregunta: 'Las resistencias del recuadro naranja, ¿cómo están?',
      correcta: s.tipo === 'serie' ? 'En serie' : 'En paralelo',
      otras: [s.tipo === 'serie' ? 'En paralelo' : 'En serie'],
      visual,
      luego: s.tipo === 'serie' ? <>En serie (una detrás de otra): se suman.</> : <>En paralelo (unidas por los dos extremos): se suman los inversos.</>,
    })
    pasos.push({
      tipo: 'numero',
      titulo: `Calcula ${s.nueva.nombre}`,
      pregunta: s.tipo === 'serie' ? <>Súmalas. ¿Cuánto vale {s.nueva.nombre}?</> : <>1/{s.nueva.nombre} = suma de los inversos. ¿Cuánto vale {s.nueva.nombre}?</>,
      valor: s.nueva.r,
      unidad: 'Ω',
      visual,
      luego: (
        <>
          {s.cuenta}
          <span className="mt-2 block rounded-xl bg-white p-1">
            <Esquema c={s.despues} V={p.V} max={320} />
          </span>
        </>
      ),
    })
  }
  if (p.V !== undefined) {
    const Req = req(p.c)
    const I = p.V / Req
    pasos.push({
      tipo: 'numero',
      titulo: 'Intensidad total (ley de Ohm)',
      pregunta: (
        <>
          I = V / Req = {num(p.V)} V / {num(Req)} Ω = ?
        </>
      ),
      valor: I,
      unidad: 'A',
      luego: (
        <>
          I = V / Req = {num(p.V)} V / {num(Req)} Ω = <Dato s="I">{num(I)} A</Dato>
        </>
      ),
    })
  }
  const texto = p.texto ?? (p.V !== undefined ? 'Calcula la resistencia equivalente y la intensidad total.' : 'Calcula la resistencia equivalente.')
  return {
    enunciado: (
      <>
        {texto} {valores(p.c)}
        {p.V !== undefined && `, V = ${num(p.V)} V`}. <span className="text-base text-slate-500">({p.n})</span>
      </>
    ),
    visual: <Esquema c={p.c} V={p.V} />,
    pasos,
  }
}

/** Ejercicio 10: dos resistencias en paralelo, con todas sus preguntas. */
export function guiadoEjercicio10(): ProblemaGuiado {
  const c = par(R('R1', 6), R('R2', 3))
  const V = 2 * 6
  const [r1, r2] = repartir(c, V)
  return {
    enunciado: (
      <>
        En este circuito, R1 = 6 Ω y R2 = 3 Ω. a) ¿Cuál es la resistencia equivalente? b) Si por la resistencia de 6 Ω pasan 2 A, ¿cuál es la caída de tensión en ella? c) ¿Qué intensidad pasa por R2 y cuál es su caída de
        tensión? d) ¿Qué voltaje da el generador? <span className="text-base text-slate-500">(Ejercicio 10)</span>
      </>
    ),
    visual: <Esquema c={c} />,
    pasos: [
      ...guiadoCircuito({ n: '', c }).pasos,
      {
        tipo: 'numero',
        titulo: 'b) Tensión en R1',
        pregunta: <>V1 = I1 · R1 = 2 A · 6 Ω = ?</>,
        valor: r1.V,
        unidad: 'V',
        luego: (
          <>
            V1 = I1 · R1 = 2 A · 6 Ω = <Dato s="V">{num(r1.V)} V</Dato>
          </>
        ),
      },
      {
        tipo: 'elige',
        titulo: 'c) Tensión en R2',
        pregunta: 'R1 y R2 están en paralelo. ¿Qué tensión tiene R2?',
        correcta: `La misma que R1: ${num(r2.V)} V`,
        otras: ['La mitad: 6 V', 'El doble: 24 V'],
        luego: (
          <>
            En paralelo la tensión es la misma: <Dato s="V">V2 = {num(r2.V)} V</Dato>
          </>
        ),
      },
      {
        tipo: 'numero',
        titulo: 'c) Intensidad por R2',
        pregunta: <>I2 = V2 / R2 = {num(r2.V)} V / 3 Ω = ?</>,
        valor: r2.I,
        unidad: 'A',
        luego: (
          <>
            I2 = V2 / R2 = {num(r2.V)} V / 3 Ω = <Dato s="I">{num(r2.I)} A</Dato>
          </>
        ),
      },
      {
        tipo: 'numero',
        titulo: 'd) Voltaje del generador',
        pregunta: '¿Qué tensión da el generador?',
        valor: V,
        unidad: 'V',
        luego: (
          <>
            En paralelo, el generador da la misma tensión que cada rama: <Dato s="V">{num(V)} V</Dato> (comprueba: I = 2 + 4 = 6 A, y 6 A · 2 Ω = 12 V)
          </>
        ),
      },
    ],
  }
}

const CIRCUITO_GUIADOS = CIRCUITOS.map(guiadoCircuito)
const EJ10 = guiadoEjercicio10()

/** Preguntas de reparto en circuitos sencillos con generador: intensidad y tensión en cada resistencia. */
function preguntasReparto(p: ProbCircuito): Pregunta[] {
  if (p.V === undefined || elementos(p.c).length > 3) return []
  const rep = repartir(p.c, p.V)
  const visual = <Esquema c={p.c} V={p.V} />
  const enSerie = 'serie' in p.c
  return rep.slice(0, 2).flatMap((x) => [
    {
      tipo: 'numero' as const,
      texto: (
        <span className="block w-full text-xl font-semibold">
          ¿Qué intensidad pasa por {x.nombre}? ({valores(p.c)}, V = {num(p.V!)} V)
          <span className="mt-2 block rounded-xl bg-white p-2">{visual}</span>
        </span>
      ),
      valor: x.I,
      unidade: 'A',
      marxe: 0.02,
      explica: enSerie ? (
        <>
          En serie la intensidad es la misma para todas: I = V / Req = {num(p.V!)} / {num(req(p.c))} = {num(x.I)} A.
        </>
      ) : (
        <>
          En paralelo cada rama tiene la tensión del generador: I = {num(p.V!)} V / {num(x.r)} Ω = {num(x.I)} A.
        </>
      ),
    },
    {
      tipo: 'numero' as const,
      texto: (
        <span className="block w-full text-xl font-semibold">
          ¿Qué tensión hay en {x.nombre}? ({valores(p.c)}, V = {num(p.V!)} V)
          <span className="mt-2 block rounded-xl bg-white p-2">{visual}</span>
        </span>
      ),
      valor: x.V,
      unidade: 'V',
      marxe: 0.02,
      explica: enSerie ? (
        <>
          En serie la tensión se reparte: I = {num(rep[0].I)} A, y V = I · R = {num(x.I)} · {num(x.r)} = {num(x.V)} V.
        </>
      ) : (
        <>En paralelo la tensión es la misma en todas las ramas: {num(x.V)} V.</>
      ),
    },
  ])
}

const REGLAS = [
  { texto: 'En serie, la intensidad es la misma en todas las resistencias.', certa: true, explica: 'Solo hay un camino: la corriente que pasa por una pasa por todas.' },
  { texto: 'En serie, la tensión es la misma en todas las resistencias.', certa: false, explica: 'En serie la tensión se reparte: V = V1 + V2 + …' },
  { texto: 'En paralelo, la tensión es la misma en todas las resistencias.', certa: true, explica: 'Todas están conectadas a los mismos dos puntos.' },
  { texto: 'En paralelo, la intensidad total se reparte entre las ramas.', certa: true, explica: 'I = I1 + I2 + …' },
  { texto: 'La resistencia equivalente en paralelo es más pequeña que la más pequeña de ellas.', certa: true, explica: 'Por ejemplo, 6 Ω y 3 Ω en paralelo dan 2 Ω.' },
  { texto: 'La resistencia equivalente en serie es la suma de todas.', certa: true, explica: 'Req = R1 + R2 + …' },
  { texto: 'Dos resistencias iguales en paralelo equivalen a la mitad de una.', certa: true, explica: '7 Ω y 7 Ω en paralelo: 3,5 Ω (ejercicio 21 b).' },
  { texto: 'En paralelo, la resistencia equivalente es la suma de las resistencias.', certa: false, explica: 'Eso es en serie. En paralelo se suman los inversos: 1/Req = 1/R1 + 1/R2.' },
]

const CIRCUITO_PREG: Pregunta[] = [
  ...CIRCUITO_GUIADOS.map(pregunta),
  ...CIRCUITOS.filter((x) => x.V !== undefined).map((x) => pregunta(guiadoCircuito({ ...x, V: undefined, texto: 'Calcula solo la resistencia equivalente.' }))),
  ...CIRCUITOS.flatMap(preguntasReparto),
  ...REGLAS.map((r) => elixe(<>¿Verdadero o falso? {r.texto}</>, r.certa ? 'Verdadero' : 'Falso', [r.certa ? 'Falso' : 'Verdadero'], r.explica)),
]

export function Circuitos(p: PropsParada) {
  const tarjetas: Tarxeta[] = [
    {
      titulo: 'En serie: una detrás de otra',
      texto: (
        <>
          <Esquema c={serie(R('R1', 2), R('R2', 4))} V={12} max={380} />
          <Formula>Req = R1 + R2 + …</Formula>
          <Lista items={[<>La {b('intensidad es la misma')} en todas.</>, <>La {b('tensión se reparte')}: V = V1 + V2.</>]} />
        </>
      ),
    },
    {
      titulo: 'En paralelo: unidas por los dos extremos',
      texto: (
        <>
          <Esquema c={par(R('R1', 6), R('R2', 3))} V={12} max={380} />
          <Formula>
            <Frac a="1" b="Req" /> = <Frac a="1" b="R1" /> + <Frac a="1" b="R2" /> + …
          </Formula>
          <Lista items={[<>La {b('tensión es la misma')} en todas.</>, <>La {b('intensidad se reparte')}: I = I1 + I2.</>]} />
          <Truco>
            Con dos resistencias, más rápido: Req = <Frac a="R1 · R2" b="R1 + R2" />. Con dos iguales, la mitad de una.
          </Truco>
        </>
      ),
    },
    {
      titulo: 'Mixto: se simplifica poco a poco',
      texto: (
        <>
          <p>Busca un grupo que esté solo en serie o solo en paralelo, cámbialo por su resistencia equivalente y vuelve a dibujar. Repite hasta que quede una sola: Req.</p>
          <Esquema c={CIRCUITOS[0].c} resalta={[(CIRCUITOS[0].c as { serie: Circuito[] }).serie[1]]} />
        </>
      ),
    },
    { titulo: 'Ejemplo resuelto: ejercicio 8', texto: <EjemploResuelto problema={CIRCUITO_GUIADOS[0]} /> },
    { titulo: 'Ejemplo resuelto: ejercicio 9', texto: <EjemploResuelto problema={CIRCUITO_GUIADOS[1]} /> },
    { titulo: 'Ejemplo resuelto: ejercicio 10', texto: <EjemploResuelto problema={EJ10} /> },
  ]
  const xogos: Xogo[] = [
    { id: 'hoja', titulo: 'Los de la hoja paso a paso', icono: '👣', explica: 'Ejercicios 8, 9, 10 y 11.', crear: (acabar) => <ResuelveConmigo problemas={[CIRCUITO_GUIADOS[0], CIRCUITO_GUIADOS[1], EJ10, CIRCUITO_GUIADOS[2]]} acabar={acabar} /> },
    { id: 'ej21', titulo: 'Ejercicio 21 paso a paso', icono: '🧩', explica: 'Los seis casos de la última página.', crear: (acabar) => <ResuelveConmigo problemas={CIRCUITO_GUIADOS.slice(3, 9)} acabar={acabar} /> },
    { id: 'mas', titulo: 'Más circuitos con pila', icono: '🔋', explica: 'Resistencia equivalente e intensidad.', crear: (acabar) => <ResuelveConmigo problemas={barallar(CIRCUITO_GUIADOS.slice(9)).slice(0, 4)} acabar={acabar} /> },
    { id: 'vf', titulo: 'Serie o paralelo: reglas', icono: '✅', explica: 'Verdadero o falso.', crear: (acabar) => <VerdadeiroFalso frases={REGLAS} acabar={acabar} /> },
    { id: 'solo', titulo: 'Ahora tú solo', icono: '🎯', explica: 'Escribe solo el resultado.', crear: (acabar) => <Practica preguntas={CIRCUITO_PREG} acabar={acabar} /> },
  ]
  return <Parada {...p} unidade={U} id="circuitos" titulo="Serie, paralelo y mixto" tarxetas={tarjetas} xogos={xogos} preguntas={CIRCUITO_PREG} />
}

// ===================================================================================================
// 5. Esquemas, símbolos y pilas
// ===================================================================================================

const L = (nombre: string): Elemento => ({ nombre, r: 1, tipo: 'lampara' })

/** Descripciones de circuitos (ejercicios 12 y 13 y otros) con su esquema bueno y dos parecidos. */
const DESCRITOS: { texto: string; bueno: Circuito; malos: Circuito[] }[] = [
  { texto: 'Una batería, una bombilla y una resistencia en serie, con un interruptor (ejercicio 12).', bueno: serie(L('L'), R('R', 0)), malos: [par(L('L'), R('R', 0)), serie(L('L'))] },
  { texto: 'Una bombilla y una resistencia en paralelo, con batería e interruptor (ejercicio 13).', bueno: par(L('L'), R('R', 0)), malos: [serie(L('L'), R('R', 0)), par(L('L1'), L('L2'))] },
  { texto: 'Dos bombillas en serie.', bueno: serie(L('L1'), L('L2')), malos: [par(L('L1'), L('L2')), serie(L('L1'), R('R', 0))] },
  { texto: 'Dos bombillas en paralelo.', bueno: par(L('L1'), L('L2')), malos: [serie(L('L1'), L('L2')), par(L('L1'), R('R', 0))] },
  { texto: 'Una bombilla en serie con otras dos que están en paralelo.', bueno: serie(L('L1'), par(L('L2'), L('L3'))), malos: [par(L('L1'), L('L2'), L('L3')), serie(L('L1'), L('L2'), L('L3'))] },
  { texto: 'Una resistencia en serie con dos bombillas en paralelo.', bueno: serie(R('R', 0), par(L('L1'), L('L2'))), malos: [par(R('R', 0), L('L1'), L('L2')), serie(R('R', 0), L('L1'), L('L2'))] },
]

const ELEMENTOS_CIRCUITO: { texto: string; caixa: string }[] = [
  { texto: 'Pila', caixa: 'generador' },
  { texto: 'Batería', caixa: 'generador' },
  { texto: 'Fuente de alimentación', caixa: 'generador' },
  { texto: 'Lámpara', caixa: 'receptor' },
  { texto: 'Motor', caixa: 'receptor' },
  { texto: 'Zumbador', caixa: 'receptor' },
  { texto: 'Timbre', caixa: 'receptor' },
  { texto: 'Interruptor', caixa: 'control' },
  { texto: 'Conmutador', caixa: 'control' },
  { texto: 'Pulsador', caixa: 'control' },
  { texto: 'Relé', caixa: 'control' },
  { texto: 'Fusible', caixa: 'proteccion' },
  { texto: 'Interruptor diferencial', caixa: 'proteccion' },
]
const NOMBRE_CAJA: Record<string, string> = { generador: 'Generador', receptor: 'Receptor', control: 'Elemento de control', proteccion: 'Elemento de protección' }

const PILAS: { n: number; V: number; como: 'serie' | 'paralelo' }[] = [
  { n: 3, V: 1.5, como: 'serie' },
  { n: 3, V: 1.5, como: 'paralelo' },
  { n: 4, V: 1.5, como: 'serie' },
  { n: 2, V: 9, como: 'serie' },
  { n: 2, V: 4.5, como: 'paralelo' },
  { n: 2, V: 1.5, como: 'serie' },
]

const SIMBOLO_PREG: Pregunta[] = [
  ...SIMBOLOS.map((s) => elixe('¿Qué es este símbolo?', NOMBRE_SIMBOLO[s], barallar(SIMBOLOS.filter((x) => x !== s)).slice(0, 3).map((x) => NOMBRE_SIMBOLO[x]), <>Es el símbolo de: {NOMBRE_SIMBOLO[s].toLowerCase()}.</>, <SimboloSvg s={s} tam={160} />)),
  ...SIMBOLOS.map((s) => toca(<>Toca el símbolo: {NOMBRE_SIMBOLO[s].toLowerCase()}.</>, tablaSimbolos(SIMBOLOS), NOMBRE_SIMBOLO, s, <>Este es el de {NOMBRE_SIMBOLO[s].toLowerCase()}.</>)),
  ...DESCRITOS.map((d, i) => {
    const opciones = barallar([{ id: 'bueno', c: d.bueno }, ...d.malos.map((c, k) => ({ id: `malo${k}`, c }))])
    return toca(<>Toca el esquema: {d.texto}</>, variosEsquemas(opciones), { bueno: 'el bueno', malo0: 'otro circuito', malo1: 'otro circuito' }, 'bueno', <>{i < 2 ? 'Así se dibuja en el examen.' : 'Fíjate en si van una detrás de otra (serie) o en ramas (paralelo).'}</>)
  }),
  ...PILAS.map((x) => {
    const V = pilas(x.n, x.V, x.como)
    return { tipo: 'numero' as const, texto: <>¿Qué tensión dan {x.n} pilas de {num(x.V)} V en {x.como}?</>, valor: V, unidade: 'V', marxe: 0.01, explica: x.como === 'serie' ? <>En serie se suman: {Array(x.n).fill(num(x.V)).join(' + ')} = {num(V)} V.</> : <>En paralelo dan la tensión de una sola: {num(V)} V (pero duran más).</> }
  }),
  ...ELEMENTOS_CIRCUITO.map((e) => elixe(<>¿Qué tipo de elemento es: {e.texto.toLowerCase()}?</>, NOMBRE_CAJA[e.caixa], Object.values(NOMBRE_CAJA).filter((x) => x !== NOMBRE_CAJA[e.caixa]), <>Generadores: dan la energía. Receptores: la transforman (luz, movimiento, sonido). Control: dirigen o cortan la corriente. Protección: protegen el circuito.</>)),
  elixe('¿Cuál es el sentido real de la corriente?', 'El de los electrones: del polo − al polo +', ['Del polo + al polo −', 'No tiene sentido'], 'Para resolver circuitos se usa el sentido convencional, de + a −.'),
  elixe('¿Cuál es el sentido convencional de la corriente?', 'Del polo + al polo −', ['Del polo − al polo +', 'El de los electrones'], 'El que tendrían las cargas positivas.'),
  elixe('¿Qué material es aislante?', 'El plástico', ['El cobre', 'El aluminio', 'La plata'], 'Los metales son conductores; el plástico y la madera, aislantes.'),
  elixe('Un cuerpo está cargado negativamente porque…', 'ha ganado electrones', ['ha perdido electrones', 'ha ganado protones', 'ha perdido neutrones'], 'Exceso de electrones: carga negativa. Defecto: positiva.'),
]

export function Esquemas(p: PropsParada) {
  const tarjetas: Tarxeta[] = [
    {
      titulo: 'Los símbolos del tema',
      texto: (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {SIMBOLOS.map((s) => (
            <div key={s} className="rounded-2xl border-2 border-violet-100 bg-white p-2 text-center">
              <SimboloSvg s={s} tam={110} />
              <b className="text-base">{NOMBRE_SIMBOLO[s]}</b>
            </div>
          ))}
        </div>
      ),
    },
    {
      titulo: 'Dibujar un esquema (ejercicios 1, 12 y 13)',
      texto: (
        <>
          <Lista items={[<>Cada aparato se cambia por {b('su símbolo')}.</>, <>Los cables, {b('líneas rectas')} con esquinas en ángulo recto.</>, <>Si van {b('uno detrás de otro')} → en serie, en la misma línea.</>, <>Si van {b('en ramas')} que salen de un punto y se juntan en otro → en paralelo; marca los puntos de conexión.</>]} />
          <div className="grid gap-2 sm:grid-cols-2">
            <Caixa titulo="Ejercicio 12: en serie">
              <Esquema c={serie(L('L'), R('R', 0))} conValores={false} interruptor max={300} />
            </Caixa>
            <Caixa titulo="Ejercicio 13: en paralelo">
              <Esquema c={par(L('L'), R('R', 0))} conValores={false} interruptor max={300} />
            </Caixa>
          </div>
        </>
      ),
    },
    {
      titulo: 'Las partes de un circuito',
      texto: (
        <div className="grid gap-2 sm:grid-cols-2">
          <Caixa titulo="🔋 Generadores">Dan la energía: pilas, baterías, fuentes de alimentación.</Caixa>
          <Caixa titulo="💡 Receptores">Transforman la energía: lámparas, motores, timbres, zumbadores, resistencias.</Caixa>
          <Caixa titulo="🔘 Control">Dirigen o cortan la corriente: interruptores, conmutadores, pulsadores, relés.</Caixa>
          <Caixa titulo="🛡️ Protección">Protegen el circuito: fusibles, interruptores diferenciales.</Caixa>
        </div>
      ),
    },
    {
      titulo: 'Pilas en serie y en paralelo',
      texto: (
        <div className="grid gap-2 sm:grid-cols-2">
          <Caixa titulo="En serie (polos opuestos unidos)">
            Se suman: 1,5 + 1,5 + 1,5 = <b>4,5 V</b>
          </Caixa>
          <Caixa titulo="En paralelo (pilas iguales)">
            La tensión de una sola: <b>1,5 V</b>, pero duran más.
          </Caixa>
        </div>
      ),
    },
  ]
  const xogos: Xogo[] = [
    { id: 'simbolos', titulo: '¿Qué símbolo es?', icono: '🔣', explica: 'Los once símbolos de la tabla.', crear: (acabar) => <Practica preguntas={SIMBOLO_PREG.slice(0, SIMBOLOS.length * 2)} acabar={acabar} /> },
    { id: 'esquemas', titulo: 'Elige el esquema', icono: '📐', explica: 'Como los ejercicios 12 y 13.', crear: (acabar) => <Proba practica cantas={DESCRITOS.length} preguntas={SIMBOLO_PREG.slice(SIMBOLOS.length * 2, SIMBOLOS.length * 2 + DESCRITOS.length)} acabar={acabar} /> },
    {
      id: 'partes',
      titulo: 'Clasifica',
      icono: '🗂️',
      explica: 'Generador, receptor, control o protección.',
      crear: (acabar) => (
        <Clasifica
          caixas={[
            { id: 'generador', nome: 'Generador', cor: 'border-amber-300 bg-amber-100' },
            { id: 'receptor', nome: 'Receptor', cor: 'border-sky-300 bg-sky-100' },
            { id: 'control', nome: 'Control', cor: 'border-violet-300 bg-violet-100' },
            { id: 'proteccion', nome: 'Protección', cor: 'border-rose-300 bg-rose-100' },
          ]}
          elementos={barallar(ELEMENTOS_CIRCUITO).slice(0, 9)}
          acabar={acabar}
        />
      ),
    },
  ]
  return <Parada {...p} unidade={U} id="esquemas" titulo="Esquemas, símbolos y pilas" tarxetas={tarjetas} xogos={xogos} preguntas={SIMBOLO_PREG} />
}

export const PREGUNTAS_ELECTRICIDAD: Record<string, Pregunta[]> = {
  carga: CARGA_PREG,
  ohm: OHM_PREG,
  hilo: HILO_PREG,
  circuitos: CIRCUITO_PREG,
  esquemas: SIMBOLO_PREG,
}
export const GUIADOS = { CARGA_GUIADOS, OHM_GUIADOS, HILO_GUIADOS, CIRCUITO_GUIADOS, EJ10 }
