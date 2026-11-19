// Restas de 3.º de Primaria (Olivia): con llevadas, la prueba de la resta y problemas de dos pasos. Las respuestas, los
// pasos que se enseñan y los errores típicos que salen como opciones falsas se calculan aquí.
//
// Método de la libreta: se resta columna a columna desde las unidades. Si arriba hay menos que abajo, se le pone un 1
// delante a la cifra de arriba (sumamos 10) y «me llevo una», que se suma a la cifra de abajo de la columna siguiente.

/** Las cifras de un número, de las unidades hacia la izquierda: 396 → [6, 9, 3]. */
export const cifras = (n: number) => String(n).split('').reverse().map(Number)

export const NOMBRE_COLUMNA = ['unidades', 'decenas', 'centenas', 'unidades de millar', 'decenas de millar', 'centenas de millar']
export const LETRA_COLUMNA = ['U', 'D', 'C', 'UM', 'DM', 'CM']

export interface PasoResta {
  /** 0 = unidades, 1 = decenas… */
  columna: number
  arriba: number
  /** La cifra de abajo tal como está escrita (0 si el número de abajo es más corto). */
  abajo: number
  /** La que me llevaba de la columna anterior (0 o 1). */
  llevada: number
  /** Lo que de verdad se quita: la cifra de abajo más la que me llevaba. */
  quito: number
  /** Si arriba no hay bastante y hay que ponerle un 1 delante (sumar 10). */
  pide: boolean
  /** La cifra de arriba con el 1 delante si hace falta: 4 → 14. */
  arribaFinal: number
  cifra: number
}

/** La resta en columna, paso a paso. Solo para restas que se pueden hacer (arriba mayor o igual). */
export function pasosResta(minuendo: number, sustraendo: number): PasoResta[] {
  if (sustraendo > minuendo) throw new Error(`${minuendo} − ${sustraendo}: el de arriba tiene que ser mayor`)
  const a = cifras(minuendo)
  const b = cifras(sustraendo)
  const pasos: PasoResta[] = []
  let llevada = 0
  for (let i = 0; i < a.length; i++) {
    const abajo = b[i] ?? 0
    const quito = abajo + llevada
    const pide = a[i] < quito
    const arribaFinal = pide ? a[i] + 10 : a[i]
    pasos.push({ columna: i, arriba: a[i], abajo, llevada, quito, pide, arribaFinal, cifra: arribaFinal - quito })
    llevada = pide ? 1 : 0
  }
  return pasos
}

/** El resultado leído de los pasos (comprueba que el método da lo mismo que restar). */
export const resultadoPasos = (pasos: PasoResta[]) => Number(pasos.map((p) => p.cifra).reverse().join(''))

/** La suma en columna (para la prueba de la resta y los problemas): cada cifra y la que me llevo a la siguiente. */
export function pasosSuma(a: number, b: number): { columna: number; arriba: number; abajo: number; llevada: number; total: number; cifra: number; meLlevo: number }[] {
  const x = cifras(a)
  const y = cifras(b)
  const pasos = []
  let llevada = 0
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    const total = (x[i] ?? 0) + (y[i] ?? 0) + llevada
    pasos.push({ columna: i, arriba: x[i] ?? 0, abajo: y[i] ?? 0, llevada, total, cifra: total % 10, meLlevo: total >= 10 ? 1 : 0 })
    llevada = total >= 10 ? 1 : 0
  }
  if (llevada) pasos.push({ columna: pasos.length, arriba: 0, abajo: 0, llevada, total: 1, cifra: 1, meLlevo: 0 })
  return pasos
}

/** Cuántas veces «me llevo una». */
export const llevadas = (a: number, b: number) => pasosResta(a, b).filter((p) => p.pide).length

/** La prueba de la resta: el resultado más lo que se quita tiene que dar el número de arriba. */
export const pruebaResta = (minuendo: number, sustraendo: number, resultado: number) => resultado + sustraendo === minuendo

// ——— Errores típicos (las opciones falsas de las preguntas) ———

/** Restar en cada columna el pequeño del grande, sin llevarse nada: 63214 − 15228 → 52014. */
export function errorSinLlevar(a: number, b: number): number {
  const x = cifras(a)
  const y = cifras(b)
  return Number(x.map((c, i) => Math.abs(c - (y[i] ?? 0))).reverse().join(''))
}

/** Pedir la decena pero olvidarse de sumar la que me llevo a la columna siguiente. */
export function errorOlvidaLlevada(a: number, b: number): number {
  const x = cifras(a)
  const y = cifras(b)
  return Number(x.map((c, i) => (c < (y[i] ?? 0) ? c + 10 : c) - (y[i] ?? 0)).reverse().join(''))
}

/** Opciones falsas creíbles para el resultado de a − b: los dos errores típicos y fallos de una decena o centena. */
export function opcionesFalsas(a: number, b: number, n = 3): number[] {
  const bien = a - b
  const candidatos = [errorSinLlevar(a, b), errorOlvidaLlevada(a, b), bien + 10, bien - 10, bien + 100, bien - 100, bien + 1000, a + b]
  const fuera: number[] = []
  for (const c of candidatos) if (c !== bien && c >= 0 && !fuera.includes(c)) fuera.push(c)
  return fuera.slice(0, n)
}

/** Sumar sin llevarse: cada columna se queda con la última cifra. 1687 + 2725 → 3302. */
export function errorSumaSinLlevar(a: number, b: number): number {
  const x = cifras(a)
  const y = cifras(b)
  return Number(Array.from({ length: Math.max(x.length, y.length) }, (_, i) => ((x[i] ?? 0) + (y[i] ?? 0)) % 10).reverse().join(''))
}

/** Opciones falsas para el resultado de una cuenta, sea suma o resta. */
export function opcionesFalsasOp(a: number, op: '+' | '−', b: number, n = 3): number[] {
  if (op === '−') return opcionesFalsas(a, b, n)
  const bien = a + b
  const fuera: number[] = []
  for (const c of [errorSumaSinLlevar(a, b), bien + 10, bien - 10, bien + 100, bien - 100, Math.abs(a - b)]) if (c !== bien && c >= 0 && !fuera.includes(c)) fuera.push(c)
  return fuera.slice(0, n)
}

/** Número con punto de los miles, como en las hojas de problemas: 1687 → «1.687». Los de 4 cifras también. */
export const conPunto = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.')

// ——— Problemas de dos pasos ———

export interface Operacion {
  op: '+' | '−'
  /** Un número del enunciado o «anterior» para el resultado del paso 1. */
  a: number | 'anterior'
  b: number | 'anterior'
}

export const opera = (a: number, op: '+' | '−', b: number) => (op === '+' ? a + b : a - b)

/** Resuelve las operaciones en orden: cada «anterior» es el resultado del paso de antes. */
export function resolver(ops: Operacion[]): { a: number; op: '+' | '−'; b: number; r: number }[] {
  const out: { a: number; op: '+' | '−'; b: number; r: number }[] = []
  let ant = 0
  for (const o of ops) {
    const a = o.a === 'anterior' ? ant : o.a
    const b = o.b === 'anterior' ? ant : o.b
    const r = opera(a, o.op, b)
    if (r < 0) throw new Error(`${a} ${o.op} ${b} da negativo`)
    out.push({ a, op: o.op, b, r })
    ant = r
  }
  return out
}

export const escribeOp = (x: { a: number; op: string; b: number }) => `${conPunto(x.a)} ${x.op} ${conPunto(x.b)}`
