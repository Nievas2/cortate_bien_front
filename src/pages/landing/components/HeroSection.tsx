import { Button } from "@/components/ui/button"

const HeroSection = () => {
  return (
    <section className="flex flex-col gap-10 items-center justify-center w-full h-[90vh] text-center px-2">
      <div className="flex flex-col gap-4 items-center justify-center">
        <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl lg:text-6xl/none max-w-[80vw]">
          Gestiona tu barbería de manera inteligente
        </h1>
        <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
          Sistema de gestión de turnos que simplifica la administración de tu
          barbería y mejora la experiencia de tus clientes.
        </p>
      </div>
      <div className="flex gap-4 items-center justify-center">
        <Button variant="simple">Comenzar ahora</Button>
        <Button variant="secondary">Ver demo</Button>
      </div>
    </section>
  )
}
export default HeroSection
