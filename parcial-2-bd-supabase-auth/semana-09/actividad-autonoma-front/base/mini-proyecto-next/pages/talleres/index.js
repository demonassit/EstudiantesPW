import { useEffect, useState } from 'react';
import { pedirJSON } from '../../lib/api';

// /talleres — lista de talleres (GET /api/talleres).
// PASO 2: lista sencilla con estados de carga y error.
// PASO 3: cambia la lista por tarjetas (components/TarjetaTaller.js) en una rejilla.
// PASO 7: agrega el buscador.
export default function Talleres() {
  const [talleres, setTalleres] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // TODO paso 2: useEffect que llame a cargarTalleres() una sola vez, al abrir la página.

  async function cargarTalleres() {
    // TODO paso 2: pide '/talleres' con pedirJSON y guarda el resultado en el estado.
  }

  return (
    <main>
      <h1>Talleres</h1>
      {/* TODO paso 2: mensaje de "Cargando…", mensaje de error y la lista de talleres. */}
    </main>
  );
}
