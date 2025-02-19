import { Label } from "@/components/ui/label"
import Layout from "./Layout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { deleteUser, logOutUser } from "@/services/AdminService"
import { zodResolver } from "@hookform/resolvers/zod"
import { AxiosError } from "axios"
import { deleteUserSchema } from "@/utils/schemas/adminsSchama"

const AdminsPage = () => {
  /* Delete */
  const {
    register: registerDelete,
    handleSubmit: handleSubmitDelete,
    formState: { errors: errorsDelete },
    reset: resetDelete,
  } = useForm({
    defaultValues: {
      id: "",
    },
    resolver: zodResolver(deleteUserSchema),
  })

  const {
    mutate: deleteUserMutation,
    isPending: isPendingDelete,
    error: errorDelete,
    isSuccess: isSuccessDelete,
  } = useMutation({
    mutationKey: ["delete-user"],
    mutationFn: (id: string) => {
      return deleteUser(id)
    },
    onSuccess: () => {
      resetDelete()
    },
  })

  const handleDelete = handleSubmitDelete(async (data) => {
    console.log(data)
    deleteUserMutation(data.id)
  })

  /* logOut */
  const {
    register: registerLogOut,
    handleSubmit: handleSubmitLogOut,
    formState: { errors: errorsLogOut },
    reset: resetLogOut,
  } = useForm({
    defaultValues: {
      id: "",
    },
    resolver: zodResolver(deleteUserSchema),
  })

  const {
    mutate: logOutUserMutation,
    isPending: isPendingLogOut,
    error: errorLogOut,
    isSuccess: isSuccessLogOut,
  } = useMutation({
    mutationKey: ["logout-user"],
    mutationFn: (id: string) => {
      return logOutUser(id)
    },
    onSuccess: () => {
      resetLogOut()
    },
  })

  const handleLogOut = handleSubmitLogOut(async (data) => {
    console.log(data)
    logOutUserMutation(data.id)
  })

  return (
    <Layout>
      <main className="flex flex-col gap-8 h-full w-full items-start p-2">
        <h1 className="text-4xl font-semibold text-center w-full">
          Administradores
        </h1>
        <div className="flex flex-col gap-8 items-start w-full">
          <form
            onSubmit={handleDelete}
            className="flex flex-col gap-6 p-4 bg-gray-main rounded-lg w-full"
          >
            <span className="text-xl font-bold text-center">
              Eliminar usuario
            </span>
            <div className="flex flex-col gap-4">
              <Label>Id del usuario</Label>
              <Input
                placeholder="Id del usuario"
                {...registerDelete("id")}
                type="text"
                className="input"
                disabled={isPendingDelete}
              />
              {errorsDelete.id?.message && (
                <span className="text-red-500 font-bold">
                  {errorsDelete.id?.message}
                </span>
              )}
              {errorDelete instanceof AxiosError && errorDelete.response && (
                <span className="text-red-500 font-bold">
                  {errorDelete.response.data.message}
                </span>
              )}
              {isSuccessDelete && (
                <span className="text-green-500 font-bold">
                  Usuario eliminado
                </span>
              )}
              <Button variant="secondary" disabled={isPendingDelete}>
                Eliminar usuario
              </Button>
            </div>
          </form>

          <hr className="w-full text-white" />

          <form
            onSubmit={handleLogOut}
            className="flex flex-col gap-6 p-4 bg-gray-main rounded-lg w-full"
          >
            <span className="text-xl font-bold text-center">
              Desloguear usuario
            </span>
            <div className="flex flex-col gap-4">
              <Label>Id del usuario</Label>
              <Input
                placeholder="Id del usuario"
                {...registerLogOut("id")}
                type="text"
                className="input"
                disabled={isPendingLogOut}
              />
              {errorsLogOut.id?.message && (
                <span className="text-red-500 font-bold">
                  {errorsLogOut.id?.message}
                </span>
              )}
              {errorLogOut instanceof AxiosError && errorLogOut.response && (
                <span className="text-red-500 font-bold">
                  {errorLogOut.response.data.message}
                </span>
              )}
              {isSuccessLogOut && (
                <span className="text-green-500 font-bold">
                  Usuario deslogueado
                </span>
              )}
              <Button variant="secondary" disabled={isPendingLogOut}>
                Eliminar usuario
              </Button>
            </div>
          </form>
        </div>
      </main>
    </Layout>
  )
}
export default AdminsPage
