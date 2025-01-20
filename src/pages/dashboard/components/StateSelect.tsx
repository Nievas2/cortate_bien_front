import { getStates } from "@/services/State"
import { useQuery } from "@tanstack/react-query"
import Select from "react-select"

const StateSelect = ({
  onChange,
  countryId,
}: {
  onChange: Function
  countryId: number
}) => {
  const { data: states } = useQuery({
    queryKey: ["states"],
    queryFn: () => getStates(countryId),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24,
  })

  const options = states?.data.map((state: any) => ({
    id: state.id,
    value: state.name,
    label: state.name,
  }))

  return (
    <div className="flex flex-col gap-2 text-black">
      <Select
        id="state"
        options={options}
        onChange={(e) => {
          if (e != null) return onChange(e.id!)
        }}
        placeholder="Seleccione un estado / provincia"
        isSearchable
      />
    </div>
  )
}

export default StateSelect
