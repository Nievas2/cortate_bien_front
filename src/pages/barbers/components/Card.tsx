import { Button } from "@/components/ui/button"
import { BarberGet } from "@/interfaces/Barber"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { appointmentSchema } from "@/utils/schemas/appointmentSchema"
import { Textarea } from "@/components/ui/textarea"
import { createAppointment } from "@/services/AppointmentService"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
const Card = ({ barber }: { barber: BarberGet }) => {
  const [success, setSuccess] = useState(false)
  /* const { authUser } = useAuthContext() */

  const { mutate, error } = useMutation({
    mutationKey: ["create-appointment"],
    mutationFn: async (values: any) => {
      if (barber.id == undefined) return
      return await createAppointment(values, barber.id)
    },
    onSuccess() {
      setSuccess(true)
    },
  })
  const {
    register: registerForm,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      fecha: "",
      hora: "",
      nota: "",
    },
    resolver: zodResolver(appointmentSchema),
  })

  const appointmentFunction = async (values: any) => {
    mutate(values)
  }

  return (
    <div className="flex gap-3 w-[300px] md:w-[400px] bg-gray-main rounded-lg border border-gray-800 p-4">
      <img className="size-40" src={barber.imagen_perfil} alt={barber.nombre} />
      <div className="flex flex-col w-full">
        <div className="flex w-full">
          <h4 className="w-full">{barber.nombre}</h4>
          <span className="py-1 px-3 text-sm border border-white rounded-full">
            {barber.puntaje}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm">
            {barber.ciudad} | {barber.direccion}
          </p>
          <p className="text-sm line-clamp-3">{barber.descripcion}</p>
        </div>
        <div className="flex flex-wrap h-full items-end">
          <Dialog>
            <DialogTrigger>
              <Button variant="secondary">
                {success ? "Turno creado" : "Sacar turno"}
              </Button>
            </DialogTrigger>
            <DialogContent forceMount>
              <DialogHeader>
                <DialogTitle>Sacar turno</DialogTitle>
              </DialogHeader>
              <form
                className="flex flex-col gap-4"
                onSubmit={handleSubmit(appointmentFunction)}
              >
                {success ? (
                  <div className="flex flex-col gap-2">
                    <span>Turno creado con exito</span>
                    <div className="flex gap-8 w-full">
                      <DialogClose className="w-full">
                        <Button variant="secondary" className="w-full">
                          Cerrar
                        </Button>
                      </DialogClose>

                      <Button
                        variant="simple"
                        onClick={() => {
                          reset()
                          setSuccess(false)
                        }}
                        className=" w-full"
                      >
                        Solicitar otro turno
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col gap-2">
                      <Label>Fecha</Label>
                      <Input
                        type="date"
                        {...registerForm("fecha")}
                        onChange={(e) => setValue("fecha", e.target.value)} // Directamente el string en formato "YYYY-MM-DD"
                        placeholder="YYYY-MM-DD"
                      />
                      <small className="text-red-500 font-bold">
                        {errors.fecha?.message}
                      </small>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label>Hora</Label>
                      <Input
                        type="text"
                        {...registerForm("hora")}
                        onChange={(e) => setValue("hora", e.target.value)}
                        placeholder="00:00"
                      />
                      <small className="text-red-500 font-bold">
                        {errors.hora?.message}
                      </small>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label>Nota</Label>
                      <Textarea
                        {...registerForm("nota")}
                        onChange={(e) => setValue("nota", e.target.value)}
                        placeholder="Ingrese informacion relevante para el barbero"
                      />
                      <small className="text-red-500 font-bold">
                        {errors.nota?.message}
                      </small>
                    </div>
                    <small className="text-red-500 font-bold">
                      {error?.message}
                    </small>

                    <Button variant="simple" type="submit">
                      Enviar turno
                    </Button>
                  </>
                )}
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
export default Card
