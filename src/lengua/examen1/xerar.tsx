// Preguntas de sílabas y tildes que salen del motor (src/lib/silabas.ts): la solución y las opciones falsas las
// calcula el código.
import { barallar, type Pregunta } from '../../primaria/pezas'
import { elixe } from '../../primaria/paisaxes/preguntas'
import { grupos, porQue, separar, silabas, tipo, tonica } from '../../lib/silabas'

const vocal = /[aeiouáéíóúü]/i

/** Divisiones equivocadas pero creíbles: separar un diptongo, juntar un hiato o mover una consonante. */
export function divisionesFalsas(palabra: string): string[] {
  const ss = silabas(palabra)
  const buena = ss.join('-')
  const r = new Set<string>()
  // Separar las vocales que van juntas.
  ss.forEach((s, i) => {
    const m = s.match(/[aeiouáéíóúü]{2,}/i)
    if (m && m.index !== undefined) {
      const k = m.index + 1
      r.add([...ss.slice(0, i), s.slice(0, k), s.slice(k), ...ss.slice(i + 1)].join('-'))
    }
  })
  // Juntar dos sílabas seguidas que acaban y empiezan en vocal (deshacer un hiato).
  for (let i = 0; i + 1 < ss.length; i++)
    if (vocal.test(ss[i].slice(-1)) && vocal.test(ss[i + 1][0])) r.add([...ss.slice(0, i), ss[i] + ss[i + 1], ...ss.slice(i + 2)].join('-'))
  // Mover una consonante de una sílaba a la siguiente o al revés.
  for (let i = 0; i + 1 < ss.length; i++) {
    const a = ss[i]
    const b = ss[i + 1]
    if (a.length > 1 && !vocal.test(a.slice(-1))) r.add([...ss.slice(0, i), a.slice(0, -1), a.slice(-1) + b, ...ss.slice(i + 2)].join('-'))
    if (b.length > 1 && !vocal.test(b[0])) r.add([...ss.slice(0, i), a + b[0], b.slice(1), ...ss.slice(i + 2)].join('-'))
  }
  r.delete(buena)
  return [...r].filter((x) => !x.split('-').some((s) => s === '' || !vocal.test(s)))
}

export const preguntaSilabas = (p: string): Pregunta => elixe(<>¿Cómo se divide en sílabas «{p}»?</>, separar(p), barallar(divisionesFalsas(p)).slice(0, 3), <>Se divide {separar(p)}.</>)

export function preguntaTonica(p: string): Pregunta {
  const ss = silabas(p)
  const t = ss[ss.length - 1 - tonica(p)]
  return elixe(<>¿Cuál es la sílaba tónica de «{p}»?</>, t, barallar(ss.filter((s) => s !== t)).slice(0, 3), <>{ss.join('-')}: la tónica es «{t}». Es {tipo(p)}.</>)
}

export const preguntaTipo = (p: string): Pregunta =>
  elixe(<>«{p}» es una palabra…</>, tipo(p), ['aguda', 'llana', 'esdrújula', 'sobresdrújula'].filter((x) => x !== tipo(p)), <>{separar(p)}. {porQue(p)}</>)

/** Poner la tilde: se toca la vocal que la lleva o «No lleva tilde». */
export const preguntaTilde = (p: string): Pregunta => ({ tipo: 'til', texto: <>¿Lleva tilde? Ponla si hace falta.</>, palabra: p, respostas: [p], explica: <>Se escribe «{p}». {porQue(p)}</> })

/** ¿Por qué lleva (o no) tilde? Las otras opciones son las razones de otras palabras. */
export function preguntaPorQue(p: string, otras: string[]): Pregunta {
  const buena = porQue(p)
  const falsas = [...new Set(otras.map(porQue))].filter((x) => x !== buena)
  return elixe(<>¿Por qué «{p}» se escribe así?</>, buena, barallar(falsas).slice(0, 3), buena)
}

const QUE = ['diptongo', 'triptongo', 'hiato'] as const
/** ¿Diptongo, triptongo o hiato? Solo con palabras que tienen un único grupo de vocales. */
export function preguntaGrupo(p: string): Pregunta {
  const g = grupos(p)[0]
  return elixe(<>¿Qué hay en «{p}»?</>, g.tipo, QUE.filter((x) => x !== g.tipo), <>{separar(p)}: «{g.vocales}» es un {g.tipo} ({g.clase}).</>)
}

const CLASES = ['abierta + cerrada', 'cerrada + abierta', 'cerrada + cerrada']
export function preguntaClase(p: string): Pregunta {
  const g = grupos(p).find((x) => x.tipo === 'diptongo')!
  return elixe(<>El diptongo «{g.vocales}» de «{p}» está formado por una vocal…</>, g.clase, CLASES.filter((x) => x !== g.clase), <>{g.vocales}: {g.clase}.</>)
}
