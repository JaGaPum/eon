import { describe, expect, it } from 'vitest'
import { bloquesDaPalabra, estandarizar, nomeBloques, trazosDe } from '../../../lib/dialectos'
import { comparativo, feminino, plural, superlativoSintetico, superlativos, terminacions } from '../../../lib/adxectivos'
import { FRASES_BLOQUES, PALABRAS_BLOQUES, PALABRAS_BLOQUES_MAIS } from './datos'
import { PREGUNTAS_TEXTOS2 } from './textos'
import { PREGUNTAS_LINGUA2 } from './lingua'

describe('bloques dialectais', () => {
  it('trazos de cada palabra', () => {
    expect(trazosDe('amigho', 'amigo')).toEqual(['gheada'])
    expect(trazosDe('sincuenta', 'cincuenta')).toEqual(['seseo'])
    expect(trazosDe('canciós', 'cancións')).toEqual(['plural-s'])
    expect(trazosDe('canciois', 'cancións')).toEqual(['plural-is'])
    expect(trazosDe('cancións', 'cancións')).toEqual(['plural-ns'])
    expect(trazosDe('irmao', 'irmán')).toEqual(['ao'])
    expect(trazosDe('irmán', 'irmán')).toEqual(['an'])
    expect(trazosDe('camín', 'camiño')).toEqual(['in'])
    expect(trazosDe('mirín', 'mirei')).toEqual([])
  })
  it('boletín 2, exercicio 1', () => {
    const bloque = (b: string) => PALABRAS_BLOQUES.filter(([f, e]) => bloquesDaPalabra(f, e).includes(b as never)).map(([f]) => f)
    expect(bloque('occidental')).toEqual(['amigho', 'ghato', 'sincuenta', 'cancións', 'irmán', 'xamóns'])
    expect(bloque('central')).toEqual(['canciós', 'xamós'])
    expect(bloque('oriental')).toEqual(['xamois', 'canciois', 'camín', 'vecín'])
  })
  it('todas as palabras teñen bloque', () => {
    for (const [f, e] of [...PALABRAS_BLOQUES, ...PALABRAS_BLOQUES_MAIS]) expect(bloquesDaPalabra(f, e).length, f).toBeGreaterThan(0)
    expect(nomeBloques(bloquesDaPalabra('irmao', 'irmán'))).toBe('Central e oriental')
  })
  it('boletín 2, exercicio 2', () => {
    const r = FRASES_BLOQUES.map((x) => estandarizar(x.frase, x.cambios))
    expect(r.map((x) => x.texto)).toEqual([
      'O meu padriño vendeu os pantalóns vellos na feira o domingo',
      'Acende a luz da cociña, que non se ve ben',
      'Foi teu irmán o que meteu man nos xamóns do veciño',
      'E logo por onde andabas que non te mirei, a última vez foi en Pasarón',
    ])
    expect(r.map((x) => x.bloques)).toEqual([['oriental'], ['occidental'], ['central'], ['occidental']])
  })
})

describe('o adxectivo', () => {
  it('superlativos sintéticos da folla', () => {
    const s = (a: string) => superlativoSintetico(a)[0]
    expect(['rico', 'baixo', 'bo', 'antigo', 'cruel', 'sabio', 'quente', 'difícil', 'acre', 'pobre'].map(s)).toEqual([
      'riquísimo', 'baixísimo', 'boísimo', 'antiquísimo', 'crudelísimo', 'sapientísimo', 'quentísimo', 'dificilísimo', 'acérrimo', 'paupérrimo',
    ])
    expect(superlativoSintetico('branco')).toEqual(['branquísimo'])
    expect(superlativoSintetico('fácil')).toEqual(['facilísimo'])
    expect(superlativos('rico')).toEqual(expect.arrayContaining(['riquísimo', 'moi rico', 'ben rico', 'rico abondo', 'superrico', 'requeterrico']))
  })
  it('comparativos', () => {
    expect(comparativo('inferioridade', 'verbo')).toEqual({ primeiro: 'menos', segundo: ['do que'] })
    expect(comparativo('igualdade', 'nome').primeiro).toBe('tan')
  })
  it('xénero e número', () => {
    expect(feminino('lacazán')).toBe('lacazana')
    expect(feminino('ourensán', true)).toBe('ourensá')
    expect(feminino('abusón')).toBe('abusona')
    expect(feminino('galopín')).toBe('galopina')
    expect(feminino('bo')).toBe('boa')
    expect(feminino('noiés', true)).toBe('noiesa')
    expect(['veraz', 'infantil', 'etíope', 'estradense', 'cortés'].map((a) => terminacions(a))).toEqual([1, 1, 1, 1, 1])
    expect(['alto', 'galopín', 'veraz', 'infantil', 'fácil', 'cruel', 'etíope', 'bo'].map(plural)).toEqual(['altos', 'galopíns', 'veraces', 'infantís', 'fáciles', 'crueis', 'etíopes', 'bos'])
  })
})

describe('bancos de preguntas', () => {
  for (const [nome, banco] of Object.entries({ ...PREGUNTAS_TEXTOS2, ...PREGUNTAS_LINGUA2 }))
    it(`${nome}: chegan preguntas e a correcta non se repite entre as outras`, () => {
      expect(banco.length).toBeGreaterThanOrEqual(20)
      for (const q of banco)
        if (q.tipo === 'elixe') {
          expect(q.outras, q.correcta).not.toContain(q.correcta)
          expect(new Set(q.outras).size, q.correcta).toBe(q.outras.length)
          expect(q.outras.length, q.correcta).toBeGreaterThan(0)
        }
    })
})

describe('unidade 1 (entra no simulacro)', async () => {
  const { PREGUNTAS_ACENTOS } = await import('../acentos')
  const { PREGUNTAS_TEXTOS } = await import('../textos')
  it('a correcta nunca está entre as outras', () => {
    for (const q of [...Object.values(PREGUNTAS_ACENTOS), ...Object.values(PREGUNTAS_TEXTOS)].flat())
      if (q.tipo === 'elixe') {
        expect(q.outras, q.correcta).not.toContain(q.correcta)
        expect(new Set(q.outras).size, q.correcta).toBe(q.outras.length)
      }
  })
})
