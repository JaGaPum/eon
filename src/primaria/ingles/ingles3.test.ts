import { describe, expect, it } from 'vitest'
import { PREGUNTAS_PROBA } from '../pezas'
import { LIBRETA, VOCABULARIO, faltas } from './paradas'
import { CON_DIBUJO } from './debuxos'
import { BANCOS, PARADAS, PREGUNTAS_EXAME, xerarExame } from './Unidade'

describe('inglés de Olivia', () => {
  it('faltas de ortografía creíbles y distintas de la buena', () => {
    expect(faltas('frog')).toContain('frogg')
    expect(faltas('frog')).toContain('forg')
    for (const ps of Object.values(VOCABULARIO))
      for (const p of ps) {
        const f = faltas(p.en)
        expect(f.length, p.en).toBeGreaterThanOrEqual(3)
        expect(f, p.en).not.toContain(p.en)
      }
  })
  it('cada animal y cada cosa de la habitación tiene su dibujo', () => {
    for (const p of [...VOCABULARIO.ANIMALES, ...VOCABULARIO.DORMITORIO]) expect(CON_DIBUJO, p.en).toContain(p.en)
  })
  it('la libreta no repite palabras', () => {
    expect(new Set(LIBRETA.map((p) => p.en)).size).toBe(LIBRETA.length)
  })
  it('bancos completos y una sola respuesta buena', () => {
    expect(Object.keys(BANCOS).sort()).toEqual(PARADAS.map((p) => p.id).sort())
    for (const [id, banco] of Object.entries(BANCOS)) {
      expect(banco.length, id).toBeGreaterThanOrEqual(PREGUNTAS_PROBA + 4)
      for (const p of banco) {
        if (p.tipo === 'elixe') {
          expect(p.outras.length, `${id} ${p.correcta}`).toBeGreaterThan(0)
          expect(p.outras, `${id} ${p.correcta}`).not.toContain(p.correcta)
          expect(new Set(p.outras).size, `${id} ${p.correcta}`).toBe(p.outras.length)
        }
        if (p.tipo === 'toca') expect(Object.keys(p.nomes)).toContain(p.correcta)
      }
    }
    expect(PREGUNTAS_EXAME).toBe(18)
    expect(xerarExame()).toHaveLength(18)
  })
})
