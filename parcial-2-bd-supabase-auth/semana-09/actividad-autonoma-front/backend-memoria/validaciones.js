// Reglas de validación de los datos de un usuario. Son las mismas que usa el front
// (mini-proyecto-next/lib/validaciones.js) y las que Pruebas de Software prueba con Jest.
// El backend las vuelve a revisar porque una petición con Postman se salta el front.

function validarCorreo(correo) {
  if (typeof correo !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim());
}

function validarBoleta(boleta) {
  if (typeof boleta !== 'string') return false;
  return /^\d{10}$/.test(boleta.trim());
}

function validarContrasena(contrasena) {
  if (typeof contrasena !== 'string') return false;
  return contrasena.length >= 8;
}

module.exports = { validarCorreo, validarBoleta, validarContrasena };
