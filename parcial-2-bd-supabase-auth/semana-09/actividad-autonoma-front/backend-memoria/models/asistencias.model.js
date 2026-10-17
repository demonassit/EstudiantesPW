const { randomUUID } = require('crypto');
const { db, ahora } = require('../datos/memoria');

// MODELO de asistencias (en memoria). Igual que en MySQL: no revisa cupo ni inscripciones repetidas
// (eso lo cuida el front esta semana) y un taller_id inexistente es un error de la BD (500).

async function listarPorTaller(tallerId) {
  return db.asistencias.filter((a) => a.taller_id === tallerId).map((a) => ({ ...a }));
}

async function crear({ taller_id, nombre_alumno, boleta }) {
  if (!db.talleres.some((t) => t.id === taller_id)) {
    // Mismo caso que la llave foránea de MySQL: FOREIGN KEY (taller_id) REFERENCES talleres(id).
    throw new Error('Cannot add or update a child row: a foreign key constraint fails (taller_id no existe)');
  }
  const asistencia = { id: randomUUID(), taller_id, nombre_alumno, boleta, fecha_registro: ahora() };
  db.asistencias.push(asistencia);
  return { ...asistencia };
}

module.exports = { listarPorTaller, crear };
