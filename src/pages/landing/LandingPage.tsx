import { Link, useLocation } from "react-router-dom";
import FeatureSection from "./components/FeatureSection";
import HeroSection from "./components/HeroSection";
import SubscriptionSection from "./components/SubscriptionSection";
import { useEffect, useState } from "react";
import { useUpdateSession } from "@/hooks/useUpdateSession";
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const LandingPage = () => {
  const { search } = useLocation();
  const [showInstall, setShowInstall] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installPromptDismissed, setInstallPromptDismissed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { updateSession } = useUpdateSession();

  document.title = "Cortate bien | Inicio";

  // Guardar token si viene en query
  useEffect(() => {
    const params = new URLSearchParams(search);
    const token = params.get("token");
    if (token) {
      updateSession(token).then((success) => {
        if (success) {
          window.location.href = "/";
        } else {
          window.location.href = "/login";
        }
      });
    } else if (search) {
      window.location.href = "/login";
    }
  }, [search]);

  useEffect(() => {
    const isSmallScreen = window.innerWidth <= 1024;

    const mobileCheck =
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || isSmallScreen;

    console.log(mobileCheck);

    setIsMobile(mobileCheck);

    // Detectar iOS y standalone
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const standalone =
      (window.navigator as any).standalone === true ||
      window.matchMedia("(display-mode: standalone)").matches;
    setIsIOS(iOS);
    setIsStandalone(standalone);

    // Revisar si ya fue descartado
    const dismissed = localStorage.getItem("pwa-install-dismissed") === "true";
    setInstallPromptDismissed(dismissed);

    // Mostrar cartel en iOS si corresponde
    if (iOS && !standalone && !dismissed) {
      const timer = setTimeout(() => setShowInstall(true), 3000);
      return () => clearTimeout(timer);
    }

    // Manejar evento en Android
    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      if (!dismissed) {
        setShowInstall(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler as EventListener);
    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handler as EventListener
      );
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("pwa-install-dismissed", "true");
    setShowInstall(false);
    setInstallPromptDismissed(true);
  };

  const renderInstallButton = () => {
    if (!isMobile || isStandalone || installPromptDismissed) return null;

    if (isIOS) {
      return (
        <div className="fixed bottom-4 left-4 right-4 rounded-lg shadow-lg z-50">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg p-4 relative">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex text-4xl items-center justify-center text-blue-500">
                  📱
                </div>
                <div className="flex-grow">
                  <h3 className="text-sm font-medium ">
                    Instalar Cortate bien
                  </h3>
                  <p className="text-xs  mt-1">
                    Para instalar la app: toca el botón compartir
                    <span className="inline-block mx-1">⬆️</span>y luego
                    "Agregar a pantalla de inicio"
                  </p>
                </div>
                <button
                  onClick={handleDismiss}
                  className="absolute top-2 right-2 z-[100] text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed bottom-4 left-4 right-4 z-50">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">📱</div>
              <div>
                <h3 className="font-semibold">¡Instala la app!</h3>
                <p className="text-sm opacity-90">
                  Acceso rápido desde tu pantalla de inicio
                </p>
              </div>
            </div>
            <div className="flex flex-row gap-2 items-center justify-center mt-2 sm:mt-0">
              <button
                onClick={handleDismiss}
                className="px-4 py-2 text-sm bg-white/20 rounded hover:bg-white/30 transition cursor-pointer"
              >
                Ahora no
              </button>

              <Link
                to="https://play.google.com/store/apps/details?id=com.cortate_bien_app"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="px-4 py-2 text-sm bg-white text-blue-600 rounded font-medium hover:bg-gray-100 transition cursor-pointer">
                  Instalar
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <FeatureSection />
      <SubscriptionSection />
      {showInstall && renderInstallButton()}
    </div>
  );
};

export default LandingPage;
