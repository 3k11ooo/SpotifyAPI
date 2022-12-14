/* * * * * * * * * * *
 * # 1回実行          *
 * npm run dev        *
 *                    *
 * # 変更検知         *
 * npm run dev:watch  *
 * * * * * * * * * * */

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path'


// import function 
import { login, callback, refresh_token } from './authorization'

const port = 3000; // port

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */


const app: express.Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../public')))
   .use(cors())
   .use(cookieParser());

// app.get('/', );
// app.get('/hoge', preProcess1, preProcess2, mainProcess);

app.get('/login', login);

app.get('/callback', callback);

app.get('/refresh_token', refresh_token)


console.log(`This app listening at http://localhost:${port}`);
app.listen(port);