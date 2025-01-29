import axiosInstance from "@/api/axiosInstance"

export async function getUserById(id: string) {
    try {
        const res = await axiosInstance.get(`users/find/${id}`)
        return res
    } catch (error) {
        throw error
    }
}