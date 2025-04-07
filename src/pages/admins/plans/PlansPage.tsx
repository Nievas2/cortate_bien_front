import { useQuery } from "@tanstack/react-query"
import Layout from "../Layout"
import { getPlansAdmin } from "@/services/PlansService"
import { Plan } from "@/interfaces/Plan"
import CardPlan from "./components/CardPlan"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ChangePlan } from "./components/ChangePlan"
const PlansPage = () => {
  const { data, refetch } = useQuery({
    queryKey: ["plans"],
    queryFn: getPlansAdmin,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 60 * 24,
  })
  return (
    <Layout>
      <main className="flex flex-col gap-8 w-full h-full p-6">
        <section className="flex justify-end items-center">
          <Dialog>
            <DialogTrigger>
              <Button variant="secondary">Crear Plan</Button>
            </DialogTrigger>
            <DialogContent forceMount>
              <DialogHeader>
                <DialogTitle>Crear plan</DialogTitle>
              </DialogHeader>
              <ChangePlan refetch={refetch} />
            </DialogContent>
          </Dialog>
        </section>
        <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 place-items-center">
          {data?.data.map((plan: Plan) => (
            <CardPlan key={plan.id} plan={plan} refetch={refetch} />
          ))}
        </section>
      </main>
    </Layout>
  )
}
export default PlansPage
