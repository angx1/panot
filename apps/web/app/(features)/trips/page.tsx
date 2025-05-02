import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import {
  NewTripButton,
  NewTripContextMenu,
} from "./_components/new-trip-creator";
import TripCard from "./_components/trip-card";
import { getUserTripsAction } from "@/app/actions";

type Trip = {
  id: string;
  nombre: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  created_at: string;
  updated_at: string;
  localizacion: {
    id: string;
    nombre: string;
    latitud: number;
    longitud: number;
  };
  [key: string]: any;
};

export default async function TripsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const userTrips = (await getUserTripsAction()) as Trip[];

  return (
    <NewTripContextMenu>
      <div className="mx-auto flex flex-col w-full gap-8">
        <div className="flex-1 w-full flex flex-row justify-start gap-12">
          <NewTripButton />
        </div>
        {!userTrips || userTrips.length === 0 ? (
          <div className="flex items-center justify-center h-[50vh] border border-dashed rounded-md">
            <span className="text-gray-500 text-sm font-mono">
              No trips found, start by creating a new one.
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {userTrips.map((trip) => (
              <TripCard
                key={trip.id}
                id={trip.id}
                nombre={trip.nombre}
                descripcion={trip.descripcion}
                fecha_inicio={trip.fecha_inicio}
                fecha_fin={trip.fecha_fin}
                created_at={trip.created_at}
                updated_at={trip.updated_at}
                localizacion={trip.localizacion}
              />
            ))}
          </div>
        )}
      </div>
    </NewTripContextMenu>
  );
}
