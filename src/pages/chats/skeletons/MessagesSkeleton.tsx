import { Skeleton } from "@/components/ui/skeleton"

export const MessagesSkeleton = ({ index }: { index: number }) => {
  // Alterna entre mensaje enviado y recibido
  const isSent = index % 2 === 0
  return (
    <div className={`flex ${isSent ? "justify-end" : "justify-start"}`}>
      <Skeleton className={`rounded-l h-16 w-48 flex flex-col gap-1 p-1`}>
        <Skeleton className="w-40 h-12 bg-gray-500"/>
        <Skeleton
          className={`rounded-md h-4 w-10 bg bg-gray-500  ${
            !isSent ? "self-start" : "self-end"
          }`} />
      </Skeleton>
    </div>
  )
}

export const renderSkeletonMessages = () => {
  return (
    <div className="flex flex-col gap-3 w-full h-full">
      {Array.from({ length: 8 }).map((_, index) => (
        <MessagesSkeleton index={index} key={crypto.randomUUID()} />
      ))}
    </div>
  )
}
