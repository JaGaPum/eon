// Tema 2 de Historia (non entra no parcial do 26 de outubro): o sistema feudal, a sociedade estamental, a arte
// románica e o Camiño de Santiago. Segue o documento «Unidade 2» do profesor, o esquema da pizarra do feudalismo,
// o esquema «Antecedentes do feudalismo» e a presentación «Traballar co románico».
import { Busca, Clasifica, Ordena, Une, VerdadeiroFalso, barallar, type Pregunta, type Tarxeta, type Xogo } from '../../primaria/pezas'
import { elixe, toca } from '../../primaria/paisaxes/preguntas'
import type { Video } from '../../contenido/tema1'
import { Caixa, Lista, Parada, Truco, b } from '../parcial1/roma'
import { Camino, IgrexaRomanica, NOMES_CAMINO, NOMES_FEUDAL, NOMES_IGREXA, NOMES_PLANTA, PiramideFeudal, PlantaCruzLatina } from './debuxos'

type PropsParada = { ruta: string; modo?: string }
const U = 'historia2'

// ===================================================================================================
// 1. O sistema feudal
// ===================================================================================================

const ANTECEDENTES = [
  { palabra: 'Crise económica', significado: 'Falta diñeiro: soben os impostos, hai inflación e suben os prezos.' },
  { palabra: 'Inestabilidade política', significado: 'Corrupción e presión dos bárbaros.' },
  { palabra: 'Crise urbana', significado: 'As cidades decaen e a xente marcha ao campo: ruralización.' },
  { palabra: 'Crise comercial', significado: 'Cae o comercio e cada zona produce só o que necesita: autoabastecemento.' },
  { palabra: 'Crise do escravismo', significado: 'Xa non hai escravos abondo: aparece o colonato.' },
]

const CERIMONIAS = [
  { texto: 'O señor entrega un feudo (terras)', caixa: 'investidura' },
  { texto: 'O vasalo administra o feudo no seu beneficio', caixa: 'investidura' },
  { texto: 'Se o vasalo non cumpre, perde o feudo', caixa: 'investidura' },
  { texto: 'O vasalo xura fidelidade', caixa: 'homenaxe' },
  { texto: 'O vasalo axudará ao señor cando o necesite', caixa: 'homenaxe' },
  { texto: 'O vasalo dálle consello ao señor', caixa: 'homenaxe' },
]

const FEUDAL_TARXETAS: Tarxeta[] = [
  {
    titulo: 'Os antecedentes: a crise de Roma',
    texto: (
      <>
        <p>
          O feudalismo ten as súas raíces na {b('crise do Imperio romano')}, que provocou unha crise económica e inestabilidade política:
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {ANTECEDENTES.map((a) => (
            <Caixa key={a.palabra} titulo={a.palabra}>
              {a.significado}
            </Caixa>
          ))}
        </div>
      </>
    ),
  },
  {
    titulo: 'A orixe (séculos IX – X)',
    texto: (
      <>
        <Lista
          items={[
            <>
              Nace en {b('Europa occidental')} nos séculos {b('IX – X')}.
            </>,
            <>
              Coa {b('división do Imperio carolinxio')} (Tratado de Verdún, 843) ningún herdeiro de Carlomagno puido frear os ataques de {b('normandos (vikingos)')}, musulmáns, húngaros…
            </>,
            <>
              Hai {b('inestabilidade e inseguridade')}: os reis non poden controlar as fronteiras.
            </>,
            <>
              O rei necesita axuda e búscaa nos nobres, que teñen os seus propios exércitos, co {b('pacto feudo-vasalático')}.
            </>,
          ]}
        />
      </>
    ),
  },
  {
    titulo: 'O pacto feudo-vasalático',
    texto: (
      <>
        <p>
          É un {b('vínculo')} (un acordo) entre o {b('señor')} (o rei) e o {b('vasalo')} (un nobre), no que cada parte se compromete a algo:
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          <Caixa titulo="👑 O señor dá">Unha terra, o {b('feudo')}.</Caixa>
          <Caixa titulo="🛡️ O vasalo dá">{b('Fidelidade')}: axuda militar e consello.</Caixa>
        </div>
        <Truco>Funciona porque os nobres queren terras e o rei necesita os seus exércitos. Os dous gañan.</Truco>
      </>
    ),
  },
  {
    titulo: 'Dúas cerimonias',
    texto: (
      <div className="grid gap-2 sm:grid-cols-2">
        <Caixa titulo="🏰 Investidura">
          O señor concede ao vasalo un {b('feudo')} para que o administre no seu propio beneficio. Se o vasalo non cumpre o xuramento, o señor pode quitarllo.
        </Caixa>
        <Caixa titulo="🤝 Homenaxe">
          O vasalo {b('xura fidelidade')} ao señor: axudarao sempre que o necesite e darálle consello cando llo pida.
        </Caixa>
      </div>
    ),
  },
  {
    titulo: 'Que é o feudalismo?',
    texto: (
      <>
        <p>
          O {b('sistema político, social e económico')} baseado nas {b('relacións de vasalaxe')}, que domina Europa durante boa parte da Idade Media.
        </p>
        <p>
          O rei é o señor supremo, pero ten que dar feudos aos seus vasalos. E eses nobres fan o mesmo con outros de menor rango: así se forma a {b('pirámide feudal')}.
        </p>
      </>
    ),
    visual: <PiramideFeudal />,
  },
]

const FEUDAL_XOGOS: Xogo[] = [
  {
    id: 'cerimonias',
    titulo: 'Investidura ou homenaxe?',
    icono: '🤝',
    explica: 'Coloca cada frase na súa cerimonia.',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'investidura', nome: '🏰 Investidura', cor: 'border-amber-300 bg-amber-100' },
          { id: 'homenaxe', nome: '🤝 Homenaxe', cor: 'border-sky-300 bg-sky-100' },
        ]}
        elementos={CERIMONIAS}
        acabar={acabar}
      />
    ),
  },
  { id: 'antecedentes', titulo: 'Os antecedentes', icono: '🏚️', explica: 'Une cada crise co que provocou.', crear: (acabar) => <Une pares={ANTECEDENTES} acabar={acabar} /> },
  {
    id: 'vf',
    titulo: 'Verdadeiro ou falso?',
    icono: '✅',
    explica: 'Sobre o pacto feudo-vasalático.',
    crear: (acabar) => (
      <VerdadeiroFalso
        frases={[
          { texto: 'O feudo é unha terra que o señor entrega ao vasalo.', certa: true, explica: 'Na cerimonia de investidura.' },
          { texto: 'Na homenaxe o señor xura fidelidade ao vasalo.', certa: false, explica: 'É o vasalo quen xura fidelidade ao señor.' },
          { texto: 'O feudalismo nace en Europa occidental nos séculos IX – X.', certa: true, explica: 'Tras dividirse o Imperio carolinxio.' },
          { texto: 'Un vasalo que non cumpre pode perder o feudo.', certa: true, explica: 'O señor pode desposuílo.' },
          { texto: 'O rei tiña un exército tan grande que non necesitaba aos nobres.', certa: false, explica: 'Precisamente necesitaba os exércitos dos nobres.' },
        ]}
        acabar={acabar}
      />
    ),
  },
]

const FEUDAL_PREG: Pregunta[] = [
  elixe('Cando e onde nace o feudalismo?', 'Nos séculos IX – X, en Europa occidental', ['No século I, en Roma', 'No século VII, en Arabia', 'No século XV, en América'], 'Séculos IX – X, Europa occidental.'),
  elixe('Que feito político está na orixe do feudalismo?', 'A división do Imperio carolinxio (Verdún, 843)', ['A fundación de Roma', 'A héxira', 'A caída de Constantinopla'], 'Ningún herdeiro puido defender as fronteiras.'),
  elixe('Quen atacaban Europa e causaban inseguridade?', 'Normandos (vikingos), musulmáns e húngaros', ['Romanos e gregos', 'Bizantinos', 'Os francos'], 'Por iso o rei busca a axuda dos nobres.'),
  elixe('Que é un feudo?', 'Unha terra que o señor entrega ao vasalo', ['Un tipo de imposto', 'Un exército', 'Unha igrexa'], 'O lote de terras.'),
  elixe('Que dá o vasalo ao señor?', 'Fidelidade: axuda militar e consello', ['Terras', 'Ouro', 'Escravos'], 'Fidelidade.'),
  elixe('En que cerimonia recibe o vasalo o feudo?', 'Na investidura', ['Na homenaxe', 'Na coroación', 'No bautismo'], 'Na investidura.'),
  elixe('En que cerimonia xura fidelidade o vasalo?', 'Na homenaxe', ['Na investidura', 'Na héxira', 'No concilio'], 'Na homenaxe.'),
  elixe('Que é o feudalismo?', 'Un sistema político, social e económico baseado na vasalaxe', ['Unha relixión', 'Un estilo artístico', 'Un tipo de cidade'], 'Baseado nas relacións de vasalaxe.'),
  elixe('Por que o rei necesitaba aos nobres?', 'Porque tiñan os seus propios exércitos', ['Porque eran sacerdotes', 'Porque sabían ler', 'Porque eran comerciantes'], 'Os nobres posuían exércitos.'),
  elixe('Que provocou a crise urbana do final de Roma?', 'A ruralización: a xente marcha ao campo', ['O crecemento das cidades', 'A chegada do Islam', 'A construción de catedrais'], 'Ruralización.'),
  elixe('Que é o autoabastecemento?', 'Producir só o que se necesita, sen comerciar', ['Comprar todo fóra', 'Pagar impostos ao rei', 'Vender ao estranxeiro'], 'Consecuencia da crise comercial.'),
  elixe('Que substituíu aos escravos ao final de Roma?', 'O colonato', ['A vasalaxe', 'O feudo', 'A homenaxe'], 'Os colonos traballaban as terras dos nobres.'),
]

export const FEUDAL_VIDEOS: Video[] = [{ id: 'mJD67t6sr8w', titulo: 'Feudalismo: origen y características', canal: 'La cuna de Halicarnaso', minutos: 7 }]

export function Feudalismo(p: PropsParada) {
  return <Parada {...p} unidade={U} id="feudalismo" titulo="O sistema feudal" tarxetas={FEUDAL_TARXETAS} xogos={FEUDAL_XOGOS} preguntas={FEUDAL_PREG} videos={FEUDAL_VIDEOS} />
}

// ===================================================================================================
// 2. A sociedade estamental
// ===================================================================================================

const PERSOAS = [
  { texto: 'Rei', caixa: 'nobreza' },
  { texto: 'Duques, marqueses e condes', caixa: 'nobreza' },
  { texto: 'Vizcondes, baróns e cabaleiros', caixa: 'nobreza' },
  { texto: 'Papa', caixa: 'clero' },
  { texto: 'Bispos e arcebispos', caixa: 'clero' },
  { texto: 'Abades e abadesas', caixa: 'clero' },
  { texto: 'Monxes e monxas', caixa: 'clero' },
  { texto: 'Campesiños', caixa: 'non' },
  { texto: 'Artesáns', caixa: 'non' },
  { texto: 'Comerciantes', caixa: 'non' },
]

const CLERO = [
  { texto: 'Papa', caixa: 'secular' },
  { texto: 'Cardeais e bispos', caixa: 'secular' },
  { texto: 'Sacerdotes de parroquia', caixa: 'secular' },
  { texto: 'Abades e abadesas', caixa: 'regular' },
  { texto: 'Frades, monxes e monxas', caixa: 'regular' },
]

const ESTAMENTOS_TARXETAS: Tarxeta[] = [
  {
    titulo: 'Unha sociedade de estamentos',
    texto: (
      <>
        <p>
          A sociedade feudal é {b('desigual por lei')}. Divídese en {b('estamentos')}: grupos {b('pechados')} aos que se pertence {b('por nacemento')}.
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          <Caixa titulo="⚔️ Nobreza">Privilexiada. Función: a guerra e o goberno.</Caixa>
          <Caixa titulo="✝️ Clero">Privilexiado. Función: orar e coidar dos pobres.</Caixa>
          <Caixa titulo="🌾 Non privilexiados">O futuro «terceiro estado». Función: traballar, pagar impostos e manter aos outros dous.</Caixa>
        </div>
        <Truco>Privilexiados = non pagan impostos, teñen tribunais especiais e gobernan.</Truco>
      </>
    ),
  },
  {
    titulo: '⚔️ A nobreza',
    texto: (
      <Lista
        items={[
          <>
            O {b('rei')}: «primus inter pares», o primeiro entre iguais. A Igrexa dicía que era o representante de Deus na Terra.
          </>,
          <>
            {b('Alta nobreza')}: duques, marqueses e condes. Axudaban ao rei a gobernar, dirixían a guerra, facían xustiza e cobraban impostos.
          </>,
          <>
            {b('Baixa nobreza')}: os segundos fillos, xeralmente vizcondes, baróns e cabaleiros. Gobernaban os seus feudos: a {b('xurisdición señorial')}.
          </>,
        ]}
      />
    ),
  },
  {
    titulo: '✝️ O clero',
    texto: (
      <div className="grid gap-2 sm:grid-cols-2">
        <Caixa titulo="Clero secular">
          Vive entre a xente. O {b('Papa')} á cabeza; cardeais, arcebispos e bispos (alto clero) e sacerdotes de parroquia (baixo clero).
        </Caixa>
        <Caixa titulo="Clero regular">
          Vive segundo unha {b('regra')}, en mosteiros, abadías e conventos. Abades e abadesas (alto clero); frades, monxes e monxas (baixo clero).
        </Caixa>
      </div>
    ),
  },
  {
    titulo: '🌾 Os non privilexiados',
    texto: (
      <>
        <p>Traballaban para os privilexiados, pagaban impostos e rendas pola terra a cambio de protección, e podían ser xulgados por eles.</p>
        <Lista
          items={[
            <>
              {b('Campesiños')}: a inmensa maioría.
            </>,
            <>
              {b('Artesáns')} e {b('comerciantes')}: moi poucos.
            </>,
            <>
              Abaixo de todo, os {b('marxinados')}: pobres, enfermos, orfos… Vivían da caridade e da esmola.
            </>,
          ]}
        />
      </>
    ),
    visual: <PiramideFeudal />,
  },
]

const ESTAMENTOS_XOGOS: Xogo[] = [
  {
    id: 'estamentos',
    titulo: 'Cada un no seu estamento',
    icono: '🗂️',
    explica: 'Nobreza, clero ou non privilexiados?',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'nobreza', nome: '⚔️ Nobreza', cor: 'border-violet-300 bg-violet-100' },
          { id: 'clero', nome: '✝️ Clero', cor: 'border-amber-300 bg-amber-100' },
          { id: 'non', nome: '🌾 Non privilexiados', cor: 'border-lime-300 bg-lime-100' },
        ]}
        elementos={barallar(PERSOAS).slice(0, 8)}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'clero',
    titulo: 'Secular ou regular?',
    icono: '⛪',
    explica: 'Os dous tipos de clero.',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'secular', nome: 'Secular', cor: 'border-sky-300 bg-sky-100' },
          { id: 'regular', nome: 'Regular', cor: 'border-rose-300 bg-rose-100' },
        ]}
        elementos={CLERO}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'piramide',
    titulo: 'Busca na pirámide',
    icono: '🔺',
    explica: 'Toca cada grupo.',
    crear: (acabar) => <Busca Debuxo={PiramideFeudal} nomes={NOMES_FEUDAL} obxectivos={Object.keys(NOMES_FEUDAL)} acabar={acabar} />,
  },
]

const ESTAMENTOS_PREG: Pregunta[] = [
  elixe('Que é un estamento?', 'Un grupo pechado ao que se pertence por nacemento', ['Un tipo de feudo', 'Un cargo do rei', 'Un grupo ao que te apuntas'], 'Pertencese por nacemento.'),
  elixe('Cales eran os estamentos privilexiados?', 'A nobreza e o clero', ['Os campesiños e os artesáns', 'Os comerciantes e o clero', 'Só o rei'], 'Nobreza e clero.'),
  elixe('Cal era a función da nobreza?', 'A guerra e o goberno', ['Orar', 'Traballar a terra', 'Comerciar'], 'Militar e de goberno.'),
  elixe('Cal era a función do clero?', 'Orar e coidar dos pobres', ['Facer a guerra', 'Pagar impostos', 'Construír castelos'], 'Orar e coidar dos pobres.'),
  elixe('Que privilexios tiñan nobres e clero?', 'Non pagaban impostos e tiñan tribunais especiais', ['Pagaban o dobre de impostos', 'Non podían ter terras', 'Traballaban no campo'], 'E exercían labores de goberno.'),
  elixe('Que significa «primus inter pares»?', 'O primeiro entre iguais', ['O último dos nobres', 'O pai da Igrexa', 'O señor dos campesiños'], 'Así se chamaba ao rei.'),
  elixe('Quen formaban a alta nobreza?', 'Duques, marqueses e condes', ['Vizcondes e cabaleiros', 'Bispos e abades', 'Artesáns e comerciantes'], 'Duques, marqueses e condes.'),
  elixe('Quen formaban a baixa nobreza?', 'Vizcondes, baróns e cabaleiros', ['Duques e marqueses', 'Monxes e frades', 'Campesiños'], 'Os segundos fillos, xeralmente.'),
  elixe('Que é o clero regular?', 'O que vive en mosteiros segundo unha regra', ['O que vive entre a xente nas parroquias', 'Os nobres que rezan', 'Os campesiños que axudan'], 'Abades, monxes, monxas…'),
  elixe('O Papa e os bispos son clero…', 'Secular', ['Regular', 'Non privilexiado', 'Nobre'], 'O clero secular.'),
  elixe('Quen eran a inmensa maioría da poboación?', 'Os campesiños', ['Os nobres', 'Os comerciantes', 'Os monxes'], 'Os campesiños.'),
  elixe('Quen estaba na parte máis baixa da pirámide?', 'Os marxinados: pobres, enfermos, orfos', ['Os artesáns', 'Os cabaleiros', 'Os sacerdotes'], 'Vivían da caridade.'),
  toca('Toca o rei.', PiramideFeudal, NOMES_FEUDAL, 'rei', 'Arriba de todo.'),
  toca('Toca os campesiños.', PiramideFeudal, NOMES_FEUDAL, 'campesinos', 'O primeiro chanzo dos non privilexiados.'),
]

export function Estamentos(p: PropsParada) {
  return <Parada {...p} unidade={U} id="estamentos" titulo="A sociedade estamental" tarxetas={ESTAMENTOS_TARXETAS} xogos={ESTAMENTOS_XOGOS} preguntas={ESTAMENTOS_PREG} />
}

// ===================================================================================================
// 3. A arte románica
// ===================================================================================================

const ARTES = [
  { texto: 'Pedra e muros grosos', caixa: 'arquitectura' },
  { texto: 'Ventás estreitas, pouca luz', caixa: 'arquitectura' },
  { texto: 'Planta de cruz latina', caixa: 'arquitectura' },
  { texto: 'Contrafortes', caixa: 'arquitectura' },
  { texto: 'En portadas e capiteis', caixa: 'escultura' },
  { texto: 'Figuras desproporcionadas', caixa: 'escultura' },
  { texto: 'Pórtico da Gloria', caixa: 'escultura' },
  { texto: 'Nos ábsides, sobre a parede', caixa: 'pintura' },
  { texto: 'Cores vivas e liñas grosas', caixa: 'pintura' },
  { texto: 'Pantocrátor de Tahull', caixa: 'pintura' },
]

const ROMANICO_TARXETAS: Tarxeta[] = [
  {
    titulo: 'Que é o románico?',
    texto: (
      <>
        <Lista
          items={[
            <>
              Desenvólvese nos séculos {b('XI – XII')}.
            </>,
            <>Inspírase na arte de Roma e toma elementos bizantinos e carolinxios.</>,
            <>
              O gran modelo é a {b('abadía de Cluny')}, en Francia, dende onde se estende por Europa.
            </>,
            <>
              É unha arte {b('relixiosa')} (igrexas e mosteiros): o triunfo do cristianismo en Europa.
            </>,
          ]}
        />
        <Truco>As igrexas románicas son «{b('biblias de pedra')}»: como a maioría da xente non sabía ler, as esculturas e pinturas contaban a fe en imaxes.</Truco>
      </>
    ),
  },
  {
    titulo: '🏛️ A arquitectura, o máis importante',
    texto: (
      <Lista
        items={[
          <>
            {b('Pedra')}, con {b('muros grosos')} e {b('ventás estreitas')}: pouca luz, para o recollemento entre quen ora e Deus.
          </>,
          <>
            {b('Contrafortes')} por fóra, para soster os muros.
          </>,
          <>
            Plantas: {b('cruz latina')} (a máis usada), cruz grega e basilical.
          </>,
          <>
            Exemplo: San Martín de Frómista. Igrexa de peregrinación: {b('Santiago de Compostela')}.
          </>,
        ]}
      />
    ),
    visual: <IgrexaRomanica />,
  },
  { titulo: 'A planta de cruz latina', texto: <p>Vista dende arriba, a igrexa ten forma de cruz cun brazo longo (a nave) e un curto (o cruceiro).</p>, visual: <PlantaCruzLatina />, ancho: true },
  {
    titulo: '🗿 A escultura e 🎨 a pintura',
    texto: (
      <div className="grid gap-2 sm:grid-cols-2">
        <Caixa titulo="Escultura">
          Sobre todo en {b('portadas')} e {b('capiteis')}, de pedra, marfil ou madeira. Figuras {b('desproporcionadas')} que se adaptan ao espazo (a {b('lei do marco')}). Exemplos: Portada das Praterías e {b('Pórtico da Gloria')}, en Santiago.
        </Caixa>
        <Caixa titulo="Pintura">
          {b('Mural')}, sobre todo nos {b('ábsides')}. {b('Cores vivas e liñas grosas')}, figuras {b('hieráticas')} (ríxidas e sen expresión). Deus aparece como {b('Pantocrátor')}: exemplo, o de Tahull.
        </Caixa>
      </div>
    ),
  },
]

const ROMANICO_XOGOS: Xogo[] = [
  {
    id: 'igrexa',
    titulo: 'Busca na igrexa',
    icono: '⛪',
    explica: 'Toca cada parte da igrexa románica.',
    crear: (acabar) => <Busca Debuxo={IgrexaRomanica} nomes={NOMES_IGREXA} obxectivos={Object.keys(NOMES_IGREXA)} acabar={acabar} />,
  },
  {
    id: 'planta',
    titulo: 'Busca na planta',
    icono: '✝️',
    explica: 'Toca cada parte da planta de cruz latina.',
    crear: (acabar) => <Busca Debuxo={PlantaCruzLatina} nomes={NOMES_PLANTA} obxectivos={Object.keys(NOMES_PLANTA)} acabar={acabar} />,
  },
  {
    id: 'artes',
    titulo: 'Arquitectura, escultura ou pintura?',
    icono: '🗂️',
    explica: 'Coloca cada característica.',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'arquitectura', nome: '🏛️ Arquitectura', cor: 'border-stone-300 bg-stone-100' },
          { id: 'escultura', nome: '🗿 Escultura', cor: 'border-amber-300 bg-amber-100' },
          { id: 'pintura', nome: '🎨 Pintura', cor: 'border-rose-300 bg-rose-100' },
        ]}
        elementos={barallar(ARTES).slice(0, 9)}
        acabar={acabar}
      />
    ),
  },
]

const ROMANICO_PREG: Pregunta[] = [
  elixe('En que séculos se desenvolve o románico?', 'XI – XII', ['V – VI', 'XIV – XV', 'I – II'], 'Séculos XI – XII.'),
  elixe('Que abadía é o gran modelo do románico?', 'Cluny, en Francia', ['Santa Sofía', 'Aquisgrán', 'Córdoba'], 'A abadía de Cluny.'),
  elixe('Por que as igrexas románicas se chaman «biblias de pedra»?', 'Porque as súas imaxes ensinaban a fe a xente que non sabía ler', ['Porque teñen biblias gardadas', 'Porque están feitas con libros', 'Porque son moi pequenas'], 'A escultura e a pintura eran ferramentas para ensinar.'),
  elixe('Por que os templos románicos teñen muros grosos?', 'Para soster o peso da pedra (e por iso as ventás son estreitas)', ['Para que entre moita luz', 'Porque eran castelos', 'Para decorar'], 'Muros grosos de pedra, reforzados con contrafortes.'),
  elixe('Cal é a planta máis usada no románico?', 'A cruz latina', ['A circular', 'A octogonal', 'A cadrada'], 'A cruz latina.'),
  elixe('Para que serven os contrafortes?', 'Para reforzar os muros por fóra', ['Para iluminar', 'Para tocar as campás', 'Para entrar na igrexa'], 'Sosteñen os muros.'),
  elixe('Onde está sobre todo a escultura románica?', 'Nas portadas e nos capiteis', ['Nos tellados', 'Nos chans', 'Nas torres'], 'Portadas e capiteis.'),
  elixe('Onde está sobre todo a pintura románica?', 'Nos ábsides, sobre a parede', ['En lenzos', 'Nos libros', 'Nas portas'], 'Pintura mural nos ábsides.'),
  elixe('Que é a lei do marco?', 'As figuras adáptanse ao espazo que teñen', ['Unha lei do rei', 'Pintar sempre en marcos dourados', 'Unha norma dos peregrinos'], 'Por iso saen desproporcionadas.'),
  elixe('Como son as figuras da pintura románica?', 'Hieráticas: ríxidas e sen expresión', ['Moi realistas e en movemento', 'Sempre de perfil e sorrindo', 'Abstractas'], 'Hieráticas.'),
  elixe('Que é o Pantocrátor?', 'A representación de Deus (Cristo) en maxestade', ['Un arco de pedra', 'Un tipo de igrexa', 'Un peregrino'], 'Exemplo: o de Tahull.'),
  elixe('Cal destas obras está en Santiago de Compostela?', 'O Pórtico da Gloria', ['O Pantocrátor de Tahull', 'San Martín de Frómista', 'A abadía de Cluny'], 'E a Portada das Praterías.'),
  toca('Toca un contraforte.', IgrexaRomanica, NOMES_IGREXA, 'contraforte', 'Os reforzos do muro por fóra.'),
  toca('Toca a ábsida.', IgrexaRomanica, NOMES_IGREXA, 'absida', 'A cabeceira redondeada.'),
  toca('Toca o arco de medio punto.', IgrexaRomanica, NOMES_IGREXA, 'arco', 'O semicírculo enriba da porta.'),
  toca('Toca o cruceiro.', PlantaCruzLatina, NOMES_PLANTA, 'cruceiro', 'O brazo curto da cruz.'),
  toca('Toca a nave central.', PlantaCruzLatina, NOMES_PLANTA, 'nave', 'O brazo longo, no medio.'),
]

export const ROMANICO_VIDEOS: Video[] = [{ id: 'jY0FEfPlzl4', titulo: 'Repasa el románico en 7 minutos', canal: '¡Menudo historión!', minutos: 7 }]

export function Romanico(p: PropsParada) {
  return <Parada {...p} unidade={U} id="romanico" titulo="A arte románica" tarxetas={ROMANICO_TARXETAS} xogos={ROMANICO_XOGOS} preguntas={ROMANICO_PREG} videos={ROMANICO_VIDEOS} />
}

// ===================================================================================================
// 4. O Camiño de Santiago
// ===================================================================================================

const CAMINO_FAVORECEU = [
  { palabra: 'Cidades', significado: 'Nacen poboacións e florecen as cidades do Camiño: Pamplona, Burgos, León.' },
  { palabra: 'Hospitais', significado: 'Casas de hóspedes, hospitais e igrexas para atender aos peregrinos.' },
  { palabra: 'Comercio', significado: 'Aparecen artesáns e mercaderes.' },
  { palabra: 'Ideas', significado: 'Expándese o románico e chegan ideas e costumes de Europa.' },
]

const CAMINO_TARXETAS: Tarxeta[] = [
  {
    titulo: 'Como empezou',
    texto: (
      <Lista
        items={[
          <>
            No {b('século IX')} atopáronse os restos do apóstolo {b('Santiago')}.
          </>,
          <>
            No {b('século XI')} comezou a construírse a {b('Catedral de Santiago')}, sobre a igrexa primitiva, para venerar a súa tumba.
          </>,
          <>Santiago converteuse nun gran centro de peregrinación.</>,
        ]}
      />
    ),
  },
  {
    titulo: 'A ruta',
    texto: (
      <>
        <p>
          O Camiño era a ruta dos peregrinos cristiáns da Península e de Europa. Comezaba en {b('Roncesvalles')} e chegaba a {b('Compostela')}.
        </p>
        <p>A meta, despois dunha viaxe dura, era chegar a Santiago para cumprir unha penitencia ou unha promesa.</p>
      </>
    ),
    visual: <Camino />,
    ancho: true,
  },
  {
    titulo: 'Que favoreceu o Camiño?',
    texto: (
      <div className="grid gap-2 sm:grid-cols-2">
        {CAMINO_FAVORECEU.map((c) => (
          <Caixa key={c.palabra} titulo={c.palabra}>
            {c.significado}
          </Caixa>
        ))}
      </div>
    ),
  },
  {
    titulo: 'As igrexas de peregrinación',
    texto: (
      <p>
        Eran máis grandes que as outras, con naves laterais e un deambulatorio arredor da ábsida, para que os peregrinos puidesen camiñar e ver as reliquias sen interromper a misa. A de Santiago é a gran igrexa de peregrinación do románico.
      </p>
    ),
  },
]

const CAMINO_XOGOS: Xogo[] = [
  {
    id: 'mapa',
    titulo: 'Busca no Camiño',
    icono: '🐚',
    explica: 'Toca cada cidade do Camiño.',
    crear: (acabar) => <Busca Debuxo={Camino} nomes={NOMES_CAMINO} obxectivos={Object.keys(NOMES_CAMINO)} acabar={acabar} />,
  },
  {
    id: 'ruta',
    titulo: 'A ruta, en orde',
    icono: '🥾',
    explica: 'De Roncesvalles a Santiago.',
    crear: (acabar) => <Ordena frases={[{ palabras: ['Roncesvalles', 'Pamplona', 'Burgos', 'León', 'Santiago'], traducion: 'Do comezo á meta' }]} acabar={acabar} />,
  },
  { id: 'favoreceu', titulo: 'Que favoreceu?', icono: '🔗', explica: 'Une cada palabra co que trouxo o Camiño.', crear: (acabar) => <Une pares={CAMINO_FAVORECEU} acabar={acabar} /> },
]

const CAMINO_PREG: Pregunta[] = [
  elixe('Cando se atoparon os restos do apóstolo Santiago?', 'No século IX', ['No século I', 'No século XI', 'No século XV'], 'No s. IX.'),
  elixe('Cando se empezou a construír a Catedral de Santiago?', 'No século XI', ['No século IX', 'No século V', 'No século XIV'], 'No s. XI, sobre a igrexa primitiva.'),
  elixe('Onde comezaba o Camiño?', 'En Roncesvalles', ['En Lugo', 'En Roma', 'En Cluny'], 'Roncesvalles, nos Pireneos.'),
  elixe('Para que ían os peregrinos a Santiago?', 'Para cumprir unha penitencia ou unha promesa', ['Para comerciar', 'Para facer a guerra', 'Para estudar'], 'Penitencia ou promesa.'),
  elixe('Cal destas cidades está no Camiño?', 'Burgos', ['Sevilla', 'Valencia', 'Cádiz'], 'Pamplona, Burgos, León…'),
  elixe('Que se construíu para atender aos peregrinos?', 'Casas de hóspedes, hospitais e igrexas', ['Anfiteatros', 'Mezquitas', 'Acuedutos'], 'Para as súas necesidades.'),
  elixe('Que estilo artístico se espallou grazas ao Camiño?', 'O románico', ['O islámico', 'O bizantino', 'O romano'], 'O románico.'),
  elixe('Que diferenza ten unha igrexa de peregrinación?', 'É máis grande e permite camiñar arredor da ábsida', ['Non ten altar', 'É de madeira', 'Non ten portas'], 'Para que os peregrinos vexan as reliquias.'),
  elixe('Que lle pasou ao comercio co Camiño?', 'Desenvolveuse, con artesáns e mercaderes', ['Desapareceu', 'Prohibiuse', 'Só se vendían cunchas'], 'Creáronse núcleos de artesáns e mercaderes.'),
  toca('Toca Santiago de Compostela.', Camino, NOMES_CAMINO, 'santiago', 'A meta, ao oeste.'),
  toca('Toca Roncesvalles.', Camino, NOMES_CAMINO, 'roncesvalles', 'O comezo, nos Pireneos.'),
  toca('Toca León.', Camino, NOMES_CAMINO, 'leon', 'Entre Burgos e Santiago.'),
]

export function CaminoSantiago(p: PropsParada) {
  return <Parada {...p} unidade={U} id="camino" titulo="O Camiño de Santiago" tarxetas={CAMINO_TARXETAS} xogos={CAMINO_XOGOS} preguntas={CAMINO_PREG} />
}

export const PREGUNTAS_TEMA2: Record<string, Pregunta[]> = { feudalismo: FEUDAL_PREG, estamentos: ESTAMENTOS_PREG, romanico: ROMANICO_PREG, camino: CAMINO_PREG }
