import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Review } from "@/interfaces/Review";
import { createReview, updateReview } from "@/services/ReviewService";
import { createReviewSchema } from "@/utils/schemas/reviewSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface HandleChangeReviewsProps {
  idBarber?: string;
  review?: Review;
  refetch?: Function;
}

const HandleChangeReviews = ({
  idBarber,
  review,
  refetch,
}: HandleChangeReviewsProps) => {
  const [successStatus, setSuccessStatus] = useState(false);
  const [qualification, setQualification] = useState<string>(
    String(review?.calificacion) || "1"
  );
  const [hoveredStar, setHoveredStar] = useState<number>(0);

  const isCreating = !!idBarber;

  const {
    mutate: mutateCreate,
    error: errorCreate,
    isPending: isPendingCreate,
  } = useMutation({
    mutationKey: ["create-review"],
    mutationFn: (values: { calificacion: string; descripcion: string }) => {
      return createReview({ id: idBarber!, review: values });
    },
    onSuccess: () => {
      reset();
      setSuccessStatus(true);
    },
  });

  const {
    mutate: mutateUpdate,
    error: errorUpdate,
    isPending: isPendingUpdate,
  } = useMutation({
    mutationKey: ["update-review"],
    mutationFn: (values: { calificacion: string; descripcion: string }) => {
      return updateReview({ id: review?.id!, review: values });
    },
    onSuccess: () => {
      if (refetch) refetch();
      reset();
      setSuccessStatus(true);
    },
  });

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      calificacion: review ? String(review.calificacion) : "1",
      descripcion: review ? review.descripcion : "",
    },
    resolver: zodResolver(createReviewSchema),
  });

  const watchedDescription = watch("descripcion");
  const isPending = isPendingCreate || isPendingUpdate;

  const handleSubmitReview = handleSubmit((values) => {
    if (isCreating) return mutateCreate(values);
    return mutateUpdate(values);
  });

  const handleStarClick = (starIndex: number) => {
    const newRating = String(starIndex + 1);
    setQualification(newRating);
    setValue("calificacion", newRating);
  };

  const getStarIcon = (index: number) => {
    const currentRating = hoveredStar || parseInt(qualification);
    if (index < currentRating) {
      return "tabler:star-filled";
    }
    return "tabler:star";
  };

  const getStarColor = (index: number) => {
    const currentRating = hoveredStar || parseInt(qualification);
    if (index < currentRating) {
      return "text-yellow-400";
    }
    return "text-gray-400";
  };

  if (successStatus) {
    return (
      <div className="text-center space-y-6 py-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 mb-4">
          <Icon icon="tabler:check" className="h-8 w-8 text-green-400" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {isCreating ? "¡Reseña Creada!" : "¡Reseña Actualizada!"}
          </h3>
          <p className="text-gray-400">
            {isCreating
              ? "Tu reseña ha sido publicada correctamente"
              : "Los cambios han sido guardados exitosamente"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmitReview} className="space-y-6">
      {/* Star Rating */}
      <div className="space-y-3">
        <Label className="text-white flex items-center gap-2">
          <Icon icon="tabler:star" className="h-4 w-4" />
          Calificación
        </Label>

        <div className="flex items-center justify-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10">
          {Array.from({ length: 5 }).map((_, index) => (
            <Button
              key={index}
              variant="ghost"
              type="button"
              size="sm"
              className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200"
              onClick={() => handleStarClick(index)}
              onMouseEnter={() => setHoveredStar(index + 1)}
              onMouseLeave={() => setHoveredStar(0)}
            >
              <Icon
                icon={getStarIcon(index)}
                className={`w-8 h-8 transition-all duration-200 ${getStarColor(index)} hover:scale-110`}
              />
            </Button>
          ))}
        </div>

        <div className="text-center">
          <span className="text-sm text-gray-400">
            {parseInt(qualification) === 1 && "Muy malo"}
            {parseInt(qualification) === 2 && "Malo"}
            {parseInt(qualification) === 3 && "Regular"}
            {parseInt(qualification) === 4 && "Bueno"}
            {parseInt(qualification) === 5 && "Excelente"}
          </span>
        </div>

        {errors.calificacion && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-red-400 text-sm flex items-center gap-2">
              <Icon icon="tabler:alert-circle" className="h-4 w-4" />
              {errors.calificacion.message}
            </p>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="space-y-3">
        <Label
          htmlFor="descripcion"
          className="text-white flex items-center gap-2"
        >
          <Icon icon="tabler:message-2" className="h-4 w-4" />
          Comentario
        </Label>

        <div className="relative">
          <Textarea
            id="descripcion"
            placeholder="Comparte tu experiencia en esta barbería..."
            {...register("descripcion")}
            rows={4}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 resize-none focus:ring-2 focus:ring-blue-500/50"
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
            {watchedDescription?.length || 0}/500
          </div>
        </div>

        {errors.descripcion && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-red-400 text-sm flex items-center gap-2">
              <Icon icon="tabler:alert-circle" className="h-4 w-4" />
              {errors.descripcion.message}
            </p>
          </div>
        )}
      </div>

      {/* Error Messages */}
      {((errorCreate instanceof AxiosError && errorCreate.response) ||
        (errorUpdate instanceof AxiosError && errorUpdate.response)) && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <div className="flex items-center gap-2">
            <Icon icon="tabler:alert-circle" className="h-5 w-5 text-red-400" />
            <div>
              <h4 className="text-red-400 font-medium text-sm">
                Error al procesar la reseña
              </h4>
              <p className="text-red-300 text-sm mt-1">
                {(errorCreate instanceof AxiosError &&
                  errorCreate.response?.data.message) ||
                  (errorUpdate instanceof AxiosError &&
                    errorUpdate.response?.data.message) ||
                  "Ha ocurrido un error inesperado. Intenta nuevamente."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            <span>{isCreating ? "Creando..." : "Actualizando..."}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Icon
              icon={isCreating ? "tabler:plus" : "tabler:device-floppy"}
              className="h-4 w-4"
            />
            <span>{isCreating ? "Crear Reseña" : "Guardar Cambios"}</span>
          </div>
        )}
      </Button>
    </form>
  );
};

export default HandleChangeReviews;
