import Link from 'next/link';
import { useRouter } from 'next/router';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function Menu() {
  const router = useRouter();

  async function cerrarSesion() {
    await fetch(`${API_URL}/api/logout`, { method: 'POST', credentials: 'include' });
    router.push('/login');
  }

  return (
    <nav>
      <Link href="/">Inicio</Link>
      <Link href="/practica/1">Práctica /1</Link>
      <Link href="/mini-servidor">Mini-servidor</Link>
      <Link href="/admin/usuarios">Usuarios</Link>
      <Link href="/login">Iniciar sesión</Link>
      <button onClick={cerrarSesion}>Cerrar sesión</button>
    </nav>
  );
}
