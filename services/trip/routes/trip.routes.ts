import { Router } from "express";
import {
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
} from "../controllers/trip.controllers";

const router = Router();

router.get("/", getTrips);
router.get("/:id", getTripById);
router.put("/:id", updateTrip);
router.delete("/:id", deleteTrip);

export default router;
