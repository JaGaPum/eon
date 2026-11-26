// Física y Química 2.º ESO, global de la 1.ª evaluación: lo que entra además del parcial. Leyes de Gay-Lussac y
// Charles (con sus gráficas), temperaturas de fusión y ebullición, cómo se presenta la materia, disoluciones, de qué
// está formada la materia y la tabla periódica (solo lo subrayado). Las soluciones las calculan src/lib/fisica.ts y
// src/lib/materia.ts.
import type { ReactNode } from 'react'
import { Clasifica, Ordena, Proba, Une, VerdadeiroFalso, barallar, type Pregunta, type Tarxeta, type Xogo } from '../../primaria/pezas'
import { elixe } from '../../primaria/paisaxes/preguntas'
import { Caixa, Lista, Parada, Truco, b } from '../../historia/parcial1/roma'
import { LEYES_GASES, NOMBRE_CONSTANTE, SUSTANCIAS, boyle, calentamiento, celsius, charles, escribe, estadoA, gayLussac, kelvin, queSustancias, sustancia, tramos, type Constante } from '../../lib/fisica'
import { ELEMENTOS, atomos, clase, conSubindices, describe, elemento, esGasNoble, estadoDisolucion, mezclar, papeles, posicion, simbolosMal, totalAtomos } from '../../lib/materia'
import { GraficaBoyle, GraficaT } from '../fq1/debuxos'
import { Atomo, Bolitas, GraficaRecta, LeyendaBolitas, TablaPeriodica } from './debuxos'
import {
  ACT11,
  ACT14,
  ACT15,
  ACT17,
  ACT2,
  ACT26,
  ACT27,
  ACT5,
  AIRE,
  ALCOHOL_YODADO,
  ALEACIONES,
  ATOMOS_DIBUJO,
  DIBUJOS_67,
  EBULLICION,
  EJEMPLO2,
  EJEMPLOS_58,
  EVAPORACION,
  MODELOS,
  PARTICULAS,
  SIMBOLOS_REGLAS,
  SUSTANCIAS_66,
  TABLAS_GASES,
  TABLA_IDEAS,
} from './datos'

type PropsParada = { ruta: string; modo?: string }
const U = 'fq2'
const numero = (texto: ReactNode, valor: number, unidade: string, explica: ReactNode, marxe = 0.01): Pregunta => ({ tipo: 'numero', texto, valor, unidade, explica, marxe })
const Formula = ({ children }: { children: ReactNode }) => <div className="my-2 rounded-2xl bg-violet-50 p-3 text-center font-mono text-xl font-bold text-violet-900">{children}</div>
const Practica = ({ preguntas, acabar }: { preguntas: Pregunta[]; acabar: () => void }) => <Proba practica cantas={8} preguntas={preguntas} acabar={acabar} />
const Visual = ({ children }: { children: ReactNode }) => <div className="mt-2 rounded-2xl border-2 border-violet-100 bg-white p-2 text-base font-normal">{children}</div>
const yLista = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} y ${xs[xs.length - 1]}`)
const conArticulo = (s: string) => `el ${s}`

// ===================================================================================================
// 1. Leyes de Gay-Lussac y Charles (páginas 38 y 39)
// ===================================================================================================

const CONSTANTES: Constante[] = ['T', 'V', 'p']
const GRAF_GL = <GraficaRecta puntos={TABLAS_GASES.V.map(([p, T]) => [T, p])} ejeX="T (K)" ejeY="p (atm)" />
const GRAF_CH = <GraficaRecta puntos={TABLAS_GASES.p.map(([V, T]) => [T, V])} ejeX="T (K)" ejeY="V (L)" />
const GRAF_BO = <GraficaBoyle k={15} puntos={TABLAS_GASES.T.map(([V]) => V)} />

const TEMPERATURAS_K = [200, 250, 300, 350, 400, 500, 600]
const CANTIDADES = [0.5, 1, 1.5, 2, 3, 4, 5, 6]

/** Problemas de Gay-Lussac (V = cte.) y Charles (p = cte.) con temperaturas en °C, como en el libro. */
function problemasT(c: 'V' | 'p', n: number): Pregunta[] {
  const r: Pregunta[] = []
  const [mag, uni, nom] = c === 'V' ? ['presión', 'atm', 'p'] : ['volumen', 'L', 'V']
  const ley = LEYES_GASES[c]
  for (let i = 0; r.length < n && i < 200; i++) {
    const T1 = TEMPERATURAS_K[i % TEMPERATURAS_K.length]
    const T2 = TEMPERATURAS_K[(i * 3 + 2) % TEMPERATURAS_K.length]
    if (T1 === T2) continue
    const x1 = CANTIDADES[(i * 5 + 1) % CANTIDADES.length]
    const x2 = (c === 'V' ? gayLussac : charles)(x1, T1, null, T2)
    if (Math.abs(x2 * 100 - Math.round(x2 * 100)) > 1e-9) continue
    const t1 = celsius(T1)
    const t2 = celsius(T2)
    const fijo = c === 'V' ? `en un recipiente cerrado de ${[2, 5, 10][i % 3]} L` : `a una presión constante de ${[1, 2, 3][i % 3]} atm`
    const datos1 = c === 'V' ? `${escribe(x1)} atm` : `${escribe(x1)} L`
    if (i % 2 === 0)
      r.push(
        numero(
          <>
            Un gas {fijo} tiene {c === 'V' ? 'una presión' : 'un volumen'} de {datos1} a {t1} °C. ¿Qué {mag} tendrá a {t2} °C?
          </>,
          x2,
          uni,
          <>
            {c === 'V' ? 'V' : 'p'} = cte. → ley de {ley.ley}: {ley.formula}. T₁ = {t1} + 273 = {T1} K; T₂ = {t2} + 273 = {T2} K. {nom}₂ = {escribe(x1)} · {T2} / {T1} = {escribe(x2)} {uni}.
          </>,
        ),
      )
    else
      r.push(
        numero(
          <>
            Un gas {fijo} tiene {c === 'V' ? 'una presión' : 'un volumen'} de {datos1} a {t1} °C. ¿A qué temperatura (en °C) su {mag} será de {escribe(x2)} {uni}?
          </>,
          t2,
          '°C',
          <>
            Ley de {ley.ley}: T₂ = {nom}₂ · T₁ / {nom}₁ = {escribe(x2)} · {T1} / {escribe(x1)} = {T2} K → {T2} − 273 = {t2} °C.
          </>,
          0.5,
        ),
      )
  }
  return r
}

const GASES_FIJAS: Pregunta[] = [
  numero(<>Ejemplo resuelto 2 a): en un recipiente de 3 L hay un gas a 60 °C y 2 atm. ¿A qué temperatura (en °C) ejercerá 4 atm sin que varíe el volumen?</>, EJEMPLO2.T2C, '°C', <>V = cte. → Gay-Lussac. T₁ = 60 + 273 = {EJEMPLO2.T1} K. T₂ = 4 · {EJEMPLO2.T1} / 2 = {EJEMPLO2.T2} K = {EJEMPLO2.T2C} °C.</>, 0.5),
  numero(<>Ejemplo resuelto 2 b): ahora el gas mantiene los 4 atm y su volumen pasa de 3 L a 6 L. ¿Cuál será su temperatura en °C? (Antes estaba a {EJEMPLO2.T2} K.)</>, EJEMPLO2.T3C, '°C', <>p = cte. → Charles: T₃ = V₃ · T₂ / V₂ = 6 · {EJEMPLO2.T2} / 3 = {EJEMPLO2.T3} K = {EJEMPLO2.T3C} °C.</>, 0.5),
  numero(<>Actividad 14: en un recipiente de 3 L hay nitrógeno a 4 atm. ¿Qué presión tendrá si el volumen se duplica sin variar la temperatura?</>, ACT14.p2, 'atm', <>T = cte. → Boyle-Mariotte: p₂ = 4 · 3 / 6 = {escribe(ACT14.p2)} atm. Si el volumen se duplica, la presión se reduce a la mitad.</>),
  numero(<>Actividad 15: se introduce oxígeno en un recipiente de 10 L a 4 atm y 20 °C. ¿Cuál será su presión a 40 °C sin variar el volumen?</>, ACT15.p2, 'atm', <>V = cte. → Gay-Lussac. T₁ = 293 K, T₂ = 313 K. p₂ = 4 · 313 / 293 = {escribe(ACT15.p2, 2)} atm. Si usas °C sale 8 atm: ¡mal! La temperatura va siempre en kelvin.</>),
  numero('Ejemplo resuelto 1: en 3 L hay un gas a 2 atm y 60 °C. ¿Qué volumen ocupa si la presión se duplica a 4 atm y no varía la temperatura?', boyle(2, 3, 4, null), 'L', <>T = cte. → Boyle-Mariotte: V₂ = 2 · 3 / 4 = 1,5 L.</>),
  ...[27, -73, 100, 60, 0, 20].map((t) => numero(<>Pasa {t} °C a kelvin.</>, kelvin(t), 'K', <>T (K) = T (°C) + 273 = {t} + 273 = {kelvin(t)} K.</>, 0)),
  ...[300, 400, 273, 666].map((T) => numero(<>Pasa {T} K a grados Celsius.</>, celsius(T), '°C', <>T (°C) = T (K) − 273 = {T} − 273 = {celsius(T)} °C.</>, 0)),
  numero(<>Lee la gráfica de Charles: ¿qué volumen ocupa el gas a 300 K?</>, charles(2, 100, null, 300), 'L', <>V/T = 2/100 = 0,02 L/K → V = 0,02 · 300 = 6 L.</>),
  numero(<>En la tabla de Gay-Lussac, ¿qué presión tendría el gas a 1000 K?</>, gayLussac(0.5, 200, null, 1000), 'atm', <>p/T = 0,5/200 → p = 0,5 · 1000 / 200 = 2,5 atm.</>),
  ...CONSTANTES.map((c) => elixe(<>Si en un gas se mantiene constante la {NOMBRE_CONSTANTE[c]}, ¿qué ley aplicas?</>, LEYES_GASES[c].ley, CONSTANTES.filter((x) => x !== c).map((x) => LEYES_GASES[x].ley), <>{NOMBRE_CONSTANTE[c][0].toUpperCase() + NOMBRE_CONSTANTE[c].slice(1)} constante → {LEYES_GASES[c].ley}: {LEYES_GASES[c].formula}.</>)),
  ...CONSTANTES.map((c) => elixe(<>¿Cuál es la fórmula de la ley de {LEYES_GASES[c].ley}?</>, LEYES_GASES[c].formula, CONSTANTES.filter((x) => x !== c).map((x) => LEYES_GASES[x].formula), <>Se aplica con {NOMBRE_CONSTANTE[c]} constante.</>)),
  ...CONSTANTES.map((c) => elixe(<>En la ley de {LEYES_GASES[c].ley}, {LEYES_GASES[c].varian} son…</>, `Magnitudes ${LEYES_GASES[c].relacion}`, [`Magnitudes ${c === 'T' ? 'directamente' : 'inversamente'} proporcionales`, 'Magnitudes que no tienen relación'], <>{c === 'T' ? 'Cuanto mayor es el volumen, menor es la presión.' : 'Cuanto mayor es la temperatura, mayor es la ' + (c === 'V' ? 'presión.' : 'volumen.')}</>)),
  ...CONSTANTES.map((c) => elixe(<>¿Qué forma tiene la gráfica de la ley de {LEYES_GASES[c].ley}?</>, LEYES_GASES[c].grafica[0].toUpperCase() + LEYES_GASES[c].grafica.slice(1), ['Una hipérbola', 'Una recta que pasa por el (0, 0)', 'Una recta horizontal'].filter((x) => x.toLowerCase() !== LEYES_GASES[c].grafica), <>{c === 'T' ? 'p frente a V: una hipérbola.' : 'Frente a la temperatura en kelvin: una recta que pasa por el origen.'}</>, c === 'T' ? GRAF_BO : c === 'V' ? GRAF_GL : GRAF_CH)),
  elixe('¿Qué dice la ley de Gay-Lussac?', 'A volumen constante, el cociente entre la presión de un gas y su temperatura absoluta permanece constante', ['A presión constante, el cociente entre el volumen y la temperatura permanece constante', 'A temperatura constante, el producto de la presión por el volumen permanece constante'], 'p/T = cte.'),
  elixe('¿Qué dice la ley de Charles?', 'A presión constante, el cociente entre el volumen de un gas y su temperatura absoluta permanece constante', ['A volumen constante, el cociente entre la presión y la temperatura permanece constante', 'A temperatura constante, el producto de la presión por el volumen permanece constante'], 'V/T = cte.'),
  elixe('En las leyes de Gay-Lussac y Charles, ¿en qué unidad va la temperatura?', 'En kelvin (escala absoluta)', ['En grados Celsius', 'En cualquier unidad', 'En atmósferas'], 'T (K) = T (°C) + 273.'),
  elixe('En la experiencia de Gay-Lussac, ¿qué se hace?', 'Se fija el émbolo, se calienta o enfría y se lee la presión en el manómetro', ['Se sube o baja el émbolo y se lee la presión', 'Se calienta y se mueve el émbolo para que no cambie la presión'], 'V = cte.'),
  elixe('En la experiencia de Charles, ¿qué se hace?', 'Se calienta o enfría y se mueve el émbolo para que no cambie la presión; se anota el volumen', ['Se fija el émbolo y se lee la presión', 'Se sube o baja el émbolo sin calentar'], 'p = cte.'),
  elixe('Un gas se calienta en un recipiente cerrado y rígido. ¿Qué le pasa a su presión?', 'Aumenta (Gay-Lussac)', ['Disminuye', 'No cambia'], 'A volumen constante, presión y temperatura son directamente proporcionales.'),
  elixe('Un globo se mete en el congelador (la presión no cambia). ¿Qué le pasa?', 'Se encoge: disminuye su volumen (Charles)', ['Se hincha', 'No cambia'], 'A presión constante, al bajar la temperatura baja el volumen.'),
]

const GASES_TARXETAS: Tarxeta[] = [
  {
    titulo: 'Las tres leyes de los gases',
    texto: (
      <>
        <p>
          Los gases dependen de tres magnitudes: la {b('presión (p)')}, el {b('volumen (V)')} y la {b('temperatura (T)')}. Para estudiarlas, {b('una se mantiene constante')} y las otras dos cambian.
        </p>
        <table className="w-full border-collapse text-base">
          <thead>
            <tr className="bg-violet-100">
              <th className="border p-1.5">Constante</th>
              <th className="border p-1.5">Ley</th>
              <th className="border p-1.5">Fórmula</th>
            </tr>
          </thead>
          <tbody>
            {CONSTANTES.map((c) => (
              <tr key={c}>
                <td className="border p-1.5 text-center">{c} = cte.</td>
                <td className="border p-1.5 font-bold">{LEYES_GASES[c].ley}</td>
                <td className="border p-1.5 text-center font-mono">{LEYES_GASES[c].formula}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Truco>Mira qué magnitud NO cambia en el problema: esa te dice qué ley usar.</Truco>
      </>
    ),
  },
  {
    titulo: 'Ley de Gay-Lussac (V = cte.)',
    texto: (
      <>
        <p>
          A {b('volumen constante')}, el {b('cociente entre la presión')} que ejerce un gas {b('y su temperatura absoluta')} permanece constante.
        </p>
        <Formula>p / T = cte. → p₁ / T₁ = p₂ / T₂</Formula>
        <p>
          La presión y la temperatura son {b('directamente proporcionales')}: a más temperatura, más presión. La gráfica es una {b('recta que pasa por el (0, 0)')}.
        </p>
        <p className="text-base text-slate-600">Experiencia: fijamos el émbolo, calentamos o enfriamos y leemos la presión en el manómetro.</p>
      </>
    ),
    visual: GRAF_GL,
  },
  {
    titulo: 'Ley de Charles (p = cte.)',
    texto: (
      <>
        <p>
          A {b('presión constante')}, el {b('cociente entre el volumen')} de un gas {b('y su temperatura absoluta')} permanece constante.
        </p>
        <Formula>V / T = cte. → V₁ / T₁ = V₂ / T₂</Formula>
        <p>
          El volumen y la temperatura son {b('directamente proporcionales')}. La gráfica también es una {b('recta que pasa por el (0, 0)')}.
        </p>
        <p className="text-base text-slate-600">Experiencia: calentamos o enfriamos y subimos o bajamos el émbolo para que no cambie la presión. Anotamos V.</p>
      </>
    ),
    visual: GRAF_CH,
  },
  {
    titulo: 'La temperatura, siempre en kelvin',
    texto: (
      <>
        <Formula>T (K) = T (°C) + 273</Formula>
        <p>
          En Gay-Lussac y Charles la temperatura se mide en {b('escala Kelvin o absoluta')}. Al final, si te la piden en °C, resta 273.
        </p>
        <Truco>Actividad 15: de 20 °C a 40 °C la presión NO se duplica. De 293 K a 313 K sube muy poco: 4 atm → 4,27 atm.</Truco>
      </>
    ),
  },
  {
    titulo: 'Boyle-Mariotte: la hipérbola',
    texto: (
      <p>
        Recuerda: a {b('temperatura constante')}, p · V = cte. La presión y el volumen son {b('inversamente proporcionales')} y la gráfica es una {b('hipérbola')}. La tabla del libro: 30 L → 0,5 atm; 15 L → 1 atm; 5 L → 3 atm; 3 L → 5 atm.
      </p>
    ),
    visual: GRAF_BO,
  },
  {
    titulo: 'Ejemplo resuelto 2: dos pasos',
    texto: (
      <>
        <div className="grid grid-cols-3 gap-2 text-base">
          <Caixa titulo="Estado 1">
            p₁ = 2 atm
            <br />T₁ = 60 °C
            <br />V₁ = 3 L
          </Caixa>
          <Caixa titulo="Estado 2">
            p₂ = 4 atm
            <br />T₂ = ?
            <br />V₂ = 3 L
          </Caixa>
          <Caixa titulo="Estado 3">
            p₃ = 4 atm
            <br />T₃ = ?
            <br />V₃ = 6 L
          </Caixa>
        </div>
        <Lista
          items={[
            <>
              1 → 2: V = cte. → {b('Gay-Lussac')}. T₂ = p₂ · T₁ / p₁ = 4 · 333 / 2 = {EJEMPLO2.T2} K = {b(`${EJEMPLO2.T2C} °C`)}.
            </>,
            <>
              2 → 3: p = cte. → {b('Charles')}. T₃ = V₃ · T₂ / V₂ = 6 · {EJEMPLO2.T2} / 3 = {EJEMPLO2.T3} K = {b(`${EJEMPLO2.T3C} °C`)}.
            </>,
          ]}
        />
      </>
    ),
  },
]

const GASES_XOGOS: Xogo[] = [
  { id: 'cual', titulo: '¿Qué ley es?', icono: '🧭', explica: 'Qué es constante, fórmulas y gráficas.', crear: (acabar) => <Practica preguntas={GASES_FIJAS.filter((p) => p.tipo === 'elixe')} acabar={acabar} /> },
  { id: 'kelvin', titulo: 'Kelvin y libro', icono: '🌡️', explica: 'Pasar a kelvin, ejemplos y actividades 14 y 15.', crear: (acabar) => <Practica preguntas={GASES_FIJAS.filter((p) => p.tipo === 'numero')} acabar={acabar} /> },
  { id: 'problemas', titulo: 'Problemas', icono: '🎈', explica: 'Gay-Lussac y Charles con temperaturas en °C.', crear: (acabar) => <Practica preguntas={[...problemasT('V', 14), ...problemasT('p', 14)]} acabar={acabar} /> },
  {
    id: 'une',
    titulo: 'Une cada ley',
    icono: '🔗',
    explica: 'Con lo que se mantiene constante.',
    crear: (acabar) => <Une pares={CONSTANTES.map((c) => ({ palabra: LEYES_GASES[c].ley, significado: `${NOMBRE_CONSTANTE[c]} constante: ${LEYES_GASES[c].formula}` }))} acabar={acabar} />,
  },
]

const GASES_PREG: Pregunta[] = [...GASES_FIJAS, ...problemasT('V', 8), ...problemasT('p', 8)]

export function Gases(p: PropsParada) {
  return <Parada {...p} unidade={U} id="gases" titulo="Leyes de Gay-Lussac y Charles" tarxetas={GASES_TARXETAS} xogos={GASES_XOGOS} preguntas={GASES_PREG} />
}

// ===================================================================================================
// 2. ¿En qué estado está? Fusión, ebullición y evaporación (páginas 40, 41 y 44)
// ===================================================================================================

const TablaTemperaturas = () => (
  <table className="w-full border-collapse text-base">
    <thead>
      <tr className="bg-violet-100">
        <th className="border p-1.5">Sustancia</th>
        <th className="border p-1.5">Fusión (°C)</th>
        <th className="border p-1.5">Ebullición (°C)</th>
      </tr>
    </thead>
    <tbody>
      {SUSTANCIAS.map((s) => (
        <tr key={s.nombre}>
          <td className="border p-1.5 capitalize">{s.nombre}</td>
          <td className="border p-1.5 text-center">{s.fusion}</td>
          <td className="border p-1.5 text-center">{s.ebullicion}</td>
        </tr>
      ))}
    </tbody>
  </table>
)

const HIELO = calentamiento(sustancia('agua'), -20, 10, 10, 2)
const HERVIR = calentamiento(sustancia('agua'), 20, 160, 20, 2)
const alcohol = sustancia('alcohol')

/** Actividad 27 y otras parecidas: todas las sustancias de la tabla que cumplen la condición (lo calcula el código). */
function preguntaQueSustancia([estado, T]: ['sólido' | 'líquido' | 'gas', number], libro = false): Pregunta | null {
  const si = queSustancias(estado, T)
  if (!si.length) return null
  const no = barallar(SUSTANCIAS.map((s) => s.nombre).filter((n) => !si.includes(n))).slice(0, 3)
  return elixe(
    <>
      {libro && 'Actividad 27: '}¿Qué sustancia de las tablas está en estado {estado === 'gas' ? 'gaseoso' : estado} a {T} °C (y 1 atm)?
    </>,
    yLista(si.map(conArticulo)),
    no.map(conArticulo),
    <>
      {si.map((n) => {
        const s = sustancia(n)
        return `El ${n} funde a ${s.fusion} °C y hierve a ${s.ebullicion} °C. `
      })}
      {si.length > 1 && 'Hay dos que valen.'}
    </>,
  )
}

const ESTADOS2_FIJAS: Pregunta[] = [
  ...ACT26.map((T) => {
    const e = estadoA(alcohol, T)
    return elixe(<>Actividad 26: ¿en qué estado está el alcohol a {T} °C (1 atm)?</>, e, ['sólido', 'líquido', 'gas', 'líquido y gas (hirviendo)'].filter((x) => x !== e).slice(0, 3), <>El alcohol funde a −114 °C y hierve a 78 °C: a {T} °C está {e}.</>)
  }),
  ...ACT27.map((x) => preguntaQueSustancia(x, true)).filter((p): p is Pregunta => p !== null),
  ...([['gas', 400], ['sólido', -50], ['líquido', 1100], ['sólido', 900], ['gas', 120], ['líquido', -150]] as const).map((x) => preguntaQueSustancia([x[0], x[1]])).filter((p): p is Pregunta => p !== null),
  ...SUSTANCIAS.slice(0, 6).map((s) => numero(<>Según la tabla, ¿a qué temperatura funde el {s.nombre}?</>, s.fusion, '°C', <>Temperatura de fusión del {s.nombre}: {s.fusion} °C (también se solidifica a esa temperatura).</>, 0)),
  ...SUSTANCIAS.slice(2).map((s) => numero(<>Según la tabla, ¿a qué temperatura hierve el {s.nombre}?</>, s.ebullicion, '°C', <>Temperatura de ebullición del {s.nombre}: {s.ebullicion} °C (también se condensa a esa temperatura).</>, 0)),
  elixe('¿Cómo se llama el cambio de sólido a líquido?', 'Fusión', ['Solidificación', 'Vaporización', 'Condensación'], 'Y de líquido a sólido, solidificación.'),
  elixe('¿Cómo se llama el cambio de gas a líquido?', 'Condensación (o licuación)', ['Vaporización', 'Sublimación', 'Fusión'], 'Y de líquido a gas, vaporización.'),
  elixe('Para una sustancia pura, ¿a qué temperatura se produce la solidificación?', 'A la misma que la fusión', ['A una temperatura más baja que la fusión', 'A cualquier temperatura'], 'Ambos cambios se producen a la temperatura o punto de fusión.'),
  elixe('¿Por qué la temperatura de fusión es una propiedad característica?', 'Porque cada sustancia tiene la suya y sirve para identificarla', ['Porque es igual en todas las sustancias', 'Porque depende de la cantidad'], 'La del agua es 0 °C.'),
  elixe('¿De qué depende la temperatura de ebullición del agua (100 °C)?', 'De la presión: es 100 °C cuando la presión es 1 atmósfera', ['De la cantidad de agua', 'Del tamaño del recipiente', 'De la potencia del fuego'], 'Página 41.'),
  elixe('Mientras el hielo se convierte en agua a 0 °C, ¿qué pasa con la temperatura si seguimos calentando?', 'No varía', ['Sube', 'Baja'], 'El calor se invierte en el cambio de estado.', <GraficaT puntos={HIELO} rotulos={tramos(sustancia('agua'), HIELO)} />),
  elixe('En la gráfica de la ebullición del agua, ¿qué hay en el tramo horizontal?', 'Agua + vapor', ['Solo agua', 'Solo vapor', 'Hielo + agua'], 'A 100 °C el agua se convierte en vapor y la temperatura no varía.', <GraficaT puntos={HERVIR} rotulos={tramos(sustancia('agua'), HERVIR)} />),
  elixe('¿Dónde tiene lugar la evaporación?', 'Solo en la superficie del líquido', ['En toda la masa del líquido', 'Solo en el fondo del recipiente'], EVAPORACION[0]),
  elixe('¿Dónde tiene lugar la ebullición?', 'En toda la masa del líquido', ['Solo en la superficie', 'Solo en las paredes'], EBULLICION[0]),
  elixe('¿A qué temperatura ocurre la evaporación?', 'A cualquier temperatura', ['Solo a la de ebullición', 'Solo por encima de 50 °C'], EVAPORACION[1]),
  elixe('¿Cuál de estas cosas NO hace más rápida la evaporación?', 'Tapar el recipiente', ['Calentar el líquido', 'Aumentar la superficie del líquido', 'Que sople el viento'], EVAPORACION[2]),
  elixe('¿Depende la ebullición de que la superficie del líquido sea mayor o menor?', 'No: solo empieza al alcanzar la temperatura de ebullición', ['Sí: con más superficie hierve antes', 'Sí: con menos superficie hierve antes'], EBULLICION[2]),
  elixe('¿Qué diferencia hay entre un gas y un vapor?', 'Gas: es gas a temperatura ambiente. Vapor: un gas que normalmente no está en estado gaseoso, como el vapor de agua', ['Son lo mismo', 'El vapor siempre está a 100 °C'], 'Página 44.'),
]

const ESTADOS2_TARXETAS: Tarxeta[] = [
  {
    titulo: 'Fusión y solidificación',
    texto: (
      <>
        <p>
          De {b('sólido a líquido')}: {b('fusión')}. De {b('líquido a sólido')}: {b('solidificación')}.
        </p>
        <p>
          Para una sustancia pura, los dos cambios se producen a la misma temperatura: la {b('temperatura o punto de fusión')}. Es una {b('propiedad característica')}: la del agua es 0 °C.
        </p>
        <p>Mientras el hielo se funde, la temperatura no varía aunque sigamos calentando. Cuando todo es agua, vuelve a subir.</p>
      </>
    ),
    visual: <GraficaT puntos={HIELO} rotulos={tramos(sustancia('agua'), HIELO)} />,
  },
  {
    titulo: 'Vaporización y condensación',
    texto: (
      <>
        <p>
          De {b('líquido a gas')}: {b('vaporización')}. De {b('gas a líquido')}: {b('condensación (o licuación)')}.
        </p>
        <p>
          Los dos se producen a la {b('temperatura o punto de ebullición')}. La del agua es {b('100 °C cuando la presión es 1 atmósfera')}.
        </p>
      </>
    ),
    visual: <GraficaT puntos={HERVIR} rotulos={tramos(sustancia('agua'), HERVIR)} />,
  },
  {
    titulo: 'Las tablas del libro (a 1 atm)',
    texto: (
      <>
        <TablaTemperaturas />
        <Truco>Por debajo de la fusión: sólido. Entre fusión y ebullición: líquido. Por encima de la ebullición: gas. Justo en una de ellas: está cambiando de estado.</Truco>
      </>
    ),
  },
  {
    titulo: 'Evaporación y ebullición',
    texto: (
      <div className="grid gap-2 sm:grid-cols-2">
        <Caixa titulo="Evaporación">
          <Lista items={EVAPORACION} />
        </Caixa>
        <Caixa titulo="Ebullición">
          <Lista items={EBULLICION} />
        </Caixa>
      </div>
    ),
  },
  {
    titulo: 'Gas y vapor',
    texto: (
      <p>
        Llamamos {b('gas')} a la sustancia que es un gas a temperatura ambiente. Llamamos {b('vapor')} al gas que en condiciones normales no está en estado gaseoso, por ejemplo el {b('vapor de agua')}. El estado de una sustancia depende de la {b('temperatura')} y de la {b('presión')}.
      </p>
    ),
  },
]

const ESTADOS2_XOGOS: Xogo[] = [
  { id: 'tabla', titulo: 'Actividades 26 y 27', icono: '🌡️', explica: 'Mira la tabla y responde.', crear: (acabar) => <Practica preguntas={ESTADOS2_FIJAS.slice(0, 18)} acabar={acabar} /> },
  {
    id: 'evap',
    titulo: '¿Evaporación o ebullición?',
    icono: '♨️',
    explica: 'Cada frase en su caja.',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'e', nome: 'Evaporación', cor: 'border-sky-300 bg-sky-100' },
          { id: 'b', nome: 'Ebullición', cor: 'border-orange-300 bg-orange-100' },
        ]}
        elementos={[
          { texto: 'Solo en la superficie', caixa: 'e' },
          { texto: 'A cualquier temperatura', caixa: 'e' },
          { texto: 'Más rápida con viento', caixa: 'e' },
          { texto: 'La ropa tendida se seca', caixa: 'e' },
          { texto: 'En toda la masa del líquido', caixa: 'b' },
          { texto: 'Solo a una temperatura', caixa: 'b' },
          { texto: 'No depende de la superficie', caixa: 'b' },
          { texto: 'El agua de la olla a 100 °C', caixa: 'b' },
        ]}
        acabar={acabar}
      />
    ),
  },
  { id: 'todo', titulo: 'De todo', icono: '🔥', explica: 'Cambios, gráficas y tablas.', crear: (acabar) => <Practica preguntas={ESTADOS2_FIJAS} acabar={acabar} /> },
]

export function Estados2(p: PropsParada) {
  return <Parada {...p} unidade={U} id="estados" titulo="Fusión, ebullición y evaporación" tarxetas={ESTADOS2_TARXETAS} xogos={ESTADOS2_XOGOS} preguntas={ESTADOS2_FIJAS} />
}

// ===================================================================================================
// 3. Cómo se presenta la materia (páginas 58 y 59)
// ===================================================================================================

const FORMULAS_59 = ['O2', 'Au', 'H2O', 'NaCl', 'H2', 'O3', 'CO2', 'C', 'C2H6O', 'Fe', 'NCl3', 'He']

const MATERIA_FIJAS: Pregunta[] = [
  ...EJEMPLOS_58.filter((e) => e.aspecto).map((e) => elixe(<>Según su aspecto, ¿cómo es: {e.nombre.toLowerCase()}?</>, e.aspecto!, [e.aspecto === 'homogéneo' ? 'heterogéneo' : 'homogéneo'], e.porque)),
  ...EJEMPLOS_58.map((e) => elixe(<>Según su composición, ¿qué es: {e.nombre.toLowerCase()}?</>, e.composicion, [e.composicion === 'mezcla' ? 'sustancia pura' : 'mezcla'], e.porque)),
  ...ACT2.map(([n, a, por]) => elixe(<>Actividad 2: {n.toLowerCase()}, ¿tiene un aspecto homogéneo o heterogéneo?</>, a, [a === 'homogéneo' ? 'heterogéneo' : 'homogéneo'], por)),
  ...FORMULAS_59.map((f) => elixe(<>¿{conSubindices(f)} es una sustancia simple o un compuesto?</>, clase(f), [clase(f) === 'compuesto' ? 'sustancia simple' : 'compuesto', 'mezcla'], clase(f) === 'compuesto' ? <>Tiene átomos de {Object.keys(atomos(f)).length} tipos: {Object.keys(atomos(f)).join(', ')}.</> : <>Todos sus átomos son de un único tipo: {Object.keys(atomos(f))[0]}.</>)),
  ...ACT5.map(([f, v, por]) => elixe(<>Actividad 5 (agua con cubitos de hielo): «{f}» ¿Es correcto?</>, v ? 'Correcto' : 'Incorrecto', [v ? 'Incorrecto' : 'Correcto'], por)),
  elixe('¿Qué es la materia?', 'Todo aquello que tiene masa y ocupa un volumen', ['Todo lo que se puede ver', 'Solo los sólidos y los líquidos', 'Todo lo que pesa más de 1 g'], 'Página 58.'),
  elixe('Materia de aspecto homogéneo es aquella en la que…', 'toda la materia muestra el mismo aspecto', ['algunas partes muestran distinto aspecto', 'hay una única sustancia'], 'Según su aspecto: homogéneo o heterogéneo.'),
  elixe('Una sustancia pura es la materia…', 'formada por una única sustancia', ['formada por dos o más sustancias', 'que tiene el mismo aspecto en todas partes'], 'Según su composición: sustancia pura o mezcla.'),
  elixe('Una mezcla es la materia…', 'formada por dos o más sustancias', ['formada por una única sustancia', 'formada por átomos de un solo tipo'], 'Casi toda la materia es una mezcla.'),
  elixe('Las sustancias simples están formadas por…', 'átomos de un único tipo', ['átomos de dos o más tipos', 'dos o más sustancias'], 'Por ejemplo, el oxígeno (O₂) y el oro (Au).'),
  elixe('Los compuestos están formados por…', 'átomos de dos o más tipos', ['átomos de un único tipo', 'dos sustancias mezcladas'], 'Por ejemplo, el agua (H₂O) y la sal de mesa (NaCl).'),
  elixe('En una mezcla homogénea…', 'no se distinguen sus componentes ni con lupa ni con microscopio', ['se distinguen sus componentes a simple vista', 'solo hay una sustancia'], 'Y cualquier parte tiene la misma composición y propiedades, como el suero fisiológico.'),
  elixe('¿Por qué el granito es una mezcla heterogénea?', 'A simple vista se distinguen sus tres minerales: cuarzo, feldespato y mica', ['Porque es duro', 'Porque es una sola sustancia'], 'Página 59.'),
  elixe('La leche tiene aspecto homogéneo. ¿Qué tipo de mezcla es?', 'Heterogénea: al microscopio se distinguen las partículas de grasa', ['Homogénea, porque se ve igual', 'No es una mezcla'], 'Se distinguen sus componentes por procedimientos ópticos (el microscopio).'),
  elixe('El suero fisiológico es agua con sal. ¿Qué es?', 'Una mezcla homogénea', ['Una mezcla heterogénea', 'Una sustancia pura', 'Un compuesto'], 'Cualquier parte tiene la misma composición y propiedades.'),
  elixe('Actividad 6: agua con azúcar bien disuelto (A) y zumo de naranja reposado (B). ¿En cuál se ven partes con diferente aspecto?', 'En el zumo (B): es una mezcla heterogénea', ['En el agua con azúcar (A): es una mezcla heterogénea', 'En ninguna'], 'La pulpa se va al fondo al reposar.'),
  elixe('Actividad 6: ¿cuál tendría el mismo sabor y textura en todas sus partes?', 'El agua con azúcar (A): es una mezcla homogénea', ['El zumo (B): es una mezcla homogénea', 'Las dos'], 'El azúcar disuelto no se distingue.'),
]

const MATERIA_TARXETAS: Tarxeta[] = [
  {
    titulo: 'Qué es la materia',
    texto: (
      <>
        <p>
          {b('Materia')} es todo aquello que {b('tiene masa y ocupa un volumen')}. Se clasifica de dos maneras:
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          <Caixa titulo="Según su aspecto">
            <b>Homogéneo</b>: toda la materia muestra el mismo aspecto.
            <br />
            <b>Heterogéneo</b>: algunas partes muestran distinto aspecto.
          </Caixa>
          <Caixa titulo="Según su composición">
            <b>Sustancia pura</b>: formada por una única sustancia.
            <br />
            <b>Mezcla</b>: formada por dos o más sustancias.
          </Caixa>
        </div>
      </>
    ),
  },
  {
    titulo: 'Sustancias simples y compuestos',
    texto: (
      <>
        <p>En la naturaleza es difícil encontrar sustancias puras. Según su composición pueden ser:</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <Caixa titulo="Sustancias simples">
            Formadas por {b('átomos de un único tipo')}. Por ejemplo, el gas oxígeno (O₂) y el metal oro (Au).
          </Caixa>
          <Caixa titulo="Compuestos">
            Formados por {b('átomos de dos o más tipos')}. Por ejemplo, el agua (H₂O) y la sal de mesa (NaCl).
          </Caixa>
        </div>
        <Truco>Mira la fórmula: si solo hay un símbolo (O₂, Au, O₃), sustancia simple. Si hay dos o más (H₂O, NaCl), compuesto.</Truco>
      </>
    ),
  },
  {
    titulo: 'Mezclas homogéneas y heterogéneas',
    texto: (
      <div className="grid gap-2 sm:grid-cols-2">
        <Caixa titulo="Homogéneas">
          No se distinguen sus componentes por procedimientos ópticos (a simple vista, con lupa, con microscopio). Cualquier parte tiene la misma composición y propiedades. Ej.: el {b('suero fisiológico')} (agua y sal).
        </Caixa>
        <Caixa titulo="Heterogéneas">
          Se distinguen algunos de sus componentes por procedimientos ópticos. Hay partes con distinta composición y propiedades. Ej.: el {b('granito')} (cuarzo, feldespato y mica) y la {b('leche')} (al microscopio se ve la grasa).
        </Caixa>
      </div>
    ),
  },
  {
    titulo: 'Los ejemplos de la página 58',
    texto: (
      <table className="w-full border-collapse text-base">
        <thead>
          <tr className="bg-violet-100">
            <th className="border p-1.5">Materia</th>
            <th className="border p-1.5">Aspecto</th>
            <th className="border p-1.5">Composición</th>
          </tr>
        </thead>
        <tbody>
          {EJEMPLOS_58.map((e) => (
            <tr key={e.nombre}>
              <td className="border p-1.5">{e.nombre}</td>
              <td className="border p-1.5 text-center">{e.aspecto ?? '—'}</td>
              <td className="border p-1.5 text-center">{e.composicion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ),
  },
  {
    titulo: 'Actividad 5: agua con hielo',
    texto: (
      <p>
        Se ven dos partes (hielo y agua), así que su {b('aspecto es heterogéneo')}, pero {b('no es una mezcla')}: el hielo y el agua son {b('la misma sustancia')} en dos estados. Es una sustancia pura.
      </p>
    ),
  },
]

const MATERIA_XOGOS: Xogo[] = [
  {
    id: 'aspecto',
    titulo: '¿Homogéneo o heterogéneo?',
    icono: '🔍',
    explica: 'Según su aspecto.',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'homogéneo', nome: 'Homogéneo', cor: 'border-sky-300 bg-sky-100' },
          { id: 'heterogéneo', nome: 'Heterogéneo', cor: 'border-amber-300 bg-amber-100' },
        ]}
        elementos={[...EJEMPLOS_58.filter((e) => e.aspecto).map((e) => ({ texto: e.nombre, caixa: e.aspecto!, pista: e.porque })), ...ACT2.filter(([n]) => n !== 'Azúcar').map(([n, a, p]) => ({ texto: n, caixa: a, pista: p }))]}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'composicion',
    titulo: '¿Sustancia pura o mezcla?',
    icono: '⚗️',
    explica: 'Según su composición.',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'sustancia pura', nome: 'Sustancia pura', cor: 'border-orange-300 bg-orange-100' },
          { id: 'mezcla', nome: 'Mezcla', cor: 'border-pink-300 bg-pink-100' },
        ]}
        elementos={EJEMPLOS_58.map((e) => ({ texto: e.nombre, caixa: e.composicion, pista: e.porque }))}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'simple',
    titulo: '¿Simple o compuesto?',
    icono: '🧩',
    explica: 'Mira la fórmula.',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'sustancia simple', nome: 'Sustancia simple', cor: 'border-amber-300 bg-amber-100' },
          { id: 'compuesto', nome: 'Compuesto', cor: 'border-violet-300 bg-violet-100' },
        ]}
        elementos={FORMULAS_59.map((f) => ({ texto: conSubindices(f), caixa: clase(f) }))}
        acabar={acabar}
      />
    ),
  },
  { id: 'todo', titulo: 'Preguntas', icono: '❓', explica: 'Definiciones y actividades 5 y 6.', crear: (acabar) => <Practica preguntas={MATERIA_FIJAS} acabar={acabar} /> },
]

export function Materia(p: PropsParada) {
  return <Parada {...p} unidade={U} id="materia" titulo="Cómo se presenta la materia" tarxetas={MATERIA_TARXETAS} xogos={MATERIA_XOGOS} preguntas={MATERIA_FIJAS} />
}

// ===================================================================================================
// 4. Disoluciones (páginas 60 y 61)
// ===================================================================================================

const YODADO = mezclar(ALCOHOL_YODADO)
const papelYodado = papeles(YODADO)
const papelAire = papeles(AIRE)
const ESTADOS = ['sólido', 'líquido', 'gas']

const DISOLUCIONES_FIJAS: Pregunta[] = [
  ...ACT11.flatMap(([m, so, eso, di, edi]) => [
    elixe(<>Actividad 11: {m.toLowerCase()}. ¿En qué estado está el soluto ({so})?</>, eso, ESTADOS.filter((x) => x !== eso), <>Soluto: {so}, {eso}. Disolvente: {di}, {edi}.</>),
    elixe(<>Actividad 11: {m.toLowerCase()}. ¿Cuál es el disolvente y en qué estado está?</>, `${di} (${edi})`, [`${so} (${eso})`, ...ESTADOS.filter((x) => x !== edi).map((e) => `${di} (${e})`)].filter((x) => x !== `${di} (${edi})`).slice(0, 3), <>El disolvente es el componente en mayor proporción: {di}.</>),
  ]),
  ...YODADO.map((c) => elixe(<>Actividad 10: en el alcohol yodado (98 % de alcohol de 70° y 2 % de yodo), ¿el {c.nombre} es soluto o disolvente?</>, c === papelYodado.disolvente ? 'disolvente' : 'soluto', [c === papelYodado.disolvente ? 'soluto' : 'disolvente'], <>Hay un {escribe(c.porcentaje, 1)} % de {c.nombre}. El que está en mayor proporción ({papelYodado.disolvente.nombre}, {escribe(papelYodado.disolvente.porcentaje, 1)} %) es el disolvente; los demás, solutos.</>)),
  numero(<>Actividad 10: ¿qué porcentaje del alcohol yodado es alcohol puro?</>, YODADO.find((c) => c.nombre === 'alcohol')!.porcentaje, '%', <>El 70 % del 98 %: 0,70 · 98 = {escribe(YODADO.find((c) => c.nombre === 'alcohol')!.porcentaje, 1)} %.</>),
  elixe('Actividad 12: en el aire, ¿cuál es el disolvente?', `${papelAire.disolvente.nombre} (${papelAire.disolvente.porcentaje} %)`, papelAire.solutos.slice(0, 3).map((c) => `${c.nombre} (${c.porcentaje} %)`), <>El nitrógeno es el que está en mayor proporción. Los solutos son el oxígeno, el argón, el dióxido de carbono…</>),
  elixe('Actividad 12: ¿en qué estado están el soluto, el disolvente y la disolución del aire?', 'Los tres en estado gaseoso', ['Soluto gas, disolvente líquido y disolución gas', 'Los tres líquidos'], <>La disolución tiene el estado de su disolvente: {estadoDisolucion(AIRE)}.</>),
  ...ALEACIONES.map((a) => elixe(<>Actividad 13: ¿de qué está hecho el {a.nombre.toLowerCase()}?</>, `${a.disolvente[0].toUpperCase() + a.disolvente.slice(1)} (disolvente) con ${a.solutos}`, ALEACIONES.filter((x) => x !== a && x.solutos !== a.solutos).slice(0, 3).map((x) => `${x.disolvente[0].toUpperCase() + x.disolvente.slice(1)} (disolvente) con ${x.solutos}`), <>{a.uso} {a.mejor}</>)),
  elixe('Actividad 9: dos infusiones de manzanilla, A (clara) y B (oscura). ¿Cuál es el disolvente y cuál el soluto?', 'Disolvente: el agua. Soluto: la manzanilla', ['Disolvente: la manzanilla. Soluto: el agua', 'Las dos son disolventes'], 'El agua está en mayor proporción.'),
  elixe('Actividad 9: ¿qué infusión es la más concentrada?', 'La B, la de color más intenso', ['La A, la más clara', 'Las dos igual'], 'Si el soluto tiene color, la disolución concentrada tiene un color más intenso. También se puede comprobar por el sabor.'),
  elixe('Actividad 9: ¿en qué estado están el disolvente, el soluto y la disolución?', 'Disolvente líquido, soluto sólido y disolución líquida', ['Disolvente sólido, soluto líquido y disolución sólida', 'Los tres sólidos'], 'La disolución tiene el mismo estado que el disolvente.'),
  elixe('¿Qué es una disolución?', 'Una mezcla homogénea de dos o más componentes', ['Una mezcla heterogénea', 'Una sustancia pura', 'Un compuesto'], 'Las mezclas homogéneas también se llaman disoluciones.'),
  elixe('¿Qué es el disolvente?', 'El componente que está en mayor proporción', ['El componente que está en menor proporción', 'Siempre el agua', 'El sólido de la mezcla'], 'El soluto (o solutos) está en menor proporción.'),
  elixe('¿Qué es el soluto?', 'El componente (o componentes) que está en menor proporción', ['El componente en mayor proporción', 'Siempre un sólido', 'El líquido'], 'Puede estar en cualquier estado.'),
  elixe('Una disolución diluida es la que tiene…', 'poca cantidad de soluto con respecto al disolvente', ['mucha cantidad de soluto con respecto al disolvente', 'poco disolvente'], 'La concentrada tiene mucho soluto.'),
  elixe('¿En qué estado físico está una disolución?', 'En el mismo que su disolvente', ['En el mismo que su soluto', 'Siempre líquida', 'Siempre sólida'], 'Página 61.'),
  elixe('¿Qué es una aleación?', 'Una disolución sólida de dos o más metales, o de un metal y otra sustancia', ['Una mezcla heterogénea de metales', 'Un metal puro', 'Una disolución de gases'], 'Se busca mejorar alguna propiedad del metal puro.'),
  elixe('En el acero, ¿cuál es el disolvente y cuál el soluto?', 'Disolvente: el hierro. Soluto: el carbono', ['Disolvente: el carbono. Soluto: el hierro', 'Los dos son solutos'], 'El acero es mucho más resistente que el hierro.'),
  elixe('Para formar una aleación, los metales se mezclan…', 'en estado líquido', ['en estado sólido', 'en estado gaseoso'], 'Página 61.'),
  elixe('¿Qué soluto lleva el agua con gas?', 'Dióxido de carbono, un gas', ['Oxígeno', 'Sal', 'Nitrógeno'], 'Se aprecia cuando se agita o se abre la botella.'),
  elixe('Para hacer limonada se disuelve zumo de limón en agua. ¿En qué estado está el soluto?', 'Líquido', ['Sólido', 'Gas'], 'Página 61: un soluto líquido.'),
]

const DISOLUCIONES_TARXETAS: Tarxeta[] = [
  {
    titulo: 'Disolvente, soluto y disolución',
    texto: (
      <>
        <p>
          Las mezclas homogéneas también se llaman {b('disoluciones')}.
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          <Caixa titulo="Disolvente">El componente que está en {b('mayor proporción')}.</Caixa>
          <Caixa titulo="Soluto">El componente (o componentes) que está en {b('menor proporción')}.</Caixa>
          <Caixa titulo="Disolución">Una {b('mezcla homogénea')} de dos o más componentes.</Caixa>
        </div>
      </>
    ),
  },
  {
    titulo: 'Diluida o concentrada',
    texto: (
      <div className="grid gap-2 sm:grid-cols-2">
        <Caixa titulo="Diluida">Tiene {b('poca cantidad de soluto')} con respecto al disolvente.</Caixa>
        <Caixa titulo="Concentrada">
          Tiene {b('mucha cantidad de soluto')} con respecto al disolvente. Si el soluto tiene color, la concentrada tiene un {b('color más intenso')}.
        </Caixa>
      </div>
    ),
  },
  {
    titulo: 'El estado de la disolución',
    texto: (
      <>
        <p>
          El soluto y el disolvente pueden estar en cualquier estado. La disolución tiene {b('el mismo estado que el disolvente')}.
        </p>
        <Lista
          items={[
            <>Disolvente líquido y soluto sólido: agua con sal, infusión con azúcar.</>,
            <>Disolvente líquido y soluto líquido: limonada (zumo de limón en agua).</>,
            <>Disolvente líquido y soluto gas: bebidas con gas (dióxido de carbono en agua).</>,
            <>Disolvente gas: el aire, una disolución de varios gases (sobre todo nitrógeno, con oxígeno).</>,
          ]}
        />
      </>
    ),
  },
  {
    titulo: 'Las aleaciones',
    texto: (
      <>
        <p>
          Son {b('disoluciones sólidas')} de dos o más metales, o de un metal y otra sustancia. Se busca {b('mejorar alguna propiedad')} del metal puro. Para formarlas, los metales se mezclan en estado líquido.
        </p>
        <table className="w-full border-collapse text-base">
          <thead>
            <tr className="bg-violet-100">
              <th className="border p-1.5">Aleación</th>
              <th className="border p-1.5">Disolvente + soluto</th>
              <th className="border p-1.5">Uso</th>
            </tr>
          </thead>
          <tbody>
            {ALEACIONES.map((a) => (
              <tr key={a.nombre}>
                <td className="border p-1.5 font-bold">{a.nombre}</td>
                <td className="border p-1.5">
                  {a.disolvente} + {a.solutos}
                </td>
                <td className="border p-1.5">{a.uso}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    ),
  },
  {
    titulo: 'Actividad 10: el alcohol yodado',
    texto: (
      <>
        <p>98 % de alcohol de 70° (70 % de alcohol y 30 % de agua) y 2 % de yodo. En total:</p>
        <Lista items={YODADO.map((c) => <>{c.nombre}: {escribe(c.porcentaje, 1)} % → {b(c === papelYodado.disolvente ? 'disolvente' : 'soluto')}</>)} />
      </>
    ),
  },
]

const DISOLUCIONES_XOGOS: Xogo[] = [
  {
    id: 'une',
    titulo: 'Une cada palabra',
    icono: '🔗',
    explica: 'Con lo que significa.',
    crear: (acabar) => (
      <Une
        pares={[
          { palabra: 'Disolvente', significado: 'Componente en mayor proporción' },
          { palabra: 'Soluto', significado: 'Componente en menor proporción' },
          { palabra: 'Disolución', significado: 'Mezcla homogénea' },
          { palabra: 'Diluida', significado: 'Poco soluto' },
          { palabra: 'Concentrada', significado: 'Mucho soluto' },
          { palabra: 'Aleación', significado: 'Disolución sólida con metales' },
        ]}
        acabar={acabar}
      />
    ),
  },
  { id: 'libro', titulo: 'Actividades 9 a 13', icono: '🧪', explica: 'Las del libro.', crear: (acabar) => <Practica preguntas={DISOLUCIONES_FIJAS.slice(0, 23)} acabar={acabar} /> },
  { id: 'todo', titulo: 'De todo', icono: '❓', explica: 'Definiciones y actividades.', crear: (acabar) => <Practica preguntas={DISOLUCIONES_FIJAS} acabar={acabar} /> },
]

export function Disoluciones(p: PropsParada) {
  return <Parada {...p} unidade={U} id="disoluciones" titulo="Disoluciones" tarxetas={DISOLUCIONES_TARXETAS} xogos={DISOLUCIONES_XOGOS} preguntas={DISOLUCIONES_FIJAS} />
}

// ===================================================================================================
// 5. De qué está formada la materia (páginas 66 y 67)
// ===================================================================================================

const MODELOS_ORDEN = [...MODELOS].sort((a, b) => a.año - b.año)
const AGRUPACIONES = ['átomos aislados', 'moléculas', 'cristal']
const DESCRIPCIONES_67 = [...new Set(Object.values(DIBUJOS_67).map(describe))]
const visual67 = (k: string) => (
  <div className="flex flex-col items-center gap-2">
    <Bolitas r={DIBUJOS_67[k]} tam={180} />
    <LeyendaBolitas simbolos={[...new Set(DIBUJOS_67[k].formulas.flatMap((f) => Object.keys(atomos(f))))]} />
  </div>
)
const DIBUJOS_ACT17 = ['A', 'B', 'C', 'D']
const solucion17 = (cumple: (typeof ACT17)[number][1]) => DIBUJOS_ACT17.filter((k) => cumple(DIBUJOS_67[k], clase(DIBUJOS_67[k].formulas[0])))

const ATOMOS_FIJAS: Pregunta[] = [
  ...MODELOS.map((m) => elixe(<>¿Qué modelo atómico dice: «{m.idea}»?</>, `${m.nombre} (${m.año})`, MODELOS.filter((x) => x !== m).map((x) => `${x.nombre} (${x.año})`), <>Modelo de {m.nombre}, {m.año}.</>)),
  ...MODELOS.map((m) => numero(<>¿En qué año propuso {m.nombre} su modelo atómico?</>, m.año, '', <>{m.nombre}: {m.año}. Orden: {MODELOS_ORDEN.map((x) => `${x.nombre} (${x.año})`).join(' → ')}.</>, 0)),
  elixe('¿Cuál fue el primer modelo atómico?', MODELOS_ORDEN[0].nombre, MODELOS_ORDEN.slice(1).map((x) => x.nombre), <>{MODELOS_ORDEN.map((x) => `${x.nombre} (${x.año})`).join(' → ')}.</>),
  elixe('¿Qué modelo atómico es el más moderno de los cuatro?', MODELOS_ORDEN[3].nombre, MODELOS_ORDEN.slice(0, 3).map((x) => x.nombre), <>Bohr, en {MODELOS_ORDEN[3].año}: los electrones en capas.</>),
  ...PARTICULAS.map(([p, d]) => elixe(<>¿Qué partícula es esta? «{d}»</>, p, PARTICULAS.filter(([x]) => x !== p).map(([x]) => x), d)),
  ...ATOMOS_DIBUJO.flatMap(([s, p, n, e]) => [
    numero(<>Cuenta en el dibujo: ¿cuántos protones (rojos) tiene este átomo de {elemento(s).nombre}?<Visual><div className="flex justify-center"><Atomo protones={p} neutrones={n} electrones={e} tam={180} /></div></Visual></>, p, 'protones', <>Su número atómico es {elemento(s).z}: tiene {elemento(s).z} protones.</>, 0),
    numero(<>Cuenta en el dibujo: ¿cuántos electrones (azules) tiene este átomo de {elemento(s).nombre}?<Visual><div className="flex justify-center"><Atomo protones={p} neutrones={n} electrones={e} tam={180} /></div></Visual></>, e, 'electrones', <>Tiene {e} electrones girando en sus capas.</>, 0),
  ]),
  elixe('¿Es igual el átomo de hidrógeno que el de oxígeno?', 'No: tienen distinto número de partículas (protones, neutrones y electrones)', ['Sí, todos los átomos son iguales', 'Solo cambia el color'], 'No todos los átomos son iguales.'),
  elixe('¿Qué es un elemento químico?', 'El conjunto de átomos que tienen el mismo número de protones', ['Cualquier mezcla de átomos', 'Una molécula de dos átomos', 'Un compuesto'], 'Se conocen 118 elementos químicos.'),
  elixe('¿Qué sustancias aparecen como átomos aislados?', 'Los gases nobles, como el helio (He)', ['Los metales, como el oro', 'El agua y la sal', 'El oxígeno y el hidrógeno'], 'Son gases que no se combinan con otros átomos: sustancias simples.'),
  elixe('¿Qué es una molécula?', 'Un grupo de átomos concreto', ['Un átomo aislado', 'Millones de átomos ordenados en el espacio', 'Una mezcla de sustancias'], 'En una sustancia molecular se unen muchas moléculas iguales.'),
  elixe('¿Qué es un cristal?', 'Millones y millones de átomos agrupados de forma ordenada en el espacio', ['Un grupo pequeño de átomos', 'Un átomo aislado', 'Una mezcla de gases'], 'Por ejemplo, el diamante (C) y la sal (NaCl).'),
  ...SUSTANCIAS_66.map((s) => elixe(<>¿Cómo se presenta el {s.nombre} ({conSubindices(s.formula)})?</>, s.agrupacion, AGRUPACIONES.filter((x) => x !== s.agrupacion), <>{s.agrupacion === 'átomos aislados' ? 'Es un gas noble.' : s.agrupacion === 'cristal' ? 'Sus átomos forman un cristal.' : 'Forma moléculas.'} Y es {clase(s.formula) === 'compuesto' ? 'un compuesto' : 'una sustancia simple'}.</>)),
  ...SUSTANCIAS_66.filter((s) => s.agrupacion === 'moléculas').map((s) => numero(<>¿Cuántos átomos hay en una molécula de {s.nombre} ({conSubindices(s.formula)})?</>, totalAtomos(s.formula), 'átomos', <>{Object.entries(atomos(s.formula)).map(([e, n]) => `${n} de ${e}`).join(' + ')} = {totalAtomos(s.formula)}.</>, 0)),
  ...['ejemplo a', 'ejemplo b', 'ejemplo c', 'H₂ y O₂', 'agua', ...DIBUJOS_ACT17].map((k) => {
    const d = describe(DIBUJOS_67[k])
    return elixe(<>¿Qué hay en este dibujo?</>, d, barallar(DESCRIPCIONES_67.filter((x) => x !== d)).slice(0, 3), DIBUJOS_67[k].formulas.length > 1 ? 'Hay moléculas de dos tipos: es una mezcla.' : `${clase(DIBUJOS_67[k].formulas[0]) === 'compuesto' ? 'Átomos de distinto tipo unidos' : 'Átomos de un solo tipo'}.`, visual67(k))
  }),
  ...ACT17.map(([texto, cumple]) => {
    const [k] = solucion17(cumple)
    return elixe(
      <>
        Actividad 17: ¿qué dibujo es {texto.toLowerCase()}?
        <Visual>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {DIBUJOS_ACT17.map((x) => (
              <div key={x} className="flex flex-col items-center text-lg font-black text-slate-700">
                {x}
                <Bolitas r={DIBUJOS_67[x]} tam={120} />
              </div>
            ))}
          </div>
          <LeyendaBolitas simbolos={['O', 'C', 'Fe']} />
        </Visual>
      </>,
      k,
      DIBUJOS_ACT17.filter((x) => x !== k),
      <>{k}: {describe(DIBUJOS_67[k])}.</>,
    )
  }),
  elixe('¿Por qué el agua no es una mezcla de hidrógeno y oxígeno?', 'Porque en el agua cada molécula tiene un átomo de oxígeno y dos de hidrógeno unidos, siempre en esa proporción', ['Porque el agua es líquida', 'Sí es una mezcla de hidrógeno y oxígeno'], 'En una mezcla de H₂ y O₂ las moléculas van separadas y en cualquier proporción.'),
]

const ATOMOS_TARXETAS: Tarxeta[] = [
  {
    titulo: 'Los átomos',
    texto: (
      <>
        <p>
          Según la teoría atómica, toda la materia está formada por partículas muy pequeñas llamadas {b('átomos')}. A su vez, los átomos están formados por otras más pequeñas:
        </p>
        <Lista items={PARTICULAS.map(([p, d]) => <>{b(p)}: {d}</>)} />
      </>
    ),
    visual: <Atomo protones={8} neutrones={8} electrones={8} />,
  },
  {
    titulo: 'Los modelos atómicos',
    texto: (
      <div className="grid gap-2 sm:grid-cols-2">
        {MODELOS_ORDEN.map((m) => (
          <Caixa key={m.nombre} titulo={`${m.nombre} · ${m.año}`}>
            {m.idea}
          </Caixa>
        ))}
        <p className="text-base text-slate-500 sm:col-span-2">El libro escribe «Thompson», pero el científico se llamaba Thomson.</p>
      </div>
    ),
  },
  {
    titulo: 'El elemento químico',
    texto: (
      <>
        <p>
          No todos los átomos son iguales: se diferencian en el {b('número de partículas')}. El átomo de hidrógeno es diferente al de oxígeno.
        </p>
        <p>
          Los átomos con el {b('mismo número de protones')} pertenecen al mismo {b('elemento químico')}. Se conocen {b('118')} y están ordenados en la {b('tabla periódica')}.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-center text-base font-bold">
          <div>
            <Atomo protones={1} neutrones={0} electrones={1} tam={130} />
            Hidrógeno: 1 protón
          </div>
          <div>
            <Atomo protones={8} neutrones={8} electrones={8} tam={130} />
            Oxígeno: 8 protones
          </div>
        </div>
      </>
    ),
  },
  {
    titulo: 'Átomos aislados, moléculas y cristales',
    texto: (
      <>
        <p>
          En las {b('sustancias puras')}, los átomos pueden presentarse aislados, pero lo más habitual es que formen combinaciones. Si son del {b('mismo elemento')}: {b('sustancias simples')}. Si son de {b('elementos diferentes')}: {b('compuestos')}.
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          <Caixa titulo="Átomos aislados">Solo los {b('gases nobles')}, como el helio (He). Son sustancias simples.</Caixa>
          <Caixa titulo="Moléculas">
            Un {b('grupo de átomos concreto')}. Simples: H₂, O₃. Compuestos: H₂O, C₂H₆O.
          </Caixa>
          <Caixa titulo="Cristales">
            Millones de átomos agrupados de forma {b('ordenada')}. Simple: diamante (C). Compuesto: sal (NaCl).
          </Caixa>
        </div>
      </>
    ),
  },
  {
    titulo: 'Mezcla o compuesto',
    texto: (
      <>
        <p>
          El {b('agua')} (H₂O) es un {b('compuesto')}: en cada molécula se combinan un átomo de oxígeno y dos de hidrógeno, siempre en esa proporción. Una {b('mezcla')} de gases hidrógeno y oxígeno tiene moléculas H₂ y O₂ separadas, en cualquier proporción.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-center text-base font-bold">
          <div>
            <Bolitas r={DIBUJOS_67.agua} tam={140} />
            Compuesto: H₂O
          </div>
          <div>
            <Bolitas r={DIBUJOS_67['H₂ y O₂']} tam={140} />
            Mezcla: H₂ y O₂
          </div>
        </div>
        <LeyendaBolitas simbolos={['H', 'O']} />
      </>
    ),
  },
]

const ATOMOS_XOGOS: Xogo[] = [
  { id: 'ordena', titulo: 'Ordena los modelos', icono: '⏳', explica: 'Del más antiguo al más moderno.', crear: (acabar) => <Ordena frases={[{ palabras: MODELOS_ORDEN.map((m) => m.nombre), traducion: MODELOS_ORDEN.map((m) => m.año).join(' → ') }]} acabar={acabar} /> },
  { id: 'une', titulo: 'Une cada modelo', icono: '⚛️', explica: 'Con su idea.', crear: (acabar) => <Une pares={MODELOS.map((m) => ({ palabra: `${m.nombre} (${m.año})`, significado: m.idea }))} acabar={acabar} /> },
  { id: 'dibujos', titulo: 'Mira las bolitas', icono: '🔴', explica: 'Ejemplo resuelto y actividad 17.', crear: (acabar) => <Practica preguntas={ATOMOS_FIJAS.filter((p) => p.tipo === 'elixe' && p.visual)} acabar={acabar} /> },
  { id: 'todo', titulo: 'De todo', icono: '❓', explica: 'Modelos, partículas y sustancias.', crear: (acabar) => <Practica preguntas={ATOMOS_FIJAS} acabar={acabar} /> },
]

export function Atomos(p: PropsParada) {
  return <Parada {...p} unidade={U} id="atomos" titulo="De qué está formada la materia" tarxetas={ATOMOS_TARXETAS} xogos={ATOMOS_XOGOS} preguntas={ATOMOS_FIJAS} />
}

// ===================================================================================================
// 6. La tabla periódica (páginas 68 y 69, solo lo subrayado)
// ===================================================================================================

const CON_GRUPO = ELEMENTOS.filter((e) => posicion(e.z).grupo !== null)
const NOBLES = CON_GRUPO.filter((e) => posicion(e.z).grupo === 18)
const Z_NOBLES = Array.from({ length: 118 }, (_, i) => i + 1).filter(esGasNoble)
const parecido = (e: (typeof ELEMENTOS)[number]) => CON_GRUPO.filter((x) => x !== e && x.simbolo !== 'H' && posicion(x.z).grupo === posicion(e.z).grupo)

const TABLA_FIJAS: Pregunta[] = [
  ...ELEMENTOS.filter((e) => e.simbolo.length === 2 || ['H', 'C', 'O', 'N', 'K', 'I', 'S'].includes(e.simbolo)).map((e) =>
    elixe(<>¿Cuál es el símbolo del {e.nombre}?</>, e.simbolo, [...simbolosMal(e.simbolo), ...barallar(ELEMENTOS.filter((x) => x !== e && x.nombre[0] === e.nombre[0]).map((x) => x.simbolo))].slice(0, 3), <>{e.simbolo}: primera letra en mayúscula{e.simbolo.length === 2 ? ' y la segunda en minúscula' : ''}.</>),
  ),
  ...ELEMENTOS.map((e) => elixe(<>¿Qué elemento tiene el símbolo {e.simbolo}?</>, e.nombre, barallar(ELEMENTOS.filter((x) => x !== e)).slice(0, 3).map((x) => x.nombre), <>{e.simbolo} es el {e.nombre} (número atómico {e.z}).</>)),
  ...[elemento('O'), elemento('Na'), elemento('Fe'), elemento('Ca'), elemento('Au'), elemento('C')].map((e) => numero(<>El número atómico del {e.nombre} es {e.z}. ¿Cuántos protones tienen sus átomos?</>, e.z, 'protones', <>El número atómico indica el número de protones: {e.z}.</>, 0)),
  ...[elemento('Na'), elemento('Cl'), elemento('Fe'), elemento('Ne'), elemento('Hg'), elemento('K')].map((e) => numero(<>¿En qué periodo (fila) está el {e.nombre} (Z = {e.z})?<Visual><TablaPeriodica marca={[e.z]} /></Visual></>, posicion(e.z).periodo, '', <>Está en la fila {posicion(e.z).periodo} y en la columna (grupo) {posicion(e.z).grupo}.</>, 0)),
  ...[elemento('Mg'), elemento('O'), elemento('Ar'), elemento('Cu'), elemento('C'), elemento('Li')].map((e) => numero(<>¿En qué grupo (columna) está el {e.nombre} (Z = {e.z})?<Visual><TablaPeriodica marca={[e.z]} /></Visual></>, posicion(e.z).grupo!, '', <>Está en el grupo {posicion(e.z).grupo}, periodo {posicion(e.z).periodo}.</>, 0)),
  ...[elemento('Na'), elemento('Cl'), elemento('Mg'), elemento('Ne'), elemento('Cu')].map((e) => {
    const p = parecido(e)
    const otros = barallar(CON_GRUPO.filter((x) => x !== e && !p.includes(x))).slice(0, 3)
    return elixe(<>¿Qué elemento tiene propiedades parecidas al {e.nombre}?</>, p[0].nombre, otros.map((x) => x.nombre), <>Los dos están en el grupo {posicion(e.z).grupo}: los elementos de un mismo grupo tienen propiedades semejantes.</>)
  }),
  ...NOBLES.map((e) => elixe(<>¿Qué tipo de elemento es el {e.nombre} ({e.simbolo})?</>, 'Un gas noble (grupo 18)', ['Un metal', 'Un compuesto'], 'Todos los gases nobles están en el grupo 18.')),
  elixe('¿Cuántos elementos químicos se conocen en la actualidad?', '118', ['92', '100', '18'], 'Están ordenados en la tabla periódica.'),
  elixe('¿Cuántos periodos y cuántos grupos tiene la tabla periódica?', '7 periodos (filas) y 18 grupos (columnas)', ['18 periodos y 7 grupos', '7 periodos y 7 grupos', '18 periodos y 18 grupos'], 'Siete filas y dieciocho columnas.', <TablaPeriodica />),
  elixe('¿Qué es un periodo?', 'Una fila de la tabla periódica', ['Una columna de la tabla periódica', 'Un grupo de gases nobles'], 'Hay siete.'),
  elixe('¿Qué es un grupo?', 'Una columna de la tabla periódica', ['Una fila de la tabla periódica', 'Un conjunto de moléculas'], 'Hay dieciocho.'),
  elixe('¿En qué orden están los elementos en la tabla?', 'Por orden creciente de su número atómico', ['Por orden alfabético', 'Por su año de descubrimiento', 'Por su masa'], 'Del hidrógeno (1) al oganesón (118).'),
  elixe('¿Qué indica el número atómico?', 'El número de protones de los átomos de ese elemento', ['El número de átomos de la molécula', 'La fila en la que está', 'El número de neutrones'], 'Todos los átomos de H tienen 1 protón; los de Og, 118.'),
  elixe('¿Qué tienen en común los elementos de un mismo grupo?', 'Propiedades semejantes (el mismo número de electrones en la última capa)', ['El mismo número de protones', 'Son todos gases', 'Nada'], 'El lugar que ocupa un elemento en la tabla nos permite conocer sus propiedades.'),
  elixe('¿En qué grupo están todos los gases nobles?', 'En el grupo 18', ['En el grupo 1', 'En el grupo 8', 'En el periodo 7'], 'La última columna.', <TablaPeriodica marca={Z_NOBLES} />),
  elixe('¿Por qué se llaman «gases nobles»?', 'Son muy estables y casi nunca se combinan con otros, como la nobleza, que no se mezclaba con otras clases sociales', ['Porque son muy caros', 'Porque los descubrió un noble', 'Porque brillan como el oro'], 'Página 69.'),
  elixe('¿Por qué el mercurio tiene el símbolo Hg?', 'Por su nombre en latín, hydrargyrum, que significa «agua de plata»', ['Porque es la inicial de «mercurio»', 'Porque lo eligió su descubridor', 'Por su número atómico'], 'Algunos elementos conocidos desde la Antigüedad usan su nombre en griego o en latín.'),
  elixe('¿Por qué el helio se escribe He y no H?', 'Porque H ya es el hidrógeno: se añade una segunda letra en minúscula', ['Porque los gases llevan dos letras', 'Es un error: se escribe H'], 'Si varios elementos tienen la misma inicial, se añade una segunda letra.'),
  elixe('¿Cuál de estos símbolos está bien escrito?', 'Co', ['CO', 'co', 'cO'], 'Primera letra en mayúscula y segunda en minúscula. (CO sería una molécula de carbono y oxígeno.)'),
]

const TABLA_TARXETAS: Tarxeta[] = [
  {
    titulo: 'La tabla periódica',
    texto: <Lista items={TABLA_IDEAS.slice(0, 4).map(([t, d]) => <>{b(t)}: {d}</>)} />,
    visual: <TablaPeriodica simbolos={{ 1: 'H', 2: 'He', 8: 'O', 11: 'Na', 26: 'Fe', 79: 'Au', 80: 'Hg' }} />,
    ancho: true,
  },
  {
    titulo: 'Grupos y gases nobles',
    texto: <Lista items={TABLA_IDEAS.slice(4).map(([t, d]) => <>{b(t)}: {d}</>)} />,
    visual: <TablaPeriodica marca={Z_NOBLES} simbolos={{ ...Object.fromEntries(NOBLES.map((e) => [e.z, e.simbolo])), 118: 'Og' }} />,
    ancho: true,
  },
  {
    titulo: 'Cómo se escriben los símbolos',
    texto: (
      <>
        <Lista items={SIMBOLOS_REGLAS.map(([t, d]) => <>{b(t)}: {d}</>)} />
        <Truco>Actividad 21: símbolos de una sola letra son, por ejemplo, {ELEMENTOS.filter((e) => e.simbolo.length === 1).slice(0, 8).map((e) => `${e.simbolo} (${e.nombre})`).join(', ')}.</Truco>
      </>
    ),
  },
]

const TABLA_XOGOS: Xogo[] = [
  { id: 'une', titulo: 'Símbolos', icono: '🔤', explica: 'Une cada símbolo con su elemento.', crear: (acabar) => <Une pares={barallar(ELEMENTOS).slice(0, 8).map((e) => ({ palabra: e.simbolo, significado: e.nombre }))} acabar={acabar} /> },
  {
    id: 'vf',
    titulo: 'Verdadero o falso',
    icono: '✅',
    explica: 'Lo subrayado.',
    crear: (acabar) => (
      <VerdadeiroFalso
        frases={[
          { texto: 'La tabla periódica tiene 7 grupos y 18 periodos.', certa: false, explica: 'Al revés: 7 periodos (filas) y 18 grupos (columnas).' },
          { texto: 'El número atómico indica el número de protones.', certa: true, explica: 'Y los elementos se ordenan por él.' },
          { texto: 'Los elementos de un mismo periodo tienen propiedades semejantes.', certa: false, explica: 'Son los del mismo grupo (columna).' },
          { texto: 'Todos los gases nobles están en el grupo 18.', certa: true, explica: 'La última columna.' },
          { texto: 'Los gases nobles se combinan fácilmente con otros elementos.', certa: false, explica: 'Casi nunca se combinan: son muy estables.' },
          { texto: 'La segunda letra de un símbolo se escribe en minúscula.', certa: true, explica: 'Como en He, Na o Fe.' },
          { texto: 'Hg es el símbolo del mercurio.', certa: true, explica: 'De su nombre en latín, hydrargyrum.' },
          { texto: 'Se conocen 92 elementos químicos.', certa: false, explica: 'Se conocen 118.' },
        ]}
        acabar={acabar}
      />
    ),
  },
  { id: 'todo', titulo: 'De todo', icono: '❓', explica: 'Símbolos, grupos, periodos y gases nobles.', crear: (acabar) => <Practica preguntas={TABLA_FIJAS} acabar={acabar} /> },
]

export function Tabla(p: PropsParada) {
  return <Parada {...p} unidade={U} id="tabla" titulo="La tabla periódica" tarxetas={TABLA_TARXETAS} xogos={TABLA_XOGOS} preguntas={TABLA_FIJAS} />
}

export const PREGUNTAS_FQ2: Record<string, Pregunta[]> = {
  gases: GASES_PREG,
  estados: ESTADOS2_FIJAS,
  materia: MATERIA_FIJAS,
  disoluciones: DISOLUCIONES_FIJAS,
  atomos: ATOMOS_FIJAS,
  tabla: TABLA_FIJAS,
}

