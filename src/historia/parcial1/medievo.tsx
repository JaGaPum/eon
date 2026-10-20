// Tema 1: A Idade Media. Bizancio, o Islam e o Imperio carolinxio. Segue o «Resumo de estudo» da Unidade 1 do
// profesor e as súas presentacións do Imperio bizantino, do mundo islámico e do Imperio carolinxio.
import { Busca, Clasifica, Ordena, Une, VerdadeiroFalso, barallar, type Pregunta, type Tarxeta, type Xogo } from '../../primaria/pezas'
import { elixe, toca } from '../../primaria/paisaxes/preguntas'
import type { Video } from '../../contenido/tema1'
import { FEITOS_MEDIEVO } from './datos'
import { Mezquita, NOMES_ANDALUS, NOMES_CIVILIZACIONS, NOMES_MEZQUITA, NOMES_VERDUN, PiramideAndalus, TresCivilizacions, Verdun } from './debuxos'
import { Caixa, Lista, Parada, Truco, b } from './roma'
import { enQuePeriodo, queFoiAntes, seriesOrde } from './xerar'

type PropsParada = { ruta: string; modo?: string }
const feito = (id: string) => FEITOS_MEDIEVO.find((x) => x.id === id)!

// ===================================================================================================
// 5. A Idade Media e as tres civilizacións
// ===================================================================================================

const CIVILIZACIONS = [
  { texto: 'Os «bárbaros» ocupan o Imperio de Occidente', caixa: 'occidente' },
  { texto: 'Reino Franco, Suevo, Visigodo', caixa: 'occidente' },
  { texto: 'Civilización cristiá occidental', caixa: 'occidente' },
  { texto: 'Continúa o Imperio romano de Oriente', caixa: 'bizancio' },
  { texto: 'Capital en Constantinopla', caixa: 'bizancio' },
  { texto: 'Civilización cristiá oriental', caixa: 'bizancio' },
  { texto: 'Nace no século VII en Arabia', caixa: 'islam' },
  { texto: 'Chega ao norte de África e Persia', caixa: 'islam' },
  { texto: 'Civilización islámica', caixa: 'islam' },
]

const MEDIA_TARXETAS: Tarxeta[] = [
  {
    titulo: 'Que é a Idade Media?',
    texto: (
      <>
        <p>
          É a etapa da historia que vai dende a {b('caída do Imperio romano de Occidente')} (476) ata a {b('Conquista de América')} (1492). Uns {b('1000 anos')}, que se dividen en tres períodos:
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          <Caixa titulo="Alta Idade Media">Séculos V – X</Caixa>
          <Caixa titulo="Plena Idade Media">Séculos XI – XIII</Caixa>
          <Caixa titulo="Baixa Idade Media">Séculos XIV – XV</Caixa>
        </div>
        <Truco>Alta, Plena, Baixa: como unha montaña que sobe, chega arriba e baixa.</Truco>
        <Truco>O século dun ano: quítalle as dúas últimas cifras e súmalle un (622 → 6 + 1 = século VII). Se acaba en 00, non se suma: o 800 é aínda o século VIII.</Truco>
      </>
    ),
  },
  {
    titulo: 'Por que tres civilizacións?',
    texto: (
      <>
        <p>Ao dividirse e caer o Imperio romano, o seu territorio quedou repartido entre tres grandes civilizacións:</p>
        <div className="grid gap-2 sm:grid-cols-3">
          <Caixa titulo="🔵 Occidente" cor="border-blue-300">
            Os «bárbaros» ocupan o Imperio de Occidente dende o século V. Xorden reinos cristiáns (Franco, Suevo, Visigodo…). É a {b('civilización cristiá occidental')}.
          </Caixa>
          <Caixa titulo="🩷 Oriente" cor="border-pink-300">
            O Imperio bizantino continúa o Imperio romano de Oriente. Herdeiro da cultura grecorromana, coa capital en Constantinopla. É a {b('civilización cristiá oriental')}.
          </Caixa>
          <Caixa titulo="🟢 Islam" cor="border-green-300">
            Nace no século VII na Península Arábiga e esténdese rápido polo Mediterráneo, o norte de África e Persia. É a {b('civilización islámica')}.
          </Caixa>
        </div>
      </>
    ),
  },
  { titulo: 'O mapa arredor do ano 1000', texto: <p>Así quedaba o Mediterráneo. Busca cada civilización e as cidades principais.</p>, visual: <TresCivilizacions />, ancho: true },
]

const MEDIA_XOGOS: Xogo[] = [
  {
    id: 'mapa',
    titulo: 'Busca no mapa',
    icono: '🗺️',
    explica: 'Toca cada civilización.',
    crear: (acabar) => <Busca Debuxo={TresCivilizacions} nomes={NOMES_CIVILIZACIONS} obxectivos={Object.keys(NOMES_CIVILIZACIONS)} acabar={acabar} />,
  },
  {
    id: 'clasifica',
    titulo: 'De que civilización é?',
    icono: '🗂️',
    explica: 'Occidente, Bizancio ou Islam?',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'occidente', nome: 'Occidente', cor: 'border-blue-300 bg-blue-100' },
          { id: 'bizancio', nome: 'Bizancio', cor: 'border-pink-300 bg-pink-100' },
          { id: 'islam', nome: 'Islam', cor: 'border-green-300 bg-green-100' },
        ]}
        elementos={CIVILIZACIONS}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'periodos',
    titulo: 'Os tres períodos',
    icono: '⛰️',
    explica: 'Pon os períodos da Idade Media en orde.',
    crear: (acabar) => <Ordena frases={[{ palabras: ['Alta Idade Media', 'Plena Idade Media', 'Baixa Idade Media'], traducion: 'Do máis antigo ao máis recente' }]} acabar={acabar} />,
  },
]

const MEDIA_PREG: Pregunta[] = [
  elixe('Cando empeza a Idade Media?', 'Coa caída do Imperio romano de Occidente (476)', ['Coa fundación de Roma', 'Co nacemento do Islam', 'Coa Conquista de América'], 'No 476.'),
  elixe('Cando remata a Idade Media?', 'Coa Conquista de América (1492)', ['Coa caída de Roma', 'Co Tratado de Verdún', 'Coa coroación de Carlomagno'], 'No 1492.'),
  elixe('Cantos anos dura, aproximadamente, a Idade Media?', 'Uns 1000 anos', ['Uns 100 anos', 'Uns 300 anos', 'Uns 5000 anos'], 'Do 476 ao 1492: uns mil anos.'),
  elixe('Que séculos abrangue a Alta Idade Media?', 'Do V ao X', ['Do XI ao XIII', 'Do XIV ao XV', 'Do I ao V'], 'Séculos V – X.'),
  elixe('Que séculos abrangue a Plena Idade Media?', 'Do XI ao XIII', ['Do V ao X', 'Do XIV ao XV', 'Do VIII ao IX'], 'Séculos XI – XIII.'),
  elixe('Que séculos abrangue a Baixa Idade Media?', 'Do XIV ao XV', ['Do V ao X', 'Do XI ao XIII', 'Do XVI ao XVII'], 'Séculos XIV – XV.'),
  elixe('Que civilización continuou o Imperio romano de Oriente?', 'O Imperio bizantino', ['O Islam', 'O Reino Franco', 'O Reino Visigodo'], 'Bizancio, con capital en Constantinopla.'),
  elixe('Onde naceu o Islam?', 'Na Península Arábiga, no século VII', ['En Constantinopla, no século V', 'En Roma, no século I', 'Na Galia, no século VIII'], 'En Arabia, no s. VII.'),
  elixe('Cal destes reinos é da civilización cristiá occidental?', 'O Reino Suevo', ['O Imperio bizantino', 'O califato de Damasco', 'Persia'], 'Os reinos «bárbaros» cristiáns: Franco, Suevo, Visigodo…'),
  toca('Toca o Imperio bizantino.', TresCivilizacions, NOMES_CIVILIZACIONS, 'bizancio', 'Ao leste, arredor de Constantinopla.'),
  toca('Toca o Islam.', TresCivilizacions, NOMES_CIVILIZACIONS, 'islam', 'O sur e o leste do Mediterráneo, e tamén o sur de Hispania (Córdoba).'),
  toca('Toca o Occidente cristián.', TresCivilizacions, NOMES_CIVILIZACIONS, 'occidente', 'O norte e o oeste, con Roma.'),
  ...['carlomagno', 'cisma', 'constantinopla', 'hexira'].map((id) => enQuePeriodo(feito(id))),
]

export function IdadeMedia(p: PropsParada) {
  return <Parada {...p} id="idademedia" titulo="A Idade Media e as tres civilizacións" tarxetas={MEDIA_TARXETAS} xogos={MEDIA_XOGOS} preguntas={MEDIA_PREG} />
}

// ===================================================================================================
// 6. A civilización bizantina
// ===================================================================================================

const BIZANCIO_DATOS = [
  { texto: 'Máxima autoridade: o emperador', caixa: 'politica' },
  { texto: 'Esplendor con Xustiniano (s. VI)', caixa: 'politica' },
  { texto: 'Controlan o comercio do Mediterráneo', caixa: 'economia' },
  { texto: 'Moeda forte', caixa: 'economia' },
  { texto: 'Gran flota comercial', caixa: 'economia' },
  { texto: 'Falan grego', caixa: 'cultura' },
  { texto: 'Bibliotecas: pensamento grecolatino', caixa: 'cultura' },
  { texto: 'Conservan o dereito romano', caixa: 'cultura' },
  { texto: 'Santa Sofía', caixa: 'cultura' },
  { texto: 'Patriarca de Constantinopla', caixa: 'relixion' },
  { texto: 'Non obedecen ao Papa', caixa: 'relixion' },
  { texto: 'Igrexa ortodoxa', caixa: 'relixion' },
]

const BIZANCIO_TARXETAS: Tarxeta[] = [
  {
    titulo: 'De onde sae Bizancio?',
    texto: (
      <>
        <p>
          O Imperio romano dividiuse en dúas partes no {b('século IV d.C.')}:
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          <Caixa titulo="Occidente">Acosado polos «bárbaros». Cae no 476.</Caixa>
          <Caixa titulo="Oriente">
            Gran prosperidade, capital en {b('Constantinopla')} (Bizancio en grego, hoxe {b('Estambul')}). Dará lugar ao {b('Imperio bizantino')}.
          </Caixa>
        </div>
      </>
    ),
  },
  {
    titulo: 'Como era o Imperio bizantino',
    texto: (
      <div className="grid gap-2 sm:grid-cols-2">
        <Caixa titulo="👑 Política">
          Máxima autoridade: o {b('emperador')}. Máximo esplendor con {b('Xustiniano')} no século VI: recuperou Italia, o norte de África e o sur de Hispania.
        </Caixa>
        <Caixa titulo="💰 Economía">
          Gran poder económico grazas ao {b('control do comercio mediterráneo')}: unha {b('moeda forte')} e unha potente {b('flota comercial')} que une Oriente e Occidente.
        </Caixa>
        <Caixa titulo="📚 Cultura">
          A súa lingua é o {b('grego')}. Conservan o pensamento grecolatino (bibliotecas) e o {b('dereito romano')}, e seguen os modelos romanos de arquitectura: {b('Santa Sofía')} de Constantinopla.
        </Caixa>
        <Caixa titulo="✝️ Relixión">
          Dirixida polo {b('Patriarca de Constantinopla')}, que non obedecía ao Papa de Roma.
        </Caixa>
      </div>
    ),
  },
  {
    titulo: 'O Cisma de Oriente (século XI)',
    texto: (
      <>
        <p>As diferenzas entre Oriente e Occidente foron medrando ata a ruptura: a separación relixiosa dentro do cristianismo.</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <Caixa titulo="☦️ Igrexa ortodoxa">Obedece ao Patriarca de Constantinopla.</Caixa>
          <Caixa titulo="✝️ Igrexa católica">Obedece ao Papa de Roma.</Caixa>
        </div>
        <Truco>Cisma = separación. «Ortodoxa» está en Oriente: as dúas teñen unha O.</Truco>
      </>
    ),
  },
  {
    titulo: 'Santa Sofía',
    texto: (
      <>
        <p>
          A gran igrexa de Constantinopla, do tempo de Xustiniano. Ten unha enorme {b('cúpula central')} e mosaicos dourados.
        </p>
        <p>Cando os turcos conquistaron a cidade, convertérona en mezquita: por iso hoxe ten minaretes e grandes medallóns con letras árabes.</p>
      </>
    ),
  },
  {
    titulo: 'O final de Bizancio',
    texto: (
      <Lista
        items={[
          <>Ata o século VII ameazárono os {b('persas')} e os {b('eslavos')}.</>,
          <>Dende o século VII, a {b('expansión do Islam')}.</>,
          <>
            Finalmente os {b('turcos')}, un pobo islamizado, conquistaron Constantinopla no {b('1453')}. A cidade pasou a chamarse Estambul.
          </>,
        ]}
      />
    ),
  },
]

const BIZANCIO_XOGOS: Xogo[] = [
  {
    id: 'clasifica',
    titulo: 'Política, economía, cultura ou relixión?',
    icono: '🗂️',
    explica: 'Coloca cada dato de Bizancio na súa caixa.',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'politica', nome: '👑 Política', cor: 'border-violet-300 bg-violet-100' },
          { id: 'economia', nome: '💰 Economía', cor: 'border-amber-300 bg-amber-100' },
          { id: 'cultura', nome: '📚 Cultura', cor: 'border-sky-300 bg-sky-100' },
          { id: 'relixion', nome: '✝️ Relixión', cor: 'border-rose-300 bg-rose-100' },
        ]}
        elementos={barallar(BIZANCIO_DATOS).slice(0, 8)}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'vf',
    titulo: 'Verdadeiro ou falso?',
    icono: '✅',
    explica: 'Sobre o Imperio bizantino.',
    crear: (acabar) => (
      <VerdadeiroFalso
        frases={[
          { texto: 'A lingua de Bizancio era o latín.', certa: false, explica: 'Era o grego.' },
          { texto: 'Constantinopla é hoxe Estambul.', certa: true, explica: 'Bizancio en grego, Estambul despois de 1453.' },
          { texto: 'O Patriarca de Constantinopla obedecía ao Papa.', certa: false, explica: 'Non o obedecía.' },
          { texto: 'O máximo esplendor foi con Xustiniano, no século VI.', certa: true, explica: 'Recuperou boa parte do Mediterráneo.' },
          { texto: 'Os turcos conquistaron Constantinopla no 1453.', certa: true, explica: 'É o final de Bizancio.' },
          { texto: 'No Cisma de Oriente sepáranse a Igrexa ortodoxa e a católica.', certa: true, explica: 'No século XI.' },
          { texto: 'Bizancio perdeu o dereito romano.', certa: false, explica: 'Conservárono.' },
        ]}
        acabar={acabar}
      />
    ),
  },
]

const BIZANCIO_PREG: Pregunta[] = [
  elixe('Cal era a capital do Imperio bizantino?', 'Constantinopla', ['Roma', 'Aquisgrán', 'Damasco'], 'Constantinopla, hoxe Estambul.'),
  elixe('Como se chama hoxe Constantinopla?', 'Estambul', ['Atenas', 'Damasco', 'Bagdad'], 'Estambul.'),
  elixe('Que lingua falaban en Bizancio?', 'O grego', ['O latín', 'O árabe', 'O galego'], 'O grego.'),
  elixe('Quen tiña a máxima autoridade en Bizancio?', 'O emperador', ['O Papa', 'O califa', 'O Senado'], 'O emperador.'),
  elixe('Con que emperador viviu Bizancio o seu máximo esplendor?', 'Xustiniano, no século VI', ['Augusto, no século I a.C.', 'Carlomagno, no século IX', 'Mahoma, no século VII'], 'Xustiniano, no s. VI.'),
  elixe('De onde viña o gran poder económico de Bizancio?', 'Do control do comercio mediterráneo', ['Das minas de ouro de Galicia', 'Das conquistas en América', 'Da agricultura de regadío'], 'Moeda forte e flota comercial.'),
  elixe('Quen dirixía a relixión en Bizancio?', 'O Patriarca de Constantinopla', ['O Papa de Roma', 'O califa', 'O emperador de Occidente'], 'O Patriarca, que non obedecía ao Papa.'),
  elixe('Que foi o Cisma de Oriente?', 'A separación entre a Igrexa ortodoxa e a católica', ['A división do Imperio romano', 'A conquista turca', 'A fuxida de Mahoma'], 'No século XI.'),
  elixe('A Igrexa ortodoxa obedece…', 'Ao Patriarca de Constantinopla', ['Ao Papa de Roma', 'Ao califa', 'Ao rei dos francos'], 'A católica obedece ao Papa.'),
  elixe('Cal é o gran edificio bizantino?', 'Santa Sofía de Constantinopla', ['A Mezquita de Córdoba', 'A capela de Aquisgrán', 'O Coliseo'], 'Santa Sofía.'),
  elixe('Quen conquistou Constantinopla no 1453?', 'Os turcos', ['Os persas', 'Os francos', 'Os eslavos'], 'Os turcos, un pobo islamizado.'),
  elixe('Quen ameazou a Bizancio ata o século VII?', 'Persas e eslavos', ['Turcos', 'Francos', 'Vikingos'], 'Persas e eslavos; despois, o Islam.'),
  ...queFoiAntes(['xustiniano', 'cisma', 'constantinopla', 'hexira'].map(feito), 3),
]

export const BIZANCIO_VIDEOS: Video[] = [{ id: '7X-CUa8cAB0', titulo: 'Historia del Imperio Bizantino (resumen)', canal: 'Clases Particulares en Ávila', minutos: 4 }]

export function Bizancio(p: PropsParada) {
  return <Parada {...p} id="bizancio" titulo="A civilización bizantina" tarxetas={BIZANCIO_TARXETAS} xogos={BIZANCIO_XOGOS} preguntas={BIZANCIO_PREG} videos={BIZANCIO_VIDEOS} />
}

// ===================================================================================================
// 7. O Islam: orixe e doutrina
// ===================================================================================================

const PRECEPTOS = ['Só existe un Deus: Alá.', 'Orar cinco veces ao día en dirección á Meca.', 'Peregrinar á Meca polo menos unha vez na vida.', 'Xaxún durante o mes de Ramadán.', 'Practicar a esmola.']

const CARGOS = [
  { palabra: 'Califa', significado: 'Máxima autoridade política e relixiosa.' },
  { palabra: 'Visir', significado: 'Primeiro ministro.' },
  { palabra: 'Emir', significado: 'Gobernador dunha provincia.' },
  { palabra: 'Cadí', significado: 'Xuíz.' },
  { palabra: 'Diwán', significado: 'Tesoureiro real.' },
]

const ISLAM_TARXETAS: Tarxeta[] = [
  {
    titulo: 'Que é o Islam?',
    texto: (
      <>
        <p>
          O Islam («{b('submisión a Deus')}») é unha relixión {b('monoteísta')} (un só deus). Os que a practican son os {b('musulmáns')}.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          <Caixa titulo="Árabe">Quen naceu nun país onde se fala árabe (son 22). Non ten que ver coa relixión.</Caixa>
          <Caixa titulo="Musulmán">Quen cre na relixión de Mahoma.</Caixa>
        </div>
        <Truco>Pódese ser árabe sen ser musulmán (en Exipto hai millóns de árabes cristiáns) e musulmán sen ser árabe (en Indonesia o 99 % son musulmáns).</Truco>
      </>
    ),
  },
  {
    titulo: 'A orixe: un lugar, un profeta, unha data',
    texto: (
      <div className="grid gap-2">
        <Caixa titulo="📍 Un lugar: a Península Arábiga">Un espazo desértico, con tribos nómades árabes e lugar de paso de comerciantes entre Europa e Oriente.</Caixa>
        <Caixa titulo="🧔 Un profeta: Mahoma (570 – 632)">
          Comerciante árabe que aos 40 anos di que o arcanxo {b('Gabriel')} lle revelou que era o elixido para transmitir a mensaxe de {b('Alá')} (Deus). As autoridades da Meca, politeístas, perségueno; ao principio só cren nel {b('Khadija')}, a súa muller, e algúns amigos.
        </Caixa>
        <Caixa titulo="📅 Unha data: o 622, a héxira">
          A {b('héxira')} é a fuxida de Mahoma da {b('Meca')} a {b('Medina')}, porque o querían matar. É o {b('comezo do calendario musulmán')}. En Medina Mahoma convértese en xefe político e relixioso e comeza a expansión.
        </Caixa>
      </div>
    ),
  },
  {
    titulo: 'A relixión islámica',
    texto: (
      <>
        <p>
          Un libro sagrado: o {b('Corán')}. E {b('cinco grandes preceptos')} (obrigas) para todo bo musulmán:
        </p>
        <ol className="list-decimal space-y-1 pl-6">
          {PRECEPTOS.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ol>
        <Truco>Para lembralos: Deus, orar, Meca, Ramadán, esmola.</Truco>
      </>
    ),
  },
  {
    titulo: 'Xiítas e sunitas',
    texto: (
      <div className="grid gap-2 sm:grid-cols-2">
        <Caixa titulo="Xiítas (10 %)">Cren que o Corán é a única fonte de verdade.</Caixa>
        <Caixa titulo="Sunitas (90 %)">
          Cren que o Corán e a {b('Suna')} (a tradición) son fonte de verdade.
        </Caixa>
      </div>
    ),
  },
  {
    titulo: 'A expansión do Islam',
    texto: (
      <div className="grid gap-2">
        <Caixa titulo="Século VII">Mahoma (morre no 632) e os califas ortodoxos (632 – 661).</Caixa>
        <Caixa titulo="Séculos VII – XIII">
          {b('Califato omeia')} (661 – 750), capital {b('Damasco')}. {b('Califato abasí')} (750 – 1258), capital {b('Bagdad')}.
        </Caixa>
        <Caixa titulo="Séculos XIII – XX">Mongois e otomanos (1258 – 1453): Istambul. O último califato remata tras a Primeira Guerra Mundial.</Caixa>
        <p className="text-base">Chegaron ata a Península Ibérica (al-Ándalus) e ata Poitiers, onde os francos os frearon no 732.</p>
      </div>
    ),
  },
  {
    titulo: 'Quen mandaba no imperio islámico',
    texto: (
      <div className="grid gap-2 sm:grid-cols-2">
        {CARGOS.map((c) => (
          <Caixa key={c.palabra} titulo={c.palabra}>
            {c.significado}
          </Caixa>
        ))}
      </div>
    ),
  },
]

const ISLAM_XOGOS: Xogo[] = [
  { id: 'cargos', titulo: 'Os cargos', icono: '🕌', explica: 'Une cada cargo co que facía.', crear: (acabar) => <Une pares={CARGOS} acabar={acabar} /> },
  {
    id: 'expansion',
    titulo: 'A expansión, en orde',
    icono: '⏳',
    explica: 'Do máis antigo ao máis recente.',
    crear: (acabar) => <Ordena frases={[{ palabras: ['Mahoma', 'Califas ortodoxos', 'Califato omeia', 'Califato abasí', 'Mongois e otomanos'], traducion: 'Do máis antigo ao máis recente' }]} acabar={acabar} />,
  },
  {
    id: 'vf',
    titulo: 'Verdadeiro ou falso?',
    icono: '✅',
    explica: 'Sobre a orixe e a doutrina.',
    crear: (acabar) => (
      <VerdadeiroFalso
        frases={[
          { texto: 'Todos os árabes son musulmáns.', certa: false, explica: 'Árabe é quen nace nun país que fala árabe; hai árabes cristiáns.' },
          { texto: 'O Islam é unha relixión monoteísta.', certa: true, explica: 'Só cre nun Deus, Alá.' },
          { texto: 'A héxira é a fuxida de Mahoma da Meca a Medina.', certa: true, explica: 'No 622, comezo do calendario musulmán.' },
          { texto: 'O libro sagrado do Islam é a Biblia.', certa: false, explica: 'É o Corán.' },
          { texto: 'Os musulmáns oran tres veces ao día.', certa: false, explica: 'Cinco veces, cara á Meca.' },
          { texto: 'Os sunitas son a maioría (90 %).', certa: true, explica: 'Os xiítas son o 10 %.' },
          { texto: 'A capital do califato omeia foi Damasco.', certa: true, explica: 'A do abasí, Bagdad.' },
          { texto: 'O cadí era o primeiro ministro.', certa: false, explica: 'O cadí era o xuíz; o primeiro ministro era o visir.' },
        ]}
        acabar={acabar}
      />
    ),
  },
]

const ISLAM_PREG: Pregunta[] = [
  elixe('Que significa «Islam»?', 'Submisión a Deus', ['Guerra santa', 'Fuxida', 'Libro sagrado'], 'Submisión a Deus.'),
  elixe('Que é un árabe?', 'Quen naceu nun país onde se fala árabe', ['Quen cre na relixión de Mahoma', 'Quen vive en Arabia Saudí', 'Quen fala grego'], 'Non ten que ver coa relixión.'),
  elixe('Que é un musulmán?', 'Quen cre na relixión de Mahoma', ['Quen naceu en Arabia', 'Quen fala árabe', 'Quen vive en Damasco'], 'Unha persoa que cre na relixión de Mahoma.'),
  elixe('Onde naceu o Islam?', 'Na Península Arábiga', ['En Persia', 'En Exipto', 'En Constantinopla'], 'Na Península Arábiga, no s. VII.'),
  elixe('Quen foi Mahoma?', 'Un comerciante árabe, o profeta do Islam', ['Un emperador bizantino', 'Un califa de Bagdad', 'Un rei franco'], 'Mahoma (570 – 632).'),
  elixe('Segundo o Islam, quen revelou a mensaxe de Alá a Mahoma?', 'O arcanxo Gabriel', ['Khadija', 'O califa', 'O Patriarca'], 'O arcanxo Gabriel.'),
  elixe('Que é a héxira?', 'A fuxida de Mahoma da Meca a Medina (622)', ['A peregrinación á Meca', 'O xaxún do Ramadán', 'O libro sagrado'], 'E o comezo do calendario musulmán.'),
  elixe('Que marca a héxira?', 'O comezo do calendario musulmán', ['O final do Imperio bizantino', 'A coroación de Carlomagno', 'A morte de Mahoma'], 'O ano 622.'),
  elixe('Cal é o libro sagrado do Islam?', 'O Corán', ['A Suna', 'A Biblia', 'A Torá'], 'O Corán.'),
  elixe('Cantas veces ao día debe orar un musulmán?', 'Cinco, en dirección á Meca', ['Tres, en dirección a Medina', 'Unha, en dirección a Xerusalén', 'Sete, en calquera dirección'], 'Cinco veces cara á Meca.'),
  elixe('En que mes se fai o xaxún?', 'No Ramadán', ['Na héxira', 'Na Suna', 'No Corán'], 'O xaxún do Ramadán.'),
  elixe('Cal destes NON é un dos cinco preceptos?', 'Visitar Roma unha vez na vida', ['Practicar a esmola', 'Peregrinar á Meca', 'Xaxún no Ramadán'], 'A peregrinación é á Meca.'),
  elixe('Quen considera que o Corán e a Suna son fonte de verdade?', 'Os sunitas', ['Os xiítas', 'Os ortodoxos', 'Os católicos'], 'Os sunitas, o 90 %.'),
  elixe('Cal era a capital do califato omeia?', 'Damasco', ['Bagdad', 'A Meca', 'Córdoba'], 'Damasco (661 – 750).'),
  elixe('Cal era a capital do califato abasí?', 'Bagdad', ['Damasco', 'Medina', 'Constantinopla'], 'Bagdad (750 – 1258).'),
  ...CARGOS.map((c) => elixe(`Que era o ${c.palabra.toLowerCase()}?`, c.significado, barallar(CARGOS.filter((x) => x !== c).map((x) => x.significado)).slice(0, 3), `${c.palabra}: ${c.significado.toLowerCase()}`)),
  ...queFoiAntes(['hexira', 'mahoma', 'omeia', 'abasi'].map(feito), 3),
]

export const ISLAM_VIDEOS: Video[] = [{ id: 'N8S1s7B70Ak', titulo: 'La expansión del islam', canal: 'Academia Play', minutos: 15 }]

export function Islam(p: PropsParada) {
  return <Parada {...p} id="islam" titulo="O Islam: orixe e doutrina" tarxetas={ISLAM_TARXETAS} xogos={ISLAM_XOGOS} preguntas={ISLAM_PREG} videos={ISLAM_VIDEOS} />
}

// ===================================================================================================
// 8. O Islam: economía, sociedade e cultura
// ===================================================================================================

const ISLAM2_DATOS = [
  { texto: 'Agricultura e gandaría', caixa: 'economia' },
  { texto: 'Regadío', caixa: 'economia' },
  { texto: 'Arroz, laranxa e algodón', caixa: 'economia' },
  { texto: 'Moedas de ouro e prata', caixa: 'economia' },
  { texto: 'Filosofía grega', caixa: 'cultura' },
  { texto: 'Os números que usamos hoxe', caixa: 'cultura' },
  { texto: 'Astronomía e xeografía', caixa: 'cultura' },
  { texto: 'Navegación marítima', caixa: 'cultura' },
  { texto: 'Árabes, bérberes e muladís', caixa: 'sociedade' },
  { texto: 'Cristiáns e xudeus con impostos especiais', caixa: 'sociedade' },
  { texto: 'Sociedade patriarcal', caixa: 'sociedade' },
  { texto: 'Escravos', caixa: 'sociedade' },
]

const ISLAM2_TARXETAS: Tarxeta[] = [
  {
    titulo: '💰 A economía',
    texto: (
      <Lista
        items={[
          <>
            A base: a {b('agricultura e a gandaría')}.
          </>,
          <>
            Estenderon o {b('regadío')} e novos cultivos: {b('arroz, laranxa e algodón')}.
          </>,
          <>
            Un {b('comercio')} moi potente entre Occidente e Oriente, grazas ás {b('moedas de ouro e prata')} e ás {b('cidades')}, con moita {b('artesanía')}.
          </>,
        ]}
      />
    ),
  },
  {
    titulo: '📚 A cultura',
    texto: (
      <>
        <Lista
          items={[
            <>Axudaron a conservar a {b('filosofía grega')}.</>,
            <>
              Desenvolveron as {b('matemáticas')}: o noso {b('sistema numérico')} actual, que substituíu aos números romanos.
            </>,
            <>
              Destacaron en {b('astronomía e xeografía')}, que lles axudou na {b('navegación')}.
            </>,
          ]}
        />
        <Truco>Os números 1, 2, 3… chámanse «arábigos». Imaxina facer unha suma con XXVII + XLIV!</Truco>
      </>
    ),
  },
  {
    titulo: '👥 A sociedade',
    texto: (
      <>
        <p>Dividíase segundo a relixión:</p>
        <Lista
          items={[
            <>
              {b('Musulmáns')}: os {b('árabes')} (minoría privilexiada, co poder político e económico); os {b('bérberes')} (a xente común: agricultura, artesanía e gandaría); e os {b('muladís')} (cristiáns hispanovisigodos convertidos ao Islam).
            </>,
            <>
              {b('Non musulmáns')}: cristiáns ({b('mozárabes')}) e {b('xudeus')}. Respectábase a súa fe, pero con restricións, como impostos especiais. Os xudeus vivían en barrios separados, as xudarías.
            </>,
            <>Era {b('patriarcal')}: o home era o xefe da familia; a muller tiña un papel moi limitado nas tarefas públicas.</>,
            <>
              Abaixo de todo, os {b('escravos')}: no campo e no servizo doméstico.
            </>,
          ]}
        />
      </>
    ),
    visual: <PiramideAndalus />,
  },
  {
    titulo: '🕌 A mezquita, o templo islámico',
    texto: (
      <Lista
        items={[
          <>
            {b('Minarete')}: a torre dende a que se chama á oración.
          </>,
          <>
            {b('Patio (sahn)')}: coa {b('fonte')} para lavarse antes de orar.
          </>,
          <>
            {b('Sala de oración (haram)')}: chea de columnas.
          </>,
          <>
            {b('Quibla')}: o muro orientado cara á Meca.
          </>,
          <>
            {b('Mihrab')}: o oco no muro da quibla que indica a dirección da Meca.
          </>,
          <>
            {b('Minbar')}: o púlpito, unha escadiña á beira do mihrab.
          </>,
        ]}
      />
    ),
    visual: <Mezquita />,
  },
  {
    titulo: 'A Mezquita de Córdoba',
    texto: (
      <>
        <p>
          A gran mezquita de {b('al-Ándalus')}. Empezouna Abd al-Rahman I no 785 e ampliárona tres veces (Abd al-Rahman II, Al-Hakam II e Almanzor).
        </p>
        <Lista items={[<>Un bosque de columnas con {b('arcos de ferradura')} de dúas cores: vermello e branco.</>, <>O {b('Patio dos Laranxos')}, co seu antigo minarete, hoxe campanario.</>, <>Despois da conquista cristiá construíron unha catedral no medio.</>]} />
      </>
    ),
  },
]

const ISLAM2_XOGOS: Xogo[] = [
  {
    id: 'mezquita',
    titulo: 'Busca na mezquita',
    icono: '🕌',
    explica: 'Toca cada parte da mezquita.',
    crear: (acabar) => <Busca Debuxo={Mezquita} nomes={NOMES_MEZQUITA} obxectivos={Object.keys(NOMES_MEZQUITA)} acabar={acabar} />,
  },
  {
    id: 'piramide',
    titulo: 'A sociedade de al-Ándalus',
    icono: '🔺',
    explica: 'Toca cada grupo social.',
    crear: (acabar) => <Busca Debuxo={PiramideAndalus} nomes={NOMES_ANDALUS} obxectivos={Object.keys(NOMES_ANDALUS)} acabar={acabar} />,
  },
  {
    id: 'clasifica',
    titulo: 'Economía, cultura ou sociedade?',
    icono: '🗂️',
    explica: 'Coloca cada dato na súa caixa.',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'economia', nome: '💰 Economía', cor: 'border-amber-300 bg-amber-100' },
          { id: 'cultura', nome: '📚 Cultura', cor: 'border-sky-300 bg-sky-100' },
          { id: 'sociedade', nome: '👥 Sociedade', cor: 'border-green-300 bg-green-100' },
        ]}
        elementos={barallar(ISLAM2_DATOS).slice(0, 9)}
        acabar={acabar}
      />
    ),
  },
]

const ISLAM2_PREG: Pregunta[] = [
  elixe('Cal era a base da economía islámica?', 'A agricultura e a gandaría', ['A pesca', 'A minaría de ouro', 'A industria'], 'Agricultura e gandaría.'),
  elixe('Que cultivos novos trouxeron?', 'Arroz, laranxa e algodón', ['Pataca, millo e tomate', 'Viño e aceite', 'Trigo e cebada'], 'Arroz, laranxa e algodón.'),
  elixe('Que técnica agrícola estenderon?', 'O regadío', ['O arado de ferro', 'A rotación trienal', 'Os invernadoiros'], 'O regadío.'),
  elixe('Que sistema numérico introduciron?', 'O noso sistema numérico actual', ['Os números romanos', 'O sistema binario', 'Os xeroglíficos'], 'Substituíu aos números romanos.'),
  elixe('En que ciencias destacaron, que lles axudou a navegar?', 'Astronomía e xeografía', ['Medicina e química', 'Música e teatro', 'Dereito e latín'], 'Astronomía e xeografía.'),
  elixe('Quen eran a minoría privilexiada, co poder político e económico?', 'Os árabes', ['Os bérberes', 'Os muladís', 'Os mozárabes'], 'Os árabes.'),
  elixe('Quen eran os muladís?', 'Cristiáns hispanovisigodos convertidos ao Islam', ['Cristiáns que vivían en terra musulmá', 'Xudeus de Córdoba', 'Árabes de Siria'], 'Cristiáns convertidos.'),
  elixe('Quen eran os mozárabes?', 'Cristiáns que vivían en territorio musulmán', ['Musulmáns convertidos ao cristianismo', 'Escravos', 'Árabes ricos'], 'Cristiáns en al-Ándalus.'),
  elixe('Que lles pasaba aos cristiáns e xudeus en terra musulmá?', 'Respectábase a súa fe, pero pagaban impostos especiais', ['Eran expulsados', 'Non pagaban impostos', 'Eran escravos'], 'Con restricións, como impostos especiais.'),
  elixe('Como se chama o templo islámico?', 'A mezquita', ['A sinagoga', 'A basílica', 'O mihrab'], 'A mezquita.'),
  toca('Toca o mihrab.', Mezquita, NOMES_MEZQUITA, 'mihrab', 'O oco no muro da quibla, que indica a Meca.'),
  toca('Toca o minarete.', Mezquita, NOMES_MEZQUITA, 'minarete', 'A torre.'),
  toca('Toca o patio (sahn).', Mezquita, NOMES_MEZQUITA, 'patio', 'O espazo aberto, coa fonte.'),
  toca('Toca a sala de oración.', Mezquita, NOMES_MEZQUITA, 'sala', 'A sala chea de columnas.'),
  toca('Toca o minbar.', Mezquita, NOMES_MEZQUITA, 'minbar', 'O púlpito, á beira do mihrab.'),
  toca('Toca o muro da quibla.', Mezquita, NOMES_MEZQUITA, 'quibla', 'O muro do fondo, cara á Meca.'),
  toca('Toca os muladís.', PiramideAndalus, NOMES_ANDALUS, 'muladis', 'O terceiro chanzo: musulmáns de orixe cristiá.'),
  toca('Toca os bérberes.', PiramideAndalus, NOMES_ANDALUS, 'berberes', 'Debaixo dos árabes.'),
  elixe('Que arcos ten a Mezquita de Córdoba?', 'Arcos de ferradura vermellos e brancos', ['Arcos apuntados', 'Sen arcos', 'Arcos de medio punto dourados'], 'De ferradura e bicolores.'),
]

export const ISLAM2_VIDEOS: Video[] = [
  { id: 'gP1LwsBs8EQ', titulo: 'Las partes de una mezquita', canal: 'Academia Play', minutos: 2 },
  { id: 'FQvrONIgQjY', titulo: 'Historia de la Mezquita-Catedral de Córdoba', canal: 'Academia Play', minutos: 6 },
]

export function Islam2(p: PropsParada) {
  return <Parada {...p} id="islam2" titulo="O Islam: economía, sociedade e cultura" tarxetas={ISLAM2_TARXETAS} xogos={ISLAM2_XOGOS} preguntas={ISLAM2_PREG} videos={ISLAM2_VIDEOS} />
}

// ===================================================================================================
// 9. O Imperio carolinxio
// ===================================================================================================

const CAROLINXIO_TARXETAS: Tarxeta[] = [
  {
    titulo: 'A orixe: o Reino Franco',
    texto: (
      <>
        <p>
          Os {b('francos')} eran un pobo xermánico que ocupou a Galia (a actual Francia) cando caeu o Imperio romano.
        </p>
        <p>
          No {b('732')}, na {b('batalla de Poitiers')}, os francos de {b('Carlos Martel')} derrotaron ao exército islámico e freárono. Así se estableceu a {b('Marca Hispánica')}, a fronteira entre o Reino Franco e a civilización islámica.
        </p>
        <Truco>Tres xeracións: Carlos Martel (o avó, Poitiers) → Pipino (o fillo) → Carlomagno (o neto).</Truco>
      </>
    ),
  },
  {
    titulo: 'Nace o Imperio: Nadal do 800',
    texto: (
      <>
        <p>
          O día de {b('Nadal do ano 800')}, Carlos, rei dos francos, foi {b('coroado emperador polo Papa')} (León III). Así converteuse en {b('CARLOMAGNO')}, «Carlos o grande».
        </p>
        <p className="rounded-2xl bg-white p-3 text-base italic">«A Carlos Augusto, coroado por Deus, grande e pacífico emperador dos romanos, vida e vitoria!»</p>
      </>
    ),
  },
  {
    titulo: 'Como era o Imperio',
    texto: (
      <Lista
        items={[
          <>
            Capital: {b('Aquisgrán')} (Aachen), na actual Alemaña. Alí estaba o palacio, coa {b('capela palatina')} de planta octogonal.
          </>,
          <>
            O territorio dividíase en {b('condados')}, dirixidos por un {b('conde')}, e {b('marcas')}, zonas fronteirizas dirixidas por {b('marqueses')}.
          </>,
          <>A Marca Hispánica estaba feita de condados ao sur dos Pireneos: Barcelona, Urxel, Pallars, Ribagorza…</>,
        ]}
      />
    ),
  },
  {
    titulo: 'O final: o Tratado de Verdún (843)',
    texto: (
      <>
        <p>
          Tras a morte de Carlomagno, o Imperio entra en crise ata o {b('Tratado de Verdún')}, que o divide en {b('tres territorios')} entre os seus netos:
        </p>
        <Lista items={[<>Carlos o Calvo, ao oeste.</>, <>Lotario, no centro (con Aquisgrán e Roma).</>, <>Luís o Xermánico, ao leste.</>]} />
        <p>
          Por que? A {b('incapacidade de manter a seguridade das fronteiras')} ante as invasións e as {b('rivalidades internas')}.
        </p>
      </>
    ),
    visual: <Verdun />,
  },
]

const CAROLINXIO_XOGOS: Xogo[] = [
  {
    id: 'verdun',
    titulo: 'O reparto de Verdún',
    icono: '🗺️',
    explica: 'Toca o reino de cada neto.',
    crear: (acabar) => <Busca Debuxo={Verdun} nomes={NOMES_VERDUN} obxectivos={Object.keys(NOMES_VERDUN)} acabar={acabar} />,
  },
  {
    id: 'familia',
    titulo: 'A familia, en orde',
    icono: '👑',
    explica: 'Do avó ao neto.',
    crear: (acabar) => <Ordena frases={[{ palabras: ['Carlos Martel', 'Pipino', 'Carlomagno'], traducion: 'Do avó ao neto' }]} acabar={acabar} />,
  },
  {
    id: 'ordena',
    titulo: 'A Idade Media, en orde',
    icono: '⏳',
    explica: 'Feitos de Bizancio, do Islam e dos francos.',
    crear: (acabar) => <Ordena frases={seriesOrde(FEITOS_MEDIEVO, 4, 4)} acabar={acabar} />,
  },
]

const CAROLINXIO_PREG: Pregunta[] = [
  elixe('De que reino naceu o Imperio carolinxio?', 'Do Reino Franco', ['Do Reino Visigodo', 'Do Imperio bizantino', 'Do Reino Suevo'], 'Dos francos, que ocuparon a Galia.'),
  elixe('Que pasou na batalla de Poitiers (732)?', 'Os francos frearon o exército islámico', ['Os musulmáns conquistaron a Galia', 'Carlomagno foi coroado', 'Dividiuse o Imperio'], 'Os francos de Carlos Martel derrotaron aos musulmáns.'),
  elixe('Que era a Marca Hispánica?', 'A fronteira entre o Reino Franco e o Islam', ['Unha provincia romana', 'O reino de Lotario', 'Un califato'], 'Unha zona fronteiriza ao sur dos Pireneos.'),
  elixe('Quen coroou emperador a Carlomagno?', 'O Papa', ['O emperador bizantino', 'O califa', 'Os condes'], 'O Papa León III.'),
  elixe('Cando foi coroado Carlomagno?', 'O día de Nadal do ano 800', ['No 732, en Poitiers', 'No 843, en Verdún', 'No 476'], 'Nadal do 800.'),
  elixe('Que significa «Carlomagno»?', 'Carlos o grande', ['Carlos o calvo', 'Carlos o martelo', 'Carlos o franco'], 'Carlos o grande.'),
  elixe('Cal era a capital do Imperio carolinxio?', 'Aquisgrán', ['París', 'Roma', 'Constantinopla'], 'Aquisgrán (Aachen), na actual Alemaña.'),
  elixe('Quen dirixía un condado?', 'Un conde', ['Un marqués', 'Un emir', 'Un cónsul'], 'Os condados, os condes; as marcas, os marqueses.'),
  elixe('Que era unha marca?', 'Unha zona fronteiriza dirixida por un marqués', ['Unha cidade dirixida por un conde', 'Un mosteiro', 'Un tipo de moeda'], 'As marcas eran fronteirizas.'),
  elixe('Que tratado dividiu o Imperio carolinxio?', 'O Tratado de Verdún (843)', ['O Tratado de Poitiers (732)', 'O Cisma de Oriente', 'A héxira'], 'Verdún, no 843.'),
  elixe('En cantos territorios se dividiu o Imperio en Verdún?', 'En tres', ['En dous', 'En cinco', 'En sete'], 'Carlos o Calvo, Lotario e Luís o Xermánico.'),
  elixe('Por que se descompuxo o Imperio carolinxio?', 'Non podían defender as fronteiras e había rivalidades internas', ['Porque o conquistaron os romanos', 'Por unha peste', 'Porque Carlomagno o vendeu'], 'Invasións e rivalidades internas.'),
  elixe('Quen era o avó de Carlomagno, vencedor en Poitiers?', 'Carlos Martel', ['Pipino', 'Lotario', 'Luís o Xermánico'], 'Carlos Martel.'),
  toca('Toca o reino de Lotario.', Verdun, NOMES_VERDUN, 'lotario', 'O do centro, con Aquisgrán e Roma.'),
  toca('Toca o reino de Carlos o Calvo.', Verdun, NOMES_VERDUN, 'carlos', 'O do oeste, con París.'),
  toca('Toca o reino de Luís o Xermánico.', Verdun, NOMES_VERDUN, 'luis', 'O do leste.'),
  ...queFoiAntes(['poitiers', 'carlomagno', 'verdun'].map(feito), 3),
]

export const CAROLINXIO_VIDEOS: Video[] = [{ id: 'Vm8Ssc8_mkE', titulo: 'Carlomagno y el Imperio carolingio (resumen)', canal: 'Cuaderno de Historia', minutos: 9 }]

export function Carolinxio(p: PropsParada) {
  return <Parada {...p} id="carolinxio" titulo="O Imperio carolinxio" tarxetas={CAROLINXIO_TARXETAS} xogos={CAROLINXIO_XOGOS} preguntas={CAROLINXIO_PREG} videos={CAROLINXIO_VIDEOS} />
}

export const PREGUNTAS_MEDIEVO: Record<string, Pregunta[]> = { idademedia: MEDIA_PREG, bizancio: BIZANCIO_PREG, islam: ISLAM_PREG, islam2: ISLAM2_PREG, carolinxio: CAROLINXIO_PREG }
