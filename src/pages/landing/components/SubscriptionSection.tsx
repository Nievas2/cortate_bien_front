import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react/dist/iconify.js"
import { useMutation, useQuery } from "@tanstack/react-query"
import { getAllPlans } from "@/services/PlansService"
import { Plan } from "@/interfaces/Plan"
import { Link, useLocation } from "react-router-dom"
import { useAuthContext } from "@/contexts/authContext"
import CountUp from "@/utils/functions/CountUp"
import { createOrderByPlan } from "@/services/OrderService"
import { useEffect, useRef } from "react"
import { RenderPricesSkeletons } from "../skeletons/PricesSkeleton"

const SubscriptionSection = () => {
  const location = useLocation()
  const { authUser } = useAuthContext()
  const id = location.search.split("=")[1]

  // Refs para animaciones
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const plansRef = useRef<(HTMLDivElement | null)[]>([])
  const floatingElementsRef = useRef<(HTMLDivElement | null)[]>([])

  // TanStack Query
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

  // Efectos
  useEffect(() => {
    if (id) return mutate(id)
  }, [])

  // Animaciones mejoradas
  useEffect(() => {
    const section = sectionRef.current
    const title = titleRef.current
    const subtitle = subtitleRef.current

    if (section && title && subtitle) {
      // Animación del título
      title.style.transform = "translateY(50px)"
      title.style.opacity = "0"

      setTimeout(() => {
        title.style.transition = "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)"
        title.style.transform = "translateY(0)"
        title.style.opacity = "1"
      }, 200)

      // Animación del subtítulo
      subtitle.style.transform = "translateY(30px)"
      subtitle.style.opacity = "0"

      setTimeout(() => {
        subtitle.style.transition = "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)"
        subtitle.style.transform = "translateY(0)"
        subtitle.style.opacity = "1"
      }, 400)

      // Animación de los planes
      plansRef.current.forEach((plan, i) => {
        if (plan) {
          plan.style.transform = "translateY(60px)"
          plan.style.opacity = "0"

          setTimeout(
            () => {
              plan.style.transition = "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)"
              plan.style.transform = "translateY(0)"
              plan.style.opacity = "1"
            },
            600 + i * 150
          )
        }
      })

      // Animaciones de elementos flotantes
      floatingElementsRef.current.forEach((el, i) => {
        if (el) {
          el.style.animation = `float ${3.5 + i * 0.4}s ease-in-out infinite alternate`
          el.style.animationDelay = `${i * 0.4}s`
        }
      })
    }
  }, [data])

  // Función para determinar si un plan es popular (el del medio o el de mayor precio)
  const getPopularPlan = (plans: Plan[]) => {
    if (!plans || plans.length === 0) return null
    return plans.reduce((prev, current) =>
      prev.precio > current.precio ? prev : current
    )
  }

  const popularPlan = data ? getPopularPlan(data.data) : null

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col items-center justify-center w-full overflow-hidden pt-10 pb-20"
      style={{
        background: `
          radial-gradient(circle at 70% 30%, rgba(96, 165, 250, 0.12) 0%, transparent 50%),
          radial-gradient(circle at 30% 70%, rgba(30, 58, 138, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 70%),
          linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #0f172a 50%, #1e3a8a 75%, #0f172a 100%)
        `,
      }}
    >
      {/* Elementos flotantes de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Elementos geométricos flotantes */}
        <div
          ref={(el) => (floatingElementsRef.current[0] = el)}
          className="absolute top-24 left-32 w-6 h-6 bg-blue-400/20 rounded-full blur-sm"
        />
        <div
          ref={(el) => (floatingElementsRef.current[1] = el)}
          className="absolute top-40 right-24 w-4 h-4 bg-blue-500/25 rounded-full blur-sm"
        />
        <div
          ref={(el) => (floatingElementsRef.current[2] = el)}
          className="absolute bottom-32 left-24 w-5 h-5 bg-blue-300/30 rounded-full blur-sm"
        />
        <div
          ref={(el) => (floatingElementsRef.current[3] = el)}
          className="absolute bottom-20 right-32 w-3 h-3 bg-blue-600/25 rounded-full blur-sm"
        />

        {/* Líneas de conexión */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <defs>
            <linearGradient
              id="subscriptionLineGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path
            d="M200,150 Q500,100 800,250 T1200,200"
            stroke="url(#subscriptionLineGradient)"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
          />
          <path
            d="M100,400 Q400,350 700,450 T1000,400"
            stroke="url(#subscriptionLineGradient)"
            strokeWidth="1.5"
            fill="none"
            className="animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </svg>
      </div>

      {/* Grid de fondo sutil */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(96, 165, 250, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(96, 165, 250, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-4 gap-16">
        {/* Header */}
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <h2
            ref={titleRef}
            className="text-4xl font-black tracking-tight leading-tight lg:text-6xl text-white"
          >
            Planes y{" "}
            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
              precios
            </span>
          </h2>

          <p
            ref={subtitleRef}
            className="text-xl lg:text-2xl text-gray-300 max-w-3xl leading-relaxed font-light"
          >
            Elige el plan que mejor se adapte a tus necesidades.{" "}
            <span className="text-blue-400 font-medium">Sin compromiso</span>
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl place-items-center">
          {isPending
            ? RenderPricesSkeletons()
            : data?.data.map((plan: Plan, index: number) => {
                const isPopular = popularPlan && plan.id === popularPlan.id

                return (
                  <div
                    key={plan.id}
                    ref={(el) => (plansRef.current[index] = el)}
                    className="group relative w-full max-w-md"
                  >
                    {/* Efecto de brillo para plan popular */}
                    {isPopular && (
                      <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/30 via-blue-500/30 to-blue-400/30 rounded-3xl blur-xl opacity-60" />
                    )}

                    {/* Efecto hover */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-blue-500/20 to-blue-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />

                    {/* Tarjeta principal */}
                    <div
                      className={`relative flex flex-col gap-6 p-8 rounded-2xl border transition-all duration-500 hover:scale-105 h-full ${
                        isPopular
                          ? "border-blue-400/50 bg-gray-900/70 hover:border-blue-300/70"
                          : "border-blue-500/20 bg-gray-900/50 hover:bg-gray-900/70 hover:border-blue-400/40"
                      }`}
                    >
                      {/* Badge popular */}
                      {isPopular && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                          <div className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full border border-blue-400/50">
                            <span className="text-white text-sm font-semibold">
                              Más popular
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Header del plan */}
                      <div className="flex flex-col gap-4 text-center">
                        <h3 className="text-2xl font-bold text-white group-hover:text-blue-100 transition-colors duration-300">
                          {plan.nombre}
                        </h3>

                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-4xl font-black text-blue-400">
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

                        <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                          {plan.descripcion}
                        </p>
                      </div>

                      {/* Lista de características */}
                      <div className="flex flex-col gap-4 flex-grow">
                        <ul className="space-y-3">
                          <li className="flex items-center gap-3">
                            <Icon
                              icon="heroicons:check-circle"
                              className="text-blue-400 text-lg flex-shrink-0"
                            />
                            <span className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                              {plan.turnosMaximos} turnos diarios
                            </span>
                          </li>

                          {plan.cantDias != 0 && (
                            <li className="flex items-center gap-3">
                              <Icon
                                icon="heroicons:check-circle"
                                className="text-blue-400 text-lg flex-shrink-0"
                              />
                              <span className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                                {plan.cantDias} días de prueba
                              </span>
                            </li>
                          )}

                          {plan.autoActivacion && (
                            <li className="flex items-center gap-3">
                              <Icon
                                icon="heroicons:check-circle"
                                className="text-blue-400 text-lg flex-shrink-0"
                              />
                              <span className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                                No requiere de que un administrador revise su
                                barberia
                              </span>
                            </li>
                          )}
                          {plan.precioPromedio && (
                            <li className="flex items-center gap-3">
                              <Icon
                                icon="heroicons:check-circle"
                                className="text-blue-400 text-lg flex-shrink-0"
                              />
                              <span className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                                Permite agregar un precio promedio de sus
                                servicios
                              </span>
                            </li>
                          )}

                          {plan.servicios && (
                            <li className="flex items-center gap-3">
                              <Icon
                                icon="heroicons:check-circle"
                                className="text-blue-400 text-lg flex-shrink-0"
                              />
                              <span className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                                Puede agregar el tipo de servicios que brinda su
                                barberia
                              </span>
                            </li>
                          )}

                          {plan.servicios && (
                            <li className="flex items-center gap-3">
                              <Icon
                                icon="heroicons:check-circle"
                                className="text-blue-400 text-lg flex-shrink-0"
                              />
                              <span className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                                Puede asignar barberos a su barberia
                              </span>
                            </li>
                          )}

                          {plan.soportePrioritario && (
                            <li className="flex items-center gap-3">
                              <Icon
                                icon="heroicons:check-circle"
                                className="text-blue-400 text-lg flex-shrink-0"
                              />
                              <span className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                                Tiene prioridad de soporte ante cualquier
                                inconveniente
                              </span>
                            </li>
                          )}
                        </ul>
                      </div>

                      {/* CTA Button */}
                      <Link
                        className="flex items-end w-full"
                        to={
                          authUser == null
                            ? "/auth/iniciar-sesion"
                            : `/prices?id=${plan.id}`
                        }
                      >
                        <Button
                          variant="solid"
                          className={`w-full py-3 px-6 text-lg font-semibold rounded-lg transition-all duration-300 ${
                            isPopular
                              ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 border-0 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 text-white"
                              : "border-2 border-blue-500/30 hover:border-blue-400 hover:bg-blue-400/10 text-white bg-transparent"
                          }`}
                        >
                          <span className="flex items-center justify-center gap-2">
                            Comenzar ahora
                            <Icon
                              icon="heroicons:arrow-right"
                              className="text-lg"
                            />
                          </span>
                        </Button>
                      </Link>

                      {/* Elemento decorativo */}
                      <div
                        className={`absolute top-6 right-6 w-3 h-3 rounded-full transition-all duration-300 ${
                          isPopular
                            ? "bg-blue-400 group-hover:bg-blue-300 group-hover:scale-150"
                            : "bg-blue-400/50 group-hover:bg-blue-300 group-hover:scale-150"
                        }`}
                      />
                    </div>
                  </div>
                )
              })}
        </div>

        {/* Footer del pricing */}
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-gray-400 text-lg">
            ¿Necesitas algo personalizado?{" "}
            <a
              href="mailto:cortatebienapp@gmail.com"
              className="text-blue-400 hover:text-blue-300 font-medium underline transition-colors duration-300 cursor-pointer"
            >
              Contáctanos
            </a>
          </p>
        </div>
      </div>
      <style>{`
        @keyframes float {
          from { transform: translateY(0px) rotate(0deg); }
          to { transform: translateY(-15px) rotate(8deg); }
        }
      `}</style>
    </section>
  )
}

export default SubscriptionSection
