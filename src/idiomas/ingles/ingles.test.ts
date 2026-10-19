import { describe, expect, it } from 'vitest'
import { continuo, simple, VERBOS } from './verbos'
import { PREGUNTAS as P1 } from './presentes'
import { PREGUNTAS as P2, EJ9, EJ10 } from './thereis'
import { PREGUNTAS as P3, EJ8 } from './preguntas'
import { PREGUNTAS as P4, EJ13 } from './howmuch'
import { corrixir } from '../../primaria/pezas'

const v = (b: string) => VERBOS.find((x) => x.base === b)!

describe('formas verbales', () => {
  it('present simple', () => {
    expect(simple(v('study'), true)).toEqual(['studies'])
    expect(simple(v('watch'), true)).toEqual(['watches'])
    expect(simple(v('play'), false, true)).toContain("don't play")
    expect(simple(v('have'), true, true)).toContain("doesn't have")
  })
  it('present continuous', () => {
    expect(continuo(v('swim'), 'I', false)).toContain('am swimming')
    expect(continuo(v('write'), 'She', true)).toEqual(['is writing'])
    expect(continuo(v('run'), 'They', false, true)).toEqual(["aren't running", 'are not running'])
    expect(continuo(v('run'), 'I', false, true)).toContain("'m not running")
  })
  it('se aceptan las formas largas y cortas', () => {
    expect(corrixir('is not playing', ["isn't playing", 'is not playing'])).toBe('ben')
    expect(corrixir("Doesn’t play", ["doesn't play"])).toBe('ben')
  })
})

describe('banco de preguntas', () => {
  for (const [nombre, banco] of Object.entries({ presentes: P1, thereis: P2, questions: P3, how: P4 }))
    it(`${nombre}: la correcta está entre las opciones y no se repite`, () => {
      expect(banco.length).toBeGreaterThanOrEqual(20)
      for (const q of banco)
        if (q.tipo === 'elixe') {
          expect(q.outras).not.toContain(q.correcta)
          expect(new Set(q.outras).size).toBe(q.outras.length)
          expect(q.outras.length).toBeGreaterThan(0)
        }
    })
  it('ejercicios del libro', () => {
    expect(EJ8.map((e) => e.pregunta)).toContain('Who gives petrol to drivers in Turkmenistan?')
    expect(EJ9).toHaveLength(6)
    expect(EJ10).toHaveLength(10)
    expect(EJ13.map(([c]) => c)).toEqual(['Is there', 'How far', 'How often', 'How long', 'Are there', 'How much', 'How many'])
  })
})
