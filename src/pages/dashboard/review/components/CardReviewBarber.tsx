import { ReviewBarber } from "@/interfaces/Review"
import { Icon } from "@iconify/react/dist/iconify.js"

const CardReviewBarber = ({ review }: { review: ReviewBarber }) => {
  return (
    <div className="flex gap-2 rounded-xl shadow-md bg-gray-main shadow-gray-900 border border-gray-900 w-full p-2">
      <div className="flex flex-col gap-2 w-full">
        <div className="flex flex-col items-center justify-between">
          <span className="text-center font-bold w-full">
            {review.barberia}
          </span>
          <div className="flex items-center justify-center gap-2">
            {review.calificacion > 0 && (
              <div className="flex gap-2 items-center justify-start">
                {Array.from({ length: review.calificacion }).map((_, index) => (
                  <span key={index}>
                    <Icon
                      icon="material-symbols:star"
                      color="gold"
                      width={20}
                    />
                  </span>
                ))}
              </div>
            )}

            {!Number.isInteger(review.calificacion) && (
              <Icon icon="material-symbols:star-half" color="gold" width={20} />
            )}

            {Array.from({
              length: 5 - Math.ceil(review.calificacion),
            }).map((_, index) => (
              <span key={index}>
                <Icon
                  icon="material-symbols:star-outline"
                  stroke="1"
                  width={20}
                />
              </span>
            ))}
          </div>
        </div>
        <p className="text-sm">{review.descripcion}</p>
      </div>
    </div>
  )
}
export default CardReviewBarber
