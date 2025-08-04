import { PlannerResponse } from "@panot/types";
import { model } from "./llm";
import { schemaWithMetadata } from "../utils/plannerSchema";
import { findContactTool } from "../utils/plannerHelpers";
import { storePlan } from "./storing";

const planner = model.withStructuredOutput(schemaWithMetadata);

export async function planActions(transcript: string) {
  const contactSearch = await findContactTool();
  const phase1 = await model.invoke([
    {
      role: "system",
      content: `Panot planner: Search contacts using find_contact tool. Extract relevant contact details from 
      transcript and find potential matches in database. Focus ONLY on unique identifying information: full names, 
      email addresses, and phone numbers mentioned. Do NOT match contacts based on shared interests, hobbies, 
      locations or other non-identifying characteristics. A match should only be considered if there is a high 
      confidence match between the information. 
      If there is any ambiguity or only partial matches, treat it as a new distinct contact. But if for example the 
      transcript mentions "John Doe" and the database has a contact with that name, do not create a new contact.
      Plase this is SUPER IMPORTANT: as you take the information of the contact keep it's id intact from how it was before`,
    },
    {
      role: "user",
      content: `Transcript: """${transcript}""" Contact search results with matched contact's id: ${JSON.stringify(
        contactSearch
      )}`,
    },
  ]);

  const phase2 = await planner.invoke([
    {
      role: "system",
      content: `Panot planner: Return JSON matching schema. Available actions:
                create_contact: New contact entry
                update_contact: Modify existing contact add the matched id of type uuid to the payload
                delete_contact: Remove specified contact add the matched id of type uuid to the payload

                Process:
                1. Use the content provided to check existence (search by name/email/phone)
                2. If match found: update_contact with existing ID add the matched id of type uuid to the payload
                3. If no match: create_contact
                4. If deletion requested: delete_contact add the matched id of type uuid to the payload`,
    },
    { role: "user", content: String(phase1.content ?? phase1) },
  ]);
  const plan: PlannerResponse = {
    actions: phase2.actions,
    transcript,
  };

  return await storePlan(plan);
}
