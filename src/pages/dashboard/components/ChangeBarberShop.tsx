import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";

import {
  deleteBarbery,
} from "@/services/BarberService";
import { Barber } from "@/interfaces/Barber";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { RenderBarbersCardDashboardSkeletons } from "../skeletons/BarbersCardDashboardSkeleton";
import { Background } from "@/components/ui/background";
import { ChangeBarberShopDialog } from "./ChangeBarberShopDialog";

interface ChangeBarberShopProps {
  Barbers?: Barber[];
  refetch: Function;
  error: Error | null;
  isPending: boolean;
}

const ChangeBarberShop = ({
  Barbers,
  refetch,
  error,
  isPending,
}: ChangeBarberShopProps) => {
  const { mutate: deleteFunction, isSuccess } = useMutation({
    mutationKey: ["delete-barber"],
    mutationFn: (id: string) => {
      return deleteBarbery(id);
    },
    onSuccess: () => {
      if (refetch) return refetch();
    },
  });

  return (
    <Background>
      <div className="min-h-screen relative w-full pt-10">
        {/* Header con gradiente mejorado */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pb-20 px-4"
        >
          <div className="max-w-6xl mx-auto text-center">
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight"
            >
              Tus Barberías
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed"
            >
              Gestiona todas tus barberías desde un solo lugar. Agrega nuevas
              ubicaciones y administra tu negocio.
            </motion.p>
          </div>
        </motion.div>

        {/* Contenido principal */}
        <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-10">
          {/* Grid de barberías */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {/* Botón agregar barbería mejorado */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="group"
            >
              <Dialog>
                <DialogTrigger asChild>
                  <div className="relative h-64 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer group-hover:scale-105">
                    {/* Fondo con gradiente sutil */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Contenido centrado */}
                    <div className="relative z-10 flex flex-col items-center justify-center h-full p-6">
                      <div className="w-16 h-16 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Icon
                          icon="tabler:plus"
                          className="w-8 h-8 text-white"
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
                        Agregar Barbería
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                        Nueva ubicación
                      </p>
                    </div>

                    {/* Efectos decorativos */}
                    <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full opacity-60" />
                    <div className="absolute bottom-4 left-4 w-1 h-1 bg-blue-300 rounded-full opacity-40" />
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <DialogHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
                    <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                      Agregar Nueva Barbería
                    </DialogTitle>
                  </DialogHeader>
                  <ChangeBarberShopDialog refetch={refetch} />
                </DialogContent>
              </Dialog>
            </motion.div>

            {/* Lista de barberías existentes */}
            {isPending ? (
              RenderBarbersCardDashboardSkeletons()
            ) : (
              <>
                {Barbers?.map((barber: Barber, index: number) => (
                  <motion.div
                    key={barber.id}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="group relative"
                  >
                    <div className="relative h-64 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden group-hover:scale-105">
                      {/* Imagen de fondo */}
                      <div className="absolute inset-0">
                        <img
                          src={barber.imagen_perfil}
                          className="w-full h-full object-cover"
                          alt={barber.nombre}
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
                      </div>

                      {/* Botón eliminar mejorado */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="absolute top-3 right-3 z-20 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg">
                            <Icon
                              icon="material-symbols:delete"
                              className="w-4 h-4"
                            />
                          </button>
                        </DialogTrigger>
                        <DialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                          <DialogHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
                            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                              Eliminar Barbería
                            </DialogTitle>
                          </DialogHeader>
                          {isSuccess ? (
                            <div className="text-center py-6">
                              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Icon
                                  icon="tabler:check"
                                  className="w-8 h-8 text-green-600 dark:text-green-400"
                                />
                              </div>
                              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                Barbería eliminada con éxito
                              </p>
                            </div>
                          ) : (
                            <div className="py-4">
                              <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <Icon
                                    icon="tabler:alert-triangle"
                                    className="w-8 h-8 text-red-600 dark:text-red-400"
                                  />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                  ¿Estás seguro?
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-2">
                                  Esta acción eliminará permanentemente la
                                  barbería "{barber.nombre}".
                                </p>
                                <p className="text-sm text-red-600 dark:text-red-400">
                                  No podrás recuperar la información una vez
                                  eliminada.
                                </p>
                              </div>
                              <div className="flex gap-3 justify-end">
                                <DialogClose asChild>
                                  <Button variant="outline" className="px-6">
                                    Cancelar
                                  </Button>
                                </DialogClose>
                                <Button
                                  variant="destructive"
                                  className="px-6"
                                  onClick={() => {
                                    if (barber.id == undefined) return;
                                    deleteFunction(barber.id);
                                  }}
                                >
                                  Eliminar
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      {/* Contenido de la tarjeta */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="text-lg font-bold mb-1 line-clamp-1">
                          {barber.nombre}
                        </h3>
                        <p className="text-sm text-gray-200 mb-3 opacity-90">
                          {barber.direccion}
                        </p>

                        <Link to={`/dashboard/barber?id=${barber.id}`}>
                          <Button
                            size="sm"
                            className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm transition-all duration-200 hover:scale-105"
                          >
                            Ver Detalles
                            <Icon
                              icon="tabler:arrow-right"
                              className="w-4 h-4 ml-2"
                            />
                          </Button>
                        </Link>
                      </div>

                      {/* Indicador de estado */}
                      <div className="absolute top-3 left-3 px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                        Activa
                      </div>
                    </div>
                  </motion.div>
                ))}
              </>
            )}
          </div>

          {/* Mensaje de error mejorado */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-8"
            >
              <div className="flex items-center">
                <Icon
                  icon="tabler:alert-circle"
                  className="w-5 h-5 text-red-600 dark:text-red-400 mr-3"
                />
                <p className="text-red-800 dark:text-red-200">
                  {error.message}
                </p>
              </div>
            </motion.div>
          )}

          {/* Mensaje cuando no hay barberías */}
          {!isPending && (!Barbers || Barbers.length === 0) && !error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon
                  icon="tabler:building-store"
                  className="w-12 h-12 text-gray-400 dark:text-gray-500"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No tienes barberías registradas
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Comienza agregando tu primera barbería para empezar a gestionar
                tu negocio.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </Background>
  );
};

export default ChangeBarberShop;


