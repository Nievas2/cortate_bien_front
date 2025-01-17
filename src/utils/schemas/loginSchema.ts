import z from "zod"

export const loginSchema = z.object({
  email: z.string().email("Formato invalido"),
  password: z
    .string()
    .nonempty("La contraseña es requerida")
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
})
