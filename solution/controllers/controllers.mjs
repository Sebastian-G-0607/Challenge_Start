import { mockConfigurations } from '../db/db.mjs';

// Función para guardar un mock
export async function configureMock(req, res) {
    try {
        // obtiene la configuración del mock desde el cuerpo de la solicitud
        const config = req.body;
        config.id = Date.now(); // ID único basado en la hora actual

        //Añade la configuración del mock a la lista de configuraciones
        mockConfigurations.push(config);
        res.status(201).json({ message: 'Mock configurado', id: config.id });
        console.log(mockConfigurations);
    } catch (error) {
        // Manejo de errores
        res.status(500).send({ error: 'Ocurrió un error al configurar el mock' });
    }
}

// Función para eliminar un mock por ID
export async function deleteMock(req, res) {
    try {
        const { id } = req.params;

        // Busca el índice del mock con el ID proporcionado
        const index = mockConfigurations.findIndex(cfg => cfg.id === parseInt(id));

        if (index !== -1) {
            // Elimina el mock si se encuentra
            mockConfigurations.splice(index, 1);
            res.status(200).json({ message: 'Mock eliminado' });
        } else {
            res.status(404).json({ error: 'Mock no encontrado' });
        }
    } catch (error) {
        res.status(500).send({ error: 'Ocurrió un error al eliminar el mock' });
    }
}

//Función para actualizar las propiedades de un mock
export async function updateMock(req, res) {
    try {
        const { id } = req.params;
        const newConfig = req.body;

        // Busca el índice del mock con el ID proporcionado
        const index = mockConfigurations.findIndex(cfg => cfg.id === parseInt(id));

        if (index !== -1) {
            // Verifica si las propiedades del nuevo mock son válidas
            const currentMock = mockConfigurations[index];
            const allowedKeys = Object.keys(currentMock);
            const invalidKeys = Object.keys(newConfig).filter(
                key => !allowedKeys.includes(key)
            );

            if (invalidKeys.length > 0) {
                return res.status(400).json({
                    error: `Propiedades no válidas para actualizar: ${invalidKeys.join(', ')}`
                });
            }

            // Actualiza las propiedades del mock si se encuentra
            mockConfigurations[index] = { ...currentMock, ...newConfig };
            res.status(200).json({ message: 'Mock actualizado' });
        } else {
            res.status(404).json({ error: 'Mock no encontrado' });
        }
    } catch (error) {
        res.status(500).send({ error: 'Ocurrió un error al actualizar el mock' });
    }
}

// Función para obtener todas las configuraciones de mocks
export async function getMockConfigurations(req, res) {
    try {
        res.status(200).json(mockConfigurations);
    } catch (error) {
        res.status(500).send({ error: 'Ocurrió un error al obtener las configuraciones de mocks' });
    }
}

// Función para obtener un mock específico por ID
export async function getMockbyPath(req, res) {
    try {
        const { path, method, query, body, headers } = req;
        const newQuery = { ...query }

        // Buscar coincidencia exacta en las configuraciones
        const matchedMock = mockConfigurations.find(cfg => {
            return (
                cfg.path === path &&
                cfg.method.toUpperCase() === method &&
                matchParams(cfg.queryParams, newQuery) &&
                matchParams(cfg.bodyParams, body) &&
                matchParams(cfg.headers, headers)
            );
        });

        //si hay coincidencia, devuelve la respuesta del mock
        if (matchedMock) {
            const response = matchedMock.response;
            const renderedResponse = renderTemplate(response, {
                ...req.query,
                ...req.body,
                ...req.headers
            });
            if (matchedMock.contentType === 'text/html') {
                return res
                .status(matchedMock.status || 200)
                .type(matchedMock.contentType || 'text/html') // Establece el tipo de contenido
                .send(renderedResponse); // Enviar como texto HTML
            }
            res
                .status(matchedMock.status || 200)
                .type(matchedMock.contentType || 'application/json') // Establece el tipo de contenido
                .json(renderedResponse);
        } else {
            res.status(404).json({ error: 'Mock no configurado para esta solicitud' });
        }

    } catch (error) {
        res.status(500).send({ error: 'Error al procesar la solicitud de mock' });
    }
}

//FUNCIONES AUXILIARES

// Función auxiliar para comparar parámetros
function matchParams(expected = {}, actual = {}) {
    for (const key in expected) {
        //Si dentro del objeto hay otro objeto, se compara recursivamente
        if (
            typeof expected[key] === 'object' &&
            expected[key] !== null &&
            typeof actual[key] === 'object' &&
            actual[key] !== null
        ) {
            if (!matchParams(expected[key], actual[key])) return false;
        } else {
            if (String(expected[key]) != String(actual[key])) return false;
        }
    }
    return true;
}

//Función auxiliar para renderizar respuestas personalizadas según plantillas
function renderTemplate(template, data) {
    let rendered = JSON.stringify(template);
    // Reemplaza todas las variables {{key}} por su valor o por cadena vacía si no existe
    rendered = rendered.replace(/{{(.*?)}}/g, (_, key) => {
        return data[key] !== undefined ? data[key] : '';
    });
    return JSON.parse(rendered);
}
