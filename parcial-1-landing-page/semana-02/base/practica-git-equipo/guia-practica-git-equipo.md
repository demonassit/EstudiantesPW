# Práctica de Git en equipo — landing page con roles, rama de QA y producción

**Complementaria — no reemplaza la práctica oficial de esta semana** (ponchado de cable UTP, ver `README.md`). Es para el equipo de 4 personas del proyecto integrador.

## Objetivo

Practicar, con un proyecto real (no un ejercicio de juguete), el ciclo completo de trabajo en equipo de una organización de software: cada persona en su propia rama con un rol real (2 desarrolladores, 1 líder de equipo, 1 diseñador/a), integración de todas las ramas en una rama de **QA** donde se prueba antes de tocar producción, resolución de conflictos reales, corrección de un error encontrado durante la integración, y por último la promoción de `qa` a `main` (producción) — todo antes de que les pase "de verdad" en una entrega que sí cuenta.

## Roles y ramas

| Persona | Rama | Pantalla / archivo que construye | Qué agrega |
|---|---|---|---|
| Desarrollador 1 | `dev1` | `index.html` — Catálogo de talleres | El contenido del catálogo (tarjetas de talleres) + su propia variable de acento en `:root` + su bloque de estilos al final de `styles.css` |
| Desarrollador 2 | `dev2` | `detalle.html` — Detalle del taller | El contenido de detalle + bitácora de asistentes + su propia variable de acento en `:root` + su bloque de estilos |
| Líder de equipo | `lider` | `registro.html` — Registro de asistencia | El formulario de registro + su propia variable de acento en `:root` + su bloque de estilos. **Además**, coordina la integración de las 4 ramas a `qa` y, cuando el QA aprueba, el paso de `qa` a `main` |
| Diseñador/a | `dis` | `styles.css` (base) | El reset, la tipografía, el layout general (`header`/`main`/`footer`), la variable de marca `--color-primario` y el responsive de móvil |

**Ramas del proyecto:** `main` (producción) ← `qa` (integración y pruebas) ← `dev1` / `dev2` / `lider` / `dis` (una por persona).

```
dev1 ─┐
dev2 ─┼─▶ qa ─▶ main
lider ┤        (producción)
dis  ─┘
```

## Por qué esto genera un conflicto real (a propósito)

Los 4 arrancan del mismo archivo `styles.css`, que trae un bloque `:root { }` vacío. Cada rol agrega **una sola variable propia** dentro de ese mismo bloque, y también agrega su propia sección de reglas CSS al final del archivo. Como los 4 parten de la misma versión y trabajan en paralelo, **quien integre su rama después de que ya se integró otra persona (sin haber hecho `pull` de lo último) va a chocar de verdad** — no es un conflicto inventado, es justo lo que le pasa a cualquier equipo cuando dos personas tocan el mismo archivo compartido al mismo tiempo.

## Antes de empezar

1. El **líder** crea el repositorio del equipo (en GitHub/GitLab), sube el contenido de `proyecto-inicial/` (`index.html`, `detalle.html`, `registro.html`, `styles.css`) a `main`, y crea la rama `qa` a partir de `main` (queda igual a `main` por ahora).
2. Los otros 3 integrantes clonan el repo:
   ```
   git clone <url-del-repo-del-equipo>
   ```
3. Cada integrante configura su nombre y correo si no lo ha hecho antes:
   ```
   git config --global user.name "Tu Nombre"
   git config --global user.email "tu-correo@ejemplo.com"
   ```

## Paso a paso

### 1. Cada quien crea su rama desde `main`

```
git checkout main
git pull origin main
git checkout -b dev1        # o dev2 / lider / dis, según tu rol
```

### 2. Trabajar con commits pequeños y frecuentes

Al menos 2 commits por persona (no uno solo gigante al final):

```
git add index.html            # o el/los archivo(s) de tu rol
git commit -m "feat: agrega <lo que hiciste>"

git add styles.css
git commit -m "feat: estiliza <tu pantalla>"
```

### 3. Subir tu rama

```
git push origin dev1          # o dev2 / lider / dis
```

### 4. El líder integra las 4 ramas en `qa`, una por una

```
git checkout qa
git pull origin qa
git merge dis      # primero el diseñador: pone la base de estilos
git push origin qa

git merge dev1     # aquí ya puede aparecer un conflicto real (ver abajo)
# ... resolver si aparece, luego:
git push origin qa

git merge dev2     # mismo caso
git merge lider     # mismo caso
```

### 5. Si aparece un conflicto — es normal, así se ve

Cada integración (después de la primera) puede producir **dos** bloques en conflicto dentro de `styles.css`: el de las variables en `:root` y el de las secciones de estilo al final del archivo. Se ven así:

```
<<<<<<< HEAD
... lo que ya estaba en qa ...
=======
... lo que trae tu rama ...
>>>>>>> origin/tu-rama
```

**Cómo resolverlo:** en ambos casos las líneas de los dos lados son válidas — cada persona agregó su propia variable y su propia sección — así que se conservan **ambas**, se borran los marcadores `<<<<<<<`, `=======`, `>>>>>>>`, y se revisa que las llaves `{`/`}` sigan bien balanceadas (a veces queda una sola llave de cierre compartida entre las dos secciones, hay que dejar solo una).

```
git add styles.css
git commit
git push origin qa
```

### 6. Pruebas de QA sobre la rama `qa` (antes de tocar producción)

Con las 4 ramas ya integradas en `qa`, todo el equipo revisa este checklist:

- [ ] No queda ningún marcador `<<<<<<<`, `=======` ni `>>>>>>>` en ningún archivo.
- [ ] Las 3 páginas (`index.html`, `detalle.html`, `registro.html`) cargan `styles.css`.
- [ ] **Todos** los enlaces de navegación (`href="...html"`) apuntan a un archivo que sí existe en el repo.
- [ ] Las 4 variables (`--color-primario` + las 3 de acento) están dentro de `:root`.
- [ ] Las 3 páginas se ven bien en escritorio y en móvil (probar angostando la ventana o con las DevTools).

### 7. Si el QA encuentra un error real: se corrige en la rama de origen, no directo en `qa`

Quien encuentre el error lo reporta a quien construyó esa pantalla. Esa persona:

```
git checkout dev1        # su propia rama (la que le corresponda)
# corrige el archivo
git add <archivo>
git commit -m "fix: corrige <el error que reporto QA>"
git push origin dev1
```

El líder vuelve a integrar esa rama en `qa` (`git merge dev1`), y el equipo repite el checklist del paso 6.

### 8. Promover `qa` a `main` (producción)

Solo cuando el checklist del paso 6 pasa al 100%:

```
git checkout main
git pull origin main
git merge qa
git push origin main
```

Esto simula el paso real de "pasa las pruebas → se libera a producción".

## Entregable

- Captura de cada uno de los 3 conflictos reales (dev1, dev2, lider) ya resueltos.
- Captura del error real encontrado durante el QA + de la corrección en la rama de origen.
- Captura del checklist de QA aprobado (los 5 puntos en verde).
- Captura del merge final de `qa` a `main`.
- Un párrafo por integrante sobre su rol, su rama, y qué conflicto o error le tocó resolver.
- `index.html`/`detalle.html`/`registro.html`/`styles.css` finales, sin marcadores de conflicto.

---
La rúbrica de esta práctica la tiene tu docente por separado.
