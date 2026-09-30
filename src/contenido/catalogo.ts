// Lo que se ve en los menús: cursos, materias y lecciones. Para añadir una materia o una lección se edita aquí.

export interface Leccion {
  id: string
  titulo: string
  resumen: string
}

export interface Materia {
  id: string
  nombre: string
  icono: string
  lecciones: Leccion[]
}

export interface Curso {
  id: string
  nombre: string
  /** Época del viaje en el tiempo que da ambiente a cada curso. */
  era: string
  icono: string
  materias: Materia[]
}

const sinLecciones = (id: string, nombre: string, icono: string): Materia => ({ id, nombre, icono, lecciones: [] })

export const CURSOS: Curso[] = [
  { id: '1eso', nombre: '1º ESO', era: 'Era de los dinosaurios', icono: '🦖', materias: [] },
  {
    id: '2eso',
    nombre: '2º ESO',
    era: 'Era de los exploradores',
    icono: '🚀',
    // Materias de 2º de ESO en Galicia.
    materias: [
      {
        id: 'matematicas',
        nombre: 'Matemáticas',
        icono: '🪐',
        lecciones: [{ id: 'tema1', titulo: 'Tema 1 · Números enteros y divisibilidad', resumen: 'Divisibilidad, m.c.d. y m.c.m., enteros y operaciones combinadas.' }],
      },
      sinLecciones('fisica-quimica', 'Física e Química', '⚛️'),
      sinLecciones('xeografia-historia', 'Xeografía e Historia', '⏳'),
      sinLecciones('lingua-galega', 'Lingua Galega e Literatura', '📜'),
      sinLecciones('lengua-castellana', 'Lengua Castellana y Literatura', '✒️'),
      sinLecciones('ingles', 'Inglés', '🛰️'),
      sinLecciones('segunda-lingua', 'Segunda Lingua Estranxeira', '🌍'),
      sinLecciones('tecnoloxia', 'Tecnoloxía e Dixitalización', '🤖'),
      sinLecciones('musica', 'Música', '🎵'),
      sinLecciones('educacion-fisica', 'Educación Física', '☄️'),
    ],
  },
  { id: '3eso', nombre: '3º ESO', era: 'Era de los inventores', icono: '⚡', materias: [] },
  { id: '4eso', nombre: '4º ESO', era: 'Era del futuro', icono: '🌌', materias: [] },
]

/** Dirección del Tema 1 de Matemáticas de 2º, de la que cuelgan sus ocho paradas. */
export const RUTA_TEMA1 = '#/2eso/matematicas/tema1'
