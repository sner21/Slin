import { z } from 'zod';
import { costTypeSchema, EffectsSchema } from '../char/attr';
import { ElementType, get_svg_uri } from '..';

// 移动所有类型定义到这里

export const SkillType = z.enum(['NORMAL_ATTACK', 'ELEMENTAL_SKILL', 'ELEMENTAL_BURST', 'PASSIVE']);

// 技能目标类型
export const skillType = z.enum([
    'SINGLE',            // 单体
    'MULTI',             // 多目标
    'ALL',               // 全体

]);
export enum targetTypeEnum {
    'ENEMY' = 'ENEMY',               // 敌人
    'SELF' = 'SELF',             // 自身
    'ALLY' = 'ALLY'          // 友方
}
export const targetType = z.nativeEnum(targetTypeEnum).default(targetTypeEnum.ENEMY)

// 技能效果类型
export const EffectType = z.enum([
    'DAMAGE',            // 伤害
    'HEAL',             // 治疗
    'SHIELD',           // 护盾
    'BUFF',             // 增益
    'DEBUFF',            // 减益
    'REGEN',            // 回复
    'DEFAULT'
]);

// 技能数据结构
export const Skill = z.object({
    id: z.string(),
    name: z.string(),
    type: SkillType,
    damageType: z.enum(['physical', 'magic']),
    description: z.string(),
    skillType: skillType,
    targetType: targetType,
    effectType: EffectType,

    uri: z.string().default(get_svg_uri(50, import.meta.url)),
    uri_type: z.enum(["local", "inter"]).optional(),
    multiplier: z.number(),
    cost: costTypeSchema,
    buffs: z.array(z.object({
        buffId: z.string(),
        type: z.enum(['source', 'target']).default('target')
    })).optional(),
    // 冷却时间（回合数）
    cooldown: z.number(),
    // 技能等级
    level: z.number().min(1).max(10),
    // 元素类型
    element: ElementType.optional(),
    // 暴击相关
    critRateBonus: z.number().optional(),      // 技能额外暴击率
    critDmgBonus: z.number().optional(),       // 技能额外暴击伤害
    // 元素相关
    elemMasteryBonus: z.number().optional(),   // 技能元素精通提升
    elemBonusBonus: z.number().optional(),     // 技能元素伤害提升
    // 额外效果
    effects: z.array(EffectsSchema).optional(),
});

// 中英文对照
export const SkillTypeNames = {
    NORMAL_ATTACK: '普通攻击',
    ELEMENTAL_SKILL: '元素战技',
    ELEMENTAL_BURST: '元素爆发',
    PASSIVE: '被动技能'
} as const;

export type Skill = z.infer<typeof Skill>;
export type SkillType = z.infer<typeof SkillType>;
export type ElementType = z.infer<typeof ElementType>;

