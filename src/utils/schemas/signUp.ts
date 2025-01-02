import * as yup from "yup"

export const signupSchema = yup.object({
  name : yup.string().required("Su nombre es requerido").min(3, "El nombre debe tener al menos 3 caracteres").max(20, "El nombre no puede tener más de 20 caracteres"),
  surname : yup.string().required("Su apellido es requerido").min(3, "El apellido debe tener al menos 3 caracteres").max(20, "El apellido no puede tener más de 20 caracteres"),
  email    : yup.string().required("Email es requerido").email("Formato invalido"),
  dob : yup.date().required("Fecha de nacimiento es requerida"),
  password : yup.string().required("Password is required").min(5, "La contraseña debe tener al menos 5 caracteres").max(30, "La contraseña no puede tener más de 30 caracteres"),
  confirmPassword: yup.string().required("Confirme su contraseña"),
})