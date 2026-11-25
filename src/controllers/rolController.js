const pool = require('../config/db');

const obtenerRoles = async (req, res) => {
    try {
        const [roles] = await pool.query('SELECT * FROM roles');
        res.json(roles);
    } catch (error) {
        console.error('Error al obtener roles:', error);
        res.status(500).json({ error: 'Error al consultar los roles' });
    }
};

const crearRol = async (req, res) => {
    try {
        const nombreLimpio = String(req.body.nombre_rol || '').trim();
        if (!nombreLimpio) {
            return res.status(400).json({ success: false, message: 'El nombre del rol es obligatorio' });
        }

        await pool.query('INSERT INTO roles (nombre_rol) VALUES (?)', [nombreLimpio]);
        res.json({ success: true, message: 'Rol creado con éxito' });
    } catch (error) {
        console.error('Error al crear rol:', error);
        res.status(500).json({ success: false, message: 'Error al crear el rol' });
    }
};

module.exports = { obtenerRoles, crearRol };