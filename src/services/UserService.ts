import axiosInstance from "@/api/axiosInstance"

export async function getUserById(id: string) {
  try {
    const res = await axiosInstance.get(`users/find/${id}`)
    return res
  } catch (error) {
    throw error
  }
}

export async function updateUser({
  id,
  fechaNacimiento,
  telefono,
  password,
  ciudad_id,
}: {
  id: string
  fechaNacimiento: string | number
  telefono: string
  password: string
  ciudad_id: string
}) {
  try {
    const res = await axiosInstance.put(`users/updat${id}`, {
      fechaNacimiento,
      telefono,
      password,
      ciudad_id,
    })
    return res
  } catch (error) {
    throw error
  }
}
