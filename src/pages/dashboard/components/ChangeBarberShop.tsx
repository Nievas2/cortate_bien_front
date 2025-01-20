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
import { useState } from "react"
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
import { createbarber, updatebarber } from "@/services/BarberService"
import { Barber } from "@/interfaces/Barber"
import { Link } from "react-router-dom"
interface ChangeBarberShopProps {
  barbers?: Barber[]
}

const ChangeBarberShop = ({ barbers }: ChangeBarberShopProps) => {
  return (
    <section className="flex flex-wrap items-center justify-center gap-8 w-full">
      {barbers != undefined && (
        <>
          {barbers?.map((barber) => (
            <div
              className="flex flex-col items-center justify-center rounded-xl border border-blue-main group-hover:bg-blue-main/80 group-hover:text-white relative group size-48"
              key={barber.id}
            >
              <Dialog>
                <DialogTrigger className="absolute top-2 right-2 z-50 flex gap-2">
                  <Button variant="ghost" size="xs" className="rounded-sm">
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
              <Link to={`/dashboard/barber?id=${barber.id}`} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Button
                  variant="simple"
                >
                  {barber.nombre}
                </Button>
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
          <ChangeBarberShopDialog />
        </DialogContent>
      </Dialog>
    </section>
  )
}
export default ChangeBarberShop

interface ChangeBarberShopDialogProps {
  barber?: Barber
}

function ChangeBarberShopDialog({ barber }: ChangeBarberShopDialogProps) {
  const [images, setImages] = useState(barber ? barber.imagenes : [""])
  const [hours, setHours] = useState<null | Hour[]>(
    barber ? barber.horarioPorDia : null
  )
  console.log(barber)

  const { data, isSuccess } = useQuery({
    queryKey: ["countries"],
    queryFn: getCountries,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24,
  })

  const { mutate } = useMutation({
    mutationKey: ["create-barber"],
    mutationFn: (values: any) => {
      return createbarber(values)
    },
  })

  const { mutate: update } = useMutation({
    mutationKey: ["update-barber"],
    mutationFn: async (values: any) => {
      if (barber != undefined) {
        return await updatebarber(values, barber.id!)
      }
      return Promise.reject(new Error("Barber is undefined"))
    },
  })

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    defaultValues: {
      nombre: barber?.nombre,
      descripcion: barber?.descripcion,
      latitud: barber?.latitud,
      longitud: barber?.longitud,
      direccion: barber?.direccion,
      cantidadDeMinutosPorTurno: barber?.cantidadDeMinutosPorTurno,
      ciudad_id: barber?.ciudad_id,
      horarioPorDia: hours,
      imagen_perfil: barber?.imagen_perfil,
      imagenes: images,
    },
    resolver: zodResolver(barberSchema),
  })

  const handleSubmitForm = (data: any) => {
    if (barber == undefined) return update(data)
    mutate(data)
  }

  const handleAddImages = () => {
    setImages([...images, ""])
  }

  const handleRemoveImages = (index: number) => {
    const newImages = images.filter((_: any, i: number) => i !== index)
    setImages(newImages)
  }

  function handleSelectCountry(country: string) {
    setValue("ciudad_id", country.toString())
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

  return (
    <form
      className="flex flex-col w-full"
      onSubmit={handleSubmit(handleSubmitForm)}
    >
      <div className="flex flex-col gap-3 w-full">
        <div className="flex flex-col gap-2">
          <Label>Nombre</Label>

          <Input
            type="text"
            placeholder="Ingrese su nombre"
            {...register("nombre")}
            /* disabled={loading} */
          />
          <span className="text-sm text-red-600">{errors.nombre?.message}</span>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Descripcion</Label>
          <Textarea
            placeholder="Ingrese una descripcion"
            {...register("descripcion")}
            rows={4}
            /* disabled={loading} */
          />
          <span className="text-sm text-red-600">
            {errors.descripcion?.message}
          </span>
        </div>

        <div className="flex gap-2">
          <div className="flex flex-col gap-2">
            <Label>Latitud</Label>
            <Input
              type="number"
              placeholder="latitud"
              {...register("latitud")}
              /* disabled={loading} */
            />
            <span className="text-sm text-red-600">
              {errors.latitud?.message}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Longitud</Label>
            <Input
              type="number"
              placeholder="longitud"
              {...register("longitud")}
              /* disabled={loading} */
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
            /* disabled={loading} */
          />
          <span className="text-sm text-red-600">
            {errors.direccion?.message}
          </span>
        </div>

        <div className="flex gap-2 w-full">
          <div className="flex flex-col gap-2  w-full">
            <Label>Cantidad de minutos por turno</Label>
            <Input
              type="number"
              placeholder="Ingrese la cantidad de minutos por turno"
              {...register("cantidadDeMinutosPorTurno")}
              /* disabled={loading} */
            />
            <span className="text-sm text-red-600">
              {errors.cantidadDeMinutosPorTurno?.message}
            </span>
          </div>
          <div className="flex flex-col gap-2  w-full">
            <Label>Ciudad</Label>

            {isSuccess && Array.isArray(data?.data) ? (
              <CountrySelect
                countries={data?.data}
                onChange={handleSelectCountry}
              />
            ) : (
              <span className="text-sm text-red-600">
                Algo salio mal en la busqueda del listado de los paises
              </span>
            )}

            <span className="text-sm text-red-600">
              {errors.ciudad_id?.message}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Imagen de perfil</Label>
          <Input
            type="text"
            placeholder="Ingrese una imagen de foto de perfil"
            {...register("imagen_perfil")}
            /* disabled={loading} */
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
            onClick={() => {
              if (images.length < 5) return handleAddImages()
            }}
          >
            <Icon icon="material-symbols:add" width="18" height="18" />
            Agregar una imagen
          </Button>
          {images.length > 1 && (
            <Button
              type="button"
              variant="simple"
              onClick={() => {
                if (images.length > 1)
                  return handleRemoveImages(images.length - 1)
              }}
            >
              <Icon icon="mdi:trash-outline" width="18" height="18" />
              Quitar la ultima imagen
            </Button>
          )}
        </div>
        {images.length === 5 && (
          <small className="text-red-500">
            No se pueden agregar mas de 5 imagenes
          </small>
        )}
        {hours == undefined && (
          <small className="font-bold text-red-500">
            Debe ingresar almenos una imagen
          </small>
        )}
        <hr />

        {hours != null &&
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
                    {errors.horarioPorDia?.[index]?.dia?.message}
                  </small>
                </div>
                <div className="flex gap-2">
                  <div className="flex flex-col gap-2 w-full">
                    <Label>Horario de apertura</Label>
                    <Input
                      placeholder="Una hora entre 00:00 y 23:59"
                      defaultValue={hour.hora_apertura}
                      type="text"
                      {...register(`horarioPorDia.${index}.hora_apertura`)}
                    />
                    <small className="font-bold text-red-500">
                      {errors.horarioPorDia?.[index]?.hora_apertura?.message}
                    </small>
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <Label>Horario de cierre</Label>
                    <Input
                      placeholder="Una hora entre 00:00 y 23:59"
                      type="text"
                      {...register(`horarioPorDia.${index}.hora_cierre`)}
                    />
                    <small className="font-bold text-red-500">
                      {errors.horarioPorDia?.[index]?.hora_cierre?.message}
                    </small>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="flex flex-col gap-2 w-full">
                    <Label>Inicio del descanso</Label>
                    <Input
                      placeholder="Una hora entre 00:00 y 23:59"
                      type="text"
                      {...register(`horarioPorDia.${index}.pausa_inicio`)}
                    />
                    <small className="font-bold text-red-500">
                      {errors.horarioPorDia?.[index]?.pausa_inicio?.message}
                    </small>
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <Label>Inicio del descanso</Label>
                    <Input
                      placeholder="Una hora entre 00:00 y 23:59"
                      type="text"
                      {...register(`horarioPorDia.${index}.pausa_fin`)}
                    />
                    <small className="font-bold text-red-500">
                      {errors.horarioPorDia?.[index]?.pausa_fin?.message}
                    </small>
                  </div>
                </div>
              </div>
            )
          )}

        <div className="flex sm:flex-row sm:justify-between flex-col justify-center gap-2">
          <Button variant="secondary" type="button" onClick={handleAddHour}>
            <Icon icon="material-symbols:add" width="18" height="18" />
            Agregar un horario
          </Button>
          {hours != undefined && hours.length > 1 && (
            <Button
              variant="simple"
              type="button"
              onClick={() => {
                if (hours.length > 1) return handleRemoveHour(hours?.length - 1)
              }}
            >
              <Icon icon="mdi:trash-outline" width="18" height="18" />
              Quitar el ultimo horaio
            </Button>
          )}
        </div>
        {hours == undefined && (
          <small className="font-bold text-red-500">
            Debe ingresar almenos un horario
          </small>
        )}

        <Button variant="simple" type="submit">
          Agregar barberia
        </Button>
      </div>
    </form>
  )
}
