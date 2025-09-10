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

  // Detectar si es móvil
  useEffect(() => {
    const mobileCheck = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    setIsMobile(mobileCheck)
  }, [])

  // Detectar iOS y si ya está instalada
  useEffect(() => {
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const standalone =
      (window.navigator as any).standalone === true ||
      window.matchMedia("(display-mode: standalone)").matches

    const dismissed = localStorage.getItem("pwa-install-dismissed") === "true"
    const dismissedTime = localStorage.getItem("pwa-install-dismissed-time")

    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    const shouldReshow = dismissedTime && parseInt(dismissedTime) < sevenDaysAgo

    setIsIOS(iOS)
    setIsStandalone(standalone)
    setInstallPromptDismissed(dismissed && !shouldReshow)

    if (iOS && !standalone && (!dismissed || shouldReshow)) {
      const timer = setTimeout(() => {
        setShowInstall(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  // Escuchar el evento de instalación PWA (Android)
  useEffect(() => {
    const handler = (e: BeforeInstallPromptEvent) => {
      console.log("beforeinstallprompt event fired")
      e.preventDefault()

      const dismissed = localStorage.getItem("pwa-install-dismissed") === "true"
      const dismissedTime = localStorage.getItem("pwa-install-dismissed-time")

      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
      const shouldReshow =
        dismissedTime && parseInt(dismissedTime) < sevenDaysAgo

      if (!dismissed || shouldReshow) {
        setDeferredPrompt(e)
        setShowInstall(true)
        setInstallPromptDismissed(false)
      } else {
        setInstallPromptDismissed(true)
      }
    }

    window.addEventListener("beforeinstallprompt", handler as EventListener)

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
        localStorage.removeItem("pwa-install-dismissed")
        localStorage.removeItem("pwa-install-dismissed-time")
      }
    } catch (error) {
      console.error("Error during installation:", error)
    }

    setDeferredPrompt(null)
    setShowInstall(false)
  }

  const handleDismiss = () => {
    localStorage.setItem("pwa-install-dismissed", "true")
    localStorage.setItem("pwa-install-dismissed-time", Date.now().toString())

    setShowInstall(false)
    setInstallPromptDismissed(true)
  }

  const renderInstallButton = () => {
    if (isStandalone || installPromptDismissed) return null

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
              onClick={handleDismiss}
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
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">📱</div>
              <div>
                <h3 className="font-semibold">¡Instala la app!</h3>
                <p className="text-sm opacity-90">
                  Acceso rápido desde tu pantalla de inicio
                </p>
              </div>
            </div>
            <div className="flex space-x-2 items-center justify-center">
              <button
                onClick={handleDismiss}
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

      {isMobile && showInstall && renderInstallButton()}
    </div>
  )
}

export default LandingPage
