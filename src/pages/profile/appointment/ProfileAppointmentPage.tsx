import { useQuery } from "@tanstack/react-query";
import { getAppointmentsByUser } from "@/services/AppointmentService";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Appointment } from "@/interfaces/Appointment";
import CardAppointmentUser from "../components/CardAppointmentUser";
import { Icon } from "@iconify/react/dist/iconify.js";
import { motion } from "framer-motion";

const ProfileAppointments = () => {
  const [date, setDate] = useState<string | undefined>(
    new Date().toISOString().split("T")[0] 
  );
  const today = new Date().toLocaleDateString("es-ES", { 
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["getAppointmentsByUser", date],
    queryFn: () => getAppointmentsByUser({ date }),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24,
    retry: false,
  });

  useEffect(() => {
    refetch();
  }, [date, refetch]);

  const appointmentCount = data?.data.turnos?.length || 0;

  return (
    <motion.div
      className="space-y-4 sm:space-y-6 px-1 sm:px-0"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      {/* Today's date info */}
      <div className="text-center">
        <p className="text-gray-400 capitalize">{today}</p>
      </div>

      {/* Search Controls */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 sm:gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <Icon icon="tabler:search" className="h-4 w-4 text-gray-400" />
              <Label htmlFor="search-date" className="text-white font-medium">
                Buscar por fecha
              </Label>
            </div>
            <Input
              id="search-date"
              type="date"
              className="max-w-xs bg-white/10 border-white/20 text-white"
              onChange={(e) => setDate(e.target.value)}
              defaultValue={date}
            />
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-white/10">
            <Icon icon="tabler:calendar" className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-white">
              {appointmentCount} {appointmentCount === 1 ? "turno" : "turnos"}
            </span>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4 sm:space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
              <span className="text-gray-400">Cargando turnos...</span>
            </div>
          </div>
        ) : appointmentCount === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800/50 mb-4">
              <Icon
                icon="tabler:calendar-x"
                className="h-8 w-8 text-gray-400"
              />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No hay turnos programados
            </h3>
            <p className="text-gray-400 max-w-md mx-auto">
              No se encontraron turnos para la fecha seleccionada. Intenta con
              otra fecha o agenda un nuevo turno.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {data?.data.turnos.map((appointment: Appointment) => (
              <CardAppointmentUser
                key={appointment.id}
                appointment={appointment}
                refetch={refetch}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProfileAppointments;