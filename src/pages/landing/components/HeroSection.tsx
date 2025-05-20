import { Button } from "@/components/ui/button"
import GradientText from "@/utils/functions/GradientText"
import { Icon } from "@iconify/react/dist/iconify.js"
import { Link } from "react-router-dom"

const HeroSection = () => {
  return (
    <main className="flex flex-col gap-10 items-center justify-center w-full h-[90vh] text-center px-2">
      <section className="flex flex-col gap-4 items-center justify-center">
        <GradientText
          colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
          animationSpeed={3}
          showBorder={false}
          className="text-3xl font-bold tracking-tighter leading-16 lg:leading-20 text-white sm:text-4xl md:text-5xl lg:text-6xl/none max-w-[80vw]"
        >
          Gestiona tu barbería de manera inteligente
        </GradientText>

        <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
          Sistema de gestión de turnos que simplifica la administración de tu
          barbería y mejora la experiencia de tus clientes.
        </p>
      </section>

      <section className="flex items-center justify-center">
        {/* Proximamente en la play store */}
        <div className="flex gap-2 p-3 rounded-md border border-gray-600 bg-gray-800">
          <Icon icon="logos:google-play-icon" width={40} />
          <div className="flex flex-col items-start justify-center">
            <p className="text-gray-400 text-sm">Proximamente en</p>
            <p className="text-gray-400 text-2xl font-semibold">Google Play</p>
          </div>
        </div>
      </section>

      <section className="flex gap-4 items-center justify-center">
        <Link to="/prices">
          <Button variant="simple">Ver los precios</Button>
        </Link>
        <Link to="/auth/registrarse">
          <Button variant="secondary">Registrarse</Button>
        </Link>
      </section>
    </main>
  )
}
export default HeroSection
