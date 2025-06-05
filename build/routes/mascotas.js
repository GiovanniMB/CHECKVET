import express from 'express';
const router = express.Router();

router.get('/listado', (req, res) => {
  // devolver listado de mascotas en JSON
  res.json([
    { id: 1, nombre: 'Firulais' },
    { id: 2, nombre: 'Michi' },
    // etc.
  ]);
});

export default router;