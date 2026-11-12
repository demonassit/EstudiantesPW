// Lista negra de tokens (tabla tokens_revocados). Solo se usa cuando config.jwtRevocar es true.
// Guardamos el jti (el id único de cada token), NO el token completo.
function crearModeloTokens(pool) {
  async function revocar(jti, usuario, exp) {
    // Paso 7 (en clase)
    throw new Error('Falta programar revocar() en clase (paso 7)');
  }

  async function estaRevocado(jti) {
    // Paso 7 (en clase)
    throw new Error('Falta programar estaRevocado() en clase (paso 7)');
  }

  // Para la tabla de la página (diagnóstico).
  async function listar() {
    const [filas] = await pool.query(
      'SELECT jti, usuario, expira, revocado_en FROM tokens_revocados ORDER BY revocado_en DESC, jti'
    );
    return filas;
  }

  return { revocar, estaRevocado, listar };
}

module.exports = { crearModeloTokens };
