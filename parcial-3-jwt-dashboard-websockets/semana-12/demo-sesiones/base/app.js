// La aplicación de la demo. server.js la arranca; las pruebas la arrancan con otras configuraciones.
// Lo que dice "(en clase)" lo programamos juntos, paso por paso. Mientras no esté, esa ruta responde 501.
const path = require('path');
const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const { crearModeloUsuarios } = require('./modelos/usuarios.modelo');

const NOMBRE_COOKIE = 'connect.sid';

// Regresa todas las sesiones del almacén (MemoryStore usa callback; MySQLStore regresa una promesa).
function todasLasSesiones(almacen) {
  return new Promise((resolve, reject) => {
    const promesa = almacen.all((error, sesiones) => (error ? reject(error) : resolve(sesiones)));
    if (promesa && typeof promesa.then === 'function') promesa.then(resolve, reject);
  });
}

// Respuesta para lo que todavía no programamos.
const pendiente = (paso) => (req, res) =>
  res.status(501).json({ error: `501 · Falta programarlo en clase (paso ${paso})` });

// pool: la conexión a MySQL (db.js). Los usuarios SIEMPRE se leen de MySQL.
function crearApp(config, pool) {
  const app = express();
  app.use(express.json());
  const usuarios = crearModeloUsuarios(pool);

  // Aquí vive lo que el servidor recuerda de cada sesión:
  //  - 'mysql':   en la tabla sessions. Sobrevive a un reinicio y la puedes ver en Workbench.
  //  - 'memoria': en la memoria del proceso. Si el servidor se reinicia, se pierde todo.
  const almacen =
    config.almacen === 'memoria'
      ? new session.MemoryStore()
      : new MySQLStore({ createDatabaseTable: false, clearExpired: false }, pool);
  app.locals.almacen = almacen;

  // Paso 1 (en clase): configurar express-session aquí, ANTES de las rutas.

  // Los primeros 8 caracteres del id de sesión, para poder compararlos en pantalla.
  const idCorto = (id) => (id ? `${id.slice(0, 8)}…` : null);

  // ---------- Middlewares de protección ----------

  // Paso 5 (en clase): función vencida(sesion).

  // 401: "no sé quién eres" (no hay sesión o ya venció).
  function requiereSesion(req, res, next) {
    // Paso 1 (en clase)
    return pendiente(1)(req, res, next);
  }

  // 403: "sé quién eres, pero no tienes permiso".
  function requiereRol(rol) {
    // Paso 3 (en clase)
    return pendiente(3);
  }

  // ---------- Rutas ----------

  app.get('/api/config', (req, res) => res.json(config));

  // Guarda un contador en la sesión. Sirve para ver que la sesión existe antes de entrar
  // (y para la demostración de fijación de sesión).
  app.post('/api/visita', (req, res) => {
    if (!req.session) return pendiente(1)(req, res);
    req.session.visitas = (req.session.visitas || 0) + 1;
    res.json({ visitas: req.session.visitas, sesion: idCorto(req.sessionID) });
  });

  // Paso 2 (en clase): iniciar sesión. Paso 7 (en clase): regenerar el id al entrar.
  app.post('/api/login', pendiente(2));

  // Paso 2 (en clase): cerrar sesión.
  app.post('/api/logout', pendiente(2));

  app.get('/api/sesion', requiereSesion, (req, res) => {
    const desde = config.rolling ? req.session.ultimoUso : req.session.creada;
    res.json({
      usuario: req.session.usuario,
      sesion: idCorto(req.sessionID),
      expiraEnSegundos: Math.max(0, Math.round((desde + config.maxAgeMs - Date.now()) / 1000)),
    });
  });

  app.get('/api/perfil', requiereSesion, (req, res) => {
    req.session.visitas = (req.session.visitas || 0) + 1;
    res.json({ mensaje: `Hola, ${req.session.usuario.nombre}`, rol: req.session.usuario.rol, visitas: req.session.visitas });
  });

  app.get('/api/admin/reporte', requiereSesion, requiereRol('admin'), (req, res) => {
    res.json({ reporte: 'Talleres: 3 · Inscritos: 57 · Cupo libre: 18' });
  });

  // SOLO PARA LA CLASE: muestra lo que el servidor guarda de cada sesión.
  // Un servidor real NUNCA expone esto.
  app.get('/api/diagnostico/sesiones', async (req, res, next) => {
    try {
      const sesiones = await todasLasSesiones(almacen);
      const lista = Object.entries(sesiones || {}).map(([id, s]) => ({
        sesion: idCorto(id),
        esLaTuya: id === req.sessionID,
        usuario: s.usuario ? s.usuario.usuario : '(sin iniciar sesión)',
        visitas: s.visitas || 0,
        expira: s.cookie && s.cookie.expires,
      }));
      res.json({ almacen: config.almacen, sesiones: lista });
    } catch (error) {
      next(error);
    }
  });

  app.use(express.static(path.join(__dirname, 'public')));

  app.use('/api', (req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));
  // eslint-disable-next-line no-unused-vars
  app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ error: 'Error del servidor' });
  });

  return app;
}

module.exports = { crearApp, NOMBRE_COOKIE };
