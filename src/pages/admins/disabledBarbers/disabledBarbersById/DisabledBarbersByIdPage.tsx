import CarouselDesktop, { CarouselMobile } from "@/components/shared/Carousel"
import { Icon } from "@iconify/react/dist/iconify.js"
import { Button } from "@/components/ui/button"
import { BarberGet } from "@/interfaces/Barber"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { changeStatusBarber } from "@/services/AdminService"

const DisabledBarbersByIdPage = ({ barber }: { barber: BarberGet }) => {
  const [value, setValue] = useState("")
  const { mutate, error, isPending } = useMutation({
    mutationKey: ["barber"],
    mutationFn: async () => {
      if (value.length == 0 || barber.id == undefined) {
        return new Error("No se ha seleccionado un estado")
      }
      return await changeStatusBarber(barber.id, value)
    },
  })
  return (
    <main className="flex flex-col min-h-screen w-full relative">
      <Button
        variant="secondary"
        className="fixed bottom-3 right-3"
        onClick={() => window.scrollTo(0, 10000)}
      >
        <Icon icon="carbon:arrow-down" width={24} />
      </Button>

      <section>
        <div className="static sm:hidden w-full h-full">
          <CarouselMobile
            images={[barber.imagen_perfil, ...(barber.imagenes || [])]}
            /*   isLoading={isLoading} */
          />
        </div>
      </section>

      <section className="flex flex-col gap-4 bg-gray-main w-full h-full p-2 pt-4">
        <div className="flex flex-row sm:flex-col justify-between items-center gap-2">
          <div className="hidden sm:flex max-w-[400px] -ml-20">
            <CarouselDesktop
              images={[barber.imagen_perfil, ...(barber.imagenes || [])]} /* 
              isLoading={isLoading} */
            />
          </div>

          <h2 className="text-xl font-extrabold">{barber.nombre}</h2>
        </div>

        <div className="flex sm items-center gap-2 justify-between w-full  bg-black-main rounded-xl p-2">
          <div className="flex flex-col gap-2">
            <p className="font-extralight text-sm">{barber.barbero}</p>

            <p className="font-extralight text-sm">
              Duración aproximada:{" "}
              <span className="font-bold">
                {barber.cantidadDeMinutosPorTurno}
              </span>
            </p>
          </div>
        </div>

        <section className="flex flex-col sm:flex-row gap-2 w-full">
          <div className="flex flex-col gap-2 m-0.5 p-2 bg-black-main rounded-xl w-full">
            <div className="flex flex-col gap-2 h-full">
              <span className="font-extrabold">Sobre nosotros</span>
              <p className="font-extralight text-sm">{barber.descripcion}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 m-0.5 p-2 bg-black-main rounded-xl w-full">
            <span className="font-extrabold">Ubicación</span>
            <div className="flex gap-2 justify-between">
              <p className="font-extralight text-sm">{barber.direccion}</p>
              <p className="font-extralight text-sm">{barber.ciudad}</p>
            </div>
            <iframe
              id="mapa"
              className="w-full sm:w-[60vw] h-56 sm:h-72 rounded-xl"
              title="Ubicación de la barbería en el mapa"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${barber.latitud},${barber.longitud}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
            />
          </div>
        </section>
        {error && (
          <p className="text-red-500 text-sm font-extrabold">Algo salio mal</p>
        )}

        <div className="flex flex-col gap-2 items-center w-full">
          <Select onValueChange={(e) => setValue(e)} disabled={isPending}>
            <SelectTrigger
              className={`w-[180px] ${value == "" ? "border-red-500" : ""}`}
            >
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent className="bg-gray-main text-white w-full">
              <SelectItem value="ACTIVO">Aceptar</SelectItem>
              <SelectItem value="RECHAZADO">Rechazar</SelectItem>
              <SelectItem value="BANEO">Banear</SelectItem>
              <SelectItem value="PENDIENTE">Pendiente</SelectItem>
              <SelectItem value="INACTIVO">Inactivo</SelectItem>
            </SelectContent>
          </Select>
          {value ? (
            <Button
              variant="secondary"
              onClick={() => mutate()}
              className="w-full"
              disabled={isPending}
            >
              Poner en{" "}
              {value == "PENDIENTE"
                ? "pendiente"
                : value == "INACTIVO"
                  ? "inactivo"
                  : value == "ACTIVO"
                    ? "activo"
                    : value == "RECHAZADO"
                      ? "rechazado"
                      : value == "BANEO"
                        ? "baneo"
                        : ""}{" "}
              la barberia
            </Button>
          ) : (
            ""
          )}
        </div>
      </section>
    </main>
  )
}
export default DisabledBarbersByIdPage
