import axiosInstance from "@/api/axiosInstance"

export async function deleteUser(id: string) {
  try {
    const res = axiosInstance.delete(`users/delete/${id}`)
    return res
  } catch (error) {
    throw error
  }
}

export async function logOutUser(id: string) {
  try {
    const res = axiosInstance.delete(`auth/logout/devices/${id}`)
    return res
  } catch (error) {
    throw error
  }
}

export async function changeStatusBarber(barberId: string, status: string) {
  try {
    const res = axiosInstance.patch(`barberia/update/admin/${barberId}?status=${status}`)
    return res
  } catch (error) {
    throw error
  }
}
