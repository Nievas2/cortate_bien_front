import { useLocation } from "react-router-dom"
import Layout from "../layout"
import { useMutation, useQuery } from "@tanstack/react-query"
import { createService, getServicesByBarberId } from "@/services/BarberService"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { servicioBarberFormSchema } from "@/utils/schemas/barber/servicioBarberFormSchema"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Servicio } from "@/interfaces/Servicio"
import { useState } from "react"
import { AxiosError } from "axios"
import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react/dist/iconify.js"

const BarberService = () => {
  const [servicios, setServicios] = useState<Servicio | undefined>(
    {
      nombre: "",
      precio: 0,
    },
  )
  const { search } = useLocation()
  const id = search.split("=")[1]

  const { data, isPending: isPendingServices } = useQuery({
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
  } = useForm<Servicio>({
    defaultValues: servicios,
    resolver: zodResolver(servicioBarberFormSchema),
  })

  const { isPending, error, mutate } = useMutation({
    mutationKey: ["create-service-barber", id],
    mutationFn: (data: Servicio) => {
      return createService(data, id)
    },
    onSuccess: (data) => {
      console.log("Servicios actualizados correctamente", data)
    },
    onError: (error) => {
      console.error("Error al actualizar los servicios", error)
    },
  })

  const handleSubmitForm = async (data: any) => {
    mutate(data)
  }
/* 
  function handleAddServicio() {
    const data = {
      nombre: "",
      precio: 0,
    }
    if (servicios === null || servicios == undefined) {
      return setServicios([data])
    }
    const updatedServicio = [...servicios]
    updatedServicio.push(data)
    setServicios(updatedServicio)
  }

  const handleRemoveHour = (index: number) => {
    if (servicios != null && servicios != undefined) {
      const newServicio = servicios.filter((_: any, i: number) => i !== index)
      setServicios(newServicio)
    }
  } */

  console.log(errors)

  return (
    <Layout>
      <main className="flex flex-col gap-8 items-center justify-center w-full h-full">
        <h1 className="text-3xl font-semibold">Actualizar Servicios</h1>
        <section className="flex flex-col gap-4 items-center justify-center w-full bg-gray-main rounded-lg p-4">
          <h1 className="text-3xl font-semibold">
            Actualizar Servicios de la Barberia
          </h1>

          {isPendingServices ? (
            <div className="flex items-center justify-center w-full h-full">
              <span className="text-gray-500">Cargando servicios...</span>
            </div>
          ) : (
            <form
              className="flex flex-col gap-4 w-full"
              onSubmit={handleSubmit(handleSubmitForm)}
            >{/* 
              {servicios != undefined &&
                servicios.map((servicio: Servicio, index: number) => ( */}
                  <div
                    className="flex flex-col gap-2"
                    key={crypto.randomUUID()}
                  >
                    <div className="flex flex-col gap-2 w-full">
                      <Label>Nombre del servicio</Label>
                      <Input
                        {...register(`nombre`)}
                        placeholder="Corte de cabello"
                        disabled={isPending}
                        type="text"
                      />
                      <small className="font-bold text-red-500">
                        {errors?.nombre?.message}
                      </small>
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                      <Label>Precio del servicio</Label>
                      <Input
                        placeholder="Una hora entre 00:00 y 23:59"
                        {...register(`precio`)}
                        disabled={isPending}
                      />
                      <small className="font-bold text-red-500">
                        {errors?.precio?.message}
                      </small>
                    </div>

                    <hr />
                  </div>{/* 
                ))} */}

             {/*  <div className="flex sm:flex-row sm:justify-between flex-col justify-center gap-2">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={handleAddServicio}
                  disabled={isPending}
                >
                  <Icon icon="material-symbols:add" width="18" height="18" />
                  Agregar un servicio
                </Button>
                {servicios != undefined && servicios.length > 1 && (
                  <Button
                    variant="simple"
                    type="button"
                    onClick={() => {
                      if (servicios != undefined && servicios.length > 1)
                        return handleRemoveHour(servicios?.length - 1)
                    }}
                    disabled={isPending}
                  >
                    <Icon icon="mdi:trash-outline" width="18" height="18" />
                    Quitar el ultimo horaio
                  </Button>
                )}
              </div> */}

              {error instanceof AxiosError && error.response && (
                <span className="text-red-500 text-sm">
                  {error.response.data.message}
                </span>
              )}

              <Button disabled={isPending} variant="secondary" type="submit">
                Actualizar Servicio
              </Button>
            </form>
          )}
        </section>
      </main>
    </Layout>
  )
}
export default BarberService
