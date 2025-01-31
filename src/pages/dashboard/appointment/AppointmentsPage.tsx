import { Calendar, dayjsLocalizer } from "react-big-calendar"
import "react-big-calendar/lib/css/react-big-calendar.css"
import Layout from "../layout"
import dayjs from "dayjs"
import "dayjs/locale/es"
import { useQuery } from "@tanstack/react-query"
import { useLocation } from "react-router-dom"
import { getAppointmentsByBarberId } from "@/services/AppointmentService"
dayjs.locale("es")
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

const localizer = dayjsLocalizer(dayjs)
const AppointmentsPage = () => {
  const { search } = useLocation()
  const id = search.split("=")[1]

  const { data } = useQuery({
    queryKey: ["get-appointments-by-barber"],
    queryFn: () => {
      return getAppointmentsByBarberId(id)
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24,
    retry: false,
  })

  console.log(data);
  

  return (
    <Layout>
      <div className="flex items-end justify-end p-0 sm:p-3 w-full h-full">
        <Calendar
          localizer={localizer}
          startAccessor="start"
          endAccessor="end"
          views={["month", "week", "day"]}
          className="w-full h-full"
          messages={messages}
        />
      </div>
    </Layout>
  )
}
export default AppointmentsPage
