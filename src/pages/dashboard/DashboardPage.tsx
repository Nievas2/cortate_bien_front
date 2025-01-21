import { useQuery } from "@tanstack/react-query"
import ChangeBarberShop from "./components/ChangeBarberShop"
import { getBarbersById } from "@/services/BarberService"
import { useAuthContext } from "@/contexts/authContext"

const DashboardPage = () => {
  const { authUser } = useAuthContext()

  const { data, refetch } = useQuery({
    queryKey: ["getbarberyid"],
    queryFn: getBarbers,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24,
  })

  async function getBarbers() {
    if (authUser != undefined) {
      const res = await getBarbersById(authUser.user.sub)
      return res
    }
  }

  return <ChangeBarberShop refetch={refetch} barbers={data?.data} />
}
export default DashboardPage
