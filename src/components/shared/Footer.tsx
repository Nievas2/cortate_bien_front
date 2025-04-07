import LinkedinIcon from "@/utils/LinkedinIcon"
import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="flex flex-col items-center justify-center w-full min-h-20 gap-8 bg-gray-main p-6">
      <section className="flex items-center justify-center gap-8 w-full">
        <Link
          to="https://www.linkedin.com/in/gabriel-nievas/"
          className="flex flex-row gap-1 justify-center items-center hover:scale-105 transition-transform"
          target="_blank"
        >
          <LinkedinIcon />
          Gabi
        </Link>

        <Link
          to="https://www.linkedin.com/in/emiigonzalez33/"
          className="flex flex-row gap-1 justify-center items-center hover:scale-105 transition-transform"
          target="_blank"
        >
          <LinkedinIcon />
          Emi
        </Link>
      </section>
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
    </footer>
  )
}
export default Footer
