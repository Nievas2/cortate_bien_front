import z from "zod"
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

export const updateUserSchema = z
  .object({
    telefono: z
      .string()
      .nonempty("Su telefono es requerido")
      .min(8, "El telefono debe tener al menos 10 caracteres")
      .max(15, "El telefono no puede tener más de 15 caracteres")
      .regex(phoneRegExp, "Formato de telefono no valido"),
    ciudad_id: z.string().nonempty("La ciudad es requerida"),
    fechaNacimiento: z
      .preprocess(
        (value) => (typeof value === "string" ? new Date(value) : value),
        z.date()
      )
      .default(new Date()) /* 
    tipoDeCuenta: z.enum(["BARBERO", "CLIENTE"]).default("CLIENTE"), */,
    password: z
      .string()
      .nonempty("La contraseña es requerida")
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(30, "La contraseña no puede tener más de 30 caracteres")
      .refine((value) => /^(?=.*[a-z])/.test(value), {
        message: "La contraseña debe tener al menos una letra minúscula",
      })
      .refine((value) => /^(?=.*[A-Z])/.test(value), {
        message: "La contraseña debe tener al menos una letra mayúscula",
      })
      .refine((value) => /^(?=.*[0-9])/.test(value), {
        message: "La contraseña debe tener al menos un número",
      }),
    confirmPassword: z
      .string()
      .nonempty("La contraseña es requerida")
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(30, "La contraseña no puede tener más de 30 caracteres")
      .refine((value) => /^(?=.*[a-z])/.test(value), {
        message: "La contraseña debe tener al menos una letra minúscula",
      })
      .refine((value) => /^(?=.*[A-Z])/.test(value), {
        message: "La contraseña debe tener al menos una letra mayúscula",
      })
      .refine((value) => /^(?=.*[0-9])/.test(value), {
        message: "La contraseña debe tener al menos un número",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

export const recoveryPasswordSchema = z
  .object({
    email: z.string().email("Formato invalido"),
    token: z.string().nonempty("El token es requerido"),
    password: z
      .string()
      .nonempty("La contraseña es requerida")
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(30, "La contraseña no puede tener más de 30 caracteres")
      .refine((value) => /^(?=.*[a-z])/.test(value), {
        message: "La contraseña debe tener al menos una letra minúscula",
      })
      .refine((value) => /^(?=.*[A-Z])/.test(value), {
        message: "La contraseña debe tener al menos una letra mayúscula",
      })
      .refine((value) => /^(?=.*[0-9])/.test(value), {
        message: "La contraseña debe tener al menos un número",
      }),
    confirmPassword: z
      .string()
      .nonempty("La contraseña es requerida")
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(30, "La contraseña no puede tener más de 30 caracteres")
      .refine((value) => /^(?=.*[a-z])/.test(value), {
        message: "La contraseña debe tener al menos una letra minúscula",
      })
      .refine((value) => /^(?=.*[A-Z])/.test(value), {
        message: "La contraseña debe tener al menos una letra mayúscula",
      })
      .refine((value) => /^(?=.*[0-9])/.test(value), {
        message: "La contraseña debe tener al menos un número",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })
