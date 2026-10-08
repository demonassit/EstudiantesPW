import { useEffect, useState } from 'react';
import { validarBoleta, validarContrasena, validarCorreo } from '../../lib/validaciones';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [boleta, setBoleta] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    cargarUsuarios();
  }, []);

  async function cargarUsuarios() {
    try {
      const res = await fetch(`${API_URL}/api/usuarios`);
      setUsuarios(await res.json());
    } catch {
      setMensaje('El backend no responde: revisa que esté corriendo (BACKEND_URL).');
    }
  }

  async function crearUsuario(e) {
    e.preventDefault();
    setMensaje('');
    const error = validarFormulario({ correo, contrasena, boleta });
    if (error) {
      setMensaje(`Error: ${error}`);
      return;
    }
    const res = await fetch(`${API_URL}/api/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, correo, contrasena, boleta }),
    });
    if (res.ok) {
      setNombre('');
      setCorreo('');
      setContrasena('');
      setBoleta('');
      cargarUsuarios();
    } else {
      const data = await res.json();
      setMensaje(`Error: ${data.error}`);
    }
  }

  async function eliminarUsuario(id) {


  }

  async function guardarEdicion(usuario) {


  }

  return (
    <main className="contenedor">
      <h1>Administración de usuarios</h1>

      <form onSubmit={crearUsuario} className="formulario">
        <h2>Crear usuario</h2>
        <input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        <input placeholder="Correo" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
        <input
          type="password"
          placeholder="Contraseña (mínimo 8 caracteres)"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
        />
        <input placeholder="Boleta (10 dígitos)" value={boleta} onChange={(e) => setBoleta(e.target.value)} required />
        <button type="submit">Crear</button>
      </form>

      {mensaje && <p className="error">{mensaje}</p>}

      <h2>Usuarios registrados</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Boleta</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              {editandoId === u.id ? (
                <FilaEdicion usuario={u} onGuardar={guardarEdicion} onCancelar={() => setEditandoId(null)} />
              ) : (
                <>
                  <td>{u.nombre}</td>
                  <td>{u.correo}</td>
                  <td>{u.boleta}</td>
                  <td>{u.rol}</td>
                  <td>
                    <button onClick={() => setEditandoId(u.id)}>Editar</button>
                    <button onClick={() => eliminarUsuario(u.id)}>Eliminar</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

// Mismas reglas que valida el backend (ver lib/validaciones.js).
function validarFormulario({ correo, contrasena, boleta }) {
  if (!validarCorreo(correo)) return 'el correo no tiene un formato válido';
  if (!validarBoleta(boleta)) return 'la boleta debe tener 10 dígitos';
  if (!validarContrasena(contrasena)) return 'la contraseña debe tener al menos 8 caracteres';
  return '';
}

function FilaEdicion({ usuario, onGuardar, onCancelar }) {
  const [nombre, setNombre] = useState(usuario.nombre);
  const [correo, setCorreo] = useState(usuario.correo);
  const [rol, setRol] = useState(usuario.rol);

  return (
    <>
      <td><input value={nombre} onChange={(e) => setNombre(e.target.value)} /></td>
      <td><input value={correo} onChange={(e) => setCorreo(e.target.value)} /></td>
      <td>{usuario.boleta}</td>
      <td><input value={rol} onChange={(e) => setRol(e.target.value)} /></td>
      <td>
        <button disabled={!validarCorreo(correo)} onClick={() => onGuardar({ id: usuario.id, nombre, correo, rol })}>
          Guardar
        </button>
        <button onClick={onCancelar}>Cancelar</button>
      </td>
    </>
  );
}
