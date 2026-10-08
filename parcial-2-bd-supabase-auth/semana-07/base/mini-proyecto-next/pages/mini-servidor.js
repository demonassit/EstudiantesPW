import { useEffect, useState } from 'react';

// Consume el mini-servidor en MVC de la semana 7 (GET/POST /mensajes) a través del proxy /mini.
// Es la "Vista" del MVC: el modelo y el controlador viven en el servidor Express.
export default function MiniServidor() {
  const [mensajes, setMensajes] = useState([]);
  const [texto, setTexto] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    cargarMensajes();
  }, []);

  async function cargarMensajes() {
    try {
      const res = await fetch('/mini/mensajes');
      setMensajes(await res.json());
    } catch {
      setError('El mini-servidor no responde: arráncalo con npm start en el puerto 4000.');
    }
  }

  async function crearMensaje(e) {
    e.preventDefault();
    setError('');
    const res = await fetch('/mini/mensajes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texto }),
    });
    if (res.ok) {
      setTexto('');
      cargarMensajes();
    } else {
      const data = await res.json();
      setError(`Error: ${data.error}`);
    }
  }

  return (
    <main>
      <h1>Mini-servidor Express (MVC)</h1>
      <form onSubmit={crearMensaje} className="formulario">
        <input placeholder="Mensaje" value={texto} onChange={(e) => setTexto(e.target.value)} />
        <button type="submit">Guardar</button>
      </form>
      {error && <p className="error">{error}</p>}

      <h2>Mensajes guardados</h2>
      <ul>
        {mensajes.map((m) => (
          <li key={m.id}>{m.texto}</li>
        ))}
      </ul>
    </main>
  );
}
