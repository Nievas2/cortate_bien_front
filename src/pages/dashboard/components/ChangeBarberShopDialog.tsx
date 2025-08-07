import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react/dist/iconify.js"
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
import StateSelect from "./StateSelect"
import CitySelect from "./CitySelect"
import MapSelector from "@/hooks/dashboard/MapSelector"
import { useDropzone } from "react-dropzone"
import { postImage } from "@/services/ImagesService"

// Componente del diálogo mejorado
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
  const [uploadingImage, setUploadingImage] = useState(false)
  const [profilePicture, setProfilePicture] = useState([])
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)

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
      setLoading(false)
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
    onSuccess: () => {
      setLoading(false)
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
      imagenes: barber?.imagenes ? barber?.imagenes : [],
    },
    resolver: zodResolver(barberSchema),
  })

  const handleSubmitForm = async (data: any) => {
    setLoading(true)
    const { imagenes, imagen_perfil } = await handleSubmitImages()
    if (imagenes.length === 0 && !imagen_perfil) return setLoading(false)

    if (barber !== undefined) {
      const formData = {
        ...data,
        imagenes,
        imagen_perfil: barber.imagen_perfil,
      }
      return update(formData)
    }
    const formData = {
      ...data,
      imagenes,
      imagen_perfil,
    }
    mutate(formData)
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

  const [position, setPosition] = useState({
    lat: barber?.latitud ? barber.latitud.toString() : 0,
    lng: barber?.longitud ? barber.longitud.toString() : 0,
  })
  const [error, setError] = useState("")

  useEffect(() => {
    if (barber != undefined) return
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

  const onDrop = (acceptedFiles: any) => {
    setImages(acceptedFiles)
  }

  const onDropProfile = (acceptedFiles: any) => {
    setProfilePicture(acceptedFiles)
  }

  const {
    getRootProps: getRootPropsProfile,
    getInputProps: getInputPropsProfile,
    isDragActive: isDragActiveProfile,
    isDragReject: isDragRejectProfile,
  } = useDropzone({
    onDrop: onDropProfile,
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    accept: {
      "image/*": [],
    },
  })

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      maxFiles: 3,
      maxSize: 5 * 1024 * 1024,
      accept: {
        "image/*": [],
      },
    })

  const handleSubmitImages = (): Promise<{
    imagenes: string[]
    imagen_perfil: string
  }> => {
    setUploadingImage(true)
    return new Promise(async (resolve, reject) => {
      try {
        let imagesUploadUrl: string[] = []
        let profilePictureUrl = ""

        if (typeof profilePicture !== "string") {
          const imagesUpload = [...profilePicture]
          for (const imageUp of imagesUpload) {
            if (imageUp !== undefined) {
              const formData = new FormData()
              formData.append("image", imageUp)
              try {
                const response = await postImage(formData)
                profilePictureUrl = response.data.directLink
              } catch (error) {
                reject({ imagenes: [], imagen_perfil: "" })
                return
              }
            }
          }
        }

        const imagesUpload = [...images]
        for (const imageUp of imagesUpload) {
          if (imageUp !== undefined) {
            const formData = new FormData()
            formData.append("image", imageUp)
            try {
              const response = await postImage(formData)
              imagesUploadUrl.push(response.data.directLink)
            } catch (error) {
              reject({ imagenes: [], imagen_perfil: "" })
              return
            }
          }
        }
        resolve({
          imagenes: imagesUploadUrl,
          imagen_perfil: profilePictureUrl,
        })
      } catch (error) {
        reject({ imagenes: [], imagen_perfil: "" })
      } finally {
        setUploadingImage(false)
      }
    })
  }

  function handleRemoveImage(index: any) {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  return (
    <div className="p-6">
      {isSuccess || isSuccessUpdate ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon
              icon="tabler:check"
              className="w-8 h-8 text-green-600 dark:text-green-400"
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {barber != undefined ? "Barbería actualizada" : "Barbería creada"}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Los cambios se han guardado correctamente
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-8">
          {/* Información básica */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Icon icon="tabler:info-circle" className="w-5 h-5 mr-2" />
              Información Básica
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nombre de la barbería
                </Label>
                <Input
                  type="text"
                  placeholder="Ej: Barbería El Corte Perfecto"
                  {...register("nombre")}
                  disabled={isPending || isPendingUpdate || uploadingImage}
                  className="border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                />
                {errors.nombre?.message && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.nombre.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Minutos por turno
                </Label>
                <Input
                  type="number"
                  placeholder="30"
                  {...register("cantidadDeMinutosPorTurno")}
                  disabled={isPending || isPendingUpdate || uploadingImage}
                  className="border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                />
                {errors.cantidadDeMinutosPorTurno?.message && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.cantidadDeMinutosPorTurno.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Descripción
              </Label>
              <Textarea
                placeholder="Describe tu barbería, servicios y ambiente..."
                {...register("descripcion")}
                rows={4}
                disabled={isPending || isPendingUpdate || uploadingImage}
                className="border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 resize-none"
              />
              {errors.descripcion?.message && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.descripcion.message}
                </p>
              )}
            </div>
          </div>

          {/* Ubicación */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Icon icon="tabler:map-pin" className="w-5 h-5 mr-2" />
              Ubicación
            </h3>

            {position.lat != 0 && (
              <div className="mb-6 rounded-lg overflow-hidden">
                <MapSelector
                  position={{
                    lat: Number(position.lat),
                    lng: Number(position.lng),
                  }}
                  onChangePosition={(lat, lng) => {
                    setValue("latitud", lat.toString())
                    setValue("longitud", lng.toString())
                    setPosition({ lat, lng })
                  }}
                />
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Si no deseas compartir tu ubicación, puedes ingresar las
                  coordenadas manualmente.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Latitud
                </Label>
                <Input
                  type="number"
                  step="any"
                  placeholder="-34.6037"
                  value={position.lat || ""}
                  onChange={(e) => {
                    const value = e.target.value
                    const parsedValue = parseFloat(value)

                    if (!isNaN(parsedValue)) {
                      setValue("latitud", value)
                      setPosition({
                        ...position,
                        lat: parsedValue,
                      })
                    } else if (value === "") {
                      setValue("latitud", "")
                      setPosition((prev) => ({ ...prev, lat: 0 }))
                    }
                  }}
                  disabled={isPending || isPendingUpdate || uploadingImage}
                  className="border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                />
                {errors.latitud?.message && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.latitud.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Longitud
                </Label>
                <Input
                  type="number"
                  step="any"
                  placeholder="-58.3816"
                  value={position.lng || ""}
                  onChange={(e) => {
                    const value = e.target.value
                    const parsedValue = parseFloat(value)

                    if (!isNaN(parsedValue)) {
                      setValue("longitud", value)
                      setPosition({
                        ...position,
                        lng: parsedValue,
                      })
                    } else if (value === "") {
                      setValue("longitud", "")
                      setPosition((prev) => ({ ...prev, lng: 0 }))
                    }
                  }}
                  disabled={isPending || isPendingUpdate || uploadingImage}
                  className="border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                />
                {errors.longitud?.message && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.longitud.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Dirección completa
              </Label>
              <Input
                type="text"
                placeholder="Ej: Av. Corrientes 1234, CABA, Argentina"
                {...register("direccion")}
                disabled={isPending || isPendingUpdate || uploadingImage}
                className="border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
              />
              {errors.direccion?.message && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.direccion.message}
                </p>
              )}
            </div>

            {/* Selectores de ubicación para barbería nueva */}
            {barber == undefined && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    País
                  </Label>
                  {isSuccessCountries && Array.isArray(data?.data) ? (
                    <CountrySelect
                      countries={data?.data}
                      onChange={handleSelectCountry}
                    />
                  ) : (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Error al cargar países
                    </p>
                  )}
                </div>

                {countryId && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Estado/Provincia
                    </Label>
                    <StateSelect
                      countryId={countryId}
                      onChange={(state: number) => setStateId(state)}
                    />
                  </div>
                )}

                {stateId && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Ciudad
                    </Label>
                    <CitySelect
                      stateId={stateId}
                      onChange={(city: number) =>
                        setValue("ciudad_id", city.toString())
                      }
                    />
                    {errors.ciudad_id?.message && (
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {errors.ciudad_id.message}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {stateId && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                  ⚠️ Verifica que la ubicación sea correcta, no podrás cambiarla
                  después.
                </p>
              </div>
            )}
          </div>

          {/* Imágenes */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Icon icon="tabler:photo" className="w-5 h-5 mr-2" />
              Imágenes
            </h3>

            {/* Imagen de perfil */}
            <div className="mb-6">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                Imagen de perfil
              </Label>

              {!barber?.imagen_perfil && (
                <div
                  {...getRootPropsProfile()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
                    isDragActiveProfile
                      ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : isDragRejectProfile
                      ? "border-red-400 bg-red-50 dark:bg-red-900/20"
                      : "border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <input {...getInputPropsProfile()} disabled={isPending} />
                  <div className="space-y-2">
                    <Icon
                      icon="tabler:cloud-upload"
                      className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500"
                    />
                    {isDragActiveProfile ? (
                      <p className="text-blue-600 dark:text-blue-400 font-medium">
                        Suelta la imagen aquí
                      </p>
                    ) : isDragRejectProfile ? (
                      <p className="text-red-600 dark:text-red-400 font-medium">
                        Solo se permiten imágenes
                      </p>
                    ) : (
                      <>
                        <p className="text-gray-700 dark:text-gray-300 font-medium">
                          Arrastra tu imagen o haz clic para seleccionar
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          JPG, PNG hasta 5MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Preview de imágenes de perfil */}
              <div className="flex flex-wrap gap-4 mt-4">
                {barber?.imagen_perfil && (
                  <div className="relative group">
                    <img
                      src={barber.imagen_perfil}
                      className="w-24 h-24 object-cover rounded-lg shadow-md"
                      alt="Imagen actual"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg" />
                  </div>
                )}

                {typeof profilePicture !== "string" &&
                  profilePicture.map((image: any) => (
                    <div key={crypto.randomUUID()} className="relative group">
                      <img
                        className="size-24 object-cover rounded-lg shadow-md cursor-pointer"
                        src={URL.createObjectURL(image)}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors rounded-lg flex items-center justify-center z-40">
                        <Button
                          className="rounded-lg items-center justify-center hidden group-hover:flex"
                          variant="ghost"
                          onClick={() => setProfilePicture([])}
                          type="button"
                        >
                          <Icon icon="tabler:x" className="w-6 h-6" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>

              {errors.imagen_perfil?.message && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                  {errors.imagen_perfil.message}
                </p>
              )}
            </div>

            {/* Galería de imágenes */}
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                Galería de imágenes (máximo 3)
              </Label>

              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
                  isDragActive
                    ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : isDragReject
                    ? "border-red-400 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }`}
              >
                <input {...getInputProps()} disabled={isPending} />
                <div className="space-y-2">
                  <Icon
                    icon="tabler:photo-plus"
                    className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500"
                  />
                  {isDragActive ? (
                    <p className="text-blue-600 dark:text-blue-400 font-medium">
                      Suelta las imágenes aquí
                    </p>
                  ) : isDragReject ? (
                    <p className="text-red-600 dark:text-red-400 font-medium">
                      Solo se permiten imágenes
                    </p>
                  ) : (
                    <>
                      <p className="text-gray-700 dark:text-gray-300 font-medium">
                        Arrastra imágenes o haz clic para seleccionar
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        JPG, PNG hasta 5MB cada una
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Preview de galería */}
              <div className="flex flex-wrap gap-4 mt-4">
                {barber?.imagenes.map((image) => (
                  <div key={crypto.randomUUID()} className="relative group">
                    <img
                      src={image}
                      className="w-24 h-24 object-cover rounded-lg shadow-md"
                      alt="Imagen de galería"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg" />
                  </div>
                ))}

                {images.length > 0 &&
                  images.map((image: any, index: number) => (
                    <div key={image.name} className="relative group">
                      <img
                        src={URL.createObjectURL(image)}
                        className="w-24 h-24 object-cover rounded-lg shadow-md cursor-pointer"
                        alt="Nueva imagen"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors rounded-lg flex items-center justify-center">
                        <Button
                          className="rounded-lg items-center justify-center hidden group-hover:flex"
                          onClick={() => handleRemoveImage(index)}
                          variant="ghost"
                          type="button"
                        >
                          <Icon icon="tabler:x" className="w-6 h-6" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Horarios */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Icon icon="tabler:clock" className="w-5 h-5 mr-2" />
                Horarios de Atención
              </h3>
              <Button
                type="button"
                onClick={handleAddHour}
                disabled={isPending || isPendingUpdate || uploadingImage}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                <Icon icon="tabler:plus" className="w-4 h-4 mr-2" />
                Agregar Horario
              </Button>
            </div>

            {hours == undefined && (
              <div className="text-center py-8">
                <Icon
                  icon="tabler:clock-off"
                  className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-3"
                />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No hay horarios configurados
                </p>
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                  Debe agregar al menos un horario de atención
                </p>
              </div>
            )}

            <div className="space-y-6">
              {hours?.map((hour, index) => (
                <div
                  key={crypto.randomUUID()}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Horario {index + 1}
                    </h4>
                    {hours.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => handleRemoveHour(index)}
                        disabled={
                          isPending || isPendingUpdate || uploadingImage
                        }
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900/20"
                      >
                        <Icon icon="tabler:trash" className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Día de la semana
                      </Label>
                      <Select
                        onValueChange={(e) => {
                          const updatedHours = [...hours]
                          updatedHours[index] = {
                            ...updatedHours[index],
                            dia: e,
                          }
                          setValue(`horarios.${index}.dia`, e)
                          setHours(updatedHours)
                        }}
                        value={hour.dia}
                        disabled={
                          isPending || isPendingUpdate || uploadingImage
                        }
                      >
                        <SelectTrigger className="border-gray-300 dark:border-gray-600">
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
                      {errors.horarios?.[index]?.dia?.message && (
                        <p className="text-sm text-red-600 dark:text-red-400">
                          El día es requerido
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Hora de apertura
                      </Label>
                      <Input
                        placeholder="09:00"
                        type="text"
                        {...register(`horarios.${index}.hora_apertura`)}
                        disabled={
                          isPending || isPendingUpdate || uploadingImage
                        }
                        className="border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                      />
                      {errors.horarios?.[index]?.hora_apertura?.message && (
                        <p className="text-sm text-red-600 dark:text-red-400">
                          {errors.horarios[index].hora_apertura.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Hora de cierre
                      </Label>
                      <Input
                        placeholder="18:00"
                        type="text"
                        {...register(`horarios.${index}.hora_cierre`)}
                        disabled={
                          isPending || isPendingUpdate || uploadingImage
                        }
                        className="border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                      />
                      {errors.horarios?.[index]?.hora_cierre?.message && (
                        <p className="text-sm text-red-600 dark:text-red-400">
                          {errors.horarios[index].hora_cierre.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Inicio del descanso (opcional)
                      </Label>
                      <Input
                        placeholder="13:00"
                        type="text"
                        {...register(`horarios.${index}.pausa_inicio`)}
                        disabled={
                          isPending || isPendingUpdate || uploadingImage
                        }
                        className="border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                      />
                      {errors.horarios?.[index]?.pausa_inicio?.message && (
                        <p className="text-sm text-red-600 dark:text-red-400">
                          {errors.horarios[index].pausa_inicio.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Fin del descanso (opcional)
                      </Label>
                      <Input
                        placeholder="14:00"
                        type="text"
                        {...register(`horarios.${index}.pausa_fin`)}
                        disabled={
                          isPending || isPendingUpdate || uploadingImage
                        }
                        className="border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                      />
                      {errors.horarios?.[index]?.pausa_fin?.message && (
                        <p className="text-sm text-red-600 dark:text-red-400">
                          {errors.horarios[index].pausa_fin.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {uploadingImage && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                Subiendo imágenes, por favor espera...
              </p>
            </div>
          )}

          {isPending && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                Guardando cambios, por favor espera...
              </p>
            </div>
          )}

          {/* Botón de envío */}
          <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="submit"
              disabled={isPending || isPendingUpdate || loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium"
              size="lg"
            >
              {loading ? (
                <>
                  <Icon
                    icon="tabler:loader-2"
                    className="w-5 h-5 mr-2 animate-spin"
                  />
                  Procesando...
                </>
              ) : (
                <>
                  <Icon icon="tabler:check" className="w-5 h-5 mr-2" />
                  {barber ? "Actualizar Barbería" : "Crear Barbería"}
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
