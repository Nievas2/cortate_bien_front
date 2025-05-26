import { Icon } from "@iconify/react/dist/iconify.js"
import { useEffect, useRef } from "react"

const FeatureSection = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  const floatingElementsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const section = sectionRef.current
    const title = titleRef.current
    const subtitle = subtitleRef.current

    if (section && title && subtitle) {
      // Animación del título
      title.style.transform = 'translateY(50px)'
      title.style.opacity = '0'
      
      setTimeout(() => {
        title.style.transition = 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
        title.style.transform = 'translateY(0)'
        title.style.opacity = '1'
      }, 200)

      // Animación del subtítulo
      subtitle.style.transform = 'translateY(30px)'
      subtitle.style.opacity = '0'
      
      setTimeout(() => {
        subtitle.style.transition = 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
        subtitle.style.transform = 'translateY(0)'
        subtitle.style.opacity = '1'
      }, 400)

      // Animación de las tarjetas
      cardsRef.current.forEach((card, i) => {
        if (card) {
          card.style.transform = 'translateY(60px)'
          card.style.opacity = '0'
          
          setTimeout(() => {
            card.style.transition = 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
            card.style.transform = 'translateY(0)'
            card.style.opacity = '1'
          }, 600 + (i * 200))
        }
      })

      // Animaciones de elementos flotantes
      floatingElementsRef.current.forEach((el, i) => {
        if (el) {
          el.style.animation = `float ${3 + i * 0.5}s ease-in-out infinite alternate`
          el.style.animationDelay = `${i * 0.3}s`
        }
      })
    }
  }, [])

  const features = [
    {
      icon: "heroicons:calendar-days",
      title: "Gestión de turnos",
      description: "Sistema intuitivo para administrar reservas y turnos de manera eficiente"
    },
    {
      icon: "heroicons:users",
      title: "Gestión de clientes", 
      description: "Mantén un registro detallado de las preferencias de tus clientes"
    },
    {
      icon: "heroicons:clock",
      title: "Ahorro de Tiempo",
      description: "Automatiza tu agenda y reduce las tareas administrativas"
    }
  ]

  return (
    <section 
      ref={sectionRef}
      className="relative flex flex-col items-center justify-center w-full overflow-hidden pt-10 pb-20"
      style={{
        background: `
          radial-gradient(circle at 30% 20%, rgba(96, 165, 250, 0.12) 0%, transparent 50%),
          radial-gradient(circle at 70% 80%, rgba(30, 58, 138, 0.15) 0%, transparent 50%),
          linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #0f172a 50%, #1e3a8a 75%, #0f172a 100%)
        `
      }}
    >
      {/* Elementos flotantes de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Elementos geométricos flotantes */}
        <div 
          ref={el => floatingElementsRef.current[0] = el}
          className="absolute top-32 left-20 w-5 h-5 bg-blue-400/25 rounded-full blur-sm"
        />
        <div 
          ref={el => floatingElementsRef.current[1] = el}
          className="absolute top-20 right-32 w-3 h-3 bg-blue-500/30 rounded-full blur-sm"
        />
        <div 
          ref={el => floatingElementsRef.current[2] = el}
          className="absolute bottom-32 left-16 w-6 h-6 bg-blue-300/20 rounded-full blur-sm"
        />
        <div 
          ref={el => floatingElementsRef.current[3] = el}
          className="absolute bottom-40 right-20 w-4 h-4 bg-blue-600/25 rounded-full blur-sm"
        />
        
        {/* Líneas de conexión */}
        <svg className="absolute inset-0 w-full h-full opacity-8">
          <defs>
            <linearGradient id="featureLineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4"/>
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.1"/>
            </linearGradient>
          </defs>
          <path 
            d="M150,300 Q400,200 650,400 T1100,300" 
            stroke="url(#featureLineGradient)" 
            strokeWidth="1.5" 
            fill="none"
            className="animate-pulse"
          />
        </svg>
      </div>

      {/* Grid de fondo sutil */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(96, 165, 250, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(96, 165, 250, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-4 gap-16">
        
        {/* Header */}
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <h2
            ref={titleRef}
            className="text-4xl font-black tracking-tight leading-tight lg:text-6xl text-white"
          >
            Características{' '}
            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
              principales
            </span>
          </h2>
          
          <p
            ref={subtitleRef}
            className="text-xl lg:text-2xl text-gray-300 max-w-3xl leading-relaxed font-light"
          >
            Todo lo que necesitas para gestionar tu barbería de manera{' '}
            <span className="text-blue-400 font-medium">eficiente y profesional</span>.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={el => cardsRef.current[index] = el}
              className="group relative"
            >
              {/* Efecto de brillo de fondo */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-blue-500/20 to-blue-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
              
              {/* Tarjeta principal */}
              <div className="relative flex flex-col items-center justify-center gap-6 p-8 rounded-2xl border border-blue-500/20 bg-gray-900/50 backdrop-blur-sm hover:bg-gray-900/70 hover:border-blue-400/40 transition-all duration-500 min-h-[280px] hover:scale-105">
                
                {/* Icono */}
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-400/30 group-hover:from-blue-500/30 group-hover:to-blue-600/30 group-hover:border-blue-400/50 transition-all duration-500">
                  <Icon 
                    icon={feature.icon} 
                    className="text-3xl text-blue-400 group-hover:text-blue-300 transition-colors duration-300" 
                  />
                </div>
                
                {/* Contenido */}
                <div className="flex flex-col items-center gap-4 text-center">
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-100 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 leading-relaxed transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>

                {/* Elemento decorativo */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400/50 rounded-full group-hover:bg-blue-300 group-hover:scale-150 transition-all duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes float {
          from { transform: translateY(0px) rotate(0deg); }
          to { transform: translateY(-15px) rotate(8deg); }
        }
      `}</style>
    </section>
  )
}

export default FeatureSection