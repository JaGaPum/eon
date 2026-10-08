// Los temas de Matemáticas con paradas: qué ruta, qué paradas, qué preguntas y qué vídeos tiene cada uno.
import type { Tema } from '../componentes/tema'
import { RUTA_TEMA1, RUTA_TEMA2 } from './catalogo'
import { BANCOS2, IDS2 } from './tema2'
import { BANCOS, IDS } from './preguntas'
import { BLOQUES, CLASE, TITULO, VIDEOS } from './tema1'

export const TEMA1: Tema = {
  ruta: RUTA_TEMA1,
  titulo: TITULO,
  intro: '',
  bloques: BLOQUES,
  bancos: BANCOS,
  videos: VIDEOS,
  ejercicios: { ...IDS, descomposicion: CLASE.map((e) => e.id) },
  // Sus estrellas se guardaron desde el principio sin prefijo: se deja así para no perderlas.
  prefijo: '',
  examen: [1, 1],
}

export const TEMA2: Tema = {
  ruta: RUTA_TEMA2,
  titulo: 'Tema 2 · Fracciones y decimales',
  intro: 'Seis paradas en la ruta. Al final, la misión: un examen con la autoevaluación del libro.',
  bloques: [
    {
      titulo: 'Fracciones',
      estaciones: [
        { id: 'fracciones', num: 1, titulo: 'Fracciones y equivalentes', resumen: 'Qué es una fracción, simplificar, inversa y número mixto.' },
        { id: 'comparar', num: 2, titulo: 'Comparar y ordenar', resumen: 'Reducir a común denominador con el m.c.m.' },
        { id: 'operaciones', num: 3, titulo: 'Operaciones', resumen: 'Sumar, restar, multiplicar en línea, dividir en cruz y potencias.' },
        { id: 'combinadas', num: 4, titulo: 'Combinadas y problemas', resumen: 'La jerarquía con fracciones y problemas de la vida real.' },
      ],
    },
    {
      titulo: 'Decimales',
      estaciones: [
        { id: 'decimales', num: 5, titulo: 'Decimales y fracción generatriz', resumen: 'Exactos, periódicos puros y mixtos, y de vuelta a fracción.' },
        { id: 'aproximar', num: 6, titulo: 'Aproximaciones y errores', resumen: 'Truncar, redondear, error absoluto y relativo.' },
      ],
    },
  ],
  bancos: BANCOS2,
  // Vídeos comprobados: título, canal, duración y que YouTube deja insertarlos.
  videos: {
    fracciones: [
      { id: 'iT-VXhkCcLI', titulo: 'Fracciones irreducibles: cómo simplificar fracciones', canal: 'Susi Profe', minutos: 6 },
      { id: 'Bnts4R_7Et0', titulo: 'Simplificar fracciones, equivalentes e irreducibles', canal: 'podemos aprobar matemáticas', minutos: 10 },
    ],
    comparar: [{ id: 'Zjeax_E8soY', titulo: 'Reducir fracciones a común denominador', canal: 'Susi Profe', minutos: 12 }],
    operaciones: [{ id: 'KVO69jh2aBQ', titulo: 'Todas las operaciones con fracciones desde cero', canal: 'Susi Profe', minutos: 28 }],
    combinadas: [
      { id: 'LPU8VKaCZ8U', titulo: 'Operaciones combinadas con fracciones', canal: 'Susi Profe', minutos: 5 },
      { id: 'rfWAbtiaM1M', titulo: 'Operaciones combinadas con fracciones: 3 ejercicios', canal: 'Susi Profe', minutos: 10 },
    ],
    decimales: [
      { id: 'IfcrV5LSwUg', titulo: 'Fracción generatriz de un decimal periódico puro', canal: 'El Profesor Lunar', minutos: 5 },
      { id: 'Pwzn-6ncSrM', titulo: 'Pasar de decimal periódico mixto a fracción', canal: 'Susi Profe', minutos: 13 },
    ],
    aproximar: [{ id: '6ELSnTn9XwQ', titulo: 'Redondeo y truncamiento. Error absoluto y relativo', canal: 'Mi profesor de Mates', minutos: 8 }],
  },
  ejercicios: IDS2,
  prefijo: 'tema2/',
  // Tres por parada: dos de la autoevaluación o de clase y una nueva.
  examen: [2, 1],
}
