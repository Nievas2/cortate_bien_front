import { useQuery } from "@tanstack/react-query"
import Layout from "../Layout"
import { getReviewsByUser } from "@/services/ReviewService"
import { PaginationReviews } from "@/components/shared/profile/PaginationReviews"
import usepaginationReviews from "@/hooks/profile/usePaginationReviews"
import { useEffect } from "react"
import { Review } from "@/interfaces/Review"
import CardReview from "./components/CardReview"
import { RenderReviewCardSkeletons } from "@/components/Skeletons/CardReviewSkeleton"

const ProfileReviewsPage = () => {
  const { currentPage, totalPages, handlePageChange, setTotalPages } =
    usepaginationReviews()

  const { data, isLoading, refetch, isPending } = useQuery({
    queryKey: ["getreviews"],
    queryFn: getReviewsByUser,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24,
    retry: false,
  })

  useEffect(() => {
    if (data) {
      setTotalPages(data.data.total_pages)
    }
  }, [])
  return (
    <Layout>
      <main className="flex flex-col gap-6 h-full w-full p-2">
        <section className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-semibold">Reseñas</h1>
          <p>Aquí podrás encontrar todas tus reseñas.</p>
        </section>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center min-h-96">
          {data?.data.results.length == 0 && (
            <section className="flex items-center justify-center">
              <h1 className="text-2xl font-semibold">No tienes reseñas</h1>
            </section>
          )}

          {isPending
            ? RenderReviewCardSkeletons()
            : data?.data.results.map((review: Review) => (
                <CardReview review={review} refetch={refetch} key={review.id} />
              ))}
        </section>
        {data?.data.results.length > 0 && (
          <section className="flex items-center justify-center">
            <PaginationReviews
              currentPage={currentPage!}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              disabled={isLoading}
            />
          </section>
        )}
      </main>
    </Layout>
  )
}
export default ProfileReviewsPage
