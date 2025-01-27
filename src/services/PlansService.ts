import axiosInstance from "@/api/axiosInstance"

export async function getAllPlans() {
  try {
    const res = await axiosInstance.get("plan/find/all")
    return res
  } catch (error) {
    throw error
  }
}

export async function getPlansAdmin() {
  try {
    const res = await axiosInstance.get("plan/find/all/admin")
    return res
  } catch (error) {
    throw error
  }
}

export async function getPlanById(id: string) {
  try {
    const res = await axiosInstance.get(`plan/find/${id}`)
    return res
  } catch (error) {
    throw error
  }
}

export async function createPlan(data: any) {
  try {
    const res = await axiosInstance.post("plan/create", data)
    return res
  } catch (error) {
    throw error
  }
}

export async function updatePlan(id: string, data: any) {
  try {
    const res = await axiosInstance.put(`plan/update/${id}`, data)
    return res
  } catch (error) {
    throw error
  }
}

export async function deletePlan(id: string) {
  try {
    const res = await axiosInstance.delete(`plan/delete/${id}`)
    return res
  } catch (error) {
    throw error
  }
}
