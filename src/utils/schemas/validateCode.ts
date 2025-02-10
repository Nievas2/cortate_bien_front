import z from "zod"

export const validateCodeSchema = z.object({
  code: z
    .string()
    .nonempty("El codigo es requerido")
    .min(6, "El codigo es de 6 digitos")
    .max(6, "El codigo es de 6 digitos"),
  email: z.string().email("Formato invalido"),
})
