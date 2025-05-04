export interface Location {
  name: string;
  latitude: number;
  longitude: number;
}

export interface Trip {
  name: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  description: string;
  location: Location;
}
