// Cálculos de divisibilidad. No sabe nada de la pantalla: solo números y explicaciones.

// Primos hasta 97: bastan para descomponer cualquier número menor que 10 000.
export const PRIMOS = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]
export const MAXIMO = 9999

export interface Razon {
  divide: boolean
  texto: string
}

export interface Paso {
  n: number
  primo: number
  cociente: number
  /** Posición en PRIMOS por la que seguir probando en el paso siguiente. */
  indice: number
  /** Primos más pequeños que se probaron antes y no dividían. */
  descartes: { primo: number; texto: string }[]
  texto: string
}

/** Pareja [primo, exponente]. */
export type Potencia = [number, number]

export function esPrimo(n: number): boolean {
  if (n < 2) return false
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false
  return true
}

const cifras = (n: number) => String(n).split('').map(Number)
const suma = (lista: number[]) => lista.reduce((a, b) => a + b, 0)

/** Explica, con el criterio del libro, por qué n es o no divisible por el primo p. */
export function porque(n: number, p: number): Razon {
  const divide = n % p === 0
  const c = cifras(n)
  const ultima = c[c.length - 1]

  if (n === p) {
    return { divide, texto: `${n} es primo: solo se puede dividir entre sí mismo. ${n} : ${n} = 1.` }
  }
  if (p === 2) {
    return {
      divide,
      texto: `${n} acaba en ${ultima}, que es ${divide ? 'cifra par, así que es divisible por 2.' : 'impar, así que no es divisible por 2.'}`,
    }
  }
  if (p === 3 && n >= 10) {
    return {
      divide,
      texto: `Las cifras de ${n} suman ${c.join(' + ')} = ${suma(c)}, que ${
        divide ? 'es múltiplo de 3, así que es divisible por 3.' : 'no es múltiplo de 3, así que no es divisible por 3.'
      }`,
    }
  }
  if (p === 5) {
    return {
      divide,
      texto: `${n} acaba en ${ultima}${divide ? ', así que es divisible por 5.' : ', y para ser divisible por 5 tendría que acabar en 0 o en 5.'}`,
    }
  }
  if (p === 11 && n >= 100) {
    const impares = c.filter((_, i) => i % 2 === 0)
    const pares = c.filter((_, i) => i % 2 === 1)
    const dif = Math.abs(suma(impares) - suma(pares))
    return {
      divide,
      texto:
        `Posiciones impares: ${impares.join(' + ')} = ${suma(impares)}. Posiciones pares: ${pares.join(' + ')} = ${suma(pares)}. ` +
        `La diferencia es ${dif}, que ${
          divide ? 'es 0 o múltiplo de 11, así que es divisible por 11.' : 'no es 0 ni múltiplo de 11, así que no es divisible por 11.'
        }`,
    }
  }
  const q = Math.floor(n / p)
  const r = n % p
  return {
    divide,
    texto: divide
      ? `${n} : ${p} = ${q} exacto, así que es divisible por ${p}.`
      : `${n} : ${p} = ${q} y ${r === 1 ? 'sobra 1' : `sobran ${r}`}, así que no es divisible por ${p}.`,
  }
}

/** Divisores con criterio en la tabla del libro. */
export const CRITERIOS = [2, 3, 4, 5, 9, 10, 11, 25, 100]

/** Explica con el criterio del libro si n es divisible por d (d debe estar en CRITERIOS). */
export function criterio(n: number, d: number): Razon {
  const divide = n % d === 0
  const es = divide ? 'es' : 'no es'
  const c = cifras(n)
  const dos = n % 100
  switch (d) {
    case 4:
    case 25:
      if (n < 100) return { divide, texto: `${n} ${es} múltiplo de ${d}, así que ${es} divisible por ${d}.` }
      if (dos === 0) return { divide, texto: `${n} acaba en 00, así que es divisible por ${d}.` }
      return {
        divide,
        texto: `Las dos últimas cifras de ${n} forman el ${dos}, que ${es} múltiplo de ${d}, así que ${es} divisible por ${d}.`,
      }
    case 9:
      return {
        divide,
        texto: `Las cifras de ${n} suman ${c.join(' + ')} = ${suma(c)}, que ${es} múltiplo de 9, así que ${es} divisible por 9.`,
      }
    case 10:
      return {
        divide,
        texto: `${n} acaba en ${c[c.length - 1]}${divide ? ', así que es divisible por 10.' : ', y para ser divisible por 10 tendría que acabar en 0.'}`,
      }
    case 100:
      return { divide, texto: divide ? `${n} acaba en 00, así que es divisible por 100.` : `${n} no acaba en 00, así que no es divisible por 100.` }
    default:
      return porque(n, d)
  }
}

export interface ColumnaPrimo {
  primo: number
  /** Exponente del primo en cada número (0 si no aparece). */
  exps: number[]
  /** Exponente con el que entra en el resultado (0 si no se coge). */
  elegido: number
  razon: string
}

/** Qué primos y con qué exponente forman el m.c.d. o el m.c.m. de varios números. */
export function comunes(nums: number[], modo: 'mcd' | 'mcm'): ColumnaPrimo[] {
  const tablas = nums.map((n) => new Map(agrupar(factores(n))))
  const primos = [...new Set(tablas.flatMap((t) => [...t.keys()]))].sort((a, b) => a - b)
  return primos.map((primo) => {
    const exps = tablas.map((t) => t.get(primo) ?? 0)
    const menor = Math.min(...exps)
    const mayor = Math.max(...exps)
    if (modo === 'mcm') {
      return { primo, exps, elegido: mayor, razon: `En el m.c.m. entran todos los primos, con el mayor exponente: ${mayor}.` }
    }
    return menor === 0
      ? { primo, exps, elegido: 0, razon: `El ${primo} no está en todos los números: no es común, así que no se coge.` }
      : { primo, exps, elegido: menor, razon: `El ${primo} está en todos: es común. Se coge con el menor exponente: ${menor}.` }
  })
}

export const productoDe = (cols: ColumnaPrimo[]) => cols.reduce((t, c) => t * c.primo ** c.elegido, 1)
export const mcd = (nums: number[]) => productoDe(comunes(nums, 'mcd'))
export const mcm = (nums: number[]) => productoDe(comunes(nums, 'mcm'))

/** Un paso de la columna: el primo más pequeño que divide a m, probando desde PRIMOS[desde]. */
export function paso(m: number, desde = 0): Paso {
  const descartes: Paso['descartes'] = []
  for (let i = desde; i < PRIMOS.length; i++) {
    const p = PRIMOS[i]
    if (p * p > m) {
      return {
        n: m,
        primo: m,
        cociente: 1,
        indice: i,
        descartes,
        texto: `${m} es primo: ${p} · ${p} = ${p * p} ya es mayor que ${m}, así que no hace falta probar más primos. Se divide entre sí mismo: ${m} : ${m} = 1.`,
      }
    }
    const r = porque(m, p)
    if (r.divide) return { n: m, primo: p, cociente: m / p, indice: i, descartes, texto: r.texto }
    descartes.push({ primo: p, texto: r.texto })
  }
  return { n: m, primo: m, cociente: 1, indice: PRIMOS.length, descartes, texto: `${m} es primo.` }
}

/** Todos los pasos de la descomposición. Los primos ya descartados no se vuelven a probar. */
export function descomponer(n: number): Paso[] {
  const pasos: Paso[] = []
  let m = n
  let desde = 0
  while (m > 1) {
    const s = paso(m, desde)
    pasos.push(s)
    desde = s.indice
    m = s.cociente
  }
  return pasos
}

export const factores = (n: number) => descomponer(n).map((s) => s.primo)

/** [2, 2, 2, 7] -> [[2, 3], [7, 1]] */
export function agrupar(lista: number[]): Potencia[] {
  const potencias: Potencia[] = []
  for (const p of [...lista].sort((a, b) => a - b)) {
    const ultima = potencias[potencias.length - 1]
    if (ultima && ultima[0] === p) ultima[1]++
    else potencias.push([p, 1])
  }
  return potencias
}

export const valor = (potencias: Potencia[]) => potencias.reduce((total, [p, e]) => total * p ** e, 1)

export function divisores(n: number): number[] {
  const lista: number[] = []
  for (let i = 1; i <= n; i++) if (n % i === 0) lista.push(i)
  return lista
}
