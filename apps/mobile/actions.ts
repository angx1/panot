import { supabase } from "@/lib/supabase";

export const signInAction = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    return {
      error: error.message,
      success: false,
    };
  }

  return {
    error: null,
    success: true,
  };
};

export const signOutAction = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    return {
      error: error.message,
      success: false,
    };
  }
  return {
    error: null,
    success: true,
  };
};

export const signUpAction = async ({
  nombre,
  apellido,
  email,
  password,
}: {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
}) => {
  try {
    if (!email || !password) {
      return {
        success: false,
        message: "Email and password are required",
      };
    }

    if (!nombre) {
      return {
        success: false,
        message: "Nombre is required",
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre: nombre,
          apellidos: apellido,
        },
      },
    });

    if (error) {
      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message:
        "Thanks for signing up! Please check your email for a verification link.",
    };
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred during sign up",
    };
  }
};

export const createTripAction = async (tripData: {
  name: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  description: string;
  location: {
    name: string;
    latitude: number;
    longitude: number;
  };
}) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("User not authenticated");
    return { error: "User not authenticated" };
  }

  const { data: existingLocation, error: locationError } = await supabase
    .from("localizaciones")
    .select("id")
    .eq("nombre", tripData.location.name)
    .single();

  let locationId;

  if (locationError && !existingLocation) {
    const { data: newLocation, error: createLocationError } = await supabase
      .from("localizaciones")
      .insert([
        {
          nombre: tripData.location.name,
          latitud: tripData.location.latitude,
          longitud: tripData.location.longitude,
        },
      ])
      .select()
      .single();

    if (createLocationError) {
      console.error("Error creating location:", createLocationError);
      return { error: "Failed to create location" };
    }

    locationId = newLocation.id;
  } else {
    locationId = existingLocation.id;
  }

  const { data: trip, error } = await supabase.from("viajes").insert([
    {
      nombre: tripData.name,
      fecha_inicio: tripData.startDate,
      fecha_fin: tripData.endDate,
      descripcion: tripData.description,
      usuario_id: user.id,
      localizacion_id: locationId,
    },
  ]);
  if (error) {
    console.error(error.code + " " + error.message);
    return { error: error.message };
  }

  return { success: true };
};

export const removeTripAction = async (tripId: string) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("User not authenticated");
    return { error: "User not authenticated" };
  }

  const { data: trip, error: tripError } = await supabase
    .from("viajes")
    .select("*")
    .eq("id", tripId)
    .eq("usuario_id", user.id)
    .single();

  if (tripError || !trip) {
    console.error("Trip not found or unauthorized");
    return { error: "Trip not found or unauthorized" };
  }

  const { error: deleteError } = await supabase
    .from("viajes")
    .delete()
    .eq("id", tripId);

  if (deleteError) {
    console.error(deleteError.code + " " + deleteError.message);
    return { error: deleteError.message };
  }

  return { success: true };
};

export const getUserTripsAction = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data: trips, error } = await supabase
    .from("viajes")
    .select(
      `
      *,
      localizaciones (
        id,
        nombre,
        latitud,
        longitud
      )
    `
    )
    .eq("usuario_id", user.id);

  if (error) {
    console.error("Error fetching trips:", error);
    return [];
  }

  // Transform the data to match the expected structure
  const transformedTrips = trips.map((trip) => ({
    ...trip,
    localizacion: trip.localizaciones,
  }));

  return transformedTrips;
};

export const getNumberOfUserTripsAction = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { count: 0, trips: [] };
  }

  const {
    data: trips,
    count,
    error,
  } = await supabase
    .from("viajes")
    .select("*, localizaciones (*)", { count: "exact" })
    .eq("usuario_id", user.id);

  if (error) {
    console.error("Error fetching trips and count:", error);
    return { count: 0, trips: [] };
  }

  // Transform the data to match the expected structure
  /*const transformedTrips = trips.map((trip) => ({
    ...trip,
    localizacion: trip.localizaciones,
  }));

  return { count: count || 0, trips: transformedTrips };*/
  return count;
};

export const getTripAction = async (tripId: string) => {
  const { data: trip, error } = await supabase
    .from("viajes")
    .select(
      `
      *,
      localizaciones (
        id,
        nombre,
        latitud,
        longitud
      )
    `
    )
    .eq("id", tripId)
    .single();
  if (error) {
    console.error("Error fetching trip:", error);
    return null;
  }
  const transformedTrip = {
    ...trip,
    localizacion: trip.localizaciones,
  };
  return transformedTrip;
};

export const createExpenseAction = async (expenseData: {
  amount: number;
  currency: string;
  type: string;
  businessName: string;
  taxId: string;
  viajeId: string;
}) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("User not authenticated");
    return { error: "User not authenticated" };
  }

  const { data: existingBusiness, error: businessError } = await supabase
    .from("comercios")
    .select("id")
    .eq("cuit_rfc_nit", expenseData.taxId)
    .single();

  let businessId;

  if (businessError && !existingBusiness) {
    const { data: newBusiness, error: createBusinessError } = await supabase
      .from("comercios")
      .insert([
        {
          nombre: expenseData.businessName,
          cuit_rfc_nit: expenseData.taxId,
        },
      ])
      .select()
      .single();

    if (createBusinessError) {
      console.error("Error creating business:", createBusinessError);
      return { error: "Failed to create business" };
    }

    businessId = newBusiness.id;
  } else {
    businessId = existingBusiness.id;
  }

  const { data, error } = await supabase
    .from("gastos")
    .insert([
      {
        viaje_id: expenseData.viajeId,
        monto_total: expenseData.amount,
        moneda: expenseData.currency,
        usuario_id: user.id,
        categoria: expenseData.type,
        comercio_id: businessId,
      },
    ])
    .select();

  if (error) {
    console.error("Error creating expense:", error);
    return { error: "Failed to create expense" };
  }

  return { success: true };
};

export const getTripExpenses = async (tripId: string) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data: expenses, error } = await supabase
    .from("gastos")
    .select(
      `
      *,
      comercios (
        nombre,
        cuit_rfc_nit
      )
    `
    )
    .eq("viaje_id", tripId);

  if (error) {
    console.error("Error fetching trips:", error);
    return [];
  }

  return expenses;
};

export const getExpenses = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data: expenses, error } = await supabase.from("gastos").select(`
      *,
      comercios (
        nombre,
        cuit_rfc_nit
      ),
      viajes (
        id,
        nombre,
        fecha_inicio,
        fecha_fin,
        descripcion
      )
    `);

  if (error) {
    console.error("Error fetching expenses:", error);
    return [];
  }

  return expenses;
};
