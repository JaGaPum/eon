// Lo que distingue a un tema de Matemáticas de otro: su ruta, sus paradas, sus preguntas y sus vídeos. Las piezas
// comunes (parada, prueba, examen, mapa) lo leen de aquí, así que cada tema solo aporta su contenido.
import { createContext, useContext } from 'react'
import type { Pregunta } from './Respuesta'
import type { Video } from '../contenido/tema1'

export interface Estacion {
  id: string
  num: number
  titulo: string
  resumen: string
}

export interface Banco {
  clase: Pregunta[]
  generar: () => Pregunta
  /** Preguntas preferidas para el examen final (las de la autoevaluación del libro), si las hay. */
  examen?: Pregunta[]
}

export interface Tema {
  /** Dirección del mapa del tema: «#/2eso/matematicas/tema2». */
  ruta: string
  titulo: string
  /** Frase bajo el título del mapa. */
  intro: string
  bloques: { titulo: string; estaciones: Estacion[] }[]
  bancos: Record<string, Banco>
  videos: Record<string, Video[]>
  /** Ids de los ejercicios de clase de cada parada, para la barra de avance del mapa. */
  ejercicios: Record<string, string[]>
  /** Se antepone al guardar las estrellas y la nota: el Tema 1 no lleva para conservar lo ya guardado. */
  prefijo: string
  /** Preguntas del examen por parada: [de clase, nuevas]. */
  examen: [number, number]
}

export const ContextoTema = createContext<Tema | null>(null)

export function useTema(): Tema {
  const t = useContext(ContextoTema)
  if (!t) throw new Error('Falta ContextoTema')
  return t
}

export const estacionesDe = (t: Tema) => t.bloques.flatMap((b) => b.estaciones)
export const preguntasExamen = (t: Tema) => estacionesDe(t).length * (t.examen[0] + t.examen[1])
