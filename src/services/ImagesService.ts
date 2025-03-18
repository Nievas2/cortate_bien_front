import axios from "axios"

export async function postImage(image: any) {
  try {
    const res = axios.post(import.meta.env.VITE_API_URL_IMAGES, image)
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
