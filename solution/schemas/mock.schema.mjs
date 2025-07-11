//Validaciones para la configuración de mocks
import { z } from 'zod'

//Campos necesarios para la configuración de un mock
export const mockSchema = z.object({
    path: z.string({
        required_error: 'La ruta del mock es requerida',
        invalid_type_error: 'La ruta debe ser un texto',
    })
    .min(1, { message: "La ruta no puede estar vacía" })
    .regex(/^\/[a-zA-Z0-9\-_\/]+$/, { 
        message: 'La ruta debe empezar con / y contener solo letras, números, guiones o barras' 
    }), 

    method: z.string({
        required_error: 'El método HTTP del mock es requerido',
        invalid_type_error: 'El método debe ser un texto',
    }).min(1, { message: "El método no puede estar vacío" })
    .toUpperCase()
    .refine((val) => ["GET", "POST", "PUT", "DELETE", "PATCH"].includes(val), {
        message: "Método no válido. Use GET, POST, PUT, DELETE o PATCH",
    }),

    queryParams: z.record(z.any()).optional(),
    
    bodyParams: z.record(z.any()).optional(),
    
    headers: z.record(z.any()).optional(),
    
    status: z.number({
        required_error: 'El código de estado HTTP del mock es requerido'
    }).int().min(100).max(599),
    
    response: z.union([
        z.string({
            required_error: 'La respuesta del mock es requerida'
        }),
        z.record(z.any(), {
            required_error: 'La respuesta del mock es requerida'
        })
    ]),

    contentType: z.string({
        required_error: 'El tipo de contenido de la respuesta del mock es requerido'
    }).refine(
        (val) => val === 'application/json' || val === 'text/html',
        { message: 'El tipo de contenido debe ser \'application/json\' o \'text/html\'' }
    ).default('application/json'),
}).strict();