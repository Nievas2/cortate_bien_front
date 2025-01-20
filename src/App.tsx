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
              path="/auth/iniciar-sesion"
              element={authUser ? <Navigate to="/" /> : <LoginPage />}
            />
            <Route path="/auth/auth" element={<AuthPage />} />
            <Route
              path="/auth/registrarse"
              element={authUser ? <Navigate to="/" /> : <RegisterPage />}
            />

            <Route
              path="/dashboard"
              element={
                /*  <ProtectedRoute>
                </ProtectedRoute> */
                <DashboardPage />
              }
            />
            
            <Route
              path="/dashboard/barber"
              element={
                /*  <ProtectedRoute>
                </ProtectedRoute> */
                <BarberPage />
              }
            />

            <Route
              path="/dashboard/appointments"
              element={<AppointmentsPage />}
            />
            {/* <ProtectedRoute>
                </ProtectedRoute> */}
            {/* <ProtectedRoute>
              </ProtectedRoute> */}
            <Route path="/dashboard/reviews" element={<ReviewsPage />} />

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
