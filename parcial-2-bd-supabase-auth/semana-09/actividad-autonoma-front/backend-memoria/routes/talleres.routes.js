const express = require('express');
const router = express.Router();
const controller = require('../controllers/talleres.controller');

router.get('/api/talleres', controller.listarTalleres);
router.post('/api/talleres', controller.crearTaller);
router.get('/api/talleres/:id', controller.obtenerTaller);

module.exports = router;
