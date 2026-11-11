import { describe, expect, it } from 'vitest'
import { PREGUNTAS_PROBA } from '../../primaria/pezas'
import { RHO_COBRE, carga, cargaDeElectrones, intensidad, num, ohm, pilas, repartir, req, resistenciaHilo, simplificar, type Circuito } from '../../lib/electricidad'
import { CIRCUITOS, GUIADOS, OHM } from './paradas'
import { BANCOS, PARADAS, PREGUNTAS_EXAME, xerarExame } from './Unidade'

const cerca = (a: number, b: number, tol = 0.005) => expect(Math.abs(a - b), `${a} ≈ ${b}`).toBeLessThanOrEqual(tol * Math.max(1, Math.abs(b)))
const de = (n: string) => CIRCUITOS.find((c) => c.n === n)!.c

describe('carga e intensidad (ejercicios 2, 3 y 14 a 17)', () => {
  it('las cuentas', () => {
    expect(carga(2, 120)).toBe(240)
    expect(intensidad(1000, 25)).toBe(40)
    expect(intensidad(10, 4)).toBe(2.5)
    expect(carga(5, 2)).toBe(10)
    expect(cargaDeElectrones(6.24e18)).toBe(1)
    expect(intensidad(cargaDeElectrones(12.48e18), 1)).toBe(2)
    expect(carga(0.5, 5)).toBe(2.5)
  })
})

describe('ley de Ohm', () => {
  it('las soluciones de la hoja que están bien', () => {
    expect(ohm('I', { V: 30, R: 10 })).toBe(3)
    expect(ohm('R', { V: 230, I: 5 })).toBe(46)
    expect(ohm('I', { V: 50, R: 500 })).toBe(0.1)
    expect(ohm('V', { R: 93, I: 2.5 })).toBe(232.5)
    expect(num(ohm('R', { V: 100, I: 5.5 }))).toBe('18,18')
    expect(num(ohm('I', { V: 8.2, R: 3 }))).toBe('2,73')
  })
  it('las soluciones de la hoja que están mal', () => {
    const conHoja = OHM.filter((p) => p.hoja)
    expect(conHoja.map((p) => `${num(ohm(p.busca, p.d))}`)).toEqual(['0,3', '0,33', '0,0333', '18', '5', '400', '0,2', '0,33', '3,33'])
  })
})

describe('resistencia de un hilo (ejercicio 4)', () => {
  it('cobre de 2 m y 2 mm, de 20 m y 2 mm, y de 2 m y 20 mm', () => {
    cerca(resistenciaHilo(RHO_COBRE, 2, 2), 0.010695)
    cerca(resistenciaHilo(RHO_COBRE, 20, 2), 0.10695)
    cerca(resistenciaHilo(RHO_COBRE, 2, 20), 0.00010695)
    expect(num(resistenciaHilo(RHO_COBRE, 2, 2))).toBe('0,0107')
  })
})

describe('asociación de resistencias', () => {
  it('ejercicios 8, 9 y 11', () => {
    expect(req(de('Ejercicio 8'))).toBe(18)
    cerca(req(de('Ejercicio 9')), 12.652)
    expect(req(de('Ejercicio 11'))).toBe(40)
    expect(12 / req(de('Ejercicio 11'))).toBe(0.3)
  })
  it('ejercicio 21', () => {
    expect(['a', 'b', 'c', 'd', 'e', 'f'].map((l) => num(req(de(`Ejercicio 21 ${l}`))))).toEqual(['15', '3,5', '4', '7,33', '10', '10,33'])
  })
  it('ejercicio 10: reparto en paralelo', () => {
    const c: Circuito = { paralelo: [{ nombre: 'R1', r: 6 }, { nombre: 'R2', r: 3 }] }
    expect(req(c)).toBe(2)
    expect(repartir(c, 12)).toEqual([
      { nombre: 'R1', r: 6, I: 2, V: 12 },
      { nombre: 'R2', r: 3, I: 4, V: 12 },
    ])
  })
  it('simplificar paso a paso acaba en la equivalente', () => {
    for (const p of CIRCUITOS) {
      const pasos = simplificar(p.c)
      const ultimo = pasos[pasos.length - 1]
      expect(ultimo.nueva.nombre).toBe('Req')
      cerca(ultimo.nueva.r, req(p.c))
    }
    expect(simplificar(de('Ejercicio 8'))[0].cuenta).toBe('R2 y R3 en paralelo: 1/Ra = 1/4 + 1/12 → Ra = 3 Ω')
  })
  it('en serie las tensiones suman la del generador; en paralelo, las intensidades suman la total', () => {
    const s: Circuito = { serie: [{ nombre: 'R1', r: 2 }, { nombre: 'R2', r: 4 }] }
    const rs = repartir(s, 12)
    expect(rs.map((x) => x.I)).toEqual([2, 2])
    expect(rs.reduce((t, x) => t + x.V, 0)).toBe(12)
    const p: Circuito = { paralelo: [{ nombre: 'R1', r: 10 }, { nombre: 'R2', r: 15 }, { nombre: 'R3', r: 30 }] }
    cerca(
      repartir(p, 30).reduce((t, x) => t + x.I, 0),
      30 / req(p),
    )
  })
  it('pilas', () => {
    expect(pilas(3, 1.5, 'serie')).toBe(4.5)
    expect(pilas(3, 1.5, 'paralelo')).toBe(1.5)
  })
})

describe('preguntas y problemas guiados', () => {
  it('cada problema guiado acaba en su resultado', () => {
    for (const g of [...GUIADOS.CARGA_GUIADOS, ...GUIADOS.OHM_GUIADOS, ...GUIADOS.HILO_GUIADOS, ...GUIADOS.CIRCUITO_GUIADOS, GUIADOS.EJ10]) {
      for (const p of g.pasos) if (p.tipo === 'elige') expect(p.otras, p.titulo).not.toContain(p.correcta)
      for (const p of g.pasos) if (p.tipo === 'numero') expect(Number.isFinite(p.valor), p.titulo).toBe(true)
    }
  })
  it('bancos completos y una sola respuesta buena', () => {
    expect(Object.keys(BANCOS).sort()).toEqual(PARADAS.map((p) => p.id).sort())
    for (const [id, banco] of Object.entries(BANCOS)) {
      expect(banco.length, id).toBeGreaterThanOrEqual(PREGUNTAS_PROBA + 4)
      for (const p of banco) {
        if (p.tipo !== 'elixe') continue
        expect(p.outras.length, `${id} ${p.correcta}`).toBeGreaterThan(0)
        expect(p.outras, `${id} ${p.correcta}`).not.toContain(p.correcta)
        expect(new Set(p.outras).size, `${id} ${p.correcta}`).toBe(p.outras.length)
      }
    }
    expect(xerarExame()).toHaveLength(PREGUNTAS_EXAME)
  })
})
