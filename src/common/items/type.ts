import { z } from "zod";
import { EffectSimple } from "../char/attr";

export const ItemBaseSchema = z.object({
    id: z.string(),
    name: z.string(),
    effects: z.array(EffectSimple).default([]),
    icon: z.string(),
    type: z.enum(['medic', 'skill_book']),
    level: z.number().default(1),
    desc: z.string().default(""),
    cost: z.number().default(1),
    cls: z.enum(["ITEM", "EQUIP"]).default('ITEM'),
    rarity: z.number().min(1).max(5).default(1),
    buffs: z.array(z.object({
        id: z.string(),
        type: z.enum(['self', 'target']).default('target')
    })).optional(),
    // expiration  //保质期
})
export type ItemBaseSchema = z.infer<typeof ItemBaseSchema>
