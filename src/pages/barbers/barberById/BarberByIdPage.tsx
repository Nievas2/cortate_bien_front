import CarouselDesktop, { CarouselMobile } from "@/components/shared/Carousel";
import { getBarberById } from "@/services/BarberService";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { appointmentSchema } from "@/utils/schemas/appointmentSchema";
import { Textarea } from "@/components/ui/textarea";
import { createAppointment } from "@/services/AppointmentService";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { getCheckReview, getReviews } from "@/services/ReviewService";
import HandleChangeReviews from "@/pages/profile/reviews/components/HandleChangeReviews";
import { createOrGetChat } from "@/services/ChatService";
import { useAuthContext } from "@/contexts/authContext";
import moment from "moment";
import { DayEnum } from "@/interfaces/Day";
import toast from "react-hot-toast";
import { Background } from "@/components/ui/background";

export function getDiaByDate(date: Date): DayEnum {
  const dia = moment(date).day(); // Devuelve 0 (Domingo) - 6 (Sábado)

  switch (dia) {
    case 0:
      return DayEnum.DOMINGO;
    case 1:
      return DayEnum.LUNES;
    case 2:
      return DayEnum.MARTES;
    case 3:
      return DayEnum.MIERCOLES;
    case 4:
      return DayEnum.JUEVES;
    case 5:
      return DayEnum.VIERNES;
    case 6:
      return DayEnum.SABADO;
    default:
      throw new Error("Día inválido");
  }
}

const BarberByIdPage = () => {
  const [success, setSuccess] = useState(false);
  const { authUser } = useAuthContext();
  const params = useParams();
  const navigate = useNavigate();
  const { mutate, error } = useMutation({
    mutationKey: ["create-appointment"],
    mutationFn: async (values: any) => {
      if (params.id == undefined) return;
      return await createAppointment(values, params.id);
    },
    onSuccess() {
      setSuccess(true);
    },
  });

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
  });

  const appointmentFunction = async (values: any) => {
    mutate(values);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["barber", params.id],
    queryFn: () => {
      if (params.id === undefined)
        return Promise.reject("Barberia no encontrada");
      return getBarberById(params.id);
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24,
    retry: false,
  });

  const { data: reviews } = useQuery({
    queryKey: ["review-barber", params.id],
    queryFn: () => getReviews(params.id as string),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24,
    retry: false,
  });

  const { data: checkReview, refetch: refetchCheck } = useQuery({
    queryKey: ["check-review", params.id],
    queryFn: () => getCheckReview(params.id as string),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24,
    retry: false,
  });

  const { mutate: initiateChat, isPending: isCreatingChat } = useMutation({
    mutationFn: () => {
      if (!data) {
        throw new Error(
          "La información de la barbería o del barbero no está disponible."
        );
      }
      return createOrGetChat(data.data.idPropietario, data.data.id);
    },
    onSuccess: (chatData) => {
      navigate(`/chats/${chatData.id}`);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const handleInitiateChat = () => {
    if (data?.data.idPropietario === authUser?.user.sub) {
      toast.error("No puedes iniciar un chat con tu propia barbería");
      return;
    }
    initiateChat();
  };
  const hoyEnum = getDiaByDate(new Date());

  const isOpen = (() => {
    if (!data?.data.horarios) return false;
    const horarioHoy = data.data.horarios.find(
      (horario: any) => horario.dia === hoyEnum
    );
    if (!horarioHoy) return false;

    const now = moment();
    const horaApertura = moment(horarioHoy.hora_apertura, "HH:mm");
    const horaCierre = moment(horarioHoy.hora_cierre, "HH:mm");

    if (horaCierre.isAfter(horaApertura)) {
      return now.isBetween(horaApertura, horaCierre);
    } else {
      return now.isAfter(horaApertura) || now.isBefore(horaCierre);
    }
  })();

  return (
    <Background>
      <main className="flex flex-col min-h-screen w-full relative">
        {/* Floating Action Buttons - Rediseñados */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
          <Button
            variant="secondary"
            size="icon"
            onClick={handleInitiateChat}
            disabled={isCreatingChat}
            className="w-10 h-10 rounded-full shadow-lg bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white border-0 transition-all duration-300 hover:scale-110"
          >
            <Icon icon="material-symbols:chat" width={24} />
          </Button>

          {checkReview?.data && (
            <Button
              variant="secondary"
              size="icon"
              onClick={() =>
                document
                  .getElementById("reviews")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="w-10 h-10 rounded-full shadow-lg bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white border-0 transition-all duration-300 hover:scale-110"
            >
              <Icon icon="material-symbols:star" width={24} />
            </Button>
          )}

          <Button
            variant="secondary"
            size="icon"
            onClick={() =>
              window.scrollTo({
                top: document.body.scrollHeight,
                behavior: "smooth",
              })
            }
            className="w-10 h-10 rounded-full shadow-lg bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-800 text-white border-0 transition-all duration-300 hover:scale-110"
          >
            <Icon icon="carbon:arrow-down" width={24} />
          </Button>
        </div>

        {/* Hero Section con Carousel */}
        <section className="relative">
          <div className="static sm:hidden w-full h-full">
            <CarouselMobile
              images={[
                data?.data.imagen_perfil,
                ...(data?.data.imagenes || []),
              ]}
              isLoading={isLoading}
            />
          </div>

          {/* Gradient Overlay para mobile */}
          <div className="sm:hidden absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
        </section>

        {/* Main Content */}
        <section className="flex flex-col gap-6 w-full h-full p-4 pt-6">
          {/* Header Section - Rediseñado */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white/80 dark:bg-gray-800/40 rounded-2xl p-6 shadow-lg">
            <div className="hidden sm:flex max-w-[450px]">
              <CarouselDesktop
                images={[
                  data?.data.imagen_perfil,
                  ...(data?.data.imagenes || []),
                ]}
                isLoading={isLoading}
              />
            </div>

            <div className="flex-1 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {data?.data.nombre}
                </h1>

                {/* Rating Display */}
                {data?.data.puntaje > 0 && (
                  <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 rounded-full">
                    <div className="flex items-center">
                      {Array.from({
                        length: Math.floor(data?.data.puntaje),
                      }).map((_, index) => (
                        <Icon
                          key={index}
                          icon="material-symbols:star"
                          color="gold"
                          width={18}
                        />
                      ))}
                      {!Number.isInteger(data?.data.puntaje) && (
                        <Icon
                          icon="material-symbols:star-half"
                          color="gold"
                          width={18}
                        />
                      )}
                      {Array.from({
                        length: 5 - Math.ceil(data?.data.puntaje),
                      }).map((_, index) => (
                        <Icon
                          key={index}
                          icon="material-symbols:star-outline"
                          width={18}
                          className="text-gray-300"
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {data?.data.puntaje.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              {/* Status Card */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-xl p-4 text-white">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col gap-1">
                    <p className="text-blue-100 text-sm">Barbero</p>
                    <p className="font-semibold">{data?.data.barbero}</p>
                    <p className="text-blue-100 text-sm">
                      Duración aproximada por turno:{" "}
                      <span className="font-semibold text-white">
                        {data?.data.cantidadDeMinutosPorTurno} min
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <p className="text-blue-100 text-sm">Estado actual</p>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${isOpen ? "bg-green-400" : "bg-red-400"}`}
                      ></div>
                      <p
                        className={`font-bold ${isOpen ? "text-green-300" : "text-red-300"}`}
                      >
                        {isOpen ? "Abierto" : "Cerrado"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* About Section */}
            <div className="bg-white/80 dark:bg-gray-800/40 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Icon
                    icon="material-symbols:info"
                    className="text-blue-600 dark:text-blue-400"
                    width={20}
                  />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Sobre nosotros
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {data?.data.descripcion}
              </p>

              {/* Schedule - Desktop */}
              <div className="hidden sm:block mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <Icon
                      icon="material-symbols:schedule"
                      className="text-green-600 dark:text-green-400"
                      width={16}
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Horarios
                  </h3>
                </div>
                <div className="space-y-2">
                  {data?.data.horarios.map((horario: any) => (
                    <div
                      key={crypto.randomUUID()}
                      className="flex justify-between items-center py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                    >
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {horario.dia}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {horario.hora_apertura} - {horario.hora_cierre}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="bg-white/80 dark:bg-gray-800/40 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <Icon
                    icon="material-symbols:location-on"
                    className="text-red-600 dark:text-red-400"
                    width={20}
                  />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Ubicación
                </h2>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2">
                  <Icon
                    icon="material-symbols:home"
                    className="text-gray-500"
                    width={16}
                  />
                  <span className="text-gray-600 dark:text-gray-300">
                    {data?.data.direccion}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon
                    icon="material-symbols:location-city"
                    className="text-gray-500"
                    width={16}
                  />
                  <span className="text-gray-600 dark:text-gray-300">
                    {data?.data.ciudad}
                  </span>
                </div>
              </div>

              <iframe
                id="mapa"
                className="w-full h-56 sm:h-72 rounded-xl border-0 shadow-inner"
                title="Ubicación de la barbería en el mapa"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${data?.data.latitud},${data?.data.longitud}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              />
            </div>
          </div>

          {/* Schedule Mobile */}
          <div className="sm:hidden bg-white/80 dark:bg-gray-800/40 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Icon
                  icon="material-symbols:schedule"
                  className="text-green-600 dark:text-green-400"
                  width={20}
                />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Horarios
              </h2>
            </div>
            <div className="space-y-2">
              {data?.data.horarios.map((horario: any) => (
                <div
                  key={crypto.randomUUID()}
                  className="flex justify-between items-center py-3 px-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {horario.dia}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {horario.hora_apertura} - {horario.hora_cierre}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* My Review Section */}
          {checkReview?.data && (
            <div className="bg-white/80 dark:bg-gray-800/40 rounded-2xl p-6 shadow-lg">
              {checkReview?.data.resena && (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                      <Icon
                        icon="material-symbols:rate-review"
                        className="text-purple-600 dark:text-purple-400"
                        width={20}
                      />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Mi reseña
                    </h2>
                  </div>

                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 p-4 rounded-xl">
                    <div className="flex justify-between items-start mb-3">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {checkReview.data.resena?.user}
                      </span>
                      <div className="flex items-center">
                        {checkReview.data.resena?.calificacion > 0 && (
                          <>
                            {Array.from({
                              length: checkReview.data.resena?.calificacion,
                            }).map((_, index) => (
                              <Icon
                                key={index}
                                icon="material-symbols:star"
                                color="gold"
                                width={18}
                              />
                            ))}
                            {!Number.isInteger(
                              checkReview.data.resena?.calificacion
                            ) && (
                              <Icon
                                icon="material-symbols:star-half"
                                color="gold"
                                width={18}
                              />
                            )}
                            {Array.from({
                              length:
                                5 -
                                Math.ceil(
                                  checkReview.data.resena?.calificacion
                                ),
                            }).map((_, index) => (
                              <Icon
                                key={index}
                                icon="material-symbols:star-outline"
                                width={18}
                                className="text-gray-300"
                              />
                            ))}
                          </>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      {checkReview.data.resena?.descripcion}
                    </p>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="secondary"
                          className="bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-0"
                        >
                          <Icon
                            icon="material-symbols:edit"
                            width={16}
                            className="mr-2"
                          />
                          Editar reseña
                        </Button>
                      </DialogTrigger>
                      <DialogContent forceMount className="rounded-2xl">
                        <DialogHeader>
                          <DialogTitle>Editar reseña</DialogTitle>
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
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                      <Icon
                        icon="material-symbols:star"
                        color="gold"
                        width={20}
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Dejar una reseña
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Queremos saber tu opinión sobre nuestra barbería
                      </p>
                    </div>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                        <Icon
                          icon="material-symbols:star"
                          width={20}
                          className="mr-2"
                        />
                        Dejar una reseña
                      </Button>
                    </DialogTrigger>
                    <DialogContent forceMount className="rounded-2xl">
                      <DialogHeader>
                        <DialogTitle>Dejar una reseña</DialogTitle>
                      </DialogHeader>
                      <HandleChangeReviews
                        idBarber={data?.data.id}
                        refetch={refetchCheck}
                      />
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </div>
          )}

          {/* Reviews Section */}
          <div
            id="reviews"
            className="bg-white/80 dark:bg-gray-800/40 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                <Icon
                  icon="material-symbols:reviews"
                  className="text-orange-600 dark:text-orange-400"
                  width={20}
                />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Reseñas de clientes
              </h2>
            </div>

            <div className="space-y-4">
              {reviews?.data.results.map((resena: any) => {
                if (
                  resena.id === checkReview?.data?.resena?.id &&
                  reviews.data.results.length == 1
                ) {
                  return (
                    <div key="no-reviews" className="text-center py-8">
                      <Icon
                        icon="material-symbols:sentiment-neutral"
                        className="text-gray-400 mx-auto mb-3"
                        width={48}
                      />
                      <p className="text-gray-500 dark:text-gray-400">
                        No se encontraron más reseñas
                      </p>
                    </div>
                  );
                }
                if (resena.id === checkReview?.data?.resena?.id) {
                  return null;
                }
                return (
                  <div
                    className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-200 dark:border-gray-600"
                    key={resena.id}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {resena.user.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {resena.user}
                        </span>
                      </div>
                      <div className="flex items-center">
                        {resena.calificacion > 0 && (
                          <>
                            {Array.from({ length: resena.calificacion }).map(
                              (_, index) => (
                                <Icon
                                  key={index}
                                  icon="material-symbols:star"
                                  color="gold"
                                  width={16}
                                />
                              )
                            )}
                            {!Number.isInteger(resena.calificacion) && (
                              <Icon
                                icon="material-symbols:star-half"
                                color="gold"
                                width={16}
                              />
                            )}
                            {Array.from({
                              length: 5 - Math.ceil(resena.calificacion),
                            }).map((_, index) => (
                              <Icon
                                key={index}
                                icon="material-symbols:star-outline"
                                width={16}
                                className="text-gray-300"
                              />
                            ))}
                          </>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300">
                      {resena.descripcion}
                    </p>
                  </div>
                );
              })}

              {reviews?.data.results.length == 0 && (
                <div className="text-center py-8">
                  <Icon
                    icon="material-symbols:sentiment-neutral"
                    className="text-gray-400 mx-auto mb-3"
                    width={48}
                  />
                  <p className="text-gray-500 dark:text-gray-400">
                    No se encontraron reseñas
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* CTA Section */}
          <div className="sticky bottom-0 bg-white/80 dark:bg-gray-800/40 p-6 rounded-t-2xl shadow-lg border-t border-gray-200 dark:border-gray-700 mt-6">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={success}
                >
                  {success ? (
                    <>
                      <Icon
                        icon="material-symbols:check-circle"
                        width={24}
                        className="mr-2"
                      />
                      Turno creado exitosamente
                    </>
                  ) : (
                    <>
                      <Icon
                        icon="material-symbols:calendar-add-on"
                        width={24}
                        className="mr-2"
                      />
                      Sacar turno
                    </>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent forceMount className="rounded-2xl max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl">Sacar turno</DialogTitle>
                </DialogHeader>
                <form
                  className="flex flex-col gap-4"
                  onSubmit={handleSubmit(appointmentFunction)}
                >
                  {success ? (
                    <div className="flex flex-col gap-4 text-center py-4">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Icon
                          icon="material-symbols:check-circle"
                          className="text-green-600 dark:text-green-400"
                          width={32}
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        ¡Turno creado con éxito!
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Tu solicitud ha sido enviada a la barbería
                      </p>

                      <div className="flex flex-col gap-3 mt-4">
                        <DialogClose asChild>
                          <Button variant="secondary" className="w-full">
                            Cerrar
                          </Button>
                        </DialogClose>

                        <Button
                          variant="outline"
                          onClick={() => {
                            reset();
                            setSuccess(false);
                          }}
                          className="w-full"
                        >
                          Solicitar otro turno
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Fecha
                          </Label>
                          <Input
                            type="date"
                            {...registerForm("fecha")}
                            onChange={(e) => setValue("fecha", e.target.value)}
                            className="rounded-xl border-gray-200 dark:border-gray-600"
                            placeholder="YYYY-MM-DD"
                          />
                          {errors.fecha?.message && (
                            <p className="text-red-500 text-sm font-medium">
                              {errors.fecha?.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Hora
                          </Label>
                          <Input
                            type="text"
                            {...registerForm("hora")}
                            onChange={(e) => setValue("hora", e.target.value)}
                            className="rounded-xl border-gray-200 dark:border-gray-600"
                            placeholder="00:00"
                          />
                          {errors.hora?.message && (
                            <p className="text-red-500 text-sm font-medium">
                              {errors.hora?.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Nota
                          </Label>
                          <Textarea
                            {...registerForm("nota")}
                            onChange={(e) => setValue("nota", e.target.value)}
                            className="rounded-xl border-gray-200 dark:border-gray-600 min-h-[100px]"
                            placeholder="Ingrese información relevante para el barbero"
                          />
                          {errors.nota?.message && (
                            <p className="text-red-500 text-sm font-medium">
                              {errors.nota?.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {(error as any)?.response?.data?.message && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3">
                          <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                            {(error as any)?.response?.data?.message}
                          </p>
                        </div>
                      )}

                      <Button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Icon
                          icon="material-symbols:send"
                          width={20}
                          className="mr-2"
                        />
                        Enviar solicitud
                      </Button>
                    </>
                  )}
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </section>
      </main>
    </Background>
  );
};
export default BarberByIdPage;
