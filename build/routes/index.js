import { Router} from "express";
import { isAuthenticated } from "../middleware/auth.js";
import { showLogin, login, logout, dashboard,showRegister, register } from '../controller/authController.js';
import conexion from "../../database/db.js";
import bcryptjs from 'bcryptjs';



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
    res.render('crear_pers', {
    toast_msg: req.flash('toast_msg')[0] || null
  });
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

router.post('/crear/usuario', isAuthenticated, async (req, res) => {
  const { nombre, apellido, apellido2, rol, telefono, email, curp, cedula, clinica, pass } = req.body;
  const password = await bcryptjs.hash(pass, 8);

  if (rol === 'cliente') {
    conexion.query(
      'INSERT INTO persona SET ?',
      {
        Nombre: nombre,
        ApellidoPaterno: apellido,
        ApellidoMaterno: apellido2,
        Telefono: telefono,
        Correo: email,
        Contrasena: password,
        Curp: curp,
        perfil_id: 2
      },
      (error, results) => {
        if (error) {
          console.log(error);
          req.flash('toast_msg', 'Error al registrar al cliente.');
        } else {
          req.flash('toast_msg', 'Cliente registrado correctamente.');
        }
        return res.redirect('/crear/persona'); // <- redirige siempre al final
      }
    );
  } else if (rol === 'veterinario') {
    conexion.query(
      'INSERT INTO persona SET ?',
      {
        Nombre: nombre,
        ApellidoPaterno: apellido,
        ApellidoMaterno: apellido2,
        Telefono: telefono,
        Correo: email,
        Contrasena: password,
        cedula: cedula,
        IdConsultorio: clinica,
        perfil_id: 1
      },
      (error, results) => {
        if (error) {
          console.log(error);
          req.flash('toast_msg', 'Error al registrar al veterinario.');
        } else {
          req.flash('toast_msg', 'Veterinario registrado correctamente.');
        }
        return res.redirect('/crear/persona'); // <- redirige siempre al final
      }
    );
  } else {
    req.flash('toast_msg', 'Rol inválido.');
    return res.redirect('/crear/persona');
  }
});

export default router;