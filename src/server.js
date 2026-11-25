require('dotenv').config();
const app = require('./app');
const pool = require('./config/db');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en modo ${process.env.NODE_ENV || 'development'}`);
    console.log(`API REST escuchando en http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
    await pool.end();
    server.close(() => {
        process.exit(0);
    });
});