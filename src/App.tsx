import Footer from "./components/shared/Footer"
import Navbar from "./components/shared/Navbar"
import { useAuthContext } from "./contexts/authContext"
import { useLocation, Routes, Route, Navigate } from "react-router-dom"
import NotFoundPage from "./pages/notFound/NotFoundPage"
import LoginPage from "./pages/auth/login/LoginPage"
import AuthPage from "./pages/auth/auth/AuthPage"
import RegisterPage from "./pages/auth/register/RegisterPage"
import LandingPage from "./pages/landing/LandingPage"
import DashboardPage from "./pages/dashboard/DashboardPage"
import AppointmentsPage from "./pages/dashboard/appointment/AppointmentsPage"
import ReviewsPage from "./pages/dashboard/review/ReviewsPage"
import BarberPage from "./pages/dashboard/barber/BarberPage"
import { ProtectedRoute } from "./components/shared/ProtectedRoute"
import AdminsPage from "./pages/admins/AdminsPage"
import { ProtectedAdminRoute } from "./components/shared/ProtectedAdminRoute"
import PricesPage from "./pages/prices/PricesPage"
import BarbersPage from "./pages/barbers/BarbersPage"
import DisabledBarbersPage from "./pages/admins/disabledBarbers/DisabledBarbersPage"
import PlansPage from "./pages/admins/plans/PlansPage"
import ProfilePage from "./pages/profile/ProfilePage"
import TermsAndConditions from "./components/shared/footer/TermsAndConditions"
import PrivacyPolicy from "./components/shared/footer/PrivacyPolicy"
import ProfileAppointmentPage from "./pages/profile/appointment/ProfileAppointmentPage"
import ProfileReviewsPage from "./pages/profile/reviews/ProfileReviewsPage"

function App() {
  const location = useLocation()
  const { authUser } = useAuthContext()

  return (
    <main className="bg-black-main text-white">
      <section className="w-full font-poppins flex flex-col justify-center items-center min-h-screen">
        <Navbar />

        <div className="flex w-full flex-1 max-w-8xl">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LandingPage />} />

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
              path="/auth/iniciar-sesion"
              element={authUser ? <Navigate to="/" /> : <LoginPage />}
            />

            <Route path="/auth/auth" element={<AuthPage />} />

            <Route
              path="/auth/registrarse"
              element={authUser ? <Navigate to="/" /> : <RegisterPage />}
            />

            {/* Dashboard Barbers */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/barber"
              element={
                <ProtectedRoute>
                  <BarberPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/barber/appointments"
              element={
                <ProtectedRoute>
                  <AppointmentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/barber/reviews"
              element={
                <ProtectedRoute>
                  <ReviewsPage />
                </ProtectedRoute>
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

            <Route path="/404" element={<NotFoundPage />} />
            <Route path="/*" element={<Navigate to="/404" replace />} />
          </Routes>
        </div>

        <Footer />
      </section>
    </main>
  )
}

export default App
