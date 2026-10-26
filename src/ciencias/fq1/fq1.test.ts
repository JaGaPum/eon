import { describe, expect, it } from 'vitest'
import { PREGUNTAS_PROBA, lerNumero, numeroBen } from '../../primaria/pezas'
import { BANCOS, PARADAS, PREGUNTAS_EXAME, xerarExame } from './Unidade'

describe('números escritos', () => {
  it('lee coma, punto y unidades', () => {
    expect(lerNumero('22,78')).toBe(22.78)
    expect(lerNumero('22.78 m/s')).toBe(22.78)
    expect(lerNumero('1.000')).toBe(1000)
    expect(lerNumero('2 500')).toBe(2500)
    expect(lerNumero('−8')).toBe(-8)
    expect(lerNumero('hola')).toBeNull()
    expect(numeroBen('22,8', 22.7778)).toBe(true)
    expect(numeroBen('22', 22.7778)).toBe(false)
    expect(numeroBen('-8', -8, 0)).toBe(true)
  })
})

describe('física y química', () => {
  it('bancos completos y sin respuestas repetidas', () => {
    expect(Object.keys(BANCOS).sort()).toEqual(PARADAS.map((p) => p.id).sort())
    for (const [id, banco] of Object.entries(BANCOS)) {
      expect(banco.length, id).toBeGreaterThanOrEqual(PREGUNTAS_PROBA + 4)
      for (const p of banco) {
        if (p.tipo === 'elixe') {
          expect(p.outras.length, `${id} ${p.correcta}`).toBeGreaterThan(0)
          expect(p.outras, `${id} ${p.correcta}`).not.toContain(p.correcta)
          expect(new Set(p.outras).size, `${id} ${p.correcta}`).toBe(p.outras.length)
        }
        if (p.tipo === 'numero') expect(Number.isFinite(p.valor), id).toBe(true)
      }
    }
    expect(PREGUNTAS_EXAME).toBe(24)
    expect(xerarExame()).toHaveLength(24)
  })
})
