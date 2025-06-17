import z from "zod"

export const planSchema = z.object({
  nombre: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(30, "El nombre no puede tener más de 30 caracteres")
    .nonempty("El nombre es requerido"),
  precio: z
    .string()
    .min(1, "El precio debe ser mayor a 0")
    .refine((val) => !Number.isNaN(parseInt(val, 10)), {
      message: "Expected number, received a string",
    }),
  turnosMaximos: z
    .string()
    .min(1, "La cantidad de turnos maximos debe ser mayor a 0")
    .refine((val) => !Number.isNaN(parseInt(val, 10)), {
      message: "Expected number, received a string",
    }),
  descripcion: z
    .string()
    .min(3, "La descripcion debe tener al menos 3 caracteres")
    .max(255, "La descripcion no puede tener más de 255 caracteres"),
  /*   expirable: z.boolean().default(true), */
  cantDias: z
    .string()
    .min(1, "La cantidad de dias debe ser mayor a 0")
    .refine((val) => !Number.isNaN(parseInt(val, 10)), {
      message: "Expected number, received a string",
    }),
  precioPromedio: z.boolean().default(false),
  servicios: z.boolean().default(false),
  barberos: z.boolean().default(false),
  autoActivacion: z.boolean().default(false),
  soportePrioritario: z.boolean().default(false),

})
