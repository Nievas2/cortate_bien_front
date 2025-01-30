import axiosInstance from "@/api/axiosInstance"
import { CreateAppointment } from "@/interfaces/Appointment"

export async function createAppointment(data: CreateAppointment, id: string) {
  try {
    const res = await axiosInstance.post(`turno/create/${id}`, data)
    return res
  } catch (error) {
    throw error
  }
}
