import z from "zod"
enum DiaEnum {
  LUNES = "LUNES",
  MARTES = "MARTES",
  MIERCOLES = "MIERCOLES",
  JUEVES = "JUEVES",
  VIERNES = "VIERNES",
  SABADO = "SABADO",
  DOMINGO = "DOMINGO",
}

const horarioSchema = z.object({
  dia: z.nativeEnum(DiaEnum, { required_error: "El dia es requerido" }),
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
    .refine((value) => /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(value), {
      message:
        "El formato de la hora debe ser valido (HH:MM, entre 00:00 y 23:59).",
    }),
  pausa_fin: z
    .string()
    .refine((value) => /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(value), {
      message:
        "El formato de la hora debe ser valido (HH:MM, entre 00:00 y 23:59).",
    }),
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
    .number()
    .min(3, "La latitud debe tener almenos 3 caracteres")
    .max(30, "La latitud no debe tener mas de 30 caracteres"),
  longitud: z
    .number()
    .min(3, "La latitud debe tener almenos 3 caracteres")
    .max(30, "La latitud no debe tener mas de 30 caracteres"),
  cantidadDeMinutosPorTurno: z
    .number()
    .nonnegative("La cantidad de minutos por turno no puede ser negativa"),
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
  horarios: z.array(horarioSchema),
})
