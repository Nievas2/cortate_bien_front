import { Skeleton } from "@/components/ui/skeleton"

const ProfileFormSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

const BasicFormSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

export { ProfileFormSkeleton, BasicFormSkeleton }
