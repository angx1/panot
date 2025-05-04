export interface Location {
  nombre: string;
  latitud: number;
  longitud: number;
}

export interface Trip {
  name: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  description: string;
  localizaciones: Location;
}
