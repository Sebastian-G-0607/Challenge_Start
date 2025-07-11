//Archivo principal del backend o api
import {app} from './app/app.mjs'

//Puerto en el que se levantará el servidor definido en las varibles de entorno
import {PORT} from './utils/utils.mjs'

app.listen(PORT, () => console.log(`Servidor ejecutándose en el puerto ${PORT}`));