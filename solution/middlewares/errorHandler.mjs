//MIDDLEWARE QUE RECONOCE ERRORES Y ENVÍA RESPUESTAS PERSONALIZADAS

import {error} from '../logs/logger.mjs'

//ESTE MIDDLEWARE RECIBE ERRORES, SI NO SE RECONOCE EL TIPO DE ERROR,
//EL ERROR SE LE PASA AL ERROR HANDLER POR DEFECTO DE EXPRESS
export const errorHandler = (e, request, response, next) => { //error es el parámetro que indica que maneja errores
    error(e.message)
    //Se puede añadir más información, modificar el error o manejarlo de forma personalizada según el nombre o código del error
    if (e.name === 'SyntaxError') {
        return response.status(400).json({
            error: "Hay un error de sintaxis en la solicitud JSON",
        })
    }
    next(e)
}