# Eón

Web de estudio para ESO: cada lección se entiende, se prueba, se desmenuza paso a paso y se practica.

Contenido actual: 2º ESO · Matemáticas · Tema 1 (números enteros y divisibilidad), con ocho paradas y los ejercicios de las hojas de clase.

## Uso

Hace falta Node.js 24 o superior.

```powershell
npm install      # solo la primera vez
npm run dev      # en el ordenador: http://localhost:5173
npm run tablet   # para abrirla desde la tablet, en la misma wifi
npm test         # pruebas del motor matemático
npm run build    # versión final en dist/
```

## Dónde está cada cosa

- `src/contenido/catalogo.ts`: cursos, materias y lecciones de los menús.
- `src/contenido/preguntas.tsx`: ejercicios de clase y generadores de ejercicios nuevos.
- `src/lib/`: motor matemático (divisibilidad y operaciones con enteros) y sus pruebas.
- `src/componentes/`: piezas comunes a todas las paradas (armazón, práctica, recta, expresiones).
- `src/paradas/`: las ocho paradas del Tema 1.

El progreso se guarda en el navegador de cada dispositivo; no hay servidor ni cuentas.
