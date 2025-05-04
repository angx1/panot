import { Router } from "express";
import {
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  createTrip,
} from "../controllers/trip.controllers";

const router = Router();

router.get("/", getTrips);
router.get("/:id", getTripById);
router.put("/:id", updateTrip);
router.delete("/:id", deleteTrip);
router.post("/", createTrip);

export default router;
