import { z } from "zod";
import { EffectsSchema } from "../char/attr";

export const ItemBaseSchema = z.object({
    itemId: z.string(),
    name: z.string(),
    effects: z.array(EffectsSchema).default([]),
    icon: z.string(),
    type: z.enum(['medic']),
    description: z.string().default(""),
    buffs: z.array(z.object({
        buffId: z.string(),
        type: z.enum(['source', 'target']).default('target')
    })).optional(),
    // expiration  //保质期
})
export type ItemBaseSchema = z.infer<typeof ItemBaseSchema>
