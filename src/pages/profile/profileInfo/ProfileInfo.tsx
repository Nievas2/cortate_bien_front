import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useState } from "react";
import { useAuthContext } from "@/contexts/authContext";
import { getCountries } from "@/services/CountryService";
import { useQuery } from "@tanstack/react-query";
import { completeRegistration, getUserById } from "@/services/UserService";
import { useForm } from "react-hook-form";
import { updateUserSchema } from "@/utils/schemas/userSchema";
import { decodeJwt } from "@/utils/decodeJwt";
import { setCookieAsync } from "@/hooks/useLogin";
import CountryNumberSelect from "@/pages/dashboard/components/CountryNumberSelect";
import CountrySelect from "@/pages/dashboard/components/CountrySelect";
import StateSelect from "@/pages/dashboard/components/StateSelect";
import CitySelect from "@/pages/dashboard/components/CitySelect";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "react-router-dom";

import { motion } from "framer-motion";

export const ProfileInfo = () => {
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

  const userFields = [
    { label: "Nombre", value: user?.data.nombre, icon: "tabler:user" },
    { label: "Apellido", value: user?.data.apellido, icon: "tabler:user" },
    { label: "Correo", value: user?.data.email, icon: "tabler:mail" },
    { label: "Teléfono", value: user?.data.telefono, icon: "tabler:phone" },
    {
      label: "Nacimiento",
      value: user?.data.fechaNacimiento?.split("T")[0],
      icon: "tabler:calendar",
    },
  ];

  return (
    <motion.div
      className="space-y-6 sm:space-y-8 px-1 sm:px-0"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      {/* Personal Info Card */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 sm:p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
            <Icon icon="tabler:id-badge-2" className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">Datos Personales</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {isUserLoading ? (
            <div className="col-span-2 flex items-center justify-center py-8">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
                <span className="text-gray-400">Cargando información...</span>
              </div>
            </div>
          ) : (
            userFields.map(({ label, value, icon }) => (
              <div key={label} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon icon={icon} className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                    {label}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-white font-medium">
                    {value || "No disponible"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Update Info Form */}
      {required && (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3 sm:p-6 shadow-xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-600/20 to-red-600/20 border border-amber-500/20 mb-4">
              <Icon
                icon="tabler:alert-circle"
                className="h-4 w-4 text-amber-400"
              />
              <span className="text-sm font-medium text-amber-400">
                Acción Requerida
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Completa tu Perfil
            </h2>
            <p className="text-red-400 text-sm">
              Para continuar, completa todos los campos requeridos.
            </p>
          </div>

          <form className="space-y-4 sm:space-y-6" onSubmit={onSubmit}>
            {/* Phone & Birth Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="telefono"
                  className="text-white flex items-center gap-2"
                >
                  <Icon icon="tabler:phone" className="h-4 w-4" />
                  Teléfono
                </Label>
                <div className="flex gap-2">
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
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
                {errors.telefono && (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <Icon icon="tabler:alert-circle" className="h-3 w-3" />
                    {errors.telefono.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="fechaNacimiento"
                  className="text-white flex items-center gap-2"
                >
                  <Icon icon="tabler:calendar" className="h-4 w-4" />
                  Fecha de Nacimiento
                </Label>
                <Input
                  type="date"
                  id="fechaNacimiento"
                  {...register("fechaNacimiento")}
                  onChange={(e) => setValue("fechaNacimiento", e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                />
                {errors.fechaNacimiento && (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <Icon icon="tabler:alert-circle" className="h-3 w-3" />
                    {errors.fechaNacimiento.message}
                  </p>
                )}
              </div>
            </div>

            {/* Location Selectors */}
            <div className="space-y-3 sm:space-y-4">
              <Label className="text-white flex items-center gap-2">
                <Icon icon="tabler:map-pin" className="h-4 w-4" />
                Ubicación
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300 text-sm">País</Label>
                  {Array.isArray(countries?.data) ? (
                    <CountrySelect
                      countries={countries.data}
                      onChange={setCountryId}
                    />
                  ) : (
                    <p className="text-red-400 text-sm">
                      Error al cargar países
                    </p>
                  )}
                </div>

                {countryId && (
                  <div className="space-y-2">
                    <Label className="text-gray-300 text-sm">Provincia</Label>
                    <StateSelect countryId={countryId} onChange={setStateId} />
                  </div>
                )}

                {stateId && (
                  <div className="space-y-2">
                    <Label className="text-gray-300 text-sm">Ciudad</Label>
                    <CitySelect
                      stateId={stateId}
                      onChange={(id: number) =>
                        setValue("ciudad_id", id.toString())
                      }
                    />
                    {errors.ciudad_id && (
                      <p className="text-red-400 text-sm flex items-center gap-1">
                        <Icon icon="tabler:alert-circle" className="h-3 w-3" />
                        {errors.ciudad_id.message}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Account Type */}
            <div className="space-y-2">
              <Label className="text-white flex items-center gap-2">
                <Icon icon="tabler:user-cog" className="h-4 w-4" />
                Tipo de Cuenta
              </Label>
              <Select onValueChange={(val) => setValue("tipoDeCuenta", val)}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Selecciona el tipo de cuenta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BARBERO">
                    <div className="flex items-center gap-2">
                      <Icon icon="tabler:scissors" className="h-4 w-4" />
                      Barbero
                    </div>
                  </SelectItem>
                  <SelectItem value="CLIENTE">
                    <div className="flex items-center gap-2">
                      <Icon icon="tabler:user" className="h-4 w-4" />
                      Cliente
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.tipoDeCuenta && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <Icon icon="tabler:alert-circle" className="h-3 w-3" />
                  El tipo de cuenta es requerido
                </p>
              )}
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-red-400 text-center flex items-center justify-center gap-2">
                  <Icon icon="tabler:alert-circle" className="h-4 w-4" />
                  {error}
                </p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-200 hover:shadow-lg"
            >
              <Icon icon="tabler:check" className="h-4 w-4 mr-2" />
              Actualizar Perfil
            </Button>
          </form>
        </div>
      )}
    </motion.div>
  );
};
