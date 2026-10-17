const { randomUUID } = require('crypto');

// "Base de datos" en memoria: 3 arreglos con las mismas columnas que las tablas de MySQL/Supabase
// (ver semana-08/.../schema-completo-mysql.sql). Se pierde al apagar el servidor y vuelve a estos
// datos de ejemplo cada vez que arranca.

// Mismo formato de texto que devuelve MySQL con dateStrings: 'AAAA-MM-DD HH:MM:SS'.
function ahora() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

const db = { talleres: [], asistencias: [], usuarios: [], siguienteIdUsuario: 1 };

function reiniciar() {
  const creado = ahora();
  // Los talleres de ejemplo tienen id FIJOS (con formato UUID, como en MySQL/Supabase): así una URL como
  // /talleres/a1000000-0000-4000-8000-000000000004 sigue sirviendo después de reiniciar el backend.
  // Los talleres que se creen con POST sí reciben un UUID aleatorio.
  const taller = (n, nombre, instructor, fecha, cupo) => ({
    id: `a1000000-0000-4000-8000-00000000000${n}`,
    nombre,
    instructor,
    fecha,
    cupo,
    created_at: creado,
  });

  const python = taller(1, 'Introducción a Python', 'Ing. María López', '2026-10-26', 25);
  const redes = taller(2, 'Fundamentos de Redes', 'Ing. Carlos Ramírez', '2026-10-28', 30);
  const bd = taller(3, 'Diseño de Bases de Datos', 'Ing. Ana Torres', '2026-11-04', 20);
  const git = taller(4, 'Git y GitHub en equipo', 'Ing. Jorge Méndez', '2026-11-06', 3); // 1 lugar libre
  const next = taller(5, 'Next.js desde cero', null, '2026-11-11', 2); // lleno y sin instructor
  db.talleres = [python, redes, bd, git, next];

  db.usuarios = [
    { nombre: 'Admin Semilla', correo: 'admin@cecyt9.ipn.mx', boleta: '0000000000', rol: 'admin' },
    { nombre: 'Ana López', correo: 'ana.lopez@alumno.ipn.mx', boleta: '2026090001', rol: 'alumno' },
    { nombre: 'Luis Pérez', correo: 'luis.perez@alumno.ipn.mx', boleta: '2026090002', rol: 'alumno' },
    { nombre: 'María Hernández', correo: 'maria.hernandez@alumno.ipn.mx', boleta: '2026090003', rol: 'alumno' },
  ].map((u, i) => ({ id: i + 1, ...u, contrasena_hash: '(sin contraseña: datos de ejemplo)' }));
  db.siguienteIdUsuario = db.usuarios.length + 1;

  const asistencia = (t, nombre_alumno, boleta) => ({
    id: randomUUID(),
    taller_id: t.id,
    nombre_alumno,
    boleta,
    fecha_registro: creado,
  });
  db.asistencias = [
    asistencia(python, 'Ana López', '2026090001'),
    asistencia(python, 'Alumno sin cuenta', '2026999999'),
    asistencia(git, 'Ana López', '2026090001'),
    asistencia(git, 'Luis Pérez', '2026090002'),
    asistencia(next, 'Luis Pérez', '2026090002'),
    asistencia(next, 'María Hernández', '2026090003'),
  ];
}

reiniciar();

module.exports = { db, reiniciar, ahora };
