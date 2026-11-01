import { describe, expect, it } from 'vitest'
import { PREGUNTAS_PROBA } from '../../primaria/pezas'
import { cantasCaben, conPunto, enTons, enarmonica, escala, semitons, tipoCompas, unidadeCompas, valor } from '../../lib/musica'
import { BANCOS, PARADAS, PREGUNTAS_EXAME, xerarExame } from './Unidade'

describe('teoría', () => {
  it('tons e semitóns', () => {
    expect(escala().filter((s) => s === 2)).toHaveLength(5)
    expect(escala().filter((s) => s === 1)).toHaveLength(2)
    expect(semitons('Do', 'Fa')).toBe(5)
    expect(semitons('Mi', 'Fa')).toBe(1)
    expect(enTons(5)).toBe('2 tons e 1/2')
    expect(enTons(1)).toBe('1/2 ton')
    expect(enTons(2)).toBe('1 ton')
    expect(enarmonica('Do')).toBe('Re♭')
    expect(enarmonica('Mi')).toBeNull()
  })
  it('figuras e compases', () => {
    expect(valor('redonda')).toBe(4)
    expect(cantasCaben('redonda', 'semicorchea')).toBe(16)
    expect(conPunto('branca')).toBe(3)
    expect(unidadeCompas(2, 4)).toBe('branca')
    expect(unidadeCompas(3, 4)).toBe('branca con punto')
    expect(unidadeCompas(4, 4)).toBe('redonda')
    expect(unidadeCompas(3, 8)).toBe('negra con punto')
    expect(tipoCompas(6)).toBe('binario')
    expect(tipoCompas(9)).toBe('ternario')
    expect(tipoCompas(12)).toBe('cuaternario')
  })
})

describe('preguntas', () => {
  it('bancos completos e unha soa resposta boa', () => {
    expect(Object.keys(BANCOS).sort()).toEqual(PARADAS.map((p) => p.id).sort())
    for (const [id, banco] of Object.entries(BANCOS)) {
      expect(banco.length, id).toBeGreaterThanOrEqual(PREGUNTAS_PROBA + 4)
      for (const p of banco) {
        if (p.tipo === 'elixe') {
          expect(p.outras.length, `${id} ${p.correcta}`).toBeGreaterThan(0)
          expect(p.outras, `${id} ${p.correcta}`).not.toContain(p.correcta)
          expect(new Set(p.outras).size, `${id} ${p.correcta}`).toBe(p.outras.length)
        }
      }
    }
    expect(PREGUNTAS_EXAME).toBe(27)
    expect(xerarExame()).toHaveLength(27)
  })
})
