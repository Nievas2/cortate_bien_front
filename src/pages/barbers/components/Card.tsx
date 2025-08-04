import { BarberGet } from "@/interfaces/Barber"
import { Icon } from "@iconify/react/dist/iconify.js"
import { Link } from "react-router-dom"

const Card = ({ barber }: { barber: BarberGet }) => {
  return (
    <Link
      to={`/barbers/${barber.id}`}
      className="group relative flex flex-col lg:flex-row gap-4 w-[300px] lg:w-[400px] bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 rounded-xl border border-gray-700 hover:border-blue-400/50 p-5 min-h-[364px] lg:min-h-[120px] h-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] overflow-hidden"
    >
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
      
      {/* Profile Section */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full lg:w-[35%] gap-3">
        <div className="relative">
          <img
            className="size-32 lg:size-24 aspect-square rounded-full border-3 border-blue-400 group-hover:border-blue-300 shadow-md transition-all duration-300 object-cover"
            src={barber.imagen_perfil}
            alt={barber.nombre}
            loading="lazy"
          />
          {/* Subtle glow effect */}
          <div className="absolute inset-0 rounded-full bg-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
        </div>

        {/* Rating Stars */}
        {barber.puntaje > 0 && (
          <div className="flex gap-1 items-center justify-center bg-gray-900/50 px-2 py-1 rounded-full backdrop-blur-sm">
            <div className="flex gap-0.5 items-center">
              {Array.from({ length: Math.floor(barber.puntaje) }).map((_, index) => (
                <Icon key={index} icon="material-symbols:star" className="text-yellow-400" width={16} />
              ))}
              
              {!Number.isInteger(barber.puntaje) && (
                <Icon icon="material-symbols:star-half" className="text-yellow-400" width={16} />
              )}

              {Array.from({
                length: 5 - Math.ceil(barber.puntaje),
              }).map((_, index) => (
                <Icon
                  key={index}
                  icon="material-symbols:star-outline"
                  className="text-gray-400"
                  width={16}
                />
              ))}
            </div>
            <span className="text-xs text-gray-300 ml-1 font-medium">
              {barber.puntaje.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="relative z-10 flex flex-col w-full lg:w-[65%] gap-3 h-full">
        {/* Name */}
        <h2 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300 line-clamp-1">
          {barber.nombre}
        </h2>

        {/* Location */}
        <div className="flex items-start gap-2 text-gray-300">
          <Icon icon="mdi:location" width={18} className="text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-200">{barber.ciudad}</p>
            <p className="text-xs text-gray-400 line-clamp-1">{barber.direccion}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-300 line-clamp-2 lg:line-clamp-3 leading-relaxed flex-grow">
          {barber.descripcion}
        </p>

        {/* Action Button */}
        <div className="flex justify-end items-end pt-2">
          <div className="flex items-center gap-1 text-blue-400 group-hover:text-blue-300 font-medium text-sm transition-all duration-300 group-hover:gap-2">
            <span>Ver detalles</span>
            <Icon 
              icon="material-symbols:arrow-right-alt-rounded" 
              width={20} 
              className="transform group-hover:translate-x-1 transition-transform duration-300" 
            />
          </div>
        </div>
      </div>

      {/* Subtle border highlight on hover */}
      <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-blue-400/30 transition-all duration-300 pointer-events-none" />
    </Link>
  )
}

export default Card