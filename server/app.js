// Modulos importados //
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Servidor
const app = express();
app.set("port", 4001); // Conexion para el puerto

// Configuración de middleware
app.use(cors());
app.use(express.json());

// Importando rutas
const personasRoutes = require('./routers/personas');
app.use('/api/personas', personasRoutes);

module.exports = app;
