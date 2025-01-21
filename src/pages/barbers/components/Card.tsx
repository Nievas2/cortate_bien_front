import { Button } from "@/components/ui/button"
import { BarberGet } from "@/interfaces/Barber"

const Card = ({ barber }: { barber: BarberGet }) => {
  return (
    <div className="flex gap-3 w-[300px] md:w-[400px] bg-gray-main rounded-lg border border-gray-800 p-4">
      <img className="size-40" src={barber.imagen_perfil} alt={barber.nombre} />
      <div className="flex flex-col w-full">
        <div className="flex w-full">
          <h4 className="w-full">{barber.nombre}</h4>
          <span className="py-1 px-3 text-sm border border-white rounded-full">
            {barber.puntaje}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm">
            {barber.ciudad} | {barber.direccion}
          </p>
          <p className="text-sm line-clamp-3">{barber.descripcion}</p>
        </div>
        <div className="flex flex-wrap h-full items-end">
          <Button variant="secondary">Sacar turno</Button>
        </div>
      </div>
    </div>
  )
}
export default Card
