import { Button } from "@/components/ui/button";
import { Appointment } from "@/interfaces/Appointment";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { updateStatusUser } from "@/services/AppointmentService";
import { useForm } from "react-hook-form";
import { updateStateSchema } from "@/utils/schemas/appointmentSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { AxiosError } from "axios";
import HandleChangeReviews from "../reviews/components/HandleChangeReviews";

const CardAppointmentUser = ({
  appointment,
  refetch,
}: {
  appointment: Appointment;
  refetch: Function;
}) => {
  const [successStatus, setSuccessStatus] = useState(false);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState("");

  /* Mutate State */
  const {
    mutate: mutateUpdate,
    error: errorUpdate,
    isPending,
  } = useMutation({
    mutationKey: ["updateAppointment"],
    mutationFn: async ({ state }: { state: string }) => {
      return updateStatusUser(appointment.id, state);
    },
    onSuccess: () => {
      setSuccessStatus(true);
      refetch();
    },
  });

  /* Form state */
  const {
    setValue: setValueState,
    formState: { errors: errorsState },
  } = useForm({
    values: {
      state: "",
    },
    resolver: zodResolver(updateStateSchema),
  });

  const getStatusConfig = (status: string) => {
    const configs = {
      COMPLETADO: {
        color: "text-green-400",
        bg: "bg-green-500/20",
        border: "border-green-500/30",
        icon: "tabler:check-circle",
      },
      CONFIRMADO: {
        color: "text-green-400",
        bg: "bg-green-500/20",
        border: "border-green-500/30",
        icon: "tabler:circle-check",
      },
      CANCELADO: {
        color: "text-red-400",
        bg: "bg-red-500/20",
        border: "border-red-500/30",
        icon: "tabler:x-circle",
      },
      PENDIENTE: {
        color: "text-yellow-400",
        bg: "bg-yellow-500/20",
        border: "border-yellow-500/30",
        icon: "tabler:clock",
      },
      REPROGRAMADO: {
        color: "text-blue-400",
        bg: "bg-blue-500/20",
        border: "border-blue-500/30",
        icon: "tabler:calendar-event",
      },
    };
    return configs[status as keyof typeof configs] || configs.PENDIENTE;
  };

  const statusConfig = getStatusConfig(appointment.estado);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:shadow-xl">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Info */}
        <div className="flex-1 space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-white/10 flex-shrink-0">
              <Icon
                icon="tabler:building-store"
                className="h-6 w-6 text-blue-400"
              />
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  {appointment.barberia.nombre}
                </h3>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Icon icon="tabler:map-pin" className="h-4 w-4" />
                  <span>{appointment.barberia.direccion}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Icon
                    icon="tabler:calendar"
                    className="h-4 w-4 text-gray-400"
                  />
                  <span className="text-white text-sm font-medium capitalize">
                    {formatDate(appointment.fecha)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon icon="tabler:clock" className="h-4 w-4 text-gray-400" />
                  <span className="text-white text-sm font-medium">
                    {appointment.hora}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-4 lg:items-end">
          {/* Status Badge */}
          <div
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${statusConfig.bg} ${statusConfig.border} border`}
          >
            <Icon
              icon={statusConfig.icon}
              className={`h-4 w-4 ${statusConfig.color}`}
            />
            <span className={`text-sm font-medium ${statusConfig.color}`}>
              {appointment.estado}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Review Button for Completed Appointments */}
            {appointment.estado === "COMPLETADO" && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 border border-yellow-500/20"
                  >
                    <Icon icon="tabler:star" className="h-4 w-4" />
                    Reseña
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-gray-700">
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      Dejar una reseña
                    </DialogTitle>
                  </DialogHeader>
                  <HandleChangeReviews idBarber={appointment.barberia.id!} />
                </DialogContent>
              </Dialog>
            )}

            {/* Accept Button for Rescheduled Appointments */}
            {appointment.estado === "REPROGRAMADO" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setOpen(true);
                  setState("CONFIRMADO");
                }}
                className="text-green-400 hover:text-green-300 border-green-500/30 hover:bg-green-500/10"
              >
                <Icon icon="tabler:check" className="h-4 w-4" />
                Aceptar
              </Button>
            )}

            {/* Cancel Button */}
            {appointment.estado !== "CANCELADO" &&
              appointment.estado !== "COMPLETADO" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setOpen(true);
                    setState("CANCELADO");
                  }}
                  className="text-red-400 hover:text-red-300 border-red-500/30 hover:bg-red-500/10"
                >
                  <Icon icon="tabler:x" className="h-4 w-4" />
                  Cancelar
                </Button>
              )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Icon
                icon={
                  state === "CONFIRMADO"
                    ? "tabler:check-circle"
                    : "tabler:alert-circle"
                }
                className={`h-5 w-5 ${state === "CONFIRMADO" ? "text-green-400" : "text-red-400"}`}
              />
              {state === "CONFIRMADO" ? "Confirmar Turno" : "Cancelar Turno"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {successStatus ? (
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 border border-green-500/30">
                  <Icon
                    icon="tabler:check"
                    className="h-6 w-6 text-green-400"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    ¡Turno Actualizado!
                  </h3>
                  <p className="text-gray-400 text-sm">
                    El estado del turno ha sido modificado correctamente.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setOpen(false);
                    setSuccessStatus(false);
                  }}
                  className="w-full"
                >
                  Cerrar
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="text-center space-y-2">
                    <p className="text-white font-medium">
                      ¿Estás seguro de{" "}
                      {state === "CONFIRMADO" ? "confirmar" : "cancelar"} este
                      turno?
                    </p>
                    <p className="text-gray-400 text-sm">
                      Esta acción no se puede deshacer. Por favor confirma tu
                      decisión.
                    </p>
                  </div>

                  {/* Appointment Summary */}
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Icon
                        icon="tabler:building-store"
                        className="h-4 w-4 text-gray-400"
                      />
                      <span className="text-white">
                        {appointment.barberia.nombre}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Icon
                        icon="tabler:calendar"
                        className="h-4 w-4 text-gray-400"
                      />
                      <span className="text-gray-300">
                        {appointment.fecha} - {appointment.hora}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (state === "CONFIRMADO") {
                          setValueState("state", "CONFIRMADO");
                        }
                        if (state === "CANCELADO") {
                          setValueState("state", "CANCELADO");
                        }
                        mutateUpdate({ state });
                      }}
                      disabled={isPending}
                      className={`flex-1 ${
                        state === "CONFIRMADO"
                          ? "text-green-400 border-green-500/30 hover:bg-green-500/10"
                          : "text-red-400 border-red-500/30 hover:bg-red-500/10"
                      }`}
                    >
                      {isPending ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                          Procesando...
                        </div>
                      ) : (
                        <>
                          <Icon
                            icon={
                              state === "CONFIRMADO"
                                ? "tabler:check"
                                : "tabler:x"
                            }
                            className="h-4 w-4 mr-2"
                          />
                          {state === "CONFIRMADO" ? "Confirmar" : "Cancelar"}
                        </>
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={() => setOpen(false)}
                      disabled={isPending}
                      className="flex-1 text-gray-400 hover:text-white hover:bg-white/10"
                    >
                      Volver
                    </Button>
                  </div>

                  {/* Error Messages */}
                  {(errorsState.root?.message ||
                    (errorUpdate instanceof AxiosError &&
                      errorUpdate.response)) && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                      <p className="text-red-400 text-sm flex items-center gap-2">
                        <Icon icon="tabler:alert-circle" className="h-4 w-4" />
                        {errorsState.root?.message ||
                          (errorUpdate instanceof AxiosError &&
                            errorUpdate.response?.data.message) ||
                          "Ha ocurrido un error inesperado"}
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CardAppointmentUser;
