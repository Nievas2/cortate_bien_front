import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react/dist/iconify.js"

const SubscriptionSection = () => {
  return (
    <section id="pricing" className="w-full">
      <div className="flex flex-col gap-8 px-4 md:px-6">

        <div className="flex flex-col gap-4 items-center justify-center text-center">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-bold tracking-tighter text-white sm:text-5xl">
              Planes y precios
            </h2>

            <p className="max-w-[600px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Elige el plan que mejor se adapte a tus necesidades
            </p>

          </div>

        </div>

        <div className="grid max-w-5xl gap-8 lg:grid-cols-3 mx-auto">
          {/* Gratuito Plan */}
          <div className="flex flex-col gap-2 rounded-lg border bg-[#080808] p-10">
            <h3 className="text-2xl font-bold text-white">Gratuito</h3>
            <span className="text-base font-extralight text-gray-400">Perfecto para empresas pequeñas</span>

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
          </div>
          {/* Pro Plan */}
          <div className="flex flex-col gap-4 rounded-lg border border-[#007FFF] bg-[#0d3868] p-10 relative w-full">
            <div className="absolute -top-4 left-0 right-0 mx-auto rounded-full bg-[#007FFF] px-3 py-1 text-sm text-white w-fit">
              POPULAR
            </div>
            <h3 className="text-2xl font-bold text-white">Mensual</h3>
            <span className="text-base font-extralight text-gray-400">Perfecto para empresas pequeñas</span>

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
          </div>
          {/* Enterprise Plan */}
          <div className="flex flex-col gap-4 rounded-lg border bg-[#080808] p-10">
            <h3 className="text-2xl font-bold text-white">Anual</h3>
            <span className="text-base font-extralight text-gray-400">Perfecto para empresas pequeñas</span>

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
          </div>
        </div>
      </div>
    </section>
  )
}
export default SubscriptionSection