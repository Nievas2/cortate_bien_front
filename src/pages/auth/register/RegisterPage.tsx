const RegisterPage = () => {
  return (
    <div>RegisterPage</div>
  )
}
export default RegisterPage


/* import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Link } from "react-router-dom"

import { Icon } from "@iconify/react/dist/iconify.js"

import { useFormik } from "formik"

import { useMemo, useState } from "react"

import { signupSchema } from "../../utils/schemas/Signup"
import { Register } from "../../services/AuthService"
import { useRegister } from "../../hooks/useRegister"

const RegisterPage = () => {
  const { loading, register } = useRegister()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordMatchMessage, setPasswordMatchMessage] = useState("")

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevState) => !prevState)
  }

  const { handleSubmit, errors, touched, getFieldProps } = useFormik({
    initialValues: {
      name: "",
      surname: "",
      email: "",
      password: "",
      confirmPassword: "",
      dob: "",
    },
    validationSchema: signupSchema,
    onSubmit: async (values) => {
      if (values.password !== values.confirmPassword) {
        setPasswordMatchMessage("Las contraseñas no coinciden")
        return
      }
      await registerFunction(values)
    },
  })

  async function registerFunction(values: Register) {
    try {
      await register(values)
    } catch (error) {
      console.error("Registration failed:", error)
    }
  }

  function loginGoogle() {
    window.open(`${import.meta.env.VITE_API_URL}user/auth/google`, "_self")
  }

  const passwordMatchClass = useMemo(
    () =>
      passwordMatchMessage === "Las contraseñas coinciden"
        ? "text-[#40944A]"
        : "text-[#ff4444]",
    [passwordMatchMessage]
  )

  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <form onSubmit={handleSubmit} noValidate>
        <div className="flex flex-col gap-5 px-4 py-7 mx-auto ">
          <div className="w-full sm:w-96 rounded-lg shadow p-6 sm:p-8 flex flex-col gap-3 bg-gray-main">
            <div className="flex flex-col gap-4 md:gap-6">
              <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Crear una cuenta
              </h1>

              <div className="flex flex-col gap-4 md:gap-6">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row gap-2 items-end">
                    <Label>Nombre</Label>
                  </div>

                  <Input
                    type="text"
                    placeholder="Nombre"
                    {...getFieldProps("name")}
                    disabled={loading}
                  />

                  {touched.name && errors.name && (
                    <small className="font-bold text-[#ff4444]">
                      {errors.name}
                    </small>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row gap-2 items-end">
                    <Label>Apellido</Label>
                  </div>

                  <Input
                    type="text"
                    placeholder="Apellido"
                    {...getFieldProps("surname")}
                    disabled={loading}
                  />

                  {touched.surname && errors.surname && (
                    <small className="font-bold text-[#ff4444]">
                      {errors.surname}
                    </small>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex flex-row gap-2 items-end">
                    <Label>Correo electrónico</Label>
                  </div>

                  <Input
                    type="email"
                    {...getFieldProps("email")}
                    placeholder="example@gmail.com"
                  />

                  {touched.email && errors.email && (
                    <small className="font-bold text-[#ff4444]">
                      {errors.email}
                    </small>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row gap-2 items-end">
                    <Label>Fecha de nacimiento</Label>
                  </div>

                  <Input
                    type="date"
                    {...getFieldProps("dob")}
                    placeholder="example@gmail.com"
                  />

                  {touched.dob && errors.dob && (
                    <small className="font-bold text-[#ff4444]">
                      {errors.dob}
                    </small>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Contraseña</Label>

                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="•••••••••••••••"
                      {...getFieldProps("password")}
                      disabled={loading}
                    />

                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={togglePasswordVisibility}
                    >
                      <Icon
                        className={`h-5 w-5 text-main transition-opacity duration-200 ${
                          showPassword ? "opacity-100" : "opacity-0"
                        }`}
                        icon="ph:eye-bold"
                      />
                      <Icon
                        className={`h-5 w-5 text-main transition-opacity duration-200 absolute ${
                          showPassword ? "opacity-0" : "opacity-100"
                        }`}
                        icon="ph:eye-closed-bold"
                      />
                    </button>
                  </div>

                  {touched.password && errors.password && (
                    <small className="font-bold text-[#ff4444]">
                      {errors.password}
                    </small>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Confirmar contraseña</Label>

                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="•••••••••••••••"
                      {...getFieldProps("confirmPassword")}
                      disabled={loading}
                    />

                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      <Icon
                        className={`h-5 w-5 text-main transition-opacity duration-200 ${
                          showConfirmPassword ? "opacity-100" : "opacity-0"
                        }`}
                        icon="ph:eye-bold"
                      />
                      <Icon
                        className={`h-5 w-5 text-main transition-opacity duration-200 absolute ${
                          showConfirmPassword ? "opacity-0" : "opacity-100"
                        }`}
                        icon="ph:eye-closed-bold"
                      />
                    </button>
                  </div>

                  {touched.confirmPassword && errors.confirmPassword && (
                    <small className="font-bold text-[#ff4444]">
                      {errors.confirmPassword}
                    </small>
                  )}

                  {passwordMatchMessage && (
                    <small className={`font-bold ${passwordMatchClass}`}>
                      {passwordMatchMessage}
                    </small>
                  )}
                </div>

                <div className="flex flex-col gap-5">
                  <Button
                    variant="authButton"
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

                <div className="flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-black after:mt-0.5 after:flex-1 after:border-t after:border-black">
                  <p className="mx-4 mb-0 text-center dark:text-white">o</p>
                </div>

                <button
                  className="px-5 py-2.5 border flex justify-center items-center gap-2 bg-white border-blue-main hover:bg-white/80 transition-colors duration-150 rounded-lg w-full "
                  type="button"
                  onClick={loginGoogle}
                >
                  <Icon className="h-6 w-6" icon="logos:google-icon" />
                  <span className="text-sm">Continuar con Google</span>
                </button>

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
        </div>
      </form>
    </div>
  )
}

export default RegisterPage */