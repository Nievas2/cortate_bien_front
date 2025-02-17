import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createReview } from "@/services/ReviewService"
import { createReviewSchema } from "@/utils/schemas/reviewSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { useState } from "react"
import { useForm } from "react-hook-form"

interface HandleChangeReviewsProps {
  idBarber?: string
}
const HandleChangeReviews = ({ idBarber }: HandleChangeReviewsProps) => {
  const [successStatus, setSuccessStatus] = useState(false)
  const [qualification, setQualification] = useState<string>("")

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

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      calificacion: "",
      descripcion: "",
    },
    resolver: zodResolver(createReviewSchema),
  })

  const handleSubmitReview = handleSubmit((values) => {
    if (idBarber != undefined) return mutateCreate(values)
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
                  variant={
                    qualification === String(index + 1) ? "secondary" : "ghost"
                  }
                  type="button"
                  className="border border-b-blue-main rounded-lg"
                  onClick={() => {
                    setQualification(String(index + 1))
                    setValue("calificacion", String(index + 1))
                  }}
                >
                  {index + 1}
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
          

          <Button variant="simple">Guardar</Button>
        </>
      )}
    </form>
  )
}
export default HandleChangeReviews
