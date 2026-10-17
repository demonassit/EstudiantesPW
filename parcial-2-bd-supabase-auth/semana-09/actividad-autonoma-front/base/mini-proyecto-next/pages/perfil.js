import Link from 'next/link';
import { useState } from 'react';
import { pedirJSON } from '../lib/api';
import { formatearFecha } from '../lib/formato';
import { validarBoleta } from '../lib/validaciones';
import estilos from '../styles/Talleres.module.css';

// /perfil — el alumno escribe su boleta y ve sus datos, sus talleres y los talleres con lugar.
// Todavía no hay login (llega en la semana 10): por eso se busca por boleta.
// PASO 6: GET /api/usuarios, GET /api/talleres y GET /api/talleres/:id/asistencias (uno por taller).
export default function Perfil() {
  const [boleta, setBoleta] = useState('');

  // TODO paso 6: estados y la función buscar(e).

  return (
    <main>
      <h1>Mi perfil</h1>
      {/* TODO paso 6: formulario de boleta, datos del alumno, mis talleres y talleres con lugar. */}
    </main>
  );
}
