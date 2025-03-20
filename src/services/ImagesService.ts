import axios from "axios"
import Cookies from "js-cookie"

const token = Cookies.get("token")
export async function postImage(image: any) {
  try {
    const res = axios.post(import.meta.env.VITE_API_URL_IMAGES, image, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    })
    return res
  } catch (error) {
    throw error
  }
}

/* export async function putImage(image: any) {
  try {
    const res = axios.put(import.meta.env.VITE_API_URL_IMAGES, image)
    return res
  } catch (error) {
    throw error
  }
} */
