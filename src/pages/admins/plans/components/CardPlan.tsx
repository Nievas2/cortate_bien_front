import { Button } from "@/components/ui/button"
import { Plan } from "@/interfaces/Plan"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useMutation } from "@tanstack/react-query"
import { deletePlan } from "@/services/PlansService"
import { ChangePlan } from "./ChangePlan"

const CardPlan = ({ plan, refetch }: { plan: Plan; refetch?: Function }) => {
  const { mutate } = useMutation({
    mutationKey: ["deletePlan"],
    mutationFn: async () => {
      return await deletePlan(plan.id)
    },
  })
  return (
    <div className="flex flex-col gap-6 w-72 shadow-xl border bg-gray-main border-gray-900 shadow-gray-main p-6 rounded-md">
      <div className="flex flex-col gap-2">
        <span className="font-extrabold">Nombre: {plan.nombre}</span>
        <span className="font-bold">Precio: {plan.precio}</span>
        <span className="font-medium"> Turnos maximos: {plan.turnosMaximos}</span>
        <span className="font-medium"> Dias: {plan.cantDias}</span>
        <span className="line-clamp-3 text-xs font-extralight">{plan.descripcion}</span>
      </div>
      <div className="flex w-full gap-4">
        <Dialog>
          <DialogTrigger className="w-full">
            <Button className="w-full" variant="secondary">
              Editar
            </Button>
          </DialogTrigger>
          <DialogContent forceMount>
            <DialogHeader>
              <DialogTitle>Editar plan</DialogTitle>
            </DialogHeader>
            <ChangePlan plan={plan} refetch={refetch} />
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger className="w-full">
            <Button className="w-full" variant="ghost">
              Eliminar
            </Button>
          </DialogTrigger>
          <DialogContent forceMount>
            <DialogHeader>
              <DialogTitle>Eliminar barberia</DialogTitle>
            </DialogHeader>
            <p>¿Estas seguro que deseas eliminar este plan?</p>
            <p>
              No podra recuperarla de ninguna manera y se perdera toda la
              información que tenga
            </p>
            <div className="flex justify-between">
              <DialogClose>
                <Button variant="secondary">Cancelar</Button>
              </DialogClose>
              <Button variant="ghost" onClick={() => mutate()}>
                Eliminar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
export default CardPlan
