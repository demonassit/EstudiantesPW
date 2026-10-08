// Reglas de validación de los datos de un usuario. Son las mismas que valida el backend y las que
// Pruebas de Software prueba con Jest: el front valida para avisar rápido a quien llena el
// formulario; el backend valida para que nadie se las salte mandando la petición con Postman.

export function validarCorreo(correo) {
  if (typeof correo !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim());
}

export function validarBoleta(boleta) {
  if (typeof boleta !== 'string') return false;
  return /^\d{10}$/.test(boleta.trim());
}

export function validarContrasena(contrasena) {
  if (typeof contrasena !== 'string') return false;
  return contrasena.length >= 8;
}
