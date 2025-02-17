import { useQuery } from "@tanstack/react-query"
import Layout from "../Layout"
import { getAppointmentsByUser } from "@/services/AppointmentService"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { Appointment } from "@/interfaces/Appointment"
import CardAppointmentUser from "../components/CardAppointmentUser"

const ProfileAppointmentPage = () => {
  const [date, setDate] = useState<string | undefined>(
    new Date().toISOString().split("T")[0]
  )
  const day = new Date().toISOString().split("T")[0]

  const { data, refetch } = useQuery({
    queryKey: ["getAppointmentsByUser"],
    queryFn: () => getAppointmentsByUser({ date }),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24,
    retry: false,
  })

  useEffect(() => {
    refetch()
  }, [date])

  return (
    <Layout>
      <main className="flex flex-col items-center justify-center w-full gap-8 h-full p-2">
        <section className="flex flex-col gap-2 w-full">
          <h1 className="text-4xl font-bold text-center">Turnos</h1>
          <p className="text-xl font-light text-center">{day}</p>

          <div className="flex flex-col justify-center items-end gap-2 w-full">
            <div className="flex flex-row gap-2 items-end">
              <Label>Fecha de busqueda</Label>
            </div>

            <Input
              type="date"
              className=" max-w-40"
              onChange={(e) => setDate(e.target.value)} // Directamente el string en formato "YYYY-MM-DD"
              defaultValue={date}
              placeholder="YYYY-MM-DD"
            />
          </div>
        </section>

        <section className="flex flex-col gap-4 w-full min-h-96">
          {data?.data.turnos.map((appointment: Appointment) => (
            <CardAppointmentUser
              appointment={appointment}
              refetch={refetch}
              key={appointment.id}
            />
          ))}
        </section>

        {
          data?.data.turnos.length === 0 && (
            <h2 className="text-2xl font-bold text-center">No hay turnos en los proximos dias</h2>
          )
        }
      </main>
    </Layout>
  )
}
export default ProfileAppointmentPage
