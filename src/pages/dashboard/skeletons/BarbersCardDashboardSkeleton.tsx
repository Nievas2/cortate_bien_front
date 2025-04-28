import { Skeleton } from "@/components/ui/skeleton"

const BarbersCardDashboardSkeleton = () => {
  return (
    <Skeleton className="flex items-center justify-center size-48 rounded-xl relative">
      <Skeleton className="h-8 w-32 bg-gray-200 rounded-full" />
      <Skeleton className="absolute top-2 right-2 size-6 bg-gray-200" />
    </Skeleton>
  )
}

export default BarbersCardDashboardSkeleton

export const RenderBarbersCardDashboardSkeletons = () => {
  return Array.from({ length: 4 }, (_, index) => (
    <BarbersCardDashboardSkeleton key={index} />
  ))
}
