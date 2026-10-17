const { db } = require('../datos/memoria');

// MODELO de usuarios (en memoria). Mismas funciones y respuestas que usuarios.model.mysql.js.
// Nunca devuelve contrasena_hash, igual que COLUMNAS_PUBLICAS en MySQL.

function publico({ id, nombre, correo, boleta, rol }) {
  return { id, nombre, correo, boleta, rol };
}

// Correo o boleta repetidos: el mismo código de error que MySQL, para que el controlador responda 409.
// Como la collation de MySQL, el correo se compara sin distinguir mayúsculas.
function revisarDuplicado({ correo, boleta }, idPropio) {
  const repetido = db.usuarios.some(
    (u) =>
      u.id !== idPropio &&
      ((correo !== undefined && u.correo.toLowerCase() === correo.toLowerCase()) ||
        (boleta !== undefined && u.boleta === boleta))
  );
  if (repetido) {
    const error = new Error('Duplicate entry');
    error.code = 'ER_DUP_ENTRY';
    throw error;
  }
}

async function listar() {
  return db.usuarios.map(publico);
}

async function obtenerPorId(id) {
  const usuario = db.usuarios.find((u) => u.id === Number(id));
  return usuario ? publico(usuario) : undefined;
}

async function crear({ nombre, correo, contrasenaHash, boleta, rol }) {
  revisarDuplicado({ correo, boleta });
  const usuario = {
    id: db.siguienteIdUsuario++,
    nombre,
    correo,
    boleta,
    rol: rol || 'alumno',
    contrasena_hash: contrasenaHash,
  };
  db.usuarios.push(usuario);
  return publico(usuario);
}

async function actualizar(id, { nombre, correo, rol }) {
  const usuario = db.usuarios.find((u) => u.id === Number(id));
  if (!usuario) return undefined;
  revisarDuplicado({ correo }, usuario.id);
  // Solo cambian los campos que vienen en la petición (PUT parcial).
  if (nombre !== undefined) usuario.nombre = nombre;
  if (correo !== undefined) usuario.correo = correo;
  if (rol !== undefined) usuario.rol = rol;
  return publico(usuario);
}

async function eliminar(id) {
  const antes = db.usuarios.length;
  db.usuarios = db.usuarios.filter((u) => u.id !== Number(id));
  return db.usuarios.length < antes;
}

async function buscarPorCorreoConHash(correo) {
  const usuario = db.usuarios.find((u) => u.correo.toLowerCase() === String(correo).toLowerCase());
  return usuario ? { ...usuario } : undefined;
}

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar, buscarPorCorreoConHash };
