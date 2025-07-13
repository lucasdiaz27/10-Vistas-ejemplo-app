import { z } from "zod";

export const loginSchema = z.object({
    usuario: z.string().min(1, { message: "Usuario obligatorio" }),
    contraseña: z.string()
                  .min(1, { message: "La contraseña es obligatoria" })
                  .max(20, { message: "La contraseña no debe superar los 20 caracteres" })
                  .regex(/^[a-zA-Z0-9]*$/, { message: "La contraseña solo puede contener letras y números" }),
  });