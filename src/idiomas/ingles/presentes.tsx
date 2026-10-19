// Parada «Present Simple / Present Continuous» (página 13, ejercicio 9).
import { Clasifica, Fr as En, ParadaPrimaria, Proba, Tarxetas, VerdadeiroFalso, barallar, type Pregunta, type Tarxeta, type Xogo, Xogos } from '../../primaria/pezas'
import { elixe } from '../../primaria/paisaxes/preguntas'
import { CONTINUO_TIEMPO, SIMPLE_TIEMPO, SUJETOS, VERBOS, be, continuo, simple, type Verbo } from './verbos'

const b = (t: string) => <b className="text-violet-800">{t}</b>
const azar = <T,>(xs: readonly T[]) => xs[Math.floor(Math.random() * xs.length)]

const TARXETAS: Tarxeta[] = [
  {
    titulo: 'Los ejemplos del libro',
    texto: (
      <div className="space-y-2 text-xl">
        <p>
          <En>I order pizza every weekend.</En>
        </p>
        <p>
          <En>We aren't exercising right now.</En>
        </p>
        <p>
          <En>Do you often go out with friends?</En>
        </p>
        <p>
          <En>Are you painting at the moment?</En>
        </p>
        <p>
          <En>I hear him now.</En>
        </p>
        <p className="text-base text-slate-600">💡 Fíjate en lo subrayado del libro: las expresiones de tiempo te dicen qué tiempo verbal toca.</p>
      </div>
    ),
  },
  {
    titulo: 'Las reglas (ejercicio 9)',
    texto: (
      <ol className="list-decimal space-y-2 pl-6">
        <li>
          Usamos el {b('Present Simple')} para hablar de {b('hechos, rutinas y hábitos')}.
        </li>
        <li>
          Usamos el {b('Present Continuous')} para hablar de {b('acciones que están pasando ahora')}.
        </li>
        <li>
          No solemos usar el {b('Present Continuous')} con {b('verbos de estado')} como <i>love, like, hate, hear, understand</i> y <i>know</i>.
        </li>
      </ol>
    ),
  },
  {
    titulo: 'Present Simple: cómo se forma',
    texto: (
      <table className="w-full text-lg">
        <tbody>
          <tr className="border-b">
            <td className="py-1.5 pr-3 font-bold">Afirmativa</td>
            <td>
              <En>I play</En> · <En>She plays</En>
            </td>
          </tr>
          <tr className="border-b">
            <td className="py-1.5 pr-3 font-bold">Negativa</td>
            <td>
              <En>I don't play</En> · <En>She doesn't play</En>
            </td>
          </tr>
          <tr>
            <td className="py-1.5 pr-3 font-bold">Pregunta</td>
            <td>
              <En>Do you play?</En> · <En>Does she play?</En>
            </td>
          </tr>
        </tbody>
      </table>
    ),
    visual: (
      <div className="space-y-1 p-3 text-lg">
        <p className="font-bold">Con he, she, it: ‑s</p>
        <p>
          plays · reads · watch<b className="text-rose-600">es</b> · go<b className="text-rose-600">es</b> · stud<b className="text-rose-600">ies</b> · <b className="text-rose-600">has</b> · <b className="text-rose-600">does</b>
        </p>
        <p className="pt-2 font-bold">Palabras pista</p>
        <p>every day, every weekend, on Mondays, once a week, usually, often, always, sometimes, never</p>
      </div>
    ),
  },
  {
    titulo: 'Present Continuous: cómo se forma',
    texto: (
      <table className="w-full text-lg">
        <tbody>
          <tr className="border-b">
            <td className="py-1.5 pr-3 font-bold">Afirmativa</td>
            <td>
              <En>I am playing</En> · <En>She is playing</En> · <En>They are playing</En>
            </td>
          </tr>
          <tr className="border-b">
            <td className="py-1.5 pr-3 font-bold">Negativa</td>
            <td>
              <En>I'm not playing</En> · <En>She isn't playing</En> · <En>They aren't playing</En>
            </td>
          </tr>
          <tr>
            <td className="py-1.5 pr-3 font-bold">Pregunta</td>
            <td>
              <En>Are you playing?</En> · <En>Is she playing?</En>
            </td>
          </tr>
        </tbody>
      </table>
    ),
    visual: (
      <div className="space-y-1 p-3 text-lg">
        <p className="font-bold">am / is / are + verbo‑ing</p>
        <p>
          play → playing · writ<s>e</s> → writ<b className="text-rose-600">ing</b> · swi<b className="text-rose-600">mm</b>ing · ru<b className="text-rose-600">nn</b>ing
        </p>
        <p className="pt-2 font-bold">Palabras pista</p>
        <p>now, right now, at the moment, Look!, Listen!</p>
      </div>
    ),
  },
  {
    titulo: 'Verbos de estado',
    texto: (
      <>
        <p>
          Expresan gustos, sentimientos o lo que sabemos, no una acción: {b('love, like, hate, hear, understand, know')} (y también want, need).
        </p>
        <p>Van en Present Simple aunque se hable de ahora:</p>
        <p className="text-xl">
          ✅ <En>I hear him now.</En>
        </p>
        <p className="text-xl">
          ❌ <s>I am hearing him now.</s>
        </p>
        <p className="text-xl">
          ✅ <En>I understand English.</En> ❌ <s>I'm understanding English.</s>
        </p>
      </>
    ),
  },
]

/** Una frase con hueco: el tiempo que toca sale de la expresión de tiempo (o del verbo de estado). */
interface Hueco {
  frase: string
  verbo: Verbo
  correctas: string[]
  tiempo: 'simple' | 'continuo'
  neg: boolean
}

function crearHueco(): Hueco {
  const [suj, tercera] = azar(SUJETOS)
  const v = azar(VERBOS)
  const neg = Math.random() < 0.3
  const tiempo: 'simple' | 'continuo' = v.estado ? 'simple' : Math.random() < 0.5 ? 'simple' : 'continuo'
  const cuando = v.estado ? azar(['now', 'at the moment', 'every day', '']) : tiempo === 'simple' ? azar(SIMPLE_TIEMPO) : azar(CONTINUO_TIEMPO)
  const correctas = tiempo === 'simple' ? simple(v, tercera, neg) : continuo(v, suj, tercera, neg)
  const frase = `${suj} ___ (${neg ? 'not / ' : ''}${v.base}) ${v.obj}${cuando ? ` ${cuando}` : ''}.`
  return { frase, verbo: v, correctas, tiempo, neg }
}

function porque(h: Hueco) {
  if (h.verbo.estado) return <>«{h.verbo.base}» es un verbo de estado: va en Present Simple aunque sea ahora.</>
  return h.tiempo === 'simple' ? <>Es una rutina o un hábito: Present Simple.</> : <>Está pasando ahora: Present Continuous.</>
}

function preguntaEscribe(): Pregunta {
  const h = crearHueco()
  return { tipo: 'escribe', texto: <span lang="en">{h.frase}</span>, respostas: h.correctas, explica: porque(h) }
}

/** Elegir entre la forma simple y la continua del mismo verbo. */
function preguntaElige(): Pregunta {
  const h = crearHueco()
  const [suj, tercera] = SUJETOS.find(([s]) => h.frase.startsWith(s + ' ')) ?? ['He', true]
  const s = simple(h.verbo, tercera, h.neg)[0]
  const c = continuo(h.verbo, suj, tercera, h.neg)[0]
  const malTercera = h.neg ? (tercera ? `don't ${h.verbo.base}` : `doesn't ${h.verbo.base}`) : tercera ? h.verbo.base : h.verbo.s
  const boa = h.correctas[0]
  const outras = [...new Set([s, c, malTercera, `${be(suj, tercera)} ${h.verbo.base}`])].filter((x) => x !== boa).slice(0, 3)
  return elixe(<span lang="en">{h.frase}</span>, boa, outras, porque(h))
}

// Frases para clasificar por su expresión de tiempo o su verbo.
const CLASIFICAR: [string, 'simple' | 'continuo'][] = [
  ['I order pizza every weekend.', 'simple'],
  ["We aren't exercising right now.", 'continuo'],
  ['Do you often go out with friends?', 'simple'],
  ['Are you painting at the moment?', 'continuo'],
  ['I hear him now.', 'simple'],
  ['My dad usually drives me to school.', 'simple'],
  ['Look! It is snowing.', 'continuo'],
  ['She understands French.', 'simple'],
  ['They are watching a film now.', 'continuo'],
  ['He never eats meat.', 'simple'],
  ['Listen! The baby is crying.', 'continuo'],
  ['We play tennis on Saturdays.', 'simple'],
]

const fijas: Pregunta[] = [
  elixe('¿Qué tiempo usamos para hablar de hechos, rutinas y hábitos?', 'Present Simple', ['Present Continuous'], <>Regla 1 del ejercicio 9.</>),
  elixe('¿Qué tiempo usamos para acciones que están pasando ahora?', 'Present Continuous', ['Present Simple'], <>Regla 2 del ejercicio 9.</>),
  elixe('¿Con qué verbos no solemos usar el Present Continuous?', 'Verbos de estado: love, like, hate, hear, understand, know', ['Verbos de movimiento: run, walk, swim', 'Verbos irregulares: go, have, do'], <>Regla 3 del ejercicio 9.</>),
  elixe(<span lang="en">I ___ him now.</span>, 'hear', ['am hearing', 'hears', 'hearing'], <>«Hear» es de estado: I hear him now.</>),
  elixe(<span lang="en">___ you often go out with friends?</span>, 'Do', ['Are', 'Does', 'Is'], <>Con often, Present Simple: Do you often go out…?</>),
  elixe(<span lang="en">___ you painting at the moment?</span>, 'Are', ['Do', 'Is', 'Does'], <>Con -ing, el auxiliar es be: Are you painting…?</>),
  elixe(<span lang="en">We ___ exercising right now.</span>, "aren't", ["don't", "isn't", "doesn't"], <>Continuo negativo con we: aren't exercising.</>),
  ...CLASIFICAR.map(([f, t]) => elixe(<>«<span lang="en">{f}</span>» ¿Qué tiempo es?</>, t === 'simple' ? 'Present Simple' : 'Present Continuous', [t === 'simple' ? 'Present Continuous' : 'Present Simple'], t === 'simple' ? <>Hábito, hecho o verbo de estado.</> : <>Algo que pasa ahora.</>)),
]

export const PREGUNTAS: Pregunta[] = [...fijas, ...Array.from({ length: 12 }, preguntaElige), ...Array.from({ length: 12 }, preguntaEscribe)]

const XOGOS: Xogo[] = [
  {
    id: 'clasifica',
    titulo: '¿Simple o Continuous?',
    icono: '🗂️',
    explica: 'Mira la expresión de tiempo y el verbo.',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'simple', nome: 'Present Simple', cor: 'border-sky-300 bg-sky-100' },
          { id: 'continuo', nome: 'Present Continuous', cor: 'border-amber-300 bg-amber-100' },
        ]}
        elementos={barallar(CLASIFICAR)
          .slice(0, 8)
          .map(([texto, caixa]) => ({ texto, caixa, pista: caixa === 'simple' ? 'Hábito, hecho o verbo de estado: Present Simple.' : 'Está pasando ahora: Present Continuous.' }))}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'elige',
    titulo: 'Elige la forma',
    icono: '🎯',
    explica: 'Frases nuevas cada vez.',
    crear: (acabar) => <Proba practica cantas={10} preguntas={Array.from({ length: 10 }, preguntaElige)} acabar={acabar} />,
  },
  {
    id: 'escribe',
    titulo: 'Escribe el verbo',
    icono: '✍️',
    explica: 'Afirmativa o negativa, simple o continuous.',
    crear: (acabar) => <Proba practica cantas={10} preguntas={Array.from({ length: 10 }, preguntaEscribe)} acabar={acabar} />,
  },
  {
    id: 'vf',
    titulo: 'Verdadero o falso',
    icono: '✅',
    explica: 'Las reglas del ejercicio 9.',
    crear: (acabar) => (
      <VerdadeiroFalso
        frases={[
          { texto: '«I am knowing the answer» está bien.', certa: false, explica: 'Know es de estado: I know the answer.' },
          { texto: 'Con «every weekend» usamos el Present Simple.', certa: true, explica: 'Es una rutina.' },
          { texto: 'Con «at the moment» usamos el Present Continuous.', certa: true, explica: 'Algo que pasa ahora.' },
          { texto: 'En Present Simple, con he/she/it, el verbo lleva ‑s.', certa: true, explica: 'She plays, he watches.' },
          { texto: 'La negativa de «She plays» es «She don’t play».', certa: false, explica: "She doesn't play." },
          { texto: 'El Present Continuous se forma con am/is/are + verbo‑ing.', certa: true, explica: 'They are playing.' },
        ]}
        acabar={acabar}
      />
    ),
  },
]

export default function Presentes({ ruta, modo }: { ruta: string; modo?: string }) {
  return (
    <ParadaPrimaria
      ruta={ruta}
      titulo="Present Simple / Present Continuous"
      modo={modo}
      paneis={{
        descubre: <Tarxetas tarxetas={TARXETAS} xoga={`${ruta}/xoga`} />,
        xoga: <Xogos xogos={XOGOS} proba={`${ruta}/proba`} />,
        proba: <Proba id="ingles1/presentes" preguntas={PREGUNTAS} />,
      }}
    />
  )
}
