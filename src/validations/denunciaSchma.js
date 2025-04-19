import { z } from "zod";

const personaSchema = z.object({ // Creamos un esquema sobre persona, que es un objeto que tiene los atributos del formulario, te faltaría completar eso:
    nombre: z.string().min(1, { message: "El nombre es requerido" }),
    dni: z.string().min(7, { message: "El DNI es requerido" }) 
});

// Este sería el esquema principal digamos, donde están las tres Personas, faltaría que le agregues dos más, uno para el motivo y otro para el objeto. Decime si te animas a hacerlo o sino lo hago yo
export const denunciaSchema = z.object({ // Este es el que se exporta
    Denunciante: personaSchema,
    Denunciado: personaSchema,
    Técnico: personaSchema,
});