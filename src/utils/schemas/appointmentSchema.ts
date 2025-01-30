import z from "zod"

export const appointmentSchema = z.object({
  fecha: z.string().nonempty("La fecha es requerida"),
  hora: z
    .string()
    .nonempty("La hora es requerida")
    .refine((value) => /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(value), {
      message:
        "El formato de la hora debe ser valido (HH:MM, entre 00:00 y 23:59).",
    }),
  nota: z
    .string()
    .min(3, "La nota debe tener al menos 3 caracteres")
    .max(100, "La nota no puede tener más de 100 caracteres"),
})
