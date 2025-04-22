import LinkedinIcon from "@/utils/LinkedinIcon"
import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <main className="flex flex-col gap-4 min-h-20 bg-gray-main p-6 w-full">
      <footer className="flex flex-col md:flex-row items-center md:justify-center gap-8 w-full">
        <section className="flex flex-col gap-4 w-full h-full items-center justify-center md:justify-start md:items-start">
          <img src="/logo.png" alt="logo" className="size-18" />
          <p className="text-gray-400">
            © 2025 - Todos los derechos reservados
          </p>
        </section>

        <section className="flex flex-col gap-3 w-full h-full items-center justify-center md:justify-start md:items-start">
          <h3 className="font-bold text-xl">Navegación</h3>
          <Link to="/barbers" className="hover:text-blue-main w-fit">
            Barberias
          </Link>

          <Link to="/prices" className="hover:text-blue-main w-fit">
            Precios
          </Link>
        </section>

        <section className="flex flex-col gap-3 w-full h-full items-center justify-center md:justify-start md:items-start">
          <h3 className="font-bold text-xl">Contactanos</h3>
          <Link
            to="https://www.linkedin.com/in/gabriel-nievas/"
            className="flex flex-row gap-1 items-center hover:text-blue-main w-fit"
            target="_blank"
          >
            <LinkedinIcon />
            Gabi
          </Link>

          <Link
            to="https://www.linkedin.com/in/emiigonzalez33/"
            className="flex flex-row gap-1 items-center hover:text-blue-main w-fit"
            target="_blank"
          >
            <LinkedinIcon />
            Emi
          </Link>
        </section>
      </footer>

      <hr />

      <span className="text-center w-full">
        Consultas a cortatebienapp@gmail.com
      </span>

      <section className="flex items-center justify-center flex-col sm:flex-row gap-2">
        <Link
          to="/privacy-policy"
          className="flex flex-row gap-1 justify-center items-center hover:text-blue-main duration-150 transition-colors"
        >
          Política de Privacidad
        </Link>
        |
        <Link
          to="/Terms-and-Conditions"
          className="flex flex-row gap-1 justify-center items-center hover:text-blue-main duration-150 transition-colors"
        >
          Términos y Condiciones
        </Link>
      </section>
    </main>
    /*   <footer className="flex flex-col items-center justify-center w-full min-h-20 gap-8 bg-gray-main p-6">
      <section className="flex items-center justify-center gap-8 w-full">
        
      </section>
      
    </footer> */
  )
}
export default Footer
