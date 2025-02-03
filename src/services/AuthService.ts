import axiosInstance from "@/api/axiosInstance"

export interface Login {
  email: string
  password: string
}

export interface Register {
  nombre: string
  apellido: string
  fechaDeNacimiento: string
  email: string
  telefono: string
  password: string
  tipoDeCuenta: string
  ciudad_id: string
}

export function login(user: Login) {
  try {
    const response = axiosInstance.post("/login", user)
    return response
  } catch (error) {
    throw error
  }
}

export function loginGoogle() {
  try {
    const response = axiosInstance.get("/login/google")
    return response
  } catch (error) {
    throw error
  }
}

export function loginGithub() {
  try {
    const response = axiosInstance.get("/login/github")
    return response
  } catch (error) {
    throw error
  }
}

export function register(user: Register) {
  console.log(user);
  
  try {
    const response = axiosInstance.post("user/register", user)
    return response
  } catch (error) {
    throw error
  }
}

export function recoveryPasswordFunction(email: string) {
  try {
    const response = axiosInstance.post("user/pass/recovery", {
      email: email,
    })
    return response
  } catch (error) {
    throw error
  }
}

export function putPassword(password: string, token: string) {
  try {
    const response = axiosInstance.put(`user/reset?token=${token}`, {
      password: password,
    })
    return response
  } catch (error) {
    throw error
  }
}
