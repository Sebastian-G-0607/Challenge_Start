//Middleware que recibe un schema de Zod y valida el body de la request 

export const validateSchema = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        return res
        .status(400)
        .json({error: error.issues.map(e => e.message)});
    }
};