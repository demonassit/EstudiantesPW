const asistenciasModel = require('../models/asistencias.model');

// CONTROLADOR de asistencias: valida la entrada, llama al modelo y decide la respuesta HTTP.

async function listarAsistenciasDeTaller(req, res) {
  try {
    res.json(await asistenciasModel.listarPorTaller(req.params.id));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function registrarAsistencia(req, res) {
  const { taller_id, nombre_alumno, boleta } = req.body;
  if (!taller_id || !nombre_alumno || !boleta) {
    return res.status(400).json({ error: 'taller_id, nombre_alumno y boleta son obligatorios' });
  }
  try {
    const asistencia = await asistenciasModel.crear({ taller_id, nombre_alumno, boleta });
    res.status(201).json(asistencia);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { listarAsistenciasDeTaller, registrarAsistencia };
