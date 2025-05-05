import axiosInstance from "@/api/axiosInstance"

export async function getFirebaseToken() {
  try {
    const res = await axiosInstance.post("firebase/create")
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
