import { Router } from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import conexion from '../db.js';  // Ajusta la ruta si es necesario


const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rutas de renderizado simples
router.get('/', (req, res) => res.render('index'));
router.get('/formMascota', (req, res) => res.render('formMascota'));
router.get('/mascotas', (req, res) => res.render('mascotas'));
router.get('/mascota', (req, res) => res.render('mascota'));
router.get('/vacunas', (req, res) => res.render('vacunas'));
router.get('/desparasitaciones', (req, res) => res.render('desparasitacion'));
router.get('/clinicas/registro', (req, res) => res.render('formClinica'));

router.get('/veterinarios', (req, res) => res.render('listadoVet'));
router.get('/consulta', (req, res) => res.render('formConsulta'));

// Ruta para mostrar formulario veterinarios con nombre de clínica
router.get('/veterinarios/registro', async (req, res) => {
    const { idClinica } = req.query;

    if (!idClinica) return res.status(400).send("Falta el ID de la clínica.");

    try {
        const [rows] = await conexion.promise().query(
            'SELECT nombre FROM clinica WHERE id = ?', 
            [idClinica]
        );

        if (rows.length === 0) return res.status(404).send("Clínica no encontrada.");

        const nombreClinica = rows[0].nombre;

        res.render('formVet', { idClinica, nombreClinica });

    } catch (error) {
        console.error("Error al obtener la clínica:", error);
        res.status(500).send("Error interno del servidor");
    }
});

// Ruta para obtener listado de clínicas con datos completos
router.get("/clinicas", async (req, res) => {
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

        res.render("listadoClinicas", { clinicas: rows });

    } catch (error) {
        console.error("Error al obtener clínicas:", error);
        res.status(500).send("Error interno del servidor");
    }
});

// Ruta para guardar veterinarios
router.post('/veterinarios/guardar', async (req, res) => {
  const {
    cedula,
    nombre,
    apellidoP,
    ApellidoM,
    Telefono,
    Email,
    username,
    password,
    idClinica,
  } = req.body;

  if (!cedula || !nombre || !apellidoP || !ApellidoM || !Telefono || !Email || !username || !password || !idClinica) {
    return res.status(400).send('Faltan campos obligatorios');
  }

  try {
    // 1. Insertar en persona
    const [resultPersona] = await conexion.promise().query(
      'INSERT INTO persona (nombre, apellidoPaterno, apellidoMaterno, telefono) VALUES (?, ?, ?, ?)',
      [nombre, apellidoP, ApellidoM, Telefono]
    );

    const idPersona = resultPersona.insertId;

    // 2. Hashear contraseña
    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Insertar en usuario (asumiendo idperfil 2 para veterinario)
    const idPerfilVeterinario = 2;
    const [resultUsuario] = await conexion.promise().query(
      'INSERT INTO usuario (email, username, password, idperfil) VALUES (?, ?, ?, ?)',
      [Email, username, hashedPassword, idPerfilVeterinario]
    );

    const idUsuario = resultUsuario.insertId;

    // 4. Insertar en veterinario
    await conexion.promise().query(
      'INSERT INTO veterinario (cedula, idPersona, idClinica, idUsuario) VALUES (?, ?, ?, ?)',
      [cedula, idPersona, idClinica, idUsuario]
    );

    res.redirect('/veterinarios');

  } catch (error) {
    console.error("Error guardando veterinario:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// Configuración Multer para subida de imágenes
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../img'); 
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        if (!file) return cb(new Error("No se subió archivo"), false);
        const ext = file.originalname.split(".").pop();
        cb(null, Date.now() + "." + ext);
    }
});

const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
        return cb(null, true);
    }
    cb(new Error('Error: Solo se permiten imágenes (JPEG, JPG, PNG)'));
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

router.post('/subirImagen', upload.single('archivoImagen'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se subió ningún archivo válido' });
    }
    
    res.json({ 
        success: true,
        message: 'Imagen subida correctamente',
        filename: req.file.filename,
        path: `/img/${req.file.filename}`
    });
});

export default router;
