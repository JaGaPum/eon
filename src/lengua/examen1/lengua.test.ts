import { describe, expect, it } from 'vitest'
import { PREGUNTAS_PROBA } from '../../primaria/pezas'
import { debeLlevarTilde, separar } from '../../lib/silabas'
import { divisionesFalsas } from './xerar'
import { PALABRAS_SILABAS, PALABRAS_TILDE } from './paradas'
import { BANCOS, PARADAS, PREGUNTAS_EXAME, xerarExame } from './Unidade'

describe('lengua', () => {
  it('las palabras de tildes cumplen las reglas', () => {
    for (const p of PALABRAS_TILDE) expect(debeLlevarTilde(p), p).toBe(/[áéíóú]/.test(p))
  })
  it('las divisiones falsas no coinciden con la buena y hay al menos una', () => {
    for (const p of PALABRAS_SILABAS) {
      const f = divisionesFalsas(p)
      expect(f, p).not.toContain(separar(p))
      if (separar(p).includes('-') || /[aeiouáéíóú]{2}/i.test(p)) expect(f.length, p).toBeGreaterThan(0)
    }
  })
  it('bancos completos y una sola respuesta buena', () => {
    expect(Object.keys(BANCOS).sort()).toEqual(PARADAS.map((p) => p.id).sort())
    for (const [id, banco] of Object.entries(BANCOS)) {
      expect(banco.length, id).toBeGreaterThanOrEqual(PREGUNTAS_PROBA + 4)
      for (const p of banco)
        if (p.tipo === 'elixe') {
          expect(p.outras.length, `${id} ${p.correcta}`).toBeGreaterThan(0)
          expect(p.outras, `${id} ${p.correcta}`).not.toContain(p.correcta)
          expect(new Set(p.outras).size).toBe(p.outras.length)
        }
    }
    expect(PREGUNTAS_EXAME).toBe(20)
    expect(xerarExame()).toHaveLength(20)
  })
})
