// O til en galego: poñelo, quitalo e atopalo nunha palabra.

const CON: Record<string, string> = { a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú', A: 'Á', E: 'É', I: 'Í', O: 'Ó', U: 'Ú' }
const SEN: Record<string, string> = Object.fromEntries(Object.entries(CON).map(([s, c]) => [c, s]))

export const esVogal = (c: string) => /[aeiouáéíóúAEIOUÁÉÍÓÚ]/.test(c)

/** A palabra sen ningún til (o ü queda como está). */
export const senTil = (s: string) =>
  s
    .split('')
    .map((c) => SEN[c] ?? c)
    .join('')

/** Pon o til na letra i (que ten que ser vogal). Con i = -1 devolve a palabra sen til. */
export function ponTil(s: string, i: number): string {
  const base = senTil(s)
  if (i < 0) return base
  return base.slice(0, i) + (CON[base[i]] ?? base[i]) + base.slice(i + 1)
}

/** Onde está o til, ou -1 se non leva. */
export const ondeTil = (s: string) => s.split('').findIndex((c) => c in SEN)

/** Separa unha frase en palabras e o que vai entre elas (espazos e signos), para poder tocar cada palabra. */
export function trocear(frase: string): { texto: string; palabra: boolean }[] {
  return (frase.match(/[\p{L}ü]+|[^\p{L}ü]+/gu) ?? []).map((t) => ({ texto: t, palabra: /\p{L}/u.test(t) }))
}
