import { Request, Response } from "express";
import { getUserTrips } from "../servicies/trip.service";

export const getTrips = async (req: Request, res: Response): Promise<void> => {
  const userId = req.headers["x-user-id"];
  console.log(req.headers);

  if (!userId || typeof userId !== "string") {
    res.status(400).json({ error: "x-user-id header missing" });
    return;
  }

  try {
    const trips = await getUserTrips(userId);
    res.status(200).json(trips);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
