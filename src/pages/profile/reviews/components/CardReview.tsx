import { Button } from "@/components/ui/button"
import { Review } from "@/interfaces/Review"
import { Icon } from "@iconify/react/dist/iconify.js"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import HandleChangeReviews from "./HandleChangeReviews"

const CardReview = ({ review }: { review: Review }) => {
  return (
    <div className="flex flex-col gap-2 rounded-xl shadow-md shadow-gray-900 border border-gray-900 w-full p-2">
      <span className="text-center font-bold">{review.barberia}</span>
      <p className="line-clamp-4 text-sm">{review.descripcion}</p>
      <div className="flex items-center justify-between ">
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: review.calificacion }).map((_, index) => (
            <span key={index}>
              <Icon icon="material-symbols:star" color="gold" width={20} />
            </span>
          ))}
        </div>
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
        </Dialog>
      </div>
    </div>
  )
}
export default CardReview
