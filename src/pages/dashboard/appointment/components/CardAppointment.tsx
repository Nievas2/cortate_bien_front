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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
import { AxiosError } from "axios"

const CardAppointment = ({
  appointment,
  refetch,
  selected,
  handleAddSelect,
}: {
  appointment: Appointment
  refetch: Function
  selected: boolean
  handleAddSelect: Function
}) => {
  const [successReschedule, setSuccessReschedule] = useState(false)
  const [successStatus, setSuccessStatus] = useState(false)
  const [open, setOpen] = useState(false)
  const [state, setState] = useState("")
  const location = useLocation()
  const id = location.search.split("=")[1]
  /* Mutate State */
  const { mutate: mutateUpdate, error: errorUpdate } = useMutation({
    mutationKey: ["updateAppointment"],
    mutationFn: async ({ state }: { state: string }) => {
      return updateStatus(id, [{ id: appointment.id, estado: state }])
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
      return reschedule({
        id: appointment.id,
        fecha: data.fecha,
        hora: data.hora,
      })
    },
    onSuccess: () => {
      setSuccessReschedule(true)
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

  return (
    <main className="flex flex-col items-center gap-4 h-fit rounded-2xl shadow shadow-white p-3">
      <div className="flex flex-col items-center md:flex-row gap-4 w-full">
        <section className="flex gap-4 w-full">
          <section className="flex items-center justify-center">
            <Input
              type="checkbox"
              onChange={() => handleAddSelect(appointment.id)}
              checked={selected}
            />
          </section>

          <section className="flex flex-col items-start justify-center w-full">
            <h2 className="text-sm font-bold">Datos del cliente</h2>
            <span className="text-sm font-medium">
              Nombre: {appointment.cliente.nombre}
            </span>
            <span className="text-sm font-medium">
              hora: {appointment.hora}
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
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="ghost"
                      className="flex flex-col gap-2 text-white"
                    >
                      {/* Reprogramar */}
                      <Icon icon="mdi:reschedule" width={24} height={24} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Reprogramar</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
                  {appointment.estado === "CANCELADO" ? (
                    <span>
                      El turno se encuentra cancelado y no puede ser
                      reprogramado
                    </span>
                  ) : (
                    <>
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

                      {error instanceof AxiosError && error.response && (
                        <span className="text-red-500 text-sm">
                          {error.response.data.message}
                        </span>
                      )}
                      <Button variant="simple">Reprogramar</Button>
                    </>
                  )}
                </form>
              )}
            </DialogContent>
          </Dialog>
        </section>
      </div>

      <div className="flex gap-4 w-full justify-end">
        {appointment.estado !== "CONFIRMADO" &&
          appointment.estado !== "REPROGRAMADO" && (
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

        {appointment.estado !== "REPROGRAMADO" && (
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

        {appointment.estado == "CONFIRMADO" && (
          <Button
            variant="secondary"
            onClick={() => {
              setOpen(true)
              setState("COMPLETADO")
            }}
          >
            Completar
          </Button>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent forceMount>
            <DialogHeader>
              <DialogTitle>
                {state == "CONFIRMADO"
                  ? "Confirmación de turno"
                  : state == "COMPLETADO"
                    ? "Finalizar el turno"
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
                            : state === "COMPLETADO"
                              ? "¿Estás seguro de completar el turno?"
                              : "¿Estás seguro de cancelar el turno?"}
                        </p>
                        <p>
                          Esta accion no se puede deshacer, por favor confirma
                          que quieres{" "}
                          {state === "CONFIRMADO"
                            ? "confirmar"
                            : state === "COMPLETADO"
                              ? "completar"
                              : "cancelar"}{" "}
                          el turno.
                        </p>
                      </div>
                      <div className="flex justify-between gap-2 w-full">
                        <Button
                          variant="secondary"
                          onClick={() => {
                            if (state === "CONFIRMADO") {
                              setValueState("state", "CONFIRMADO")
                            }
                            if (state === "COMPLETADO") {
                              setValueState("state", "COMPLETADO")
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
export default CardAppointment
