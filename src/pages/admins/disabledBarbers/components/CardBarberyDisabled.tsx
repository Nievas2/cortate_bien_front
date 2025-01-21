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
    <div className="flex flex-col justify-center items-center gap-2 w-full max-w-96 rounded-lg border border-white p-4 ">
      <img
        className="size-24"
        src={barbery.imagen_perfil}
        alt={barbery.nombre}
      />
      <span className="line-clamp-2">{barbery.nombre}</span>
      <span className="text-xs line-clamp-3">{barbery.descripcion}</span>
      <span>{barbery.direccion}</span>
      {!isSuccess && (
        <Button variant="simple" onClick={handleActive}>
          Habilitar
        </Button>
      )}
      {isSuccess && <span>Barberia habilitada</span>}
    </div>
  )
}
export default CardBarberyDisabled
