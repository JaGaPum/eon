// Parada 2 de «Descubrimos as paisaxes»: as paisaxes de montaña (páxinas 16 e 17 do libro).
import { Busca, Clasifica, ParadaPrimaria, Proba, Tarxetas, Une, VerdadeiroFalso, type Debuxo, type Pregunta, type Tarxeta, type Xogo, Xogos } from '../pezas'
import { NOMES_MONTANA, NOMES_PARTES, PaisaxeMontana, PartesMontana, SerraCordilleira } from './escenas'
import { elixe, toca } from './preguntas'

const Partes: Debuxo = (p) => <PartesMontana {...p} />
const Paisaxe: Debuxo = (p) => <PaisaxeMontana {...p} />

const b = (t: string) => <b className="text-violet-800">{t}</b>

const TARXETAS: Tarxeta[] = [
  {
    titulo: 'Como son as paisaxes de montaña?',
    texto: (
      <>
        <p>
          O terreo das {b('paisaxes de montaña')} é {b('elevado')} e adoita ter moita vexetación.
        </p>
        <p>
          Hai moitas {b('montañas')}, que forman {b('serras')}, e {b('vales')} que se abren entre elas.
        </p>
      </>
    ),
    visual: <PaisaxeMontana etiquetas so={['serra', 'montana', 'val']} />,
  },
  {
    titulo: 'Montañas, serras e cordilleiras',
    texto: (
      <>
        <p>
          As {b('montañas')} son terreos elevados e en costa.
        </p>
        <p>
          Varias montañas xuntas forman unha {b('serra')}.
        </p>
        <p>
          Varias serras unidas forman unha {b('cordilleira')}.
        </p>
      </>
    ),
    visual: <SerraCordilleira />,
  },
  {
    titulo: 'Os vales',
    texto: (
      <>
        <p>
          Os {b('vales')} son terreos {b('chans e afundidos')} situados entre montañas.
        </p>
        <p>
          Case sempre os percorre un {b('río')}.
        </p>
      </>
    ),
    visual: <PaisaxeMontana etiquetas so={['val', 'rio', 'montana', 'serra']} />,
  },
  {
    titulo: 'As partes dunha montaña',
    texto: (
      <>
        <p>
          A {b('cima')} é a parte máis alta.
        </p>
        <p>
          A {b('ladeira')} é a parte inclinada, entre a cima e o pé.
        </p>
        <p>
          O {b('pé')} é a parte máis baixa da montaña.
        </p>
        <p className="text-base text-slate-600">💡 Coma unha persoa: a cabeza arriba e os pés abaixo.</p>
      </>
    ),
    visual: <PartesMontana />,
  },
  {
    titulo: 'Como é a vida na montaña?',
    texto: (
      <>
        <p>
          Na montaña vai {b('frío')} e hai {b('neve')} no inverno.
        </p>
        <p>
          As {b('aldeas')} son pequenas e comunícanse por {b('estradas estreitas e con curvas')}.
        </p>
        <p>
          Ás veces cómpre construír {b('túneles')} para atravesar as montañas.
        </p>
      </>
    ),
    visual: <PaisaxeMontana etiquetas so={['aldea', 'estrada', 'tunel', 'encoro', 'canteira']} />,
  },
  {
    titulo: 'O turismo na montaña',
    texto: (
      <>
        <p>
          Moitas persoas van á montaña para {b('gozar da natureza')} ou para {b('practicar deportes')}, como o esquí ou o sendeirismo.
        </p>
        <p>
          Por iso, o {b('turismo')} é unha actividade importante: hai pistas de esquí, cámpings...
        </p>
      </>
    ),
    visual: <PaisaxeMontana etiquetas so={['pista', 'camping']} />,
  },
  {
    titulo: 'Pensa: onde están as aldeas?',
    texto: (
      <>
        <p>
          As aldeas adoitan estar no {b('val')}, non nas cimas.
        </p>
        <p>No val o terreo é chan, hai auga do río, terra para cultivar e fai menos frío.</p>
        <p>Nas cimas fai moito frío e vento, e é difícil construír e chegar.</p>
      </>
    ),
    visual: <PaisaxeMontana etiquetas so={['aldea', 'val', 'rio']} />,
  },
]

const XOGOS: Xogo[] = [
  {
    id: 'partes',
    titulo: 'As partes da montaña',
    icono: '⛰️',
    explica: 'Toca a cima, a ladeira e o pé.',
    crear: (acabar) => <Busca Debuxo={Partes} nomes={NOMES_PARTES} obxectivos={Object.keys(NOMES_PARTES)} acabar={acabar} />,
  },
  {
    id: 'busca',
    titulo: 'Busca na montaña',
    icono: '🔎',
    explica: 'Toca na paisaxe o que che pida, coma no debuxo do libro.',
    crear: (acabar) => <Busca Debuxo={Paisaxe} nomes={NOMES_MONTANA} obxectivos={Object.keys(NOMES_MONTANA)} acabar={acabar} />,
  },
  {
    id: 'une',
    titulo: 'Que significa?',
    icono: '🔗',
    explica: 'Une cada palabra co seu significado.',
    crear: (acabar) => (
      <Une
        pares={[
          { palabra: 'montaña', significado: 'Terreo elevado e en costa.' },
          { palabra: 'serra', significado: 'Varias montañas xuntas.' },
          { palabra: 'cordilleira', significado: 'Varias serras unidas.' },
          { palabra: 'val', significado: 'Terreo chan e afundido entre montañas, case sempre cun río.' },
          { palabra: 'cima', significado: 'A parte máis alta da montaña.' },
          { palabra: 'ladeira', significado: 'A parte inclinada, entre a cima e o pé.' },
          { palabra: 'pé', significado: 'A parte máis baixa da montaña.' },
        ]}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'turismo',
    titulo: 'Natureza ou persoas?',
    icono: '🗂️',
    explica: 'Que fixo a natureza e que construíron as persoas na montaña?',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'natural', nome: 'Fíxoo a natureza', cor: 'border-green-300 bg-green-100' },
          { id: 'persoas', nome: 'Construírono as persoas', cor: 'border-violet-300 bg-violet-100' },
        ]}
        elementos={[
          { texto: 'serra', caixa: 'natural' },
          { texto: 'val', caixa: 'natural' },
          { texto: 'río', caixa: 'natural' },
          { texto: 'cima', caixa: 'natural' },
          { texto: 'neve', caixa: 'natural' },
          { texto: 'encoro', caixa: 'persoas', pista: 'Un encoro é un lago que fan as persoas cun muro (unha presa) que para a auga do río.' },
          { texto: 'pista de esquí', caixa: 'persoas' },
          { texto: 'canteira', caixa: 'persoas', pista: 'Na canteira as persoas sacan pedra da montaña: fixérona as persoas.' },
          { texto: 'túnel', caixa: 'persoas' },
          { texto: 'aldea', caixa: 'persoas' },
          { texto: 'cámping', caixa: 'persoas' },
        ]}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'vida',
    titulo: 'Verdadeiro ou falso?',
    icono: '❄️',
    explica: 'Como é a vida na montaña?',
    crear: (acabar) => (
      <VerdadeiroFalso
        frases={[
          { texto: 'Na montaña vai frío e hai neve no inverno.', certa: true, explica: 'Si: na montaña vai frío e neva no inverno.' },
          { texto: 'As aldeas de montaña son moi grandes.', certa: false, explica: 'As aldeas de montaña son pequenas.' },
          { texto: 'As estradas de montaña son estreitas e con curvas.', certa: true, explica: 'Si: as estradas son estreitas e con curvas.' },
          { texto: 'Ás veces hai que facer túneles para atravesar as montañas.', certa: true, explica: 'Si: os túneles atravesan as montañas.' },
          { texto: 'Ninguén vai á montaña de vacacións.', certa: false, explica: 'Moitas persoas van gozar da natureza e facer deporte: o turismo é importante.' },
          { texto: 'Os vales case sempre teñen un río.', certa: true, explica: 'Si: case sempre os percorre un río.' },
          { texto: 'As aldeas adoitan estar nas cimas das montañas.', certa: false, explica: 'Adoitan estar nos vales, onde o terreo é chan e hai auga.' },
          { texto: 'Varias serras unidas forman unha cordilleira.', certa: true, explica: 'Si: montaña → serra → cordilleira.' },
        ]}
        acabar={acabar}
      />
    ),
  },
]

const PREGUNTAS: Pregunta[] = [
  elixe('Como é o terreo das paisaxes de montaña?', 'Elevado', ['Chan e baixo', 'Coma unha praia'], 'O terreo das paisaxes de montaña é elevado.'),
  elixe('Que é unha serra?', 'Varias montañas xuntas', ['Unha montaña soa', 'Un río entre montañas'], 'Varias montañas xuntas forman unha serra.'),
  elixe('Que é unha cordilleira?', 'Varias serras unidas', ['Unha montaña moi alta', 'Un val moi longo'], 'Varias serras unidas forman unha cordilleira.'),
  elixe('Que é un val?', 'Un terreo chan e afundido entre montañas', ['A parte máis alta dunha montaña', 'Un lago de montaña'], 'Os vales son terreos chans e afundidos entre montañas, case sempre cun río.'),
  elixe('Que hai case sempre nos vales?', 'Un río', ['Unha pista de esquí', 'Un aeroporto'], 'Os vales case sempre os percorre un río.'),
  elixe('Cal é a parte máis alta dunha montaña?', 'A cima', ['O pé', 'A ladeira'], 'A cima é a parte máis alta; o pé, a máis baixa.'),
  elixe('Cal é a parte máis baixa dunha montaña?', 'O pé', ['A cima', 'A ladeira'], 'O pé é a parte máis baixa.'),
  elixe('Como son as aldeas de montaña?', 'Pequenas', ['Moi grandes', 'Cidades con edificios altos'], 'As aldeas de montaña son pequenas.'),
  elixe('Como son as estradas de montaña?', 'Estreitas e con curvas', ['Anchas e rectas', 'Non hai estradas'], 'Son estreitas e con curvas porque teñen que subir e baixar as montañas.'),
  elixe('Para que se constrúen túneles?', 'Para atravesar as montañas', ['Para gardar a neve', 'Para esquiar'], 'Os túneles atravesan as montañas.'),
  elixe('Por que van moitos turistas á montaña?', 'Para gozar da natureza e facer deporte', ['Porque fai moita calor', 'Para bañarse no mar'], 'Van gozar da natureza ou practicar deportes: por iso o turismo é importante.'),
  elixe('Que tempo fai na montaña no inverno?', 'Frío e neve', ['Moita calor', 'Sempre sol e praia'], 'Na montaña vai frío e hai neve no inverno.'),
  elixe('Onde adoitan estar as aldeas de montaña?', 'No val', ['Na cima', 'Na pista de esquí'], 'No val o terreo é chan e hai auga; nas cimas fai moito frío.'),
  toca('Toca a cima.', Partes, NOMES_PARTES, 'cima', 'A cima é a parte máis alta da montaña.'),
  toca('Toca a ladeira.', Partes, NOMES_PARTES, 'ladeira', 'A ladeira é a parte inclinada, entre a cima e o pé.'),
  toca('Toca o pé da montaña.', Partes, NOMES_PARTES, 'pe', 'O pé é a parte máis baixa.'),
  toca('Toca o val.', Paisaxe, NOMES_MONTANA, 'val', 'O val é o terreo chan e afundido entre as montañas, onde está o río.'),
  toca('Toca a serra.', Paisaxe, NOMES_MONTANA, 'serra', 'A serra son as montañas que están xuntas, ao fondo.'),
  toca('Toca o encoro.', Paisaxe, NOMES_MONTANA, 'encoro', 'O encoro é o lago que fixeron as persoas cun muro que para a auga.'),
  toca('Toca a pista de esquí.', Paisaxe, NOMES_MONTANA, 'pista', 'A pista de esquí é a parte branca da montaña grande.'),
]

export default function Montana({ ruta, modo }: { ruta: string; modo?: string }) {
  return (
    <ParadaPrimaria
      ruta={ruta}
      titulo="Paisaxes de montaña"
      modo={modo}
      paneis={{
        descubre: <Tarxetas tarxetas={TARXETAS} xoga={`${ruta}/xoga`} />,
        xoga: <Xogos xogos={XOGOS} proba={`${ruta}/proba`} />,
        proba: <Proba id="paisaxes/montana" preguntas={PREGUNTAS} />,
      }}
    />
  )
}
