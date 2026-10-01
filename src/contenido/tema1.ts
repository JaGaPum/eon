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

export interface Video {
  /** Identificador del vídeo en YouTube. */
  id: string
  titulo: string
  canal: string
  minutos: number
}

// Vídeos de cada parada: canales de España que explican con el mismo método que su libro.
// Comprobados título, canal, duración y que YouTube permite insertarlos; el contenido lo revisa la familia.
export const VIDEOS: Record<string, Video[]> = {
  reglas: [
    { id: 'SkwBerst0zM', titulo: 'Criterios de divisibilidad del 2, 3, 4, 5 y 6', canal: 'Susi Profe', minutos: 8 },
    { id: '7bR6zYybtKU', titulo: 'Criterios de divisibilidad del 7, 8, 9, 10 y 11', canal: 'Susi Profe', minutos: 9 },
  ],
  descomposicion: [{ id: '7fT8UrcaVNQ', titulo: 'Descomponer en factores primos: ejemplos y ejercicios', canal: 'unProfesor', minutos: 13 }],
  mcd: [{ id: 'WwcyUTL1HSk', titulo: 'Máximo común divisor, descomponiendo en factores primos', canal: 'academia JAF', minutos: 9 }],
  mcm: [{ id: 'db9Rup9RZ44', titulo: 'Mínimo común múltiplo, descomponiendo en factores primos', canal: 'academia JAF', minutos: 14 }],
  enteros: [{ id: '1LhjazvIT4U', titulo: 'Valor absoluto, opuesto y ordenación en la recta', canal: 'Isabel García · Conectados a las Mates', minutos: 5 }],
  sumas: [{ id: 'K__84tuj4Ac', titulo: 'Sumar y restar números enteros con paréntesis', canal: 'academia JAF', minutos: 9 }],
  productos: [{ id: '-ngjIgOKwlk', titulo: 'Multiplicación y división de enteros: la regla de los signos', canal: 'Susi Profe', minutos: 4 }],
  combinadas: [
    { id: '2og_LKfeik4', titulo: 'Operaciones combinadas con números enteros (1º y 2º ESO)', canal: 'podemos aprobar matemáticas', minutos: 4 },
    { id: 'jbnZrSRRHXk', titulo: 'Operaciones combinadas con enteros: 5 ejercicios', canal: 'Susi Profe', minutos: 11 },
  ],
}

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
