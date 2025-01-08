import * as yup from "yup"
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/


export const signupSchema = yup.object({
  nombre: yup
    .string()
    .required("Su nombre es requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(20, "El nombre no puede tener más de 20 caracteres"),
  apellido: yup
    .string()
    .required("Su apellido es requerido")
    .min(3, "El apellido debe tener al menos 3 caracteres")
    .max(20, "El apellido no puede tener más de 20 caracteres"),
  fechaDeNacimiento: yup.date().required("Fecha de nacimiento es requerida"),
  email: yup.string().required("Email es requerido").email("Formato invalido"),
  telefono: yup
    .string()
    .required("Su telefono es requerido")
    .matches(phoneRegExp, "Formato de telefono no valido"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .matches(/^(?=.*[a-z])/, "La contraseña debe tener al menos una letra minúscula")
    .matches(/^(?=.*[A-Z])/, "La contraseña debe tener al menos una letra mayúscula")
    .matches(/^(?=.*[0-9])/, "La contraseña debe tener al menos un número")
    .max(30, "La contraseña no puede tener más de 30 caracteres"),
  confirmPassword: yup.string().required("Confirme su contraseña"),
  rol: yup.string().required("Rol es requerido"),
})
