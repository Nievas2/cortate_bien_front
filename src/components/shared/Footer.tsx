import LinkedinIcon from "@/utils/LinkedinIcon" // Asegúrate de que la ruta es correcta
import { Icon } from "@iconify/react/dist/iconify.js"
import { Link } from "react-router-dom"
import { GoToTop } from "@/utils/toUp" // Asegúrate de que la ruta y la función existen

const Footer = () => {
  return (
    <footer
      className="w-full border-t border-blue-600/20 py-16 px-4 sm:px-6 lg:px-8" // Añade margen superior si es necesario
      style={{
        background: `
          linear-gradient(180deg, #0f172a 0%, #111827 100%),
          radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.08) 0%, transparent 40%)
        `
      }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-gray-300">

        {/* Sección 1: Logo & Copyright */}
        <section className="flex flex-col gap-4 items-center sm:items-start text-center sm:text-left">
          <img src="/logo.png" alt="logo" className="h-12 w-auto mb-2" />
          <p className="text-gray-400 text-sm">
            Gestiona tu barbería de manera inteligente y profesional.
          </p>
          <p className="text-gray-500 text-xs mt-4">
            © {new Date().getFullYear()} Cortate Bien - Todos los derechos reservados.
          </p>
        </section>

        {/* Sección 2: Navegación */}
        <section className="flex flex-col gap-3 items-center sm:items-start text-center sm:text-left">
          <h3 className="font-semibold text-lg text-white mb-3">Navegación</h3>
          <Link to="/" onClick={GoToTop} className="text-gray-300 hover:text-blue-400 transition-colors duration-300">
            Inicio
          </Link>
          <Link to="/barbers" onClick={GoToTop} className="text-gray-300 hover:text-blue-400 transition-colors duration-300">
            Barberías
          </Link>
          <Link to="/prices" onClick={GoToTop} className="text-gray-300 hover:text-blue-400 transition-colors duration-300">
            Precios
          </Link>
        </section>

        {/* Sección 3: Legal */}
         <section className="flex flex-col gap-3 items-center sm:items-start text-center sm:text-left">
            <h3 className="font-semibold text-lg text-white mb-3">Legal</h3>
             <Link
                to="/privacy-policy"
                onClick={GoToTop}
                className="text-gray-300 hover:text-blue-400 transition-colors duration-300"
            >
                Política de Privacidad
            </Link>
            <Link
                to="/terms-and-conditions" // Asegúrate que esta ruta coincide con App.tsx
                onClick={GoToTop}
                className="text-gray-300 hover:text-blue-400 transition-colors duration-300"
            >
                Términos y Condiciones
            </Link>
         </section>

        {/* Sección 4: Contacto */}
        <section className="flex flex-col gap-3 items-center sm:items-start text-center sm:text-left">
          <h3 className="font-semibold text-lg text-white mb-3">Contáctanos</h3>
           <a
            href="mailto:cortatebienapp@gmail.com"
            className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors duration-300"
          >
            <Icon icon="heroicons:envelope" className="text-xl flex-shrink-0" />
            <span>cortatebienapp@gmail.com</span>
          </a>
          <Link
            to="https://www.linkedin.com/in/gabriel-nievas/"
            className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors duration-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedinIcon className="text-xl flex-shrink-0" /> {/* Usa tu icono original */}
            <span>Gabriel Nievas</span>
          </Link>
          <Link
            to="https://www.linkedin.com/in/emiigonzalez33/"
            className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors duration-300"
            target="_blank"
            rel="noopener noreferrer"
          >
             <LinkedinIcon className="text-xl flex-shrink-0" /> {/* Usa tu icono original */}
             <span>Emiliano Gonzalez</span>
          </Link>
        </section>

      </div>
    </footer>
  )
}
export default Footer