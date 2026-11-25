import { describe, expect, it } from 'vitest'
import { corrixir } from '../../../primaria/pezas'
import { EJ13_PASIVA, EJ15_PASIVA, EJ8_P31, FRASES_PASADO, FRASES_PASIVA, FRASES_USED, IRREGULARES, REGULARES, VERBOS2, pasado, pasiva, usedTo, verbo } from './datos'
import { PREGUNTAS as P_PASADO } from './pasado'
import { HUECOS_LIBRO, PREGUNTAS as P_PASIVA } from './pasiva'
import { PREGUNTAS as P_USED } from './usedto'

describe('verbos del Module 2', () => {
  it('no hay verbos repetidos', () => {
    expect(new Set(VERBOS2.map((v) => v.base)).size).toBe(VERBOS2.length)
  })
  it('los regulares siguen su regla de ortografía', () => {
    for (const v of REGULARES) {
      const esperado = { ed: v.base + 'ed', d: v.base + 'd', ied: v.base.slice(0, -1) + 'ied', doble: v.base + v.base.at(-1) + 'ed' }[v.regla!]
      expect(v.past).toBe(esperado)
      expect(v.pp).toBe(v.past)
    }
  })
  it('los irregulares más vistos', () => {
    expect(verbo('drive').past).toBe('drove')
    expect(verbo('write').pp).toBe('written')
    expect(verbo('eat').pp).toBe('eaten')
    expect(IRREGULARES.every((v) => !v.regla)).toBe(true)
  })
  it('todos los verbos de las frases existen', () => {
    for (const [v] of FRASES_PASADO) expect(() => verbo(v)).not.toThrow()
    for (const f of FRASES_PASIVA) expect(() => verbo(f.v)).not.toThrow()
  })
})

describe('formas', () => {
  it('Past Simple', () => {
    expect(pasado(verbo('check'), false)).toEqual(['checked'])
    expect(pasado(verbo('go'), true)).toEqual(["didn't go", 'did not go'])
  })
  it('pasiva', () => {
    expect(pasiva(verbo('do'), false, 'presente', false)).toEqual(['is done'])
    expect(pasiva(verbo('clean'), true, 'presente', true)).toContain("aren't cleaned")
    expect(pasiva(verbo('eat'), false, 'pasado', false)).toEqual(['was eaten'])
    expect(pasiva(verbo('pay'), true, 'pasado', true)).toContain("weren't paid")
  })
  it('used to', () => {
    expect(usedTo('have', false)).toEqual(['used to have'])
    expect(usedTo('work', true)).toEqual(["didn't use to work", 'did not use to work'])
    expect(corrixir("didn't used to work", usedTo('work', true))).not.toBe('ben')
  })
})

describe('ejercicios del libro', () => {
  it('ejercicio 8 de la página 31', () => {
    expect(EJ8_P31.map((e) => e.huecos[0][0])).toEqual(['studied', "didn't win", "didn't wash", 'wrote', "didn't fly"])
    for (const e of EJ8_P31) expect(e.frase.split('___').length - 1).toBe(e.huecos.length)
  })
  it('ejercicios 13 y 15 de la pasiva', () => {
    for (const e of EJ13_PASIVA) expect(e.frase.split('___').length - 1).toBe(e.huecos.length)
    expect(EJ15_PASIVA.map((e) => e.respuestas[0])).toEqual(['was spent', "weren't sent", 'were made', 'were given', "weren't played", 'were kids kept', 'were taken out', "wasn't left"])
  })
  it('frases de used to', () => {
    expect(FRASES_USED.length).toBeGreaterThanOrEqual(12)
  })
})

describe('bancos de preguntas', () => {
  for (const [nombre, banco] of Object.entries({ pasado: P_PASADO, pasiva: [...P_PASIVA, ...HUECOS_LIBRO], usedto: P_USED }))
    it(`${nombre}: la correcta no está entre las otras y no se repiten`, () => {
      expect(banco.length).toBeGreaterThanOrEqual(20)
      for (const q of banco)
        if (q.tipo === 'elixe') {
          expect(q.outras).not.toContain(q.correcta)
          expect(new Set(q.outras).size).toBe(q.outras.length)
          expect(q.outras.length).toBeGreaterThan(0)
        } else if (q.tipo === 'escribe') expect(q.respostas.length).toBeGreaterThan(0)
    })
})
