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
  {
    path: "/notes",
    target: process.env.NOTE_SERVICE!,
  },
  {
    path: "/contacts",
    target: process.env.CONTACT_SERVICE!,
  },
];
