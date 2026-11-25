// Genera «ingles-global1.html»: cuadernillo de repaso para el global de Inglés de 2.º ESO (Modules 1 y 2).
// Las soluciones salen de los mismos datos y funciones que usa la web (src/idiomas/ingles/), y el programa se para si
// alguna no coincide con la que se espera.
// Uso, desde la raíz del repositorio: node apuntes-fuente/ingles-global1.gen.mjs
import { writeFileSync } from 'node:fs'
import { createServer } from 'vite'

const server = await createServer({ configFile: false, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
const V1 = await server.ssrLoadModule('/src/idiomas/ingles/verbos.ts')
const D = await server.ssrLoadModule('/src/idiomas/ingles/module2/datos.ts')
await server.close()

const fallos = []
const espera = (que, dado, bueno) => {
  if (String(dado) !== String(bueno)) fallos.push(`${que}: sale «${dado}» y se esperaba «${bueno}»`)
}
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const hueco = (s) => esc(s).replace(/___/g, '<span class="hueco"></span>')
const en = (s) => `<span lang="en">${s}</span>`

// ---------- Contenido ----------
const modulos = []
let nEj = 0
const modulo = (clase, titulo) => {
  const m = { clase, titulo, bloques: [] }
  modulos.push(m)
  return m
}
const bloque = (m, titulo, como) => {
  const b = { titulo, como, ejs: [] }
  m.bloques.push(b)
  return b
}
const ej = (b, nivel, enunciado, solucion) => b.ejs.push({ n: ++nEj, nivel, enunciado, solucion })
const lista = (xs) => `<ol class="items">${xs.map((x) => `<li>${x}</li>`).join('')}</ol>`
const banco = (xs) => `<div class="banco">${xs.map(esc).join(' • ')}</div>`

// ===================== MODULE 1 =====================
const m1 = modulo('t1', 'Module 1 · Repaso')

{
  const b = bloque(
    m1,
    'Present Simple / Present Continuous',
    `<div class="g2 grid">
      <div class="caixa"><h4>Present Simple: hechos, rutinas y hábitos</h4>
        ${en('I play · She plays · I don’t play · She doesn’t play · Do you play? · Does she play?')}<br>
        Pistas: every day, on Mondays, once a week, usually, often, always, sometimes, never.</div>
      <div class="caixa"><h4>Present Continuous: lo que pasa ahora</h4>
        ${en('I’m playing · She is playing · They aren’t playing · Are you playing?')}<br>
        Pistas: now, right now, at the moment, Look!, Listen!</div>
    </div>
    <div class="ollo">Con los <b>verbos de estado</b> (love, like, hate, hear, understand, know, want, need) se usa el Present Simple aunque sea ahora: ${en('I <b>hear</b> him now')} (no «I am hearing»).</div>`,
  )
  const v = (base) => V1.VERBOS.find((x) => x.base === base)
  const items = [
    ['She', true, 'study', false, 'simple', 'English every day'],
    ['They', false, 'play', false, 'continuo', 'football now'],
    ['I', false, 'understand', false, 'simple', 'the question now'],
    ['We', false, 'watch', true, 'continuo', 'TV at the moment'],
    ['He', true, 'go', true, 'simple', 'to the park on Mondays'],
    ['My brother', true, 'swim', false, 'continuo', 'in the sea right now'],
    ['Do you often', false, 'read', false, 'simple', 'comics?'],
    ['Listen! The baby', true, 'cry', false, 'continuo', ''],
  ]
  // «cry» no está en la lista del Module 1: se escribe a mano.
  const sol = items.map(([suj, ter, base, neg, t]) => {
    if (base === 'cry') return 'is crying'
    if (suj === 'Do you often') return 'read'
    return t === 'simple' ? V1.simple(v(base), ter, neg)[0] : V1.continuo(v(base), suj, ter, neg)[0]
  })
  espera('presentes', sol.join(' | '), "studies | are playing | understand | aren't watching | doesn't go | is swimming | read | is crying")
  ej(
    b,
    1,
    'Complete with the Present Simple or the Present Continuous.',
    sol,
  )
  b.ejs.at(-1).enunciado += lista(items.map(([suj, , base, neg, , resto]) => en(hueco(`${suj} ___ (${neg ? 'not / ' : ''}${base}) ${resto}`.trim() + (resto.endsWith('?') ? '' : '.')))))
  b.ejs.at(-1).solucion = lista(
    items.map(([suj, , base, , t, resto], i) => `${en(`<b>${sol[i]}</b>`)} — ${base === 'understand' ? 'verbo de estado: Present Simple' : t === 'simple' ? (resto.includes('?') ? 'often: Present Simple' : 'rutina: Present Simple') : 'ahora: Present Continuous'}`),
  )
}

{
  const b = bloque(
    m1,
    'There is / There are, articles and quantifiers',
    `<table>
      <tr><th></th><th>Contables (cars, people)</th><th>Incontables (water, time)</th></tr>
      <tr><td><b>Afirmativa</b></td><td>There are <b>some / a lot of / a few</b> cars.</td><td>There is <b>some / a lot of / a little</b> water.</td></tr>
      <tr><td><b>Negativa</b></td><td>There aren’t <b>any / many</b> cars.</td><td>There isn’t <b>any / much</b> water.</td></tr>
      <tr><td><b>Pregunta</b></td><td>Are there <b>any</b> cars? How <b>many</b>…?</td><td>Is there <b>any</b> water? How <b>much</b>…?</td></tr>
    </table>
    <p><b>a</b> delante de sonido de consonante (a cave), <b>an</b> delante de sonido de vocal (an ancient city), <b>the</b> para algo concreto o único (the ancient Roman god).</p>`,
  )
  ej(
    b,
    1,
    'Choose the correct answer (Module 1, exercise 9).' +
      lista([
        ['___ roundabouts in this town.', 'There are a lot of', ['There is much', 'There is a little']],
        ['___ time. Please hurry.', "There isn't much", ['There are a few', "There aren't much"]],
        ['___ petrol stations near here?', 'Are there any', ['Is there an', 'Is there any']],
        ['___ only ___ water in my bottle, but you can have it.', 'There is … a little', ['There are … a few', 'There are … a little']],
        ['___ playgrounds nearby, but this is the nicest one.', 'There are a few', ["There isn't much", 'There is a few']],
        ['___ outdoor market in this town?', 'Is there an', ['Is there a', 'Is there some']],
      ].map(([f, ok, otras]) => `${en(hueco(f))}<br><span class="ops">${[ok, ...otras].sort().map((o) => esc(o)).join(' &nbsp;/&nbsp; ')}</span>`)),
    lista([
      'There are a lot of — roundabouts: contable plural.',
      "There isn't much — time: incontable, y «hurry» indica que hay poco.",
      'Are there any — pregunta en plural.',
      'There is … a little — water: incontable; only: poca.',
      'There are a few — hay algunos.',
      'Is there an — market es singular y outdoor empieza por vocal.',
    ].map(esc)),
  )
}

{
  const b = bloque(
    m1,
    'Subject / Object questions',
    `<div class="g2 grid">
      <div class="caixa"><h4>Pregunta por el sujeto (quién lo hace)</h4>Sin do/does; el verbo como en la afirmativa:<br>${en('<b>Who spends</b> a lot of time in traffic?')}</div>
      <div class="caixa"><h4>Pregunta por el objeto</h4>Con do/does + forma base:<br>${en('<b>What do</b> people <b>call</b> the London Underground?')}</div>
    </div>`,
  )
  const E8 = [
    ['what / people / call / the London Underground', 'What do people call the London Underground?', 'objeto'],
    ['what / come / from pubs', 'What comes from pubs?', 'sujeto'],
    ['who / spend / a lot of time / in traffic', 'Who spends a lot of time in traffic?', 'sujeto'],
    ['what / the Shinkansen cleaners / do / in seven minutes', 'What do the Shinkansen cleaners do in seven minutes?', 'objeto'],
    ['who / give / petrol / to drivers in Turkmenistan', 'Who gives petrol to drivers in Turkmenistan?', 'sujeto'],
  ]
  ej(b, 2, 'Write questions. Are they subject or object questions? (Module 1, exercise 8)' + lista(E8.map(([p]) => en(esc(p)))), lista(E8.map(([, q, t]) => `${en(`<b>${esc(q)}</b>`)} — pregunta por el ${t}`)))
}

{
  const b = bloque(
    m1,
    'How much / many / far / long / often',
    `<table>
      <tr><td><b>How much</b> + incontable / precio</td><td>${en('How much water…? How much does it cost?')}</td><td><b>How far</b>: distancia</td><td>${en('How far is your house?')}</td></tr>
      <tr><td><b>How many</b> + contable plural</td><td>${en('How many playgrounds…?')}</td><td><b>How long</b>: tiempo que dura</td><td>${en('How long does it take?')}</td></tr>
      <tr><td colspan="2"></td><td><b>How often</b>: frecuencia</td><td>${en('How often do you go…?')}</td></tr>
    </table>`,
  )
  const E13 = [
    ['Is there', 'a town square in your town?'],
    ['How far', 'is your house from the centre of town?'],
    ['How often', 'do you go to the centre of town?'],
    ['How long', 'does it take you to get there?'],
    ['Are there', 'any bus stops near your house?'],
    ['How much', 'does a bus ride cost?'],
    ['How many', 'playgrounds are there in your neighbourhood?'],
  ]
  ej(b, 1, 'Complete the questions (Module 1, exercise 13).' + banco(['Is there', 'Are there', 'How far', 'How often', 'How long', 'How much', 'How many']) + lista(E13.map(([, r]) => en(hueco(`___ ${r}`)))), lista(E13.map(([c, r]) => en(`<b>${c}</b> ${esc(r)}`))))
}

// ===================== MODULE 2 =====================
const m2 = modulo('t2', 'Module 2')

{
  const b = bloque(
    m2,
    'Past Simple (página 31)',
    `<p>Para acciones que empezaron y acabaron en el pasado: ${en('a week ago, last year, yesterday, in 2015…')}</p>
    <table>
      <tr><th>Afirmativa</th><th>Negativa</th><th>Pregunta y respuesta corta</th></tr>
      <tr><td>${en('The mechanic <b>checked</b> my car.<br>He <b>drove</b> a taxi.')}</td><td>${en('The salesperson <b>didn’t help</b> us.')}</td><td>${en('<b>Did</b> you <b>hear</b> the singer?<br>Yes, I did. / No, I didn’t.')}</td></tr>
    </table>
    <div class="g2 grid">
      <div class="caixa"><h4>Las reglas (ejercicio 7)</h4>1. Los irregulares <b>cambian su forma</b> en la afirmativa (go → went).<br>2. En negativa y pregunta va la <b>forma base</b>: ${en('didn’t go, Did you go?')} <span class="mal">(no «didn’t went»)</span></div>
      <div class="caixa"><h4>Ortografía de los regulares</h4>
        ${(['ed', 'd', 'ied', 'doble']).map((r) => esc(D.NOMBRE_REGLA[r])).join('<br>')}</div>
    </div>
    <div class="truco">💡 <b>TIP:</b> el pasado de ${en('there is')} es ${en('<b>there was</b>')} y el de ${en('there are')}, ${en('<b>there were</b>')}: ${en('There were two actors in the show yesterday.')}</div>
    <p>Los verbos irregulares, con su pasado y su participio, están en la lista del final del Module 2.</p>`,
  )

  const verbos = ['play', 'study', 'stop', 'live', 'try', 'chat', 'go', 'buy', 'write', 'see', 'take', 'think']
  ej(
    b,
    1,
    'Write the Past Simple. Is the verb regular or irregular?' + `<div class="partes">${verbos.map((v, i) => `<div><b>${i + 1}.</b> ${en(v)}</div>`).join('')}</div>`,
    `<div class="partes">${verbos
      .map((x, i) => {
        const v = D.verbo(x)
        return `<div><b>${i + 1}.</b> ${en(`<b>${v.past}</b>`)} <span class="gris">(${v.regla ? 'regular' : 'irregular'})</span></div>`
      })
      .join('')}</div>`,
  )
  espera('pasados', verbos.map((x) => D.verbo(x).past).join(' '), 'played studied stopped lived tried chatted went bought wrote saw took thought')

  ej(
    b,
    1,
    `Complete with the Past Simple of the verbs or <i>there was / there were</i> (exercise 8, page 31).` + banco(D.EJ8_VERBOS.split(' • ')) + lista(D.EJ8_P31.map((e) => en(hueco(e.frase)))),
    lista(D.EJ8_P31.map((e) => en(e.huecos.map((h) => `<b>${esc(h[0])}</b>`).join(' … ')))),
  )

  ej(b, 1, 'Write questions with the words and the Past Simple or <i>there was / there were</i> (exercise 9, page 31).' + lista(D.EJ9_P31.map(([p]) => en(esc(p)))), lista(D.EJ9_P31.map(([, q]) => en(`<b>${esc(q)}</b>`))))

  const neg = [
    ['He', 'drive', 'a taxi', 'last year'],
    ['They', 'win', 'the match', 'last Sunday'],
    ['She', 'study', 'for the test', 'yesterday evening'],
    ['You', 'see', 'a concert', 'last year'],
  ]
  ej(
    b,
    2,
    'Make the sentences negative and then write the question with a short answer (Yes).' + lista(neg.map(([s, v, r, c]) => en(esc(`${s} ${D.verbo(v).past} ${r} ${c}.`)))),
    lista(
      neg.map(([s, v, r, c]) => {
        const ap = { He: 'he', They: 'they', She: 'she', You: 'I' }[s]
        return en(esc(`${s} ${D.pasado(D.verbo(v), true)[0]} ${r} ${c}.`) + '<br>' + esc(`Did ${s === 'You' ? 'you' : s.toLowerCase()} ${v} ${r} ${c}? — Yes, ${ap} did.`))
      }),
    ),
  )
  espera('negativa drive', D.pasado(D.verbo('drive'), true)[0], "didn't drive")

  ej(
    b,
    2,
    'Read Simone’s application form (page 31) and answer the questions.' +
      `<div class="ficha">${en(`<b>Braxton Zoo · Volunteer Application Form</b><br>Name: Simone Smith · Schools: 2003-2009 Green Hill Primary School; 2009-2016 Braxton Secondary School<br>Volunteer experience: 2015-2017 Weekend helper at an animal shelter<br>Work experience: 2013-2016 Dog walker; 2016-2018 Salesperson at pet shop<br>How you heard about the programme: a friend / family member`)}</div>` +
      lista(D.SIMONE.map(([q]) => en(esc(q)))),
    lista(D.SIMONE.map(([, a]) => en(`<b>${esc(a)}</b>`))),
  )
}

{
  const b = bloque(
    m2,
    'Present Simple Passive / Past Simple Passive',
    `<p>Activa: ${en('The cook <b>prepares</b> dinner every day.')} → Pasiva: ${en('Dinner <b>is prepared</b> by the cook every day.')}</p>
    <div class="f">sujeto + <b>am / is / are</b> (presente) o <b>was / were</b> (pasado) + <b>participio</b> (+ by …)</div>
    <table>
      <tr><th></th><th>Present Simple Passive</th><th>Past Simple Passive</th></tr>
      <tr><td><b>Afirmativa</b></td><td>${en('The cooking <b>is done</b> in the kitchen.')}</td><td>${en('All of the food <b>was eaten</b> by my friends.')}</td></tr>
      <tr><td><b>Negativa</b></td><td>${en('The rooms <b>aren’t cleaned</b> on Sundays.')}</td><td>${en('The servants <b>weren’t paid</b> a lot of money.')}</td></tr>
      <tr><td><b>Pregunta</b></td><td>${en('<b>Are</b> vegetables <b>bought</b> at the market?<br>Yes, they are. / No, they aren’t.')}</td><td>${en('<b>Were</b> your grandparents <b>invited</b>?<br>Yes, they were. / No, they weren’t.')}</td></tr>
    </table>
    <ul>
      <li><b>Regla (ejercicio 12):</b> en la pasiva, lo importante es <b>la acción</b>, no la persona que la hace.</li>
      <li><b>TIP:</b> si decimos quién lo hace, va con <b>by</b>: ${en('The programme was watched <b>by</b> many people.')}</li>
      <li>Participio: en los regulares, igual que el pasado (cleaned); en los irregulares, la 3.ª columna de la tabla (eaten, made, written).</li>
      <li>¿is/are o was/were? Mira la expresión de tiempo (every day / yesterday) y si el sujeto es singular o plural.</li>
    </ul>`,
  )

  const items = [
    [0, 'presente', false],
    [1, 'pasado', true],
    [9, 'presente', false],
    [8, 'pasado', false],
    [15, 'pasado', false],
    [2, 'presente', true],
  ]
  const fr = items.map(([i, t, n]) => ({ f: D.FRASES_PASIVA[i], t, n }))
  const sol = fr.map(({ f, t, n }) => D.pasiva(D.verbo(f.v), f.plural, t, n)[0])
  espera('pasivas', sol.join(' | '), "is done | weren't cleaned | are made | was spoken | were stolen | aren't bought")
  ej(
    b,
    1,
    'Complete with the Present Simple Passive or the Past Simple Passive.' + lista(fr.map(({ f, t, n }) => en(hueco(`${f.suj} ___ (${n ? 'not / ' : ''}${f.v}) ${f.resto} ${t === 'presente' ? f.presente : f.pasado}.`.replace(/\s+/g, ' '))))),
    lista(fr.map(({ f, t }, i) => `${en(`<b>${esc(sol[i])}</b>`)} — ${t === 'presente' ? 'presente' : 'pasado'} y ${f.plural ? 'plural' : 'singular'}`)),
  )

  ej(b, 1, 'Complete with the Present Simple Passive (exercise 13).' + lista(D.EJ13_PASIVA.map((e) => en(hueco(e.frase)))), lista(D.EJ13_PASIVA.map((e) => en(e.huecos.map((h) => `<b>${esc(h[0])}</b>`).join(' … ')))))

  ej(b, 1, 'Write questions with the Present Simple Passive (exercise 14). Then answer them about your family.' + lista(D.EJ14_PASIVA.map(([p]) => en(esc(p)))), lista(D.EJ14_PASIVA.map(([, q]) => en(`<b>${esc(q)}</b>`))))

  ej(
    b,
    2,
    'Complete the essay «Family Life in the Past» with the Past Simple Passive (exercise 15).' +
      `<p class="ensayo">${en(
        'Is family life different today because of technology? In my opinion it is. ' +
          D.EJ15_PASIVA.map((e, i) => `${esc(e.antes)} <sup>${i + 1}</sup><span class="hueco"></span> (${esc(e.verbo)})`)
            .join(' ')
            .replace(/ \./g, '.')
            .replace(/ ,/g, ',') +
          ' on all day because there weren’t any children’s programmes in the mornings or late evenings.',
      )}</p>`,
    lista(D.EJ15_PASIVA.map((e) => en(`<b>${esc(e.respuestas[0])}</b>`))) + '<p class="gris">El 6 es una pregunta: How <b>were</b> kids <b>kept</b> busy…?</p>',
  )

  const ap = D.ACTIVA_PASIVA.slice(0, 6)
  ej(b, 2, 'Rewrite the sentences in the passive.' + lista(ap.map(([a]) => en(esc(a)))), lista(ap.map(([, p]) => en(`<b>${esc(p)}</b>`))))
}

{
  const b = bloque(
    m2,
    'used to',
    `<p>Para hábitos y situaciones del <b>pasado</b> que <b>ya no son verdad</b> (en castellano, «solía…»).</p>
    <table>
      <tr><th>Afirmativa</th><th>Negativa</th><th>Pregunta y respuesta corta</th></tr>
      <tr><td>${en('I <b>used to have</b> a small calculator.')}</td><td>${en('Students <b>didn’t use to work</b> with computers.')}</td><td>${en('<b>Did</b> he <b>use to teach</b> English?<br>Yes, he did. / No, he didn’t.')}</td></tr>
    </table>
    <div class="ollo"><b>¡Ojo con la ‑d!</b> En la afirmativa, <b>used to</b>. Con did / didn’t, <b>use to</b> (sin ‑d), igual que ${en('didn’t go')}. Y detrás de to, la forma base: ${en('used to <b>go</b>')} (no «used to went»).</div>`,
  )
  const items = D.FRASES_USED.slice(0, 10)
  ej(
    b,
    1,
    'Complete with the affirmative or negative form of <i>used to</i> (exercise 13 and more).' + lista(items.map((f) => en(hueco(`${f.suj} ___ (${f.neg ? 'not / ' : ''}${f.v}) ${f.resto}.`)))),
    lista(items.map((f) => en(`<b>${esc(D.usedTo(f.v, f.neg)[0])}</b>`))),
  )
  espera('used to 1', D.usedTo('have', true)[0], "didn't use to have")

  const preg = [
    ['your parents', 'walk', 'to school', 'they'],
    ['Victorian children', 'have', 'calculators', 'they'],
    ['your grandmother', 'live', 'in a village', 'she'],
    ['you', 'like', 'vegetables when you were little', 'I'],
  ]
  ej(b, 2, 'Write questions with <i>used to</i>. Then write a short answer.' + lista(preg.map(([s, v, r]) => en(esc(`${s} / ${v} / ${r} ?`)))), lista(preg.map(([s, v, r, p]) => en(`<b>${esc(`Did ${s} use to ${v} ${r}?`)}</b> ${esc(`Yes, ${p} did. / No, ${p} didn’t.`)}`))))

  const errores = [
    ['She didn’t used to like fish.', 'She didn’t use to like fish.'],
    ['They used to went to school by bus.', 'They used to go to school by bus.'],
    ['Did you used to play football?', 'Did you use to play football?'],
    ['I use to have long hair, but now it is short.', 'I used to have long hair, but now it is short.'],
  ]
  ej(b, 1, 'Find the mistake and correct it.' + lista(errores.map(([m]) => en(esc(m)))), lista(errores.map(([, c]) => en(`<b>${esc(c)}</b>`))))
}

{
  const tabla = D.IRREGULARES.map((v) => `<tr><td>${v.base}</td><td>${v.past}</td><td>${v.pp}</td><td class="es">${esc(v.es)}</td></tr>`)
  const mitad = Math.ceil(tabla.length / 2)
  const cab = '<tr><th>base</th><th>past</th><th>past participle</th><th></th></tr>'
  const b = bloque(m2, 'Irregular verbs: base · past · past participle', `<p>El pasado es para el Past Simple; el participio (3.ª columna), para la pasiva. Lista completa en las páginas 138 y 139 del libro.</p>
    <div class="g2 grid irr"><table>${cab}${tabla.slice(0, mitad).join('')}</table><table>${cab}${tabla.slice(mitad).join('')}</table></div>`)
  b.etq = 'Para consultar'
}

// ---------- Página ----------
const NIVEL = { 1: '<span class="nv n1">★ Básico</span>', 2: '<span class="nv n2">★★ Avanzado</span>' }
const cuerpo = modulos
  .map(
    (m) => `
<h2 class="${m.clase}">${m.titulo}</h2>
${m.bloques
  .map(
    (b) => `
<h3>${b.titulo}</h3>
<div class="como"><div class="etq">${b.etq ?? 'Cómo se hace'}</div>${b.como}</div>
${b.ejs.map((e) => `<div class="ej"><span class="num">${e.n}</span> ${NIVEL[e.nivel]} ${e.enunciado}</div>`).join('')}`,
  )
  .join('')}`,
  )
  .join('')
const soluciones = modulos
  .map((m) => `<h2 class="${m.clase}">Answers · ${m.titulo}</h2>${m.bloques.flatMap((b) => b.ejs).map((e) => `<div class="sol"><span class="num">${e.n}</span><div>${e.solucion}</div></div>`).join('')}`)
  .join('')

const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Repaso global Inglés</title>
<style>
  @page { size: A4; margin: 13mm 12mm 13mm 12mm; }
  * { box-sizing: border-box; }
  body { font-family: "Segoe UI", Arial, sans-serif; font-size: 10.4pt; line-height: 1.4; color: #1e293b; margin: 0; }
  h1 { font-size: 21pt; margin: 0 0 1.5mm; color: #312e81; }
  h2 { font-size: 14pt; margin: 5mm 0 2.5mm; padding: 1.5mm 3mm; border-radius: 2mm; color: #fff; background: #4338ca; break-after: avoid; }
  h2.t1 { background: #0f766e; } h2.t2 { background: #1d4ed8; }
  h3 { font-size: 12pt; margin: 4mm 0 1.5mm; color: #312e81; break-after: avoid; border-bottom: 0.4mm solid #c7d2fe; padding-bottom: 0.5mm; }
  h4.sub4 { margin: 2.5mm 0 1mm; font-size: 10pt; color: #312e81; }
  p { margin: 1mm 0 1.5mm; } ul, ol { margin: 1mm 0 1.5mm; padding-left: 5mm; } li { margin: 0.6mm 0; }
  .sub { color: #475569; font-size: 10pt; margin-bottom: 3mm; }
  .grid { display: grid; gap: 2.5mm; } .g2 { grid-template-columns: 1fr 1fr; }
  .como { border: 0.4mm solid #c7d2fe; background: #f8faff; border-radius: 2mm; padding: 2mm 3mm; margin: 1.5mm 0 2.5mm; }
  .etq { font-size: 8.5pt; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: #4338ca; margin-bottom: 1mm; }
  .caixa { border: 0.4mm solid #ddd6fe; border-radius: 2mm; padding: 1.8mm 2.5mm; background: #fff; break-inside: avoid; }
  .caixa h4 { margin: 0 0 1mm; font-size: 10.2pt; color: #5b21b6; }
  .truco { background: #fef3c7; border-left: 1.2mm solid #f59e0b; padding: 1.5mm 3mm; border-radius: 1mm; margin: 2mm 0; break-inside: avoid; }
  .ollo { background: #fee2e2; border-left: 1.2mm solid #dc2626; padding: 1.5mm 3mm; border-radius: 1mm; margin: 2mm 0; break-inside: avoid; }
  .f { font-weight: 600; background: #eef2ff; border-radius: 2mm; padding: 1.5mm 3mm; margin: 1.5mm 0; text-align: center; break-inside: avoid; }
  table { border-collapse: collapse; width: 100%; margin: 1.5mm 0 2mm; break-inside: avoid; font-size: 9.8pt; }
  th, td { border: 0.3mm solid #cbd5e1; padding: 1mm 2mm; text-align: left; vertical-align: top; }
  th { background: #e0e7ff; color: #312e81; }
  .irr table { font-size: 8.8pt; margin: 0; } .irr td { padding: 0.35mm 1.5mm; } .irr td.es { color: #64748b; font-size: 8pt; }
  .ej { margin: 2mm 0 3mm; break-inside: avoid; }
  .num { display: inline-flex; align-items: center; justify-content: center; min-width: 6.5mm; height: 6.5mm; border-radius: 50%; background: #312e81; color: #fff; font-weight: 800; font-size: 9.5pt; margin-right: 1mm; }
  .nv { font-size: 8pt; font-weight: 800; border-radius: 1mm; padding: 0.3mm 1.5mm; margin-right: 1mm; }
  .n1 { background: #dcfce7; color: #166534; } .n2 { background: #fee2e2; color: #991b1b; }
  ol.items { margin: 1mm 0 0 8mm; } ol.items li { margin: 1mm 0; }
  .partes { display: flex; flex-wrap: wrap; gap: 1mm 8mm; margin: 1.5mm 0 0 8mm; }
  .hueco { display: inline-block; min-width: 20mm; border-bottom: 0.3mm solid #334155; margin: 0 1mm; height: 1em; }
  .ops { color: #475569; font-size: 9.4pt; }
  .banco { margin: 1.5mm 0 1mm 8mm; padding: 1mm 2.5mm; border: 0.3mm dashed #94a3b8; border-radius: 1.5mm; display: inline-block; font-size: 9.6pt; }
  .ficha { margin: 1.5mm 0 1mm 8mm; padding: 1.5mm 3mm; background: #f5f3ff; border: 0.3mm solid #ddd6fe; border-radius: 2mm; font-size: 9.4pt; }
  .ensayo { margin: 1.5mm 0 0 8mm; line-height: 1.9; }
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
<h1>English · Global revision</h1>
<p class="sub">1.ª evaluación, 2.º ESO. Entran el Module 1 y el Module 2 (los cuadros azules del libro).</p>
<div class="portada">
  <b>Cómo usar este cuadernillo:</b> en cada apartado lee el recuadro <b>«Cómo se hace»</b> (las explicaciones van en castellano y los ejemplos, en inglés). Después haz los ejercicios en el cuaderno, primero los <span class="nv n1">★ Básico</span> y luego los <span class="nv n2">★★ Avanzado</span>. Las <b>soluciones están al final</b>: míralas cuando termines cada ejercicio.
</div>
${cuerpo}

<h2>Before the exam: I can…</h2>
<ul class="check">
  <li>Elegir entre Present Simple y Present Continuous (y recordar los verbos de estado).</li>
  <li>Usar there is / there are con a, an, the, some, any, much, many, a few, a little y a lot of.</li>
  <li>Hacer preguntas de sujeto (Who spends…?) y de objeto (What do people call…?).</li>
  <li>Preguntar con How much, How many, How far, How long y How often.</li>
  <li>Escribir el Past Simple de los regulares (con su ortografía) y de los irregulares.</li>
  <li>Hacer la negativa (didn’t + base) y la pregunta (Did + sujeto + base), y usar there was / there were.</li>
  <li>Formar la pasiva en presente (is/are + participio) y en pasado (was/were + participio), con by.</li>
  <li>Pasar una frase de activa a pasiva.</li>
  <li>Usar used to / didn’t use to / Did… use to? para costumbres del pasado.</li>
</ul>
<p class="pe">Para practicar con frases nuevas sin límite y hacer el simulacro con nota: Eón → Mateo → 2.º ESO → Inglés → Module 2 → «Simulacro del global».</p>

<h1 class="salto">Answers</h1>
${soluciones}
</body>
</html>
`

if (fallos.length) {
  console.error('Hay soluciones que no cuadran:\n' + fallos.join('\n'))
  process.exit(1)
}
writeFileSync(new URL('./ingles-global1.html', import.meta.url), html)
console.log(`Hecho: ${nEj} ejercicios.`)
