import { useAuthContext } from "@/contexts/authContext";
import { completeRegistration, getUserById } from "@/services/UserService";
import { useQuery } from "@tanstack/react-query";
import Layout from "./Layout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { getCountries } from "@/services/CountryService";
import CountrySelect from "../dashboard/components/CountrySelect";
import StateSelect from "../dashboard/components/StateSelect";
import CitySelect from "../dashboard/components/CitySelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserSchema } from "@/utils/schemas/userSchema";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import CountryNumberSelect from "../dashboard/components/CountryNumberSelect";
import { decodeJwt } from "@/utils/decodeJwt";
import { setCookieAsync } from "@/hooks/useLogin";
import { Background } from "@/components/ui/background";

export default function ProfilePage() {
  document.title = "Cortate Bien | Perfil";
  const [selectCountryNumber, setSelectCountryNumber] = useState(undefined);
  const [countryId, setCountryId] = useState(undefined);
  const [stateId, setStateId] = useState(undefined);
  const [error, setError] = useState("");
  const location = useLocation();
  const required =
    new URLSearchParams(location.search).get("required") === "true";
  const { authUser, setAuthUser } = useAuthContext();

  const { data: countries } = useQuery({
    queryKey: ["countries"],
    queryFn: getCountries,
    staleTime: 86400000,
    refetchOnWindowFocus: false,
  });

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["get-user-by-id", authUser?.user.sub],
    queryFn: () => authUser && getUserById(authUser.user.sub),
    enabled: !!authUser,
    staleTime: 86400000,
    refetchOnWindowFocus: false,
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    defaultValues: {
      telefono: "",
      ciudad_id: "",
      fechaNacimiento: new Date().toISOString().split("T")[0],
      tipoDeCuenta: "",
    },
    resolver: zodResolver(updateUserSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      if (!selectCountryNumber) {
        setError("Seleccione el prefijo del país.");
        return;
      }
      const res = await completeRegistration({
        ciudad_id: Number(values.ciudad_id),
        telefono: `+${selectCountryNumber}${values.telefono}`,
        fechaNacimiento: values.fechaNacimiento,
        tipoDeCuenta: values.tipoDeCuenta,
      });
      const payload = decodeJwt(res.data.accesToken);
      setAuthUser({ user: payload, token: res.data.accesToken });
      await setCookieAsync("token", res.data.accesToken, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      });
      window.location.href = "/barbers";
    } catch {
      setError("Error al actualizar la información.");
    }
  });

  return (
    <Background>
      <Layout>
        <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
          {/* Personal Info Card */}
          <section className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-200 bg-clip-text text-transparent mb-4">
              Información personal
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {isUserLoading ? (
                <p className="text-center col-span-2">Cargando...</p>
              ) : (
                [
                  ["Nombre", user?.data.nombre],
                  ["Apellido", user?.data.apellido],
                  ["Correo", user?.data.email],
                  ["Teléfono", user?.data.telefono],
                  ["Nacimiento", user?.data.fechaNacimiento.split("T")[0]],
                ].map(([label, value]) => (
                  <div key={label}>
                    <span className="block text-sm uppercase text-gray-500 dark:text-gray-400">
                      {label}
                    </span>
                    <span className="block font-medium text-gray-900 dark:text-white">
                      {value}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Update Info Form */}
          {required && (
            <section className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
              <h2 className="text-2xl font-bold text-center mb-2">
                Completa tu perfil
              </h2>
              <p className="text-sm text-red-500 text-center mb-4">
                Para continuar, completa todos los campos.
              </p>
              <form className="space-y-6" onSubmit={onSubmit}>
                {/* Phone & Prefix */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                  <div>
                    <Label htmlFor="telefono">Teléfono</Label>
                    <div className="mt-1 flex">
                      {Array.isArray(countries?.data) && (
                        <CountryNumberSelect
                          countries={countries.data}
                          onChange={setSelectCountryNumber}
                        />
                      )}
                      <Input
                        id="telefono"
                        {...register("telefono")}
                        placeholder="1234567890"
                      />
                    </div>
                    {errors.telefono && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.telefono.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="fechaNacimiento">Fecha de nacimiento</Label>
                    <Input
                      type="date"
                      id="fechaNacimiento"
                      {...register("fechaNacimiento")}
                      onChange={(e) =>
                        setValue("fechaNacimiento", e.target.value)
                      }
                    />
                    {errors.fechaNacimiento && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.fechaNacimiento.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Location Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label>País</Label>
                    {Array.isArray(countries?.data) ? (
                      <CountrySelect
                        countries={countries.data}
                        onChange={setCountryId}
                      />
                    ) : (
                      <p className="text-sm text-red-500">
                        Error al cargar países
                      </p>
                    )}
                  </div>

                  {countryId && (
                    <div>
                      <Label>Provincia</Label>
                      <StateSelect
                        countryId={countryId}
                        onChange={setStateId}
                      />
                    </div>
                  )}

                  {stateId && (
                    <div>
                      <Label>Ciudad</Label>
                      <CitySelect
                        stateId={stateId}
                        onChange={(id : number) => setValue("ciudad_id", id.toString())}
                      />
                      {errors.ciudad_id && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.ciudad_id.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Account Type */}
                <div>
                  <Label>Tipo de cuenta</Label>
                  <Select
                    onValueChange={(val) => setValue("tipoDeCuenta", val)}
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Selecciona tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BARBERO">Barbero</SelectItem>
                      <SelectItem value="CLIENTE">Cliente</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.tipoDeCuenta && (
                    <p className="mt-1 text-sm text-red-500">
                      El tipo de cuenta es requerido
                    </p>
                  )}
                </div>

                {error && (
                  <p className="text-center text-sm text-red-500">{error}</p>
                )}

                <Button type="submit" className="w-full py-3 rounded-full">
                  Actualizar Perfil
                </Button>
              </form>
            </section>
          )}
        </div>
      </Layout>
    </Background>
  );
}
