// Parada «Poser des questions»: las cinco preguntas que entran en el examen, con est-ce que, y pourquoi / parce que.
import { Fr, Ordena, ParadaPrimaria, Proba, Tarxetas, Une, type Pregunta, type Tarxeta, type Xogo, Xogos } from '../../primaria/pezas'
import { elixe } from '../../primaria/paisaxes/preguntas'

interface Q {
  fr: string
  es: string
  resposta: string
  respostaEs: string
}

export const QUESTIONS: Q[] = [
  { fr: "Qu'est-ce que tu fais ?", es: '¿Qué haces?', resposta: 'Je dessine.', respostaEs: 'Dibujo.' },
  { fr: "Comment est-ce que tu t'appelles ?", es: '¿Cómo te llamas?', resposta: "Je m'appelle Mateo.", respostaEs: 'Me llamo Mateo.' },
  { fr: "Où est-ce que tu habites ?", es: '¿Dónde vives?', resposta: "J'habite en Galice.", respostaEs: 'Vivo en Galicia.' },
  { fr: 'Qui est ce garçon ?', es: '¿Quién es este chico?', resposta: "C'est mon frère.", respostaEs: 'Es mi hermano.' },
  { fr: 'Qui est cette fille ?', es: '¿Quién es esta chica?', resposta: "C'est ma cousine.", respostaEs: 'Es mi prima.' },
  { fr: 'Pourquoi est-ce que tu pleures ?', es: '¿Por qué lloras?', resposta: 'Parce que je suis malade.', respostaEs: 'Porque estoy enfermo.' },
]

const INTERROGATIVOS: [string, string][] = [
  ["qu'est-ce que", 'qué'],
  ['comment', 'cómo'],
  ['où', 'dónde'],
  ['qui', 'quién'],
  ['pourquoi', 'por qué'],
  ['parce que', 'porque (para responder)'],
]

const b = (t: string) => <b className="text-violet-800">{t}</b>

const Pregunta1 = ({ q }: { q: Q }) => (
  <div className="space-y-1 rounded-2xl bg-white p-4">
    <p className="text-2xl">
      <Fr>{q.fr}</Fr>
    </p>
    <p className="text-slate-500">{q.es}</p>
    <p className="pt-2 text-xl">
      — <Fr>{q.resposta}</Fr>
    </p>
    <p className="text-slate-500">{q.respostaEs}</p>
  </div>
)

const TARXETAS: Tarxeta[] = [
  {
    titulo: 'Poser des questions: preguntar',
    texto: (
      <>
        <p>
          En francés se pregunta muchas veces con {b('est-ce que')} detrás de la palabra interrogativa. No se traduce: solo indica que es una pregunta.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {INTERROGATIVOS.map(([fr, es]) => (
            <span key={fr} className="rounded-xl bg-white px-3 py-2 text-lg">
              <Fr>{fr}</Fr> <span className="text-slate-500">= {es}</span>
            </span>
          ))}
        </div>
      </>
    ),
  },
  {
    titulo: '¿Qué haces?',
    texto: (
      <>
        <Pregunta1 q={QUESTIONS[0]} />
        <p>
          Se responde con un verbo, como los de la ficha: <Fr>Je joue.</Fr> <Fr>Je mange.</Fr> <Fr>Je danse.</Fr>
        </p>
      </>
    ),
  },
  {
    titulo: '¿Cómo te llamas?',
    texto: (
      <>
        <Pregunta1 q={QUESTIONS[1]} />
        <p className="text-base text-slate-600">
          💡 <i>Comment</i> = cómo. Se responde con <i>Je m'appelle…</i>
        </p>
      </>
    ),
  },
  {
    titulo: '¿Dónde vives?',
    texto: (
      <>
        <Pregunta1 q={QUESTIONS[2]} />
        <p className="text-base text-slate-600">
          💡 <i>Où</i> (con acento) = dónde. <i>Ou</i> sin acento significa «o». Y fíjate: <i>j'habite</i>, porque habiter empieza por h.
        </p>
      </>
    ),
  },
  {
    titulo: '¿Quién es este chico o esta chica?',
    texto: (
      <>
        <Pregunta1 q={QUESTIONS[3]} />
        <Pregunta1 q={QUESTIONS[4]} />
        <p className="text-base text-slate-600">
          💡 Con <i>qui est</i> no hace falta est-ce que. <i>Ce</i> va con masculino (ce garçon) y <i>cette</i> con femenino (cette fille).
        </p>
      </>
    ),
  },
  {
    titulo: '¿Por qué? Porque…',
    texto: (
      <>
        <Pregunta1 q={QUESTIONS[5]} />
        <p>
          Se pregunta con {b('pourquoi')} y se responde con {b('parce que')}.
        </p>
        <p className="text-base text-slate-600">
          💡 Igual que en castellano: «¿por qué?» se escribe separado y «porque», junto. En francés, al revés: <i>pourquoi</i> junto y <i>parce que</i> separado.
        </p>
      </>
    ),
  },
]

/** La pregunta en palabras para ordenar; «?» va como una ficha más. */
const fichas = (s: string) => s.replace(' ?', '').split(' ').concat(s.endsWith('?') ? ['?'] : [])

const XOGOS: Xogo[] = [
  {
    id: 'responde',
    titulo: 'Pregunta y respuesta',
    icono: '💬',
    explica: 'Une cada pregunta con su respuesta.',
    crear: (acabar) => <Une pares={QUESTIONS.map((q) => ({ palabra: q.fr, significado: q.resposta }))} acabar={acabar} />,
  },
  {
    id: 'interrogativos',
    titulo: '¿Qué significa?',
    icono: '🔗',
    explica: 'Une cada palabra para preguntar con su significado.',
    crear: (acabar) => <Une pares={INTERROGATIVOS.map(([palabra, significado]) => ({ palabra, significado }))} acabar={acabar} />,
  },
  {
    id: 'ordena',
    titulo: 'Ordena la pregunta',
    icono: '🧱',
    explica: 'Toca las palabras en el orden correcto.',
    crear: (acabar) => <Ordena frases={QUESTIONS.map((q) => ({ palabras: fichas(q.fr), traducion: q.es }))} acabar={acabar} />,
  },
  {
    id: 'que-preguntas',
    titulo: '¿Qué pregunta usarías?',
    icono: '🤔',
    explica: 'Elige la pregunta adecuada para cada situación.',
    crear: (acabar) => <Proba practica cantas={6} preguntas={SITUACIONS} acabar={acabar} />,
  },
]

const SITUACIONS: Pregunta[] = [
  elixe('Quieres saber el nombre de alguien.', "Comment est-ce que tu t'appelles ?", ["Où est-ce que tu habites ?", "Qu'est-ce que tu fais ?", 'Pourquoi est-ce que tu pleures ?'], <>Comment = cómo: ¿cómo te llamas?</>),
  elixe('Quieres saber dónde vive.', 'Où est-ce que tu habites ?', ["Comment est-ce que tu t'appelles ?", 'Qui est ce garçon ?', "Qu'est-ce que tu fais ?"], <>Où = dónde.</>),
  elixe('Quieres saber qué está haciendo.', "Qu'est-ce que tu fais ?", ['Pourquoi est-ce que tu pleures ?', 'Où est-ce que tu habites ?', 'Qui est cette fille ?'], <>Qu'est-ce que = qué.</>),
  elixe('Ves a un chico y quieres saber quién es.', 'Qui est ce garçon ?', ['Qui est cette fille ?', "Comment est-ce que tu t'appelles ?", 'Où est-ce que tu habites ?'], <>Qui = quién; ce garçon (masculino).</>),
  elixe('Ves a una chica y quieres saber quién es.', 'Qui est cette fille ?', ['Qui est ce garçon ?', "Qu'est-ce que tu fais ?", 'Pourquoi est-ce que tu pleures ?'], <>Cette fille (femenino).</>),
  elixe('Tu amigo está llorando y quieres saber el motivo.', 'Pourquoi est-ce que tu pleures ?', ["Qu'est-ce que tu fais ?", 'Où est-ce que tu habites ?', 'Qui est ce garçon ?'], <>Pourquoi = por qué. Se responde con parce que.</>),
]

export const PREGUNTAS: Pregunta[] = [
  ...SITUACIONS,
  ...QUESTIONS.map((q) =>
    elixe(
      <>¿Qué significa <span lang="fr">«{q.fr}»</span>?</>,
      q.es,
      QUESTIONS.filter((x) => x !== q)
        .slice(0, 3)
        .map((x) => x.es),
      <>{q.es}</>,
      undefined,
    ),
  ),
  ...QUESTIONS.map((q) =>
    elixe(
      <span lang="fr">{q.fr}</span>,
      q.resposta,
      QUESTIONS.filter((x) => x.resposta !== q.resposta)
        .slice(0, 3)
        .map((x) => x.resposta),
      <>
        {q.fr} — {q.resposta}
      </>,
    ),
  ),
  ...INTERROGATIVOS.map(([fr, es]) =>
    elixe(
      <>¿Cómo se dice «{es.replace(' (para responder)', '')}»?</>,
      fr,
      INTERROGATIVOS.filter(([f]) => f !== fr)
        .slice(0, 3)
        .map(([f]) => f),
      <>
        {es} = {fr}.
      </>,
    ),
  ),
  {
    tipo: 'escribe',
    texto: <>Completa: «Pourquoi est-ce que tu pleures ? — ______ je suis malade.»</>,
    respostas: ['parce que', "parce qu'"],
  },
  {
    tipo: 'escribe',
    texto: <>Completa: «______ est-ce que tu habites ?» (¿Dónde vives?)</>,
    respostas: ['où'],
  },
  {
    tipo: 'escribe',
    texto: <>Completa: «Comment est-ce que tu t'______ ?» (¿Cómo te llamas?)</>,
    respostas: ['appelles'],
  },
]

export default function Questions({ ruta, modo }: { ruta: string; modo?: string }) {
  return (
    <ParadaPrimaria
      ruta={ruta}
      titulo="Poser des questions"
      modo={modo}
      paneis={{
        descubre: <Tarxetas tarxetas={TARXETAS} xoga={`${ruta}/xoga`} />,
        xoga: <Xogos xogos={XOGOS} proba={`${ruta}/proba`} />,
        proba: <Proba id="frances1/questions" preguntas={PREGUNTAS} />,
      }}
    />
  )
}
