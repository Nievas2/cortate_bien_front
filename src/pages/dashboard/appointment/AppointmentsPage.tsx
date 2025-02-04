/* import { Calendar, dayjsLocalizer } from "react-big-calendar" */
import "react-big-calendar/lib/css/react-big-calendar.css"
import Layout from "../layout" /* 
import dayjs from "dayjs"
import "dayjs/locale/es" */
import { useQuery } from "@tanstack/react-query"
import { useLocation } from "react-router-dom"
import { getAppointmentsByBarberId } from "@/services/AppointmentService"
import CardAppointment from "./components/CardAppointment"
import { Appointment } from "@/interfaces/Appointment"
import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
/* dayjs.locale("es") */ /* 
const messages = {
  allDay: "Todo el día",
  previous: "Anterior",
  next: "Siguiente",
  today: "Hoy",
  month: "Mes",
  week: "Semana",
  day: "Día",
  agenda: "Agenda",
  date: "Fecha",
  time: "Hora",
  event: "Evento",
  noEventsInRange: "Sin eventos",
}

const localizer = dayjsLocalizer(dayjs) */
const AppointmentsPage = () => {
  const [date, setDate] = useState<string | undefined>(
    new Date().toISOString().split("T")[0]
  )
  const { search } = useLocation()
  const id = search.split("=")[1]
  const day = new Date().toISOString().split("T")[0]

  const { data, refetch } = useQuery({
    queryKey: ["get-appointments-by-barber"],
    queryFn: () => {
      return getAppointmentsByBarberId(id, date)
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24,
    retry: false,
  })

  useEffect(() => {
    refetch()
  }, [date])

  return (
    <Layout>
      <div className="flex flex-col gap-8 p-0 sm:p-3 w-full h-full">
        <section className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold text-center">Turnos</h1>
          <p className="text-xl font-light text-center">{day}</p>
          <div className="flex flex-col gap-2 max-w-40">
            <div className="flex flex-row gap-2 items-end">
              <Label>Fecha de nacimiento</Label>
            </div>

            <Input
              type="date"
              onChange={(e) => setDate(e.target.value)} // Directamente el string en formato "YYYY-MM-DD"
              defaultValue={date}
              placeholder="YYYY-MM-DD"
            />
          </div>
        </section>
        {data?.data.map((appointment: Appointment) => (
          <CardAppointment
            appointment={appointment}
            refetch={refetch}
            key={appointment.id}
          />
        ))}
        {data?.data.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <h2 className="text-xl font-bold text-center">
              No hay turnos para hoy.
            </h2>
          </div>
        )}
        {/* <Calendar
          localizer={localizer}
          startAccessor="start"
          endAccessor="end"
          views={["month", "week", "day"]}
          className="w-full h-full"
          messages={messages}
        /> */}
      </div>
    </Layout>
  )
}
export default AppointmentsPage
