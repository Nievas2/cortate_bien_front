import { useLocation } from "react-router-dom"
import Layout from "../layout"
import { useMutation, useQuery } from "@tanstack/react-query"
import {
  createService,
  deleteService,
  getServicesByBarberId,
  updateService,
} from "@/services/BarberService"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { servicioBarberFormSchema } from "@/utils/schemas/barber/servicioBarberFormSchema"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Servicio, ServicioWithId } from "@/interfaces/Servicio"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react/dist/iconify.js"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { motion } from "framer-motion"

const BarberService = () => {
  const [isCreating, setIsCreating] = useState(false)
  const [deleteOption, setDeleteOption] = useState<string | null>(null)
  const [editingService, setEditingService] = useState<ServicioWithId | null>(
    null
  )
  const { search } = useLocation()
  const id = search.split("=")[1]

  const {
    data: services,
    isPending: isPendingServices,
    refetch,
  } = useQuery({
    queryKey: ["services-by-barber-id", id],
    queryFn: () => getServicesByBarberId(id),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 60 * 24,
    retry: 0,
    retryOnMount: false,
    enabled: !!id,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      nombre: "",
      precio: "0",
    },
    resolver: zodResolver(servicioBarberFormSchema),
  })

  const { isPending: isPendingCreate, mutate: mutateCreate } = useMutation({
    mutationKey: ["create-service-barber", id],
    mutationFn: (data: Servicio) => createService(data, id),
    onSuccess: () => {
      setIsCreating(false)
      reset()
      refetch()
    },
  })

  const { isPending: isPendingUpdate, mutate: mutateUpdate } = useMutation({
    mutationKey: ["update-service-barber", id],
    mutationFn: (data: ServicioWithId) => {
      if (!editingService) {
        throw new Error("No service is being edited")
      }
      return updateService(data, editingService.id)
    },
    onSuccess: () => {
      setEditingService(null)
      handleCancelEdit()
      refetch()
    },
  })

  const { isPending: isPendingDelete, mutate: mutateDelete } = useMutation({
    mutationKey: ["delete-service-barber"],
    mutationFn: (serviceId: string) => deleteService(serviceId),
    onSuccess: () => {
      setDeleteOption(null)
      refetch()
    },
  })

  const handleSubmitForm = (data: { nombre: string; precio: string }) => {
    const dataCopy = { ...data, precio: Number(data.precio) }
    if (editingService) {
      mutateUpdate({ ...dataCopy, id: editingService.id })
    } else {
      mutateCreate(dataCopy)
    }
  }

  const handleEdit = (service: ServicioWithId) => {
    setEditingService(service)
    setIsCreating(true)
    reset({
      nombre: service.nombre,
      precio: service.precio.toString(),
    })
  }

  const handleCancelEdit = () => {
    setEditingService(null)
    setIsCreating(false)
    reset({
      nombre: "",
      precio: "0",
    })
  }

  const handleDelete = (serviceId: string) => {
    if (deleteOption) {
      mutateDelete(serviceId)
    }
  }

  const isLoading = isPendingCreate || isPendingUpdate || isPendingDelete

  return (
    <Layout>
      <main className="flex flex-col gap-8 items-center justify-center w-full h-full p-6">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
        >
          Gestionar Servicios
        </motion.h1>

        {/* Servicios en Grid Moderno */}
        <section className="w-full h-full">
          <div className="flex flex-wrap gap-6 mb-8">
            {/* Botón agregar servicio mejorado */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="group"
            >
              <div
                onClick={() => setIsCreating(true)}
                className="relative h-48 w-52 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer group-hover:scale-105 p-6"
              >
                {/* Fondo con gradiente sutil */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Contenido centrado */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full">
                  <div className="w-16 h-16 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon
                      icon="material-symbols:add"
                      className="w-8 h-8 text-white"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
                    Agregar Servicio
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Nuevo servicio
                  </p>
                </div>

                {/* Efectos decorativos */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full opacity-60" />
                <div className="absolute bottom-4 left-4 w-1 h-1 bg-blue-300 rounded-full opacity-40" />
              </div>
            </motion.div>

            {/* Lista de servicios existentes */}
            {isPendingServices ? (
              // Skeletons
              Array.from({ length: 3 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"
                />
              ))
            ) : services?.data.length === 0 ? (
              <div className="col-span-full flex items-center justify-center h-48 w-52 text-center bg-gray-100 dark:bg-gray-800 rounded-2xl">
                <span className="text-gray-500 dark:text-gray-400">
                  No hay servicios registrados
                </span>
              </div>
            ) : (
              services?.data.map((service: ServicioWithId, index: number) => (
                <motion.div
                  key={service.id || crypto.randomUUID()}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="group relative"
                >
                  <div className="relative w-52 h-48 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden group-hover:scale-105">
                    {/* Fondo con gradiente */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20" />

                    {/* Botón eliminar mejorado */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => setDeleteOption(service.id)}
                          variant="ghost"
                          className="absolute top-3 right-3 z-20 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg"
                        >
                          <Icon
                            icon="material-symbols:delete"
                            className="w-4 h-4"
                          />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        <DialogHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
                          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                            Eliminar Servicio
                          </DialogTitle>
                        </DialogHeader>
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
                              Esta acción eliminará permanentemente el servicio
                              "{service.nombre}".
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
                              onClick={() => handleDelete(service.id)}
                              disabled={isLoading}
                            >
                              Eliminar
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Contenido de la tarjeta */}
                    <div className="relative z-10 flex flex-col justify-between h-full p-2">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                            <Icon
                              icon="material-symbols:content-cut"
                              className="w-5 h-5 text-white"
                            />
                          </div>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                          {service.nombre}
                        </h3>

                        <div className="flex items-center gap-1 mb-4">
                          <Icon
                            icon="material-symbols:attach-money"
                            className="w-5 h-5 text-green-600 dark:text-green-400"
                          />
                          <span className="text-xl font-bold text-green-600 dark:text-green-400">
                            ${service.precio}
                          </span>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleEdit(service)}
                        disabled={isLoading || isCreating}
                        size="sm"
                        className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-none transition-all duration-200 hover:scale-105"
                      >
                        <Icon
                          icon="material-symbols:edit"
                          className="w-4 h-4 mr-2"
                        />
                        Editar Servicio
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* Formulario para crear/editar servicio */}
        {isCreating && (
          <motion.section
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col gap-4 w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {editingService ? "Editar Servicio" : "Crear Nuevo Servicio"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelEdit}
                disabled={isLoading}
                className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <Icon icon="material-symbols:close" width="20" height="20" />
              </Button>
            </div>

            <form
              className="flex flex-col gap-6 w-full"
              onSubmit={handleSubmit(handleSubmitForm)}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="nombre"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Nombre del servicio
                  </Label>
                  <Input
                    id="nombre"
                    {...register("nombre")}
                    placeholder="Corte de cabello"
                    disabled={isLoading}
                    type="text"
                    className="border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg"
                  />
                  {errors.nombre && (
                    <small className="font-semibold text-red-500 flex items-center gap-1">
                      <Icon icon="material-symbols:error" className="w-4 h-4" />
                      {errors.nombre.message}
                    </small>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="precio"
                    className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Precio del servicio
                  </Label>
                  <Input
                    id="precio"
                    placeholder="15000"
                    {...register("precio")}
                    disabled={isLoading}
                    type="number"
                    className="border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg"
                  />
                  {errors.precio && (
                    <small className="font-semibold text-red-500 flex items-center gap-1">
                      <Icon icon="material-symbols:error" className="w-4 h-4" />
                      {errors.precio.message}
                    </small>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  disabled={isLoading}
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-none transition-all duration-200 hover:scale-105"
                >
                  {isLoading && (
                    <Icon
                      icon="line-md:loading-loop"
                      width="16"
                      height="16"
                      className="mr-2"
                    />
                  )}
                  <Icon
                    icon={
                      editingService
                        ? "material-symbols:update"
                        : "material-symbols:add"
                    }
                    className="w-4 h-4 mr-2"
                  />
                  {editingService ? "Actualizar Servicio" : "Crear Servicio"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={isLoading}
                  className="flex-1 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </motion.section>
        )}
      </main>
    </Layout>
  )
}

export default BarberService
