const { crearApp } = require('./app');
const { crearPool } = require('./db');
const config = require('./config');

const PUERTO = Number(process.env.PORT || 4600);
const pool = crearPool();

// Antes de arrancar, comprueba que MySQL responde y que la base tiene usuarios.
pool
  .query('SELECT COUNT(*) AS total FROM usuarios')
  .then(([filas]) => {
    crearApp(config, pool).listen(PUERTO, () => {
      console.log(`Demo de sesiones en http://localhost:${PUERTO}`);
      console.log(`Usuarios en MySQL: ${filas[0].total} (ana / ana12345 · luis / luis12345 · admin / admin12345)`);
      console.log(`Las sesiones se guardan en: ${config.almacen === 'memoria' ? 'la MEMORIA del servidor' : 'MySQL (tabla sessions)'}`);
    });
  })
  .catch((error) => {
    console.error('No me pude conectar a MySQL:', error.message);
    console.error('Revisa que MySQL esté encendido, tu archivo .env y que cargaste la base (bd/demo_sesiones.sql o npm run bd).');
    process.exit(1);
  });
