import { useEffect, useState, type ComponentType } from 'react'
import { ContextoAvance, useProgreso, type Progreso } from './lib/progreso'
import type { PropsParada } from './componentes/Parada'
import { Musica } from './componentes/Musica'
import { Examen } from './componentes/Prueba'
import { ContextoTema, type Tema } from './componentes/tema'
import { TEMA1, TEMA2 } from './contenido/temas'
import Fracciones from './paradas/tema2/Fracciones'
import Comparar from './paradas/tema2/Comparar'
import Operaciones from './paradas/tema2/Operaciones'
import Combinadas2 from './paradas/tema2/Combinadas'
import Decimales from './paradas/tema2/Decimales'
import Aproximar from './paradas/tema2/Aproximar'
import { ALUMNOS, CURSOS, cursosDe } from './contenido/catalogo'
import { Cursos, Inicio, Lecciones, Logo, Materias } from './Menus'
import Mapa, { avanceTema } from './Mapa'
import Reglas from './paradas/Reglas'
import Descomposicion from './paradas/descomposicion/Descomposicion'
import { Mcd, Mcm } from './paradas/McdMcm'
import Enteros from './paradas/Enteros'
import Sumas from './paradas/Sumas'
import Productos from './paradas/Productos'
import Combinadas from './paradas/Combinadas'
import Paisaxes, { avancePaisaxes } from './primaria/paisaxes/Unidade'
import Unite1, { avanceUnite1 } from './idiomas/frances/Unite'

// Paradas del Tema 1 de Matemáticas de 2º.
const PARADAS: Record<string, ComponentType<PropsParada>> = {
  reglas: Reglas,
  descomposicion: Descomposicion,
  mcd: Mcd,
  mcm: Mcm,
  enteros: Enteros,
  sumas: Sumas,
  productos: Productos,
  combinadas: Combinadas,
}

// Temas de Matemáticas con paradas (Entender, Probar, Desmenuzar, Practicar y Prueba), por id de lección.
const TEMAS: Record<string, { tema: Tema; paradas: Record<string, ComponentType<PropsParada>> }> = {
  tema1: { tema: TEMA1, paradas: PARADAS },
  tema2: {
    tema: TEMA2,
    paradas: { fracciones: Fracciones, comparar: Comparar, operaciones: Operaciones, combinadas: Combinadas2, decimales: Decimales, aproximar: Aproximar },
  },
}

const UNIDADES: Record<string, { Compoñente: ComponentType<{ parada?: string; modo?: string; progreso: Progreso }>; avance: (p: Progreso) => string }> = {
  paisaxes: { Compoñente: Paisaxes, avance: avancePaisaxes },
  unite1: { Compoñente: Unite1, avance: avanceUnite1 },
}

/** El último alumno elegido en la pantalla de inicio, recordado en este dispositivo. */
function useAlumnoElixido(idCurso: string): string | null {
  const [elixido, setElixido] = useState<string | null>(() => {
    try {
      return localStorage.getItem('eon.alumno')
    } catch {
      return null
    }
  })
  if (ALUMNOS.some((a) => a.id === idCurso) && idCurso !== elixido) {
    setElixido(idCurso)
    try {
      localStorage.setItem('eon.alumno', idCurso)
    } catch {
      // Sin almacenamiento: vale para esta visita.
    }
  }
  return ALUMNOS.some((a) => a.id === idCurso) ? idCurso : elixido
}

// Navegación por la parte de la dirección tras «#»: #/2eso/matematicas/tema1/mcd/probar
function useRuta(): string[] {
  const [hash, setHash] = useState(location.hash)
  useEffect(() => {
    const alCambiar = () => {
      setHash(location.hash)
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', alCambiar)
    return () => window.removeEventListener('hashchange', alCambiar)
  }, [])
  return hash.replace(/^#\/?/, '').split('/')
}

export default function App() {
  const [idCurso, idMateria, idLeccion, idParada, modo] = useRuta()
  const elixido = useAlumnoElixido(idCurso)

  // La dirección empieza por el curso (#/2eso/...) o, en la lista de cursos, por el alumno (#/olivia).
  const curso = CURSOS.find((c) => c.id === idCurso && c.materias.length)
  // Dentro de un curso compartido (Mateo y Pablo), el alumno es el último que se eligió en la pantalla de inicio.
  const alumno =
    ALUMNOS.find((a) => a.id === idCurso) ??
    (curso && (ALUMNOS.find((a) => a.id === elixido && cursosDe(a) === curso.alumno) ?? ALUMNOS.find((a) => a.id === curso.alumno)))
  const avanceTotal = useProgreso(alumno?.progreso)
  const { progreso, apuntar } = avanceTotal
  const materia = curso?.materias.find((m) => m.id === idMateria && m.lecciones.length)
  const leccion = materia?.lecciones.find((l) => l.id === idLeccion)
  // Las unidades con juegos (las de Olivia y la de Francés) llevan su propio mapa y sus paradas; el Tema 1 de
  // Matemáticas usa las de abajo.
  const Unidade = leccion ? UNIDADES[leccion.id] : undefined
  const tema = leccion ? TEMAS[leccion.id] : undefined
  const Parada = tema?.paradas[idParada]

  const migas = [
    alumno && { texto: alumno.nombre, href: `#/${alumno.id}` },
    curso && { texto: curso.nombre, href: `#/${curso.id}` },
    curso && materia && { texto: materia.nombre, href: `#/${curso.id}/${materia.id}` },
    curso && materia && leccion && { texto: leccion.titulo.split(' · ')[0], href: `#/${curso.id}/${materia.id}/${leccion.id}` },
  ].filter((m) => !!m)

  function avance(idLeccion: string): string {
    if (UNIDADES[idLeccion]) return UNIDADES[idLeccion].avance(progreso)
    if (TEMAS[idLeccion]) return avanceTema(TEMAS[idLeccion].tema, progreso)
    return ''
  }

  return (
    <ContextoAvance.Provider value={avanceTotal}>
    <div className="mx-auto max-w-4xl px-4 pb-10">
      {alumno && (
        <header className="flex flex-wrap items-center gap-x-3 gap-y-1 py-4">
          <a href="#/" className="flex items-center gap-2 text-2xl font-black text-white">
            <Logo />
            Eón
          </a>
          <nav className="flex flex-wrap items-center gap-1 text-sm font-semibold text-indigo-200" aria-label="Dónde estás">
            {migas.map((m) => (
              <span key={m.href} className="flex items-center gap-1">
                <span className="text-indigo-400">›</span>
                <a href={m.href} className="rounded-lg px-2 py-1 hover:bg-white/10 hover:text-white">
                  {m.texto}
                </a>
              </span>
            ))}
          </nav>
          <Musica alumno={alumno.id} />
        </header>
      )}

      <main>
        {Unidade ? (
          <Unidade.Compoñente parada={idParada} modo={modo} progreso={progreso} />
        ) : tema ? (
          <ContextoTema.Provider value={tema.tema}>
            {Parada ? (
              <div className="tablero">
                <Parada key={idParada} modo={modo} progreso={progreso} apuntar={apuntar} />
              </div>
            ) : idParada === 'examen' ? (
              <div className="tablero">
                <Examen />
              </div>
            ) : (
              <Mapa progreso={progreso} />
            )}
          </ContextoTema.Provider>
        ) : materia && curso ? (
          <Lecciones curso={curso} materia={materia} avance={avance} />
        ) : curso ? (
          <Materias curso={curso} />
        ) : alumno ? (
          <Cursos alumno={alumno} />
        ) : (
          <Inicio />
        )}
      </main>
    </div>
    </ContextoAvance.Provider>
  )
}
