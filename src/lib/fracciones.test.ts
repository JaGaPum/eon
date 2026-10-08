import { describe, expect, it } from 'vitest'
import { analizarFr, calcularFr, motivoFr, resolverFr, siguienteFr, validasFr } from './exprFr'
import { decimalAFr, errores, expansion, fr, generatriz, mixto, redondear, texto, tipoDe, truncar } from './fracciones'

// Operaciones de las hojas del profesor, con el resultado calculado a mano.
const HOJAS: [string, string][] = [
  ['(1/3 - 1/3·1/2) : (5/4)^2', '8/75'],
  ['2/3 - 1 + 7/4', '17/12'],
  ['3/4 · 5/3', '5/4'],
  ['3/2 : (-1/4)', '-6'],
  ['(2/5)^3', '8/125'],
  ['2/5 - 3/10 : 1/2', '-1/5'],
  ['5/4 - (3/2 + 3/2 + 3/2) · 1/3', '-1/4'],
  ['(1 - 4/5) · (1 + 4/5) + 3/10', '33/50'],
  ['(3/7 - 2) · 7/2', '-11/2'],
  ['-1/6 + 3/7 - (1 - 1/3)', '-17/42'],
  ['2 - 3/5 + (1/10 - 1)', '1/2'],
  ['(1/4 - 7/8) - (5/6 - 1/3)', '-9/8'],
  ['(3/4) : (16/25)', '75/64'],
  ['(2/3 - 1/6) - (3/4 + 5/8 - 2)', '9/8'],
  ['-(2 - 1/7) + 1 - (5/2 - 3 + 5/14)', '-5/7'],
  ['1/5 + 2/3 · (1 + 4/5) - 2/3 : 1/4', '-19/15'],
  ['1/3 - 1/4 · (5/3 : 1/2 + 2)', '-1'],
  ['3 + 2 · (7/4 · 1/3) + (9/5 : 27/10)', '29/6'],
  ['(1/5 - (1 - 2/3) · 2) : (1/3 - 1/10)', '-2'],
  ['3 - (5/√36 - 2/3) + (3/2 - 1) · (3/2 + 1)', '49/12'],
  ['-2 · (2/3 - 5/4 : 3/2) + 5/4', '19/12'],
  ['9/4 - 2 + (1/3 - 1/6) + (1 - 5/8) · (1 - 1/3)', '2/3'],
  ['2 - 1/4 · (5/9 + 1/3 - 1/2) - 4/6 · (3 - 4/3)', '19/24'],
  ['5/4 - 3/4 · (1 + 4/5)', '-1/10'],
  ['(7/8 - 1/6 : 5/3) - (5/6 - 1/3)', '11/40'],
  ['(5/16 - 35/12 : 6) - (2/6 · 1/3)', '-41/144'],
  ['(5/9 · 1/6 : 5/3) · (5/6 : 1/3)', '5/36'],
  ['(1/2)^3 - 2/5 · 3/4', '-7/40'],
  ['4/5 + 3/2 · 7/4 - 3/5 · 1/2', '25/8'],
  ['4 · 3/7 - 2/5 : (-7/4)', '68/35'],
  ['1/2 : 3 · 4/5 + 2 : (-3/4)^2', '166/45'],
  ['1/3 : 4/5 + 3/5 · (5 - 8/3)', '109/60'],
  ['[1/3 : (2 · 7/3) + 1] · (3/5)^2', '27/70'],
  ['4 - 7/2 : [3/5 · (5 - 8/3)]', '3/2'],
  ['(7/10 - 3/5 · 2) · [4 + 3/8 : (5/2 - 1)^2]', '-25/12'],
  ['3/8 + 5/6 · 12/25', '31/40'],
  ['19/36 : 5/4 - 11/20', '-23/180'],
  ['2/5 + 3/5 · (7/9 - 1/6 · 8/3)', '3/5'],
  ['4/9 · 3 - [5/8 - 1] : 3/4', '11/6'],
  ['[3/2 : (5/2 - 1)] + 3/2 : 5/4 · 5/6', '2'],
  ['2 : 15/8 · [11/6 - 4/3 · (3/2 - 2)]', '8/3'],
  ['3/6 + 5/4', '7/4'],
  ['1/7 + 1/2 - 1/15', '121/210'],
  ['10/5 + 2/10 - 6/15 - 7', '-26/5'],
  ['-2/11 - 5 + 9 + 3/2', '117/22'],
  ['15/2 · 0', '0'],
  ['(-3/2)^5', '-243/32'],
  ['2 · 7/5 · (-3/4)', '-21/10'],
  ['(-15/8) : 1/4', '-15/2'],
]

describe('operaciones combinadas con fracciones', () => {
  it.each(HOJAS)('%s = %s', (e, r) => expect(texto(calcularFr(e))).toBe(r))

  it('sigue el orden del profesor en su ejemplo', () => {
    const r = resolverFr('(1/3 - 1/3·1/2) : (5/4)^2')
    expect(r.pasos.map((p) => p.porque.split('.')[0])).toEqual(['Dentro del paréntesis', 'Dentro del paréntesis', 'Las potencias van antes que multiplicar, dividir, sumar y restar: se elevan el numerador y el denominador', 'Dividir: se multiplica «en cruz», el numerador de la primera por el denominador de la segunda, y al revés'])
  })

  it('no deja sumar antes de multiplicar, y deja los paréntesis en cualquier orden', () => {
    const n = analizarFr('(1/2 + 1/3) · 2 - (1 - 1/4)')
    expect(validasFr(n)).toHaveLength(2)
    expect(motivoFr(n, n)).toContain('al final')
    expect(siguienteFr(n)).not.toBeNull()
  })

  it('avisa de lo que no está bien escrito', () => {
    expect(() => analizarFr('(1/2)/(3/4)')).toThrow('«:»')
    expect(() => analizarFr('3/0')).toThrow()
    expect(() => analizarFr('√8')).toThrow('exacta')
  })
})

describe('decimales', () => {
  const casos: [number, number, string, string, string][] = [
    [16, 11, '1', '', '45'],
    [26, 5, '5', '2', ''],
    [7, 6, '1', '1', '6'],
    [3, 8, '0', '375', ''],
    [611, 495, '1', '2', '34'],
    [91, 75, '1', '21', '3'],
    [11, 90, '0', '1', '2'],
  ]
  it.each(casos)('%i/%i', (n, d, e, a, p) => {
    const x = expansion(n, d)
    expect([String(x.ent), x.ante, x.per]).toEqual([e, a, p])
  })
  it('clasifica', () => {
    expect(tipoDe(expansion(32, 8))).toBe('entero')
    expect(tipoDe(expansion(2, 3))).toBe('puro')
    expect(tipoDe(expansion(5, 6))).toBe('mixto')
  })
  it('fracción generatriz con la regla del libro', () => {
    expect(texto(generatriz(2, '15', '').f)).toBe('43/20')
    expect(texto(generatriz(1, '', '05').f)).toBe('104/99')
    expect(texto(generatriz(1, '0', '2').f)).toBe('46/45')
    expect(texto(generatriz(2, '5', '1').f)).toBe('113/45')
    expect(texto(generatriz(0, '77', '2').f)).toBe('139/180')
    expect(texto(generatriz(12, '', '36').f)).toBe('136/11')
    expect(texto(generatriz(1, '19', '4').f)).toBe('43/36')
    expect(texto(generatriz(6, '', '9').f)).toBe('7')
  })
})

describe('aproximaciones', () => {
  it('trunca', () => {
    expect(truncar('18,71493', 3)).toBe('18,714')
    expect(truncar('0,078041', 3)).toBe('0,078')
  })
  it('redondea y dice si es por exceso', () => {
    expect(redondear('7,3456', 2)).toMatchObject({ r: '7,35', exceso: true })
    expect(redondear('16,4321', 2)).toMatchObject({ r: '16,43', exceso: false })
    expect(redondear('6,3957', 2)).toMatchObject({ r: '6,40', exceso: true })
    expect(redondear('19,195', 2)).toMatchObject({ r: '19,20', exceso: true })
    expect(redondear('23,456', 2).r).toBe('23,46')
    expect(redondear('0,75', 0).r).toBe('1')
  })
  it('errores del ejemplo del profesor', () => {
    const { eabs, erel } = errores(decimalAFr('2,34'), decimalAFr('2,3'))
    expect(texto(eabs)).toBe('1/25')
    expect((erel.n / erel.d) * 100).toBeCloseTo(1.709, 2)
  })
  it('número mixto', () => {
    expect(mixto(fr(9, 2))).toEqual({ ent: 4, n: 1, d: 2 })
  })
})
