// Todas las peticiones al backend pasan por aquí, para no repetir en cada página el mismo manejo de errores.
// La ruta es relativa (/api/...): next.config.js la reenvía al backend del puerto 3001.
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const BACKEND_CAIDO = 'El backend no responde: arráncalo con npm start en backend-memoria (puerto 3001).';

// PASO 1 de la guía: escribe esta función.
// pedirJSON('/talleres') debe hacer fetch a `${API_URL}/api/talleres`, regresar el JSON de la respuesta
// y, si algo sale mal, lanzar un Error con un mensaje que se pueda mostrar en pantalla.
export async function pedirJSON(ruta, opciones = {}) {
  // TODO paso 1
  throw new Error('pedirJSON todavía no está escrita (paso 1 de la guía).');
}
