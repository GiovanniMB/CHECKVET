import { Router} from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { showLogin, login, logout, dashboard,showRegister, register } from '../controller/authController.js';


const router = Router();
router.get('/',(req,res)=>res.render('index'));

router.get('/register', showRegister);
router.post('/register', register);

router.get('/prueba', showLogin);
router.post('/login', login);
router.get('/dashboard', isAuthenticated, dashboard);
router.get('/logout', isAuthenticated, logout);




router.get('/login',(req,res)=>{
    res.render('login')
});


router.get('/crear/persona', isAuthenticated,(req,res)=>{
    res.render('crear_pers')
});

router.get('/catalogos',isAuthenticated,(req,res)=>{
    res.render('catalogos')

});

router.get('/cita',isAuthenticated,(req,res)=>{
    res.render('cita')
});

router.get('/crear/mascota',isAuthenticated,(req,res)=>{
    res.render('crear_masc')
});

router.get('/crear/clinica',isAuthenticated,(req,res)=>{
    res.render('crear_clinica')
});

router.post('/crear/cliente',isAuthenticated,(req,res)=>{
    const nombre = req.body.nombre;
    const apellidoP = req.body.apellido;
    const apellidoM = req.body.apellido2;
    const rol = req.body.rol;
    const telefono = req.body.telefono;
    const correo = req.body.correo;
    const curp = req.body.curp;
    const cedula = req.body.cedula;
    const clinica = req.body.clinica;
});

export default router;