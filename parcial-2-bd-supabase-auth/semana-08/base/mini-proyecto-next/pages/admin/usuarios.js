import { useEffect, useState } from 'react';
import { validarBoleta, validarContrasena, validarCorreo } from '../../lib/validaciones';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const BACKEND_CAIDO = 'El backend no responde: revisa que esté corriendo (BACKEND_URL).';

// Mensaje de error de una respuesta fallida. Si el backend está caído, el proxy de Next responde
// 500 sin JSON y res.json() fallaría: en ese caso se muestra el código HTTP.
async function leerError(res) {
  try {
    const data = await res.json();
    return data.error || `HTTP ${res.status}`;
  } catch {
    return `el backend respondió ${res.status}`;
  }
}

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [boleta, setBoleta] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    cargarUsuarios();
  }, []);

  async function cargarUsuarios() {
    try {
      const res = await fetch(`${API_URL}/api/usuarios`);
      if (!res.ok) {
        // Sin esto, un 500 ({ error }) llegaría a usuarios.map() y la página tronaría.
        setMensaje(`Error al cargar usuarios: ${await leerError(res)}`);
        return;
      }
      setUsuarios(await res.json());
    } catch {
      setMensaje(BACKEND_CAIDO);
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
    try {
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
        setMensaje(`Error: ${await leerError(res)}`);
      }
    } catch {
      setMensaje(BACKEND_CAIDO);
    }
  }

  return (
    <main className="contenedor">
      <h1>Usuarios (alta y lista)</h1>

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
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.nombre}</td>
              <td>{u.correo}</td>
              <td>{u.boleta}</td>
              <td>{u.rol}</td>
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
