// Global de Galego (1.ª avaliación): a lingua por dentro. Variedades e bloques, o adxectivo, as relacións semánticas e o vocabulario.
import type { ReactNode } from 'react'
import { Clasifica, ParadaPrimaria, Proba, Tarxetas, Une, VerdadeiroFalso, barallar, type Pregunta, type Tarxeta, type Xogo, Xogos } from '../../../primaria/pezas'
import { elixe } from '../../../primaria/paisaxes/preguntas'
import { BLOQUES, NOME_BLOQUE, PRONOME, TRAZOS, bloquesDaPalabra, estandarizar, nomeBloques, trazosDe, type Trazo } from '../../../lib/dialectos'
import { comparativo, feminino, plural, superlativoSintetico, superlativos, terminacions } from '../../../lib/adxectivos'
import {
  ADX_SINTETICOS,
  ADX_SUPERLATIVOS,
  AVES,
  CASTELANISMOS,
  COMPARATIVOS,
  CONCORDANCIA,
  CORPO,
  EXPLICATIVOS,
  FALSOS_AMIGOS,
  FRASES_BLOQUES,
  FRASES_FEITAS,
  PALABRAS_BLOQUES,
  PALABRAS_BLOQUES_MAIS,
  PARES_BV,
  PARES_TIL,
  PE_PERNA,
  TANIS,
  VARIEDADES,
} from './datos'
import { Caixa } from './textos'

const b = (t: string) => <b className="text-violet-800">{t}</b>
const outrasDe = (lista: string[], correcta: string, n = 3) => barallar([...new Set(lista.filter((x) => x !== correcta))]).slice(0, n)
const Lista = ({ items }: { items: [string, string][] }) => (
  <ul className="space-y-1.5">
    {items.map(([t, d]) => (
      <li key={t}>
        {b(t)}: {d}
      </li>
    ))}
  </ul>
)

// ===================================================================================================
// 3. Variedades da lingua: estándar, niveis e rexistros
// ===================================================================================================

const NIVEIS: [string, string][] = [
  ['Nivel culto', 'o das persoas cunha elevada formación cultural: ortografía e dicción correctas, sen erros sintácticos nin castelanismos e con palabras moi precisas.'],
  ['Nivel medio', 'o dos medios de comunicación, a administración e o ensino: uso correcto, pero con menos cultismos e frases máis sinxelas.'],
  ['Nivel vulgar', 'o das persoas sen formación académica que non enriqueceron na escola a lingua que aprenderon de pequenas: castelanismos, vulgarismos e faltas de ortografía.'],
]
const REXISTROS: [string, string][] = [
  ['Rexistro formal', 'lingua elaborada; en situacións académicas e nalgúns traballos. Só o pode usar quen ten un nivel culto ou medio. Algunhas profesións teñen léxico especializado (técnico ou científico).'],
  ['Rexistro coloquial', 'lingua máis relaxada, con dialectalismos e frases feitas; en situacións informais, coa xente coñecida e no tempo de lecer. Exemplo: as xergas dos mozos.'],
]

const VARIEDADES_TARXETAS: Tarxeta[] = [
  {
    titulo: 'A lingua estándar',
    texto: (
      <p>
        A lingua {b('estándar')} (ou normativa) é un {b('modelo lingüístico escollido polos lingüistas')} para que {b('todos os falantes poidan falar e escribir da mesma maneira')}{' '}
        e para que os que non a falan (normalmente estranxeiros) poidan aprendela.
      </p>
    ),
  },
  {
    titulo: 'Catro factores, catro variedades',
    texto: (
      <ul className="space-y-2">
        {VARIEDADES.map(([v, f, e]) => (
          <li key={v}>
            {b(`V. ${v.toLowerCase()}`)}: dependen de {f.charAt(0).toLowerCase() + f.slice(1)}. <span className="text-slate-600">({e})</span>
          </li>
        ))}
        <li className="text-base text-slate-600">💡 Truco: dia-{b('stráticas')} = estrato social (nivel); dia-{b('fásicas')} = fase, situación (rexistro); dia-{b('tópicas')} = topos, lugar; dia-{b('crónicas')} = cronos, tempo.</li>
      </ul>
    ),
  },
  { titulo: 'Os tres niveis de lingua', texto: <><p>Dependen das condicións sociais do falante (profesión, residencia, formación cultural).</p><Lista items={NIVEIS} /></> },
  { titulo: 'Os rexistros', texto: <><p>Son as formas de expresarse dun mesmo falante segundo a situación: con quen fala, onde, de que…</p><Lista items={REXISTROS} /></> },
  {
    titulo: 'Frases feitas (boletín 1)',
    texto: <Lista items={FRASES_FEITAS} />,
  },
  {
    titulo: 'O príncipe Estanislao (Tanis I o Mocos)',
    texto: (
      <>
        <p>
          Chama a atención porque {b('un príncipe fala co seu Real Consello en rexistro coloquial')}, coa {b('xerga dos mozos')}, cando a situación pide un {b('rexistro formal')}.
          Esa fala serve para os amigos, no recreo ou nun contexto de lecer.
        </p>
        <ul className="mt-2 space-y-1 text-base">
          {TANIS.map(([c, f]) => (
            <li key={c}>
              «{c}» → {b(f)}
            </li>
          ))}
        </ul>
      </>
    ),
  },
]

const NOMES_VAR = VARIEDADES.map(([v]) => v)
const NOMES_NIVEIS = ['Nivel culto', 'Nivel medio', 'Nivel vulgar']
const SIGNIFICADOS_FRASES = FRASES_FEITAS.map(([, s]) => s)

const VARIEDADES_PREG: Pregunta[] = [
  elixe('Que é a lingua estándar?', 'O modelo escollido polos lingüistas para que todos falen e escriban da mesma maneira', ['A lingua das persoas maiores', 'A fala dunha zona concreta de Galicia', 'A lingua que se usa só cos amigos'], 'Tamén se chama normativa; serve ademais para que os estranxeiros a poidan aprender.'),
  ...VARIEDADES.map(([v, f]) => elixe(<>As variedades que dependen de «{f.charAt(0).toLowerCase() + f.slice(1)}» son as…</>, v, outrasDe(NOMES_VAR, v), `Variedades ${v.toLowerCase()}.`)),
  ...VARIEDADES.map(([v, , e]) => elixe(<>As variedades {v.toLowerCase()} danlle nome a…</>, e, outrasDe(VARIEDADES.map(([, , x]) => x), e), `${v}: ${e}.`)),
  elixe('Un presentador do telexornal adoita usar o…', 'Nivel medio', ['Nivel vulgar', 'Rexistro coloquial', 'Bloque oriental'], 'O nivel medio é o dos medios de comunicación, a administración e o ensino.'),
  elixe('Unha persoa sen formación académica, con moitos castelanismos e faltas de ortografía, usa o…', 'Nivel vulgar', ['Nivel culto', 'Nivel medio', 'Rexistro formal'], 'Castelanismos, vulgarismos e faltas: nivel vulgar.'),
  elixe('Unha catedrática que fala sen castelanismos e con palabras moi precisas usa o…', 'Nivel culto', ['Nivel medio', 'Nivel vulgar', 'Rexistro coloquial'], 'Elevada formación cultural e palabras precisas: nivel culto.'),
  elixe('Cos amigos no recreo, cun «tío, mola moito», usamos o…', 'Rexistro coloquial', ['Rexistro formal', 'Nivel culto', 'Bloque central'], 'Situación informal e xerga dos mozos: rexistro coloquial.'),
  elixe('Nunha exposición oral diante do tribunal dun concurso usamos o…', 'Rexistro formal', ['Rexistro coloquial', 'Nivel vulgar', 'Bloque occidental'], 'Situación académica ou laboral: rexistro formal.'),
  elixe('Quen pode usar o rexistro formal?', 'Quen ten un nivel culto ou medio de lingua', ['Calquera falante, sen máis', 'Só as persoas do bloque central', 'Só os estranxeiros'], 'Precisa unha lingua elaborada.'),
  elixe('Os rexistros dependen…', 'Da situación: con quen falas, onde e de que', ['Da zona onde naciches', 'Do século no que vives', 'Da túa idade'], 'Un mesmo falante cambia de rexistro segundo a situación.'),
  elixe('A diferenza entre os niveis e os rexistros é que…', 'Os niveis dependen da formación do falante e os rexistros da situación', ['Os niveis dependen da zona e os rexistros do tempo', 'Son o mesmo', 'Os rexistros só existen na escrita'], 'Niveis: diastráticos. Rexistros: diafásicos.'),
  elixe('Un falante de Lugo di «cas» en vez de «cans». Que variedade é?', 'Diatópica', ['Diastrática', 'Diafásica', 'Diacrónica'], 'Depende da zona xeográfica: diatópica.'),
  elixe('O galego da Idade Media é distinto do de hoxe. Que variedade é?', 'Diacrónica', ['Diatópica', 'Diastrática', 'Diafásica'], 'Depende do tempo: diacrónica.'),
  ...FRASES_FEITAS.map(([f, s]) => elixe(<>Que significa «{f}»?</>, s, outrasDe(SIGNIFICADOS_FRASES, s), `«${f}»: ${s.toLowerCase()}.`)),
  elixe('Por que chama a atención a fala do príncipe Estanislao?', 'Usa un rexistro coloquial e xerga xuvenil cando a situación pide un rexistro formal', ['Fala en castelán', 'Usa palabras do bloque oriental', 'Fala coma un libro aberto'], 'Diante do Real Consello debería falar en rexistro formal.'),
  ...TANIS.map(([c, f]) => elixe(<>Como dirías nun rexistro formal «{c}»?</>, f, outrasDe(TANIS.map(([, x]) => x), f), `«${c}» é coloquial; en formal: «${f}».`)),
]

const VARIEDADES_XOGOS: Xogo[] = [
  {
    id: 'frases',
    titulo: 'Frases feitas',
    icono: '💬',
    explica: 'As do boletín 1: une cada unha co que significa.',
    crear: (acabar) => <Une pares={barallar(FRASES_FEITAS).slice(0, 6).map(([palabra, significado]) => ({ palabra, significado }))} acabar={acabar} />,
  },
  {
    id: 'variedades',
    titulo: 'Os catro factores',
    icono: '🧭',
    explica: 'Une cada variedade co factor do que depende.',
    crear: (acabar) => <Une pares={VARIEDADES.map(([v, f]) => ({ palabra: v, significado: f }))} acabar={acabar} />,
  },
  {
    id: 'rexistros',
    titulo: 'Formal ou coloquial?',
    icono: '🎩',
    explica: 'Coloca cada expresión.',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'f', nome: 'Formal', cor: 'border-sky-300 bg-sky-100' },
          { id: 'c', nome: 'Coloquial', cor: 'border-pink-300 bg-pink-100' },
        ]}
        elementos={barallar([...TANIS.map(([c]) => ({ texto: c, caixa: 'c', pista: 'É xerga ou fala relaxada: coloquial.' })), ...TANIS.map(([, f]) => ({ texto: f, caixa: 'f', pista: 'É lingua coidada: formal.' }))]).slice(0, 8)}
        acabar={acabar}
      />
    ),
  },
]

export function Variedades({ ruta, modo }: { ruta: string; modo?: string }) {
  return (
    <ParadaPrimaria
      ruta={ruta}
      titulo="Variedades, niveis e rexistros"
      modo={modo}
      paneis={{
        descubre: <Tarxetas tarxetas={VARIEDADES_TARXETAS} xoga={`${ruta}/xoga`} />,
        xoga: <Xogos xogos={VARIEDADES_XOGOS} proba={`${ruta}/proba`} />,
        proba: <Proba id="galego2/variedades" preguntas={VARIEDADES_PREG} />,
      }}
    />
  )
}

// ===================================================================================================
// 4. Os bloques dialectais (as solucións calcúlaas src/lib/dialectos.ts)
// ===================================================================================================

const ZONAS: Record<string, string> = {
  occidental: 'As zonas occidentais da Coruña e Pontevedra.',
  central: 'O interior da Coruña e Pontevedra e as provincias de Lugo e Ourense, agás as súas zonas orientais.',
  oriental: 'O galego exterior (Asturias, León e Zamora) e o leste de Lugo e Ourense.',
}

const TRAZOS_BLOQUE = (bl: string) => (Object.keys(TRAZOS) as Trazo[]).filter((t) => TRAZOS[t].bloques.includes(bl as never))
const explicaPalabra = (f: string, e: string) => {
  const t = trazosDe(f, e)
  return `«${f}»: ${t.map((x) => TRAZOS[x].nome).join(' e ')}${f !== e ? ` (estándar: ${e})` : ''}. Bloque ${nomeBloques(bloquesDaPalabra(f, e)).toLowerCase()}.`
}
const RESPOSTAS_BLOQUE = ['Occidental', 'Central', 'Oriental', 'Central e oriental']
const SOLUCION_FRASES = FRASES_BLOQUES.map((x) => ({ frase: x.frase, dialectais: x.cambios, ...estandarizar(x.frase, x.cambios) }))

/** Versións a medio corrixir para usar como opcións falsas. */
function medioCorrixidas(frase: string, cambios: Record<string, { estandar: string }>): string[] {
  const claves = Object.keys(cambios)
  return claves.map((deixar) => estandarizar(frase, Object.fromEntries(Object.entries(cambios).filter(([k]) => k !== deixar))).texto)
}

const BLOQUES_TARXETAS: Tarxeta[] = [
  {
    titulo: 'Os tres bloques',
    texto: (
      <>
        <p>As variedades xeográficas son pequenas diferenzas, sobre todo morfolóxicas, léxicas e fonéticas. No galego hai tres bloques:</p>
        <Lista items={BLOQUES.map((bl) => [`Bloque ${NOME_BLOQUE[bl].toLowerCase()}`, ZONAS[bl]])} />
        <p className="text-base text-slate-600">O mapa lingüístico: «ladróns!» (occidental), «ladrós!» (central), «ladrois!» (oriental).</p>
      </>
    ),
  },
  ...BLOQUES.map(
    (bl): Tarxeta => ({
      titulo: `Bloque ${NOME_BLOQUE[bl].toLowerCase()}`,
      texto: (
        <ul className="list-disc space-y-1.5 pl-5">
          {bl === 'occidental' ? null : <li>Sen gheada (gato, amigo) e sen seseo (luz, dez, facer, veciño).</li>}
          {TRAZOS_BLOQUE(bl).map((t) => (
            <li key={t}>
              {b(TRAZOS[t].nome)} ({TRAZOS[t].exemplo})
            </li>
          ))}
          <li>
            Pronome suxeito {b(PRONOME[bl])}.
          </li>
        </ul>
      ),
    }),
  ),
  {
    titulo: 'Boletín 2, exercicio 1',
    texto: (
      <>
        <ul className="space-y-1 text-base">
          {BLOQUES.map((bl) => (
            <li key={bl}>
              {b(NOME_BLOQUE[bl])}: {PALABRAS_BLOQUES.filter(([f, e]) => bloquesDaPalabra(f, e).includes(bl)).map(([f]) => f).join(', ')}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-base text-slate-600">«cuando» é un castelanismo (en galego, «cando»), non un trazo dun bloque; «moito / muito» non vén nas diapositivas.</p>
      </>
    ),
  },
  {
    titulo: 'Boletín 2, exercicio 2',
    texto: (
      <ul className="space-y-3 text-base">
        {SOLUCION_FRASES.map((x) => (
          <li key={x.frase}>
            <span className="text-slate-500">{x.frase}</span>
            <br />→ {b(x.texto)}
            <br />
            Bloque {nomeBloques(x.bloques).toLowerCase()}: {x.cambios.map((c) => (c.trazos.length ? `${c.forma} (${c.trazos.map((t) => TRAZOS[t].nome).join(', ')})` : `${c.forma} → ${c.estandar}`)).join('; ')}.
          </li>
        ))}
      </ul>
    ),
  },
]

const BLOQUES_PREG: Pregunta[] = [
  ...[...PALABRAS_BLOQUES, ...PALABRAS_BLOQUES_MAIS].map(([f, e]) => {
    const correcta = nomeBloques(bloquesDaPalabra(f, e))
    return elixe(<>De que bloque é a forma «{f}»?</>, correcta, outrasDe(RESPOSTAS_BLOQUE, correcta), explicaPalabra(f, e))
  }),
  ...(Object.keys(TRAZOS) as Trazo[]).map((t) => {
    const correcta = nomeBloques(TRAZOS[t].bloques)
    return elixe(<>O trazo «{TRAZOS[t].nome}» ({TRAZOS[t].exemplo}) é do bloque…</>, correcta, outrasDe(RESPOSTAS_BLOQUE, correcta), `${TRAZOS[t].nome}: bloque ${correcta.toLowerCase()}.`)
  }),
  ...SOLUCION_FRASES.map((x) => elixe(<>Pasa ao estándar: «{x.frase}»</>, x.texto, [...new Set([...medioCorrixidas(x.frase, x.dialectais), x.frase])].filter((m) => m !== x.texto).slice(0, 3), `Cámbianse ${x.cambios.map((c) => `«${c.forma}» por «${c.estandar}»`).join(', ')}.`)),
  ...SOLUCION_FRASES.map((x) => {
    const correcta = nomeBloques(x.bloques)
    return elixe(<>«{x.frase}». En que bloque dialectal se debe situar?</>, correcta, outrasDe(RESPOSTAS_BLOQUE, correcta), `Polos trazos: ${x.cambios.filter((c) => c.trazos.length).map((c) => `${c.forma} (${c.trazos.map((t) => TRAZOS[t].nome).join(', ')})`).join('; ')}.`)
  }),
  ...BLOQUES.map((bl) => elixe(<>Que zona ocupa o bloque {NOME_BLOQUE[bl].toLowerCase()}?</>, ZONAS[bl], BLOQUES.filter((x) => x !== bl).map((x) => ZONAS[x]), `Bloque ${NOME_BLOQUE[bl].toLowerCase()}.`)),
  elixe('Que pronome suxeito se usa no bloque oriental?', 'tu', ['ti', 'vostede'], 'Occidental: ti; central: ti / tu; oriental: tu.'),
  elixe('Que pronome suxeito se usa no bloque occidental?', 'ti', ['tu', 'vós'], 'Occidental: ti; central: ti / tu; oriental: tu.'),
  elixe('Que bloque ten a gheada e o seseo?', 'Occidental', ['Central', 'Oriental', 'Central e oriental'], 'Os dous trazos son só do occidental.'),
  elixe('No bloque occidental, como se di «a irmá»?', 'a irmán', ['a irmao', 'a irmana'], 'O occidental usa -án nos dous xéneros: o irmán / a irmán.'),
]

const BLOQUES_XOGOS: Xogo[] = [
  {
    id: 'clasifica',
    titulo: 'Boletín 2: clasifica as palabras',
    icono: '🗺️',
    explica: 'Leva cada palabra ao seu bloque.',
    crear: (acabar) => (
      <Clasifica
        caixas={BLOQUES.map((bl, i) => ({ id: bl, nome: NOME_BLOQUE[bl], cor: ['border-sky-300 bg-sky-100', 'border-indigo-300 bg-indigo-100', 'border-fuchsia-300 bg-fuchsia-100'][i] }))}
        elementos={barallar([...PALABRAS_BLOQUES, ...PALABRAS_BLOQUES_MAIS].filter(([f, e]) => bloquesDaPalabra(f, e).length === 1))
          .filter(([f], i, xs) => xs.findIndex(([g]) => g === f) === i)
          .slice(0, 9)
          .map(([f, e]) => ({ texto: f, caixa: bloquesDaPalabra(f, e)[0], pista: explicaPalabra(f, e) }))}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'trazos',
    titulo: 'Cada trazo co seu exemplo',
    icono: '🔗',
    explica: 'Une o trazo coas palabras que o teñen.',
    crear: (acabar) => <Une pares={barallar(Object.values(TRAZOS)).slice(0, 6).map((t) => ({ palabra: t.nome, significado: t.exemplo }))} acabar={acabar} />,
  },
]

export function Bloques({ ruta, modo }: { ruta: string; modo?: string }) {
  return (
    <ParadaPrimaria
      ruta={ruta}
      titulo="Os bloques dialectais"
      modo={modo}
      paneis={{
        descubre: <Tarxetas tarxetas={BLOQUES_TARXETAS} xoga={`${ruta}/xoga`} />,
        xoga: <Xogos xogos={BLOQUES_XOGOS} proba={`${ruta}/proba`} />,
        proba: <Proba id="galego2/bloques" preguntas={BLOQUES_PREG} />,
      }}
    />
  )
}

// ===================================================================================================
// 5. O adxectivo (as formas calcúlaas src/lib/adxectivos.ts)
// ===================================================================================================

const COMP_TEXTO = (grao: 'igualdade' | 'superioridade' | 'inferioridade', diante: 'nome' | 'verbo') => {
  const c = comparativo(grao, diante)
  return `${c.primeiro} … ${c.segundo.join(' / ')}`
}
const fraseComparativa = (x: (typeof COMPARATIVOS)[number]) => {
  const c = comparativo(x.grao, x.diante)
  return `${x.antes} ${c.primeiro} ${x.adx} ${c.segundo[0]} ${x.despois}`
}

const XENERO: { adx: string; xentilicio?: boolean }[] = [
  { adx: 'alto' }, { adx: 'bo' }, { adx: 'mao' }, { adx: 'galopín' }, { adx: 'lacazán' }, { adx: 'burricán' }, { adx: 'langrán' }, { adx: 'abusón' }, { adx: 'lambón' },
  { adx: 'ourensán', xentilicio: true }, { adx: 'noiés', xentilicio: true }, { adx: 'cru' }, { adx: 'veraz' }, { adx: 'infantil' }, { adx: 'etíope' }, { adx: 'estradense' }, { adx: 'cortés' },
]
const PLURAIS = ['alto', 'bo', 'galopín', 'veraz', 'infantil', 'fácil', 'cruel', 'azul', 'etíope', 'útil', 'feliz']

const ADXECTIVO_TARXETAS: Tarxeta[] = [
  {
    titulo: 'Xénero e número',
    texto: (
      <>
        <p>
          {b('Dúas terminacións')}: alto / alta, bo / boa, galopín / galopina. {b('Unha soa')}: veraz, infantil, etíope (os acabados en {b('vogal tónica')} e todos os acabados en{' '}
          {b('-e')} son invariables).
        </p>
        <p>
          {b('Ollo')}: -án / -ana e -ón / -ona son {b('pexorativos')} (indican calidades negativas): burricán / burricana, langrán / langrana, abusón / abusona, lambón / lambona. Os
          xentilicios en -án fan -á: ourensán / ourensá.
        </p>
        <p>Plural, como nos substantivos: bos / boas, altos, galopíns, veraces, infantís, fáciles, crueis.</p>
      </>
    ),
  },
  {
    titulo: 'Os graos',
    texto: (
      <>
        <p>{b('Positivo')}: sen aumentar nin diminuír (un home gordo).</p>
        <ul className="mt-1 space-y-1">
          <li>{b('Comparativo de igualdade')}: tan + adx. + como / coma; igual (de) + adx. + que / ca / do que.</li>
          <li>{b('De superioridade')}: máis + adx. + que / ca / do que.</li>
          <li>{b('De inferioridade')}: menos + adx. + que / ca / do que.</li>
        </ul>
        <p className="mt-2 text-base text-slate-600">💡 Diante dun verbo (unha oración) vai «do que»: «menos bos do que pensaba». Diante dun nome ou pronome, «que / ca»: «máis alta ca ti».</p>
      </>
    ),
  },
  {
    titulo: 'O superlativo',
    texto: (
      <>
        <p>
          {b('Absoluto')}: moi simpático, simpatiquísimo, ben simpático, simpático abondo, simpático simpático, hipersimpático…
        </p>
        <p>
          {b('Relativo')}: en relación cun grupo: {b('o máis simpático da clase')}.
        </p>
        <p className="text-base">
          🔍 Non o confundas co comparativo: «É {b('máis simpático que')} todos» é comparativo de superioridade; «É {b('o máis simpático da')} clase» é superlativo relativo.
        </p>
        <p className="text-base">Sintéticos da folla: {ADX_SINTETICOS.map((a) => `${a} → ${superlativoSintetico(a).join(' / ')}`).join('; ')}.</p>
      </>
    ),
  },
  {
    titulo: 'Tipos de adxectivos',
    texto: (
      <ul className="list-disc space-y-2 pl-5">
        <li>{b('Obxectivos')} (non dependen da opinión): instrumento metálico, módulo lunar. {b('Subxectivos')} (valoracións): fermosa paisaxe, pinturas intrigantes.</li>
        <li>{b('Explicativos ou epítetos')}: a calidade xa está no nome; adoitan ir diante: branca neve, ceo azul, auga cristalina.</li>
        <li>{b('Especificativos')}: distinguen ese nome doutros da súa clase: hamburguesa completa, sándwich misto.</li>
        <li>{b('Xentilicios')}: a orixe: ourensán / ourensá, estradense, noiés.</li>
      </ul>
    ),
  },
  {
    titulo: 'A colocación cambia o significado',
    texto: (
      <ul className="list-disc space-y-2 pl-5">
        <li>«Os {b('estudosos alumnos')} aprobaron» = todos eran estudosos. «Os {b('alumnos estudosos')} aprobaron» = só os estudosos.</li>
        <li>«Xoán é un {b('gran home')}» = boa persoa. «Xoán é un {b('home grande')}» = de tamaño.</li>
      </ul>
    ),
  },
  {
    titulo: 'Ollo coa concordancia',
    texto: (
      <p>
        Estes nomes teñen en galego outro xénero ca en castelán: {CONCORDANCIA.map((c) => b(c.nome)).reduce<ReactNode[]>((a, x, i) => (i ? [...a, ', ', x] : [x]), [])}. Por iso: a
        marxe estreita, o leite quente, a ponte nova, o diadema novo.
      </p>
    ),
  },
]

const ADXECTIVO_PREG: Pregunta[] = [
  ...ADX_SINTETICOS.map((a) => {
    const ben = superlativoSintetico(a)
    const mal = [`${a}ísimo`, `máis ${a}`, `${a}iño`, `tan ${a}`].filter((x) => !ben.includes(x)).slice(0, 3)
    return elixe(<>Superlativo sintético de «{a}»:</>, ben[0], mal, `${a} → ${ben.join(' ou ')}.`)
  }),
  ...ADX_SUPERLATIVOS.map((a) => elixe(<>Cal destas NON é unha forma de superlativo de «{a}»?</>, `máis ${a} ca ti`, barallar(superlativos(a)).slice(0, 3), `«Máis ${a} ca ti» é un comparativo de superioridade. Superlativos: ${superlativos(a).join(', ')}…`)),
  ...COMPARATIVOS.map((x) => {
    const correcta = COMP_TEXTO(x.grao, x.diante)
    const outras = (['igualdade', 'superioridade', 'inferioridade'] as const).filter((g) => g !== x.grao).map((g) => COMP_TEXTO(g, x.diante))
    return elixe(<>«{x.antes} ___ {x.adx} ___ {x.despois}» (comparativo de {x.grao})</>, correcta, outras, fraseComparativa(x))
  }),
  ...CONCORDANCIA.map((c) => elixe(<>«{c.frase}»</>, c.ben, [c.mal], `En galego dise ${c.nome} (${c.xenero}).`)),
  ...EXPLICATIVOS.flatMap((x) => [
    elixe(<>«{x.explicativo}» O adxectivo «{x.adx}» é…</>, 'Explicativo (epíteto)', ['Especificativo', 'Xentilicio'], 'Di algo que xa se sabe do nome; non distingue.'),
    elixe(<>«{x.especificativo}» O adxectivo «{x.adx}» é…</>, 'Especificativo', ['Explicativo (epíteto)', 'Xentilicio'], 'Distingue ese nome doutros da mesma clase.'),
  ]),
  ...XENERO.map(({ adx, xentilicio }) => {
    const n = terminacions(adx, xentilicio)
    return elixe(<>Cantas terminacións de xénero ten «{adx}»?</>, n === 1 ? 'Unha (invariable)' : 'Dúas', [n === 1 ? 'Dúas' : 'Unha (invariable)'], n === 1 ? `«${adx}» vale para os dous xéneros.` : `${adx} / ${feminino(adx, xentilicio)}.`)
  }),
  ...XENERO.filter(({ adx, xentilicio }) => terminacions(adx, xentilicio) === 2 && adx !== 'alto').map(({ adx, xentilicio }) => {
    const f = feminino(adx, xentilicio)
    const mal = [adx.endsWith('án') ? (xentilicio ? adx.slice(0, -2) + 'ana' : adx.slice(0, -2) + 'á') : '', adx + 'a', adx.replace(/o$/, 'a') + 'a', adx === 'mao' ? 'maa' : ''].filter((x) => x && x !== f)
    return elixe(<>Feminino de «{adx}»:</>, f, [...new Set(mal)].slice(0, 2), `${adx} / ${f}${adx.endsWith('án') && !xentilicio ? ' (as terminacións -án / -ana son pexorativas)' : ''}.`)
  }),
  ...PLURAIS.map((a) => {
    const p = plural(a)
    const mal = [a + 'es', a + 's', a.replace(/l$/, 'les'), a.replace(/z$/, 'zes')].filter((x) => x !== p && x !== a)
    return elixe(<>Plural de «{a}»:</>, p, [...new Set(mal)].slice(0, 2), `${a} → ${p}.`)
  }),
  elixe('«É o máis simpático da clase». Que grao é?', 'Superlativo relativo', ['Comparativo de superioridade', 'Superlativo absoluto', 'Positivo'], 'Compara cun grupo (a clase) usando «o máis… de».'),
  elixe('«É máis simpático que todos os da clase». Que grao é?', 'Comparativo de superioridade', ['Superlativo relativo', 'Superlativo absoluto', 'Positivo'], '«Máis… que» é comparativo de superioridade.'),
  elixe('«Un home altísimo». Que grao é?', 'Superlativo absoluto', ['Superlativo relativo', 'Comparativo de superioridade', 'Positivo'], 'Calidade no grao máximo, sen comparar con ningún grupo.'),
  elixe('«Un home gordo e colorado». Que grao é?', 'Positivo', ['Superlativo absoluto', 'Comparativo de igualdade', 'Superlativo relativo'], 'Non aumenta nin diminúe a calidade.'),
  elixe('«Ourensán, estradense, noiés» son adxectivos…', 'Xentilicios', ['Explicativos', 'Pexorativos', 'Superlativos'], 'Indican a orixe.'),
  elixe('As terminacións -án / -ana e -ón / -ona indican…', 'Calidades negativas (son pexorativas)', ['Que é un superlativo', 'A orixe de alguén', 'Que é invariable'], 'Lambón, abusón, langrán… son pexorativos.'),
  elixe('Cal destes adxectivos é subxectivo?', 'fermosa', ['metálico', 'lunar', 'crecho'], 'Depende da opinión de quen fala.'),
  elixe('«Os alumnos estudosos aprobaron o exame» quere dicir que…', 'Só aprobaron os que eran estudosos', ['Todos os alumnos eran estudosos', 'Ningún aprobou', 'Os alumnos son grandes'], 'Detrás, especifica: só eses.'),
  elixe('«Os estudosos alumnos aprobaron o exame» quere dicir que…', 'Todos os alumnos eran estudosos', ['Só aprobaron algúns', 'Ningún era estudoso', 'Aprobaron por sorte'], 'Diante, explica: todos o eran.'),
  elixe('«Xoán é un gran home» quere dicir que…', 'É boa persoa', ['É moi alto', 'É moi gordo', 'É maior'], '«Gran home» fala da súa forma de ser; «home grande», do tamaño.'),
]

const ADXECTIVO_XOGOS: Xogo[] = [
  {
    id: 'sinteticos',
    titulo: 'Superlativos sintéticos',
    icono: '🔝',
    explica: 'Exercicio 1 da folla: une cada adxectivo co seu superlativo.',
    crear: (acabar) => <Une pares={barallar(ADX_SINTETICOS).slice(0, 6).map((a) => ({ palabra: a, significado: superlativoSintetico(a).join(' / ') }))} acabar={acabar} />,
  },
  {
    id: 'graos',
    titulo: 'Comparativo ou superlativo?',
    icono: '⚖️',
    explica: 'Coloca cada expresión.',
    crear: (acabar) => (
      <Clasifica
        caixas={[
          { id: 'c', nome: 'Comparativo', cor: 'border-sky-300 bg-sky-100' },
          { id: 's', nome: 'Superlativo', cor: 'border-amber-300 bg-amber-100' },
        ]}
        elementos={barallar([
          ...['tan listo coma ti', 'máis alta que unha faia', 'menos falador ca ela', 'igual de sabia ca ti', 'máis simpático que todos'].map((texto) => ({ texto, caixa: 'c', pista: 'Compara con outro: comparativo.' })),
          ...['altísimo', 'moi alto', 'o máis alto do mundo', 'alto abondo', 'ben alto', 'alto alto'].map((texto) => ({ texto, caixa: 's', pista: 'Grao máximo: superlativo.' })),
        ]).slice(0, 8)}
        acabar={acabar}
      />
    ),
  },
  {
    id: 'vf',
    titulo: 'Verdadeiro ou falso?',
    icono: '✅',
    explica: 'Sobre o adxectivo.',
    crear: (acabar) => (
      <VerdadeiroFalso
        frases={[
          { texto: '«Etíope» ten unha soa terminación.', certa: true, explica: 'Todos os acabados en -e son invariables.' },
          { texto: 'En galego dise «a ponte nova».', certa: true, explica: 'Ponte é feminino en galego.' },
          { texto: 'En galego dise «a leite quente».', certa: false, explica: 'O leite é masculino.' },
          { texto: '«Lambón / lambona» é pexorativo.', certa: true, explica: '-ón / -ona indica calidade negativa.' },
          { texto: '«Branca neve» leva un adxectivo especificativo.', certa: false, explica: 'É un epíteto (explicativo): toda neve é branca.' },
          { texto: 'O plural de «infantil» é «infantís».', certa: true, explica: '-il tónico fai -ís.' },
        ]}
        acabar={acabar}
      />
    ),
  },
]

export function Adxectivo({ ruta, modo }: { ruta: string; modo?: string }) {
  return (
    <ParadaPrimaria
      ruta={ruta}
      titulo="O adxectivo"
      modo={modo}
      paneis={{
        descubre: <Tarxetas tarxetas={ADXECTIVO_TARXETAS} xoga={`${ruta}/xoga`} />,
        xoga: <Xogos xogos={ADXECTIVO_XOGOS} proba={`${ruta}/proba`} />,
        proba: <Proba id="galego2/adxectivo" preguntas={ADXECTIVO_PREG} />,
      }}
    />
  )
}

// ===================================================================================================
// 6. Relacións semánticas: homónimas, parónimas, falsos amigos, til e b/v
// ===================================================================================================

const RELACIONS: [string, string][] = [
  ['Homónimas', 'teñen a mesma forma escrita ou a mesma pronuncia pero orixe distinta; son entradas distintas no dicionario (lama¹ «barro» / lama² «sacerdote budista»).'],
  ['Homógrafas', 'escríbense igual e cambia a pronuncia das vogais e / o; moitas veces diferéncianse co til diacrítico (óso / oso).'],
  ['Homófonas', 'pronúncianse igual pero escríbense distinto (vago «preguiceiro» / bago «uva»).'],
  ['Parónimas', 'parécense moito e por iso confúndense (dedos das mans / dedas dos pés).'],
  ['Falsos amigos', 'son de linguas próximas, iguais na forma pero con significado distinto (rubio).'],
]
const NOMES_REL = RELACIONS.map(([n]) => n)

const FRASES_BV: [string, string, string][] = [
  ['Puxemos as maletas na ___ do coche.', 'baca', 'vaca'],
  ['A ___ deu moito leite este mes.', 'vaca', 'baca'],
  ['Hai que ___ o lixo ao contedor.', 'botar', 'votar'],
  ['O domingo imos ___ nas eleccións.', 'votar', 'botar'],
  ['A parede está chea de ___ pola humidade.', 'balor', 'valor'],
  ['O bombeiro demostrou moito ___.', 'valor', 'balor'],
  ['O ___ de Fisterra entra no mar.', 'cabo', 'cavo'],
  ['Vou ___ as fotos da viaxe.', 'revelar', 'rebelar'],
  ['O museo ___ de Ferrol ten barcos antigos.', 'naval', 'nabal'],
  ['O paxaro ___ sobre a casa.', 'voa', 'boa'],
  ['Desde o cumio víase o ___ océano.', 'vasto', 'basto'],
  ['Mancheime os zapatos de ___.', 'barro', 'varro'],
]
const FRASES_TIL: [string, string, string][] = [
  ['Pecha a ___, que entra frío.', 'ventá', 'venta'],
  ['Comín unha ___ vermella.', 'mazá', 'maza'],
  ['Os meus ___ viven en Lugo.', 'pais', 'país'],
  ['Portugal é un ___ veciño.', 'país', 'pais'],
  ['Iso ___ estupendo.', 'sería', 'seria'],
  ['Puxo a ___ de cadros.', 'saia', 'saía'],
  ['Cando eu ___ da casa, empezou a chover.', 'saía', 'saia'],
  ['A profesora estaba moi ___.', 'seria', 'sería'],
]

const SEMANTICA_TARXETAS: Tarxeta[] = [
  { titulo: 'As relacións entre palabras', texto: <Lista items={RELACIONS} /> },
  {
    titulo: 'Falsos amigos (boletín)',
    texto: (
      <ul className="space-y-1.5">
        {FALSOS_AMIGOS.map((x) => (
          <li key={x.palabra}>
            {b(x.palabra)}: en castelán, {x.castelan}; {b('en galego')}, {x.galego}.
          </li>
        ))}
      </ul>
    ),
  },
  { titulo: 'Palabras que se diferencian polo til', texto: <Lista items={PARES_TIL} /> },
  {
    titulo: 'Parellas con b / v',
    texto: (
      <ul className="space-y-1.5 text-base">
        {PARES_BV.map(([a, sa, v, sv]) => (
          <li key={a}>
            {b(a)}: {sa} · {b(v)}: {sv}
          </li>
        ))}
      </ul>
    ),
  },
]

const SIG_TIL = PARES_TIL.map(([, s]) => s)
const SIG_BV = PARES_BV.flatMap(([, sa, , sv]) => [sa, sv])
const SEMANTICA_PREG: Pregunta[] = [
  ...RELACIONS.map(([n, d]) => elixe(<>«{d.split(' (')[0]}». Como se chaman estas palabras?</>, n, outrasDe(NOMES_REL, n), `${n}: ${d}`)),
  elixe('«lama» (barro) e «lama» (sacerdote budista) son…', 'Homónimas', ['Parónimas', 'Falsos amigos', 'Sinónimas'], 'Escríbense e pronúncianse igual, pero teñen orixe distinta.'),
  elixe('«óso» e «oso» son…', 'Homógrafas', ['Homófonas', 'Falsos amigos', 'Parónimas'], 'Cambia a pronuncia da vogal e diferéncianse co til diacrítico.'),
  elixe('«vago» e «bago» son…', 'Homófonas', ['Homógrafas', 'Parónimas', 'Falsos amigos'], 'Pronúncianse igual e escríbense distinto.'),
  elixe('«botar» e «votar» son…', 'Homófonas', ['Homógrafas', 'Falsos amigos', 'Antónimas'], 'Soan igual (o b e o v pronúncianse igual) e escríbense distinto.'),
  elixe('«dedos» e «dedas» son…', 'Parónimas', ['Homófonas', 'Falsos amigos', 'Homógrafas'], 'Parécense moito e confúndense.'),
  elixe('«rubio» en castelán e «rubio» en galego son…', 'Falsos amigos', ['Homófonas', 'Parónimas', 'Sinónimas'], 'Iguais na forma, distintos no significado.'),
  ...FALSOS_AMIGOS.map((x) => elixe(<>En galego, «{x.palabra}» significa…</>, x.galego, [x.castelan, ...outrasDe(FALSOS_AMIGOS.map((y) => y.galego), x.galego, 1)], `En castelán, ${x.castelan}.`)),
  ...PARES_TIL.map(([p, s]) => elixe(<>Que significa «{p}»?</>, s, outrasDe(SIG_TIL, s), `${p}: ${s}.`)),
  ...FRASES_TIL.map(([f, ben, mal]) => elixe(<>«{f}»</>, ben, [mal], `${ben}: ${PARES_TIL.find(([p]) => p === ben)![1]}.`)),
  ...PARES_BV.flatMap(([a, sa, v, sv]) => [elixe(<>Que significa «{a}»?</>, sa, [sv, ...outrasDe(SIG_BV, sa, 1).filter((x) => x !== sv)], `${a}: ${sa}. ${v}: ${sv}.`)]),
  ...FRASES_BV.map(([f, ben, mal]) => elixe(<>«{f}»</>, ben, [mal], `${ben} e ${mal} soan igual, pero significan cousas distintas.`)),
]

const SEMANTICA_XOGOS: Xogo[] = [
  {
    id: 'falsos',
    titulo: 'Falsos amigos',
    icono: '🎭',
    explica: 'Une cada palabra co que significa EN GALEGO.',
    crear: (acabar) => <Une pares={FALSOS_AMIGOS.map((x) => ({ palabra: x.palabra, significado: x.galego }))} acabar={acabar} />,
  },
  {
    id: 'til',
    titulo: 'Co til ou sen til',
    icono: '✍️',
    explica: 'Une cada palabra co seu significado.',
    crear: (acabar) => <Une pares={barallar(PARES_TIL).slice(0, 6).map(([palabra, significado]) => ({ palabra, significado }))} acabar={acabar} />,
  },
  {
    id: 'bv',
    titulo: 'B ou V',
    icono: '🅱️',
    explica: 'Une cada palabra co seu significado.',
    crear: (acabar) => (
      <Une
        pares={barallar(PARES_BV)
          .slice(0, 3)
          .flatMap(([a, sa, v, sv]) => [
            { palabra: a, significado: sa },
            { palabra: v, significado: sv },
          ])}
        acabar={acabar}
      />
    ),
  },
]

export function Semantica({ ruta, modo }: { ruta: string; modo?: string }) {
  return (
    <ParadaPrimaria
      ruta={ruta}
      titulo="Homónimas, parónimas e falsos amigos"
      modo={modo}
      paneis={{
        descubre: <Tarxetas tarxetas={SEMANTICA_TARXETAS} xoga={`${ruta}/xoga`} />,
        xoga: <Xogos xogos={SEMANTICA_XOGOS} proba={`${ruta}/proba`} />,
        proba: <Proba id="galego2/semantica" preguntas={SEMANTICA_PREG} />,
      }}
    />
  )
}

// ===================================================================================================
// 7. Vocabulario: o corpo, o pé e a perna, as aves e os 20 castelanismos
// ===================================================================================================

const cuestionario = (lista: [string, string][], pregunta: (es: string) => string) =>
  lista.filter(([gl, es]) => gl !== es).map(([gl, es]) => elixe(pregunta(es), gl, outrasDe(lista.map(([g]) => g), gl), `${es} = ${gl}.`))
const limpo = (s: string) => s.split(' (')[0]

const VOCABULARIO_TARXETAS: Tarxeta[] = [
  { titulo: 'As partes do corpo', texto: <p className="text-base leading-relaxed">{CORPO.map(([gl, es]) => `${gl} (${es})`).join(' · ')}</p> },
  { titulo: 'O pé e a perna', texto: <p className="text-base leading-relaxed">{PE_PERNA.map(([gl, es]) => `${gl} (${es})`).join(' · ')}</p> },
  { titulo: 'Aves de Galiza', texto: <p className="text-base leading-relaxed">{AVES.map(([gl, es]) => `${gl} (${es})`).join(' · ')}</p> },
  {
    titulo: 'Os 20 castelanismos máis frecuentes',
    texto: (
      <>
        <ul className="space-y-1 text-base">
          {CASTELANISMOS.map(([mal, ben]) => (
            <li key={mal}>
              <s className="text-rose-700">{mal}</s> → {b(ben)}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-sm text-slate-500">Do artigo «Nin xove, nin fai frío: os 20 castelanismos máis frecuentes que debes evitar» (GCiencia).</p>
      </>
    ),
  },
  {
    titulo: 'Para non caer nos castelanismos',
    texto: (
      <Caixa>
        Non digas <s>«Doume a espalda»</s>: dóenme as {b('costas')}. Non <s>«me enterei»</s>: {b('decateime')}. Non <s>«o meu cumpreanos»</s>: o meu {b('aniversario')}. Non <s>«o buzón»</s>
        : a {b('caixa do correo')}.
      </Caixa>
    ),
  },
]

const VOCABULARIO_PREG: Pregunta[] = [
  ...cuestionario(CORPO, (es) => `Como se di en galego «${es}»?`),
  ...cuestionario(PE_PERNA, (es) => `Na perna e no pé, como se di en galego «${es}»?`),
  ...cuestionario(AVES, (es) => `Como se chama en galego o paxaro que en castelán é «${es}»?`),
  ...CASTELANISMOS.map(([mal, ben]) => elixe(<>«{limpo(mal)}» é un castelanismo. Como se di ben en galego?</>, ben, [limpo(mal), ...outrasDe(CASTELANISMOS.map(([, x]) => x), ben, 2)], `Non «${limpo(mal)}», senón «${ben}».`)),
  ...CASTELANISMOS.filter(([mal]) => !mal.includes('(')).map(([mal, ben]) =>
    elixe('Cal destas palabras é un castelanismo que hai que evitar?', mal, outrasDe(CASTELANISMOS.filter(([m]) => !m.includes('(')).map(([, x]) => x), ben, 3), `Dise «${ben}».`),
  ),
]

const VOCABULARIO_XOGOS: Xogo[] = [
  { id: 'corpo', titulo: 'O corpo', icono: '🧍', explica: 'Une o nome en galego co castelán.', crear: (acabar) => <Une pares={barallar(CORPO).slice(0, 6).map(([palabra, significado]) => ({ palabra, significado }))} acabar={acabar} /> },
  { id: 'pe', titulo: 'O pé e a perna', icono: '🦶', explica: 'Une o nome en galego co castelán.', crear: (acabar) => <Une pares={barallar(PE_PERNA).slice(0, 6).map(([palabra, significado]) => ({ palabra, significado }))} acabar={acabar} /> },
  { id: 'aves', titulo: 'Aves de Galiza', icono: '🐦', explica: 'Une o nome en galego co castelán.', crear: (acabar) => <Une pares={barallar(AVES.filter(([g, e]) => g !== e)).slice(0, 6).map(([palabra, significado]) => ({ palabra, significado }))} acabar={acabar} /> },
  { id: 'castelanismos', titulo: 'Fóra castelanismos', icono: '🚫', explica: 'Une cada castelanismo coa forma galega.', crear: (acabar) => <Une pares={barallar(CASTELANISMOS).slice(0, 6).map(([m, palabra]) => ({ palabra, significado: limpo(m) }))} acabar={acabar} /> },
]

export function Vocabulario({ ruta, modo }: { ruta: string; modo?: string }) {
  return (
    <ParadaPrimaria
      ruta={ruta}
      titulo="Vocabulario e castelanismos"
      modo={modo}
      paneis={{
        descubre: <Tarxetas tarxetas={VOCABULARIO_TARXETAS} xoga={`${ruta}/xoga`} />,
        xoga: <Xogos xogos={VOCABULARIO_XOGOS} proba={`${ruta}/proba`} />,
        proba: <Proba id="galego2/vocabulario" preguntas={VOCABULARIO_PREG} />,
      }}
    />
  )
}

export const PREGUNTAS_LINGUA2 = { variedades: VARIEDADES_PREG, bloques: BLOQUES_PREG, adxectivo: ADXECTIVO_PREG, semantica: SEMANTICA_PREG, vocabulario: VOCABULARIO_PREG }
export const SOLUCIONS_BLOQUES = SOLUCION_FRASES
