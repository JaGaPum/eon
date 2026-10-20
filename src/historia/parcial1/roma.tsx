// Roma: as etapas, o goberno e a sociedade, a cidade e o legado, e a romanización de Hispania e Galicia. Segue o
// esquema «Apuntamentos Roma» do profesor e as súas presentacións Roma I a IV.
import type { ReactNode } from 'react'
import { Busca, Clasifica, Ordena, ParadaPrimaria, Proba, Tarxetas, Une, VerdadeiroFalso, Xogos, barallar, type Pregunta, type Tarxeta, type Xogo } from '../../primaria/pezas'
import { elixe, toca } from '../../primaria/paisaxes/preguntas'
import type { Video } from '../../contenido/tema1'
import { CARGOS_IDADE, FEITOS_ROMA } from './datos'
import { CidadeRomana, LinaRoma, NOMES_CIDADE, NOMES_SOCIEDADE, PiramideRoma } from './debuxos'
import { enQueEtapa, queFoiAntes, seriesOrde } from './xerar'

export const b = (t: ReactNode) => <b className="text-violet-800">{t}</b>
export const Caixa = ({ titulo, children, cor = 'border-violet-200' }: { titulo?: ReactNode; children: ReactNode; cor?: string }) => (
  <div className={`rounded-2xl border-2 bg-white p-4 text-lg leading-relaxed ${cor}`}>
    {titulo && <p className="mb-1 font-black text-slate-700">{titulo}</p>}
    {children}
  </div>
)
export const Truco = ({ children }: { children: ReactNode }) => <p className="rounded-2xl bg-amber-100 p-3 text-base text-amber-900">💡 {children}</p>
export const Lista = ({ items }: { items: ReactNode[] }) => (
  <ul className="list-disc space-y-1.5 pl-5">
    {items.map((x, i) => (
      <li key={i}>{x}</li>
    ))}
  </ul>
)

/** Parada con Descubre, Xoga e Proba, e os seus vídeos. */
export function Parada({
  ruta,
  modo,
  titulo,
  id,
  tarxetas,
  xogos,
  preguntas,
  videos,
  unidade = 'historia1',
}: {
  ruta: string
  modo?: string
  titulo: string
  id: string
  tarxetas: Tarxeta[]
  xogos: Xogo[]
  preguntas: Pregunta[]
  videos?: Video[]
  /** Prefixo co que se gardan as estrelas. */
  unidade?: string
}) {
  return (
    <ParadaPrimaria
      ruta={ruta}
      titulo={titulo}
      modo={modo}
      videos={videos}
      paneis={{
        descubre: <Tarxetas tarxetas={tarxetas} xoga={`${ruta}/xoga`} />,
        xoga: <Xogos xogos={xogos} proba={`${ruta}/proba`} />,
        proba: <Proba id={`${unidade}/${id}`} preguntas={preguntas} />,
      }}
    />
  )
}

type PropsParada = { ruta: string; modo?: string }

// ===================================================================================================
// 1. As etapas de Roma
// ===================================================================================================

const ETAPAS_TARXETAS: Tarxeta[] = [
  {
    titulo: 'Tres etapas, catro datas',
    texto: (
      <>
        <p>A historia de Roma divídese en tres etapas segundo quen goberna:</p>
        <Lista items={[<>👑 {b('Monarquía')}: 753 a.C. – 509 a.C. Goberna un rei.</>, <>🏛️ {b('República')}: 509 a.C. – 27 a.C. Gobernan cónsules, Senado e asembleas.</>, <>🦅 {b('Imperio')}: 27 a.C. – 476 d.C. Manda un emperador.</>]} />
        <Truco>Catro números para aprender: 753, 509, 27 e 476. Os tres primeiros son antes de Cristo, así que van «cara atrás»: canto máis grande, máis antigo.</Truco>
      </>
    ),
    visual: <LinaRoma />,
    ancho: true,
  },
  {
    titulo: '👑 A Monarquía (753 – 509 a.C.)',
    texto: (
      <>
        <p>
          {b('Comezo lendario')}: Roma foi fundada por {b('Rómulo')}, quen matou ao seu irmán {b('Remo')}. Cousas de irmáns… A lenda di que de pequenos os criou unha loba (a Loba Capitolina).
        </p>
        <p>
          Gobernaban {b('reis')}: houbo {b('sete')}, de Rómulo a {b('Tarquinio o Soberbio')}; algúns míticos, como Numa Pompilio.
        </p>
        <Lista
          items={[
            <>O 753 a.C. era o {b('ano «0»')} dos romanos: contaban os anos dende o nacemento da cidade.</>,
            <>Grande {b('influencia dos etruscos')}: con eles Roma fixo murallas, sumidoiros e templos, e coñeceu o alfabeto e os deuses gregos.</>,
            <>Aparecen as {b('primeiras normas e costumes')} romanas.</>,
          ]}
        />
      </>
    ),
  },
  {
    titulo: 'Quen mandaba na Monarquía',
    texto: (
      <div className="grid gap-3 sm:grid-cols-3">
        <Caixa titulo="👑 O rei">Xefe militar, civil e relixioso.</Caixa>
        <Caixa titulo="👴 O Senado">O consello de anciáns.</Caixa>
        <Caixa titulo="🛡️ A Asemblea">Os homes libres aptos para a guerra.</Caixa>
      </div>
    ),
  },
  {
    titulo: '🏛️ A República (509 – 27 a.C.)',
    texto: (
      <>
        <p>
          {b('Cambio de sistema')}: os romanos expulsan ao último rei e crean un goberno sen monarquía. Gobernan os {b('cónsules')}, o {b('SENADO')} e as {b('asembleas populares')}.
        </p>
        <Lista
          items={[
            <>Loita entre {b('patricios')} (os ricos) e {b('plebeos')} (o pobo).</>,
            <>{b('Expansión')} por Italia e polo Mediterráneo.</>,
            <>
              {b('Guerras Púnicas')} contra {b('CARTAGO')}.
            </>,
            <>
              {b('Xulio César')} e a crise da República: autonoméase «{b('Dictator Perpetuus')}» e é asasinado no 44 a.C.
            </>,
          ]}
        />
        <Truco>SPQR, o que levaban os estandartes das lexións: «Senatus Populusque Romanus», o Senado e o pobo de Roma.</Truco>
      </>
    ),
  },
  {
    titulo: 'Da República ao Imperio',
    texto: (
      <>
        <p>No século I a.C. hai pobreza entre os plebeos, corrupción, revoltas de escravos e guerras civís. Para mandar fórmanse dous {b('triunviratos')} (goberno de tres):</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Caixa titulo="1.º triunvirato">Xulio César, Pompeio e Craso. César gaña a guerra civil e é nomeado ditador perpetuo. Asasínano no 44 a.C.</Caixa>
          <Caixa titulo="2.º triunvirato">Marco Antonio, Lépido e Octavio. Octavio vence e no 27 a.C. convértese no primeiro emperador.</Caixa>
        </div>
      </>
    ),
  },
  {
    titulo: '🦅 O Imperio (27 a.C. – 476 d.C.)',
    texto: (
      <>
        <p>
          {b('Octavio (Augusto)')} convértese no primeiro emperador. Despois veñen as {b('dinastías')} (Xulio-Claudia, Flavios, Antoninos). O {b('emperador ten o poder absoluto')}.
        </p>
        <Lista
          items={[
            <>{b('Paz Romana')}: tempo de tranquilidade e progreso.</>,
            <>
              {b('Cristianismo')}: pasa de ser perseguido (Diocleciano) a {b('relixión oficial')}.
            </>,
            <>
              {b('Crise do século III')}: entradas de xermanos, golpes de estado… Os nobres marchan ao campo e os campesiños van con eles ás vilas: o {b('colonato')}.
            </>,
            <>
              Asalto permanente dos {b('bárbaros')}, {b('división do Imperio')} (395, á morte de Teodosio) e {b('caída da parte occidental no 476 d.C.')}
            </>,
          ]}
        />
      </>
    ),
  },
]

const CLASIFICA_ETAPAS = [
  { texto: 'Rómulo e Remo', caixa: 'm' },
  { texto: 'Sete reis', caixa: 'm' },
  { texto: 'Etruscos', caixa: 'm' },
  { texto: 'Tarquinio o Soberbio', caixa: 'm' },
  { texto: 'Cónsules', caixa: 'r' },
  { texto: 'Patricios contra plebeos', caixa: 'r' },
  { texto: 'Guerras Púnicas', caixa: 'r' },
  { texto: 'Xulio César', caixa: 'r' },
  { texto: 'Octavio Augusto', caixa: 'i' },
  { texto: 'Paz Romana', caixa: 'i' },
  { texto: 'Crise do século III', caixa: 'i' },
  { texto: 'Cristianismo oficial', caixa: 'i' },
]

const ETAPAS_XOGOS: Xogo[] = [
  {
    id: 'ordena',
    titulo: 'Pon en orde',
    icono: '⏳',
    explica: 'Toca os feitos do máis antigo ao máis recente.',
    crear: (acabar) => <Ordena frases={seriesOrde(FEITOS_ROMA, 4, 4)} acabar={acabar} />,
  },
  {
    id: 'clasifica',
    titulo: 'Cada cousa na súa etapa',
    icono: '🗂️',
    explica: 'Monarquía, República ou Imperio?',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'm', nome: '👑 Monarquía', cor: 'border-orange-300 bg-orange-100' },
          { id: 'r', nome: '🏛️ República', cor: 'border-yellow-300 bg-yellow-100' },
          { id: 'i', nome: '🦅 Imperio', cor: 'border-red-300 bg-red-100' },
        ]}
        elementos={barallar(CLASIFICA_ETAPAS).slice(0, 9)}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'vf',
    titulo: 'Verdadeiro ou falso?',
    icono: '✅',
    explica: 'Sobre as tres etapas.',
    crear: (acabar) => (
      <VerdadeiroFalso
        frases={[
          { texto: 'Rómulo matou ao seu irmán Remo.', certa: true, explica: 'É o comezo lendario de Roma.' },
          { texto: 'Na Monarquía houbo doce reis.', certa: false, explica: 'Houbo sete, de Rómulo a Tarquinio o Soberbio.' },
          { texto: 'A República comeza cando expulsan ao último rei.', certa: true, explica: 'No 509 a.C.' },
          { texto: 'As Guerras Púnicas foron contra Cartago.', certa: true, explica: 'Na República.' },
          { texto: 'Xulio César foi o primeiro emperador.', certa: false, explica: 'Foi ditador perpetuo. O primeiro emperador foi Octavio Augusto.' },
          { texto: 'No Imperio o emperador ten o poder absoluto.', certa: true, explica: 'Por iso é un imperio.' },
          { texto: 'O cristianismo foi sempre a relixión oficial de Roma.', certa: false, explica: 'Primeiro foi perseguido (Diocleciano) e despois fíxose oficial.' },
          { texto: 'No 476 d.C. cae o Imperio romano de Occidente.', certa: true, explica: 'É o final da Idade Antiga.' },
        ]}
        acabar={acabar}
      />
    ),
  },
]

const ETAPAS_PREG: Pregunta[] = [
  elixe('Quen fundou Roma, segundo a lenda?', 'Rómulo', ['Augusto', 'Xulio César', 'Tarquinio o Soberbio'], 'Rómulo, que matou ao seu irmán Remo.'),
  elixe('Cantos reis tivo Roma na Monarquía?', 'Sete', ['Tres', 'Doce', 'Un'], 'Sete, de Rómulo a Tarquinio o Soberbio.'),
  elixe('Que pobo influíu moito en Roma durante a Monarquía?', 'Os etruscos', ['Os cartaxineses', 'Os bárbaros', 'Os árabes'], 'Os etruscos.'),
  elixe('Quen gobernaba na República?', 'Cónsules, Senado e asembleas populares', ['Un rei', 'Un emperador', 'O Papa'], 'Na República non hai rei: cónsules, Senado e asembleas.'),
  elixe('Na República loitaban…', 'Patricios (ricos) e plebeos (pobo)', ['Cónsules e emperadores', 'Reis e etruscos', 'Cristiáns e musulmáns'], 'Patricios e plebeos.'),
  elixe('Contra quen foron as Guerras Púnicas?', 'Cartago', ['Grecia', 'Exipto', 'Os galaicos'], 'Contra Cartago.'),
  elixe('Quen se autonomeou «Dictator Perpetuus»?', 'Xulio César', ['Octavio Augusto', 'Rómulo', 'Teodosio'], 'Xulio César, na crise da República.'),
  elixe('Quen foi o primeiro emperador?', 'Octavio Augusto', ['Xulio César', 'Rómulo', 'Constantino'], 'Octavio, chamado Augusto, no 27 a.C.'),
  elixe('Que foi a Paz Romana?', 'Un tempo de tranquilidade e progreso no Imperio', ['Un tratado coa Cartago', 'A fin da Monarquía', 'Unha festa relixiosa'], 'Tranquilidade e progreso.'),
  elixe('Que lle pasou ao cristianismo no Imperio?', 'Pasou de ser perseguido a relixión oficial', ['Foi sempre prohibido', 'Foi sempre oficial', 'Desapareceu'], 'Perseguido (Diocleciano) e despois oficial.'),
  elixe('En que ano cae o Imperio romano de Occidente?', '476 d.C.', ['27 a.C.', '753 a.C.', '1453 d.C.'], 'No 476 d.C.'),
  elixe('En que ano comeza a Monarquía?', '753 a.C.', ['509 a.C.', '27 a.C.', '476 d.C.'], 'No 753 a.C., coa fundación de Roma.'),
  elixe('En que ano comeza a República?', '509 a.C.', ['753 a.C.', '27 a.C.', '476 d.C.'], 'No 509 a.C.'),
  elixe('Que significa SPQR?', 'O Senado e o pobo de Roma', ['Soldados para a guerra', 'Só para os ricos', 'Salve, poderoso rei'], '«Senatus Populusque Romanus».'),
  elixe('Quen formaron o primeiro triunvirato?', 'Xulio César, Pompeio e Craso', ['Marco Antonio, Lépido e Octavio', 'Rómulo, Remo e Numa', 'Augusto, Teodosio e Diocleciano'], 'César, Pompeio e Craso.'),
  ...FEITOS_ROMA.filter((x) => ['numancia', 'cesar', 'division', 'hispania'].includes(x.id)).map((x) => enQueEtapa(x)),
  ...queFoiAntes(FEITOS_ROMA, 4),
]

export const ETAPAS_VIDEOS: Video[] = [{ id: 'UF_yHrFP1Ls', titulo: 'El Imperio Romano en 10 minutos (o da clase)', canal: 'Academia Play', minutos: 11 }]

export function Etapas(p: PropsParada) {
  return <Parada {...p} id="etapas" titulo="As etapas de Roma" tarxetas={ETAPAS_TARXETAS} xogos={ETAPAS_XOGOS} preguntas={ETAPAS_PREG} videos={ETAPAS_VIDEOS} />
}

// ===================================================================================================
// 2. O goberno e a sociedade
// ===================================================================================================

const MAXISTRADOS = [
  { palabra: 'Cónsul', significado: 'Dirixía o exército e presidía os comicios (asembleas).' },
  { palabra: 'Pretor', significado: 'Administraba xustiza.' },
  { palabra: 'Censor', significado: 'Facía o censo dos cidadáns e vixiaba a moral pública.' },
  { palabra: 'Edil', significado: 'Vixiaba os mercados, as festas relixiosas e os templos.' },
  { palabra: 'Cuestor', significado: 'Levaba a Facenda Pública (os cartos).' },
  { palabra: 'Tribuno da plebe', significado: 'Defendía aos plebeos; tiña dereito de veto.' },
]

const GOBERNO_TARXETAS: Tarxeta[] = [
  {
    titulo: 'O goberno da República',
    texto: (
      <>
        <div className="grid gap-3 sm:grid-cols-3">
          <Caixa titulo="🏛️ Senado">A institución máis importante. Decidía sobre a paz e a guerra. Só para patricios.</Caixa>
          <Caixa titulo="🗳️ Comicios">As asembleas: elixían aos maxistrados e aprobaban as leis.</Caixa>
          <Caixa titulo="⚖️ Maxistrados">Os cargos de goberno, con funcións políticas, xudiciais e fiscais.</Caixa>
        </div>
        <p className="text-base">Os patricios tiñan acceso ao goberno; os plebeos estaban excluídos do Senado, pero tiñan aos tribunos da plebe para defendelos.</p>
      </>
    ),
  },
  {
    titulo: 'As maxistraturas',
    texto: (
      <>
        <div className="grid gap-2 sm:grid-cols-2">
          {MAXISTRADOS.map((m) => (
            <Caixa key={m.palabra} titulo={m.palabra}>
              {m.significado}
            </Caixa>
          ))}
        </div>
        <p className="text-base">
          Maiores: cónsul, pretor e censor. Menores: ediles e cuestores. E unha extraordinaria, a {b('ditadura')}, para momentos de perigo.
        </p>
        <Truco>Os cargos eran colexiados (de dous ou máis), elixidos (agás o ditador) e duraban un ano.</Truco>
      </>
    ),
  },
  {
    titulo: 'Para ser candidato',
    texto: (
      <>
        <p>Había unha idade mínima para cada cargo, e íanse subindo por orde:</p>
        <div className="flex flex-wrap gap-2">
          {CARGOS_IDADE.map((c) => (
            <span key={c.cargo} className="rounded-xl bg-violet-100 px-3 py-1.5 font-bold text-violet-900">
              {c.cargo}: {c.idade} anos
            </span>
          ))}
        </div>
        <p>
          O candidato presentábase cunha {b('toga branca')}, en latín {b('cándida')}: de aí vén a palabra {b('candidato')}. Facía mitins, repartía carteis e pedía o voto á súa clientela.
        </p>
      </>
    ),
  },
  {
    titulo: 'A sociedade romana',
    texto: (
      <>
        <Lista
          items={[
            <>{b('Cidadáns')}: arriba de todo. Podían votar e ter cargos.</>,
            <>{b('Homes libres non cidadáns')}: libres, pero sen dereitos políticos.</>,
            <>{b('Libertos')}: escravos aos que lles deron a liberdade.</>,
            <>{b('Escravos')}: na base, sen dereitos. Eran a base da economía.</>,
            <>{b('Mulleres libres')}: van aparte; non tiñan dereitos políticos.</>,
          ]}
        />
        <p className="text-base">E entre os cidadáns, os {b('patricios')} (ricos, familias antigas) e os {b('plebeos')} (o pobo).</p>
      </>
    ),
    visual: <PiramideRoma />,
  },
]

const GOBERNO_XOGOS: Xogo[] = [
  { id: 'une', titulo: 'Cada maxistrado, o seu traballo', icono: '⚖️', explica: 'Une cada cargo co que facía.', crear: (acabar) => <Une pares={MAXISTRADOS} acabar={acabar} /> },
  {
    id: 'busca',
    titulo: 'Busca na pirámide',
    icono: '🔺',
    explica: 'Toca cada grupo da sociedade romana.',
    crear: (acabar) => <Busca Debuxo={PiramideRoma} nomes={NOMES_SOCIEDADE} obxectivos={Object.keys(NOMES_SOCIEDADE)} acabar={acabar} />,
  },
  {
    id: 'cursus',
    titulo: 'Sube os cargos',
    icono: '🪜',
    explica: 'Do primeiro cargo (o de menos idade) ao último.',
    crear: (acabar) => <Ordena frases={[{ palabras: [...CARGOS_IDADE].sort((a, b) => a.idade - b.idade).map((c) => c.cargo), traducion: 'Da menor á maior idade' }]} acabar={acabar} />,
  },
]

const GOBERNO_PREG: Pregunta[] = [
  ...MAXISTRADOS.map((m) =>
    elixe(
      <>Quen {m.significado.charAt(0).toLowerCase() + m.significado.slice(1).replace(/\.$/, '')}?</>,
      m.palabra,
      MAXISTRADOS.filter((x) => x.palabra !== m.palabra).map((x) => x.palabra),
      `O ${m.palabra.toLowerCase()}.`,
    ),
  ).map((p) => (p.tipo === 'elixe' ? { ...p, outras: barallar(p.outras).slice(0, 3) } : p)),
  elixe('Cal era a institución máis importante da República?', 'O Senado', ['Os comicios', 'O censor', 'O rei'], 'O Senado, que decidía sobre a paz e a guerra.'),
  elixe('Que facían os comicios?', 'Elixían aos maxistrados e aprobaban as leis', ['Dirixían o exército', 'Vixiaban os mercados', 'Coroaban ao emperador'], 'Eran as asembleas.'),
  elixe('De onde vén a palabra «candidato»?', 'Da toga branca (cándida) dos que se presentaban', ['Dunha candea', 'Do nome dun cónsul', 'Do grego'], 'Da toga cándida, branca.'),
  elixe('Cal era o primeiro cargo, o de menos idade?', 'A cuestura', ['O consulado', 'A pretura', 'A edilidade'], 'A cuestura, aos 31 anos.'),
  elixe('Que era un liberto?', 'Un escravo ao que lle deron a liberdade', ['Un cidadán rico', 'Un soldado', 'Un sacerdote'], 'Un antigo escravo liberado.'),
  elixe('Quen estaba na base da sociedade romana?', 'Os escravos', ['Os libertos', 'Os plebeos', 'As mulleres libres'], 'Os escravos, sen dereitos.'),
  toca('Toca os cidadáns.', PiramideRoma, NOMES_SOCIEDADE, 'cidadans', 'Arriba de todo.'),
  toca('Toca os libertos.', PiramideRoma, NOMES_SOCIEDADE, 'libertos', 'Os escravos liberados, por riba dos escravos.'),
  toca('Toca as mulleres libres.', PiramideRoma, NOMES_SOCIEDADE, 'mulleres', 'Van aparte, á esquerda.'),
]

export function Goberno(p: PropsParada) {
  return <Parada {...p} id="goberno" titulo="O goberno e a sociedade" tarxetas={GOBERNO_TARXETAS} xogos={GOBERNO_XOGOS} preguntas={GOBERNO_PREG} />
}

// ===================================================================================================
// 3. A cidade romana e o legado
// ===================================================================================================

const EDIFICIOS = [
  { palabra: 'Foro', significado: 'O centro da cidade, con tendas e edificios públicos.', id: 'foro' },
  { palabra: 'Templo', significado: 'Gardaba a estatua do deus ao que estaba dedicado.', id: 'templo' },
  { palabra: 'Termas', significado: 'Baños públicos onde tamén se facía ximnasia.', id: 'termas' },
  { palabra: 'Teatro', significado: 'Representaban obras; o xénero preferido era a comedia.', id: 'teatro' },
  { palabra: 'Anfiteatro', significado: 'Xogos e loitas de gladiadores.', id: 'anfiteatro' },
  { palabra: 'Circo', significado: 'Carreiras de carros tirados por cabalos.', id: 'circo' },
  { palabra: 'Acueduto', significado: 'Levaba a auga á cidade.', id: 'acueduto' },
  { palabra: 'Muralla', significado: 'De pedra, protexía a cidade.', id: 'muralla' },
  { palabra: 'Arco de triunfo', significado: 'Conmemoraba as vitorias militares.', id: 'arco' },
]

const LEGADO = [
  { palabra: 'Latín', significado: 'A lingua dos romanos: dela veñen o galego, o castelán, o portugués, o francés…' },
  { palabra: 'Dereito romano', significado: 'A base das leis actuais: propiedade, contratos, cidadanía…' },
  { palabra: 'Maxistraturas', significado: 'Cargos como os cónsules, que inspiraron as democracias modernas.' },
  { palabra: 'Cultura', significado: 'Mitoloxía, literatura, teatro, filosofía… con influencia grega.' },
  { palabra: 'Enxeñaría', significado: 'Estradas, pontes, acuedutos, termas… e moitas aínda funcionan!' },
  { palabra: 'Gastronomía', significado: 'Aceite, viño, pan, queixos e salsas como o garum.' },
]

const CIDADE_TARXETAS: Tarxeta[] = [
  {
    titulo: 'Unha cidade romana',
    texto: <p>As cidades romanas tiñan sempre os mesmos edificios. Mira o debuxo: despois terás que atopalos ti.</p>,
    visual: <CidadeRomana />,
    ancho: true,
  },
  {
    titulo: 'Para que servía cada edificio',
    texto: (
      <div className="grid gap-2 sm:grid-cols-2">
        {EDIFICIOS.map((e) => (
          <Caixa key={e.id} titulo={e.palabra}>
            {e.significado}
          </Caixa>
        ))}
      </div>
    ),
  },
  {
    titulo: 'Rúas en cuadrícula, como un campamento',
    texto: (
      <>
        <p>
          Moitas cidades naceron dun {b('campamento militar')}: un rectángulo con muralla e foso e rúas rectas en {b('cuadrícula')}.
        </p>
        <Lista
          items={[
            <>
              O {b('cardo')}: a rúa principal de {b('norte a sur')}.
            </>,
            <>
              O {b('decumano')}: a rúa principal de {b('leste a oeste')}.
            </>,
            <>Onde se cruzan, o {b('foro')}, o centro da cidade.</>,
          ]}
        />
        <Truco>Lucus Augusti, o actual Lugo, tiña este plano; a súa muralla romana aínda está enteira.</Truco>
      </>
    ),
  },
  {
    titulo: 'O legado de Roma',
    texto: (
      <>
        <p>Roma deixou unha pegada enorme que aínda sentimos hoxe:</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {LEGADO.map((l) => (
            <Caixa key={l.palabra} titulo={l.palabra}>
              {l.significado}
            </Caixa>
          ))}
        </div>
      </>
    ),
  },
]

const CIDADE_XOGOS: Xogo[] = [
  {
    id: 'busca',
    titulo: 'Busca na cidade',
    icono: '🏛️',
    explica: 'Toca cada edificio que che pida.',
    crear: (acabar) => <Busca Debuxo={CidadeRomana} nomes={NOMES_CIDADE} obxectivos={Object.keys(NOMES_CIDADE)} acabar={acabar} />,
  },
  { id: 'une', titulo: 'Para que servía?', icono: '🔗', explica: 'Une cada edificio coa súa función.', crear: (acabar) => <Une pares={barallar(EDIFICIOS).slice(0, 6)} acabar={acabar} /> },
  { id: 'legado', titulo: 'O legado', icono: '🎁', explica: 'Une cada legado co que significa.', crear: (acabar) => <Une pares={LEGADO} acabar={acabar} /> },
]

const CIDADE_PREG: Pregunta[] = [
  ...EDIFICIOS.map((e) => toca(<>Toca {NOMES_CIDADE[e.id]}.</>, CidadeRomana, NOMES_CIDADE, e.id, e.significado)),
  ...EDIFICIOS.map((e) =>
    elixe(
      <>Que edificio é? «{e.significado}»</>,
      e.palabra,
      barallar(EDIFICIOS.filter((x) => x.id !== e.id).map((x) => x.palabra)).slice(0, 3),
      `${e.palabra}: ${e.significado}`,
    ),
  ).slice(0, 6),
  elixe('Como se chama a rúa principal de norte a sur?', 'O cardo', ['O decumano', 'O foro', 'A vía praetoria'], 'O cardo vai de norte a sur; o decumano, de leste a oeste.'),
  elixe('Como se chama a rúa principal de leste a oeste?', 'O decumano', ['O cardo', 'O foro', 'O circo'], 'O decumano.'),
  elixe('Que hai onde se cruzan o cardo e o decumano?', 'O foro', ['O anfiteatro', 'As termas', 'O circo'], 'O foro, o centro da cidade.'),
  elixe('Do latín veñen…', 'O galego, o castelán, o portugués e o francés', ['O inglés e o alemán', 'O árabe e o grego', 'O éuscaro'], 'As linguas romances veñen do latín.'),
  elixe('Que é o garum?', 'Unha salsa romana', ['Un edificio', 'Un cargo político', 'Unha moeda'], 'Unha salsa: parte do legado gastronómico.'),
  elixe('Que parte do legado son as estradas, pontes e acuedutos?', 'A enxeñaría', ['O dereito', 'A cultura', 'As maxistraturas'], 'A enxeñaría.'),
  elixe('As leis actuais sobre propiedade e contratos baséanse…', 'No dereito romano', ['No latín', 'Na mitoloxía', 'No garum'], 'No dereito romano.'),
]

export function Cidade(p: PropsParada) {
  return <Parada {...p} id="cidade" titulo="A cidade romana e o legado" tarxetas={CIDADE_TARXETAS} xogos={CIDADE_XOGOS} preguntas={CIDADE_PREG} />
}

// ===================================================================================================
// 4. A romanización de Hispania e Galicia
// ===================================================================================================

const FASES = [
  { palabra: '1.ª fase (218 – 197 a.C.)', significado: 'Vencen aos cartaxineses e ocupan a costa mediterránea.' },
  { palabra: '2.ª fase (197 – 29 a.C.)', significado: 'Centro e oeste: vencen a lusitanos e celtíberos (Numancia).' },
  { palabra: '3.ª fase (29 – 19 a.C.)', significado: 'O norte: vencen a cántabros e ástures.' },
]

const CIDADES_LATIN = [
  { palabra: 'Lucus Augusti', significado: 'Lugo' },
  { palabra: 'Bracara Augusta', significado: 'Braga' },
  { palabra: 'Asturica Augusta', significado: 'Astorga' },
  { palabra: 'Emerita Augusta', significado: 'Mérida' },
  { palabra: 'Tarraco', significado: 'Tarragona' },
  { palabra: 'Corduba', significado: 'Córdoba' },
  { palabra: 'Caesaraugusta', significado: 'Zaragoza' },
  { palabra: 'Gades', significado: 'Cádiz' },
]

const PROVINCIAS = [
  { texto: 'Hispania Citerior', caixa: 'r' },
  { texto: 'Hispania Ulterior', caixa: 'r' },
  { texto: 'Tarraconense', caixa: 'a' },
  { texto: 'Lusitania', caixa: 'a' },
  { texto: 'Bética', caixa: 'a' },
  { texto: 'Gallaecia', caixa: 's' },
  { texto: 'Cartaxinense', caixa: 's' },
]

const ROMANIZACION_TARXETAS: Tarxeta[] = [
  {
    titulo: 'Que é a romanización?',
    texto: (
      <>
        <p>
          É o proceso polo que os pobos conquistados por Roma adoptan a súa {b('cultura, lingua, leis e costumes')}. Non foi de golpe, senón {b('pouco a pouco')}.
        </p>
        <Truco>Romanizar = facerse «romano» sen deixar de vivir na túa terra.</Truco>
      </>
    ),
  },
  {
    titulo: 'A conquista de Hispania, en tres fases',
    texto: (
      <>
        <p>
          Comezou no {b('século III a.C.')}, coas {b('Guerras Púnicas')}: os romanos entraron polo leste e avanzaron de sur a norte.
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          {FASES.map((f) => (
            <Caixa key={f.palabra} titulo={f.palabra}>
              {f.significado}
            </Caixa>
          ))}
        </div>
        <p className="text-base">Numancia resistiu ata o 133 a.C. Os seus veciños preferiron morrer antes que renderse.</p>
      </>
    ),
  },
  {
    titulo: 'Que trouxeron a Hispania',
    texto: (
      <Lista
        items={[
          <>Construíron {b('cidades, estradas, minas e acuedutos')}.</>,
          <>
            Introduciron o {b('latín')}, que deu lugar ás {b('linguas romances')}.
          </>,
          <>
            Moitos hispanos chegaron a ser cidadáns romanos e mesmo {b('emperadores')}, como {b('TRAXANO')}.
          </>,
        ]}
      />
    ),
  },
  {
    titulo: 'As provincias de Hispania',
    texto: (
      <div className="grid gap-2 sm:grid-cols-3">
        <Caixa titulo="Na República">Hispania Citerior e Hispania Ulterior.</Caixa>
        <Caixa titulo="Con Augusto">Tarraconense, Lusitania e Bética.</Caixa>
        <Caixa titulo="Séculos III–IV d.C.">Engádense Gallaecia (capital: Bracara Augusta) e Cartaxinense.</Caixa>
      </div>
    ),
  },
  {
    titulo: 'E en Galicia?',
    texto: (
      <Lista
        items={[
          <>
            Os {b('galaicos')} eran tribos castrexas que vivían en {b('castros')}.
          </>,
          <>
            Roma conquistou a zona no {b('século I a.C.')}, con moita {b('resistencia')}.
          </>,
          <>
            Fundáronse cidades como {b('Lucus Augusti')} (Lugo) e {b('Bracara Augusta')} (Braga).
          </>,
          <>A cultura castrexa mesturouse coa romana: templos, moedas, estradas, baños públicos…</>,
          <>
            A romanización foi {b('máis lenta')}, pero deixou unha fonda pegada.
          </>,
        ]}
      />
    ),
  },
  {
    titulo: 'Gallaecia: o que aínda vemos',
    texto: (
      <>
        <p>
          Gallaecia dividíase en tres {b('conventos')}: Lucense (Lucus), Bracarense (Bracara) e Asturicense (Asturica). Unían as cidades as {b('vías romanas')}.
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          <Caixa titulo="🧱 Muralla de Lugo">Romana e enteira: pódese pasear por enriba.</Caixa>
          <Caixa titulo="🗼 Torre de Hércules">O faro romano da Coruña, que aínda funciona.</Caixa>
          <Caixa titulo="⛰️ As Médulas">Montañas furadas polos romanos para sacar ouro.</Caixa>
        </div>
      </>
    ),
  },
]

const ROMANIZACION_XOGOS: Xogo[] = [
  { id: 'fases', titulo: 'As tres fases', icono: '🗺️', explica: 'Une cada fase co que conquistaron.', crear: (acabar) => <Une pares={FASES} acabar={acabar} /> },
  { id: 'cidades', titulo: 'Como se chama hoxe?', icono: '🏙️', explica: 'Une o nome latino coa cidade de hoxe.', crear: (acabar) => <Une pares={barallar(CIDADES_LATIN).slice(0, 6)} acabar={acabar} /> },
  {
    id: 'provincias',
    titulo: 'As provincias',
    icono: '🗂️',
    explica: 'En que época apareceu cada provincia?',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'r', nome: 'República', cor: 'border-yellow-300 bg-yellow-100' },
          { id: 'a', nome: 'Augusto', cor: 'border-red-300 bg-red-100' },
          { id: 's', nome: 'Séculos III–IV', cor: 'border-slate-300 bg-slate-100' },
        ]}
        elementos={PROVINCIAS}
        acabar={acabar}
      />
    ),
  },
]

const ROMANIZACION_PREG: Pregunta[] = [
  elixe('Que é a romanización?', 'Que os pobos conquistados adoptan a cultura, lingua, leis e costumes de Roma', ['Que Roma destrúe as cidades conquistadas', 'Que os romanos aprenden a lingua dos galaicos', 'Que Roma se fai cristiá'], 'E foi pouco a pouco.'),
  elixe('Cando comezou a romanización de Hispania?', 'No século III a.C., coas Guerras Púnicas', ['No século I d.C.', 'No 476 d.C.', 'No 753 a.C.'], 'No século III a.C.'),
  elixe('Por onde entraron os romanos en Hispania?', 'Polo leste, e avanzaron de sur a norte', ['Polo norte, dende a Galia', 'Por Galicia', 'Polo oeste'], 'Polo leste (costa mediterránea).'),
  elixe('A quen venceron na 1.ª fase?', 'Aos cartaxineses', ['Aos cántabros e ástures', 'Aos galaicos', 'Aos visigodos'], 'Aos cartaxineses, na costa mediterránea.'),
  elixe('Que zona conquistaron ao final (3.ª fase)?', 'O norte: cántabros e ástures', ['A costa mediterránea', 'O sur', 'As illas Baleares'], 'O norte, entre o 29 e o 19 a.C.'),
  elixe('Que cidade resistiu ata o 133 a.C.?', 'Numancia', ['Tarraco', 'Lucus Augusti', 'Gades'], 'Numancia, dos celtíberos.'),
  elixe('Que emperador romano naceu en Hispania?', 'Traxano', ['Augusto', 'Xulio César', 'Diocleciano'], 'Traxano.'),
  elixe('De que lingua veñen as linguas romances?', 'Do latín', ['Do grego', 'Do árabe', 'Do celta'], 'Do latín.'),
  elixe('Como se chamaban os pobos de Galicia antes de Roma?', 'Galaicos', ['Lusitanos', 'Celtíberos', 'Cántabros'], 'Os galaicos, que vivían en castros.'),
  elixe('Onde vivían os galaicos?', 'En castros', ['En cidades con foro', 'En mosteiros', 'En vilas romanas'], 'En castros.'),
  elixe('Cando conquistou Roma Galicia?', 'No século I a.C.', ['No século III a.C.', 'No século V d.C.', 'No 753 a.C.'], 'No século I a.C., con moita resistencia.'),
  elixe('Como foi a romanización en Galicia?', 'Máis lenta, pero deixou unha fonda pegada', ['Moi rápida e sen resistencia', 'Non houbo romanización', 'Só na costa'], 'Máis lenta, pero fonda.'),
  elixe('Cal é o nome romano de Lugo?', 'Lucus Augusti', ['Bracara Augusta', 'Asturica Augusta', 'Emerita Augusta'], 'Lucus Augusti.'),
  elixe('Cal era a capital da provincia de Gallaecia?', 'Bracara Augusta (Braga)', ['Lucus Augusti (Lugo)', 'Tarraco (Tarragona)', 'Corduba (Córdoba)'], 'Bracara Augusta.'),
  elixe('Que provincias creou Augusto?', 'Tarraconense, Lusitania e Bética', ['Citerior e Ulterior', 'Gallaecia e Cartaxinense', 'Galia e Britannia'], 'Tarraconense, Lusitania e Bética.'),
  elixe('Que son As Médulas?', 'Antigas minas de ouro romanas', ['Un faro romano', 'Unha muralla', 'Un castro galaico'], 'Montañas furadas para sacar ouro.'),
  elixe('Que é a Torre de Hércules?', 'Un faro romano da Coruña', ['Un templo de Lugo', 'Un anfiteatro', 'Un castro'], 'O faro romano que aínda funciona.'),
]

export const ROMANIZACION_VIDEOS: Video[] = [{ id: '3ttxspGLL_g', titulo: 'La conquista romana en Hispania', canal: 'Clases Particulares en Ávila', minutos: 4 }]

export function Romanizacion(p: PropsParada) {
  return <Parada {...p} id="romanizacion" titulo="A romanización de Hispania e Galicia" tarxetas={ROMANIZACION_TARXETAS} xogos={ROMANIZACION_XOGOS} preguntas={ROMANIZACION_PREG} videos={ROMANIZACION_VIDEOS} />
}

export const PREGUNTAS_ROMA: Record<string, Pregunta[]> = { etapas: ETAPAS_PREG, goberno: GOBERNO_PREG, cidade: CIDADE_PREG, romanizacion: ROMANIZACION_PREG }
