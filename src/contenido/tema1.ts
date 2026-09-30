// Contenido del Tema 1. Para añadir paradas o ejercicios se edita este fichero, no los componentes.
import type { Potencia } from '../lib/mates'

export interface Estacion {
  id: string
  num: number
  titulo: string
  resumen: string
}

export type Ejercicio =
  | { id: string; tipo: 'descomponer'; n: number }
  | { id: string; tipo: 'valor'; f: Potencia[] }
  | { id: string; tipo: 'divisores'; n: number }

export const TITULO = 'Tema 1 · Números enteros y divisibilidad'

export const BLOQUES: { titulo: string; estaciones: Estacion[] }[] = [
  {
    titulo: 'Divisibilidad',
    estaciones: [
      { id: 'reglas', num: 1, titulo: 'Reglas de divisibilidad', resumen: 'Saber si un número se puede dividir sin hacer la división.' },
      { id: 'descomposicion', num: 2, titulo: 'Descomposición factorial', resumen: 'Romper un número en sus factores primos.' },
      { id: 'mcd', num: 3, titulo: 'Máximo común divisor', resumen: 'Factores comunes con el menor exponente.' },
      { id: 'mcm', num: 4, titulo: 'Mínimo común múltiplo', resumen: 'Comunes y no comunes con el mayor exponente.' },
    ],
  },
  {
    titulo: 'Números enteros',
    estaciones: [
      { id: 'enteros', num: 5, titulo: 'Los números enteros', resumen: 'Recta, orden, opuesto y valor absoluto.' },
      { id: 'sumas', num: 6, titulo: 'Sumas y restas', resumen: 'Quitar paréntesis sin equivocarse de signo.' },
      { id: 'productos', num: 7, titulo: 'Multiplicación y división', resumen: 'La regla de los signos.' },
      { id: 'combinadas', num: 8, titulo: 'Operaciones combinadas', resumen: 'Paréntesis, productos y sumas: en ese orden.' },
    ],
  },
]

// Números del ejercicio 9 de su hoja, para verlos resueltos paso a paso.
export const EJEMPLOS = [126, 356, 408, 512, 375, 1225, 632, 2340]

// Ejercicios 6, 7, 9 y 8 de «Ejercicios y actividades». El id es el número del ejercicio en la hoja.
export const CLASE: Ejercicio[] = [
  { id: '6a', tipo: 'valor', f: [[2, 3], [5, 2]] },
  { id: '6b', tipo: 'valor', f: [[3, 2], [11, 1]] },
  { id: '6c', tipo: 'valor', f: [[2, 3], [3, 2]] },
  { id: '6d', tipo: 'valor', f: [[2, 2], [3, 2], [5, 2]] },
  // Ejercicio 7, «completa las igualdades»: completar 304 = 2^· es descomponer 304; el b) es calcular el número.
  { id: '7a', tipo: 'descomponer', n: 304 },
  { id: '7b', tipo: 'valor', f: [[3, 2], [13, 1]] },
  { id: '7c', tipo: 'descomponer', n: 201 },
  { id: '7d', tipo: 'descomponer', n: 616 },
  { id: '9a', tipo: 'descomponer', n: 126 },
  { id: '9b', tipo: 'descomponer', n: 356 },
  { id: '9c', tipo: 'descomponer', n: 408 },
  { id: '9d', tipo: 'descomponer', n: 512 },
  { id: '9e', tipo: 'descomponer', n: 375 },
  { id: '9f', tipo: 'descomponer', n: 1225 },
  { id: '9g', tipo: 'descomponer', n: 632 },
  { id: '9h', tipo: 'descomponer', n: 2340 },
  { id: '8a', tipo: 'divisores', n: 45 },
  { id: '8b', tipo: 'divisores', n: 54 },
  { id: '8c', tipo: 'divisores', n: 81 },
  { id: '8d', tipo: 'divisores', n: 105 },
  { id: '8e', tipo: 'divisores', n: 120 },
  { id: '8f', tipo: 'divisores', n: 200 },
]
