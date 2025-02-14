/* import { Button } from "@/components/ui/button" */
import { ReviewBarber } from "@/interfaces/Review"
import { Icon } from "@iconify/react/dist/iconify.js" /* 
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog" */

const CardReviewBarber = ({ review }: { review: ReviewBarber }) => {
  return (
    <div className="flex flex-col gap-2 rounded-xl shadow-md shadow-gray-900 w-full p-2">
      <span className="text-center font-bold">{review.user}</span>
      <div className="flex items-center justify-center ">
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: review.calificacion }).map((_, index) => (
            <span key={index}>
              <Icon icon="material-symbols:star" color="gold" width={20} />
            </span>
          ))}
        </div>
        {/* 
        <Dialog>
          <DialogTrigger>
            <Button variant="ghost">Editar</Button>
          </DialogTrigger>
          <DialogContent forceMount>
            <DialogHeader>
              <DialogTitle>Dejar una reseña</DialogTitle>
            </DialogHeader>
            <HandleChangeReviews  />
          </DialogContent>
        </Dialog> */}
      </div>
      <p className="line-clamp-4 text-sm font-light">{review.descripcion}</p>
    </div>
  )
}
export default CardReviewBarber
