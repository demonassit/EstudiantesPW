# Guía de Git para trabajo en equipo — Proyecto CECyT9

Esta guía es la misma en los 4 repos del proyecto (`cecyt9-proyecto`, `cecyt9-distribuidos`, `cecyt9-web`, `cecyt9-pruebas`). El trabajo colaborativo real (ramas, conflictos, Pull Requests) ocurre en **`cecyt9-proyecto`**, que es el único repo donde todo el equipo escribe código a la vez.

## 1. Configuración inicial (una vez por persona)

```
git config --global user.name "Tu Nombre"
git config --global user.email "tu-correo@ejemplo.com"
git clone <url-del-repo-cecyt9-proyecto-de-tu-equipo>
```

## 2. Flujo de ramas

- `main` siempre debe funcionar — es lo que se entrega en cada corte.
- Cada integrante trabaja su tarea en su propia rama: `feature/<nombre-corto>` (ej. `feature/crud-usuarios`, `feature/websocket-dashboard`).
- **Nunca** se hace commit directo a `main`.
- Al terminar una tarea: Pull Request hacia `main`, revisión de al menos 1 compañero de equipo, luego merge.

## 3. Comandos del día a día

```
git status                      # qué cambió
git pull origin main            # SIEMPRE antes de empezar a trabajar
git checkout -b feature/nombre  # nueva rama para tu tarea
git add <archivo>                # evitar "git add ." a ciegas
git commit -m "feat: descripción clara del cambio"
git push origin feature/nombre
```

**Convención de mensajes de commit:** prefijo + descripción — `feat:` (funcionalidad nueva), `fix:` (corrección), `docs:` (documentación), `test:` (pruebas), `refactor:` (reorganizar sin cambiar comportamiento).

## 4. Errores comunes cuando el equipo no tiene la misma versión

### 4.1 Push rechazado ("rejected — non-fast-forward")
**Causa:** alguien más subió cambios a `main` (o a tu rama compartida) mientras tú trabajabas con una copia vieja.
**Solución:** `git pull origin main`, resolver conflictos si aparecen, luego `git push`.

### 4.2 Conflicto de merge
**Causa:** dos personas editaron las mismas líneas del mismo archivo.
**Cómo se ve:** aparecen marcadores `<<<<<<< HEAD`, `=======`, `>>>>>>>` dentro del archivo.
**Solución:** abrir el archivo, decidir qué código queda (o combinar ambos), borrar los marcadores, `git add <archivo>`, `git commit`.

### 4.3 Olvidar hacer `pull` antes de empezar a trabajar
**Consecuencia:** conflictos innecesarios al final del día, sobre código que ya había cambiado.
**Prevención:** `git pull origin main` siempre al iniciar la sesión de trabajo.

### 4.4 Subir `node_modules` o `.env` por accidente
**Causa:** `.gitignore` mal configurado, o el archivo ya estaba trackeado antes de agregarlo al `.gitignore`.
**Consecuencia:** repos pesados y credenciales expuestas (ej. `SUPABASE_KEY`).
**Solución:** verificar el `.gitignore` desde el primer commit; si ya se subió algo sensible, usar `git rm --cached <archivo>` **y rotar la credencial expuesta** (no basta con borrarla del repo).

### 4.5 Force push que borra el trabajo de un compañero
**Causa:** usar `git push --force` para "resolver" un rechazo sin entender por qué ocurrió.
**Consecuencia:** se pierden commits de otros integrantes.
**Regla del equipo:** nunca usar `--force` en `main`. Si hace falta forzar en tu propia rama, usar `--force-with-lease` y avisar al equipo antes.

### 4.6 Commits gigantes al final del corte
**Causa:** no hacer commits frecuentes durante la semana.
**Consecuencia:** historial imposible de revisar; difícil encontrar en qué commit se rompió algo.
**Prevención:** commits pequeños y frecuentes, uno por tarea completada, no uno solo al final.

## 5. Práctica 0 — Git en equipo (antes de la Semana 1 de cualquier materia)

**Objetivo:** que el equipo experimente un conflicto de merge real y lo resuelva, antes de que les pase "de verdad" en una entrega que sí cuenta.

**Pasos:**
1. Los integrantes del equipo clonan `cecyt9-proyecto`.
2. Cada integrante crea su rama: `practica0/<nombre>`.
3. Todos editan la **misma línea** de este mismo archivo (a propósito, para forzar el conflicto).
4. El primero hace push y merge a `main` sin problema.
5. El segundo intenta hacer push → debe ser rechazado. Debe hacer `pull`, resolver el conflicto manualmente, y completar el merge.
6. Se repite con cada integrante restante.
7. **Entregable:** captura de pantalla del conflicto real (marcadores `<<<<<<<`) + explicación por escrito de qué lo causó y cómo lo resolvieron.

---
La rúbrica de esta práctica la tiene tu docente por separado.
