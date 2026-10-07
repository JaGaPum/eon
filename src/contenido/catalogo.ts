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
  /** Quién lo cursa: cada alumno ve solo sus cursos. */
  alumno: string
  nombre: string
  /** Época del viaje en el tiempo que da ambiente a cada curso. */
  era: string
  icono: string
  materias: Materia[]
}

export interface Alumno {
  id: string
  nombre: string
  /** Imagen en public/alumnos/. Para poner una foto, se sustituye el archivo y se cambia aquí la extensión. */
  imagen: string
  /** Cómo se presenta su lista de cursos. */
  etapa: string
}

export const ALUMNOS: Alumno[] = [
  { id: 'mateo', nombre: 'Mateo', imagen: '/alumnos/mateo.svg', etapa: 'Educación Secundaria' },
  { id: 'olivia', nombre: 'Olivia', imagen: '/alumnos/olivia.svg', etapa: 'Educación Primaria' },
]

const sinLecciones = (id: string, nombre: string, icono: string): Materia => ({ id, nombre, icono, lecciones: [] })

export const CURSOS: Curso[] = [
  { id: '1primaria', alumno: 'olivia', nombre: '1º Primaria', era: 'Era de los volcanes', icono: '🌋', materias: [] },
  { id: '2primaria', alumno: 'olivia', nombre: '2º Primaria', era: 'Era de los mamuts', icono: '🦣', materias: [] },
  {
    id: '3primaria',
    alumno: 'olivia',
    nombre: '3º Primaria',
    era: 'Era de las pirámides',
    icono: '🏺',
    // Áreas de 3º de Primaria en Galicia (Decreto 155/2022), con su nombre oficial.
    materias: [
      sinLecciones('matematicas', 'Matemáticas', '🔢'),
      sinLecciones('lingua-galega', 'Lingua Galega e Literatura', '📜'),
      sinLecciones('lengua-castellana', 'Lengua Castellana y Literatura', '✒️'),
      {
        id: 'conecemento-medio',
        nombre: 'Coñecemento do Medio Natural, Social e Cultural',
        icono: '🌿',
        lecciones: [{ id: 'paisaxes', titulo: 'Unidade 1 · Descubrimos as paisaxes', resumen: 'A Terra e as paisaxes de montaña, de chaira e de costa.' }],
      },
      sinLecciones('ingles', 'Inglés', '🛰️'),
      sinLecciones('educacion-artistica', 'Educación Artística', '🎨'),
      sinLecciones('educacion-fisica', 'Educación Física', '☄️'),
    ],
  },
  { id: '4primaria', alumno: 'olivia', nombre: '4º Primaria', era: 'Era de los castillos', icono: '🏰', materias: [] },
  { id: '5primaria', alumno: 'olivia', nombre: '5º Primaria', era: 'Era de los descubridores', icono: '🧭', materias: [] },
  { id: '6primaria', alumno: 'olivia', nombre: '6º Primaria', era: 'Era de las máquinas', icono: '⚙️', materias: [] },
  { id: '1eso', alumno: 'mateo', nombre: '1º ESO', era: 'Era de los dinosaurios', icono: '🦖', materias: [] },
  {
    id: '2eso',
    alumno: 'mateo',
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
      {
        id: 'frances',
        nombre: 'Francés',
        icono: '🌍',
        lecciones: [{ id: 'unite1', titulo: 'Unité 1 · La famille, le corps, les métiers', resumen: 'Verbos en -er, familia, cuerpo, profesiones y preguntas.' }],
      },
      sinLecciones('tecnoloxia', 'Tecnoloxía e Dixitalización', '🤖'),
      sinLecciones('musica', 'Música', '🎵'),
      sinLecciones('educacion-fisica', 'Educación Física', '☄️'),
    ],
  },
  { id: '3eso', alumno: 'mateo', nombre: '3º ESO', era: 'Era de los inventores', icono: '⚡', materias: [] },
  { id: '4eso', alumno: 'mateo', nombre: '4º ESO', era: 'Era del futuro', icono: '🌌', materias: [] },
]

/** Dirección del Tema 1 de Matemáticas de 2º, de la que cuelgan sus ocho paradas. */
export const RUTA_TEMA1 = '#/2eso/matematicas/tema1'
