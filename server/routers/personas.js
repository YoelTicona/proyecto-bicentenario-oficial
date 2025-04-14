// Mostrando
const express = require('express');
const router = express.Router();
const pool = require('../conexionDB');

// Ruta para obtener los datos de la base de datos
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM `usuario`');
    res.json(rows); // Enviamos los resultados al frontend
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los datos' });
  }
});

module.exports = router;
