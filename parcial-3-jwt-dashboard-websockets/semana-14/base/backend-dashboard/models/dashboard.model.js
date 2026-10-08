// Carga el modelo del dashboard del motor elegido en DB_MOTOR (ver motor.js).
const motor = require('./motor');

module.exports = require(`./dashboard.model.${motor}`);
