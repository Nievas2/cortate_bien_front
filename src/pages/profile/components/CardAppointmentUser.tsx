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
import { reschedule, updateStatus } from "@/services/AppointmentService"
import { useLocation } from "react-router-dom"
import { useForm } from "react-hook-form"
import {
  rescheduleSchema,
  updateStateSchema,
} from "@/utils/schemas/appointmentSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useState } from "react"

const CardAppointmentUser = ({
  appointment,
  refetch,
}: {
  appointment: Appointment
  refetch: Function
}) => {
  const [successReschedule, setSuccessReschedule] = useState(false)
  const [successStatus, setSuccessStatus] = useState(false)
  const location = useLocation()
  const id = location.search.split("=")[1]
  /* Mutate State */
  const { mutate: mutateUpdate, error: errorUpdate } = useMutation({
    mutationKey: ["updateAppointment"],
    mutationFn: async ({ state }: { state: string }) => {
      updateStatus(id, [{ id: appointment.id, estado: state }])
    },
    onSuccess: () => {
      setSuccessStatus(true)
      refetch()
    },
  })

  /* Mutate reschedule */
  const { mutate, error } = useMutation({
    mutationKey: ["reschedule"],
    mutationFn: async (data: { fecha: string; hora: string }) => {
      reschedule({ id: appointment.id, fecha: data.fecha, hora: data.hora })
    },
    onSuccess: () => {
      setSuccessReschedule(true)
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

  /* Form reschedule */
  const {
    formState: { errors },
    register,
    setValue,
    handleSubmit,
  } = useForm({
    values: {
      fecha: "",
      hora: "",
    },
    resolver: zodResolver(rescheduleSchema),
  })
  console.log(errorsState)

  return (
    <main className="flex flex-row sm:flex-col sm:items-center md:flex-row  gap-4 h-fit rounded-2xl shadow shadow-white p-3">
      <section className="flex gap-4 w-full">
        <section className="flex items-center justify-center">
          <Icon icon="mdi:calendar" className="text-4xl text-gray-600" />
        </section>

        <section className="flex flex-col items-start justify-center w-full">
          <h2 className="text-sm font-bold">Datos del cliente</h2>
          <span className="text-sm font-medium">
            Nombre: {appointment.cliente.nombre}
          </span>
          <span className="text-sm font-medium">
            Telefono: {appointment.cliente.telefono}
          </span>
          <p className="text-sm font-light">{appointment.notas}</p>
        </section>
      </section>

      <section className="flex flex-col items-start justify-center">
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
              {/* Reprogramar */}
              <Icon icon="mdi:reschedule" width={24} height={24} />
            </Button>
          </DialogTrigger>
          <DialogContent forceMount>
            <DialogHeader>
              <DialogTitle>Reprogramar turno</DialogTitle>
            </DialogHeader>
            {successReschedule ? (
              <div className="flex flex-col gap-4">
                <span>Turno reprogramado</span>{" "}
                <Button
                  variant="simple"
                  onClick={() => {
                    setSuccessReschedule(false)
                  }}
                >
                  Volver a actualizar
                </Button>
              </div>
            ) : (
              <form
                className="flex flex-col gap-4"
                onSubmit={handleSubmit((data) => mutate(data))}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row gap-2 items-end">
                    <Label>Fecha de nacimiento</Label>
                  </div>

                  <Input
                    type="date"
                    {...register("fecha")}
                    onChange={(e) => setValue("fecha", e.target.value)} // Directamente el string en formato "YYYY-MM-DD"
                    placeholder="YYYY-MM-DD"
                  />

                  <small className="font-bold text-red-500">
                    {errors.fecha?.message}
                  </small>
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <Label>Horario</Label>
                  <Input
                    placeholder="Una hora entre 00:00 y 23:59"
                    type="text"
                    {...register(`hora`)}
                  />
                  <small className="font-bold text-red-500">
                    {errors.hora?.message}
                  </small>
                </div>

                {error && (
                  <span className="text-red-500 text-sm">{error.message}</span>
                )}
                <Button variant="simple">Reprogramar</Button>
              </form>
            )}
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger>
            <Button variant="ghost" className="flex flex-col gap-2 text-white">
              {/*   Aceptar/Cancelar */}
              <Icon icon="material-symbols:schedule" width={24} height={24} />
            </Button>
          </DialogTrigger>
          <DialogContent forceMount>
            <DialogHeader>
              <DialogTitle>Aceptar o cancelar turno</DialogTitle>
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
                className="flex flex-col gap-8"
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
                {errorsState.root?.message && (
                  <span className="text-red-500 text-sm">
                    {errorsState.root.message}
                  </span>
                )}
                {errorUpdate && (
                  <span className="text-red-500 text-sm">
                    {errorUpdate.message}
                  </span>
                )}
                <Button variant="simple">Actualizar estado</Button>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </section>
    </main>
  )
}
export default CardAppointmentUser
