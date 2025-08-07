import { useQuery } from "@tanstack/react-query";
import { getReviewsByUser } from "@/services/ReviewService";
import { PaginationReviews } from "@/components/shared/profile/PaginationReviews";
import usepaginationReviews from "@/hooks/profile/usePaginationReviews";
import { useEffect } from "react";
import { Review } from "@/interfaces/Review";
import CardReview from "../reviews/components/CardReview";
import { RenderReviewCardSkeletons } from "@/components/Skeletons/CardReviewSkeleton";
import { Icon } from "@iconify/react/dist/iconify.js";
import { motion } from "framer-motion";

const ProfileReviews = () => {
  const { currentPage, totalPages, handlePageChange, setTotalPages } =
    usepaginationReviews();  

  const { data, isLoading, refetch, isPending } = useQuery({
    queryKey: ["getreviews"],
    queryFn: getReviewsByUser,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24,
    retry: false,
  });

  useEffect(() => {
    if (data) {
      setTotalPages(data.data.total_pages);
    }
  }, [data, setTotalPages]);

  const reviewCount = data?.data.results?.length || 0;

  return (
    <motion.div
      className="space-y-4 sm:space-y-6 px-1 sm:px-0"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      {/* Stats */}
      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-white/10">
          <Icon
            icon="tabler:star-filled"
            className="h-4 w-4 text-yellow-400"
          />
          <span className="text-sm font-medium text-white">
            {reviewCount} {reviewCount === 1 ? "reseña" : "reseñas"}
          </span>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="min-h-[400px]">
        {isPending ? (
          <div className="space-y-6">
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-yellow-500 border-t-transparent"></div>
                <span className="text-gray-400">Cargando reseñas...</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              <RenderReviewCardSkeletons />
            </div>
          </div>
        ) : reviewCount === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/20 mb-6">
              <Icon
                icon="tabler:star-off"
                className="h-10 w-10 text-yellow-400/60"
              />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3">
              No tienes reseñas aún
            </h3>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              Cuando completes tus primeros turnos, podrás dejar reseñas para
              ayudar a otros usuarios a elegir las mejores barberías.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
              <Icon
                icon="tabler:lightbulb"
                className="h-4 w-4 text-yellow-400"
              />
              <span className="text-sm text-gray-300">
                Las reseñas aparecerán después de completar tus turnos
              </span>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {data?.data.results.map((review: Review) => (
                <CardReview
                  key={review.id}
                  review={review}
                  refetch={refetch}
                />
              ))}
            </div>

            {/* Pagination */}
            {data?.data.results.length > 0 && totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <PaginationReviews
                  currentPage={currentPage!}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  disabled={isLoading}
                />
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default ProfileReviews;