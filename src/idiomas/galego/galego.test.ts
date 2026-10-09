import { describe, expect, it } from 'vitest'
import { ondeTil, ponTil, senTil, trocear } from '../../lib/til'
import { FRASES_OGALEGO, PALABRAS_OGALEGO } from './ogalego'
import { DIAS, PARES } from './acentos'

describe('til', () => {
  it('pon, quita e atopa o til', () => {
    expect(senTil('Ás bágoas')).toBe('As bagoas')
    expect(ponTil('bagoa', 1)).toBe('bágoa')
    expect(ponTil('bágoa', -1)).toBe('bagoa')
    expect(ondeTil('baúl')).toBe(2)
    expect(senTil('bilingüe')).toBe('bilingüe')
  })
  it('trocea frases en palabras', () => {
    const t = trocear('Dálle as grazas, Brais.')
    expect(t.filter((x) => x.palabra).map((x) => x.texto)).toEqual(['Dálle', 'as', 'grazas', 'Brais'])
  })
})

describe('datos de galego', () => {
  it('168 palabras e 34 frases de ogalego.gal', () => {
    expect(PALABRAS_OGALEGO).toHaveLength(168)
    expect(FRASES_OGALEGO).toHaveLength(34)
    expect(PALABRAS_OGALEGO).toContain('túnel')
    expect(PALABRAS_OGALEGO).not.toContain('illó')
  })
  it('cada palabra leva como moito un til e as dobres comparten base', () => {
    for (const p of PALABRAS_OGALEGO) {
      const fs = p.split('/')
      for (const f of fs) expect([...f].filter((c) => 'áéíóú'.includes(c)).length, p).toBeLessThanOrEqual(1)
      expect(new Set(fs.map(senTil)).size, p).toBe(1)
    }
  })
  it('os 28 diacríticos da profesora, en tres días', () => {
    expect(PARES).toHaveLength(28)
    expect(DIAS.map((d) => d.length)).toEqual([10, 9, 9])
    for (const p of PARES) {
      expect(senTil(p.con), p.con).toBe(p.sen)
      expect(p.fraseCon).toContain('__')
      expect(p.fraseSen).toContain('__')
    }
  })
})
