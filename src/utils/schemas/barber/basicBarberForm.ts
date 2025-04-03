import z from "zod"

export const basicBarberFormSchema = z.object({
  nombre: z
    .string()
    .nonempty("El nombre es requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(30, "El nombre no puede tener más de 30 caracteres"),
  descripcion: z
    .string()
    .nonempty("La descripcion es requerida")
    .min(3, "La descripcion debe tener al menos 3 caracteres")
    .max(30, "La descripcion no puede tener más de 30 caracteres"),
})
