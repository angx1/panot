import { ContactCreate, ContactUpdate, Contact, UUID } from "@panot/types";
import { PlannerResponse } from "@panot/types";
import type { z } from "zod";
import { getSbClient } from "../lib/supabase";
import { getAuth } from "../utils/requestContext";
import { jwtDecode } from "jwt-decode";

export async function storePlan(plan: z.infer<typeof PlannerResponse>) {
  const authHeader = getAuth();
  const jwt = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;
  const { sub: userId } = jwtDecode(jwt!) as { sub: string };

  try {
    const sb = getSbClient(authHeader);

    const { data: job, error } = await sb
      .from("jobs")
      .insert({
        transcription: plan.transcript,
        created_by: userId,
      })
      .select("*")
      .single();

    if (error) throw error;

    await Promise.all(
      plan.actions.map((action) =>
        sb.from("actions").insert({
          job_id: job.job_id ?? job.id,
          type: action.type,
          payload: action.payload,
          created_by: userId,
        })
      )
    );

    return { success: true };
  } catch (error) {
    console.error("Error storing plan:", error);
    return { success: false, error };
  }
}
