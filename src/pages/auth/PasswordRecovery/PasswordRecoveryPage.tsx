import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { resetPassword, resetPasswordConfirm } from "@/services/AuthService"
import { recoveryPasswordSchema } from "@/utils/schemas/userSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Icon } from "@iconify/react/dist/iconify.js"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"

const PasswordRecoveryPage = () => {
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  /* Update user */
  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      token: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(recoveryPasswordSchema),
  })

  /* Send Email */
  const {
    handleSubmit: handleSubmitEmail,
    register: registerEmail,
    formState: { errors: errorsEmail },
  } = useForm({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(
      z.object({
        email: z.string().email("Formato invalido"),
      })
    ),
  })

  /* Send email */
  const { mutate, isPending } = useMutation({
    mutationKey: ["reset-password"],
    mutationFn: ({ email }: { email: string }) => {
      return resetPassword(email)
    },
    onSuccess: () => {
      setStep(2)
    },
  })

  const { mutate: mutateUpdate, isPending: isPendingUpdate } = useMutation({
    mutationKey: ["update-user"],
    mutationFn: (values: {
      email: string
      token: string
      password: string
    }) => {
      return resetPasswordConfirm(values)
    },
    onSuccess: () => {
      setStep(2)
    },
  })

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevState) => !prevState)
  }

  const submitEmailFunction = handleSubmitEmail(async (value) => {
    mutate(value)
  })

  const passwordRecoveryFunction = handleSubmit((values) => {
    mutateUpdate(values)
  })

  return (
    <section className="flex items-center justify-center w-full min-h-screen py-8">
      <div className="w-full sm:w-[450px] rounded-lg shadow-sm p-6 sm:p-8 flex flex-col gap-3 bg-gray-main">
        {step === 1 ? (
          <form onSubmit={submitEmailFunction} className="flex flex-col gap-2">
            {isPending ? (
              <div className="flex items-center justify-center w-full">
                <Icon
                  icon="eos-icons:loading"
                  width={60}
                  height={60}
                  className="animate-spin text-center "
                />
              </div>
            ) : (
              <>
                <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-white md:text-2xl">
                  Ingrese sus <span className="text-blue-main">datos</span>
                </h1>

                <div className="flex flex-row gap-2 items-end">
                  <Label>Correo electrónico</Label>
                </div>

                <Input
                  type="email"
                  {...registerEmail("email")}
                  placeholder="example@gmail.com"
                />

                <small className="font-bold text-red-500">
                  {errorsEmail.email?.message}
                </small>

                <Button
                  variant="auth"
                  type="submit"
                  id="register"
                  aria-label="Register"
                  role="button"
                >
                  Enviar
                </Button>
              </>
            )}
          </form>
        ) : (
          <form
            onSubmit={passwordRecoveryFunction}
            className="flex flex-col gap-2"
          >
            <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-white md:text-2xl">
              Ingrese sus <span className="text-blue-main">datos</span>
            </h1>

            <p>
              Se le a enviado un correo electrónica para restablecer su
              contraseña. Porfavor ingrese sus datos y el token que recibio.
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-2 items-end">
                <Label>Correo electrónico</Label>
              </div>

              <Input
                type="email"
                {...registerForm("email")}
                placeholder="example@gmail.com"
                disabled={isPendingUpdate}
              />

              <small className="font-bold text-red-500">
                {errors.email?.message}
              </small>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-2 items-end">
                <Label>Token</Label>
              </div>

              <Input
                type="token"
                {...registerForm("token")}
                placeholder="123456"
                disabled={isPendingUpdate}
              />

              <small className="font-bold text-red-500">
                {errors.token?.message}
              </small>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Contraseña</Label>

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="•••••••••••••••"
                  {...registerForm("password")}
                  disabled={isPendingUpdate}
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
                  disabled={isPendingUpdate}
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

            <Button
              variant="auth"
              className="w-full rounded-lg"
              type="submit"
              id="register"
              aria-label="Register"
              role="button"
              disabled={isPendingUpdate}
            >
              Enviar
            </Button>
          </form>
        )}
      </div>
    </section>
  )
}
export default PasswordRecoveryPage
