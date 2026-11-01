// Música 2.º ESO, exame do 3 de novembro: o resaltado en amarelo das 15 primeiras páxinas dos apuntes da 1.ª avaliación.
// O que non está resaltado (velocidades do son, 20-20000 Hz, decibelios límite, dobres alteracións…) non se pregunta.
import { Busca, Clasifica, Ordena, Proba, Une, VerdadeiroFalso, barallar, type Pregunta, type Tarxeta, type Xogo } from '../../primaria/pezas'
import { elixe, toca } from '../../primaria/paisaxes/preguntas'
import type { Video } from '../../contenido/tema1'
import { Caixa, Lista, Parada, Truco, b } from '../../historia/parcial1/roma'
import { DENOMINADORES, FIGURAS, NOTAS, cantasCaben, claseCompas, conPunto, enTons, enarmonica, semitons, semitonsAaSeguinte, tipoCompas, unidadeCompas, valor, type Figura, type Nota } from '../../lib/musica'
import { DebuxoClave, DebuxoFigura, DebuxoSigno, DebuxoSilenzo, NOMES_PARTES, NOMES_PENTAGRAMA, NOMES_TECLADO, Onda, PartesFigura, Pentagrama, SIGNOS, Teclado } from './debuxos'
import { Soar } from './son'

type PropsParada = { ruta: string; modo?: string }
const U = 'musica1'
const Practica = ({ preguntas, acabar }: { preguntas: Pregunta[]; acabar: () => void }) => <Proba practica cantas={8} preguntas={preguntas} acabar={acabar} />
const outrasDe = (lista: readonly string[], boa: string, n = 3) => barallar(lista.filter((x) => x !== boa)).slice(0, n)
const SonFila = ({ children }: { children: React.ReactNode }) => <div className="flex flex-wrap gap-2">{children}</div>

// ===================================================================================================
// 1. O son
// ===================================================================================================

const SON_DEF = [
  { palabra: 'Son', significado: 'Prodúcese cando vibra un corpo e o movemento chega ao oído en forma de onda sonora.' },
  { palabra: 'Reverberación', significado: 'O son rebota contra paredes, chan e teito: prolóngase e tarda máis en desaparecer.' },
  { palabra: 'Eco', significado: 'Repetición do son: o son emitido e o reflectido percíbense por separado.' },
  { palabra: 'Tímpano', significado: 'Membrana moi fina que conecta o oído externo co oído medio.' },
  { palabra: 'Ruído', significado: 'Son molesto ou desagradable.' },
]

const SON_TARXETAS: Tarxeta[] = [
  {
    titulo: 'Como se produce o son',
    texto: (
      <>
        <p>
          O son prodúcese cando {b('vibra un corpo')} e ese movemento se transmite en forma de {b('onda sonora')} ata chegar ao noso oído.
        </p>
        <p>
          Cando as ondas atopan un {b('obstáculo')}, {b('rebotan')} e regresan en sentido contrario cara á fonte do son.
        </p>
      </>
    ),
    visual: <Onda nome="onda sonora" />,
  },
  {
    titulo: 'Reverberación e eco',
    texto: (
      <>
        <Caixa titulo="Reverberación">
          Se damos unha palmada nunha habitación, o son rebota contra as paredes, o chan e o teito: {b('prolóngase e tarda máis en desaparecer')}. Por iso a música non soa igual nun auditorio, nun pavillón, ao aire libre ou nunha igrexa.
        </Caixa>
        <Caixa titulo="Eco">
          É un tipo de reverberación na que se {b('repite o son')}: pasa tanto tempo entre o son emitido e o reflectido que {b('se perciben por separado')}.
        </Caixa>
        <SonFila>
          <Soar son="reverberacion">Reverberación</Soar>
          <Soar son="eco">Eco</Soar>
        </SonFila>
      </>
    ),
  },
  {
    titulo: 'Como oímos',
    texto: (
      <ol className="list-decimal space-y-1.5 pl-6">
        <li>
          O oído recolle os sons a través do {b('tímpano')}, unha membrana moi fina que conecta o oído externo co oído medio.
        </li>
        <li>As ondas chocan contra o tímpano e fan que vibre.</li>
        <li>
          As variacións de presión convértense en {b('impulsos nerviosos')} que levan a información ao {b('cerebro')}.
        </li>
      </ol>
    ),
  },
  {
    titulo: 'Ruído e son',
    texto: (
      <>
        <p>A diferenza é {b('subxectiva')}: depende de factores psicolóxicos e dos gustos persoais.</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <Caixa titulo="Ruído">Un son molesto ou desagradable.</Caixa>
          <Caixa titulo="Son">O que nos gusta ou nos produce unha sensación máis agradable.</Caixa>
        </div>
        <Truco>A música que a ti che encanta pode ser ruído para os teus pais.</Truco>
      </>
    ),
  },
]

const SON_XOGOS: Xogo[] = [
  { id: 'une', titulo: 'Cada palabra, o que é', icono: '🔗', explica: 'Une cada palabra coa súa definición.', crear: (acabar) => <Une pares={SON_DEF} acabar={acabar} /> },
  {
    id: 'orde',
    titulo: 'O camiño do son',
    icono: '👂',
    explica: 'Pon os pasos en orde.',
    crear: (acabar) => <Ordena frases={[{ palabras: ['vibra un corpo', 'onda sonora', 'tímpano', 'impulsos nerviosos', 'cerebro'], traducion: 'Do comezo ata que o oímos' }]} acabar={acabar} />,
  },
  {
    id: 'vf',
    titulo: 'Verdadeiro ou falso?',
    icono: '✅',
    explica: 'Sobre o son.',
    crear: (acabar) => (
      <VerdadeiroFalso
        frases={[
          { texto: 'Cando as ondas atopan un obstáculo, rebotan.', certa: true, explica: 'E regresan cara á fonte do son.' },
          { texto: 'No eco, o son emitido e o reflectido percíbense por separado.', certa: true, explica: 'Por iso oímos a repetición.' },
          { texto: 'A música soa igual nunha igrexa ca ao aire libre.', certa: false, explica: 'A reverberación fai que soe distinta.' },
          { texto: 'O tímpano é un óso do oído interno.', certa: false, explica: 'É unha membrana moi fina entre o oído externo e o medio.' },
          { texto: 'A diferenza entre ruído e son é subxectiva.', certa: true, explica: 'Depende dos gustos persoais.' },
        ]}
        acabar={acabar}
      />
    ),
  },
]

const SON_PREG: Pregunta[] = [
  ...SON_DEF.map((d) => elixe(<>«{d.significado}» Que é?</>, d.palabra, outrasDe(SON_DEF.map((x) => x.palabra), d.palabra), <>{d.palabra}.</>)),
  elixe('Como se produce o son?', 'Cando vibra un corpo e o movemento se transmite en forma de onda sonora', ['Cando un corpo está quieto', 'Cando a luz chega ao oído', 'Cando o tímpano se rompe'], 'Vibración → onda sonora → oído.'),
  elixe('Que fan as ondas sonoras cando atopan un obstáculo?', 'Rebotan e regresan cara á fonte do son', ['Desaparecen', 'Aceleran', 'Pasan sempre a través'], 'Rebotan.'),
  elixe('Por que a música non soa igual nun pavillón ca nun auditorio?', 'Pola reverberación', ['Polo timbre', 'Polo diapasón', 'Pola armadura'], 'O son rebota de forma distinta en cada sitio.'),
  elixe('Que diferenza o eco da reverberación?', 'No eco o son emitido e o reflectido percíbense por separado', ['No eco non hai rebote', 'O eco só se dá na auga', 'Non hai ningunha diferenza'], 'O eco é un tipo de reverberación.'),
  elixe('Que conecta o tímpano?', 'O oído externo co oído medio', ['O oído medio co cerebro', 'Os dous oídos', 'A boca co nariz'], 'É unha membrana moi fina.'),
  elixe('En que se converten as variacións de presión no oído?', 'En impulsos nerviosos que van ao cerebro', ['En ondas de auga', 'En vibracións da lingua', 'En notas'], 'Impulsos nerviosos.'),
  elixe('De que depende a diferenza entre ruído e son?', 'De factores psicolóxicos e dos gustos persoais', ['Só do volume', 'Só da duración', 'Da clave'], 'É subxectiva.'),
  elixe('Que é o que chamamos son, fronte ao ruído?', 'O que nos gusta ou nos produce unha sensación agradable', ['Calquera cousa moi forte', 'O que non se pode oír', 'O que dura moito'], 'O ruído é o molesto ou desagradable.'),
]

export function OSon(p: PropsParada) {
  return <Parada {...p} unidade={U} id="son" titulo="O son" tarxetas={SON_TARXETAS} xogos={SON_XOGOS} preguntas={SON_PREG} />
}

// ===================================================================================================
// 2. O silenzo e a contaminación acústica
// ===================================================================================================

const SILENZO_TARXETAS: Tarxeta[] = [
  {
    titulo: 'Que é o silenzo',
    texto: (
      <>
        <p>
          É a {b('ausencia total de son ou de ruído')}, a falta absoluta de sensación auditiva.
        </p>
        <p>
          Pero o {b('silenzo absoluto non existe')}: aínda que nos illemos dos sons externos, seguiríamos escoitando os sons interiores do noso propio corpo.
        </p>
      </>
    ),
  },
  {
    titulo: 'O silenzo na música',
    texto: (
      <>
        <p className="font-bold">O silenzo na música é un elemento tan importante coma o son.</p>
        <Lista
          items={[
            <>É a condición previa para o disfrute da música.</>,
            <>Cumpre a función de {b('descanso')} e de {b('tomar alento')}.</>,
            <>Moitas veces é un recurso de {b('grande forza expresiva')}: nun momento axeitado pode significar máis có mellor dos sons.</>,
            <>É o {b('estruturador do discurso')}: permite organizar as ideas.</>,
          ]}
        />
      </>
    ),
  },
  {
    titulo: 'A contaminación acústica',
    texto: (
      <>
        <p className="font-bold">Provoca graves lesións no organismo.</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <Caixa titulo="🫀 No corpo">
            Dana a capacidade auditiva e altera o sistema {b('cardiovascular, dixestivo, respiratorio e nervioso central')}.
          </Caixa>
          <Caixa titulo="🧠 Na mente">
            {b('Alteracións do sono, perda de concentración, ansiedade, irritabilidade e estrés')}.
          </Caixa>
        </div>
      </>
    ),
  },
]

const SILENZO_XOGOS: Xogo[] = [
  {
    id: 'efectos',
    titulo: 'Efectos do ruído',
    icono: '🗂️',
    explica: 'No corpo (fisiolóxicos) ou na mente (psicolóxicos)?',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'c', nome: '🫀 Fisiolóxicos', cor: 'border-rose-300 bg-rose-100' },
          { id: 'm', nome: '🧠 Psicolóxicos', cor: 'border-sky-300 bg-sky-100' },
        ]}
        elementos={[
          { texto: 'Sistema cardiovascular', caixa: 'c' },
          { texto: 'Sistema dixestivo', caixa: 'c' },
          { texto: 'Sistema respiratorio', caixa: 'c' },
          { texto: 'Sistema nervioso central', caixa: 'c' },
          { texto: 'Alteracións do sono', caixa: 'm' },
          { texto: 'Perda de concentración', caixa: 'm' },
          { texto: 'Ansiedade', caixa: 'm' },
          { texto: 'Irritabilidade', caixa: 'm' },
          { texto: 'Estrés', caixa: 'm' },
        ]}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'vf',
    titulo: 'Verdadeiro ou falso?',
    icono: '✅',
    explica: 'Sobre o silenzo.',
    crear: (acabar) => (
      <VerdadeiroFalso
        frases={[
          { texto: 'O silenzo absoluto existe se nos illamos ben.', certa: false, explica: 'Seguiríamos oíndo os sons do noso corpo.' },
          { texto: 'O silenzo na música é tan importante coma o son.', certa: true, explica: 'Tal e como di o apuntamento.' },
          { texto: 'O silenzo serve para tomar alento.', certa: true, explica: 'E para descansar.' },
          { texto: 'A contaminación acústica só dana os oídos.', certa: false, explica: 'Tamén outros sistemas do corpo e a mente.' },
          { texto: 'O estrés pode ser consecuencia do ruído.', certa: true, explica: 'É un problema psicolóxico que pode causar.' },
        ]}
        acabar={acabar}
      />
    ),
  },
]

const SILENZO_PREG: Pregunta[] = [
  elixe('Que é o silenzo?', 'A ausencia total de son ou de ruído', ['Un son moi suave', 'Un son moi agudo', 'Unha nota longa'], 'A falta absoluta de sensación auditiva.'),
  elixe('Por que non existe o silenzo absoluto?', 'Porque seguiriamos oíndo os sons interiores do noso corpo', ['Porque sempre hai música', 'Porque o aire nunca para', 'Porque o tímpano non descansa'], 'Os sons do propio corpo.'),
  elixe('Canto importa o silenzo na música?', 'É un elemento tan importante coma o son', ['Non ten importancia', 'Só importa ao final da obra', 'Só nas cancións lentas'], 'Tan importante coma o son.'),
  elixe('Que función NON cumpre o silenzo na música?', 'Subir o volume', ['Descanso', 'Tomar alento', 'Forza expresiva'], 'Descanso, alento e expresión.'),
  elixe('Que é o silenzo no discurso musical?', 'O estruturador que permite organizar as ideas', ['Un erro do intérprete', 'Un tipo de nota', 'Unha clave'], 'Igual ca na linguaxe verbal.'),
  elixe('Que provoca a contaminación acústica?', 'Graves lesións no organismo', ['Melloras no oído', 'Máis concentración', 'Só molestias pasaxeiras'], 'Danos no corpo e na mente.'),
  elixe('Cal destes sistemas altera o ruído?', 'O cardiovascular', ['Ningún', 'Só o óseo', 'Só o muscular'], 'Cardiovascular, dixestivo, respiratorio e nervioso central.'),
  elixe('Cal destes é un problema psicolóxico do ruído?', 'A perda de concentración', ['A dor de estómago', 'A hipertensión', 'A xordeira'], 'Sono, concentración, ansiedade, irritabilidade, estrés.'),
  elixe('Cal destes NON é un efecto do ruído que din os apuntes?', 'Mellorar a memoria', ['Ansiedade', 'Irritabilidade', 'Alteracións do sono'], 'Son todos efectos negativos.'),
  elixe('Cando pode un silenzo significar máis có mellor dos sons?', 'Nun momento axeitado', ['Nunca', 'Só ao comezo', 'Só se dura moito'], 'Grande forza expresiva.'),
  elixe('Que é o silenzo para o disfrute da música?', 'A condición previa', ['Un obstáculo', 'Unha molestia', 'Algo sen importancia'], 'A condición previa.'),
  elixe('Ademais de danar a capacidade auditiva, que provoca o ruído?', 'Alteracións fisiolóxicas e problemas psicolóxicos', ['Só dor de oídos', 'Nada máis', 'Melloras na concentración'], 'No corpo e na mente.'),
]

export function Silenzo(p: PropsParada) {
  return <Parada {...p} unidade={U} id="silenzo" titulo="O silenzo e a contaminación acústica" tarxetas={SILENZO_TARXETAS} xogos={SILENZO_XOGOS} preguntas={SILENZO_PREG} />
}

// ===================================================================================================
// 3. As cualidades do son
// ===================================================================================================

const CUALIDADES = [
  { palabra: 'Altura ou ton', significado: 'Número de vibracións por segundo: sons graves e agudos. Mídese en hercios (Hz).', curto: 'Altura', de: 'graves e agudos' },
  { palabra: 'Duración', significado: 'Tempo que permanece un son: sons curtos e longos.', curto: 'Duración', de: 'curtos e longos' },
  { palabra: 'Intensidade', significado: 'Forza coa que se emite un son: sons fortes e débiles. Mídese en decibelios (dB).', curto: 'Intensidade', de: 'fortes e débiles' },
  { palabra: 'Timbre', significado: 'Permite diferenciar sons da mesma altura, intensidade e duración de distintas voces ou instrumentos.', curto: 'Timbre', de: 'voces e instrumentos' },
]

const CUALIDADES_TARXETAS: Tarxeta[] = [
  {
    titulo: 'Catro cualidades',
    texto: (
      <>
        <p>
          As cualidades do son son as propiedades que nos permiten identificalo: {b('altura, duración, intensidade e timbre')}.
        </p>
        <Truco>Regra: A-D-I-T (Altura, Duración, Intensidade, Timbre).</Truco>
      </>
    ),
  },
  {
    titulo: 'A altura ou ton',
    texto: (
      <>
        <p>
          É o {b('número de vibracións')} que produce un son por segundo. Mídese en {b('hercios (Hz)')} ou frecuencia.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          <Caixa titulo="Grave: poucas vibracións">
            <Onda ciclos={2} nome="son grave" />
            <Soar son="grave">Grave</Soar>
          </Caixa>
          <Caixa titulo="Agudo: moitas vibracións">
            <Onda ciclos={9} nome="son agudo" />
            <Soar son="agudo">Agudo</Soar>
          </Caixa>
        </div>
      </>
    ),
  },
  {
    titulo: 'A duración',
    texto: (
      <>
        <p>
          É o {b('tempo que permanece')} un son. Depende da persistencia da onda sonora no tempo.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          <Caixa titulo="Longo">
            <Onda ciclos={6} nome="son longo" />
            <Soar son="longo">Longo</Soar>
          </Caixa>
          <Caixa titulo="Curto">
            <Onda ciclos={2} lonx={0.33} nome="son curto" />
            <Soar son="curto">Curto</Soar>
          </Caixa>
        </div>
      </>
    ),
  },
  {
    titulo: 'A intensidade',
    texto: (
      <>
        <p>
          É a {b('forza')} coa que se emite un son. Tamén se chama {b('volume')}. Mídese en {b('decibelios (dB)')} e represéntase pola {b('altura da onda')}.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          <Caixa titulo="Forte">
            <Onda amp={34} nome="son forte" />
            <Soar son="forte">Forte</Soar>
          </Caixa>
          <Caixa titulo="Débil">
            <Onda amp={8} nome="son débil" />
            <Soar son="debil">Débil</Soar>
          </Caixa>
        </div>
        <Truco>Non confundas: un son «alto» na rúa é forte, pero en música «altura» é grave ou agudo.</Truco>
      </>
    ),
  },
  {
    titulo: 'O timbre',
    texto: (
      <>
        <p>
          Permite {b('diferenciar sons da mesma altura, intensidade e duración')} emitidos por distintas voces ou instrumentos.
        </p>
        <p>
          Depende da mestura do {b('son fundamental')} cos seus {b('armónicos')}: os sons que acompañan ao fundamental e fan que cada voz e instrumento teña o seu timbre.
        </p>
        <p className="text-base text-slate-600">Escoita: a mesma nota co mesmo volume, pero con distinta mestura de armónicos.</p>
        <SonFila>
          <Soar son="flauta">Son puro</Soar>
          <Soar son="frauta2">Timbre 2</Soar>
          <Soar son="clarinete">Timbre 3</Soar>
          <Soar son="violin">Timbre 4</Soar>
        </SonFila>
      </>
    ),
  },
]

/** Exercicios de oído: o son escóitase ao tocar. */
const oido = (son: string, correcta: string, outras: string[], explica: string, pregunta: string): Pregunta =>
  elixe(
    <>
      {pregunta} <Soar son={son}>Escoitar</Soar>
    </>,
    correcta,
    outras,
    explica,
  )
const OIDO: Pregunta[] = [
  oido('agudo', 'Agudo', ['Grave'], 'Moitas vibracións por segundo.', 'Como é este son?'),
  oido('grave', 'Grave', ['Agudo'], 'Poucas vibracións por segundo.', 'Como é este son?'),
  oido('longo', 'Longo', ['Curto'], 'Permanece máis tempo.', 'Como é este son?'),
  oido('curto', 'Curto', ['Longo'], 'Dura moi pouco.', 'Como é este son?'),
  oido('forte', 'Forte', ['Débil'], 'Emítese con máis forza.', 'Como é este son?'),
  oido('debil', 'Débil', ['Forte'], 'Emítese con pouca forza.', 'Como é este son?'),
]

const CUALIDADES_XOGOS: Xogo[] = [
  { id: 'oido', titulo: 'Adestra o oído', icono: '👂', explica: 'Escoita e di como é o son.', crear: (acabar) => <Practica preguntas={OIDO} acabar={acabar} /> },
  { id: 'une', titulo: 'Cada cualidade, a súa definición', icono: '🔗', explica: 'Únea coa súa definición.', crear: (acabar) => <Une pares={CUALIDADES.map((c) => ({ palabra: c.curto, significado: c.significado }))} acabar={acabar} /> },
  {
    id: 'clasifica',
    titulo: 'De que cualidade falamos?',
    icono: '🗂️',
    explica: 'Coloca cada palabra na súa cualidade.',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'a', nome: 'Altura', cor: 'border-sky-300 bg-sky-100' },
          { id: 'd', nome: 'Duración', cor: 'border-amber-300 bg-amber-100' },
          { id: 'i', nome: 'Intensidade', cor: 'border-rose-300 bg-rose-100' },
          { id: 't', nome: 'Timbre', cor: 'border-green-300 bg-green-100' },
        ]}
        elementos={[
          { texto: 'Hercios', caixa: 'a' },
          { texto: 'Agudo', caixa: 'a' },
          { texto: 'Grave', caixa: 'a' },
          { texto: 'Curto', caixa: 'd' },
          { texto: 'Longo', caixa: 'd' },
          { texto: 'Decibelios', caixa: 'i' },
          { texto: 'Volume', caixa: 'i' },
          { texto: 'Forte', caixa: 'i' },
          { texto: 'Armónicos', caixa: 't' },
          { texto: 'Son fundamental', caixa: 't' },
        ]}
        acabar={acabar}
      />
    ),
  },
]

const CUALIDADES_PREG: Pregunta[] = [
  ...CUALIDADES.map((c) => elixe(<>«{c.significado}» Que cualidade é?</>, c.curto, CUALIDADES.filter((x) => x !== c).map((x) => x.curto), <>{c.palabra}.</>)),
  elixe('Cales son as cualidades do son?', 'Altura, duración, intensidade e timbre', ['Altura, ritmo, compás e clave', 'Nota, escala, clave e timbre', 'Duración, tempo, volume e ton'], 'Son catro.'),
  elixe('Un son con poucas vibracións por segundo é…', 'Grave', ['Agudo', 'Forte', 'Curto'], 'Poucas: grave. Moitas: agudo.'),
  elixe('Un son con moitas vibracións por segundo é…', 'Agudo', ['Grave', 'Débil', 'Longo'], 'Moitas: agudo.'),
  elixe('En que se mide a altura?', 'En hercios (Hz)', ['En decibelios (dB)', 'En segundos', 'En compases'], 'Hz = vibracións por segundo.'),
  elixe('En que se mide a intensidade?', 'En decibelios (dB)', ['En hercios (Hz)', 'En metros', 'En negras'], 'Decibelios.'),
  elixe('Como se chama tamén a intensidade?', 'Volume', ['Ton', 'Timbre', 'Tempo'], 'Volume.'),
  elixe('Como se chama tamén a altura?', 'Ton', ['Volume', 'Compás', 'Timbre'], 'Altura ou ton.'),
  elixe('De que depende a duración?', 'Da persistencia da onda sonora no tempo', ['Da altura da onda', 'Do número de vibracións', 'Dos armónicos'], 'Canto dura a onda.'),
  elixe('Que representa a altura da onda?', 'A intensidade', ['A altura do son', 'A duración', 'O timbre'], 'Ollo: a altura da onda é a intensidade.'),
  elixe('De que depende o timbre?', 'Da mestura do son fundamental cos seus armónicos', ['Do número de vibracións', 'Da forza', 'Do tempo que dura'], 'Armónicos.'),
  elixe('Que son os armónicos?', 'Os sons que acompañan ao fundamental', ['As notas do pentagrama', 'Os compases dunha obra', 'Os silenzos'], 'Dan a cada voz o seu timbre.'),
  elixe('Unha guitarra e un piano tocan a mesma nota igual de forte e igual de longa. Que os distingue?', 'O timbre', ['A altura', 'A intensidade', 'A duración'], 'O timbre.'),
]

export function Cualidades(p: PropsParada) {
  return <Parada {...p} unidade={U} id="cualidades" titulo="As cualidades do son" tarxetas={CUALIDADES_TARXETAS} xogos={CUALIDADES_XOGOS} preguntas={CUALIDADES_PREG} videos={[{ id: 'n9O6IBVkBMM', titulo: 'Cualidades del sonido: altura, intensidad, timbre y duración', canal: 'SOLFEANDO', minutos: 2 }]} />
}

// ===================================================================================================
// 4. A altura: notas, escala, pentagrama e claves
// ===================================================================================================

const LETRAS: [string, string][] = [
  ['A', 'La'],
  ['B', 'Si'],
  ['C', 'Do'],
  ['D', 'Re'],
  ['E', 'Mi'],
  ['F', 'Fa'],
  ['G', 'Sol'],
]

const ALTURA_DEF = [
  { palabra: 'Música', significado: 'A arte de mesturar os sons co tempo.' },
  { palabra: 'Notas', significado: 'Signos que representan un son.' },
  { palabra: 'Diapasón', significado: 'Barra metálica en forma de galla que produce a nota La (440 Hz).' },
  { palabra: 'Escala', significado: 'Serie sucesiva e continua de sons correlativos, que empeza e remata pola mesma nota.' },
  { palabra: 'Pentagrama', significado: 'Conxunto de cinco liñas e catro espazos onde se escribe a música.' },
  { palabra: 'Liñas adicionais', significado: 'Serven para escribir as notas que non caben no pentagrama.' },
  { palabra: 'Claves', significado: 'Signos ao principio do pentagrama que indican o nome das notas.' },
]

const ALTURA_TARXETAS: Tarxeta[] = [
  {
    titulo: 'Música e notas',
    texto: (
      <>
        <Caixa>
          <b>Música</b> é a arte de {b('mesturar os sons co tempo')}.
        </Caixa>
        <p>
          As {b('notas')} son signos que representan un son:
        </p>
        <p className="text-center text-2xl font-black text-violet-800">DO · RE · MI · FA · SOL · LA · SI</p>
        <Caixa titulo="O diapasón">
          Barra metálica en forma de {b('galla')} que ao vibrar produce a nota {b('LA (440 Hz)')}. Serve de referencia de {b('afinación')} para voces e instrumentos. <Soar son="diapason">Escoitar</Soar>
        </Caixa>
      </>
    ),
  },
  {
    titulo: 'A escala',
    texto: (
      <>
        <p>
          Serie {b('sucesiva e continua')} de sons correlativos, {b('empezando e rematando pola mesma nota')}.
        </p>
        <SonFila>
          <Soar son="escala">Ascendente (de grave a agudo)</Soar>
          <Soar son="escalaBaixa">Descendente (de agudo a grave)</Soar>
        </SonFila>
      </>
    ),
  },
  {
    titulo: 'O pentagrama',
    texto: (
      <>
        <p>
          {b('Cinco liñas e catro espazos')} onde se escribe a música. Cóntanse {b('de abaixo a arriba')}.
        </p>
        <p>
          Para as notas moi agudas ou moi graves que non caben, úsanse {b('liñas adicionais')}.
        </p>
      </>
    ),
    visual: <Pentagrama />,
    ancho: true,
  },
  {
    titulo: 'As claves',
    texto: (
      <>
        <p>
          Signos ao {b('principio do pentagrama')} que indican o {b('nome das notas')} situadas nas súas liñas e espazos.
        </p>
        <p>
          Hai {b('sete claves')}: {b('1 de SOL, 2 de FA e 4 de DO')}.
        </p>
        <div className="flex flex-wrap justify-center gap-3 text-center font-bold">
          <div>
            <DebuxoClave c="sol" />
            Sol (1)
          </div>
          <div>
            <DebuxoClave c="fa" />
            Fa (2)
          </div>
          <div>
            <DebuxoClave c="do" />
            Do (4)
          </div>
        </div>
      </>
    ),
  },
  {
    titulo: 'De onde veñen os nomes das notas',
    texto: (
      <>
        <p>
          Na antigüidade e ata ben entrada a Idade Media usábase unha {b('notación alfabética')}, que segue usándose nos países anglosaxóns:
        </p>
        <div className="grid grid-cols-7 gap-1 text-center text-lg font-bold">
          {LETRAS.map(([l, n]) => (
            <div key={l} className="rounded-lg bg-violet-100 p-1">
              {l}
              <br />
              <span className="text-base font-semibold">{n}</span>
            </div>
          ))}
        </div>
        <p>
          O nome actual inventouno no {b('século XI')} o monxe beneditino {b("Guido d'Arezzo")}, coas primeiras sílabas de cada verso do {b('Himno a San Xoán Bautista')}.
        </p>
      </>
    ),
  },
]

const ALTURA_XOGOS: Xogo[] = [
  { id: 'busca', titulo: 'Busca no pentagrama', icono: '🎼', explica: 'Toca cada liña e cada espazo.', crear: (acabar) => <Busca Debuxo={Pentagrama} nomes={NOMES_PENTAGRAMA} obxectivos={Object.keys(NOMES_PENTAGRAMA)} acabar={acabar} /> },
  { id: 'une', titulo: 'Definicións', icono: '🔗', explica: 'Une cada palabra co que é.', crear: (acabar) => <Une pares={barallar(ALTURA_DEF).slice(0, 6)} acabar={acabar} /> },
  { id: 'letras', titulo: 'Notación alfabética', icono: '🔠', explica: 'Une cada letra coa súa nota.', crear: (acabar) => <Une pares={LETRAS.map(([palabra, significado]) => ({ palabra, significado }))} acabar={acabar} /> },
  { id: 'escala', titulo: 'A escala, en orde', icono: '🪜', explica: 'Ascendente, de Do a Si.', crear: (acabar) => <Ordena frases={[{ palabras: [...NOTAS], traducion: 'De grave a agudo' }]} acabar={acabar} /> },
]

const ALTURA_PREG: Pregunta[] = [
  ...ALTURA_DEF.map((d) => elixe(<>«{d.significado}» Que é?</>, d.palabra, outrasDe(ALTURA_DEF.map((x) => x.palabra), d.palabra), <>{d.palabra}.</>)),
  ...LETRAS.map(([l, n]) => elixe(<>Na notación alfabética, a letra {l} é…</>, n, outrasDe(NOTAS, n), <>{l} = {n}.</>)),
  elixe('Que nota produce o diapasón?', 'La (440 Hz)', ['Do (440 Hz)', 'Sol (220 Hz)', 'Si (1000 Hz)'], 'La, 440 Hz.'),
  elixe('Para que serve o diapasón?', 'De referencia de afinación para voces e instrumentos', ['Para marcar o tempo', 'Para medir o volume', 'Para escribir as notas'], 'Afinación. O tempo márcao o metrónomo.'),
  elixe('Como é unha escala ascendente?', 'De grave a agudo', ['De agudo a grave', 'De forte a débil', 'De longo a curto'], 'Ascendente: sobe.'),
  elixe('Cantas liñas e espazos ten o pentagrama?', '5 liñas e 4 espazos', ['4 liñas e 3 espazos', '5 liñas e 5 espazos', '6 liñas e 5 espazos'], '5 e 4.'),
  elixe('Cantas claves hai?', 'Sete: 1 de Sol, 2 de Fa e 4 de Do', ['Tres: Sol, Fa e Do', 'Sete: 4 de Sol, 2 de Fa e 1 de Do', 'Cinco: 1 de Sol, 2 de Fa e 2 de Do'], '1 + 2 + 4 = 7.'),
  elixe('Quen inventou os nomes actuais das notas?', "Guido d'Arezzo, un monxe beneditino", ['Beethoven', 'Franco de Colonia', 'Adriano Banchieri'], 'No século XI.'),
  elixe('De onde sacou os nomes das notas?', 'Das primeiras sílabas de cada verso do Himno a San Xoán Bautista', ['Das letras do alfabeto', 'Dos nomes dos seus discípulos', 'Das liñas do pentagrama'], 'O himno.'),
  elixe('En que século se inventaron os nomes actuais das notas?', 'No século XI', ['No século I', 'No século XVII', 'No século XX'], 'Século XI.'),
  elixe('Onde se segue usando a notación alfabética?', 'Nos países anglosaxóns', ['Só en Italia', 'En ningún sitio', 'Só na igrexa'], 'Por iso as cancións inglesas usan letras.'),
  elixe('Que clave é esta?', 'clave de sol', ['clave de fa', 'clave de do'], 'Clave de sol.', <DebuxoClave c="sol" />),
  elixe('Que clave é esta?', 'clave de fa', ['clave de sol', 'clave de do'], 'Clave de fa.', <DebuxoClave c="fa" />),
  elixe('Que clave é esta?', 'clave de do', ['clave de sol', 'clave de fa'], 'Clave de do.', <DebuxoClave c="do" />),
  toca('Toca a 2.ª liña.', Pentagrama, NOMES_PENTAGRAMA, 'l2', 'Cóntanse de abaixo a arriba.'),
  toca('Toca o 3.º espazo.', Pentagrama, NOMES_PENTAGRAMA, 'e3', 'Cóntanse de abaixo a arriba.'),
  toca('Toca a 5.ª liña.', Pentagrama, NOMES_PENTAGRAMA, 'l5', 'A de arriba de todo.'),
]

export function Altura(p: PropsParada) {
  return <Parada {...p} unidade={U} id="altura" titulo="A altura: notas, escala, pentagrama e claves" tarxetas={ALTURA_TARXETAS} xogos={ALTURA_XOGOS} preguntas={ALTURA_PREG} />
}

// ===================================================================================================
// 5. Tons, semitóns e alteracións
// ===================================================================================================

const ALTERACIONS = [
  { palabra: '♯ Sostido', significado: 'Sube 1/2 ton á nota.' },
  { palabra: '♭ Bemol', significado: 'Baixa 1/2 ton á nota.' },
  { palabra: '♮ Becuadro', significado: 'Anula o efecto do sostido e do bemol.' },
]

const pares: [Nota, Nota][] = NOTAS.flatMap((a, i) => NOTAS.slice(i + 1).map((c): [Nota, Nota] => [a, c]))

const TONS_TARXETAS: Tarxeta[] = [
  {
    titulo: 'Ton e semitón',
    texto: (
      <>
        <p>
          {b('Ton')} é a distancia sonora entre dúas notas consecutivas, {b('agás MI-FA e SI-DO')}, onde hai {b('1/2 ton ou semitón')}.
        </p>
        <div className="grid grid-cols-8 gap-0.5 text-center text-sm font-bold sm:text-base">
          {[...NOTAS, 'Do'].map((n, i) => (
            <div key={i}>
              <div className="rounded bg-violet-100 py-1">{n}</div>
              {i < 7 && <div className={`mt-1 ${semitonsAaSeguinte(NOTAS[i]) === 1 ? 'text-rose-600' : 'text-slate-500'}`}>{semitonsAaSeguinte(NOTAS[i]) === 1 ? '½ →' : '1 →'}</div>}
            </div>
          ))}
        </div>
        <p>
          A escala natural (de Do a Do) ten {b('5 tons e 2 semitóns')}.
        </p>
        <SonFila>
          <Soar son="ton">Ton (Do-Re)</Soar>
          <Soar son="semiton">Semitón (Mi-Fa)</Soar>
        </SonFila>
      </>
    ),
  },
  {
    titulo: 'O intervalo',
    texto: (
      <>
        <p>
          {b('Intervalo')} é a distancia sonora que hai entre dúas notas. Mídese en {b('tons e semitóns')}.
        </p>
        <Caixa titulo="Exemplo: de Do a Fa">
          Do-Re (1) + Re-Mi (1) + Mi-Fa (1/2) = <b>{enTons(semitons('Do', 'Fa'))}</b>
        </Caixa>
      </>
    ),
  },
  {
    titulo: 'Os signos de alteración',
    texto: (
      <>
        <p>
          {b('Modifican a altura')} dunha nota. Colócanse {b('á esquerda')} da nota. Hai tres tipos:
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          {ALTERACIONS.map((a) => (
            <Caixa key={a.palabra} titulo={a.palabra}>
              {a.significado}
            </Caixa>
          ))}
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <Caixa titulo="Propias">
            Ao principio do pentagrama, entre a clave e o ritmo. Afectan a todas as notas iguais de toda a canción. O seu conxunto chámase {b('armadura')}.
          </Caixa>
          <Caixa titulo="Accidentais">Diante da nota que alteran. Afectan a todas as notas iguais {b('dese compás')}.</Caixa>
        </div>
      </>
    ),
  },
  {
    titulo: 'As notas enarmónicas',
    texto: (
      <p>
        Son notas con {b('distinto nome pero o mesmo son')}: Do♯ e Re♭ soan igual. No piano, cada tecla negra ten dous nomes.
      </p>
    ),
    visual: <Teclado />,
    ancho: true,
  },
]

const TONS_XOGOS: Xogo[] = [
  { id: 'une', titulo: 'As alteracións', icono: '♯', explica: 'Une cada signo co que fai.', crear: (acabar) => <Une pares={ALTERACIONS} acabar={acabar} /> },
  { id: 'busca', titulo: 'Busca no teclado', icono: '🎹', explica: 'Toca cada tecla que che pida.', crear: (acabar) => <Busca Debuxo={Teclado} nomes={NOMES_TECLADO} obxectivos={Object.keys(NOMES_TECLADO)} acabar={acabar} /> },
  {
    id: 'clasifica',
    titulo: 'Ton ou semitón?',
    icono: '🗂️',
    explica: 'Que distancia hai entre as dúas notas?',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 't', nome: '1 ton', cor: 'border-sky-300 bg-sky-100' },
          { id: 's', nome: '1/2 ton', cor: 'border-rose-300 bg-rose-100' },
        ]}
        elementos={NOTAS.map((n, i) => ({ texto: `${n}-${NOTAS[(i + 1) % 7]}`, caixa: semitonsAaSeguinte(n) === 1 ? 's' : 't' }))}
        acabar={acabar}
      />
    ),
  },
]

const INTERVALOS = barallar(pares)
  .slice(0, 12)
  .map(([a, c]) => {
    const s = semitons(a, c)
    return elixe(<>Canto hai subindo de {a} a {c}?</>, enTons(s), [...new Set([enTons(s + 1), enTons(s + 2), enTons(Math.max(1, s - 1))])].filter((x) => x !== enTons(s)), <>De {a} a {c}: {enTons(s)}.</>)
  })

const ENARMONICAS = NOTAS.filter((n) => enarmonica(n)).map((n) => elixe(<>Cal é a nota enarmónica de {n}♯?</>, enarmonica(n)!, [`${n}♭`, ...NOTAS.filter((x) => `${x}♭` !== enarmonica(n) && x !== n).slice(0, 2).map((x) => `${x}♭`)], <>{n}♯ e {enarmonica(n)} soan igual.</>))

const TONS_PREG: Pregunta[] = [
  ...INTERVALOS,
  ...ENARMONICAS,
  elixe('Entre que notas hai semitón na escala natural?', 'Mi-Fa e Si-Do', ['Do-Re e Fa-Sol', 'Re-Mi e La-Si', 'Sol-La e Do-Re'], 'Só neses dous casos.'),
  elixe('De que está composta a escala natural de Do a Do?', '5 tons e 2 semitóns', ['7 tons', '6 tons e 1 semitón', '4 tons e 3 semitóns'], '5 tons e 2 semitóns.'),
  elixe('Que é un intervalo?', 'A distancia sonora entre dúas notas', ['Un silenzo entre dúas notas', 'Un tipo de compás', 'Un signo de repetición'], 'Mídese en tons e semitóns.'),
  elixe('En que se mide un intervalo?', 'En tons e semitóns', ['En hercios', 'En decibelios', 'En compases'], 'Tons e semitóns.'),
  elixe('Que fai o sostido?', 'Sube 1/2 ton á nota', ['Baixa 1/2 ton', 'Anula as alteracións', 'Sube 1 ton'], '♯ sube.'),
  elixe('Que fai o bemol?', 'Baixa 1/2 ton á nota', ['Sube 1/2 ton', 'Anula as alteracións', 'Baixa 1 ton'], '♭ baixa.'),
  elixe('Que fai o becuadro?', 'Anula o efecto do sostido e do bemol', ['Sube 1/2 ton', 'Baixa 1/2 ton', 'Alonga a nota'], '♮ anula.'),
  elixe('Onde se colocan as alteracións?', 'Á esquerda da nota', ['Á dereita da nota', 'Enriba da nota', 'Ao final do compás'], 'Á esquerda.'),
  elixe('Como se chama o conxunto de alteracións propias?', 'Armadura', ['Escala', 'Clave', 'Enarmonía'], 'Armadura.'),
  elixe('A que afecta unha alteración accidental?', 'A todas as notas iguais dese compás', ['A toda a canción', 'Só a esa nota e a ningunha máis', 'A todas as notas do compás'], 'Só nese compás.'),
  elixe('A que afecta unha alteración propia?', 'A todas as notas iguais de toda a canción', ['Só a ese compás', 'Só á nota seguinte', 'Á clave'], 'Toda a canción.'),
  elixe('Onde se sitúan as alteracións propias?', 'Ao principio do pentagrama, entre a clave e o ritmo', ['Ao final da obra', 'Diante de cada nota', 'Enriba do pentagrama'], 'Entre a clave e o ritmo.'),
  elixe('Que son as notas enarmónicas?', 'Notas con distinto nome pero o mesmo son', ['Notas co mesmo nome e distinto son', 'As notas máis agudas', 'Notas sen alteración'], 'Do♯ = Re♭.'),
  toca('Toca Mi.', Teclado, NOMES_TECLADO, 'Mi', 'A branca que vai despois de Re.'),
  toca('Toca a tecla de Do♯ / Re♭.', Teclado, NOMES_TECLADO, 'Do♯ / Re♭', 'A negra entre Do e Re.'),
]

export function Tons(p: PropsParada) {
  return <Parada {...p} unidade={U} id="tons" titulo="Tons, semitóns e alteracións" tarxetas={TONS_TARXETAS} xogos={TONS_XOGOS} preguntas={TONS_PREG} videos={[{ id: 'QFPYklL8Zxw', titulo: 'Tonos, semitonos y alteraciones musicales', canal: 'sofía García Muñoz', minutos: 5 }]} />
}

// ===================================================================================================
// 6. Figuras e silenzos
// ===================================================================================================

const nomeF = (f: string) => f.charAt(0).toUpperCase() + f.slice(1)

const FIGURAS_TARXETAS: Tarxeta[] = [
  {
    titulo: 'Figuras e silenzos',
    texto: (
      <>
        <p>
          Signos musicais que representan a {b('duración do son ou da ausencia do mesmo')}. Cada figura vale o {b('dobre')} da seguinte e a {b('metade')} da anterior.
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {FIGURAS.map((f) => (
            <div key={f} className="flex flex-col items-center rounded-2xl border-2 border-violet-100 bg-white p-1 text-center">
              <div className="flex">
                <DebuxoFigura f={f} tam={64} />
                <DebuxoSilenzo f={f} tam={64} />
              </div>
              <b>{nomeF(f)}</b>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    titulo: 'Partes da figura',
    texto: <p>A {b('cabeza')}, a {b('plica')} (o pau) e o {b('corchete')} (o gancho).</p>,
    visual: <PartesFigura />,
    ancho: true,
  },
  {
    titulo: 'Onde van os silenzos',
    texto: (
      <>
        <div className="flex flex-wrap justify-center gap-3 text-center font-semibold">
          <div>
            <DebuxoSilenzo f="redonda" />
            Redonda: colga da 4.ª liña
          </div>
          <div>
            <DebuxoSilenzo f="branca" />
            Branca: sobre a 3.ª liña
          </div>
        </div>
        <Truco>A redonda pesa máis: colga. A branca é máis lixeira: senta enriba.</Truco>
      </>
    ),
  },
  {
    titulo: 'Contar',
    texto: (
      <div className="text-center text-xl font-bold">
        <p>1 redonda = 2 brancas = 4 negras</p>
        <p>= 8 corcheas = 16 semicorcheas</p>
        <p>= 32 fusas = 64 semifusas</p>
      </div>
    ),
  },
]

const PARES_FIG: [Figura, Figura][] = FIGURAS.flatMap((g, i) => FIGURAS.slice(i + 1).map((p): [Figura, Figura] => [g, p])).filter(([g, p]) => cantasCaben(g, p) <= 16)
const pl = (f: Figura) => `${f}s`

const CANTAS: Pregunta[] = PARES_FIG.map(([g, p]) => {
  const n = cantasCaben(g, p)
  return { tipo: 'numero', texto: <>Cantas {pl(p)} caben nunha {g}?</>, valor: n, marxe: 0, explica: <>1 {g} = {n} {pl(p)}.</> }
})

const FIGURAS_XOGOS: Xogo[] = [
  { id: 'cantas', titulo: 'Cantas caben?', icono: '🧮', explica: 'Escribe o número.', crear: (acabar) => <Practica preguntas={CANTAS} acabar={acabar} /> },
  { id: 'orde', titulo: 'De maior a menor', icono: '🪜', explica: 'Ordena as figuras.', crear: (acabar) => <Ordena frases={[{ palabras: [...FIGURAS], traducion: 'Da que máis dura á que menos' }]} acabar={acabar} /> },
  { id: 'partes', titulo: 'Partes da figura', icono: '🎵', explica: 'Toca cada parte.', crear: (acabar) => <Busca Debuxo={PartesFigura} nomes={NOMES_PARTES} obxectivos={Object.keys(NOMES_PARTES)} acabar={acabar} /> },
]

const FIGURAS_PREG: Pregunta[] = [
  ...FIGURAS.map((f) => elixe('Que figura é esta?', f, outrasDe(FIGURAS, f), <>{nomeF(f)}.</>, <DebuxoFigura f={f} />)),
  ...FIGURAS.slice(0, 5).map((f) => elixe('Que silenzo é este?', `silenzo de ${f}`, outrasDe(FIGURAS, f).map((x) => `silenzo de ${x}`), <>Silenzo de {f}.</>, <DebuxoSilenzo f={f} />)),
  ...CANTAS,
  elixe('Que representan as figuras e os silenzos?', 'A duración do son ou da ausencia do mesmo', ['A altura do son', 'O volume', 'O nome das notas'], 'Duración.'),
  elixe('Que relación hai entre unha figura e a seguinte máis pequena?', 'Vale o dobre', ['Vale o triplo', 'Vale o mesmo', 'Vale a metade'], 'Dobre ao baixar, metade ao subir.'),
  elixe('A corchea vale…', 'A metade dunha negra', ['O dobre dunha negra', 'O mesmo ca unha negra', 'A metade dunha branca'], `Negra = ${valor('negra')}, corchea = 1/2.`),
  elixe('Cales son as partes da figura?', 'Cabeza, plica e corchete', ['Clave, liña e espazo', 'Numerador e denominador', 'Punto, ligadura e caldeirón'], 'Cabeza, plica e corchete.'),
  toca('Toca a plica.', PartesFigura, NOMES_PARTES, 'plica', 'O pau vertical.'),
  toca('Toca a cabeza.', PartesFigura, NOMES_PARTES, 'cabeza', 'O círculo.'),
  toca('Toca o corchete.', PartesFigura, NOMES_PARTES, 'corchete', 'O gancho.'),
]

export function Figuras(p: PropsParada) {
  return <Parada {...p} unidade={U} id="figuras" titulo="A duración: figuras e silenzos" tarxetas={FIGURAS_TARXETAS} xogos={FIGURAS_XOGOS} preguntas={FIGURAS_PREG} videos={[{ id: 'DWVfgbmjJlo', titulo: 'Las figuras musicales y sus silencios', canal: 'Smile and Learn', minutos: 6 }]} />
}

// ===================================================================================================
// 7. Compases
// ===================================================================================================

const SIMPLES: [number, number][] = [2, 3, 4].flatMap((n) => [2, 4, 8].map((d): [number, number] => [n, d]))
const NUMERADORES = [2, 3, 4, 6, 9, 12]

const COMPASES_TARXETAS: Tarxeta[] = [
  {
    titulo: 'Que é un compás',
    texto: (
      <>
        <p>
          Cada unha das {b('partes de igual duración')} nas que se divide un pentagrama.
        </p>
        <Lista
          items={[
            <>
              Para separalos úsanse as {b('liñas ou barras divisorias')}.
            </>,
            <>
              Para indicar o final dunha obra ou un cambio importante, a {b('dobre barra divisoria')}.
            </>,
          ]}
        />
      </>
    ),
  },
  {
    titulo: 'Numerador e denominador',
    texto: (
      <>
        <div className="grid gap-2 sm:grid-cols-2">
          <Caixa titulo="Numerador (arriba)">Indica o {b('número de tempos')} do compás.</Caixa>
          <Caixa titulo="Denominador (abaixo)">Indica a {b('figura unidade de tempo')} (a que vale un tempo) con relación á redonda.</Caixa>
        </div>
        <table className="w-full border-collapse text-center text-lg">
          <thead>
            <tr className="bg-violet-100">
              {Object.keys(DENOMINADORES).map((d) => (
                <th key={d} className="border p-1">
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {Object.values(DENOMINADORES).map((f) => (
                <td key={f} className="border p-1 text-sm sm:text-base">
                  {f}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        <Caixa>Figura unidade de tempo × nº de tempos = figura unidade de compás (a que enche todo o compás).</Caixa>
      </>
    ),
  },
  {
    titulo: 'Tipos de compases',
    texto: (
      <>
        <table className="w-full border-collapse text-center text-lg">
          <thead>
            <tr className="bg-violet-100">
              <th className="border p-1" />
              <th className="border p-1">Simples</th>
              <th className="border p-1">Compostos</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-1 font-bold">Binarios (2 tempos)</td>
              <td className="border p-1">2</td>
              <td className="border p-1">6</td>
            </tr>
            <tr>
              <td className="border p-1 font-bold">Ternarios (3 tempos)</td>
              <td className="border p-1">3</td>
              <td className="border p-1">9</td>
            </tr>
            <tr>
              <td className="border p-1 font-bold">Cuaternarios (4 tempos)</td>
              <td className="border p-1">4</td>
              <td className="border p-1">12</td>
            </tr>
          </tbody>
        </table>
        <SonFila>
          <Soar son="binario">Binario</Soar>
          <Soar son="ternario">Ternario</Soar>
          <Soar son="cuaternario">Cuaternario</Soar>
        </SonFila>
      </>
    ),
  },
  {
    titulo: 'A anacrusa',
    texto: (
      <p>
        {b('Comezar unha obra musical en compás incompleto')}. Non sempre a música empeza no primeiro tempo (forte): cando empeza nun {b('tempo débil')}, chámase anacrusa.
      </p>
    ),
  },
]

const preguntaUnidade = ([n, d]: [number, number]) => {
  const u = unidadeCompas(n, d)
  const todas = SIMPLES.map(([a, c]) => unidadeCompas(a, c))
  return elixe(<>Que figura enche un compás de {n}/{d}?</>, u, outrasDe([...new Set(todas)], u), <>{n} tempos × {DENOMINADORES[d]} = {u}.</>)
}

const COMPASES_XOGOS: Xogo[] = [
  {
    id: 'tipos',
    titulo: 'Binario, ternario ou cuaternario?',
    icono: '🗂️',
    explica: 'Coloca cada numerador.',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'binario', nome: 'Binario', cor: 'border-sky-300 bg-sky-100' },
          { id: 'ternario', nome: 'Ternario', cor: 'border-amber-300 bg-amber-100' },
          { id: 'cuaternario', nome: 'Cuaternario', cor: 'border-rose-300 bg-rose-100' },
        ]}
        elementos={NUMERADORES.map((n) => ({ texto: `Numerador ${n}`, caixa: tipoCompas(n)! }))}
        acabar={acabar}
      />
    ),
  },
  { id: 'den', titulo: 'O denominador', icono: '🔗', explica: 'Une cada número coa súa figura.', crear: (acabar) => <Une pares={Object.entries(DENOMINADORES).map(([palabra, significado]) => ({ palabra, significado }))} acabar={acabar} /> },
  { id: 'unidade', titulo: 'Que figura o enche?', icono: '🧮', explica: 'Figura unidade de compás.', crear: (acabar) => <Practica preguntas={SIMPLES.map(preguntaUnidade)} acabar={acabar} /> },
]

const COMPASES_PREG: Pregunta[] = [
  ...SIMPLES.map(preguntaUnidade),
  ...NUMERADORES.map((n) => elixe(<>Un compás con numerador {n} é…</>, tipoCompas(n)!, ['binario', 'ternario', 'cuaternario'].filter((x) => x !== tipoCompas(n)), <>{n}: {tipoCompas(n)} {claseCompas(n)}.</>)),
  ...NUMERADORES.map((n) => elixe(<>Un compás con numerador {n}, é simple ou composto?</>, claseCompas(n), ['simple', 'composto'].filter((x) => x !== claseCompas(n)), <>Simples: 2, 3 e 4. Compostos: 6, 9 e 12.</>)),
  ...Object.entries(DENOMINADORES).map(([d, f]) => elixe(<>Que figura indica o denominador {d}?</>, f, outrasDe(Object.values(DENOMINADORES), f), <>{d} = {f}.</>)),
  elixe('Que é un compás?', 'Cada unha das partes de igual duración nas que se divide un pentagrama', ['Unha nota moi longa', 'O signo do principio do pentagrama', 'Un tipo de silenzo'], 'Partes de igual duración.'),
  elixe('Que indica o numerador?', 'O número de tempos do compás', ['A figura que vale un tempo', 'A nota máis aguda', 'A velocidade'], 'O de arriba: tempos.'),
  elixe('Que indica o denominador?', 'A figura unidade de tempo', ['O número de tempos', 'A velocidade', 'O volume'], 'O de abaixo: a figura que vale un tempo.'),
  elixe('Con que se separan os compases?', 'Coas liñas ou barras divisorias', ['Con claves', 'Con silenzos', 'Con ligaduras'], 'Barras divisorias.'),
  elixe('Que indica a dobre barra divisoria?', 'O final da obra ou un cambio importante', ['Que se toca máis forte', 'Un silenzo', 'Unha alteración'], 'Final ou cambio importante.'),
  elixe('Que é a anacrusa?', 'Comezar unha obra musical en compás incompleto', ['Rematar a obra cun silenzo', 'Tocar moi forte', 'Un compás de 5 tempos'], 'Empeza nun tempo débil.'),
  elixe('Como é o tempo no que empeza unha anacrusa?', 'Débil', ['Forte', 'Moi longo', 'Agudo'], 'Non empeza no primeiro tempo (forte).'),
]

export function Compases(p: PropsParada) {
  return <Parada {...p} unidade={U} id="compases" titulo="Os compases" tarxetas={COMPASES_TARXETAS} xogos={COMPASES_XOGOS} preguntas={COMPASES_PREG} videos={[{ id: 'faBivRMi2LY', titulo: '¿Por qué medimos el ritmo así? Compás de 4/4, 2/4, 6/8, 3/4…', canal: 'Jaime Altozano', minutos: 6 }]} />
}

// ===================================================================================================
// 8. Prolongación e tempo
// ===================================================================================================

const PROLONGACION = [
  { palabra: 'Punto', significado: 'Á dereita dunha figura ou silenzo: engádelle a metade do seu valor.' },
  { palabra: 'Ligadura', significado: 'Arco que une dúas notas iguais: a súa duración súmase nunha soa nota.' },
  { palabra: 'Caldeirón', significado: 'Arco cun punto enriba dunha nota ou silenzo: prolonga a duración parando a marcha do compás.' },
]
const TEMPOS = [
  { palabra: 'Largo', significado: 'moi lento' },
  { palabra: 'Largetto', significado: 'lento' },
  { palabra: 'Adagio', significado: 'amodo' },
  { palabra: 'Andante', significado: 'tranquilo' },
  { palabra: 'Moderato', significado: 'moderado' },
  { palabra: 'Allegro', significado: 'ledo' },
  { palabra: 'Presto', significado: 'rápido' },
  { palabra: 'Prestissimo', significado: 'moi rápido' },
]
const MODIFICACIONS = [
  { palabra: 'accelerando (accel)', significado: 'aumentar progresivamente a velocidade' },
  { palabra: 'ritardando (rit)', significado: 'diminuír progresivamente a velocidade' },
  { palabra: 'rubato', significado: 'medida libre e desigual, alongando ou acurtando os valores' },
  { palabra: 'a tempo', significado: 'volver á velocidade orixinal' },
]

const TEMPO_TARXETAS: Tarxeta[] = [
  {
    titulo: 'Signos de prolongación',
    texto: (
      <>
        <p>Modifican a duración dunha nota:</p>
        <div className="grid gap-2 sm:grid-cols-3">
          {PROLONGACION.map((s) => (
            <div key={s.palabra} className="rounded-2xl border-2 border-violet-200 bg-white p-2 text-center text-base">
              <div className="flex justify-center">
                <DebuxoSigno s={s.palabra === 'Caldeirón' ? 'caldeirón' : s.palabra.toLowerCase()} />
              </div>
              <b>{s.palabra}</b>
              <p>{s.significado}</p>
            </div>
          ))}
        </div>
        <Truco>Punto: branca (2) + a metade (1) = 3 negras.</Truco>
      </>
    ),
  },
  {
    titulo: 'O tempo',
    texto: (
      <>
        <p>
          {b('Tempo')} é a {b('velocidade de interpretación')} dunha obra musical. Indícase con termos italianos:
        </p>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
          {TEMPOS.map((x) => (
            <div key={x.palabra} className="rounded-xl bg-violet-100 p-2 text-center">
              <b className="block italic">{x.palabra}</b>
              <span className="text-base">{x.significado}</span>
            </div>
          ))}
        </div>
        <SonFila>
          <Soar son="largo">Largo</Soar>
          <Soar son="allegro">Allegro</Soar>
          <Soar son="prestissimo">Prestissimo</Soar>
        </SonFila>
        <Caixa titulo="O metrónomo">Aparato de reloxería que serve para marcar os tempos ou pulsos do compás.</Caixa>
      </>
    ),
  },
  {
    titulo: 'Modificacións do tempo',
    texto: (
      <>
        <p>Ás veces o tempo acelérase, retárdase ou faise máis libre, e despois recupérase:</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {MODIFICACIONS.map((m) => (
            <Caixa key={m.palabra} titulo={m.palabra}>
              {m.significado}
            </Caixa>
          ))}
        </div>
        <SonFila>
          <Soar son="accelerando">accelerando</Soar>
          <Soar son="ritardando">ritardando</Soar>
        </SonFila>
      </>
    ),
  },
]

const TEMPO_XOGOS: Xogo[] = [
  { id: 'orde', titulo: 'Do máis lento ao máis rápido', icono: '🐢', explica: 'Ordena os tempos.', crear: (acabar) => <Ordena frases={[{ palabras: TEMPOS.map((x) => x.palabra), traducion: 'Do máis lento ao máis rápido' }]} acabar={acabar} /> },
  { id: 'une', titulo: 'Os termos do tempo', icono: '🔗', explica: 'Une cada termo co que significa.', crear: (acabar) => <Une pares={TEMPOS} acabar={acabar} /> },
  { id: 'mod', titulo: 'As modificacións', icono: '🎚️', explica: 'Une cada termo co que significa.', crear: (acabar) => <Une pares={MODIFICACIONS} acabar={acabar} /> },
]

const valorPunto = FIGURAS.slice(0, 3).map((f) => {
  const v = conPunto(f)
  return { tipo: 'numero', texto: <>Cantas negras vale unha {f} con punto?</>, valor: v, marxe: 0, explica: <>{f}: {valor(f)} + a metade = {String(v).replace('.', ',')} negras.</> } as Pregunta
})

const TEMPO_PREG: Pregunta[] = [
  ...valorPunto,
  ...PROLONGACION.map((s) => elixe(<>«{s.significado}» Que signo é?</>, s.palabra, PROLONGACION.filter((x) => x !== s).map((x) => x.palabra), <>{s.palabra}.</>)),
  ...(['punto', 'ligadura', 'caldeirón'] as const).map((s) => elixe('Que signo de prolongación é este?', s, ['punto', 'ligadura', 'caldeirón'].filter((x) => x !== s), <>{s}.</>, <DebuxoSigno s={s} />)),
  ...TEMPOS.map((x) => elixe(<>Que significa <i>{x.palabra}</i>?</>, x.significado, outrasDe(TEMPOS.map((y) => y.significado), x.significado), <>{x.palabra}: {x.significado}.</>)),
  ...MODIFICACIONS.map((m) => elixe(<>Que significa <i>{m.palabra}</i>?</>, m.significado, MODIFICACIONS.filter((x) => x !== m).map((x) => x.significado), <>{m.palabra}.</>)),
  elixe('Que é o tempo en música?', 'A velocidade de interpretación dunha obra musical', ['O volume', 'A altura', 'O número de compases'], 'Velocidade.'),
  elixe('Que é o metrónomo?', 'Un aparato de reloxería que marca os tempos ou pulsos do compás', ['Unha barra que dá a nota La', 'Un instrumento de corda', 'Un signo de alteración'], 'A barra do La é o diapasón.'),
  elixe('Cal é máis rápido?', 'Allegro', ['Adagio', 'Largo', 'Andante'], 'Largo, Largetto, Adagio, Andante, Moderato, Allegro…'),
  elixe('Cal é máis lento?', 'Largo', ['Moderato', 'Presto', 'Andante'], 'O máis lento da lista.'),
  elixe('Que fai a ligadura de unión?', 'Une dúas notas iguais e suma a súa duración', ['Une notas distintas para tocalas ligadas', 'Sube a nota 1/2 ton', 'Fai a nota máis forte'], 'Notas iguais.'),
]

export function Tempo(p: PropsParada) {
  return <Parada {...p} unidade={U} id="tempo" titulo="Prolongación e tempo" tarxetas={TEMPO_TARXETAS} xogos={TEMPO_XOGOS} preguntas={TEMPO_PREG} />
}

// ===================================================================================================
// 9. A intensidade e a expresión
// ===================================================================================================

const MATICES = [
  { palabra: 'ppp', nome: 'pianissimo', significado: 'suavísimo' },
  { palabra: 'pp', nome: 'molto piano', significado: 'moi suave' },
  { palabra: 'p', nome: 'piano', significado: 'suave' },
  { palabra: 'mp', nome: 'mezzopiano', significado: 'medio suave' },
  { palabra: 'mf', nome: 'mezzoforte', significado: 'medio forte' },
  { palabra: 'f', nome: 'forte', significado: 'forte' },
  { palabra: 'ff', nome: 'molto forte', significado: 'moi forte' },
  { palabra: 'fff', nome: 'fortissimo', significado: 'fortísimo' },
]
const CARACTER = [
  { palabra: 'affectuoso', significado: 'afectuoso' },
  { palabra: 'appasionato', significado: 'apasionado' },
  { palabra: 'giocoso', significado: 'gracioso' },
  { palabra: 'con brio', significado: 'con enerxía' },
  { palabra: 'maestoso', significado: 'maxestoso' },
  { palabra: 'animato', significado: 'animado' },
  { palabra: 'dolce', significado: 'doce' },
  { palabra: 'sostenuto', significado: 'mantido' },
  { palabra: 'giusto', significado: 'preciso' },
]
const EXPRESION = [
  { palabra: 'Ligadura de expresión', significado: 'Une dúas ou máis notas distintas, tocándoas o máis unidas posible (legato).' },
  { palabra: 'Apóstrofe ou coma', significado: 'Marca unha breve pausa para respirar ao rematar unha frase.' },
  { palabra: 'Picado', significado: 'Punto enriba ou debaixo da nota: acórtase a súa duración.' },
  { palabra: 'Stacatto', significado: 'Acento vertical: atácase a nota de maneira enérxica e acórtase.' },
]

const INTENSIDADE_TARXETAS: Tarxeta[] = [
  {
    titulo: 'Os matices de intensidade',
    texto: (
      <>
        <p>
          Poden expresarse de {b('tres maneiras')}: {b('letras, termos e reguladores')}.
        </p>
        <p className="font-bold">1. Letras (de menor a maior):</p>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
          {MATICES.map((m) => (
            <div key={m.palabra} className="rounded-xl bg-violet-100 p-2 text-center">
              <b className="block text-xl italic">{m.palabra}</b>
              <span className="text-sm">
                {m.nome}: {m.significado}
              </span>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    titulo: 'Termos e reguladores',
    texto: (
      <>
        <p className="font-bold">2. Termos:</p>
        <Lista
          items={[
            <>
              <i>Crescendo</i> (cresc.) ou <i>aumentando</i> (aum.): {b('subir')} progresivamente o volume.
            </>,
            <>
              <i>Decrescendo</i> (decresc.) ou <i>diminuendo</i> (dim.): {b('baixar')} progresivamente o volume.
            </>,
          ]}
        />
        <p className="font-bold">3. Reguladores: signos en forma de ángulo.</p>
        <div className="flex flex-wrap justify-center gap-4 text-center font-semibold">
          <div>
            <DebuxoSigno s="crescendo" tam={70} />
            crescendo <Soar son="crescendo">Oír</Soar>
          </div>
          <div>
            <DebuxoSigno s="decrescendo" tam={70} />
            decrescendo <Soar son="decrescendo">Oír</Soar>
          </div>
        </div>
        <Truco>O ángulo ábrese: sobe. O ángulo péchase: baixa.</Truco>
      </>
    ),
  },
  {
    titulo: 'Termos de carácter',
    texto: (
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
        {CARACTER.map((x) => (
          <div key={x.palabra} className="rounded-xl bg-violet-100 p-2 text-center">
            <b className="block italic">{x.palabra}</b>
            <span className="text-base">{x.significado}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    titulo: 'Fraseo e articulación',
    texto: (
      <div className="grid gap-2 sm:grid-cols-2">
        {EXPRESION.map((s) => (
          <div key={s.palabra} className="flex items-center gap-2 rounded-2xl border-2 border-violet-200 bg-white p-2 text-base">
            <DebuxoSigno s={s.palabra.toLowerCase()} tam={90} />
            <span>
              <b>{s.palabra}.</b> {s.significado}
            </span>
          </div>
        ))}
        <SonFila>
          <Soar son="legato">Legato</Soar>
          <Soar son="picado">Picado</Soar>
        </SonFila>
      </div>
    ),
  },
]

const INTENSIDADE_XOGOS: Xogo[] = [
  { id: 'orde', titulo: 'De menor a maior', icono: '🔉', explica: 'Ordena os matices.', crear: (acabar) => <Ordena frases={[{ palabras: MATICES.map((m) => m.palabra), traducion: 'Do máis suave ao máis forte' }]} acabar={acabar} /> },
  { id: 'une', titulo: 'Termos de carácter', icono: '🎭', explica: 'Une cada termo co que significa.', crear: (acabar) => <Une pares={barallar(CARACTER).slice(0, 6)} acabar={acabar} /> },
  { id: 'expresion', titulo: 'Fraseo e articulación', icono: '🔗', explica: 'Une cada signo co que fai.', crear: (acabar) => <Une pares={EXPRESION} acabar={acabar} /> },
]

const INTENSIDADE_PREG: Pregunta[] = [
  ...MATICES.map((m) => elixe(<>Que significa <i>{m.palabra}</i>?</>, m.significado, outrasDe(MATICES.map((x) => x.significado), m.significado), <>{m.palabra} ({m.nome}): {m.significado}.</>)),
  ...MATICES.map((m) => elixe(<>Cal é a abreviatura de «{m.nome}»?</>, m.palabra, outrasDe(MATICES.map((x) => x.palabra), m.palabra), <>{m.nome}: {m.palabra}.</>)),
  ...CARACTER.map((x) => elixe(<>Que significa <i>{x.palabra}</i>?</>, x.significado, outrasDe(CARACTER.map((y) => y.significado), x.significado), <>{x.palabra}: {x.significado}.</>)),
  ...EXPRESION.map((s) => elixe(<>«{s.significado}» Que é?</>, s.palabra, EXPRESION.filter((x) => x !== s).map((x) => x.palabra), <>{s.palabra}.</>)),
  ...Object.keys(SIGNOS)
    .filter((s) => ['ligadura de expresión', 'apóstrofe ou coma', 'picado', 'stacatto'].includes(s))
    .map((s) => elixe('Que signo é este?', s, ['ligadura de expresión', 'apóstrofe ou coma', 'picado', 'stacatto'].filter((x) => x !== s), <>{s}.</>, <DebuxoSigno s={s} />)),
  elixe('Este regulador equivale a…', 'crescendo', ['decrescendo'], 'O ángulo ábrese.', <DebuxoSigno s="crescendo" />),
  elixe('Este regulador equivale a…', 'decrescendo', ['crescendo'], 'O ángulo péchase.', <DebuxoSigno s="decrescendo" />),
  elixe('De que maneiras poden expresarse os matices?', 'Letras, termos e reguladores', ['Claves, notas e figuras', 'Só con letras', 'Puntos, ligaduras e caldeiróns'], 'Tres maneiras.'),
  elixe('Que significa «crescendo»?', 'Subir progresivamente o volume', ['Baixar progresivamente o volume', 'Ir máis rápido', 'Ir máis lento'], 'Crescendo ou aumentando.'),
  elixe('Que significa «diminuendo»?', 'Baixar progresivamente o volume', ['Subir progresivamente o volume', 'Ir máis lento', 'Parar'], 'Decrescendo ou diminuendo.'),
  elixe('Cal soa máis forte?', 'mf', ['p', 'mp', 'pp'], 'De menor a maior: ppp, pp, p, mp, mf, f, ff, fff.'),
  elixe('Cal soa máis suave?', 'pp', ['p', 'mp', 'f'], 'De menor a maior: ppp, pp, p, mp, mf, f, ff, fff.'),
  elixe('Como se chama tamén a ligadura de expresión?', 'Legato', ['Picado', 'Stacatto', 'Rubato'], 'Legato.'),
]

export function Intensidade(p: PropsParada) {
  return <Parada {...p} unidade={U} id="intensidade" titulo="A intensidade e a expresión" tarxetas={INTENSIDADE_TARXETAS} xogos={INTENSIDADE_XOGOS} preguntas={INTENSIDADE_PREG} videos={[{ id: 'Rccupcd4LHs', titulo: 'Matices y dinámicas musicales: ejemplos', canal: 'Tus clases de Lenguaje Musical', minutos: 5 }]} />
}

export const PREGUNTAS_MUSICA1: Record<string, Pregunta[]> = {
  son: SON_PREG,
  silenzo: SILENZO_PREG,
  cualidades: CUALIDADES_PREG,
  altura: ALTURA_PREG,
  tons: TONS_PREG,
  figuras: FIGURAS_PREG,
  compases: COMPASES_PREG,
  tempo: TEMPO_PREG,
  intensidade: INTENSIDADE_PREG,
}
