import { BarberGet } from "@/interfaces/Barber"
import { Icon } from "@iconify/react/dist/iconify.js"
import { Link } from "react-router-dom"
const Card = ({ barber }: { barber: BarberGet }) => {
  return (
    <Link
      to={`/barbers/${barber.id}`}
      className="flex flex-col lg:flex-row gap-3 w-[300px] lg:w-[400px] bg-gray-800 rounded-lg border border-gray-700 p-4 min-h-[364px] lg:min-h-[100px] h-full"
    >
      <div className="flex flex-col items-center justify-center w-full lg:w-[69%] gap-4">
        <img
          className="size-36 aspect-square rounded-full border-2 border-blue-main"
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

      <div className="flex flex-col w-full gap-2 h-full">
        <h4 className="w-full font-extrabold">{barber.nombre}</h4>

        <div className="flex flex-col gap-2">
          <div className="flex gap-0.5">
            <Icon icon="mdi:location" width={20} />
            <p className="text-sm font-extralight">
              {barber.ciudad} | {barber.direccion}
            </p>
          </div>
          <p className="text-sm line-clamp-3 font-">{barber.descripcion}</p>
        </div>

        <div className="flex justify-end items-end h-full">
          <Link
            className="flex items-center hover:gap-2 duration-200 transition-transform text-blue-main"
            to={`/barbers/${barber.id}`}
          >
            Ver detalles{" "}
            <Icon icon="material-symbols:arrow-right-alt-rounded" width={20} />
          </Link>
        </div>
      </div>
    </Link>
  )
}
export default Card
