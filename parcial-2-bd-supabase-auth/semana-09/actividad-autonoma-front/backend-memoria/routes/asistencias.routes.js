const express = require('express');
const router = express.Router();
const controller = require('../controllers/asistencias.controller');

router.get('/api/talleres/:id/asistencias', controller.listarAsistenciasDeTaller);
router.post('/api/asistencias', controller.registrarAsistencia);

module.exports = router;
