//instancia del framework express
import express from 'express';
import { validateSchema } from '../middlewares/validateData.mjs';

//Objeto para hacer rutas
export const router = express.Router();

//Importación de schemas
import { mockSchema } from '../schemas/mock.schema.mjs';

//SE IMPORTAN LAS FUNCIONES:
import {configureMock,
        getMockConfigurations,
        deleteMock,
        updateMock,
        getMockbyPath
} from '../controllers/controllers.mjs';

//rutas con sus correspondientes controladores
router.post('/configure-mock', validateSchema(mockSchema), configureMock);
router.get('/configure-mock', getMockConfigurations);
router.delete('/configure-mock/:id', deleteMock);
router.put('/configure-mock/:id', updateMock);
router.all('/{*splat}', getMockbyPath);
