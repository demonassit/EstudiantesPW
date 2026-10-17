import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { pedirJSON } from '../../lib/api';
import { formatearFecha, ocultarBoleta } from '../../lib/formato';
import { validarBoleta } from '../../lib/validaciones';
import estilos from '../../styles/Talleres.module.css';

// /talleres/[id] — detalle de un taller.
// PASO 4: datos del taller, barra de lugares y lista de inscritos
//         (GET /api/talleres/:id y GET /api/talleres/:id/asistencias).
// PASO 5: formulario de inscripción (POST /api/asistencias).
export default function DetalleTaller() {
  const router = useRouter();
  const { id } = router.query;

  const [taller, setTaller] = useState(null);
  const [asistencias, setAsistencias] = useState([]);
  const [errorCarga, setErrorCarga] = useState('');

  // TODO paso 5.1: estados del formulario.

  // TODO paso 4.1: useEffect que espere a router.isReady y llame a cargar().

  async function cargar() {
    // TODO paso 4.1: pide el taller y sus asistencias y guárdalos en el estado.
  }

  // TODO paso 4.2: cálculo de lugares (ocupados, libres, lleno).

  // TODO paso 5.2: función inscribir(e).

  return (
    <main>
      <Link href="/talleres">← Volver a talleres</Link>
      <h1>Detalle del taller {id}</h1>
      {/* TODO paso 4 y paso 5 */}
    </main>
  );
}
