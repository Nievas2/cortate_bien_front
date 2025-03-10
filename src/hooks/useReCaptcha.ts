import { useState, useEffect } from "react"

declare global {
  interface Window {
    grecaptcha: {
      ready: (cb: () => void) => void
      execute: (
        siteKey: string,
        options?: {
          action?: string
        }
      ) => Promise<string>
    }
  }
}

type ReCaptchaAction = {
  action: string
}

/* type ReCaptchaResult = {
  token: string;
}; */

type UseReCaptchaOptions = {
  siteKey: string
  scriptId?: string
  onError?: () => void
  showBadge?: boolean
}

const useReCaptcha = ({
  siteKey,
  scriptId = "recaptcha-v3-script",
  onError,
  showBadge = true,
}: UseReCaptchaOptions) => {
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const executeRecaptcha = async (
    action: ReCaptchaAction["action"]
  ): Promise<string> => {
    if (!recaptchaLoaded || !window.grecaptcha) {
      throw new Error("reCAPTCHA no está cargado correctamente")
    }

    try {
      const token = await window.grecaptcha.execute(siteKey, { action })
      return token
    } catch (err) {
      throw new Error("Error al ejecutar reCAPTCHA: " + (err as Error).message)
    }
  }

  useEffect(() => {
    const loadScript = () => {
      const script = document.createElement("script")
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
      script.id = scriptId
      script.async = true
      script.defer = true

      script.onload = () => {
        if (!showBadge) {
          const badge = document.querySelector(".grecaptcha-badge")
          if (badge) {
            ;(badge as HTMLElement).style.visibility = "hidden"
          }
        }
        setRecaptchaLoaded(true)
      }

      script.onerror = () => {
        setError(new Error("Error al cargar reCAPTCHA"))
        onError?.()
      }

      document.body.appendChild(script)
    }

    if (!document.getElementById(scriptId)) {
      loadScript()
    } else {
      setRecaptchaLoaded(true)
    }

    return () => {
      const script = document.getElementById(scriptId)
      if (script) {
        document.body.removeChild(script)
      }
    }
  }, [siteKey, scriptId, onError, showBadge])

  return {
    executeRecaptcha,
    recaptchaLoaded,
    error,
  }
}

export default useReCaptcha
