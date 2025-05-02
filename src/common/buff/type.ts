import { z } from 'zod';
import { ElementType } from '..';
import { Effect } from '@tauri-apps/api/window';
import { AbilitySchema, baseDamageSchma, EffectSimple } from '../char/attr';


// Buff/Debuff 类型
export const BuffType = z.enum([
    // 基础属性提升
    'ATTACK_UP',         // 攻击力提升
    'DEFENSE_UP',        // 防御力提升
    'SPEED_UP',          // 速度提升
    'EVASION_UP',        // 闪避率提升
    'CRIT_RATE_UP',      // 暴击率提升
    'CRIT_DMG_UP',       // 暴击伤害提升
    'PENETRATION_UP',    // 护甲穿透提升

    // 元素相关提升
    'ELEM_MASTERY_UP',   // 元素精通提升
    'ELEM_BONUS_UP',     // 元素伤害提升
    'ELEM_RES_UP',       // 元素抗性提升

    // 特殊效果提升
    'LIFESTEAL_UP',      // 生命偷取提升
    'HEALING_BONUS_UP',  // 治疗加成提升
    'SHIELD_STRENGTH_UP',// 护盾强度提升
    'RAGE_BONUS_UP',     // 怒气伤害提升

    // 减益效果
    'ATTACK_DOWN',       // 攻击力降低
    'DEFENSE_DOWN',      // 防御力降低
    'SPEED_DOWN',        // 速度降低
    'ELEM_RES_DOWN',     // 元素抗性降低

    // 持续伤害
    'BURNING',           // 燃烧（火元素）
    'FROZEN',            // 冻结（冰元素）
    'SHOCKED',           // 感电（雷元素）

    // 特殊状态
    'SHIELD',            // 护盾
    'HEALING',           // 持续治疗
    'STUNNED',           // 眩晕
]);

// Buff/Debuff 持续类型
export const BuffDurationType = z.enum([
    'TURNS',             // 回合数
    'PERMANENT',         // 永久
    'OVERLAY',          // 叠加
    'PERMANENT-OVERLAY'             // 永久叠加
]);

// Buff/Debuff 数据结构
export const BuffSchema = z.object({
    id: z.string(),
    name: z.string(),
    // type: BuffType,
    desc: z.string(),
    effects: z.array(EffectSimple).default([]),
    cancelEffects: z.array(EffectSimple).default([]),
    // 持续时间相关
    durationType: BuffDurationType.default('TURNS'),
    duration: z.number().optional(),
    // 叠加相关
    maxStacks: z.number().default(10),  //最大叠加
    // currentStacks: z.number().default(1), //叠加数
    //
    isDebuff: z.boolean().default(false),
    imm_ability: z.record(AbilitySchema.keyof(), z.any()).optional(),
}).merge(baseDamageSchma);

// Buff/Debuff 中英文对照
export const BuffTypeNames = {
    // 基础属性提升
    ATTACK_UP: '攻击力提升',
    DEFENSE_UP: '防御力提升',
    SPEED_UP: '速度提升',
    EVASION_UP: '闪避率提升',
    CRIT_RATE_UP: '暴击率提升',
    CRIT_DMG_UP: '暴击伤害提升',
    PENETRATION_UP: '护甲穿透提升',

    // 元素相关提升
    ELEM_MASTERY_UP: '元素精通提升',
    ELEM_BONUS_UP: '元素伤害提升',
    ELEM_RES_UP: '元素抗性提升',

    // 特殊效果提升
    LIFESTEAL_UP: '生命偷取提升',
    HEALING_BONUS_UP: '治疗加成提升',
    SHIELD_STRENGTH_UP: '护盾强度提升',
    RAGE_BONUS_UP: '怒气伤害提升',

    // 减益效果
    ATTACK_DOWN: '攻击力降低',
    DEFENSE_DOWN: '防御力降低',
    SPEED_DOWN: '速度降低',
    ELEM_RES_DOWN: '元素抗性降低',

    // 持续伤害
    BURNING: '燃烧',
    FROZEN: '冻结',
    SHOCKED: '感电',

    // 特殊状态
    SHIELD: '护盾',
    HEALING: '持续治疗',
    STUNNED: '眩晕'
} as const;

// 导出类型
export type BuffType = z.infer<typeof BuffType>;
export type BuffDurationType = z.infer<typeof BuffDurationType>;
export type Buff = z.infer<typeof BuffSchema>;
