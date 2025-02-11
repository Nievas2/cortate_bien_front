import { useQuery } from "@tanstack/react-query"
import Layout from "../Layout"
import { getAppointmentsByUser } from "@/services/AppointmentService"

const ProfileAppointmentPage = () => {
  const { data: user } = useQuery({
    queryKey: ["getAppointmentsByUser"],
    queryFn: getAppointmentsByUser,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24,
  })
  console.log(user);
  
  return <Layout>resr</Layout>
}
export default ProfileAppointmentPage
