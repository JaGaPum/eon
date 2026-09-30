import { useCallback, useState } from 'react'

// El progreso vive en el navegador de cada dispositivo: sin cuentas ni servidor.
const CLAVE = 'eon.tema1'

export interface Progreso {
  /** Ejercicios de clase resueltos, por id. */
  hechos: Record<string, boolean>
  /** Cuántos ejercicios generados ha resuelto. */
  nuevos: number
}

function leer(): Progreso {
  try {
    const p = JSON.parse(localStorage.getItem(CLAVE) ?? 'null')
    if (p && typeof p.hechos === 'object') return { hechos: p.hechos, nuevos: Number(p.nuevos) || 0 }
  } catch {
    // Sin almacenamiento disponible: se empieza de cero.
  }
  return { hechos: {}, nuevos: 0 }
}

export function useProgreso() {
  const [progreso, setProgreso] = useState(leer)

  /** Apunta un ejercicio resuelto: con id si es de clase, sin id si es generado. */
  const apuntar = useCallback((id?: string) => {
    setProgreso((p) => {
      const nuevo = id ? { ...p, hechos: { ...p.hechos, [id]: true } } : { ...p, nuevos: p.nuevos + 1 }
      try {
        localStorage.setItem(CLAVE, JSON.stringify(nuevo))
      } catch {
        // Si no se puede guardar, el progreso dura lo que dure la sesión.
      }
      return nuevo
    })
  }, [])

  return { progreso, apuntar }
}
