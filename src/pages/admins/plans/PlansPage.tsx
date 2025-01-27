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
import ChangePlan from "./components/ChangePlan"

const PlansPage = () => {
  const { data } = useQuery({
    queryKey: ["plans"],
    queryFn: getPlansAdmin,
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
                <DialogTitle>Editar plan</DialogTitle>
              </DialogHeader>
              <ChangePlan />
            </DialogContent>
          </Dialog>
        </section>
        <section className="flex flex-wrap">
          {data?.data.map((plan: Plan) => (
            <CardPlan key={plan.id} plan={plan} />
          ))}
        </section>
      </main>
    </Layout>
  )
}
export default PlansPage
