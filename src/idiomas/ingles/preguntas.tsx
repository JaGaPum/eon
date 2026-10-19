// Parada «Subject / Object questions» (página 21, ejercicio 7; las frases para practicar son las del ejercicio 8).
import { Clasifica, Fr as En, Ordena, ParadaPrimaria, Proba, Tarxetas, barallar, type Pregunta, type Tarxeta, type Xogo, Xogos } from '../../primaria/pezas'
import { elixe } from '../../primaria/paisaxes/preguntas'

const b = (t: string) => <b className="text-violet-800">{t}</b>

/** Una frase y sus dos preguntas: por el sujeto y por el objeto. */
interface Par {
  frase: string
  sujeto: string
  objeto: string
  pSuj: string
  pObj: string
}

export const PARES: Par[] = [
  { frase: 'Dan is driving the car.', sujeto: 'Dan', objeto: 'the car', pSuj: 'Who is driving the car?', pObj: 'What is Dan driving?' },
  { frase: 'Dan is driving his mother to work.', sujeto: 'Dan', objeto: 'his mother', pSuj: 'Who is driving his mother to work?', pObj: 'Who is Dan driving to work?' },
  { frase: 'Jess and James fly helicopters.', sujeto: 'Jess and James', objeto: 'helicopters', pSuj: 'Who flies helicopters?', pObj: 'What do Jess and James fly?' },
  { frase: 'Tom is reading a comic.', sujeto: 'Tom', objeto: 'a comic', pSuj: 'Who is reading a comic?', pObj: 'What is Tom reading?' },
  { frase: 'Sara loves pizza.', sujeto: 'Sara', objeto: 'pizza', pSuj: 'Who loves pizza?', pObj: 'What does Sara love?' },
  { frase: 'The cat eats fish.', sujeto: 'The cat', objeto: 'fish', pSuj: 'What eats fish?', pObj: 'What does the cat eat?' },
  { frase: 'My dad drives a red car.', sujeto: 'My dad', objeto: 'a red car', pSuj: 'Who drives a red car?', pObj: 'What does my dad drive?' },
  { frase: 'Lucy calls her grandmother every day.', sujeto: 'Lucy', objeto: 'her grandmother', pSuj: 'Who calls her grandmother every day?', pObj: 'Who does Lucy call every day?' },
  { frase: 'The boys are playing football.', sujeto: 'The boys', objeto: 'football', pSuj: 'Who is playing football?', pObj: 'What are the boys playing?' },
  { frase: 'Mark is helping his sister.', sujeto: 'Mark', objeto: 'his sister', pSuj: 'Who is helping his sister?', pObj: 'Who is Mark helping?' },
  { frase: 'A dog is chasing the ball.', sujeto: 'A dog', objeto: 'the ball', pSuj: 'What is chasing the ball?', pObj: 'What is the dog chasing?' },
  { frase: 'Emma watches films at the weekend.', sujeto: 'Emma', objeto: 'films', pSuj: 'Who watches films at the weekend?', pObj: 'What does Emma watch at the weekend?' },
]

// Ejercicio 8: escribir preguntas en Present Simple con las palabras dadas (y la respuesta de Fun Facts).
export const EJ8: { palabras: string; pregunta: string; tipo: 'sujeto' | 'objeto'; respuesta: string }[] = [
  { palabras: 'what / people / call / the London Underground', pregunta: 'What do people call the London Underground?', tipo: 'objeto', respuesta: 'The Tube.' },
  { palabras: 'what / come / from pubs', pregunta: 'What comes from pubs?', tipo: 'sujeto', respuesta: 'The names of some stations on the London Underground.' },
  { palabras: 'who / spend / a lot of time / in traffic', pregunta: 'Who spends a lot of time in traffic?', tipo: 'sujeto', respuesta: 'The average American.' },
  { palabras: 'what / the Shinkansen cleaners / do / in seven minutes', pregunta: 'What do the Shinkansen cleaners do in seven minutes?', tipo: 'objeto', respuesta: 'They clean the bullet trains.' },
  { palabras: 'who / give / petrol / to drivers in Turkmenistan', pregunta: 'Who gives petrol to drivers in Turkmenistan?', tipo: 'sujeto', respuesta: 'The government.' },
]

const TARXETAS: Tarxeta[] = [
  {
    titulo: 'Dos tipos de preguntas con Who y What',
    texto: (
      <>
        <p>
          Con <b>who</b> (quién) y <b>what</b> (qué) podemos preguntar por el {b('sujeto')} (quien hace la acción) o por el {b('objeto')} (a quién o qué le pasa).
        </p>
        <div className="space-y-1 rounded-2xl bg-white p-4 text-xl">
          <p>
            <b className="rounded bg-sky-100 px-1">Dan</b> is driving <b className="rounded bg-amber-100 px-1">his mother</b> to work.
          </p>
          <p>
            <En>Who is driving his mother to work?</En> <span className="text-base text-slate-500">→ Dan (sujeto)</span>
          </p>
          <p>
            <En>Who is Dan driving to work?</En> <span className="text-base text-slate-500">→ his mother (objeto)</span>
          </p>
        </div>
      </>
    ),
  },
  {
    titulo: 'Subject questions',
    texto: (
      <>
        <p>
          La palabra wh‑ {b('ocupa el lugar del sujeto')}. El resto de la frase se queda igual, {b('sin auxiliar')} (sin do/does).
        </p>
        <div className="space-y-1 rounded-2xl bg-white p-4 text-xl">
          <p>
            <s className="text-slate-400">Aeroplanes and helicopters</s> → <b>What</b> flies in the sky?
          </p>
          <p>
            <En>What flies in the sky?</En>
          </p>
          <p className="text-base text-slate-500">Aeroplanes and helicopters fly in the sky.</p>
        </div>
        <p className="text-base text-slate-600">
          💡 TIP del libro: en las subject questions el verbo va siempre en {b('tercera persona del singular')} (is, flies…), aunque la respuesta sea plural: <i>Who is driving to work today? — Jack and Sara are driving to work today.</i>
        </p>
      </>
    ),
  },
  {
    titulo: 'Object questions',
    texto: (
      <>
        <p>
          Preguntamos por el objeto. Como una pregunta normal: {b('el auxiliar va antes del sujeto')} (do/does, is/are).
        </p>
        <div className="space-y-1 rounded-2xl bg-white p-4 text-xl">
          <p>
            <b>What</b> <b className="text-rose-600">do</b> Jess and James fly?
          </p>
          <p>
            <En>What do Jess and James fly?</En>
          </p>
          <p className="text-base text-slate-500">They fly helicopters.</p>
        </div>
      </>
    ),
  },
  {
    titulo: 'Las reglas (ejercicio 7)',
    texto: (
      <ol className="list-decimal space-y-2 pl-6 text-xl">
        <li>
          In {b('object')} questions, the auxiliary verb comes before the subject.
        </li>
        <li>
          In {b('subject')} questions, the wh‑ word takes the place of the subject of the affirmative sentence.
        </li>
      </ol>
    ),
  },
]

const fichas = (s: string) => s.replace(/\?$/, '').split(' ').concat(['?'])

const preguntasPar: Pregunta[] = PARES.flatMap((p) => [
  elixe(<>«<span lang="en">{p.frase}</span>» Pregunta por <b>{p.sujeto}</b>:</>, p.pSuj, [p.pObj], <>Preguntamos por el sujeto: la wh‑ ocupa su lugar y no hay auxiliar.</>),
  elixe(<>«<span lang="en">{p.frase}</span>» Pregunta por <b>{p.objeto}</b>:</>, p.pObj, [p.pSuj], <>Preguntamos por el objeto: auxiliar antes del sujeto.</>),
  elixe(<>«<span lang="en">{p.pSuj}</span>» ¿Es subject u object question?</>, 'Subject question', ['Object question'], <>No hay auxiliar delante del sujeto: la wh‑ es el sujeto.</>),
  elixe(<>«<span lang="en">{p.pObj}</span>» ¿Es subject u object question?</>, 'Object question', ['Subject question'], <>El auxiliar va antes del sujeto ({p.sujeto.toLowerCase()}).</>),
])

export const PREGUNTAS: Pregunta[] = [
  ...preguntasPar,
  ...EJ8.map((e): Pregunta => ({
    tipo: 'escribe',
    texto: (
      <span>
        Escribe la pregunta (Present Simple): <b lang="en">{e.palabras}</b>
      </span>
    ),
    respostas: [e.pregunta, e.pregunta.replace(/\?$/, '')],
    explica: <>Es una {e.tipo === 'sujeto' ? 'subject question: sin do/does y el verbo con ‑s' : 'object question: con do/does delante del sujeto'}. Respuesta: {e.respuesta}</>,
  })),
  elixe('In object questions, the auxiliary verb…', 'comes before the subject', ['takes the place of the subject', 'is never used'], <>Regla 1.</>),
  elixe('In subject questions, the wh- word…', 'takes the place of the subject', ['comes after the auxiliary', 'goes at the end'], <>Regla 2.</>),
  elixe(<span lang="en">Who ___ to work today? — Jack and Sara are.</span>, 'is driving', ['are driving', 'do drive', 'does drive'], <>TIP: en subject questions, siempre tercera persona del singular.</>),
]

const XOGOS: Xogo[] = [
  {
    id: 'tipo',
    titulo: '¿Subject u object?',
    icono: '🗂️',
    explica: 'Clasifica cada pregunta.',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 's', nome: 'Subject question', cor: 'border-sky-300 bg-sky-100' },
          { id: 'o', nome: 'Object question', cor: 'border-amber-300 bg-amber-100' },
        ]}
        elementos={barallar(PARES)
          .slice(0, 5)
          .flatMap((p) => [
            { texto: p.pSuj, caixa: 's', pista: 'No lleva auxiliar delante del sujeto: es subject.' },
            { texto: p.pObj, caixa: 'o', pista: 'Lleva auxiliar antes del sujeto: es object.' },
          ])}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'elige',
    titulo: 'Pregunta por lo marcado',
    icono: '🎯',
    explica: '¿Por el sujeto o por el objeto?',
    crear: (acabar) => <Proba practica cantas={8} preguntas={preguntasPar.filter((_, i) => i % 4 < 2)} acabar={acabar} />,
  },
  {
    id: 'ordena',
    titulo: 'Ordena las preguntas del ejercicio 8',
    icono: '🧱',
    explica: 'Las de Fun Facts about Transport.',
    crear: (acabar) => <Ordena frases={EJ8.map((e) => ({ palabras: fichas(e.pregunta), traducion: e.palabras }))} acabar={acabar} />,
  },
  {
    id: 'escribe',
    titulo: 'Escribe las preguntas',
    icono: '✍️',
    explica: 'El ejercicio 8, escribiendo tú.',
    crear: (acabar) => <Proba practica cantas={5} preguntas={PREGUNTAS.filter((q) => q.tipo === 'escribe')} acabar={acabar} />,
  },
]

export default function Preguntas({ ruta, modo }: { ruta: string; modo?: string }) {
  return (
    <ParadaPrimaria
      ruta={ruta}
      titulo="Subject / Object questions"
      modo={modo}
      paneis={{
        descubre: <Tarxetas tarxetas={TARXETAS} xoga={`${ruta}/xoga`} />,
        xoga: <Xogos xogos={XOGOS} proba={`${ruta}/proba`} />,
        proba: <Proba id="ingles1/questions" preguntas={PREGUNTAS} />,
      }}
    />
  )
}
