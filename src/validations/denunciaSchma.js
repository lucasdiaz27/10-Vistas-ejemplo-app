import { z } from "zod";

const personaSchema = z.object({ // Creamos un esquema sobre persona, que es un objeto que tiene los atributos del formulario, te faltaría completar eso:
    nombre: z.string()
            .min(1, { message: "El nombre es requerido" }),

    dni: z.string()
            .min(7, { message: "El DNI/CUIT debe tener al menos 7 dígitos" })
            .max(11,{ message:"El DNI/CUIT no debe superar los 11 dígitos"})
            .refine(value => /^\d+$/.test(value), {
                message: "El DNI/CUIT solo puede contener números positivos sin símbolos",
            }),

    domicilio: z.string()
            .min(1, { message: "El domicilio es requerido" }),

    localidad: z.string()
            .min(1, { message: "La localidad es requerida" }),

    cp: z.string()
            .min(4, { message: "El codigo postal debe tener al menos 4 dígitos" })
            .max(10,{ message:"El codigo postal no debe superar los 10 dígitos"}),

    telefono: z.string()
            .min(6, { message: "El telefono debe tener al menos 6 dígitos" })
            .max(15,{ message:"El telefono no debe superar los 15 dígitos"}),

    email: z.string()
            .email( { message: "Debe ingresar un email valido" }),

    fax: z.string().optional() //esto no se si quieren que lo deje como algo opcional o que por eso lo deojo asi pero parece irrelevante
    
});

// Este sería el esquema principal digamos, donde están las tres Personas, faltaría que le agregues dos más, uno para el motivo y otro para el objeto. Decime si te animas a hacerlo o sino lo hago yo
export const denunciaSchema = z.object({ // Este es el que se exporta
    Denunciante: personaSchema,
    Denunciado: personaSchema,
    Técnico: personaSchema,
    motivo: z.array(z.string()).min(1, { message: "El objeto es requerido" }), // Aquí le pasas el array de motivos y le pones que sea requerido
    objeto: z.array(z.string()).min(1, { message: "El objeto es requerido" }), // Aquí le pasas el array de objetos y le pones que sea requerido
});

