import { describe, expect, it } from 'vitest'
import { BANCOS2 } from './tema2'
import { esCorrecta } from '../componentes/Respuesta'
import { leer, mcdDe } from '../lib/fracciones'

const todas = Object.values(BANCOS2).flatMap((b) => b.clase)

describe('banco del Tema 2', () => {
  it('tiene ids únicos y del Tema 2', () => {
    const ids = todas.map((q) => q.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids.every((id) => id.startsWith('t2:'))).toBe(true)
  })
  it('cada pregunta acepta su propia respuesta', () => {
    for (const q of todas) {
      const e = q.entrada
      const resp = typeof e === 'object' && 'mixto' in e ? q.correcta.replace(' ', '|').replace('/', '|') : q.correcta
      expect(esCorrecta(q, resp), q.id).toBe(true)
    }
  })
  it('las opciones incluyen la correcta y el orden usa todas las fichas', () => {
    for (const q of todas) {
      const e = q.entrada
      if (typeof e === 'object' && 'opciones' in e) expect(e.opciones, q.id).toContain(q.correcta)
      if (typeof e === 'object' && 'orden' in e) expect([...q.correcta.split('|')].sort(), q.id).toEqual([...e.orden].sort())
    }
  })
  it('las fracciones que se piden irreducibles lo son', () => {
    for (const q of todas) {
      const e = q.entrada
      if (typeof e === 'object' && 'fraccion' in e && e.irreducible) {
        const f = leer(q.correcta)!
        expect(mcdDe(f.n, f.d), q.id).toBe(1)
      }
    }
  })
  it('rechaza una fracción equivalente sin simplificar donde se pide irreducible', () => {
    const q = BANCOS2.operaciones.clase.find((x) => x.id === 't2:operaciones:act-9a')!
    expect(q.correcta).toBe('2/5')
    expect(esCorrecta(q, '6/15')).toBe(false)
    expect(esCorrecta(q, '2/5')).toBe(true)
  })
  it('común denominador: exige el m.c.m.', () => {
    const q = BANCOS2.comparar.clase.find((x) => x.id === 't2:comparar:act-2a')!
    expect(q.correcta).toBe('4/42|7/42|15/42')
    expect(esCorrecta(q, '8/84|14/84|30/84')).toBe(false)
  })
  it('los generadores dan preguntas válidas', () => {
    for (const b of Object.values(BANCOS2))
      for (let i = 0; i < 40; i++) {
        const q = b.generar()
        const e = q.entrada
        const resp = typeof e === 'object' && 'mixto' in e ? q.correcta.replace(' ', '|').replace('/', '|') : q.correcta
        expect(esCorrecta(q, resp)).toBe(true)
        expect(q.pistas.length).toBeGreaterThan(0)
      }
  })
  it('cuántas hay por parada', () => {
    const cuentas = Object.fromEntries(Object.entries(BANCOS2).map(([k, b]) => [k, b.clase.length]))
    console.log(cuentas, 'total', todas.length)
    expect(todas.length).toBeGreaterThan(200)
  })
})
