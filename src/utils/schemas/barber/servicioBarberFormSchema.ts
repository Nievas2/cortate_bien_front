import z from "zod"

export const servicioBarberFormSchema =
  /*  z.array( */
  z.object({
    nombre: z
      .string()
      .nonempty("El nombre es requerido")
      .min(3, "El nombre debe tener al menos 3 caracteres")
      .max(30, "El nombre no puede tener más de 30 caracteres"),
    precio: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
      message: "Expected number, received a string",
    }),
  })
/* ) */
