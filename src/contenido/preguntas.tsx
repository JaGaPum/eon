// Ejercicios del modo Practicar de cada parada: los de las hojas de clase y los generadores de ejercicios nuevos.
import type { ReactNode } from 'react'
import type { Pregunta } from '../componentes/Practica'
import { potenciasDe, valorRespuesta } from '../componentes/Respuesta'
import { Potencias } from '../componentes/visuales'
import { ent, Recta } from '../componentes/piezas'
import { resolver } from '../lib/expresion'
import { CLASE, type Ejercicio } from './tema1'
import { agrupar, comunes, CRITERIOS, criterio, esPrimo, factores, paso, productoDe, valor as valorDe, type Potencia } from '../lib/mates'

// Hojas de las que salen los ejercicios. La clave forma parte del id con el que se guarda el progreso.
const HOJAS = {
  A: 'Ejercicios y actividades',
  B: 'Hoja del tema 1',
  M: 'Hoja de máx. y mín.',
  P: 'Problemas',
  C1: 'Combinadas 1',
  C2: 'Combinadas 2',
  AU: 'Autoevaluación',
} as const
type Hoja = keyof typeof HOJAS

const LETRAS = 'abcdefgh'
const azar = <T,>(lista: readonly T[]) => lista[Math.floor(Math.random() * lista.length)]
const entre = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1))
const juntar = (xs: (string | number)[]) => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} y ${xs[xs.length - 1]}` : String(xs[0]))

/** Dónde va un ejercicio: parada, hoja y número. Sin esto es un ejercicio generado. */
type Sitio = [parada: string, hoja: Hoja, etq: string] | null
const ficha = (sitio: Sitio) => (sitio ? { id: `${sitio[0]}:${sitio[1]}${sitio[2]}`, etq: sitio[2], grupo: HOJAS[sitio[1]] } : { id: '', etq: '' })

// ---------- Constructores ----------

function pNum(sitio: Sitio, enunciado: ReactNode, valor: number, pistas: ReactNode[], acierto?: ReactNode): Pregunta {
  return { ...ficha(sitio), enunciado, entrada: 'numero', correcta: String(valor), pistas, acierto }
}

function pMulti(sitio: Sitio, enunciado: ReactNode, opciones: (string | number)[], buenas: (string | number)[], pistas: ReactNode[]): Pregunta {
  const textos = opciones.map(String)
  const validas = buenas.map(String)
  return {
    ...ficha(sitio),
    enunciado,
    entrada: { multi: textos },
    correcta: textos.filter((x) => validas.includes(x)).join('|'),
    pistas: [...pistas, validas.length ? `Hay ${validas.length} que ${validas.length > 1 ? 'valen' : 'vale'}.` : 'No vale ninguna.'],
  }
}

/** Afirmación para razonar: se elige y después se explica por qué, con un ejemplo. */
function pRazona(sitio: Sitio, afirmacion: ReactNode, correcta: string, explicacion: string, opciones = ['Verdadera', 'Falsa']): Pregunta {
  return {
    ...ficha(sitio),
    enunciado: afirmacion,
    entrada: { opciones },
    correcta,
    pistas: ['Prueba con números concretos. Si encuentras un solo ejemplo que no la cumple, no es cierta siempre.'],
    acierto: `¡Correcto! ${explicacion}`,
    fallo: () => `No. ${explicacion}`,
  }
}

function pOrden(sitio: Sitio, enunciado: ReactNode, nums: number[], sentido: 'asc' | 'desc' = 'asc'): Pregunta {
  const ordenados = [...nums].sort((a, b) => (sentido === 'asc' ? a - b : b - a))
  return {
    ...ficha(sitio),
    enunciado,
    entrada: { orden: nums.map(ent), sep: sentido === 'asc' ? '<' : '>' },
    correcta: ordenados.map(ent).join('|'),
    pistas: [
      'Cualquier negativo es menor que el 0, y el 0 es menor que cualquier positivo.',
      'Entre dos negativos es menor el que tiene mayor valor absoluto: −9 es menor que −2.',
      `El primero es ${ent(ordenados[0])}.`,
    ],
  }
}

interface OpcionesExpr {
  modo?: 'quitar'
  enunciado?: string
  pista?: ReactNode
}

/** Una operación para calcular. Las pistas son sus pasos, uno a uno. */
function pExpr(sitio: Sitio, operacion: string, o: OpcionesExpr = {}): Pregunta {
  const r = resolver(operacion, o.modo)
  return {
    ...ficha(sitio),
    enunciado: (
      <>
        {o.enunciado ?? 'Calcula:'}
        <span className="mt-2 block text-2xl font-bold whitespace-nowrap">{r.inicial}</span>
      </>
    ),
    entrada: 'numero',
    correcta: String(r.resultado),
    pistas: [
      ...(o.pista ? [o.pista] : []),
      ...r.pasos.map((p) => (
        <>
          {p.porque} <b>{p.cuenta}</b> Queda: <span className="whitespace-nowrap">{p.despues}</span>
        </>
      )),
    ],
    fallo: (resp) =>
      r.resultado !== 0 && Number(resp) === -r.resultado ? 'El número está bien, pero el signo no. Repasa dónde cambia el signo.' : undefined,
  }
}

function pMcd(sitio: Sitio, nums: number[], modo: 'mcd' | 'mcm', problema?: { enunciado: ReactNode; pista: string; acierto?: ReactNode }): Pregunta {
  const nombre = modo === 'mcd' ? 'm.c.d.' : 'm.c.m.'
  const cols = comunes(nums, modo)
  const valor = productoDe(cols)
  const otro = productoDe(comunes(nums, modo === 'mcd' ? 'mcm' : 'mcd'))
  const elegidas = cols.filter((c) => c.elegido > 0).map((c): [number, number] => [c.primo, c.elegido])
  return {
    ...ficha(sitio),
    enunciado: problema?.enunciado ?? `Calcula el ${nombre} de ${juntar(nums)}.`,
    // En los problemas se pide una cantidad («cuántas piezas»): ahí solo vale el número.
    entrada: problema ? 'numero' : { numeroOPotencias: true },
    correcta: String(valor),
    acierto: problema?.acierto,
    pistas: [
      ...(problema ? [problema.pista] : []),
      <>
        Descompón cada número:{' '}
        {nums.map((n, i) => (
          <span key={n}>
            {i > 0 && ' · · · '}
            {n} = {n === 1 ? 1 : <Potencias potencias={agrupar(factores(n))} />}
          </span>
        ))}
      </>,
      modo === 'mcd' ? 'Para el m.c.d.: solo los factores comunes, con el menor exponente.' : 'Para el m.c.m.: los comunes y los no comunes, con el mayor exponente.',
      <>
        {nombre} = {elegidas.length ? <Potencias potencias={elegidas} /> : '1 (no tienen ningún factor primo común)'}
      </>,
    ],
    fallo: (resp) => {
      if (valorRespuesta(resp) === otro && otro !== valor) {
        return `Eso es el ${modo === 'mcd' ? 'mínimo común múltiplo' : 'máximo común divisor'}, y se pide el ${nombre} ${
          modo === 'mcd' ? 'Para el m.c.d. solo valen los factores comunes, con el menor exponente.' : 'Para el m.c.m. entran todos los factores, con el mayor exponente.'
        }`
      }
      // Si respondió en potencias se le puede decir qué primo falla.
      const dadas = potenciasDe(resp)
      if (!dadas) return undefined
      const ajeno = dadas.find(([p]) => !cols.some((c) => c.primo === p))
      if (ajeno) return `El ${ajeno[0]} no aparece en la descomposición de ninguno de los números, así que no puede estar en el ${nombre}`
      const mal = cols.find((c) => (new Map(dadas).get(c.primo) ?? 0) !== c.elegido)
      return mal && `Revisa el ${mal.primo}. ${mal.razon}`
    },
  }
}

const serie = (parada: string, hoja: Hoja, num: string | number, operaciones: string[], o?: OpcionesExpr) =>
  operaciones.map((op, i) => pExpr([parada, hoja, operaciones.length > 1 ? `${num}${LETRAS[i]}` : String(num)], op, o))

// ---------- 1. Reglas de divisibilidad ----------

const LISTA_1 = [9, 21, 24, 30, 48, 50, 100, 120]
const LISTA_3 = [1, 3, 7, 9, 14, 28, 15, 77]
const CIFRAS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

function pDivisiblePor(sitio: Sitio, n: number): Pregunta {
  return pMulti(sitio, <>¿Por cuáles de estos números es divisible <b>{n}</b>?</>, CRITERIOS, CRITERIOS.filter((d) => n % d === 0), [
    'Aplica el criterio de cada divisor, uno por uno.',
    'Última cifra para el 2, el 5 y el 10. Dos últimas cifras para el 4, el 25 y el 100. Suma de las cifras para el 3 y el 9.',
  ])
}

function pPrimo(sitio: Sitio, n: number): Pregunta {
  const s = paso(n)
  return {
    ...ficha(sitio),
    enunciado: <>¿El número <b>{n}</b> es primo o compuesto?</>,
    entrada: { opciones: ['Primo', 'Compuesto'] },
    correcta: esPrimo(n) ? 'Primo' : 'Compuesto',
    pistas: ['Prueba a dividirlo entre los primos en orden: 2, 3, 5, 7, 11, 13… Si alguno da exacto, es compuesto.', s.texto],
    acierto: `¡Correcto! ${s.texto}`,
    fallo: () => `No. ${s.texto}`,
  }
}

export const REGLAS: Pregunta[] = [
  ...[3, 12, 20, 25].map((k, i) =>
    pMulti(['reglas', 'A', `1${LETRAS[i]}`], <>Selecciona los múltiplos de <b>{k}</b>.</>, LISTA_1, LISTA_1.filter((n) => n % k === 0), [
      `Un número es múltiplo de ${k} si al dividirlo entre ${k} la división es exacta.`,
      CRITERIOS.includes(k) ? `Usa el criterio del ${k} con cada número.` : `No hay criterio directo para el ${k}: prueba a dividir cada número entre ${k}.`,
    ]),
  ),
  pRazona(['reglas', 'A', '2a'], '«Si un número es múltiplo de 9, también lo es de 3.» ¿Verdadera o falsa?', 'Verdadera', 'Como 9 = 3 · 3, cualquier múltiplo de 9 es 9 · k = 3 · (3 · k): también es múltiplo de 3.'),
  pRazona(['reglas', 'A', '2b'], '«Si un número es múltiplo de 5, lo es también de 25.» ¿Verdadera o falsa?', 'Falsa', 'Basta un ejemplo: 10 es múltiplo de 5 y no lo es de 25.'),
  ...[30, 45, 56, 77].map((k, i) =>
    pMulti(['reglas', 'A', `3${LETRAS[i]}`], <>Selecciona los divisores de <b>{k}</b>.</>, LISTA_3, LISTA_3.filter((n) => k % n === 0), [
      `Un número es divisor de ${k} si ${k} dividido entre él da exacto.`,
      `Prueba a dividir ${k} entre cada uno.`,
    ]),
  ),
  pRazona(['reglas', 'A', '4a'], 'Si un número es múltiplo de 8, ¿será también múltiplo de 4?', 'Siempre', 'Como 8 = 4 · 2, cualquier múltiplo de 8 es 8 · k = 4 · (2 · k): siempre es múltiplo de 4.', ['Siempre', 'No siempre']),
  pRazona(['reglas', 'A', '4b'], 'Si un número es múltiplo de 8, ¿será también múltiplo de 16?', 'No siempre', '16 sí lo es, pero 8 y 24 son múltiplos de 8 y no de 16.', ['Siempre', 'No siempre']),
  ...[48, 75, 319, 4510].map((n, i) => pDivisiblePor(['reglas', 'A', `5${LETRAS[i]}`], n)),
  ...[567, 397, 611, 121, 539, 241].map((n, i) => pPrimo(['reglas', 'B', `1${LETRAS[i]}`], n)),
  pRazona(['reglas', 'B', '3a'], '«Los múltiplos de un número son mayores o iguales que él.» ¿Verdadera o falsa?', 'Verdadera', 'Los múltiplos salen de multiplicar el número por 1, 2, 3…: el primero es él mismo y los demás son mayores.'),
  pRazona(['reglas', 'B', '3b'], '«Todos los números primos son impares.» ¿Verdadera o falsa?', 'Falsa', 'El 2 es primo y es par. Es el único primo par.'),
  pRazona(['reglas', 'B', '3c'], '«No existe ningún número compuesto que sea impar.» ¿Verdadera o falsa?', 'Falsa', 'El 9 es impar y compuesto: 9 = 3 · 3. También el 15, el 21, el 25…'),
  pRazona(['reglas', 'B', '3d'], '«Si un número a es divisor de b, entonces b es múltiplo de a.» ¿Verdadera o falsa?', 'Verdadera', 'Son la misma relación vista desde los dos lados: 3 es divisor de 24, y 24 es múltiplo de 3.'),
  pMulti(
    ['reglas', 'B', '4a'],
    <>El número <b>243a</b> tiene una cifra desconocida, a. ¿Qué valores de a lo hacen divisible por 3 pero no por 5?</>,
    CIFRAS,
    CIFRAS.filter((a) => (2430 + a) % 3 === 0 && (2430 + a) % 5 !== 0),
    ['Divisible por 3: la suma 2 + 4 + 3 + a = 9 + a tiene que ser múltiplo de 3.', 'No divisible por 5: a no puede ser 0 ni 5.'],
  ),
  pMulti(
    ['reglas', 'B', '4b'],
    <>¿Qué valores de a hacen que <b>243a</b> sea divisible por 2 pero no por 3?</>,
    CIFRAS,
    CIFRAS.filter((a) => a % 2 === 0 && (2430 + a) % 3 !== 0),
    ['Divisible por 2: a tiene que ser cifra par.', 'No divisible por 3: la suma 9 + a no puede ser múltiplo de 3.'],
  ),
  pMulti(
    ['reglas', 'B', '4c'],
    <>¿Qué valor de a hace que <b>243a</b> sea divisible por 11?</>,
    CIFRAS,
    CIFRAS.filter((a) => (2430 + a) % 11 === 0),
    ['Posiciones impares: 2 + 3 = 5. Posiciones pares: 4 + a.', 'La diferencia entre las dos sumas tiene que ser 0 o múltiplo de 11.'],
  ),
]

export function nuevaReglas(): Pregunta {
  for (;;) {
    const n = azar([entre(10, 99), entre(100, 999), entre(1000, 9999)]) * azar([1, 1, 2, 3, 5])
    if (n <= 9999 && CRITERIOS.some((d) => n % d === 0)) {
      const q = pDivisiblePor(null, n)
      return { ...q, acierto: `¡Correcto! ${CRITERIOS.filter((d) => n % d === 0).map((d) => criterio(n, d).texto).join(' ')}` }
    }
  }
}

// ---------- 3 y 4. Máximo común divisor y mínimo común múltiplo ----------

const lote = (parada: string, modo: 'mcd' | 'mcm', hoja: Hoja, num: string | number, grupos: number[][]) =>
  grupos.map((nums, i) => pMcd([parada, hoja, grupos.length > 1 ? `${num}${LETRAS[i]}` : String(num)], nums, modo))

// Ejercicio 12: los números vienen ya descompuestos.
const DADOS_12: Potencia[][][] = [
  [[[2, 4], [3, 2]], [[3, 4]]],
  [[[2, 2], [3, 1]], [[2, 3], [5, 1]]],
  [[[2, 3]], [[3, 2]]],
  [[[2, 2], [5, 1]], [[2, 1], [5, 2]], [[3, 2], [5, 1]]],
]
const ejercicio12 = (modo: 'mcd' | 'mcm') =>
  DADOS_12.map((grupo, i) =>
    pMcd([modo, 'A', `12${LETRAS[i]}`], grupo.map(valorDe), modo, {
      enunciado: (
        <>
          Calcula el {modo === 'mcd' ? 'm.c.d.' : 'm.c.m.'} de{' '}
          {grupo.map((p, j) => (
            <span key={j}>
              {j > 0 && (j === grupo.length - 1 ? ' y ' : ', ')}
              <b className="whitespace-nowrap">
                <Potencias potencias={p} />
              </b>
            </span>
          ))}
          .
        </>
      ),
      pista: 'Los números ya vienen descompuestos: no hay que calcularlos, solo elegir los factores.',
    }),
  )

const REPARTIR ='Hay que hacer grupos iguales lo más grandes posible: el número buscado divide a todos. Es un problema de m.c.d.'
const COINCIDIR = 'Se busca la primera vez que todo vuelve a coincidir: el número buscado es múltiplo de todos. Es un problema de m.c.m.'

export const MCD: Pregunta[] = [
  ...lote('mcd', 'mcd', 'A', 10, [[81, 99], [120, 320], [112, 121], [40, 64, 90], [72, 105, 400], [228, 612, 900]]),
  ...ejercicio12('mcd'),
  ...lote('mcd', 'mcd', 'B', 8, [[45, 63], [75, 625], [46, 33, 115]]),
  ...lote('mcd', 'mcd', 'M', 1, [[40, 60], [35, 48], [70, 62], [100, 150], [225, 300], [415, 520]]),
  ...lote('mcd', 'mcd', 'M', 2, [[280, 840], [315, 945]]),
  ...lote('mcd', 'mcd', 'M', 3, [[180, 252, 594], [924, 1000, 1250]]),
  pMcd(['mcd', 'P', '1'], [162, 96], 'mcd', {
    enunciado:
      'En una frutería tienen 162 manzanas y 96 naranjas. Quieren colocarlas en bandejas con el mismo número de piezas, sin mezclarlas, y que cada bandeja lleve el máximo posible. ¿Cuántas piezas lleva cada bandeja?',
    pista: REPARTIR,
    acierto: '¡Correcto! Con 6 piezas por bandeja salen 162 : 6 = 27 bandejas de manzanas y 96 : 6 = 16 de naranjas.',
  }),
  pMcd(['mcd', 'P', '2'], [25, 15, 90], 'mcd', {
    enunciado: 'María y Jorge tienen 25 bolas blancas, 15 azules y 90 rojas. Quieren hacer el mayor número de collares iguales sin que sobre ninguna bola. ¿Cuántos collares pueden hacer?',
    pista: REPARTIR,
    acierto: '¡Correcto! Son 5 collares, cada uno con 5 bolas blancas, 3 azules y 18 rojas.',
  }),
  pMcd(['mcd', 'P', '3'], [360, 150], 'mcd', {
    enunciado: 'Un campo rectangular de 360 m de largo y 150 m de ancho se divide en parcelas cuadradas iguales, lo más grandes posible. ¿Cuántos metros mide el lado de cada parcela?',
    pista: REPARTIR,
  }),
  pMcd(['mcd', 'P', '4'], [12, 9], 'mcd', {
    enunciado: 'Juan pone un rodapié en dos paredes de 12 m y 9 m. Quiere el listón más largo que quepa un número exacto de veces en cada pared. ¿Cuántos metros mide el listón?',
    pista: REPARTIR,
  }),
  pMcd(['mcd', 'AU', '8'], [840, 455, 315], 'mcd', {
    enunciado:
      'Un almacén tiene 840 latas de atún, 455 de mejillones y 315 de berberechos. Quiere guardarlas en cajas del mismo tamaño, sin mezclar productos, usando el menor número de cajas. ¿Cuántas latas lleva cada caja?',
    pista: REPARTIR,
    acierto: '¡Correcto! Con 35 latas por caja hay 24 cajas de atún, 13 de mejillones y 9 de berberechos.',
  }),
  // Los dos problemas que en la hoja vienen resueltos, para que los intente antes de mirar la solución.
  pMcd(['mcd', 'P', '5'], [256, 96], 'mcd', {
    enunciado: 'Un ebanista quiere cortar una plancha de madera de 256 cm de largo y 96 cm de ancho en cuadrados lo más grandes posible. ¿Cuántos centímetros mide el lado de cada cuadrado?',
    pista: REPARTIR,
  }),
  pNum(['mcd', 'P', '6'], 'La plancha del ebanista mide 256 cm por 96 cm y los cuadrados tienen 32 cm de lado. ¿Cuántos cuadrados salen?', 24, [
    'Cuenta cuántos cuadrados caben a lo largo y cuántos a lo ancho.',
    'A lo largo: 256 : 32 = 8. A lo ancho: 96 : 32 = 3.',
    'Son 8 columnas de 3 cuadrados.',
  ]),
]

export const MCM: Pregunta[] = [
  ...lote('mcm', 'mcm', 'A', 11, [[21, 28], [4, 9, 12], [15, 16], [4, 5, 9], [45, 180], [240, 36], [28, 48, 60], [33, 44, 132]]),
  ...ejercicio12('mcm'),
  ...lote('mcm', 'mcm', 'B', 9, [[243, 270], [72, 360], [156, 95]]),
  ...lote('mcm', 'mcm', 'M', 1, [[32, 68], [52, 76], [84, 95], [105, 210], [380, 420], [590, 711]]),
  ...lote('mcm', 'mcm', 'M', 2, [[320, 640], [420, 1260]]),
  ...lote('mcm', 'mcm', 'M', 3, [[140, 325, 490], [725, 980, 1400]]),
  pMcd(['mcm', 'P', '1'], [18, 12], 'mcm', {
    enunciado: 'Alicia va a la biblioteca cada 18 días y Ángel cada 12. El 8 de junio coincidieron. ¿Cuántos días tienen que pasar, como mínimo, para que vuelvan a coincidir?',
    pista: COINCIDIR,
    acierto: '¡Correcto! Pasan 36 días: volverán a coincidir el 14 de julio.',
  }),
  pMcd(['mcm', 'P', '2'], [24, 20], 'mcm', {
    enunciado: 'En la caja A hay bolsitas de 24 botones y en la caja B bolsitas de 20. No sobra ningún botón y las dos cajas tienen los mismos botones. ¿Cuántos botones hay, como mínimo, en cada caja?',
    pista: COINCIDIR,
  }),
  pMcd(['mcm', 'P', '3'], [60, 150, 360], 'mcm', {
    enunciado: 'Tres relojes dan una señal cada 60, 150 y 360 minutos. A las 9 de la mañana han sonado los tres a la vez. ¿Cuántos minutos tienen que pasar, como mínimo, para que vuelvan a coincidir?',
    pista: COINCIDIR,
    acierto: '¡Correcto! 1800 minutos son 30 horas: volverán a sonar juntos a las 3 de la tarde del día siguiente.',
  }),
  pMcd(['mcm', 'P', '4'], [55, 45], 'mcm', {
    enunciado: 'Rosa apila cubos azules de 55 mm de arista en una columna y cubos rojos de 45 mm en otra. Quiere que las dos columnas midan lo mismo usando los menos cubos posibles. ¿Cuántos milímetros de alto medirán?',
    pista: COINCIDIR,
    acierto: '¡Correcto! Con 495 mm hacen falta 495 : 55 = 9 cubos azules y 495 : 45 = 11 rojos.',
  }),
  pMcd(['mcm', 'P', '6'], [18, 15, 8], 'mcm', {
    enunciado: 'Tres viajantes van a Sevilla cada 18, 15 y 8 días. Hoy han coincidido los tres. ¿Dentro de cuántos días, como mínimo, volverán a coincidir?',
    pista: COINCIDIR,
  }),
  pNum(
    ['mcm', 'P', '5'],
    'El m.c.d. de dos números es 35 y su m.c.m. es 2450. Uno de los números es 245. ¿Cuál es el otro?',
    350,
    ['Para dos números cualesquiera: m.c.d. · m.c.m. = producto de los dos números.', '35 · 2450 = 85 750. Ese es el producto de los dos números.', 'El otro número es 85 750 : 245.'],
  ),
]

function nuevaComun(modo: 'mcd' | 'mcm'): Pregunta {
  for (;;) {
    const k = azar([2, 3, 4, 5, 6, 8, 9, 10, 12, 15])
    const a = k * entre(2, 12)
    const b = k * entre(2, 12)
    if (a !== b) return pMcd(null, [a, b], modo)
  }
}
export const nuevaMcd = () => nuevaComun('mcd')
export const nuevaMcm = () => nuevaComun('mcm')

// ---------- 5. Los números enteros ----------

const rango = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i)
const pRango = (sitio: Sitio, enunciado: ReactNode, a: number, b: number, vale: (x: number) => boolean, pistas: ReactNode[]) =>
  pMulti(sitio, enunciado, rango(a, b).map(ent), rango(a, b).filter(vale).map(ent), pistas)

const ABS = 'El valor absoluto es la distancia al 0: siempre es positivo o cero.'
const pOpuesto = (sitio: Sitio, n: number) =>
  pNum(sitio, <>Escribe el opuesto de <b>{ent(n)}</b>.</>, -n, ['El opuesto tiene el mismo valor absoluto y el signo contrario.', 'Está a la misma distancia del 0, pero al otro lado.'])
const pAbs = (sitio: Sitio, n: number) =>
  pNum(sitio, <>¿Cuánto vale |{ent(n)}|?</>, Math.abs(n), [ABS, `Cuenta los pasos que hay desde ${ent(n)} hasta el 0.`])

// Ejercicio 15: la recta del libro, con letras en lugar de números.
const LETRAS_15: Record<string, number> = { F: -5, B: -2, C: -1, E: 2, A: 3, D: 4, G: 5 }

function pRecta15(etq: string, letra: string, pide: 'opuesto' | 'valor absoluto'): Pregunta {
  const v = LETRAS_15[letra]
  return pNum(
    ['enteros', 'A', etq],
    <>
      Observa la recta. ¿Cuál es el <b>{pide}</b> del número que está en <b>{letra}</b>?
      <span className="mt-2 block max-w-full overflow-x-auto">
        <Recta min={-6} max={6} numeros={[0, 1]} puntos={Object.entries(LETRAS_15).map(([l, n]) => ({ v: n, color: l === letra ? '#dc2626' : '#64748b', etq: l }))} />
      </span>
    </>,
    pide === 'opuesto' ? -v : Math.abs(v),
    [
      `Primero averigua qué número es ${letra}: cuenta las marcas desde el 0. Cada marca es una unidad.`,
      `${letra} está ${Math.abs(v)} ${Math.abs(v) === 1 ? 'marca' : 'marcas'} a la ${v < 0 ? 'izquierda' : 'derecha'} del 0: es el ${ent(v)}.`,
      pide === 'opuesto' ? 'El opuesto tiene el mismo valor absoluto y el signo contrario.' : ABS,
    ],
  )
}

export const ENTEROS: Pregunta[] = [
  pOrden(['enteros', 'A', '13'], 'Ordena de menor a mayor.', [-38, -500, 37, -39, 10, 22, -499]),
  pAbs(['enteros', 'A', '14a'], -13),
  pOrden(['enteros', 'A', '14b'], 'Ordena de mayor a menor.', [-7, -4, 1, -3, 9, 11, -13], 'desc'),
  pOrden(['enteros', 'A', '14c'], 'Estos son los opuestos de −7, −4, 1, −3, 9, 11 y −13. Ordénalos de menor a mayor.', [7, 4, -1, 3, -9, -11, 13]),
  pRecta15('15a', 'F', 'opuesto'),
  pRecta15('15b', 'B', 'valor absoluto'),
  pRecta15('15c', 'D', 'opuesto'),
  pRecta15('15d', 'C', 'valor absoluto'),
  pNum(['enteros', 'A', '16a'],'¿Qué número entero está a la misma distancia de −4 que de −22?', -13, [
    'Está justo en medio de los dos.',
    'De −22 a −4 hay 18 unidades. La mitad son 9.',
    'Avanza 9 desde −22, o retrocede 9 desde −4.',
  ]),
  pNum(['enteros', 'A', '16b'], '¿Qué número entero es una unidad menor que el opuesto de 17?', -18, [
    'El opuesto de 17 es −17.',
    'Una unidad menor es un paso más a la izquierda en la recta.',
  ]),
  pRango(['enteros', 'A', '16c'], 'Marca todos los enteros cuyo valor absoluto es menor que el de −10 y que además son mayores que −10.', -11, 11, (x) => Math.abs(x) < 10 && x > -10, [
    '|−10| = 10. Se buscan los números que están a menos de 10 pasos del 0.',
  ]),
  pRango(['enteros', 'B', '10a'], 'Marca los números negativos mayores que −5.', -7, 7, (x) => x < 0 && x > -5, ['Mayores que −5 son los que están a su derecha en la recta.']),
  pRango(['enteros', 'B', '10b'], 'Marca los números positivos menores que 5.', -7, 7, (x) => x > 0 && x < 5, ['El 0 no es positivo ni negativo.']),
  pRango(['enteros', 'B', '10c'], 'Marca todos los enteros que cumplen |x| < 6.', -7, 7, (x) => Math.abs(x) < 6, [ABS, 'Valen los que están a menos de 6 pasos del 0, a un lado y a otro.']),
  pRango(['enteros', 'B', '10d'], 'Marca todos los enteros que cumplen |x| = 6.', -7, 7, (x) => Math.abs(x) === 6, [ABS, 'Hay un número a 6 pasos a la derecha del 0 y otro a 6 pasos a la izquierda.']),
  pNum(['enteros', 'B', '11'], 'La diferencia entre un número y su opuesto es 4. ¿De qué número se trata?', 2, [
    'Llama n al número. Su opuesto es −n.',
    'n − (−n) = n + n = 2n.',
    'Si 2n = 4, ¿cuánto vale n?',
  ]),
  pMulti(['enteros', 'B', '12'], '¿Cuáles de estas igualdades son falsas con seguridad?', ['|+5| = −5', '|−6| = 6', '|a| = −8', '|b| = 11'], ['|+5| = −5', '|a| = −8'], [
    'Un valor absoluto es una distancia: nunca puede ser negativo.',
  ]),
  pOrden(['enteros', 'B', '13'], 'Ordena de menor a mayor: −2, 7, |+3|, −6, 0, |−8|, −5. Los valores absolutos ya están calculados: |+3| = 3 y |−8| = 8.', [-2, 7, 3, -6, 0, 8, -5]),
  pRango(['enteros', 'B', '14a'], 'Marca los enteros cuyo valor absoluto es menor que 2.', -5, 5, (x) => Math.abs(x) < 2, [ABS]),
  pRango(['enteros', 'B', '14b'], 'Marca los enteros que coinciden con su valor absoluto y son menores que 3.', -5, 5, (x) => x === Math.abs(x) && x < 3, [
    'Un número coincide con su valor absoluto cuando no es negativo.',
  ]),
  pNum(['enteros', 'B', '14c'], '¿Qué número entero coincide con su opuesto?', 0, ['El opuesto está a la misma distancia del 0, al otro lado.', '¿Qué número no tiene «otro lado»?']),
  pRango(['enteros', 'B', '14d'], 'Marca los enteros cuyo valor absoluto es mayor que 2 y menor que 5.', -6, 6, (x) => Math.abs(x) > 2 && Math.abs(x) < 5, [
    ABS,
    'Los valores absolutos que valen son 3 y 4. Cada uno corresponde a dos números.',
  ]),
  pOrden(['enteros', 'AU', '4'], 'Ordena de menor a mayor.', [-13, 12, 20, -2, -14, -5, 6, 0]),
  ...[-10, 96, -45, 19].map((n, i) => pOpuesto(['enteros', 'AU', `5${LETRAS[i]}`], n)),
]

export function nuevaEnteros(): Pregunta {
  const tipo = azar(['orden', 'orden', 'abs', 'opuesto'] as const)
  if (tipo === 'abs') return pAbs(null, azar([-1, 1]) * entre(1, 60))
  if (tipo === 'opuesto') return pOpuesto(null, azar([-1, 1]) * entre(1, 60))
  const nums = new Set<number>()
  while (nums.size < 6) nums.add(entre(-30, 30))
  const sentido = azar(['asc', 'desc'] as const)
  return pOrden(null, sentido === 'asc' ? 'Ordena de menor a mayor.' : 'Ordena de mayor a menor.', [...nums], sentido)
}

// ---------- 6. Sumas y restas ----------

const QUITAR: OpcionesExpr = { modo: 'quitar', enunciado: 'Calcula, quitando primero los paréntesis:' }
const PARES_16 = [[-6, -1], [0, -2], [-4, 4], [3, -2]]

export const SUMAS: Pregunta[] = [
  ...serie(
    'sumas',
    'A',
    17,
    [
      '(-12) + (-5) - (-7) + (-10)',
      '(-25) + (-49) - (-88) + (-36)',
      '(-3) - (-7) + (-9) - (-8) - (+25) - (-34)',
      '(-33) - (28 - 45 + 49)',
      '120 - (16 - 5) - [38 - (-6)]',
      '-40 - (-20 - 33 + 15) - (-80) + (13 - 91)',
      '25 + (41 - 25) - [16 - (-25) - 4]',
    ],
    QUITAR,
  ),
  ...PARES_16.flatMap(([a, b], i) => [
    pExpr(['sumas', 'B', `16${LETRAS[2 * i]}`], `${a} + (${b})`, { modo: 'quitar', enunciado: `Suma de ${ent(a)} y ${ent(b)}:` }),
    pExpr(['sumas', 'B', `16${LETRAS[2 * i + 1]}`], `${a} - (${b})`, { modo: 'quitar', enunciado: `Resta de ${ent(a)} menos ${ent(b)}:` }),
  ]),
  ...serie('sumas', 'B', 20, ['-5 + (-3) - (-1)', '4 - (-2) - 5 + 1', '-3 + (-1) - (-7) + 4'], QUITAR),
  ...serie('sumas', 'AU', 6, ['(-18) + (+45)', '(-6) + (-12) - (-15) - (+3)'], QUITAR),
]

const par = (v: number) => (v < 0 ? `(${v})` : String(v))
const signo = () => azar(['+', '-'])
const conSigno = (max: number) => azar([-1, 1]) * entre(1, max)

export function nuevaSumas(): Pregunta {
  const n = () => entre(1, 30)
  const op = azar([
    () => `${conSigno(30)} ${signo()} (${conSigno(30)}) ${signo()} (${conSigno(30)}) ${signo()} (${conSigno(30)})`,
    () => `${conSigno(40)} - (${n()} ${signo()} ${n()} ${signo()} ${n()}) ${signo()} (${conSigno(30)})`,
    () => `${n()} ${signo()} (${n()} - ${n()}) - [${n()} ${signo()} (${conSigno(20)}) ${signo()} ${n()}]`,
  ])()
  return pExpr(null, op, QUITAR)
}

// ---------- 7. Multiplicación y división ----------

const COMPLETA = 'Completa con el número que falta:'
const completa = (texto: string) => (
  <>
    {COMPLETA}
    <span className="mt-2 block text-2xl font-bold whitespace-nowrap">{texto}</span>
  </>
)

export const PRODUCTOS: Pregunta[] = [
  ...serie('productos', 'A', 18, ['24 / (-3) * (+5) * (-2)', '(-35) * (+10) / (-7) * 4', '1460 / (-10) / (-73) * (-3)', '(-231) * (-1) / (-3) * (-5) / (-11)']),
  pNum(['productos', 'B', '15a'], completa('… : 5 = −2'), -10, ['El número que falta es el dividendo: divisor · cociente.', '5 · (−2): signos distintos, resultado negativo.']),
  pNum(['productos', 'B', '15b'], completa('−30 : (−6) = …'), 5, ['Divide los valores absolutos: 30 : 6.', 'Menos entre menos: más.']),
  pNum(['productos', 'B', '15c'], completa('−25 : … = 5'), -5, ['Busca un número que multiplicado por 5 dé −25.', 'El valor absoluto es 25 : 5. Como el resultado es positivo y el dividendo negativo, el divisor tiene que ser negativo.']),
  pNum(['productos', 'B', '15d'], completa('−28 : … = −7'), 4, ['Busca un número que multiplicado por −7 dé −28.', 'El valor absoluto es 28 : 7. Dividendo y cociente son negativos: el divisor es positivo.']),
  ...serie('productos', 'B', 18, ['(-4 * 3) / (-6)', '(-25 / 5) * 4', '-3 * (-20 / 4)', '(-12 / 3) * (-10 / 2)']),
  pExpr(['productos', 'AU', '6c'], '-60 / (-6) * 10'),
  pExpr(['productos', 'AU', '6d'], '12 * 45 / (-9)'),
]

export function nuevaProductos(): Pregunta {
  const a = conSigno(9)
  const b = conSigno(9)
  const c = conSigno(6)
  const op = azar([`${par(a)} * ${par(b)}`, `${par(a * b)} / ${par(b)}`, `${par(a)} * ${par(b)} * ${par(c)}`, `${par(a * b)} / ${par(a)} * ${par(c)}`])
  return pExpr(null, op, { pista: 'Cuenta los signos negativos: si hay un número par de ellos, el resultado es positivo; si es impar, negativo.' })
}

// ---------- 8. Operaciones combinadas ----------

const FACTOR_COMUN = 'Extrae factor común y calcula:'
const factorComun = (parada: Sitio, op: string, pista: string) => pExpr(parada, op, { enunciado: FACTOR_COMUN, pista })

// Hoja «Operaciones combinadas con enteros» (29 ejercicios con solución). Falta el 22: la solución
// impresa (−11) no coincide con la operación tal como está escrita, que da −14.
export const COMBINADAS_1: [number, string][] = [
  [1, '1 + 5*[4*7 + 5*(15 - 4*5)] - 3*(7 - 4)'],
  [2, '4 - 2*(5 - 8) + 2*[5*(2 - 7 + 3) - 7]'],
  [3, '3*{2*[4 - 2*(5 - 7)] + 3*(1 - 2*5)}'],
  [4, '12/(-3) - 4 + 3*[5 - 3*2 - 2*(4 + 12*5 - 25)]'],
  [5, '1 + 2*[(3 + 4) - 5*(6 - 7)*2] - {1 - [2*(3 - 4) + 5 - 6]}'],
  [6, '7*(5 - 4) + 2*{8 + 6*[12 - 4*5 + 2*(10 - 3*3)]}'],
  [7, '3*(12 - 4*8) + 4*[5/1 - 4 + 3*(2 - 1)]'],
  [8, '11 - 7*[9 - 2*(5 - 3)] + 2*{1 + 3*[8 - 2*(3 - 1)]}'],
  [9, '{-2 + (3 - 2) - [(4 - 3) - (-2)]}'],
  [10, '{3 - [2 - (-1 + 4) + 5] - 2}'],
  [11, '{4 - [3 + 2 - (1 - 5 - 7) - 2] + 10}'],
  [12, '{11 + [-(4 - (3 + 2 - (1 - 3)))]}'],
  [13, '-2*{[(-3 - 1)*(-2)]/(-2 + 1)}'],
  [14, '[-3 - 4 - (-1)]*(-3/-1)*{[(-2 + 1)*(2 - 1)]/[-7 - 6 + 4*3]}'],
  [15, '(-2 + 1)*{{[(4 - 3)*2]/(-2)} + 2}'],
  [16, '(-3 + 2 - 1 + (-1 - 2))*[(-3)/(7 - 4)] + {-3*[-2 + 1] - 4}'],
  [17, '[3*(4 - 1) - 2]/{[3 + (-2 - 3)*2]}'],
  [18, '{4 - [3*(-1)] - 5}*{4/[4 - (4 - 1)]}'],
  [19, '5*{3*[20 - 4*(8 - 2*(6/3))]}'],
  [20, '2*{-1*[2 + 4*(3 - 2)]}*{2*(4 - 3) - 2*3 - 4*5}'],
  [21, '-1*{[2 + 4/(3 - 2)]}*[2*(4 - 3) - 2*(3 - 4*5)]'],
  [23, '1 + {3*[5 - (7 + 3)]} - {8 + [4 - (2/2)]}'],
  [24, '{(-3)*[(-9) + (4*3)]}/[4 - 2 + 5*2 - 7 - 2]'],
  [25, '{[(-3) + 12] + (15 - 18)}*3 - 2'],
  [26, '{-[(-3) + (-2)] + (-3)*[2 - (-7)]}*(-2*2)'],
  [27, '{2 - 3*[4/(7 - 5)] + 4}*{3 - [4*2 - (5 + 3 - (3 - 2))]}'],
  [28, '-3*{4 - 2 + [5*2 - 3*(4 - 2)]}'],
  [29, '2*{4 + [3*2 + (4 - 8/4 + 2)]}'],
]

// Hoja «Números enteros (Operaciones combinadas)» (26 ejercicios con solución).
export const COMBINADAS_2: string[] = [
  '6 - 3*2 + 4*1 - 5 + 13 - 8/4 - 9*2/3 - 1',
  '3 - [-5*6 - 4*(12/4 - 5*2) - 24/3]',
  '2 - 3*[-2 + 10 - 4*(-1 + 3/3) - 8] - 2',
  '[-6 - (-2 + 4) - 5] - [-8 - (7 - 2) - 6]',
  '[(-8)/(-2) - 6/(2 - 5)] / [10/(-2) - 3/(1 - 2)]',
  '[14 - (-6) + (-6)] / [17 + (-7) - (+3)]',
  '[3*(5 - 2) - 10/2] * [5*(1 - 4) - (3 - 7)]',
  '(6 - 2) * [-5 + 2 - 8/4 - 3*(2 - 3 - 6/2)]',
  '5 - 3*[(1 - 4)*(2 - 7 + 3) - 5*(-2 + 12/4)]',
  '4*[-10 - 2*(5 - 14/7) - 5*(4 - 7)]',
  '[3*(2*3 + 5*4 - 3*7) / (6/2 + 3*4 - 10)]',
  '5 - 5*[(1 - 6)*(12/3) - 8*(-4 + 18/9)]',
  '[-12/(2 - 5) - 3*(8/2)] / [-8/(5 - 7) - 16/(2 - 6)]',
  '(7 - 10)*(2 - 5)*[(8 - 4)/(-3 + 5) - 2*(10/5)]',
  '-4 - 2*[-3 - 4/(6 - 4*2) - (8 - 2)/(8 - 5*2)]',
  '-{1 - [1 - (-1)]} - {-1 - [-(-1) - 1] - 1}',
  '[3*(7 - 2*4) + 4/(1 - 3)] / [(2 - 7)*(4 - 7)/(-3)]',
  '[-6*(2 - 5) + 5*(4 - 7)] * [(3 - 8)*(2 - 5)/(1 - 4)]',
  '[(3*4 - 2*5)*(1 - 5)] / [-3*(5 - 7) - (1 - 3)]',
  '5 - 3*[2*(4 - 1) - 3*(-1 - 5) - 8/4 - 2]',
  '-{3 - [2 - (-3)]} - {4 - [-5 - (2 - 5) - 2]}',
  '4 - [2*(3 - 5) - (5 - 2)*(-7 + 4/2)]',
  '(7 - 5)*[3 - 2 - 4/2 - 3*(6 - 2 - 8/4)]',
  '4 - 3*[-2 + 5 - 3*(-2 - 3/3) - 10/2 + 3]',
  '10 / [(3 - 5)*(2 - 4) + 10/(-3 - 2)]',
  '8/(3 - 5) - 2*[-3*(1 - 4) - 6/(1 - 3)]',
]

export const COMBINADAS: Pregunta[] = [
  ...serie('combinadas', 'B', 19, ['-10 + 3*(-3)', '-5*4 + 8/(-2)', '5*(-1) - (-3)*2', '9 - 6/(-3) - 1']),
  ...serie('combinadas', 'B', 21, ['-3*(-2 + 5) - (1 - 4)', '5 - 2*(-10 + 4) + (-3)']),
  ...serie('combinadas', 'B', 17, ['2 - [-(7 - 2)*3 + 1] - 4/2', '3 - 3*[-5 - (6 - 3) - 2] + 6', '(10 - 2)/(-4) - [-4 - (9 + 5 - 3) + 2] - 8/(-2)']),
  ...serie('combinadas', 'B', 22, ['5 - [7 - 2 - (1 - 9) - 3 + 12] + 4*(-3)', '1 - (-3 + 6 + 1) - (-2)*[4 - (6 - 3 + 1) - 2]', '6 - [3 - (8 - 5) + 2]/(-2)']),
  ...serie('combinadas', 'B', 23, ['(-2)*14/(-2) + (-8)/(-2)*(-15)/3 - (+6)*(-1)', '-6/3*(+5) - 42/(-7)*(-4) - (-9)/3']),
  ...serie('combinadas', 'B', 24, ['10 - 5*(12 - 4/4 - 9) - 4*[-10/(3 + 2)]']),
  ...serie('combinadas', 'B', 25, ['(-10)/[-4*(-2) + 2*(-3)] - 5 - (-3)*(-1)', '3 - [2 - (-1)*(14 - 20/4 - 10) - 4*(-3)] - 6*(-2)']),
  ...serie('combinadas', 'A', 19, [
    '16 - [5 - (-9)]/(-7) + 7*[-5 - 3*(-2)]',
    '40/(-2)*(+5) - 6 + 6*[101 + 53*(-2)]',
    '(5 - 10)*(5 + 10) - 12/[16 - 15*(-1) - 29]',
    '[48 - 5*(-9)/3] - 6 + 4*[19 - 3*(-7)]',
  ]),
  factorComun(['combinadas', 'A', '20a'], '13 - 130 + 26 + (-65)', 'Todos los sumandos son múltiplos de 13: 13 · (1 − 10 + 2 − 5).'),
  factorComun(['combinadas', 'A', '20b'], '32 - 56 - 132 + 88 - 48', 'Todos los sumandos son múltiplos de 4: 4 · (8 − 14 − 33 + 22 − 12).'),
  factorComun(['combinadas', 'A', '20c'], '27 + 36 - 45 - 54 + 63 - 72', 'Todos los sumandos son múltiplos de 9: 9 · (3 + 4 − 5 − 6 + 7 − 8).'),
  factorComun(['combinadas', 'A', '20d'], '-20 + 30 - 110 + 420 - 330', 'Todos los sumandos son múltiplos de 10: 10 · (−2 + 3 − 11 + 42 − 33).'),
  factorComun(['combinadas', 'AU', '7a'], '17*6 - 17*20 + 17*(-16)', 'El 17 se repite en todos los sumandos: 17 · (6 − 20 − 16).'),
  factorComun(['combinadas', 'AU', '7b'], '240 - 600 - 480 - 225', 'Todos los sumandos son múltiplos de 15: 15 · (16 − 40 − 32 − 15).'),
  {
    ...pNum(
      ['combinadas', 'AU', '9'],
      'El caracol Paco se ha metido en un pozo. Durante tres días sube 3 metros diarios, pero se cansa y los cuatro días siguientes baja 4 metros por día. La semana siguiente vuelve a subir, a 2 metros por día. Si todavía le faltan 3 metros para salir, ¿a cuántos metros de profundidad empezó?',
      10,
      [
        'Apunta cada tramo como un entero: subir es positivo y bajar es negativo.',
        '3 · 3 = 9 metros arriba. 4 · (−4) = −16, es decir, 16 abajo. 7 · 2 = 14 arriba.',
        'En total: 9 − 16 + 14 = 7 metros arriba. Y aún le faltan 3 para salir.',
      ],
      '¡Correcto! Subió 7 metros en total y le faltan 3: empezó a 7 + 3 = 10 metros de profundidad.',
    ),
    fallo: (resp) => (resp === '-10' ? 'El número es ese. Como se pregunta por la profundidad, se responde en positivo: 10 metros.' : undefined),
  },
  ...COMBINADAS_2.map((op, i) => pExpr(['combinadas', 'C2', String(i + 1)], op)),
  ...COMBINADAS_1.map(([n, op]) => pExpr(['combinadas', 'C1', String(n)], op)),
]

export function nuevaCombinadas(): Pregunta {
  const n = () => entre(1, 9)
  const y = conSigno(6)
  const op = azar([
    () => `${n()} - ${n()}*[${n()} ${signo()} ${n()}*(${n()} - ${n()})]`,
    () => `(${n()} - ${n()})*(${n()} - ${n()}) ${signo()} ${n()}*(${n()} ${signo()} ${n()})`,
    () => `${par(y * entre(2, 8))}/${par(y)} - ${n()}*[${n()} - (${n()} ${signo()} ${n()})]`,
    () => `${conSigno(9)} ${signo()} ${n()}*(${conSigno(9)}) - [${n()} - ${n()}*(${n()} ${signo()} ${n()})]`,
    () => `${n()}*{${n()} - [${n()} ${signo()} ${n()}*(${n()} - ${n()})]} ${signo()} ${par(y * entre(2, 6))}/${par(y)}`,
  ])()
  return pExpr(null, op)
}

// ---------- 2. Descomposición factorial (para las pruebas) ----------
// Su modo Practicar tiene formato propio (la columna); aquí van las mismas preguntas en formato de prueba.

function pFactores(n: number): Pregunta {
  const primos = factores(n)
  return {
    ...ficha(null),
    enunciado: <>Escribe la descomposición en factores primos de <b>{n}</b>.</>,
    entrada: { primos: true },
    correcta: primos.join('|'),
    pistas: [
      'Divide entre primos, empezando por los más pequeños, hasta llegar a 1.',
      <>
        {n} = {primos.join(' · ')} = <Potencias potencias={agrupar(primos)} />
      </>,
    ],
  }
}

function pValor(f: Potencia[]): Pregunta {
  return pNum(null, <>¿Qué número tiene esta descomposición? <b className="whitespace-nowrap"><Potencias potencias={f} /></b> Calcula las potencias, multiplícalas y responde con el número final.</>, valorDe(f), [
    'Calcula cada potencia por separado y luego multiplica.',
    `${f.map(([p, e]) => p ** e).join(' · ')} = ${valorDe(f)}`,
  ])
}

function pDivisores(n: number): Pregunta {
  const pot = agrupar(factores(n))
  return pNum(null, <>¿Cuántos divisores tiene <b>{n}</b>? Cuéntalos todos, también el 1 y el propio {n}.</>, pot.reduce((t, [, e]) => t * (e + 1), 1), [
    <>
      {n} = <Potencias potencias={pot} />
    </>,
    `Se suma 1 a cada exponente y se multiplican: ${pot.map(([, e]) => `(${e} + 1)`).join(' · ')}`,
  ])
}

const deEjercicio = (e: Ejercicio) => (e.tipo === 'descomponer' ? pFactores(e.n) : e.tipo === 'valor' ? pValor(e.f) : pDivisores(e.n))

export function nuevaDescomposicion(): Pregunta {
  const tipo = azar(['descomponer', 'descomponer', 'valor', 'divisores'] as const)
  for (;;) {
    const primos = Array.from({ length: entre(3, 5) }, () => azar([2, 2, 2, 3, 3, 3, 5, 5, 7, 7, 11, 13]))
    const n = primos.reduce((a, b) => a * b, 1)
    if (n <= (tipo === 'divisores' ? 400 : 3000)) return deEjercicio(tipo === 'valor' ? { id: '', tipo, f: agrupar(primos) } : { id: '', tipo, n })
  }
}

/** De dónde salen las preguntas de la prueba de cada parada: las de clase y el generador de nuevas. */
export const BANCOS: Record<string, { clase: Pregunta[]; generar: () => Pregunta }> = {
  reglas: { clase: REGLAS, generar: nuevaReglas },
  descomposicion: { clase: CLASE.map(deEjercicio), generar: nuevaDescomposicion },
  mcd: { clase: MCD, generar: nuevaMcd },
  mcm: { clase: MCM, generar: nuevaMcm },
  enteros: { clase: ENTEROS, generar: nuevaEnteros },
  sumas: { clase: SUMAS, generar: nuevaSumas },
  productos: { clase: PRODUCTOS, generar: nuevaProductos },
  combinadas: { clase: COMBINADAS, generar: nuevaCombinadas },
}

// ---------- Para el mapa ----------

/** Ids de los ejercicios de clase de cada parada (la de descomposición lleva los suyos aparte). */
export const IDS: Record<string, string[]> = Object.fromEntries(
  Object.entries({ reglas: REGLAS, mcd: MCD, mcm: MCM, enteros: ENTEROS, sumas: SUMAS, productos: PRODUCTOS, combinadas: COMBINADAS }).map(([k, v]) => [
    k,
    v.map((q) => q.id),
  ]),
)
