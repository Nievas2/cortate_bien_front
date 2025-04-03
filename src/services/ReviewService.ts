import axiosInstance from "@/api/axiosInstance"
import { CreateReview } from "@/interfaces/Review"

export async function createReview({
  id,
  review,
}: {
  id: string
  review: CreateReview
}) {
  try {
    const res = await axiosInstance.post(`resena/create/${id}`, review)
    return res
  } catch (error) {
    throw error
  }
}

export async function updateReview({
  id,
  review,
}: {
  id: string
  review: CreateReview
}) {
  try {
    const res = await axiosInstance.put(`resena/update/${id}`, review)
    return res
  } catch (error) {
    throw error
  }
}

export async function getReviews(barberId: string) {
  try {
    const res = await axiosInstance(`resena/find/all/${barberId}`)
    return res
  } catch (error) {
    throw error
  }
}

export async function getReviewsByUser() {
  try {
    const res = await axiosInstance(`resena/find-all/user`)
    return res
  } catch (error) {
    throw error
  }
}

export async function getCheckReview(barberId: string) {
  try {
    const res = await axiosInstance.get(`resena/check/${barberId}`)
    return res
  } catch (error) {
    throw error
  }
}
