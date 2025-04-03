import z from "zod"
import { horarioSchema } from "../barberSchema"

export const profileBarberFormSchema = z.object({
  latitud: z
    .string()
    .min(3, "La latitud debe tener almenos 3 caracteres")
    .max(30, "La latitud no debe tener mas de 30 caracteres")
    .refine((val) => !Number.isNaN(parseInt(val, 10)), {
      message: "Expected number, received a string",
    }),
  longitud: z
    .string()
    .min(3, "La latitud debe tener almenos 3 caracteres")
    .max(30, "La latitud no debe tener mas de 30 caracteres")
    .refine((val) => !Number.isNaN(parseInt(val, 10)), {
      message: "Expected number, received a string",
    }),
  cantidadDeMinutosPorTurno: z
    .string()
    .min(1, "La cantidad de minutos por turno debe ser mayor a 1")
    .refine((val) => !Number.isNaN(parseInt(val, 10)), {
      message: "Expected number, received a string",
    }),
  direccion: z
    .string()
    .nonempty("La direccion es requerida")
    .min(3, "La direccion debe tener almenos 3 caracteres")
    .max(30, "La direccion no debe tener mas de 30 caracteres"),

  ciudad_id: z.string().nonempty("La ciudad es requerida"),
  horarios: z.array(horarioSchema),
})
