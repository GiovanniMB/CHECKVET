import { Router } from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import {authenticateToken } from '../service/authService.js'
import conexion from '../db.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from 'cookie';


const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/', (req,res)=>res.render('index'));
router.get('/formMascota',(req,res)=>res.render('formMascota'));
router.get('/formEmpresa',(req,res)=>res.render('formEmpresa'));
router.get('/mascotas',(req,res)=>res.render('mascotas'));
router.get('/mascota/:id', async (req, res) => {
    try {
        const mascotaId = req.params.id;
        const idPerfil = req.user.idperfil; 
        res.render('mascota', { mascotaId ,idPerfil });
    } catch (error) {
        res.status(500).json({ error: "Error al cargar la vista de mascota." });
    }
});
router.get('/agenda',(req,res)=>res.render('agenda'));
router.get('/login',(req,res)=>res.render('login'));
router.get("/logout", (req, res) => {
    res.clearCookie("myTokenName", { path: "/" });
    res.json({ message: "Sesión cerrada exitosamente" });
});
router.get("/misMascotas",  (req, res) => {
    const curp = req.user.curp; 
    res.render("mascotasduenio", { curp });
});


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

router.post("/login/exitoso", async (req, res) => {
        try {
        const { email, password } = req.body;
        

        const [rows] = await conexion.promise().query(`
            SELECT
                u.password,
                u.idperfil,
                u.username, 
            FROM
                usuario AS u  

            WHERE
                u.email = ?
        `, [email]);

        if (rows.length === 0) {
            return res.status(401).json({ message: "Usuario no encontrado" });
        }

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        const token = jwt.sign(
            {
                username: user.username,
                idperfil: user.idperfil,
                curp: user.curp
            },
            "your_secret_key",
            { expiresIn: "30d" }
        );


        const serialized = serialize("myTokenName", token, {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 60 * 24 * 30,
            path: "/"
        });

        res.setHeader("Set-Cookie", serialized);
        res.json({ message: "Login exitoso" });
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
});

router.get('/citasHoy', async (req, res) => {
    try {
        const [rows] = await conexion.promise().query(`
            SELECT 
                m.nombre,
                m.foto,
                c.fecha,
                c.motivo
            FROM cita c
            JOIN Expediente e ON c.idExpediente = e.id
            JOIN Mascota m ON e.idMascota = m.id
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/formMascota/estados', async (req, res) => {
    try {
        const [rows] = await conexion.promise().query(`SELECT * FROM estado`);
        if (rows.length === 0) {
            return res.status(404).json({ message: "No se encontraron estados" });
        }
        res.json(rows);
    } catch (error) {
        console.error("Error en /formMascota/estados:", error);
        res.status(500).json({ error: error.message });
    }
});


router.get('/formMascota/especie', async (req, res) => {
    try {
        const [rows] = await conexion.promise().query(`SELECT * FROM especie`);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/formMascota/raza/:especieId', async (req, res) => {
    try {
        const [rows] = await conexion.promise().query(`
            SELECT * FROM raza WHERE idEspecie = ?
        `, [req.params.especieId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



router.get('/formMascota/municipios/:estadoId', async (req, res) => {
    try {
        const [rows] = await conexion.promise().query(`
            SELECT * FROM municipio WHERE idEstado = ?
        `, [req.params.estadoId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/formMascota/colonias/:municipioId', async (req, res) => {
    try {
        const [rows] = await conexion.promise().query(`
            SELECT * FROM colonia WHERE idMunicipio = ?
        `, [req.params.municipioId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/formMascota/cliente/:curp', async (req, res) => {
    try {
        const [rows] = await conexion.promise().query(`
            SELECT 1 FROM cliente WHERE curp = ? LIMIT 1
        `, [req.params.curp]);
        res.json({ existe: rows.length > 0 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/enfermedad/cronica/:idMascota", async (req, res) => {
    try {
        const [rows] = await conexion.promise().query(`
            SELECT e.nombre AS enfermedad
            FROM enfermedad e
            JOIN consulta cons ON e.idConsulta = cons.id
            JOIN cita c ON cons.idCita = c.id
            WHERE c.idExpediente = (
                SELECT id FROM expediente WHERE idMascota = ?
            ) AND e.estatus = 1;
        `, [req.params.idMascota]);

        if (!rows.length) {
            return res.status(404).json({ error: "No hay enfermedades activas registradas para esta mascota." });
        }

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



router.post("/formMAscota/registro", async (req, res) => {
    let connection;
    try {
        await conexion.promise().beginTransaction();

        const curp = req.body.curpRegistrado || req.body.Curp;

        if (req.body.curpRegistrado) {
            const [mascotaResult] = await conexion.promise().query(`
                INSERT INTO mascota (nombre, raza, fechaNacimineto, idDuenio, foto, peso, sexo)
                VALUES (?, ?, ?, ?, ?, ?, ?);
            `, [req.body.nombreMascota, req.body.raza, req.body.fecha, curp, req.body.nombreImagen, req.body.peso, req.body.Sexo]);

            const idMascota = mascotaResult.insertId;

            await conexion.promise().query(`
                INSERT INTO expediente (idMascota, descripcion, fecha_creacion)
                VALUES (?, ?, CURRENT_DATE());
            `, [idMascota, req.body.detalles]);

            await connection.commit();
            return res.json({ mensaje: "Mascota registrada exitosamente", idMascota });
        }

        const saltRounds = 8;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        const [personaResult] = await conexion.promise().query(`
            INSERT INTO persona (nombre, apellidoPaterno, apellidoMaterno, telefono)
            VALUES (?, ?, ?, ?);
        `, [req.body.nombre, req.body.apellidoP, req.body.ApellidoM, req.body.Telefono]);
        const idPersona = personaResult.insertId;

        const [direccionResult] = await conexion.promise().query(`
            INSERT INTO direccion (calle, numeroExterior, idColonia, numeroInterior, codigoPostal, referencias)
            VALUES (?, ?, ?, ?, ?, ?);
        `, [req.body.Calle, req.body.numero, req.body.Colonia, req.body.numeroInt, req.body.cp, req.body.referencias]);
        const idDireccion = direccionResult.insertId;

        const [usuarioResult] = await conexion.promise().query(`
            INSERT INTO usuario (email, username, password, idperfil)
            VALUES (?, ?, ?, ?);
        `, [req.body.Email, req.body.username, hashedPassword, 2]);
        const idUsuario = usuarioResult.insertId;

        const [clienteResult] = await conexion.promise().query(`
            INSERT INTO cliente (curp, idDireccion, idPersona, idEmpresa, idUsuario)
            VALUES (?, ?, ?, ?, ?);
        `, [curp, idDireccion, idPersona, 1, idUsuario]);
        const idDuenio = curp;

        const [mascotaResult] = await conexion.promise().query(`
            INSERT INTO mascota (nombre, raza, fechaNacimineto, idDuenio, foto, peso, sexo)
            VALUES (?, ?, ?, ?, ?, ?, ?);
        `, [req.body.nombreMascota, req.body.raza, req.body.fecha, idDuenio, req.body.nombreImagen, req.body.peso, req.body.Sexo]);

        const idMascota = mascotaResult.insertId;

        await conexion.promise().query(`
            INSERT INTO expediente (idMascota, descripcion, fecha_creacion)
            VALUES (?, ?, CURRENT_DATE());
        `, [idMascota, req.body.detalles]);

        await conexion.promise().commit();
        res.json({ mensaje: "Registro exitoso", nombreImagen: req.body.nombreImagen, idMascota });
    } catch (error) {
         await conexion.promise().rollback(); // Rollback en caso de error
        console.error("Error en el registro:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    } 
});


router.get("/mascotas/listado", async (req, res) => {
    try {
        const [rows] = await conexion.promise().query(`
            SELECT 
                m.id, m.nombre AS nombreMascota, 
                e.nombre AS especie, r.nombre AS raza, 
                YEAR(CURDATE()) - YEAR(m.fechaNacimineto) AS edad, 
                m.peso, m.sexo, p.nombre AS duenioNombre
            FROM mascota m
            JOIN raza r ON m.raza = r.id
            JOIN especie e ON r.idEspecie = e.id
            JOIN cliente c ON m.idDuenio = c.curp
            JOIN persona p ON c.idPersona = p.id
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get("/mascotas/detalle/:id", async (req, res) => {
    try {
        const [rows] = await conexion.promise().query(`
            SELECT 
                m.nombre AS nombreMascota, 
                m.foto, 
                e.nombre AS especie, 
                r.nombre AS raza, 
                YEAR(CURDATE()) - YEAR(m.fechaNacimineto) AS edad, 
                m.peso, 
                m.sexo, 
                p.nombre AS duenioNombre, 
                p.telefono
            FROM mascota m
            JOIN raza r ON m.raza = r.id
            JOIN especie e ON r.idEspecie = e.id
            JOIN cliente c ON m.idDuenio = c.curp
            JOIN persona p ON c.idPersona = p.id
            WHERE m.id = ?;
        `, [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Mascota no encontrada" });
        }

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/mascotas/ultimaCons/:idMascota", async (req, res) => {
    try {
        const [rows] = await conexion.promise().query(`
            SELECT 
                c.fecha AS ultimaConsulta
            FROM cita c
            LEFT JOIN consulta cons ON c.id = cons.idCita
            LEFT JOIN expediente exp ON c.idExpediente = exp.id
            WHERE exp.idMascota = ?
            ORDER BY c.fecha DESC
            LIMIT 1;
        `, [req.params.idMascota]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Historial no encontrado" });
        }

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get("/mascotas/vacuna/:idMascota", async (req, res) => {
    try {
        const [rows] = await conexion.promise().query(`
            SELECT nombreVac AS nombre, fechaAplicion AS fecha, fechaProx AS proxima_dosis, laboratorio AS lab
            FROM vacuna
            WHERE idExpediente = (
                SELECT id FROM expediente WHERE idMascota = ?
            )
            ORDER BY fechaAplicion DESC
            LIMIT 1;
        `, [req.params.idMascota]);

        if (!rows.length) {
            return res.status(404).json({ error: "No hay vacunas registradas para esta mascota." });
        }

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get("/mascotas/desparasitacion/:idMascota", async (req, res) => {
    try {
        const [rows] = await conexion.promise().query(`
            SELECT medicamento, fechaAplicacion AS fecha, fechaProx AS proxima_dosis, s.nombre as tipo
            FROM desparacitacion
            JOIN tipodes s ON idTipoDes = s.id
            WHERE idExpediente = (
                SELECT id FROM expediente WHERE idMascota = ?
            )
            ORDER BY fechaAplicacion DESC
            LIMIT 1;
        `, [req.params.idMascota]);

        if (!rows.length) {
            return res.status(404).json({ error: "No hay registros de desparasitación para esta mascota." });
        }

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/mascotas/vacunas/:idMascota", async (req, res) => {
    try {
        const [rows] = await conexion.promise().query(`
            SELECT nombreVac, fechaAplicion AS fecha, fechaProx AS proxima_dosis, lote, laboratorio, notas
            FROM vacuna
            WHERE idExpediente = (
                SELECT id FROM expediente WHERE idMascota = ?
            )
            ORDER BY fechaAplicion DESC;
        `, [req.params.idMascota]);

        if (!rows.length) {
            return res.status(404).json({ error: "No hay vacunas registradas para esta mascota." });
        }

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get("/mascotas/desparasitaciones/:idMascota", async (req, res) => {
    try {
        const [rows] = await conexion.promise().query(`
            SELECT medicamento, fechaAplicacion AS fecha, fechaProx AS proxima_dosis, s.nombre as tipo, lote, notas
            FROM desparacitacion
            JOIN tipodes s ON idTipoDes = s.id
            WHERE idExpediente = (
                SELECT id FROM expediente WHERE idMascota = ?
            )
            ORDER BY fechaAplicacion DESC;
        `, [req.params.idMascota]);

        if (!rows.length) {
            return res.status(404).json({ error: "No hay registros de desparasitación para esta mascota." });
        }

        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post("/misMascotas", async (req, res) => {
    const idDueño = req.body.curp;

    try {
        const [mascotas] = await conexion.promise().query(`
            SELECT 
                m.id, m.nombre AS nombreMascota, 
                e.nombre AS especie, r.nombre AS raza, 
                YEAR(CURDATE()) - YEAR(m.fechaNacimineto) AS edad, 
                m.peso, m.sexo
            FROM mascota m
            JOIN raza r ON m.raza = r.id
            JOIN especie e ON r.idEspecie = e.id
            JOIN cliente c ON m.idDuenio = c.curp
            WHERE c.curp = ?;
        `, [idDueño]);

        res.json({ mascotas });
    } catch (error) {
        res.status(500).json({ error: "Error al cargar las mascotas" });
    }
});


router.get("/agenda", async (req, res) => {
    try {
        const [citas] = await conexion.promise().query(`
            SELECT c.id, c.motivo, c.fecha, s.situation AS situacion, m.nombre AS mascotaNombre
            FROM cita c
            JOIN expediente e ON c.idExpediente = e.id
            JOIN mascota m ON e.idMascota = m.id
            JOIN situation s ON c.situation = s.id
            WHERE c.idVeterinario = ?;
        `, [idVeterinario]);

        res.json({ citas });
    } catch (error) {
        res.status(500).json({ error: "Error al cargar las citas" });
    }
});

router.post("/empresa/registro", async (req, res) => {
    try {
        await conexion.promise().beginTransaction(); // Iniciar transacción

        const { razonSocial, username, password } = req.body;

        // 🔹 Hashear la contraseña
        const saltRounds = 8;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 🔹 Insertar el usuario en la base de datos
        const [usuarioResult] = await conexion.promise().query(`
            INSERT INTO usuario (username, password, idperfil)
            VALUES (?, ?, ?);
        `, [username, hashedPassword, 4]); 

        const idUsuario = usuarioResult.insertId;

        // 🔹 Insertar la empresa vinculada al usuario creado
        const [empresaResult] = await conexion.promise().query(`
            INSERT INTO empresa (razonSocial, idUsuario)
            VALUES (?, ?);
        `, [razonSocial, idUsuario]);

        const idEmpresa = empresaResult.insertId;

        await conexion.promise().commit();
        res.json({ mensaje: "Empresa registrada exitosamente", idEmpresa, idUsuario });
    } catch (error) {
        await conexion.promise().rollback();
        console.error("Error en el registro de empresa:", error);
        res.status(500).json({ error: "Error interno del servidor." });
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
