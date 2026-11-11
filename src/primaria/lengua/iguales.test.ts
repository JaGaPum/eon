import { describe, expect, it } from 'vitest'
import { PREGUNTAS_PROBA } from '../pezas'
import { conHuecoG, faltasG, grupoG, huecoG, huecoK, tieneGFuerte, tieneGSuave } from '../../lib/ortografia'
import { concuerda, desordenada, partes, sujetoPlural, texto } from '../../lib/oracion'
import { silabas } from '../../lib/silabas'
import { ANTONIMOS, CONCORDANCIA, ESCRIBE_G, ORACIONES, PALABRAS_CUENTO, PALABRAS_G, PALABRAS_G_FUERTE, PALABRAS_K } from './datos'
import { indicesSujeto } from './paradas'
import { BANCOS, PARADAS, PREGUNTAS_EXAME, xerarExame } from './Unidade'

describe('el sonido G suave', () => {
  it('las reglas de la página 30', () => {
    expect(huecoG('amiga').grafia).toBe('g')
    expect(huecoG('juguete').grafia).toBe('gu')
    expect(huecoG('vergüenza').grafia).toBe('gü')
    expect(huecoG('agua').grafia).toBe('g')
    expect(conHuecoG('cigüeña')).toBe('ci_eña')
    expect(conHuecoG('hoguera')).toBe('ho_era')
    expect(conHuecoG('abrigo')).toBe('abri_o')
    expect(conHuecoG('guiñol')).toBe('_iñol')
  })
  it('los tres grupos del ejercicio 2 de la página 30', () => {
    expect(['bigote', 'agua', 'regadera'].map(grupoG)).toEqual(['ga-go-gu', 'ga-go-gu', 'ga-go-gu'])
    expect(['águila', 'espaguetis', 'droguería', 'guiño', 'guepardo', 'aguijón'].map(grupoG).every((g) => g === 'gue-gui')).toBe(true)
    expect(['bilingüe', 'nicaragüense', 'piragüista'].map(grupoG).every((g) => g === 'güe-güi')).toBe(true)
  })
  it('la ficha de la libreta: suave o fuerte', () => {
    for (const w of ['agua', 'lingotes', 'antiguo', 'ciego', 'albergue', 'guindalera', 'laguna']) expect(tieneGSuave(w), w).toBe(true)
    for (const w of ['gemas', 'genio']) {
      expect(tieneGSuave(w), w).toBe(false)
      expect(tieneGFuerte(w), w).toBe(true)
    }
    expect(faltasG('paraguas')).toEqual(['paragüas'])
    expect(faltasG('anguila')).toEqual(['angila', 'angüila'])
  })
  it('todas las palabras de la unidad', () => {
    for (const { palabra } of PALABRAS_G) expect(tieneGSuave(palabra), palabra).toBe(true)
    for (const w of PALABRAS_G_FUERTE) expect(tieneGSuave(w), w).toBe(false)
    for (const w of ESCRIBE_G) expect(PALABRAS_G.some((x) => x.palabra === w), w).toBe(true)
    expect(new Set(PALABRAS_G.map((x) => x.palabra)).size).toBe(PALABRAS_G.length)
  })
  it('c y qu (página 36)', () => {
    expect(PALABRAS_K.map((w) => huecoK(w).grafia)).toEqual(['qu', 'c', 'c', 'qu', 'c', 'c', 'qu', 'c', 'qu', 'c', 'qu', 'c'])
    expect(huecoK('Coco').antes).toBe('')
  })
})

describe('la oración', () => {
  it('sujeto delante, detrás o sin sujeto', () => {
    expect(texto({ sujeto: 'el estuche', predicado: 'estaba roto', detras: true })).toBe('Estaba roto el estuche.')
    expect(texto({ predicado: 'llueve mucho' })).toBe('Llueve mucho.')
    expect(partes({ sujeto: 'el perro', predicado: 'ladra mucho' })).toEqual({ sujeto: 'El perro', predicado: 'ladra mucho' })
    expect(indicesSujeto({ sujeto: 'el libro de Clara', predicado: 'es muy interesante', detras: true })).toEqual([3, 4, 5, 6])
    expect(desordenada({ sujeto: 'Nerea y Damián', predicado: 'hacen un puzle juntos' })).toBe('Juntos puzle un hacen Damián y Nerea.')
  })
  it('el sujeto concuerda con el verbo en todas las oraciones', () => {
    for (const o of ORACIONES) expect(concuerda(o), texto(o)).toBe(true)
    expect(new Set(ORACIONES.map(texto)).size).toBe(ORACIONES.length)
  })
  it('concordancia: un sujeto de uno y otro de varios', () => {
    for (const c of CONCORDANCIA) {
      expect(sujetoPlural(c.sujetos[0]), c.sujetos[0]).toBe(false)
      expect(sujetoPlural(c.sujetos[1]), c.sujetos[1]).toBe(true)
    }
  })
})

describe('antónimos y sílabas', () => {
  it('cada palabra está en una sola pareja', () => {
    const todas = ANTONIMOS.flat()
    expect(new Set(todas).size).toBe(todas.length)
  })
  it('sílabas de las palabras del cuento', () => {
    expect(silabas('primavera')).toEqual(['pri', 'ma', 've', 'ra'])
    expect(silabas('arroyo')).toEqual(['a', 'rro', 'yo'])
    expect(silabas('agua')).toEqual(['a', 'gua'])
    expect(silabas('muchacha')).toEqual(['mu', 'cha', 'cha'])
    for (const w of PALABRAS_CUENTO) expect(silabas(w).join(''), w).toBe(w)
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
