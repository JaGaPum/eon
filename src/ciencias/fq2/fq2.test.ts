import { describe, expect, it } from 'vitest'
import { PREGUNTAS_PROBA } from '../../primaria/pezas'
import { cumpleLey, queSustancias } from '../../lib/fisica'
import { ELEMENTOS, atomos, clase, describe as describir, elemento, estadoDisolucion, mezclar, papeles, posicion, simboloBienEscrito, simbolosMal, totalAtomos } from '../../lib/materia'
import { ACT14, ACT15, ACT17, ACT27, AIRE, ALCOHOL_YODADO, DIBUJOS_67, EJEMPLO2, TABLAS_GASES } from './datos'
import { PREGUNTAS_FQ2 } from './paradas'
import { PREGUNTAS_GLOBAL } from './Global'

describe('leyes de los gases', () => {
  it('los ejemplos y actividades del libro', () => {
    expect(EJEMPLO2).toEqual({ T1: 333, T2: 666, T2C: 393, T3: 1332, T3C: 1059 })
    expect(ACT14.p2).toBe(2)
    expect(ACT15.p2).toBeCloseTo(4.273, 3)
  })
  it('las tablas cumplen su ley', () => {
    expect(cumpleLey('T', TABLAS_GASES.T)).toBe(true)
    expect(cumpleLey('V', TABLAS_GASES.V)).toBe(true)
    expect(cumpleLey('p', TABLAS_GASES.p)).toBe(true)
    expect(cumpleLey('V', TABLAS_GASES.T)).toBe(false)
  })
})

describe('cambios de estado', () => {
  it('actividad 27', () => {
    expect(ACT27.map(([e, T]) => queSustancias(e, T))).toEqual([['oxígeno'], ['hierro', 'diamante'], ['aluminio'], ['alcohol'], ['mercurio', 'agua'], ['hierro']])
  })
})

describe('materia', () => {
  it('fórmulas', () => {
    expect(atomos('C2H6O')).toEqual({ C: 2, H: 6, O: 1 })
    expect(totalAtomos('C2H6O')).toBe(9)
    expect(clase('O3')).toBe('sustancia simple')
    expect(clase('NaCl')).toBe('compuesto')
    expect(() => atomos('Xx2')).toThrow()
  })
  it('actividad 17: cada descripción tiene un solo dibujo', () => {
    const sol = ACT17.map(([, cumple]) => ['A', 'B', 'C', 'D'].filter((k) => cumple(DIBUJOS_67[k], clase(DIBUJOS_67[k].formulas[0]))))
    expect(sol).toEqual([['C'], ['B'], ['D'], ['A']])
    expect(describir(DIBUJOS_67['ejemplo c'])).toBe('Mezcla de O₂ y NCl₃')
    expect(describir(DIBUJOS_67['ejemplo b'])).toBe('Compuesto molecular (NCl₃)')
  })
  it('disoluciones', () => {
    const y = mezclar(ALCOHOL_YODADO)
    expect(y.map((c) => [c.nombre, c.porcentaje])).toEqual([['alcohol', 68.6], ['agua', 29.4], ['yodo', 2]])
    expect(papeles(y).disolvente.nombre).toBe('alcohol')
    expect(papeles(AIRE).disolvente.nombre).toBe('nitrógeno')
    expect(estadoDisolucion(AIRE)).toBe('gas')
  })
})

describe('tabla periódica', () => {
  it('periodo y grupo calculados a partir del número atómico', () => {
    const esperado: Record<string, [number, number | null]> = {
      H: [1, 1], He: [1, 18], Li: [2, 1], B: [2, 13], Ne: [2, 18], Na: [3, 1], Al: [3, 13], Cl: [3, 17], K: [4, 1], Ti: [4, 4], Fe: [4, 8], Zn: [4, 12], Kr: [4, 18],
      Pd: [5, 10], Ag: [5, 11], Sn: [5, 14], Xe: [5, 18], W: [6, 6], Pt: [6, 10], Au: [6, 11], Hg: [6, 12], Pb: [6, 14], Rn: [6, 18], U: [7, null],
    }
    for (const [s, [p, g]] of Object.entries(esperado)) expect(posicion(elemento(s).z), s).toEqual({ periodo: p, grupo: g })
    expect(posicion(118)).toEqual({ periodo: 7, grupo: 18 })
    expect(posicion(72)).toEqual({ periodo: 6, grupo: 4 })
  })
  it('símbolos', () => {
    for (const e of ELEMENTOS) expect(simboloBienEscrito(e.simbolo), e.simbolo).toBe(true)
    expect(simbolosMal('Cu')).toEqual(['CU', 'cu', 'cU'])
    expect(new Set(ELEMENTOS.map((e) => e.simbolo)).size).toBe(ELEMENTOS.length)
  })
})

describe('bancos de preguntas', () => {
  it('completos y sin respuestas repetidas', () => {
    for (const [id, banco] of Object.entries(PREGUNTAS_FQ2)) {
      expect(banco.length, id).toBeGreaterThanOrEqual(PREGUNTAS_PROBA + 8)
      for (const p of banco) {
        if (p.tipo === 'elixe') {
          expect(p.outras.length, `${id} ${p.correcta}`).toBeGreaterThan(0)
          expect(p.outras, `${id} ${p.correcta}`).not.toContain(p.correcta)
          expect(new Set(p.outras).size, `${id} ${p.correcta}`).toBe(p.outras.length)
        }
        if (p.tipo === 'numero') expect(Number.isFinite(p.valor), id).toBe(true)
      }
    }
    expect(PREGUNTAS_GLOBAL).toBe(36)
  })
})
