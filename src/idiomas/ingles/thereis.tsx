// Parada «There is / There are, articles and quantifiers» (página 17, ejercicio 8; práctica de los ejercicios 9 y 10).
import { Clasifica, Fr as En, ParadaPrimaria, Proba, Tarxetas, barallar, type Pregunta, type Tarxeta, type Xogo, Xogos } from '../../primaria/pezas'
import { elixe } from '../../primaria/paisaxes/preguntas'

const b = (t: string) => <b className="text-violet-800">{t}</b>
const azar = <T,>(xs: readonly T[]) => xs[Math.floor(Math.random() * xs.length)]

const SINGULARES = ['bridge', 'castle', 'park', 'museum', 'church', 'cinema', 'airport', 'outdoor market', 'old church', 'ice rink', 'underground station']
const PLURALES = ['playgrounds', 'buildings', 'shops', 'trees', 'cars', 'birds', 'stop signs', 'roundabouts', 'petrol stations', 'statues']
const INCONTABLES = ['time', 'food', 'bread', 'water', 'snow', 'traffic', 'money', 'milk']

const conArtigo = (n: string) => `${/^[aeiou]/.test(n) ? 'an' : 'a'} ${n}`

const TARXETAS: Tarxeta[] = [
  {
    titulo: 'There is / There are',
    texto: (
      <>
        <p>
          Sirven para decir lo que {b('hay')}. <b>There is</b> con singular e incontables; <b>there are</b> con plural.
        </p>
        <table className="w-full text-lg">
          <tbody>
            <tr className="border-b">
              <td className="py-1.5 pr-2 font-bold">+</td>
              <td>
                <En>There is a bridge.</En> <En>There are some playgrounds.</En>
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-1.5 pr-2 font-bold">−</td>
              <td>
                <En>There isn't a castle.</En> <En>There aren't any buildings.</En>
              </td>
            </tr>
            <tr>
              <td className="py-1.5 pr-2 font-bold">?</td>
              <td>
                <En>Is there an outdoor market?</En> — Yes, there is. / No, there isn't.
                <br />
                <En>Are there any stop signs?</En> — Yes, there are. / No, there aren't.
              </td>
            </tr>
          </tbody>
        </table>
      </>
    ),
  },
  {
    titulo: 'Countable nouns (contables)',
    texto: (
      <div className="space-y-2 text-lg">
        <p>
          <En>There is a bridge.</En>
        </p>
        <p>
          There are <b>some / many / a lot of / lots of / a few</b> playgrounds.
        </p>
        <p>
          There aren't <b>any / many / a lot of / lots of</b> buildings.
        </p>
        <p>
          Are there <b>any / many / a lot of / lots of / a few</b> stop signs?
        </p>
      </div>
    ),
  },
  {
    titulo: 'Uncountable nouns (incontables)',
    texto: (
      <div className="space-y-2 text-lg">
        <p>
          There is <b>some / a lot of / lots of / a little</b> time.
        </p>
        <p>
          There isn't <b>any / much / a lot of / lots of</b> food.
        </p>
        <p>
          Is there <b>any / much / a lot of / lots of / a little</b> bread?
        </p>
        <p className="text-base text-slate-600">
          💡 TIP: usamos {b('the')} para algo concreto: <i>There's a blue car outside. The car is Tom's.</i>
        </p>
      </div>
    ),
  },
  {
    titulo: 'Las reglas (ejercicio 8)',
    texto: (
      <div className="space-y-3 text-lg">
        <p className="font-bold">A.</p>
        <ol className="list-decimal space-y-1 pl-6">
          <li>
            We use <i>a</i> and <i>an</i> with {b('singular')} nouns. (<i>an</i> delante de sonido de vocal: an airport.)
          </li>
          <li>
            We use {b('some')} with affirmative sentences and {b('any')} with negative and interrogative sentences.
          </li>
        </ol>
        <p className="font-bold">B.</p>
        <ol className="list-decimal space-y-1 pl-6">
          <li>
            We use {b('many')} and {b('a few')} only with countable nouns.
          </li>
          <li>
            We use {b('much')} and {b('a little')} only with uncountable nouns.
          </li>
          <li>
            We use {b('a lot of')} and {b('lots of')} with countable and uncountable nouns.
          </li>
        </ol>
      </div>
    ),
  },
]

// Ejercicio 9 del libro: forma de there is/are y cuantificador.
export const EJ9: [string, string, string[], string][] = [
  ['___ roundabouts in this town.', 'There are a lot of', ['There is much', 'There is a little', 'There are much'], 'Roundabouts es contable y plural: there are a lot of.'],
  ['___ time. Please hurry.', "There isn't much", ['There are a few', 'There is some', "There aren't much"], 'Time es incontable y «date prisa» indica que hay poco: there isn’t much time.'],
  ['___ petrol stations near here?', 'Are there any', ['Is there an', 'Are there some', 'Is there any'], 'Pregunta con plural: are there any.'],
  ['___ only ___ water in my bottle, but you can have it.', 'There is … a little', ['There are … a few', 'There is … lots of', 'There are … a little'], 'Water es incontable y «only» indica poca: there is only a little water.'],
  ['___ playgrounds nearby, but this is the nicest one.', 'There are a few', ["There isn't much", "There aren't any", 'There is a few'], 'Hay algunos («this is the nicest one»): there are a few playgrounds.'],
  ['___ outdoor market in this town?', 'Is there an', ['Is there a', 'Are there some', 'Is there some'], 'Market es singular y «outdoor» empieza por vocal: is there an outdoor market?'],
]

// Ejercicio 10, The Gate to Hell (los huecos que se leen en la foto).
export const EJ10: [string, string, string[]][] = [
  ['___ many beautiful sights in Turkey.', 'There are', ['There is', "There isn't"]],
  ["One place doesn't appear in ___ adverts at tourist information centres.", 'many', ['much', 'a']],
  ["It's ___ cave at the location of an ancient city.", 'a', ['an', 'some']],
  ['…at the location of ___ ancient city called Hierapolis.', 'an', ['a', 'some']],
  ['Its historical name is Plutonium, after Pluto, ___ ancient Roman god of the underworld.', 'the', ['a', 'any']],
  ['There is ___ dangerous gas inside The Gate to Hell.', 'a lot of', ['any', 'the']],
  ['…and even ___ gas can kill animals.', 'a little', ['a few', 'much']],
  ["Today, there aren't ___ animal sacrifices.", 'any', ['some', 'a']],
  ["There aren't usually ___ people there.", 'many', ['some', 'much']],
  ['…only ___ archaeologists.', 'a few', ['a little', 'much']],
]

/** Ejercicios nuevos: cada plantilla tiene una sola respuesta posible según la regla. */
function nuevaPregunta(): Pregunta {
  const t = azar(['a', 'some', 'any', 'anyQ', 'many', 'much', 'afew', 'alittle', 'thereis'] as const)
  if (t === 'a') {
    const n = azar(SINGULARES)
    const c = conArtigo(n).split(' ')[0]
    return elixe(<span lang="en">There is ___ {n}.</span>, c, [c === 'a' ? 'an' : 'a', 'some'], <>Singular: a/an. «{n}» empieza por {c === 'an' ? 'vocal: an' : 'consonante: a'}.</>)
  }
  if (t === 'some') {
    const n = azar([...PLURALES, ...INCONTABLES])
    const pl = PLURALES.includes(n)
    return elixe(<span lang="en">There {pl ? 'are' : 'is'} ___ {n}.</span>, 'some', ['any', pl ? 'much' : 'a few'], <>Afirmativa: some.</>)
  }
  if (t === 'any') {
    const n = azar([...PLURALES, ...INCONTABLES])
    const pl = PLURALES.includes(n)
    return elixe(<span lang="en">There {pl ? "aren't" : "isn't"} ___ {n}.</span>, 'any', ['some', 'a'], <>Negativa: any.</>)
  }
  if (t === 'anyQ') {
    const n = azar([...PLURALES, ...INCONTABLES])
    const pl = PLURALES.includes(n)
    return elixe(<span lang="en">{pl ? 'Are' : 'Is'} there ___ {n}?</span>, 'any', ['some', 'a'], <>Pregunta: any.</>)
  }
  if (t === 'many') {
    const n = azar(PLURALES)
    return elixe(<span lang="en">There aren't ___ {n}.</span>, 'many', ['much', 'a little'], <>«{n}» es contable: many.</>)
  }
  if (t === 'much') {
    const n = azar(INCONTABLES)
    return elixe(<span lang="en">There isn't ___ {n}.</span>, 'much', ['many', 'a few'], <>«{n}» es incontable: much.</>)
  }
  if (t === 'afew') {
    const n = azar(PLURALES)
    return elixe(<span lang="en">There are ___ {n}.</span>, 'a few', ['a little', 'much'], <>Contable: a few.</>)
  }
  if (t === 'alittle') {
    const n = azar(INCONTABLES)
    return elixe(<span lang="en">There is ___ {n}.</span>, 'a little', ['a few', 'many'], <>Incontable: a little.</>)
  }
  const op = azar(['sing', 'pl', 'inc'] as const)
  const n = op === 'sing' ? conArtigo(azar(SINGULARES)) : op === 'pl' ? `some ${azar(PLURALES)}` : `some ${azar(INCONTABLES)}`
  const c = op === 'pl' ? 'There are' : 'There is'
  return elixe(<span lang="en">___ {n} in my town.</span>, c, [c === 'There is' ? 'There are' : 'There is'], <>{op === 'pl' ? 'Plural: there are.' : op === 'sing' ? 'Singular: there is.' : 'Incontable: there is.'}</>)
}

const ej9 = EJ9.map(([f, c, o, e]) => elixe(<span lang="en">{f}</span>, c, o, <>{e}</>))
const ej10 = EJ10.map(([f, c, o]) => elixe(<span lang="en">The Gate to Hell: {f}</span>, c, o, <>Ejercicio 10: {c}.</>))

export const PREGUNTAS: Pregunta[] = [
  ...ej9,
  ...ej10,
  ...Array.from({ length: 16 }, nuevaPregunta),
  elixe('We use a and an with…', 'singular nouns', ['plural nouns', 'uncountable nouns'], <>Regla A1.</>),
  elixe('We use some with ___ sentences.', 'affirmative', ['negative and interrogative', 'only interrogative'], <>Regla A2: some en afirmativas, any en negativas y preguntas.</>),
  elixe('We use many and a few only with…', 'countable nouns', ['uncountable nouns', 'countable and uncountable nouns'], <>Regla B1.</>),
  elixe('We use much and a little only with…', 'uncountable nouns', ['countable nouns', 'countable and uncountable nouns'], <>Regla B2.</>),
  elixe('We use a lot of and lots of with…', 'countable and uncountable nouns', ['only countable nouns', 'only uncountable nouns'], <>Regla B3.</>),
]

const CUANT: [string, 'c' | 'u' | 'b'][] = [
  ['many', 'c'],
  ['a few', 'c'],
  ['much', 'u'],
  ['a little', 'u'],
  ['a lot of', 'b'],
  ['lots of', 'b'],
]

const XOGOS: Xogo[] = [
  {
    id: 'ej9',
    titulo: 'Ejercicio 9 del libro',
    icono: '📘',
    explica: 'There is/are y el cuantificador.',
    crear: (acabar) => <Proba practica cantas={6} preguntas={ej9} acabar={acabar} />,
  },
  {
    id: 'ej10',
    titulo: 'The Gate to Hell (ejercicio 10)',
    icono: '🔥',
    explica: 'Elige la palabra correcta del texto.',
    crear: (acabar) => <Proba practica cantas={10} preguntas={ej10} acabar={acabar} />,
  },
  {
    id: 'cuant',
    titulo: '¿Contables, incontables o los dos?',
    icono: '🗂️',
    explica: 'La regla B del ejercicio 8.',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'c', nome: 'Solo contables', cor: 'border-sky-300 bg-sky-100' },
          { id: 'u', nome: 'Solo incontables', cor: 'border-amber-300 bg-amber-100' },
          { id: 'b', nome: 'Los dos', cor: 'border-violet-300 bg-violet-100' },
        ]}
        elementos={barallar(CUANT).map(([texto, caixa]) => ({ texto, caixa }))}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'nuevos',
    titulo: 'Ejercicios nuevos',
    icono: '🎯',
    explica: 'a/an, some/any, much/many, a few/a little…',
    crear: (acabar) => <Proba practica cantas={10} preguntas={Array.from({ length: 10 }, nuevaPregunta)} acabar={acabar} />,
  },
]

export default function ThereIs({ ruta, modo }: { ruta: string; modo?: string }) {
  return (
    <ParadaPrimaria
      ruta={ruta}
      titulo="There is / There are, articles and quantifiers"
      modo={modo}
      paneis={{
        descubre: <Tarxetas tarxetas={TARXETAS} xoga={`${ruta}/xoga`} />,
        xoga: <Xogos xogos={XOGOS} proba={`${ruta}/proba`} />,
        proba: <Proba id="ingles1/thereis" preguntas={PREGUNTAS} />,
      }}
    />
  )
}
