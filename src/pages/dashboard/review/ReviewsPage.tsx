import { getReviews } from "@/services/ReviewService"
import Layout from "../layout"
import { useLocation } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Pagination } from "@/components/shared/dashboard/Pagination"
import usePagination from "@/hooks/dashboard/usePagination"
import { useEffect, useState } from "react"
import CardReviewBarber from "./components/CardReviewBarber"
import { ReviewBarber } from "@/interfaces/Review"

const ReviewsPage = () => {
  document.title = "Cortate bien | Reseñas"
  const [totalReviews, setTotalReviews] = useState(0)
  const { currentPage, totalPages, handlePageChange, setTotalPages } =
    usePagination()

  const { search } = useLocation()
  const id = search.split("=")[1]

  const { data, isLoading } = useQuery({
    queryKey: ["getreviews", id],
    queryFn: () => getReviews(id),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24,
  })

  useEffect(() => {
    if (data) {
      setTotalPages(data.data.total_pages)
      setTotalReviews(data.data.total_resenas)
    }
  }, [])

  return (
    <Layout>
      <div className="flex flex-col gap-4 items-center justify-center w-full">
        <h1 className="text-3xl font-semibold">Reseñas</h1>

        <section className="grid grid-cols-1 gap-8 place-items-center min-h-96 w-full">
          {data?.data.results.map((review: ReviewBarber) => (
            <CardReviewBarber review={review} key={review.id} />
          ))}
        </section>

        {totalReviews > 0 && (
          <Pagination
            currentPage={currentPage!}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            disabled={isLoading}
          />
        )}
      </div>
    </Layout>
  )
}
export default ReviewsPage
