import * as yup from "yup"

export const loginSchema = yup.object({
  email : yup.string().required("El email es requerido").email("Formato invalido"),
  password : yup.string().required("La contraseña es requerida"),
})