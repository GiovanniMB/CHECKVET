import express from 'express';
import conexion from '../db.js';  // Ajusta la ruta según tu estructura

const router = express.Router();

// Funciones para obtener datos de la BD
async function obtenerEstadosDeBD() {
    const [rows] = await conexion.promise().query('SELECT * FROM estado');
    return rows;
}

async function obtenerMunicipiosDeBD(idEstado) {
    const [rows] = await conexion.promise().query('SELECT * FROM municipio WHERE idEstado = ?', [idEstado]);
    return rows;
}

async function obtenerColoniasDeBD(idMunicipio) {
    const [rows] = await conexion.promise().query('SELECT * FROM colonia WHERE idMunicipio = ?', [idMunicipio]);
    return rows;
}

// Rutas para obtener estados, municipios y colonias
router.get('/estados', async (req, res) => {
    try {
        const estados = await obtenerEstadosDeBD();
        res.json(estados);
    } catch (error) {
        console.error("Error al obtener estados:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.get('/municipios/:idEstado', async (req, res) => {
    const { idEstado } = req.params;
    try {
        const municipios = await obtenerMunicipiosDeBD(idEstado);
        res.json(municipios);
    } catch (error) {
        console.error("Error al obtener municipios:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.get('/colonias/:idMunicipio', async (req, res) => {
    const { idMunicipio } = req.params;
    try {
        const colonias = await obtenerColoniasDeBD(idMunicipio);
        res.json(colonias);
    } catch (error) {
        console.error("Error al obtener colonias:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Ruta POST para registrar clínica


export default router;
