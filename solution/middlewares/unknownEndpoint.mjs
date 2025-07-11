//ESTE MIDDLEWARE SE COLOCA DE ÚLTIMO PARA QUE SE EJECUTE SI NO SE ENCONTRÓ LA RUTA ESPECIFICADA
export const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}