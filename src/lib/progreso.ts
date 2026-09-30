import { createContext, useCallback, useContext, useState } from 'react'

// El progreso vive en el navegador de cada dispositivo: sin cuentas ni servidor.
const CLAVE = 'eon.tema1'

export interface Progreso {
  /** Ejercicios de clase resueltos, por id. */
  hechos: Record<string, boolean>
  /** Cuántos ejercicios generados ha resuelto. */
  nuevos: number
  /** Mejor número de aciertos en la prueba de cada parada, y en «examen» el del examen final. */
  pruebas: Record<string, number>
}

function leer(): Progreso {
  try {
    const p = JSON.parse(localStorage.getItem(CLAVE) ?? 'null')
    if (p && typeof p.hechos === 'object') {
      return { hechos: p.hechos, nuevos: Number(p.nuevos) || 0, pruebas: p.pruebas && typeof p.pruebas === 'object' ? p.pruebas : {} }
    }
  } catch {
    // Sin almacenamiento disponible: se empieza de cero.
  }
  return { hechos: {}, nuevos: 0, pruebas: {} }
}

export interface Avance {
  progreso: Progreso
  /** Apunta un ejercicio resuelto: con id si es de clase, sin id si es generado. */
  apuntar: (id?: string) => void
  /** Apunta el resultado de una prueba. Solo se guarda si mejora la marca anterior. */
  marcar: (prueba: string, aciertos: number) => void
}

export function useProgreso(): Avance {
  const [progreso, setProgreso] = useState(leer)

  const cambiar = useCallback((f: (p: Progreso) => Progreso) => {
    setProgreso((p) => {
      const nuevo = f(p)
      try {
        localStorage.setItem(CLAVE, JSON.stringify(nuevo))
      } catch {
        // Si no se puede guardar, el progreso dura lo que dure la sesión.
      }
      return nuevo
    })
  }, [])

  const apuntar = useCallback(
    (id?: string) => cambiar((p) => (id ? { ...p, hechos: { ...p.hechos, [id]: true } } : { ...p, nuevos: p.nuevos + 1 })),
    [cambiar],
  )

  const marcar = useCallback(
    (prueba: string, aciertos: number) =>
      cambiar((p) => ((p.pruebas[prueba] ?? -1) >= aciertos ? p : { ...p, pruebas: { ...p.pruebas, [prueba]: aciertos } })),
    [cambiar],
  )

  return { progreso, apuntar, marcar }
}

/** El avance, disponible para cualquier componente sin pasarlo de mano en mano. */
export const ContextoAvance = createContext<Avance | null>(null)

export function useAvance(): Avance {
  const avance = useContext(ContextoAvance)
  if (!avance) throw new Error('Falta ContextoAvance')
  return avance
}
