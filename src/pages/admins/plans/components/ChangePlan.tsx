import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { planSchema } from "@/utils/schemas/planSchema"
import { Plan } from "@/interfaces/Plan"
import { createPlan, updatePlan } from "@/services/PlansService"

interface ChangePlanProps {
  plan?: Plan
  refetch?: Function
}

export function ChangePlan({ plan, refetch }: ChangePlanProps) {
  const { mutate, isSuccess, isPending } = useMutation({
    mutationKey: ["create-plan"],
    mutationFn: (values: any) => {
      return createPlan(values)
    },
    onSuccess: () => {
      if (refetch) return refetch()
    },
  })

  const {
    mutate: update,
    isSuccess: isSuccessUpdate,
    isPending: isPendingUpdate,
  } = useMutation({
    mutationKey: ["update-plan"],
    mutationFn: (values: any) => {
      if (plan != undefined) {
        return updatePlan(plan.id, values)
      }
      throw new Error("Plania no encontrada")
    },
    onSuccess: () => {
      if (refetch) return refetch()
    },
  })

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      nombre: plan?.nombre ? plan?.nombre : "",
      descripcion: plan?.descripcion ? plan?.descripcion : "",
      precio: plan?.precio ? plan?.precio.toString() : "0",
      turnosMaximos: plan?.turnosMaximos ? plan?.turnosMaximos.toString() : "0",
      cantDias: plan?.cantDias ? plan?.cantDias.toString() : "0",
    },
    resolver: zodResolver(planSchema),
  })

  const handleSubmitForm = (data: any) => {
    if (plan != undefined) return update(data)
    mutate(data)
  }

  return (
    <form
      className="flex flex-col w-full"
      onSubmit={handleSubmit(handleSubmitForm)}
    >
      {isSuccess || isSuccessUpdate ? (
        <span className="text-white text-center">
          {plan != undefined
            ? "Plan actualizado correctamente"
            : "Plan creado correctamente"}
        </span>
      ) : (
        <div className="flex flex-col gap-3 w-full">
          <div className="flex flex-col gap-2">
            <Label>Nombre</Label>
            <Input
              type="text"
              placeholder="Ingrese su nombre"
              {...register("nombre")}
              disabled={isPending || isPendingUpdate}
            />
            <span className="text-sm text-red-600">
              {errors.nombre?.message}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Descripcion</Label>
            <Textarea
              placeholder="Ingrese una descripcion"
              {...register("descripcion")}
              rows={4}
              disabled={isPending || isPendingUpdate}
            />
            <span className="text-sm text-red-600">
              {errors.descripcion?.message}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Precio</Label>
            <Input
              type="number"
              placeholder="Ingrese el precio"
              {...register("precio")}
              disabled={isPending || isPendingUpdate}
            />
            <span className="text-sm text-red-600">
              {errors.precio?.message}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Turnos Maximos</Label>
            <Input
              type="number"
              placeholder="Ingrese el precio"
              {...register("turnosMaximos")}
              disabled={isPending || isPendingUpdate}
            />
            <span className="text-sm text-red-600">
              {errors.turnosMaximos?.message}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Cantidad de dias</Label>
            <Input
              type="number"
              placeholder="Ingrese la cantidad de dias"
              {...register("cantDias")}
              disabled={isPending || isPendingUpdate}
            />
            <span className="text-sm text-red-600">
              {errors.cantDias?.message}
            </span>
          </div>

          <Button
            variant="simple"
            type="submit"
            disabled={isPending || isPendingUpdate}
          >
            {plan ? "Actualizar plan" : "Agregar plan"}
          </Button>
        </div>
      )}
    </form>
  )
}
