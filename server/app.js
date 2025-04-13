const express = require('express');
const cors = require('cors');
require('dotenv').config();


// Servidor //
const app = express();
app.set("port", 4001); // Conexion para el puerto
app.listen(app.get("port")); // Escucha del puerto
console.log("servidor corriendo en puerto", app.get("port")); // prueba

// Configuracion de Modulos
app.use(cors());
app.use(express.json());

// Importar rutas

module.exports = app;
