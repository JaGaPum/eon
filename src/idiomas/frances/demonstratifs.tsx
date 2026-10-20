// Parada «Les vêtements et les démonstratifs»: ce, cet, cette, ces con la ropa de la página 13 del libro y el
// diálogo de la página 15. La regla es la de la profesora: un → ce (cet delante de vocal o h), une → cette siempre, des → ces siempre.
import { Clasifica, Fr, ParadaPrimaria, Proba, Tarxetas, Une, barallar, type Pregunta, type Tarxeta, type Xogo, Xogos } from '../../primaria/pezas'
import { elixe } from '../../primaria/paisaxes/preguntas'

interface Roupa {
  /** Con su artículo indefinido: «un pantalon», «une jupe», «des chaussures». */
  fr: string
  es: string
  icono: string
  /** El grupo del vocabulario del libro. */
  grupo?: string
}

// El vocabulario «Les vêtements» de la página 13, con sus grupos.
export const GRUPOS_ROUPA = ['Partie supérieure', 'Partie inférieure', 'Partie supérieure + inférieure', 'Aux pieds', 'Accessoires']
export const ROUPA: Roupa[] = [
  { fr: 'un tee-shirt', es: 'una camiseta', icono: '👕', grupo: 'Partie supérieure' },
  { fr: 'une chemise', es: 'una camisa', icono: '👔', grupo: 'Partie supérieure' },
  { fr: 'un sweat', es: 'una sudadera', icono: '🧥', grupo: 'Partie supérieure' },
  { fr: 'un pull', es: 'un jersey', icono: '🧶', grupo: 'Partie supérieure' },
  { fr: 'une veste', es: 'una chaqueta', icono: '🧥', grupo: 'Partie supérieure' },
  { fr: 'un blouson', es: 'una cazadora', icono: '🧥', grupo: 'Partie supérieure' },
  { fr: 'un anorak', es: 'un anorak', icono: '🧥', grupo: 'Partie supérieure' },
  { fr: 'un short', es: 'un pantalón corto', icono: '🩳', grupo: 'Partie inférieure' },
  { fr: 'une jupe', es: 'una falda', icono: '👗', grupo: 'Partie inférieure' },
  { fr: 'un pantalon', es: 'un pantalón', icono: '👖', grupo: 'Partie inférieure' },
  { fr: 'un jean', es: 'unos vaqueros', icono: '👖', grupo: 'Partie inférieure' },
  { fr: 'des leggings', es: 'unos leggings', icono: '👖', grupo: 'Partie inférieure' },
  { fr: 'une robe', es: 'un vestido', icono: '👗', grupo: 'Partie supérieure + inférieure' },
  { fr: 'un survêtement', es: 'un chándal', icono: '🏃', grupo: 'Partie supérieure + inférieure' },
  { fr: 'des chaussettes', es: 'unos calcetines', icono: '🧦', grupo: 'Aux pieds' },
  { fr: 'des chaussures', es: 'unos zapatos', icono: '👞', grupo: 'Aux pieds' },
  { fr: 'des bottes', es: 'unas botas', icono: '👢', grupo: 'Aux pieds' },
  { fr: 'des bottines', es: 'unos botines', icono: '👢', grupo: 'Aux pieds' },
  { fr: 'des baskets', es: 'unas zapatillas de deporte', icono: '👟', grupo: 'Aux pieds' },
  { fr: 'des sandales', es: 'unas sandalias', icono: '🩴', grupo: 'Aux pieds' },
  { fr: 'un bonnet', es: 'un gorro', icono: '🧢', grupo: 'Accessoires' },
  { fr: 'un chapeau', es: 'un sombrero', icono: '🎩', grupo: 'Accessoires' },
  { fr: 'une écharpe', es: 'una bufanda', icono: '🧣', grupo: 'Accessoires' },
  { fr: 'un foulard', es: 'un pañuelo', icono: '🧣', grupo: 'Accessoires' },
]

/** Las de los apuntes de la profesora y otras con vocal o h, para practicar cet. */
const OUTRAS: Roupa[] = [
  { fr: 'un livre', es: 'un libro', icono: '📘' },
  { fr: 'un ami', es: 'un amigo', icono: '🧑' },
  { fr: 'un homme', es: 'un hombre', icono: '👨' },
  { fr: 'un hôtel', es: 'un hotel', icono: '🏨' },
  { fr: 'un oiseau', es: 'un pájaro', icono: '🐦' },
  { fr: 'une personne', es: 'una persona', icono: '🧍' },
  { fr: 'une amie', es: 'una amiga', icono: '👩' },
  { fr: 'une histoire', es: 'una historia', icono: '📖' },
  { fr: 'des disques', es: 'unos discos', icono: '💿' },
  { fr: 'des voitures', es: 'unos coches', icono: '🚗' },
]

const TODAS = [...ROUPA, ...OUTRAS]

/** El demostrativo que toca según el artículo y la primera letra. */
export function demostrativo(fr: string): 'ce' | 'cet' | 'cette' | 'ces' {
  const [art, ...resto] = fr.split(' ')
  const palabra = resto.join(' ')
  if (art === 'des') return 'ces'
  if (art === 'une') return 'cette'
  return /^[aeiouéèêâîôûh]/i.test(palabra) ? 'cet' : 'ce'
}
const nome = (fr: string) => fr.split(' ').slice(1).join(' ')
const con = (fr: string) => `${demostrativo(fr)} ${nome(fr)}`

const b = (t: string) => <b className="text-violet-800">{t}</b>

const TARXETAS: Tarxeta[] = [
  {
    titulo: '¿Qué son los demostrativos?',
    texto: (
      <>
        <p>
          Sirven para señalar personas u objetos: «{b('este')} pantalón», «{b('esa')} falda», «{b('estos')} zapatos».
        </p>
        <p>
          En francés son {b('ce, cet, cette')} y {b('ces')}. Y una cosa más fácil que en castellano: no distinguen entre <i>este, ese</i> y <i>aquel</i>.
        </p>
        <p className="text-2xl">
          <Fr>ce pantalon</Fr> = este / ese pantalón
        </p>
      </>
    ),
  },
  {
    titulo: 'El truco: mira el artículo',
    texto: (
      <>
        <p>Si te dan la palabra con un, une o des, ya sabes qué demostrativo va:</p>
        <table className="w-full text-xl">
          <tbody>
            {[
              ['un', 'ce (o cet)', 'un pantalon → ce pantalon'],
              ['une', 'cette', 'une jupe → cette jupe'],
              ['des', 'ces', 'des chaussures → ces chaussures'],
            ].map(([a, d, ej]) => (
              <tr key={a} className="border-b border-slate-200 last:border-0">
                <td className="py-2 pr-3 font-bold" lang="fr">
                  {a}
                </td>
                <td className="py-2 pr-3">→</td>
                <td className="py-2 pr-3 font-black text-rose-600" lang="fr">
                  {d}
                </td>
                <td className="py-2 text-base text-slate-600" lang="fr">
                  {ej}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    ),
  },
  {
    titulo: 'CET: masculino con vocal o h',
    texto: (
      <>
        <p>
          Si la palabra es masculina y empieza por {b('vocal')} o por {b('h')}, no se dice ce sino {b('cet')}. Es para que suene bien, igual que <i>je → j'</i>.
        </p>
        <div className="grid gap-2 text-xl">
          {['un anorak', 'un ami', 'un homme', 'un hôtel', 'un oiseau'].map((x) => (
            <span key={x} className="rounded-xl bg-white px-3 py-2">
              <span className="text-slate-500" lang="fr">
                {x}
              </span>{' '}
              → <Fr>{con(x)}</Fr>
            </span>
          ))}
        </div>
      </>
    ),
  },
  {
    titulo: 'CETTE: siempre con femenino',
    texto: (
      <>
        <p>
          Con las femeninas va siempre {b('cette')}, empiecen por lo que empiecen. Aquí no hay cambio por la vocal.
        </p>
        <div className="grid gap-2 text-xl">
          {['une jupe', 'une chemise', 'une écharpe', 'une amie', 'une histoire'].map((x) => (
            <span key={x} className="rounded-xl bg-white px-3 py-2">
              <span className="text-slate-500" lang="fr">
                {x}
              </span>{' '}
              → <Fr>{con(x)}</Fr>
            </span>
          ))}
        </div>
        <p className="text-base text-slate-600">💡 Ojo: cet y cette suenan casi igual, pero se escriben distinto.</p>
      </>
    ),
  },
  {
    titulo: 'CES: siempre en plural',
    texto: (
      <>
        <p>
          En plural no hay masculino ni femenino: siempre {b('ces')}.
        </p>
        <div className="grid gap-2 text-xl">
          {['des chaussures', 'des chaussettes', 'des disques', 'des voitures'].map((x) => (
            <span key={x} className="rounded-xl bg-white px-3 py-2">
              <span className="text-slate-500" lang="fr">
                {x}
              </span>{' '}
              → <Fr>{con(x)}</Fr>
            </span>
          ))}
        </div>
      </>
    ),
  },
  {
    titulo: 'Resumen',
    texto: (
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="rounded-2xl bg-sky-50 p-3">
          <p className="text-sm font-bold text-slate-500">MASCULINO</p>
          <p className="text-3xl font-black text-sky-700" lang="fr">
            ce
          </p>
          <p lang="fr">ce livre</p>
          <p className="mt-2 text-3xl font-black text-sky-700" lang="fr">
            cet
          </p>
          <p className="text-sm">(vocal o h)</p>
          <p lang="fr">cet ami</p>
        </div>
        <div className="rounded-2xl bg-pink-50 p-3">
          <p className="text-sm font-bold text-slate-500">FEMENINO</p>
          <p className="text-3xl font-black text-pink-700" lang="fr">
            cette
          </p>
          <p lang="fr">cette personne</p>
        </div>
        <div className="col-span-2 rounded-2xl bg-violet-50 p-3">
          <p className="text-sm font-bold text-slate-500">PLURAL</p>
          <p className="text-3xl font-black text-violet-700" lang="fr">
            ces
          </p>
          <p lang="fr">ces disques · ces voitures</p>
        </div>
      </div>
    ),
    visual: undefined,
  },
  {
    titulo: 'Les vêtements (página 13)',
    texto: (
      <div className="space-y-3">
        {GRUPOS_ROUPA.map((g) => (
          <div key={g}>
            <p className="text-sm font-bold tracking-wide text-slate-500 uppercase">{g}</p>
            <div className="grid gap-1.5 sm:grid-cols-2">
              {ROUPA.filter((x) => x.grupo === g).map((x) => (
                <span key={x.fr} className="rounded-xl bg-white px-3 py-1.5 text-lg">
                  <span aria-hidden="true">{x.icono}</span> <Fr>{x.fr}</Fr> <span className="text-base text-slate-500">{x.es}</span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    titulo: 'En la tienda (página 15)',
    texto: (
      <div className="space-y-2 text-xl">
        <p>
          <Fr>Tu achètes ce pull ?</Fr> — <Fr>Oui ! Regarde, je mets cette veste avec.</Fr>
        </p>
        <p className="rounded-2xl bg-white p-4">
          <Fr>Dans la boutique, j'achète ce blouson, ce pantalon et ces baskets.</Fr> <Fr>Avec le blouson, le pantalon et les baskets, je mets ce tee-shirt et ce foulard.</Fr>
        </p>
        <p className="text-base text-slate-600">💡 La primera vez que se señala la prenda, demostrativo (ce blouson); después, cuando ya se sabe cuál es, artículo (le blouson).</p>
      </div>
    ),
  },
]

const OPCIONS = ['ce', 'cet', 'cette', 'ces'] as const

const explica = (fr: string) => {
  const d = demostrativo(fr)
  return d === 'cet' ? (
    <>Es masculino (un) y empieza por vocal o h: {con(fr)}.</>
  ) : d === 'ce' ? (
    <>Es masculino (un): {con(fr)}.</>
  ) : d === 'cette' ? (
    <>Es femenino (une): siempre cette. {con(fr)}.</>
  ) : (
    <>Es plural (des): siempre ces. {con(fr)}.</>
  )
}

/** Elegir el demostrativo viendo el artículo. */
const elixeConArtigo = (x: Roupa): Pregunta =>
  elixe(
    <span>
      <span aria-hidden="true">{x.icono}</span> <span lang="fr">{x.fr}</span> → ___ <span lang="fr">{nome(x.fr)}</span>
    </span>,
    demostrativo(x.fr),
    OPCIONS.filter((o) => o !== demostrativo(x.fr)),
    explica(x.fr),
  )

/** Escribir la palabra con su demostrativo. */
const escribe = (x: Roupa): Pregunta => ({
  tipo: 'escribe',
  texto: (
    <span>
      <span aria-hidden="true">{x.icono}</span> Escribe con su demostrativo: <b lang="fr">{x.fr}</b>
    </span>
  ),
  respostas: [con(x.fr)],
  explica: explica(x.fr),
})

// Ejercicio 5 de la página 15: los huecos (★) que son demostrativos.
export const DIALOGO: [string, string][] = [
  ['Hé ! les filles, regardez. Je mets ___ sweat…', 'ce'],
  ['…et ___ veste par-dessus. Ça va super bien ensemble, non ?', 'cette'],
  ['Oui, tu as raison, ___ deux vêtements vont super bien ensemble !', 'ces'],
  ['Tu as déjà une veste de ___ couleur, non ?', 'cette'],
  ['Tu peux la mettre avec ___ sweat.', 'ce'],
]
const dialogo = DIALOGO.map(([f, c]) => elixe(<span lang="fr">{f}</span>, c, OPCIONS.filter((o) => o !== c), <>{c === 'ces' ? 'Plural: ces.' : c === 'cette' ? 'Femenino: cette.' : 'Masculino con consonante: ce.'}</>))

const XOGOS: Xogo[] = [
  {
    id: 'dialogo',
    titulo: 'El diálogo de la tienda (ej. 5)',
    icono: '🛍️',
    explica: 'Completa con ce, cet, cette o ces.',
    crear: (acabar) => <Proba practica cantas={5} preguntas={dialogo} acabar={acabar} />,
  },
  {
    id: 'clasifica',
    titulo: '¿Ce, cet, cette o ces?',
    icono: '🗂️',
    explica: 'Pon cada palabra en su caja.',
    crear: (acabar) => (
      <Clasifica
        caixas={OPCIONS.map((o, i) => ({ id: o, nome: o, cor: ['border-sky-300 bg-sky-100', 'border-amber-300 bg-amber-100', 'border-pink-300 bg-pink-100', 'border-violet-300 bg-violet-100'][i] }))}
        elementos={barallar(TODAS)
          .slice(0, 12)
          .map((x) => ({ texto: x.fr, caixa: demostrativo(x.fr), pista: `${x.fr} → ${con(x.fr)}. ${demostrativo(x.fr) === 'cet' ? 'Masculino con vocal o h.' : ''}` }))}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'elixe',
    titulo: 'Elige el demostrativo',
    icono: '🎯',
    explica: 'Mira el artículo y elige.',
    crear: (acabar) => <Proba practica cantas={10} preguntas={TODAS.map(elixeConArtigo)} acabar={acabar} />,
  },
  {
    id: 'escribe',
    titulo: 'Escríbelo tú',
    icono: '✍️',
    explica: 'Cambia el artículo por el demostrativo.',
    crear: (acabar) => <Proba practica cantas={8} preguntas={TODAS.map(escribe)} acabar={acabar} />,
  },
  {
    id: 'roupa',
    titulo: 'La ropa',
    icono: '👕',
    explica: 'Une cada prenda con su significado.',
    crear: (acabar) => <Une pares={barallar(ROUPA).slice(0, 7).map((x) => ({ palabra: x.fr, significado: x.es }))} acabar={acabar} />,
  },
]

export const PREGUNTAS: Pregunta[] = [
  ...dialogo,
  ...TODAS.map(elixeConArtigo),
  ...TODAS.map(escribe),
  ...ROUPA.map((x) =>
    elixe(
      <>¿Cómo se dice «{x.es}»?</>,
      x.fr,
      barallar(ROUPA.filter((y) => y !== x))
        .slice(0, 3)
        .map((y) => y.fr),
      <>
        {x.es} = {x.fr}.
      </>,
    ),
  ),
  elixe('¿Cuándo se usa «cet»?', 'Con masculino que empieza por vocal o h', ['Con todas las palabras femeninas', 'Con el plural', 'Con masculino que empieza por consonante'], <>cet ami, cet anorak, cet homme.</>),
  elixe('¿Qué demostrativo va con «une écharpe»?', 'cette', ['cet', 'ce', 'ces'], <>Femenino: siempre cette, aunque empiece por vocal.</>),
  elixe('¿Qué demostrativo va con cualquier plural?', 'ces', ['ce', 'cet', 'cette'], <>En plural siempre ces.</>),
]

export default function Demonstratifs({ ruta, modo }: { ruta: string; modo?: string }) {
  return (
    <ParadaPrimaria
      ruta={ruta}
      titulo="Les vêtements et les démonstratifs"
      modo={modo}
      paneis={{
        descubre: <Tarxetas tarxetas={TARXETAS} xoga={`${ruta}/xoga`} />,
        xoga: <Xogos xogos={XOGOS} proba={`${ruta}/proba`} />,
        proba: <Proba id="frances1/demonstratifs" preguntas={PREGUNTAS} />,
      }}
    />
  )
}
