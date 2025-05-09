import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react/dist/iconify.js"
import { motion } from "framer-motion"
/* import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table" */
import { useMutation, useQuery } from "@tanstack/react-query"
import { getAllPlans } from "@/services/PlansService"
import { Plan } from "@/interfaces/Plan"
import { Link, useLocation } from "react-router-dom"
import { useAuthContext } from "@/contexts/authContext"
import CountUp from "@/utils/functions/CountUp"
import { createOrderByPlan } from "@/services/OrderService"
import { useEffect } from "react"
import { RenderPricesSkeletons } from "../skeletons/PricesSkeleton"

const SubscriptionSection = () => {
  const location = useLocation()
  const { authUser } = useAuthContext()
  const id = location.search.split("=")[1]
  const { data, isPending } = useQuery({
    queryKey: ["plans"],
    queryFn: getAllPlans,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 60 * 24,
  })

  const { mutate } = useMutation({
    mutationKey: ["create-order"],
    mutationFn: (id: string) => {
      return createOrderByPlan(id)
    },
  })

  useEffect(() => {
    if (id) return mutate(id)
  }, [])
  return (
    <main className="flex flex-col gap-8 w-full bg-linear-to-t from-gray-main/20 to-gray-main">
      <section className="flex flex-col gap-8 px-4 md:px-6 pb-6">
        <div className="flex flex-col gap-4 items-center justify-center text-center">
          <div className="flex flex-col gap-4">
            <motion.h2
              initial={{ y: 100 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold tracking-tighter text-white sm:text-5xl"
            >
              Planes y precios
            </motion.h2>

            <motion.p
              initial={{ y: 50 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              className="max-w-[600px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
            >
              Elige el plan que mejor se adapte a tus necesidades.
            </motion.p>
          </div>
        </div>

        <div className="grid gap-8 gap-y-14 lg:grid-cols-3 place-items-center">
          {isPending ? (
            RenderPricesSkeletons()
          ) : (
            data?.data.map((plan: Plan) => (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.2 }}
                viewport={{ once: true }}
                className="flex flex-col gap-2 rounded-lg border bg-black-main px-10 py-4 w-full h-full max-w-md"
                key={plan.id}
              >
                <h3 className="text-2xl font-bold text-white">{plan.nombre}</h3>
                <span className="text-base font-extralight text-gray-400">
                  {plan.descripcion}
                </span>

                <div className="text-center">
                  <span className="text-4xl font-bold text-white">
                    $
                    <CountUp
                      from={0}
                      to={plan.precio}
                      separator=","
                      direction="up"
                      duration={1}
                      className="count-up-text"
                    />
                  </span>
                </div>
                <ul className="my-4 space-y-2 text-gray-400">
                  <li className="flex gap-4 text-base items-center">
                    <Icon
                      icon="fluent-mdl2:accept-medium"
                      width="16"
                      height="16"
                    />
                    {plan.turnosMaximos} turnos mensuales
                  </li>
                  <li className="flex gap-4 text-base items-center">
                    <Icon
                      icon="fluent-mdl2:accept-medium"
                      width="16"
                      height="16"
                    />
                    {plan.cantDias} días de prueba
                  </li>
                  {/* <li className="flex gap-4 text-base items-center">
                  <Icon
                    icon="fluent-mdl2:accept-medium"
                    width="16"
                    height="16"
                  />
                  Reportes básicos {plan.}
                </li> */}
                </ul>
                <Link
                  className="flex items-end w-full h-full"
                  to={
                    authUser == null
                      ? "/auth/iniciar-sesion"
                      : `/prices?id=${plan.id}`
                  }
                >
                  <Button variant="solid" className="w-full">
                    Comenzar ahora
                  </Button>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </section>
      {/* <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col gap-2 rounded-lg border bg-[#080808] p-10"
          >
            <h3 className="text-2xl font-bold text-white">Gratuito</h3>
            <span className="text-base font-extralight text-gray-400">
              Perfecto para empresas pequeñas
            </span>

            <ul className="my-4 space-y-2 text-gray-400">
              <li className="flex gap-4 text-base items-center">
                <Icon icon="fluent-mdl2:accept-medium" width="16" height="16" />
                Hasta 50 turnos mensuales
              </li>
              <li className="flex gap-4 text-base items-center">
                <Icon icon="fluent-mdl2:accept-medium" width="16" height="16" />
                Gestión básica de clientes
              </li>
              <li className="flex gap-4 text-base items-center">
                <Icon icon="fluent-mdl2:accept-medium" width="16" height="16" />
                Reportes básicos
              </li>
            </ul>
            <Button className="mt-auto bg-[#007FFF] text-white hover:bg-[#0d3868]">
              Comenzar gratis
            </Button>
          </motion.div>
          
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col gap-4 rounded-lg border border-[#007FFF] bg-[#0d3868] p-10 relative w-full"
          >
            <div className="absolute -top-4 left-0 right-0 mx-auto rounded-full bg-[#007FFF] px-3 py-1 text-sm text-white w-fit">
              POPULAR
            </div>
            <h3 className="text-2xl font-bold text-white">Mensual</h3>
            <span className="text-base font-extralight text-gray-400">
              Perfecto para empresas pequeñas
            </span>

            <div className="text-center">
              <span className="text-4xl font-bold text-white">$59</span>
            </div>
            <ul className="flex flex-col gap-4 text-gray-200">
              <li className="flex gap-4 text-base items-center">
                <Icon icon="fluent-mdl2:accept-medium" width="16" height="16" />
                Turnos ilimitados
              </li>
              <li className="flex gap-4 text-base items-center">
                <Icon icon="fluent-mdl2:accept-medium" width="16" height="16" />
                Gestión avanzada de clientes
              </li>
              <li className="flex gap-4 text-base items-center">
                <Icon icon="fluent-mdl2:accept-medium" width="16" height="16" />
                Reportes detallados
              </li>
              <li className="flex gap-4 text-base items-center">
                <Icon icon="fluent-mdl2:accept-medium" width="16" height="16" />
                Notificaciones SMS
              </li>
            </ul>
            <Button className="mt-auto bg-white text-[#007FFF] hover:bg-gray-100">
              Comenzar ahora
            </Button>
          </motion.div>
          
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col gap-4 rounded-lg border bg-[#080808] p-10"
          >
            <h3 className="text-2xl font-bold text-white">Anual</h3>
            <span className="text-base font-extralight text-gray-400">
              Perfecto para empresas pequeñas
            </span>

            <div className="text-center">
              <span className="text-4xl font-bold text-white">$99</span>
            </div>
            <ul className="flex flex-col gap-4 text-gray-400">
              <li className="flex gap-4 text-base items-center">
                <Icon icon="fluent-mdl2:accept-medium" width="16" height="16" />
                Todo lo del plan Profesional
              </li>
              <li className="flex gap-4 text-base items-center">
                <Icon icon="fluent-mdl2:accept-medium" width="16" height="16" />
                Múltiples locaciones
              </li>
              <li className="flex gap-4 text-base items-center">
                <Icon icon="fluent-mdl2:accept-medium" width="16" height="16" />
                API personalizada
              </li>
              <li className="flex gap-4 text-base items-center">
                <Icon icon="fluent-mdl2:accept-medium" width="16" height="16" />
                Soporte prioritario
              </li>
            </ul>
            <Button className="mt-auto bg-[#007FFF] text-white hover:bg-[#0d3868]">
              Comenzar ahora
            </Button>
          </motion.div> */}
    </main>
  )
}
export default SubscriptionSection
