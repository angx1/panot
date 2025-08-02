import { PlannerResponse } from "@panot/types"; // TODO
import { model } from "./llm";
import { schemaWithMetadata } from "../utils/plannerSchema";
import { findContactTool } from "../utils/plannerHelpers";

const planner = model.withStructuredOutput(schemaWithMetadata);

export async function planActions(transcript: string) {
  const contactSearch = await findContactTool();
  const phase1 = await model.invoke([
    {
      role: "system",
      content: `Panot planner: Search contacts using find_contact tool. Extract relevant contact details from transcript and find potential matches in database. Focus on names, emails, and phone numbers mentioned.`,
    },
    {
      role: "user",
      content: `Transcript: """${transcript}""" Contact search results: ${JSON.stringify(
        contactSearch
      )}`,
    },
  ]);

  const phase2 = await planner.invoke([
    {
      role: "system",
      content: `Panot planner: Return JSON matching schema. Available actions:
                create_contact: New contact entry
                update_contact: Modify existing contact
                delete_contact: Remove specified contact

                Process:
                1. Use the content provided to check existence (search by name/email/phone)
                2. If match found: update_contact with existing ID
                3. If no match: create_contact
                4. If deletion requested: delete_contact`,
    },
    { role: "user", content: String(phase1.content ?? phase1) },
  ]);

  return phase2;
}
