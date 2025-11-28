export interface Plan {
  id: string;
  nombre: string;
  precio: number;
  descripcion: string;
  turnosMaximos: number;
  cantDias: number;
  precioPromedio: boolean;
  servicios: boolean;
  barberos: boolean;
  autoActivacion: boolean;
  soportePrioritario: boolean;
  planTipo: TypePlanEnum;
}

export enum TypePlanEnum {
  COMPRABLE = "COMPRABLE",
  ASIGNABLE = "ASIGNABLE",
  CANGEABLE = "CANGELABLE",
  GRATIS = "GRATIS",
}
