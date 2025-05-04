import dotenv from "dotenv";
dotenv.config();

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
