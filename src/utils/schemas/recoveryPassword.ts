import * as yup from "yup"

export const recoveryPasswordSchemaEmail = yup.object({
  email : yup.string().required("El email es requerido").email("Formato invalido"),
})
export const recoveryPasswordSchemaPassword = yup.object({
  password : yup.string().required("La contraseña es requerida"),
  confirmPassword: yup.string().required("La contraseña es requerida"),
})