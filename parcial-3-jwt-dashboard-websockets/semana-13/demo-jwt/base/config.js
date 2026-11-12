// Configuración de la sesión. Durante la demo vas a cambiar estos valores.
// Después de cada cambio: detén el servidor (Ctrl+C) y vuelve a correr  npm start
module.exports = {
  // Dónde guarda el servidor las sesiones:
  //  'mysql'   → en la tabla sessions de tu base de datos (sobreviven a un reinicio).
  //  'memoria' → en la memoria del servidor (se pierden al reiniciar).
  almacen: 'mysql',

  // Cuánto dura la sesión, en milisegundos. 10 minutos = 10 * 60 * 1000
  maxAgeMs: 10 * 60 * 1000,

  // true: cada petición reinicia el reloj de la expiración (la sesión vence por inactividad).
  // false: vence a la hora fija, aunque el usuario siga usando la página.
  rolling: false,

  // true: el JavaScript de la página NO puede leer la cookie (document.cookie no la muestra).
  httpOnly: true,

  // 'lax': la cookie no viaja en peticiones POST que vienen de otros sitios. 'strict' es más estricto.
  sameSite: 'lax',

  // true: al iniciar sesión el servidor cambia el id de la sesión (protege contra la fijación de sesión).
  regenerarAlEntrar: true,

  // ---------- JWT (semana 13) ----------

  // Cuántos SEGUNDOS dura un token (ojo: segundos, no milisegundos). 5 minutos = 5 * 60
  jwtExpiraSeg: 5 * 60,

  // true: al cerrar sesión, el servidor anota el token en la lista negra (tabla tokens_revocados) y ya no lo acepta.
  // false: el servidor no guarda nada; el token sigue sirviendo hasta que venza, aunque "cierres sesión".
  jwtRevocar: true,
};
