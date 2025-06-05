import express from 'express';
import conexion from '../db.js';
import { registrarClinica } from '../controller/clinicaController.js';

const router = express.Router();


router.post('/registrar', registrarClinica);

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

// Obtener estados
router.get("/estados", async (req, res) => {
    const [rows] = await conexion.promise().query("SELECT id, nombre FROM estado");
    res.json(rows);
});

// Obtener municipios por estado
router.get("/municipios/:idEstado", async (req, res) => {
    const { idEstado } = req.params;
    const [rows] = await conexion.promise().query(
        "SELECT id, nombre FROM municipio WHERE idEstado = ?",
        [idEstado]
    );
    res.json(rows);
});

// Obtener colonias por municipio
router.get("/colonias/:idMunicipio", async (req, res) => {
    const { idMunicipio } = req.params;
    const [rows] = await conexion.promise().query(
        "SELECT id, nombre FROM colonia WHERE idMunicipio = ?",
        [idMunicipio]
    );
    res.json(rows);
});


export default router;


