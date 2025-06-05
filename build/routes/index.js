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

router.get('/consulta', (req, res) => res.render('formConsulta'));

// Ruta para mostrar formulario veterinarios con nombre de clínica
router.get('/veterinarios/registro', async (req, res) => {
    let { idClinica } = req.query;
    let nombreClinica = 'por definir';

    // Si no se proporciona, asumimos 0
    if (!idClinica) {
        idClinica = 0;
    }

    try {
        if (idClinica != 0) {
            const [rows] = await conexion.promise().query(
                'SELECT nombre FROM clinica WHERE id = ?',
                [idClinica]
            );

            if (rows.length === 0) return res.status(404).send("Clínica no encontrada.");

            nombreClinica = rows[0].nombre;
        }

        res.render('formVet', { idClinica, nombreClinica });

    } catch (error) {
        console.error("Error al obtener la clínica:", error);
        res.status(500).send("Error interno del servidor");
    }
});

router.post('/consulta/guardar', async (req, res) => {
    const {
        peso,
        notas,
        enfermedad,
        diagnostico,
        estatus,
        tratamiento,
        fechaI,
        fechaF
    } = req.body;

    try {
        // 1. Insertar en consulta
        const [consultaResult] = await conexion.promise().query(
            'INSERT INTO consulta (peso, notas) VALUES (?, ?)',
            [peso, notas]
        );
        const idConsulta = consultaResult.insertId;

        // 2. Insertar en enfermedad
        const [enfermedadResult] = await conexion.promise().query(
            'INSERT INTO enfermedad (nombre, diagnostico, estatus, idConsulta) VALUES (?, ?, ?, ?)',
            [enfermedad, diagnostico, estatus, idConsulta]
        );
        const idEnfermedad = enfermedadResult.insertId;

        // 3. Insertar en tratamiento
        await conexion.promise().query(
            'INSERT INTO tratamiento (descripcion, fechaInicio, fechaFin, idEnfermedad) VALUES (?, ?, ?, ?)',
            [tratamiento, fechaI, fechaF, idEnfermedad]
        );

        res.status(200).json({ mensaje: 'Consulta registrada correctamente' });

    } catch (error) {
        console.error('Error al guardar la consulta:', error);
        res.status(500).json({ error: 'Error al guardar la consulta' });
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

// En tu archivo de rutas, por ejemplo index.js o veterinario.js

router.get('/veterinarios', async (req, res) => {
    console.log("✅ Entrando a la ruta /veterinarios/listado");

    try {
        // Usa .promise() para que la consulta sea una promesa válida
        const [veterinarios] = await conexion.promise().query(`
            SELECT persona.nombre, persona.apellidoPaterno, veterinario.cedula
            FROM veterinario
            INNER JOIN persona ON veterinario.idPersona = persona.id
        `);

        console.log("👨‍⚕️ Veterinarios encontrados:", veterinarios);
        // Pasa la variable correcta al render
        res.render('listadoVet', { veterinarios });
    } catch (err) {
        console.error("❌ Error al consultar veterinarios:", err);
        res.status(500).send("Error al mostrar listado");
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
