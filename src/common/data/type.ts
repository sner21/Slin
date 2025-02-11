import { z } from "zod";

export const GlobalCarrySchema = z.object({
    currency: z.string(),
});