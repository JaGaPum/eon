// Xera «galego-global1.html»: caderno de repaso para o global de Lingua Galega de 2.º ESO (1.ª avaliación, unidades 1 e 2).
// As solucións dos bloques dialectais e do adxectivo saen dos mesmos motores que usa a web (src/lib/dialectos.ts e
// src/lib/adxectivos.ts), e o programa párase se algunha non coincide coa esperada.
// Uso, desde a raíz do repositorio: node apuntes-fuente/galego-global1.gen.mjs
import { writeFileSync } from 'node:fs'
import { createServer } from 'vite'

const server = await createServer({ configFile: false, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
const DI = await server.ssrLoadModule('/src/lib/dialectos.ts')
const AD = await server.ssrLoadModule('/src/lib/adxectivos.ts')
const D = await server.ssrLoadModule('/src/idiomas/galego/global1/datos.ts')
await server.close()

const fallos = []
const espera = (que, dado, bo) => {
  if (String(dado) !== String(bo)) fallos.push(`${que}: sae «${dado}» e agardábase «${bo}»`)
}
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const oco = (s) => esc(s).replace(/___/g, '<span class="hueco"></span>')

const bloques = []
let nEj = 0
const parte = (clase, titulo) => ({ clase, titulo, bloques: [] })
const PARTES = [parte('t1', 'O texto'), parte('t2', 'A lingua por dentro')]
const bloque = (p, titulo, como) => {
  const b = { titulo, como, ejs: [] }
  p.bloques.push(b)
  bloques.push(b)
  return b
}
const ej = (b, nivel, enunciado, solucion) => b.ejs.push({ n: ++nEj, nivel, enunciado, solucion })
const lista = (xs) => `<ol class="items">${xs.map((x) => `<li>${x}</li>`).join('')}</ol>`
const bancoP = (xs) => `<div class="banco">${xs.map(esc).join(' • ')}</div>`
const taboa = (cab, filas) => `<table><tr>${cab.map((c) => `<th>${c}</th>`).join('')}</tr>${filas.map((f) => `<tr>${f.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</table>`
const [T, L] = PARTES

// ============================== O TEXTO ==============================

{
  const b = bloque(
    T,
    'Tratamento do texto (unidade 1)',
    `<div class="g2 grid">
      <div class="caixa"><h4>Tema</h4>Unha frase <b>nominal</b> (sen verbo), curta e concreta: «Causas e consecuencias dos incendios forestais en Galicia».</div>
      <div class="caixa"><h4>Título</h4>Breve (menos de oito palabras), sen verbos e relacionado co tema; pode ser orixinal.</div>
      <div class="caixa"><h4>Resumo</h4>Un terzo do texto, nun parágrafo, coas <b>túas palabras</b>, só as ideas principais e <b>sen opinións</b>. Comeza: «Este texto trata sobre…».</div>
      <div class="caixa"><h4>Definir palabras</h4>Segundo a súa categoría (un nome cun nome, un verbo cun verbo) e o contexto, sen usar palabras da mesma familia.</div>
    </div>
    <div class="truco">A <b>intención</b> do texto: describir (como é), narrar (que pasou), expoñer (informar e explicar), instruír (como se fai) ou argumentar (convencer).</div>`,
  )
  b.etq = 'Lembra'
}

{
  const b = bloque(
    T,
    'O texto descritivo',
    `<p>A descrición di <b>como é</b> unha persoa, un animal, un obxecto, un lugar ou un sentimento.</p>
    <div class="g2 grid">
      <div class="caixa"><h4>Segundo a intención</h4><b>Obxectiva</b>: imaxe fiel á realidade; enumera trazos, léxico técnico, adxectivos especificativos.<br><b>Subxectiva</b>: a impresión de quen observa; valoracións, léxico común, adxectivos cualificativos e epítetos.</div>
      <div class="caixa"><h4>Segundo o que se describe</h4>${D.TIPOS_DESCRICION.map(([t, d]) => `<b>${t}</b>: ${esc(d.charAt(0).toLowerCase() + d.slice(1))}`).join('<br>')}</div>
    </div>
    <div class="truco">Persoa: só o corpo → prosopografía; só o carácter → etopea; os dous → retrato (de si mesmo → autorretrato); esaxerado → caricatura. Lugar → topografía. Obxecto → pragmatografía.</div>`,
  )
  const xs = D.EXEMPLOS_DESCRICION
  ej(b, 1, `Que tipo de descrición é cada fragmento?${lista(xs.map(([f]) => esc(f)))}`, lista(xs.map(([, t]) => `<b>${t}</b>`)))
  ej(
    b,
    2,
    `Texto da práctica: <i>«O oeste de Texas divide a fronteira entre México e Novo México. É moi bela pero áspera, e chea de cactus; nesta rexión atópanse as Davis Mountains. Todo o terreo está cheo de pedra calcaria, árbores tortos de mezquite e espiñentos nopales. Para admirar a verdadeira beleza desértica, visite o Parque Nacional de Big Bend… A área só ten dúas estacións: morna e realmente quente. A mellor época para visitala é de decembro a marzo…»</i>
    ${lista(['Que elementos nos axudan a facernos unha imaxe do que describe?', 'É unha descrición obxectiva ou subxectiva? Por que?', 'Que tipo de descrición é segundo o que describe?', 'En que xénero textual podería cadrar?'])}`,
    lista([
      'A situación (fronteira entre México e Novo México), o relevo (Davis Mountains, pedra calcaria, planicies e canóns), a vexetación (cactus, mezquites tortos, nopais espiñentos), a poboación (pequenas vilas e ranchos) e o clima (dúas estacións, morna e moi quente).',
      'Case toda é <b>obxectiva</b>: dá datos de situación, vexetación e clima. Pero ten algunhas valoracións subxectivas: «moi bela pero áspera», «a verdadeira beleza desértica».',
      '<b>Topografía</b> (describe un lugar, unha paisaxe).',
      'Nunha <b>guía de viaxes</b> ou folleto turístico: aconsella cando ir e dirixe ao lector («visite o Parque Nacional»).',
    ]),
  )
}

{
  const b = bloque(
    T,
    'Os tipos de texto',
    taboa(['Tipo', 'Que fai'], D.TIPOS_TEXTO.map(([t, d]) => [`<b>${t}</b>`, esc(d)])),
  )
  ej(b, 1, `De que tipo é cada texto da «Práctica tipos de textos»?${lista(D.TEXTOS_PRACTICA.map((x) => `<i>${esc(x.comezo)}</i>`))}`, lista(D.TEXTOS_PRACTICA.map((x) => `<b>${x.tipo}</b>`)))
  ej(
    b,
    2,
    `Sobre os outros textos da práctica:${lista([
      'Texto do lixo: fai un resumo (un terzo do texto). Por que é expositivo?',
      'Texto do caixeiro: que título lle porías? Por que é instrutivo?',
      'Texto de Messi: que defende o autor? Que razóns dá?',
    ])}`,
    lista([
      '<i>Este texto trata sobre como eliminar o lixo das cidades. Os vertedoiros énchense e hai que buscar outros; a incineración contamina o aire; a mellor solución é reciclar, transformando o lixo orgánico en abono e o papel en papel novo, pero para iso a cidadanía ten que separar os residuos.</i> É expositivo porque <b>informa e explica</b> un tema de forma ordenada e obxectiva, sen contar unha historia nin defender unha opinión.',
      '<b>«Como usar o caixeiro automático»</b>. É instrutivo porque dá unha <b>serie de pasos en orde</b> con verbos que mandan (pase, agarde, insira, seleccione, retire).',
      'Defende que <b>Messi é o mellor xogador do mundo</b>. Razóns: marca, asiste e regatea coma ninguén; é humilde e xoga en silencio, sen ser unha «estrela»; é un exemplo humano (a doazón á Cruz Vermella, o agradecemento á Masía); aparece sempre cando os compañeiros o necesitan; e xoga en equipo, como unha peza dun mecanismo.',
    ]),
  )
}

{
  const b = bloque(
    T,
    'O texto narrativo: os elementos da narración',
    `<div class="g2 grid">
      <div class="caixa"><h4>Narrador</h4><b>Interno</b> (1.ª persoa): <b>protagonista</b> (conta a súa historia) ou <b>testemuña</b> (conta a doutro).<br><b>Externo</b> (3.ª persoa): <b>omnisciente</b> (sábeo todo, mesmo o que pensan as personaxes) ou <b>obxectivo</b> (só o que se ve, coma unha cámara).</div>
      <div class="caixa"><h4>Personaxes</h4><b>Principais</b>: o protagonista e, se hai, o antagonista (o que se lle opón). <b>Secundarios</b>: acompañan ou axudan.</div>
      <div class="caixa"><h4>Espazo e tempo</h4><b>Espazo</b>: onde pasa (real ou imaxinario, aberto ou pechado). <b>Tempo</b>: cando pasa e canto dura; orde <b>cronolóxica</b> ou con saltos ao pasado.</div>
      <div class="caixa"><h4>Acción</h4><b>Presentación</b> (comezo), <b>nó</b> (o problema) e <b>desenlace</b> (o final).</div>
    </div>
    <div class="truco">A lectura, <i>Memorias dun neno labrego</i> (Neira Vilas): narrador <b>interno protagonista</b>, Balbino conta en primeira persoa a súa vida.</div>`,
  )
  ej(b, 1, `Que narrador ten cada fragmento?${lista(D.NARRADORES.map(([f]) => esc(f)))}`, lista(D.NARRADORES.map(([, t, e]) => `<b>${t}</b>. ${esc(e)}`)))
  ej(
    b,
    2,
    `<i>${esc(D.TIGRE)}</i> (Marcelo Birmajer, <i>O tigre enfermo</i>)${lista(['Que narrador ten?', 'Cales son as personaxes?', 'Onde e cando pasa?', 'Cales son os acontecementos fundamentais, en orde?', 'Redacta nunha liña o tema.'])}`,
    lista([
      '<b>Externo omnisciente</b>: conta en 3.ª persoa e sabe o que pensa o tigre «para os seus adentros».',
      'Protagonista: <b>o tigre liberado</b>. Secundarios: <b>os seus irmáns tigres</b> (os que o matan). Os humanos só se nomean.',
      'Espazo: <b>a selva</b> (antes viviu cos humanos). Tempo: no pasado, despois de varios anos de vida doméstica; orde <b>cronolóxica</b>.',
      'Presentación: captúrano de cachorro e, anos despois, líbrano. Nó: na selva os irmáns pregúntanlle que aprendeu e el medita a resposta. Desenlace: cando di que non son inmortais, mátano.',
      '<b>O rexeitamento de quen di unha verdade incómoda</b> (ou: o medo a aceptar a morte).',
    ]),
  )
}

// ============================== A LINGUA POR DENTRO ==============================

{
  const b = bloque(
    L,
    'As variedades da lingua',
    `<p>A <b>lingua estándar</b> (ou normativa) é un modelo escollido polos lingüistas para que todos os falantes poidan falar e escribir da mesma maneira e para que os estranxeiros a poidan aprender.</p>
    ${taboa(['Variedades', 'Dependen de…', 'Dan lugar a…'], D.VARIEDADES.map(([v, f, e]) => [`<b>${v}</b>`, esc(f), esc(e)]))}
    <div class="g2 grid">
      <div class="caixa"><h4>Niveis (o falante)</h4><b>Culto</b>: elevada formación; sen castelanismos e con palabras precisas.<br><b>Medio</b>: medios de comunicación, administración, ensino; correcto pero máis sinxelo.<br><b>Vulgar</b>: sen formación académica; castelanismos, vulgarismos e faltas.</div>
      <div class="caixa"><h4>Rexistros (a situación)</h4><b>Formal</b>: lingua elaborada; situacións académicas e laborais; só con nivel culto ou medio.<br><b>Coloquial</b>: lingua relaxada, con dialectalismos e frases feitas; situacións informais; as xergas dos mozos.</div>
    </div>
    <div class="truco">dia-<b>stráticas</b> = estrato social · dia-<b>fásicas</b> = situación · dia-<b>tópicas</b> = lugar · dia-<b>crónicas</b> = tempo.</div>`,
  )
  const sit = [
    ['Un presentador do telexornal', 'nivel medio'],
    ['Unha conversa cos amigos no recreo', 'rexistro coloquial'],
    ['Unha catedrática nunha conferencia, sen castelanismos e con palabras moi precisas', 'nivel culto'],
    ['Unha exposición oral diante dun tribunal', 'rexistro formal'],
    ['Un falante de Lugo que di «cas» en vez de «cans»', 'variedade diatópica'],
    ['Os textos galegos da Idade Media', 'variedade diacrónica'],
  ]
  ej(b, 1, `Que nivel, rexistro ou variedade hai en cada caso?${lista(sit.map(([s]) => esc(s)))}`, lista(sit.map(([, r]) => `<b>${r}</b>`)))
  const ff = D.FRASES_FEITAS
  const sig = [...ff.map(([, s]) => s)].sort()
  ej(b, 1, `Boletín 1. Relaciona cada frase feita co seu significado.${lista(ff.map(([f]) => esc(f)))}${bancoP(sig)}`, lista(ff.map(([, s]) => esc(s))))
  ej(
    b,
    2,
    `Boletín 1. Por que chama a atención a fala do príncipe Estanislao (<i>Tanis I o Mocos</i>)? En que situacións usarías esa fala? Modifica as súas intervencións para que sexan axeitadas diante do Real Consello.
    <div class="ficha">—Outra cousa: o discurso. Teño que largar un discurso, non?<br>—Así é, alteza.<br>—Ben. Improvisarei. Só teño que chimpar unhas birras para animarme e sairame unha arenga chachi churri. Vou deixar a todo o mundo flasheado. (…)<br>—Está ben. Faremos unha cousa: en vez de improvisar no momento, improvisarei antes. Escribirei eu mesmo o meu discurso e deixareillelo ler aos carrozóns do Consello. Así, se algo non lles mola, pódese retocar.</div>`,
    `Chama a atención porque un príncipe usa un <b>rexistro coloquial</b>, coa <b>xerga dos mozos</b> (largar, chimpar unhas birras, chachi churri, flasheado, carrozóns, mola), cando a situación pide un <b>rexistro formal</b>. Esa fala é axeitada cos amigos e en situacións informais e de lecer. Versión formal:
    <div class="ficha">—Outra cousa: o discurso. Debo pronunciar un discurso, non é así?<br>—Así é, alteza.<br>—Ben. Improvisarei. Abondará con tomar algo para darme ánimo e sairá unha arenga excelente. Deixarei a todos abraiados. (…)<br>—Está ben. Faremos unha cousa: en vez de improvisar no momento, prepararei o discurso con antelación. Escribireino eu mesmo e deixarei que o lean os membros do Consello. Así, se algo non lles agrada, poderase corrixir.</div>`,
  )
}

{
  const filas = Object.entries(DI.TRAZOS).map(([, t]) => [esc(t.nome), esc(t.exemplo), DI.nomeBloques(t.bloques)])
  const b = bloque(
    L,
    'Os bloques dialectais',
    `${taboa(['Bloque', 'Onde'], [
      ['<b>Occidental</b>', 'As zonas occidentais da Coruña e Pontevedra.'],
      ['<b>Central</b>', 'O interior da Coruña e Pontevedra e as provincias de Lugo e Ourense, agás as súas zonas orientais.'],
      ['<b>Oriental</b>', 'O galego exterior (Asturias, León e Zamora) e o leste de Lugo e Ourense.'],
    ])}
    ${taboa(['Trazo', 'Exemplo', 'Bloque'], filas)}
    <p>Pronome suxeito: <b>ti</b> (occidental), <b>ti / tu</b> (central), <b>tu</b> (oriental). O central e o oriental non teñen gheada nin seseo (gato, luz, facer, veciño). No mapa: ladróns (occidental), ladrós (central), ladrois (oriental).</p>
    <div class="truco">Para saber o bloque dunha frase, busca os trazos e quédate co bloque que teñen todos en común: irmao (central e oriental) + xamós (central) → <b>central</b>.</div>`,
  )
  const pal = D.PALABRAS_BLOQUES
  const por = (bl) => pal.filter(([f, e]) => DI.bloquesDaPalabra(f, e).includes(bl)).map(([f]) => f)
  espera('occidental', por('occidental').join(', '), 'amigho, ghato, sincuenta, cancións, irmán, xamóns')
  espera('central', por('central').join(', '), 'canciós, xamós')
  espera('oriental', por('oriental').join(', '), 'xamois, canciois, camín, vecín')
  ej(
    b,
    1,
    `Boletín 2. Clasifica as palabras no seu bloque.${bancoP(pal.map(([f]) => f))}`,
    `${taboa(['Bloque', 'Palabras', 'Por que'], DI.BLOQUES.map((bl) => [`<b>${DI.NOME_BLOQUE[bl]}</b>`, por(bl).join(', '), [...new Set(pal.filter(([f, e]) => DI.bloquesDaPalabra(f, e).includes(bl)).flatMap(([f, e]) => DI.trazosDe(f, e)).map((t) => DI.TRAZOS[t].nome))].join('; ')]))}
    <p class="gris">Na folla veñen tamén «cuando», «moito» e «muto / muito»: «cuando» é un castelanismo (en galego, «cando») e a diferenza moito / muito non vén nas diapositivas, por iso non se clasifican aquí.</p>`,
  )
  const sol = D.FRASES_BLOQUES.map((x) => DI.estandarizar(x.frase, x.cambios))
  espera('frases', sol.map((x) => x.bloques.join('+')).join(' | '), 'oriental | occidental | central | occidental')
  ej(
    b,
    2,
    `Boletín 2. Substitúe os dialectalismos polas formas estándar e sinala o bloque dialectal de cada frase.${lista(D.FRASES_BLOQUES.map((x) => esc(x.frase)))}`,
    lista(
      sol.map(
        (x) =>
          `${esc(x.texto)}<br><span class="gris">Bloque <b>${DI.nomeBloques(x.bloques).toLowerCase()}</b>: ${x.cambios
            .map((c) => (c.trazos.length ? `${c.forma} → ${c.estandar} (${c.trazos.map((t) => DI.TRAZOS[t].nome).join(', ')})` : `${c.forma} → ${c.estandar}${c.nota ? ` (${esc(c.nota)})` : ''}`))
            .join('; ')}.</span>`,
      ),
    ),
  )
}

{
  const b = bloque(
    L,
    'O adxectivo',
    `<div class="g2 grid">
      <div class="caixa"><h4>Xénero e número</h4><b>Dúas terminacións</b>: alto / alta, bo / boa, galopín / galopina. <b>Unha</b>: veraz, infantil; e todos os acabados en <b>vogal tónica</b> ou en <b>-e</b> (etíope).<br><b>-án / -ana</b> e <b>-ón / -ona</b> son pexorativos: lambón / lambona, langrán / langrana. Xentilicios: ourensán / ourensá.<br>Plural: bos, galopíns, veraces, infantís, fáciles, crueis.</div>
      <div class="caixa"><h4>Os graos</h4><b>Positivo</b>: un home gordo.<br><b>Comparativo</b>: igualdade (tan… como / coma; igual de… que / ca), superioridade (máis… que / ca / do que), inferioridade (menos… que / ca / do que).<br><b>Superlativo absoluto</b>: moi alto, altísimo, ben alto, alto abondo, alto alto, superalto. <b>Relativo</b>: o máis alto da clase.</div>
      <div class="caixa"><h4>Tipos</h4><b>Obxectivos</b> (metálico, lunar) e <b>subxectivos</b> (fermosa, intrigantes).<br><b>Explicativos ou epítetos</b>: a calidade xa está no nome (branca neve). <b>Especificativos</b>: distinguen (hamburguesa completa). <b>Xentilicios</b>: a orixe (estradense, noiés).</div>
      <div class="caixa"><h4>Colocación</h4>«Os <b>estudosos alumnos</b> aprobaron» = todos o eran; «os <b>alumnos estudosos</b>» = só eses.<br>«Un <b>gran home</b>» = boa persoa; «un <b>home grande</b>» = de tamaño.</div>
    </div>
    <div class="ollo">Non confundas: «É <b>máis simpático que</b> todos» = comparativo de superioridade. «É <b>o máis simpático da</b> clase» = superlativo relativo.</div>
    <div class="truco">Diante dun verbo vai «do que»: «menos bos <b>do que</b> pensaba». Diante dun nome ou pronome, «que / ca»: «máis alta <b>ca</b> ti».</div>`,
  )
  const sint = D.ADX_SINTETICOS.map((a) => AD.superlativoSintetico(a).join(' / '))
  espera('sintéticos', sint.join(', '), 'riquísimo, baixísimo, boísimo / óptimo, antiquísimo / antiguísimo, crudelísimo / cruelísimo, sapientísimo / sabísimo, quentísimo, dificilísimo, acérrimo, paupérrimo / pobrísimo')
  ej(b, 1, `Exercicio 1 da folla. Escribe o superlativo sintético de: ${D.ADX_SINTETICOS.join(', ')}.`, lista(D.ADX_SINTETICOS.map((a, i) => `${a} → <b>${sint[i]}</b>`)))
  const elix = ['bo', 'parvo', 'verde', 'mao', 'fácil', 'branco', 'louco', 'canso']
  ej(b, 1, `Exercicio 2 da folla. Escribe todas as formas de superlativo que coñezas de: ${elix.join(', ')}. (Exemplo: rico → riquísimo, moi rico, rico abondo, ben rico, superrico, requeterrico…)`, lista(elix.map((a) => `${a} → ${AD.superlativos(a).join(', ')}`)))
  const comp = D.COMPARATIVOS.map((x) => {
    const c = AD.comparativo(x.grao, x.diante)
    return { ...x, frase: `${x.antes} <b>${c.primeiro}</b> ${x.adx} <b>${c.segundo.join(' / ')}</b> ${x.despois}` }
  })
  espera('comparativo 3', comp[2].frase.replace(/<\/?b>/g, ''), 'O Miguel obtivo resultados menos bos do que pensaba.')
  ej(b, 1, `Exercicio 3 da folla. Completa co comparativo indicado.${lista(D.COMPARATIVOS.map((x) => `${oco(`${x.antes} ___ ${x.adx} ___ ${x.despois}`)} <span class="gris">(comp. de ${x.grao})</span>`))}`, lista(comp.map((x) => x.frase)))
  const conc = D.CONCORDANCIA.slice(0, 6)
  ej(b, 1, `Exercicio 4 da folla. Completa con adxectivos. Repara na concordancia: estes nomes teñen en galego outro xénero ca en castelán.${lista(conc.map((c) => oco(c.frase)))}`, lista(conc.map((c) => `${esc(c.frase.replace('___', c.ben))} <span class="gris">(${c.nome}, ${c.xenero}; outro adxectivo vale se concorda)</span>`)))
  ej(
    b,
    2,
    `Exercicio 5 da folla. Usa cada adxectivo en dous enunciados: nun como explicativo e noutro como especificativo: ${D.EXPLICATIVOS.map((x) => x.adx).join(', ')}.`,
    `${taboa(['Adxectivo', 'Explicativo (epíteto)', 'Especificativo'], D.EXPLICATIVOS.map((x) => [`<b>${x.adx}</b>`, esc(x.explicativo), esc(x.especificativo)]))}<p class="gris">Son exemplos: valen outros se no explicativo a calidade xa está no nome e no especificativo serve para distinguilo doutros.</p>`,
  )
  const fem = [['lacazán'], ['abusón'], ['galopín'], ['ourensán', true], ['noiés', true], ['bo'], ['mao'], ['cru'], ['veraz'], ['etíope']]
  const fems = fem.map(([a, x]) => AD.feminino(a, x))
  espera('femininos', fems.join(', '), 'lacazana, abusona, galopina, ourensá, noiesa, boa, mala, crúa, veraz, etíope')
  const plu = ['alto', 'galopín', 'veraz', 'infantil', 'fácil', 'cruel', 'azul', 'etíope']
  ej(
    b,
    2,
    `Escribe o feminino de: ${fem.map(([a]) => a).join(', ')}. E o plural de: ${plu.join(', ')}.`,
    `Feminino: ${fem.map(([a], i) => `${a} → <b>${fems[i]}</b>${fems[i] === a ? ' (invariable)' : ''}`).join('; ')}.<br>Plural: ${plu.map((a) => `${a} → <b>${AD.plural(a)}</b>`).join('; ')}.`,
  )
}

{
  const b = bloque(
    L,
    'Relacións semánticas: homónimas, parónimas e falsos amigos',
    `<div class="g2 grid">
      <div class="caixa"><h4>Homónimas</h4>Mesma forma escrita ou mesma pronuncia, pero orixe distinta: entradas distintas no dicionario (lama¹ «barro» / lama² «sacerdote budista»).<br><b>Homógrafas</b>: escríbense igual e cambia a pronuncia das vogais e / o; moitas levan til diacrítico (óso / oso).<br><b>Homófonas</b>: pronúncianse igual e escríbense distinto (vago / bago).</div>
      <div class="caixa"><h4>Parónimas e falsos amigos</h4><b>Parónimas</b>: parécense moito e confúndense (dedos das mans / dedas dos pés).<br><b>Falsos amigos</b>: palabras de linguas próximas iguais na forma e con significado distinto: rubio (cast. «amarelo») / rubio (gal. «vermello»); en galego, para o amarelo, <b>loiro</b>.</div>
    </div>`,
  )
  ej(b, 1, `Que significan estes falsos amigos en castelán e en galego? ${D.FALSOS_AMIGOS.slice(1).map((x) => x.palabra).join(', ')}.`, taboa(['Palabra', 'En castelán', 'En galego'], D.FALSOS_AMIGOS.slice(1).map((x) => [`<b>${x.palabra}</b>`, esc(x.castelan), esc(x.galego)])))
  ej(b, 1, `Que significan estas palabras que se diferencian polo til? ${D.PARES_TIL.map(([p]) => p).join(', ')}.`, lista(D.PARES_TIL.map(([p, s]) => `<b>${p}</b>: ${esc(s)}`)))
  ej(b, 1, `Diferencia as parellas segundo leven b ou v: ${D.PARES_BV.map(([a, , v]) => `${a} / ${v}`).join(', ')}.`, taboa(['Parella', 'Significado 1', 'Significado 2'], D.PARES_BV.map(([a, sa, v, sv]) => [`<b>${a} / ${v}</b>`, esc(sa), esc(sv)])))
  const cl = [['lama (barro) / lama (sacerdote)', 'homónimas'], ['óso / oso', 'homógrafas'], ['botar / votar', 'homófonas'], ['dedos / dedas', 'parónimas'], ['rubio (castelán) / rubio (galego)', 'falsos amigos'], ['baca / vaca', 'homófonas']]
  ej(b, 2, `Que relación hai entre cada parella?${lista(cl.map(([p]) => esc(p)))}`, lista(cl.map(([, r]) => `<b>${r}</b>`)))
}

{
  const b = bloque(
    L,
    'Vocabulario e castelanismos',
    `<p class="gris">Vocabularios de Classroom: as partes do corpo, o pé e a perna e as aves de Galiza. Os 20 castelanismos son os do artigo que mandou ler a profesora (GCiencia).</p>
    <div class="g2 grid">
      <div class="caixa"><h4>O corpo (as que máis se confunden)</h4>a fronte, a cella, as ventas, os beizos, o queixo, a meixela, o pescozo, o ombreiro, o lombo, o embigo, a cadeira, o cóbado / cotobelo, o pulso, o polgar, a coxa, o xeonllo, a canela, o papo da perna, o nocello, o calcañar, as dedas, a empeña, a axila.</div>
      <div class="caixa"><h4>Os 20 castelanismos</h4>${D.CASTELANISMOS.map(([m, b]) => `<s class="mal">${esc(m)}</s> → <b>${esc(b)}</b>`).join(' · ')}</div>
    </div>`,
  )
  const corpo = [['la frente'], ['la ceja'], ['los labios'], ['la barbilla'], ['la mejilla'], ['el cuello'], ['el hombro'], ['la espalda'], ['el ombligo'], ['la cadera'], ['el codo'], ['la rodilla'], ['el muslo'], ['el tobillo'], ['el talón'], ['la pantorrilla']].map(([es]) => [es, D.CORPO.find(([, e]) => e === es)[0]])
  ej(b, 1, `Como se din en galego estas partes do corpo? ${corpo.map(([es]) => es).join(', ')}.`, corpo.map(([es, gl]) => `${es} → <b>${gl}</b>`).join('; ') + '.')
  const aves = D.AVES.filter(([g, e]) => g !== e).slice(0, 12)
  ej(b, 1, `Como se chaman en galego estas aves? ${aves.map(([, e]) => e).join(', ')}.`, aves.map(([g, e]) => `${e} → <b>${g}</b>`).join('; ') + '.')
  const frases = [
    ['Onte enterouse de que era o cumpreanos da súa curmá.', 'Onte decatouse de que era o aniversario da súa curmá.'],
    ['Sen embargo, a súa casa está moi lexos.', 'Porén (con todo), a súa casa está moi lonxe.'],
    ['Puxo as gafas e foi á orquesta.', 'Puxo as lentes (os anteollos) e foi á orquestra.'],
    ['Pecha o grifo e bota a carta no buzón.', 'Pecha a billa e bota a carta na caixa do correo.'],
    ['Doíalle a espalda de levar a mochila chea de pegatinas.', 'Doíanlle as costas (o lombo) de levar a mochila chea de adhesivos.'],
    ['Ese cambio conleva moitos problemas e hai que plantexalo ben.', 'Ese cambio implica (supón) moitos problemas e hai que expoñelo ben.'],
    ['Non sei onde se ubica a biblioteca.', 'Non sei onde se sitúa (se localiza) a biblioteca.'],
    ['Cada persoa debe aportar unha idea.', 'Cada persoa debe achegar unha idea.'],
  ]
  ej(b, 2, `Corrixe os castelanismos.${lista(frases.map(([m]) => esc(m)))}`, lista(frases.map(([, bo]) => esc(bo))))
}

{
  const b = bloque(
    L,
    'Repaso de acentuación (unidade 1)',
    `<div class="g2 grid">
      <div class="caixa"><h4>As tres regras</h4><b>Agudas</b> (tónica na última): levan til se teñen máis dunha sílaba e rematan en vogal, -n, -s ou -ns (café, Ramón, mandís, xamóns).<br><b>Graves</b> (penúltima): levan til se rematan en consoante distinta de -n ou -s, ou en -ps (túnel, carácter, tórax, bíceps).<br><b>Esdrúxulas</b> (antepenúltima): sempre (bágoa, simpático).</div>
      <div class="caixa"><h4>Hiatos e diacríticos</h4>Leva til a <b>i</b> ou a <b>u</b> tónica que vai xunto a outra vogal e non forma ditongo: saúde, día, baúl, roíña.<br>O <b>til diacrítico</b> distingue palabras que se escriben igual: é / e, vén / ven, só / so, nós / nos, dá / da, té / te, óso / oso, pé / pe, cómpre / compre…</div>
    </div>`,
  )
  const pal = [
    ['café', 'aguda rematada en vogal'],
    ['xardín', 'aguda rematada en -n'],
    ['túnel', 'grave rematada en -l (consoante distinta de -n ou -s)'],
    ['lapis', 'grave rematada en -s: non leva til'],
    ['cárcere', 'esdrúxula: sempre leva til'],
    ['saúde', 'hiato: a u tónica xunto a outra vogal'],
    ['bíceps', 'grave rematada en -ps'],
    ['papel', 'aguda rematada en -l: non leva til'],
  ]
  ej(b, 1, `Explica por que levan ou non levan til: ${pal.map(([p]) => p).join(', ')}.`, lista(pal.map(([p, r]) => `<b>${p}</b>: ${r}.`)))
}

// ---------- Páxina ----------
const NIVEL = { 1: '<span class="nv n1">★ Básico</span>', 2: '<span class="nv n2">★★ Avanzado</span>' }
const corpoHTML = PARTES.map(
  (p) => `<h2 class="${p.clase}">${p.titulo}</h2>
${p.bloques
  .map(
    (b) => `<h3>${b.titulo}</h3>
<div class="como"><div class="etq">${b.etq ?? 'Como se fai'}</div>${b.como}</div>
${b.ejs.map((e) => `<div class="ej"><span class="num">${e.n}</span> ${NIVEL[e.nivel]} ${e.enunciado}</div>`).join('')}`,
  )
  .join('')}`,
).join('')
const solucions = PARTES.map((p) => `<h2 class="${p.clase}">Solucións · ${p.titulo}</h2>${p.bloques.flatMap((b) => b.ejs).map((e) => `<div class="sol"><span class="num">${e.n}</span><div>${e.solucion}</div></div>`).join('')}`).join('')

const html = `<!doctype html>
<html lang="gl">
<head>
<meta charset="utf-8">
<title>Repaso global Galego</title>
<style>
  @page { size: A4; margin: 13mm 12mm 13mm 12mm; }
  * { box-sizing: border-box; }
  body { font-family: "Segoe UI", Arial, sans-serif; font-size: 10.4pt; line-height: 1.4; color: #1e293b; margin: 0; }
  h1 { font-size: 21pt; margin: 0 0 1.5mm; color: #312e81; }
  h2 { font-size: 14pt; margin: 5mm 0 2.5mm; padding: 1.5mm 3mm; border-radius: 2mm; color: #fff; background: #4338ca; break-after: avoid; }
  h2.t1 { background: #0f766e; } h2.t2 { background: #1d4ed8; }
  h3 { font-size: 12pt; margin: 4mm 0 1.5mm; color: #312e81; break-after: avoid; border-bottom: 0.4mm solid #c7d2fe; padding-bottom: 0.5mm; }
  p { margin: 1mm 0 1.5mm; } ul, ol { margin: 1mm 0 1.5mm; padding-left: 5mm; } li { margin: 0.6mm 0; }
  .sub { color: #475569; font-size: 10pt; margin-bottom: 3mm; }
  .grid { display: grid; gap: 2.5mm; } .g2 { grid-template-columns: 1fr 1fr; }
  .como { border: 0.4mm solid #c7d2fe; background: #f8faff; border-radius: 2mm; padding: 2mm 3mm; margin: 1.5mm 0 2.5mm; }
  .etq { font-size: 8.5pt; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: #4338ca; margin-bottom: 1mm; }
  .caixa { border: 0.4mm solid #ddd6fe; border-radius: 2mm; padding: 1.8mm 2.5mm; background: #fff; break-inside: avoid; }
  .caixa h4 { margin: 0 0 1mm; font-size: 10.2pt; color: #5b21b6; }
  .truco { background: #fef3c7; border-left: 1.2mm solid #f59e0b; padding: 1.5mm 3mm; border-radius: 1mm; margin: 2mm 0; break-inside: avoid; }
  .ollo { background: #fee2e2; border-left: 1.2mm solid #dc2626; padding: 1.5mm 3mm; border-radius: 1mm; margin: 2mm 0; break-inside: avoid; }
  table { border-collapse: collapse; width: 100%; margin: 1.5mm 0 2mm; break-inside: avoid; font-size: 9.8pt; }
  th, td { border: 0.3mm solid #cbd5e1; padding: 1mm 2mm; text-align: left; vertical-align: top; }
  th { background: #e0e7ff; color: #312e81; }
  .ej { margin: 2mm 0 3mm; break-inside: avoid; }
  .num { display: inline-flex; align-items: center; justify-content: center; min-width: 6.5mm; height: 6.5mm; border-radius: 50%; background: #312e81; color: #fff; font-weight: 800; font-size: 9.5pt; margin-right: 1mm; }
  .nv { font-size: 8pt; font-weight: 800; border-radius: 1mm; padding: 0.3mm 1.5mm; margin-right: 1mm; }
  .n1 { background: #dcfce7; color: #166534; } .n2 { background: #fee2e2; color: #991b1b; }
  ol.items { margin: 1mm 0 0 8mm; } ol.items li { margin: 1mm 0; }
  .hueco { display: inline-block; min-width: 16mm; border-bottom: 0.3mm solid #334155; margin: 0 1mm; height: 1em; }
  .banco { margin: 1.5mm 0 1mm 8mm; padding: 1mm 2.5mm; border: 0.3mm dashed #94a3b8; border-radius: 1.5mm; display: inline-block; font-size: 9.6pt; }
  .ficha { margin: 1.5mm 0 1mm 8mm; padding: 1.5mm 3mm; background: #f5f3ff; border: 0.3mm solid #ddd6fe; border-radius: 2mm; font-size: 9.6pt; }
  .gris { color: #64748b; font-size: 9pt; } .mal { color: #b91c1c; }
  .sol { display: flex; gap: 2mm; margin: 1.5mm 0; padding-bottom: 1.5mm; border-bottom: 0.3mm solid #e2e8f0; break-inside: avoid; }
  .sol > div { flex: 1; } .sol ol.items { margin-left: 5mm; } .sol ol.items li { margin: 0.3mm 0; }
  .salto { break-before: page; }
  .check li { list-style: "☐  "; }
  .pe { font-size: 8.5pt; color: #64748b; margin-top: 4mm; border-top: 0.3mm solid #e2e8f0; padding-top: 1.5mm; }
  .portada { border: 0.5mm solid #c7d2fe; border-radius: 3mm; padding: 3mm 4mm; background: #eef2ff; margin-bottom: 3mm; }
</style>
</head>
<body>
<h1>Lingua Galega · Repaso do global</h1>
<p class="sub">1.ª avaliación, 2.º ESO. Entran as unidades 1 e 2: un texto con preguntas e a lingua por dentro.</p>
<div class="portada">
  <b>Como usar este caderno:</b> en cada apartado le o recadro <b>«Como se fai»</b> e despois fai os exercicios no caderno, primeiro os <span class="nv n1">★ Básico</span> e logo os <span class="nv n2">★★ Avanzado</span>. As <b>solucións están ao final</b>: mírasas cando remates cada exercicio. Moitos exercicios son os mesmos das follas de Classroom.
</div>
${corpoHTML}

<h2>Antes do exame, sei…</h2>
<ul class="check">
  <li>Facer o tema (frase nominal), o título, o resumo e a intención dun texto, e definir palabras.</li>
  <li>Recoñecer o tipo de texto e o tipo de descrición (prosopografía, etopea, retrato, caricatura, topografía, pragmatografía).</li>
  <li>Analizar unha narración: narrador, personaxes, espazo, tempo e presentación, nó e desenlace.</li>
  <li>Explicar que é a lingua estándar e as variedades diastráticas, diafásicas, diatópicas e diacrónicas.</li>
  <li>Distinguir os niveis (culto, medio, vulgar) e os rexistros (formal, coloquial).</li>
  <li>Dicir o bloque dialectal dunha palabra ou dunha frase e pasala ao estándar.</li>
  <li>Formar o feminino, o plural, os comparativos e os superlativos dos adxectivos, e distinguir explicativos e especificativos.</li>
  <li>Distinguir homónimas, homógrafas, homófonas, parónimas e falsos amigos.</li>
  <li>Explicar por que leva til unha palabra e usar os diacríticos.</li>
  <li>O vocabulario do corpo, do pé e a perna, das aves e os 20 castelanismos.</li>
</ul>
<p class="pe">Para practicar con preguntas novas e facer o simulacro con nota: Eón → Mateo → 2.º ESO → Lingua Galega → Unidade 2 · Global → «Simulacro do global».</p>

<h1 class="salto">Solucións</h1>
${solucions}
</body>
</html>
`

if (fallos.length) {
  console.error('Hai solucións que non cadran:\n' + fallos.join('\n'))
  process.exit(1)
}
writeFileSync(new URL('./galego-global1.html', import.meta.url), html)
console.log(`Feito: ${nEj} exercicios.`)
