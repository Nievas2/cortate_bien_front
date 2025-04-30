import { zodResolver } from "@hookform/resolvers/zod"
import Layout from "../layout"
import { basicBarberFormSchema } from "@/utils/schemas/barber/basicBarberForm"
import { useForm } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useDropzone } from "react-dropzone"
import { useState } from "react"
import { Barber } from "@/interfaces/Barber"
import { useLocation } from "react-router-dom"
import {
  getBarberById,
  updateBarberBasic,
  updateBarberProfile,
} from "@/services/BarberService"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { AxiosError } from "axios"
import { postImage } from "@/services/ImagesService"
import { profileBarberFormSchema } from "@/utils/schemas/barber/profileBarberForm"
import MapSelector from "@/hooks/dashboard/MapSelector"
import { Hour } from "@/interfaces/Hour"
import CountrySelect from "../components/CountrySelect"
import StateSelect from "../components/StateSelect"
import CitySelect from "../components/CitySelect"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Icon } from "@iconify/react/dist/iconify.js"
import { getCountries } from "@/services/CountryService"
import {
  ProfileFormSkeleton,
  BasicFormSkeleton,
} from "./components/SkeletonForms"

const UpdateBarberPage = () => {
  const { search } = useLocation()
  const id = search.split("=")[1]

  const { data, isLoading } = useQuery({
    queryKey: ["barber-by-id", id],
    queryFn: () => getBarberById(id),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 60 * 24,
    enabled: !!id,
  })
  return (
    <Layout>
      <main className="flex flex-col gap-8 items-center justify-center w-full h-full">
        <h1 className="text-3xl font-semibold">Actualizar Barberia</h1>
        <section className="flex flex-col gap-4 items-center justify-center w-full bg-gray-main rounded-lg p-4">
          {isLoading ? (
            <ProfileFormSkeleton />
          ) : (
            <ProfileForm barber={data?.data} ciudad={data?.data.ciudad} />
          )}
        </section>

        <section className="flex flex-col gap-4 items-center justify-center w-full bg-gray-main rounded-lg p-4">
          <h1 className="text-3xl font-semibold">Actualizar Servicios</h1>
          {isLoading ? (
            <BasicFormSkeleton />
          ) : (
            <BasicForm barber={data?.data} />
          )}
        </section>
      </main>
    </Layout>
  )
}
export default UpdateBarberPage

const ProfileForm = ({
  barber,
  ciudad,
}: {
  barber: Barber
  ciudad: string
}) => {
  const [position, setPosition] = useState({
    lat: barber?.latitud ? barber.latitud.toString() : 0,
    lng: barber?.longitud ? barber.longitud.toString() : 0,
  })
  const [error, setError] = useState("")
  const [countryId, setCountryId] = useState<undefined | number>()
  const [stateId, setStateId] = useState<undefined | number>()
  const [changeCity, setChangeCity] = useState(false)
  const [hours, setHours] = useState<Hour[] | undefined>(
    barber?.horarios?.map((hour: Hour) => ({
      dia: hour.dia,
      hora_apertura: hour.hora_apertura,
      hora_cierre: hour.hora_cierre,
      pausa_inicio: hour.pausa_inicio == null ? "" : hour.pausa_inicio,
      pausa_fin: hour.pausa_fin == null ? "" : hour.pausa_fin,
    })) || []
  )

  const { data, isSuccess: isSuccessCountries } = useQuery({
    queryKey: ["countries"],
    queryFn: getCountries,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 60 * 24,
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      latitud: barber?.latitud?.toString() || "",
      longitud: barber?.longitud?.toString() || "",
      cantidadDeMinutosPorTurno:
        barber?.cantidadDeMinutosPorTurno?.toString() || "",
      direccion: barber?.direccion || "",
      ciudad_id: barber?.ciudad_id?.toString() || "",
      horarios: hours,
    },
    resolver: zodResolver(profileBarberFormSchema),
  })

  const {
    mutate: update,
    isSuccess: isSuccessUpdate,
    isPending: isPendingUpdate,
    error: errorUpdate,
  } = useMutation({
    mutationKey: ["update-barber-basic"],
    mutationFn: (values: any) => {
      if (barber != undefined) {
        return updateBarberBasic(barber, barber.id!, values)
      }
      throw new Error("Barberia no encontrada")
    } /* 
    onSuccess: () => {
      setLoading(false)
    }, */,
  })

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

  const handleSubmitForm = async (data: any) => {
    return update(data)
  }

  function getLocation() {
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
  }
  return (
    <form
      onSubmit={handleSubmit(handleSubmitForm)}
      className="flex flex-col gap-4"
    >
      <h4>Información de la Barberia</h4>

      <p>Los cambios en esta sección se aplicaran inmediatamente</p>

      <div className="flex flex-col gap-2">
        <Label>Direccion</Label>
        <Input
          type="text"
          placeholder="Ingrese su direccion"
          {...register("direccion")}
          disabled={isPendingUpdate}
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
          disabled={isPendingUpdate}
        />
        <span className="text-sm text-red-600">
          {errors.cantidadDeMinutosPorTurno?.message}
        </span>
      </div>

      <div className="flex gap-2">
        <div className="flex flex-col gap-2 w-full">
          <Label>Latitud</Label>
          <Input
            type="number"
            placeholder="latitud"
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
                // Manejar campo vacío
                setValue("latitud", "")
                setPosition((prev) => ({ ...prev, lat: 0 })) // O usa un valor por defecto válido
              }
            }}
            disabled={isPendingUpdate}
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
                // Manejar campo vacío
                setValue("longitud", "")
                setPosition((prev) => ({ ...prev, lng: 0 })) // O usa un valor por defecto válido
              }
            }}
            disabled={isPendingUpdate}
          />
          <span className="text-sm text-red-600">
            {errors.longitud?.message}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Button
          variant="secondary"
          type="button"
          onClick={getLocation}
          disabled={isPendingUpdate}
        >
          Actualizar mi ubicación
        </Button>
        {error && (
          <div className="text-red-500 text-sm">
            Si no desea que la app use su ubicación o en los campos siguientes
            no se actualizaron los valores, debera ingresar la longitud y
            latitud manualmente.
          </div>
        )}
      </div>

      {position.lat != 0 && (
        <MapSelector
          position={{
            lat: Number(position.lat),
            lng: Number(position.lng),
          }}
        />
      )}

      {!changeCity && (
        <div className="flex flex-col gap-2">
          <Label>Ciudad actual</Label>
          <span className="text-sm">{ciudad}</span>
          <Button
            variant="secondary"
            type="button"
            onClick={() => setChangeCity(true)}
          >
            Actualizar ciudad
          </Button>
        </div>
      )}

      {changeCity && (
        <div className="flex flex-col gap-2">
          <Label>Pais</Label>
          {isSuccessCountries && Array.isArray(data?.data) ? (
            <CountrySelect
              countries={data?.data}
              onChange={(country: any) => setCountryId(country)}
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
            onChange={(city: number) => setValue("ciudad_id", city.toString())}
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
                    setValue(`horarios.${index}.dia`, e)
                    setHours(updatedHours) // Actualizar el estado con el nuevo array
                  }}
                  value={hour.dia}
                  disabled={isPendingUpdate}
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
                  {errors.horarios?.[index]?.dia?.message &&
                    "El dia es requerido"}
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
                    disabled={isPendingUpdate}
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
                    disabled={isPendingUpdate}
                    {...register(`horarios.${index}.hora_cierre`)}
                  />
                  <small className="font-bold text-red-500">
                    {errors.horarios?.[index]?.hora_cierre?.message}
                  </small>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex flex-col gap-2 w-full">
                  <Label>Inicio del descanso {"(opcional)"}</Label>
                  <Input
                    placeholder="Una hora entre 00:00 y 23:59"
                    type="text"
                    disabled={isPendingUpdate}
                    {...register(`horarios.${index}.pausa_inicio`)}
                  />
                  <small className="font-bold text-red-500">
                    {errors.horarios?.[index]?.pausa_inicio?.message}
                  </small>
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <Label>Inicio del descanso {"(opcional)"}</Label>
                  <Input
                    placeholder="Una hora entre 00:00 y 23:59"
                    type="text"
                    disabled={isPendingUpdate}
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

      <small className="text-red-500 font-bold">
        {hours == undefined && "Debe ingresar almenos un horario"}
      </small>

      <div className="flex sm:flex-row sm:justify-between flex-col justify-center gap-2">
        <Button
          variant="secondary"
          type="button"
          onClick={handleAddHour}
          disabled={isPendingUpdate}
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
            disabled={isPendingUpdate}
          >
            <Icon icon="mdi:trash-outline" width="18" height="18" />
            Quitar el ultimo horaio
          </Button>
        )}
      </div>

      {errorUpdate instanceof AxiosError && errorUpdate.response && (
        <span className="text-red-500 text-sm">
          {errorUpdate.response.data.message}
        </span>
      )}

      {isSuccessUpdate && (
        <span className="text-green-500 text-sm">
          Barberia actualizada con exito
        </span>
      )}

      <Button variant="secondary" type="submit" disabled={isPendingUpdate}>
        Actualizar datos de la barberia
      </Button>
    </form>
  )
}

const BasicForm = ({ barber }: { barber: Barber }) => {
  const [images, setImages] = useState(barber.imagenes)
  const [profilePicture, setProfilePicture] = useState([barber.imagen_perfil])
  const onDrop = (acceptedFiles: any) => {
    // Aquí puedes manejar los archivos aceptados
    const newImages = [...images, ...acceptedFiles]
    // Limitar a 3 imágenes
    if (newImages.length > 3) {
      newImages.splice(0, newImages.length - 3)
    }
    setImages(newImages)
  }

  const onDropProfile = (acceptedFiles: any) => {
    // Aquí puedes manejar los archivos aceptados
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
      "image/*": [], // Aceptar solo imágenes
    },
  })

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      maxFiles: 3,
      maxSize: 5 * 1024 * 1024,
      accept: {
        "image/*": [], // Aceptar solo imágenes
      },
    })
  const { register, handleSubmit } = useForm({
    defaultValues: {
      nombre: barber?.nombre,
      descripcion: barber?.descripcion,
    },
    resolver: zodResolver(basicBarberFormSchema),
  })

  const {
    mutate: update,
    isSuccess: isSuccessUpdate,
    isPending: isPendingUpdate,
    error: errorUpdate,
  } = useMutation({
    mutationKey: ["update-barber-profile"],
    mutationFn: (values: any) => {
      if (barber != undefined) {
        return updateBarberProfile(barber, barber.id!, values)
      }
      throw new Error("Barberia no encontrada")
    } /* 
    onSuccess: () => {
      setLoading(false)
    }, */,
  })

  const handleSubmitImages = (): Promise<{
    imagenes: string[]
    imagen_perfil: string
  }> => {
    return new Promise(async (resolve, reject) => {
      try {
        let imagesUploadUrl: string[] = []
        let profilePictureUrl = ""

        // Manejo de la imagen de perfil
        if (
          Array.isArray(profilePicture) &&
          profilePicture.length > 0 &&
          typeof profilePicture[0] !== "string"
        ) {
          const imagesUpload = [...profilePicture]
          for (const imageUp of imagesUpload) {
            if (imageUp && typeof imageUp === "object" && "path" in imageUp) {
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
        } else if (
          Array.isArray(profilePicture) &&
          typeof profilePicture[0] === "string"
        ) {
          profilePictureUrl = profilePicture[0]
        }

        // Manejo de las imágenes adicionales
        const imagesUpload = [...images]
        for (const imageUp of imagesUpload) {
          if (imageUp && typeof imageUp === "object" && "path" in imageUp) {
            const formData = new FormData()
            formData.append("image", imageUp)
            try {
              const response = await postImage(formData)
              imagesUploadUrl.push(response.data.directLink)
            } catch (error) {
              reject({ imagenes: [], imagen_perfil: "" })
              return
            }
          } else if (typeof imageUp === "string") {
            imagesUploadUrl.push(imageUp)
          }
        }

        resolve({ imagenes: imagesUploadUrl, imagen_perfil: profilePictureUrl })
      } catch (error) {
        reject({ imagenes: [], imagen_perfil: "" })
      }
    })
  }

  function handleRemoveImage(index: any) {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  const handleSubmitForm = async (data: any) => {
    const { imagenes, imagen_perfil } = await handleSubmitImages()

    const formData = {
      ...data,
      imagenes: imagenes,
      imagen_perfil: imagen_perfil,
    }
    return update(formData)
  }

  return (
    <form
      onSubmit={handleSubmit(handleSubmitForm)}
      className="flex flex-col gap-4"
    >
      <h4>Información de la Barberia</h4>
      <p>
        Los cambios en esta sección pasaran por una revisión, antes de
        publicarse.
      </p>
      <div className="flex flex-col gap-2 w-full">
        <Label className="text-sm font-semibold">Nombre</Label>
        <Input
          type="text"
          {...register("nombre")}
          placeholder="Nombre del servicio"
        />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <Label className="text-sm font-semibold">Descripción</Label>
        <Textarea
          {...register("descripcion")}
          placeholder="Descripción del servicio"
        />
        <div className="flex flex-col gap-2">
          <Label>Imagen de perfil</Label>
          {profilePicture.length == 0 && (
            <div
              {...getRootPropsProfile()}
              className="hover:bg-black-main/80 hover:text-white bg-black-main text-white transition-colors duration-300 px-4 py-2 rounded-md h-24 cursor-pointer"
            >
              <input {...getInputPropsProfile()} /* disabled={isPending} */ />
              {isDragActive ? (
                <p>Suelta las imágenes aquí ...</p>
              ) : isDragReject ? (
                <p>¡Solo se permiten imágenes!</p>
              ) : (
                <p>
                  Arrastra y suelta tu imagen de perfil aquí, o haz clic para
                  seleccionarla.
                </p>
              )}
            </div>
          )}

          <div className="flex flex-wrap justify-around items-center">
            {typeof profilePicture != "string" &&
              profilePicture.map((image: any, index) => (
                <img
                  src={
                    typeof image === "string"
                      ? image
                      : URL.createObjectURL(image)
                  }
                  className="cursor-pointer"
                  alt="uploaded"
                  width={100}
                  height={100}
                  key={crypto.randomUUID()}
                  onClick={() => {
                    const newImages = [...profilePicture]
                    newImages.splice(index, 1)
                    setProfilePicture(newImages)
                  }}
                />
              ))}
          </div>
        </div>

        <Label>Agregar imagenes</Label>

        <div className="flex flex-col gap-6">
          {images.length < 3 && (
            <div
              {...getRootProps()}
              className="hover:bg-black-main/80 hover:text-white bg-black-main text-white transition-colors duration-300 px-4 py-2 rounded-md h-32 cursor-pointer"
            >
              <input {...getInputProps()} /* disabled={isPending} */ />
              {isDragActiveProfile ? (
                <p>Suelta las imágenes aquí ...</p>
              ) : isDragRejectProfile ? (
                <p>¡Solo se permiten imágenes!</p>
              ) : (
                <>
                  <p>
                    Arrastra y suelta algunas imágenes aquí, o haz clic para
                    seleccionarlas.
                  </p>
                  <p className="text-sm font-semibold">
                    (Máximo 3 imágenes, tamaño máximo 5MB cada una)
                  </p>
                </>
              )}
            </div>
          )}

          <div className="flex flex-wrap justify-around items-center">
            {images.length > 0 &&
              images.map((image: any, index: number) => (
                <img
                  src={
                    typeof image === "string"
                      ? image
                      : URL.createObjectURL(image)
                  }
                  className="cursor-pointer"
                  alt="uploaded"
                  width={100}
                  height={100}
                  key={image.name}
                  onClick={() => {
                    handleRemoveImage(index)
                  }}
                />
              ))}
          </div>
        </div>
      </div>

      {errorUpdate instanceof AxiosError && errorUpdate.response && (
        <span className="text-red-500 text-sm">
          {errorUpdate.response.data.message}
        </span>
      )}
      {isSuccessUpdate && (
        <span className="text-green-500 text-sm">
          Barberia actualizada con exito
        </span>
      )}

      <Button variant="secondary" type="submit" disabled={isPendingUpdate}>
        Actualizar datos del perfil
      </Button>
    </form>
  )
}
