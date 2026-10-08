import Link from 'next/link';

export default function Menu() {
  return (
    <nav>
      <Link href="/">Inicio</Link>
      <Link href="/practica/1">Práctica /1</Link>
      <Link href="/mini-servidor">Mini-servidor</Link>
      <Link href="/admin/usuarios">Usuarios</Link>
    </nav>
  );
}
