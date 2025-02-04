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

export async function getAppointmentsByBarberId(id: string, date?: string) {
  try {
    const res = await axiosInstance.get(`turno/find/all/${id}?date=${date}`)
    return res
  } catch (error) {
    throw error
  }
}

export async function updateStatus(id: string, state: string) {
  console.log(state, id)

  try {
    const res = await axiosInstance.put(`turno/update/${id}`, [state])
    return res
  } catch (error) {
    throw error
  }
}

export async function reschedule({
  id,
  fecha,
  hora,
}: {
  id: string
  fecha: string
  hora: string
}) {
  try {
    const res = await axiosInstance.put(`turno/update/reprogramar/${id}`, {
      fecha,
      hora,
    })
    return res
  } catch (error) {
    throw error
  }
}
