import { Country } from "@/interfaces/Country"
import { useEffect, useState } from "react"
import Select from "react-select"

const CountryNumberSelect = ({
  countries,
  onChange,
}: {
  countries: Country[]
  onChange: Function
}) => {
  const [options, setOptions] = useState<
    { id: number; value: string; label: string; phonecode: string }[]
  >([])
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const itemsPerPage = 20
  const loadOptions = () => {
    setIsLoading(true)
    const newCountries = countries.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    )

    const newOptions = newCountries.map((country) => ({
      id: country.id,
      value: country.phonecode, // Cambiado a phonecode
      label: "+" + country.phonecode, // Cambiado a phonecode
      phonecode: country.phonecode,
    }))

    setOptions((prevOptions) => [...prevOptions, ...newOptions])
    setIsLoading(false)
  }

  useEffect(() => {
    loadOptions()
  }, [])

  const handleScroll = (event: any) => {
    const bottom =
      event.target.scrollHeight - event.target.scrollTop ===
      event.target.clientHeight
    if (bottom && !isLoading) {
      setPage((prevPage) => prevPage + 1)
    }
  }

  function handleSearch(value: string) {
    setIsLoading(true)
    const filteredOptions = countries.filter((option) => {
      return option.phonecode.toLowerCase().includes(value.toLowerCase())
    })
    setOptions(
      filteredOptions.map((option) => ({
        id: option.id,
        value: option.phonecode, // Cambiado a phonecode
        label: "+" + option.phonecode, // Cambiado a phonecode
        phonecode: option.phonecode,
      }))
    )
    setIsLoading(false)
  }

  return (
    <div className="flex flex-col gap-2 text-black">
      <Select
        id="countryNumber"
        className="w-[120px]"
        options={options}
        onChange={(e: { id: number; phonecode: string } | null) => {
          if (e != null) return onChange(e.phonecode)
        }}
        placeholder="+54"
        onInputChange={handleSearch}
        isSearchable
        onMenuScrollToBottom={handleScroll}
      />
    </div>
  )
}

export default CountryNumberSelect
