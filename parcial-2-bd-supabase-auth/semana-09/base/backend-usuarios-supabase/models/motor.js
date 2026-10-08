// Motor de base de datos que usa el backend, según DB_MOTOR en el .env:
//   mysql    -> BD local del laboratorio (valor por defecto)
//   supabase -> BD publicada en el servidor (Supabase/PostgreSQL)
// [PUBLICACION-POSTGRES] Al publicar no se cambia código: en las variables de entorno del hosting se pone
// DB_MOTOR=supabase junto con SUPABASE_URL y SUPABASE_KEY.
const MOTORES = ['mysql', 'supabase'];

const motor = process.env.DB_MOTOR || 'mysql';
if (!MOTORES.includes(motor)) {
  throw new Error(`DB_MOTOR="${motor}" no es válido. Usa: ${MOTORES.join(' o ')}`);
}

module.exports = motor;
