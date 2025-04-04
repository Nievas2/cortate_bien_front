import { useEffect, useState } from "react"
import { type CarouselApi } from "@/components/ui/carousel"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
interface CarouselDesktopProps {
  images: string[]
  isLoading?: boolean
}
const CarouselDesktop = ({ images, isLoading }: CarouselDesktopProps) => {
  const [imageSelected, setImageSelected] = useState(0)
  return isLoading != undefined && isLoading == true ? (
    <CarouselDesktopSkeleton />
  ) : (
    <div className="flex items-center justify-center gap-4 sm">
      <div className="flex flex-col items-center gap-6">
        {images.map((image: any, index: number) => (
          <button
            className={`size-11 ${
              imageSelected === index && "scale-110 ring-2 ring-secondary"
            } hover:scale-125 transition-transform duration-150 cursor-pointer`}
            onClick={() => setImageSelected(index)}
            key={crypto.randomUUID()}
          >
            <img src={image} alt="image of the barber shop" />
          </button>
        ))}
      </div>

      <div className="flex w-full items-center justify-center">
        {<img src={images[imageSelected]} alt="image of the barber shop" />}
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
  console.log(count, current)

  return isLoading != undefined && isLoading == true ? (
    <CarouselMobileSkeleton />
  ) : (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      /* plugins={[
            Autoplay({
              delay: 2000
            })
          ]} */
      setApi={setApi}
      className="w-full h-full"
    >
      <CarouselContent className="flex gap-2">
        {images.map((image) => (
          <CarouselItem key={crypto.randomUUID()}>
            <img
              width={320}
              height={320}
              src={image}
              alt="imagen del producto"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
        {Array.from({ length: count }).map((_, index) => (
          <div
            className={` rounded-2xl size-3 ${index + 1 === current ? "bg-blue-main" : "bg-white"}`}
            key={crypto.randomUUID()}
          />
        ))}
      </div>
    </Carousel>
  )
}

/* Skeletons */

import { Skeleton } from "@/components/ui/skeleton"

function CarouselDesktopSkeleton() {
  return (
    <div className="flex items-center justify-center gap-4 sm">
      <div className="flex flex-col items-center gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="size-11 rounded-md" />
        ))}
      </div>

      <div className="flex w-full items-center justify-center">
        <Skeleton className="w-[300px] h-[300px] rounded-md" />
      </div>
    </div>
  )
}

function CarouselMobileSkeleton() {
  return (
    <div className="relative w-full h-full">
      {/* CarouselContent Skeleton */}
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="shrink-0">
            <Skeleton className="w-[320px] h-[320px] rounded-md" />
          </div>
        ))}
      </div>

      {/* Prev / Next Buttons */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2">
        <Skeleton className="w-8 h-8 rounded-full" />
      </div>
      <div className="absolute right-2 top-1/2 -translate-y-1/2">
        <Skeleton className="w-8 h-8 rounded-full" />
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="w-3 h-3 rounded-full" />
        ))}
      </div>
    </div>
  )
}
