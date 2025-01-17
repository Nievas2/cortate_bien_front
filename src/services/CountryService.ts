import axiosInstance from "@/api/axiosInstance"

export async function getCountries() {
  try {
    const res = await axiosInstance("countries/find/all")
    return res
  } catch (error) {
    console.error("Error al obtener los países:", error)
  }
}
