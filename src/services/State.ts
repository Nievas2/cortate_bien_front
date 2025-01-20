import axiosInstance from "@/api/axiosInstance"

export async function getStates(countryId: number) {
    try {
      const res = await axiosInstance(`states/find/${countryId}/all`)
      return res
    } catch (error) {
      console.error("Error al obtener los países:", error)
    }
  }
  