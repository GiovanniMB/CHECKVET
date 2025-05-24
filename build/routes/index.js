import { Router} from "express";

const router = Router();
router.get('/',(req,res)=>res.render('index'));

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