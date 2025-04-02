import { useAuthContext } from "@/contexts/authContext"
import { Notification } from "@/interfaces/Notification"
import {
  getNotificationsBarber,
  getNotificationsUser,
  readNotificationBarber,
  readNotificationClient,
} from "@/services/NotificationService"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useLocation } from "react-router-dom"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Icon } from "@iconify/react/dist/iconify.js"
import { Button } from "@/components/ui/button"
import { useCallback, useEffect, useState } from "react"

const Notifications = () => {
  const [filter, setFilter] = useState<string>("")
  const [filterViewed, setFilterViewed] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<string>("1")
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { authUser } = useAuthContext()
  const { search } = useLocation()
  const id = search.split("=")[1]

  const { data, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => {
      if (authUser == null) return Promise.reject("No hay notificaciones")
      if (authUser?.user.tipo_de_cuenta == "BARBERO" && id.length > 0) {
        return getNotificationsBarber(id, currentPage, filter, filterViewed)
      }
      return getNotificationsUser(currentPage, filter, filterViewed)
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 60 * 24,
  })

  useEffect(() => {
    refetch()
  }, [currentPage])

  useEffect(() => {
    setCurrentPage("1")
    refetch()
  }, [filter, filterViewed])

  useEffect(() => {
    console.log(data)

    if (currentPage == "1") return setNotifications(data?.data.results)
    if (data)
      setNotifications((prevNotis) => prevNotis.concat(data.data.results))
  }, [data])

  useEffect(() => {
    if (
      authUser?.user.tipo_de_cuenta == "BARBERO" &&
      id != undefined &&
      id.length > 0
    )
      refetch()
  }, [id])

  const listNotificationNotRead = useCallback(() => {
    if (notifications == undefined) return []
    return notifications.filter(
      (notification: Notification) => notification.leido == false
    )
  }, [notifications])

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          {id !== undefined && (
            <NavigationMenuTrigger className="relative">
              <Icon icon="material-symbols:notifications" className="size-6" />
              {data && listNotificationNotRead().length > 0 && (
                <span className="absolute top-1 right-3 w-2 h-2 bg-blue-main rounded-full" />
              )}
            </NavigationMenuTrigger>
          )}
          <NavigationMenuContent>
            <main className="flex flex-col gap-2 overflow-y-auto bg-gray-main">
              <h3 className="text-md font-bold p-2">Notificaciones</h3>
              <hr className="text-gray-main" />

              <section className="flex flex-wrap gap-2 px-2">
                <Button
                  size="smallRounded"
                  variant={filter === "" ? "secondary" : "simple"}
                  disabled={filter === ""}
                  onClick={() => setFilter("")}
                >
                  Todos
                </Button>

                <Button
                  size="smallRounded"
                  variant={filter === "PENDIENTE" ? "secondary" : "simple"}
                  disabled={filter === "PENDIENTE"}
                  onClick={() => setFilter("PENDIENTE")}
                >
                  Pendientes
                </Button>

                <Button
                  size="smallRounded"
                  variant={filter === "CONFIRMADO" ? "secondary" : "simple"}
                  disabled={filter === "CONFIRMADO"}
                  onClick={() => setFilter("CONFIRMADO")}
                >
                  Aceptados
                </Button>

                <Button
                  size="smallRounded"
                  variant={filter === "CANCELADO" ? "secondary" : "simple"}
                  disabled={filter === "CANCELADO"}
                  onClick={() => setFilter("CANCELADO")}
                >
                  Cancelados
                </Button>

                <Button
                  size="smallRounded"
                  variant={filter === "REPROGRAMADO" ? "secondary" : "simple"}
                  disabled={filter === "REPROGRAMADO"}
                  onClick={() => setFilter("REPROGRAMADO")}
                >
                  Reprogramados
                </Button>

                <Button
                  size="smallRounded"
                  variant={filter === "COMPLETADO" ? "secondary" : "simple"}
                  disabled={filter === "COMPLETADO"}
                  onClick={() => setFilter("COMPLETADO")}
                >
                  Completados
                </Button>
              </section>

              <section className="flex gap-2 px-2">
                <Button
                  size="smallRounded"
                  variant={filterViewed === "" ? "secondary" : "simple"}
                  disabled={filterViewed === ""}
                  onClick={() => setFilterViewed("")}
                >
                  Todos
                </Button>

                <Button
                  size="smallRounded"
                  variant={filterViewed === "true" ? "secondary" : "simple"}
                  disabled={filterViewed === "true"}
                  onClick={() => setFilterViewed("true")}
                >
                  Vistos
                </Button>

                <Button
                  size="smallRounded"
                  variant={filterViewed === "false" ? "secondary" : "simple"}
                  disabled={filterViewed === "false"}
                  onClick={() => setFilterViewed("false")}
                >
                  No vistos
                </Button>
              </section>

              <div className="flex flex-col gap-2">
                {notifications?.length == 0 ? (
                  <span className="py-4 text-center">
                    No hay notificaciones
                  </span>
                ) : (
                  <div className="flex flex-col px-2 gap-1 py-1">
                    {notifications?.map((notification: Notification) => (
                      <NotificationCard
                        notification={notification}
                        barberId={id ? id : undefined}
                        key={crypto.randomUUID()}
                      />
                    ))}
                  </div>
                )}
              </div>

              {data?.data.total_pages >= data?.data.current_page + 1 && (
                <div className="flex justify-center w-full pb-4">
                  <Button
                    onClick={() => {
                      const page = Number(currentPage) + 1
                      setCurrentPage(page.toString())
                    }}
                    variant={"simple"}
                    size={"smallRounded"}
                  >
                    Más notificaciones
                  </Button>
                </div>
              )}
            </main>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
export default Notifications

export function NotificationCard({
  notification,
  barberId,
}: {
  notification: Notification
  barberId?: string
}) {
  const queryClient = useQueryClient()
  const { mutate, isSuccess } = useMutation({
    mutationKey: ["readNotification"],
    mutationFn: () => {
      if (barberId) return readNotificationBarber(barberId, notification.id)
      return readNotificationClient(notification.id)
    },
    onSuccess: async () => {
      await queryClient.setQueryData(["notifications"], (old: any) => {
        return {
          ...old,
          data: {
            ...old.data,
            results: old.data.results.map((n: Notification) => {
              if (n.id == notification.id) return { ...n, leido: true }
              return n
            }),
          },
        }
      })
    },
  })

  useEffect(() => {}, [isSuccess])
  return (
    <button
      className={`flex flex-col gap-3 px-2 py-1 rounded-md border-l-4 text-sm relative bg-gray-main ${notification.estado == "PENDIENTE" ? "border-amber-500" : notification.estado == "CONFIRMADO" ? "border-green-500" : notification.estado == "REPROGRAMADO" ? "border-purple-500" : "border-red-500"}
      ${notification.leido ? "cursor-default" : "cursor-pointer"}
      `}
      onClick={() => {
        if (isSuccess || notification.leido) return console.log("ya leido")

        return mutate()
      }}
    >
      <span className="font-bold text-start">{notification.nombre}</span>
      <p className="text-gray-400 text-start">{notification.mensaje}</p>
      <div className="flex justify-between ">
        <span
          className={`${notification.estado == "PENDIENTE" ? "bg-amber-500" : notification.estado == "CONFIRMADO" ? "bg-green-500" : notification.estado == "REPROGRAMADO" ? "bg-purple-500" : "bg-red-500"} px-2 py-1 rounded-full w-fit`}
        >
          {notification.estado}
        </span>
        <p className="text-gray-400">
          {new Date(notification.fecha).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          })}
        </p>
      </div>
      {notification.leido == false && isSuccess === false && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-blue-main rounded-full" />
      )}
    </button>
  )
}
