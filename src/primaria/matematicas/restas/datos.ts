// Los números de las hojas de restas de 3.º (las fotos de la libreta) y los problemas. Los resultados no se escriben
// aquí: los calcula src/lib/restas.ts.
import type { Operacion } from '../../../lib/restas'

/** «Resuelve las siguientes restas con llevadas» (hoja de 16 restas de cinco cifras). */
export const RESTAS_HOJA: [number, number][] = [
  [63214, 15228], [95002, 14568], [74208, 32589], [63240, 12115],
  [70056, 21459], [53085, 46387], [13025, 8796], [23500, 14097],
  [86402, 34687], [63200, 41782], [37141, 20258], [46123, 20047],
  [64008, 12346], [20114, 8946], [30108, 14587], [93220, 14177],
]

/** «Comprueba si las siguientes restas están bien realizadas» (dos hojas): [arriba, abajo, resultado escrito]. */
export const COMPRUEBA_HOJA: [number, number, number][] = [
  [396, 248, 148], [550, 125, 325], [686, 512, 184], [851, 428, 423],
  [708, 256, 432], [594, 192, 402], [973, 328, 525], [631, 412, 219],
]

/** Más restas para comprobar (inventadas, del mismo tamaño): unas bien y otras con un error típico. */
export const COMPRUEBA_MAS: [number, number, number][] = [
  [745, 318, 427], [902, 467, 445], [583, 276, 317], [860, 394, 466],
  [627, 159, 478], [914, 385, 539], [472, 186, 296], [800, 253, 557],
  [5420, 1385, 4035], [7006, 2348, 4658], [3251, 1427, 1834], [6130, 2765, 3365],
]

/** Restas de tres cifras con llevadas para practicar paso a paso. */
export const RESTAS_TRES: [number, number][] = [
  [396, 248], [708, 256], [973, 328], [851, 428], [550, 125], [631, 412],
  [742, 358], [615, 287], [903, 476], [524, 169], [800, 345], [462, 195],
]

/** Restas de cuatro cifras (la hoja de problemas usa números de este tamaño). */
export const RESTAS_CUATRO: [number, number][] = [
  [4412, 975], [5230, 1847], [7006, 2539], [3184, 1296], [6000, 2475], [8351, 4568],
]

/** «7.352 − 7.000»: restar miles, centenas o decenas enteras, sin hacer la resta en columna. */
export const RESTAS_ENTERAS: [number, number][] = [
  [7352, 7000], [5480, 5000], [9615, 600], [4287, 200], [6539, 30], [8164, 8000], [3750, 700], [2946, 40],
]

export interface Problema {
  id: string
  enunciado: string
  ops: Operacion[]
  /** Qué significa el resultado de cada operación, en el mismo orden. */
  queda: string[]
  /** La palabra de la respuesta: periódicos, personas, €… */
  unidad: string
  /** La frase de la solución con # en el lugar del número. */
  solucion: string
  /** Si es de la hoja de la libreta. */
  hoja?: boolean
}

export const PROBLEMAS: Problema[] = [
  {
    id: 'quiosco',
    hoja: true,
    enunciado: 'En un quiosco hay 175 periódicos. Esta mañana han vendido 95 y esta tarde 34. ¿Cuántos periódicos han quedado sin vender?',
    ops: [{ a: 175, op: '−', b: 95 }, { a: 'anterior', op: '−', b: 34 }],
    queda: ['periódicos que quedan después de la mañana', 'periódicos que quedan al final del día'],
    unidad: 'periódicos',
    solucion: 'Han quedado # periódicos sin vender.',
  },
  {
    id: 'tren',
    hoja: true,
    enunciado: 'En un tren viajan 218 personas. En la primera parada bajan 23 personas y suben 46. ¿Cuántas personas van ahora en el tren?',
    ops: [{ a: 218, op: '−', b: 23 }, { a: 'anterior', op: '+', b: 46 }],
    queda: ['personas que quedan cuando bajan las 23', 'personas que van cuando suben las 46'],
    unidad: 'personas',
    solucion: 'Ahora van # personas en el tren.',
  },
  {
    id: 'miguel',
    hoja: true,
    enunciado: 'Miguel tenía ahorrados 1.687 €. Realizó un trabajo por el que cobró 2.725 € y, después, compró un ordenador que le costó 975 €. ¿Cuánto dinero le quedó tras la compra?',
    ops: [{ a: 1687, op: '+', b: 2725 }, { a: 'anterior', op: '−', b: 975 }],
    queda: ['euros que tiene después de cobrar', 'euros que le quedan después de comprar el ordenador'],
    unidad: '€',
    solucion: 'Le quedaron # € tras la compra.',
  },
  {
    id: 'paula',
    hoja: true,
    enunciado: 'Para su restaurante, Paula compra 125 vasos grandes, 68 vasos medianos y 45 pequeños. Al colocarlos se han roto 15 vasos. ¿Cuántos le quedan?',
    ops: [{ a: 125, op: '+', b: 68 }, { a: 'anterior', op: '+', b: 45 }, { a: 'anterior', op: '−', b: 15 }],
    queda: ['vasos grandes y medianos', 'vasos que compró en total', 'vasos que le quedan sin romper'],
    unidad: 'vasos',
    solucion: 'Le quedan # vasos.',
  },
  {
    id: 'biblioteca',
    enunciado: 'En la biblioteca del cole hay 1.250 libros. Esta semana han prestado 348 y han devuelto 196. ¿Cuántos libros hay ahora en la biblioteca?',
    ops: [{ a: 1250, op: '−', b: 348 }, { a: 'anterior', op: '+', b: 196 }],
    queda: ['libros que quedan cuando se llevan los prestados', 'libros que hay cuando devuelven los 196'],
    unidad: 'libros',
    solucion: 'Ahora hay # libros en la biblioteca.',
  },
  {
    id: 'granja',
    enunciado: 'En una granja hay 532 gallinas. El granjero vende 145 y después compra 80 gallinas nuevas. ¿Cuántas gallinas hay ahora?',
    ops: [{ a: 532, op: '−', b: 145 }, { a: 'anterior', op: '+', b: 80 }],
    queda: ['gallinas que quedan después de vender', 'gallinas que hay con las nuevas'],
    unidad: 'gallinas',
    solucion: 'Ahora hay # gallinas en la granja.',
  },
  {
    id: 'hucha',
    enunciado: 'Lucía tiene 85 € en su hucha. Su abuela le regala 40 € y ella se gasta 67 € en un juego. ¿Cuánto dinero le queda?',
    ops: [{ a: 85, op: '+', b: 40 }, { a: 'anterior', op: '−', b: 67 }],
    queda: ['euros que tiene con el regalo de la abuela', 'euros que le quedan después de comprar el juego'],
    unidad: '€',
    solucion: 'Le quedan # €.',
  },
  {
    id: 'autobus',
    enunciado: 'En un autobús viajan 46 personas. En una parada bajan 18 y suben 25. ¿Cuántas personas van ahora en el autobús?',
    ops: [{ a: 46, op: '−', b: 18 }, { a: 'anterior', op: '+', b: 25 }],
    queda: ['personas que quedan cuando bajan las 18', 'personas que van cuando suben las 25'],
    unidad: 'personas',
    solucion: 'Ahora van # personas en el autobús.',
  },
  {
    id: 'pasteleria',
    enunciado: 'Una pastelería hizo 240 magdalenas. Por la mañana vendió 126 y por la tarde 87. ¿Cuántas magdalenas le quedan?',
    ops: [{ a: 240, op: '−', b: 126 }, { a: 'anterior', op: '−', b: 87 }],
    queda: ['magdalenas que quedan después de la mañana', 'magdalenas que quedan al final del día'],
    unidad: 'magdalenas',
    solucion: 'Le quedan # magdalenas.',
  },
  {
    id: 'parque',
    enunciado: 'En un parque había 4.500 árboles. Este año han plantado 1.275 árboles nuevos y han cortado 860 que estaban secos. ¿Cuántos árboles hay ahora?',
    ops: [{ a: 4500, op: '+', b: 1275 }, { a: 'anterior', op: '−', b: 860 }],
    queda: ['árboles que hay con los nuevos', 'árboles que quedan después de cortar los secos'],
    unidad: 'árboles',
    solucion: 'Ahora hay # árboles en el parque.',
  },
  {
    id: 'zapateria',
    enunciado: 'Una zapatería tiene 312 pares de zapatos. Llegan 150 pares nuevos y en las rebajas vende 275 pares. ¿Cuántos pares le quedan?',
    ops: [{ a: 312, op: '+', b: 150 }, { a: 'anterior', op: '−', b: 275 }],
    queda: ['pares que tiene cuando llegan los nuevos', 'pares que le quedan después de las rebajas'],
    unidad: 'pares',
    solucion: 'Le quedan # pares de zapatos.',
  },
  {
    id: 'patatas',
    enunciado: 'Un agricultor recoge 2.350 kilos de patatas. Vende 1.480 kilos y regala 275 kilos a sus vecinos. ¿Cuántos kilos de patatas le quedan?',
    ops: [{ a: 2350, op: '−', b: 1480 }, { a: 'anterior', op: '−', b: 275 }],
    queda: ['kilos que quedan después de vender', 'kilos que quedan después de regalar'],
    unidad: 'kilos',
    solucion: 'Le quedan # kilos de patatas.',
  },
]

/** ¿Suma o resta? Lo que pasa en el problema. */
export const SUMA_O_RESTA: { texto: string; caixa: 'sumar' | 'restar'; pista: string }[] = [
  { texto: 'Han vendido 95 periódicos', caixa: 'restar', pista: 'Si se venden, quedan menos: se resta.' },
  { texto: 'En la parada bajan 23 personas', caixa: 'restar', pista: 'Si bajan del tren, quedan menos: se resta.' },
  { texto: 'En la parada suben 46 personas', caixa: 'sumar', pista: 'Si suben al tren, hay más: se suma.' },
  { texto: 'Miguel cobró 2.725 €', caixa: 'sumar', pista: 'Si cobra, tiene más dinero: se suma.' },
  { texto: 'Miguel compró un ordenador', caixa: 'restar', pista: 'Si paga algo, le queda menos dinero: se resta.' },
  { texto: 'Paula compra 68 vasos más', caixa: 'sumar', pista: 'Paula compra vasos: tiene más vasos. Se suma.' },
  { texto: 'Se han roto 15 vasos', caixa: 'restar', pista: 'Los rotos ya no sirven: quedan menos. Se resta.' },
  { texto: 'Su abuela le regala 40 €', caixa: 'sumar', pista: 'Si le regalan dinero, tiene más: se suma.' },
  { texto: 'Se gasta 67 € en un juego', caixa: 'restar', pista: 'Si gasta, le queda menos: se resta.' },
  { texto: 'Han plantado 1.275 árboles', caixa: 'sumar', pista: 'Si plantan, hay más árboles: se suma.' },
  { texto: 'Han cortado 860 árboles', caixa: 'restar', pista: 'Si cortan, quedan menos: se resta.' },
  { texto: 'Pierde 12 cromos', caixa: 'restar', pista: 'Si pierde, le quedan menos: se resta.' },
  { texto: 'Gana 30 puntos', caixa: 'sumar', pista: 'Si gana, tiene más: se suma.' },
  { texto: 'Devuelven 196 libros', caixa: 'sumar', pista: 'Si los devuelven a la biblioteca, hay más: se suma.' },
]
