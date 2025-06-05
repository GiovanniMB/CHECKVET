import express from 'express';
import conexion from '../db.js';

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const [rows] = await conexion.promise().query(`
            SELECT 
                c.id, c.nombre AS nombreClinica,
                col.nombre AS colonia, 
                mun.nombre AS municipio,
                est.nombre AS estado
            FROM clinica c
            JOIN direccion d ON c.idDireccion = d.id
            JOIN colonia col ON d.idColonia = col.id
            JOIN municipio mun ON col.idMunicipio = mun.id
            JOIN estado est ON mun.idEstado = est.id
        `);

        res.render("listadoClinicas", { clinicas: rows }); // 👈 Asegúrate de pasar esta variable
    } catch (error) {
        console.error("Error al obtener clínicas:", error);
        res.status(500).send("Error del servidor");
    }
});

export default router;


