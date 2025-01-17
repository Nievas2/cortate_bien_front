import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react/dist/iconify.js"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useForm } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"
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

const AddBarberShop = () => {
  return (
    <section className="flex items-center justify-center">
      <Dialog>
        <DialogTrigger>
          <div className="relative group">
            <div className="absolute inset-0 opacity-50 size-48 bg-transparent blur-3xl rounded-xl group-hover:bg-blue-main/40" />
            <Button
              variant="ghost"
              className="flex flex-col items-center justify-center rounded-xl size-48 border border-blue-main group-hover:bg-blue-main/80 group-hover:text-white"
            >
              <Icon icon="tabler:plus" height={24} width={24} />
              Agregar una barberia
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar una barberia</DialogTitle>
          </DialogHeader>
          <AddBarberShopDialog />
        </DialogContent>
      </Dialog>
    </section>
  )
}
export default AddBarberShop
interface Hour {
  dia: string
  hora_apertura: string
  hora_cierre: string
  pausa_inicio: string
  pausa_fin: string
}
function AddBarberShopDialog() {
  const [images, setImages] = useState([""])
  const [hours, setHours] = useState<null | Hour[]>()

  const { data, isSuccess } = useQuery({
    queryKey: ["countries"],
    queryFn: getCountries,
  })
  console.log(data)

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    defaultValues: {
      nombre: "",
      descripcion: "",
      latitud: "",
      longitud: "",
      direccion: "",
      cantidadDeMinutosPorTurno: 30,
      ciudad_id: "",

      horarios: hours,

      imagen_perfil: "",
      imagenes: images,
    },
    resolver: zodResolver(barberSchema),
  })
  const handleSubmitForm = (data: any) => {
    console.log(data)
  }

  const handleAddImages = () => {
    setImages([...images, ""])
  }

  const handleRemoveImages = (index: number) => {
    const newSubCategories = images.filter((_: any, i: number) => i !== index)
    setImages(newSubCategories)
  }
  console.log(errors)

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
            placeholder="nombre"
            {...register("nombre")}
            /* disabled={loading} */
          />
          <span className="text-sm text-red-600">{errors.nombre?.message}</span>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Descripcion</Label>
          <Textarea
            placeholder="descripcion"
            {...register("descripcion")}
            rows={4}
            /* disabled={loading} */
          />
          <span className="text-sm text-red-600">
            {errors.descripcion?.message}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Latitud</Label>
          <Input
            type="text"
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
            type="text"
            placeholder="longitud"
            {...register("longitud")}
            /* disabled={loading} */
          />
          <span className="text-sm text-red-600">
            {errors.longitud?.message}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Direccion</Label>
          <Input
            type="text"
            placeholder="direccion"
            {...register("direccion")}
            /* disabled={loading} */
          />
          <span className="text-sm text-red-600">
            {errors.direccion?.message}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Cantidad de minutos por turno</Label>
          <Input
            type="number"
            placeholder="cantidadDeMinutosPorTurno"
            {...register("cantidadDeMinutosPorTurno")}
            /* disabled={loading} */
          />
          <span className="text-sm text-red-600">
            {errors.cantidadDeMinutosPorTurno?.message}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Ciudad</Label>

          {isSuccess && data?.data === Array (
            <CountrySelect
              countries={data?.data}
              onChange={handleSelectCountry}
            />
          )}

          <span className="text-sm text-red-600">
            {errors.ciudad_id?.message}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Imagen de perfil</Label>
          <Input
            type="text"
            placeholder="Imagen de foto de perfil"
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
            <small className="font-bold text-[#ff4444]">
              {errors.imagenes?.[index]?.message}
            </small>
          </div>
        ))}

        <div className="flex flex-col items-center justify-center sm:flex-row sm:justify-between w-full gap-4">
          <Button type="button" variant="auth" onClick={handleAddImages}>
            Agregar una imagen
          </Button>
          <Button
            type="button"
            variant="auth"
            onClick={() => {
              if (images.length > 1)
                return handleRemoveImages(images.length - 1)
            }}
          >
            Quitar la ultima imagen
          </Button>
        </div>

        {hours != null &&
          hours.map(
            (
              hour: {
                dia: string
                hora_apertura: string
                hora_cierre: string
                pausa_inicio: string
                pausa_fin: string
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
                      <SelectItem value="Lunes">Lunes</SelectItem>
                      <SelectItem value="Martes">Martes</SelectItem>
                      <SelectItem value="Miércoles">Miércoles</SelectItem>
                      <SelectItem value="Jueves">Jueves</SelectItem>
                      <SelectItem value="Viernes">Viernes</SelectItem>
                      <SelectItem value="Sábado">Sábado</SelectItem>
                      <SelectItem value="Domingo">Domingo</SelectItem>
                    </SelectContent>
                  </Select>

                  <small className="font-bold text-[#ff4444]">
                    {errors.imagenes?.[index]?.message}
                  </small>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Horario de apertura</Label>
                  <Input
                    placeholder="Ingrese una hora entre 00:00 y 23:59"
                    defaultValue={hour.hora_apertura}
                    type="text"
                    {...register(`horarios.${index}.hora_apertura`)}
                  />
                  <small className="font-bold text-[#ff4444]">
                    {errors.horarios?.[index]?.hora_apertura?.message}
                  </small>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Horario de cierre</Label>
                  <Input
                    placeholder="Ingrese una hora entre 00:00 y 23:59"
                    type="text"
                    {...register(`horarios.${index}.hora_cierre`)}
                  />
                  <small className="font-bold text-[#ff4444]">
                    {errors.horarios?.[index]?.hora_cierre?.message}
                  </small>
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Inicio del descanso</Label>
                  <Input
                    placeholder="Ingrese una hora entre 00:00 y 23:59"
                    type="text"
                    {...register(`horarios.${index}.pausa_inicio`)}
                  />
                  <small className="font-bold text-[#ff4444]">
                    {errors.horarios?.[index]?.pausa_inicio?.message}
                  </small>
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Inicio del descanso</Label>
                  <Input
                    placeholder="Ingrese una hora entre 00:00 y 23:59"
                    type="text"
                    {...register(`horarios.${index}.pausa_fin`)}
                  />
                  <small className="font-bold text-[#ff4444]">
                    {errors.horarios?.[index]?.pausa_fin?.message}
                  </small>
                </div>
              </div>
            )
          )}

        <div className="flex flex-col gap-2">
          <Button variant="secondary" type="button" onClick={handleAddHour}>
            Agregar un horario
          </Button>
        </div>

        <Button variant="simple" type="submit">
          Agregar barberia
        </Button>
      </div>
    </form>
  )
}
