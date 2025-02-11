import "react-big-calendar/lib/css/react-big-calendar.css"
import Layout from "../layout"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useLocation } from "react-router-dom"
import {
  getAppointmentsByBarberId,
  updateStatus,
} from "@/services/AppointmentService"
import CardAppointment from "./components/CardAppointment"
import { Appointment } from "@/interfaces/Appointment"
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
const AppointmentsPage = () => {
  document.title = "Cortate bien | Turnos"
  const [select, setSelect] = useState<Array<string> | undefined>()
  const [state, setState] = useState("")
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

  const { mutate, error } = useMutation({
    mutationKey: ["put-states-barber"],
    mutationFn: () => {
      if (select == undefined)
        return Promise.reject("No hay turnos seleccionados")

      const data = select.map((id) => ({ id: id, estado: state }))

      return updateStatus(id, data)
    },
    onSuccess: () => {
      refetch()
    },
  })

  useEffect(() => {
    refetch()
  }, [date])

  function handleSelect(idSelected: string) {
    let seleteds
    if (select == undefined) return setSelect([idSelected])

    seleteds = select
    if (!seleteds.includes(idSelected)) {
      return setSelect([...seleteds, idSelected])
    }

    return setSelect(seleteds.filter((id) => id !== idSelected))
  }

  return (
    <Layout>
      <div className="flex flex-col gap-8 p-1 sm:p-3 w-full h-full">
        <section className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold text-center">Turnos</h1>
          <p className="text-xl font-light text-center">{day}</p>
          <div className="flex flex-col-reverse sm:flex-row gap-4 w-full">
            <div className="flex flex-col w-full">
              <div className="flex flex-row gap-2 items-end">
                <Label>Cambiar los estados</Label>
              </div>
              <div className="flex items-end gap-8 ">
                <div className="flex items-center gap-2">
                  <Input
                    type="checkbox"
                    onChange={() => {
                      if (select?.length === data?.data.length) {
                        return setSelect(undefined)
                      }
                      return setSelect(
                        data?.data.map((item: Appointment) => item.id)
                      )
                    }}
                    checked={select?.length === data?.data.length}
                  />
                  <small className="flex items-center h-full">Todos</small>
                </div>
              </div>
              {select != undefined && select?.length > 0 && (
                <div className="flex flex-col gap-3">
                  <Select onValueChange={(e) => setState(e)}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Estados de los turnos" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-main text-white w-full">
                      <SelectItem value="CONFIRMADO">Aceptados</SelectItem>
                      <SelectItem value="CANCELADO">Cancelados</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    className="max-w-[200px]"
                    variant="simple"
                    disabled={state === ""}
                    onClick={() => mutate()}
                  >
                    Confirmar
                  </Button>
                  {error && (
                    <small className="font-bold text-red-500">
                      {error.message}
                    </small>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col justify-start items-start sm:items-end gap-2 w-full">
              <div className="flex flex-row gap-2 items-end">
                <Label>Fecha de nacimiento</Label>
              </div>

              <Input
                type="date"
                className=" max-w-40"
                onChange={(e) => setDate(e.target.value)} // Directamente el string en formato "YYYY-MM-DD"
                defaultValue={date}
                placeholder="YYYY-MM-DD"
              />
            </div>
          </div>
        </section>
        {data?.data.turnos.map((appointment: Appointment) => (
          <CardAppointment
            appointment={appointment}
            refetch={refetch}
            selected={select?.includes(appointment.id) ?? false}
            handleAddSelect={() => handleSelect(appointment.id)}
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
