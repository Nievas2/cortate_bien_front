import z from "zod"
export const codeSchema = z.object({
  code: z
    .string()
    .nonempty("El codigo es requerido")
    .min(3, "El codigo debe tener al menos 3 caracteres")
    .max(30, "El codigo no puede tener más de 30 caracteres"),
})
