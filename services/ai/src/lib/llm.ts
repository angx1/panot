import { ChatOpenAI } from "@langchain/openai";
import { env } from "../config/env";

export const model = new ChatOpenAI({
  apiKey: env.MODEL_KEY,
  modelName: env.MODEL,
  temperature: 0.2,
});
