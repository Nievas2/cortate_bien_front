import { useAuthContext } from "./contexts/authContext"
import { ProtectedRoute } from "./components/shared/ProtectedRoute"
import { ProtecteBarberRoute } from "./components/shared/ProtectedBarber"
import { ProtectedAdminRoute } from "./components/shared/ProtectedAdminRoute"
import { useLocation, Routes, Route, Navigate } from "react-router-dom"
import toast, { Toaster } from "react-hot-toast"
import Footer from "./components/shared/Footer"
import Navbar from "./components/shared/Navbar"
import NotFoundPage from "./pages/notFound/NotFoundPage"
import LoginPage from "./pages/auth/login/LoginPage"
import AuthPage from "./pages/auth/auth/AuthPage"
import RegisterPage from "./pages/auth/register/RegisterPage"
import LandingPage from "./pages/landing/LandingPage"
import DashboardPage from "./pages/dashboard/DashboardPage"
import AppointmentsPage from "./pages/dashboard/appointment/AppointmentsPage"
import ReviewsPage from "./pages/dashboard/review/ReviewsPage"
import BarberPage from "./pages/dashboard/barber/BarberPage"
import AdminsPage from "./pages/admins/AdminsPage"
import PricesPage from "./pages/prices/PricesPage"
import BarbersPage from "./pages/barbers/BarbersPage"
import DisabledBarbersPage from "./pages/admins/disabledBarbers/DisabledBarbersPage"
import PlansPage from "./pages/admins/plans/PlansPage"
import ProfilePage from "./pages/profile/ProfilePage"
import TermsAndConditions from "./components/shared/footer/TermsAndConditions"
import PrivacyPolicy from "./components/shared/footer/PrivacyPolicy"
import ProfileAppointmentPage from "./pages/profile/appointment/ProfileAppointmentPage"
import ProfileReviewsPage from "./pages/profile/reviews/ProfileReviewsPage"
import PasswordRecoveryPage from "./pages/auth/PasswordRecovery/PasswordRecoveryPage"
import BarberByIdPage from "./pages/barbers/barberById/BarberByIdPage"
import UpdateBarberPage from "./pages/dashboard/updateBarber/UpdateBarberPage"
import MaintenancePage from "./pages/maintenance/MaintenancePage"
import Cookies from "js-cookie"
import FirebasePage from "./pages/admins/firebase/FirebasePage"
/* import DisabledBarbersByIdPage from "./pages/admins/disabledBarbers/disabledBarbersById/DisabledBarbersByIdPage" */
import { getToken, onMessage } from "firebase/messaging"
import { messaging } from "./firebase"
import { useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import { getFirebaseToken } from "./services/FirebaseService"
import { Button } from "./components/ui/button"

function App() {
  const location = useLocation()
  const { authUser, setAuthUser } = useAuthContext()

  const { mutate } = useMutation({
    mutationKey: ["get-firebase-token"],
    mutationFn: async (token: string) => {
      if (authUser == null) return
      return getFirebaseToken(token)
    },
  })
  const activarMensajes = async () => {
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_VAPID_KEY,
    }).catch((error) =>
      console.log("Error al obtener el token de Firebase:", error)
    )

    if (token && authUser?.user) {
      setAuthUser({ ...authUser, fcmToken: token })
      mutate(token)
    }
  }
  useEffect(() => {
    if (authUser == null) return
    if (authUser.fcmToken == undefined || authUser.fcmToken == null) {
      activarMensajes()
    }
    onMessage(messaging, (message) => {
      toast.custom((t) => (
        <div className="flex flex-col gap-2 bg-black-main p-4 rounded-lg text-white max-w-md">
          <span className="text-sm font-bold">
            {message.notification?.title}
          </span>
          <p className="text-sm">{message.notification?.body}</p>

          <Button variant="secondary" onClick={() => toast.dismiss(t.id)}>
            Cerrar
          </Button>
        </div>
      ))
    })
  }, [])
  return (
    <main className="bg-black-main text-white">
      <section className="w-full font-poppins flex flex-col justify-center items-center min-h-screen">
        <Navbar />

        <div className="flex w-full flex-1 max-w-8xl">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                authUser == null ? (
                  <LandingPage />
                ) : authUser.user.tipo_de_cuenta === "CLIENTE" ? (
                  <Navigate to="/barbers" />
                ) : authUser.user.tipo_de_cuenta === "BARBERO" ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <LandingPage />
                )
              }
            />

            <Route
              path="/terms-and-conditions"
              element={<TermsAndConditions />}
            />

            <Route path="/privacy-policy" element={<PrivacyPolicy />} />

            <Route
              path="/prices"
              element={
                <ProtectedRoute>
                  <PricesPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/barbers"
              element={
                <ProtectedRoute>
                  <BarbersPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/barbers/:id"
              element={
                <ProtectedRoute>
                  <BarberByIdPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile/appointments"
              element={
                <ProtectedRoute>
                  <ProfileAppointmentPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile/reviews"
              element={
                <ProtectedRoute>
                  <ProfileReviewsPage />
                </ProtectedRoute>
              }
            />

            <Route path="/auth" element={<AuthPage />} />

            <Route
              path="/auth/password-recovery"
              element={<PasswordRecoveryPage />}
            />

            <Route
              path="/auth/iniciar-sesion"
              element={
                Cookies.get("token") ? <Navigate to="/" /> : <LoginPage />
              }
            />

            <Route
              path="/auth/registrarse"
              element={
                Cookies.get("token") ? <Navigate to="/" /> : <RegisterPage />
              }
            />

            {/* Dashboard Barbers */}
            <Route
              path="/dashboard"
              element={
                <ProtecteBarberRoute>
                  <DashboardPage />
                </ProtecteBarberRoute>
              }
            />

            <Route
              path="/dashboard/barber"
              element={
                <ProtecteBarberRoute>
                  <BarberPage />
                </ProtecteBarberRoute>
              }
            />

            <Route
              path="/dashboard/barber/update"
              element={
                <ProtecteBarberRoute>
                  <UpdateBarberPage />
                </ProtecteBarberRoute>
              }
            />

            <Route
              path="/dashboard/barber/appointments"
              element={
                <ProtecteBarberRoute>
                  <AppointmentsPage />
                </ProtecteBarberRoute>
              }
            />
            <Route
              path="/dashboard/barber/reviews"
              element={
                <ProtecteBarberRoute>
                  <ReviewsPage />
                </ProtecteBarberRoute>
              }
            />

            {/* Dashboard Admins */}
            <Route
              path="admins/dashboard"
              element={
                <ProtectedAdminRoute>
                  <AdminsPage />
                </ProtectedAdminRoute>
              }
            />

            <Route
              path="admins/dashboard/barbers/disabled"
              element={
                <ProtectedAdminRoute>
                  <DisabledBarbersPage />
                </ProtectedAdminRoute>
              }
            />

            {/* <Route
              path="admins/dashboard/barbers/disabled/id"
              element={
                <ProtectedAdminRoute>
                  <DisabledBarbersByIdPage />
                </ProtectedAdminRoute>
              }
            /> */}

            <Route
              path="admins/dashboard/plans"
              element={
                <ProtectedAdminRoute>
                  <PlansPage />
                </ProtectedAdminRoute>
              }
            />

            <Route
              path="admins/dashboard/firebase"
              element={
                <ProtectedAdminRoute>
                  <FirebasePage />
                </ProtectedAdminRoute>
              }
            />

            <Route path="/404" element={<NotFoundPage />} />
            <Route path="/*" element={<Navigate to="/404" replace />} />
            <Route path="/mantenimiento" element={<MaintenancePage />} />
          </Routes>
        </div>

        <Footer />
      </section>
      <Toaster position="top-center" reverseOrder={true} />
    </main>
  )
}

export default App
