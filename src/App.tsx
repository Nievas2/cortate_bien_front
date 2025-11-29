import { useAuthContext } from "./contexts/authContext"
import { ProtectedRoute } from "./components/shared/ProtectedRoute"
import { ProtecteBarberRoute } from "./components/shared/ProtectedBarber"
import { ProtectedAdminRoute } from "./components/shared/ProtectedAdminRoute"
import { useLocation, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"
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
import { useMutation } from "@tanstack/react-query"
import { getFirebaseToken } from "./services/FirebaseService"
import ChatsPage from "./pages/chats/ChatsPage"
import { useFirebaseMessaging } from "./hooks/fmc/useFirebaseMessaging"
import {
  NotificationData,
  useFCMNotifications,
} from "./hooks/fmc/useFCMNotifications"
import { DarkModeProvider } from "./contexts/DarkModeContext"
import BarberService from "./pages/dashboard/servicesBarber/BarberService"
import { ChatByIdPage } from "./pages/chats/chatById/ChatByIdPage"

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

  useFirebaseMessaging({
    authUser,
    setAuthUser,
    mutate,
  })

  // Usar el nuevo hook de notificaciones FCM
  const { NotificationContainer } = useFCMNotifications({
    maxNotifications: 5,
    defaultDuration: 5000,
    onNotificationAction: (action: string, notification: NotificationData) => {
      console.log("Acción de notificación:", action, notification)

      // Manejar diferentes tipos de acciones
      switch (action) {
        case "view_appointment":
          // Navegar a citas
          window.location.href = "/profile/appointments"
          break
        case "view_chat":
          // Navegar a chats
          window.location.href = "/chats"
          break
        case "view_profile":
          // Navegar a perfil
          window.location.href = "/profile"
          break
        default:
          console.log("Acción no reconocida:", action)
      }
    },
  })

  return (
    <DarkModeProvider>
      <main className="bg-black-main text-white">
        <section className="w-full font-poppins flex flex-col justify-center items-center min-h-screen">
          {!/^\/chats\/[^/]+$/.test(location.pathname) && <Navbar />}

          <div className="flex w-full flex-1">
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={
                  /* authUser == null ? (
                  <LandingPage />
                ) : authUser.user.tipo_de_cuenta === "CLIENTE" ? (
                  <Navigate to="/barbers" />
                ) : authUser.user.tipo_de_cuenta === "BARBERO" ? (
                  <Navigate to="/dashboard" />
                ) : ( */
                  <LandingPage />
                  /*  ) */
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

              <Route
                path="/chats"
                element={
                  <ProtectedRoute>
                    <ChatsPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/chats/:id"
                element={
                  <ProtectedRoute>
                    <ChatByIdPage />
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
                  /* Cookies.get("token") ? <Navigate to="/" /> :  */ <LoginPage />
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
                path="/dashboard/barber/services"
                element={
                  <ProtecteBarberRoute>
                    <BarberService />
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

          {!/^\/chats\/[^/]+$/.test(location.pathname) && <Footer />}
        </section>

        {/* Contenedor de notificaciones FCM */}
        <NotificationContainer />

        {/* Toaster para otras notificaciones */}
        <Toaster position="bottom-right" reverseOrder={true} />
      </main>
    </DarkModeProvider>
  )
}

export default App
