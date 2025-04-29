import { z } from 'zod';
import type { Character } from '../char/types';
import type { Equipment } from '../equip';
import { ConditionSchema,CompareOperator, EffectSimple, EffectsSchema, EventEffectType, targetSchema } from '../char/attr';

// 事件类型枚举
export const EventType = z.enum([
    'BATTLE',          // 战斗
    'TREASURE',        // 宝箱
    'SHOP',           // 商店
    'LEVEL_UP',       // 升级
    'EQUIPMENT_CHANGE', // 装备变更
    'STAT_CHANGE',     // 属性变更
    'SKILL_LEARN',     // 学习技能
    'BUFF',           // 增益效果
    'DEBUFF',         // 减益效果
    'STORY',          // 剧情事件
]);

export type ConditionType= z.infer<typeof ConditionSchema>
// 事件数据结构
export const EventData = z.object({
    id: z.string(),
    type: EventType,
    name: z.string(),
    description: z.string(),
    effects: z.array(EffectSimple).default([]),
    probability: z.number().optional().default(100), //触发概率
    // conditionType: z.union([z.enum(['all']),targetSchema]).default('all'),
    buffs: z.any().optional(),
    conditions: z.array(ConditionSchema).optional(),
    hidden: z.boolean().default(false)
});
// 检查函数
export function ConditionOp(condition: z.infer<typeof ConditionSchema>, value: number): boolean {
    switch (condition.operator) {
        case 'EQ': return value === condition.value;
        case 'NE': return value !== condition.value;
        case 'GT': return value > condition.value;
        case 'GE': return value >= condition.value;
        case 'LT': return value < condition.value;
        case 'LE': return value <= condition.value;
        default: return false;
    }
}
export type EventType = z.infer<typeof EventType>;
export type EventEffectType = z.infer<typeof EventEffectType>;
export type EventData = z.infer<typeof EventData>; 