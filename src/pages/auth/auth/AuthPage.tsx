import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { resendcode, validateCode } from "@/services/AuthService"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useLocation, useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { validateCodeSchema } from "@/utils/schemas/validateCode"

const AuthPage = () => {
  const [error, setError] = useState("")
  const [isResendDisabled, setIsResendDisabled] = useState(false)
  const [timer, setTimer] = useState(240)
  const navigate = useNavigate()
  const location = useLocation()
  const search = location.search
  const email = search.split("=")[1]

  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
  } = useForm({
    values: {
      email: email ? email : "",
      code: "",
    },
    resolver: zodResolver(validateCodeSchema),
  })

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isResendDisabled) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval)
            setIsResendDisabled(false)
            return 180
          }
          return prevTimer - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isResendDisabled])

  const codeFunction = handleSubmit(
    async (values: { email: string; code: string }) => {
      const { email, code } = values
      try {
        const res = await validateCode(code, email)
        navigate("/")
        return res
      } catch (error: any) {
        setError(error.response.data.message)
        throw error
      }
    }
  )

  async function resendCodeFunction() {
    try {
      const res = await resendcode(getValues("email"))
      setIsResendDisabled(true)
      return res
    } catch (error: any) {
      setIsResendDisabled(true)
      setError(error.response.data.message)
      throw error
    }
  }

  return (
    <section className="flex items-center justify-center w-full min-h-screen">
      <div className="w-full sm:w-96 rounded-lg shadow-sm p-6 sm:p-8 flex flex-col gap-3 bg-gray-main">
        <div>
          <form onSubmit={codeFunction}>
            <div className="flex flex-col gap-5 mx-auto">
              <div className="flex flex-col gap-4 md:gap-6">
                <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-white md:text-2xl">
                  Ingrese sus <span className="text-blue-main">datos</span>
                </h1>

                {!email ? (
                  <div className="flex flex-col gap-4">
                    <Label>Email</Label>

                    <Input
                      placeholder="example@gmail.com"
                      {...register("email")}
                      type="text"
                    />

                    {errors.email && (
                      <small className="font-bold text-red-500">
                        {errors.email.message}
                      </small>
                    )}
                  </div>
                ) : (
                  <span className="text-center font-bold">
                    Se le ha enviado un correo con el código para activar su
                    cuenta.
                  </span>
                )}

                <div className="flex flex-col gap-4">
                  <Label>Código</Label>

                  <Input
                    placeholder="123456"
                    {...register("code")}
                    type="text"
                  />

                  {errors.code && (
                    <small className="font-bold text-red-500">
                      {errors.code.message}
                    </small>
                  )}
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                    type="button"
                    variant="simple"
                    onClick={resendCodeFunction}
                    disabled={isResendDisabled}
                  >
                    Reenviar el código
                  </Button>
                  <span>
                    {isResendDisabled
                      ? `Volver a enviar el código en ${Math.floor(timer / 60)}:${(
                          timer % 60
                        )
                          .toString()
                          .padStart(2, "0")}`
                      : "Puede reenviar"}
                  </span>
                </div>

                {error && (
                  <small className="font-bold text-red-500">{error}</small>
                )}

                <div className="flex flex-col gap-5 relative group">
                  <Button
                    variant="secondary"
                    type="submit"
                    id="login"
                    aria-label="login"
                    role="button"
                  >
                    Iniciar sesión
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default AuthPage
