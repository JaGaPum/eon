import { describe, expect, it } from 'vitest'
import { agrupar, descomponer, divisores, esPrimo, factores, MAXIMO, paso, porque, valor } from './mates'
import { CLASE } from '../contenido/tema1'

describe('descomponer', () => {
  it('reproduce el ejemplo del libro: 56 = 2 · 2 · 2 · 7', () => {
    expect(factores(56)).toEqual([2, 2, 2, 7])
    expect(descomponer(56).map((s) => s.cociente)).toEqual([28, 14, 7, 1])
  })

  it('resuelve el ejercicio 9 de la hoja', () => {
    expect(agrupar(factores(126))).toEqual([[2, 1], [3, 2], [7, 1]])
    expect(agrupar(factores(356))).toEqual([[2, 2], [89, 1]])
    expect(agrupar(factores(408))).toEqual([[2, 3], [3, 1], [17, 1]])
    expect(agrupar(factores(512))).toEqual([[2, 9]])
    expect(agrupar(factores(375))).toEqual([[3, 1], [5, 3]])
    expect(agrupar(factores(1225))).toEqual([[5, 2], [7, 2]])
    expect(agrupar(factores(632))).toEqual([[2, 3], [79, 1]])
    expect(agrupar(factores(2340))).toEqual([[2, 2], [3, 2], [5, 1], [13, 1]])
  })

  it('da solo primos y su producto es el número, para todo el rango', () => {
    for (let n = 2; n <= MAXIMO; n++) {
      const f = factores(n)
      expect(f.every(esPrimo)).toBe(true)
      expect(f.reduce((a, b) => a * b, 1)).toBe(n)
    }
  })

  it('anota los primos descartados antes de encontrar el bueno', () => {
    expect(paso(63).descartes.map((d) => d.primo)).toEqual([2])
    expect(paso(79).descartes.map((d) => d.primo)).toEqual([2, 3, 5, 7])
    expect(paso(79).primo).toBe(79)
  })
})

describe('porque', () => {
  it('nunca contradice a la división, con ningún primo', () => {
    for (let n = 2; n <= 3000; n++) {
      for (const p of [2, 3, 5, 7, 11, 13]) {
        const r = porque(n, p)
        expect(r.divide).toBe(n % p === 0)
        expect(r.texto.includes('no es divisible') || r.texto.includes('tendría que')).toBe(n % p !== 0)
      }
    }
  })

  it('usa el criterio de las cifras para el 3 y el 11', () => {
    expect(porque(126, 3).texto).toContain('1 + 2 + 6 = 9')
    expect(porque(1001, 11).texto).toContain('La diferencia es 0')
  })
})

describe('ejercicios de clase', () => {
  it('ejercicios 6 y 7b: valor de cada descomposición', () => {
    const valores = CLASE.flatMap((e) => (e.tipo === 'valor' ? [valor(e.f)] : []))
    expect(valores).toEqual([200, 99, 72, 900, 117])
  })

  it('ejercicio 7: las igualdades que hay que completar', () => {
    expect(agrupar(factores(304))).toEqual([[2, 4], [19, 1]])
    expect(agrupar(factores(201))).toEqual([[3, 1], [67, 1]])
    expect(agrupar(factores(616))).toEqual([[2, 3], [7, 1], [11, 1]])
  })

  it('ejercicio 8: número de divisores', () => {
    const cuantos = CLASE.flatMap((e) => (e.tipo === 'divisores' ? [divisores(e.n).length] : []))
    expect(cuantos).toEqual([6, 8, 5, 8, 16, 12])
  })
})
