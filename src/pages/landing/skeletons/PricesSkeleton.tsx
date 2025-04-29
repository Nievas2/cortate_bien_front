import { Skeleton } from "@/components/ui/skeleton"

const PricesSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-black-main px-10 py-4 w-full max-w-md">
      {/* Title */}
      <Skeleton className="h-8 w-3/4 rounded-md bg-gray-700" />

      {/* Description */}
      <Skeleton className="h-4 w-full rounded-md bg-gray-700 mt-2" />
      <Skeleton className="h-4 w-2/3 rounded-md bg-gray-700" />

      {/* Price */}
      <div className="text-center my-4">
        <Skeleton className="h-10 w-1/2 mx-auto rounded-md bg-gray-700" />
      </div>

      {/* Features List */}
      <ul className="my-4 space-y-2">
        {[...Array(2)].map((_, i) => (
          <li key={i} className="flex gap-4 items-center">
            <Skeleton className="h-4 w-4 rounded-full bg-gray-700" />
            <Skeleton className="h-4 w-3/4 rounded-md bg-gray-700" />
          </li>
        ))}
      </ul>

      {/* Button */}
      <Skeleton className="h-10 w-full rounded-md bg-gray-700 mt-4" />
    </div>
  )
}

export default PricesSkeleton

export const RenderPricesSkeletons = () => {
  return Array.from({ length: 3 }, (_, index) => <PricesSkeleton key={index} />)
}
