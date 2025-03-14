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
    const res = await axiosInstance.get(`notificaciones/find/all/cliente?page=1`)
    return res
  } catch (error) {
    throw error
  }
}

export async function readNotificationClient(id: string) {
  try {
    const res = await axiosInstance.patch(`notificaciones/view/user`, {
      id: [id],
    })
    return res
  } catch (error) {
    throw error
  }
}

export async function readNotificationBarber(barberId: string, id: string) {
  try {
    const res = await axiosInstance.patch(
      `notificaciones/view/barberia/${barberId}`,
      {
        id: [id],
      }
    )
    return res
  } catch (error) {
    throw error
  }
}
