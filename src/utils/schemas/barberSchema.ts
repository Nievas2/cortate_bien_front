import z from "zod"
const horarioSchema = z.object({
  dia: z
    .enum([
      "LUNES",
      "MARTES",
      "MIERCOLES",
      "JUEVES",
      "VIERNES",
      "SABADO",
      "DOMINGO",
    ])
    .default("LUNES"),
  hora_apertura: z
    .string()
    .nonempty("La hora de apertura es requerida")
    .refine((value) => /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(value), {
      message:
        "El formato de la hora debe ser valido (HH:MM, entre 00:00 y 23:59).",
    }),
  hora_cierre: z
    .string()
    .nonempty("La hora de cierre es requerida")
    .refine((value) => /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(value), {
      message:
        "El formato de la hora debe ser valido (HH:MM, entre 00:00 y 23:59).",
    }),
  pausa_inicio: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (value) =>
        value === "" || /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(value!),
      {
        message:
          "El formato de la hora debe ser valido (HH:MM, entre 00:00 y 23:59).",
      }
    ),
  pausa_fin: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (value) =>
        value === "" || /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(value!),
      {
        message:
          "El formato de la hora debe ser valido (HH:MM, entre 00:00 y 23:59).",
      }
    ),
})

export const barberSchema = z.object({
  nombre: z
    .string()
    .nonempty("El nombre es requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(30, "El nombre no puede tener más de 30 caracteres"),
  descripcion: z
    .string()
    .nonempty("La descripcion es requerida")
    .min(3, "La descripcion debe tener al menos 3 caracteres")
    .max(400, "La descripcion no puede tener más de 400 caracteres"),
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
  imagenes: z
    .array(z.string().url("La imagen debe ser una url"))
    .nonempty("Las imagenes son requeridas")
    .max(5, "No puedes subir mas de 5 imagenes"),
  imagen_perfil: z
    .string()
    .nonempty("La imagen de perfil es requerida")
    .url("La imagen de perfil debe ser una url"),
  horarioPorDia: z.array(horarioSchema),
})
