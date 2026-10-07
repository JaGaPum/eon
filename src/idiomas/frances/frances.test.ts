import { describe, expect, it } from 'vitest'
import { conxuga, forma, VERBOS } from './verbes'
import { corrixir } from '../../primaria/pezas'

describe('conjugación de los verbos en -er', () => {
  it('marcher sigue el modelo de la profesora', () => {
    expect(['je', 'tu', 'il', 'nous', 'vous', 'ils'].map((p) => conxuga('marcher', p as never))).toEqual([
      'je marche',
      'tu marches',
      'il marche',
      'nous marchons',
      'vous marchez',
      'ils marchent',
    ])
  })
  it('manger y nager conservan la e con nous, y solo con nous', () => {
    expect(forma('manger', 'nous')).toBe('mangeons')
    expect(forma('nager', 'nous')).toBe('nageons')
    expect(forma('manger', 'vous')).toBe('mangez')
    expect(forma('manger', 'ils')).toBe('mangent')
  })
  it('je se apostrofa delante de vocal', () => {
    expect(conxuga('écouter', 'je')).toBe("j'écoute")
    expect(conxuga('écouter', 'tu')).toBe('tu écoutes')
    expect(conxuga('téléphoner', 'je')).toBe('je téléphone')
  })
  it('todos los verbos de la ficha acaban en -er', () => {
    expect(VERBOS.every(([v]) => v.endsWith('er'))).toBe(true)
  })
})

describe('corrección de lo escrito', () => {
  it('acepta mayúsculas, espacios y apóstrofos tipográficos', () => {
    expect(corrixir('  La Cuisinière ', ['la cuisinière'])).toBe('ben')
    expect(corrixir('j’écoute', ["j'écoute"])).toBe('ben')
    expect(corrixir("Où est-ce que tu habites?", ['Où est-ce que tu habites ?'])).toBe('ben')
  })
  it('distingue el fallo de solo acentos', () => {
    expect(corrixir('la cuisiniere', ['la cuisinière'])).toBe('acentos')
    expect(corrixir("l'oeil", ["l'œil"])).toBe('acentos')
    expect(corrixir('ou', ['où'])).toBe('acentos')
  })
  it('lo demás es un fallo', () => {
    expect(corrixir('la cuisinienne', ['la cuisinière'])).toBe('mal')
    expect(corrixir('mangons', ['mangeons'])).toBe('mal')
  })
})

describe('demostrativos', () => {
  it('siguen la regla de la profesora', async () => {
    const { demostrativo } = await import('./demonstratifs')
    expect(demostrativo('un livre')).toBe('ce')
    expect(demostrativo('un ami')).toBe('cet')
    expect(demostrativo('un homme')).toBe('cet')
    expect(demostrativo('un imperméable')).toBe('cet')
    expect(demostrativo('une personne')).toBe('cette')
    expect(demostrativo('une écharpe')).toBe('cette')
    expect(demostrativo('des voitures')).toBe('ces')
  })
})
