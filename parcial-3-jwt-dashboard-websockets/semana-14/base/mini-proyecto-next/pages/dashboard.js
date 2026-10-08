import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchConToken } from '../lib/fetchConToken';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function Dashboard() {
  const router = useRouter();
  const [talleres, setTalleres] = useState([]);
  const [bitacora, setBitacora] = useState([]);

  useEffect(() => {
    cargar(`${API_URL}/api/dashboard/talleres-inscritos`, setTalleres);
    cargar(`${API_URL}/api/dashboard/bitacora-usuarios`, setBitacora);
  }, []);

  async function cargar(url, guardar) {


  }

  return (
    <main className="contenedor">
      <h1>Dashboard</h1>

      <h2>Talleres con inscritos</h2>
      <table>
        <thead>
          <tr><th>Taller</th><th>Instructor</th><th>Inscritos</th></tr>
        </thead>
        <tbody>

        </tbody>
      </table>

      <h2>Bitácora de asistencia por usuario</h2>
      <table>
        <thead>
          <tr><th>Usuario</th><th>Boleta</th><th>Taller</th><th>Fecha</th></tr>
        </thead>
        <tbody>

        </tbody>
      </table>
    </main>
  );
}
