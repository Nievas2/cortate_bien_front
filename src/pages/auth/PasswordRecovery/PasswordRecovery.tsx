/* import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { putPassword } from "@/services/AuthService"
import { recoveryPasswordSchemaPassword } from "@/utils/schemas/recoveryPassword"
import { Icon } from "@iconify/react/dist/iconify.js"
import { useFormik } from "formik"
import { useMemo, useState } from "react"
import { Link } from "react-router-dom"

const PasswordRecovery = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordMatchMessage, setPasswordMatchMessage] = useState("")
  const params = new URLSearchParams(window.location.search)
  const token = params.get("token")

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevState) => !prevState)
  }

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: recoveryPasswordSchemaPassword,
    onSubmit: async (values: { password: string; confirmPassword: string }) => {
      if (values.password !== values.confirmPassword) {
        setPasswordMatchMessage("Las contraseñas no coinciden")
        return
      }
      try {
        setLoading(true)
        if (token === undefined) setError(true)
        const response = await putPassword(values.password, token!)
        if (response.data?.error) return setError(true)
        window.location.href = "/auth/iniciar-sesion"
      } catch (error) {
        setError(true)
        throw error
      } finally {
        setLoading(false)
      }
    },
  })

  const passwordMatchClass = useMemo(
    () =>
      passwordMatchMessage === "Las contraseñas coinciden"
        ? "text-[#40944A]"
        : "text-[#ff4444]",
    [passwordMatchMessage]
  )

  return (
    <section className="flex items-center justify-center w-full min-h-screen">
      <div className="w-full sm:w-96 bg-main/20 rounded-lg shadow-sm p-6 sm:p-8 flex flex-col gap-3 bg-white">
        {token == undefined || error ? (
          <div className="flex flex-col items-center gap-4">
            <h4 className="text-white">
              Algo a salido mal pruebe volver a recuperar la contraseña aqui
            </h4>
            <div>
              <Button variant="auth">
                <Link to="/auth/iniciar-sesion">
                  Volver a recuperar contraseña
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <div className="flex flex-col gap-4 md:gap-6">
              <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-white md:text-2xl">
                Recuperar contraseña
              </h1>

              <div className="flex flex-col gap-4 md:gap-6">
                <div className="flex flex-col gap-2">
                  <Label>Nueva contraseña</Label>
                  <div className="relative">
                    <Input
                      className="bg-light"
                      type={showPassword ? "text" : "password"}
                      placeholder="Nueva contraseña"
                      {...formik.getFieldProps("password")}
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

                  {formik.touched.password && formik.errors.password && (
                    <small className="font-bold text-[#ff4444]">
                      {formik.errors.password}
                    </small>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Confirmar contraseña</Label>

                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="•••••••••••••••"
                      {...formik.getFieldProps("confirmPassword")}
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

                  {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword && (
                      <small className="font-bold text-[#ff4444]">
                        {formik.errors.confirmPassword}
                      </small>
                    )}

                  {passwordMatchMessage && (
                    <small className={`font-bold ${passwordMatchClass}`}>
                      {passwordMatchMessage}
                    </small>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <Button
                  variant="auth"
                  className="w-full rounded-lg"
                  type="submit"
                  id="login"
                  aria-label="login"
                  role="button"
                  disabled={loading}
                >
                  {loading ? "Cargando..." : "Generar nueva contraseña"}
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
export default PasswordRecovery */