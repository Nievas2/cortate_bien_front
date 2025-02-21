import { Button } from "@/components/ui/button"
import { Barber } from "@/interfaces/Barber"
import { activeBarbery } from "@/services/BarberService"
import { useMutation } from "@tanstack/react-query"

const CardBarberyDisabled = ({ barbery }: { barbery: Barber }) => {
  const { mutate, isSuccess } = useMutation({
    mutationKey: ["activeBarbery"],
    mutationFn: () => activeBarbery(barbery.id!),
  })

  function handleActive() {
    mutate()
  }

  return (
    <div className="flex flex-col justify-center items-center gap-4 w-full min-w-48 max-w-96 rounded-lg border border-gray-900 p-6 shadow-lg bg-gray-main text-white">
      <img
        className="w-24 h-24 rounded-full object-cover"
        src={barbery.imagen_perfil}
        alt={barbery.nombre}
      />
      <span className="text-lg font-extrabold">
        {barbery.nombre}
      </span>
      <span className="text-sm font-medium">
        {barbery.direccion}
      </span>
      <span className="text-xs font-light text-center">
        {barbery.descripcion}
      </span>
      {!isSuccess ? (
        <Button variant="simple" onClick={handleActive}>
          Habilitar
        </Button>
      ) : (
        <span className="text-green-500 font-semibold">
          Barbería habilitada
        </span>
      )}
    </div>
  )
}

export default CardBarberyDisabled
