import Link from 'next/link';
import { useRouter } from 'next/router';


export default function Menu() {
  const router = useRouter();

  function cerrarSesion() {
    localStorage.removeItem('token');
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
