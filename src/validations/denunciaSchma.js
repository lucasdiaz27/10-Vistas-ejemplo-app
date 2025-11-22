import { z } from "zod";

// 🧍 Esquema base de persona (obligatoria)
const personaSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  apellido: z.string().min(1, "El apellido es requerido"),
  documento: z.string().min(7, "El documento es requerido"),
  domicilio: z.string().min(1, "El domicilio es requerido"),
  localidad: z.string().min(1, "La localidad es requerida"),
  cp: z.string().min(1, "El código postal es requerido"),
  telefono: z.string().min(1, "El teléfono es requerido"),
  email: z.preprocess(
    (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
    z.string().email({ message: "El email debe ser válido" }).optional()
  ),
});

// 🧾 Persona + delegado
const personaConDelegadoSchema = z.object({
  persona: personaSchema,
  nombreDelegado: z.string().optional(),
  apellidoDelegado: z.string().optional(),
  dniDelegado: z.string().optional(),
});

// 👷‍♂️ Persona opcional (para técnico)
const personaOpcionalSchema = z
  .object({
    nombre: z.string().optional(),
    apellido: z.string().optional(),
    documento: z.string().optional(),
    domicilio: z.string().optional(),
    localidad: z.string().optional(),
    cp: z.string().optional(),
    telefono: z.string().optional(),
    email: z.string().optional(),
    fax: z.string().optional(),
  })
  .transform((persona) => {
    const todosVacios = Object.values(persona).every(
      (v) => !v || v.toString().trim() === ""
    );
    return todosVacios ? undefined : persona;
  });

// 🏢 Esquema para el denunciado (empresa / nombre de fantasía)
const denunciadoPersonaSchema = z.object({
  persona: z.object({
    razonSocial: z.string().min(1, "La razón social o nombre de fantasía es requerida"),
    propietario: z.string().optional(),
    documento: z.string().optional(),
    telefono: z.string().optional(),
    email: z.preprocess(
      (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
      z.string().email({ message: "El email debe ser válido" }).optional()
    ),
  }),
});

// 👷‍♂️ Técnico: solo valida si hay datos
const tecnicoSchema = z
  .object({
    persona: personaOpcionalSchema.optional(),
    nombreDelegado: z.string().optional(),
    apellidoDelegado: z.string().optional(),
    dniDelegado: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const persona = data.persona;
    if (!persona) return; // No se completó nada → no valida

    const camposRequeridos = [
      "nombre",
      "apellido",
      "documento",
      "domicilio",
      "localidad",
      "cp",
      "telefono",
    ];

    for (const campo of camposRequeridos) {
      const valor = persona[campo];
      if (!valor || valor.toString().trim() === "") {
        ctx.addIssue({
          path: ["persona", campo],
          message: `El campo "${campo}" es obligatorio si completa algún dato del técnico`,
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

// 📄 Schema principal
export const denunciaSchema = z.object({
  motivo: z.array(z.string()).min(1, { message: "El motivo es requerido" }),
  objeto: z.array(z.string()).min(1, { message: "El objeto es requerido" }),
  descripcion: z.string().min(1, { message: "La descripción es requerida" }),
  personas: z.tuple([
    personaConDelegadoSchema.extend({ persona: personaSchema }), // denunciante
    denunciadoPersonaSchema, // denunciado 
    tecnicoSchema.optional(), // técnico opcional
  ]),
  notificar: z.boolean().optional(),
});
