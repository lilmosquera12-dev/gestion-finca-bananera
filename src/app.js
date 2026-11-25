require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde src/public
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// Importar controladores
const { obtenerRoles, crearRol } = require('./controllers/rolController');
const { registrarTrabajador, loginTrabajador } = require('./controllers/trabajadorController');

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
});

// Endpoints que consume el frontend
app.get('/roles', obtenerRoles);
app.post('/nuevo-rol', crearRol);
app.post('/nuevo-trabajador', registrarTrabajador);
app.post('/login', loginTrabajador);

// Manejo básico de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;