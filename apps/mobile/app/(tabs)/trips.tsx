import { View, Text, ScrollView } from "react-native";
import { getUserTripsAction } from "@/actions";
import React, { useState, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TripCard from "@/components/trip-card";

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

export default function TripsScreen() {
  const [userTrips, setUserTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setIsLoading(true);
        const trips = (await getUserTripsAction()) as Trip[];
        setUserTrips(trips);
      } catch (error) {
        console.error("Error fetching trips:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#FFF",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: insets.top,
        }}
      >
        <Text>Cargando viajes...</Text>
      </View>
    );
  }

  const handleTripPress = (tripId: string) => {
    console.log("Trip pressed:", tripId);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      <View
        style={{
          marginTop: insets.top + 20,
        }}
        className="w-[90%] ml-10"
      >
        <Text className="text-5xl">Trips</Text>
      </View>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom + 16,
          paddingHorizontal: 16,
        }}
      >
        <View className="flex-row flex-wrap justify-center">
          {userTrips.length > 0 ? (
            userTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onPress={() => handleTripPress(trip.id)}
              />
            ))
          ) : (
            <View className="w-full items-center mt-10">
              <Text>No tienes viajes registrados.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
