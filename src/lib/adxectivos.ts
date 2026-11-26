// O adxectivo en galego (apuntes «Os trazos importantes» e «Tarefas repaso adxectivos»): xénero, número e graos.
import { senTil } from './til'

/** Superlativos sintéticos cultos ou irregulares (o primeiro é o máis habitual). */
const SINTETICOS: Record<string, string[]> = {
  bo: ['boísimo', 'óptimo'],
  mao: ['malísimo', 'pésimo'],
  acre: ['acérrimo'],
  pobre: ['paupérrimo', 'pobrísimo'],
  cruel: ['crudelísimo', 'cruelísimo'],
  sabio: ['sapientísimo', 'sabísimo'],
  antigo: ['antiquísimo', 'antiguísimo'],
  negro: ['negrísimo', 'nigérrimo'],
  grande: ['grandísimo', 'máximo'],
  pequeno: ['pequenísimo', 'mínimo'],
  amable: ['amabilísimo'],
}

/** O superlativo en -ísimo: rico → riquísimo, difícil → dificilísimo, quente → quentísimo. */
export function superlativoSintetico(adx: string): string[] {
  if (SINTETICOS[adx]) return SINTETICOS[adx]
  const a = senTil(adx)
  if (a.endsWith('co')) return [a.slice(0, -2) + 'quísimo']
  if (a.endsWith('go')) return [a.slice(0, -2) + 'guísimo']
  if (a.endsWith('z')) return [a.slice(0, -1) + 'císimo']
  if (a.endsWith('ble')) return [a.slice(0, -3) + 'bilísimo']
  if (/[aeo]$/.test(a)) return [a.slice(0, -1) + 'ísimo']
  return [a + 'ísimo']
}

/** Todas as formas de superlativo absoluto (exercicio 2 da folla): riquísimo, moi rico, ben rico, rico abondo… */
export function superlativos(adx: string): string[] {
  const pref = (p: string) => p + (p.endsWith('e') && adx.startsWith('r') ? 'r' : '') + adx
  return [...superlativoSintetico(adx), `moi ${adx}`, `ben ${adx}`, `${adx} abondo`, `${adx} ${adx}`, pref('super'), pref('hiper'), pref('requete')]
}

export type Grao = 'igualdade' | 'superioridade' | 'inferioridade'

/**
 * As dúas partes do comparativo. Diante dun verbo (unha oración: «do que pensaba»), o segundo termo é «do que»
 * (ou «como» na igualdade); diante dun nome ou pronome, «que / ca» (ou «coma / como»).
 */
export function comparativo(grao: Grao, diante: 'nome' | 'verbo'): { primeiro: string; segundo: string[] } {
  if (grao === 'igualdade') return { primeiro: 'tan', segundo: diante === 'verbo' ? ['como'] : ['coma', 'como'] }
  return { primeiro: grao === 'superioridade' ? 'máis' : 'menos', segundo: diante === 'verbo' ? ['do que'] : ['que', 'ca'] }
}

const VOGAL_TONICA = /[áéíóú]$/
/** Se a última sílaba leva o acento (para saber se -il é tónico: infantil, fácil). */
const agudaSenTil = (a: string) => !/[áéíóú]/.test(a)

/** O feminino. Os xentilicios en -án fan -á (ourensán → ourensá); os pexorativos en -án, -ana (lacazán → lacazana). */
export function feminino(adx: string, xentilicio = false): string {
  if (adx === 'mao') return 'mala'
  if (adx === 'bo') return 'boa'
  if (adx.endsWith('án')) return xentilicio ? adx.slice(0, -2) + 'á' : adx.slice(0, -2) + 'ana'
  if (adx.endsWith('ón')) return adx.slice(0, -2) + 'ona'
  if (adx.endsWith('ín')) return adx.slice(0, -2) + 'ina'
  if (xentilicio && adx.endsWith('és')) return adx.slice(0, -2) + 'esa'
  if (xentilicio && adx.endsWith('eu')) return adx.slice(0, -2) + 'ea'
  if (/[^aeiou]u$/.test(adx)) return adx.slice(0, -1) + 'úa'
  if (adx.endsWith('o')) return adx.slice(0, -1) + 'a'
  return adx // -e, vogal tónica, -l, -z, -r, -s…: invariable
}

/** Cantas terminacións ten: 2 (alto / alta) ou 1 (veraz, infantil, etíope). */
export const terminacions = (adx: string, xentilicio = false) => (feminino(adx, xentilicio) === adx ? 1 : 2)

/** Os adxectivos acabados en vogal tónica ou en -e son invariables. */
export const invariablePorFinal = (adx: string) => VOGAL_TONICA.test(adx) || adx.endsWith('e')

/** O plural: altos, galopíns, veraces, infantís, fáciles, crueis. */
export function plural(adx: string): string {
  if (/[aeiouáéíóú]$/.test(adx) || adx.endsWith('n')) return adx + 's'
  if (adx.endsWith('z')) return adx.slice(0, -1) + 'ces'
  if (adx.endsWith('r')) return adx + 'es'
  if (adx.endsWith('il')) return agudaSenTil(adx) ? adx.slice(0, -2) + 'ís' : adx + 'es'
  if (adx.endsWith('l')) return adx.slice(0, -1) + 'is'
  if (/[áéíóú]s$/.test(adx)) return senTil(adx) + 'es'
  return adx
}
