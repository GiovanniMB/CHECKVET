import express from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import bcryptjs from 'bcryptjs';
import session from 'express-session';
import indexRoutes from './routes/index.js';
import dotenv from 'dotenv';
import conexion from '../database/db.js';
import flash from 'connect-flash';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


dotenv.config({path: './env/.env'});

app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.toast_msg = req.flash('toast_msg')[0] || null;  // También puedes ponerlo aquí para que esté global
  next();
});

app.set('views', join(__dirname, 'html/pages'));
app.set('view engine', 'ejs');
app.use(indexRoutes);

app.use(express.static(join(__dirname, 'css')));
app.use(express.static(join(__dirname, 'controller')));
app.use(express.static(join(__dirname, 'service')));

app.listen(4000, () => {
    console.log('Server is listening on port', 4000);
});