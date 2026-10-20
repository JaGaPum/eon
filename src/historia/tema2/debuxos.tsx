// Debuxos propios do tema 2 de Historia: a pirámide feudal, unha igrexa románica, a súa planta e o Camiño de Santiago.
import { Pilula, tocable } from '../../primaria/paisaxes/debuxos'
import { Chanzos, Etiquetas, Svg, type Props } from '../parcial1/debuxos'

// ——— A pirámide feudal ———

export const NOMES_FEUDAL: Record<string, string> = {
  rei: 'o rei',
  alta: 'a alta nobreza e o alto clero',
  baixa: 'a baixa nobreza e o baixo clero',
  campesinos: 'os campesiños, artesáns e comerciantes',
  marxinados: 'os marxinados',
}

export function PiramideFeudal({ onToca, marcas = {}, etiquetas = true }: Props) {
  const el = tocable(onToca, marcas)
  return (
    <Svg alto={300} etiqueta="A pirámide feudal">
      <rect width="480" height="300" fill="#fffbeb" />
      <Chanzos
        el={el}
        x0={110}
        ancho={360}
        y0={20}
        capas={[
          { id: 'rei', cor: '#eab308' },
          { id: 'alta', cor: '#a855f7' },
          { id: 'baixa', cor: '#c084fc' },
          { id: 'campesinos', cor: '#84cc16' },
          { id: 'marxinados', cor: '#a8a29e' },
        ]}
      />
      <g pointerEvents="none" fontSize="12" fontWeight="800">
        <path d="M100 30 L92 30 L92 172 L100 172" stroke="#7c3aed" strokeWidth="2.5" fill="none" />
        <text x="86" y="96" textAnchor="end" fill="#7c3aed">
          privilexiados
        </text>
        <path d="M100 180 L92 180 L92 278 L100 278" stroke="#4d7c0f" strokeWidth="2.5" fill="none" />
        <text x="86" y="226" textAnchor="end" fill="#4d7c0f">
          non
        </text>
        <text x="86" y="241" textAnchor="end" fill="#4d7c0f">
          privilexiados
        </text>
      </g>
      <Etiquetas
        sitios={{ rei: [290, 52, 'rei'], alta: [290, 98, 'alta nobreza · alto clero'], baixa: [290, 150, 'baixa nobreza · baixo clero'], campesinos: [290, 202, 'campesiños, artesáns…'], marxinados: [290, 254, 'marxinados'] }}
        marcas={marcas}
        etiquetas={etiquetas}
        tam={12}
      />
    </Svg>
  )
}

// ——— Unha igrexa románica ———

export const NOMES_IGREXA: Record<string, string> = {
  muro: 'o muro groso de pedra',
  contraforte: 'un contraforte',
  vano: 'unha ventá estreita',
  portada: 'a portada',
  arco: 'o arco de medio punto',
  absida: 'a ábsida',
  torre: 'a torre',
}

export function IgrexaRomanica({ onToca, marcas = {}, etiquetas = true }: Props) {
  const el = tocable(onToca, marcas)
  const pedra = '#d6c7a1'
  const borde = '#78614a'
  return (
    <Svg alto={300} etiqueta="Unha igrexa románica vista de lado">
      <rect width="480" height="300" fill="#e0f2fe" />
      <rect y="262" width="480" height="38" fill="#86efac" />
      {el(
        'torre',
        <>
          <rect x="60" y="40" width="70" height="222" fill={pedra} stroke={borde} strokeWidth="2" />
          <path d="M54 40 L95 6 L136 40 Z" fill="#b45309" stroke={borde} strokeWidth="2" strokeLinejoin="round" />
          <path d="M84 70 a11 11 0 0 1 22 0 v24 h-22 Z" fill="#334155" />
        </>,
      )}
      {el('muro', <rect x="130" y="110" width="230" height="152" fill={pedra} stroke={borde} strokeWidth="2" />)}
      <path d="M122 110 L245 70 L368 110 Z" fill="#b45309" stroke={borde} strokeWidth="2" strokeLinejoin="round" pointerEvents="none" />
      {el(
        'absida',
        <>
          <path d="M360 140 L360 262 L420 262 A0 0 0 0 0 420 262 L420 150 Q390 128 360 140 Z" fill="#cbb98c" stroke={borde} strokeWidth="2" />
          <path d="M356 142 Q392 116 424 150" stroke="#b45309" strokeWidth="8" fill="none" />
        </>,
      )}
      {[190, 300].map((x) => (
        <g key={x}>{el('contraforte', <rect x={x} y="114" width="16" height="148" fill="#c0ad7f" stroke={borde} strokeWidth="1.5" />)}</g>
      ))}
      {el(
        'vano',
        <>
          <path d="M238 140 a7 7 0 0 1 14 0 v30 h-14 Z" fill="#334155" />
          <rect x="232" y="128" width="26" height="48" fill="transparent" />
        </>,
      )}
      <path d="M383 170 a6 6 0 0 1 12 0 v24 h-12 Z" fill="#334155" pointerEvents="none" />
      {el(
        'portada',
        <>
          <rect x="140" y="186" width="44" height="76" fill="#cbb98c" stroke={borde} strokeWidth="1.5" />
          <path d="M148 262 L148 214 a14 14 0 0 1 28 0 L176 262 Z" fill="#7c2d12" />
        </>,
      )}
      {el('arco', <path d="M142 214 a20 20 0 0 1 40 0" stroke="#92400e" strokeWidth="6" fill="none" />)}
      <Etiquetas
        sitios={{
          torre: [95, 140, 'torre'],
          muro: [258, 228, 'muro groso'],
          contraforte: [308, 98, 'contraforte'],
          vano: [245, 120, 'ventá estreita'],
          portada: [162, 282, 'portada'],
          arco: [162, 178, 'arco de medio punto'],
          absida: [420, 120, 'ábsida'],
        }}
        marcas={marcas}
        etiquetas={etiquetas}
        tam={12}
      />
    </Svg>
  )
}

// ——— A planta de cruz latina ———

export const NOMES_PLANTA: Record<string, string> = {
  nave: 'a nave central',
  laterais: 'as naves laterais',
  cruceiro: 'o cruceiro (o brazo curto da cruz)',
  absida: 'a ábsida',
  entrada: 'a entrada (os pés)',
}

export function PlantaCruzLatina({ onToca, marcas = {}, etiquetas = true }: Props) {
  const el = tocable(onToca, marcas)
  const chan = '#f5f0e1'
  const borde = '#78614a'
  return (
    <Svg alto={280} etiqueta="Planta de cruz latina">
      <rect width="480" height="280" fill="#f8fafc" />
      {el('laterais', <path d="M60 110 L250 110 L250 90 L60 90 Z M60 190 L250 190 L250 170 L60 170 Z" fill="#e7dcc0" stroke={borde} strokeWidth="2" />)}
      {el('nave', <rect x="60" y="110" width="190" height="60" fill={chan} stroke={borde} strokeWidth="2" />)}
      {el('cruceiro', <rect x="250" y="30" width="60" height="220" fill="#efe6cc" stroke={borde} strokeWidth="2" />)}
      {el(
        'absida',
        <>
          <path d="M310 100 L360 100 A40 40 0 0 1 360 180 L310 180 Z" fill="#e7dcc0" stroke={borde} strokeWidth="2" />
        </>,
      )}
      {el(
        'entrada',
        <>
          <rect x="30" y="118" width="30" height="44" fill="#fcd34d" stroke={borde} strokeWidth="2" />
          <path d="M14 140 L28 140 M22 133 L29 140 L22 147" stroke="#92400e" strokeWidth="2.5" fill="none" />
        </>,
      )}
      <g pointerEvents="none" fill="#a16207">
        {[90, 130, 170, 210].map((x) => [110, 170].map((y) => <rect key={`${x}${y}`} x={x - 4} y={y - 4} width={8} height={8} />))}
      </g>
      <Pilula x={400} y={262} texto="a cabeceira mira ao leste" tam={11} cor="#f1f5f9" />
      <Etiquetas
        sitios={{ nave: [155, 140, 'nave central'], laterais: [155, 72, 'naves laterais'], cruceiro: [280, 18, 'cruceiro'], absida: [360, 210, 'ábsida'], entrada: [45, 192, 'entrada'] }}
        marcas={marcas}
        etiquetas={etiquetas}
        tam={12}
      />
    </Svg>
  )
}

// ——— O Camiño de Santiago ———

export const NOMES_CAMINO: Record<string, string> = {
  roncesvalles: 'Roncesvalles, onde comeza',
  pamplona: 'Pamplona',
  burgos: 'Burgos',
  leon: 'León',
  santiago: 'Santiago de Compostela, a meta',
}

const PARADAS_CAMINO: [string, number, number][] = [
  ['santiago', 52, 92],
  ['leon', 188, 112],
  ['burgos', 270, 120],
  ['pamplona', 352, 92],
  ['roncesvalles', 384, 70],
]

export function Camino({ onToca, marcas = {}, etiquetas = true }: Props) {
  const el = tocable(onToca, marcas)
  return (
    <Svg alto={280} etiqueta="O Camiño de Santiago">
      <rect width="480" height="280" fill="#bae6fd" />
      <path d="M30 70 L60 40 L180 54 L300 50 L410 46 L470 80 L440 150 L470 200 L420 260 L240 270 L90 262 L40 230 L56 160 L24 120 Z" fill="#fef3c7" stroke="#a16207" strokeWidth="2" strokeLinejoin="round" />
      <path d="M384 70 Q370 82 352 92 Q310 104 270 120 Q230 120 188 112 Q120 96 52 92" stroke="#f59e0b" strokeWidth="6" strokeDasharray="10 6" fill="none" pointerEvents="none" />
      <text x="420" y="40" fontSize="12" fontWeight="700" fill="#475569" pointerEvents="none">
        Francia
      </text>
      <text x="250" y="200" fontSize="13" fill="#a16207" fontStyle="italic" pointerEvents="none">
        Península Ibérica
      </text>
      {PARADAS_CAMINO.map(([id, x, y]) =>
        el(
          id,
          <>
            <circle cx={x} cy={y} r={id === 'santiago' ? 11 : 8} fill={id === 'santiago' ? '#dc2626' : '#1e293b'} stroke="#fff" strokeWidth="2" />
            <circle cx={x} cy={y} r={18} fill="transparent" />
          </>,
        ),
      )}
      <Etiquetas
        sitios={{ santiago: [62, 124, 'Santiago'], leon: [188, 144, 'León'], burgos: [270, 152, 'Burgos'], pamplona: [340, 126, 'Pamplona'], roncesvalles: [410, 100, 'Roncesvalles'] }}
        marcas={marcas}
        etiquetas={etiquetas}
        tam={12}
      />
    </Svg>
  )
}
