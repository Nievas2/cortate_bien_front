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
  const [open, setOpen] = useState(false)
  const [state, setState] = useState("")

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
    setValue: setValueState,
    formState: { errors: errorsState },
  } = useForm({
    values: {
      state: "",
    },
    resolver: zodResolver(updateStateSchema),
  })

  return (
    <main className="flex flex-col items-center gap-4 h-fit rounded-2xl shadow shadow-white p-3 w-full">
      <div className="flex flex-col items-center md:flex-row gap-4 w-full">
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
            <span className="text-sm font-medium">
              Fecha: {appointment.fecha}
            </span>
            <span className="text-sm font-medium">
              Hora: {appointment.hora}
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

        {appointment.estado === "COMPLETADO" && (
          <section className="flex items-center justify-start">
            <Dialog>
              <DialogTrigger>
                <Button
                  variant="ghost"
                  className="flex flex-col gap-2 text-white"
                >
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
        )}
      </div>

      <div className="flex gap-4 w-full justify-end">
        {appointment.estado === "REPROGRAMADO" && (
          <Button
            variant="secondary"
            onClick={() => {
              setOpen(true)
              setState("CONFIRMADO")
            }}
          >
            Aceptar
          </Button>
        )}

        {appointment.estado !== "CANCELADO" && (
          <Button
            variant="destructive"
            onClick={() => {
              setOpen(true)
              setState("CANCELADO")
            }}
          >
            Cancelar
          </Button>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent forceMount>
            <DialogHeader>
              <DialogTitle>
                {state == "CONFIRMADO"
                  ? "Confirmación de turno"
                  : "Cancelación de turno"}
              </DialogTitle>
            </DialogHeader>
            {successStatus ? (
              <div className="flex flex-col gap-4">
                <span>Turno actualizado</span>
                <Button
                  variant="simple"
                  onClick={() => {
                    setOpen(false)
                  }}
                >
                  Cerrar
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                {appointment.estado === "CANCELADO" ? (
                  <span>
                    El turno se encuentra cancelado y no puede ser cambiado.
                  </span>
                ) : (
                  <>
                    <div className="flex flex-col gap-4 items-center justify-center">
                      <div className="flex flex-col gap-2 font-extralight items-center">
                        <p>
                          {state === "CONFIRMADO"
                            ? "¿Estás seguro de confirmar el turno?"
                            : "¿Estás seguro de cancelar el turno?"}
                        </p>
                        <p>
                          Esta accion no se puede deshacer, por favor confirma
                          que quieres{" "}
                          {state === "CONFIRMADO" ? "confirmar" : "cancelar"} el
                          turno.
                        </p>
                      </div>
                      <div className="flex justify-between gap-2 w-full">
                        <Button
                          variant="secondary"
                          onClick={() => {
                            if (state === "CONFIRMADO") {
                              setValueState("state", "CONFIRMADO")
                            }
                            if (state === "CANCELADO") {
                              setValueState("state", "CANCELADO")
                            }
                            mutateUpdate({ state })
                          }}
                          type="button"
                        >
                          Confirmar
                        </Button>

                        <Button
                          variant="ghost"
                          type="button"
                          onClick={() => setOpen(false)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>

                    {errorsState.root?.message && (
                      <span className="text-red-500 text-sm">
                        {errorsState.root.message}
                      </span>
                    )}
                    {errorUpdate instanceof AxiosError &&
                      errorUpdate.response && (
                        <span className="text-red-500 text-sm">
                          {errorUpdate.response.data.message}
                        </span>
                      )}
                  </>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </main>
  )
}
export default CardAppointmentUser
