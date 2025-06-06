// controllers/clinicaController.js
import conexion from '../db.js';

export const registrarClinica = async (req, res) => {
    const {
        nombre,
        idEmpresa,
        Colonia,
        Calle,
        numero,
        numeroInt,
        cp,
        referencias
    } = req.body;

    try {
        // Insertar en tabla direccion
        const [direccionResult] = await conexion.promise().query(`
            INSERT INTO direccion (calle, numeroExterior, numeroInterior, codigoPostal, referencias, idColonia)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [Calle, numero, numeroInt || null, cp, referencias || null, Colonia]);

        const idDireccion = direccionResult.insertId;

        // Insertar en tabla clinica
        await conexion.promise().query(`
            INSERT INTO clinica (nombre, idEmpresa, idDireccion)
            VALUES (?, ?, ?)
        `, [nombre, idEmpresa, idDireccion]);

        res.status(200).json({ message: 'Clínica registrada con éxito' });

    } catch (error) {
        console.error('❌ Error al registrar clínica:', error);
        res.status(500).json({ error: 'Error al guardar los datos' });
    }
};

