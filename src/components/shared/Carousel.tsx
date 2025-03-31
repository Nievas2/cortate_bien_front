import { useEffect, useState } from "react"
import { type CarouselApi } from "@/components/ui/carousel"
interface CarouselDesktopProps {
  images: string[]
}
const CarouselDesktop = ({ images }: CarouselDesktopProps) => {
  const [imageSelected, setImageSelected] = useState(0)
  return (
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

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
interface CarouselMobileProps {
  images: string[]
}
export const CarouselMobile = ({ images }: CarouselMobileProps) => {
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

  return (
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
