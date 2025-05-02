import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

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

interface TripCardProps {
  trip: Trip;
  onPress?: () => void;
}

const TripCard: React.FC<TripCardProps> = ({ trip, onPress }) => {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      className="w-[90%] mb-4 p-3 border border-gray-200 rounded-xl bg-white"
    >
      <Text className="font-semibold text-base mb-1">{trip.nombre}</Text>
      <Text className="text-sm text-gray-600 mb-2" numberOfLines={2}>
        {trip.descripcion}
      </Text>
      <Text className="text-xs text-gray-500 mb-1">
        {trip.localizacion.nombre}
      </Text>
      <Text className="text-xs text-gray-500">
        {formatDate(trip.fecha_inicio)} - {formatDate(trip.fecha_fin)}
      </Text>
    </TouchableOpacity>
  );
};

export default TripCard;
