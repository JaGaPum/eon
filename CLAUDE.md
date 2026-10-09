# Eón

Web de estudio para tres alumnos de la familia: **Mateo** (2.º ESO), su primo **Pablo** (mismo curso, ve los cursos de Mateo con su progreso aparte) y **Olivia** (3.º de Primaria). Viven en Galicia. La usan en tablet, ordenador y móvil. El usuario es su padre: escríbele en castellano, sin jerga técnica.

## Reglas de trabajo

- **Publicar = hacer push a `main`.** Cloudflare Workers despliega solo cada push en https://eon.jgarcia-pumar.workers.dev. Solo se sube cuando el usuario lo pide («súbelo»). Al subir, recuérdale que recargue dos veces y, en la tablet, que cierre la app del todo (es una PWA).
- **Antes de construir algo grande, propón y espera el visto bueno.** Si el usuario dice «haz todo», hazlo entero.
- **Contenido de clase:** viene de las fotos, PDF y mensajes de Classroom que pega el usuario (no están en el repo). Respeta el método y la norma de cada profesor, aunque haya otras formas válidas. Si un dato de una hoja no cuadra, déjalo fuera y avísale.
- **Soluciones:** que las calcule el código (motores en `src/lib/`) y compruébalas con pruebas en `*.test.ts`, en lugar de escribirlas a mano.
- **Comprobar antes de dar algo por hecho:** `npm test`, `npm run build` y recorrer la página en el navegador (Chrome sin ventana, por el protocolo de depuración) respondiendo de verdad los ejercicios.
- **Navegadores antiguos:** el móvil del padre usa un Chrome antiguo. `vite.config.ts` compila para Chrome 79 o posterior: quita las `@layer` de Tailwind 4 y pasa los colores a rgb. No lo rompas.
- **Imágenes:** dibujos propios en SVG (`public/alumnos/`). Nada de personajes, escudos ni marcas con derechos. El repositorio es público.
- **Vídeos de YouTube:** comprueba siempre que se dejan insertar (`playableInEmbed`) y apunta canal y duración.

## Pila

React 19 + TypeScript + Vite + Tailwind 4 + Motion + PWA (vite-plugin-pwa). Sin servidor: el progreso va en `localStorage` (clave `eon.tema1`; la de Pablo, `eon.progreso.pablo`). `npm run dev` arranca en http://localhost:5173 y `npm run tablet` lo abre en la red local.

## Mapa del código

- `src/contenido/catalogo.ts`: alumnos, cursos, materias y lecciones. Ahí se da de alta una lección nueva.
- `src/App.tsx`: rutas con `#` (`#/2eso/matematicas/tema2/combinadas/practicar`). `TEMAS` registra los temas de Matemáticas y `UNIDADES`, las unidades con juegos.
- **Temas de Matemáticas** (pestañas Entender · Probar · Desmenuzar · Practicar · Prueba, y examen final):
  - Armazón común en `src/componentes/` (Parada, Practica, Prueba, Respuesta). El contexto `ContextoTema` (`tema.ts`) da a cada tema su ruta, paradas, bancos de preguntas, vídeos y prefijo de progreso; los temas se definen en `src/contenido/temas.ts`.
  - Tema 1 (enteros y divisibilidad): `src/paradas/`, `src/contenido/preguntas.tsx` y `tema1.ts`. Sus estrellas se guardan **sin prefijo**: no lo cambies.
  - Tema 2 (fracciones y decimales): `src/paradas/tema2/` y `src/contenido/tema2.tsx`, con 302 ejercicios. Motores en `src/lib/fracciones.ts` y `src/lib/exprFr.ts` (jerarquía paso a paso). Prefijo `tema2/`.
- **Unidades con juegos** (pestañas Descubre/Aprende · Xoga/Practica · Proba): piezas en `src/primaria/pezas.tsx` (Tarxetas, Xogos, Busca, Clasifica, Une, VerdadeiroFalso, Ordena, Proba, ElixeTil). `IdiomaUnidade` elige el idioma de la interfaz (galego o castellano), la guía (Estrela, una unicornia, para Olivia; un cohete para Mateo) y los nombres de las pestañas.
  - Olivia, Coñecemento do Medio, unidad 1 «Descubrimos as paisaxes»: `src/primaria/paisaxes/`. Todo en galego, con las palabras del libro. Se responde tocando, nunca escribiendo. Pendiente: el repaso o examen, cuando lleguen las fotos de las páginas 22 en adelante.
  - Mateo, Francés, unité 1: `src/idiomas/frances/`. Explicaciones en castellano, francés con 🔊 (speechSynthesis) y teclas de acentos.
  - Mateo, Galego, proba de aula 1 (16 de octubre de 2026): `src/idiomas/galego/`. Tratamento de textos y acentuación según la norma actual (los 28 diacríticos de la profesora). Incluye los ejercicios 2 y 3 de ogalego.gal con sus soluciones oficiales; la página de reglas de ogalego.gal sigue la norma antigua y no se usa.
- `src/componentes/Musica.tsx`: música de fondo (pistas libres en `public/musica/` o YouTube) que se pausa con los vídeos.

## Ideas propuestas y aún no hechas

Repaso de fallos con repetición espaciada, práctica mezclada antes del examen, resumen para padres, álbum de cromos al sacar tres estrellas y progreso compartido entre dispositivos. Descartado: rachas diarias, clasificaciones, perder premios y cronómetro.
