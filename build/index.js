import express from "express";
import { dirname, join } from 'path';
import { fileURLToPath } from "url";
import indexRoutes from './routes/index.js'
import morgan from 'morgan';
import cors from 'cors';



const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url));

app.set('views', join(__dirname,'html/pages'));
app.set('view engine' , 'ejs');

app.use(morgan('dev'));
app.use(cors(
    {
        origin:['http://localhost:3000/']
    }
))

app.use(indexRoutes);

app.use(express.static(join(__dirname,'css')));
app.use(express.static(join(__dirname,'img')));

app.listen(3000);
console.log('Server is listening on port', 3000);