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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { barberSchema } from "@/utils/schemas/barberSchema"

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

function AddBarberShopDialog() {
  const [images, setImages] = useState([""])
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      nombre: "",
      descripcion: "",
      latitud: "",
      longitud: "",
      direccion: "",
      cantidadDeMinutosPorTurno: 30,
      ciudad_id: "",

      horarioPorDia: "",

      imagen_perfil: "",
      imagenes: "",
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

  return (
    <form onSubmit={handleSubmit(handleSubmitForm)}>
      <div className="flex flex-col gap-3">
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
          <Input
            type="text"
            placeholder="ciudad_id"
            {...register("ciudad_id")}
            /* disabled={loading} */
          />
          <span className="text-sm text-red-600">
            {errors.ciudad_id?.message}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Horario por dia</Label>
          <Input
            type="text"
            placeholder="horarioPorDia"
            {...register("horarioPorDia")}
            /* disabled={loading} */
          />
          <span className="text-sm text-red-600">
            {errors.horarioPorDia?.message}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Imagen de perfil</Label>
          <Input
            type="text"
            placeholder="imagen_perfil"
            {...register("imagen_perfil")}
            /* disabled={loading} */
          />
          <span className="text-sm text-red-600">
            {errors.imagen_perfil?.message}
          </span>
        </div>

        {images.map((image, index: number) => (
          <div key={index}>
            <Input
              className="bg-[#334155] ring-white border border-[#455166]"
              placeholder="Ingrese una imagen"
              defaultValue={image}
              type="url"
              {...register(`imagenes`)}
              /*  disabled={isPending} */
            />
            <small className="font-bold text-[#ff4444]">
              {errors.imagenes?.message}
            </small>
          </div>
        ))}

        <div className="flex w-full gap-4">
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

        <div className="flex flex-col gap-2">
          <Button variant="auth">Agregar un horario</Button>
        </div>

        <Button variant="auth" type="submit">
          Agregar barberia
        </Button>
      </div>
    </form>
  )
}
