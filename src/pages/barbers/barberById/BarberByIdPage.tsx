import CarouselDesktop, { CarouselMobile } from "@/components/shared/Carousel"
import { getBarberById } from "@/services/BarberService"
import { Icon } from "@iconify/react/dist/iconify.js"
import { useQuery } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
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
import { getCheckReview, getReviews } from "@/services/ReviewService"
import HandleChangeReviews from "@/pages/profile/reviews/components/HandleChangeReviews"
import { createOrGetChat } from "@/services/ChatService"
import { useAuthContext } from "@/contexts/authContext"
import toast, { Toaster } from "react-hot-toast"

const BarberByIdPage = () => {
  const [success, setSuccess] = useState(false)
  const { authUser } = useAuthContext()
  const params = useParams()
  const navigate = useNavigate()
  const { mutate, error } = useMutation({
    mutationKey: ["create-appointment"],
    mutationFn: async (values: any) => {
      if (params.id == undefined) return
      return await createAppointment(values, params.id)
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

  const { data, isLoading } = useQuery({
    queryKey: ["barber", params.id],
    queryFn: () => {
      if (params.id === undefined)
        return Promise.reject("Barberia no encontrada")
      return getBarberById(params.id)
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24,
    retry: false,
  })

  const { data: reviews } = useQuery({
    queryKey: ["review-barber", params.id],
    queryFn: () => getReviews(params.id as string),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24,
    retry: false,
  })

  const { data: checkReview, refetch: refetchCheck } = useQuery({
    queryKey: ["check-review", params.id],
    queryFn: () => getCheckReview(params.id as string),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24,
    retry: false,
  })

  const { mutate: initiateChat, isPending: isCreatingChat } = useMutation({
    mutationFn: () => {
      if (!data) {
        throw new Error(
          "La información de la barbería o del barbero no está disponible."
        )
      }
      // El backend espera el ID del barbero y de la barbería.
      // El 'clienteId' se extrae del token en el backend.
      return createOrGetChat(data.data.idPropietario, data.data.id)
    },
    onSuccess: (chatData) => {
      // Navegar a la pantalla de chat con el ID del chat obtenido
      navigate(`/chats/${chatData.id}`)
    },
    onError: (err) => {
      console.log(err)
    },
  })

  const handleInitiateChat = () => {
    // No permitir iniciar un chat consigo mismo (si el propietario ve su propia barbería)
    if (data?.data.idPropietario === authUser?.user.sub) {
      toast.error("No puedes iniciar un chat con tu propia barbería")
      return
    }
    initiateChat()
  }
  return (
    <main className="flex flex-col min-h-screen w-full relative">
      <Button
        variant="secondary"
        className="fixed bottom-28 right-3"
        onClick={handleInitiateChat}
        disabled={isCreatingChat}
      >
        <Icon icon="material-symbols:chat" width={24} />
      </Button>

      {checkReview?.data && (
        <a href="#reviews">
          <Button
            variant="simple"
            className="fixed bottom-16 right-3"
            onClick={() => window.scrollTo(0, 10000)}
          >
            {/* Star */}
            <Icon
              icon="material-symbols:star"
              color={checkReview.data.canCreate === true ? "white" : "gold"}
              width={24}
            />
          </Button>
        </a>
      )}

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
            images={[data?.data.imagen_perfil, ...(data?.data.imagenes || [])]}
            isLoading={isLoading}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4 bg-gray-main w-full h-full p-2 pt-4">
        <div className="flex flex-row sm:flex-col justify-between items-center gap-2">
          <div className="hidden sm:flex max-w-[400px] -ml-20">
            <CarouselDesktop
              images={[
                data?.data.imagen_perfil,
                ...(data?.data.imagenes || []),
              ]}
              isLoading={isLoading}
            />
          </div>

          <h2 className="text-xl font-extrabold">{data?.data.nombre}</h2>

          <div className="flex gap-2 items-center">
            {data?.data.puntaje > 0 && (
              <div className="flex gap-2 items-center justify-start">
                {Array.from({ length: data?.data.puntaje }).map((_, index) => (
                  <span key={index}>
                    <Icon
                      icon="material-symbols:star"
                      color="gold"
                      width={20}
                    />
                  </span>
                ))}
              </div>
            )}
            {!Number.isInteger(data?.data.puntaje) && (
              <Icon icon="material-symbols:star-half" color="gold" width={20} />
            )}

            {Array.from({
              length: 5 - Math.ceil(data?.data.puntaje),
            }).map((_, index) => (
              <span key={index}>
                <Icon
                  icon="material-symbols:star-outline"
                  stroke="1"
                  width={20}
                />
              </span>
            ))}
          </div>
        </div>

        <div className="flex sm items-center gap-2 justify-between w-full  bg-black-main rounded-xl p-2">
          <div className="flex flex-col gap-2">
            <p className="font-extralight text-sm">{data?.data.barbero}</p>

            <p className="font-extralight text-sm">
              Duración aproximada:{" "}
              <span className="font-bold">
                {data?.data.cantidadDeMinutosPorTurno}
              </span>
            </p>
          </div>

          <div className="flex gap-2 items-center justify-end">
            <span>Ahora: </span>
            <p
              className={`font-extrabold text-md 
            ${data?.data.abierto ? "text-green-500" : "text-red-500"} `}
            >
              {data?.data.abierto ? "Abierto" : "Cerrado"}
            </p>
          </div>
        </div>

        <section className="flex flex-col sm:flex-row gap-2 w-full">
          <div className="flex flex-col gap-2 m-0.5 p-2 bg-black-main rounded-xl w-full">
            <div className="flex flex-col gap-2 h-full">
              <span className="font-extrabold">Sobre nosotros</span>
              <p className="font-extralight text-sm">
                {data?.data.descripcion}
              </p>
            </div>

            <div className="hidden sm:flex flex-col gap-2 h-full">
              <span className="font-extrabold">Horarios</span>
              {data?.data.horarios.map((horario: any) => (
                <div
                  key={crypto.randomUUID()}
                  className="flex gap-2 justify-between"
                >
                  <p className="font-extralight text-sm">{horario.dia}</p>
                  <p className="font-extralight text-sm">
                    {horario.hora_apertura} - {horario.hora_cierre}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 m-0.5 p-2 bg-black-main rounded-xl w-full">
            <span className="font-extrabold">Ubicación</span>
            <div className="flex gap-2 justify-between">
              <p className="font-extralight text-sm">{data?.data.direccion}</p>
              <p className="font-extralight text-sm">{data?.data.ciudad}</p>
            </div>
            <iframe
              id="mapa"
              className="w-full sm:w-[60vw] h-56 sm:h-72 rounded-xl"
              title="Ubicación de la barbería en el mapa"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${data?.data.latitud},${data?.data.longitud}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
            />
          </div>
        </section>

        <div className="flex sm:hidden flex-col gap-2 m-0.5 p-2 bg-black-main rounded-xl">
          <span className="font-extrabold">Horarios</span>
          {data?.data.horarios.map((horario: any) => (
            <div
              key={crypto.randomUUID()}
              className="flex gap-2 justify-between"
            >
              <p className="font-extralight text-sm">{horario.dia}</p>
              <p className="font-extralight text-sm">
                {horario.hora_apertura} - {horario.hora_cierre}
              </p>
            </div>
          ))}
        </div>

        {checkReview?.data && (
          <div
            className="flex flex-col gap-2 m-0.5 p-2 bg-black-main rounded-xl"
            id="reseñas"
          >
            {checkReview?.data.resena && (
              <>
                <span className="font-extrabold">Mi reseña</span>
                <div className="flex flex-col gap-3 bg-gray-main p-3 rounded-xl">
                  <div className="flex justify-between gap-2">
                    <span>{checkReview.data.resena?.user}</span>
                    <div className="flex gap-2 items-center justify-start">
                      {checkReview.data.resena?.calificacion > 0 && (
                        <div className="flex gap-2 items-center justify-start">
                          {Array.from({
                            length: checkReview.data.resena?.calificacion,
                          }).map((_, index) => (
                            <span key={index}>
                              <Icon
                                icon="material-symbols:star"
                                color="gold"
                                width={20}
                              />
                            </span>
                          ))}
                        </div>
                      )}

                      {!Number.isInteger(
                        checkReview.data.resena?.calificacion
                      ) && (
                        <Icon
                          icon="material-symbols:star-half"
                          color="gold"
                          width={20}
                        />
                      )}

                      {Array.from({
                        length:
                          5 - Math.ceil(checkReview.data.resena?.calificacion),
                      }).map((_, index) => (
                        <span key={index}>
                          <Icon
                            icon="material-symbols:star-outline"
                            stroke="1"
                            width={20}
                          />
                        </span>
                      ))}
                    </div>
                  </div>

                  <p>{checkReview.data.resena?.descripcion}</p>
                  <Dialog>
                    <DialogTrigger>
                      <Button variant="secondary">Editar</Button>
                    </DialogTrigger>
                    <DialogContent forceMount>
                      <DialogHeader>
                        <DialogTitle>Editar una reseña</DialogTitle>
                      </DialogHeader>
                      <HandleChangeReviews
                        review={checkReview.data.resena}
                        refetch={refetchCheck}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </>
            )}

            {checkReview?.data.canCreate == true && (
              <>
                <span className="font-extrabold text-xl">Dejar una reseña</span>
                <p>Queremos saber tu opinión sobre nuestra barbería</p>
                <section className="flex items-center justify-start">
                  <Dialog>
                    <DialogTrigger>
                      <Button
                        variant="secondary"
                        className="flex gap-2 text-white"
                      >
                        <Icon
                          icon="material-symbols:star"
                          width={24}
                          height={24}
                          color="gold"
                        />
                        <span>Dejar una reseña</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent forceMount>
                      <DialogHeader>
                        <DialogTitle>Dejar una reseña</DialogTitle>
                      </DialogHeader>
                      <HandleChangeReviews
                        idBarber={data?.data.id}
                        refetch={refetchCheck}
                      />
                    </DialogContent>
                  </Dialog>
                </section>
              </>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2 m-0.5 p-2 bg-black-main rounded-xl">
          <span className="font-extrabold">Reseñas</span>
          {reviews?.data.results.map((resena: any) => {
            if (
              resena.id === checkReview?.data?.resena?.id &&
              reviews.data.results.length == 1
            ) {
              return <span>No se encontraron más reseñas</span>
            }
            if (resena.id === checkReview?.data?.resena?.id) {
              return null
            }
            return (
              <div
                className="flex flex-col gap-3 bg-gray-main p-3 rounded-xl"
                key={resena.id}
              >
                <div className="flex justify-between gap-2">
                  <span>{resena.user}</span>
                  <div className="flex gap-2 items-center justify-start">
                    {resena.calificacion > 0 && (
                      <div className="flex gap-2 items-center justify-start">
                        {Array.from({ length: resena.calificacion }).map(
                          (_, index) => (
                            <span key={index}>
                              <Icon
                                icon="material-symbols:star"
                                color="gold"
                                width={20}
                              />
                            </span>
                          )
                        )}
                      </div>
                    )}

                    {!Number.isInteger(resena.calificacion) && (
                      <Icon
                        icon="material-symbols:star-half"
                        color="gold"
                        width={20}
                      />
                    )}

                    {Array.from({
                      length: 5 - Math.ceil(resena.calificacion),
                    }).map((_, index) => (
                      <span key={index}>
                        <Icon
                          icon="material-symbols:star-outline"
                          stroke="1"
                          width={20}
                        />
                      </span>
                    ))}
                  </div>
                </div>

                <p>{resena.descripcion}</p>
              </div>
            )
          })}
          {reviews?.data.results.length == 0 && (
            <span>No se encontraron reseñas</span>
          )}
        </div>

        <div className="flex flex-wrap h-full items-end w-full">
          <Dialog>
            <DialogTrigger className="w-full">
              <Button variant="secondary" className="w-full">
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
                    <div className="flex justify-between gap-8 w-full">
                      <DialogClose>
                        <Button variant="secondary" className="w-60">
                          Cerrar
                        </Button>
                      </DialogClose>

                      <Button
                        variant="simple"
                        onClick={() => {
                          reset()
                          setSuccess(false)
                        }}
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
                        placeholder="Ingrese información relevante para el barbero"
                      />
                      <small className="text-red-500 font-bold">
                        {errors.nota?.message}
                      </small>
                    </div>
                    <small className="text-red-500 font-bold">
                      {(error as any)?.response?.data?.message}
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
      </section>
      <Toaster position="bottom-right" reverseOrder={false} />
    </main>
  )
}
export default BarberByIdPage
