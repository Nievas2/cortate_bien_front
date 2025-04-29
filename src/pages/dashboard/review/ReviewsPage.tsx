import { getReviews } from "@/services/ReviewService"
import Layout from "../layout"
import { useLocation } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Pagination } from "@/components/shared/dashboard/Pagination"
import usePagination from "@/hooks/dashboard/usePagination"
import { useEffect } from "react"
import CardReviewBarber from "./components/CardReviewBarber"
import { ReviewBarber } from "@/interfaces/Review"
import { RenderReviewCardSkeletons } from "@/components/Skeletons/CardReviewSkeleton"

const ReviewsPage = () => {
  document.title = "Cortate bien | Reseñas"
  const { currentPage, totalPages, handlePageChange, setTotalPages } =
    usePagination()

  const { search } = useLocation()
  const id = search.split("=")[1]

  const { data, isPending } = useQuery({
    queryKey: ["getreviews", id],
    queryFn: () => getReviews(id),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24,
  })

  useEffect(() => {
    if (data) {
      setTotalPages(data.data.total_pages)
    }
  }, [])

  return (
    <Layout>
      <div className="flex flex-col gap-4 items-center justify-center w-full h-full">
        <h1 className="text-3xl font-semibold">Reseñas</h1>

        {data?.data.total_resenas === 0 && (
          <div className="flex items-center justify-center h-full min-h-96">
            <h2 className="text-xl font-bold text-center">No hay reseñas.</h2>
          </div>
        )}

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center min-h-96 w-full">
          {isPending
            ? RenderReviewCardSkeletons()
            : data?.data.results.map((review: ReviewBarber) => (
                <CardReviewBarber review={review} key={review.id} />
              ))}
        </section>

        {data?.data.results > 0 && (
          <Pagination
            currentPage={currentPage!}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            disabled={isPending}
          />
        )}
      </div>
    </Layout>
  )
}
export default ReviewsPage
