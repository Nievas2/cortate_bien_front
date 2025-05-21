import { Button } from "@/components/ui/button"
import { Barber } from "@/interfaces/Barber"

const CardBarberyDisabled = ({
  barber,
  setSelectBarber,
}: {
  barber: Barber
  setSelectBarber?: Function
}) => {
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
      <div className="flex flex-col justify-between items-center gap-2 w-full">
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => setSelectBarber && setSelectBarber(barber)}
        >
          Ver más
        </Button>
      </div>
    </div>
  )
}

export default CardBarberyDisabled
