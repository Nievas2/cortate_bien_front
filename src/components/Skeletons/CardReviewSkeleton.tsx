import { Skeleton } from "@/components/ui/skeleton"

export function ReviewCardSkeleton() {
  return (
    <div className="flex gap-2 rounded-xl shadow-md bg-gray-main shadow-gray-900 border border-gray-900 w-full p-2">
      <div className="flex flex-col gap-2 w-full">
        {/* Barber name and rating */}
        <div className="flex flex-col items-center justify-between">
          <Skeleton className="h-6 w-3/4 rounded-md bg-gray-700" />

          {/* Stars rating */}
          <div className="flex items-center justify-center gap-2 my-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-5 w-5 rounded-full bg-gray-700" />
            ))}
          </div>
        </div>

        {/* Review text */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full rounded-md bg-gray-700" />
          <Skeleton className="h-4 w-full rounded-md bg-gray-700" />
          <Skeleton className="h-4 w-2/3 rounded-md bg-gray-700" />
        </div>

        {/* Edit button */}
        <Skeleton className="flex items-center justify-end w-full mt-2" />
      </div>
    </div>
  )
}

export function RenderReviewCardSkeletons() {
  return Array.from({ length: 3 }, (_, index) => (
    <ReviewCardSkeleton key={index} />
  ))
}
