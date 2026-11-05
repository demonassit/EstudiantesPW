// Consultas a la tabla usuarios. Siempre con ? (consulta parametrizada), nunca pegando texto en el SQL.
const bcrypt = require('bcryptjs');

function crearModeloUsuarios(pool) {
  // Regresa el usuario (sin el hash) si la contraseña es correcta, o null si no.
  async function verificar(usuario, contrasena) {
    // Paso 2 (en clase)
    throw new Error('Falta programar verificar() en clase (paso 2)');
  }

  return { verificar };
}

module.exports = { crearModeloUsuarios };
