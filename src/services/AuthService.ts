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

export function register(user: Register) {
  console.log(user)

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

export function validateCode(code: string, email: string) {
  try {
    const response = axiosInstance.post(`auth/verify`, {
      email: email,
      token: code,
    })
    return response
  } catch (error) {
    throw error
  }
}

export function resendcode(email: string) {
  try {
    const response = axiosInstance.post(`auth/resend`, {
      email: email,
    })
    return response
  } catch (error) {
    throw error
  }
}

export function resetPassword(email: string) {
  try {
    const response = axiosInstance.post(`auth/reset-password`, {
      email: email,
    })
    return response
  } catch (error) {
    throw error
  }
}

export function resetPasswordConfirm({
  email,
  password,
  token,
}: {
  email: string
  password: string
  token: string
}) {
  try {
    const res = axiosInstance.post("auth/reset-password/confirm", {
      email: email,
      password: password,
      token: token,
    })
    return res
  } catch (error) {
    throw error
  }
}
