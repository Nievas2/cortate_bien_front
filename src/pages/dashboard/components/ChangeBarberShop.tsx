import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react/dist/iconify.js"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useForm } from "react-hook-form"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { barberSchema } from "@/utils/schemas/barberSchema"
import { getCountries } from "@/services/CountryService"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import CountrySelect from "./CountrySelect"
import { Hour } from "@/interfaces/Hour"
import { createbarber, updateBarber } from "@/services/BarberService"
import { Barber } from "@/interfaces/Barber"
import { Link } from "react-router-dom"
import StateSelect from "./StateSelect"
import CitySelect from "./CitySelect"
import MapSelector from "@/hooks/dashboard/MapSelector"
interface ChangeBarberShopProps {
  Barbers?: Barber[]
  refetch: Function
}

const ChangeBarberShop = ({ Barbers, refetch }: ChangeBarberShopProps) => {
  return (
    <section className="flex flex-wrap items-center justify-center gap-8 w-full">
      {Barbers != undefined && (
        <>
          {Barbers?.map((barber) => (
            <div
              className="flex flex-col items-center justify-center rounded-xl border border-blue-main group-hover:bg-blue-main/80 group-hover:text-white relative group size-48"
              key={barber.id}
            >
              <Dialog>
                <DialogTrigger className="absolute top-2 right-2 z-50 flex gap-2">
                  <Button variant="simple" size="xs" className="rounded-sm">
                    <Icon
                      icon="material-symbols:delete"
                      width="16"
                      height="16"
                    />
                  </Button>
                </DialogTrigger>
                <DialogContent forceMount>
                  <DialogHeader>
                    <DialogTitle>Eliminar barberia</DialogTitle>
                  </DialogHeader>
                  <p>¿Estas seguro que deseas eliminar esta barberia?</p>
                  <p>
                    No podra recuperarla de ninguna manera y se perdera toda la
                    informacion que tenga
                  </p>
                  <div className="flex justify-between">
                    <DialogClose>
                      <Button variant="simple">Cancelar</Button>
                    </DialogClose>
                    <Button variant="destructive">Eliminar</Button>
                  </div>
                </DialogContent>
              </Dialog>

              <img
                src={barber.imagen_perfil}
                className="absolute w-full h-full rounded-xl"
                alt="imagen not found"
              />
              <Link
                to={`/dashboard/barber?id=${barber.id}`}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <Button variant="secondary">{barber.nombre}</Button>
              </Link>
            </div>
          ))}
        </>
      )}
      <Dialog>
        <DialogTrigger>
          <div className="relative group">
            <div className="absolute inset-0 opacity-50 size-48 bg-transparent blur-3xl rounded-xl group-hover:bg-blue-main/40" />
            <Button variant="barberDash" size="barberDash">
              <Icon icon="tabler:plus" height={24} width={24} />
              Agregar una barberia
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent forceMount>
          <DialogHeader>
            <DialogTitle>Agregar una barberia</DialogTitle>
          </DialogHeader>
          <ChangeBarberShopDialog refetch={refetch} />
        </DialogContent>
      </Dialog>
    </section>
  )
}
export default ChangeBarberShop

interface ChangeBarberShopDialogProps {
  barber?: Barber
  refetch?: Function
}

export function ChangeBarberShopDialog({
  barber,
  refetch,
}: ChangeBarberShopDialogProps) {
  const [countryId, setCountryId] = useState<undefined | number>()
  const [stateId, setStateId] = useState<undefined | number>()
  const [images, setImages] = useState(
    barber?.imagenes ? barber?.imagenes : [""]
  )
  if (barber != undefined) {
    barber.horarios.forEach((element) => {
      if (element.pausa_inicio == null) element.pausa_inicio = ""
      if (element.pausa_fin == null) element.pausa_fin = ""
    })
  }
  const [hours, setHours] = useState<Hour[] | undefined>(
    barber?.horarios ? barber?.horarios : undefined
  )

  const { data, isSuccess: isSuccessCountries } = useQuery({
    queryKey: ["countries"],
    queryFn: getCountries,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24,
  })

  const { mutate, isSuccess, isPending } = useMutation({
    mutationKey: ["create-barber"],
    mutationFn: (values: any) => {
      return createbarber(values)
    },
    onSuccess: () => {
      if (refetch) return refetch()
    },
  })

  const {
    mutate: update,
    isSuccess: isSuccessUpdate,
    isPending: isPendingUpdate,
  } = useMutation({
    mutationKey: ["update-barber"],
    mutationFn: (values: any) => {
      if (barber != undefined) {
        return updateBarber(barber, barber.id!, values)
      }
      throw new Error("Barberia no encontrada")
    },
  })

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    defaultValues: {
      nombre: barber?.nombre ? barber?.nombre : "",
      descripcion: barber?.descripcion ? barber?.descripcion : "",
      latitud: barber?.latitud ? barber.latitud.toString() : "0",
      longitud: barber?.longitud ? barber.longitud.toString() : "0",
      direccion: barber?.direccion ? barber?.direccion : "",
      cantidadDeMinutosPorTurno: barber?.cantidadDeMinutosPorTurno
        ? barber?.cantidadDeMinutosPorTurno.toString()
        : "30",
      ciudad_id: barber?.ciudad_id ? barber?.ciudad_id.toString() : "",
      horarios: hours,
      imagen_perfil: barber?.imagen_perfil ? barber?.imagen_perfil : "",
      imagenes: images,
    },
    resolver: zodResolver(barberSchema),
  })

  const handleSubmitForm = (data: any) => {
    if (barber != undefined) return update(data)
    mutate(data)
  }

  const handleAddImages = () => {
    setImages([...images, ""])
  }

  const handleRemoveImages = (index: number) => {
    const newImages = images.filter((_: any, i: number) => i !== index)
    setImages(newImages)
  }

  function handleSelectCountry(country: number) {
    setCountryId(country)
  }

  function handleAddHour() {
    const data = {
      dia: "",
      hora_apertura: "",
      hora_cierre: "",
      pausa_inicio: "",
      pausa_fin: "",
    }
    if (hours === null || hours == undefined) {
      return setHours([data])
    }
    const updatedHours = [...hours]
    updatedHours.push(data)
    setHours(updatedHours)
  }

  const handleRemoveHour = (index: number) => {
    if (hours != null && hours != undefined) {
      const newhours = hours.filter((_: any, i: number) => i !== index)
      setHours(newhours)
    }
  }
  console.log(errors)
  const [position, setPosition] = useState({
    lat: 0,
    lng: 0,
  })
  const [error, setError] = useState("")

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setValue("latitud", position.coords.latitude.toString())
        setValue("longitud", position.coords.longitude.toString())
        setPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (error) => {
        setError(error.message || "Error al obtener la ubicación")
      },
      { enableHighAccuracy: true }
    )
  }, [])

  return (
    <form
      className="flex flex-col w-full"
      onSubmit={handleSubmit(handleSubmitForm)}
    >
      {isSuccess || isSuccessUpdate ? (
        <span className="text-white text-center">
          {barber != undefined
            ? "Barberia actualizada correctamente"
            : "Barberia creada correctamente"}
        </span>
      ) : (
        <div className="flex flex-col gap-3 w-full">
          <div className="flex flex-col gap-2">
            <Label>Nombre</Label>
            <Input
              type="text"
              placeholder="Ingrese su nombre"
              {...register("nombre")}
              disabled={isPending || isPendingUpdate}
            />
            <span className="text-sm text-red-600">
              {errors.nombre?.message}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Descripcion</Label>
            <Textarea
              placeholder="Ingrese una descripcion"
              {...register("descripcion")}
              rows={4}
              disabled={isPending || isPendingUpdate}
            />
            <span className="text-sm text-red-600">
              {errors.descripcion?.message}
            </span>
          </div>
          {position.lat != 0 && <MapSelector position={position} />}
          {error && (
            <div className="text-red-500 text-sm">
              Si no desea que la app use su ubicación o en los campos siguientes
              aparecen valores en 0, debera ingresar la longitud y latitud
              manualmente.
            </div>
          )}

          <div className="flex gap-2">
            <div className="flex flex-col gap-2 w-full">
              <Label>Latitud</Label>
              <Input
                type="number"
                placeholder="latitud"
                {...register("latitud")}
                disabled={isPending || isPendingUpdate}
              />
              <span className="text-sm text-red-600">
                {errors.latitud?.message}
              </span>
            </div>

            <div className="flex flex-col gap-2 w-full">
              <Label>Longitud</Label>
              <Input
                type="number"
                placeholder="longitud"
                {...register("longitud")}
                disabled={isPending || isPendingUpdate}
              />
              <span className="text-sm text-red-600">
                {errors.longitud?.message}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Direccion</Label>
            <Input
              type="text"
              placeholder="Ingrese su direccion"
              {...register("direccion")}
              disabled={isPending || isPendingUpdate}
            />
            <span className="text-sm text-red-600">
              {errors.direccion?.message}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Cantidad de minutos por turno</Label>
            <Input
              type="number"
              placeholder="Ingrese una cantidad de minutos por turno"
              {...register("cantidadDeMinutosPorTurno")}
              disabled={isPending || isPendingUpdate}
            />
            <span className="text-sm text-red-600">
              {errors.cantidadDeMinutosPorTurno?.message}
            </span>
          </div>

          {barber == undefined && (
            <div className="flex flex-col gap-2">
              <Label>Pais</Label>
              {isSuccessCountries && Array.isArray(data?.data) ? (
                <CountrySelect
                  countries={data?.data}
                  onChange={handleSelectCountry}
                />
              ) : (
                <span className="text-sm text-red-600">
                  Algo salio mal en la busqueda del listado de los paises
                </span>
              )}
            </div>
          )}

          {countryId && (
            <div className="flex flex-col gap-2">
              <Label>Estado / provincia</Label>
              <StateSelect
                countryId={countryId}
                onChange={(state: number) => setStateId(state)}
              />
            </div>
          )}

          {stateId && (
            <div className="flex flex-col gap-2">
              <Label>Ciudad</Label>
              <CitySelect
                stateId={stateId}
                onChange={(city: number) =>
                  setValue("ciudad_id", city.toString())
                }
              />
              <span className="text-sm text-red-600">
                {errors.ciudad_id?.message}
              </span>
              <span className="text-green-500 text-sm font-bold">
                Revise que cargo correctamente su ubicacion porque no podra
                cambiarlo luego.
              </span>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label>Imagen de perfil</Label>
            <Input
              type="text"
              placeholder="Imagen de foto de perfil"
              {...register("imagen_perfil")}
              disabled={isPending || isPendingUpdate}
            />
            <span className="text-sm text-red-600">
              {errors.imagen_perfil?.message}
            </span>
          </div>

          <Label>Agregar imagenes</Label>
          {images.map((image, index: number) => (
            <div key={index}>
              <Input
                placeholder="Ingrese una imagen"
                defaultValue={image}
                type="url"
                {...register(`imagenes.${index}`)} // Registrar dinámicamente cada input
              />
              <small className="font-bold text-red-500">
                {errors.imagenes?.[index]?.message}
              </small>
            </div>
          ))}

          <div className="flex flex-col items-center justify-center sm:flex-row sm:justify-between w-full gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddImages}
              disabled={isPending || isPendingUpdate}
            >
              <Icon icon="material-symbols:add" width="18" height="18" />
              Agregar una imagen
            </Button>
            <Button
              type="button"
              variant="simple"
              onClick={() => {
                if (images.length > 1)
                  return handleRemoveImages(images.length - 1)
              }}
              disabled={isPending || isPendingUpdate}
            >
              <Icon icon="mdi:trash-outline" width="18" height="18" />
              Quitar la ultima imagen
            </Button>
          </div>

          <hr />

          {hours != undefined &&
            hours.map(
              (
                hour: {
                  dia: string
                  hora_apertura: string
                  hora_cierre: string
                  pausa_inicio: string | null
                  pausa_fin: string | null
                },
                index: number
              ) => (
                <div className="flex flex-col gap-2" key={crypto.randomUUID()}>
                  <div className="flex flex-col gap-2">
                    <Label>Dia</Label>
                    <Select
                      onValueChange={(e) => {
                        const updatedHours = [...hours] // Crear una copia del array
                        updatedHours[index] = {
                          ...updatedHours[index], // Mantener los otros valores del objeto
                          dia: e, // Actualizar solo el campo "dia"
                        }
                        setHours(updatedHours) // Actualizar el estado con el nuevo array
                      }}
                      value={hour.dia}
                      disabled={isPending || isPendingUpdate}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Selecciona un día" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LUNES">Lunes</SelectItem>
                        <SelectItem value="MARTES">Martes</SelectItem>
                        <SelectItem value="MIERCOLES">Miércoles</SelectItem>
                        <SelectItem value="JUEVES">Jueves</SelectItem>
                        <SelectItem value="VIERNES">Viernes</SelectItem>
                        <SelectItem value="SABADO">Sábado</SelectItem>
                        <SelectItem value="DOMINGO">Domingo</SelectItem>
                      </SelectContent>
                    </Select>
                    <small className="font-bold text-red-500">
                      {errors.horarios?.[index]?.dia?.message}
                    </small>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex flex-col gap-2 w-full">
                      <Label>Horario de apertura</Label>
                      <Input
                        placeholder="Una hora entre 00:00 y 23:59"
                        defaultValue={hour.hora_apertura}
                        type="text"
                        {...register(`horarios.${index}.hora_apertura`)}
                        disabled={isPending || isPendingUpdate}
                      />
                      <small className="font-bold text-red-500">
                        {errors.horarios?.[index]?.hora_apertura?.message}
                      </small>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <Label>Horario de cierre</Label>
                      <Input
                        placeholder="Una hora entre 00:00 y 23:59"
                        type="text"
                        disabled={isPending || isPendingUpdate}
                        {...register(`horarios.${index}.hora_cierre`)}
                      />
                      <small className="font-bold text-red-500">
                        {errors.horarios?.[index]?.hora_cierre?.message}
                      </small>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div className="flex flex-col gap-2 w-full">
                      <Label>Inicio del descanso</Label>
                      <Input
                        placeholder="Una hora entre 00:00 y 23:59"
                        type="text"
                        disabled={isPending || isPendingUpdate}
                        {...register(`horarios.${index}.pausa_inicio`)}
                      />
                      <small className="font-bold text-red-500">
                        {errors.horarios?.[index]?.pausa_inicio?.message}
                      </small>
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                      <Label>Inicio del descanso</Label>
                      <Input
                        placeholder="Una hora entre 00:00 y 23:59"
                        type="text"
                        disabled={isPending || isPendingUpdate}
                        {...register(`horarios.${index}.pausa_fin`)}
                      />
                      <small className="font-bold text-red-500">
                        {errors.horarios?.[index]?.pausa_fin?.message}
                      </small>
                    </div>
                  </div>
                </div>
              )
            )}

          <div className="flex sm:flex-row sm:justify-between flex-col justify-center gap-2">
            <Button
              variant="secondary"
              type="button"
              onClick={handleAddHour}
              disabled={isPending || isPendingUpdate}
            >
              <Icon icon="material-symbols:add" width="18" height="18" />
              Agregar un horario
            </Button>
            {hours != undefined && hours.length > 1 && (
              <Button
                variant="simple"
                type="button"
                onClick={() => {
                  if (hours != undefined && hours.length > 1)
                    return handleRemoveHour(hours?.length - 1)
                }}
                disabled={isPending || isPendingUpdate}
              >
                <Icon icon="mdi:trash-outline" width="18" height="18" />
                Quitar el ultimo horaio
              </Button>
            )}
          </div>

          <Button
            variant="simple"
            type="submit"
            disabled={isPending || isPendingUpdate}
          >
            Agregar barberia
          </Button>
        </div>
      )}
    </form>
  )
}
