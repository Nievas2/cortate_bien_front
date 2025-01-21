import { getReviews } from "@/services/ReviewService"
import Layout from "../layout"
import { useLocation } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Pagination } from "@/components/shared/dashboard/Pagination"
import usePagination from "@/hooks/dashboard/usePagination"
import { useEffect, useState } from "react"

const ReviewsPage = () => {
  const [totalReviews, setTotalReviews] = useState(0)
  const { currentPage, totalPages, handlePageChange, setTotalPages } =
    usePagination()

  const { search } = useLocation()
  const id = search.split("=")[1]

  const { data, isLoading } = useQuery({
    queryKey: ["getreviews"],
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
  console.log(data)

  return (
    <Layout>
      <div className="flex flex-col gap-4 items-center justify-center">
        <h1 className="text-3xl font-semibold">Reseñas</h1>
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
