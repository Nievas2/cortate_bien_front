import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom"
import { Icon } from "@iconify/react/dist/iconify.js"
import { useState } from "react"
import { useRegister } from "@/hooks/useRegister"
import { signupSchema } from "@/utils/schemas/signUp"
import { Register } from "@/services/AuthService"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"
import StateSelect from "@/pages/dashboard/components/StateSelect"
import CountrySelect from "@/pages/dashboard/components/CountrySelect"
import { getCountries } from "@/services/CountryService"
import CitySelect from "@/pages/dashboard/components/CitySelect"
import useReCaptcha from "@/hooks/useReCaptcha"
import CountryNumberSelect from "@/pages/dashboard/components/CountryNumberSelect"

const RegisterPage = () => {
  document.title = "Cortate bien | Registro"
  const [selectCountryNumber, setSelectCountryNumber] = useState<
    undefined | string
  >()
  const { loading, register } = useRegister()
  const navigation = useNavigate()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [checkbox, setCheckbox] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [countryId, setCountryId] = useState<undefined | number>()
  const [stateId, setStateId] = useState<undefined | number>()
  const { executeRecaptcha } = useReCaptcha({
    siteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY,
    onError() {
      setError("Creemos que eres un robot 🤖, prueba de nuevo más tarde.")
    },
  })

  const { data, isSuccess: isSuccessCountries } = useQuery({
    queryKey: ["countries"],
    queryFn: getCountries,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24,
  })

  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      nombre: "",
      apellido: "",
      fechaDeNacimiento: new Date().toISOString().split("T")[0],
      email: "",
      telefono: "",
      password: "",
      confirmPassword: "",
      ciudad_id: "",
      tipoDeCuenta: "",
    },
    resolver: zodResolver(signupSchema),
  })

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevState) => !prevState)
  }

  const registerFunction = async (values: Register) => {
    if (checkbox === false) {
      return setError("Debes aceptar los terminos y condiciones")
    }
    try {
      await executeRecaptcha("register")
      if (!selectCountryNumber) {
        return setError("Debes seleccionar la caracteristica del pais")
      }
      values.telefono = `+${selectCountryNumber}${values.telefono}`
      const response = await register(values)
      setSuccess(true)
      navigation(`/auth?email=${response.data.email}`)
      return response
    } catch (error: any) {
      if (error.response.data.message)
        return setError(error.response.data.message)

      console.error("Registration failed:", error)
    }
  }

  function loginGoogle() {
    window.open(`${import.meta.env.VITE_API_URL}auth/google`, "_self")
  }
/* 
  function loginFacebook() {
    window.open(`${import.meta.env.VITE_API_URL}auth/facebook`, "_self")
  } */
  return (
    <section className="flex items-center justify-center w-full min-h-screen py-4">
      <div className="w-full sm:w-[450px] rounded-lg shadow-sm p-6 sm:p-8 flex flex-col gap-3 bg-gray-main">
        <form onSubmit={handleSubmit(registerFunction)} noValidate>
          {success ? (
            <div className="flex flex-col gap-4 text-center items-center">
              <span className="text-center font-bold">
                Registrado con exito
              </span>
              <p>Se le ha enviado un correo de confirmacion. </p>
            </div>
          ) : (
            <div className="flex flex-col gap-5 px-4 py-2 mx-auto ">
              <div className="flex flex-col gap-4 md:gap-6">
                <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-white md:text-2xl">
                  Ingrese sus <span className="text-blue-main">datos</span>
                </h1>

                <div className="flex flex-col gap-4 md:gap-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-2 items-end">
                      <Label>Nombre</Label>
                    </div>

                    <Input
                      type="text"
                      placeholder="Nombre"
                      {...registerForm("nombre")}
                      disabled={loading}
                    />

                    <small className="font-bold text-red-500">
                      {errors.nombre?.message}
                    </small>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-2 items-end">
                      <Label>Apellido</Label>
                    </div>

                    <Input
                      type="text"
                      placeholder="Apellido"
                      {...registerForm("apellido")}
                      disabled={loading}
                    />

                    <small className="font-bold text-red-500">
                      {errors.apellido?.message}
                    </small>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-2 items-end">
                      <Label>Correo electrónico</Label>
                    </div>

                    <Input
                      type="email"
                      {...registerForm("email")}
                      placeholder="example@gmail.com"
                    />

                    <small className="font-bold text-red-500">
                      {errors.email?.message}
                    </small>
                  </div>

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
                        {...registerForm("telefono")}
                        placeholder="Telefono"
                      />
                    </div>

                    <small className="font-bold text-red-500">
                      {errors.telefono?.message}
                    </small>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-2 items-end">
                      <Label>Fecha de nacimiento</Label>
                    </div>

                    <Input
                      type="date"
                      {...registerForm("fechaDeNacimiento")}
                      onChange={(e) =>
                        setValue("fechaDeNacimiento", e.target.value)
                      } // Directamente el string en formato "YYYY-MM-DD"
                      placeholder="YYYY-MM-DD"
                    />

                    <small className="font-bold text-red-500">
                      {errors.fechaDeNacimiento?.message}
                    </small>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label>Contraseña</Label>

                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="•••••••••••••••"
                        {...registerForm("password")}
                        disabled={loading}
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

                    <small className="font-bold text-red-500">
                      {errors.password?.message}
                    </small>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label>Confirmar contraseña</Label>

                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="•••••••••••••••"
                        {...registerForm("confirmPassword")}
                        disabled={loading}
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

                    <small className="font-bold text-red-500">
                      {errors.confirmPassword?.message}
                    </small>
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
                      {errors.ciudad_id?.message}
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

                  <div className="flex gap-3 items-center justify-center">
                    <Input
                      type="checkbox"
                      className="size-5"
                      onChange={(e) => setCheckbox(e.target.checked)}
                      required
                    />
                    <span className="text-sm">
                      Acepto las{" "}
                      <Link
                        to="/terms-and-conditions"
                        className="font-semibold text-main hover:underline"
                      >
                        Condiciones del servicio
                      </Link>{" "}
                      y la{" "}
                      <Link
                        to="/privacy-policy"
                        className="font-semibold text-main hover:underline"
                      >
                        Política de privacidad
                      </Link>
                    </span>
                  </div>

                  {error && (
                    <span className="text-sm text-red-500">{error}</span>
                  )}

                  <div className="flex flex-col gap-5">
                    <Button
                      variant="auth"
                      className="w-full rounded-lg"
                      type="submit"
                      id="register"
                      aria-label="Register"
                      role="button"
                      disabled={loading}
                    >
                      Registrarse
                    </Button>
                  </div>

                  <div className="flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-white after:mt-0.5 after:flex-1 after:border-t after:border-white">
                    <p className="mx-4 mb-0 text-center text-white">o</p>
                  </div>

                  <Button
                    variant="simple"
                    className="flex gap-3"
                    type="button"
                    onClick={loginGoogle}
                  >
                    <Icon className="size-6" icon="logos:google-icon" />
                    <span className="text-sm">Registrarse con Google</span>
                  </Button>

                  {/* <Button
                    variant="simple"
                    className="flex gap-3"
                    type="button"
                    onClick={loginFacebook}
                  >
                    <Icon className="size-6" icon="logos:facebook" />
                    <span className="text-sm">Registrarse con Facebook</span>
                  </Button>
 */}
                  {/* 

                <div className="flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-white after:mt-0.5 after:flex-1 after:border-t after:border-white">
                  <p className="mx-4 mb-0 text-center dark:text-white">o</p>
                </div>

                <button
                  className="px-5 py-2.5 border flex justify-center items-center gap-2 bg-white border-blue-main hover:bg-white/80 transition-colors duration-150 rounded-lg w-full "
                  type="button"
                  onClick={loginGoogle}
                >
                  <Icon className="h-6 w-6" icon="logos:google-icon" />
                  <span className="text-sm">Continuar con Google</span>
                </button> */}

                  <p className="text-sm font-light text-center">
                    ¿Ya tienes una cuenta?{" "}
                    <Link
                      to="/auth/iniciar-sesion"
                      className="font-semibold text-main hover:underline"
                    >
                      Iniciar sesión
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </section>
  )
}

export default RegisterPage
