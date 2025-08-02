import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"
import { Icon } from "@iconify/react"
import { useState } from "react"
import useLogin /*  { LoginParams } */ from "@/hooks/useLogin" /* 
import { recoveryPasswordSchemaEmail } from "@/utils/schemas/recoveryPassword"
import { recoveryPasswordFunction } from "@/services/AuthService" */
import { loginSchema } from "@/utils/schemas/loginSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import useReCaptcha from "@/hooks/useReCaptcha"

const LoginPage = () => {
  document.title = "Cortate bien | Iniciar sesión"
  const { loading, login } = useLogin()
  const [showPassword, setShowPassword] = useState(false)
  /*   const [success, setSuccess] = useState("") */
  /*   const [recoveryPassword, setRecoveryPassword] = useState(false) */
  const [loginError, setLoginError] = useState("")
  const { executeRecaptcha, error } = useReCaptcha({
    siteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY,
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  })

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState)
  }

  function loginGoogle() {
    window.open(`${import.meta.env.VITE_API_URL}auth/google`, "_self")
  }
/* 
  function loginFacebook() {
    window.open(`${import.meta.env.VITE_API_URL}auth/facebook`, "_self")
  } */

  const loginFunction = handleSubmit(async (values) => {
    try {
      // await executeRecaptcha("login")
      await login(values)
    } catch (error: any) {
      console.error(error)
      setLoginError(error.response.data.message)
    }
  })

  return (
    <section className="flex items-center justify-center w-full min-h-screen py-4">
      <div className="w-full sm:w-[450px] rounded-lg shadow-sm p-6 sm:p-8 flex flex-col gap-3 bg-gray-main">
        <div>
          <form onSubmit={loginFunction} noValidate>
            <div className="flex flex-col gap-5 mx-auto">
              <div className="flex flex-col gap-4 md:gap-6">
                <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-white md:text-2xl">
                  Ingrese sus <span className="text-blue-main">datos</span>
                </h1>

                <div className="flex flex-col gap-4 md:gap-6">
                  <div className="flex flex-col gap-2">
                    <Label>Email</Label>

                    <Input
                      className="bg-white"
                      type="email"
                      placeholder="example@gmail.com"
                      {...register("email")}
                      disabled={loading}
                    />
                    <span className="text-sm text-red-600">
                      {errors.email?.message}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label>Contraseña</Label>

                    <div className="relative">
                      <Input
                        className="bg-white"
                        type={showPassword ? "text" : "password"}
                        placeholder="•••••••••••••"
                        {...register("password")}
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
                    <span className="text-sm text-red-600">
                      {errors.password?.message}
                    </span>
                  </div>
                  {loginError && (
                    <small className="font-bold text-center text-[#ff4444]">
                      {loginError}
                    </small>
                  )}

                  {error && (
                    <small className="font-bold text-center text-[#ff4444]">
                      Creemos que eres un robot 🤖, prueba de nuevo más tarde.
                    </small>
                  )}

                  <div className="flex flex-col gap-3 relative group">
                    <Button
                      variant="auth"
                      className="w-full rounded-lg"
                      type="submit"
                      id="login"
                      aria-label="login"
                      role="button"
                      disabled={loading}
                    >
                      {loading ? "Cargando..." : "Iniciar sesión"}
                      <div className="absolute -inset-1 bg-linear-to-r from-blue-secondary to-blue-secondary rounded-lg blur-md opacity-0 group-hover:opacity-60 transition duration-200 group-hover:duration-200" />
                    </Button>
                  </div>

                  <div className="flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-white after:mt-0.5 after:flex-1 after:border-t after:border-white">
                    <p className="mx-4 mb-0 text-center text-white">o</p>
                  </div>

                  <section className="flex flex-col gap-2 w-full">
                    <Button
                      variant="simple"
                      className="flex gap-3"
                      type="button"
                      onClick={loginGoogle}
                    >
                      <Icon className="size-6" icon="logos:google-icon" />
                      <span className="text-sm">Continuar con Google</span>
                    </Button>

                   {/*  <Button
                      variant="simple"
                      className="flex gap-3"
                      type="button"
                      onClick={loginFacebook}
                    >
                      <Icon className="size-6" icon="logos:facebook" />
                      <span className="text-sm">Continuar con Facebook</span>
                    </Button> */}

                    <p className="text-sm font-light text-center">
                      ¿Olvidaste tu contraseña?{" "}
                      <Link
                        to="/auth/password-recovery"
                        className="font-semibold text-main hover:underline"
                      >
                        Recuperar
                      </Link>
                    </p>

                    <p className="text-sm font-light text-center">
                      ¿Necesitar activar tu cuenta?{" "}
                      <Link
                        to="/auth"
                        className="font-semibold text-main hover:underline"
                      >
                        Activar
                      </Link>
                    </p>

                    <p className="text-sm font-light text-center">
                      ¿No tienes una cuenta?{" "}
                      <Link
                        to="/auth/registrarse"
                        className="font-semibold text-main hover:underline"
                      >
                        Registrarse
                      </Link>
                    </p>
                  </section>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default LoginPage
