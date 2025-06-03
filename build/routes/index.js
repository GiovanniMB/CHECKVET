import { Router} from "express";
<<<<<<< HEAD
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
=======
import { showLogin, login, logout, dashboard,showRegister, register } from '../controller/authController.js';
>>>>>>> 02e0c838faaf3af9afc5f2687e4f7cb908acbdac


const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/',(req,res)=>res.render('index'));
router.get('/formMascota',(req,res)=>res.render('formMascota'));
router.get('/mascotas',(req,res)=>res.render('mascotas'));
router.get('/mascota',(req,res)=>res.render('mascota'));





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

router.get('/register', showRegister);
router.post('/register', register);

router.get('/prueba', showLogin);
router.post('/login', login);
router.get('/dashboard', dashboard);
router.get('/logout', logout);




router.get('/login',(req,res)=>{
    res.render('login')
});

router.get('/crear/persona',(req,res)=>{
    res.render('crear_pers')
});

router.get('/catalogos',(req,res)=>{
    res.render('catalogos')

});

router.get('/cita',(req,res)=>{
    res.render('cita')
});

router.get('/crear/mascota',(req,res)=>{
    res.render('crear_masc')
});

router.get('/crear/clinica',(req,res)=>{
    res.render('crear_clinica')
});

export default router;