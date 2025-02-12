import { useAuthContext } from "@/contexts/authContext"
import { getUserById, updateUser } from "@/services/UserService"
import { useQuery } from "@tanstack/react-query"
import Layout from "./Layout"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { getCountries } from "@/services/CountryService"
import CountrySelect from "../dashboard/components/CountrySelect"
import StateSelect from "../dashboard/components/StateSelect"
import CitySelect from "../dashboard/components/CitySelect"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Icon } from "@iconify/react/dist/iconify.js"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateUserSchema } from "@/utils/schemas/userSchema"
import { Button } from "@/components/ui/button"
import { useLocation } from "react-router-dom"

const ProfilePage = () => {
  document.title = "Cortate bien | Perfil"
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [countryId, setCountryId] = useState<undefined | number>()
  const [stateId, setStateId] = useState<undefined | number>()
  const location = useLocation()
  const required = location.search.split("=")[1]
  const { authUser } = useAuthContext()

  const { data, isSuccess: isSuccessCountries } = useQuery({
    queryKey: ["countries"],
    queryFn: getCountries,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24,
  })

  const { data: user } = useQuery({
    queryKey: ["get-user-by-id"],
    queryFn: async () => {
      if (authUser != null) return await getUserById(authUser.user.sub)
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24,
  })

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    values: {
      telefono: user?.data.telefono ? user?.data.telefono : "",
      ciudad_id: user?.data.ciudad_id ? user?.data.ciudad_id.toString() : "",
      fechaNacimiento: user?.data.fechaNacimiento
        ? user?.data.fechaNacimiento.split("T")[0]
        : new Date().toISOString().split("T")[0],
      tipoDeCuenta: user?.data.tipoDeCuenta ? user?.data.tipoDeCuenta : "",
      password: user?.data.password ? user?.data.password : "",
      confirmPassword: user?.data.password ? user?.data.password : "",
    },
    resolver: zodResolver(updateUserSchema),
  })

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevState) => !prevState)
  }

  const updateUserFunction = handleSubmit((values) => {
    try {
      const res = updateUser({
        id: user?.data.id,
        ciudad_id: values.ciudad_id,
        telefono: values.telefono,
        fechaNacimiento: values.fechaNacimiento,
        password: values.password,
      })
      return res
    } catch (error) {
      throw error
    }
  })

  return (
    <Layout>
      <main className="flex flex-col w-full min-h-screen h-full gap-8 p-4">
        <section className="flex flex-col gap-4 min-h-44">
          <h2 className="text-2xl font-semibold">Informacion personal</h2>
          <div className="flex flex-col gap-2">
            <p>Nombre: {user?.data.nombre}</p>
            <p>Apellido: {user?.data.apellido}</p>
            <p>Correo: {user?.data.email}</p>
            <p>Telefono: {user?.data.telefono}</p>
            <p>
              Fecha de nacimiento: {user?.data.fechaNacimiento.split("T")[0]}
            </p>
          </div>
        </section>

        <section className="flex flex-col items-center justify-center w-full gap-8">
          <h2 className="text-2xl text-center font-semibold">
            Actualizar informacion personal
          </h2>

          {required == "true" && (
            <p className="text-red-500">
              Por favor, completa todos los campos para usar su cuenta
            </p>
          )}

          <form
            className="flex flex-col gap-4 max-w-96 w-full"
            onSubmit={updateUserFunction}
          >
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-2 items-end">
                <Label>Telefono</Label>
              </div>

              <Input
                type="telefono"
                {...register("telefono")}
                placeholder="3544888888"
              />

              {errors.telefono?.message && (
                <small className="font-bold text-red-500">
                  {errors.telefono?.message.toString()}
                </small>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-2 items-end">
                <Label>Fecha de nacimiento</Label>
              </div>

              <Input
                type="date"
                {...register("fechaNacimiento")}
                onChange={(e) => setValue("fechaNacimiento", e.target.value)} // Directamente el string en formato "YYYY-MM-DD"
                placeholder="YYYY-MM-DD"
              />

              {errors.fechaNacimiento?.message && (
                <small className="font-bold text-red-500">
                  {errors.fechaNacimiento?.message.toString()}
                </small>
              )}
            </div>

            {user?.data.password == "" && (
              <>
                <div className="flex flex-col gap-2">
                  <Label>Contraseña</Label>

                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="•••••••••••••••"
                      {...register("password")}
                    />

                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={togglePasswordVisibility}
                    >
                      <Icon
                        className={`h-5 w-5 text-black transition-opacity duration-200 ${
                          showPassword ? "opacity-100" : "opacity-0"
                        }`}
                        icon="ph:eye-bold"
                      />
                      <Icon
                        className={`h-5 w-5 text-black transition-opacity duration-200 absolute ${
                          showPassword ? "opacity-0" : "opacity-100"
                        }`}
                        icon="ph:eye-closed-bold"
                      />
                    </button>
                  </div>

                  {errors.password?.message && (
                    <small className="font-bold text-red-500">
                      {errors.password?.message.toString()}
                    </small>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Confirmar contraseña</Label>

                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="•••••••••••••••"
                      {...register("confirmPassword")}
                    />

                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      <Icon
                        className={`h-5 w-5 text-black transition-opacity duration-200 ${
                          showConfirmPassword ? "opacity-100" : "opacity-0"
                        }`}
                        icon="ph:eye-bold"
                      />
                      <Icon
                        className={`h-5 w-5 text-black transition-opacity duration-200 absolute ${
                          showConfirmPassword ? "opacity-0" : "opacity-100"
                        }`}
                        icon="ph:eye-closed-bold"
                      />
                    </button>
                  </div>

                  {errors.confirmPassword?.message && (
                    <small className="font-bold text-red-500">
                      {errors.confirmPassword?.message.toString()}
                    </small>
                  )}
                </div>
              </>
            )}

            {user?.data.country_id === null && (
              <div className="flex flex-col gap-2">
                <Label>Pais</Label>
                {isSuccessCountries && Array.isArray(data?.data) ? (
                  <CountrySelect
                    countries={data?.data}
                    onChange={(id: any) => setCountryId(id)}
                  />
                ) : (
                  <span className="text-sm text-red-500">
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
              </div>
            )}

            {errors.ciudad_id && errors.ciudad_id.message && (
              <span className="text-sm text-red-500">
                {errors.ciudad_id?.message.toString()}
              </span>
            )}

            <div className="flex flex-col w-full">
              <Select
                onValueChange={(e) => setValue("tipoDeCuenta", e)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo de cuenta" />
                </SelectTrigger>
                <SelectContent className="bg-gray-main text-white w-full">
                  <SelectItem value="BARBERO">Barbero</SelectItem>
                  <SelectItem value="CLIENTE">Cliente</SelectItem>
                </SelectContent>
              </Select>

              <small className="font-bold text-red-500">
                {errors.tipoDeCuenta && "El tipo de cuenta es requerido"}
              </small>
            </div>

            <Button
              variant="auth"
              className="w-full rounded-lg"
              type="submit"
              id="register"
              aria-label="Register"
              role="button"
            >
              Registrarse
            </Button>
          </form>
        </section>
      </main>
    </Layout>
  )
}
export default ProfilePage
