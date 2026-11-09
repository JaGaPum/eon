// As seis paradas de «O planeta da vida» (Ciencias da Natureza de 3.º, unidade 1, páxinas 6 a 21 do libro).
import type { ReactNode } from 'react'
import { Busca, Clasifica, Ordena, ParadaPrimaria, Proba, Tarxetas, Une, VerdadeiroFalso, barallar, type Pregunta, type Tarxeta, type Xogo, Xogos } from '../pezas'
import { elixe, toca } from '../paisaxes/preguntas'
import {
  CARTEIS,
  NOME_FORMA,
  NOME_REINO,
  REINOS,
  SERES,
  alimentoDe,
  celulasDe,
  nivelBiodiversidade,
  quenE,
  reinoDe,
  reinoDoCartel,
  seresDo,
  textoAlimento,
  textoCartel,
  textoCelulas,
  type Forma,
  type Reino,
} from '../../lib/seresVivos'
import {
  Celulas,
  CincoReinos,
  DebuxoSer,
  FormasBacterias,
  FuncionsVitais,
  FungoCogomelo,
  GotaDeAuga,
  GruposFungos,
  NOMES_CELULAS,
  NOMES_FORMAS,
  NOMES_FUNCIONS,
  NOMES_FUNGO,
  NOMES_GOTA,
  NOMES_GRUPOS_FUNGOS,
  NOMES_REINOS,
  galeria,
  nomeSer,
} from './debuxos'

const b = (t: ReactNode) => <b className="text-violet-800">{t}</b>
const Seres = ({ ids, tam = 84 }: { ids: string[]; tam?: number }) => (
  <div className="flex flex-wrap justify-center gap-2">
    {ids.map((id) => (
      <DebuxoSer key={id} id={id} tam={tam} />
    ))}
  </div>
)
const Maius = (s: string) => s[0].toUpperCase() + s.slice(1)

// ——— Preguntas que fai o código ———

/** A que reino pertence un ser vivo: a resposta sácase do grupo ao que pertence. */
function preguntaReino(id: string): Pregunta {
  const r = reinoDe(id)
  const outras = REINOS.filter((x) => x !== r).map((x) => NOME_REINO[x])
  return elixe(`A que reino pertence ${nomeSer(id)}?`, NOME_REINO[r], outras.slice(0, 3), `${Maius(nomeSer(id))} pertence ao reino ${r === 'plantas' || r === 'bacterias' ? 'das' : 'dos'} ${r}.`, <Seres ids={[id]} tam={130} />)
}

/** Unha fila cun ser de cada reino, e hai que tocar o do reino que se pide. */
function preguntaGaleria(r: Reino, quenda: number): Pregunta {
  const ids = REINOS.map((x) => {
    const s = seresDo(x)
    return s[(quenda + REINOS.indexOf(x)) % s.length].id
  })
  const correcta = ids[REINOS.indexOf(r)]
  const Debuxo = galeria(barallar(ids))
  return toca(`Toca o ser vivo do ${NOMES_REINOS[r].replace('o reino', 'reino')}.`, Debuxo, Object.fromEntries(ids.map((id) => [id, nomeSer(id)])), correcta, `${Maius(nomeSer(correcta))} é do ${NOMES_REINOS[r].replace('o reino', 'reino')}.`)
}

const NIVEL: Record<string, string> = { baixa: 'Baixa', media: 'Media', alta: 'Alta' }

/** Unha táboa coma a da páxina 16 cos seres vivos que atopou un equipo. */
export const CONTAS: [number, number, number][] = [
  [3, 4, 1],
  [6, 5, 2],
  [12, 9, 3],
  [5, 3, 1],
  [7, 8, 5],
  [10, 6, 5],
  [4, 4, 2],
  [9, 7, 2],
]
function Taboa({ c }: { c: [number, number, number] }) {
  return (
    <table className="mx-auto w-full max-w-md overflow-hidden rounded-xl text-center text-xl">
      <thead>
        <tr className="text-white">
          <th className="bg-rose-500 p-2">ANIMAIS</th>
          <th className="bg-green-600 p-2">PLANTAS</th>
          <th className="bg-orange-500 p-2">OUTROS REINOS</th>
        </tr>
      </thead>
      <tbody>
        <tr className="font-bold">
          <td className="bg-rose-50 p-2">{c[0]}</td>
          <td className="bg-green-50 p-2">{c[1]}</td>
          <td className="bg-orange-50 p-2">{c[2]}</td>
        </tr>
      </tbody>
    </table>
  )
}
export function preguntaBiodiversidade(c: [number, number, number]): Pregunta {
  const total = c[0] + c[1] + c[2]
  const nivel = nivelBiodiversidade(total)
  return elixe(
    'Un equipo anotou estes seres vivos no patio. Como é a biodiversidade do lugar?',
    NIVEL[nivel],
    Object.values(NIVEL).filter((n) => n !== NIVEL[nivel]),
    `${c[0]} + ${c[1]} + ${c[2]} = ${total} seres vivos. ${total < 10 ? 'Menos de 10' : total <= 20 ? 'Entre 10 e 20' : 'Máis de 20'}: a biodiversidade é ${nivel}.`,
    <Taboa c={c} />,
  )
}

/** Que seres vivos describe un cartel (páxina 21): o grupo e o reino calcúlaos o código. */
export function preguntaCartel(c: (typeof CARTEIS)[number]): Pregunta {
  const r = reinoDoCartel(c)!
  const grupos = quenE(c).map((g) => g.nome)
  return elixe(
    <>
      Que seres vivos describe este cartel?
      <span className="mt-2 block rounded-2xl border-2 border-dashed border-violet-300 bg-white px-4 py-2 text-violet-900">«{textoCartel(c)}»</span>
    </>,
    NOME_REINO[r],
    REINOS.filter((x) => x !== r).map((x) => NOME_REINO[x]).slice(0, 3),
    `Son ${grupos.join(' e ')}, do reino ${r === 'plantas' || r === 'bacterias' ? 'das' : 'dos'} ${r}.`,
  )
}

// ——— 1. Que é un ser vivo? (páxinas 6 a 9) ———

const TARXETAS_SER: Tarxeta[] = [
  {
    titulo: 'O planeta da vida',
    texto: (
      <>
        <p>A {b('Terra')} é o único planeta coñecido en que hai vida. {b('Millóns de seres vivos')} diferentes habítana, entre eles, as persoas.</p>
        <p>
          Os seres vivos {b('dependen uns doutros')}. Por iso é tan importante a supervivencia de todos eles.
        </p>
      </>
    ),
    visual: <Seres ids={['pinguin', 'amanita', 'polbo', 'xirasol', 'algaMicro', 'persoa']} tam={76} />,
  },
  {
    titulo: 'Que teñen en común os seres vivos?',
    texto: (
      <>
        <p>Os seres vivos teñen {b('dúas cousas')} en común:</p>
        <p>
          1️⃣ Realizan as tres {b('funcións vitais')}: nutrición, relación e reprodución.
        </p>
        <p>2️⃣ Están formados por {b('células')}.</p>
      </>
    ),
    visual: <FuncionsVitais />,
  },
  {
    titulo: 'A nutrición',
    texto: (
      <>
        <p>
          Mediante a función de {b('nutrición')}, os seres vivos {b('toman alimentos')} e conseguen deles todo o que necesitan.
        </p>
        <p className="text-base text-slate-600">💡 O coello come unha cenoria: está a nutrirse.</p>
      </>
    ),
    visual: <FuncionsVitais marcas={{ nutricion: 'ben' }} />,
  },
  {
    titulo: 'A relación',
    texto: (
      <>
        <p>
          Grazas á función de {b('relación')}, os seres vivos {b('obteñen información do contorno')} e {b('responden a ela')}.
        </p>
        <p className="text-base text-slate-600">💡 O paxaro ve o gato (información) e voa para fuxir (responde).</p>
      </>
    ),
    visual: <FuncionsVitais marcas={{ relacion: 'ben' }} />,
  },
  {
    titulo: 'A reprodución',
    texto: (
      <>
        <p>
          Grazas á {b('reprodución')}, os seres vivos {b('orixinan outros seres vivos similares a eles')}.
        </p>
        <p className="text-base text-slate-600">💡 Da semente nace unha planta nova.</p>
      </>
    ),
    visual: <FuncionsVitais marcas={{ reproducion: 'ben' }} />,
  },
  {
    titulo: 'Os seres vivos están formados por células',
    texto: (
      <>
        <p>
          Os seres vivos están formados por un montón de partes moi pequenas. Son as {b('células')}, que son tan diminutas que para velas cómpre empregar un {b('microscopio')}.
        </p>
        <p className="text-base text-slate-600">🔬 No libro, os seres que só se ven co microscopio levan este símbolo. Aquí van dentro dun círculo azul.</p>
      </>
    ),
    visual: <Celulas />,
  },
  {
    titulo: 'Unicelulares',
    texto: (
      <>
        <p>
          Os seres vivos {b('unicelulares')} están formados por {b('unha soa célula')}. Só se poden ver {b('cun microscopio')}.
        </p>
        <p>
          Atópanse por todas as partes. Nunha soa {b('gota de auga dun charco')} pode haber millóns de seres unicelulares.
        </p>
      </>
    ),
    visual: <Seres ids={['ameba', 'bacteriaIogur', 'fermento', 'algaMicro']} />,
  },
  {
    titulo: 'Pluricelulares',
    texto: (
      <>
        <p>
          Os seres vivos {b('pluricelulares')} están formados por {b('un gran número de células')}. {b('A maioría')} poden verse a simple vista.
        </p>
        <p>
          Os {b('animais')} e as {b('plantas')} son seres vivos pluricelulares.
        </p>
        <p className="text-base text-slate-600">💡 As árbores son plantas e as persoas somos animais: todos pluricelulares.</p>
      </>
    ),
    visual: <Seres ids={['xirafa', 'arbore', 'persoa', 'bolboreta']} />,
  },
]

const UNI_PLURI = SERES.filter((s) => !['champinon', 'algaVermella', 'protozoo', 'bacteriaTetano'].includes(s.id))

const PREGUNTAS_SER: Pregunta[] = [
  elixe('Que dúas cousas teñen en común todos os seres vivos?', 'Realizan as funcións vitais e están formados por células', ['Móvense e comen plantas', 'Viven na auga e teñen ollos'], 'Os seres vivos realizan as tres funcións vitais e están formados por células.'),
  elixe('Cantas funcións vitais hai?', 'Tres', ['Dúas', 'Cinco'], 'Nutrición, relación e reprodución.'),
  elixe('Cal destas NON é unha función vital?', 'O xogo', ['A nutrición', 'A relación', 'A reprodución'], 'As tres funcións vitais son nutrición, relación e reprodución.'),
  elixe('Que función vital é tomar alimentos e conseguir deles o que se necesita?', 'A nutrición', ['A relación', 'A reprodución'], 'Mediante a nutrición, os seres vivos toman alimentos.'),
  elixe('Que función vital é obter información do contorno e responder a ela?', 'A relación', ['A nutrición', 'A reprodución'], 'Pola relación, os seres vivos obteñen información do contorno e responden a ela.'),
  elixe('Que función vital é orixinar outros seres vivos similares?', 'A reprodución', ['A nutrición', 'A relación'], 'Grazas á reprodución, os seres vivos orixinan outros seres vivos similares a eles.'),
  elixe('Unha lebre oe un ruído e foxe correndo. Que función vital é?', 'A relación', ['A nutrición', 'A reprodución'], 'Obtén información (o ruído) e responde (foxe): é a relación.'),
  elixe('Unha vaca come herba. Que función vital é?', 'A nutrición', ['A relación', 'A reprodución'], 'Toma alimento: é a nutrición.'),
  elixe('Dunha semente nace unha planta nova. Que función vital é?', 'A reprodución', ['A nutrición', 'A relación'], 'Orixina un ser vivo similar: é a reprodución.'),
  elixe('Que son as células?', 'As partes moi pequenas que forman os seres vivos', ['Os ósos dos animais', 'As follas das plantas'], 'Os seres vivos están formados por un montón de partes moi pequenas: as células.'),
  elixe('Que cómpre para ver as células?', 'Un microscopio', ['Uns prismáticos', 'Nada, vense ben a simple vista'], 'As células son tan diminutas que cómpre un microscopio.'),
  elixe('Como son os seres vivos formados por unha soa célula?', 'Unicelulares', ['Pluricelulares', 'Microscopios'], 'Uni = un. Os unicelulares teñen unha soa célula.'),
  elixe('Como son os animais e as plantas?', 'Pluricelulares', ['Unicelulares'], 'Os animais e as plantas están formados por un gran número de células.'),
  elixe('Que pode haber nunha gota de auga dun charco?', 'Millóns de seres unicelulares', ['Ningún ser vivo', 'Só auga e area'], 'Os unicelulares atópanse por todas as partes.'),
  elixe('Os seres pluricelulares… vense todos a simple vista?', 'Non: a maioría si, pero non todos', ['Si, todos', 'Non, ningún'], 'O libro di que a maioría dos pluricelulares poden verse a simple vista.'),
  elixe('A que grupo de seres vivos pertencen as árbores?', 'Ás plantas', ['Aos animais', 'Aos fungos'], 'As árbores son plantas.'),
  elixe('A que grupo de seres vivos pertencemos as persoas?', 'Aos animais', ['Ás plantas', 'Ás bacterias'], 'As persoas somos animais.'),
  elixe('Como é a Terra?', 'O único planeta coñecido en que hai vida', ['Un planeta sen auga', 'Un dos moitos planetas con vida que coñecemos'], 'A Terra é o único planeta coñecido en que hai vida.'),
  toca('Toca onde se ve a nutrición.', FuncionsVitais, NOMES_FUNCIONS, 'nutricion', 'O coello come: é a nutrición.'),
  toca('Toca onde se ve a relación.', FuncionsVitais, NOMES_FUNCIONS, 'relacion', 'O paxaro ve o gato e foxe: é a relación.'),
  toca('Toca onde se ve a reprodución.', FuncionsVitais, NOMES_FUNCIONS, 'reproducion', 'Da semente nace unha planta: é a reprodución.'),
  toca('Toca o ser vivo unicelular.', Celulas, NOMES_CELULAS, 'uni', 'Ten unha soa célula e só se ve co microscopio.'),
  toca('Toca o ser vivo pluricelular.', Celulas, NOMES_CELULAS, 'pluri', 'A folla está feita de moitas células.'),
]

const XOGOS_SER: Xogo[] = [
  {
    id: 'funcions',
    titulo: 'As funcións vitais',
    icono: '🐇',
    explica: 'Toca a escena que che pida.',
    crear: (acabar) => <Busca Debuxo={FuncionsVitais} nomes={NOMES_FUNCIONS} obxectivos={Object.keys(NOMES_FUNCIONS)} acabar={acabar} />,
  },
  {
    id: 'cal',
    titulo: 'Que función é?',
    icono: '🌱',
    explica: 'Nutrición, relación ou reprodución?',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'nutricion', nome: 'Nutrición', cor: 'border-amber-300 bg-amber-100' },
          { id: 'relacion', nome: 'Relación', cor: 'border-sky-300 bg-sky-100' },
          { id: 'reproducion', nome: 'Reprodución', cor: 'border-green-300 bg-green-100' },
        ]}
        elementos={[
          { texto: 'o gorila come follas', caixa: 'nutricion' },
          { texto: 'a vaca pace herba', caixa: 'nutricion' },
          { texto: 'a planta toma auga da terra', caixa: 'nutricion' },
          { texto: 'o gato ve un rato e corre', caixa: 'relacion' },
          { texto: 'o xirasol xira cara ao sol', caixa: 'relacion' },
          { texto: 'a lebre oe un ruído e foxe', caixa: 'relacion' },
          { texto: 'dunha semente nace unha planta', caixa: 'reproducion' },
          { texto: 'a galiña pon ovos', caixa: 'reproducion' },
          { texto: 'a gata ten gatiños', caixa: 'reproducion' },
        ]}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'celulas',
    titulo: 'Unha célula ou moitas?',
    icono: '🔬',
    explica: 'Unicelular ou pluricelular?',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'uni', nome: 'Unicelulares (unha soa célula)', cor: 'border-sky-300 bg-sky-100' },
          { id: 'pluri', nome: 'Pluricelulares (moitas células)', cor: 'border-green-300 bg-green-100' },
        ]}
        elementos={[...UNI_PLURI.map((s) => ({ texto: s.nome, caixa: s.micro ? 'uni' : 'pluri' })), { texto: 'a persoa', caixa: 'pluri' }]}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'une',
    titulo: 'Que significa?',
    icono: '🔗',
    explica: 'Une cada palabra co seu significado.',
    crear: (acabar) => (
      <Une
        pares={[
          { palabra: 'célula', significado: 'Parte moi pequena que forma os seres vivos.' },
          { palabra: 'unicelular', significado: 'Formado por unha soa célula.' },
          { palabra: 'pluricelular', significado: 'Formado por un gran número de células.' },
          { palabra: 'nutrición', significado: 'Tomar alimentos e conseguir deles o que se necesita.' },
          { palabra: 'relación', significado: 'Obter información do contorno e responder a ela.' },
          { palabra: 'reprodución', significado: 'Orixinar outros seres vivos similares.' },
        ]}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'vf',
    titulo: 'Verdadeiro ou falso?',
    icono: '🌍',
    explica: 'Que é un ser vivo?',
    crear: (acabar) => (
      <VerdadeiroFalso
        frases={[
          { texto: 'A Terra é o único planeta coñecido en que hai vida.', certa: true, explica: 'Si, e habítana millóns de seres vivos diferentes.' },
          { texto: 'Os seres vivos non dependen uns doutros.', certa: false, explica: 'Si dependen uns doutros: por iso é tan importante a supervivencia de todos.' },
          { texto: 'Todos os seres vivos están formados por células.', certa: true, explica: 'Si: é unha das dúas cousas que teñen en común.' },
          { texto: 'As células vense ben a simple vista.', certa: false, explica: 'Son tan diminutas que cómpre un microscopio.' },
          { texto: 'Os unicelulares só se poden ver cun microscopio.', certa: true, explica: 'Si: teñen unha soa célula.' },
          { texto: 'Os animais e as plantas son unicelulares.', certa: false, explica: 'Son pluricelulares: teñen un gran número de células.' },
          { texto: 'Os seres unicelulares atópanse por todas as partes.', certa: true, explica: 'Si: nunha gota de auga pode haber millóns.' },
          { texto: 'Hai catro funcións vitais.', certa: false, explica: 'Son tres: nutrición, relación e reprodución.' },
        ]}
        acabar={acabar}
      />
    ),
  },
]

export function SerVivo({ ruta, modo }: { ruta: string; modo?: string }) {
  return (
    <ParadaPrimaria
      ruta={ruta}
      titulo="Que é un ser vivo?"
      modo={modo}
      paneis={{
        descubre: <Tarxetas tarxetas={TARXETAS_SER} xoga={`${ruta}/xoga`} />,
        xoga: <Xogos xogos={XOGOS_SER} proba={`${ruta}/proba`} />,
        proba: <Proba id="planeta/servivo" preguntas={PREGUNTAS_SER} />,
      }}
    />
  )
}

// ——— 2. Os reinos da vida (páxinas 10 e 11) ———

const CARACTERISTICA: Record<Reino, ReactNode> = {
  plantas: (
    <ul className="list-disc space-y-1 pl-6">
      <li>Son {b('pluricelulares')}.</li>
      <li>{b('Fabrican o seu alimento')} a partir do aire, a auga e substancias da terra.</li>
      <li>{b('Non se desprazan')}, xa que están fixas á terra.</li>
    </ul>
  ),
  animais: (
    <ul className="list-disc space-y-1 pl-6">
      <li>Son {b('pluricelulares')}.</li>
      <li>{b('Non poden fabricar o seu alimento')}. Por iso, aliméntanse doutros seres vivos.</li>
      <li>A maioría dos animais {b('pódense desprazar')}.</li>
    </ul>
  ),
  fungos: (
    <ul className="list-disc space-y-1 pl-6">
      <li>Poden ser {b('pluricelulares ou unicelulares')}.</li>
      <li>{b('Deben tomar o seu alimento')}. Moitas veces son restos doutros seres vivos.</li>
      <li>{b('Non se desprazan')}.</li>
    </ul>
  ),
  bacterias: (
    <ul className="list-disc space-y-1 pl-6">
      <li>Son {b('unicelulares')}.</li>
      <li>Algunhas {b('fabrican o seu propio alimento')} e outras {b('teñen que tomalo')}.</li>
    </ul>
  ),
  protistas: (
    <ul className="list-disc space-y-1 pl-6">
      <li>Son un grupo de seres vivos que {b('non pertencen a ningún dos outros catro reinos')}.</li>
      <li>Algúns son pluricelulares e outros son unicelulares.</li>
      <li>Algúns fabrican o seu propio alimento e outros téñeno que conseguir.</li>
    </ul>
  ),
}

const TARXETAS_REINOS: Tarxeta[] = [
  {
    titulo: 'Que é un reino?',
    texto: (
      <>
        <p>Hai seres vivos que se parecen moito entre si, é dicir, teñen varias características comúns.</p>
        <p>
          Para estudalos, os seres vivos que son parecidos agrúpanse nun mesmo {b('reino')}. Deste xeito, clasificámolos en {b('cinco reinos')}.
        </p>
      </>
    ),
    visual: <CincoReinos />,
    ancho: true,
  },
  ...(['plantas', 'animais', 'fungos', 'bacterias', 'protistas'] as Reino[]).map((r) => ({
    titulo: `Reino ${r === 'plantas' || r === 'bacterias' ? 'das' : 'dos'} ${r}`,
    texto: (
      <>
        {CARACTERISTICA[r]}
        {r === 'protistas' && <p className="text-base text-slate-600">🤔 Chámanlle o {b('quinto reino')} porque inclúe seres vivos moi diversos.</p>}
      </>
    ),
    visual: <Seres ids={seresDo(r).map((s) => s.id).slice(0, 4)} tam={88} />,
  })),
  {
    titulo: 'A táboa dos cinco reinos',
    texto: (
      <table className="w-full text-left text-base">
        <thead>
          <tr className="bg-slate-800 text-white">
            <th className="p-2">Reino</th>
            <th className="p-2">Número de células</th>
            <th className="p-2">Alimentación</th>
          </tr>
        </thead>
        <tbody>
          {(['animais', 'plantas', 'fungos', 'protistas', 'bacterias'] as Reino[]).map((r, i) => (
            <tr key={r} className={['bg-rose-50', 'bg-green-50', 'bg-orange-50', 'bg-violet-50', 'bg-sky-50'][i]}>
              <td className="p-2 font-bold">{NOME_REINO[r]}</td>
              <td className="p-2">{textoCelulas(celulasDe(r))}</td>
              <td className="p-2">{textoAlimento(alimentoDe(r))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ),
  },
]

const SOLO_ESTES = ['amapola', 'arbore', 'palmeira', 'xirasol', 'paporrubio', 'pinguin', 'bolboreta', 'xirafa', 'polbo', 'niscaro', 'amanita', 'champinon', 'mofo', 'ameba', 'algaVerde', 'algaVermella', 'bacteriaIogur', 'bacteriaTetano']

const PREGUNTAS_REINOS: Pregunta[] = [
  elixe('En cantos reinos se clasifican os seres vivos?', 'Cinco', ['Tres', 'Dous'], 'Plantas, animais, fungos, protistas e bacterias.'),
  elixe('Que é un reino?', 'Un grupo de seres vivos que se parecen moito entre si', ['Un país cun rei', 'Unha célula moi grande'], 'Os seres vivos parecidos agrúpanse nun mesmo reino.'),
  elixe('Que reino fabrica o seu alimento a partir do aire, a auga e substancias da terra?', 'Plantas', ['Animais', 'Fungos'], 'As plantas fabrican o seu alimento.'),
  elixe('Por que os animais se alimentan doutros seres vivos?', 'Porque non poden fabricar o seu alimento', ['Porque non se desprazan', 'Porque son unicelulares'], 'Os animais non poden fabricar o seu alimento.'),
  elixe('Por que as plantas non se desprazan?', 'Porque están fixas á terra', ['Porque son unicelulares', 'Porque non comen'], 'As plantas están fixas á terra.'),
  elixe('De que se alimentan moitas veces os fungos?', 'De restos doutros seres vivos', ['Do aire', 'Da luz do sol'], 'Os fungos deben tomar o seu alimento; moitas veces son restos doutros seres vivos.'),
  elixe('Como son as bacterias?', 'Unicelulares', ['Pluricelulares', 'Unicelulares ou pluricelulares'], 'As bacterias son unicelulares.'),
  elixe('Que reino ten seres que non pertencen a ningún dos outros catro?', 'Protistas', ['Fungos', 'Bacterias'], 'Os protistas non pertencen a ningún dos outros catro reinos.'),
  elixe('Que reino chaman o «quinto reino» porque inclúe seres vivos moi diversos?', 'Protistas', ['Plantas', 'Animais'], 'Os protistas son moi diversos: uns son unicelulares e outros pluricelulares, uns fabrican o seu alimento e outros non.'),
  elixe('En que reinos hai seres unicelulares e tamén pluricelulares?', 'Fungos e protistas', ['Plantas e animais', 'Só bacterias'], 'Os fungos e os protistas poden ser unicelulares ou pluricelulares.'),
  elixe('A amanita e a bolboreta, en que se parecen?', 'Os dous toman o seu alimento', ['Os dous se desprazan', 'Os dous fabrican o seu alimento'], 'O fungo e o animal toman o seu alimento; pero o fungo non se despraza e a bolboreta si.'),
  elixe('A papoula e o cogomelo, en que se diferencian?', 'A papoula fabrica o seu alimento e o fungo non', ['A papoula é unicelular', 'O cogomelo vive na auga'], 'As plantas fabrican o seu alimento; os fungos deben tomalo.'),
  elixe('O pingüín e a árbore, en que se parecen?', 'Os dous son pluricelulares', ['Os dous fabrican o seu alimento', 'Os dous se desprazan'], 'Animais e plantas son pluricelulares; pero a árbore fabrica o seu alimento e está fixa á terra.'),
  ...SOLO_ESTES.map(preguntaReino),
  ...REINOS.map((r, i) => preguntaGaleria(r, i)),
]

const XOGOS_REINOS: Xogo[] = [
  {
    id: 'busca',
    titulo: 'Os cinco reinos',
    icono: '👑',
    explica: 'Toca o reino que che pida.',
    crear: (acabar) => <Busca Debuxo={CincoReinos} nomes={NOMES_REINOS} obxectivos={[...REINOS]} acabar={acabar} />,
  },
  {
    id: 'clasifica',
    titulo: 'Cada ser no seu reino',
    icono: '🗂️',
    explica: 'Toca un ser vivo e despois o seu reino.',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'plantas', nome: 'Plantas', cor: 'border-green-300 bg-green-100' },
          { id: 'animais', nome: 'Animais', cor: 'border-rose-300 bg-rose-100' },
          { id: 'fungos', nome: 'Fungos', cor: 'border-amber-300 bg-amber-100' },
          { id: 'protistas', nome: 'Protistas', cor: 'border-violet-300 bg-violet-100' },
          { id: 'bacterias', nome: 'Bacterias', cor: 'border-teal-300 bg-teal-100' },
        ]}
        elementos={barallar(SOLO_ESTES)
          .slice(0, 10)
          .map((id) => ({ texto: nomeSer(id), caixa: reinoDe(id) }))}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'celulas',
    titulo: 'A táboa: as células',
    icono: '🔬',
    explica: 'Cantas células teñen os seres de cada reino?',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'Unicelulares', nome: 'Unicelulares', cor: 'border-sky-300 bg-sky-100' },
          { id: 'Pluricelulares', nome: 'Pluricelulares', cor: 'border-green-300 bg-green-100' },
          { id: 'Unicelulares ou pluricelulares', nome: 'Uns e outros', cor: 'border-violet-300 bg-violet-100' },
        ]}
        elementos={REINOS.map((r) => ({ texto: NOME_REINO[r], caixa: textoCelulas(celulasDe(r)) }))}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'alimento',
    titulo: 'A táboa: o alimento',
    icono: '🍽️',
    explica: 'Fabrican o seu alimento ou téñeno que tomar?',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: textoAlimento(['fabrican']), nome: 'Fabrican o seu alimento', cor: 'border-green-300 bg-green-100' },
          { id: textoAlimento(['toman']), nome: 'Toman o alimento', cor: 'border-rose-300 bg-rose-100' },
          { id: textoAlimento(['fabrican', 'toman']), nome: 'Algúns fabrícano e outros tómano', cor: 'border-violet-300 bg-violet-100' },
        ]}
        elementos={REINOS.map((r) => ({ texto: NOME_REINO[r], caixa: textoAlimento(alimentoDe(r)) }))}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'vf',
    titulo: 'Verdadeiro ou falso?',
    icono: '🦋',
    explica: 'As características de cada reino.',
    crear: (acabar) => (
      <VerdadeiroFalso
        frases={[
          { texto: 'As plantas fabrican o seu alimento.', certa: true, explica: 'Si: a partir do aire, a auga e substancias da terra.' },
          { texto: 'Os animais fabrican o seu alimento.', certa: false, explica: 'Non poden: por iso se alimentan doutros seres vivos.' },
          { texto: 'A maioría dos animais pódense desprazar.', certa: true, explica: 'Si.' },
          { texto: 'Os fungos desprázanse dun sitio a outro.', certa: false, explica: 'Os fungos non se desprazan.' },
          { texto: 'Os fungos poden ser unicelulares ou pluricelulares.', certa: true, explica: 'Si: hai fungos de unha célula (os fermentos) e de moitas.' },
          { texto: 'As bacterias son pluricelulares.', certa: false, explica: 'As bacterias son unicelulares.' },
          { texto: 'Algunhas bacterias fabrican o seu alimento.', certa: true, explica: 'Algunhas fabrícano e outras teñen que tomalo.' },
          { texto: 'Os protistas son todos unicelulares.', certa: false, explica: 'Algúns son pluricelulares e outros unicelulares.' },
        ]}
        acabar={acabar}
      />
    ),
  },
]

export function Reinos({ ruta, modo }: { ruta: string; modo?: string }) {
  return (
    <ParadaPrimaria
      ruta={ruta}
      titulo="Os reinos da vida"
      modo={modo}
      paneis={{
        descubre: <Tarxetas tarxetas={TARXETAS_REINOS} xoga={`${ruta}/xoga`} />,
        xoga: <Xogos xogos={XOGOS_REINOS} proba={`${ruta}/proba`} />,
        proba: <Proba id="planeta/reinos" preguntas={PREGUNTAS_REINOS} />,
      }}
    />
  )
}

// ——— 3. Os fungos (páxinas 12 e 13) ———

const TARXETAS_FUNGOS: Tarxeta[] = [
  {
    titulo: 'Os fungos: nin plantas nin animais',
    texto: (
      <>
        <p>
          🌿 Igual ca as plantas, os fungos {b('non se desprazan')} e moitos deles {b('viven na terra')}.
        </p>
        <p>
          🐾 Como os animais, os fungos {b('deben tomar alimento')}.
        </p>
      </>
    ),
    visual: <Seres ids={['niscaro', 'amanita', 'mofo', 'fermento']} tam={88} />,
  },
  {
    titulo: 'Os grupos de fungos',
    texto: (
      <>
        <p>Hai numerosos fungos que podemos clasificar en varios grupos:</p>
        <p>
          {b('Pluricelulares')}: os {b('fungos con cogomelo')} e os {b('mofos')}.
        </p>
        <p>
          {b('Unicelulares')}: os máis coñecidos son os {b('fermentos')}.
        </p>
      </>
    ),
    visual: <GruposFungos />,
  },
  {
    titulo: 'Os fungos con cogomelo',
    texto: (
      <>
        <p>
          A maioría {b('vive baixo a terra')} alimentándose de {b('restos doutros seres vivos')}.
        </p>
        <p>
          Nalgunhas épocas forman {b('cogomelos')}, que interveñen na súa {b('reprodución')}.
        </p>
        <p className="text-base text-slate-600">🤔 Entón, o cogomelo que vemos non é todo o fungo: é só unha parte. O resto está baixo a terra.</p>
      </>
    ),
    visual: <FungoCogomelo />,
  },
  {
    titulo: 'Os mofos e os fermentos',
    texto: (
      <>
        <p>
          Os {b('mofos')} forman unha especie de {b('peluxe')} sobre o pan, as froitas ou os restos que lles serven de alimento.
        </p>
        <p>
          Os {b('fermentos')} son fungos {b('unicelulares')} que se empregan para {b('fabricar alimentos')}.
        </p>
      </>
    ),
    visual: <Seres ids={['mofo', 'fermento']} tam={130} />,
  },
  {
    titulo: 'A importancia dos fungos',
    texto: (
      <>
        <p>Os fungos son moi importantes tanto para as persoas coma para os demais seres vivos:</p>
        <p>🍞 Hai fungos que participan na elaboración de alimentos, como os {b('fermentos do pan')}.</p>
        <p>🍄 Moitos producen {b('cogomelos comestibles')}, como os {b('níscaros')}.</p>
      </>
    ),
    visual: <Seres ids={['fermento', 'niscaro']} tam={130} />,
  },
  {
    titulo: 'Coidado cos fungos!',
    texto: (
      <>
        <p>🤒 Algúns fungos poden causar {b('enfermidades')}, especialmente {b('na pel')}.</p>
        <p>
          ☠️ Hai fungos que producen {b('cogomelos velenosos')}, como a <i>Amanita phalloides</i>.
        </p>
        <p className="text-base text-slate-600">⚠️ Nunca toques nin comas un cogomelo do monte sen un adulto que o coñeza.</p>
      </>
    ),
    visual: <Seres ids={['amanita']} tam={150} />,
  },
  {
    titulo: 'Os fungos limpan o solo',
    texto: (
      <>
        <p>
          Os fungos {b('descompoñen os restos')} doutros seres vivos do solo en {b('substancias simples')}.
        </p>
        <p>
          As {b('plantas')} utilizan estas substancias para {b('fabricar o seu alimento')}.
        </p>
      </>
    ),
    visual: <FungoCogomelo marcas={{ restos: 'ben' }} />,
  },
]

const PREGUNTAS_FUNGOS: Pregunta[] = [
  elixe('En que se parecen os fungos ás plantas?', 'En que non se desprazan', ['En que fabrican o seu alimento', 'En que teñen flores'], 'Igual ca as plantas, os fungos non se desprazan e moitos viven na terra.'),
  elixe('En que se parecen os fungos aos animais?', 'En que deben tomar alimento', ['En que se desprazan', 'En que teñen ósos'], 'Como os animais, os fungos deben tomar alimento.'),
  elixe('Que grupos de fungos son pluricelulares?', 'Os fungos con cogomelo e os mofos', ['Os fermentos', 'Ningún'], 'Os fungos con cogomelo e os mofos son pluricelulares.'),
  elixe('Cales son os fungos unicelulares máis coñecidos?', 'Os fermentos', ['Os mofos', 'Os níscaros'], 'Os fermentos son unicelulares.'),
  elixe('Onde vive a maioría dos fungos con cogomelo?', 'Baixo a terra', ['Dentro da auga do mar', 'No aire'], 'Viven baixo a terra alimentándose de restos doutros seres vivos.'),
  elixe('Para que serven os cogomelos ao fungo?', 'Interveñen na súa reprodución', ['Para desprazarse', 'Para fabricar o seu alimento'], 'Os cogomelos interveñen na reprodución do fungo.'),
  elixe('O que vemos no monte, que é: un cogomelo ou un fungo enteiro?', 'Un cogomelo, só unha parte do fungo', ['O fungo enteiro', 'Unha planta'], 'A maior parte do fungo está baixo a terra. O cogomelo é a parte que sae nalgunhas épocas.'),
  elixe('Que forman os mofos sobre o pan e as froitas?', 'Unha especie de peluxe', ['Flores', 'Cogomelos vermellos'], 'Os mofos forman unha especie de peluxe.'),
  elixe('Para que se empregan os fermentos?', 'Para fabricar alimentos, como o pan', ['Para curar a pel', 'Para fabricar plástico'], 'Os fermentos do pan son fungos.'),
  elixe('Cal destes cogomelos é comestible, segundo o libro?', 'O níscaro', ['A Amanita phalloides'], 'Os níscaros son comestibles; a Amanita phalloides é velenosa.'),
  elixe('Que pode causar algún fungo?', 'Enfermidades, especialmente na pel', ['Que chova', 'Que medren os ósos'], 'Algúns fungos poden causar enfermidades, especialmente na pel.'),
  elixe('Que fan os fungos cos restos doutros seres vivos do solo?', 'Descompóñenos en substancias simples', ['Gárdanos para o inverno', 'Convérteos en pedras'], 'E as plantas usan esas substancias para fabricar o seu alimento.'),
  elixe('Por que é bo que os fungos descompoñan os restos?', 'Porque as plantas usan esas substancias para fabricar o seu alimento', ['Porque así os fungos se desprazan', 'Porque fan desaparecer a auga'], 'As substancias simples serven ás plantas para fabricar o seu alimento.'),
  elixe('Como se chama o cogomelo velenoso do libro?', 'Amanita phalloides', ['Níscaro', 'Fermento'], 'A Amanita phalloides produce cogomelos velenosos.'),
  toca('Toca o cogomelo.', FungoCogomelo, NOMES_FUNGO, 'cogomelo', 'O cogomelo é a parte que sae por riba da terra.'),
  toca('Toca a parte do fungo que vive baixo a terra.', FungoCogomelo, NOMES_FUNGO, 'fungo', 'A maior parte do fungo vive baixo a terra.'),
  toca('Toca o grupo dos fungos unicelulares.', GruposFungos, NOMES_GRUPOS_FUNGOS, 'fermento', 'Os fermentos son unicelulares.'),
  toca('Toca os mofos.', GruposFungos, NOMES_GRUPOS_FUNGOS, 'mofo', 'O mofo forma unha peluxe sobre o pan.'),
]

const XOGOS_FUNGOS: Xogo[] = [
  {
    id: 'grupos',
    titulo: 'Os grupos de fungos',
    icono: '🍄',
    explica: 'Toca o grupo que che pida.',
    crear: (acabar) => <Busca Debuxo={GruposFungos} nomes={NOMES_GRUPOS_FUNGOS} obxectivos={Object.keys(NOMES_GRUPOS_FUNGOS)} acabar={acabar} />,
  },
  {
    id: 'cogomelo',
    titulo: 'Cogomelo ou fungo?',
    icono: '🔍',
    explica: 'Toca no debuxo o que che pida.',
    crear: (acabar) => <Busca Debuxo={FungoCogomelo} nomes={NOMES_FUNGO} obxectivos={Object.keys(NOMES_FUNGO)} acabar={acabar} />,
  },
  {
    id: 'importancia',
    titulo: 'Bos ou malos para nós?',
    icono: '⚖️',
    explica: 'Que fungos nos axudan e cales nos fan dano?',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'ben', nome: 'Axúdannos 😊', cor: 'border-green-300 bg-green-100' },
          { id: 'mal', nome: 'Fannos dano ⚠️', cor: 'border-rose-300 bg-rose-100' },
        ]}
        elementos={[
          { texto: 'os fermentos do pan', caixa: 'ben' },
          { texto: 'os níscaros comestibles', caixa: 'ben' },
          { texto: 'descompoñer os restos do solo', caixa: 'ben' },
          { texto: 'enfermidades na pel', caixa: 'mal' },
          { texto: 'a Amanita phalloides', caixa: 'mal' },
          { texto: 'os cogomelos velenosos', caixa: 'mal' },
        ]}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'une',
    titulo: 'Que significa?',
    icono: '🔗',
    explica: 'Une cada palabra co seu significado.',
    crear: (acabar) => (
      <Une
        pares={[
          { palabra: 'cogomelo', significado: 'O que forma o fungo nalgunhas épocas para reproducirse.' },
          { palabra: 'mofo', significado: 'Fungo que fai unha peluxe sobre o pan e as froitas.' },
          { palabra: 'fermento', significado: 'Fungo unicelular que serve para fabricar alimentos.' },
          { palabra: 'níscaro', significado: 'Cogomelo comestible.' },
          { palabra: 'Amanita phalloides', significado: 'Cogomelo velenoso.' },
        ]}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'vf',
    titulo: 'Verdadeiro ou falso?',
    icono: '🍞',
    explica: 'Os fungos.',
    crear: (acabar) => (
      <VerdadeiroFalso
        frases={[
          { texto: 'Os fungos fabrican o seu alimento coma as plantas.', certa: false, explica: 'Os fungos deben tomar alimento, coma os animais.' },
          { texto: 'Os fungos non se desprazan.', certa: true, explica: 'Igual ca as plantas.' },
          { texto: 'O cogomelo é o fungo enteiro.', certa: false, explica: 'É só unha parte: o resto vive baixo a terra.' },
          { texto: 'Os fermentos son unicelulares.', certa: true, explica: 'Si: son fungos dunha soa célula.' },
          { texto: 'Os mofos son unicelulares.', certa: false, explica: 'Os mofos son pluricelulares.' },
          { texto: 'Todos os cogomelos se poden comer.', certa: false, explica: 'Hai cogomelos velenosos, coma a Amanita phalloides.' },
          { texto: 'Os fungos axudan ás plantas.', certa: true, explica: 'Descompoñen os restos en substancias simples que usan as plantas.' },
        ]}
        acabar={acabar}
      />
    ),
  },
]

export function Fungos({ ruta, modo }: { ruta: string; modo?: string }) {
  return (
    <ParadaPrimaria
      ruta={ruta}
      titulo="Os fungos"
      modo={modo}
      paneis={{
        descubre: <Tarxetas tarxetas={TARXETAS_FUNGOS} xoga={`${ruta}/xoga`} />,
        xoga: <Xogos xogos={XOGOS_FUNGOS} proba={`${ruta}/proba`} />,
        proba: <Proba id="planeta/fungos" preguntas={PREGUNTAS_FUNGOS} />,
      }}
    />
  )
}

// ——— 4. Os protistas e as bacterias (páxinas 14 e 15) ———

const TARXETAS_PROTISTAS: Tarxeta[] = [
  {
    titulo: 'O reino dos protistas',
    texto: (
      <>
        <p>
          Os protistas é un reino que inclúe dous tipos de seres vivos moi diferentes entre si: os {b('protozoos')} e as {b('algas')}.
        </p>
      </>
    ),
    visual: <Seres ids={['ameba', 'protozoo', 'algaMicro', 'algaVermella']} tam={88} />,
  },
  {
    titulo: 'Os protozoos',
    texto: (
      <ul className="list-disc space-y-1 pl-6">
        <li>
          Son {b('unicelulares')}, polo que só se poden ver mediante un microscopio.
        </li>
        <li>
          Parécense {b('aos animais')} en que {b('se alimentan doutros seres vivos')}.
        </li>
        <li>
          Hai moitos grupos con formas moi diferentes. Algúns, como as {b('amebas')}, poden causarnos enfermidades.
        </li>
        <li>
          Viven {b('na auga')} ou {b('no interior doutros seres vivos')}.
        </li>
      </ul>
    ),
    visual: <Seres ids={['ameba', 'protozoo']} tam={130} />,
  },
  {
    titulo: 'As algas',
    texto: (
      <ul className="list-disc space-y-1 pl-6">
        <li>
          Poden ser {b('unicelulares')} ou {b('pluricelulares')}.
        </li>
        <li>
          Parécense {b('ás plantas')} en que {b('fabrican o seu propio alimento')}.
        </li>
        <li>
          Viven {b('na auga')}.
        </li>
      </ul>
    ),
    visual: <Seres ids={['algaMicro', 'algaVerde', 'algaVermella']} tam={100} />,
  },
  {
    titulo: 'O reino das bacterias',
    texto: (
      <ul className="list-disc space-y-1 pl-6">
        <li>
          A única célula que forma o seu corpo é {b('a máis pequena e simple')} coñecida.
        </li>
        <li>
          Viven {b('en todas as partes')} do noso planeta: no interior doutros seres vivos, na terra, no aire, na auga...
        </li>
        <li>Algunhas bacterias fabrican o seu propio alimento, mentres que outras teñen que conseguilo doutros seres vivos.</li>
      </ul>
    ),
    visual: <Seres ids={['bacteriaIogur', 'bacteriaTetano']} tam={130} />,
  },
  {
    titulo: 'Bacterias boas e bacterias malas',
    texto: (
      <>
        <p>
          😊 Algunhas bacterias son {b('beneficiosas')} para as persoas, como as que se empregan para elaborar o {b('iogur')} ou as que se usan para fabricar {b('medicamentos')}.
        </p>
        <p>
          🤒 Outras, en cambio, poden provocarlles {b('enfermidades')} ás persoas e a outros seres vivos, como a bacteria do {b('tétano')}.
        </p>
      </>
    ),
    visual: <Seres ids={['bacteriaIogur', 'bacteriaTetano']} tam={130} />,
  },
  {
    titulo: 'As formas das bacterias',
    texto: (
      <>
        <p>As bacterias poden presentar formas moi diferentes:</p>
        <p>
          {b('circular')}, {b('alongada')}, {b('de coma')} ou {b('en espiral')}.
        </p>
      </>
    ),
    visual: <FormasBacterias />,
    ancho: true,
  },
]

const PREGUNTAS_PROTISTAS: Pregunta[] = [
  elixe('Que dous tipos de seres vivos inclúe o reino dos protistas?', 'Os protozoos e as algas', ['Os fungos e os mofos', 'As bacterias e os fermentos'], 'Os protistas son os protozoos e as algas.'),
  elixe('Como son os protozoos?', 'Unicelulares', ['Pluricelulares', 'Unicelulares ou pluricelulares'], 'Por iso só se poden ver mediante un microscopio.'),
  elixe('En que se parecen os protozoos aos animais?', 'En que se alimentan doutros seres vivos', ['En que teñen patas', 'En que fabrican o seu alimento'], 'Os protozoos aliméntanse doutros seres vivos, coma os animais.'),
  elixe('Que protozoo pode causarnos enfermidades?', 'A ameba', ['A alga verde', 'O níscaro'], 'Algúns, como as amebas, poden causarnos enfermidades.'),
  elixe('Onde viven os protozoos?', 'Na auga ou no interior doutros seres vivos', ['Só no aire', 'Debaixo das pedras secas'], 'Viven na auga ou no interior doutros seres vivos.'),
  elixe('En que se parecen as algas ás plantas?', 'En que fabrican o seu propio alimento', ['En que se desprazan', 'En que son unicelulares'], 'As algas fabrican o seu propio alimento, coma as plantas.'),
  elixe('Como poden ser as algas?', 'Unicelulares ou pluricelulares', ['Só unicelulares', 'Só pluricelulares'], 'Hai algas dunha soa célula e algas de moitas.'),
  elixe('Onde viven as algas?', 'Na auga', ['Na terra seca', 'No aire'], 'As algas viven na auga.'),
  elixe('Como é a célula das bacterias?', 'A máis pequena e simple coñecida', ['A máis grande que hai', 'Igual que a das plantas'], 'A única célula que forma o seu corpo é a máis pequena e simple coñecida.'),
  elixe('Onde viven as bacterias?', 'En todas as partes do planeta', ['Só no mar', 'Só dentro das persoas'], 'No interior doutros seres vivos, na terra, no aire, na auga...'),
  elixe('Para que se empregan algunhas bacterias?', 'Para elaborar o iogur e fabricar medicamentos', ['Para facer o pan', 'Para fabricar cogomelos'], 'Son bacterias beneficiosas. Ollo: o pan faise cun fungo, o fermento.'),
  elixe('Que enfermidade provoca esta bacteria?', 'O tétano', ['A gripe', 'A varicela'], 'É a bacteria responsable da enfermidade do tétano.', <Seres ids={['bacteriaTetano']} tam={130} />),
  elixe('Que formas poden ter as bacterias?', 'Circular, alongada, de coma ou en espiral', ['Cadrada ou triangular', 'Só redonda'], 'As bacterias poden presentar formas moi diferentes.'),
  elixe('O iogur faise con…', 'Bacterias', ['Fermentos (fungos)', 'Algas'], 'Bacterias que transforman o leite.'),
  ...(['circular', 'alongada', 'coma', 'espiral'] as Forma[]).map((f) => toca(`Toca as bacterias de forma ${NOME_FORMA[f]}.`, FormasBacterias, NOMES_FORMAS, f, `Esta é a forma ${NOME_FORMA[f]}.`)),
  preguntaReino('algaVermella'),
  preguntaReino('ameba'),
  preguntaReino('bacteriaIogur'),
]

const XOGOS_PROTISTAS: Xogo[] = [
  {
    id: 'protozoos',
    titulo: 'Protozoo ou alga?',
    icono: '🦠',
    explica: 'De quen fala cada frase?',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'protozoos', nome: 'Os protozoos', cor: 'border-violet-300 bg-violet-100' },
          { id: 'algas', nome: 'As algas', cor: 'border-green-300 bg-green-100' },
        ]}
        elementos={[
          { texto: 'só son unicelulares', caixa: 'protozoos' },
          { texto: 'aliméntanse doutros seres vivos', caixa: 'protozoos' },
          { texto: 'parécense aos animais', caixa: 'protozoos' },
          { texto: 'as amebas', caixa: 'protozoos' },
          { texto: 'viven dentro doutros seres vivos', caixa: 'protozoos' },
          { texto: 'unicelulares ou pluricelulares', caixa: 'algas' },
          { texto: 'fabrican o seu propio alimento', caixa: 'algas' },
          { texto: 'parécense ás plantas', caixa: 'algas' },
        ]}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'formas',
    titulo: 'As formas das bacterias',
    icono: '🌀',
    explica: 'Toca a forma que che pida.',
    crear: (acabar) => <Busca Debuxo={FormasBacterias} nomes={NOMES_FORMAS} obxectivos={Object.keys(NOMES_FORMAS)} acabar={acabar} />,
  },
  {
    id: 'boas',
    titulo: 'Bacterias boas ou malas?',
    icono: '🥛',
    explica: 'Axúdannos ou fannos dano?',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'ben', nome: 'Beneficiosas 😊', cor: 'border-green-300 bg-green-100' },
          { id: 'mal', nome: 'Provocan enfermidades 🤒', cor: 'border-rose-300 bg-rose-100' },
        ]}
        elementos={[
          { texto: 'as do iogur', caixa: 'ben' },
          { texto: 'as dos medicamentos', caixa: 'ben' },
          { texto: 'a do tétano', caixa: 'mal' },
          { texto: 'as que enferman ás persoas', caixa: 'mal' },
          { texto: 'as que enferman a outros seres vivos', caixa: 'mal' },
        ]}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'vf',
    titulo: 'Verdadeiro ou falso?',
    icono: '🔬',
    explica: 'Protistas e bacterias.',
    crear: (acabar) => (
      <VerdadeiroFalso
        frases={[
          { texto: 'Os protozoos vense a simple vista.', certa: false, explica: 'Son unicelulares: só se ven co microscopio.' },
          { texto: 'As algas viven na auga.', certa: true, explica: 'Si.' },
          { texto: 'As algas aliméntanse doutros seres vivos.', certa: false, explica: 'As algas fabrican o seu propio alimento.' },
          { texto: 'As bacterias viven en todas as partes do planeta.', certa: true, explica: 'Na terra, no aire, na auga e dentro doutros seres vivos.' },
          { texto: 'Todas as bacterias son malas.', certa: false, explica: 'Algunhas son beneficiosas, como as do iogur.' },
          { texto: 'A célula das bacterias é a máis pequena e simple coñecida.', certa: true, explica: 'Si.' },
          { texto: 'As amebas son algas.', certa: false, explica: 'As amebas son protozoos.' },
        ]}
        acabar={acabar}
      />
    ),
  },
]

export function Protistas({ ruta, modo }: { ruta: string; modo?: string }) {
  return (
    <ParadaPrimaria
      ruta={ruta}
      titulo="Os protistas e as bacterias"
      modo={modo}
      paneis={{
        descubre: <Tarxetas tarxetas={TARXETAS_PROTISTAS} xoga={`${ruta}/xoga`} />,
        xoga: <Xogos xogos={XOGOS_PROTISTAS} proba={`${ruta}/proba`} />,
        proba: <Proba id="planeta/protistas" preguntas={PREGUNTAS_PROTISTAS} />,
      }}
    />
  )
}

// ——— 5. A biodiversidade e o iogur (páxinas 16 e 17) ———

const PASOS_IOGUR = ['1. Quecer o leite ata que ferva', '2. Deixalo arrefriar', '3. Botar unha cullerada de iogur e remexer', '4. Verter no recipiente con tapa e cubrir co pano', '5. Ao día seguinte, comprobar o que ocorreu']

const TARXETAS_BIO: Tarxeta[] = [
  {
    titulo: 'Que é a biodiversidade?',
    texto: (
      <>
        <p>
          A {b('biodiversidade')} é a {b('variedade de seres vivos dun lugar')}.
        </p>
        <p>
          Nas nosas {b('costas')} ou nas {b('selvas')} a biodiversidade é {b('moi alta')} e, en cambio, é {b('moi baixa')} nun {b('deserto')}.
        </p>
      </>
    ),
    visual: <Seres ids={['polbo', 'algaVermella', 'pinguin', 'algaVerde', 'palmeira']} tam={80} />,
  },
  {
    titulo: 'Por que é importante?',
    texto: (
      <p>
        Grazas á biodiversidade, se hai un {b('cambio ambiental')} que prexudique uns seres vivos, {b('sempre haberá outros')} que non se vexan afectados e {b('a vida seguirá o seu curso')}!
      </p>
    ),
  },
  {
    titulo: 'Como se avalía a biodiversidade?',
    texto: (
      <>
        <p>Percórrese un lugar (o patio, un parque…) e anótanse os seres vivos de cada reino nunha táboa:</p>
        <Taboa c={[3, 2, 1]} />
        <p>
          Súmanse todos e mírase a escala: {b('menos de 10')} → baixa; {b('entre 10 e 20')} → media; {b('máis de 20')} → alta.
        </p>
        <p className="text-base text-slate-600">🔎 Para os animais pequenos, unha lupa; para os que están lonxe, uns prismáticos.</p>
      </>
    ),
  },
  {
    titulo: 'O iogur faise con bacterias',
    texto: (
      <>
        <p>
          O {b('iogur')} é un alimento que se elabora grazas a que hai {b('bacterias que transforman o leite')} de animais como a vaca.
        </p>
        <p>
          Necesitas: {b('un litro de leite')}, {b('un iogur natural')}, {b('un recipiente para quentar')}, {b('unha culler para remexer')}, {b('un recipiente de vidro con tapa')} e {b('un pano de cociña')}.
        </p>
        <p className="text-base text-slate-600">⚠️ Sempre coa axuda dun adulto e lavando ben as mans e os utensilios.</p>
      </>
    ),
    visual: <Seres ids={['bacteriaIogur']} tam={150} />,
  },
  {
    titulo: 'Os pasos para facer iogur',
    texto: (
      <ol className="space-y-2">
        {PASOS_IOGUR.map((p) => (
          <li key={p}>{p}.</li>
        ))}
        <li className="text-base text-slate-600">💡 Deixalo ás escuras, protexido do frío e tapado co pano para que non perda calor.</li>
      </ol>
    ),
  },
]

const PREGUNTAS_BIO: Pregunta[] = [
  elixe('Que é a biodiversidade?', 'A variedade de seres vivos dun lugar', ['O número de persoas dunha cidade', 'Un tipo de bacteria'], 'A biodiversidade é a variedade de seres vivos dun lugar.'),
  elixe('Onde é moi alta a biodiversidade?', 'Nas costas e nas selvas', ['Nos desertos', 'Nas cidades'], 'Nas costas e nas selvas a biodiversidade é moi alta.'),
  elixe('Onde é moi baixa a biodiversidade?', 'Nun deserto', ['Nunha selva', 'Na costa'], 'Nun deserto hai poucos seres vivos.'),
  elixe('Por que é boa a biodiversidade?', 'Se un cambio prexudica a uns seres vivos, outros seguen adiante', ['Porque así hai menos seres vivos', 'Porque fai máis calor'], 'Sempre haberá outros que non se vexan afectados e a vida seguirá o seu curso.'),
  elixe('Que podes usar para ver os animais máis pequenos?', 'Unha lupa', ['Uns prismáticos', 'Unha culler'], 'A lupa para o pequeno; os prismáticos para o que está lonxe.'),
  elixe('Se atopas máis de 20 seres vivos, a biodiversidade é…', 'Alta', ['Baixa', 'Media'], 'Máis de 20: alta.'),
  elixe('Se atopas menos de 10 seres vivos, a biodiversidade é…', 'Baixa', ['Alta', 'Media'], 'Menos de 10: baixa.'),
  elixe('Que transforma o leite en iogur?', 'As bacterias', ['Os fungos', 'As algas'], 'O iogur elabórase grazas a bacterias que transforman o leite.'),
  elixe('Que é o primeiro que se fai para facer iogur?', 'Quecer o leite ata que ferva', ['Botar o iogur', 'Tapalo co pano'], 'Primeiro quécese o leite ata que ferva.'),
  elixe('Cando se bota a cullerada de iogur?', 'Cando o leite está temperado', ['Cando o leite está fervendo', 'Antes de quentar o leite'], 'Hai que deixar arrefriar o leite e, cando estea temperado, botar o iogur.'),
  elixe('Para que se cobre o recipiente cun pano de cociña?', 'Para que non perda calor', ['Para que lle dea a luz', 'Para que arrefríe rápido'], 'E déixase ás escuras e protexido do frío.'),
  elixe('Cal destas cousas NON se necesita para facer iogur?', 'Un microscopio', ['Un litro de leite', 'Un iogur natural', 'Un pano de cociña'], 'Necesítase leite, un iogur natural, un recipiente para quentar, unha culler, un recipiente de vidro con tapa e un pano.'),
  ...CONTAS.map(preguntaBiodiversidade),
]

const XOGOS_BIO: Xogo[] = [
  {
    id: 'avalia',
    titulo: 'Avalía a biodiversidade',
    icono: '🌳',
    explica: 'Suma os seres vivos e mira a escala.',
    crear: (acabar) => <Proba practica preguntas={CONTAS.map(preguntaBiodiversidade)} cantas={5} acabar={acabar} />,
  },
  {
    id: 'lugares',
    titulo: 'Alta ou baixa?',
    icono: '🏜️',
    explica: 'Como é a biodiversidade en cada lugar?',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'alta', nome: 'Moi alta 🌴🐠🦜', cor: 'border-green-300 bg-green-100' },
          { id: 'baixa', nome: 'Moi baixa 🏜️', cor: 'border-amber-300 bg-amber-100' },
        ]}
        elementos={[
          { texto: 'a selva', caixa: 'alta' },
          { texto: 'as nosas costas', caixa: 'alta' },
          { texto: 'máis de 20 seres vivos', caixa: 'alta' },
          { texto: 'o deserto', caixa: 'baixa' },
          { texto: 'menos de 10 seres vivos', caixa: 'baixa' },
        ]}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'iogur',
    titulo: 'Fai iogur',
    icono: '🥛',
    explica: 'Pon os pasos en orde.',
    crear: (acabar) => <Ordena frases={[{ palabras: PASOS_IOGUR.map((p) => p.slice(3)) }]} acabar={acabar} />,
  },
  {
    id: 'materiais',
    titulo: 'Que necesitas?',
    icono: '🧺',
    explica: 'O que fai falta para o iogur.',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'si', nome: 'Necesítase ✅', cor: 'border-green-300 bg-green-100' },
          { id: 'non', nome: 'Non fai falta ❌', cor: 'border-rose-300 bg-rose-100' },
        ]}
        elementos={[
          { texto: 'un litro de leite', caixa: 'si' },
          { texto: 'un iogur natural', caixa: 'si' },
          { texto: 'un recipiente para quentar', caixa: 'si' },
          { texto: 'unha culler para remexer', caixa: 'si' },
          { texto: 'un recipiente de vidro con tapa', caixa: 'si' },
          { texto: 'un pano de cociña', caixa: 'si' },
          { texto: 'un microscopio', caixa: 'non' },
          { texto: 'fariña', caixa: 'non' },
          { texto: 'xeo', caixa: 'non' },
        ]}
        acabar={acabar}
      />
    ),
  },
]

export function Biodiversidade({ ruta, modo }: { ruta: string; modo?: string }) {
  return (
    <ParadaPrimaria
      ruta={ruta}
      titulo="A biodiversidade e o iogur"
      modo={modo}
      paneis={{
        descubre: <Tarxetas tarxetas={TARXETAS_BIO} xoga={`${ruta}/xoga`} />,
        xoga: <Xogos xogos={XOGOS_BIO} proba={`${ruta}/proba`} />,
        proba: <Proba id="planeta/biodiversidade" preguntas={PREGUNTAS_BIO} />,
      }}
    />
  )
}

// ——— 6. Un mundo microscópico e os carteis (páxinas 18 a 21) ———

const TARXETAS_MICRO: Tarxeta[] = [
  {
    titulo: 'Un mundo microscópico',
    texto: (
      <>
        <p>
          Cara ao {b('ano 1700')}, o holandés {b('Anton van Leeuwenhoek')} analizou co seu {b('microscopio')} unha {b('gota de auga')}.
        </p>
        <p>Así descubriu un {b('novo mundo')}, poboado por seres de tamaño microscópico.</p>
      </>
    ),
    visual: <GotaDeAuga />,
  },
  {
    titulo: 'A carta de Leeuwenhoek',
    texto: (
      <>
        <p className="italic">«Parecía que toda a auga estaba viva e chea de múltiples animaliños.»</p>
        <p>
          Leeuwenhoek pensou que vía {b('vermes')} e {b('animaliños')}. Hoxe sabemos que eran sobre todo {b('seres vivos unicelulares')}: protozoos, algas unicelulares e bacterias.
        </p>
        <p>Acertou en que a auga estaba chea de seres vivos, pero non eran vermes nin animais.</p>
      </>
    ),
    visual: <GotaDeAuga etiquetas />,
  },
  {
    titulo: 'Adiviña o reino',
    texto: (
      <>
        <p>No recanto da oratoria, cada un imaxina que é un ser vivo e explica como é e onde vive, sen dicir o nome. Os demais adiviñan o seu reino.</p>
        <p>
          🍄 {b('Níscaro')}: fungos · 🌿 {b('Alga verde')}: protistas · 🦠 {b('Ameba')}: protistas · 🥛 {b('Bacteria do iogur')}: bacterias.
        </p>
      </>
    ),
    visual: <Seres ids={['niscaro', 'algaVerde', 'ameba', 'bacteriaIogur']} tam={88} />,
  },
  {
    titulo: 'Os carteis',
    texto: (
      <>
        <p>Cada cartel describe un tipo de ser vivo. Para descubrilo, pregúntate:</p>
        <p>🔬 Ten unha célula ou moitas?</p>
        <p>🍽️ Fabrica o seu alimento ou tómao?</p>
        <p>🚶 Desprázase? Onde vive?</p>
      </>
    ),
  },
]

const ADIVINAS: { texto: string; reino: Reino; explica: string }[] = [
  { texto: 'Vivo baixo a terra comendo restos doutros seres vivos. No outono saio por riba co meu cogomelo laranxa. Quen son?', reino: 'fungos', explica: 'É o níscaro, un fungo.' },
  { texto: 'Vivo na auga e fabrico o meu propio alimento coma unha planta, pero non son unha planta. Quen son?', reino: 'protistas', explica: 'É unha alga: as algas son protistas.' },
  { texto: 'Teño unha soa célula, vivo na auga e aliméntome doutros seres vivos. Ás veces causo enfermidades. Quen son?', reino: 'protistas', explica: 'É a ameba, un protozoo.' },
  { texto: 'A miña célula é a máis pequena e simple coñecida. Transformo o leite en iogur. Quen son?', reino: 'bacterias', explica: 'É a bacteria do iogur.' },
  { texto: 'Teño moitas células, non podo fabricar o meu alimento e voo dunha árbore a outra. Quen son?', reino: 'animais', explica: 'É un paxaro: os animais desprázanse e aliméntanse doutros seres vivos.' },
  { texto: 'Estou fixa á terra e fabrico o meu alimento co aire, a auga e as substancias da terra. Quen son?', reino: 'plantas', explica: 'É unha planta.' },
  { texto: 'Fago unha peluxe verde sobre o pan vello. Quen son?', reino: 'fungos', explica: 'É o mofo, un fungo.' },
]

const PREGUNTAS_MICRO: Pregunta[] = [
  elixe('Quen descubriu os seres microscópicos dunha gota de auga?', 'Anton van Leeuwenhoek', ['Cristóbal Colón', 'Leonardo da Vinci'], 'Foi o holandés Anton van Leeuwenhoek.'),
  elixe('Cara a que ano o fixo?', 'Cara ao ano 1700', ['Cara ao ano 2000', 'Cara ao ano 100'], 'Cara ao ano 1700.'),
  elixe('De onde era Leeuwenhoek?', 'De Holanda (holandés)', ['De Galicia', 'De Exipto'], 'Era holandés.'),
  elixe('Que analizou co seu microscopio?', 'Unha gota de auga', ['Unha folla de árbore', 'Unha pedra'], 'Analizou unha gota de auga.'),
  elixe('Que viu realmente Leeuwenhoek na gota de auga?', 'Sobre todo seres vivos unicelulares', ['Vermes de verdade', 'Peixes pequenos'], 'Eran seres unicelulares, non vermes.'),
  elixe('Por que se di que descubriu un novo mundo?', 'Porque viu seres vivos que ninguén vira, tan pequenos que non se ven a simple vista', ['Porque viaxou a América', 'Porque descubriu un planeta'], 'Un mundo poboado por seres de tamaño microscópico.'),
  ...ADIVINAS.map((a) => elixe(a.texto, NOME_REINO[a.reino], REINOS.filter((r) => r !== a.reino).map((r) => NOME_REINO[r]).slice(0, 3), a.explica)),
  ...CARTEIS.map(preguntaCartel),
  toca('Toca a ameba.', GotaDeAuga, NOMES_GOTA, 'ameba', 'A ameba é un protozoo.'),
  toca('Toca a alga unicelular.', GotaDeAuga, NOMES_GOTA, 'algaMicro', 'A alga unicelular é verde e fabrica o seu alimento.'),
]

const XOGOS_MICRO: Xogo[] = [
  {
    id: 'gota',
    titulo: 'Na gota de auga',
    icono: '💧',
    explica: 'Toca o ser microscópico que che pida.',
    crear: (acabar) => <Busca Debuxo={GotaDeAuga} nomes={NOMES_GOTA} obxectivos={Object.keys(NOMES_GOTA)} acabar={acabar} />,
  },
  {
    id: 'adivina',
    titulo: 'Adiviña o reino',
    icono: '🎭',
    explica: 'Le o que conta o ser vivo e adiviña o seu reino.',
    crear: (acabar) => <Proba practica preguntas={ADIVINAS.map((a) => elixe(a.texto, NOME_REINO[a.reino], REINOS.filter((r) => r !== a.reino).map((r) => NOME_REINO[r]), a.explica))} cantas={ADIVINAS.length} acabar={acabar} />,
  },
  {
    id: 'carteis',
    titulo: 'Que seres describe o cartel?',
    icono: '🪧',
    explica: 'Coma na páxina 21 do libro.',
    crear: (acabar) => <Proba practica preguntas={CARTEIS.map(preguntaCartel)} cantas={CARTEIS.length} acabar={acabar} />,
  },
  {
    id: 'palabras',
    titulo: 'A nube de palabras',
    icono: '☁️',
    explica: 'Une cada palabra co seu significado.',
    crear: (acabar) => (
      <Une
        pares={barallar([
          { palabra: 'reino', significado: 'Grupo de seres vivos que se parecen moito.' },
          { palabra: 'biodiversidade', significado: 'A variedade de seres vivos dun lugar.' },
          { palabra: 'protozoo', significado: 'Protista unicelular que se alimenta doutros seres vivos.' },
          { palabra: 'alga', significado: 'Protista que vive na auga e fabrica o seu alimento.' },
          { palabra: 'bacteria', significado: 'Ser vivo coa célula máis pequena e simple.' },
          { palabra: 'fungo', significado: 'Non se despraza e debe tomar alimento.' },
          { palabra: 'cogomelo', significado: 'Parte do fungo que intervén na reprodución.' },
          { palabra: 'célula', significado: 'Parte moi pequena que forma os seres vivos.' },
        ]).slice(0, 6)}
        acabar={acabar}
      />
    ),
  },
]

export function Microscopico({ ruta, modo }: { ruta: string; modo?: string }) {
  return (
    <ParadaPrimaria
      ruta={ruta}
      titulo="Un mundo microscópico"
      modo={modo}
      paneis={{
        descubre: <Tarxetas tarxetas={TARXETAS_MICRO} xoga={`${ruta}/xoga`} />,
        xoga: <Xogos xogos={XOGOS_MICRO} proba={`${ruta}/proba`} />,
        proba: <Proba id="planeta/microscopico" preguntas={PREGUNTAS_MICRO} />,
      }}
    />
  )
}

export const PREGUNTAS_PLANETA: Record<string, Pregunta[]> = {
  servivo: PREGUNTAS_SER,
  reinos: PREGUNTAS_REINOS,
  fungos: PREGUNTAS_FUNGOS,
  protistas: PREGUNTAS_PROTISTAS,
  biodiversidade: PREGUNTAS_BIO,
  microscopico: PREGUNTAS_MICRO,
}
