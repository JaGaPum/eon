// Parada 3 de «Descubrimos as paisaxes»: as paisaxes de chaira (páxinas 18 e 19 do libro).
import { Busca, Clasifica, ParadaPrimaria, Proba, Tarxetas, Une, VerdadeiroFalso, type Debuxo, type Pregunta, type Tarxeta, type Xogo, Xogos } from '../pezas'
import { NOMES_CHAIRA, NOMES_PERFIL, PaisaxeChaira, PerfilChaira } from './escenas'
import { elixe, toca } from './preguntas'

const Perfil: Debuxo = (p) => <PerfilChaira {...p} />
const Paisaxe: Debuxo = (p) => <PaisaxeChaira {...p} />

const b = (t: string) => <b className="text-violet-800">{t}</b>

const TARXETAS: Tarxeta[] = [
  {
    titulo: 'Como son as paisaxes de chaira?',
    texto: (
      <>
        <p>
          Nas {b('paisaxes de chaira')} hai grandes extensións de {b('terreo chan')}.
        </p>
        <p>
          As chairas poden ser {b('mesetas')} ou {b('depresións')}.
        </p>
      </>
    ),
    visual: <PaisaxeChaira etiquetas so={['meseta', 'outeiro']} />,
  },
  {
    titulo: 'Mesetas e depresións',
    texto: (
      <>
        <p>
          As {b('mesetas')} son terreos chans, pero situados a {b('bastante altura')}.
        </p>
        <p>
          As {b('depresións')} son terreos planos que están {b('afundidos')} e rodeados doutros máis elevados.
        </p>
        <p className="text-base text-slate-600">💡 Meseta: chan e arriba. Depresión: chan e abaixo, coma nun oco.</p>
      </>
    ),
    visual: <PerfilChaira etiquetas />,
  },
  {
    titulo: 'Os outeiros',
    texto: (
      <>
        <p>
          Nas chairas tamén podemos atopar {b('outeiros')}.
        </p>
        <p>
          Os outeiros son elevacións de {b('pouca altura')} coa {b('cima plana')}.
        </p>
        <p className="text-base text-slate-600">💡 Un outeiro é coma unha meseta pequeniña.</p>
      </>
    ),
    visual: <PerfilChaira etiquetas />,
  },
  {
    titulo: 'Como é a vida na chaira?',
    texto: (
      <>
        <p>
          A maioría das localidades están en chairas porque é {b('máis fácil construír')} nos terreos planos.
        </p>
        <p>
          As {b('estradas')} e as {b('vías do tren')} son bastante {b('rectas')}.
        </p>
        <p>
          Os {b('aeroportos')} constrúense en zonas chás.
        </p>
      </>
    ),
    visual: <PaisaxeChaira etiquetas so={['cidade', 'aldea', 'estrada', 'tren', 'aeroporto']} />,
  },
  {
    titulo: 'Que traballos se fan na chaira?',
    texto: (
      <>
        <p>
          🌾 {b('Nas aldeas')}: moitas persoas traballan na {b('agricultura')}, porque os cultivos crecen ben en terreos chans preto dos ríos.
        </p>
        <p>
          🏙️ {b('Nas vilas e nas cidades')}: a maioría traballa nos {b('transportes')}, {b('fábricas')}, {b('oficinas')}, {b('comercios')}, {b('hospitais')}...
        </p>
      </>
    ),
    visual: <PaisaxeChaira etiquetas so={['cultivos', 'rio', 'aldea', 'cidade', 'fabrica']} />,
  },
]

const XOGOS: Xogo[] = [
  {
    id: 'perfil',
    titulo: 'Meseta, depresión ou outeiro?',
    icono: '🏜️',
    explica: 'Toca no debuxo o que che pida.',
    crear: (acabar) => <Busca Debuxo={Perfil} nomes={NOMES_PERFIL} obxectivos={Object.keys(NOMES_PERFIL)} acabar={acabar} />,
  },
  {
    id: 'busca',
    titulo: 'Busca na chaira',
    icono: '🔎',
    explica: 'Toca na paisaxe o que che pida.',
    crear: (acabar) => <Busca Debuxo={Paisaxe} nomes={NOMES_CHAIRA} obxectivos={Object.keys(NOMES_CHAIRA)} acabar={acabar} />,
  },
  {
    id: 'une',
    titulo: 'Que significa?',
    icono: '🔗',
    explica: 'Une cada palabra co seu significado.',
    crear: (acabar) => (
      <Une
        pares={[
          { palabra: 'chaira', significado: 'Unha gran extensión de terreo chan.' },
          { palabra: 'meseta', significado: 'Terreo chan, pero situado a bastante altura.' },
          { palabra: 'depresión', significado: 'Terreo plano afundido e rodeado doutros máis elevados.' },
          { palabra: 'outeiro', significado: 'Elevación de pouca altura coa cima plana.' },
        ]}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'traballos',
    titulo: 'Onde traballan?',
    icono: '👩‍🌾',
    explica: 'Nas aldeas ou nas vilas e cidades?',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'aldea', nome: 'Nas aldeas', cor: 'border-amber-300 bg-amber-100' },
          { id: 'cidade', nome: 'Nas vilas e cidades', cor: 'border-lime-300 bg-lime-100' },
        ]}
        elementos={[
          { texto: 'agricultura', caixa: 'aldea' },
          { texto: 'cultivar os campos', caixa: 'aldea' },
          { texto: 'coller o trigo', caixa: 'aldea' },
          { texto: 'transportes', caixa: 'cidade' },
          { texto: 'fábricas', caixa: 'cidade' },
          { texto: 'oficinas', caixa: 'cidade' },
          { texto: 'comercios', caixa: 'cidade' },
          { texto: 'hospitais', caixa: 'cidade' },
        ]}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'vida',
    titulo: 'Verdadeiro ou falso?',
    icono: '🚆',
    explica: 'Como é a vida na chaira?',
    crear: (acabar) => (
      <VerdadeiroFalso
        frases={[
          { texto: 'Nas chairas hai grandes extensións de terreo chan.', certa: true, explica: 'Si: a chaira é terreo chan.' },
          { texto: 'A maioría das localidades están en chairas.', certa: true, explica: 'Si, porque é máis fácil construír nos terreos planos.' },
          { texto: 'Nas chairas as estradas teñen moitas curvas.', certa: false, explica: 'Nas chairas as estradas e as vías do tren son bastante rectas.' },
          { texto: 'Os aeroportos constrúense en zonas chás.', certa: true, explica: 'Si: os avións necesitan terreo chan para aterrar.' },
          { texto: 'Unha meseta é un terreo chan e baixo.', certa: false, explica: 'A meseta é chan pero está a bastante altura. A chan e baixa é a depresión.' },
          { texto: 'Un outeiro ten a cima plana.', certa: true, explica: 'Si: é unha elevación de pouca altura coa cima plana.' },
          { texto: 'Nas aldeas moitas persoas traballan na agricultura.', certa: true, explica: 'Si: os cultivos crecen ben en terreos chans preto dos ríos.' },
          { texto: 'Nas cidades a maioría traballa no campo.', certa: false, explica: 'Nas vilas e cidades traballan en transportes, fábricas, oficinas, comercios, hospitais...' },
        ]}
        acabar={acabar}
      />
    ),
  },
]

const PREGUNTAS: Pregunta[] = [
  elixe('Como é o terreo nas paisaxes de chaira?', 'Chan', ['Moi elevado e en costa', 'Cheo de acantilados'], 'Nas chairas hai grandes extensións de terreo chan.'),
  elixe('Que é unha meseta?', 'Un terreo chan situado a bastante altura', ['Un terreo afundido entre outros máis altos', 'Unha montaña con neve'], 'As mesetas son chans pero altas.'),
  elixe('Que é unha depresión?', 'Un terreo plano afundido e rodeado doutros máis elevados', ['Un terreo chan a moita altura', 'Unha elevación coa cima plana'], 'As depresións son terreos planos afundidos.'),
  elixe('Que é un outeiro?', 'Unha elevación de pouca altura coa cima plana', ['Unha montaña moi alta', 'Un río ancho'], 'Os outeiros son pequenos e coa cima plana.'),
  elixe('Por que hai tantas localidades nas chairas?', 'Porque é máis fácil construír nos terreos planos', ['Porque fai moito frío', 'Porque non hai ríos'], 'Nos terreos planos é máis fácil construír.'),
  elixe('Como son as estradas e as vías do tren nas chairas?', 'Bastante rectas', ['Estreitas e con moitas curvas', 'Pasan sempre por túneles'], 'Nas chairas son bastante rectas; as de curvas son as de montaña.'),
  elixe('Onde se constrúen os aeroportos?', 'En zonas chás', ['Nas cimas das montañas', 'Nos acantilados'], 'Os aeroportos constrúense en zonas chás.'),
  elixe('En que traballan moitas persoas das aldeas da chaira?', 'Na agricultura', ['Nas pistas de esquí', 'Nos hospitais'], 'Os cultivos crecen ben en terreos chans preto dos ríos.'),
  elixe('Por que os cultivos crecen ben na chaira?', 'Porque o terreo é chan e está preto dos ríos', ['Porque hai moita neve', 'Porque está moi alto'], 'Crecen ben en terreos chans preto dos ríos.'),
  elixe('Cal destes traballos é típico das vilas e cidades?', 'Traballar nunha oficina', ['Cultivar os campos', 'Coller o trigo'], 'Nas vilas e cidades traballan en transportes, fábricas, oficinas, comercios, hospitais...'),
  elixe('As chairas poden ser...', 'Mesetas ou depresións', ['Serras ou cordilleiras', 'Cabos ou golfos'], 'As chairas poden ser mesetas ou depresións.'),
  toca('Toca a meseta.', Perfil, NOMES_PERFIL, 'meseta', 'A meseta é a chaira alta, á esquerda.'),
  toca('Toca a depresión.', Perfil, NOMES_PERFIL, 'depresion', 'A depresión é a chaira afundida, no medio.'),
  toca('Toca o outeiro.', Perfil, NOMES_PERFIL, 'outeiro', 'O outeiro é a elevación pequena coa cima plana.'),
  toca('Toca o aeroporto.', Paisaxe, NOMES_CHAIRA, 'aeroporto', 'O aeroporto está nunha zona chá, abaixo á dereita.'),
  toca('Toca os cultivos.', Paisaxe, NOMES_CHAIRA, 'cultivos', 'Os cultivos son os campos de cores, abaixo á esquerda.'),
]

export default function Chaira({ ruta, modo }: { ruta: string; modo?: string }) {
  return (
    <ParadaPrimaria
      ruta={ruta}
      titulo="Paisaxes de chaira"
      modo={modo}
      paneis={{
        descubre: <Tarxetas tarxetas={TARXETAS} xoga={`${ruta}/xoga`} />,
        xoga: <Xogos xogos={XOGOS} proba={`${ruta}/proba`} />,
        proba: <Proba id="paisaxes/chaira" preguntas={PREGUNTAS} />,
      }}
    />
  )
}
