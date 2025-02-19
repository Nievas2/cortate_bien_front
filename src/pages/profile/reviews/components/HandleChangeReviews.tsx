import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Review } from "@/interfaces/Review"
import { createReview, updateReview } from "@/services/ReviewService"
import { createReviewSchema } from "@/utils/schemas/reviewSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Icon } from "@iconify/react/dist/iconify.js"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { useState } from "react"
import { useForm } from "react-hook-form"

interface HandleChangeReviewsProps {
  idBarber?: string
  review?: Review
  refetch?: Function
}
const HandleChangeReviews = ({
  idBarber,
  review,
  refetch,
}: HandleChangeReviewsProps) => {
  const [successStatus, setSuccessStatus] = useState(false)
  const [qualification, setQualification] = useState<string>(
    String(review?.calificacion) ? String(review?.calificacion) : "1"
  )

  const { mutate: mutateCreate, error: errorCreate } = useMutation({
    mutationKey: ["create-review"],
    mutationFn: (values: { calificacion: string; descripcion: string }) => {
      return createReview({ id: idBarber!, review: values })
    },
    onSuccess: () => {
      reset()
      setSuccessStatus(true)
    },
  })

  const { mutate: mutateUpdate, error: errorUpdate } = useMutation({
    mutationKey: ["update-review"],
    mutationFn: (values: { calificacion: string; descripcion: string }) => {
      return updateReview({ id: review?.id!, review: values })
    },
    onSuccess: () => {
      if (refetch) refetch()
      reset()
      setSuccessStatus(true)
    },
  })

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      calificacion: review ? String(review.calificacion) : "",
      descripcion: review ? review.descripcion : "",
    },
    resolver: zodResolver(createReviewSchema),
  })

  const handleSubmitReview = handleSubmit((values) => {
    if (idBarber != undefined) return mutateCreate(values)
    return mutateUpdate(values)
  })

  return (
    <form onSubmit={handleSubmitReview} className="flex flex-col gap-8">
      {successStatus ? (
        <div className="flex flex-col gap-4">
          <span className="w-full text-center text-xl">Turno actualizado</span>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            <Label>Descripción</Label>
            <Textarea
              placeholder="Ingrese su reneña"
              {...register("descripcion")}
              rows={4}
            />
            {errors.descripcion && (
              <small className="text-red-500 font-bold">
                {errors.descripcion.message}
              </small>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex gap-4 items-center justify-center">
              {Array.from({ length: 5 }).map((_, index) => (
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => {
                    setQualification(String(index + 1))
                    setValue("calificacion", String(index + 1))
                  }}
                >
                  <Icon
                    icon={
                      qualification >= String(index + 1)
                        ? "material-symbols:star"
                        : "material-symbols:star-outline"
                    }
                    color={
                      qualification >= String(index + 1) ? "yellow" : "gray"
                    }
                    className="w-6 h-6"
                  />
                </Button>
              ))}
            </div>
            {errors.calificacion && (
              <small className="text-red-500 font-bold">
                {errors.calificacion.message}
              </small>
            )}
          </div>

          {errorCreate instanceof AxiosError && errorCreate.response && (
            <small className="text-red-500 font-bold">
              {errorCreate.response.data.message}
            </small>
          )}

          {errorUpdate instanceof AxiosError && errorUpdate.response && (
            <small className="text-red-500 font-bold">
              {errorUpdate.response.data.message}
            </small>
          )}

          <Button variant="simple">Guardar</Button>
        </>
      )}
    </form>
  )
}
export default HandleChangeReviews
