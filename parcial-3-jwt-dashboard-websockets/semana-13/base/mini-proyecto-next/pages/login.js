import { useState } from 'react';
import { useRouter } from 'next/router';
import { validarCorreo } from '../lib/validaciones';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function Login() {
  const router = useRouter();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');

  async function iniciarSesion(e) {
    e.preventDefault();
    setError('');
    if (!validarCorreo(correo)) {
      setError('El correo no tiene un formato válido');
      return;
    }

    const res = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, contrasena }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      router.push('/admin/usuarios');
    } else {
      setError(data.error);
    }
  }

  return (
    <main className="contenedor">
      <h1>Iniciar sesión</h1>
      <form onSubmit={iniciarSesion} className="formulario">
        <input placeholder="Correo" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
      </form>
      {error && <p className="error">{error}</p>}
    </main>
  );
}
