import { describe, expect, it } from 'vitest'
import { boyle, cadena, calentamiento, convertir, densidad, escribe, estadoA, factores, masa, mesetas, quienFundeA, quienHierveA, sustancia, tramos, volumen } from './fisica'

describe('unidades', () => {
  it('ejemplos del libro y del cuaderno', () => {
    expect(convertir(0.8, 'km', 'dm')).toBe(8000)
    expect(convertir(850, 'dg', 'hg')).toBe(0.85)
    expect(convertir(0.5, 'dam²', 'dm²')).toBe(5000)
    expect(convertir(85, 'cm²', 'm²')).toBe(0.0085)
    expect(convertir(0.5, 'm³', 'mm³')).toBe(500000000)
    expect(convertir(850, 'dam³', 'km³')).toBe(0.00085)
    expect(convertir(0.5, 'daL', 'mL')).toBe(5000)
    expect(convertir(1, 'm³', 'L')).toBe(1000)
    expect(convertir(1, 'cm³', 'mL')).toBe(1)
    expect(convertir(15, 'L/min', 'm³/h')).toBe(0.9)
    expect(convertir(82, 'km/h', 'm/s')).toBeCloseTo(22.78, 2)
    expect(convertir(100, 'cm/s', 'm/min')).toBe(60)
    expect(convertir(0.98, 'g/cm³', 'kg/m³')).toBe(980)
    expect(convertir(200, 'dm³/s', 'm³/min')).toBe(12)
    expect(convertir(15, 'L/min', 'cm³/s')).toBe(250)
  })
  it('factores de conversión', () => {
    expect(factores('km/h', 'm/s')).toEqual([
      { arriba: [1000, 'm'], abajo: [1, 'km'] },
      { arriba: [1, 'h'], abajo: [3600, 's'] },
    ])
    expect(factores('L/min', 'm³/h')).toEqual([
      { arriba: [1, 'm³'], abajo: [1000, 'L'] },
      { arriba: [60, 'min'], abajo: [1, 'h'] },
    ])
    expect(cadena(15, 'L/min', 'm³/h')).toBe('15 L/min · (1 m³ / 1 000 L) · (60 min / 1 h) = 0,9 m³/h')
    expect(escribe(1000000)).toBe('1 000 000')
    expect(escribe(0.00085, 5)).toBe('0,00085')
  })
})

describe('densidad y gases', () => {
  it('densidad', () => {
    expect(densidad(27.6, 140 - 120)).toBe(1.38)
    expect(densidad(72, 40 - 30)).toBe(7.2)
    expect(masa(1.04, 1000)).toBe(1040)
    expect(masa(1.1, 200)).toBe(220)
    expect(volumen(50, 1)).toBe(50)
  })
  it('Boyle-Mariotte', () => {
    expect(boyle(4, 3, null, 6)).toBe(2)
    expect(boyle(4, 3, 3, null)).toBe(4)
    expect(boyle(2, 3, 4, null)).toBe(1.5)
    expect(boyle(2, 2, 1.25, null)).toBe(3.2)
  })
})

describe('cambios de estado', () => {
  it('estado a cada temperatura (ejercicio 26)', () => {
    const a = sustancia('alcohol')
    expect([0, 77, 78, 79, 100, 50].map((T) => estadoA(a, T))).toEqual(['líquido', 'líquido', 'líquido y gas (hirviendo)', 'gas', 'gas', 'líquido'])
  })
  it('gráficas', () => {
    expect(mesetas([{ t: 0, T: 30 }, { t: 5, T: 55 }, { t: 10, T: 78 }, { t: 15, T: 78 }, { t: 20, T: 78 }, { t: 25, T: 100 }])).toEqual([78])
    expect(quienHierveA(78)).toBe('alcohol')
    expect(quienFundeA(-39)).toBe('mercurio')
    expect(quienFundeA(-8)).toBeUndefined()
    const agua = sustancia('agua')
    const c = calentamiento(agua, -20, 120)
    expect(mesetas(c)).toEqual([0, 100])
    expect(tramos(agua, c)).toEqual(['sólido', 'sólido + líquido', 'líquido', 'líquido + gas', 'gas'])
  })
})
