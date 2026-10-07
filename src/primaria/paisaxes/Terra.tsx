// Parada 1 de «Descubrimos as paisaxes»: como é a Terra e que é a paisaxe (páxinas 14 e 15 do libro).
import { useState } from 'react'
import { Busca, Clasifica, ParadaPrimaria, Proba, Tarxetas, Une, type Debuxo, type Pregunta, type Tarxeta, type Xogo, Xogos } from '../pezas'
import { elixe, toca } from './preguntas'
import { CONTINENTES, COR_TIPO, Globo, Mapamundi, NOMES_MAPA, NOMES_PAISAXE, OCEANOS, Paisaxe } from './debuxos'

const Mapa: Debuxo = (p) => <Mapamundi {...p} />
const PaisaxeXogo: Debuxo = (p) => <Paisaxe {...p} />

/** O globo, con botóns para ver cada cor por separado. */
function GloboCores() {
  const [marcar, setMarcar] = useState<'auga' | 'rochas' | 'vexetacion' | undefined>()
  const boton = (que: typeof marcar, texto: string, cor: string) => (
    <button
      onClick={() => setMarcar(marcar === que ? undefined : que)}
      className={`min-h-11 cursor-pointer rounded-full border-2 px-4 font-bold text-white ${cor} ${marcar === que ? 'ring-4 ring-violet-300' : ''}`}
    >
      {texto}
    </button>
  )
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl bg-slate-900 p-4">
      <Globo marcar={marcar} />
      <div className="flex flex-wrap justify-center gap-2">
        {boton('auga', 'Azul', 'border-blue-400 bg-blue-600')}
        {boton('rochas', 'Marrón', 'border-amber-500 bg-amber-700')}
        {boton('vexetacion', 'Verde', 'border-green-400 bg-green-600')}
      </div>
    </div>
  )
}

const b = (t: string) => <b className="text-violet-800">{t}</b>

const TARXETAS: Tarxeta[] = [
  {
    titulo: 'A Terra vista dende o espazo',
    texto: (
      <>
        <p>Na superficie da Terra destacan tres cores:</p>
        <ul className="space-y-2">
          <li>
            🔵 O <b className="text-blue-700">azul</b> é a {b('auga')} dos océanos e dos mares. É a cor que máis se ve.
          </li>
          <li>
            🟤 O <b className="text-amber-800">marrón</b> son as {b('rochas')} dos continentes e das illas.
          </li>
          <li>
            🟢 O <b className="text-green-700">verde</b> é a {b('vexetación')}.
          </li>
        </ul>
        <p className="text-base text-slate-500">Toca as cores para velas por separado.</p>
      </>
    ),
    visual: <GloboCores />,
  },
  {
    titulo: 'O mapamundi',
    texto: (
      <>
        <p>Nun {b('mapamundi')} podemos ver todos os océanos e todos os continentes á vez.</p>
        <p>É coma se abrísemos a Terra e a estirásemos nun papel.</p>
      </>
    ),
    visual: <Mapamundi />,
    ancho: true,
  },
  {
    titulo: 'Os océanos',
    texto: (
      <>
        <p>
          Os {b('océanos')} son grandes superficies de {b('auga salgada')}.
        </p>
        <p>Hai {b('cinco')}:</p>
        <ol className="flex flex-wrap gap-2 font-semibold">
          <li className="rounded-full bg-violet-100 px-3 py-1">Pacífico</li>
          <li className="rounded-full bg-violet-100 px-3 py-1">Atlántico</li>
          <li className="rounded-full bg-violet-100 px-3 py-1">Índico</li>
          <li className="rounded-full bg-violet-100 px-3 py-1">Glacial Ártico</li>
          <li className="rounded-full bg-violet-100 px-3 py-1">Glacial Antártico</li>
        </ol>
        <p className="text-base text-slate-600">
          💡 <i>Glacial</i> quere dicir xeado: o Ártico está no norte e o Antártico no sur. O Pacífico é tan grande que sae aos dous lados do mapa.
        </p>
      </>
    ),
    visual: <Mapamundi ver="oceanos" />,
    ancho: true,
  },
  {
    titulo: 'Os continentes',
    texto: (
      <>
        <p>
          Os {b('continentes')} son amplas extensións de {b('terra')}.
        </p>
        <p>Hai {b('seis')}:</p>
        <ol className="flex flex-wrap gap-2 font-semibold">
          <li className="rounded-full bg-violet-100 px-3 py-1">Asia</li>
          <li className="rounded-full bg-violet-100 px-3 py-1">América</li>
          <li className="rounded-full bg-violet-100 px-3 py-1">África</li>
          <li className="rounded-full bg-violet-100 px-3 py-1">Oceanía</li>
          <li className="rounded-full bg-violet-100 px-3 py-1">Antártida</li>
          <li className="rounded-full bg-violet-100 px-3 py-1">Europa, onde vivimos</li>
        </ol>
        <p className="text-base text-slate-600">💡 Cinco océanos e seis continentes: os continentes gañan por un.</p>
      </>
    ),
    visual: <Mapamundi ver="continentes" />,
    ancho: true,
  },
  {
    titulo: 'Que é a paisaxe?',
    texto: (
      <>
        <p>
          A {b('paisaxe')} é o aspecto que ten unha ampla extensión de terreo.
        </p>
        <p>
          Nas paisaxes hai {b('elementos naturais')}:
        </p>
        <ul className="space-y-2 text-lg">
          <li>
            <span className="rounded-full px-2 py-0.5 font-bold" style={{ background: COR_TIPO.relevo }}>
              Relevo
            </span>{' '}
            as formas do terreo, como as montañas ou as chairas.
          </li>
          <li>
            <span className="rounded-full px-2 py-0.5 font-bold" style={{ background: COR_TIPO.vexetacion }}>
              Vexetación
            </span>{' '}
            as plantas naturais que crecen no terreo.
          </li>
          <li>
            <span className="rounded-full px-2 py-0.5 font-bold" style={{ background: COR_TIPO.augas }}>
              Augas
            </span>{' '}
            os océanos e mares, os ríos, os regatos, a neve, os lagos...
          </li>
        </ul>
      </>
    ),
    visual: <Paisaxe etiquetas tipos={['relevo', 'vexetacion', 'augas']} />,
  },
  {
    titulo: 'O que constrúen as persoas',
    texto: (
      <>
        <p>
          As paisaxes tamén poden ter{' '}
          <span className="rounded-full px-2 py-0.5 font-bold" style={{ background: COR_TIPO.persoas }}>
            elementos construídos polas persoas
          </span>
          , como pontes, hortas, cidades ou estradas.
        </p>
        <p className="text-base text-slate-600">💡 Pregúntate: isto fíxoo a natureza ou fixérono as persoas?</p>
      </>
    ),
    visual: <Paisaxe etiquetas tipos={['persoas']} />,
  },
  {
    titulo: 'As paisaxes protexidas',
    texto: (
      <>
        <p>
          Hai paisaxes con elementos naturais tan valiosos que os declaramos {b('parques nacionais')} ou {b('parques naturais')}. Así protexémolos.
        </p>
        <p>
          En Galicia temos, por exemplo, o {b('Parque Natural Baixa Limia – Serra do Xurés')}, en Ourense.
        </p>
      </>
    ),
    visual: <Paisaxe parque />,
  },
]

const NOME_CURTO: Record<string, string> = {
  pacifico: 'Pacífico',
  atlantico: 'Atlántico',
  indico: 'Índico',
  artico: 'Glacial Ártico',
  antartico: 'Glacial Antártico',
  asia: 'Asia',
  america: 'América',
  africa: 'África',
  oceania: 'Oceanía',
  antartida: 'Antártida',
  europa: 'Europa',
}

const XOGOS: Xogo[] = [
  {
    id: 'oceanos',
    titulo: 'Busca os océanos',
    icono: '🌊',
    explica: 'Toca no mapa cada océano que che pida.',
    crear: (acabar) => <Busca Debuxo={Mapa} nomes={NOMES_MAPA} obxectivos={[...OCEANOS]} acabar={acabar} />,
  },
  {
    id: 'continentes',
    titulo: 'Busca os continentes',
    icono: '🌍',
    explica: 'Toca no mapa cada continente que che pida.',
    crear: (acabar) => <Busca Debuxo={Mapa} nomes={NOMES_MAPA} obxectivos={[...CONTINENTES]} acabar={acabar} />,
  },
  {
    id: 'taboa',
    titulo: 'Océano ou continente?',
    icono: '🗂️',
    explica: 'Coloca cada nome na súa columna, como na táboa do libro.',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'oceano', nome: 'Océanos', cor: 'border-sky-300 bg-sky-100' },
          { id: 'continente', nome: 'Continentes', cor: 'border-orange-300 bg-orange-100' },
        ]}
        elementos={[
          ...OCEANOS.map((o) => ({
            texto: NOME_CURTO[o],
            caixa: 'oceano',
            pista: o === 'antartico' ? 'O Glacial Antártico é auga: o océano xeado que rodea a Antártida.' : `${NOME_CURTO[o]} é auga salgada, non terra.`,
          })),
          ...CONTINENTES.map((c) => ({
            texto: NOME_CURTO[c],
            caixa: 'continente',
            pista:
              c === 'oceania'
                ? 'Oceanía soa a océano, pero é terra: Australia e moitas illas. É un continente.'
                : c === 'antartida'
                  ? 'A Antártida é terra cuberta de xeo: é un continente.'
                  : `${NOME_CURTO[c]} é terra, non auga.`,
          })),
        ]}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'elementos',
    titulo: 'Os elementos da paisaxe',
    icono: '🏞️',
    explica: 'Relevo, vexetación, augas ou cousas feitas polas persoas?',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'relevo', nome: 'Relevo', cor: 'border-orange-300 bg-orange-100' },
          { id: 'vexetacion', nome: 'Vexetación', cor: 'border-green-300 bg-green-100' },
          { id: 'augas', nome: 'Augas', cor: 'border-sky-300 bg-sky-100' },
          { id: 'persoas', nome: 'Construído polas persoas', cor: 'border-violet-300 bg-violet-100' },
        ]}
        elementos={[
          { texto: 'montaña', caixa: 'relevo' },
          { texto: 'chaira', caixa: 'relevo', pista: 'Unha chaira é unha forma do terreo: terreo chan. É relevo.' },
          { texto: 'árbores', caixa: 'vexetacion' },
          { texto: 'flores', caixa: 'vexetacion' },
          { texto: 'herba', caixa: 'vexetacion' },
          { texto: 'río', caixa: 'augas' },
          { texto: 'lago', caixa: 'augas' },
          { texto: 'neve', caixa: 'augas', pista: 'A neve é auga xeada. Vai en Augas.' },
          { texto: 'regato', caixa: 'augas', pista: 'Un regato é un río pequeniño. Vai en Augas.' },
          { texto: 'mar', caixa: 'augas' },
          { texto: 'ponte', caixa: 'persoas' },
          { texto: 'horta', caixa: 'persoas', pista: 'As plantas da horta sementounas unha persoa: a horta é construída polas persoas.' },
          { texto: 'cidade', caixa: 'persoas' },
          { texto: 'estrada', caixa: 'persoas' },
        ]}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'busca-paisaxe',
    titulo: 'Busca na paisaxe',
    icono: '🔎',
    explica: 'Toca na paisaxe o que che pida.',
    crear: (acabar) => <Busca Debuxo={PaisaxeXogo} nomes={NOMES_PAISAXE} obxectivos={Object.keys(NOMES_PAISAXE)} acabar={acabar} />,
  },
  {
    id: 'une',
    titulo: 'Que significa?',
    icono: '🔗',
    explica: 'Une cada palabra co seu significado.',
    crear: (acabar) => (
      <Une
        pares={[
          { palabra: 'paisaxe', significado: 'O aspecto que ten unha ampla extensión de terreo.' },
          { palabra: 'relevo', significado: 'As formas do terreo, como as montañas ou as chairas.' },
          { palabra: 'vexetación', significado: 'As plantas naturais que crecen no terreo.' },
          { palabra: 'océano', significado: 'Unha gran superficie de auga salgada.' },
          { palabra: 'continente', significado: 'Unha ampla extensión de terra.' },
          { palabra: 'mapamundi', significado: 'Un mapa onde se ven todos os océanos e continentes á vez.' },
        ]}
        acabar={acabar}
      />
    ),
  },
]

const tocaMapa = (texto: string, correcta: string, explica: string) => toca(texto, Mapa, NOMES_MAPA, correcta, explica)

const PREGUNTAS: Pregunta[] = [
  elixe('De que cor se ve dende o espazo a auga dos océanos e dos mares?', 'Azul', ['Verde', 'Marrón'], 'O azul é a auga; o marrón, as rochas; e o verde, a vexetación.', <Globo />),
  elixe('Que é o verde que se ve na Terra dende o espazo?', 'A vexetación', ['A auga', 'As rochas'], 'O verde é a vexetación: bosques, prados, selvas...'),
  elixe('Que é o marrón que se ve na Terra dende o espazo?', 'As rochas dos continentes e das illas', ['A auga dos ríos', 'A vexetación'], 'O marrón son as rochas dos continentes e das illas.'),
  elixe('Cantos océanos hai?', 'Cinco', ['Seis', 'Catro'], 'Hai cinco: Pacífico, Atlántico, Índico, Glacial Ártico e Glacial Antártico.'),
  elixe('Cantos continentes hai?', 'Seis', ['Cinco', 'Sete'], 'Hai seis: Asia, América, África, Oceanía, Antártida e Europa.'),
  elixe('En que continente vivimos?', 'Europa', ['América', 'Asia'], 'Vivimos en Europa.'),
  elixe('Cal destes é un océano?', 'Índico', ['Oceanía', 'Antártida'], 'Oceanía e a Antártida son continentes, aínda que os seus nomes se parezan aos dos océanos.'),
  elixe('Cal destes é un continente?', 'África', ['Atlántico', 'Pacífico'], 'África é un continente; o Atlántico e o Pacífico son océanos.'),
  elixe('Que é un océano?', 'Unha gran superficie de auga salgada', ['Unha ampla extensión de terra', 'Un río moi longo'], 'Os océanos son grandes superficies de auga salgada.'),
  elixe('Que é un continente?', 'Unha ampla extensión de terra', ['Unha gran superficie de auga salgada', 'Unha illa pequena'], 'Os continentes son amplas extensións de terra.'),
  elixe('Que é a paisaxe?', 'O aspecto que ten unha ampla extensión de terreo', ['Só as montañas dun lugar', 'Un mapa de todo o mundo'], 'A paisaxe é o aspecto que ten unha ampla extensión de terreo.'),
  elixe('Cal destes é un elemento natural da paisaxe?', 'O río', ['A ponte', 'A estrada'], 'O río fíxoo a natureza; a ponte e a estrada construíronas as persoas.'),
  elixe('Cal destes foi construído polas persoas?', 'A horta', ['O lago', 'A montaña'], 'A horta fixérona as persoas; o lago e a montaña son naturais.'),
  elixe('Que é o relevo?', 'As formas do terreo, como montañas e chairas', ['As plantas que crecen no terreo', 'Os ríos e os lagos'], 'O relevo son as formas do terreo. As plantas son a vexetación, e os ríos e lagos, as augas.'),
  elixe('Por que hai paisaxes protexidas?', 'Porque teñen elementos naturais moi valiosos', ['Porque nelas non vive ninguén', 'Porque son as máis grandes'], 'Protexémolas porque os seus elementos naturais son moi valiosos.'),
  elixe('Como se chaman as paisaxes protexidas?', 'Parques nacionais ou parques naturais', ['Cidades', 'Mapamundis'], 'Chámanse parques nacionais ou parques naturais.'),
  elixe('Onde está o Parque Natural Baixa Limia – Serra do Xurés?', 'En Ourense', ['En Lugo', 'Na Coruña'], 'Está en Ourense.'),
  elixe('Que podemos ver nun mapamundi?', 'Todos os océanos e continentes á vez', ['Só Europa', 'Só os océanos'], 'Nun mapamundi vemos todos os océanos e continentes á vez.'),
  tocaMapa('Toca o océano Atlántico.', 'atlantico', 'O Atlántico está entre América, por un lado, e Europa e África, polo outro.'),
  tocaMapa('Toca o océano Índico.', 'indico', 'O Índico está entre África, Asia e Oceanía.'),
  tocaMapa('Toca o continente onde vivimos.', 'europa', 'Vivimos en Europa.'),
  tocaMapa('Toca Oceanía.', 'oceania', 'Oceanía está abaixo á dereita, onde está Australia.'),
  tocaMapa('Toca a Antártida.', 'antartida', 'A Antártida é o continente xeado do sur.'),
  tocaMapa('Toca o océano Pacífico.', 'pacifico', 'O Pacífico é o máis grande: está entre América e Asia e Oceanía, e sae aos dous lados do mapa.'),
]

export default function Terra({ ruta, modo }: { ruta: string; modo?: string }) {
  return (
    <ParadaPrimaria
      ruta={ruta}
      titulo="Como é a Terra?"
      modo={modo}
      paneis={{
        descubre: <Tarxetas tarxetas={TARXETAS} xoga={`${ruta}/xoga`} />,
        xoga: <Xogos xogos={XOGOS} proba={`${ruta}/proba`} />,
        proba: <Proba id="paisaxes/terra" preguntas={PREGUNTAS} />,
      }}
    />
  )
}
