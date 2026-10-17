const { randomUUID } = require('crypto');
const { db, ahora } = require('../datos/memoria');

// MODELO de talleres (en memoria). Exporta las mismas funciones, con las mismas respuestas, que
// talleres.model.mysql.js y talleres.model.supabase.js: por eso el controlador es el mismo archivo.

async function listar() {
  return [...db.talleres].sort((a, b) => a.fecha.localeCompare(b.fecha)).map((t) => ({ ...t }));
}

// Un taller con el número de asistentes registrados; undefined si no existe (el controlador responde 404).
async function obtenerConAsistentes(id) {
  const taller = db.talleres.find((t) => t.id === id);
  if (!taller) return undefined;
  const asistentes = db.asistencias.filter((a) => a.taller_id === id).length;
  return { ...taller, asistentes };
}

async function crear({ nombre, instructor, fecha, cupo }) {
  const taller = {
    id: randomUUID(),
    nombre,
    instructor: instructor || null,
    fecha,
    cupo: cupo || 30,
    created_at: ahora(),
  };
  db.talleres.push(taller);
  return { ...taller };
}

module.exports = { listar, obtenerConAsistentes, crear };
