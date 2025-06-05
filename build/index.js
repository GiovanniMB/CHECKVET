import express from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import indexRoutes from './routes/index.js';
import cookieParser from "cookie-parser";


const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set('views', join(__dirname, 'html/pages'));
app.set('view engine', 'ejs');
app.use(indexRoutes);


app.use(express.static(join(__dirname,'controller')));
app.use(express.static(join(__dirname,'service')));
app.use(express.static(join(__dirname,'img')));
app.use(express.static(join(__dirname,'css')));
app.use('/bootstrap', express.static(join(__dirname, '../node_modules/bootstrap')));
app.use('/popper', express.static(join(__dirname, '../node_modules/@popperjs/core')));

app.listen(4000);
console.log('Server is listening on port',4000);

