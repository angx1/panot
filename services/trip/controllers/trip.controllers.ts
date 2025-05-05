import { Request, Response } from "express";
import {
  getUserTripsFromDB,
  getTripByIdFromDB,
  updateTripFromDB,
  deleteTripFromDB,
  createTripInDB,
} from "../servicies/trip.service";

export const getTrips = async (req: Request, res: Response): Promise<void> => {
  const userId = req.headers["x-user-id"];

  if (!userId || typeof userId !== "string") {
    res.status(400).json({ error: "x-user-id header missing" });
    return;
  }

  try {
    const trips = await getUserTripsFromDB(userId);
    res.status(200).json(trips);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getTripById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.headers["x-user-id"];
  const tripId = req.params.id;
  if (!userId || typeof userId !== "string") {
    res.status(400).json({ error: "x-user-id header missing" });
    return;
  }
  try {
    const trip = await getTripByIdFromDB(userId, tripId);
    res.status(200).json(trip);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTrip = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.headers["x-user-id"];
  const tripId = req.params.id;
  const updates = req.body;
  if (!userId || typeof userId !== "string") {
    res.status(400).json({ error: "x-user-id header missing" });
    return;
  }

  try {
    await updateTripFromDB(userId, tripId, updates);
    res.status(200).json({ message: "Trip updated successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTrip = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.headers["x-user-id"];
  const tripId = req.params.id;
  if (!userId || typeof userId !== "string") {
    res.status(400).json({ error: "x-user-id header missing" });
    return;
  }
  try {
    await deleteTripFromDB(userId, tripId);
    res.status(200).json({ message: "Trip deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createTrip = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("tripData");
  const userId = req.headers["x-user-id"] as string;
  const tripData = req.body;
  console.log(tripData);

  if (!tripData) {
    res.status(400).json({ error: "trip information is missing" });
    return;
  }

  try {
    await createTripInDB(userId, tripData);
    res.status(200).json({ message: "Trip created successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
