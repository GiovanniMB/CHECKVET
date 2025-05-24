import { Router} from "express";
import { showLogin, login, logout, dashboard,showRegister, register } from '../controller/authController.js';


const router = Router();
router.get('/',(req,res)=>res.render('index'));

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