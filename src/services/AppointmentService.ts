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

export async function getAppointmentsByUser({
  date,
}: {
  date: string | undefined
}) {
  try {
    const res = await axiosInstance.get(`turno/find-all/user?date=${date}`)
    return res
  } catch (error) {
    throw error
  }
}

/* export async function getAppointmentsByUserId(id: string, date?: string) {
  try {
    const res = await axiosInstance.get(`turno/find/all/user?date=${date}`)
    return res
  } catch (error) {
    throw error
  }
} */

export async function updateStatus(
  idBarber: string,
  data: { id: string; estado: string }[]
) {
  try {
    const res = await axiosInstance.put(`turno/update/${idBarber}`, data)
    return res
  } catch (error) {
    throw error
  }
}

export async function updateStatusUser(idAppointment: string, status: string) {
  try {
    const res = await axiosInstance.put(
      `turno/update/${idAppointment}?status=${status}`
    )
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
