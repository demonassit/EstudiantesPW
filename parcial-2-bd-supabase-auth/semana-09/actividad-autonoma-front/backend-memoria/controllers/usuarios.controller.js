const bcrypt = require('bcryptjs');
const usuariosModel = require('../models/usuarios.model');
const { validarCorreo, validarBoleta, validarContrasena } = require('../validaciones');

// Correo o boleta repetidos (UNIQUE): es un error del cliente (409), no del servidor (500).
// MySQL lo reporta como ER_DUP_ENTRY y PostgreSQL/Supabase con el código 23505.
function esDuplicado(error) {
  return error.code === 'ER_DUP_ENTRY' || error.code === '23505';
}

async function listarUsuarios(req, res) {
  try {
    const usuarios = await usuariosModel.listar();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function obtenerUsuario(req, res) {
  try {
    const usuario = await usuariosModel.obtenerPorId(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function crearUsuario(req, res) {
  const { nombre, correo, contrasena, boleta, rol } = req.body;
  if (!nombre || !correo || !contrasena || !boleta) {
    return res.status(400).json({ error: 'nombre, correo, contrasena y boleta son obligatorios' });
  }
  if (!validarCorreo(correo)) return res.status(400).json({ error: 'El correo no tiene un formato válido' });
  if (!validarBoleta(boleta)) return res.status(400).json({ error: 'La boleta debe tener 10 dígitos' });
  if (!validarContrasena(contrasena)) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
  }

  try {
    const contrasenaHash = await bcrypt.hash(contrasena, 10);
    const usuario = await usuariosModel.crear({ nombre, correo, contrasenaHash, boleta, rol });
    res.status(201).json(usuario);
  } catch (error) {
    if (esDuplicado(error)) return res.status(409).json({ error: 'Ya existe un usuario con ese correo o boleta' });
    res.status(500).json({ error: error.message });
  }
}

async function actualizarUsuario(req, res) {
  const { nombre, correo, rol } = req.body;
  if (nombre === undefined && correo === undefined && rol === undefined) {
    return res.status(400).json({ error: 'Envía al menos uno de: nombre, correo, rol' });
  }
  if (correo !== undefined && !validarCorreo(correo)) {
    return res.status(400).json({ error: 'El correo no tiene un formato válido' });
  }
  try {
    const usuario = await usuariosModel.actualizar(req.params.id, { nombre, correo, rol });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    if (esDuplicado(error)) return res.status(409).json({ error: 'Ya existe un usuario con ese correo' });
    res.status(500).json({ error: error.message });
  }
}

async function eliminarUsuario(req, res) {
  try {
    const eliminado = await usuariosModel.eliminar(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { listarUsuarios, obtenerUsuario, crearUsuario, actualizarUsuario, eliminarUsuario };
