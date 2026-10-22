// Sílabas y acentuación en castellano, con las reglas del libro de 2.º de ESO: diptongo, triptongo e hiato; agudas,
// llanas, esdrújulas y sobresdrújulas; y cuándo llevan tilde. La h entre vocales se trata como consonante, que es
// como lo cuenta el libro (a-za-har).

const ABIERTAS = 'aeoáéó'
const CERRADAS = 'iuü'
const TILDADAS = 'áéíóú'
const SIN: Record<string, string> = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u' }
const quitaTilde = (s: string) => s.replace(/[áéíóú]/g, (c) => SIN[c])

/** Grupos de dos consonantes que no se separan: van juntos a la sílaba siguiente (ha-blar, o-tro). */
const INSEPARABLES = new Set(['pl', 'pr', 'bl', 'br', 'fl', 'fr', 'cl', 'cr', 'gl', 'gr', 'tr', 'dr', 'kl', 'kr'])

/** Letras de la palabra en unidades: ch, ll, rr, qu y gu ante e/i cuentan como una sola consonante. */
function unidades(p: string): { t: string; vocal: boolean }[] {
  const s = p.toLowerCase()
  const r: { t: string; vocal: boolean }[] = []
  for (let i = 0; i < s.length; i++) {
    const dos = s.slice(i, i + 2)
    if (dos === 'ch' || dos === 'll' || dos === 'rr') {
      r.push({ t: p.slice(i, i + 2), vocal: false })
      i++
    } else if ((dos === 'qu' || dos === 'gu') && 'eiéí'.includes(s[i + 2] ?? '')) {
      r.push({ t: p.slice(i, i + 2), vocal: false })
      i++
    } else if (s[i] === 'y') {
      // La y es vocal al final de palabra tras vocal (rey, muy) o sola; si no, consonante (yate, ayer).
      const vocal = (i === s.length - 1 && i > 0 && esVocal(s[i - 1])) || s.length === 1
      r.push({ t: p[i], vocal })
    } else r.push({ t: p[i], vocal: esVocal(s[i]) })
  }
  return r
}

const esVocal = (c: string) => /[aeiouáéíóúü]/.test(c)
const abierta = (c: string) => ABIERTAS.includes(c.toLowerCase())
const cerradaAtona = (c: string) => CERRADAS.includes(c.toLowerCase()) || c.toLowerCase() === 'y'

/** Dos vocales seguidas: ¿van en la misma sílaba? Solo si hay una cerrada sin tilde (diptongo). */
function seUnen(a: string, b: string) {
  if (abierta(a) && abierta(b)) return false
  // í o ú con tilde junto a otra vocal: hiato. Entre dos cerradas (ruina, cuídate) es diptongo.
  if (TILDADAS.includes(a.toLowerCase()) && 'íú'.includes(a.toLowerCase()) && !cerradaAtona(b)) return false
  if (TILDADAS.includes(b.toLowerCase()) && 'íú'.includes(b.toLowerCase()) && !cerradaAtona(a)) return false
  return true
}

/** Divide una palabra en sílabas: «después» → ["des", "pués"]. */
export function silabas(palabra: string): string[] {
  const us = unidades(palabra)
  // Núcleos: grupos de vocales que van en la misma sílaba.
  const nucleos: { de: number; a: number }[] = []
  for (let i = 0; i < us.length; i++) {
    if (!us[i].vocal) continue
    const ultimo = nucleos[nucleos.length - 1]
    if (ultimo && ultimo.a === i - 1 && seUnen(us[i - 1].t, us[i].t)) ultimo.a = i
    else nucleos.push({ de: i, a: i })
  }
  if (nucleos.length === 0) return [palabra]
  const cortes: number[] = []
  for (let k = 0; k + 1 < nucleos.length; k++) {
    const entre = us.slice(nucleos[k].a + 1, nucleos[k + 1].de).map((u) => u.t.toLowerCase())
    const ini = nucleos[k].a + 1
    let corte: number
    if (entre.length <= 1) corte = ini
    else if (entre.length === 2) corte = INSEPARABLES.has(entre.join('')) ? ini : ini + 1
    else if (entre.length === 3) corte = INSEPARABLES.has(entre.slice(1).join('')) ? ini + 1 : ini + 2
    else corte = ini + 2
    cortes.push(corte)
  }
  const r: string[] = []
  let desde = 0
  for (const c of [...cortes, us.length]) {
    r.push(
      us
        .slice(desde, c)
        .map((u) => u.t)
        .join(''),
    )
    desde = c
  }
  return r
}

export const separar = (palabra: string) => silabas(palabra).join('-')

/** La sílaba tónica, contando desde el final (0 = última). */
export function tonica(palabra: string): number {
  const ss = silabas(palabra)
  const conTilde = ss.findIndex((s) => /[áéíóú]/.test(s))
  if (conTilde >= 0) return ss.length - 1 - conTilde
  if (ss.length === 1) return 0
  return /[aeiouns]$/i.test(palabra) ? 1 : 0
}

export type Tipo = 'aguda' | 'llana' | 'esdrújula' | 'sobresdrújula'
export function tipo(palabra: string): Tipo {
  const t = tonica(palabra)
  return t === 0 ? 'aguda' : t === 1 ? 'llana' : t === 2 ? 'esdrújula' : 'sobresdrújula'
}

export type Grupo = { tipo: 'diptongo' | 'triptongo' | 'hiato'; vocales: string; clase: string }

const claseDe = (v: string) => (abierta(v) ? 'abierta' : 'cerrada')

/** Diptongos, triptongos e hiatos de la palabra, con el tipo de vocales («1 cerrada y 1 abierta»). */
export function grupos(palabra: string): Grupo[] {
  const us = unidades(palabra)
  const r: Grupo[] = []
  let i = 0
  while (i < us.length) {
    if (!us[i].vocal) {
      i++
      continue
    }
    let j = i
    while (j + 1 < us.length && us[j + 1].vocal) j++
    const vs = us.slice(i, j + 1).map((u) => u.t)
    // Se recorre la secuencia de vocales: cada pareja que no se une es un hiato.
    let bloque = [vs[0]]
    const cierra = () => {
      if (bloque.length === 2) r.push({ tipo: 'diptongo', vocales: bloque.join(''), clase: bloque.map(claseDe).join(' + ') })
      if (bloque.length === 3) r.push({ tipo: 'triptongo', vocales: bloque.join(''), clase: bloque.map(claseDe).join(' + ') })
    }
    for (let k = 1; k < vs.length; k++) {
      if (seUnen(vs[k - 1], vs[k])) bloque.push(vs[k])
      else {
        cierra()
        r.push({ tipo: 'hiato', vocales: vs[k - 1] + vs[k], clase: [vs[k - 1], vs[k]].map(claseDe).join(' + ') })
        bloque = [vs[k]]
      }
    }
    cierra()
    i = j + 1
  }
  return r
}

/** Tiene hiato con la cerrada tónica (tenía, laúd): lleva tilde siempre. */
const hiatoConCerrada = (palabra: string) => grupos(palabra).some((g) => g.tipo === 'hiato' && /[íú]/.test(g.vocales))

/** Según las reglas, ¿debería llevar tilde? Se mira la palabra tal como está escrita (con su sílaba tónica). */
export function debeLlevarTilde(palabra: string): boolean {
  if (silabas(palabra).length === 1) return false
  if (hiatoConCerrada(palabra)) return true
  const t = tipo(palabra)
  const final = quitaTilde(palabra.toLowerCase()).slice(-1)
  if (t === 'aguda') return /[aeiouns]/.test(final)
  if (t === 'llana') return !/[aeiouns]/.test(final)
  return true
}

/** Por qué lleva o no tilde, en una frase como las del libro. */
export function porQue(palabra: string): string {
  const t = tipo(palabra)
  const final = quitaTilde(palabra.toLowerCase()).slice(-1)
  const lleva = /[áéíóú]/.test(palabra)
  if (silabas(palabra).length === 1) return 'Es monosílaba: no lleva tilde.'
  if (hiatoConCerrada(palabra)) return 'Tiene un hiato de vocal abierta y cerrada tónica: la tilde va en la cerrada.'
  const acaba = /[aeiou]/.test(final) ? 'en vocal' : final === 'n' ? 'en -n' : final === 's' ? 'en -s' : `en consonante distinta de -n o -s (-${final})`
  if (t === 'esdrújula' || t === 'sobresdrújula') return `Es ${t}: siempre lleva tilde.`
  return `Es ${t} acabada ${acaba}: ${lleva ? 'lleva' : 'no lleva'} tilde.`
}

/**
 * Fonemas de una palabra: ch, ll, rr y qu (o gu ante e/i) son un solo sonido, la h no suena y la x son dos (/ks/).
 * Sirve para las palabras normales del libro (Campoamor → 9).
 */
export function fonemas(palabra: string): number {
  let n = 0
  for (const u of unidades(palabra)) {
    const t = u.t.toLowerCase()
    if (t === 'h') continue
    n += t === 'x' ? 2 : 1
  }
  return n
}
