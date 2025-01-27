import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react/dist/iconify.js"
import { motion } from "framer-motion"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useQuery } from "@tanstack/react-query"
import { getAllPlans } from "@/services/PlansService"
import { Plan } from "@/interfaces/Plan"
import { Link } from "react-router-dom"
import { useAuthContext } from "@/contexts/authContext"

const SubscriptionSection = () => {
  const { authUser } = useAuthContext()
  const { data } = useQuery({
    queryKey: ["plans"],
    queryFn: getAllPlans,
  })
  return (
    <main className="flex flex-col gap-8 w-full bg-linear-to-t from-gray-main/20 to-gray-main">
      <section className="flex flex-col gap-8 px-4 md:px-6">
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
              Elige el plan que mejor se adapte a tus necesidades
            </motion.p>
          </div>
        </div>

        <div className="grid max-w-5xl gap-8 gap-y-14 lg:grid-cols-3 mx-auto">
          {data?.data.map((plan: Plan, id: number) => (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col gap-2 rounded-lg border bg-[#080808] p-10"
              key={id}
            >
              <h3 className="text-2xl font-bold text-white">{plan.nombre}</h3>
              <span className="text-base font-extralight text-gray-400">
                {plan.descripcion}
              </span>

              <div className="text-center">
                <span className="text-4xl font-bold text-white">
                  $ {plan.precio}
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
              <Link className="w-full" to={authUser == null ? "/auth/iniciar-sesion" : `/prices?id=${id}`}>
                <Button className=" w-full bg-[#007FFF] text-white hover:bg-[#0d3868]">
                  Comenzar ahora
                </Button>
              </Link>
            </motion.div>
          ))}

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
        </div>
      </section>

      <section className="flex flex-col gap-8 px-4 md:px-6 pb-3 w-full">
        <div className="flex flex-col gap-4 items-center justify-center text-center">
          <div className="flex flex-col gap-4">
            <p className="max-w-[600px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Mas detalles sobre cada plan que nosotros ofrecemos.
            </p>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="border border-gray-main text-base">
                Caracteristicas
              </TableHead>
              <TableHead className="border border-gray-main text-base">
                Gratuito
              </TableHead>
              <TableHead className="border border-gray-main text-base">
                Mensual
              </TableHead>
              <TableHead className="border border-gray-main text-base">
                Anual
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="border border-gray-main">
                ¿Cuánto cuesta?
              </TableCell>
              <TableCell className="border border-gray-main">Nada</TableCell>
              <TableCell className="border border-gray-main">Algo</TableCell>
              <TableCell className="border border-gray-main">
                Bastante
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>
    </main>
  )
}
export default SubscriptionSection
