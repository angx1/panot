import { z } from "zod";

export const UUID = z.uuid();
export const Timestamp = z.iso.datetime(); // ISO 8601
export const IdempotencyKey = z.string().min(10).max(100);

export const ChannelKind = z.enum(["phone", "email", "url", "social"]);
export type ChannelKind = z.infer<typeof ChannelKind>;
