import express from 'express';
import conexion from '../db.js';

const router = express.Router();

router.post('/', (req, res) => {
  const {
    vacuna,
    laboratorio,
    lote,
    fecha,
    fechaProxima,
    expediente,
    observaciones
  } = req.body;

  if (!vacuna || !laboratorio || !expediente) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  const sql = `
    INSERT INTO vacuna 
    (nombreVac, laboratorio, lote, fechaAplicion, fechaProx, idExpediente, notas)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  conexion.query(sql, [
    vacuna,
    laboratorio,
    lote,
    fecha || null,
    fechaProxima || null,
    expediente,
    observaciones || null
  ], (err, results) => {
    if (err) {
      console.error('Error al insertar:', err);
      return res.status(500).json({ error: 'Error al guardar en la base de datos' });
    }

    res.status(201).json({ message: 'Vacuna registrada correctamente' });
  });
});

export default router;