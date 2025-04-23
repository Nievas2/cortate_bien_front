import axiosInstance from "@/api/axiosInstance"

export async function getUserById(id: string) {
  try {
    const res = await axiosInstance.get(`users/find/${id}`)
    return res
  } catch (error) {
    throw error
  }
}

export async function completeRegistration({
  fechaNacimiento,
  telefono,
  tipoDeCuenta,
  ciudad_id,
}: {
  fechaNacimiento: string | number
  telefono: string
  tipoDeCuenta: string
  ciudad_id: number
}) {
  try {
    const res = await axiosInstance.patch(`users/complete-registration`, {
      fechaNacimiento : fechaNacimiento,
      telefono : telefono,
      tipoDeCuenta : tipoDeCuenta,
      ciudad : ciudad_id,
    })
    return res
  } catch (error) {
    throw error
  }
}
