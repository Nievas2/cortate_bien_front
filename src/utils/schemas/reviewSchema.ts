import z from "zod"

export const createReviewSchema = z.object({
  calificacion: z
    .string()
    .min(1, "La calificacion debe estar entre 1 y 5")
    .max(5, "La calificacion debe estar entre 1 y 5"),
  descripcion: z
    .string()
    .min(1, "La descripcion debe tener al menos 1 caracter")
    .max(400, "La descripcion no puede tener más de 400 caracteres"),
})

export const updateReviewSchema = z.object({
  calificacion: z
    .string()
    .min(1, "La calificacion debe estar entre 1 y 5")
    .max(5, "La calificacion debe estar entre 1 y 5"),
  descripcion: z
    .string()
    .min(1, "La descripcion debe tener al menos 1 caracter")
    .max(400, "La descripcion no puede tener más de 400 caracteres"),
})
