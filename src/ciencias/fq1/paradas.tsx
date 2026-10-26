// Física y Química 2.º ESO, primer parcial. Solo lo que el profesor marcó como fundamental: cambio de unidades por
// factores de conversión, problemas de densidad, esquema y propiedades de los cambios de estado, gráficas de cambio de
// estado y problemas de la ley de Boyle-Mariotte. Temas 1 y 2 del libro y el cuaderno de Mateo. Las soluciones las
// calcula src/lib/fisica.ts.
import type { ReactNode } from 'react'
import { Busca, Clasifica, Ordena, Proba, VerdadeiroFalso, barallar, type Pregunta, type Tarxeta, type Xogo } from '../../primaria/pezas'
import { elixe, toca } from '../../primaria/paisaxes/preguntas'
import type { Video } from '../../contenido/tema1'
import { Caixa, Lista, Parada, Truco, b } from '../../historia/parcial1/roma'
import {
  CAMBIOS,
  SUSTANCIAS,
  boyle,
  cadena,
  calentamiento,
  convertir,
  escribe,
  estadoA,
  factores,
  mesetas,
  quienFundeA,
  quienHierveA,
  sustancia,
  tramos,
  type Factor,
  type Punto,
} from '../../lib/fisica'
import { EsquemaCambios, GraficaBoyle, GraficaT, NOMES_CAMBIOS, Particulas } from './debuxos'

type PropsParada = { ruta: string; modo?: string }
const U = 'fq1'
const numero = (texto: ReactNode, valor: number, unidade: string, explica: ReactNode, marxe = 0.01): Pregunta => ({ tipo: 'numero', texto, valor, unidade, explica, marxe })
const Formula = ({ children }: { children: ReactNode }) => <div className="my-2 rounded-2xl bg-violet-50 p-3 text-center font-mono text-xl font-bold text-violet-900">{children}</div>
const Practica = ({ preguntas, acabar }: { preguntas: Pregunta[]; acabar: () => void }) => <Proba practica cantas={8} preguntas={preguntas} acabar={acabar} />
const sobre = (f: Factor) => `${escribe(f.arriba[0])} ${f.arriba[1]} / ${escribe(f.abajo[0])} ${f.abajo[1]}`

// ===================================================================================================
// 1. Cambio de unidades por factores de conversión
// ===================================================================================================

/** Las conversiones de los ejercicios del libro (temas 1 y 2) y del cuaderno. */
export const CONVERSIONES: [number, string, string][] = [
  [25.8, 'g', 'cg'], [0.05, 'hg', 'dg'], [3.5, 'dag', 'kg'], [450, 'mg', 'kg'], [8.15, 'km', 'm'], [1.45, 'dam', 'dm'], [0.04, 'dm', 'cm'], [59, 'mm', 'dm'],
  [16, 'g', 'hg'], [0.25, 'dag', 'mg'], [7.5, 'km', 'cm'], [50, 'dm', 'hm'], [1.25, 'm²', 'cm²'], [0.082, 'km²', 'dm²'], [500, 'cm²', 'dm²'],
  [73.357, 'cm³', 'mm³'], [1.0576, 'dam³', 'dm³'], [2500000, 'L', 'm³'], [33, 'cL', 'cm³'], [0.08, 'kg', 'mg'], [5.7, 'dag', 'cg'], [548, 'dg', 'hg'],
  [37, 'mg', 'kg'], [7.5, 'dam³', 'L'], [875, 'mL', 'dm³'], [0.00065, 'km³', 'm³'], [378, 'dm³', 'L'], [805, 'cL', 'hL'], [0.35, 'daL', 'dL'], [2.5, 'L', 'mL'], [48, 'mL', 'daL'],
]
/** Con dos unidades: hay que usar dos factores (los del cuaderno y los ejemplos 8 y 9). */
export const COMPUESTAS: [number, string, string][] = [
  [82, 'km/h', 'm/s'], [100, 'cm/s', 'm/min'], [0.98, 'g/cm³', 'kg/m³'], [200, 'dm³/s', 'm³/min'], [15, 'L/min', 'm³/h'], [15, 'L/min', 'cm³/s'],
  [120, 'km/h', 'm/s'], [72, 'km/h', 'm/s'], [20, 'm/s', 'km/h'], [1000, 'kg/m³', 'g/cm³'], [7.2, 'g/cm³', 'kg/m³'], [3, 'm³/h', 'L/min'], [36, 'km/h', 'm/s'], [2, 'L/s', 'm³/h'],
]

const preguntaConversion = ([v, de, a]: [number, string, string], compuesta = false): Pregunta =>
  numero(
    <>
      Pasa {escribe(v, 6)} {de} a {a}.
    </>,
    convertir(v, de, a),
    a,
    <>{cadena(v, de, a)}</>,
    compuesta ? 0.01 : 0.0001,
  )

/** ¿Qué factor pones? La buena y las equivocadas típicas: darle la vuelta o fallar el número. */
function preguntaFactor([v, de, a]: [number, string, string], cual: 0 | 1): Pregunta | null {
  const f = factores(de, a)[cual]
  if (!f) return null
  const vuelta: Factor = { arriba: f.abajo, abajo: f.arriba }
  const grande = f.arriba[0] === 1 ? 'abajo' : 'arriba'
  const mal = (k: number): Factor => ({ ...f, [grande]: [f[grande][0] * k, f[grande][1]] })
  const unidadQueSeVa = cual === 0 ? de.split('/')[0] : de.split('/')[1]
  return elixe(
    <>
      Pasas {escribe(v, 6)} {de} a {a}. ¿Qué factor usas para quitar los «{unidadQueSeVa}»?
    </>,
    sobre(f),
    [...new Set([sobre(vuelta), sobre(mal(10)), sobre(mal(0.1))])].filter((x) => x !== sobre(f)),
    <>
      La unidad que quieres quitar va en el lado contrario para tacharse: {sobre(f)}. {cadena(v, de, a)}
    </>,
  )
}

const ESCALAS = (
  <div className="grid gap-2 sm:grid-cols-3">
    <Caixa titulo="Masa y longitud: ×10">
      kg · hg · dag · <b>g</b> · dg · cg · mg
      <br />
      km · hm · dam · <b>m</b> · dm · cm · mm
    </Caixa>
    <Caixa titulo="Superficie: ×100">
      km² · hm² · dam² · <b>m²</b> · dm² · cm² · mm²
    </Caixa>
    <Caixa titulo="Volumen: ×1000">
      km³ · hm³ · dam³ · <b>m³</b> · dm³ · cm³ · mm³
      <br />
      Capacidad (×10): kL · hL · daL · <b>L</b> · dL · cL · mL
    </Caixa>
  </div>
)

const UNIDADES_TARXETAS: Tarxeta[] = [
  {
    titulo: 'Subir y bajar por la escalera',
    texto: (
      <>
        {ESCALAS}
        <Lista
          items={[
            <>
              Hacia una unidad {b('más pequeña')} (bajar): se {b('multiplica')}. 5 g = 50 dg.
            </>,
            <>
              Hacia una unidad {b('más grande')} (subir): se {b('divide')}. 20 hg = 2 kg.
            </>,
            <>El número de pasos es el exponente: 0,8 km → dm son 4 pasos: 0,8 · 10⁴ = 8000 dm.</>,
          ]}
        />
      </>
    ),
  },
  {
    titulo: 'Volumen y capacidad',
    texto: (
      <>
        <div className="grid gap-2 sm:grid-cols-3">
          <Caixa titulo="1 m³">= 1000 dm³ = 1000 L = 1 kL</Caixa>
          <Caixa titulo="1 dm³">= 1 L = 1000 cm³</Caixa>
          <Caixa titulo="1 cm³">= 1 mL = 0,001 L</Caixa>
        </div>
        <Truco>dm³ y L son lo mismo; cm³ y mL, también. Es lo que más cae.</Truco>
      </>
    ),
  },
  {
    titulo: 'Factores de conversión',
    texto: (
      <>
        <p>
          Un factor de conversión es una {b('fracción que vale 1')}: arriba y abajo hay la misma cantidad en unidades distintas, como <b>1000 m / 1 km</b> o <b>1 h / 3600 s</b>.
        </p>
        <Lista
          items={[
            <>1. Busca las unidades que cambian y su relación (1 km = 1000 m; 1 h = 3600 s).</>,
            <>2. Escribe la cantidad y multiplica por el primer factor. La unidad que quieres quitar va en el lado contrario, para tacharse.</>,
            <>3. Si hay otra unidad, multiplica por un segundo factor.</>,
            <>4. Tacha lo que sobra, opera y escribe el resultado con su unidad.</>,
          ]}
        />
        <Formula>15 L/min · (1 m³ / 1000 L) · (60 min / 1 h) = 0,9 m³/h</Formula>
      </>
    ),
  },
  {
    titulo: 'Los del cuaderno',
    texto: (
      <div className="space-y-2">
        {COMPUESTAS.slice(0, 4).map(([v, de, a]) => (
          <Formula key={de + a}>{cadena(v, de, a)}</Formula>
        ))}
        <Truco>km/h → m/s: es lo mismo que dividir entre 3,6. Y m/s → km/h, multiplicar por 3,6.</Truco>
      </div>
    ),
  },
]

const FACTORES = COMPUESTAS.flatMap((c) => [preguntaFactor(c, 0), preguntaFactor(c, 1)]).filter((p): p is Pregunta => p !== null)

const UNIDADES_XOGOS: Xogo[] = [
  { id: 'factor', titulo: '¿Qué factor pongo?', icono: '🧮', explica: 'Elige el factor de conversión correcto.', crear: (acabar) => <Practica preguntas={FACTORES} acabar={acabar} /> },
  { id: 'simples', titulo: 'Por la escalera', icono: '🪜', explica: 'Masa, longitud, superficie y volumen.', crear: (acabar) => <Practica preguntas={CONVERSIONES.map((c) => preguntaConversion(c))} acabar={acabar} /> },
  { id: 'compuestas', titulo: 'Con dos factores', icono: '🚗', explica: 'Velocidades, densidades y caudales.', crear: (acabar) => <Practica preguntas={COMPUESTAS.map((c) => preguntaConversion(c, true))} acabar={acabar} /> },
]

const UNIDADES_PREG: Pregunta[] = [
  ...COMPUESTAS.map((c) => preguntaConversion(c, true)),
  ...COMPUESTAS.map((c) => preguntaConversion(c, true)),
  ...CONVERSIONES.map((c) => preguntaConversion(c)),
  ...FACTORES,
  elixe('¿Cuántos litros hay en 1 m³?', '1000 L', ['100 L', '10 L', '1 000 000 L'], '1 m³ = 1000 dm³ = 1000 L.'),
  elixe('¿A qué equivale 1 cm³?', '1 mL', ['1 L', '1 dL', '1 cL'], '1 cm³ = 1 mL.'),
  elixe('Para pasar de m² a cm², ¿por cuánto multiplicas?', '10 000', ['100', '1000', '10'], 'Dos pasos de 100: 100² = 10 000.'),
]

export const UNIDADES_VIDEOS: Video[] = [
  { id: 'K7VqBI7FFxY', titulo: 'Ejercicios resueltos de factores de conversión 2.º ESO', canal: 'Princippia', minutos: 5 },
  { id: 'Vv7IpL9z8mg', titulo: 'Conversión de unidades compuestas por factores de conversión', canal: 'Susi Profe', minutos: 12 },
]

export function Unidades(p: PropsParada) {
  return <Parada {...p} unidade={U} id="unidades" titulo="Cambio de unidades por factores de conversión" tarxetas={UNIDADES_TARXETAS} xogos={UNIDADES_XOGOS} preguntas={UNIDADES_PREG} videos={UNIDADES_VIDEOS} />
}

// ===================================================================================================
// 2. Problemas de densidad
// ===================================================================================================

const r2 = (n: number) => Math.round(n * 100) / 100

/** Problemas de densidad con datos sencillos: el código elige los números y calcula la solución. */
function problemasDensidad(n: number): Pregunta[] {
  const out: Pregunta[] = []
  const ds = [0.8, 0.92, 1.04, 1.1, 1.2, 1.38, 2.7, 7.2, 7.9, 11.3, 13.6, 19.3]
  const vs = [10, 20, 25, 40, 50, 100, 150, 200, 250, 500]
  for (let i = 0; i < n; i++) {
    const d = ds[(i * 7) % ds.length]
    const V = vs[(i * 3) % vs.length]
    const m = r2(d * V)
    const tipo = i % 4
    if (tipo === 0) out.push(numero(<>Un objeto tiene una masa de {escribe(m)} g y ocupa {V} cm³. ¿Cuál es su densidad en g/cm³?</>, d, 'g/cm³', <>d = m / V = {escribe(m)} g / {V} cm³ = {escribe(d)} g/cm³</>))
    if (tipo === 1) out.push(numero(<>Una sustancia tiene una densidad de {escribe(d)} g/cm³. ¿Qué masa tienen {V} cm³?</>, m, 'g', <>m = d · V = {escribe(d)} g/cm³ · {V} cm³ = {escribe(m)} g</>))
    if (tipo === 2) out.push(numero(<>¿Qué volumen ocupan {escribe(m)} g de una sustancia de densidad {escribe(d)} g/cm³?</>, V, 'cm³', <>V = m / d = {escribe(m)} g / {escribe(d)} g/cm³ = {V} cm³</>))
    if (tipo === 3) {
      const dSI = convertir(d, 'g/cm³', 'kg/m³')
      out.push(numero(<>Calcula la masa de una sustancia de densidad {escribe(dSI)} kg/m³ que ocupa {V} mL. Da el resultado en gramos.</>, m, 'g', <>{escribe(dSI)} kg/m³ = {escribe(d)} g/cm³ (se divide entre 1000), y {V} mL = {V} cm³. m = d · V = {escribe(m)} g</>))
    }
  }
  return out
}

const DENSIDAD_FIJAS: Pregunta[] = [
  numero('Calcula la masa de una sustancia cuya densidad es de 1100 kg/m³, sabiendo que ocupa un volumen de 200 mL (en gramos).', 220, 'g', <>1100 kg/m³ = 1,1 g/cm³; 200 mL = 200 cm³. m = 1,1 · 200 = 220 g (0,22 kg).</>),
  numero('¿Qué volumen ocupan 50 g de una sustancia cuya densidad es de 1000 kg/m³? (en cm³)', 50, 'cm³', <>1000 kg/m³ = 1 g/cm³. V = m / d = 50 g / 1 g/cm³ = 50 cm³ (50 mL).</>),
  numero('Una plastilina pesa 27,6 g. Al meterla en una probeta con 120 mL de agua, el nivel sube a 140 mL. ¿Cuál es su densidad?', 1.38, 'g/cm³', <>V = 140 − 120 = 20 mL = 20 cm³. d = 27,6 / 20 = 1,38 g/cm³.</>),
  numero('Un tornillo de acero tiene 72 g. En la probeta el agua pasa de 30 mL a 40 mL. ¿Cuál es la densidad del acero?', 7.2, 'g/cm³', <>V = 40 − 30 = 10 cm³. d = 72 / 10 = 7,2 g/cm³.</>),
  numero('La leche tiene una densidad de 1,04 g/mL. ¿Qué masa tiene 1 L de leche?', 1040, 'g', <>1 L = 1000 mL. m = 1,04 · 1000 = 1040 g.</>),
  numero('El aceite tiene una densidad de 0,92 g/mL. ¿Qué masa tiene 1 L de aceite?', 920, 'g', <>m = 0,92 · 1000 = 920 g.</>),
  numero('Pasa 7,2 g/cm³ a kg/m³.', 7200, 'kg/m³', <>{cadena(7.2, 'g/cm³', 'kg/m³')}</>),
  elixe('Si cortamos la plastilina por la mitad, ¿qué le pasa a su densidad?', 'No cambia', ['Se reduce a la mitad', 'Se duplica', 'Depende del color'], 'La masa y el volumen se reducen a la mitad, y m/V sigue igual. La densidad es una propiedad característica.'),
  elixe('¿Cómo se mide el volumen de un sólido irregular que no se disuelve en agua?', 'Con una probeta con agua: V = V₂ − V₁', ['Pesándolo en la balanza', 'Con una regla', 'Con un termómetro'], 'Lo que sube el agua es el volumen del sólido.'),
  elixe('El aceite (0,9 g/cm³) y el agua (1,0 g/cm³) no se mezclan. ¿Qué pasa?', 'El aceite flota sobre el agua', ['El agua flota sobre el aceite', 'Se quedan mezclados', 'El aceite se hunde'], 'Flota lo menos denso.'),
  elixe('¿Qué hace el botón de tara de la balanza?', 'Pone la balanza a cero con el recipiente encima', ['Apaga la balanza', 'Duplica la medida', 'Mide el volumen'], 'Así solo se mide la masa de lo que añades.'),
  elixe('Una lata vacía flota y, aplastada, se hunde. ¿Por qué?', 'La lata aplastada es más densa que la vacía, que contiene aire', ['La lata aplastada pesa más', 'El agua se vuelve más densa', 'El aluminio cambia de material'], 'La masa es la misma, pero ocupa menos volumen.'),
]

const DENSIDAD_TARXETAS: Tarxeta[] = [
  {
    titulo: 'Qué es la densidad',
    texto: (
      <>
        <p>
          La densidad indica la {b('cantidad de masa por unidad de volumen')}.
        </p>
        <Formula>d = m / V</Formula>
        <div className="grid gap-2 sm:grid-cols-2">
          <Caixa titulo="Unidad del SI">kg/m³</Caixa>
          <Caixa titulo="Muy usada">g/cm³ = g/mL</Caixa>
        </div>
        <Truco>1 g/cm³ = 1000 kg/m³. De kg/m³ a g/cm³, divide entre 1000 (el agua: 1000 kg/m³ = 1 g/cm³).</Truco>
      </>
    ),
  },
  {
    titulo: 'Despejar: el triángulo',
    texto: (
      <>
        <div className="mx-auto w-fit rounded-2xl border-2 border-violet-300 bg-white p-4 text-center text-2xl font-black text-violet-900">
          <div>m</div>
          <div className="border-t-2 border-violet-300 pt-1">d · V</div>
        </div>
        <Lista
          items={[
            <>
              Te piden la {b('densidad')}: d = m / V
            </>,
            <>
              Te piden la {b('masa')}: m = d · V
            </>,
            <>
              Te piden el {b('volumen')}: V = m / d
            </>,
          ]}
        />
        <Truco>Antes de operar, pon todo en las mismas unidades: g y cm³ (o kg y m³). Recuerda que 1 mL = 1 cm³.</Truco>
      </>
    ),
  },
  {
    titulo: 'Medir la densidad',
    texto: (
      <div className="grid gap-2 sm:grid-cols-2">
        <Caixa titulo="De un líquido">
          1. Coloca la probeta vacía en la balanza y pulsa {b('tara')} (marca 0). 2. Echa líquido y mide el volumen. 3. Pesa la probeta con el líquido. Ejemplo: 117 g en 40 mL.
        </Caixa>
        <Caixa titulo="De un sólido que no se disuelve">
          1. Mide la masa (72 g). 2. Echa agua en una probeta (V₁ = 30 mL). 3. Mete el sólido (V₂ = 40 mL). V = V₂ − V₁ = 10 mL. d = 72 / 10 = 7,2 g/cm³.
        </Caixa>
      </div>
    ),
  },
  {
    titulo: 'Flotar o hundirse',
    texto: (
      <>
        <p>
          Un objeto {b('flota')} en un líquido más denso que él y {b('se hunde')} en uno menos denso. El aceite flota sobre el agua.
        </p>
        <Truco>Del menos denso al más denso, en el vaso del libro: corcho, aceite, vela, agua y goma.</Truco>
      </>
    ),
  },
]

const DENSIDAD_XOGOS: Xogo[] = [
  { id: 'problemas', titulo: 'Problemas', icono: '🧪', explica: 'Densidad, masa o volumen.', crear: (acabar) => <Practica preguntas={[...DENSIDAD_FIJAS.filter((p) => p.tipo === 'numero'), ...problemasDensidad(24)]} acabar={acabar} /> },
  {
    id: 'ordena',
    titulo: 'Del menos denso al más denso',
    icono: '🍾',
    explica: 'El vaso de la página 25.',
    crear: (acabar) => <Ordena frases={[{ palabras: ['corcho', 'aceite', 'vela', 'agua', 'goma'], traducion: 'Del menos denso al más denso' }]} acabar={acabar} />,
  },
]

const DENSIDAD_PREG: Pregunta[] = [...DENSIDAD_FIJAS, ...problemasDensidad(16)]

export function Densidad(p: PropsParada) {
  return <Parada {...p} unidade={U} id="densidad" titulo="Problemas de densidad" videos={[{ id: 'hKrDXOqGvBA', titulo: 'Calcular la densidad, masa y volumen', canal: 'Susi Profe', minutos: 9 }]} tarxetas={DENSIDAD_TARXETAS} xogos={DENSIDAD_XOGOS} preguntas={DENSIDAD_PREG} />
}

// ===================================================================================================
// 3. Esquema de los cambios de estado
// ===================================================================================================

/** Fenómenos del libro (páginas 44, 51 y 54) con su cambio de estado. */
export const FENOMENOS: [string, string][] = [
  ['Se seca un charco.', 'vaporizacion'],
  ['Notamos el olor de una pastilla de jabón.', 'sublimacion'],
  ['Se empaña el cristal de la ducha.', 'condensacion'],
  ['Se forma escarcha en las hojas por el contacto con aire muy frío.', 'inversa'],
  ['El azúcar se funde y se convierte en caramelo líquido.', 'fusion'],
  ['El caramelo líquido se vuelve sólido al enfriarse.', 'solidificacion'],
  ['Las rocas del interior de la Tierra forman lava por las altas temperaturas.', 'fusion'],
  ['La lava de un volcán forma rocas al enfriarse.', 'solidificacion'],
  ['Se forman placas de hielo en la carretera.', 'solidificacion'],
  ['El deshielo de los casquetes polares.', 'fusion'],
  ['La pastilla de la pulsera antimosquitos acaba desapareciendo.', 'sublimacion'],
  ['Aparecen gotitas en un vaso con hielo.', 'condensacion'],
  ['El agua hierve en un cazo.', 'vaporizacion'],
  ['El yodo se calienta y pasa directamente a gas.', 'sublimacion'],
  ['La ropa tendida se seca.', 'vaporizacion'],
  ['Unos cubitos de hielo sobre la mesa se convierten en agua.', 'fusion'],
]

const ESQUEMA_TARXETAS: Tarxeta[] = [
  {
    titulo: 'Los seis cambios de estado',
    texto: (
      <p>
        La materia puede pasar de un estado a otro {b('calentándola')} o {b('enfriándola')}. Es un {b('cambio físico')}: la sustancia sigue siendo la misma.
      </p>
    ),
    visual: <EsquemaCambios />,
    ancho: true,
  },
  {
    titulo: 'Progresivos y regresivos',
    texto: (
      <div className="grid gap-2 sm:grid-cols-2">
        <Caixa titulo="🔥 Progresivos (al calentar)" cor="border-red-300">
          <b>Fusión</b> (sólido → líquido), <b>vaporización</b> (líquido → gas) y <b>sublimación</b> (sólido → gas).
        </Caixa>
        <Caixa titulo="❄️ Regresivos (al enfriar)" cor="border-blue-300">
          <b>Solidificación</b> (líquido → sólido), <b>condensación o licuación</b> (gas → líquido) y <b>sublimación inversa</b> (gas → sólido).
        </Caixa>
      </div>
    ),
  },
  {
    titulo: 'Con partículas',
    texto: (
      <>
        <div className="flex flex-wrap items-center justify-center gap-2 text-center text-base font-bold">
          <div>
            <Particulas estado="sólido" tam={110} />
            sólido
          </div>
          <span className="text-2xl">⇄</span>
          <div>
            <Particulas estado="líquido" tam={110} />
            líquido
          </div>
          <span className="text-2xl">⇄</span>
          <div>
            <Particulas estado="gas" tam={110} />
            gas
          </div>
        </div>
        <Truco>Ejercicio 42: sólido → líquido es fusión; sólido → gas, sublimación; líquido → gas, vaporización.</Truco>
      </>
    ),
  },
  {
    titulo: '¿Gas o vapor?',
    texto: (
      <p>
        Llamamos {b('gas')} a la sustancia que es un gas a temperatura ambiente (el aire, el butano). Llamamos {b('vapor')} al gas de una sustancia que normalmente no es gas, como el {b('vapor de agua')}.
      </p>
    ),
  },
]

const ESQUEMA_XOGOS: Xogo[] = [
  { id: 'busca', titulo: 'Busca en el esquema', icono: '🗺️', explica: 'Toca la flecha de cada cambio.', crear: (acabar) => <Busca Debuxo={EsquemaCambios} nomes={NOMES_CAMBIOS} obxectivos={Object.keys(NOMES_CAMBIOS)} acabar={acabar} /> },
  {
    id: 'clasifica',
    titulo: '¿Progresivo o regresivo?',
    icono: '🗂️',
    explica: 'Pon cada cambio en su caja.',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'p', nome: '🔥 Progresivo', cor: 'border-red-300 bg-red-100' },
          { id: 'r', nome: '❄️ Regresivo', cor: 'border-blue-300 bg-blue-100' },
        ]}
        elementos={CAMBIOS.map((c) => ({ texto: c.nombre, caixa: c.progresivo ? 'p' : 'r', pista: `${c.nombre}: de ${c.de} a ${c.a}.` }))}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'fenomenos',
    titulo: '¿Qué cambio es?',
    icono: '💧',
    explica: 'Fenómenos de la vida diaria.',
    crear: (acabar) => <Practica preguntas={FENOMENOS.map(preguntaFenomeno)} acabar={acabar} />,
  },
]

function preguntaFenomeno([f, id]: [string, string]): Pregunta {
  const c = CAMBIOS.find((x) => x.id === id)!
  return elixe(<>«{f}» ¿Qué cambio de estado es?</>, c.nombre, barallar(CAMBIOS.filter((x) => x.id !== id).map((x) => x.nombre)).slice(0, 3), <>De {c.de} a {c.a}: {c.nombre}, un cambio {c.progresivo ? 'progresivo' : 'regresivo'}.</>)
}

const ESQUEMA_PREG: Pregunta[] = [
  ...CAMBIOS.map((c) => toca(<>Toca la flecha de la {c.nombre}.</>, EsquemaCambios, NOMES_CAMBIOS, c.id, <>De {c.de} a {c.a}.</>)),
  ...CAMBIOS.map((c) => elixe(<>¿Cómo se llama el paso de {c.de} a {c.a}?</>, c.nombre, barallar(CAMBIOS.filter((x) => x !== c).map((x) => x.nombre)).slice(0, 3), <>{c.nombre}.</>)),
  ...CAMBIOS.map((c) => elixe(<>La {c.nombre}, ¿es un cambio progresivo o regresivo?</>, c.progresivo ? 'Progresivo' : 'Regresivo', [c.progresivo ? 'Regresivo' : 'Progresivo'], c.progresivo ? 'Se produce al calentar.' : 'Se produce al enfriar.')),
  ...FENOMENOS.map(preguntaFenomeno),
  elixe('¿Cómo se llaman los cambios que se producen al calentar?', 'Progresivos', ['Regresivos', 'Químicos', 'Inversos'], 'Fusión, vaporización y sublimación.'),
  elixe('Un cambio de estado, ¿es un cambio físico o químico?', 'Físico: la sustancia sigue siendo la misma', ['Químico: se forma otra sustancia', 'Ninguno de los dos'], 'El hielo, el agua y el vapor son la misma sustancia.'),
]

export function Esquema(p: PropsParada) {
  return <Parada {...p} unidade={U} id="esquema" titulo="Esquema de los cambios de estado" tarxetas={ESQUEMA_TARXETAS} xogos={ESQUEMA_XOGOS} preguntas={ESQUEMA_PREG} videos={[{ id: 'GYMnp5yRlfw', titulo: 'Cambios de estado en la materia', canal: 'Clases Particulares en Ávila', minutos: 4 }]} />
}

// ===================================================================================================
// 4. Propiedades de los cambios de estado (teoría cinética)
// ===================================================================================================

const PROPIEDADES_ESTADOS = [
  { texto: 'Forma y volumen constantes', caixa: 'sólido' },
  { texto: 'Ni se comprimen ni se expanden', caixa: 'sólido' },
  { texto: 'Partículas fuertemente unidas, solo vibran', caixa: 'sólido' },
  { texto: 'Forma variable y volumen constante', caixa: 'líquido' },
  { texto: 'Apenas se comprimen', caixa: 'líquido' },
  { texto: 'Grupos de partículas que se deslizan', caixa: 'líquido' },
  { texto: 'Forma y volumen variables', caixa: 'gas' },
  { texto: 'Se expanden y se comprimen', caixa: 'gas' },
  { texto: 'Fuerzas muy débiles: partículas libres', caixa: 'gas' },
]

const PROPIEDADES_TARXETAS: Tarxeta[] = [
  {
    titulo: 'La teoría cinética',
    texto: (
      <>
        <Lista
          items={[
            <>
              La materia está formada por {b('partículas muy pequeñas')}, más o menos unidas según el estado.
            </>,
            <>
              Las partículas {b('se mueven')}: cuanto más rápido, {b('más alta es la temperatura')}.
            </>,
            <>
              La {b('presión de un gas')} se debe a los choques de sus partículas con las paredes del recipiente.
            </>,
          ]}
        />
        <div className="grid gap-2 sm:grid-cols-3">
          <Caixa titulo="Sólido">Forma y volumen constantes. Partículas fuertemente unidas: solo vibran.</Caixa>
          <Caixa titulo="Líquido">Forma variable, volumen constante. Grupos de partículas que se deslizan.</Caixa>
          <Caixa titulo="Gas">Forma y volumen variables. Fuerzas muy débiles: se mueven libres.</Caixa>
        </div>
      </>
    ),
  },
  {
    titulo: 'Qué pasa al calentar',
    texto: (
      <>
        <p>
          Al calentar, {b('aumenta el movimiento')} de las partículas y se separan. Al fundirse un sólido o al hervir un líquido, {b('disminuyen las fuerzas de unión')} entre ellas.
        </p>
        <p>
          Al enfriar, pasa lo contrario: {b('disminuye el movimiento')} y, al condensarse o solidificarse, {b('aumentan las fuerzas de unión')}.
        </p>
      </>
    ),
  },
  {
    titulo: 'La temperatura no cambia mientras cambia el estado',
    texto: (
      <>
        <Lista
          items={[
            <>
              Para una {b('sustancia pura')}, el cambio se produce a una temperatura fija: el {b('punto de fusión')} (igual al de solidificación) o el {b('punto de ebullición')} (igual al de condensación).
            </>,
            <>
              Mientras cambia de estado, {b('la temperatura no varía')} aunque sigamos calentando: el calor se usa en separar las partículas.
            </>,
            <>
              Son {b('propiedades características')}: sirven para identificar la sustancia. El agua funde a 0 °C y hierve a 100 °C (a 1 atm).
            </>,
            <>Una mezcla, como el chocolate, no tiene una temperatura de fusión fija: funde poco a poco (de 28 °C a 50 °C).</>,
          ]}
        />
      </>
    ),
  },
  {
    titulo: 'Evaporación y ebullición',
    texto: (
      <div className="grid gap-2 sm:grid-cols-2">
        <Caixa titulo="Evaporación">
          Solo en la {b('superficie')} del líquido y a {b('cualquier temperatura')}. Va más rápido con más calor, más superficie o viento. Por eso la ropa se seca y el vapor de la ducha no está a 100 °C.
        </Caixa>
        <Caixa titulo="Ebullición">
          En {b('toda la masa')} del líquido y solo a {b('una temperatura')}: la de ebullición. El agua, a 100 °C.
        </Caixa>
      </div>
    ),
  },
  {
    titulo: 'La tabla de temperaturas (a 1 atm)',
    texto: (
      <>
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
        <Truco>Por debajo de la fusión: sólido. Entre fusión y ebullición: líquido. Por encima de la ebullición: gas.</Truco>
      </>
    ),
  },
  {
    titulo: 'El agua, una excepción',
    texto: (
      <p>
        Casi todas las sustancias son {b('más densas')} en estado sólido que en líquido. El agua no: el {b('hielo es menos denso')} que el agua. Por eso los icebergs flotan y una botella llena de agua revienta en el congelador.
      </p>
    ),
  },
]

/** ¿En qué estado está…? Temperaturas elegidas para cada sustancia, por debajo, entre y por encima de sus puntos. */
const ESTADOS_PREG: Pregunta[] = SUSTANCIAS.flatMap((s) => {
  const Ts = [s.fusion - 20, Math.round((s.fusion + s.ebullicion) / 2), s.ebullicion + 30]
  return Ts.map((T) => {
    const e = estadoA(s, T)
    return elixe(<>¿En qué estado está el {s.nombre} a {T} °C (y 1 atm)?</>, e, ['sólido', 'líquido', 'gas'].filter((x) => x !== e), <>El {s.nombre} funde a {s.fusion} °C y hierve a {s.ebullicion} °C: a {T} °C está {e}.</>)
  })
})

const FRASES_43: [string, string][] = [
  ['Cuando se calienta un sólido, ___ el movimiento de sus partículas.', 'aumenta'],
  ['Cuando se enfría un líquido, ___ el movimiento de sus partículas.', 'disminuye'],
  ['Cuando un gas se condensa, ___ las fuerzas de unión entre sus partículas.', 'aumenta'],
  ['Cuando un sólido se funde, ___ las fuerzas de unión entre sus partículas.', 'disminuye'],
]

const PROPIEDADES_XOGOS: Xogo[] = [
  {
    id: 'estados',
    titulo: 'Sólido, líquido o gas',
    icono: '🗂️',
    explica: 'Cada propiedad en su estado.',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'sólido', nome: 'Sólido', cor: 'border-orange-300 bg-orange-100' },
          { id: 'líquido', nome: 'Líquido', cor: 'border-sky-300 bg-sky-100' },
          { id: 'gas', nome: 'Gas', cor: 'border-green-300 bg-green-100' },
        ]}
        elementos={PROPIEDADES_ESTADOS}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'vf',
    titulo: 'Verdadero o falso',
    icono: '✅',
    explica: 'Sobre los cambios de estado.',
    crear: (acabar) => (
      <VerdadeiroFalso
        frases={[
          { texto: 'Mientras el hielo se funde, su temperatura sigue subiendo.', certa: false, explica: 'Se queda a 0 °C hasta que se funde todo.' },
          { texto: 'La evaporación ocurre a cualquier temperatura.', certa: true, explica: 'Y solo en la superficie.' },
          { texto: 'La ebullición ocurre solo en la superficie del líquido.', certa: false, explica: 'Ocurre en toda la masa del líquido.' },
          { texto: 'El punto de fusión coincide con el de solidificación.', certa: true, explica: 'Para una sustancia pura, sí.' },
          { texto: 'El hielo es más denso que el agua líquida.', certa: false, explica: 'Es menos denso: por eso flota.' },
          { texto: 'El chocolate tiene una temperatura de fusión fija.', certa: false, explica: 'No es una sustancia pura: funde entre 28 y 50 °C.' },
          { texto: 'Al calentar un sólido, sus partículas vibran más.', certa: true, explica: 'Aumenta la temperatura y la distancia entre ellas.' },
        ]}
        acabar={acabar}
      />
    ),
  },
  { id: 'tabla', titulo: '¿En qué estado está?', icono: '🌡️', explica: 'Usa la tabla de temperaturas.', crear: (acabar) => <Practica preguntas={ESTADOS_PREG} acabar={acabar} /> },
]

const PROPIEDADES_PREG: Pregunta[] = [
  ...FRASES_43.map(([f, c]) => elixe(f, c, [c === 'aumenta' ? 'disminuye' : 'aumenta'], c === 'aumenta' ? 'Aumenta.' : 'Disminuye.')),
  ...ESTADOS_PREG,
  ...PROPIEDADES_ESTADOS.map((p) => elixe(<>«{p.texto}». ¿De qué estado es?</>, p.caixa, ['sólido', 'líquido', 'gas'].filter((x) => x !== p.caixa), <>Es propio del {p.caixa}.</>)),
  elixe('¿Qué le pasa a la temperatura mientras una sustancia pura cambia de estado?', 'No varía, aunque sigamos calentando', ['Sube más deprisa', 'Baja', 'Sube y baja'], 'El calor se invierte en el cambio de estado.'),
  elixe('¿A qué temperatura se evapora el agua?', 'A cualquier temperatura', ['Solo a 100 °C', 'Solo por encima de 50 °C', 'Solo a 0 °C'], 'La evaporación ocurre a cualquier temperatura; la ebullición, solo a 100 °C.'),
  elixe('El vapor de la ducha no está a 100 °C. ¿Por qué?', 'Porque es una evaporación, no una ebullición', ['Porque el agua de la ducha no ha cambiado de estado', 'Porque el agua de la ducha hierve a menos temperatura'], 'Ejercicio 54.'),
  elixe('¿Por qué se seca antes la ropa cuando hace viento?', 'El viento aleja las partículas de vapor y la evaporación es más rápida', ['El viento calienta la ropa', 'El viento hace hervir el agua'], 'Favorece que las partículas de gas se alejen del líquido.'),
  elixe('¿Por qué revienta una botella llena de agua en el congelador?', 'El hielo ocupa más volumen: sus partículas están más separadas', ['El hielo pesa más que el agua', 'El frío rompe el cristal'], 'El agua es una excepción: el hielo es menos denso.'),
  elixe('¿Por qué es una propiedad característica el punto de fusión?', 'Tiene un valor propio de cada sustancia y permite identificarla', ['Depende de la cantidad de sustancia', 'Es igual para todas las sustancias'], 'Como la densidad o el punto de ebullición.'),
]

export function Propiedades(p: PropsParada) {
  return <Parada {...p} unidade={U} id="propiedades" titulo="Propiedades de los cambios de estado" tarxetas={PROPIEDADES_TARXETAS} xogos={PROPIEDADES_XOGOS} preguntas={PROPIEDADES_PREG} />
}

// ===================================================================================================
// 5. Gráficas de cambio de estado
// ===================================================================================================

const tabla = (ts: number[], Ts: number[]): Punto[] => ts.map((t, i) => ({ t, T: Ts[i] }))

/** Las tablas y gráficas del libro. */
export const DATOS_GRAFICAS = {
  ej19: tabla([0, 5, 10, 15, 20, 25], [30, 55, 78, 78, 78, 100]),
  ej18: tabla([0, 10, 20, 30, 40, 50], [20, 6, -8, -8, -8, -22]),
  pag43: tabla([0, 1, 2, 4, 6, 8, 10, 12], [24, 28, 40, 70, 100, 100, 100, 100]),
  hielo: calentamiento(sustancia('agua'), -20, 140, 20, 2),
}

const ESTADOS_TRAMO = ['sólido', 'sólido + líquido', 'líquido', 'líquido + gas', 'gas']

/** Preguntas sobre una curva de calentamiento de una sustancia de la tabla. */
function preguntasCurva(nombre: string, desde: number, hasta: number, ritmo: number): Pregunta[] {
  const s = sustancia(nombre)
  const c = calentamiento(s, desde, hasta, ritmo, 3)
  const ts = tramos(s, c)
  const graf = <GraficaT puntos={c} />
  const [f, e] = mesetas(c)
  const intro = `Se calienta una sustancia desde ${desde} °C hasta ${hasta} °C. `
  const conGrafica = (t: string) => (
    <>
      {intro}
      {t}
      <div className="mt-2 rounded-2xl border-2 border-violet-100 bg-white p-2 text-base font-normal">{graf}</div>
    </>
  )
  const r: Pregunta[] = [
    { tipo: 'numero', texto: conGrafica('¿Cuál es su temperatura de fusión?'), valor: f, unidade: '°C', marxe: 0, explica: <>El primer tramo horizontal está a {f} °C: ahí funde.</> },
    elixe(intro + 'Con la tabla de temperaturas, ¿qué sustancia es?', nombre, barallar(SUSTANCIAS.map((x) => x.nombre).filter((x) => x !== nombre)).slice(0, 3), <>Funde a {f} °C y hierve a {e} °C: es el {nombre}.</>, graf),
  ]
  if (e !== undefined) r.push({ tipo: 'numero', texto: conGrafica('¿Cuál es su temperatura de ebullición?'), valor: e, unidade: '°C', marxe: 0, explica: <>El segundo tramo horizontal está a {e} °C: ahí hierve.</> })
  ts.forEach((estado, i) =>
    r.push(
      elixe(
        <>
          {intro}¿Qué hay en el tramo {i + 1} (contando desde la izquierda)?
        </>,
        estado,
        ESTADOS_TRAMO.filter((x) => x !== estado).slice(0, 3),
        estado.includes('+') ? 'Tramo horizontal: está cambiando de estado y la temperatura no varía.' : `Tramo inclinado: el ${nombre} se calienta en estado ${estado}.`,
        graf,
      ),
    ),
  )
  return r
}

const CURVAS = [
  preguntasCurva('agua', -20, 120, 20),
  preguntasCurva('alcohol', -130, 100, 40),
  preguntasCurva('mercurio', -60, 400, 80),
  preguntasCurva('oxígeno', -230, -160, 10),
]

const GRAFICAS_FIJAS: Pregunta[] = [
  numero(<>Un líquido se calienta: {DATOS_GRAFICAS.ej19.map((p) => `${p.t} min → ${p.T} °C`).join('; ')}. ¿Cuál es su punto de ebullición?</>, mesetas(DATOS_GRAFICAS.ej19)[0], '°C', <>La temperatura se queda en 78 °C de los 10 a los 20 min: ahí hierve.</>, 0),
  elixe(<>Ese líquido hierve a 78 °C. Con la tabla, ¿qué sustancia es?</>, quienHierveA(78)!, ['agua', 'mercurio', 'oxígeno'], 'El alcohol hierve a 78 °C.', <GraficaT puntos={DATOS_GRAFICAS.ej19} />),
  numero(<>Un líquido se enfría en el congelador: {DATOS_GRAFICAS.ej18.map((p) => `${p.t} min → ${p.T} °C`).join('; ')}. ¿Cuál es su punto de fusión?</>, mesetas(DATOS_GRAFICAS.ej18)[0], '°C', <>Se queda en −8 °C mientras se solidifica: el punto de fusión es −8 °C.</>, 0),
  elixe('Esa sustancia se solidifica a −8 °C. ¿Podría ser agua?', 'No, porque el agua solidifica a 0 °C', ['Sí, porque está en el congelador', 'Sí, el agua solidifica a −8 °C'], `${quienFundeA(-8) ?? 'Ninguna sustancia de la tabla'} funde a −8 °C; el agua funde a 0 °C.`, <GraficaT puntos={DATOS_GRAFICAS.ej18} />),
  numero(<>Al calentar agua se anota: {DATOS_GRAFICAS.pag43.map((p) => `${p.t} min → ${p.T} °C`).join('; ')}. ¿Cuál es la temperatura de ebullición del agua?</>, 100, '°C', <>A partir de los 6 min la temperatura no sube: hierve a 100 °C.</>, 0),
  elixe('¿Puede pasar el agua líquida de 100 °C mientras hierve?', 'No: mientras hierve la temperatura no varía', ['Sí, si subimos la potencia', 'Sí, a los 12 minutos'], 'Con más potencia hierve antes, pero sigue a 100 °C.'),
  numero(<>Un gas encerrado en una ampolla se enfría y la temperatura se queda en 80 °C unos minutos. Si luego lo calentamos, ¿a qué temperatura hervirá el líquido?</>, 80, '°C', <>La condensación y la ebullición se producen a la misma temperatura: 80 °C.</>, 0),
  elixe('Dos líquidos A y B se enfrían. A tiene un tramo horizontal a 0 °C y B a −39 °C. ¿Qué son?', 'A es agua y B es mercurio', ['A es mercurio y B es agua', 'Los dos son agua', 'A es alcohol y B es oxígeno'], 'Ejemplo resuelto 4: son sustancias diferentes.'),
  elixe('En una gráfica de temperatura frente al tiempo, ¿qué significa un tramo horizontal?', 'Que hay un cambio de estado', ['Que la sustancia no recibe calor', 'Que es un gas', 'Que se ha terminado el experimento'], 'La temperatura no varía mientras cambia de estado.'),
  elixe('Si dos líquidos se enfrían durante el mismo tiempo, ¿cuál se enfría más rápido?', 'El de la recta con más pendiente', ['El de la recta más plana', 'El que está más arriba', 'Los dos igual'], 'Más pendiente: baja más grados en el mismo tiempo.'),
]

const GRAFICAS_TARXETAS: Tarxeta[] = [
  {
    titulo: 'La gráfica de calentamiento del agua',
    texto: (
      <>
        <p>Calentamos hielo a −20 °C hasta que todo es vapor. Cada tramo de la gráfica dice qué hay en el vaso:</p>
        <Lista
          items={[
            <>
              {b('Tramos inclinados')}: la temperatura sube. Hay un solo estado.
            </>,
            <>
              {b('Tramos horizontales')}: la temperatura no cambia. Está {b('cambiando de estado')}: a 0 °C funde (hielo + agua) y a 100 °C hierve (agua + vapor).
            </>,
          ]}
        />
      </>
    ),
    visual: <GraficaT puntos={DATOS_GRAFICAS.hielo} rotulos={tramos(sustancia('agua'), DATOS_GRAFICAS.hielo)} />,
    ancho: true,
  },
  {
    titulo: 'La gráfica de enfriamiento',
    texto: (
      <p>
        Es al revés: los tramos inclinados bajan y en los horizontales se {b('condensa')} o se {b('solidifica')}. La temperatura del tramo horizontal es la misma que al calentar: −8 °C en este ejemplo.
      </p>
    ),
    visual: <GraficaT puntos={DATOS_GRAFICAS.ej18} rotulos={['líquido', 'líquido', 'líquido + sólido', 'líquido + sólido', 'sólido']} />,
    ancho: true,
  },
  {
    titulo: 'Cómo leerla en el examen',
    texto: (
      <Lista
        items={[
          <>1. Busca los tramos horizontales y lee su temperatura en el eje vertical.</>,
          <>2. El primero (el más bajo) es el punto de fusión; el segundo, el de ebullición.</>,
          <>3. Busca esa temperatura en la tabla para saber qué sustancia es.</>,
          <>4. Si te dan una tabla, mira qué temperatura se repite: ese es el cambio de estado.</>,
          <>5. Si piden cuál se calienta o se enfría más rápido: la recta con más pendiente.</>,
        ]}
      />
    ),
  },
]

const GRAFICAS_XOGOS: Xogo[] = [
  { id: 'tramos', titulo: 'Lee la gráfica', icono: '📈', explica: 'Tramos, temperaturas y sustancias.', crear: (acabar) => <Practica preguntas={CURVAS.flat()} acabar={acabar} /> },
  { id: 'libro', titulo: 'Las del libro', icono: '📘', explica: 'Tablas y gráficas de los ejercicios.', crear: (acabar) => <Practica preguntas={GRAFICAS_FIJAS} acabar={acabar} /> },
]

const GRAFICAS_PREG: Pregunta[] = [...GRAFICAS_FIJAS, ...CURVAS.flat()]

export function Graficas(p: PropsParada) {
  return <Parada {...p} unidade={U} id="graficas" titulo="Gráficas de cambio de estado" tarxetas={GRAFICAS_TARXETAS} xogos={GRAFICAS_XOGOS} preguntas={GRAFICAS_PREG} />
}

// ===================================================================================================
// 6. Ley de Boyle-Mariotte
// ===================================================================================================

const PRESIONES = [1, 1.5, 2, 2.5, 3, 4, 5, 6]
const VOLUMENES = [2, 3, 4, 5, 6, 8, 10, 12]
const CAMBIOS_V = [2, 3, 0.5, 1.5, 4, 0.25]

/** Problemas de Boyle-Mariotte con resultados de pocos decimales; a veces dan una temperatura que no hace falta. */
function problemasBoyle(n: number): Pregunta[] {
  const r: Pregunta[] = []
  for (let i = 0; i < n; i++) {
    const p1 = PRESIONES[(i * 5) % PRESIONES.length]
    const V1 = VOLUMENES[(i * 3) % VOLUMENES.length]
    const f = CAMBIOS_V[i % CAMBIOS_V.length]
    const V2 = V1 * f
    const p2 = boyle(p1, V1, null, V2)
    const T = [20, 25, 60][i % 3]
    const temp = i % 2 ? ` a ${T} °C` : ''
    if (i % 2 === 0)
      r.push({
        tipo: 'numero',
        texto: <>En un recipiente de {escribe(V1)} L hay un gas{temp} a {escribe(p1)} atm. ¿Qué presión ejercerá si el volumen pasa a {escribe(V2)} L sin variar la temperatura?</>,
        valor: p2,
        unidade: 'atm',
        explica: <>T constante → Boyle-Mariotte: p₁·V₁ = p₂·V₂ → p₂ = {escribe(p1)} · {escribe(V1)} / {escribe(V2)} = {escribe(p2)} atm.</>,
      })
    else
      r.push({
        tipo: 'numero',
        texto: <>Un gas{temp} ocupa {escribe(V1)} L a {escribe(p1)} atm. ¿Qué volumen ocupará si la presión pasa a {escribe(p2)} atm y la temperatura no varía?</>,
        valor: V2,
        unidade: 'L',
        explica: <>p₁·V₁ = p₂·V₂ → V₂ = {escribe(p1)} · {escribe(V1)} / {escribe(p2)} = {escribe(V2)} L. {temp && 'La temperatura no se usa: es constante.'}</>,
      })
  }
  return r.filter((p) => p.tipo === 'numero' && Math.abs(p.valor * 100 - Math.round(p.valor * 100)) < 1e-9)
}

const BOYLE_FIJAS: Pregunta[] = [
  numero('En un recipiente de 3 L hay nitrógeno a 4 atm. ¿Qué presión ejercerá si el volumen se amplía hasta 6 L sin variar la temperatura?', boyle(4, 3, null, 6), 'atm', <>4 atm · 3 L = p₂ · 6 L → p₂ = 12 / 6 = 2 atm.</>),
  numero('En un recipiente de 3 L hay N₂ a 4 atm. Si la presión disminuye a 3 atm, ¿qué volumen ocupará? La temperatura no varía.', boyle(4, 3, 3, null), 'L', <>4 atm · 3 L = 3 atm · V₂ → V₂ = 12 / 3 = 4 L.</>),
  numero('Un gas ocupa 2 L a 2 atm y 60 °C. ¿Qué volumen ocupará si la presión es de 1,25 atm y la temperatura no varía?', boyle(2, 2, 1.25, null), 'L', <>2 · 2 = 1,25 · V₂ → V₂ = 4 / 1,25 = 3,2 L. Los 60 °C no se usan.</>),
  numero('En 3 L hay un gas a 2 atm y 60 °C. ¿Qué volumen tendrá si la presión se duplica a 4 atm sin variar la temperatura?', boyle(2, 3, 4, null), 'L', <>V₂ = 2 · 3 / 4 = 1,5 L. Al aumentar la presión, disminuye el volumen.</>),
  elixe('¿Qué dice la ley de Boyle-Mariotte?', 'A temperatura constante, el producto de la presión por el volumen permanece constante', ['A volumen constante, p/T permanece constante', 'A presión constante, V/T permanece constante', 'La presión y el volumen son directamente proporcionales'], 'p · V = cte.; p₁·V₁ = p₂·V₂.'),
  elixe('En la ley de Boyle-Mariotte, ¿qué magnitud se mantiene constante?', 'La temperatura', ['La presión', 'El volumen', 'La masa del recipiente'], 'Es la experiencia a T = cte.'),
  elixe('Según Boyle-Mariotte, la presión y el volumen son…', 'Inversamente proporcionales', ['Directamente proporcionales', 'Iguales', 'Independientes'], 'Si uno aumenta, el otro disminuye.'),
  elixe('Si el volumen de un gas se duplica (T constante), su presión…', 'Se reduce a la mitad', ['Se duplica', 'No cambia', 'Se triplica'], 'p₂ = p₁ · V₁ / (2V₁) = p₁ / 2.'),
  elixe('Si la presión de un gas se triplica (T constante), su volumen…', 'Se reduce a la tercera parte', ['Se triplica', 'No cambia', 'Se reduce a la mitad'], 'V₂ = V₁ / 3.'),
  elixe('¿Qué forma tiene la gráfica de la presión frente al volumen?', 'Una hipérbola', ['Una recta que pasa por el (0, 0)', 'Una recta horizontal', 'Una parábola'], 'A más volumen, menos presión.'),
  elixe('¿Qué ley se aplica si el volumen es constante?', 'La de Gay-Lussac (p₁/T₁ = p₂/T₂)', ['La de Boyle-Mariotte', 'La de Charles'], 'Boyle: T = cte.; Gay-Lussac: V = cte.; Charles: p = cte.'),
  elixe('Una botella cerrada en un avión se arruga al aterrizar. ¿Qué ley lo explica?', 'Boyle-Mariotte: al aumentar la presión de fuera, el aire de dentro ocupa menos volumen', ['Gay-Lussac: se calienta el aire', 'Charles: cambia la temperatura'], 'Ejercicio 49.'),
]

const BOYLE_TARXETAS: Tarxeta[] = [
  {
    titulo: 'Las magnitudes de los gases',
    texto: (
      <div className="grid gap-2 sm:grid-cols-3">
        <Caixa titulo="p: presión">En atmósferas (atm). Se debe a los choques de las partículas con las paredes.</Caixa>
        <Caixa titulo="V: volumen">En litros (L).</Caixa>
        <Caixa titulo="T: temperatura">En kelvin (K): T (K) = T (°C) + 273.</Caixa>
      </div>
    ),
  },
  {
    titulo: 'La ley de Boyle-Mariotte',
    texto: (
      <>
        <p>
          A {b('temperatura constante')}, el {b('producto de la presión por el volumen')} que ocupa un gas permanece constante.
        </p>
        <Formula>p · V = cte. → p₁ · V₁ = p₂ · V₂</Formula>
        <p>
          La presión y el volumen son {b('inversamente proporcionales')}: a mayor volumen, menor presión, y al revés. La gráfica es una {b('hipérbola')}.
        </p>
      </>
    ),
    visual: <GraficaBoyle k={15} puntos={[3, 5, 15, 30]} />,
  },
  {
    titulo: 'Cómo resolver un problema',
    texto: (
      <>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-lg">
          <Caixa titulo="Estado 1">
            p₁ = 2 atm
            <br />V₁ = 3 L
            <br />T₁ = 60 °C
          </Caixa>
          <span className="font-bold text-violet-700">T = cte. →</span>
          <Caixa titulo="Estado 2">
            p₂ = 4 atm
            <br />V₂ = ?
            <br />T₂ = 60 °C
          </Caixa>
        </div>
        <Lista
          items={[
            <>1. Escribe los datos de los dos estados.</>,
            <>2. Si la temperatura no cambia, aplica Boyle-Mariotte.</>,
            <>3. Despeja lo que te piden: V₂ = p₁ · V₁ / p₂ = 2 · 3 / 4 = 1,5 L.</>,
            <>4. Comprueba que tiene sentido: si la presión sube, el volumen baja.</>,
          ]}
        />
        <Truco>Si te dan la temperatura y no cambia, no la uses: está ahí para despistar.</Truco>
      </>
    ),
  },
  {
    titulo: 'Las otras dos leyes (para reconocerlas)',
    texto: (
      <div className="grid gap-2 sm:grid-cols-3">
        <Caixa titulo="Boyle-Mariotte">T = cte.: p₁·V₁ = p₂·V₂</Caixa>
        <Caixa titulo="Gay-Lussac">V = cte.: p₁/T₁ = p₂/T₂ (T en K)</Caixa>
        <Caixa titulo="Charles">p = cte.: V₁/T₁ = V₂/T₂ (T en K)</Caixa>
      </div>
    ),
  },
]

const BOYLE_XOGOS: Xogo[] = [
  { id: 'problemas', titulo: 'Problemas', icono: '🎈', explica: 'p₁·V₁ = p₂·V₂.', crear: (acabar) => <Practica preguntas={[...BOYLE_FIJAS.filter((p) => p.tipo === 'numero'), ...problemasBoyle(30)]} acabar={acabar} /> },
  {
    id: 'vf',
    titulo: 'Verdadero o falso',
    icono: '✅',
    explica: 'Sobre la ley.',
    crear: (acabar) => (
      <VerdadeiroFalso
        frases={[
          { texto: 'Si comprimo un gas a temperatura constante, su presión aumenta.', certa: true, explica: 'Menos volumen, más presión.' },
          { texto: 'En Boyle-Mariotte la temperatura tiene que estar en kelvin.', certa: false, explica: 'No hace falta: la temperatura no aparece en la fórmula.' },
          { texto: 'p₁·V₁ = p₂·V₂ solo vale si la temperatura no cambia.', certa: true, explica: 'Es la condición de la ley.' },
          { texto: 'La presión y el volumen son directamente proporcionales.', certa: false, explica: 'Son inversamente proporcionales.' },
          { texto: 'La gráfica p-V es una hipérbola.', certa: true, explica: 'Como la del libro: 30 L → 0,5 atm; 3 L → 5 atm.' },
        ]}
        acabar={acabar}
      />
    ),
  },
]

const BOYLE_PREG: Pregunta[] = [...BOYLE_FIJAS, ...problemasBoyle(20)]

export function Boyle(p: PropsParada) {
  return <Parada {...p} unidade={U} id="boyle" titulo="Ley de Boyle-Mariotte" videos={[{ id: 'Rst4SND2evk', titulo: 'Ley de Boyle y Mariotte', canal: 'Clases Particulares en Ávila', minutos: 7 }]} tarxetas={BOYLE_TARXETAS} xogos={BOYLE_XOGOS} preguntas={BOYLE_PREG} />
}

export const PREGUNTAS_FQ1: Record<string, Pregunta[]> = {
  unidades: UNIDADES_PREG,
  densidad: DENSIDAD_PREG,
  esquema: ESQUEMA_PREG,
  propiedades: PROPIEDADES_PREG,
  graficas: GRAFICAS_PREG,
  boyle: BOYLE_PREG,
}
