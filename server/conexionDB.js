// conexionDB.js
const mysql = require('mysql2/promise');

// Configura el pool de conexiones
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Pon tu contraseña si tienes
  database: 'proyecto_bicentenario',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
