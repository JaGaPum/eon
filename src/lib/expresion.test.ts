import { describe, expect, it } from 'vitest'
import { analizar, aplicar, escribir, motivo, resolver, siguiente } from './expresion'
import {
  BANCOS,
  COMBINADAS,
  COMBINADAS_1,
  COMBINADAS_2,
  ENTEROS,
  IDS,
  MCD,
  MCM,
  nuevaCombinadas,
  nuevaEnteros,
  nuevaMcd,
  nuevaMcm,
  nuevaProductos,
  nuevaReglas,
  nuevaSumas,
  PRODUCTOS,
  REGLAS,
  SUMAS,
} from '../contenido/preguntas'
import { comunes, criterio, CRITERIOS, mcd, mcm } from './mates'

// Soluciones impresas en las hojas del profesor.
const SOLUCIONES_1: Record<number, number> = {
  1: 7, 2: -24, 3: -33, 4: -245, 5: 31, 6: -49, 7: -44, 8: 2, 9: -4, 10: -3, 11: 0, 12: 14, 13: 16, 14: -18, 15: -1, 16: 4,
  17: -1, 18: 8, 19: 60, 20: 288, 21: -216, 23: -25, 24: -3, 25: 16, 26: 88, 27: 0, 28: -18, 29: 28,
}
const SOLUCIONES_2 = [3, 13, 0, 6, -3, 2, -44, 28, 2, -4, 3, 25, -1, -18, -8, 3, 1, -15, -1, -55, -6, -7, -14, -26, 5, -28]

describe('resolver', () => {
  it('coincide con las soluciones de la hoja «Combinadas 1»', () => {
    for (const [n, op] of COMBINADAS_1) expect([n, resolver(op).resultado]).toEqual([n, SOLUCIONES_1[n]])
  })

  it('coincide con las soluciones de la hoja «Combinadas 2»', () => {
    expect(COMBINADAS_2.map((op) => resolver(op).resultado)).toEqual(SOLUCIONES_2)
  })

  it('respeta la jerarquía y escribe los negativos entre paréntesis', () => {
    const r = resolver('2 - 3*[4 - (5 - 7)]')
    expect(r.inicial).toBe('2 − 3 · [4 − (5 − 7)]')
    expect(r.pasos.map((p) => p.despues)).toEqual(['2 − 3 · [4 − (−2)]', '2 − 3 · 6', '2 − 18', '−16'])
    expect(r.pasos[1].cuenta).toContain('Restar un negativo es sumar su opuesto')
  })

  it('va de izquierda a derecha en cadenas de · y :', () => {
    expect(resolver('24 / (-3) * (+5) * (-2)').pasos.map((p) => p.despues)).toEqual(['−8 · 5 · (−2)', '−40 · (−2)', '80'])
  })

  it('conserva −(−1) como paso propio', () => {
    const r = resolver('-{1 - [1 - (-1)]}')
    expect(r.resultado).toBe(1)
    expect(r.pasos.some((p) => p.cuenta.includes('cambia el signo'))).toBe(true)
  })

  it('rechaza lo que no es una operación válida', () => {
    for (const mala of ['', '3 +', '(2 + 3', '2 + a', '7 / 2', '5 / (3 - 3)', '2 3']) expect(() => resolver(mala)).toThrow()
  })

  it('todos los pasos dejan el mismo valor', () => {
    for (const op of [...COMBINADAS_2, ...COMBINADAS_1.map(([, o]) => o)]) {
      const r = resolver(op)
      for (const p of r.pasos) expect(resolver(p.despues).resultado).toBe(r.resultado)
    }
  })
})

describe('quitar paréntesis', () => {
  it('cambia todos los signos cuando delante hay un menos', () => {
    const r = resolver('(-33) - (28 - 45 + 49)', 'quitar')
    expect(r.inicial).toBe('−33 − (28 − 45 + 49)')
    expect(r.pasos[0].despues).toBe('−33 − 28 + 45 − 49')
    expect(r.resultado).toBe(-65)
  })

  it('junta primero los signos seguidos y quita los paréntesis de dentro afuera', () => {
    const r = resolver('120 - (16 - 5) - [38 - (-6)]', 'quitar')
    expect(r.pasos.map((p) => p.despues)).toEqual(['120 − (16 − 5) − [38 + 6]', '120 − 16 + 5 − [38 + 6]', '120 − 16 + 5 − 38 − 6', '65'])
  })

  it('da lo mismo que operando dentro de los paréntesis, en todos los ejercicios de sumas', () => {
    const operaciones = ['(-12) + (-5) - (-7) + (-10)', '(-3) - (-7) + (-9) - (-8) - (+25) - (-34)', '-40 - (-20 - 33 + 15) - (-80) + (13 - 91)', '25 + (41 - 25) - [16 - (-25) - 4]']
    for (const op of operaciones) {
      const r = resolver(op, 'quitar')
      expect(r.resultado).toBe(resolver(op).resultado)
      for (const p of r.pasos) expect(resolver(p.despues).resultado).toBe(r.resultado)
    }
  })
})

describe('elegir el orden a mano', () => {
  it('explica por qué una operación todavía no toca', () => {
    const raiz = analizar('2 + 3*(4 - 1)')
    if (raiz.t !== 'bin' || raiz.b.t !== 'bin') throw new Error('árbol inesperado')
    expect(motivo(raiz)).toContain('paréntesis')
    expect(motivo(raiz.b)).toContain('paréntesis')
    const tras = aplicar(raiz, siguiente(raiz)!).raiz
    expect(escribir(tras)).toBe('2 + 3 · 3')
    if (tras.t !== 'bin') throw new Error('árbol inesperado')
    expect(motivo(tras)).toContain('multiplicaciones')
    expect(motivo(tras.b)).toBeNull()
  })

  it('siguiendo siempre la operación sugerida se llega al resultado', () => {
    let raiz = analizar('3*{2*[4 - 2*(5 - 7)] + 3*(1 - 2*5)}')
    for (let n = siguiente(raiz); n; n = siguiente(raiz)) raiz = aplicar(raiz, n).raiz
    expect(escribir(raiz)).toBe('−33')
  })
})

describe('ejercicios', () => {
  const todas = { reglas: REGLAS, mcd: MCD, mcm: MCM, enteros: ENTEROS, sumas: SUMAS, productos: PRODUCTOS, combinadas: COMBINADAS }

  it('no repiten identificador y todos tienen respuesta y pistas', () => {
    const ids = Object.values(IDS).flat()
    expect(new Set(ids).size).toBe(ids.length)
    for (const q of Object.values(todas).flat()) {
      expect(q.id).toMatch(/^\w+:\w+/)
      expect(q.pistas.length).toBeGreaterThan(0)
      if (q.entrada === 'numero') expect(q.correcta).toMatch(/^-?\d+$/)
    }
  })

  it('los generadores producen ejercicios válidos', () => {
    for (let i = 0; i < 300; i++) {
      for (const nueva of [nuevaReglas, nuevaMcd, nuevaMcm, nuevaEnteros, nuevaSumas, nuevaProductos, nuevaCombinadas]) {
        const q = nueva()
        expect(q.id).toBe('')
        expect(typeof q.correcta).toBe('string')
      }
    }
  })

  it('respuestas conocidas de las hojas', () => {
    const resp = (lista: typeof REGLAS, id: string) => lista.find((q) => q.id === id)?.correcta
    expect(resp(REGLAS, 'reglas:A5c')).toBe('11')
    expect(resp(REGLAS, 'reglas:A5d')).toBe('2|5|10|11')
    expect(resp(REGLAS, 'reglas:B4a')).toBe('3|6|9')
    expect(resp(REGLAS, 'reglas:B4c')).toBe('1')
    expect(resp(MCD, 'mcd:A10d')).toBe('2')
    expect(resp(MCD, 'mcd:P1')).toBe('6')
    expect(resp(MCM, 'mcm:P1')).toBe('36')
    expect(resp(MCM, 'mcm:P3')).toBe('1800')
    expect(resp(ENTEROS, 'enteros:A13')).toBe('−500|−499|−39|−38|10|22|37')
    expect(resp(SUMAS, 'sumas:A17d')).toBe('-65')
    expect(resp(PRODUCTOS, 'productos:A18d')).toBe('-35')
    expect(resp(COMBINADAS, 'combinadas:A19a')).toBe('25')
    expect(resp(COMBINADAS, 'combinadas:A20a')).toBe('-156')
  })
})

describe('bancos de las pruebas', () => {
  it('cada parada tiene preguntas de clase y un generador que funciona', () => {
    expect(Object.keys(BANCOS)).toHaveLength(8)
    for (const banco of Object.values(BANCOS)) {
      expect(banco.clase.length).toBeGreaterThanOrEqual(4)
      for (const q of [...banco.clase, ...Array.from({ length: 50 }, banco.generar)]) {
        expect(typeof q.correcta).toBe('string')
        expect(q.pistas.length).toBeGreaterThan(0)
      }
    }
  })

  it('la descomposición se responde con los factores de menor a mayor', () => {
    expect(BANCOS.descomposicion.clase.find((q) => typeof q.entrada === 'object' && 'primos' in q.entrada)?.correcta).toBe('2|2|2|2|19')
  })
})

describe('mcd, mcm y criterios', () => {
  it('ejemplos del libro y de la hoja', () => {
    expect(mcd([12, 18])).toBe(6)
    expect(mcm([30, 45])).toBe(90)
    expect(mcd([256, 96])).toBe(32)
    expect(mcm([18, 15, 8])).toBe(360)
    expect(mcd([35, 48])).toBe(1)
    expect(comunes([24, 60], 'mcd').map((c) => c.elegido)).toEqual([2, 1, 0])
  })

  it('m.c.d. · m.c.m. = a · b para dos números', () => {
    for (let a = 2; a < 60; a++) for (let b = 2; b < 60; b++) expect(mcd([a, b]) * mcm([a, b])).toBe(a * b)
  })

  it('los criterios nunca contradicen a la división', () => {
    for (let n = 2; n <= 5000; n++) for (const d of CRITERIOS) expect(criterio(n, d).divide).toBe(n % d === 0)
  })
})
