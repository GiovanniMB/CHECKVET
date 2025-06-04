import express from 'express';
import db from '../db/connection.js'; // importa tu conexión MySQL como módulo
const router = express.Router();

router.post('/registro-vacuna', async (req, res) => {
  try {
    const {
      expediente,
      vacuna,
      laboratorio,
      lote,
      fecha,
      fechaProxima,
      observaciones
    } = req.body;

    const query = `
      INSERT INTO vacuna (nombreVac, laboratorio, lote, fechaAplicion, fechaProx, notas, idExpediente)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await db.execute(query, [
      vacuna,
      laboratorio,
      lote,
      fecha,
      fechaProxima,
      observaciones,
      expediente
    ]);

    res.status(200).json({ message: 'Vacuna registrada correctamente' });
  } catch (error) {
    console.error('Error al registrar vacuna:', error);
    res.status(500).json({ error: 'Error del servidor al guardar la vacuna' });
  }
});

export default router;