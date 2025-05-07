import axiosInstance from "@/api/axiosInstance"

export async function getFirebaseToken(token: string) {
  try {
    const res = await axiosInstance.post("firebase/create", {
      token,
    })
    return res
  } catch (error) {
    throw error
  }
}

export async function postNotificationFirebase({
  title,
  body,
  idUser,
}: {
  title: string
  body: string
  idUser: string
}) {
  try {
    const res = await axiosInstance.post("firebase/send-notification", {
      title,
      body,
      idUser,
    })
    return res
  } catch (error) {
    throw error
  }
}

export async function deleteTokenFirebase(token: string) {
  try {
    const res = await axiosInstance.delete(`firebase/delete/${token}`)
    return res
  } catch (error) {
    throw error
  }
}
