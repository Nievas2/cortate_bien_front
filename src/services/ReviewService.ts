import axiosInstance from "@/api/axiosInstance"

export async function getReviews(barberId: string) {
  try {
    const res = await axiosInstance(`resena/find/all/${barberId}`)
    return res
  } catch (error) {
    console.error("Error al obtener los países:", error)
  }
}
