const talleresModel = require('../models/talleres.model');

// CONTROLADOR de talleres: valida la entrada, llama al modelo y decide la respuesta HTTP.
// Es la lógica que en el server.js semilla estaba escrita dentro de cada app.get/app.post.

async function listarTalleres(req, res) {
  try {
    res.json(await talleresModel.listar());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function obtenerTaller(req, res) {
  try {
    const taller = await talleresModel.obtenerConAsistentes(req.params.id);
    if (!taller) return res.status(404).json({ error: 'Taller no encontrado' });
    res.json(taller);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function crearTaller(req, res) {
  const { nombre, instructor, fecha, cupo } = req.body;
  if (!nombre || !fecha) {
    return res.status(400).json({ error: 'nombre y fecha son obligatorios' });
  }
  try {
    const taller = await talleresModel.crear({ nombre, instructor, fecha, cupo });
    res.status(201).json(taller);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { listarTalleres, obtenerTaller, crearTaller };
