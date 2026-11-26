// Bloques dialectais do galego segundo a presentación «Variedades da lingua» da profesora (2.º ESO).
// A partir dunha forma dialectal e da súa forma estándar, o código descobre que trazo ten e a que bloque pertence.
import { senTil } from './til'

export type Bloque = 'occidental' | 'central' | 'oriental'
export type Trazo = 'gheada' | 'seseo' | 'plural-ns' | 'plural-s' | 'plural-is' | 'an' | 'ao' | 'in'

export const BLOQUES: Bloque[] = ['occidental', 'central', 'oriental']
export const NOME_BLOQUE: Record<Bloque, string> = { occidental: 'Occidental', central: 'Central', oriental: 'Oriental' }

export const TRAZOS: Record<Trazo, { nome: string; bloques: Bloque[]; exemplo: string }> = {
  gheada: { nome: 'gheada', bloques: ['occidental'], exemplo: 'ghato, amigho' },
  seseo: { nome: 'seseo', bloques: ['occidental'], exemplo: 'lus, des, faser, vesiño' },
  'plural-ns': { nome: 'plural en -ns', bloques: ['occidental'], exemplo: 'cans, avións' },
  'plural-s': { nome: 'plural en -s dos nomes acabados en -n', bloques: ['central'], exemplo: 'cas, aviós' },
  'plural-is': { nome: 'plural en -is dos nomes acabados en -n', bloques: ['oriental'], exemplo: 'cais, aviois' },
  an: { nome: '-án nos dous xéneros', bloques: ['occidental'], exemplo: 'o irmán / a irmán' },
  ao: { nome: '-ao no masculino e -á no feminino', bloques: ['central', 'oriental'], exemplo: 'o irmao / a irmá' },
  in: { nome: '-ín en vez de -iño', bloques: ['oriental'], exemplo: 'camín, paxarín' },
}

/** O pronome suxeito de cada bloque: ti no occidental, ti e tu no central, tu no oriental. */
export const PRONOME: Record<Bloque, string> = { occidental: 'ti', central: 'ti / tu', oriental: 'tu' }

/** Se `f` acaba en `ff`, `e` acaba en `ef` e o resto é igual (sen ter en conta os tiles). */
function fin(f: string, e: string, ff: string, ef: string): boolean {
  return f.endsWith(ff) && e.endsWith(ef) && senTil(f.slice(0, f.length - ff.length)) === senTil(e.slice(0, e.length - ef.length))
}

/** Os trazos dialectais que separan a forma `forma` da estándar `estandar` (os do bloque occidental que coinciden co estándar, tamén). */
export function trazosDe(forma: string, estandar: string): Trazo[] {
  let f = forma.toLowerCase()
  const e = estandar.toLowerCase()
  const t: Trazo[] = []
  if (f.includes('gh') && !e.includes('gh')) {
    t.push('gheada')
    f = f.replace(/gh/g, 'g')
  }
  if (f.length === e.length && f !== e && [...f].every((c, i) => c === e[i] || (c === 's' && (e[i] === 'z' || e[i] === 'c')))) {
    t.push('seseo')
    return t
  }
  if (f === e) {
    if (/[aeiouáéíóú]ns$/.test(f)) t.push('plural-ns')
    else if (f.endsWith('án')) t.push('an')
    return t
  }
  if (fin(f, e, 'ois', 'óns') || fin(f, e, 'ais', 'áns') || fin(f, e, 'ois', 'ons') || fin(f, e, 'ais', 'ans')) t.push('plural-is')
  else if (fin(f, e, 'ós', 'óns') || fin(f, e, 'ás', 'áns') || fin(f, e, 'os', 'ons') || fin(f, e, 'as', 'ans')) t.push('plural-s')
  else if (fin(f, e, 'ao', 'án') || fin(f, e, 'ao', 'an')) t.push('ao')
  else if (fin(f, e, 'ín', 'iño') || fin(f, e, 'ín', 'iña')) t.push('in')
  return t
}

/** Os bloques que comparten todos os trazos (a intersección). Sen trazos, ningún bloque. */
export function bloquesDe(trazos: Trazo[]): Bloque[] {
  if (!trazos.length) return []
  return BLOQUES.filter((b) => trazos.every((t) => TRAZOS[t].bloques.includes(b)))
}

export const bloquesDaPalabra = (forma: string, estandar: string) => bloquesDe(trazosDe(forma, estandar))

/** «Occidental», «Central e oriental»… */
export function nomeBloques(bs: Bloque[]): string {
  const n = bs.map((b) => NOME_BLOQUE[b])
  if (n.length <= 1) return n[0] ?? 'Ningún'
  return `${n.slice(0, -1).join(', ')} e ${n.at(-1)!.toLowerCase()}`
}

export interface Cambio {
  forma: string
  estandar: string
  trazos: Trazo[]
  /** Explicación cando non é un trazo dos bloques. */
  nota?: string
}

/**
 * Pasa unha frase ao estándar cos cambios dados (forma dialectal → estándar) e calcula o bloque: o que comparten
 * todos os trazos da frase.
 */
export function estandarizar(frase: string, cambios: Record<string, { estandar: string; nota?: string }>): { texto: string; cambios: Cambio[]; bloques: Bloque[] } {
  const feitos: Cambio[] = []
  const texto = frase.replace(/[\p{L}]+/gu, (pal) => {
    const c = cambios[pal.toLowerCase()]
    if (!c) return pal
    feitos.push({ forma: pal, estandar: c.estandar, trazos: trazosDe(pal, c.estandar), nota: c.nota })
    const e = c.estandar
    return pal[0] === pal[0].toUpperCase() ? e[0].toUpperCase() + e.slice(1) : e
  })
  return { texto, cambios: feitos, bloques: bloquesDe(feitos.flatMap((c) => c.trazos)) }
}
