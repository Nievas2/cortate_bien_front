import { Button } from "@/components/ui/button"
import { Barber } from "@/interfaces/Barber"
import { activeBarbery } from "@/services/BarberService"
import { useMutation } from "@tanstack/react-query"

const CardBarberyDisabled = ({
  barber,
  setSelectBarber,
}: {
  barber: Barber
  setSelectBarber?: Function
}) => {
  const { mutate, isSuccess } = useMutation({
    mutationKey: ["activeBarbery"],
    mutationFn: () => activeBarbery(barber.id!),
  })

  function handleActive() {
    mutate()
  }

  return (
    <div className="flex flex-col justify-center items-center gap-4 w-full min-w-48 max-w-96 rounded-lg border border-gray-900 p-6 shadow-lg bg-gray-main text-white">
      <img
        className="w-24 h-24 rounded-full object-cover"
        src={barber.imagen_perfil}
        alt={barber.nombre}
      />
      <span className="text-lg font-extrabold">{barber.nombre}</span>
      <span className="text-sm font-medium">{barber.direccion}</span>
      <span className="text-xs font-light text-center">
        {barber.descripcion}
      </span>
      {!isSuccess ? (
        <div className="flex justify-between items-center gap-2 w-full">
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => setSelectBarber && setSelectBarber(barber)}
          >
            Ver más
          </Button>

          <Button variant="simple" onClick={handleActive}>
            Habilitar
          </Button>
        </div>
      ) : (
        <span className="text-green-500 font-semibold">
          Barbería habilitada
        </span>
      )}
    </div>
  )
}

export default CardBarberyDisabled
