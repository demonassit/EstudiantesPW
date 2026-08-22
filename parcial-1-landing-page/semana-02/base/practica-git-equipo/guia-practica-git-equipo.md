# Práctica de Git en equipo — ramas, fusión, conflicto, pull y revert

**Complementaria — no reemplaza la práctica oficial de esta semana** (ponchado de cable UTP). Es para el equipo de 4 personas del proyecto integrador.

## Objetivo

Practicar, con un proyecto real (no un ejercicio de juguete), el ciclo completo de trabajo en equipo con Git: cada persona en su rama, subir y bajar cambios, fusionar, resolver un conflicto real, y **revertir** un cambio que resultó tener un error — todo antes de que les pase "de verdad" en una entrega que sí cuenta.

## Antes de empezar

1. Un integrante crea el repositorio del equipo (en GitHub/GitLab) y sube el contenido de `proyecto-inicial/` (`index.html` + `styles.css`) a la rama `main`.
2. Los otros 3 integrantes lo clonan:

   ```
   git clone <url-del-repo-del-equipo>
   ```

3. Cada integrante configura su nombre y correo si no lo ha hecho antes:

   ```
   git config --global user.name "Tu Nombre"
   git config --global user.email "tu-correo@ejemplo.com"
   ```

## Roles del equipo

Repártanse estos 4 roles — cada uno trabaja en **una rama propia** y toca una sección distinta de `index.html` y `styles.css`:

| Persona | Rama | Qué agrega |
|---|---|---|
| A | `feature/header` | Los links del menú en `<nav>` + estilos de `header`/`nav` (agrega su propia variable de color en `:root`) |
| B | `feature/catalogo` | Tarjetas de talleres en `<main class="catalogo">` + estilos de `.catalogo`/`.tarjeta` |
| C | `feature/formulario` | El formulario de contacto en `<section class="contacto">` + estilos de `.formulario` |
| D | `feature/footer` | El contenido del `<footer>` + estilos de `footer` (agrega su propia variable de color en `:root`) |

## Paso a paso

### 1. Crear tu rama

```
git checkout main
git pull origin main          # SIEMPRE antes de crear una rama nueva
git checkout -b feature/<tu-parte>
```

### 2. Trabajar con commits pequeños y frecuentes

Haz **al menos 2 commits** por tarea (no uno solo gigante al final). Usa la convención `feat:`/`fix:`/`docs:`:

```
git add index.html
git commit -m "feat: agrega <lo que hiciste> en index.html"

git add styles.css
git commit -m "feat: estiliza <tu sección>"
```

### 3. Subir tu rama

```
git push origin feature/<tu-parte>
```

### 4. Antes de fusionar a `main`: bajar lo último

**Este paso es el que más se les va a olvidar, y es justo el que evita conflictos innecesarios.** Antes de fusionar tu rama, siempre:

```
git checkout main
git pull origin main
```

Si alguien más ya fusionó su rama, esto trae sus cambios a tu copia local **antes** de que intentes subir la tuya.

### 5. Fusionar tu rama a `main`

```
git merge feature/<tu-parte>
git push origin main
```

(En un flujo real con GitHub, esto se haría con un Pull Request + revisión de 1 compañero antes del merge — si su equipo ya sabe usar PRs, hagan eso en vez de `merge` local.)

### 6. Si aparece un conflicto — es normal, así se ve

Si dos personas modificaron las mismas líneas (por ejemplo, A y D agregando cada uno su variable de color en el mismo bloque `:root`), `git merge` va a fallar con un mensaje como:

```
Auto-merging styles.css
CONFLICT (content): Merge conflict in styles.css
Automatic merge failed; fix conflicts and then commit the result.
```

Abre el archivo marcado y vas a ver algo así:

```
  --color-texto: #1f2937;
<<<<<<< HEAD
  --color-header: #0f172a;
=======
  --color-footer: #1e293b;
>>>>>>> origin/feature/footer
}
```

**Cómo resolverlo:**
1. Decide qué se queda — en este caso, **ambas** líneas son válidas (cada persona agregó su propia variable), así que se conservan las dos y se borran los marcadores `<<<<<<<`, `=======`, `>>>>>>>`.
2. Guarda el archivo.
3. `git add styles.css`
4. `git commit` (sin `-m`, para que se abra el mensaje de merge por defecto, o con `-m "merge: resuelve conflicto en :root"`)
5. `git push origin main`

### 7. Si alguien detecta un error después de fusionar: usar `git revert`, no `git reset`

Supongamos que después de fusionar el formulario de contacto, alguien nota que el botón "Enviar" quedó **fuera** de la etiqueta `<form>` (un error real, no cosmético — el formulario no se puede enviar así). Ya está en `main`, y probablemente alguien más ya bajó esos cambios. **No uses `git reset --hard`** — eso reescribe el historial y puede borrar el trabajo de tus compañeros. En equipo, la forma segura es:

```
git log --oneline          # busca el hash del commit que rompió algo
git revert <hash-del-commit>
git push origin main
```

`git revert` crea un **commit nuevo** que deshace los cambios de ese commit — el historial completo se conserva, nadie pierde nada, y es seguro aunque ya lo hayan descargado otros.

**Importante — lo que `revert` NO hace:** deshace el commit **completo**, no solo la parte que estaba mal. Si ese commit también agregaba algo bueno (ej. el `<input>` del correo), el revert también se lo lleva. Por eso, después de revertir, normalmente hace falta un **commit nuevo** que agregue de vuelta la parte buena, ya corregida:

```
git checkout -b fix/formulario-contacto
# corriges el HTML: el <button> ahora sí queda DENTRO del <form>
git add index.html
git commit -m "fix: corrige el formulario de contacto (el botón ya queda dentro del <form>)"
git push origin fix/formulario-contacto
# fusionar esta rama a main como en el paso 5
```

### 8. Verificación final

Antes de dar por terminada la práctica, entre todos confirmen:
- `index.html` abre en el navegador sin errores.
- No queda ningún marcador `<<<<<<<`, `=======` o `>>>>>>>` en ningún archivo (búsquenlo con Ctrl+F o `grep -n "<<<<<<<" *`).
- El bug que revirtieron ya no está, pero la parte buena de ese commit sí volvió (con el commit de corrección del paso 7).

## Entregable (complementario, no forma parte de la rúbrica oficial de esta semana)

- Captura de pantalla del conflicto real (con los marcadores `<<<<<<<`) y de cómo lo resolvieron.
- Captura de la salida de `git revert` (o `git log` mostrando el commit de revert).
- `index.html` y `styles.css` finales, funcionando, sin marcadores de conflicto.
- Un párrafo por integrante: qué rama trabajó, qué conflicto o problema encontró (si le tocó), y cómo lo resolvió.
