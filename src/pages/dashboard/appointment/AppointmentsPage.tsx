import "react-big-calendar/lib/css/react-big-calendar.css"
import Layout from "../layout"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useLocation } from "react-router-dom"
import {
  getAppointmentsWithDateByBarberId,
  updateStatus,
} from "@/services/AppointmentService"
import CardAppointment from "./components/CardAppointment"
import { Appointment } from "@/interfaces/Appointment"
// useEffect fue movido a la importación principal de React
import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Calendar,
  CalendarDays,
  Filter,
  CheckSquare,
  Square,
} from "lucide-react"
import moment from "moment"

// Definimos una clave constante para el localStorage
const DATE_RANGE_KEY = "appointments_date_range_preference"

const AppointmentsPage = () => {
  document.title = "Cortate bien | Turnos"
  const [select, setSelect] = useState<Array<string> | undefined>()
  const [state, setState] = useState("")
  const [filter, setFilter] = useState<string>("")

  // La fecha de inicio siempre será el día actual al cargar la página
  const [date, setDate] = useState<string | undefined>(
    moment().format("YYYY-MM-DD")
  )

  // --- MODIFICACIÓN 1: Inicialización de dateEnd desde localStorage ---
  // La fecha de fin se inicializa con una función que se ejecuta una sola vez.
  const [dateEnd, setDateEnd] = useState<string | undefined>(() => {
    try {
      const savedRange = localStorage.getItem(DATE_RANGE_KEY)
      // Si hay un rango guardado, úsalo. Si no, usa 7 días por defecto.
      const rangeInDays = savedRange ? parseInt(savedRange, 10) : 7

      // Asegurarse de que el valor sea un número válido
      if (!isNaN(rangeInDays)) {
        // Calcula la fecha de fin: hoy + la duración guardada
        return moment().add(rangeInDays, "days").format("YYYY-MM-DD")
      }
    } catch (error) {
      console.error(
        "Error al leer el rango de fechas desde localStorage:",
        error
      )
    }
    // Si algo falla o no hay nada guardado, se usa el valor por defecto
    return moment().add(7, "days").format("YYYY-MM-DD")
  })

  const [errorDate, setErrorDate] = useState(false)
  const { search } = useLocation()
  const id = search.split("=")[1]

  const { data, refetch } = useQuery({
    queryKey: ["get-appointments-by-barber", id, date, dateEnd, filter],
    queryFn: () => {
      return getAppointmentsWithDateByBarberId(id, date, dateEnd, filter)
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24,
    retry: false,
    enabled: date != undefined,
  })

  const { mutate, error, isPending } = useMutation({
    mutationKey: ["put-states-barber"],
    mutationFn: () => {
      if (select == undefined)
        return Promise.reject("No hay turnos seleccionados")

      const data = select.map((id) => ({ id: id, estado: state }))

      return updateStatus(id, data)
    },
    onSuccess: () => {
      refetch()
      setSelect(undefined)
      setState("")
    },
  })

  useEffect(() => {
    refetch()
  }, [date, dateEnd, filter])

  useEffect(() => {
    if (date && dateEnd) {
      const startDate = moment(date)
      const endDate = moment(dateEnd)

      if (
        startDate.isValid() &&
        endDate.isValid() &&
        endDate.isSameOrAfter(startDate)
      ) {
        const diffInDays = endDate.diff(startDate, "days")
        // Guardar la diferencia de días en localStorage
        localStorage.setItem(DATE_RANGE_KEY, diffInDays.toString())
      }
    }
  }, [date, dateEnd])

  function handleSelect(idSelected: string) {
    let seleteds
    if (select == undefined) return setSelect([idSelected])

    seleteds = select
    if (!seleteds.includes(idSelected)) {
      return setSelect([...seleteds, idSelected])
    }

    return setSelect(seleteds.filter((id) => id !== idSelected))
  }

  const formatDateRange = () => {
    if (date === dateEnd) {
      return new Date(date || "").toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }
    return `${new Date(date || "").toLocaleDateString("es-ES")} - ${new Date(
      dateEnd || ""
    ).toLocaleDateString("es-ES")}`
  }

  return (
    <Layout>
      <div className="flex flex-col gap-6 p-4 sm:p-6 w-full min-h-screen">
        {/* Header Section */}
        <div className="flex flex-col gap-2 bg-gray-main rounded-lg shadow border p-6">
          <div className="flex items-center justify-center gap-3">
            <Calendar className="h-8 w-8 text-white" />
            <h1 className="text-4xl font-bold text-white">Turnos</h1>
          </div>

          <p className="text-xl font-light text-center">{formatDateRange()}</p>

          {/* Date Range and Stats */}
          {/* Date Range Selector */}
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-white" />
            <Label className="text-sm font-medium">Rango de fechas</Label>
          </div>
          <div className="flex w-full gap-6">
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="space-y-2">
                <Label className="text-xs">Fecha inicio</Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="max-w-40"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Fecha fin</Label>
                <Input
                  type="date"
                  value={dateEnd}
                  onChange={(e) => {
                    /* revisa que la fecha ingresada sea posterior a la fecha de inicio y que no sea posterior a un mes desde la fecha de inicio  */
                    if (
                      moment(e.target.value).isBefore(date) ||
                      moment(e.target.value).isAfter(
                        moment(date).add(1, "months")
                      )
                    ) {
                      setErrorDate(true)
                      return
                    }
                    if (errorDate) setErrorDate(false)

                    setDateEnd(e.target.value)
                  }}
                  min={date}
                  className="max-w-40"
                />
              </div>
            </div>
          </div>
          {errorDate && (
            <p className="text-sm text-red-500">
              La fecha fin debe ser posterior a la fecha de inicio y no debe ser
              posterior a un mes desde la fecha de inicio
            </p>
          )}
        </div>

        {/* Bulk Actions Section */}
        {data?.data?.length > 0 && (
          <div className="bg-gray-main rounded-lg shadow border p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckSquare className="h-5 w-5 text-white" />
              <Label className="text-lg font-semibold">
                Cambiar los estados
              </Label>
            </div>

            <div className="flex flex-col gap-4 items-start">
              <div className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (select?.length === data?.data.length) {
                      return setSelect(undefined)
                    }
                    return setSelect(
                      data?.data.map((item: Appointment) => item.id)
                    )
                  }}
                  className="flex items-center gap-2"
                >
                  {select?.length === data?.data.length ? (
                    <CheckSquare className="h-4 w-4" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                  Seleccionar todos ({data?.data.length})
                </Button>

                {select && select.length > 0 && (
                  <span className="text-sm text-white">
                    {select.length} seleccionados
                  </span>
                )}
              </div>

              {select != undefined && select?.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <Select onValueChange={(e) => setState(e)} value={state}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="Cambiar estado" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-main text-white w-full">
                      <SelectItem value="CONFIRMADO">✅ Aceptados</SelectItem>
                      <SelectItem value="CANCELADO">❌ Cancelados</SelectItem>
                      <SelectItem value="COMPLETADO">
                        ✔️ Completados
                      </SelectItem>
                      <SelectItem value="REPROGRAMADO">
                        📅 Reprogramados
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="simple"
                    disabled={state === "" || isPending}
                    onClick={() => mutate()}
                    className="w-full sm:w-auto"
                  >
                    {isPending ? "Procesando..." : "Confirmar"}
                  </Button>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-3">
                <small className="font-bold text-red-500">
                  {error.message}
                </small>
              </div>
            )}
          </div>
        )}

        {/* Filter Section */}
        <div className="bg-gray-main rounded-lg shadow border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-white" />
            <Label className="text-lg font-semibold">Filtros</Label>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant={filter === "" ? "secondary" : "simple"}
              disabled={filter === ""}
              onClick={() => setFilter("")}
            >
              Sin filtros
            </Button>

            <Button
              variant={filter === "PENDIENTE" ? "secondary" : "simple"}
              disabled={filter === "PENDIENTE"}
              onClick={() => setFilter("PENDIENTE")}
            >
              Pendientes
            </Button>

            <Button
              variant={filter === "CONFIRMADO" ? "secondary" : "simple"}
              disabled={filter === "CONFIRMADO"}
              onClick={() => setFilter("CONFIRMADO")}
            >
              Aceptados
            </Button>

            <Button
              variant={filter === "CANCELADO" ? "secondary" : "simple"}
              disabled={filter === "CANCELADO"}
              onClick={() => setFilter("CANCELADO")}
            >
              Cancelados
            </Button>

            <Button
              variant={filter === "REPROGRAMADO" ? "secondary" : "simple"}
              disabled={filter === "REPROGRAMADO"}
              onClick={() => setFilter("REPROGRAMADO")}
            >
              Reprogramados
            </Button>

            <Button
              variant={filter === "COMPLETADO" ? "secondary" : "simple"}
              disabled={filter === "COMPLETADO"}
              onClick={() => setFilter("COMPLETADO")}
            >
              Completados
            </Button>
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {data?.data?.map((appointment: Appointment) => (
            <CardAppointment
              appointment={appointment}
              refetch={refetch}
              selected={select?.includes(appointment.id) ?? false}
              handleAddSelect={() => handleSelect(appointment.id)}
              key={appointment.id}
            />
          ))}

          {data?.data?.length === 0 && (
            <div className="bg-gray-main rounded-lg shadow border p-12">
              <div className="flex flex-col items-center justify-center text-center">
                <Calendar className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-center">
                  No hay turnos para este rango de fechas.
                </h3>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default AppointmentsPage
