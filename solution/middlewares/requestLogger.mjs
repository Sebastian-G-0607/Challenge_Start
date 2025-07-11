import {info} from '../logs/logger.mjs'

//ESTE MIDDLEWARE IMPRIME INFORMACIÓN DE LA PETICIÓN EN LA CONSOLA
export const requestLogger = (request, response, next) => {
    info(`Method: ${request.method}`)
    info(`Path: ${request.path}`)
    info(`Body: ${JSON.stringify(request.body, null, 2)}`)
    console.log('---')
    next();
}