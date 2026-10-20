// Debuxos propios da unidade de Historia. Cada parte tócase polo seu identificador (para os xogos de buscar e as
// preguntas de tocar) e as etiquetas, en galego, vense en Descubre.
import type { ReactNode } from 'react'
import type { Marca } from '../../primaria/pezas'
import { Pilula, tocable } from '../../primaria/paisaxes/debuxos'
import { ETAPAS_ROMA, dataDe } from './datos'

export interface Props {
  onToca?: (id: string) => void
  marcas?: Record<string, Marca>
  etiquetas?: boolean
}

export function Etiquetas({ sitios, marcas = {}, etiquetas, tam = 14 }: { sitios: Record<string, [number, number, string]>; marcas?: Record<string, Marca>; etiquetas?: boolean; tam?: number }) {
  return (
    <>
      {Object.entries(sitios)
        .filter(([id]) => etiquetas || marcas[id])
        .map(([id, [x, y, t]]) => (
          <Pilula key={id} x={x} y={y} texto={t} marca={marcas[id]} tam={tam} />
        ))}
    </>
  )
}

export const Svg = ({ alto = 320, etiqueta, children }: { alto?: number; etiqueta: string; children: ReactNode }) => (
  <svg viewBox={`0 0 480 ${alto}`} className="block h-auto w-full touch-manipulation select-none" role="img" aria-label={etiqueta}>
    {children}
  </svg>
)

// ——— Liña do tempo de Roma ———

/** As tres etapas de Roma nunha barra, cada unha do seu longo. */
export function LinaRoma() {
  const ini = ETAPAS_ROMA[0].dende
  const fin = ETAPAS_ROMA[ETAPAS_ROMA.length - 1].ata
  const x = (ano: number) => 50 + ((ano - ini) / (fin - ini)) * 380
  return (
    <Svg alto={130} etiqueta="Liña do tempo: Monarquía, República e Imperio">
      <rect width="480" height="130" fill="#fffbeb" />
      {ETAPAS_ROMA.map((e) => (
        <g key={e.id}>
          <rect x={x(e.dende)} y={40} width={x(e.ata) - x(e.dende)} height={36} fill={e.cor} stroke="#fff" strokeWidth="2" />
          <text x={(x(e.dende) + x(e.ata)) / 2} y={63} textAnchor="middle" fontSize="15" fontWeight="800" fill="#1e293b">
            {e.nome}
          </text>
        </g>
      ))}
      {[...ETAPAS_ROMA.map((e) => e.dende), fin].map((a, i) => (
        <g key={a}>
          <line x1={x(a)} y1={34} x2={x(a)} y2={84} stroke="#1e293b" strokeWidth="2" />
          <text x={x(a)} y={i % 2 ? 26 : 104} textAnchor="middle" fontSize="14" fontWeight="700" fill="#1e293b">
            {dataDe(a)}
          </text>
        </g>
      ))}
      <line x1={x(0)} y1={86} x2={x(0)} y2={112} stroke="#64748b" strokeDasharray="3 3" />
      <text x={x(0) + 4} y={124} fontSize="12" fill="#64748b">
        nacemento de Cristo
      </text>
    </Svg>
  )
}

// ——— A cidade romana ———

export const NOMES_CIDADE: Record<string, string> = {
  foro: 'o foro',
  templo: 'o templo',
  termas: 'as termas',
  teatro: 'o teatro',
  anfiteatro: 'o anfiteatro',
  circo: 'o circo',
  acueduto: 'o acueduto',
  muralla: 'a muralla',
  arco: 'o arco de triunfo',
  cardo: 'o cardo (rúa norte-sur)',
  decumano: 'o decumano (rúa leste-oeste)',
}

const Casas = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => {
  const cs: ReactNode[] = []
  for (let i = x; i + 16 <= x + w; i += 20) for (let j = y; j + 12 <= y + h; j += 17) cs.push(<rect key={`${i}-${j}`} x={i} y={j} width={16} height={12} rx={1.5} fill="#ea7a4f" stroke="#9a3412" strokeWidth="0.8" />)
  return <g pointerEvents="none">{cs}</g>
}

export function CidadeRomana({ onToca, marcas = {}, etiquetas = true }: Props) {
  const el = tocable(onToca, marcas)
  return (
    <Svg etiqueta="Unha cidade romana">
      <rect width="480" height="320" fill="#bbf7d0" />
      <rect x="60" y="40" width="330" height="240" fill="#fef3c7" />
      <Casas x={70} y={180} w={140} h={22} />
      <Casas x={245} y={52} w={135} h={40} />
      <Casas x={70} y={112} w={70} h={34} />
      <Casas x={350} y={110} w={34} h={40} />
      <Casas x={350} y={180} w={34} h={90} />
      {el('cardo', <rect x="220" y="40" width="18" height="240" fill="#d6d3d1" stroke="#a8a29e" />)}
      {el('decumano', <rect x="60" y="152" width="330" height="18" fill="#d6d3d1" stroke="#a8a29e" />)}
      {el('muralla', <rect x="60" y="40" width="330" height="240" fill="none" stroke="#a16207" strokeWidth="11" />)}
      {[60, 390].map((x) => [40, 280].map((y) => <rect key={`${x}${y}`} x={x - 9} y={y - 9} width={18} height={18} fill="#854d0e" pointerEvents="none" />))}
      {el(
        'foro',
        <>
          <rect x="244" y="100" width="76" height="46" fill="#fafaf9" stroke="#78716c" strokeWidth="2" />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <circle key={i} cx={250 + i * 10.6} cy={106} r={2.4} fill="#78716c" />
          ))}
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <circle key={i} cx={250 + i * 10.6} cy={140} r={2.4} fill="#78716c" />
          ))}
        </>,
      )}
      {el(
        'templo',
        <>
          <rect x="152" y="108" width="54" height="34" fill="#f5f5f4" stroke="#57534e" strokeWidth="2" />
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={i} x1={160 + i * 9.5} y1={112} x2={160 + i * 9.5} y2={140} stroke="#78716c" strokeWidth="2.5" />
          ))}
          <path d="M148 108 L179 92 L210 108 Z" fill="#e7e5e4" stroke="#57534e" strokeWidth="2" strokeLinejoin="round" />
        </>,
      )}
      {el(
        'termas',
        <>
          <rect x="250" y="190" width="88" height="70" fill="#f5f5f4" stroke="#57534e" strokeWidth="2" />
          <rect x="262" y="202" width="40" height="26" rx="4" fill="#38bdf8" />
          <circle cx="320" cy="242" r="11" fill="#7dd3fc" stroke="#0284c7" />
          <path d="M268 240 q6 -6 12 0 q6 6 12 0" stroke="#fff" strokeWidth="2" fill="none" />
        </>,
      )}
      {el(
        'teatro',
        <>
          <path d="M92 272 A44 44 0 0 1 180 272 Z" fill="#e7e5e4" stroke="#57534e" strokeWidth="2" />
          <path d="M106 272 A30 30 0 0 1 166 272" stroke="#a8a29e" strokeWidth="2" fill="none" />
          <path d="M120 272 A16 16 0 0 1 152 272" stroke="#a8a29e" strokeWidth="2" fill="none" />
          <rect x="94" y="268" width="84" height="6" fill="#78716c" />
        </>,
      )}
      {el(
        'circo',
        <>
          <rect x="74" y="54" width="136" height="38" rx="19" fill="#fcd34d" stroke="#92400e" strokeWidth="2" />
          <rect x="100" y="70" width="84" height="6" rx="3" fill="#92400e" />
        </>,
      )}
      {el(
        'anfiteatro',
        <>
          <ellipse cx="438" cy="236" rx="36" ry="28" fill="#e7e5e4" stroke="#57534e" strokeWidth="2" />
          <ellipse cx="438" cy="236" rx="20" ry="14" fill="#fde68a" stroke="#a8a29e" />
        </>,
      )}
      {el(
        'acueduto',
        <>
          <path d="M392 70 L480 50 L480 62 L392 82 Z" fill="#a8a29e" stroke="#57534e" />
          {[0, 1, 2, 3].map((i) => (
            <path key={i} d={`M${402 + i * 20} ${80 - i * 4.5} l0 26 a6 6 0 0 1 12 0 l0 -28`} fill="#a8a29e" stroke="#57534e" />
          ))}
          <path d="M394 74 L480 55" stroke="#38bdf8" strokeWidth="3" />
        </>,
      )}
      {el(
        'arco',
        <>
          <path d="M92 174 L92 140 L120 140 L120 174 L114 174 L114 158 A8 8 0 0 0 98 158 L98 174 Z" fill="#f5f5f4" stroke="#57534e" strokeWidth="2" />
          <rect x="89" y="134" width="34" height="7" fill="#d6d3d1" stroke="#57534e" />
        </>,
      )}
      <Etiquetas
        sitios={{
          foro: [282, 124, 'foro'],
          templo: [179, 128, 'templo'],
          termas: [294, 276, 'termas'],
          teatro: [136, 250, 'teatro'],
          anfiteatro: [438, 284, 'anfiteatro'],
          circo: [142, 30, 'circo'],
          acueduto: [438, 30, 'acueduto'],
          muralla: [420, 140, 'muralla'],
          arco: [106, 198, 'arco de triunfo'],
          cardo: [229, 302, 'cardo'],
          decumano: [36, 161, 'decumano'],
        }}
        marcas={marcas}
        etiquetas={etiquetas}
        tam={13}
      />
    </Svg>
  )
}

// ——— A sociedade romana ———

export const NOMES_SOCIEDADE: Record<string, string> = {
  cidadans: 'os cidadáns',
  libres: 'os homes libres non cidadáns',
  libertos: 'os libertos',
  escravos: 'os escravos',
  mulleres: 'as mulleres libres',
}

/** Unha pirámide de chanzos: cada capa, do máis alto ao máis baixo. */
export function Chanzos({ capas, el, x0 = 150, ancho = 320, alto = 52, y0 = 30 }: { capas: { id: string; cor: string }[]; el: ReturnType<typeof tocable>; x0?: number; ancho?: number; alto?: number; y0?: number }) {
  const n = capas.length
  return (
    <>
      {capas.map((c, i) => {
        const a = ((i + 1) / n) * ancho
        const b = (Math.max(i, 0.35) / n) * ancho
        const y = y0 + i * alto
        const cx = x0 + ancho / 2
        return el(c.id, <path d={`M${cx - b / 2} ${y} L${cx + b / 2} ${y} L${cx + a / 2} ${y + alto} L${cx - a / 2} ${y + alto} Z`} fill={c.cor} stroke="#fff" strokeWidth="3" />)
      })}
    </>
  )
}

export function PiramideRoma({ onToca, marcas = {}, etiquetas = true }: Props) {
  const el = tocable(onToca, marcas)
  return (
    <Svg alto={260} etiqueta="A sociedade romana">
      <rect width="480" height="260" fill="#fffbeb" />
      <Chanzos
        el={el}
        capas={[
          { id: 'cidadans', cor: '#a855f7' },
          { id: 'libres', cor: '#60a5fa' },
          { id: 'libertos', cor: '#34d399' },
          { id: 'escravos', cor: '#a8a29e' },
        ]}
      />
      {el(
        'mulleres',
        <>
          <rect x="14" y="170" width="118" height="64" rx="8" fill="#f9a8d4" stroke="#fff" strokeWidth="3" />
          <text x="73" y="160" textAnchor="middle" fontSize="12" fill="#9d174d" fontWeight="700">
            aparte
          </text>
        </>,
      )}
      <Etiquetas
        sitios={{ cidadans: [310, 62, 'cidadáns'], libres: [310, 114, 'homes libres'], libertos: [310, 166, 'libertos'], escravos: [310, 218, 'escravos'], mulleres: [73, 202, 'mulleres libres'] }}
        marcas={marcas}
        etiquetas={etiquetas}
        tam={14}
      />
    </Svg>
  )
}

// ——— A sociedade de al-Ándalus ———

export const NOMES_ANDALUS: Record<string, string> = {
  arabes: 'os árabes',
  berberes: 'os bérberes',
  muladis: 'os muladís',
  xudeus: 'os xudeus',
  mozarabes: 'os mozárabes',
  escravos: 'os escravos',
}

export function PiramideAndalus({ onToca, marcas = {}, etiquetas = true }: Props) {
  const el = tocable(onToca, marcas)
  // Catro chanzos: no cuarto van xuntos xudeus e mozárabes.
  const cx = 240
  const alto = 50
  const ancho = 400
  const trap = (i: number, de = 0, ata = 1) => {
    const y = 20 + i * alto
    const a = (Math.max(i, 0.35) / 5) * ancho
    const b = ((i + 1) / 5) * ancho
    const xa = (t: number) => cx - a / 2 + a * t
    const xb = (t: number) => cx - b / 2 + b * t
    return `M${xa(de)} ${y} L${xa(ata)} ${y} L${xb(ata)} ${y + alto} L${xb(de)} ${y + alto} Z`
  }
  return (
    <Svg alto={280} etiqueta="A sociedade de al-Ándalus">
      <rect width="480" height="280" fill="#f0fdf4" />
      {el('arabes', <path d={trap(0)} fill="#16a34a" stroke="#fff" strokeWidth="3" />)}
      {el('berberes', <path d={trap(1)} fill="#4ade80" stroke="#fff" strokeWidth="3" />)}
      {el('muladis', <path d={trap(2)} fill="#86efac" stroke="#fff" strokeWidth="3" />)}
      {el('xudeus', <path d={trap(3, 0, 0.5)} fill="#fcd34d" stroke="#fff" strokeWidth="3" />)}
      {el('mozarabes', <path d={trap(3, 0.5, 1)} fill="#fdba74" stroke="#fff" strokeWidth="3" />)}
      {el('escravos', <path d={trap(4)} fill="#a8a29e" stroke="#fff" strokeWidth="3" />)}
      <text x="22" y="100" fontSize="13" fontWeight="800" fill="#166534">
        musulmáns
      </text>
      <text x="22" y="200" fontSize="13" fontWeight="800" fill="#92400e">
        non musulmáns
      </text>
      <Etiquetas
        sitios={{ arabes: [240, 54, 'árabes'], berberes: [240, 98, 'bérberes'], muladis: [240, 148, 'muladís'], xudeus: [190, 198, 'xudeus'], mozarabes: [290, 198, 'mozárabes'], escravos: [240, 248, 'escravos'] }}
        marcas={marcas}
        etiquetas={etiquetas}
        tam={13}
      />
    </Svg>
  )
}

// ——— A mezquita ———

export const NOMES_MEZQUITA: Record<string, string> = {
  minarete: 'o minarete (a torre)',
  patio: 'o patio (sahn)',
  fonte: 'a fonte das ablucións',
  sala: 'a sala de oración (haram)',
  quibla: 'o muro da quibla',
  mihrab: 'o mihrab',
  minbar: 'o minbar',
}

export function Mezquita({ onToca, marcas = {}, etiquetas = true }: Props) {
  const el = tocable(onToca, marcas)
  const columnas: ReactNode[] = []
  for (let x = 262; x <= 420; x += 22) for (let y = 72; y <= 256; y += 23) columnas.push(<circle key={`${x}-${y}`} cx={x} cy={y} r={3} fill="#b45309" />)
  return (
    <Svg alto={300} etiqueta="Planta dunha mezquita">
      <rect width="480" height="300" fill="#e0f2fe" />
      <rect x="40" y="56" width="412" height="214" fill="#fef3c7" stroke="#92400e" strokeWidth="3" />
      {el(
        'patio',
        <>
          <rect x="46" y="62" width="196" height="202" fill="#fde68a" stroke="#d97706" strokeWidth="1.5" />
          <path d="M70 86 h148 M70 240 h148" stroke="#16a34a" strokeWidth="6" strokeDasharray="2 18" strokeLinecap="round" />
        </>,
      )}
      {el(
        'fonte',
        <>
          <circle cx="144" cy="163" r="17" fill="#38bdf8" stroke="#0369a1" strokeWidth="2" />
          <circle cx="144" cy="163" r="5" fill="#e0f2fe" />
        </>,
      )}
      {el(
        'sala',
        <>
          <rect x="246" y="62" width="186" height="202" fill="#fffbeb" stroke="#d97706" strokeWidth="1.5" />
          <g pointerEvents="none">{columnas}</g>
        </>,
      )}
      {el('quibla', <rect x="434" y="56" width="18" height="214" fill="#b45309" />)}
      {el('mihrab', <path d="M452 146 L466 146 A10 17 0 0 1 466 180 L452 180 Z" fill="#f59e0b" stroke="#78350f" strokeWidth="2" />)}
      {el(
        'minbar',
        <>
          <path d="M404 196 L428 196 L428 172 L422 172 L422 180 L416 180 L416 188 L410 188 L410 196" fill="#a16207" stroke="#451a03" strokeWidth="1.5" />
          <rect x="400" y="168" width="32" height="32" fill="transparent" />
        </>,
      )}
      {el(
        'minarete',
        <>
          <rect x="18" y="16" width="40" height="64" fill="#fcd34d" stroke="#92400e" strokeWidth="2" />
          <rect x="24" y="28" width="8" height="12" fill="#92400e" />
          <rect x="44" y="28" width="8" height="12" fill="#92400e" />
          <path d="M14 16 L38 0 L62 16 Z" fill="#16a34a" stroke="#14532d" strokeWidth="1.5" />
        </>,
      )}
      <path d="M470 286 l0 -14 m-6 6 l6 -6 l6 6" stroke="#0369a1" strokeWidth="2" fill="none" />
      <text x="420" y="292" fontSize="11" fill="#0369a1" textAnchor="end">
        cara á Meca →
      </text>
      <Etiquetas
        sitios={{
          minarete: [96, 30, 'minarete'],
          patio: [144, 216, 'patio (sahn)'],
          fonte: [144, 126, 'fonte'],
          sala: [330, 100, 'sala de oración'],
          quibla: [380, 40, 'muro da quibla'],
          mihrab: [440, 128, 'mihrab'],
          minbar: [384, 222, 'minbar'],
        }}
        marcas={marcas}
        etiquetas={etiquetas}
        tam={13}
      />
    </Svg>
  )
}

// ——— As tres civilizacións ———

export const NOMES_CIVILIZACIONS: Record<string, string> = {
  occidente: 'o Occidente cristián',
  bizancio: 'o Imperio bizantino',
  islam: 'o Islam',
}

export function TresCivilizacions({ onToca, marcas = {}, etiquetas = true }: Props) {
  const el = tocable(onToca, marcas)
  const cidade = (x: number, y: number, n: string, a: 'start' | 'end' = 'start') => (
    <g pointerEvents="none" key={n}>
      <circle cx={x} cy={y} r={3.5} fill="#1e293b" />
      <text x={x + (a === 'start' ? 6 : -6)} y={y + 4} fontSize="11" fontWeight="700" fill="#1e293b" textAnchor={a}>
        {n}
      </text>
    </g>
  )
  return (
    <Svg alto={300} etiqueta="As tres civilizacións medievais">
      <rect width="480" height="300" fill="#bae6fd" />
      {el('occidente', <path d="M30 30 L250 18 L262 92 L222 130 L196 118 L176 150 L120 128 L104 150 L60 156 L52 120 L24 112 Z" fill="#60a5fa" stroke="#1e3a8a" strokeWidth="2" strokeLinejoin="round" />)}
      {el('bizancio', <path d="M262 92 L330 70 L410 84 L420 120 L360 142 L322 134 L300 150 L276 128 L250 128 Z" fill="#f472b6" stroke="#831843" strokeWidth="2" strokeLinejoin="round" />)}
      {el(
        'islam',
        <>
          <path d="M40 162 L104 150 L120 168 L96 196 L60 196 Z" fill="#4ade80" stroke="#14532d" strokeWidth="2" strokeLinejoin="round" />
          <path d="M20 232 L120 214 L230 230 L330 212 L360 160 L420 120 L470 140 L470 290 L20 290 Z" fill="#4ade80" stroke="#14532d" strokeWidth="2" strokeLinejoin="round" />
        </>,
      )}
      <text x="220" y="190" fontSize="13" fill="#0c4a6e" fontStyle="italic" pointerEvents="none">
        mar Mediterráneo
      </text>
      {cidade(166, 140, 'Roma', 'end')}
      {cidade(300, 98, 'Constantinopla')}
      {cidade(80, 176, 'Córdoba')}
      {cidade(384, 182, 'Damasco')}
      {cidade(400, 260, 'A Meca')}
      <Etiquetas sitios={{ occidente: [130, 70, 'Occidente'], bizancio: [372, 132, 'Bizancio'], islam: [270, 262, 'Islam'] }} marcas={marcas} etiquetas={etiquetas} tam={15} />
    </Svg>
  )
}

// ——— O Tratado de Verdún ———

export const NOMES_VERDUN: Record<string, string> = {
  carlos: 'o reino de Carlos o Calvo',
  lotario: 'o reino de Lotario',
  luis: 'o reino de Luís o Xermánico',
}

export function Verdun({ onToca, marcas = {}, etiquetas = true }: Props) {
  const el = tocable(onToca, marcas)
  const cidade = (x: number, y: number, n: string) => (
    <g pointerEvents="none" key={n}>
      <circle cx={x} cy={y} r={4} fill="#1e293b" />
      <text x={x + 7} y={y + 4} fontSize="12" fontWeight="700" fill="#1e293b">
        {n}
      </text>
    </g>
  )
  return (
    <Svg alto={300} etiqueta="A división do Imperio carolinxio no Tratado de Verdún">
      <rect width="480" height="300" fill="#bae6fd" />
      {el('carlos', <path d="M40 60 L176 34 L196 92 L178 160 L190 220 L120 230 L60 210 L84 150 L30 110 Z" fill="#e879f9" stroke="#701a75" strokeWidth="2" strokeLinejoin="round" />)}
      {el('lotario', <path d="M176 34 L232 24 L236 100 L254 150 L262 196 L300 230 L320 286 L296 292 L270 240 L236 216 L190 220 L178 160 L196 92 Z" fill="#86efac" stroke="#14532d" strokeWidth="2" strokeLinejoin="round" />)}
      {el('luis', <path d="M232 24 L400 30 L440 120 L380 170 L262 196 L254 150 L236 100 Z" fill="#fdba74" stroke="#7c2d12" strokeWidth="2" strokeLinejoin="round" />)}
      {cidade(130, 92, 'París')}
      {cidade(210, 66, 'Aquisgrán')}
      {cidade(184, 108, 'Verdún')}
      {cidade(290, 262, 'Roma')}
      <text x="340" y="276" fontSize="18" fontWeight="800" fill="#334155" pointerEvents="none">
        843
      </text>
      <Etiquetas sitios={{ carlos: [100, 180, 'Carlos o Calvo'], lotario: [238, 170, 'Lotario'], luis: [340, 90, 'Luís o Xermánico'] }} marcas={marcas} etiquetas={etiquetas} tam={14} />
    </Svg>
  )
}
