// Galego 2.º ESO, proba de aula 1: principios básicos do tratamento de textos (apuntes da profesora).
import { useState, type ReactNode } from 'react'
import { Burbulla, Clasifica, ParadaPrimaria, Proba, Tarxetas, Une, VerdadeiroFalso, barallar, type Pregunta, type Tarxeta, type Xogo, Xogos } from '../../primaria/pezas'
import { elixe } from '../../primaria/paisaxes/preguntas'

const b = (t: string) => <b className="text-violet-800">{t}</b>
const Caixa = ({ children }: { children: ReactNode }) => <div className="rounded-2xl border-2 border-violet-200 bg-white p-4 text-lg leading-relaxed">{children}</div>

// ===================================================================================================
// 1. Descrición obxectiva e subxectiva
// ===================================================================================================

const OBXECTIVAS = [
  'A Torre de Hércules mide 55 metros de altura.',
  'O río Miño desemboca na Guarda.',
  'A casa ten tres cuartos, unha cociña e un baño.',
  'O can é de cor marrón e ten as orellas longas.',
  'O libro ten douscentas páxinas e tapas duras.',
  'A auga ferve a cen graos.',
  'A praza está rodeada de soportais de pedra.',
  'O ordenador pesa dous quilos e ten unha pantalla de quince polgadas.',
]
const SUBXECTIVAS = [
  'A Torre de Hércules é o monumento máis bonito do mundo.',
  'Aquela praia faime sentir tranquilo.',
  'O can ten uns ollos tenros que me derreten.',
  'Ese libro é aburridísimo.',
  'A cidade parece triste cando chove.',
  'Que bonita está a ría hoxe!',
  'Sinto que este inverno non vai rematar nunca.',
  'A miña avoa ten as mans máis doces que coñezo.',
]

const DESCRICION_TARXETAS: Tarxeta[] = [
  {
    titulo: 'Dúas maneiras de describir',
    texto: (
      <>
        <p>
          Unha {b('descrición obxectiva')} utiliza {b('datos comprobables')}: non expresa opinións nin puntos de vista persoais.
        </p>
        <p>
          Unha {b('descrición subxectiva')} deixa entrever {b('sentimentos, emocións e puntos de vista persoais')}.
        </p>
      </>
    ),
  },
  {
    titulo: 'Un mesmo obxecto, dúas descricións',
    texto: (
      <>
        <Caixa>
          <p className="text-sm font-bold text-slate-500">OBXECTIVA</p>
          A Torre de Hércules é un faro romano da Coruña. Mide 55 metros e está sobre un outeiro xunto ao mar.
        </Caixa>
        <Caixa>
          <p className="text-sm font-bold text-slate-500">SUBXECTIVA</p>
          A Torre de Hércules é un xigante tranquilo que vixía o mar. Cada vez que a vexo, emociónome.
        </Caixa>
        <p className="text-base text-slate-600">💡 Pistas da subxectiva: adxectivos que valoran (bonito, horrible), comparacións e metáforas, exclamacións e verbos como «sinto», «paréceme», «encántame».</p>
      </>
    ),
  },
  {
    titulo: 'Como distinguilas',
    texto: (
      <ul className="list-disc space-y-2 pl-5">
        <li>Pregúntate: <b>isto pódese comprobar?</b> (medir, contar, ver en calquera foto). Se si, é obxectivo.</li>
        <li>Se depende de quen o diga (un pensa que é bonito e outro que non), é subxectivo.</li>
        <li>As descricións obxectivas aparecen en enciclopedias, guías ou textos científicos; as subxectivas, en poemas, novelas, cartas ou anuncios.</li>
      </ul>
    ),
  },
]

const DESCRICION_PREG: Pregunta[] = [
  ...OBXECTIVAS.map((f) => elixe(<>«{f}» É unha descrición…</>, 'Obxectiva', ['Subxectiva'], 'Son datos que se poden comprobar, sen opinións.')),
  ...SUBXECTIVAS.map((f) => elixe(<>«{f}» É unha descrición…</>, 'Subxectiva', ['Obxectiva'], 'Hai sentimentos ou opinións de quen fala.')),
  elixe('Que caracteriza unha descrición obxectiva?', 'Utiliza datos comprobables, sen opinións', ['Expresa os sentimentos do autor', 'Usa moitas exclamacións e comparacións'], 'A obxectiva só dá datos comprobables.'),
  elixe('Que caracteriza unha descrición subxectiva?', 'Deixa entrever sentimentos, emocións e puntos de vista persoais', ['Só ten números e medidas', 'Non usa adxectivos'], 'A subxectiva mostra o que sente ou pensa quen describe.'),
  elixe('Onde atoparías máis probablemente unha descrición obxectiva?', 'Nunha enciclopedia', ['Nun poema de amor', 'Nunha carta a unha amiga'], 'As enciclopedias dan datos comprobables.'),
]

const DESCRICION_XOGOS: Xogo[] = [
  {
    id: 'clasifica',
    titulo: 'Obxectiva ou subxectiva?',
    icono: '🗂️',
    explica: 'Coloca cada frase na súa caixa.',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'o', nome: 'Obxectiva', cor: 'border-sky-300 bg-sky-100' },
          { id: 's', nome: 'Subxectiva', cor: 'border-pink-300 bg-pink-100' },
        ]}
        elementos={barallar([...OBXECTIVAS.map((t) => ({ texto: t, caixa: 'o', pista: 'Isto pódese comprobar: é obxectivo.' })), ...SUBXECTIVAS.map((t) => ({ texto: t, caixa: 's', pista: 'Aquí hai unha opinión ou un sentimento: é subxectivo.' }))]).slice(0, 8)}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'vf',
    titulo: 'Verdadeiro ou falso?',
    icono: '✅',
    explica: 'Sobre as dúas descricións.',
    crear: (acabar) => (
      <VerdadeiroFalso
        frases={[
          { texto: 'Unha descrición obxectiva non expresa opinións.', certa: true, explica: 'Só usa datos comprobables.' },
          { texto: 'Nunha descrición subxectiva o autor deixa ver os seus sentimentos.', certa: true, explica: 'Por iso é subxectiva.' },
          { texto: '«Mide tres metros» é unha expresión subxectiva.', certa: false, explica: 'É un dato que se pode medir: obxectivo.' },
          { texto: '«É preciosa» é unha expresión subxectiva.', certa: true, explica: 'É unha valoración persoal.' },
          { texto: 'As exclamacións son habituais nas descricións obxectivas.', certa: false, explica: 'As exclamacións expresan emoción: son propias da subxectiva.' },
          { texto: 'Unha guía de viaxes adoita describir de forma obxectiva.', certa: true, explica: 'Dá datos: onde está, canto mide, que horario ten.' },
        ]}
        acabar={acabar}
      />
    ),
  },
]

export function Descricion({ ruta, modo }: { ruta: string; modo?: string }) {
  return (
    <ParadaPrimaria
      ruta={ruta}
      titulo="Descrición obxectiva e subxectiva"
      modo={modo}
      paneis={{
        descubre: <Tarxetas tarxetas={DESCRICION_TARXETAS} xoga={`${ruta}/xoga`} />,
        xoga: <Xogos xogos={DESCRICION_XOGOS} proba={`${ruta}/proba`} />,
        proba: <Proba id="galego1/descricion" preguntas={DESCRICION_PREG} />,
      }}
    />
  )
}

// ===================================================================================================
// 2 e 3. Tema, título e resumo: os mesmos textos curtos
// ===================================================================================================

interface Texto {
  id: string
  texto: string
  tema: string
  /** Temas mal feitos, cun motivo. */
  temasMal: [string, string][]
  titulo: string
  titulosMal: [string, string][]
  resumo: string
  resumosMal: [string, string][]
}

const TEXTOS: Texto[] = [
  {
    id: 'mobiles',
    texto:
      'Cada vez máis institutos galegos prohiben o uso do teléfono móbil nas aulas. O profesorado afirma que o alumnado se distrae con facilidade e que as redes sociais lle quitan horas de sono e de estudo. Algunhas familias, pola contra, prefiren que os seus fillos o leven para poder localizalos en caso de necesidade. Para buscar un equilibrio, moitos centros permiten levalo na mochila, pero apagado durante as clases.',
    tema: 'Prohibición dos teléfonos móbiles nas aulas dos institutos',
    temasMal: [
      ['Os móbiles', 'É demasiado xeral e leva artigo.'],
      ['Os institutos prohiben os móbiles nas aulas', 'É unha oración con verbo: o tema vai en frase nominal.'],
      ['Adeus ao móbil!', 'Iso sería un título, non o tema.'],
    ],
    titulo: 'Móbiles apagados, aulas atentas',
    titulosMal: [
      ['Os institutos galegos deciden prohibir o uso dos teléfonos móbiles nas aulas', 'Pasa de oito palabras e leva verbos.'],
      ['Vacacións de verán', 'Non ten relación co tema.'],
    ],
    resumo: 'Este texto trata sobre a prohibición dos móbiles nas aulas. Os docentes cren que distraen ao alumnado, mentres que algunhas familias queren que os fillos os leven para estaren localizables; por iso moitos centros os permiten apagados.',
    resumosMal: [
      ['Cada vez máis institutos galegos prohiben o uso do teléfono móbil nas aulas. O profesorado afirma que o alumnado se distrae con facilidade.', 'Copia frases do texto: hai que usar palabras propias.'],
      ['Este texto trata sobre os móbiles nas aulas. Eu creo que é unha idea malísima porque os móbiles son moi útiles.', 'Mete unha opinión: o resumo ten que ser obxectivo.'],
    ],
  },
  {
    id: 'lobo',
    texto:
      'O lobo ibérico volve a zonas de Galicia das que desaparecera hai décadas. Os biólogos explican que o abandono do rural e o aumento de corzos e xabarís favoreceron o seu regreso. Porén, os gandeiros denuncian ataques ao gando e reclaman axudas para protexer os animais con cans de garda e valados. A Administración estuda medidas que permitan a convivencia entre o lobo e a actividade gandeira.',
    tema: 'Regreso do lobo ibérico aos montes galegos e conflito cos gandeiros',
    temasMal: [
      ['O lobo volve a Galicia', 'É unha oración: o tema exprésase sen verbo, en frase nominal.'],
      ['Animais', 'É demasiado xeral: non di de que trata o texto.'],
      ['Ouveos no monte', 'É un título orixinal, pero non o tema.'],
    ],
    titulo: 'O regreso do lobo',
    titulosMal: [
      ['O lobo ibérico está volvendo a moitas zonas rurais de Galicia este ano', 'É longo e leva verbos.'],
      ['Receitas de inverno', 'Non ten relación co tema.'],
    ],
    resumo: 'Este texto refírese á volta do lobo a zonas de Galicia, favorecida polo abandono do rural e polo aumento das súas presas, e aos problemas que causa aos gandeiros, que piden axudas mentres a Administración busca solucións.',
    resumosMal: [
      ['O lobo ibérico volve a zonas de Galicia das que desaparecera hai décadas. Os biólogos explican que o abandono do rural favoreceu o seu regreso.', 'Copia o texto en vez de usar palabras propias.'],
      ['Este texto trata do lobo, un animal precioso que me encanta e que debería estar en todos os montes.', 'Leva opinións do autor do resumo.'],
    ],
  },
  {
    id: 'lume',
    texto:
      'Cada verán, os incendios forestais queiman miles de hectáreas en Galicia. A calor, a seca e o vento fan que o lume se estenda rapidamente, pero moitos destes incendios son provocados ou nacen de queimas mal controladas. Ademais da perda de árbores, os lumes deixan o chan sen protección e as chuvias do outono arrastran a terra aos ríos. Os expertos insisten na importancia de limpar os montes e de vixialos.',
    tema: 'Causas e consecuencias dos incendios forestais en Galicia',
    temasMal: [
      ['O lume queima os montes cada verán', 'Leva verbo: é unha oración, non unha frase nominal.'],
      ['O verán', 'É demasiado xeral e leva artigo.'],
      ['Montes en cinza', 'É un título, non o tema.'],
    ],
    titulo: 'Montes en cinza',
    titulosMal: [
      ['Os incendios queiman miles de hectáreas cada verán en Galicia', 'Leva verbo e é máis longo do conveniente.'],
      ['A praia en agosto', 'Non ten relación co tema.'],
    ],
    resumo: 'Este texto desenvolve o problema dos incendios forestais en Galicia: a calor, a seca, o vento e as accións humanas fan que se estendan, e despois a terra queda sen protección. Por iso, cómpre limpar e vixiar os montes.',
    resumosMal: [
      ['Os incendios son horribles e dan moito medo; ninguén debería queimar o monte nunca.', 'Expresa sentimentos e non resume o texto.'],
      ['Cada verán, os incendios forestais queiman miles de hectáreas en Galicia. A calor, a seca e o vento fan que o lume se estenda rapidamente.', 'Copia o comezo do texto: non é un resumo.'],
    ],
  },
  {
    id: 'lectura',
    texto:
      'Un estudo recente indica que os adolescentes galegos len menos libros que hai dez anos. Os investigadores relacionan este descenso co tempo que pasan diante das pantallas. Con todo, o mesmo estudo sinala que as bibliotecas que organizan clubs de lectura e encontros con autores conseguen que moitos mozos recuperen o gusto por ler.',
    tema: 'Descenso da lectura entre os adolescentes e iniciativas para fomentala',
    temasMal: [
      ['Os adolescentes len pouco', 'É unha oración con verbo.'],
      ['Os libros', 'É demasiado xeral e leva artigo.'],
      ['Páxinas en branco', 'Sería un título.'],
    ],
    titulo: 'Menos pantallas, máis páxinas',
    titulosMal: [
      ['Os mozos galegos len menos libros ca hai dez anos segundo un estudo', 'Pasa de oito palabras e leva verbo.'],
      ['Partido de fútbol', 'Non ten relación co tema.'],
    ],
    resumo: 'Este texto trata sobre a diminución da lectura entre os mozos galegos, que se relaciona co uso das pantallas, e sobre como os clubs de lectura das bibliotecas axudan a recuperar o hábito.',
    resumosMal: [
      ['Este texto trata sobre os libros, que son o mellor invento da humanidade.', 'Opina e non recolle o fundamental.'],
      ['Un estudo recente indica que os adolescentes galegos len menos libros que hai dez anos.', 'Copia unha frase e deixa fóra o resto.'],
    ],
  },
]

const TextoCaixa = ({ t }: { t: Texto }) => <Caixa>{t.texto}</Caixa>

const TEMA_TARXETAS: Tarxeta[] = [
  {
    titulo: 'O tema',
    texto: (
      <>
        <p>
          O {b('tema')} expresa {b('nunha liña')} a {b('idea fundamental')} que trata o texto globalmente.
        </p>
        <p>Recoméndase redactalo nunha {b('frase nominal')} (sen verbo conxugado):</p>
        <p className="rounded-xl bg-violet-50 p-3 text-xl font-bold">Nome abstracto (sen determinante nin artigo) + Aclaración</p>
        <p>
          Exemplo: <b>Alternativas para a reciclaxe do lixo nas cidades.</b>
        </p>
      </>
    ),
  },
  {
    titulo: 'O título',
    texto: (
      <>
        <p>
          O {b('título')} é unha frase ou oración que {b('dá nome')} a un texto. Pode anticipar o contido, referirse a un personaxe ou situación e mesmo {b('intrigar')} ao lector. Búscase a {b('orixinalidade')}, pero ten que ter relación co tema.
        </p>
        <p>Para facelo:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>{b('Brevidade')}: non pasar de oito palabras.</li>
          <li>{b('Evitar verbos')}.</li>
          <li>{b('Relación co tema')}.</li>
        </ul>
      </>
    ),
  },
  {
    titulo: 'Tema ou título?',
    texto: (
      <>
        <TextoCaixa t={TEXTOS[0]} />
        <p>
          <b>Tema:</b> {TEXTOS[0].tema}. <span className="text-slate-500">(Nome abstracto «prohibición» + aclaración.)</span>
        </p>
        <p>
          <b>Título:</b> {TEXTOS[0].titulo}. <span className="text-slate-500">(Breve, sen verbos, orixinal.)</span>
        </p>
      </>
    ),
  },
]

const TEMA_PREG: Pregunta[] = [
  ...TEXTOS.map((t) =>
    elixe(
      <>
        <TextoCaixa t={t} />
        <span className="mt-3 block">Cal é o mellor tema deste texto?</span>
      </>,
      t.tema,
      t.temasMal.map(([x]) => x),
      <>O tema é unha frase nominal que recolle a idea global. Os outros: {t.temasMal.map(([x, m]) => `«${x}»: ${m}`).join(' ')}</>,
    ),
  ),
  ...TEXTOS.map((t) =>
    elixe(
      <>
        <TextoCaixa t={t} />
        <span className="mt-3 block">Cal é o mellor título?</span>
      </>,
      t.titulo,
      t.titulosMal.map(([x]) => x),
      <>Breve, sen verbos e relacionado co tema. {t.titulosMal.map(([x, m]) => `«${x}»: ${m}`).join(' ')}</>,
    ),
  ),
  elixe('Como se recomenda redactar o tema?', 'Nunha frase nominal: nome abstracto sen artigo + aclaración', ['Nunha oración cun verbo conxugado', 'Cunha pregunta para intrigar'], 'Por exemplo: «Alternativas para a reciclaxe do lixo nas cidades».'),
  elixe('Cantas palabras, como máximo, debería ter un título?', 'Oito', ['Tres', 'Quince'], 'A brevidade: non pasar de oito palabras.'),
  elixe('Cal destas frases está ben como tema?', 'Importancia do descanso para o rendemento escolar', ['O descanso é importante para estudar', 'Durmir ben!'], 'É nominal: nome abstracto «importancia» + aclaración.'),
  elixe('Que se busca co título?', 'A orixinalidade, sen perder a relación co tema', ['Explicar todo o texto', 'Copiar a primeira frase do texto'], 'O título pode intrigar, pero ten que ver co tema.'),
  elixe('Que hai que evitar nun título?', 'Os verbos', ['Os nomes', 'As palabras curtas'], 'É unha das tres claves: brevidade, sen verbos e relación co tema.'),
]

const TEMA_XOGOS: Xogo[] = [
  {
    id: 'clasifica',
    titulo: 'Tema ou título?',
    icono: '🗂️',
    explica: 'Decide se cada frase é un tema ou un título.',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'tema', nome: 'Tema', cor: 'border-sky-300 bg-sky-100' },
          { id: 'titulo', nome: 'Título', cor: 'border-amber-300 bg-amber-100' },
        ]}
        elementos={TEXTOS.flatMap((t) => [
          { texto: t.tema, caixa: 'tema', pista: 'É unha frase nominal que recolle a idea global: tema.' },
          { texto: t.titulo, caixa: 'titulo', pista: 'É curto e orixinal, sen recoller toda a idea: título.' },
        ]).filter((x, i, a) => a.findIndex((y) => y.texto === x.texto) === i)}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'proba-tema',
    titulo: 'Busca o tema e o título',
    icono: '🔎',
    explica: 'Le textos curtos e elixe.',
    crear: (acabar) => <Proba practica cantas={6} preguntas={TEMA_PREG.slice(0, 8)} acabar={acabar} />,
  },
]

export function Tema({ ruta, modo }: { ruta: string; modo?: string }) {
  return (
    <ParadaPrimaria
      ruta={ruta}
      titulo="Tema e título"
      modo={modo}
      paneis={{
        descubre: <Tarxetas tarxetas={TEMA_TARXETAS} xoga={`${ruta}/xoga`} />,
        xoga: <Xogos xogos={TEMA_XOGOS} proba={`${ruta}/proba`} />,
        proba: <Proba id="galego1/tema" preguntas={TEMA_PREG} />,
      }}
    />
  )
}

const RESUMO_TARXETAS: Tarxeta[] = [
  {
    titulo: 'O resumo',
    texto: (
      <>
        <p>
          O {b('resumo')} recolle {b('o fundamental')} do texto. Antes de facelo hai que ter claros a intención do texto e os seus puntos centrais.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Ocupa {b('un terzo')} (⅓) do texto orixinal.</li>
          <li>Escríbese nun {b('só bloque ou parágrafo')}.</li>
          <li>
            Con {b('palabras propias')}: non se copian frases do texto.
          </li>
          <li>
            Pode comezar: «{b('Este texto trata sobre…')}», «Este texto refírese a…», «Este texto desenvolve…».
          </li>
          <li>
            Ten que ser {b('obxectivo')}: sen comentarios nin opinións.
          </li>
        </ul>
      </>
    ),
  },
  {
    titulo: 'Un exemplo',
    texto: (
      <>
        <TextoCaixa t={TEXTOS[1]} />
        <p>
          <b>Resumo:</b> {TEXTOS[1].resumo}
        </p>
        <p className="text-base text-slate-600">💡 Comproba: é máis curto, está nun parágrafo, non copia frases, non opina.</p>
      </>
    ),
  },
  {
    titulo: 'Como facelo, paso a paso',
    texto: (
      <ol className="list-decimal space-y-1 pl-5">
        <li>Le o texto enteiro dúas veces.</li>
        <li>Subliña as ideas principais (unha por parágrafo, máis ou menos).</li>
        <li>Pecha o texto e escribe esas ideas coas túas palabras, unidas nun parágrafo.</li>
        <li>Revisa: ocupa un terzo? hai algunha opinión túa? copiaches algunha frase?</li>
      </ol>
    ),
  },
]

const RESUMO_PREG: Pregunta[] = [
  ...TEXTOS.map((t) =>
    elixe(
      <>
        <TextoCaixa t={t} />
        <span className="mt-3 block">Cal é o mellor resumo?</span>
      </>,
      t.resumo,
      t.resumosMal.map(([x]) => x),
      <>Recolle o fundamental con palabras propias e sen opinar. {t.resumosMal.map(([x, m]) => `«${x.slice(0, 40)}…»: ${m}`).join(' ')}</>,
    ),
  ),
  elixe('Canto debe ocupar un resumo?', 'Un terzo do texto orixinal', ['O mesmo que o texto', 'Unha soa palabra'], '⅓ do texto orixinal.'),
  elixe('Cantos parágrafos ten un resumo?', 'Un só bloque ou parágrafo', ['Un por cada parágrafo do texto', 'Tres: introdución, desenvolvemento e conclusión'], 'Escríbese nun bloque ou parágrafo.'),
  elixe('Que palabras se usan nun resumo?', 'Palabras propias', ['As mesmas frases do texto', 'Palabras en castelán'], 'Non se fai paráfrase do texto orixinal: usamos as nosas palabras.'),
  elixe('Cal destes inicios vale para un resumo?', '«Este texto trata sobre…»', ['«Na miña opinión…»', '«Érase unha vez…»'], 'Os inicios propostos: «Este texto trata sobre…», «Este texto refírese a…», «Este texto desenvolve…».'),
  elixe('Pódense meter opinións no resumo?', 'Non: o resumo é obxectivo, sen comentarios', ['Si, ao final', 'Só se son positivas'], 'O resumo debe ser obxectivo.'),
]

const RESUMO_XOGOS: Xogo[] = [
  {
    id: 'vf',
    titulo: 'Verdadeiro ou falso?',
    icono: '✅',
    explica: 'As regras do resumo.',
    crear: (acabar) => (
      <VerdadeiroFalso
        frases={[
          { texto: 'O resumo ocupa aproximadamente un terzo do texto orixinal.', certa: true, explica: '⅓ do texto.' },
          { texto: 'O resumo divídese en tantos parágrafos coma o texto.', certa: false, explica: 'Escríbese nun só bloque ou parágrafo.' },
          { texto: 'Hai que copiar as frases máis importantes do texto.', certa: false, explica: 'Úsanse palabras propias.' },
          { texto: '«Este texto refírese a…» é un bo inicio.', certa: true, explica: 'É un dos inicios recomendados.' },
          { texto: 'No resumo podo dicir se me gustou o texto.', certa: false, explica: 'O resumo é obxectivo, sen comentarios.' },
          { texto: 'Antes de resumir hai que ter clara a intención do texto e as súas ideas centrais.', certa: true, explica: 'Sen iso non se sabe que é o fundamental.' },
        ]}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'mellor',
    titulo: 'Cal é o mellor resumo?',
    icono: '📝',
    explica: 'Le e elixe.',
    crear: (acabar) => <Proba practica cantas={4} preguntas={RESUMO_PREG.slice(0, 4)} acabar={acabar} />,
  },
  {
    id: 'escribe',
    titulo: 'Fai ti o resumo',
    icono: '✍️',
    explica: 'Escribe o teu e compárao cun modelo.',
    crear: () => <EscribeResumo />,
  },
]

/** O alumno escribe o seu resumo e despois compárao co modelo e cunha lista para revisalo. */
function EscribeResumo() {
  const [k] = useState(() => Math.floor(Math.random() * TEXTOS.length))
  const t = TEXTOS[k]
  const [texto, setTexto] = useState('')
  const [visto, setVisto] = useState(false)
  const palabras = (s: string) => s.trim().split(/\s+/).filter(Boolean).length
  const obxectivo = Math.round(palabras(t.texto) / 3)
  return (
    <div className="space-y-3">
      <TextoCaixa t={t} />
      <textarea className="min-h-32 w-full rounded-2xl border-2 border-violet-200 p-3 text-lg" placeholder="Este texto trata sobre…" value={texto} onChange={(e) => setTexto(e.target.value)} lang="gl" />
      <p className="text-sm text-slate-500">
        Levas {palabras(texto)} palabras. Para un terzo do texto, arredor de {obxectivo}.
      </p>
      <button className="btn btn-primario min-h-12 w-full border-violet-600 bg-violet-600 text-lg" disabled={palabras(texto) < 5} onClick={() => setVisto(true)}>
        Comparar co modelo
      </button>
      {visto && (
        <>
          <Burbulla>
            <b>Modelo:</b> {t.resumo}
          </Burbulla>
          <ul className="space-y-1 rounded-2xl bg-violet-50 p-4 text-lg">
            <li>☐ Recolle as mesmas ideas principais ca o modelo?</li>
            <li>☐ Está nun só parágrafo?</li>
            <li>☐ Usei palabras propias, sen copiar frases?</li>
            <li>☐ É obxectivo, sen opinións?</li>
            <li>☐ Ocupa máis ou menos un terzo ({obxectivo} palabras)?</li>
          </ul>
        </>
      )}
    </div>
  )
}

export function Resumo({ ruta, modo }: { ruta: string; modo?: string }) {
  return (
    <ParadaPrimaria
      ruta={ruta}
      titulo="O resumo"
      modo={modo}
      paneis={{
        descubre: <Tarxetas tarxetas={RESUMO_TARXETAS} xoga={`${ruta}/xoga`} />,
        xoga: <Xogos xogos={RESUMO_XOGOS} proba={`${ruta}/proba`} />,
        proba: <Proba id="galego1/resumo" preguntas={RESUMO_PREG} />,
      }}
    />
  )
}

// ===================================================================================================
// 4. Definir palabras
// ===================================================================================================

type Categoria = 'Substantivo' | 'Adxectivo' | 'Verbo' | 'Adverbio'
interface Definicion {
  palabra: string
  cat: Categoria
  boa: string
  /** Definicións mal feitas, co motivo. */
  mal: [string, string][]
}

// As dez palabras da ficha «Practica definicións». As definicións son un modelo seguindo a técnica da profesora.
export const DEFINICIONS: Definicion[] = [
  { palabra: 'mergullar', cat: 'Verbo', boa: 'Meter algo ou meterse por completo debaixo da auga.', mal: [['Facer un mergullo na auga.', 'Usa unha palabra da mesma familia (mergullo).'], ['Acción de entrar na auga.', 'Un verbo defínese cun verbo, non cun substantivo.']] },
  { palabra: 'taboleiro', cat: 'Substantivo', boa: 'Superficie plana, xeralmente cadriculada, na que se xoga ao xadrez ou a outros xogos; tamén panel onde se colocan anuncios.', mal: [['Táboa grande para xogar.', 'Usa unha palabra da mesma familia (táboa).'], ['Que é plano e serve para xogar.', 'Un substantivo defínese cun substantivo, non cunha expresión de adxectivo.']] },
  { palabra: 'verme', cat: 'Substantivo', boa: 'Animal invertebrado de corpo brando, alongado e sen patas, como a miñoca.', mal: [['Insecto con ás que voa de flor en flor.', 'Non é o que significa.'], ['Que se arrastra pola terra.', 'Un substantivo defínese cun substantivo.']] },
  { palabra: 'rubio, -a', cat: 'Adxectivo', boa: 'Que ten unha cor vermella ou avermellada, como a do sangue ou a do lume.', mal: [['Que ten o cabelo de cor amarela.', 'Iso é «loiro». En galego, «rubio» significa vermello!'], ['Cor vermella.', 'Un adxectivo defínese cunha expresión como «que é…» ou «que ten…».']] },
  { palabra: 'loiro, -a', cat: 'Adxectivo', boa: 'Que ten unha cor amarelada parecida á do ouro; dise sobre todo do cabelo.', mal: [['Que ten a cor do sangue.', 'Iso é «rubio».'], ['Persoa de pelo claro.', 'Un adxectivo non se define cun substantivo.']] },
  { palabra: 'zoar', cat: 'Verbo', boa: 'Producir un ruído continuo e xordo, como o do vento ou o dalgúns insectos.', mal: [['Facer unha zoada.', 'Usa unha palabra da mesma familia (zoada).'], ['Ruído do vento.', 'Un verbo defínese cun verbo.']] },
  { palabra: 'cantar', cat: 'Verbo', boa: 'Producir coa voz sons melodiosos, seguindo unha melodía.', mal: [['Facer cancións.', 'Usa unha palabra da mesma familia (canción).'], ['Persoa que fai música coa voz.', 'Un verbo non se define cun substantivo.']] },
  { palabra: 'diminuto, -a', cat: 'Adxectivo', boa: 'Que é moi pequeno.', mal: [['Tamaño moi pequeno.', 'Un adxectivo defínese cunha expresión como «que é…».'], ['Que está diminuído.', 'Usa unha palabra da mesma familia (diminuír).']] },
  { palabra: 'embigo', cat: 'Substantivo', boa: 'Cicatriz redonda que queda no medio do ventre despois de cortar o cordón que une o bebé coa nai.', mal: [['Que está no medio da barriga.', 'Un substantivo defínese cun substantivo.'], ['Burato.', 'Faltan as características: que burato e onde.']] },
  { palabra: 'bolboreta', cat: 'Substantivo', boa: 'Insecto voador con catro ás grandes, a miúdo de cores rechamantes.', mal: [['Animal que voa.', 'É demasiado xeral: faltan as características.'], ['Paxaro pequeno de cores.', 'Non é un paxaro: é un insecto.']] },
]

const EXEMPLOS_PROFE: [string, Categoria, string][] = [
  ['Eventos', 'Substantivo', 'sucesos de moita importancia'],
  ['Deliberadamente', 'Adverbio', 'de modo voluntario, intencionado ou feito a mantenta'],
  ['Estacional', 'Adxectivo', 'que é propio de determinada época do ano'],
  ['Incitaron', 'Verbo', 'moveron a alguén a realizar algo'],
]

const DEFINIR_TARXETAS: Tarxeta[] = [
  {
    titulo: 'Primeiro: que tipo de palabra é?',
    texto: (
      <>
        <p>Para definir unha palabra hai que ter en conta a súa {b('categoría gramatical')}:</p>
        <ul className="space-y-2">
          <li>Un {b('substantivo')} defínese cun substantivo. <i>Eventos</i>: sucesos de moita importancia.</li>
          <li>Un {b('adverbio')}, cun adverbio ou similar. <i>Deliberadamente</i>: de modo voluntario, intencionado ou feito a mantenta.</li>
          <li>Un {b('adxectivo')}, cunha expresión («que é propio de…», «que se refire a…»). <i>Estacional</i>: que é propio de determinada época do ano.</li>
          <li>Un {b('verbo')}, con outro verbo. <i>Incitaron</i>: moveron a alguén a realizar algo.</li>
        </ul>
      </>
    ),
  },
  {
    titulo: 'Dúas regras máis',
    texto: (
      <ul className="list-disc space-y-2 pl-5">
        <li>
          Pódese {b('completar a definición cun sinónimo')}. <i>Correr</i>: moverse de présa, facer algo con rapidez. Apresurarse.
        </li>
        <li>
          {b('Non')} se inclúe na definición {b('a mesma palabra')} nin {b('palabras da mesma familia léxica')}. Mal: <i>cantar</i>: facer cancións (canción é da familia de cantar).
        </li>
      </ul>
    ),
  },
  {
    titulo: 'Unha técnica para definir',
    texto: (
      <>
        <p className="rounded-xl bg-violet-50 p-3 text-xl font-bold">Palabra: categoría, clase, especie… + características + utilidade (opcional)</p>
        <p className="text-xl">
          <i>Vaso</i>: <span className="rounded bg-sky-100 px-1">recipiente</span> <span className="rounded bg-amber-100 px-1">pequeno e de forma cilíndrica</span> <span className="rounded bg-emerald-100 px-1">que serve para beber</span>.
        </p>
        <p className="text-base text-slate-600">💡 Azul: que clase de cousa é. Amarelo: como é. Verde: para que serve.</p>
      </>
    ),
  },
  {
    titulo: 'Coidado cos falsos amigos',
    texto: (
      <>
        <p>
          Algunhas palabras galegas parécense a outras do castelán, pero non significan o mesmo. Na ficha da profesora hai dúas:
        </p>
        <ul className="space-y-2">
          <li>
            {b('rubio, -a')}: que ten cor <b>vermella</b> (unha mazá rubia, unhas meixelas rubias).
          </li>
          <li>
            {b('loiro, -a')}: que ten cor <b>amarela como o ouro</b> (o cabelo loiro).
          </li>
        </ul>
      </>
    ),
  },
]

const DEFINIR_PREG: Pregunta[] = [
  ...DEFINICIONS.map((d) => elixe(<>Cal é a mellor definición de <b>{d.palabra}</b>?</>, d.boa, d.mal.map(([x]) => x), <>{d.mal.map(([x, m]) => `«${x}»: ${m}`).join(' ')}</>)),
  ...DEFINICIONS.map((d) =>
    elixe(<>Que tipo de palabra é <b>{d.palabra}</b>?</>, d.cat, (['Substantivo', 'Adxectivo', 'Verbo', 'Adverbio'] as const).filter((c) => c !== d.cat), <>{d.palabra} é un {d.cat.toLowerCase()}: defínese {d.cat === 'Verbo' ? 'cun verbo' : d.cat === 'Adxectivo' ? 'cunha expresión como «que é…»' : 'cun substantivo'}.</>),
  ),
  ...EXEMPLOS_PROFE.map(([p, c, def]) => elixe(<>«<b>{p}</b>: {def}». Que tipo de palabra é <b>{p}</b>?</>, c, (['Substantivo', 'Adxectivo', 'Verbo', 'Adverbio'] as const).filter((x) => x !== c), <>Mira como empeza a definición.</>)),
  elixe('Como se define un adxectivo?', 'Cunha expresión como «que é propio de…» ou «que se refire a…»', ['Cun substantivo', 'Cun verbo en infinitivo'], 'Estacional: que é propio de determinada época do ano.'),
  elixe('Que hai que evitar ao definir?', 'A mesma palabra ou palabras da súa familia léxica', ['Os sinónimos', 'As características'], 'Non se define «cantar» con «canción».'),
  elixe('Cal é a orde da técnica para definir?', 'Categoría ou clase + características + utilidade', ['Utilidade + sinónimo + exemplo', 'Exemplo + opinión'], 'Vaso: recipiente (clase) pequeno e cilíndrico (características) que serve para beber (utilidade).'),
]

const DEFINIR_XOGOS: Xogo[] = [
  {
    id: 'categoria',
    titulo: 'Que tipo de palabra é?',
    icono: '🗂️',
    explica: 'Clasifica as palabras da ficha.',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'Substantivo', nome: 'Substantivo', cor: 'border-sky-300 bg-sky-100' },
          { id: 'Adxectivo', nome: 'Adxectivo', cor: 'border-amber-300 bg-amber-100' },
          { id: 'Verbo', nome: 'Verbo', cor: 'border-emerald-300 bg-emerald-100' },
          { id: 'Adverbio', nome: 'Adverbio', cor: 'border-pink-300 bg-pink-100' },
        ]}
        elementos={[...DEFINICIONS.map((d) => ({ texto: d.palabra, caixa: d.cat })), ...EXEMPLOS_PROFE.map(([p, c]) => ({ texto: p.toLowerCase(), caixa: c }))]}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'une',
    titulo: 'Palabra e definición',
    icono: '🔗',
    explica: 'Une cada palabra da ficha coa súa definición.',
    crear: (acabar) => <Une pares={barallar(DEFINICIONS).slice(0, 6).map((d) => ({ palabra: d.palabra, significado: d.boa }))} acabar={acabar} />,
  },
  {
    id: 'mellor',
    titulo: 'A mellor definición',
    icono: '🎯',
    explica: 'Elixe a definición ben feita.',
    crear: (acabar) => <Proba practica cantas={6} preguntas={DEFINIR_PREG.slice(0, 10)} acabar={acabar} />,
  },
  {
    id: 'escribe',
    titulo: 'Define ti',
    icono: '✍️',
    explica: 'Como na ficha: escribe a túa definición e compárala.',
    crear: () => <DefineTi />,
  },
]

function DefineTi() {
  const [orde] = useState(() => barallar(DEFINICIONS))
  const [k, setK] = useState(0)
  const [texto, setTexto] = useState('')
  const [visto, setVisto] = useState(false)
  const d = orde[k % orde.length]
  return (
    <div className="space-y-3">
      <p className="text-center text-3xl font-black text-violet-800">{d.palabra}</p>
      <textarea className="min-h-24 w-full rounded-2xl border-2 border-violet-200 p-3 text-lg" placeholder="A túa definición…" value={texto} onChange={(e) => setTexto(e.target.value)} lang="gl" />
      {!visto ? (
        <button className="btn btn-primario min-h-12 w-full border-violet-600 bg-violet-600 text-lg" disabled={texto.trim().length < 5} onClick={() => setVisto(true)}>
          Comparar co modelo
        </button>
      ) : (
        <>
          <Burbulla>
            <b>Modelo:</b> {d.boa}
          </Burbulla>
          <ul className="space-y-1 rounded-2xl bg-violet-50 p-4 text-lg">
            <li>
              ☐ «{d.palabra}» é un {d.cat.toLowerCase()}: a miña definición empeza {d.cat === 'Verbo' ? 'cun verbo' : d.cat === 'Adxectivo' ? 'con «que é…» ou similar' : 'cun substantivo'}?
            </li>
            <li>☐ Non usei a mesma palabra nin outra da súa familia?</li>
            <li>☐ Dixen que clase de cousa é e como é?</li>
          </ul>
          <button
            className="btn btn-primario min-h-12 w-full border-violet-600 bg-violet-600 text-lg"
            onClick={() => {
              setK(k + 1)
              setTexto('')
              setVisto(false)
            }}
          >
            Outra palabra →
          </button>
        </>
      )}
    </div>
  )
}

export function Definir({ ruta, modo }: { ruta: string; modo?: string }) {
  return (
    <ParadaPrimaria
      ruta={ruta}
      titulo="Definir palabras"
      modo={modo}
      paneis={{
        descubre: <Tarxetas tarxetas={DEFINIR_TARXETAS} xoga={`${ruta}/xoga`} />,
        xoga: <Xogos xogos={DEFINIR_XOGOS} proba={`${ruta}/proba`} />,
        proba: <Proba id="galego1/definir" preguntas={DEFINIR_PREG} />,
      }}
    />
  )
}

export const PREGUNTAS_TEXTOS = { descricion: DESCRICION_PREG, tema: TEMA_PREG, resumo: RESUMO_PREG, definir: DEFINIR_PREG }
