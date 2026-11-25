const pool = require('../config/db');

const registrarTrabajador = async (req, res) => {
    try {
        const documento = String(req.body.documento || '').trim();
        const nombre = String(req.body.nombre || '').trim();
        const apellido = String(req.body.apellido || '').trim();
        const telefono = String(req.body.telefono || '').trim();
        const fecha = req.body.fecha;
        const fk_rol = req.body.fk_rol;

        if (!documento || !nombre || !apellido || !telefono || !fecha || !fk_rol) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son obligatorios, incluido el rol'
            });
        }

        const nombreCompleto = `${documento} - ${nombre} ${apellido}`.trim();

        await pool.query(
            'INSERT INTO trabajadores (nombre, id_rol) VALUES (?, ?)',
            [nombreCompleto, fk_rol]
        );

        res.json({ success: true, message: 'Trabajador registrado con éxito' });
    } catch (error) {
        console.error('--- ERROR DE MYSQL ---');
        console.error('Código:', error.code);
        console.error('Mensaje:', error.sqlMessage);
        console.error('SQL:', error.sql);

        res.status(500).json({
            success: false,
            message: error.sqlMessage || 'Error al registrar'
        });
    }
};

const loginTrabajador = async (req, res) => {
    try {
        const documento = String(req.body.documento || '').trim();

        if (!documento) {
            return res.status(400).json({
                success: false,
                message: 'Ingresa un número de documento'
            });
        }

        const query = `
            SELECT t.nombre AS nombre, r.nombre_rol
            FROM trabajadores t
            JOIN roles r ON t.id_rol = r.id_rol
            WHERE t.nombre LIKE ?
        `;
        const [rows] = await pool.query(query, [`${documento}%`]);

        if (rows.length > 0) {
            res.json({
                success: true,
                nombre: rows[0].nombre,
                rol: rows[0].nombre_rol
            });
        } else {
            res.json({ success: false, message: 'Documento no encontrado' });
        }
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
};

module.exports = { registrarTrabajador, loginTrabajador };