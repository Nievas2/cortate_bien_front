import { Calendar, dayjsLocalizer } from "react-big-calendar"
import "react-big-calendar/lib/css/react-big-calendar.css"
import Layout from "../layout"
import dayjs from "dayjs"
import "dayjs/locale/es"
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
