// La oración de 3.º de Primaria: sujeto (de quién se dice algo) y predicado (lo que se dice). El sujeto puede ir
// detrás («Estaba roto el estuche») o no estar («Llueve mucho»). El número del sujeto (uno o varios) sale de sus
// palabras, para comprobar que concuerda con el verbo del predicado.

export interface Oracion {
  /** Sin sujeto: «Llueve mucho». */
  sujeto?: string
  predicado: string
  /** El sujeto va detrás del predicado. */
  detras?: boolean
  /** El verbo del predicado habla de varios («brillan») y no de uno («brilla»). */
  plural?: boolean
}

export const mayuscula =(s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** La oración escrita entera, con mayúscula y punto. */
export function texto(o: Oracion): string {
  const partes = !o.sujeto ? [o.predicado] : o.detras ? [o.predicado, o.sujeto] : [o.sujeto, o.predicado]
  return `${mayuscula(partes.join(' '))}.`
}

/** Cómo se ven sujeto y predicado dentro de la oración (con su mayúscula si van delante). */
export function partes(o: Oracion): { sujeto?: string; predicado: string } {
  const t = texto(o).slice(0, -1)
  if (!o.sujeto) return { predicado: t }
  return o.detras ? { predicado: t.slice(0, o.predicado.length), sujeto: o.sujeto } : { sujeto: t.slice(0, o.sujeto.length), predicado: o.predicado }
}

/** Las palabras de la oración, con el punto pegado a la última. */
export const palabras = (o: Oracion) => texto(o).split(' ')

const DETERMINANTES_PLURAL = new Set(['los', 'las', 'mis', 'tus', 'sus', 'nuestros', 'nuestras', 'unos', 'unas', 'estos', 'estas', 'esos', 'esas', 'aquellos', 'aquellas', 'varios', 'varias', 'muchos', 'muchas'])

/** ¿El sujeto habla de varios? Sí, si empieza por «los, las, mis…» o une a dos con «y» (Nerea y Damián). */
export function sujetoPlural(sujeto: string): boolean {
  const ws = sujeto.toLowerCase().split(/\s+/)
  return DETERMINANTES_PLURAL.has(ws[0]) || ws.includes('y')
}

/** ¿Concuerdan el sujeto y el verbo del predicado? */
export const concuerda = (o: Oracion) => !o.sujeto || sujetoPlural(o.sujeto) === !!o.plural

/** Una oración desordenada (las palabras al revés) ya no es una oración: no se entiende. */
export const desordenada = (o: Oracion) => {
  // Se parte de las piezas tal como se guardan (en minúscula salvo los nombres propios).
  const ws = (!o.sujeto ? [o.predicado] : o.detras ? [o.predicado, o.sujeto] : [o.sujeto, o.predicado]).join(' ').split(' ')
  return `${mayuscula(ws.reverse().join(' '))}.`
}
