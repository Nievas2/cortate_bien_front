import { getCities } from "@/services/CityService"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import Select from "react-select"

const CitySelect = ({
  onChange,
  stateId,
}: {
  onChange: Function
  stateId: number
}) => {
  const { data: cities, refetch } = useQuery({
    queryKey: ["cities"],
    queryFn: () => getCities(stateId),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24,
  })

  const options = cities?.data.map((city: any) => ({
    id: city.id,
    value: city.name,
    label: city.name,
  }))

  useEffect(() => {
    refetch()
  }, [stateId])

  return (
    <div className="flex flex-col gap-2 text-black">
      <Select
        id="city"
        options={options}
        onChange={(e: { id: number } | null) => {
          if (e != null) return onChange(e.id)
        }}
        placeholder="Seleccione una ciudad"
        isSearchable
      />
    </div>
  )
}

export default CitySelect
