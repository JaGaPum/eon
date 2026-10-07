// Parada 4 de «Descubrimos as paisaxes»: as paisaxes de costa (páxinas 20 e 21 do libro).
import { Busca, Clasifica, ParadaPrimaria, Proba, Tarxetas, Une, VerdadeiroFalso, type Debuxo, type Pregunta, type Tarxeta, type Xogo, Xogos } from '../pezas'
import { CostaAltaBaixa, NOMES_COSTA, PaisaxeCosta } from './escenas'
import { elixe, toca } from './preguntas'

const Paisaxe: Debuxo = (p) => <PaisaxeCosta {...p} />

const b = (t: string) => <b className="text-violet-800">{t}</b>

/** As formas do relevo que pide a actividade 7 do libro. */
const FORMAS = ['cabo', 'golfo', 'baia', 'illa', 'arquipelago', 'peninsula', 'istmo']

const TARXETAS: Tarxeta[] = [
  {
    titulo: 'Como son as paisaxes de costa?',
    texto: (
      <>
        <p>
          A {b('costa')} é a terra que está en contacto co mar.
        </p>
        <p>
          Se ten {b('acantilados')}, porque as montañas chegan ata o mar, chámase {b('costa alta')}.
        </p>
        <p>
          Se hai {b('praias')} de area ou de cantos, chámase {b('costa baixa')}.
        </p>
      </>
    ),
    visual: <CostaAltaBaixa />,
  },
  {
    titulo: 'Cabos e puntas',
    texto: (
      <>
        <p>
          Os {b('cabos')} son saíntes de terra que entran no mar.
        </p>
        <p>
          Os saíntes máis pequenos chámanse {b('puntas')}.
        </p>
        <p className="text-base text-slate-600">💡 No cabo do debuxo hai un faro.</p>
      </>
    ),
    visual: <PaisaxeCosta etiquetas so={['cabo', 'acantilado']} />,
  },
  {
    titulo: 'Golfos e baías',
    texto: (
      <>
        <p>
          Os {b('golfos')} son grandes entradas do mar na terra.
        </p>
        <p>
          Se son entradas máis pequenas, chámanse {b('baías')}.
        </p>
        <p className="text-base text-slate-600">💡 O cabo é terra que entra no mar; o golfo, mar que entra na terra. Son o contrario!</p>
      </>
    ),
    visual: <PaisaxeCosta etiquetas so={['golfo', 'baia', 'praia']} />,
  },
  {
    titulo: 'Illas e arquipélagos',
    texto: (
      <>
        <p>
          As {b('illas')} son porcións de terra rodeadas de mar por todas as partes.
        </p>
        <p>
          Varias illas próximas forman un {b('arquipélago')}.
        </p>
      </>
    ),
    visual: <PaisaxeCosta etiquetas so={['illa', 'arquipelago']} />,
  },
  {
    titulo: 'Penínsulas e istmos',
    texto: (
      <>
        <p>
          As {b('penínsulas')} son terreos rodeados de auga por todas as partes {b('menos por unha')}.
        </p>
        <p>
          Esa parte que a une coa terra chámase {b('istmo')}.
        </p>
        <p className="text-base text-slate-600">💡 Unha illa está toda rodeada de auga; unha península, case toda.</p>
      </>
    ),
    visual: <PaisaxeCosta etiquetas so={['peninsula', 'istmo', 'illa']} />,
  },
  {
    titulo: 'Como é a vida na costa?',
    texto: (
      <>
        <p>
          Nas costas {b('viven moitas persoas')}, en aldeas, vilas e cidades.
        </p>
        <p>
          Cada ano chegan moitos {b('turistas')} de vacacións. Por iso hai moitas {b('infraestruturas')}: estradas, vías de ferrocarril, aeroportos, hoteis, portos deportivos, centros de lecer...
        </p>
      </>
    ),
    visual: <PaisaxeCosta etiquetas so={['cidade', 'porto', 'praia']} />,
  },
  {
    titulo: 'En que se traballa na costa?',
    texto: (
      <>
        <p>
          {b('Antes')}, moitas persoas dedicábanse á {b('pesca')}.
        </p>
        <p>
          {b('Agora')}, a maioría traballa na {b('industria')} e nos {b('servizos')}, sobre todo no {b('turismo')}: guías, recepcionistas, camareiros...
        </p>
      </>
    ),
    visual: <PaisaxeCosta etiquetas so={['porto', 'cidade']} />,
  },
]

const XOGOS: Xogo[] = [
  {
    id: 'formas',
    titulo: 'Identifica as formas da costa',
    icono: '🗺️',
    explica: 'Coma na actividade 7: toca cada forma do relevo.',
    crear: (acabar) => <Busca Debuxo={Paisaxe} nomes={NOMES_COSTA} obxectivos={FORMAS} acabar={acabar} />,
  },
  {
    id: 'une',
    titulo: 'Que significa?',
    icono: '🔗',
    explica: 'Une cada palabra co seu significado.',
    crear: (acabar) => (
      <Une
        pares={[
          { palabra: 'cabo', significado: 'Saínte de terra que entra no mar.' },
          { palabra: 'golfo', significado: 'Gran entrada do mar na terra.' },
          { palabra: 'baía', significado: 'Entrada do mar na terra, máis pequena ca un golfo.' },
          { palabra: 'illa', significado: 'Porción de terra rodeada de mar por todas as partes.' },
          { palabra: 'arquipélago', significado: 'Varias illas próximas.' },
          { palabra: 'península', significado: 'Terreo rodeado de auga por todas as partes menos por unha.' },
          { palabra: 'istmo', significado: 'A parte que une a península coa terra.' },
        ]}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'entrantes',
    titulo: 'Mar ou terra?',
    icono: '🗂️',
    explica: 'O mar entra na terra, ou a terra entra no mar?',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'mar', nome: 'O mar entra na terra', cor: 'border-sky-300 bg-sky-100' },
          { id: 'terra', nome: 'Terra que entra no mar', cor: 'border-green-300 bg-green-100' },
          { id: 'rodeada', nome: 'Terra rodeada de mar', cor: 'border-amber-300 bg-amber-100' },
        ]}
        elementos={[
          { texto: 'golfo', caixa: 'mar' },
          { texto: 'baía', caixa: 'mar' },
          { texto: 'cabo', caixa: 'terra' },
          { texto: 'punta', caixa: 'terra', pista: 'Unha punta é un cabo pequeno: terra que entra no mar.' },
          { texto: 'península', caixa: 'terra', pista: 'A península entra no mar, pero segue unida á terra polo istmo: non está toda rodeada.' },
          { texto: 'illa', caixa: 'rodeada' },
          { texto: 'arquipélago', caixa: 'rodeada' },
        ]}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'alta-baixa',
    titulo: 'Costa alta ou baixa?',
    icono: '🏖️',
    explica: 'Clasifica cada costa.',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'alta', nome: 'Costa alta', cor: 'border-orange-300 bg-orange-100' },
          { id: 'baixa', nome: 'Costa baixa', cor: 'border-yellow-300 bg-yellow-100' },
        ]}
        elementos={[
          { texto: 'acantilados', caixa: 'alta' },
          { texto: 'montañas que chegan ao mar', caixa: 'alta' },
          { texto: 'praia de area', caixa: 'baixa' },
          { texto: 'praia de cantos', caixa: 'baixa', pista: 'Unha praia de cantos (pedras redondas) tamén é costa baixa.' },
        ]}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'vida',
    titulo: 'Verdadeiro ou falso?',
    icono: '⚓',
    explica: 'Como é a vida na costa?',
    crear: (acabar) => (
      <VerdadeiroFalso
        frases={[
          { texto: 'Nas costas vive moita xente.', certa: true, explica: 'Si: en aldeas, vilas e cidades.' },
          { texto: 'Á costa non vai ningún turista.', certa: false, explica: 'Cada ano chegan moitos turistas de vacacións.' },
          { texto: 'Na costa hai hoteis, portos deportivos e centros de lecer.', certa: true, explica: 'Si: son infraestruturas para os turistas.' },
          { texto: 'Hoxe a maioría da xente da costa traballa na pesca.', certa: false, explica: 'Iso era antes. Agora a maioría traballa na industria e nos servizos, sobre todo no turismo.' },
          { texto: 'Os camareiros e os recepcionistas traballan no turismo.', certa: true, explica: 'Si: son traballos de servizos.' },
          { texto: 'A costa alta ten acantilados.', certa: true, explica: 'Si: as montañas chegan ata o mar.' },
          { texto: 'Unha illa está unida á terra por un istmo.', certa: false, explica: 'A que está unida por un istmo é a península. A illa está toda rodeada de mar.' },
          { texto: 'Un golfo é unha entrada grande do mar na terra.', certa: true, explica: 'Si; se é máis pequena, chámase baía.' },
        ]}
        acabar={acabar}
      />
    ),
  },
]

const PREGUNTAS: Pregunta[] = [
  elixe('Que é a costa?', 'A terra que está en contacto co mar', ['Un terreo chan a moita altura', 'Unha illa moi grande'], 'A costa é a terra que está en contacto co mar.'),
  elixe('Como se chama a costa que ten acantilados?', 'Costa alta', ['Costa baixa', 'Meseta'], 'Se ten acantilados, porque as montañas chegan ao mar, é costa alta.'),
  elixe('Como se chama a costa que ten praias de area ou de cantos?', 'Costa baixa', ['Costa alta', 'Cordilleira'], 'Se hai praias, é costa baixa.'),
  elixe('Que é un cabo?', 'Un saínte de terra que entra no mar', ['Unha entrada do mar na terra', 'Varias illas xuntas'], 'Os cabos son saíntes de terra que entran no mar.'),
  elixe('Como se chaman os cabos máis pequenos?', 'Puntas', ['Baías', 'Istmos'], 'Os saíntes máis pequenos chámanse puntas.'),
  elixe('Que é un golfo?', 'Unha gran entrada do mar na terra', ['Un saínte de terra no mar', 'Unha illa pequena'], 'Os golfos son grandes entradas do mar na terra.'),
  elixe('Como se chama unha entrada do mar máis pequena ca un golfo?', 'Baía', ['Punta', 'Península'], 'Se é máis pequena, chámase baía.'),
  elixe('Que é unha illa?', 'Terra rodeada de mar por todas as partes', ['Terra rodeada de mar menos por unha parte', 'Unha entrada do mar'], 'As illas están rodeadas de mar por todas as partes.'),
  elixe('Que forman varias illas próximas?', 'Un arquipélago', ['Unha península', 'Un golfo'], 'Varias illas próximas forman un arquipélago.'),
  elixe('Que é unha península?', 'Terra rodeada de auga por todas as partes menos por unha', ['Terra rodeada de auga por todas as partes', 'Unha entrada do mar na terra'], 'A península está case toda rodeada de auga; a parte que a une á terra é o istmo.'),
  elixe('Como se chama a parte que une a península coa terra?', 'Istmo', ['Cabo', 'Baía'], 'É o istmo.'),
  elixe('Por que hai tantos hoteis e portos deportivos na costa?', 'Porque chegan moitos turistas', ['Porque fai moito frío', 'Porque non vive ninguén'], 'Os turistas necesitan hoteis, estradas, aeroportos, portos deportivos...'),
  elixe('En que traballa hoxe a maioría da xente da costa?', 'Na industria e nos servizos, sobre todo no turismo', ['Na pesca', 'Nas pistas de esquí'], 'Antes dedicábanse á pesca; agora, á industria e aos servizos.'),
  toca('Toca o golfo.', Paisaxe, NOMES_COSTA, 'golfo', 'O golfo é a gran entrada do mar na terra.'),
  toca('Toca o cabo.', Paisaxe, NOMES_COSTA, 'cabo', 'O cabo é o saínte de terra co faro.'),
  toca('Toca a península.', Paisaxe, NOMES_COSTA, 'peninsula', 'A península está rodeada de auga menos polo istmo.'),
  toca('Toca o arquipélago.', Paisaxe, NOMES_COSTA, 'arquipelago', 'O arquipélago son as illas que están xuntas.'),
  toca('Toca a baía.', Paisaxe, NOMES_COSTA, 'baia', 'A baía é a entrada do mar pequena, abaixo.'),
  toca('Toca o istmo.', Paisaxe, NOMES_COSTA, 'istmo', 'O istmo é a franxa estreita que une a península coa terra.'),
]

export default function Costa({ ruta, modo }: { ruta: string; modo?: string }) {
  return (
    <ParadaPrimaria
      ruta={ruta}
      titulo="Paisaxes de costa"
      modo={modo}
      paneis={{
        descubre: <Tarxetas tarxetas={TARXETAS} xoga={`${ruta}/xoga`} />,
        xoga: <Xogos xogos={XOGOS} proba={`${ruta}/proba`} />,
        proba: <Proba id="paisaxes/costa" preguntas={PREGUNTAS} />,
      }}
    />
  )
}
