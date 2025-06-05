import express from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import bcryptjs from 'bcryptjs';
import session from 'express-session';
import indexRoutes from './routes/index.js';
import vacunaRoutes from './routes/vacuna.js';
import desparasitacionRoutes from './routes/desparasitacion.js';
import clinicaRoutes from './routes/clinicas.js';




const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.set('views', join(__dirname, 'html/pages'));
app.set('view engine', 'ejs');
app.use(indexRoutes);
app.use('/vacuna', vacunaRoutes);

app.use(express.static(join(__dirname,'controller')));
app.use(express.static(join(__dirname,'service')));
app.use(express.static(join(__dirname,'img')));
app.use(express.static(join(__dirname,'css')));
app.use('/bootstrap', express.static(join(__dirname, '../node_modules/bootstrap')));
app.use('/popper', express.static(join(__dirname, '../node_modules/@popperjs/core')));


app.use(express.static(join(__dirname, 'public')));

app.use('/desparasitacion', desparasitacionRoutes);
app.use('/vacuna', vacunaRoutes);
app.use('/clinica', clinicaRoutes);


app.listen(4000);
console.log('Server is listening on port',4000);


