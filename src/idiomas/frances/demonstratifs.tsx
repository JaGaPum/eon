// Parada «Les démonstratifs»: ce, cet, cette, ces. Sin la página 13 del libro, la ropa es la habitual de 2º de ESO;
// la regla es la de la profesora: un → ce (cet delante de vocal o h), une → cette siempre, des → ces siempre.
import { Clasifica, Fr, ParadaPrimaria, Proba, Tarxetas, Une, barallar, type Pregunta, type Tarxeta, type Xogo, Xogos } from '../../primaria/pezas'
import { elixe } from '../../primaria/paisaxes/preguntas'

interface Roupa {
  /** Con su artículo indefinido: «un pantalon», «une jupe», «des chaussures». */
  fr: string
  es: string
  icono: string
}

export const ROUPA: Roupa[] = [
  { fr: 'un pantalon', es: 'un pantalón', icono: '👖' },
  { fr: 'un jean', es: 'unos vaqueros', icono: '👖' },
  { fr: 'un short', es: 'un pantalón corto', icono: '🩳' },
  { fr: 'un tee-shirt', es: 'una camiseta', icono: '👕' },
  { fr: 'un pull', es: 'un jersey', icono: '🧶' },
  { fr: 'un manteau', es: 'un abrigo', icono: '🧥' },
  { fr: 'un chapeau', es: 'un sombrero', icono: '🎩' },
  { fr: 'un anorak', es: 'un anorak', icono: '🧥' },
  { fr: 'un imperméable', es: 'un impermeable', icono: '🌧️' },
  { fr: 'un uniforme', es: 'un uniforme', icono: '🎽' },
  { fr: 'une jupe', es: 'una falda', icono: '👗' },
  { fr: 'une robe', es: 'un vestido', icono: '👗' },
  { fr: 'une chemise', es: 'una camisa', icono: '👔' },
  { fr: 'une veste', es: 'una chaqueta', icono: '🧥' },
  { fr: 'une casquette', es: 'una gorra', icono: '🧢' },
  { fr: 'une écharpe', es: 'una bufanda', icono: '🧣' },
  { fr: 'des chaussures', es: 'unos zapatos', icono: '👞' },
  { fr: 'des baskets', es: 'unas zapatillas de deporte', icono: '👟' },
  { fr: 'des chaussettes', es: 'unos calcetines', icono: '🧦' },
  { fr: 'des bottes', es: 'unas botas', icono: '👢' },
  { fr: 'des lunettes', es: 'unas gafas', icono: '👓' },
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
          {['un anorak', 'un imperméable', 'un uniforme', 'un ami', 'un homme'].map((x) => (
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
    titulo: 'Les vêtements: la ropa',
    texto: (
      <div className="grid gap-1.5 sm:grid-cols-2">
        {ROUPA.map((x) => (
          <span key={x.fr} className="rounded-xl bg-white px-3 py-1.5 text-lg">
            <span aria-hidden="true">{x.icono}</span> <Fr>{x.fr}</Fr> <span className="text-base text-slate-500">{x.es}</span>
          </span>
        ))}
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

const XOGOS: Xogo[] = [
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
      titulo="Les démonstratifs"
      modo={modo}
      paneis={{
        descubre: <Tarxetas tarxetas={TARXETAS} xoga={`${ruta}/xoga`} />,
        xoga: <Xogos xogos={XOGOS} proba={`${ruta}/proba`} />,
        proba: <Proba id="frances1/demonstratifs" preguntas={PREGUNTAS} />,
      }}
    />
  )
}
