// Consultas a la tabla usuarios. Siempre con ? (consulta parametrizada), nunca pegando texto en el SQL.
const bcrypt = require('bcryptjs');

function crearModeloUsuarios(pool) {
  // Regresa el usuario (sin el hash) si la contraseña es correcta, o null si no.
  async function verificar(usuario, contrasena) {
    const [filas] = await pool.query(
      'SELECT id, usuario, nombre, rol, contrasena_hash FROM usuarios WHERE usuario = ?',
      [String(usuario || '')]
    );
    if (filas.length === 0) return null;
    const correcta = await bcrypt.compare(String(contrasena || ''), filas[0].contrasena_hash);
    if (!correcta) return null;
    const { contrasena_hash, ...sinHash } = filas[0]; // el hash nunca sale de aquí
    return sinHash;
  }

  return { verificar };
}

module.exports = { crearModeloUsuarios };
