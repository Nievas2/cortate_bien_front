/* import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { getFirebaseToken } from "@/services/FirebaseService"
import { Button } from "@/components/ui/button" */
import { Label } from "@radix-ui/react-dropdown-menu"
import Layout from "../Layout"
import { useMutation } from "@tanstack/react-query"
import { postNotificationFirebase } from "@/services/FirebaseService"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createNotificactionsSchema } from "@/utils/schemas/adminsSchama"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useAuthContext } from "@/contexts/authContext"

const FirebasePage = () => {
  const { authUser } = useAuthContext()
  /*   const [step, setStep] = useState(1)
  const [token, setToken] = useState()
  const { mutate, isSuccess } = useMutation({
    mutationKey: ["generate-firebase-token"],
    mutationFn: async () => {
      getFirebaseToken()
    },
    onSuccess(data: any) {
      console.log(data)
      setToken(data.data.token)
    },
  }) */
  const { register, handleSubmit } = useForm({
    defaultValues: {
      title: "",
      body: "",
      idUser: "",
    },
    resolver: zodResolver(createNotificactionsSchema),
  })

  const { mutate } = useMutation({
    mutationKey: ["send-notification-firebase"],
    mutationFn: async (data: { title: string; body: string }) => {
      if (!authUser) return
      return postNotificationFirebase({
        title: data.title,
        body: data.body,
        idUser: authUser.user.id,
      })
    },
  })

  const onSubmit = handleSubmit(async (data: any) => {
    mutate(data)
  })

  return (
    <Layout>
      <main className="flex flex-col gap-8 w-full h-full p-6">
        <form
          className="flex flex-col gap-4 w-full bg-gray-main p-2 rounded-md"
          onSubmit={onSubmit}
        >
          <div className="flex flex-col gap-4">
            <Label>Titulo</Label>
            <Input
              {...register("title")}
              placeholder="Titulo de la notificacion"
            />
          </div>
          <div className="flex flex-col gap-4">
            <Label>Mensaje</Label>
            <Textarea
              {...register("body")}
              placeholder="Mensaje de la notificacion"
            />
          </div>
          <Button variant="secondary" type="submit">
            Enviar
          </Button>
        </form>
        {/* {step === 1 ? (
          <div className="flex flex-col gap-4 w-full h-full">
            <h1 className="text-2xl font-bold">Firebase</h1>
            <p className="text-sm text-gray-500">
              Genera un token para autenticarte en Firebase
            </p>
            <Button
              onClick={() => mutate()}
              variant="secondary"
              disabled={isSuccess}
            >
              {isSuccess ? "Token Generado" : "Generar Token"}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 w-full h-full">
            <h1 className="text-2xl font-bold">Token Generado</h1>
            <p className="text-sm text-gray-500">Tu token es: {token}</p>
            <button
              onClick={() => setStep(1)}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Regresar
            </button>
          </div>
        )} */}
        <form action=""></form>
      </main>
    </Layout>
  )
}
export default FirebasePage
