import { describe, expect, it } from 'vitest'
import { PREGUNTAS_LENGUA2 } from './paradas'
import { ANTONIMOS_33, FUNCIONES_45, FUNCION_ELEMENTO } from './datos'

describe('datos del global de Lengua', () => {
  it('la función del código es la metalingüística (errata del esquema)', () => {
    expect(FUNCION_ELEMENTO.find(([, e]) => e === 'Código')![0]).toBe('Metalingüística')
    expect(new Set(FUNCION_ELEMENTO.map(([f]) => f)).size).toBe(6)
  })
  it('las doce frases de la página 45', () => {
    expect(FUNCIONES_45.map(([, f]) => f[0]).join('')).toBe('RAPMFEAEFPMR')
  })
  it('antónimos de la actividad 33 sin las dos dudosas', () => {
    expect(ANTONIMOS_33.map(([p]) => p)).not.toContain('ir / venir')
  })
})

describe('bancos de preguntas', () => {
  for (const [nombre, banco] of Object.entries(PREGUNTAS_LENGUA2))
    it(`${nombre}: hay preguntas y la correcta no está entre las otras`, () => {
      expect(banco.length).toBeGreaterThanOrEqual(20)
      for (const q of banco)
        if (q.tipo === 'elixe') {
          expect(q.outras, q.correcta).not.toContain(q.correcta)
          expect(new Set(q.outras).size, q.correcta).toBe(q.outras.length)
          expect(q.outras.length, q.correcta).toBeGreaterThan(0)
        }
    })
})
