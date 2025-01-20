import axiosInstance from "@/api/axiosInstance"

export async function getCities(stateId: number) {
  try {
    const res = await axiosInstance(`cities/find/${stateId}/all`)
    return res
  } catch (error) {
    console.error("Error al obtener los países:", error)
  }
}
