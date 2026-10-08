const mysql = require('mysql2/promise');

const pool = mysql.createPool({

});

module.exports = pool;
