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

export async function updateStatus(
  idBarber: string,
  state: string,
  idAppointment: string
) {
  try {
    const res = await axiosInstance.put(`turno/update/${idBarber}`, [
      { id: idAppointment, estado: state },
    ])
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
