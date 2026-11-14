import { describe, expect, it } from 'vitest'
import { PREGUNTAS_PROBA } from '../pezas'
import { derivadoEiro, digrafos, diminutivoK, huecoK, huecosK, tieneSonK } from '../../lib/ortografia'
import { grupos, separar, silabas, tonica } from '../../lib/silabas'
import { ACURTADAS, ARBORES, INTRUSAS, PALABRAS_K, PALABRAS_SILABAS, SEN_K } from './datos'
import { BANCOS, PARADAS, PREGUNTAS_EXAME, xerarExame } from './Unidade'

const tonicaDe = (w: string) => {
  const ss = silabas(w)
  return ss[ss.length - 1 - tonica(w)]
}

describe('o son K', () => {
  it('páxina 28: c ou qu', () => {
    expect(['áncora', 'esquío', 'cabaza', 'queixo', 'cullerón', 'raqueta'].map((w) => huecoK(w).grafia)).toEqual(['c', 'qu', 'c', 'qu', 'c', 'qu'])
    expect(huecosK('caquis').map((h) => h.grafia)).toEqual(['c', 'qu'])
    expect(huecosK('albaricoque').map((h) => h.grafia)).toEqual(['c', 'qu'])
    expect(huecosK('kiwi').map((h) => h.grafia)).toEqual(['k'])
    expect(huecosK('alcachofas').map((h) => h.grafia)).toEqual(['c'])
  })
  it('a c diante de e, i non soa K', () => {
    for (const w of ['cervo', 'fociño', 'cebola', 'cidade', 'perexil', 'horta']) expect(tieneSonK(w), w).toBe(false)
    for (const w of SEN_K) expect(tieneSonK(w), w).toBe(false)
    for (const { palabra } of PALABRAS_K) expect(tieneSonK(palabra), palabra).toBe(true)
    expect(new Set(PALABRAS_K.map((x) => x.palabra)).size).toBe(PALABRAS_K.length)
  })
  it('páxina 29: cunquiña e banqueiro', () => {
    expect(['foca', 'boneca', 'barca', 'mosca'].map(diminutivoK)).toEqual(['foquiña', 'bonequiña', 'barquiña', 'mosquiña'])
    expect(diminutivoK('cunca')).toBe('cunquiña')
    expect(['zoco', 'vaca', 'arco', 'banco'].map(derivadoEiro)).toEqual(['zoqueiro', 'vaqueiro', 'arqueiro', 'banqueiro'])
  })
  it('páxina 36: as grafías escondidas', () => {
    expect(['cubertos', 'quilogramo', 'kiwi', 'requeixo', 'cazola', 'coitelo'].map((w) => huecoK(w).grafia)).toEqual(['c', 'qu', 'k', 'qu', 'c', 'c'])
  })
})

describe('as sílabas', () => {
  it('páxina 30, actividade 1', () => {
    expect(['leituga', 'hórreo', 'froiteiro', 'receita'].map((w) => silabas(w).length)).toEqual([3, 3, 3, 3])
    expect(['elefante', 'avioneta', 'campesiño', 'científica'].map((w) => silabas(w).length)).toEqual([4, 4, 4, 4])
    expect(['bonsai', 'xouba', 'ceo', 'ponte'].map((w) => silabas(w).length)).toEqual([2, 2, 2, 2])
    expect(separar('froiteiro')).toBe('froi-tei-ro')
  })
  it('páxina 30, actividade 2: ditongos', () => {
    const ditongo = (w: string) => grupos(w).some((g) => g.tipo === 'diptongo')
    expect(['leituga', 'froiteiro', 'receita', 'avioneta', 'científica', 'xouba'].every(ditongo)).toBe(true)
    expect(['hórreo', 'ceo', 'ponte', 'elefante'].some(ditongo)).toBe(false)
  })
  it('páxina 30, actividade 3: as árbores', () => {
    for (const a of ARBORES) expect(a.pistas.map((w) => tonicaDe(w).toUpperCase()).join('')).toBe(a.arbore)
  })
  it('as fichas: monosílabas, bisílabas, trisílabas e polisílabas, e a tónica', () => {
    expect(['sol', 'flor', 'pan', 'tren', 'luz'].every((w) => silabas(w).length === 1)).toBe(true)
    expect(['pelota', 'zapato'].map((w) => silabas(w).length)).toEqual([3, 3])
    expect(['ordenador', 'camiseta', 'elefante', 'chocolate'].map(tonicaDe)).toEqual(['dor', 'se', 'fan', 'la'])
    expect(tonicaDe('pelota')).toBe('lo')
    for (const w of PALABRAS_SILABAS) expect(silabas(w).join(''), w).toBe(w)
  })
  it('páxina 31: palabras que acurtamos', () => {
    expect(ACURTADAS.map(([l, c]) => silabas(l).length - silabas(c).length)).toEqual([1, 2, 2, 2, 3])
  })
})

describe('clases de palabras e dígrafos', () => {
  it('cada grupo ten unha soa intrusa', () => {
    for (const g of INTRUSAS) expect(g.grupo.length).toBe(4)
  })
  it('páxina 34, actividade 6 B', () => {
    expect(['traballo', 'ferramentas', 'enriquecedora', 'labregas', 'nunha', 'preguntas'].map(digrafos)).toEqual([['ll'], ['rr'], ['qu'], [], ['nh'], []])
  })
})

describe('preguntas', () => {
  it('bancos completos e unha soa resposta boa', () => {
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
    expect(PREGUNTAS_EXAME).toBe(20)
    expect(xerarExame()).toHaveLength(20)
  })
})
