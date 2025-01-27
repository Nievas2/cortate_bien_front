import { Country } from "@/interfaces/Country";
import { useEffect, useState } from "react";
import Select from "react-select";

const CountrySelect = ({
  countries,
  onChange,
}: {
  countries: Country[];
  onChange: Function;
}) => {
  const [options, setOptions] = useState<{ id: number; value: string; label: string }[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const loadOptions = () => {
    setIsLoading(true);
    const itemsPerPage = 20;
    const newCountries = countries.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const newOptions = newCountries.map(country => ({
      id: country.id,
      value: country.name,
      label: country.name,
    }));

    setOptions(prevOptions => [...prevOptions, ...newOptions]);
    setIsLoading(false);
  };

  useEffect(() => {
    loadOptions();
  }, [page]);

  const handleScroll = (event: any) => {
    const bottom = event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight;
    if (bottom && !isLoading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  return (
    <div className="flex flex-col gap-2 text-black">
      <Select
        id="country"
        options={options}
        onChange={(e: { id: number } | null) => {
          if (e != null) return onChange(e.id);
        }}
        placeholder="Seleccione un país"
        isSearchable
        onMenuScrollToBottom={handleScroll}
      />
    </div>
  );
};

export default CountrySelect;