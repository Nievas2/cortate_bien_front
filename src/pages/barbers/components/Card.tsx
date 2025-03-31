import { BarberGet } from "@/interfaces/Barber"
import { Icon } from "@iconify/react/dist/iconify.js"
import { Link } from "react-router-dom"
const Card = ({ barber }: { barber: BarberGet }) => {
  return (
    <Link
      to={`/barbers/${barber.id}`}
      className="flex flex-col md:flex-row gap-3 w-[300px] md:w-[400px] bg-gray-main rounded-lg border border-gray-800 p-4"
    >
      <div className="flex flex-col items-center justify-center w-full md:w-[60%] gap-2">
        <img
          className="size-36 aspect-square"
          src={barber.imagen_perfil}
          alt={barber.nombre}
        />

        <div className="flex gap-2 items-center">
          {barber.puntaje > 0 && (
            <div className="flex gap-2 items-center justify-start">
              {Array.from({ length: barber.puntaje }).map((_, index) => (
                <span key={index}>
                  <Icon icon="material-symbols:star" color="gold" width={20} />
                </span>
              ))}
            </div>
          )}

          {!Number.isInteger(barber.puntaje) && (
            <Icon icon="material-symbols:star-half" color="gold" width={20} />
          )}

          {Array.from({
            length: 5 - Math.ceil(barber.puntaje),
          }).map((_, index) => (
            <span key={index}>
              <Icon
                icon="material-symbols:star-outline"
                stroke="1"
                width={20}
              />
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-col w-full gap-2">
        <h4 className="w-full font-extrabold">{barber.nombre}</h4>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-extralight">
            {barber.ciudad} | {barber.direccion}
          </p>
          <p className="text-sm line-clamp-3 font-">{barber.descripcion}</p>
        </div>
      </div>
    </Link>
  )
}
export default Card
