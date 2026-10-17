const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuarios.controller');

router.get('/api/usuarios', controller.listarUsuarios);
router.get('/api/usuarios/:id', controller.obtenerUsuario);
router.post('/api/usuarios', controller.crearUsuario);
router.put('/api/usuarios/:id', controller.actualizarUsuario);
router.delete('/api/usuarios/:id', controller.eliminarUsuario);

module.exports = router;
