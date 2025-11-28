import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { planSchema } from "@/utils/schemas/planSchema";
import { Plan } from "@/interfaces/Plan";
import { createPlan, updatePlan } from "@/services/PlansService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";
import { CheckCircle2, Loader2 } from "lucide-react";

interface ChangePlanProps {
  plan?: Plan;
  refetch?: Function;
}

export function ChangePlan({ plan, refetch }: ChangePlanProps) {
  const { mutate, isSuccess, isPending, error } = useMutation({
    mutationKey: ["create-plan"],
    mutationFn: (values: any) => {
      return createPlan(values);
    },
    onSuccess: () => {
      if (refetch) return refetch();
    },
  });

  const {
    mutate: update,
    isSuccess: isSuccessUpdate,
    isPending: isPendingUpdate,
    error: errorUpdate,
  } = useMutation({
    mutationKey: ["update-plan"],
    mutationFn: (values: any) => {
      if (plan != undefined) {
        return updatePlan(plan.id, values);
      }
      throw new Error("Plan no encontrado");
    },
    onSuccess: () => {
      if (refetch) return refetch();
    },
  });

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      nombre: plan?.nombre ? plan?.nombre : "",
      descripcion: plan?.descripcion ? plan?.descripcion : "",
      precio: plan?.precio ? plan?.precio.toString() : "0",
      turnosMaximos: plan?.turnosMaximos ? plan?.turnosMaximos.toString() : "0",
      cantDias: plan?.cantDias ? plan?.cantDias.toString() : "0",
      precioPromedio: plan?.precioPromedio ? plan?.precioPromedio : false,
      servicios: plan?.servicios ? plan?.servicios : false,
      barberos: plan?.barberos ? plan?.barberos : false,
      autoActivacion: plan?.autoActivacion ? plan?.autoActivacion : false,
      soportePrioritario: plan?.soportePrioritario
        ? plan?.soportePrioritario
        : false,
      planTipo: plan?.planTipo ? plan.planTipo : "COMPRABLE",
    },
    resolver: zodResolver(planSchema),
  });

  const handleSubmitForm = (data: any) => {
    if (plan != undefined) return update(data);
    mutate(data);
  };

  const isFormDisabled = isPending || isPendingUpdate;

  return (
    <form
      className="flex flex-col w-full gap-6 p-2"
      onSubmit={handleSubmit(handleSubmitForm)}
    >
      {isSuccess || isSuccessUpdate ? (
        <div className="flex flex-col items-center justify-center py-12 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            {plan != undefined ? "¡Plan Actualizado!" : "¡Plan Creado!"}
          </h3>
          <p className="text-gray-400 text-center">
            {plan != undefined
              ? "Los cambios se han guardado correctamente"
              : "El nuevo plan está listo para usar"}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6 w-full">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-white">Nombre del Plan</Label>
              <Input
                type="text"
                placeholder="Ej: Plan Básico"
                {...register("nombre")}
                disabled={isFormDisabled}
                className="input"
              />
              {errors.nombre?.message && (
                <span className="text-xs text-red-500 font-medium">
                  {errors.nombre?.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-white">Tipo de Plan</Label>
              <Controller
                control={control}
                name="planTipo"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isFormDisabled}
                  >
                    <SelectTrigger className="input">
                      <SelectValue placeholder="Seleccione un tipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-main border-white/10 text-white">
                      <SelectItem value="COMPRABLE">Comprable</SelectItem>
                      <SelectItem value="ASIGNABLE">Asignable</SelectItem>
                      <SelectItem value="CANGELABLE">Canjeable</SelectItem>
                      <SelectItem value="GRATIS">Gratis</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.planTipo?.message && (
                <span className="text-xs text-red-500 font-medium">
                  {errors.planTipo?.message as string}
                </span>
              )}
            </div>
          </div>

          {/* Descripción */}
          <div className="flex flex-col gap-2">
            <Label className="text-white">Descripción</Label>
            <Textarea
              placeholder="Describe los beneficios del plan..."
              {...register("descripcion")}
              rows={3}
              disabled={isFormDisabled}
              className="bg-white text-black border-input resize-none"
            />
            {errors.descripcion?.message && (
              <span className="text-xs text-red-500 font-medium">
                {errors.descripcion?.message}
              </span>
            )}
          </div>

          {/* Configuración numérica */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-white">Precio</Label>
              <Input
                type="number"
                placeholder="0.00"
                {...register("precio")}
                disabled={isFormDisabled}
                className="input"
              />
              {errors.precio?.message && (
                <span className="text-xs text-red-500 font-medium">
                  {errors.precio?.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-white">Turnos Máximos</Label>
              <Input
                type="number"
                placeholder="0"
                {...register("turnosMaximos")}
                disabled={isFormDisabled}
                className="input"
              />
              {errors.turnosMaximos?.message && (
                <span className="text-xs text-red-500 font-medium">
                  {errors.turnosMaximos?.message}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-white">Días de Duración</Label>
              <Input
                type="number"
                placeholder="30"
                {...register("cantDias")}
                disabled={isFormDisabled}
                className="input"
              />
              {errors.cantDias?.message && (
                <span className="text-xs text-red-500 font-medium">
                  {errors.cantDias?.message}
                </span>
              )}
            </div>
          </div>

          {/* Switches de características */}
          <div className="flex flex-col gap-3">
            <Label className="text-white mb-1">Características del Plan</Label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Precio Promedio */}
              <Controller
                control={control}
                name="precioPromedio"
                render={({ field }) => (
                  <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-white">
                        Precio Promedio
                      </span>
                      <span className="text-xs text-gray-400">
                        Permite asignar precio promedio
                      </span>
                    </div>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isFormDisabled}
                    />
                  </div>
                )}
              />

              {/* Servicios */}
              <Controller
                control={control}
                name="servicios"
                render={({ field }) => (
                  <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-white">
                        Servicios
                      </span>
                      <span className="text-xs text-gray-400">
                        Permite asignar servicios
                      </span>
                    </div>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isFormDisabled}
                    />
                  </div>
                )}
              />

              {/* Barberos */}
              <Controller
                control={control}
                name="barberos"
                render={({ field }) => (
                  <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-white">
                        Barberos
                      </span>
                      <span className="text-xs text-gray-400">
                        Permite asignar barberos
                      </span>
                    </div>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isFormDisabled}
                    />
                  </div>
                )}
              />

              {/* Auto Activación */}
              <Controller
                control={control}
                name="autoActivacion"
                render={({ field }) => (
                  <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-white">
                        Auto Activación
                      </span>
                      <span className="text-xs text-gray-400">
                        Activar automáticamente
                      </span>
                    </div>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isFormDisabled}
                    />
                  </div>
                )}
              />

              {/* Soporte Prioritario */}
              <Controller
                control={control}
                name="soportePrioritario"
                render={({ field }) => (
                  <div className="sm:col-span-2 flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-white">
                        Soporte Prioritario
                      </span>
                      <span className="text-xs text-gray-400">
                        Acceso a soporte prioritario 24/7
                      </span>
                    </div>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isFormDisabled}
                    />
                  </div>
                )}
              />
            </div>
          </div>

          {/* Mensaje de error */}
          {(error?.message || errorUpdate?.message) && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
              {error?.message || errorUpdate?.message}
            </div>
          )}

          {/* Botón de submit */}
          <Button
            className="w-full mt-2"
            variant="secondary"
            type="submit"
            disabled={isFormDisabled}
          >
            {isFormDisabled ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                {plan ? "Actualizando..." : "Creando..."}
              </span>
            ) : plan ? (
              "Actualizar Plan"
            ) : (
              "Crear Nuevo Plan"
            )}
          </Button>
        </div>
      )}
    </form>
  );
}
