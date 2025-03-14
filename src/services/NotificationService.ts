import axiosInstance from "@/api/axiosInstance"

export async function getNotificationsBarber(
  id: string,
  status: string,
  viewed: string
) {
  try {
    const res = await axiosInstance.get(
      `notificaciones/find/all/barbero/${id}?page=1&status=${status}&viewed=${viewed}`
    )
    return res
  } catch (error) {
    throw error
  }
}

export async function getNotificationsUser(status: string, viewed: string) {
  try {
    const res = await axiosInstance.get(
      `notificaciones/find/all/cliente?page=1&status=${status}&viewed=${viewed}`
    )
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
