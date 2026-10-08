import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { validarCorreo } from '../lib/validaciones';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function Login() {
  const router = useRouter();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [captchaId, setCaptchaId] = useState('');
  const [pregunta, setPregunta] = useState('');
  const [respuestaCaptcha, setRespuestaCaptcha] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    pedirCaptcha();
  }, []);

  async function pedirCaptcha() {
    const res = await fetch(`${API_URL}/api/captcha`);
    const data = await res.json();
    setCaptchaId(data.captchaId);
    setPregunta(data.pregunta);
  }

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
      body: JSON.stringify({ correo, contrasena, captchaId, respuestaCaptcha }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      router.push('/dashboard');
    } else {
      setError(data.error);
      pedirCaptcha(); // el captcha es de un solo uso, se pide uno nuevo tras fallar
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
        <label>{pregunta}</label>
        <input
          placeholder="Respuesta del captcha"
          value={respuestaCaptcha}
          onChange={(e) => setRespuestaCaptcha(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
      </form>
      {error && <p className="error">{error}</p>}
    </main>
  );
}
