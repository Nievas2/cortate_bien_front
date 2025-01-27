import axiosInstance from "@/api/axiosInstance"

export async function createOrderByPlan(id: string) {
  try {
    const res = await axiosInstance.post(`order/create/${id}`)
    return res
  } catch (error) {
    throw error
  }
}
