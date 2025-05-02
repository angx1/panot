import dotenv from "dotenv";
dotenv.config();

console.log("Trip Service Target:", process.env.TRIP_SERVICE); // Debug

export interface RouteConfig {
  path: string;
  target: string;
}

export const routeTable: RouteConfig[] = [
  {
    path: "/trips",
    target: process.env.TRIP_SERVICE!,
  },
];
