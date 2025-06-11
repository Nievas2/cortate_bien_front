import GradientText from "@/utils/functions/GradientText"
import { Icon } from "@iconify/react/dist/iconify.js"
import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null)
  const phoneRef = useRef<HTMLDivElement>(null)
  const floatingElementsRef = useRef<(HTMLDivElement | null)[]>([])
  const textRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    // Simular GSAP - Animaciones de entrada
    const hero = heroRef.current
    const phone = phoneRef.current
    const text = textRef.current

    if (hero && phone && text) {
      // Animación inicial del texto
      text.style.transform = "translateY(50px)"
      text.style.opacity = "0"

      setTimeout(() => {
        text.style.transition = "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)"
        text.style.transform = "translateY(0)"
        text.style.opacity = "1"
      }, 300)

      // Animación del teléfono
      phone.style.transform = "translateY(100px) scale(0.8)"
      phone.style.opacity = "0"

      setTimeout(() => {
        phone.style.transition = "all 1.5s cubic-bezier(0.16, 1, 0.3, 1)"
        phone.style.transform = "translateY(0) scale(1)"
        phone.style.opacity = "1"
      }, 600)

      // Animaciones de elementos flotantes
      floatingElementsRef.current.forEach((el, i) => {
        if (el) {
          el.style.animation = `float ${3 + i * 0.5}s ease-in-out infinite alternate`
          el.style.animationDelay = `${i * 0.2}s`
        }
      })
    }
  }, [])

  return (
    <>
      <main
        ref={heroRef}
        className="relative flex flex-col items-center justify-center w-full min-h-screen pt-5 overflow-hidden pb-10"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(96, 165, 250, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(30, 58, 138, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 70%),
            linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #0f172a 50%, #1e3a8a 75%, #0f172a 100%)
          `,
        }}
      >
        {/* Elementos flotantes de fondo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Elementos geométricos flotantes */}
          <div
            ref={(el) => (floatingElementsRef.current[0] = el)}
            className="absolute top-20 left-10 w-4 h-4 bg-blue-400/30 rounded-full blur-sm"
          />
          <div
            ref={(el) => (floatingElementsRef.current[1] = el)}
            className="absolute top-40 right-20 w-6 h-6 bg-blue-500/20 rounded-full blur-sm"
          />
          <div
            ref={(el) => (floatingElementsRef.current[2] = el)}
            className="absolute bottom-40 left-20 w-8 h-8 bg-blue-300/25 rounded-full blur-sm"
          />
          <div
            ref={(el) => (floatingElementsRef.current[3] = el)}
            className="absolute bottom-20 right-10 w-3 h-3 bg-blue-600/30 rounded-full blur-sm"
          />

          {/* Líneas de conexión */}
          <svg className="absolute inset-0 w-full h-full opacity-10">
            <defs>
              <linearGradient
                id="lineGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <path
              d="M100,200 Q300,100 500,300 T900,200"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              fill="none"
              className="animate-pulse"
            />
            <path
              d="M200,400 Q600,300 800,500"
              stroke="url(#lineGradient)"
              strokeWidth="1.5"
              fill="none"
              className="animate-pulse"
              style={{ animationDelay: "1s" }}
            />
          </svg>
        </div>

        {/* Grid de fondo sutil */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(96, 165, 250, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(96, 165, 250, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between w-full max-w-7xl mx-auto px-4 gap-12">
          {/* Contenido principal */}
          <section
            ref={textRef}
            className="flex flex-col gap-3 items-center lg:items-start text-center lg:text-left lg:flex-1"
          >
            <div className="flex flex-col">
              <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={3}
                showBorder={false}
                className="text-4xl font-black tracking-tight leading-tight lg:text-6xl max-w-4xl"
              >
                Gestiona tu barbería de manera inteligente
              </GradientText>

              <p className="text-xl lg:text-2xl text-gray-300 max-w-2xl leading-relaxed font-light">
                Sistema de gestión de turnos que{" "}
                <span className="text-blue-400 font-medium">
                  simplifica la administración
                </span>{" "}
                de tu barbería y mejora la experiencia de tus clientes.
              </p>
            </div>

            {/* Badges de características */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <div className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full backdrop-blur-sm">
                <span className="text-blue-300 text-sm font-medium">
                  🚀 Gestión inteligente
                </span>
              </div>
              <div className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full backdrop-blur-sm">
                <span className="text-blue-300 text-sm font-medium">
                  ⚡ Tiempo real
                </span>
              </div>
              <div className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full backdrop-blur-sm">
                <span className="text-blue-300 text-sm font-medium">
                  📱 Multi-plataforma
                </span>
              </div>
            </div>

            {/* Google Play Store */}
            <Link
              to="https://play.google.com/store/apps/details?id=com.cortate_bien_app"
              target="_blank"
              className="flex items-center justify-center lg:justify-start"
            >
              <div className="flex items-center gap-4 p-4 rounded-2xl border border-gray-700/50 bg-gray-800/30 backdrop-blur-sm hover:bg-gray-800/50 transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 flex items-center justify-center">
                  <Icon icon="logos:google-play-icon" width={48} height={48} />
                </div>
                <div className="flex flex-col items-start">
                  <p className="text-gray-400 text-sm">Disponible en</p>
                  <p className="text-white text-xl font-bold">Google Play</p>
                </div>
              </div>
            </Link>
          </section>

          {/* Sección de capturas de pantalla */}
          <section
            ref={phoneRef}
            className="relative lg:flex-1 flex items-center justify-center"
          >
            {/* Contenedor principal del teléfono */}
            <div className="relative">
              {/* Efecto de brillo de fondo */}
              <div className="absolute -inset-20 bg-gradient-to-r from-blue-600/20 via-transparent to-blue-400/20 rounded-full blur-3xl animate-pulse" />

              {/* Marco del teléfono */}
              <div className="relative bg-gray-900 rounded-[3rem] p-2 shadow-2xl shadow-blue-500/20 border border-gray-700">
                {/* Pantalla */}
                <div className="bg-gray-800 rounded-[2.5rem] overflow-hidden relative">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-10 overflow-hidden" />

                  {/* AQUÍ VAN TUS CAPTURAS DE PANTALLA */}
                  <div className="w-80 h-[640px] bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center relative overflow-hidden">
                    {/* Placeholder para tu captura principal */}
                    <div className="absolute inset-4 bg-gradient-to-br from-blue-900/20 to-blue-800/20 rounded-3xl border border-blue-500/20 flex flex-col items-center justify-center overflow-hidden">
                      <img
                        src="/screenshot/inicio_screen.png"
                        alt="Captura de pantalla de inicio"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Teléfonos adicionales flotantes */}
              <div className="absolute -left-20 top-20 transform rotate-12 scale-75 opacity-80">
                <div className="bg-gray-900 rounded-3xl p-2 shadow-xl border border-gray-700">
                  <div className="w-48 h-96 bg-gradient-to-br from-gray-800 to-gray-900 rounded-[1.5rem] flex items-center justify-center overflow-hidden">
                    <div className="text-center">
                      <img
                        src="/screenshot/Turno_Screen.png"
                        alt="Captura de pantalla de TurnoCard"
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-16 top-32 transform -rotate-12 scale-75 opacity-90">
                <div className="bg-gray-900 rounded-3xl p-2 shadow-xl border border-gray-700">
                  <div className="w-48 h-96 bg-gradient-to-br from-gray-800 to-gray-900 rounded-[1.5rem] flex items-center justify-center overflow-hidden">
                    <div className="text-center">
                      <img
                        src="/screenshot/filtro_screen.png"
                        alt="Captura de pantalla de Filtro"
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}

export default HeroSection
