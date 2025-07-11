//ESTE ARCHIVO CONTIENE LA DEFINICIÓN DE LA APP EXPRESS.

//SE IMPORTA EL FRAMEWORK EXPRESS PARA CREAR LA APP
import express from 'express';

//SE REALIZA UNA INSTANCIA DE EXPRESS
export const app = express();

//Middleware que comprueba si la request es json, luego convierte el body de la req a json
app.use(express.json({ limit: "5mb" })); // Permite archivos de hasta 5MB

import {requestLogger} from '../middlewares/requestLogger.mjs';
//Middleware que imprime info de la request
app.use(requestLogger);

//Importación de endpoints
import {router} from '../routes/routes.mjs';

app.use(router);

import {unknownEndpoint} from '../middlewares/unknownEndpoint.mjs';
//Luego de todas las rutas, se coloca el middleware de rutas desconocidas:
app.use(unknownEndpoint);

import {errorHandler} from '../middlewares/errorHandler.mjs';
//Por último, se coloca el middleware de errores:
app.use(errorHandler);