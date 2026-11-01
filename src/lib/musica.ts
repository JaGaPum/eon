// Teoría da música de 2.º de ESO: notas, tons e semitóns, figuras e compases. As solucións calcúlanse aquí.

export const NOTAS = ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si'] as const
export type Nota = (typeof NOTAS)[number]

/** Distancia ata a nota seguinte en semitóns: 1 (semitón) entre Mi-Fa e Si-Do; 2 (ton) nas demais. */
export const semitonsAaSeguinte = (n: Nota) => (n === 'Mi' || n === 'Si' ? 1 : 2)

/** Semitóns subindo dunha nota a outra (de Do a Sol, 7). */
export function semitons(de: Nota, a: Nota): number {
  let s = 0
  let i = NOTAS.indexOf(de)
  while (NOTAS[i] !== a) {
    s += semitonsAaSeguinte(NOTAS[i])
    i = (i + 1) % NOTAS.length
  }
  return s
}

/** Unha distancia en semitóns escrita en tons: 3 → «1 ton e 1/2». */
export function enTons(s: number): string {
  const t = Math.floor(s / 2)
  const medio = s % 2 === 1
  if (t === 0) return medio ? '1/2 ton' : '0 tons'
  return `${t} ${t === 1 ? 'ton' : 'tons'}${medio ? ' e 1/2' : ''}`
}

/** A escala natural de Do a Do: as sete distancias, 5 tons e 2 semitóns. */
export const escala = () => NOTAS.map((n) => semitonsAaSeguinte(n))

/** Nota con sostido ↔ a seguinte con bemol, cando hai tecla negra entre as dúas: Do♯ = Re♭. */
export function enarmonica(n: Nota): string | null {
  if (semitonsAaSeguinte(n) !== 2) return null
  return `${NOTAS[(NOTAS.indexOf(n) + 1) % 7]}♭`
}

export const FIGURAS = ['redonda', 'branca', 'negra', 'corchea', 'semicorchea', 'fusa', 'semifusa'] as const
export type Figura = (typeof FIGURAS)[number]

/** Valor da figura contando en negras: redonda 4, branca 2, negra 1, corchea 1/2… */
export const valor = (f: Figura) => 4 / 2 ** FIGURAS.indexOf(f)

/** Cantas figuras pequenas caben nunha grande: 4 negras nunha redonda. */
export const cantasCaben = (grande: Figura, pequena: Figura) => valor(grande) / valor(pequena)

/** O punto engade a metade do valor. */
export const conPunto = (f: Figura) => valor(f) * 1.5

/** Denominadores do compás e a súa figura unidade de tempo. */
export const DENOMINADORES: Record<number, Figura> = { 1: 'redonda', 2: 'branca', 4: 'negra', 8: 'corchea', 16: 'semicorchea' }

export const tipoCompas = (numerador: number) =>
  numerador === 2 || numerador === 6 ? 'binario' : numerador === 3 || numerador === 9 ? 'ternario' : numerador === 4 || numerador === 12 ? 'cuaternario' : null
export const claseCompas = (numerador: number) => (numerador <= 4 ? 'simple' : 'composto')

/** A figura que enche todo o compás (compases simples): unidade de tempo × número de tempos. */
export function unidadeCompas(numerador: number, denominador: number): string {
  const total = valor(DENOMINADORES[denominador]) * numerador
  for (const f of FIGURAS) {
    if (valor(f) === total) return f
    if (conPunto(f) === total) return `${f} con punto`
  }
  return `${numerador} ${DENOMINADORES[denominador]}s`
}
