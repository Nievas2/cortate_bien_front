import { useAuthContext } from "@/contexts/authContext"
import { getUserById } from "@/services/UserService"
import { useQuery } from "@tanstack/react-query"

const ProfilePage = () => {
  const { authUser } = useAuthContext()
  const { data: user } = useQuery({
    queryKey: ["get-user-by-id"],
    queryFn: async () => {
      if (authUser != null) return await getUserById(authUser.user.sub)
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24,
  })

  return (
    <main className="flex w-full min-h-screen h-full">
      <section className="flex flex-col w-full gap-6 p-4 h-full">
        <h1
          className="text-center text-5xl font-bold"
          id="personal-information"
        >
          Mi perfil
        </h1>

        <div className="flex flex-col gap-4 min-h-44">
          <h2 className="text-2xl font-semibold">Informacion personal</h2>
          <div className="flex flex-col gap-2">
            <p>Nombre: {user?.data.nombre}</p>
            <p>Apellido: {user?.data.apellido}</p>
            <p>Correo: {user?.data.email}</p>
            <p>Telefono: {user?.data.telefono}</p>
            <p>Fecha de nacimiento: {user?.data.fechaNacimiento.split("T")[0]}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 min-h-44">
          <h2 className="text-2xl font-semibold" id="shift-history">
            Historial de turnos
          </h2>
          <div className="flex items-center justify-center h-full">
            <p>Pendiente a deploy</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 min-h-44">
          <h2 className="text-2xl font-semibold" id="review-history">
            Historial de reseñas
          </h2>
          <div className="flex items-center justify-center">
            <p>Pendiente a deploy</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 min-h-44">
          <h2 className="text-2xl font-semibold" id="order-history">
            Historial de ordenes
          </h2>
          <div className="flex items-center justify-center h-full">
            <p>Pendiente a deploy</p>
          </div>
        </div>
      </section>

      <section className="hidden lg:flex min-w-96">
        <ul className="flex flex-col gap-8 bg-gray-main p-4 w-full shadow-2xl shadow-gray-main">
          <h2 className="text-center text-2xl font-semibold">Menu</h2>
          <hr />
          <li>
            <a href="#personal-information" className="hover:text-blue-main">
              ∘ Informacion personal
            </a>
          </li>
          <li>
            <a href="#shift-history" className="hover:text-blue-main">
              ∘ Historial de turnos
            </a>
          </li>
          <li>
            <a href="#review-history" className="hover:text-blue-main">
              ∘ Historial de reseñas
            </a>
          </li>
          <li>
            <a href="#order-history" className="hover:text-blue-main">
              ∘ Historial de ordenes
            </a>
          </li>
        </ul>
      </section>
    </main>
  )
}
export default ProfilePage
