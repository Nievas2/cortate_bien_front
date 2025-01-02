import LinkedinIcon from "@/utils/LinkedinIcon"
import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className=" flex items-center justify-center w-full h-20 gap-8 bg-gray-main ">
      <Link
        to="https://www.linkedin.com/in/gabriel-nievas/"
        className="flex flex-row gap-1 justify-center items-center hover:scale-110 transition-transform"
        target="_blank"
      >
        <LinkedinIcon />
        Gabi
      </Link>
      <Link
        to="https://www.linkedin.com/in/emiigonzalez33/"
        className="flex flex-row gap-1 justify-center items-center hover:scale-110 transition-transform"
        target="_blank"
      >
        <LinkedinIcon />
        Emi
      </Link>
    </footer>
  )
}
export default Footer
