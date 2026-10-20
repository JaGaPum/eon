import { describe, expect, it } from 'vitest'
import { PREGUNTAS_PROBA } from '../../primaria/pezas'
import { FEITOS_MEDIEVO, FEITOS_ROMA, enOrde, etapaDe, periodoDe, romano, seculo } from './datos'
import { queFoiAntes, seriesOrde } from './xerar'
import { BANCOS, PARADAS, PREGUNTAS_EXAME, xerarExame } from './Unidade'

describe('datas', () => {
  it('etapas de Roma', () => {
    expect(etapaDe(-753)).toBe('Monarquía')
    expect(etapaDe(-509)).toBe('República')
    expect(etapaDe(-44)).toBe('República')
    expect(etapaDe(-133)).toBe('República')
    expect(etapaDe(-27)).toBe('Imperio')
    expect(etapaDe(395)).toBe('Imperio')
  })
  it('séculos e períodos da Idade Media', () => {
    expect(seculo(476)).toBe(5)
    expect(seculo(800)).toBe(8)
    expect(seculo(801)).toBe(9)
    expect(seculo(1054)).toBe(11)
    expect(seculo(1453)).toBe(15)
    expect(romano(7)).toBe('VII')
    expect(romano(14)).toBe('XIV')
    expect(romano(19)).toBe('XIX')
    expect(periodoDe(seculo(622))).toBe('Alta Idade Media')
    expect(periodoDe(seculo(1054))).toBe('Plena Idade Media')
    expect(periodoDe(seculo(1453))).toBe('Baixa Idade Media')
  })
  it('os feitos teñen ids únicos e as series van en orde', () => {
    const todos = [...FEITOS_ROMA, ...FEITOS_MEDIEVO]
    expect(new Set(todos.map((x) => x.id)).size).toBe(todos.length)
    expect(enOrde(FEITOS_ROMA).map((x) => x.id).slice(0, 3)).toEqual(['fundacion', 'republica', 'hispania'])
    for (const s of seriesOrde(FEITOS_MEDIEVO, 20, 4)) {
      const anos = s.palabras.map((p) => FEITOS_MEDIEVO.find((x) => x.curto === p)!.ano)
      expect(anos).toEqual([...anos].sort((a, b) => a - b))
    }
  })
  it('«que pasou antes» marca o máis antigo', () => {
    for (const p of queFoiAntes(FEITOS_ROMA, 30)) {
      if (p.tipo !== 'elixe') throw new Error()
      const ano = (t: string) => FEITOS_ROMA.find((x) => x.texto === t)!.ano
      expect(ano(p.correcta)).toBeLessThan(ano(p.outras[0]))
    }
  })
})

describe('preguntas', () => {
  it('cada parada ten o seu banco, con preguntas abondo para a proba', () => {
    expect(Object.keys(BANCOS).sort()).toEqual(PARADAS.map((p) => p.id).sort())
    for (const p of PARADAS) expect(BANCOS[p.id].length, p.id).toBeGreaterThanOrEqual(PREGUNTAS_PROBA + 4)
  })
  it('cada pregunta ten unha soa resposta boa', () => {
    for (const [id, banco] of Object.entries(BANCOS))
      for (const p of banco) {
        if (p.tipo === 'elixe') {
          expect(p.outras, `${id}: ${p.correcta}`).not.toContain(p.correcta)
          expect(new Set(p.outras).size, `${id}: ${p.correcta}`).toBe(p.outras.length)
          expect(p.outras.length).toBeGreaterThan(0)
        } else if (p.tipo === 'toca') expect(Object.keys(p.nomes), id).toContain(p.correcta)
      }
  })
  it('o simulacro colle 3 de cada parada', () => {
    expect(PREGUNTAS_EXAME).toBe(27)
    expect(xerarExame()).toHaveLength(27)
  })
})

describe('tema 2', async () => {
  const { BANCOS2, PARADAS2, xerarExame2 } = await import('../tema2/Unidade')
  it('bancos con preguntas abondo e unha soa resposta boa', () => {
    for (const p of PARADAS2) expect(BANCOS2[p.id].length, p.id).toBeGreaterThanOrEqual(PREGUNTAS_PROBA + 4)
    for (const banco of Object.values(BANCOS2))
      for (const p of banco) {
        if (p.tipo === 'elixe') expect(p.outras).not.toContain(p.correcta)
        else if (p.tipo === 'toca') expect(Object.keys(p.nomes)).toContain(p.correcta)
      }
    expect(xerarExame2()).toHaveLength(20)
  })
})
