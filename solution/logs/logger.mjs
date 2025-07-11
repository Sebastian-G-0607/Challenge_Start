//Logger:

//PARA IMPRIMIR MENSAJES DE INFORMACIÓN
export const info = (information) => {
    console.log(`Information -> ${information}`);
}

//PARA IMPRIMIR MENSAJES DE ERROR
export const error = (error_m) => {
    if (error_m instanceof Error) {
        console.log(`Error: ${error_m.message}`);  // Solo muestra el mensaje para objetos Error
    } else {
        console.log(`Error: ${error_m}`);  // Muestra el string directamente
    }
}