import { BarberGet } from "@/interfaces/Barber";
import { getBarbers } from "@/services/BarberService";
import { useQuery } from "@tanstack/react-query";
import Card from "./components/Card";
import usePaginationBarbers from "@/hooks/barbers/usePaginationBarbers";
import { PaginationBarbers } from "@/components/shared/barbers/PaginationBarbers";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import CitySelect from "../dashboard/components/CitySelect";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import CountrySelect from "../dashboard/components/CountrySelect";
import StateSelect from "../dashboard/components/StateSelect";
import { getCountries } from "@/services/CountryService";
import { useAuthContext } from "@/contexts/authContext";
import { Background } from "@/components/ui/background";

const BarbersPage = () => {
  document.title = "Cortate bien | Barberias";
  const [changeCountry, setChangeCountry] = useState(true);
  const [countryId, setCountryId] = useState<undefined | number>();
  const [stateId, setStateId] = useState<undefined | number>();
  const [city, setCity] = useState<undefined | number>();
  const [order, setOrder] = useState("ASC");
  const [radius, setRadius] = useState(3);
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    { lat: 0, lng: 0 }
  );
  const { authUser } = useAuthContext();
  const { currentPage, totalPages, handlePageChange, setTotalPages } =
    usePaginationBarbers();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["barbers"],
    queryFn: () => {
      if (changeCountry) {
        return getBarbers({
          page: currentPage,
          city: authUser?.user.city_id,
          order: order,
          radius: radius,
          lat: position?.lat ? position.lng : undefined,
          long: position?.lng ? position.lng : undefined,
        });
      }
      return getBarbers({
        page: currentPage,
        city: city,
        order: order,
        radius: radius,
        lat: position?.lat ? position.lat : undefined,
        long: position?.lng ? position.lng : undefined,
      });
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24,
    retry: false,
  });

  const { data: countries, error } = useQuery({
    queryKey: ["countries"],
    queryFn: getCountries,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24,
    retry: false,
  });

  useEffect(() => {
    if (data) {
      setTotalPages(data.data.total_pages);
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [city, changeCountry, radius, position, order, currentPage]);

  function getPosition() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error(error);
        setPosition(null);
      },
      { enableHighAccuracy: true }
    );

    try {
      navigator.geolocation.getCurrentPosition((position) => {
        setPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
      return;
      setPosition(null);
    } catch (error) {
      setPosition(null);
      throw error;
    }
  }

  return (
    <Background>
      <main className="flex flex-col items-center justify-start gap-8 w-full min-h-screen">
        {/* Header Section */}
        <section className="w-full overflow-hidden pepe">
          <div className="relative z-10 flex flex-col gap-6 p-6 md:p-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Barberías
              </h1>
              <p className="text-blue-100 text-lg">
                Encuentra la barbería perfecta cerca de ti
              </p>
              {data?.data.results && (
                <div className="inline-flex items-center gap-2 mt-4 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Icon icon="mdi:store" className="text-blue-200" width={20} />
                  <span className="text-blue-100 font-medium">
                    {data.data.results.length} barberías encontradas
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="w-full max-w-7xl px-4 md:px-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Icon
                icon="mdi:filter-variant"
                className="text-blue-400"
                width={24}
              />
              Filtros de búsqueda
            </h2>

            {/* Location Controls */}
            <div className="flex flex-wrap items-end gap-4 mb-6">
              {changeCountry ? (
                <div className="flex flex-col gap-2">
                  <Label className="text-gray-300 text-sm font-medium">
                    Ubicación actual
                  </Label>
                  <div className="flex items-center gap-3 bg-gray-700/50 px-4 py-3 rounded-lg border border-gray-600">
                    <Icon
                      icon="mdi:map-marker"
                      className="text-blue-400"
                      width={20}
                    />
                    <span className="text-gray-200 font-medium">
                      {authUser?.user.city}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        getPosition();
                        setChangeCountry(false);
                      }}
                      className="ml-2 hover:bg-blue-600/20 hover:text-blue-300 transition-all duration-200"
                      aria-label="Cambiar ubicación"
                    >
                      <Icon
                        icon="ic:baseline-change-circle"
                        width="20"
                        height="20"
                      />
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {position?.lat && position?.lng ? (
                    <div className="flex flex-col gap-2">
                      <Label className="text-gray-300 text-sm font-medium">
                        Ubicación
                      </Label>
                      <div className="flex items-center gap-3 bg-green-700/20 border border-green-600/50 px-4 py-3 rounded-lg">
                        <Icon
                          icon="mdi:crosshairs-gps"
                          className="text-green-400"
                          width={20}
                        />
                        <span className="text-green-200 font-medium">
                          Utilizando ubicación actual
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPosition(null)}
                          className="ml-2 hover:bg-red-600/20 hover:text-red-300 transition-all duration-200"
                        >
                          <Icon icon="mdi:close" width="20" height="20" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-4 items-end">
                      <div className="flex flex-col gap-2 min-w-60">
                        <Label className="text-gray-300 text-sm font-medium">
                          País
                        </Label>
                        {countries && (
                          <CountrySelect
                            countries={countries?.data}
                            onChange={(id: number) => setCountryId(id)}
                          />
                        )}
                        {error && (
                          <span className="text-sm text-red-400 flex items-center gap-1">
                            <Icon icon="mdi:alert-circle" width={16} />
                            Error al cargar países
                          </span>
                        )}
                      </div>

                      {countryId && (
                        <div className="flex flex-col gap-2 min-w-60">
                          <Label className="text-gray-300 text-sm font-medium">
                            Estado / Provincia
                          </Label>
                          <StateSelect
                            countryId={countryId}
                            onChange={(state: number) => setStateId(state)}
                          />
                        </div>
                      )}

                      {stateId && (
                        <div className="flex flex-col gap-2 min-w-60">
                          <Label className="text-gray-300 text-sm font-medium">
                            Ciudad
                          </Label>
                          <CitySelect
                            stateId={stateId}
                            onChange={(city: number) => setCity(city)}
                          />
                        </div>
                      )}

                      <Button
                        variant="ghost"
                        onClick={() => setChangeCountry(true)}
                        className="hover:bg-gray-600/50 hover:text-blue-300 transition-all duration-200"
                      >
                        <Icon icon="lets-icons:back" width="20" height="20" />
                        <span className="ml-2">Volver</span>
                      </Button>
                    </div>
                  )}
                </>
              )}

              {/* Sort Control */}
              <div className="flex flex-col gap-2">
                <Label className="text-gray-300 text-sm font-medium">
                  Ordenar
                </Label>
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (order === "ASC") return setOrder("DESC");
                    setOrder("ASC");
                  }}
                  className="flex items-center gap-2 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600 px-4 py-3 rounded-lg transition-all duration-200"
                >
                  <Icon icon="mdi:sort" className="text-blue-400" width={20} />
                  {order === "ASC" ? (
                    <>
                      <span>Ascendente</span>
                      <Icon
                        icon="formkit:arrowup"
                        width="16"
                        height="16"
                        className="text-blue-400"
                      />
                    </>
                  ) : (
                    <>
                      <span>Descendente</span>
                      <Icon
                        icon="formkit:arrowup"
                        width="16"
                        height="16"
                        className="text-blue-400 rotate-180"
                      />
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Radius Filter */}
            <div className="flex flex-col gap-3">
              <Label className="text-gray-300 text-sm font-medium flex items-center gap-2">
                <Icon icon="mdi:radius" className="text-blue-400" width={20} />
                Radio de búsqueda
              </Label>
              <div className="flex gap-3">
                {[3, 5, 10].map((radiusOption) => (
                  <Button
                    key={radiusOption}
                    variant={radius === radiusOption ? "secondary" : "simple"}
                    disabled={isLoading || radius === radiusOption}
                    onClick={() => setRadius(radiusOption)}
                    className={`transition-all duration-200 ${
                      radius === radiusOption
                        ? "bg-blue-600 hover:bg-blue-500 text-white shadow-md"
                        : "bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600"
                    }`}
                  >
                    {radiusOption} km
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Loading State */}
        {isLoading && (
          <section className="flex items-center justify-center w-full py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
              <p className="text-gray-400 font-medium">Buscando barberías...</p>
            </div>
          </section>
        )}

        {/* Results Grid */}
        {!isLoading && data?.data.results && data.data.results.length > 0 && (
          <section className="w-full max-w-7xl px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 place-items-center">
              {data.data.results.map((barber: BarberGet) => (
                <Card key={barber.id} barber={barber} />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {!isLoading && data?.data.results.length === 0 && (
          <section className="flex flex-col items-center justify-center w-full py-16">
            <div className="text-center max-w-md">
              <div className="mb-6">
                <Icon
                  icon="mdi:store-off"
                  className="text-gray-500 mx-auto"
                  width={80}
                  height={80}
                />
              </div>
              <h3 className="text-2xl font-semibold text-gray-300 mb-3">
                No hay barberías disponibles
              </h3>
              <p className="text-gray-500 leading-relaxed">
                No encontramos barberías en tu área de búsqueda. Intenta ampliar
                el radio o cambiar la ubicación.
              </p>
              <Button
                onClick={() => setRadius(10)}
                className="mt-6 bg-blue-600 hover:bg-blue-500 text-white"
              >
                <Icon icon="mdi:magnify-expand" width={20} className="mr-2" />
                Ampliar búsqueda a 10km
              </Button>
            </div>
          </section>
        )}

        {/* Pagination */}
        {!isLoading && data?.data.results.length !== 0 && (
          <section className="flex items-center justify-center pb-8 w-full">
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <PaginationBarbers
                currentPage={currentPage!}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                disabled={isLoading}
              />
            </div>
          </section>
        )}
      </main>
    </Background>
  );
};

export default BarbersPage;
