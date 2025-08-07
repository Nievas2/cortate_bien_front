import { useSearchParams } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import ProfileAppointments from "./appointment/ProfileAppointmentPage";
import ProfileReviews from "./reviews/ProfileReviewsPage";
import { ProfileInfo } from "./profileInfo/ProfileInfo";
import { Background } from "@/components/ui/background";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  document.title = "Cortate Bien | Perfil";
  const [searchParams, setSearchParams] = useSearchParams();

  // Obtener la sección activa desde los parámetros de URL
  const activeSection = searchParams.get("section") || "info";

  // Función para cambiar de sección
  const handleSectionChange = (section: string) => {
    setSearchParams({ section });
  };

  const getTitle = () => {
    switch (activeSection) {
      case "info":
        return "Información Personal";
      case "appointments":
        return "Mis Turnos";
      case "reviews":
        return "Mis Reseñas";
      default:
        return "Perfil";
    }
  };

  const getSubtitle = () => {
    switch (activeSection) {
      case "info":
        return "Gestiona tu información personal y preferencias de cuenta";
      case "appointments":
        return "Administra tus citas y turnos programados";
      case "reviews":
        return "Gestiona todas las reseñas que has dejado";
      default:
        return "Perfil";
    }
  };

  // Renderizar el contenido según la sección activa con animación
  const renderContent = () => {
    const variants = {
      initial: { opacity: 0, y: 30 },
      animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, type: "spring" },
      },
      exit: { opacity: 0, y: -30, transition: { duration: 0.3 } },
    };
    let content;
    switch (activeSection) {
      case "appointments":
        content = <ProfileAppointments />;
        break;
      case "reviews":
        content = <ProfileReviews />;
        break;
      case "info":
        content = <ProfileInfo />;
        break;
      default:
        content = (
          <div>
            <p className="text-center text-gray-400">Sección no encontrada.</p>
          </div>
        );
    }
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants}
        >
          {content}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <Background>
      <div className="flex h-full w-full items-start justify-center gap-2 sm:gap-4 md:gap-6 px-2 sm:px-4 py-2 sm:py-4 md:px-6 lg:px-8 overflow-y-auto min-h-screen">
        <div className="w-full max-w-2xl space-y-6 sm:space-y-8 animate-in fade-in duration-500">
          {/* Header */}
          <div className="text-center space-y-1 sm:space-y-2 px-2">
            <AnimatePresence mode="wait">
              <motion.h1
                key={activeSection + "-title"}
                className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, type: "spring" }}
              >
                {getTitle()}
              </motion.h1>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.p
                key={activeSection + "-subtitle"}
                className="text-gray-400 max-w-md mx-auto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, delay: 0.1, type: "spring" }}
              >
                {getSubtitle()}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center w-full">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-1 sm:p-2 w-full max-w-md">
              <div className="flex flex-wrap gap-1 w-full justify-center">
                <button
                  onClick={() => handleSectionChange("info")}
                  className={`cursor-pointer w-full sm:w-auto px-3 sm:px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 justify-center text-sm sm:text-base ${
                    activeSection === "info"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon icon="tabler:user" className="h-4 w-4" />
                  Información
                </button>
                <button
                  onClick={() => handleSectionChange("appointments")}
                  className={`cursor-pointer w-full sm:w-auto px-3 sm:px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 justify-center text-sm sm:text-base ${
                    activeSection === "appointments"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon icon="tabler:calendar-check" className="h-4 w-4" />
                  Turnos
                </button>
                <button
                  onClick={() => handleSectionChange("reviews")}
                  className={`cursor-pointer w-full sm:w-auto px-3 sm:px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 justify-center text-sm sm:text-base ${
                    activeSection === "reviews"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon icon="tabler:star" className="h-4 w-4" />
                  Reseñas
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          {renderContent()}
        </div>
      </div>
    </Background>
  );
}
