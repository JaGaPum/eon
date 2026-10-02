import { useEffect, useState, type ComponentType } from 'react'
import { ContextoAvance, useProgreso } from './lib/progreso'
import type { PropsParada } from './componentes/Parada'
import { Musica } from './componentes/Musica'
import { Examen, estrellas, PREGUNTAS_PRUEBA } from './componentes/Prueba'
import { ALUMNOS, CURSOS } from './contenido/catalogo'
import { Cursos, Inicio, Lecciones, Logo, Materias } from './Menus'
import Mapa, { EJERCICIOS } from './Mapa'
import Reglas from './paradas/Reglas'
import Descomposicion from './paradas/descomposicion/Descomposicion'
import { Mcd, Mcm } from './paradas/McdMcm'
import Enteros from './paradas/Enteros'
import Sumas from './paradas/Sumas'
import Productos from './paradas/Productos'
import Combinadas from './paradas/Combinadas'

// Paradas del Tema 1 de Matemáticas de 2º, la única lección construida por ahora.
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
  const avanceTotal = useProgreso()
  const { progreso, apuntar } = avanceTotal

  // La dirección empieza por el curso (#/2eso/...) o, en la lista de cursos, por el alumno (#/olivia).
  const curso = CURSOS.find((c) => c.id === idCurso && c.materias.length)
  const alumno = ALUMNOS.find((a) => a.id === (curso?.alumno ?? idCurso))
  const materia = curso?.materias.find((m) => m.id === idMateria && m.lecciones.length)
  const leccion = materia?.lecciones.find((l) => l.id === idLeccion)
  const Parada = leccion ? PARADAS[idParada] : undefined

  const migas = [
    alumno && { texto: alumno.nombre, href: `#/${alumno.id}` },
    curso && { texto: curso.nombre, href: `#/${curso.id}` },
    curso && materia && { texto: materia.nombre, href: `#/${curso.id}/${materia.id}` },
    curso && materia && leccion && { texto: leccion.titulo.split(' · ')[0], href: `#/${curso.id}/${materia.id}/${leccion.id}` },
  ].filter((m) => !!m)

  function avance(): string {
    const ids = Object.values(EJERCICIOS).flat()
    const conseguidas = Object.keys(PARADAS).reduce((t, p) => t + estrellas(progreso.pruebas[p], PREGUNTAS_PRUEBA), 0)
    return `★ ${conseguidas} de 24 · ${ids.filter((id) => progreso.hechos[id]).length} de ${ids.length} ejercicios de clase`
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
        {Parada ? (
          <div className="tablero">
            <Parada key={idParada} modo={modo} progreso={progreso} apuntar={apuntar} />
          </div>
        ) : leccion && idParada === 'examen' ? (
          <div className="tablero">
            <Examen />
          </div>
        ) : leccion ? (
          <Mapa progreso={progreso} />
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
