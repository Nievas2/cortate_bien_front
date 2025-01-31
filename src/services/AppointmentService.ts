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

export async function getAppointmentsByBarberId(id: string) {
  try {
    const res = await axiosInstance.get(`turno/find/all/${id}`)
    return res
  } catch (error) {
    throw error
  }
}
