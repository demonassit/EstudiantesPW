// Carga el modelo de usuarios del motor elegido en DB_MOTOR (ver motor.js). Los dos exponen las mismas
// funciones, así que el controlador y las rutas no cambian.
const motor = require('./motor');

module.exports = require(`./usuarios.model.${motor}`);
