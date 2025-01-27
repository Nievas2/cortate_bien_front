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

const LoginPage = () => {
  const { loading, login } = useLogin()
  const [showPassword, setShowPassword] = useState(false)
  /*   const [success, setSuccess] = useState("") */
  /*   const [recoveryPassword, setRecoveryPassword] = useState(false) */
  const [loginError, setLoginError] = useState("")
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

  /*   function loginGoogle() {
    window.open(`${import.meta.env.VITE_API_URL}user/auth/google`, "_self")
  } */

  const loginFunction = handleSubmit(async (values) => {    
    try {
      await login(values)
    } catch (error: any) {
      setLoginError(error.message)
    }
  })

  return (
    <section className="flex items-center justify-center w-full min-h-screen">
      <div className="w-full sm:w-96 rounded-lg shadow-sm p-6 sm:p-8 flex flex-col gap-3 bg-gray-main">
        {/*         {success ? (
          <h1 className="text-white">
            Se le envio un correo de recuperacion a su correo, por favor revise
            su bandeja de entrada o spam
          </h1>
        ) : ( */}
        <div>
          {/*             {!recoveryPassword ? ( */}
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
                      placeholder="email"
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

                  <div className="flex flex-col gap-5 relative group">
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

                    {/* <div className="flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-black after:mt-0.5 after:flex-1 after:border-t after:border-black">
                          <p className="mx-4 mb-0 text-center dark:text-white">
                            o
                          </p>
                        </div>
                        
                        <button
                          className="px-5 py-2.5 border flex justify-center items-center gap-2 bg-white border-blue-main hover:bg-white/80 transition-colors duration-150 rounded-lg w-full "
                          type="button"
                          onClick={loginGoogle}
                        >
                          <Icon className="h-6 w-6" icon="logos:google-icon" />
                          <span className="text-sm">Continuar con Google</span>
                        </button> */}
                  </div>

                  {/* <p className="text-sm font-light text-center">
                        ¿Olvidaste tu contraseña?{" "}
                        <button
                          className="font-semibold text-main hover:underline"
                          onClick={() => setRecoveryPassword(true)}
                        >
                          Recuperar
                        </button>
                      </p> */}

                  <p className="text-sm font-light text-center">
                    ¿No tienes una cuenta?{" "}
                    <Link
                      to="/auth/registrarse"
                      className="font-semibold text-main hover:underline"
                    >
                      Registrarse
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </form>
          {/*  ) : (
              <form>
                  <div className="flex flex-col gap-4 md:gap-6">
                  <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-white md:text-2xl">
                    Recuperar contraseña
                  </h1>

                  <div className="flex flex-col gap-4 md:gap-6">
                    <div className="flex flex-col gap-2">
                      <Label>Email</Label>

                      <Input
                        className="bg-white"
                        type="email"
                        placeholder="email"
                        {...formik.getFieldProps("email")}
                        disabled={loading}
                      />

                      {formik.touched.email && formik.errors.email && (
                        <small className="font-bold text-[#ff4444]">
                          {formik.errors.email}
                        </small>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-5 relative group">
                    <Button
                      variant="auth"
                      className="w-full rounded-lg"
                      type="submit"
                      id="login"
                      aria-label="login"
                      role="button"
                      disabled={loading}
                    >
                      {loading ? "Cargando..." : "Enviar email"}
                    </Button>
                    <div className="absolute -inset-1 bg-linear-to-r from-blue-secondary to-blue-secondary rounded-lg blur-md opacity-0 group-hover:opacity-60 transition duration-200 group-hover:duration-200" />
                  </div>
                  <Button
                    className="font-semibold text-main hover:underline"
                    onClick={() => setRecoveryPassword(false)}
                  >
                    Volver
                  </Button>
                </div> 
              </form>
            )} */}
        </div>
        {/*      )} */}
      </div>
    </section>
  )
}

export default LoginPage
