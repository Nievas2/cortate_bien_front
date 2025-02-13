import { Button } from "@/components/ui/button"
import { Appointment } from "@/interfaces/Appointment"
import { Icon } from "@iconify/react/dist/iconify.js"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useMutation } from "@tanstack/react-query"
import { updateStatusUser } from "@/services/AppointmentService"
import { useForm } from "react-hook-form"
import { updateStateSchema } from "@/utils/schemas/appointmentSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { AxiosError } from "axios"
import HandleChangeReviews from "../reviews/components/HandleChangeReviews"

const CardAppointmentUser = ({
  appointment,
  refetch,
}: {
  appointment: Appointment
  refetch: Function
}) => {
  const [successStatus, setSuccessStatus] = useState(false)

  /* Mutate State */
  const { mutate: mutateUpdate, error: errorUpdate } = useMutation({
    mutationKey: ["updateAppointment"],
    mutationFn: async ({ state }: { state: string }) => {
      return updateStatusUser(appointment.id, state)
    },
    onSuccess: () => {
      setSuccessStatus(true)
      refetch()
    },
  })

  /* Form state */
  const {
    handleSubmit: handleSubmitUpdate,
    setValue: setValueState,
    formState: { errors: errorsState },
  } = useForm({
    values: {
      state: "",
    },
    resolver: zodResolver(updateStateSchema),
  })

  return (
    <main className="flex flex-col items-center md:flex-row  gap-4 h-fit rounded-2xl shadow shadow-white p-3 w-full">
      <section className="flex gap-4 w-full">
        <section className="flex items-center justify-center">
          <Icon icon="mdi:calendar" className="text-4xl text-gray-600" />
        </section>

        <section className="flex flex-col items-start justify-center w-full">
          <h2 className="text-sm font-bold">Datos de la barberia</h2>
          <span className="text-sm font-medium">
            Nombre: {appointment.barberia.nombre}
          </span>
          <span className="text-sm font-medium">
            Dirección: {appointment.barberia.direccion}
          </span>
        </section>
      </section>

      <section className="flex flex-col items-start justify-center min-w-[110px]">
        <h2 className="text-sm font-bold">Estado</h2>
        <span
          className={`text-sm font-bold ${appointment.estado === "COMPLETADO" || appointment.estado === "CONFIRMADO" ? "text-green-500" : appointment.estado === "CANCELADO" ? "text-red-500" : appointment.estado === "PENDIENTE" ? "text-yellow-500" : "text-blue-500"}`}
        >
          {appointment.estado}
        </span>
      </section>

      <section className="flex items-center justify-start">
        <Dialog>
          <DialogTrigger>
            <Button variant="ghost" className="flex flex-col gap-2 text-white">
              {/*   Aceptar/Cancelar */}
              <Icon icon="material-symbols:schedule" width={24} height={24} />
            </Button>
          </DialogTrigger>
          <DialogContent forceMount>
            <DialogHeader>
              <DialogTitle>Dejar una reseña</DialogTitle>
            </DialogHeader>
            {successStatus ? (
              <div className="flex flex-col gap-4">
                <span>Turno actualizado</span>

                <Button
                  variant="simple"
                  onClick={() => {
                    setSuccessStatus(false)
                  }}
                >
                  Volver a actualizar
                </Button>
              </div>
            ) : (
              <form
                className="flex flex-col gap-4"
                onSubmit={handleSubmitUpdate((data) => mutateUpdate(data))}
              >
                <Select onValueChange={(e) => setValueState("state", e)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Estado del turno" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-main text-white w-full">
                    <SelectItem value="CONFIRMADO">Aceptado</SelectItem>
                    <SelectItem value="CANCELADO">Cancelado</SelectItem>
                  </SelectContent>
                </Select>

                {errorsState.state?.message && (
                  <span className="text-red-500 text-sm">
                    {errorsState.state?.message}
                  </span>
                )}

                {errorUpdate instanceof AxiosError && errorUpdate.response && (
                  <span className="text-red-500 text-sm">
                    {errorUpdate.response.data.message}
                  </span>
                )}

                <Button variant="simple">Actualizar estado</Button>
              </form>
            )}
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger>
            <Button variant="ghost" className="flex flex-col gap-2 text-white">
              {/*   Aceptar/Cancelar */}
              <Icon icon="material-symbols:star" width={24} height={24} />
            </Button>
          </DialogTrigger>
          <DialogContent forceMount>
            <DialogHeader>
              <DialogTitle>Dejar una reseña</DialogTitle>
            </DialogHeader>
              <HandleChangeReviews idBarber={appointment.barberia.id!} />
         
          </DialogContent>
        </Dialog>
      </section>
    </main>
  )
}
export default CardAppointmentUser
