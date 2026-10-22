import { describe, expect, it } from 'vitest'
import { debeLlevarTilde, fonemas, grupos, porQue, separar, tipo } from './silabas'

describe('sílabas', () => {
  it('divide como el libro', () => {
    const casos: Record<string, string> = {
      entraba: 'en-tra-ba',
      haberla: 'ha-ber-la',
      botella: 'bo-te-lla',
      cuchillo: 'cu-chi-llo',
      después: 'des-pués',
      momia: 'mo-mia',
      campeón: 'cam-pe-ón',
      baúl: 'ba-úl',
      país: 'pa-ís',
      héroe: 'hé-ro-e',
      león: 'le-ón',
      poeta: 'po-e-ta',
      púa: 'pú-a',
      oían: 'o-í-an',
      querían: 'que-rí-an',
      maullido: 'mau-lli-do',
      receta: 're-ce-ta',
      urgente: 'ur-gen-te',
      guay: 'guay',
      azahar: 'a-za-har',
      ciudad: 'ciu-dad',
      ruina: 'rui-na',
      acariciáis: 'a-ca-ri-ciáis',
      complementábamos: 'com-ple-men-tá-ba-mos',
      muérdago: 'muér-da-go',
      instrumento: 'ins-tru-men-to',
      hablar: 'ha-blar',
      otro: 'o-tro',
      rey: 'rey',
      ayer: 'a-yer',
      saeta: 'sa-e-ta',
      sabía: 'sa-bí-a',
      chirriaba: 'chi-rria-ba',
      quiero: 'quie-ro',
    }
    for (const [p, s] of Object.entries(casos)) expect(separar(p), p).toBe(s)
  })
  it('diptongos, triptongos e hiatos', () => {
    expect(grupos('cuando')).toEqual([{ tipo: 'diptongo', vocales: 'ua', clase: 'cerrada + abierta' }])
    expect(grupos('raudo')[0].clase).toBe('abierta + cerrada')
    expect(grupos('ciudad')[0].clase).toBe('cerrada + cerrada')
    expect(grupos('guay')[0].tipo).toBe('triptongo')
    expect(grupos('acariciáis').map((g) => g.tipo)).toEqual(['triptongo'])
    expect(grupos('saeta')[0].tipo).toBe('hiato')
    expect(grupos('azahar').map((g) => g.tipo)).toEqual([])
    expect(grupos('Ismael')[0].tipo).toBe('hiato')
    expect(grupos('viuda')[0].tipo).toBe('diptongo')
    expect(grupos('reelegido')[0].tipo).toBe('hiato')
  })
  it('tipo y tilde', () => {
    expect(tipo('portón')).toBe('aguda')
    expect(tipo('matiz')).toBe('aguda')
    expect(tipo('Cádiz')).toBe('llana')
    expect(tipo('Mateo')).toBe('llana')
    expect(tipo('brújula')).toBe('esdrújula')
    expect(tipo('préstaselo')).toBe('sobresdrújula')
    for (const p of ['sofá', 'jamón', 'revés', 'hábil', 'Cádiz', 'túnel', 'tenía', 'laúd', 'aéreo', 'murciélago', 'lingüístico', 'acariciáis', 'Jaén', 'ganzúa', 'increíble', 'ataúd', 'vehículo', 'megafonía', 'salió', 'peón'])
      expect(debeLlevarTilde(p), p).toBe(true)
    for (const p of ['matiz', 'Mateo', 'termina', 'reloj', 'cantar', 'examen', 'Ceuta', 'fraile', 'oasis', 'sol'])
      expect(debeLlevarTilde(p), p).toBe(false)
    expect(porQue('matiz')).toBe('Es aguda acabada en consonante distinta de -n o -s (-z): no lleva tilde.')
    expect(porQue('mamá')).toBe('Es aguda acabada en vocal: lleva tilde.')
  })
  it('fonemas', () => {
    expect(fonemas('Campoamor')).toBe(9)
    expect(fonemas('chuleta')).toBe(6)
    expect(fonemas('hola')).toBe(3)
    expect(fonemas('queso')).toBe(4)
    expect(fonemas('taxi')).toBe(5)
  })
})
