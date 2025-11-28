import { Button } from "@/components/ui/button";
import { Plan } from "@/interfaces/Plan";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { deletePlan } from "@/services/PlansService";
import { ChangePlan } from "./ChangePlan";

interface CardPlanProps {
  plan: Plan;
  refetch: Function;
}

export function CardPlan({ plan, refetch }: CardPlanProps) {
  const { mutate } = useMutation({
    mutationKey: ["delete-plan"],
    mutationFn: () => {
      return deletePlan(plan.id);
    },
    onSuccess: () => {
      refetch();
    },
  });

  return (
    <div className="flex flex-col gap-6 w-full bg-gray-main border border-white/5 shadow-lg p-6 rounded-lg">
      <div className="flex flex-col gap-2">
        <span className="font-extrabold text-white text-lg">
          Nombre: {plan.nombre}
        </span>
        <span className="font-bold text-blue-400">Precio: ${plan.precio}</span>
        <div className="flex flex-col gap-1 text-gray-300 text-sm">
          <span className="font-medium">
            {" "}
            Turnos maximos: {plan.turnosMaximos}
          </span>
          <span className="font-medium"> Dias: {plan.cantDias}</span>
        </div>

        <span className="line-clamp-3 text-xs font-extralight text-gray-400 mt-2">
          {plan.descripcion}
        </span>
        <span className="text-xs font-semibold text-blue-300 bg-blue-900/30 px-2 py-1 rounded-full w-fit mt-1">
          {plan.planTipo}
        </span>
      </div>
      <div className="flex w-full gap-4 mt-auto">
        <Dialog>
          <DialogTrigger className="w-full">
            <Button className="w-full" variant="secondary">
              Editar
            </Button>
          </DialogTrigger>
          <DialogContent
            forceMount
            className="bg-gray-main border-white/10 text-white sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-xl"
          >
            <DialogHeader>
              <DialogTitle className="text-white">Editar plan</DialogTitle>
            </DialogHeader>
            <ChangePlan plan={plan} refetch={refetch} />
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger className="w-full">
            <Button
              className="w-full text-red-400 hover:text-red-300 hover:bg-red-900/20"
              variant="ghost"
            >
              Eliminar
            </Button>
          </DialogTrigger>
          <DialogContent
            forceMount
            className="bg-gray-main border-white/10 text-white"
          >
            <DialogHeader>
              <DialogTitle className="text-white">Eliminar plan</DialogTitle>
            </DialogHeader>
            <p className="text-gray-300">
              ¿Estas seguro que deseas eliminar este plan?
            </p>
            <p className="text-gray-400 text-sm">
              No podra recuperarla de ninguna manera y se perdera toda la
              información que tenga
            </p>
            <div className="flex justify-between mt-4">
              <DialogClose>
                <Button variant="secondary">Cancelar</Button>
              </DialogClose>
              <Button
                variant="ghost"
                onClick={() => mutate()}
                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
              >
                Eliminar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default CardPlan;
