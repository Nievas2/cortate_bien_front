import GradientText from "@/utils/functions/GradientText";

export default function NotFound({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="flex flex-col gap-4 max-w-md w-full bg-gray-main shadow-lg rounded-lg p-8 text-center">
        <GradientText
          colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
          animationSpeed={3}
          showBorder={false}
          className="text-4xl leading-12 font-bold text-white"
        >
          Algo salio mal.
        </GradientText>

        <p className="text-xl text-white">
          No hemos encontrado lo que buscabas.
        </p>

        <p className="text-lg text-white">
          No te preocupes, podemos ayudarte a encontrar lo que necesitas.
        </p>

        {children}
      </div>
    </div>
  )
}
