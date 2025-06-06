import express from 'express';
import conexion from '../db.js';

const router = express.Router();

// Aquí solo usamos '/'
router.post('/', (req, res) => {
  const {
    medicamento,
    fecha,
    fechaProxima,
    expediente,
    tipo,
    lote,
    observaciones
  } = req.body;

  // Validación básica
  if (!medicamento || !expediente || !tipo) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  const sql = `
    INSERT INTO desparacitacion 
    (medicamento, fechaAplicacion, fechaProx, idExpediente, idTipoDes, lote, notas)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  conexion.query(sql, [
    medicamento,
    fecha || null,
    fechaProxima || null,
    expediente,
    tipo,
    lote || null,
    observaciones || null
  ], (err, results) => {
    if (err) {
      console.error('Error al insertar:', err);
      return res.status(500).json({ error: 'Error al guardar en la base de datos' });
    }

    res.status(201).json({ message: 'Registro guardado correctamente' });
  });
});

export default router;
