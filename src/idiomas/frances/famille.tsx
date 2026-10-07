// Parada «La famille»: el vocabulario del póster de clase, el árbol familiar y mon, ma, mes.
import { Busca, Fr, fala, ParadaPrimaria, Proba, Tarxetas, Une, barallar, type Debuxo, type Pregunta, type Tarxeta, type Xogo, Xogos } from '../../primaria/pezas'
import { elixe, toca } from '../../primaria/paisaxes/preguntas'
import { Arbore, NOMES_FAMILIA } from './debuxos'

const ArboreXogo: Debuxo = (p) => <Arbore {...p} />

/** Masculino, femenino y lo que significan. */
export const PARELLAS: [string, string, string][] = [
  ['le grand-père', 'la grand-mère', 'abuelo / abuela'],
  ['le père', 'la mère', 'padre / madre'],
  ['le papa', 'la maman', 'papá / mamá'],
  ['le fils', 'la fille', 'hijo / hija'],
  ['le frère', 'la sœur', 'hermano / hermana'],
  ["l'oncle", 'la tante', 'tío / tía'],
  ['le cousin', 'la cousine', 'primo / prima'],
  ['le neveu', 'la nièce', 'sobrino / sobrina'],
  ['le petit-fils', 'la petite-fille', 'nieto / nieta'],
  ['le mari', 'la femme', 'marido / mujer (esposa)'],
  ['le beau-père', 'la belle-mère', 'padrastro / madrastra'],
  ['le beau-fils', 'la belle-fille', 'hijastro / hijastra'],
  ['le garçon', 'la fille', 'chico / chica'],
]

/** Cada palabra suelta con su significado, para unir y para la prueba. */
const PALABRAS: [string, string][] = [
  ['le grand-père', 'el abuelo'],
  ['la grand-mère', 'la abuela'],
  ['les grands-parents', 'los abuelos'],
  ['le père', 'el padre'],
  ['la mère', 'la madre'],
  ['les parents', 'los padres'],
  ['le fils', 'el hijo'],
  ['la fille', 'la hija / la chica'],
  ['les enfants', 'los hijos / los niños'],
  ['le frère', 'el hermano'],
  ['la sœur', 'la hermana'],
  ["l'oncle", 'el tío'],
  ['la tante', 'la tía'],
  ['le cousin', 'el primo'],
  ['la cousine', 'la prima'],
  ['le neveu', 'el sobrino'],
  ['la nièce', 'la sobrina'],
  ['le petit-fils', 'el nieto'],
  ['la petite-fille', 'la nieta'],
  ['le mari', 'el marido'],
  ['la femme', 'la mujer / la esposa'],
  ['le beau-père', 'el padrastro'],
  ['la belle-mère', 'la madrastra'],
  ['le bébé', 'el bebé'],
  ['le garçon', 'el chico'],
]

/** Adivinanzas sobre el árbol: «la mère de ma mère» es «ma grand-mère». */
const ADIVINANZAS: [string, string, string[]][] = [
  ['La mère de ma mère, c’est ma…', 'grand-mère', ['tante', 'cousine', 'sœur']],
  ['Le père de ma mère, c’est mon…', 'grand-père', ['oncle', 'cousin', 'frère']],
  ['Le frère de ma mère, c’est mon…', 'oncle', ['cousin', 'grand-père', 'neveu']],
  ['Le fils de mon oncle, c’est mon…', 'cousin', ['frère', 'neveu', 'fils']],
  ['La fille de mon oncle, c’est ma…', 'cousine', ['sœur', 'nièce', 'tante']],
  ['La femme de mon oncle, c’est ma…', 'tante', ['mère', 'cousine', 'grand-mère']],
  ['Le mari de ma mère, c’est mon…', 'père', ['oncle', 'grand-père', 'frère']],
  ['Le fils de mon frère, c’est mon…', 'neveu', ['cousin', 'fils', 'oncle']],
  ['La fille de ma sœur, c’est ma…', 'nièce', ['cousine', 'tante', 'fille']],
  ['Le fils de mon fils, c’est mon…', 'petit-fils', ['neveu', 'frère', 'cousin']],
  ['Le père et la mère, ce sont les…', 'parents', ['grands-parents', 'enfants', 'cousins']],
  ['Les parents de mes parents, ce sont mes…', 'grands-parents', ['oncles', 'cousins', 'enfants']],
]

const b = (t: string) => <b className="text-violet-800">{t}</b>

const TARXETAS: Tarxeta[] = [
  {
    titulo: 'La famille: mi familia',
    texto: (
      <>
        <p>
          Este es el árbol de la familia visto desde {b('moi')} (yo), el del círculo amarillo.
        </p>
        <p>Toca a cada persona para oír cómo se dice.</p>
        <p className="text-base text-slate-600">
          💡 <i>Les grands-parents</i> son los abuelos, y <i>les parents</i>, los padres.
        </p>
      </>
    ),
    visual: <ArboreSonoro />,
  },
  {
    titulo: 'Los abuelos, los padres y los hijos',
    texto: (
      <div className="grid gap-2">
        {PARELLAS.slice(0, 4).map(([m, f, es]) => (
          <p key={m} className="rounded-xl bg-white px-3 py-2 text-lg">
            <Fr>{m}</Fr> · <Fr>{f}</Fr> <span className="block text-base text-slate-500">{es}</span>
          </p>
        ))}
        <p className="text-base text-slate-600">
          💡 <i>La fille</i> significa «la hija» y también «la chica».
        </p>
      </div>
    ),
  },
  {
    titulo: 'Hermanos, tíos y primos',
    texto: (
      <div className="grid gap-2">
        {PARELLAS.slice(4, 9).map(([m, f, es]) => (
          <p key={m} className="rounded-xl bg-white px-3 py-2 text-lg">
            <Fr>{m}</Fr> · <Fr>{f}</Fr> <span className="block text-base text-slate-500">{es}</span>
          </p>
        ))}
        <p className="text-base text-slate-600">
          💡 El femenino de <i>cousin</i> se forma añadiendo ‑e: <i>cousine</i>. Pero <i>frère → sœur</i> y <i>oncle → tante</i> son palabras distintas.
        </p>
      </div>
    ),
  },
  {
    titulo: 'Marido, mujer y la familia nueva',
    texto: (
      <div className="grid gap-2">
        {PARELLAS.slice(9).map(([m, f, es]) => (
          <p key={m} className="rounded-xl bg-white px-3 py-2 text-lg">
            <Fr>{m}</Fr> · <Fr>{f}</Fr> <span className="block text-base text-slate-500">{es}</span>
          </p>
        ))}
        <p>
          Y además: <Fr>le bébé</Fr> (el bebé), <Fr>l'enfant</Fr> (el niño, la niña), <Fr>les enfants</Fr> (los hijos, los niños).
        </p>
      </div>
    ),
  },
  {
    titulo: 'Mon, ma, mes: mi, mis',
    texto: (
      <>
        <p>Para decir «mi» en francés depende de la palabra:</p>
        <ul className="space-y-2">
          <li>
            {b('mon')} + masculino: <Fr>mon père</Fr>, <Fr>mon frère</Fr>, <Fr>mon oncle</Fr>
          </li>
          <li>
            {b('ma')} + femenino: <Fr>ma mère</Fr>, <Fr>ma sœur</Fr>, <Fr>ma tante</Fr>
          </li>
          <li>
            {b('mes')} + plural: <Fr>mes parents</Fr>, <Fr>mes cousins</Fr>
          </li>
        </ul>
        <p>
          Sirve para las adivinanzas: <Fr>La mère de ma mère, c'est ma grand-mère.</Fr>
        </p>
      </>
    ),
  },
]

/** El árbol de la tarjeta: con etiquetas y, al tocar a alguien, se oye su nombre. */
function ArboreSonoro() {
  return <Arbore etiquetas onToca={(id) => fala(NOMES_FAMILIA[id])} />
}

const adivinanza = ([texto, boa, outras]: [string, string, string[]]): Pregunta =>
  elixe(
    <span lang="fr">{texto}</span>,
    boa,
    outras,
    <span lang="fr">
      {texto.replace('…', '')} {boa}.
    </span>,
    undefined,
  )

const XOGOS: Xogo[] = [
  {
    id: 'arbore',
    titulo: '¿Dónde está?',
    icono: '🌳',
    explica: 'Toca en el árbol a la persona que te pida.',
    crear: (acabar) => <Busca Debuxo={ArboreXogo} nomes={NOMES_FAMILIA} obxectivos={Object.keys(NOMES_FAMILIA).filter((id) => id !== 'moi')} acabar={acabar} />,
  },
  {
    id: 'escoita',
    titulo: 'Escucha y toca',
    icono: '👂',
    explica: 'Oyes la palabra en francés y tocas a la persona.',
    crear: (acabar) => <Busca escoita Debuxo={ArboreXogo} nomes={NOMES_FAMILIA} obxectivos={Object.keys(NOMES_FAMILIA).filter((id) => id !== 'moi')} acabar={acabar} />,
  },
  {
    id: 'significado',
    titulo: '¿Qué significa?',
    icono: '🔗',
    explica: 'Une cada palabra con su significado.',
    crear: (acabar) => <Une pares={barallar(PALABRAS).slice(0, 7).map(([palabra, significado]) => ({ palabra, significado }))} acabar={acabar} />,
  },
  {
    id: 'parellas',
    titulo: 'Masculino y femenino',
    icono: '👫',
    explica: 'Une cada palabra con su pareja femenina.',
    crear: (acabar) => <Une pares={barallar(PARELLAS.filter(([m]) => m !== 'le garçon')).slice(0, 7).map(([palabra, significado]) => ({ palabra, significado }))} acabar={acabar} />,
  },
  {
    id: 'adivinanzas',
    titulo: 'Qui est-ce?',
    icono: '🧩',
    explica: 'Adivinanzas: «la mère de ma mère, c’est ma…».',
    crear: (acabar) => <Proba practica cantas={8} preguntas={ADIVINANZAS.map(adivinanza)} acabar={acabar} />,
  },
]

export const PREGUNTAS: Pregunta[] = [
  ...ADIVINANZAS.map(adivinanza),
  ...PALABRAS.slice(0, 22).map(([fr, es]) =>
    elixe(
      <>¿Qué significa <span lang="fr">«{fr}»</span>?</>,
      es,
      barallar(PALABRAS.filter(([f]) => f !== fr))
        .slice(0, 3)
        .map(([, e]) => e),
      <>
        {fr} = {es}.
      </>,
      undefined,
    ),
  ),
  ...PARELLAS.slice(0, 11).map(
    ([m, f, es]): Pregunta => ({
      tipo: 'escribe',
      texto: (
        <span>
          Escribe el femenino de <b lang="fr">{m}</b> <span className="text-base font-semibold text-slate-500">({es.split(' / ')[0]})</span>
        </span>
      ),
      respostas: [f, f.replace(/^(le|la|l') ?/, '')],
    }),
  ),
  ...['grandpere', 'mere', 'oncle', 'tante', 'cousin', 'cousine', 'soeur'].map((id) =>
    toca(<>Toca: {NOMES_FAMILIA[id]}</>, ArboreXogo, NOMES_FAMILIA, id, <>Es {NOMES_FAMILIA[id]}.</>, NOMES_FAMILIA[id]),
  ),
]

export default function Famille({ ruta, modo }: { ruta: string; modo?: string }) {
  return (
    <ParadaPrimaria
      ruta={ruta}
      titulo="La famille"
      modo={modo}
      paneis={{
        descubre: <Tarxetas tarxetas={TARXETAS} xoga={`${ruta}/xoga`} />,
        xoga: <Xogos xogos={XOGOS} proba={`${ruta}/proba`} />,
        proba: <Proba id="frances1/famille" preguntas={PREGUNTAS} />,
      }}
    />
  )
}
