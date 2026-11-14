import { describe, expect, it } from 'vitest'
import { PREGUNTAS_PROBA } from '../../../primaria/pezas'
import { articuloDeterminado, articuloIndeterminado, pronominal, pronominalNegativo, reflexivo, sinVocales } from '../../../lib/frances'
import { CON_DIBUJO } from './debuxos'
import { MEUBLES } from './paradas'
import { BANCOS, PARADAS, PREGUNTAS_EXAME, xerarExame } from './Unite2'

describe('artículos', () => {
  it('le, la, l’, les, un, une, des', () => {
    expect(articuloDeterminado('salon', 'm')).toBe('le salon')
    expect(articuloDeterminado('cuisine', 'f')).toBe('la cuisine')
    expect(articuloDeterminado('entrée', 'f')).toBe("l'entrée")
    expect(articuloDeterminado('armoire', 'f')).toBe("l'armoire")
    expect(articuloDeterminado('toilettes', 'f', true)).toBe('les toilettes')
    expect(articuloIndeterminado('armoire', 'f')).toBe('une armoire')
    expect(articuloIndeterminado('tapis', 'm')).toBe('un tapis')
  })
  it('los huecos del bilan, ejercicio 1', () => {
    expect(sinVocales('cuisine')).toBe('c__s_n_')
    expect(sinVocales('salle de bains')).toBe('s_ll_ d_ b__ns')
    expect(sinVocales('salle à manger')).toBe('s_ll_ _ m_ng_r')
  })
  it('todos los muebles del libro tienen dibujo', () => {
    for (const m of MEUBLES) expect(CON_DIBUJO, m.fr).toContain(m.fr)
  })
})

describe('verbos pronominales (bilan, ejercicio 3, y aide-mémoire)', () => {
  it('se lever, como acheter', () => {
    expect(pronominal('se lever', 'je')).toBe('je me lève')
    expect(pronominal('se lever', 'tu')).toBe('tu te lèves')
    expect(pronominal('se lever', 'il')).toBe('il se lève')
    expect(pronominal('se lever', 'nous')).toBe('nous nous levons')
    expect(pronominal('se lever', 'vous')).toBe('vous vous levez')
    expect(pronominal('se lever', 'ils')).toBe('ils se lèvent')
  })
  it("s'habiller, con m', t', s'", () => {
    expect(pronominal("s'habiller", 'je')).toBe("je m'habille")
    expect(pronominal("s'habiller", 'tu')).toBe("tu t'habilles")
    expect(pronominal("s'habiller", 'il')).toBe("il s'habille")
    expect(pronominal("s'habiller", 'nous')).toBe('nous nous habillons')
    expect(pronominal("s'habiller", 'ils')).toBe("ils s'habillent")
  })
  it('el resto del bilan', () => {
    expect(pronominal('se doucher', 'tu')).toBe('tu te douches')
    expect(pronominal('se laver', 'on')).toBe('on se lave')
    expect(pronominal('se préparer', 'vous')).toBe('vous vous préparez')
    expect(pronominal('se coucher', 'elles')).toBe('elles se couchent')
  })
  it('negativo y pronombre del cuaderno, página 24', () => {
    expect(pronominalNegativo('se préparer', 'je')).toBe('je ne me prépare pas')
    expect(pronominalNegativo("s'habiller", 'je')).toBe("je ne m'habille pas")
    expect(pronominalNegativo('se lever', 'elle')).toBe('elle ne se lève pas')
    expect(reflexivo('se doucher', 'elle')).toBe('se')
    expect(reflexivo("s'habiller", 'vous')).toBe('vous')
    expect(reflexivo("s'habiller", 'il')).toBe("s'")
    expect(reflexivo("s'habiller", 'je')).toBe("m'")
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
    expect(PREGUNTAS_EXAME).toBe(20)
    expect(xerarExame()).toHaveLength(20)
  })
})
