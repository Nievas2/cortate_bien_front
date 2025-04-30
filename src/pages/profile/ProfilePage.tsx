import { useAuthContext } from "@/contexts/authContext"
import { completeRegistration, getUserById } from "@/services/UserService"
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
import { zodResolver } from "@hookform/resolvers/zod"
import { updateUserSchema } from "@/utils/schemas/userSchema"
import { Button } from "@/components/ui/button"
import { useLocation } from "react-router-dom"
import CountryNumberSelect from "../dashboard/components/CountryNumberSelect"
import { decodeJwt } from "@/utils/decodeJwt"
import { setCookieAsync } from "@/hooks/useLogin"

const ProfilePage = () => {
  document.title = "Cortate bien | Perfil"
  const [selectCountryNumber, setSelectCountryNumber] = useState<
    undefined | string
  >()
  const [countryId, setCountryId] = useState<undefined | number>()
  const [stateId, setStateId] = useState<undefined | number>()
  const [error, setError] = useState<undefined | string>()
  const location = useLocation()
  const required = location.search.split("=")[1]
  const { authUser, setAuthUser } = useAuthContext()

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
    refetchOnMount: false,
    staleTime: 1000 * 60 * 60 * 24,
    retry: 1,
  })

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    values: {
      telefono: "",
      ciudad_id: "",
      fechaNacimiento: new Date().toISOString().split("T")[0],
      tipoDeCuenta: "",
    },
    resolver: zodResolver(updateUserSchema),
  })

  const updateUserFunction = handleSubmit(async (values) => {
    try {
      if (!selectCountryNumber) {
        return setError("Debes seleccionar la caracteristica del pais")
      }
      const res = await completeRegistration({
        ciudad_id: Number(values.ciudad_id),
        telefono: `+${selectCountryNumber}${values.telefono}`,
        fechaNacimiento: new Date(values.fechaNacimiento)
          .toISOString()
          .split("T")[0],
        tipoDeCuenta: values.tipoDeCuenta,
      })
      const user = decodeJwt(res.data.accesToken)
      const userAuth = {
        user: user,
        token: res.data.accesToken,
      }
      setAuthUser(userAuth)

      await setCookieAsync("token", res.data.accesToken, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
      })
      window.location.href = "/barbers"
      return res
    } catch (error) {
      setError("Error al actualizar la informacion")
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

        {required == "true" && (
          <section className="flex flex-col items-center justify-center w-full gap-8">
            <h2 className="text-2xl text-center font-semibold">
              Actualizar información personal
            </h2>
            <p className="text-red-500">
              Por favor, completa todos los campos para usar su cuenta
            </p>
            <form
              className="flex flex-col gap-4 max-w-96 w-full"
              onSubmit={updateUserFunction}
            >
              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-2 items-end">
                  <Label>Telefono</Label>
                </div>
                <div className="flex flex-row gap-2">
                  {isSuccessCountries && Array.isArray(data?.data) && (
                    <CountryNumberSelect
                      countries={data?.data}
                      onChange={(e: any) => setSelectCountryNumber(e)}
                    />
                  )}
                  <Input
                    type="telefono"
                    {...register("telefono")}
                    placeholder="3544888888"
                  />
                </div>

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
                <Select onValueChange={(e) => setValue("tipoDeCuenta", e)}>
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
              {error && (
                <small className="font-bold text-red-500">{error}</small>
              )}

              <Button
                variant="auth"
                className="w-full rounded-lg"
                type="submit"
                id="register"
                aria-label="Register"
                role="button"
              >
                Actualizar informacion
              </Button>
            </form>
          </section>
        )}
      </main>
    </Layout>
  )
}
export default ProfilePage
