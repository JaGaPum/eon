import { describe, expect, it } from 'vitest'
import { PREGUNTAS_PROBA } from '../pezas'
import { CARTEIS, REINOS, SERES, alimentoDe, celulasDe, nivelBiodiversidade, reinoDe, reinoDoCartel, seresDo, textoCartel } from '../../lib/seresVivos'
import { CONTAS } from './paradas'
import { BANCOS, PARADAS, PREGUNTAS_EXAME, xerarExame } from './Unidade'

describe('os seres vivos', () => {
  it('a táboa da páxina 20', () => {
    expect(celulasDe('animais')).toEqual(['pluri'])
    expect(celulasDe('plantas')).toEqual(['pluri'])
    expect(celulasDe('bacterias')).toEqual(['uni'])
    expect(celulasDe('fungos').sort()).toEqual(['pluri', 'uni'])
    expect(celulasDe('protistas').sort()).toEqual(['pluri', 'uni'])
    expect(alimentoDe('plantas')).toEqual(['fabrican'])
    expect(alimentoDe('animais')).toEqual(['toman'])
    expect(alimentoDe('fungos')).toEqual(['toman'])
    expect(alimentoDe('bacterias').sort()).toEqual(['fabrican', 'toman'])
    expect(alimentoDe('protistas').sort()).toEqual(['fabrican', 'toman'])
  })
  it('os catro carteis da páxina 21', () => {
    expect(reinoDoCartel(CARTEIS[0])).toBe('fungos')
    expect(reinoDoCartel(CARTEIS[1])).toBe('bacterias')
    expect(reinoDoCartel(CARTEIS[2])).toBe('protistas')
    expect(reinoDoCartel(CARTEIS[3])).toBe('animais')
    expect(textoCartel(CARTEIS[3])).toBe('Son pluricelulares, necesitan alimento e desprázanse.')
  })
  it('cada cartel describe un só reino', () => {
    for (const c of CARTEIS) expect(reinoDoCartel(c), textoCartel(c)).not.toBeNull()
  })
  it('os seres do libro, no seu reino', () => {
    expect(reinoDe('niscaro')).toBe('fungos')
    expect(reinoDe('fermento')).toBe('fungos')
    expect(reinoDe('algaVerde')).toBe('protistas')
    expect(reinoDe('ameba')).toBe('protistas')
    expect(reinoDe('bacteriaIogur')).toBe('bacterias')
    expect(reinoDe('pinguin')).toBe('animais')
    expect(reinoDe('palmeira')).toBe('plantas')
    for (const r of REINOS) expect(seresDo(r).length, r).toBeGreaterThanOrEqual(2)
    expect(new Set(SERES.map((s) => s.nome)).size).toBe(SERES.length)
  })
  it('a escala da biodiversidade', () => {
    expect(nivelBiodiversidade(9)).toBe('baixa')
    expect(nivelBiodiversidade(10)).toBe('media')
    expect(nivelBiodiversidade(20)).toBe('media')
    expect(nivelBiodiversidade(21)).toBe('alta')
    const niveis = new Set(CONTAS.map(([a, b, c]) => nivelBiodiversidade(a + b + c)))
    expect(niveis.size).toBe(3)
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
        if (p.tipo === 'toca') expect(Object.keys(p.nomes), id).toContain(p.correcta)
      }
    }
    expect(PREGUNTAS_EXAME).toBe(18)
    expect(xerarExame()).toHaveLength(18)
  })
})
