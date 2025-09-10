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

  document.title = "Cortate bien | Inicio"

  useEffect(() => {
    const params = new URLSearchParams(search)
    const token = params.get("token")
    if (token) {
      Cookies.set("token", token, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      })
      const user = decodeJwt(token)
      const userAuth = {
        user: user,
        token: token,
      }
      setAuthUser(userAuth)
      window.location.href = "/"
    } else if (search) {
      window.location.href = "/"
    }
  }, [search])

  // Detectar iOS y si ya está instalada
  useEffect(() => {
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const standalone =
      (window.navigator as any).standalone === true ||
      window.matchMedia("(display-mode: standalone)").matches

    setIsIOS(iOS)
    setIsStandalone(standalone)

    // Para iOS, mostrar instrucciones después de un tiempo
    if (iOS && !standalone) {
      const timer = setTimeout(() => {
        setShowInstall(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  // Escuchar el evento de instalación PWA (Android/Desktop)
  useEffect(() => {
    const handler = (e: BeforeInstallPromptEvent) => {
      console.log("beforeinstallprompt event fired")
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstall(true)
    }

    window.addEventListener("beforeinstallprompt", handler as EventListener)

    // También verificar si el service worker está registrado
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then(() => {
        console.log("Service Worker is ready")
      })
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handler as EventListener
      )
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      console.log("User response:", outcome)

      if (outcome === "accepted") {
        console.log("PWA installed")
      }
    } catch (error) {
      console.error("Error during installation:", error)
    }

    setDeferredPrompt(null)
    setShowInstall(false)
  }

  const renderInstallButton = () => {
    if (isStandalone) return null

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
                <span className="inline-block mx-1">⬆️</span>y luego "Agregar a
                pantalla de inicio"
              </p>
            </div>
            <button
              onClick={() => setShowInstall(false)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600"
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">📱</div>
              <div>
                <h3 className="font-semibold">¡Instala la app!</h3>
                <p className="text-sm opacity-90">
                  Acceso rápido desde tu pantalla de inicio
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowInstall(false)}
                className="px-3 py-1 text-sm bg-white/20 rounded hover:bg-white/30 transition"
              >
                Ahora no
              </button>
              <button
                onClick={handleInstall}
                className="px-4 py-2 text-sm bg-white text-blue-600 rounded font-medium hover:bg-gray-100 transition"
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
