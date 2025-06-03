import { Router} from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';


const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get('/',(req,res)=>res.render('index'));
router.get('/formMascota',(req,res)=>res.render('formMascota'));
router.get('/mascotas',(req,res)=>res.render('mascotas'));
router.get('/mascota',(req,res)=>res.render('mascota'));
router.get('/vacunas',(req,res)=>res.render('vacunas'));
router.get('/desparasitaciones',(req,res)=>res.render('desparasitacion'));
router.get('/registro/clinica',(req,res)=>res.render('formClinica'));
router.get('/registro/veterinario',(req,res)=>res.render('formVet'));





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