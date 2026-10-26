// Exámenes y tareas de cada alumno, copiados de Abalar (la app del colegio). Para añadir uno, se escribe aquí.
// `leccion`: si la app tiene una lección para prepararlo, el id de esa lección dentro de la materia.

export interface Tarefa {
  /** AAAA-MM-DD */
  fecha: string
  tipo: 'examen' | 'recordatorio'
  /** Id de la materia en el catálogo. */
  materia: string
  titulo: string
  /** Lo que escribe el profesor en Abalar: qué entra, qué hay que llevar… */
  nota?: string
  leccion?: string
}

export const TAREFAS: Record<string, Tarefa[]> = {
  // Mateo y Pablo van a la misma clase: Pablo ve estas mismas.
  mateo: [
    { fecha: '2026-10-19', tipo: 'examen', materia: 'fisica-quimica', titulo: 'Parcial de Física y Química', leccion: 'fq1' },
    { fecha: '2026-10-21', tipo: 'examen', materia: 'ingles', titulo: 'Modules 1ABC', nota: 'Test.', leccion: 'module1' },
    { fecha: '2026-10-22', tipo: 'recordatorio', materia: 'ingles', titulo: 'Reader', nota: 'Activities chapters 1-4. Reading from page 20.' },
    { fecha: '2026-10-23', tipo: 'examen', materia: 'lengua-castellana', titulo: 'Parcial de Lengua Castellana', nota: 'Los recuadros azules de las páginas 8, 10, 11, 22 y 23.', leccion: 'lengua1' },
    { fecha: '2026-10-26', tipo: 'examen', materia: 'xeografia-historia', titulo: 'Parcial de la 1.ª evaluación', nota: 'Roma + tema 1: Bizancio, Islam, Imperio carolinxio.', leccion: 'parcial1' },
    { fecha: '2026-11-03', tipo: 'examen', materia: 'musica', titulo: 'Examen', nota: 'Apuntes da primeira avaliación ata a páxina 15: o son e as cualidades do son (a altura, a duración e a intensidade). Teñen subliñado o que traballamos na clase.' },
  ],
}

/** La fecha como día local, sin horas. */
export const dia = (f: string) => {
  const [a, m, d] = f.split('-').map(Number)
  return new Date(a, m - 1, d)
}
export const hoy = () => {
  const h = new Date()
  return new Date(h.getFullYear(), h.getMonth(), h.getDate())
}
export const diasHasta = (f: string) => Math.round((dia(f).getTime() - hoy().getTime()) / 86400000)

export function faltan(f: string): string {
  const n = diasHasta(f)
  return n === 0 ? 'Hoy' : n === 1 ? 'Mañana' : n < 0 ? 'Ya pasó' : `En ${n} días`
}
