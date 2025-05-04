import { Router } from "express";
import { getTrips } from "../controllers/trip.controllers";

const router = Router();

router.get("/", getTrips);

export default router;
