# Semana 6 (28 sep-2 oct) — Programación Web

**Tipo:** Individual

**Tema oficial:** JavaScript: fundamentos + actividad de aprendizaje Next.js/Node (previa al repo semilla).

**Objetivo:** aprender los fundamentos de Next.js (páginas, rutas dinámicas) y de Node/Express (rutas, middlewares) **antes** de tocar el proyecto real.

**Prerrequisitos:** JS básico (variables, funciones, fetch).

**Actividad:** mini-tutorial guiado — crear una página Next.js nueva (aislada, fuera del proyecto CECyT9) con una ruta dinámica `[id].js`, y un pequeño servidor Express con 2 endpoints propios; comparar el resultado con lo que ya hace el repo semilla (`ProyectoFrontCecyt9`/`ProyectoBackCecyt9`).

**Entregable:** mini-proyecto Next.js + Express de práctica (no es el proyecto real todavía) + tabla comparando lo hecho con lo que ya existe en el repo semilla.

**Material de esta semana (`base/`):**
- `mini-proyecto-next/`: el **kit de front** que usarás hasta la semana 15. Ya trae `package.json`, todo el CSS (`styles/globals.css`), el menú (`pages/_app.js`, `components/Menu.js`), el proxy al backend (`next.config.js`) y las validaciones (`lib/validaciones.js`). **No los modifiques.**
- Tú escribes `pages/index.js` y `pages/practica/[id].js` (vienen vacíos).
- `mini-servidor-express/`: tú escribes tus 2 endpoints en `server.js`.
- Para arrancar: `npm install` y `npm run dev` dentro de `mini-proyecto-next/`; `npm install` y `npm start` dentro de `mini-servidor-express/`.
- Esta app es la única que usarás en el curso: cada semana copias encima los archivos nuevos de `base/mini-proyecto-next/`.

---
La rúbrica de esta práctica la tiene tu docente por separado.
