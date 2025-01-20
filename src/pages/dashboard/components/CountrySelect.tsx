import { Country } from "@/interfaces/Country"
import Select from "react-select"

const CountrySelect = ({
  countries,
  onChange,
}: {
  countries: Country[]
  onChange: Function
}) => {
  const options = countries.map((country) => ({
    id: country.id,
    value: country.name,
    label: country.name,
  }))

  return (
    <div className="flex flex-col gap-2 text-black">
      <Select
        id="country"
        options={options}
        onChange={(e) => {
          if (e != null) return onChange(e.id)
        }}
        placeholder="Seleccione un país"
        isSearchable
      />
      
    </div>
  )
}

export default CountrySelect
