import { useQuery } from "@tanstack/react-query";
import Layout from "../Layout";
import { getPlansAdmin } from "@/services/PlansService";
import { Plan } from "@/interfaces/Plan";
import CardPlan from "./components/CardPlan";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChangePlan } from "./components/ChangePlan";

const PlansPage = () => {
  const { data, refetch } = useQuery({
    queryKey: ["plans"],
    queryFn: getPlansAdmin,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 60 * 24,
  });

  return (
    <Layout>
      <main className="flex flex-col gap-8 h-full w-full items-start p-2 overflow-x-hidden">
        <section className="flex justify-between items-center w-full">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Planes de Suscripción
            </h1>
            <p className="text-gray-400 mt-1">
              Gestiona los planes disponibles para las barberías
            </p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary" className="px-6">
                Crear Nuevo Plan
              </Button>
            </DialogTrigger>
            <DialogContent
              forceMount
              className="bg-gray-main border-white/10 text-white sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-xl"
            >
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center mb-4 text-white">
                  Crear Nuevo Plan
                </DialogTitle>
              </DialogHeader>
              <ChangePlan refetch={refetch} />
            </DialogContent>
          </Dialog>
        </section>

        {data?.data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 w-full bg-gray-main rounded-lg border border-white/5">
            <p className="text-lg">No hay planes creados aún.</p>
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
            {data?.data.map((plan: Plan) => (
              <CardPlan key={plan.id} plan={plan} refetch={refetch} />
            ))}
          </section>
        )}
      </main>
    </Layout>
  );
};

export default PlansPage;
