import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"
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

const RegisterPage = () => {
  const { loading, register } = useRegister()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      nombre: "",
      apellido: "",
      fechaDeNacimiento: new Date().toISOString().split("T")[0],
      email: "",
      telefono: "",
      password: "",
      confirmPassword: "",
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
    try {
      const response = await register(values)
      console.log(response)
      return response
    } catch (error) {
      console.error("Registration failed:", error)
    }
  }
  /* 
  function loginGoogle() {
    window.open(`${import.meta.env.VITE_API_URL}user/auth/google`, "_self")
  } */
  console.log(getValues())
  return (
    <section className="flex items-center justify-center w-full min-h-screen py-8">
      <div className="w-full sm:w-[450px] rounded-lg shadow p-6 sm:p-8 flex flex-col gap-3 bg-gray-main">
        <form onSubmit={handleSubmit(registerFunction)} noValidate>
          <div className="flex flex-col gap-5 px-4 py-7 mx-auto ">
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

                  <small className="font-bold text-[#ff4444]">
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

                  <small className="font-bold text-[#ff4444]">
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

                  <small className="font-bold text-[#ff4444]">
                    {errors.email?.message}
                  </small>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex flex-row gap-2 items-end">
                    <Label>Telefono</Label>
                  </div>

                  <Input
                    type="telefono"
                    {...registerForm("telefono")}
                    placeholder="3544888888"
                  />

                  <small className="font-bold text-[#ff4444]">
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

                  <small className="font-bold text-[#ff4444]">
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
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
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

                  <small className="font-bold text-[#ff4444]">
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
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
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

                  <small className="font-bold text-[#ff4444]">
                    {errors.confirmPassword?.message}
                  </small>
                </div>

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

                  <small className="font-bold text-[#ff4444]">
                    {errors.tipoDeCuenta && "El tipo de cuenta es requerido"}
                  </small>
                </div>

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
        </form>
      </div>
    </section>
  )
}

export default RegisterPage
