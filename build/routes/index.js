import { Router} from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import {authenticateToken } from '../service/authService.js'


const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/', authenticateToken,(req,res)=>res.render('index'));
router.get('/formMascota',authenticateToken,(req,res)=>res.render('formMascota'));
router.get('/mascotas',authenticateToken,(req,res)=>res.render('mascotas'));
router.get('/mascota/:id',authenticateToken, async (req, res) => {
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
router.get("/misMascotas", authenticateToken, (req, res) => {
    const curp = req.user.curp; 
    res.render("mascotasduenio", { curp });
});









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
    limits: {
        fileSize: 2 * 1024 * 1024 
    }
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