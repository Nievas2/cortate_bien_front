import { Button } from "@/components/ui/button";
import { Review } from "@/interfaces/Review";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import HandleChangeReviews from "./HandleChangeReviews";

const CardReview = ({
  review,
  refetch,
}: {
  review: Review;
  refetch?: Function;
}) => {
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);

    return (
      <div className="flex items-center gap-1">
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, index) => (
          <Icon
            key={`full-${index}`}
            icon="tabler:star-filled"
            className="h-4 w-4 text-yellow-400"
          />
        ))}

        {/* Half star */}
        {hasHalfStar && (
          <Icon
            icon="tabler:star-half-filled"
            className="h-4 w-4 text-yellow-400"
          />
        )}

        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, index) => (
          <Icon
            key={`empty-${index}`}
            icon="tabler:star"
            className="h-4 w-4 text-gray-400"
          />
        ))}
      </div>
    );
  };

  return (
    <div
      className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 sm:p-5 md:p-6 hover:bg-white/10 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] h-full flex flex-col min-w-0"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="flex-1 min-w-0 w-full">
          <h3 className="font-semibold text-white text-base sm:text-lg truncate mb-1">
            {review.barberia}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            {renderStars(review.calificacion)}
            <span className="text-xs sm:text-sm text-gray-400 ml-1">
              ({review.calificacion.toFixed(1)})
            </span>
          </div>
        </div>
        <div className="flex-shrink-0 p-2 rounded-lg bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/20 mt-2 sm:mt-0">
          <Icon
            icon="tabler:building-store"
            className="h-5 w-5 text-yellow-400"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 mb-3 sm:mb-4 min-w-0">
        {review.descripcion ? (
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed line-clamp-4 break-words">
            {review.descripcion}
          </p>
        ) : (
          <p className="text-gray-500 text-sm italic">
            Sin comentarios adicionales
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between pt-3 sm:pt-4 border-t border-white/10 gap-2 sm:gap-0">
        {/* <div className="text-xs text-gray-400">
          {getCreatedDate() && (
            <div className="flex items-center gap-1">
              <Icon icon="tabler:calendar" className="h-3 w-3" />
              <span>{getCreatedDate()}</span>
            </div>
          )}
        </div> */}

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full sm:w-auto text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 border border-blue-500/20 transition-all duration-200"
            >
              <Icon icon="tabler:edit" className="h-4 w-4 mr-1" />
              Editar
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-700 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-2">
                <Icon icon="tabler:star" className="h-5 w-5 text-yellow-400" />
                Editar Reseña
              </DialogTitle>
            </DialogHeader>
            <HandleChangeReviews review={review} refetch={refetch} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CardReview;
