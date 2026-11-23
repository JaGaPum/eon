import { describe, expect, it } from 'vitest'
import { esCorrecta } from '../componentes/Respuesta'
import { crearRonda, crearSimulacro } from './Global'

describe('repaso para el global', () => {
  it('el simulacro: cinco preguntas de cada tema, de paradas distintas, y todas con respuesta válida', () => {
    for (let k = 0; k < 40; k++) {
      const s = crearSimulacro()
      expect(s).toHaveLength(15)
      for (const t of [0, 1, 2]) {
        const suyas = s.filter((x) => x.t === t)
        expect(suyas).toHaveLength(5)
        expect(new Set(suyas.map((x) => x.parada)).size).toBe(5)
      }
      // Las del tema 3 (las de los temas 1 y 2 ya se comprueban en sus pruebas).
      for (const x of s.filter((y) => y.t === 2)) expect(esCorrecta(x.q, x.q.correcta), `${x.parada} ${x.q.correcta}`).toBe(true)
    }
  })
  it('la práctica mezclada reparte los tres temas por igual', () => {
    const r = crearRonda()
    expect(r).toHaveLength(12)
    for (const t of [0, 1, 2]) expect(r.filter((x) => x.t === t)).toHaveLength(4)
  })
})
