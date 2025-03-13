import axiosInstance from "@/api/axiosInstance"

export async function getNotificationsBarber(id: string) {
  try {
    const res = await axiosInstance.get(`notificaciones/find/all/barbero/${id}`)
    return res
  } catch (error) {
    throw error
  }
}

export async function getNotificationsUser() {
  try {
    const res = await axiosInstance.get(`notificaciones/find/all/cliente`)
    return res
  } catch (error) {
    throw error
  }
}

export async function readNotificationClient(id: string) {
  try {
    const res = await axiosInstance.patch(`notificaciones/view/user`, [id])
    return res
  } catch (error) {
    throw error
  }
}

export async function readNotificationBarber(id: string) {
  try {
    const res = await axiosInstance.patch(`notificaciones/view/barberia/${id}`)
    return res
  } catch (error) {
    throw error
  }
}
