import { useLocation } from "react-router-dom"
import FeatureSection from "./components/FeatureSection"
import HeroSection from "./components/HeroSection"
import SubscriptionSection from "./components/SubscriptionSection"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { decodeJwt } from "@/utils/decodeJwt"
import { useAuthContext } from "@/contexts/authContext"

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

const LandingPage = () => {
  const { setAuthUser } = useAuthContext()
  const { search } = useLocation()
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)
  const [showInstall, setShowInstall] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [installPromptDismissed, setInstallPromptDismissed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  document.title = "Cortate bien | Inicio"

  // Guardar token si viene en query
  useEffect(() => {
    const params = new URLSearchParams(search)
    const token = params.get("token")
    if (token) {
      Cookies.set("token", token, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      })
      setAuthUser({ user: decodeJwt(token), token })
      window.location.href = "/"
    } else if (search) {
      window.location.href = "/"
    }
  }, [search, setAuthUser])

  useEffect(() => {
    // Detectar móvil
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0
    const isSmallScreen = window.innerWidth <= 1024
    const mobileCheck =
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      (isTouchDevice && isSmallScreen)
    setIsMobile(mobileCheck)

    // Detectar iOS y standalone
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const standalone =
      (window.navigator as any).standalone === true ||
      window.matchMedia("(display-mode: standalone)").matches
    setIsIOS(iOS)
    setIsStandalone(standalone)

    // Revisar si ya fue descartado
    const dismissed = localStorage.getItem("pwa-install-dismissed") === "true"
    setInstallPromptDismissed(dismissed)

    // Mostrar cartel en iOS si corresponde
    if (iOS && !standalone && !dismissed) {
      const timer = setTimeout(() => setShowInstall(true), 3000)
      return () => clearTimeout(timer)
    }

    // Manejar evento en Android
    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      if (!dismissed) {
        setDeferredPrompt(e)
        setShowInstall(true)
      }
    }

    window.addEventListener("beforeinstallprompt", handler as EventListener)
    return () => window.removeEventListener("beforeinstallprompt", handler as EventListener)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === "accepted") {
        console.log("PWA installed")
        localStorage.setItem("pwa-install-dismissed", "true")
      }
    } catch (error) {
      console.error("Error during installation:", error)
    }
    setDeferredPrompt(null)
    setShowInstall(false)
  }

  const handleDismiss = () => {
    localStorage.setItem("pwa-install-dismissed", "true")
    setShowInstall(false)
    setInstallPromptDismissed(true)
  }

  const renderInstallButton = () => {
    if (!isMobile || isStandalone || installPromptDismissed) return null

    if (isIOS) {
      return (
        <div className="fixed bottom-4 left-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 text-blue-500">📱</div>
            <div className="flex-grow">
              <h3 className="text-sm font-medium text-gray-900">
                Instalar Cortate bien
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                Para instalar la app: toca el botón compartir
                <span className="inline-block mx-1">⬆️</span>y luego "Agregar a pantalla de inicio"
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="fixed bottom-4 left-4 right-4 z-50">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">📱</div>
              <div>
                <h3 className="font-semibold">¡Instala la app!</h3>
                <p className="text-sm opacity-90">Acceso rápido desde tu pantalla de inicio</p>
              </div>
            </div>
            <div className="flex space-x-2 items-center justify-center mt-2 sm:mt-0">
              <button
                onClick={handleDismiss}
                className="px-3 py-1 text-sm bg-white/20 rounded hover:bg-white/30 transition cursor-pointer"
              >
                Ahora no
              </button>
              <button
                onClick={handleInstall}
                className="px-4 py-2 text-sm bg-white text-blue-600 rounded font-medium hover:bg-gray-100 transition cursor-pointer"
              >
                Instalar
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <FeatureSection />
      <SubscriptionSection />
      {showInstall && renderInstallButton()}
    </div>
  )
}

export default LandingPage
