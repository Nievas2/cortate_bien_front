import { Label } from "@radix-ui/react-dropdown-menu"
import Layout from "../Layout"
import { useMutation } from "@tanstack/react-query"
import {
  deleteTokenFirebase,
  postNotificationFirebase,
} from "@/services/FirebaseService"
import {
  createNotificactionsSchema,
  createTokenSchema,
} from "@/utils/schemas/adminsSchama"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useAuthContext } from "@/contexts/authContext"

const FirebasePage = () => {
  const { authUser } = useAuthContext()
  /* send notifications */
  const { register, handleSubmit } = useForm({
    defaultValues: {
      title: "",
      body: "",
      idUser: "",
    },
    resolver: zodResolver(createNotificactionsSchema),
  })

  const { mutate, isSuccess } = useMutation({
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
  /* delete token */
  const { mutate: deleteToken, isSuccess: isSuccessDelete } = useMutation({
    mutationKey: ["delete-token-firebase"],
    mutationFn: async (token: string) => {
      return deleteTokenFirebase(token)
    },
  })

  const { register: registerDelete, handleSubmit: handleSubmitDelete } =
    useForm({
      defaultValues: {
        token: "",
      },
      resolver: zodResolver(createTokenSchema),
    })

  const onSubmitDelete = handleSubmitDelete(async (data: any) => {
    deleteToken(data.token)
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

          <Button variant="secondary" type="submit" disabled={isSuccess}>
            {isSuccess ? "Notificacion enviada" : "Enviar notificacion"}
          </Button>
        </form>

        <form
          className="flex flex-col gap-4 w-full bg-gray-main p-2 rounded-md"
          onSubmit={onSubmitDelete}
        >
          <div className="flex flex-col gap-4">
            <Label>Token</Label>
            <Input placeholder="Token" {...registerDelete("token")} />
          </div>

          <Button variant="secondary" type="submit" disabled={isSuccessDelete}>
            {isSuccessDelete ? "Token eliminado" : "Eliminar token"}
          </Button>
        </form>
      </main>
    </Layout>
  )
}
export default FirebasePage
