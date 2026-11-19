import { describe, expect, it } from 'vitest'
import { PREGUNTAS_PROBA } from '../../pezas'
import { errorOlvidaLlevada, errorSinLlevar, llevadas, opcionesFalsas, opcionesFalsasOp, pasosResta, pasosSuma, pruebaResta, resolver, resultadoPasos, conPunto } from '../../../lib/restas'
import { COMPRUEBA_HOJA, COMPRUEBA_MAS, PROBLEMAS, RESTAS_CUATRO, RESTAS_ENTERAS, RESTAS_HOJA, RESTAS_TRES } from './datos'
import { problemaGuiado } from './paradas'
import { BANCOS, PARADAS, PREGUNTAS_EXAME, xerarExame } from './Unidade'

const TODAS = [...RESTAS_HOJA, ...RESTAS_TRES, ...RESTAS_CUATRO, ...RESTAS_ENTERAS]

describe('restar con llevadas (método de la libreta)', () => {
  it('cada paso: pongo un 1 delante y me llevo una', () => {
    const p = pasosResta(396, 248)
    expect(p[0]).toMatchObject({ arriba: 6, quito: 8, pide: true, arribaFinal: 16, cifra: 8 })
    expect(p[1]).toMatchObject({ arriba: 9, abajo: 4, llevada: 1, quito: 5, pide: false, cifra: 4 })
    expect(p[2]).toMatchObject({ arriba: 3, quito: 2, cifra: 1 })
  })
  it('el método da lo mismo que restar en todas las restas de la unidad', () => {
    for (const [a, b] of TODAS) expect(resultadoPasos(pasosResta(a, b)), `${a} − ${b}`).toBe(a - b)
    for (const [a, b] of [...COMPRUEBA_HOJA, ...COMPRUEBA_MAS]) expect(resultadoPasos(pasosResta(a, b))).toBe(a - b)
  })
  it('la hoja de restas con llevadas', () => {
    expect(RESTAS_HOJA.map(([a, b]) => a - b)).toEqual([47986, 80434, 41619, 51125, 48597, 6698, 4229, 9403, 51715, 21418, 16883, 26076, 51662, 11168, 15521, 79043])
    expect(llevadas(95002, 14568)).toBe(3)
    expect(pasosResta(13025, 8796).map((p) => p.cifra)).toEqual([9, 2, 2, 4, 0])
  })
  it('todas las restas de práctica llevan alguna llevada (salvo las de miles enteros)', () => {
    for (const [a, b] of [...RESTAS_HOJA, ...RESTAS_TRES, ...RESTAS_CUATRO]) expect(llevadas(a, b), `${a} − ${b}`).toBeGreaterThan(0)
    for (const [a, b] of RESTAS_ENTERAS) expect(llevadas(a, b), `${a} − ${b}`).toBe(0)
    expect(7352 - 7000).toBe(352)
  })
  it('errores típicos', () => {
    expect(errorSinLlevar(396, 248)).toBe(152)
    expect(errorOlvidaLlevada(396, 248)).toBe(158)
    for (const [a, b] of TODAS) {
      const f = opcionesFalsas(a, b)
      expect(f, `${a} − ${b}`).not.toContain(a - b)
      expect(f.length).toBe(3)
    }
  })
  it('la suma en columna', () => {
    expect(pasosSuma(1687, 2725).map((p) => p.cifra)).toEqual([2, 1, 4, 4])
    expect(pasosSuma(148, 248).map((p) => p.meLlevo)).toEqual([1, 0, 0])
    expect(opcionesFalsasOp(1687, '+', 2725)).not.toContain(4412)
  })
  it('números con punto de miles', () => {
    expect(conPunto(1687)).toBe('1.687')
    expect(conPunto(352)).toBe('352')
    expect(conPunto(47986)).toBe('47.986')
  })
})

describe('la prueba de la resta', () => {
  it('las dos hojas «Comprueba si…»: las mismas marcas que en la libreta', () => {
    expect(COMPRUEBA_HOJA.map(([a, b, r]) => pruebaResta(a, b, r))).toEqual([true, false, false, true, false, true, false, true])
  })
  it('hay restas bien y mal en las inventadas', () => {
    const marcas = COMPRUEBA_MAS.map(([a, b, r]) => pruebaResta(a, b, r))
    expect(marcas.filter(Boolean).length).toBeGreaterThan(2)
    expect(marcas.filter((x) => !x).length).toBeGreaterThan(2)
  })
})

describe('problemas de dos pasos', () => {
  it('los cuatro de la hoja', () => {
    const sol = (id: string) => resolver(PROBLEMAS.find((p) => p.id === id)!.ops).map((x) => x.r)
    expect(sol('quiosco')).toEqual([80, 46])
    expect(sol('tren')).toEqual([195, 241])
    expect(sol('miguel')).toEqual([4412, 3437])
    expect(sol('paula')).toEqual([193, 238, 223])
  })
  it('todos se pueden resolver, con una frase y un significado por cuenta', () => {
    for (const p of PROBLEMAS) {
      expect(p.queda.length, p.id).toBe(p.ops.length)
      expect(p.solucion, p.id).toContain('#')
      const g = problemaGuiado(p)
      for (const paso of g.pasos) if (paso.tipo === 'elige') expect(paso.otras, `${p.id} ${paso.titulo}`).not.toContain(paso.correcta)
    }
  })
})

describe('preguntas', () => {
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
    expect(PREGUNTAS_EXAME).toBe(18)
    expect(xerarExame()).toHaveLength(18)
  })
})
