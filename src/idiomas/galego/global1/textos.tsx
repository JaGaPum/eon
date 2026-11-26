// Global de Galego (1.ª avaliación): o texto descritivo (tipos de descrición e de texto) e o texto narrativo.
import type { ReactNode } from 'react'
import { Clasifica, ParadaPrimaria, Proba, Tarxetas, Une, VerdadeiroFalso, barallar, type Pregunta, type Tarxeta, type Xogo, Xogos } from '../../../primaria/pezas'
import { elixe } from '../../../primaria/paisaxes/preguntas'
import { EXEMPLOS_DESCRICION, NARRADORES, TEXTOS_PRACTICA, TIGRE, TIPOS_DESCRICION, TIPOS_TEXTO } from './datos'

const b = (t: string) => <b className="text-violet-800">{t}</b>
export const Caixa = ({ children }: { children: ReactNode }) => <div className="rounded-2xl border-2 border-violet-200 bg-white p-4 text-lg leading-relaxed">{children}</div>
const outrasDe = (lista: string[], correcta: string, n = 3) => barallar(lista.filter((x) => x !== correcta)).slice(0, n)

// ===================================================================================================
// 1. Tipos de descrición e tipos de texto
// ===================================================================================================

const DESCRICION_TARXETAS: Tarxeta[] = [
  {
    titulo: 'Que é unha descrición?',
    texto: (
      <>
        <p>Un texto no que se di {b('como é')} unha persoa, un animal, un obxecto, un lugar, un sentimento…</p>
        <p>
          Segundo a {b('intención')}: a {b('obxectiva')} ofrece unha imaxe fiel á realidade (léxico técnico, adxectivos especificativos); a {b('subxectiva')} transmite a impresión
          de quen observa (valoracións, léxico común, adxectivos cualificativos e epítetos).
        </p>
      </>
    ),
  },
  {
    titulo: 'Segundo o que se describe',
    texto: (
      <ul className="space-y-1.5">
        {TIPOS_DESCRICION.map(([t, d]) => (
          <li key={t}>
            {b(t)}: {d}
          </li>
        ))}
      </ul>
    ),
  },
  {
    titulo: 'Truco para non mesturalas',
    texto: (
      <ul className="list-disc space-y-2 pl-5">
        <li>
          {b('Persoa')}: só o corpo → prosopografía; só o carácter → etopea; as dúas cousas → retrato (de si mesmo → autorretrato); esaxerando para facer rir → caricatura.
        </li>
        <li>
          {b('Lugar')} → topografía (topos = lugar). {b('Obxecto')} → pragmatografía.
        </li>
      </ul>
    ),
  },
  {
    titulo: 'Os cinco tipos de texto',
    texto: (
      <ul className="space-y-1.5">
        {TIPOS_TEXTO.map(([t, d]) => (
          <li key={t}>
            {b(t)}: {d}
          </li>
        ))}
      </ul>
    ),
  },
  {
    titulo: 'Na práctica da profesora',
    texto: (
      <ul className="list-disc space-y-2 pl-5">
        <li>{b('Texas')}: descritivo; describe un lugar (topografía) e cadra nunha {b('guía de viaxes')} ou folleto turístico («visite o Parque Nacional»).</li>
        <li>{b('O tigre enfermo')}: narrativo (un conto con personaxes, espazo e tempo).</li>
        <li>{b('O lixo')}: expositivo; explica un tema (como eliminar o lixo: vertedoiros, incineración e reciclaxe).</li>
        <li>{b('O caixeiro')}: instrutivo; pasos e ordes («pase», «agarde», «insira»).</li>
        <li>{b('Messi')}: argumentativo; defende unha tese (é o mellor xogador do mundo) con razóns.</li>
      </ul>
    ),
  },
]

const NOMES_DESCRICION = TIPOS_DESCRICION.map(([t]) => t)
const NOMES_TEXTO = TIPOS_TEXTO.map(([t]) => t)

const DESCRICION_PREG: Pregunta[] = [
  ...EXEMPLOS_DESCRICION.map(([f, t]) => elixe(<>«{f}» Que tipo de descrición é?</>, t, outrasDe(NOMES_DESCRICION, t), TIPOS_DESCRICION.find(([n]) => n === t)![1])),
  ...TIPOS_DESCRICION.map(([t, d]) => elixe(<>Que tipo de descrición é esta: «{d}»?</>, t, outrasDe(NOMES_DESCRICION, t), `${t}: ${d}`)),
  ...TIPOS_TEXTO.map(([t, d]) => elixe(<>Un texto que «{d.charAt(0).toLowerCase() + d.slice(1, -1)}» é…</>, t, outrasDe(NOMES_TEXTO, t), `É un texto ${t.toLowerCase()}.`)),
  ...TEXTOS_PRACTICA.map((x) => elixe(<>«{x.comezo}» De que tipo é este texto?</>, x.tipo, outrasDe(NOMES_TEXTO, x.tipo), TIPOS_TEXTO.find(([n]) => n === x.tipo)![1])),
  elixe('O texto do oeste de Texas, en que xénero textual podería cadrar?', 'Nunha guía de viaxes ou folleto turístico', ['Nunha receita de cociña', 'Nun conto infantil', 'Nunha noticia de sucesos'], 'Describe un lugar e anima a visitalo («visite o Parque Nacional de Big Bend»).'),
  elixe('O texto do oeste de Texas describe un lugar. Que tipo de descrición é?', 'Topografía', ['Pragmatografía', 'Etopea', 'Prosopografía'], 'A descrición dun lugar (unha paisaxe) é unha topografía.'),
  elixe('Que título lle porías ao texto do caixeiro?', 'Como usar o caixeiro automático', ['O banco', 'Unha tarde no banco co meu pai', 'Os cartos'], 'O título dun texto instrutivo di que se vai aprender a facer.'),
  elixe('Por que o texto do caixeiro é instrutivo?', 'Dá unha serie de pasos en orde, con verbos en imperativo', ['Conta a historia dun personaxe', 'Defende unha opinión', 'Describe como é o banco'], '«Pase», «agarde», «insira», «seleccione»: son ordes para facer algo paso a paso.'),
  elixe('Que defende o autor do texto sobre Messi?', 'Que Messi é o mellor xogador do mundo', ['Que o fútbol é un deporte aburrido', 'Que Messi debería deixar o Barcelona', 'Que Xavi e Iniesta son mellores'], 'É a tese, a idea que defende o texto argumentativo.'),
  elixe('Cal destas NON é unha razón do texto para dicir que Messi é o mellor?', 'É o xogador máis alto do equipo', ['Marca, asiste e regatea coma ninguén', 'É humilde e xoga en silencio', 'É un exemplo humano (a doazón á Cruz Vermella)'], 'O texto non fala da súa altura.'),
  elixe('Cal sería o tema do texto expositivo do lixo?', 'Os métodos para eliminar o lixo das cidades', ['As cidades acumulan moito lixo', 'O lixo', 'A miña opinión sobre a reciclaxe'], 'Frase nominal, sen verbo e concreta: vertedoiros, incineración e reciclaxe.'),
]

const DESCRICION_XOGOS: Xogo[] = [
  {
    id: 'une',
    titulo: 'Cada descrición co seu nome',
    icono: '🔗',
    explica: 'Une o nome co que describe.',
    crear: (acabar) => <Une pares={TIPOS_DESCRICION.map(([palabra, significado]) => ({ palabra, significado }))} acabar={acabar} />,
  },
  {
    id: 'clasifica',
    titulo: 'Persoa, lugar ou obxecto?',
    icono: '🗂️',
    explica: 'Que describe cada fragmento?',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'p', nome: 'Unha persoa', cor: 'border-pink-300 bg-pink-100' },
          { id: 'l', nome: 'Un lugar', cor: 'border-emerald-300 bg-emerald-100' },
          { id: 'o', nome: 'Un obxecto', cor: 'border-sky-300 bg-sky-100' },
        ]}
        elementos={barallar(
          EXEMPLOS_DESCRICION.map(([texto, t]) => ({ texto, caixa: t === 'Topografía' ? 'l' : t === 'Pragmatografía' ? 'o' : 'p', pista: `É unha ${t.toLowerCase()}.` })),
        ).slice(0, 8)}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'textos',
    titulo: 'Os cinco tipos de texto',
    icono: '📚',
    explica: 'Une cada tipo co que fai.',
    crear: (acabar) => <Une pares={TIPOS_TEXTO.map(([palabra, significado]) => ({ palabra, significado }))} acabar={acabar} />,
  },
]

export function Descricion2({ ruta, modo }: { ruta: string; modo?: string }) {
  return (
    <ParadaPrimaria
      ruta={ruta}
      titulo="Tipos de descrición e de texto"
      modo={modo}
      paneis={{
        descubre: <Tarxetas tarxetas={DESCRICION_TARXETAS} xoga={`${ruta}/xoga`} />,
        xoga: <Xogos xogos={DESCRICION_XOGOS} proba={`${ruta}/proba`} />,
        proba: <Proba id="galego2/descricion" preguntas={DESCRICION_PREG} />,
      }}
    />
  )
}

// ===================================================================================================
// 2. A narración
// ===================================================================================================

const NARRACION_TARXETAS: Tarxeta[] = [
  {
    titulo: 'Os elementos da narración',
    texto: (
      <ul className="list-disc space-y-2 pl-5">
        <li>{b('Narrador')}: quen conta a historia.</li>
        <li>{b('Personaxes')}: a quen lle pasan os feitos.</li>
        <li>{b('Espazo')}: onde pasa.</li>
        <li>{b('Tempo')}: cando pasa e canto dura.</li>
        <li>{b('Acción')}: o que pasa, en tres partes: presentación, nó e desenlace.</li>
      </ul>
    ),
  },
  {
    titulo: 'O narrador',
    texto: (
      <>
        <p>
          {b('Interno')} (1.ª persoa, «eu»): é unha personaxe da historia. Pode ser {b('protagonista')} (conta o que lle pasa a el) ou {b('testemuña')} (conta o que lle pasa a
          outro e el viu).
        </p>
        <p>
          {b('Externo')} (3.ª persoa, «el, ela»): está fóra da historia. Pode ser {b('omnisciente')} (sábeo todo, mesmo o que pensan e senten as personaxes) ou {b('obxectivo')}{' '}
          (só conta o que se ve, coma unha cámara).
        </p>
      </>
    ),
  },
  {
    titulo: 'Personaxes, espazo e tempo',
    texto: (
      <ul className="list-disc space-y-2 pl-5">
        <li>
          {b('Personaxes principais')}: o {b('protagonista')} (o máis importante) e, se hai, o {b('antagonista')} (o que se lle opón). {b('Secundarios')}: axudan ou acompañan.
        </li>
        <li>{b('Espazo')}: real ou imaxinario, aberto (a selva, a rúa) ou pechado (unha casa).</li>
        <li>
          {b('Tempo')}: a época na que pasa e canto dura a historia. A orde pode ser {b('cronolóxica')} (do primeiro ao último) ou con saltos ao pasado ({b('retrospección')}).
        </li>
      </ul>
    ),
  },
  {
    titulo: 'Analizamos «O tigre enfermo»',
    texto: (
      <>
        <Caixa>
          <p className="text-base">{TIGRE}</p>
          <p className="mt-1 text-sm text-slate-500">Marcelo Birmajer (resumido)</p>
        </Caixa>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-base">
          <li>{b('Narrador')}: externo omnisciente (3.ª persoa; sabe o que pensa o tigre «para os seus adentros»).</li>
          <li>{b('Personaxes')}: o tigre liberado (protagonista); os seus irmáns tigres (secundarios, e son os que o matan); os humanos só se nomean.</li>
          <li>{b('Espazo')}: a selva, a espesura (antes viviu cos humanos).</li>
          <li>{b('Tempo')}: pasado; despois de varios anos de vida doméstica. Orde cronolóxica.</li>
          <li>{b('Acción')}: presentación (captúrano e despois líbrano); nó (pregúntanlle que aprendeu e el medita); desenlace (os outros mátano).</li>
          <li>{b('Tema')}: o rexeitamento de quen di unha verdade incómoda (que non somos inmortais).</li>
        </ul>
      </>
    ),
  },
  {
    titulo: 'A lectura: «Memorias dun neno labrego»',
    texto: (
      <p>
        De Xosé Neira Vilas. O narrador é {b('interno protagonista')}: Balbino, un neno da aldea, conta en primeira persoa a súa propia vida. Se che preguntan polo narrador dun
        texto en primeira persoa, mira se conta a súa historia (protagonista) ou a doutro (testemuña).
      </p>
    ),
  },
]

const TIPOS_NARRADOR = ['Interno protagonista (1.ª persoa)', 'Interno testemuña (1.ª persoa)', 'Externo omnisciente (3.ª persoa)', 'Externo obxectivo (3.ª persoa)']
const tigre = (p: string) => (
  <>
    <span className="mb-2 block text-base text-slate-600">«O tigre enfermo»: {TIGRE}</span>
    {p}
  </>
)

const NARRACION_PREG: Pregunta[] = [
  ...NARRADORES.map(([f, t, e]) => elixe(<>«{f}» Que narrador ten?</>, t, outrasDe(TIPOS_NARRADOR, t), e)),
  elixe(tigre('Que tipo de narrador ten o conto?'), 'Externo omnisciente (3.ª persoa)', ['Interno protagonista (1.ª persoa)', 'Interno testemuña (1.ª persoa)', 'Externo obxectivo (3.ª persoa)'], 'Conta en 3.ª persoa e sabe o que pensa o tigre por dentro.'),
  elixe(tigre('Quen é o protagonista?'), 'O tigre que foi liberado', ['Os humanos', 'Os irmáns do tigre', 'O narrador'], 'Toda a historia xira arredor del.'),
  elixe(tigre('Que papel teñen os irmáns do tigre?'), 'Son personaxes secundarios', ['Son os narradores', 'Son o espazo', 'Son os protagonistas'], 'Acompañan a acción e son os que o matan, pero o protagonista é o tigre liberado.'),
  elixe(tigre('Onde pasa a acción principal?'), 'Na selva, na espesura', ['Nunha cidade', 'Nun zoolóxico', 'Nunha casa'], 'O tigre corre á selva e alí fala cos seus irmáns.'),
  elixe(tigre('Como é a orde dos feitos?'), 'Cronolóxica: do primeiro ao último', ['Empeza polo final', 'Non hai orde', 'Vai saltando ao futuro'], 'Captura, anos cos humanos, liberación, pregunta e morte, por esta orde.'),
  elixe(tigre('Cal é o desenlace?'), 'Os outros tigres mátano', ['O tigre volve cos humanos', 'O tigre convértese no xefe', 'Os tigres aprenden a lección'], 'O desenlace é o final da historia.'),
  elixe(tigre('Cal é a orde correcta dos acontecementos?'), 'Captúrano → vive cos humanos → líbrano → pregúntanlle → fala da morte → mátano', ['Líbrano → captúrano → mátano → pregúntanlle', 'Pregúntanlle → captúrano → líbrano → mátano', 'Mátano → líbrano → fala da morte'], 'Os acontecementos van en orde cronolóxica.'),
  elixe(tigre('Cal podería ser o tema?'), 'O rexeitamento de quen di unha verdade incómoda', ['Un tigre volve á selva', 'Os tigres', 'Os tigres son animais perigosos e eu teño medo deles'], 'O tema vai nunha frase nominal (sen verbo), nin xeral de máis nin con opinións.'),
  elixe('Cales son as tres partes da acción dunha narración?', 'Presentación, nó e desenlace', ['Tema, título e resumo', 'Introdución, tese e conclusión', 'Narrador, espazo e tempo'], 'Presentación (comezo), nó (o problema) e desenlace (o final).'),
  elixe('Que fai un narrador omnisciente?', 'Sábeo todo, mesmo o que pensan e senten as personaxes', ['Só conta o que se ve', 'Conta a súa propia vida', 'Conta o que lle pasou a un amigo'], 'Omnisciente = que o sabe todo.'),
  elixe('Un narrador en 1.ª persoa que conta a historia doutra persoa é…', 'Interno testemuña', ['Interno protagonista', 'Externo omnisciente', 'Externo obxectivo'], 'Está dentro da historia, pero a historia non é súa: é testemuña.'),
  elixe('En «Memorias dun neno labrego», que narrador hai?', 'Interno protagonista: Balbino conta a súa vida', ['Externo omnisciente', 'Interno testemuña: un amigo de Balbino', 'Externo obxectivo'], 'Balbino conta en primeira persoa o que lle pasa a el.'),
  elixe('Onde e cando pasa a historia son…', 'O espazo e o tempo', ['O narrador e as personaxes', 'O tema e o título', 'O nó e o desenlace'], 'Espazo = onde; tempo = cando e canto dura.'),
  elixe('Que é o nó dunha narración?', 'A parte na que aparece o problema ou conflito', ['O final da historia', 'O título do conto', 'A presentación das personaxes'], 'Presentación → nó (o conflito) → desenlace (como se resolve).'),
  elixe('Que é o antagonista?', 'A personaxe que se opón ao protagonista', ['O narrador', 'O lugar onde pasa a historia', 'O personaxe máis novo'], 'Antagonista = o que vai contra o protagonista.'),
]

const NARRACION_XOGOS: Xogo[] = [
  {
    id: 'narrador',
    titulo: 'Que narrador é?',
    icono: '🎙️',
    explica: 'Coloca cada fragmento.',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'i', nome: 'Interno (1.ª persoa)', cor: 'border-pink-300 bg-pink-100' },
          { id: 'e', nome: 'Externo (3.ª persoa)', cor: 'border-sky-300 bg-sky-100' },
        ]}
        elementos={NARRADORES.map(([texto, t, pista]) => ({ texto, caixa: t.startsWith('Interno') ? 'i' : 'e', pista }))}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'elementos',
    titulo: 'Os elementos do tigre',
    icono: '🐯',
    explica: 'Une cada elemento co do conto.',
    crear: (acabar) => (
      <Une
        pares={[
          { palabra: 'Narrador', significado: 'Externo omnisciente' },
          { palabra: 'Protagonista', significado: 'O tigre liberado' },
          { palabra: 'Secundarios', significado: 'Os irmáns tigres' },
          { palabra: 'Espazo', significado: 'A selva' },
          { palabra: 'Desenlace', significado: 'Os outros mátano' },
          { palabra: 'Presentación', significado: 'Captúrano e despois líbrano' },
        ]}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'vf',
    titulo: 'Verdadeiro ou falso?',
    icono: '✅',
    explica: 'Sobre a narración.',
    crear: (acabar) => (
      <VerdadeiroFalso
        frases={[
          { texto: 'O narrador interno conta en primeira persoa.', certa: true, explica: 'Está dentro da historia: «eu».' },
          { texto: 'O narrador obxectivo sabe o que pensan as personaxes.', certa: false, explica: 'Iso é o omnisciente; o obxectivo só conta o que se ve.' },
          { texto: 'No tigre enfermo o narrador é externo.', certa: true, explica: 'Conta en terceira persoa.' },
          { texto: 'O desenlace é o comezo da historia.', certa: false, explica: 'É o final; o comezo é a presentación.' },
          { texto: 'Unha historia contada do primeiro ao último ten orde cronolóxica.', certa: true, explica: 'Cronolóxica = na orde do tempo.' },
          { texto: 'O espazo é o momento no que pasa a historia.', certa: false, explica: 'O espazo é o lugar; o momento é o tempo.' },
        ]}
        acabar={acabar}
      />
    ),
  },
]

export function Narracion({ ruta, modo }: { ruta: string; modo?: string }) {
  return (
    <ParadaPrimaria
      ruta={ruta}
      titulo="A narración"
      modo={modo}
      paneis={{
        descubre: <Tarxetas tarxetas={NARRACION_TARXETAS} xoga={`${ruta}/xoga`} />,
        xoga: <Xogos xogos={NARRACION_XOGOS} proba={`${ruta}/proba`} />,
        proba: <Proba id="galego2/narracion" preguntas={NARRACION_PREG} />,
      }}
    />
  )
}

export const PREGUNTAS_TEXTOS2 = { descricion: DESCRICION_PREG, narracion: NARRACION_PREG }
