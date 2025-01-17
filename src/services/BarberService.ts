import axiosInstance from "@/api/axiosInstance"
import { Barber } from "@/interfaces/Barber"

export async function createbarber(barber: any) {
  console.log(barber);
  
  try {
    const res = axiosInstance.post("barberia/create", barber)
    return res
  } catch (error) {
    throw error
  }
}
