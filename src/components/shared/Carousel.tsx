import { useEffect, useState } from "react"
import { type CarouselApi } from "@/components/ui/carousel"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Skeleton } from "@/components/ui/skeleton"

interface CarouselDesktopProps {
  images: string[]
  isLoading?: boolean
}

const CarouselDesktop = ({ images, isLoading }: CarouselDesktopProps) => {
  const [imageSelected, setImageSelected] = useState(0)
  
  return isLoading != undefined && isLoading == true ? (
    <CarouselDesktopSkeleton />
  ) : (
    <div className="flex items-center justify-center gap-6 p-4">
      {/* Thumbnails Navigation */}
      <div className="flex flex-col items-center gap-3">
        {images.map((image: any, index: number) => (
          <button
            className={`relative size-16 rounded-xl overflow-hidden transition-all duration-300 
              ${imageSelected === index 
                ? "ring-4 ring-blue-500 dark:ring-blue-400 scale-110 shadow-lg" 
                : "ring-2 ring-gray-200 dark:ring-gray-600 hover:ring-gray-300 dark:hover:ring-gray-500 hover:scale-105"
              } 
              focus:outline-none focus:ring-4 focus:ring-blue-500/50`}
            onClick={() => setImageSelected(index)}
            key={crypto.randomUUID()}
            aria-label={`Ver imagen ${index + 1}`}
          >
            <img 
              src={image} 
              alt={`Miniatura ${index + 1} de la barbería`}
              className="w-full h-full object-cover"
            />
            
            {/* Active indicator */}
            {imageSelected === index && (
              <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-400/20 flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full shadow-md"></div>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Main Image Display */}
      <div className="relative flex-1 max-w-md">
        <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl bg-gray-100 dark:bg-gray-800">
          <img 
            src={images[imageSelected]} 
            alt={`Imagen principal de la barbería`}
            className="w-full h-full object-cover transition-all duration-500"
          />
          
          {/* Gradient overlay for better text readability if needed */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
          
          {/* Image counter */}
          <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
            {imageSelected + 1} / {images.length}
          </div>
        </div>

        {/* Navigation arrows for desktop */}
        <button
          onClick={() => setImageSelected(imageSelected > 0 ? imageSelected - 1 : images.length - 1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center group"
          aria-label="Imagen anterior"
        >
          <svg className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={() => setImageSelected(imageSelected < images.length - 1 ? imageSelected + 1 : 0)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center group"
          aria-label="Siguiente imagen"
        >
          <svg className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default CarouselDesktop

interface CarouselMobileProps {
  images: string[]
  isLoading?: boolean
}

export const CarouselMobile = ({ images, isLoading }: CarouselMobileProps) => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  // Auto-play functionality
  useEffect(() => {
    if (!api || !isAutoPlaying) return

    const interval = setInterval(() => {
      api.scrollNext()
    }, 4000)

    return () => clearInterval(interval)
  }, [api, isAutoPlaying])

  const handleUserInteraction = () => {
    setIsAutoPlaying(false)
    // Re-enable auto-play after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  return isLoading != undefined && isLoading == true ? (
    <CarouselMobileSkeleton />
  ) : (
    <div className="relative w-full h-full bg-gray-100 dark:bg-gray-800">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        setApi={setApi}
        className="w-full h-full"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <CarouselContent className="flex">
          {images.map((image, index) => (
            <CarouselItem key={crypto.randomUUID()} className="relative">
              <div className="relative aspect-square sm:aspect-video w-full">
                <img
                  src={image}
                  alt={`Imagen ${index + 1} de la barbería`}
                  className="w-full h-full object-cover"
                />
                
                {/* Gradient overlay for better contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Custom navigation buttons */}
        <CarouselPrevious 
          className="left-4 w-12 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-all duration-200"
          onClick={handleUserInteraction}
        />
        <CarouselNext 
          className="right-4 w-12 h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-all duration-200"
          onClick={handleUserInteraction}
        />
        
        {/* Enhanced pagination dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={crypto.randomUUID()}
              onClick={() => {
                api?.scrollTo(index)
                handleUserInteraction()
              }}
              className={`transition-all duration-300 rounded-full ${
                index + 1 === current 
                  ? "w-6 h-3 bg-white shadow-lg" 
                  : "w-3 h-3 bg-white/60 hover:bg-white/80"
              }`}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>

        {/* Image counter */}
        <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
          {current} / {count}
        </div>

        {/* Auto-play indicator */}
        {isAutoPlaying && (
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 text-white px-3 py-1 rounded-full text-xs backdrop-blur-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            Auto
          </div>
        )}
      </Carousel>
    </div>
  )
}

/* Enhanced Skeletons */

function CarouselDesktopSkeleton() {
  return (
    <div className="flex items-center justify-center gap-6 p-4 animate-pulse">
      {/* Thumbnails skeleton */}
      <div className="flex flex-col items-center gap-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="size-16 rounded-xl bg-gray-200 dark:bg-gray-700" />
        ))}
      </div>

      {/* Main image skeleton */}
      <div className="relative flex-1 max-w-md">
        <div className="aspect-square rounded-2xl overflow-hidden">
          <Skeleton className="w-full h-full bg-gray-200 dark:bg-gray-700" />
        </div>
        
        {/* Navigation buttons skeleton */}
        <Skeleton className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600" />
        <Skeleton className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600" />
        
        {/* Counter skeleton */}
        <Skeleton className="absolute top-4 right-4 w-12 h-6 rounded-full bg-gray-400 dark:bg-gray-600" />
      </div>
    </div>
  )
}

function CarouselMobileSkeleton() {
  return (
    <div className="relative w-full h-full bg-gray-100 dark:bg-gray-800 animate-pulse">
      {/* Main content skeleton */}
      <div className="relative aspect-square sm:aspect-video w-full">
        <Skeleton className="w-full h-full bg-gray-200 dark:bg-gray-700" />
        
        {/* Gradient overlay skeleton */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-300/50 to-transparent dark:from-gray-600/50"></div>
      </div>

      {/* Navigation buttons skeleton */}
      <Skeleton className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600" />
      <Skeleton className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600" />

      {/* Pagination dots skeleton */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-gray-400/40 dark:bg-gray-600/40 backdrop-blur-sm px-4 py-2 rounded-full">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton 
            key={index} 
            className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-500" 
          />
        ))}
      </div>

      {/* Counter skeleton */}
      <Skeleton className="absolute top-4 right-4 w-12 h-6 rounded-full bg-gray-400 dark:bg-gray-600" />

      {/* Auto-play indicator skeleton */}
      <div className="absolute top-4 left-4 flex items-center gap-2 bg-gray-400/40 dark:bg-gray-600/40 backdrop-blur-sm px-3 py-1 rounded-full">
        <Skeleton className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-500" />
        <Skeleton className="w-8 h-3 rounded bg-gray-300 dark:bg-gray-500" />
      </div>
    </div>
  )
}