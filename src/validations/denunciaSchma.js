import { z } from "zod";

const personaSchema = z.object({
  /* Hacemos los campos opcionales a nivel de persona para permitir que el tercer
  elemento (técnico) esté ausente o vacío. La validación de que los primeros
  dos (denunciante y denunciado) estén completos se aplica más abajo. */
  nombre: z.string().optional(),
  apellido: z.string().optional(),
  documento: z.string().optional(),
  domicilio: z.string().optional(),
  localidad: z.string().optional(),
  cp: z.string().optional(),
  telefono: z.string().optional(),
        email: z.preprocess((val) => {
                // convertir cadena vacía a undefined para que .optional() la acepte
                if (typeof val === 'string' && val.trim() === '') return undefined;
                return val;
        }, z.string().email({ message: 'El email debe ser válido' }).optional()),
  fax: z.string().optional(),
});

// Esquema de persona con delegado y rol
const personaConDelegadoSchema = z.object({
    persona: personaSchema,
    nombreDelegado: z.string().optional(),
    apellidoDelegado: z.string().optional(),
    dniDelegado: z.string().optional(),
});

/* Este sería el esquema principal digamos, donde están las tres Personas, faltaría que le agregues dos más, uno para el motivo y otro para el objeto. Decime si te animas a hacerlo o sino lo hago yo
 Queremos al menos 2 personas (denunciante y denunciado). El técnico (3er elemento)
 es opcional: si no está presente, está bien; si está presente debe cumplir el esquema. */
export const denunciaSchema = z.object({
        motivo: z.array(z.string()).min(1, { message: "El motivo es requerido" }),
        objeto: z.array(z.string()).min(1, { message: "El objeto es requerido" }),
        descripcion: z.string().min(1, { message: "La descripción es requerida" }),
                /*Validación personalizada para personas:
                - Debe haber al menos dos objetos en el array (denunciante y denunciado)
                - Los dos primeros deben tener los campos obligatorios completos*/
                personas: z.array(personaConDelegadoSchema).superRefine((arr, ctx) => {
                        if (!Array.isArray(arr) || arr.length < 2) {
                                ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Debe haber al menos denunciante y denunciado', path: ['personas'] });
                                return;
                        }

                        const requiredFields = ['nombre', 'apellido', 'documento', 'domicilio', 'localidad', 'cp', 'telefono'];

                        for (const idx of [0, 1]) {
                                const item = arr[idx];
                                const persona = item?.persona || {};
                                for (const field of requiredFields) {
                                        const val = persona[field];
                                        if (!val || (typeof val === 'string' && val.trim() === '')) {
                                                ctx.addIssue({ code: z.ZodIssueCode.custom, message: `El campo ${field} es requerido para la persona ${idx === 0 ? 'denunciante' : 'denunciado'}`, path: ['personas', idx, 'persona', field] });
                                        }
                                }

                                // Validar documento si está presente
                                const doc = persona.documento;
                                if (doc && !/^\d+$/.test(doc)) {
                                        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'El DNI/CUIT solo puede contener números positivos sin símbolos', path: ['personas', idx, 'persona', 'documento'] });
                                } else if (doc && (doc.length < 7 || doc.length > 11)) {
                                        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'El DNI/CUIT debe tener entre 7 y 11 dígitos', path: ['personas', idx, 'persona', 'documento'] });
                                }
                        }
                }),
        notificar: z.boolean().optional(),
});

