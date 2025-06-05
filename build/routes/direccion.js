import express from 'express';
import db from '../db.js'; // o como se llame tu archivo de conexión

const router = express.Router();


router.get('/estados', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, nombre FROM estado');
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener estados:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;





/*import { Router } from 'express';
import db from '../db.js'; // Asegúrate de que este archivo exporte tu conexión

const router = Router();

// Obtener todos los estados
router.get('/estados', async (req, res) => {
  try {
    const [estados] = await db.query('SELECT id, nombre FROM estado');
    res.json(estados);
  } catch (err) {
    console.error("Error al obtener estados:", err);
    res.status(500).send('Error al obtener estados');
  }
});


// Obtener municipios de un estado
router.get('/municipios/:idEstado', async (req, res) => {
  const { idEstado } = req.params;
  try {
    const [municipios] = await db.query(
      'SELECT idMunicipio AS id, nombreMunicipio AS nombre FROM municipio WHERE idEstado = ?',
      [idEstado]
    );
    res.json(municipios);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener municipios');
  }
});

// Obtener colonias de un municipio
router.get('/colonias/:idMunicipio', async (req, res) => {
  const { idMunicipio } = req.params;
  try {
    const [colonias] = await db.query(
      'SELECT idColonia AS id, nombreColonia AS nombre FROM colonia WHERE idMunicipio = ?',
      [idMunicipio]
    );
    res.json(colonias);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener colonias');
  }
});

export default router;*/
