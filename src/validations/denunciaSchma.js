import { z } from "zod";

const personaSchema = z.object({
  /* Hacemos los campos opcionales a nivel de persona para permitir que el tercer
  elemento (técnico) esté ausente o vacío. La validación de que los primeros
  dos (denunciante y denunciado) estén completos se aplica más abajo. */
  nombre: z.string().min(1, "El nombre es requerido"),
  apellido: z.string().min(1, "El apellido es requerido"),
  documento: z.string().min(7, "El documento es requerido"),
  domicilio: z.string().min(1, "El domicilio es requerido"),
  localidad: z.string().min(1, "La localidad es requerida"),
  cp: z.string().min(1, "El código postal es requerido"),
  telefono: z.string().min(1, "El teléfono es requerido"),
  email: z.preprocess((val) => {
    // convertir cadena vacía a undefined para que .optional() la acepte
    if (typeof val === "string" && val.trim() === "") return undefined;
    return val;
  }, z.string().email({ message: "El email debe ser válido" }).optional()),
  fax: z.string().optional(),
});

// Esquema de persona con delegado y rol
const personaConDelegadoSchema = z.object({
  persona: personaSchema,
  nombreDelegado: z.string().optional(),
  apellidoDelegado: z.string().optional(),
  dniDelegado: z.string().optional(),
});

const personaOpcionalSchema = personaSchema.partial();

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
  personas: z.tuple([
        personaConDelegadoSchema.extend({ persona: personaSchema }),
        personaConDelegadoSchema.extend({persona: personaSchema}),
        personaConDelegadoSchema.extend({
        persona: personaOpcionalSchema.refine(
        (p) => Object.values(p).some(v => v && v.trim() !== ""),
        { message: "Si completa algún campo del técnico, debe completar todos" }
        )
        }).optional()
  ]),
  notificar: z.boolean().optional(),
});
