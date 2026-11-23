import { describe, expect, it } from 'vitest'
import { esCorrecta } from '../componentes/Respuesta'
import { calcularFr } from '../lib/exprFr'
import {
  aCientifica,
  clavePot,
  cuadradoSiguiente,
  leerPot,
  mismaPotencia,
  operarCientifica,
  potencia,
  primosDe,
  raizEntera,
  signoPotencia,
  sumarCientifica,
  todasLasCifras,
  unicaPotencia,
} from '../lib/potencias'
import { fr } from '../lib/fracciones'
import { BANCOS3, COMBINADAS_HOJA, IDS3, NEGATIVOS, PROPIEDADES, CIENTIFICA, RAICES, SIGNO } from './tema3'

const clave = (e: string) => clavePot(unicaPotencia(e).pot)
const sol = (banco: { id: string; correcta: string }[], etq: string) => banco.find((x) => x.id.endsWith(`-${etq}`))!.correcta

describe('potencias: valor y signo', () => {
  it('la hoja: ejercicio 3', () => {
    expect([[3, 5], [-4, 3], [5, 3], [-1, 7], [2, 10], [-12, 2], [3, 4], [-10, 4]].map(([b, e]) => potencia(fr(b), e).n)).toEqual([243, -64, 125, -1, 1024, 144, 81, 10000])
  })
  it('signo: base negativa con exponente impar es negativo', () => {
    expect(signoPotencia(-2, 3)).toBe(-1)
    expect(signoPotencia(-6, 10)).toBe(1)
    expect(signoPotencia(5, 3)).toBe(1)
  })
  it('(−2)⁶ y −2⁶ no son lo mismo', () => {
    expect(calcularFr('(-2)^6')).toEqual(fr(64))
    expect(calcularFr('-2^6')).toEqual(fr(-64))
  })
  it('exponente cero y negativo', () => {
    expect(potencia(fr(4), -3)).toEqual(fr(1, 64))
    expect(potencia(fr(-3), -1)).toEqual(fr(-1, 3))
    expect(potencia(fr(-2), -2)).toEqual(fr(1, 4))
    expect(potencia(fr(5), 0)).toEqual(fr(1))
    expect(potencia(fr(-3), -7)).toEqual(fr(-1, 2187))
  })
})

describe('propiedades de las potencias', () => {
  it('ejercicio 8: una única potencia', () => {
    expect(['2^4*2^2*2', '(-4)^7*(-4)^5', 'a^4*a^3*a^5', '(-2)^6*(-2)', '2^10:2^3', '(-2)^8:(-2)', '4^10:4^6', '(-3)^10:(-3)^10', '((-2)^3)^5', '(2^3)^3', '((-3)^5)^4', '((-5)^2)^5'].map(clave)).toEqual([
      '2^7',
      '-4^12',
      'a^12',
      '-2^7',
      '2^7',
      '-2^7',
      '4^4',
      '-3^0',
      '-2^15',
      '2^9',
      '-3^20',
      '-5^10',
    ])
  })
  it('ejercicio 9 y mismo exponente (13)', () => {
    expect(clave('(2^4*2^3*2^7)/(2^5*2^6)')).toBe('2^3')
    expect(clave('(x^3*(x^4)^2)/(x^6*x*x^2)')).toBe('x^2')
    expect(['2^4*5^4*3^4', '(-15)^9:(-3)^9', '25^2:5^2', '(-3)^6*(-2)^6*(-4)^6'].map(clave)).toEqual(['30^4', '5^9', '5^2', '-24^6'])
  })
  it('exponentes negativos (16 y 17c)', () => {
    expect(['5^-2*5^0*5^5', '(-1)^-3*(-1)^2*(-1)', '2^3*2^-5*2^4', '2^-2*2^0', '(2^3*2^-5*2^4)/(2^-2*2^0)'].map(clave)).toEqual(['5^3', '-1^0', '2^2', '2^-2', '2^4'])
  })
  it('una respuesta vale si tiene el mismo exponente y el mismo valor', () => {
    expect(mismaPotencia(leerPot('24^6')!, leerPot('-24^6')!)).toBe(true)
    expect(mismaPotencia(leerPot('-2^7')!, leerPot('2^7')!)).toBe(false)
    expect(mismaPotencia(leerPot('(-2)^7')!, leerPot('-2^7')!)).toBe(true)
    expect(mismaPotencia(leerPot('8^3')!, leerPot('2^9')!)).toBe(false)
    expect(mismaPotencia(leerPot('7^0')!, leerPot('-3^0')!)).toBe(true)
  })
  it('factores primos y el 12', () => {
    expect([...primosDe('6^2*3^3*12^2')]).toEqual([
      [2, 6],
      [3, 7],
    ])
    expect([...primosDe('(32*25*72)/(90*128)')]).toEqual([[5, 1]])
    expect(sol(PROPIEDADES, '12b')).toBe('1/2')
  })
})

describe('notación científica', () => {
  it('pasar a notación científica sin perder cifras', () => {
    expect(['820.000', '690.000.000', '76.000', '0,000000826', '0,0000000071', '0,00045'].map((s) => aCientifica(s))).toEqual([
      { m: 8.2, e: 5 },
      { m: 6.9, e: 8 },
      { m: 7.6, e: 4 },
      { m: 8.26, e: -7 },
      { m: 7.1, e: -9 },
      { m: 4.5, e: -4 },
    ])
    expect(aCientifica('54 900 000 000')).toEqual({ m: 5.49, e: 10 })
  })
  it('con todas sus cifras', () => {
    expect(todasLasCifras({ m: 4, e: 7 })).toBe('40 000 000')
    expect(todasLasCifras({ m: 8.5, e: -6 })).toBe('0,0000085')
    expect(todasLasCifras({ m: 9.73, e: 8 })).toBe('973 000 000')
  })
  it('operaciones de la hoja', () => {
    expect(operarCientifica({ m: 8, e: 11 }, ':', { m: 5, e: 3 }).r).toEqual({ m: 1.6, e: 8 })
    expect(operarCientifica({ m: 8.5, e: -6 }, ':', { m: 2, e: 4 }).r).toEqual({ m: 4.25, e: -10 })
    expect(operarCientifica({ m: 5, e: -7 }, '·', { m: 8, e: -9 }).r).toEqual({ m: 4, e: -15 })
    expect(sumarCientifica({ m: 3.6, e: 12 }, '−', { m: 4, e: 11 }).r).toEqual({ m: 3.2, e: 12 })
    expect(sumarCientifica({ m: 5, e: 9 }, '+', { m: 8.1, e: 10 }).r).toEqual({ m: 8.6, e: 10 })
    expect(sumarCientifica({ m: 5.32, e: -4 }, '+', { m: 8, e: -6 }).r).toEqual({ m: 5.4, e: -4 })
    expect(sol(CIENTIFICA, '45')).toBe('4|25')
    expect(sol(CIENTIFICA, '5b')).toBe('1.5|19')
    expect(sol(CIENTIFICA, '24d')).toBe('-5.9|-3')
  })
  it('el ejercicio 44 ordena bien los planetas', () => {
    expect(sol(CIENTIFICA, '44b')).toBe('Mercurio|Marte|Venus|Tierra|Saturno|Júpiter')
  })
})

describe('raíces', () => {
  it('raíz entera y resto (32)', () => {
    expect([98, 229, 500, 1526, 78956].map(raizEntera)).toEqual([
      { r: 9, resto: 17 },
      { r: 15, resto: 4 },
      { r: 22, resto: 16 },
      { r: 39, resto: 5 },
      { r: 280, resto: 556 },
    ])
  })
  it('baldosas y árboles (42 y 43)', () => {
    expect(raizEntera(77)).toEqual({ r: 8, resto: 13 })
    expect(cuadradoSiguiente(77)).toEqual({ lado: 9, faltan: 4 })
    expect(cuadradoSiguiente(195)).toEqual({ lado: 14, faltan: 1 })
    expect(sol(RAICES, '43')).toBe('13|26|1')
  })
  it('cuadrados perfectos y raíces de fracciones', () => {
    expect(sol(RAICES, '28')).toBe('10 000|64|144|256|900')
    expect([sol(RAICES, '34a'), sol(RAICES, '34b'), sol(RAICES, '34c')]).toEqual(['13/12', '1/27', '15/7'])
    expect(sol(RAICES, '12')).toBe('2|140')
  })
})

describe('combinadas con potencias y raíces (36 y 37)', () => {
  it('dan lo que tiene que dar', () => {
    const r = Object.fromEntries(COMBINADAS_HOJA.map(([etq, e]) => [etq, calcularFr(e)]))
    expect(r['36a']).toEqual(fr(38))
    expect(r['36c']).toEqual(fr(19, 30))
    expect(r['36f']).toEqual(fr(1, 2))
    expect(r['37a']).toEqual(fr(-2))
    expect(r['37b']).toEqual(fr(-15, 16))
    expect(r['37c']).toEqual(fr(-3, 4))
  })
  it('raíz de un negativo o no exacta: avisa', () => {
    expect(() => calcularFr('√(2/3)')).toThrow()
    expect(() => calcularFr('√(0-4)')).toThrow()
  })
})

describe('bancos de preguntas', () => {
  it('ids únicos y cada respuesta correcta se da por buena', () => {
    const todas = Object.values(BANCOS3).flatMap((b) => b.clase)
    expect(new Set(todas.map((x) => x.id)).size).toBe(todas.length)
    for (const x of todas) expect(esCorrecta(x, x.correcta), `${x.id} ${x.correcta}`).toBe(true)
    for (const [k, ids] of Object.entries(IDS3)) expect(ids.length, k).toBeGreaterThanOrEqual(8)
    expect(SIGNO.length + PROPIEDADES.length + NEGATIVOS.length + CIENTIFICA.length + RAICES.length).toBeGreaterThan(150)
  })
  it('los generadores dan preguntas válidas', () => {
    for (const b of Object.values(BANCOS3))
      for (let i = 0; i < 150; i++) {
        const x = b.generar()
        expect(x.id).toBe('')
        expect(esCorrecta(x, x.correcta), `${x.correcta}`).toBe(true)
      }
  })
})
