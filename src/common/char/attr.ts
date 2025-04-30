import { string, z } from "zod";

export const costType = {
    mp: z.number().default(0),     // 能量消耗
    hp: z.number().default(0),         // 生命消耗
    rage: z.number().optional(),       // 怒气消耗
}
export const EventEffectType = z.enum([
    "increase",
    "decrease",
    "push",
    "assign",
    "splice",
    "equal",
    "multiply",
    "max"
]);
export const CompareOperator = z.enum([
    'EQ',  // 等于 (Equal)
    'NE',  // 不等于 (Not Equal)
    'GT',  // 大于 (Greater Than)
    'GE',  // 大于等于 (Greater or Equal)
    'LT',  // 小于 (Less Than)
    'LE',  // 小于等于 (Less or Equal)
]);

export const targetSchema = z.enum(['self', 'target', 'global']).default('target')
// 定义检查条件的结构
export const ConditionSchema = z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    desc: z.string().optional(),
    target: targetSchema,
    operator: CompareOperator.optional(),
    value: z.any(),
    targetId: z.string().optional(),
    attr: z.string(),
    path: z.string().default("").refine((value) => !(value in ['at'])),
});
export const EffectsSchema = z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    desc: z.string().optional(),
    isBuff: z.boolean().default(false),
    target: targetSchema,
    path: z.string().default("").refine((value) => !(value in ['at', 'id'])),
    // 赋值路径
    attr: z.string().default(""),
    value: z.any(),
    probability: z.number().default(100), // 触发概率(%)
    //数组查找用
    find: z.object({
        attr: z.string(),
        value: z.any()
    }).optional(),
    duration: z.number().default(0),
    sourceId: z.string().optional(),          // 攻击方ID
    targetId: z.string().optional(),
    conditions: z.array(z.union([ConditionSchema, z.object({
        id: z.string(),
        replace: ConditionSchema.optional()
    })])).optional(),
    operator: EventEffectType,
})
export const EffectSimple = z.union([EffectsSchema, z.object({
    id: z.string(),
    replace: EffectsSchema.optional()
})])
export type effectsSchema = z.infer<typeof EffectsSchema>;
export const costTypeSchema = z.object({
    mp: z.number().default(0),     // 能量消耗
    hp: z.number().default(0),         // 生命消耗
    rage: z.number().optional(),       // 怒气消耗
}).default({})


export const AbilitySchema = z.object({
    // 基础属性
    hp: z.number().default(100),
    mp: z.number().default(100),
    attack: z.number().default(1),
    defense: z.number().default(1),
    crit_rate: z.number().default(0), //暴击率
    crit_dmg: z.number().default(100),//暴伤
    evasion: z.number().default(0),
    speed: z.number().default(50),
    shield: z.number().default(1),
    hp_re: z.number().default(1),        // 生命回复
    mp_re: z.number().default(1),    // 能量回复
    // 战斗属性
    penetration: z.number().default(0),
    lifesteal: z.number().optional(),
    cooldown_re: z.number().default(0), // 冷却缩减
    life_count: z.number().default(1),
    // 元素属性
    elem_mastery: z.number().optional(),
    elem_bonus: z.number().default(0),

    // 抗性属性
    fire_res: z.number().default(0),
    ice_res: z.number().default(0),
    lightning_res: z.number().default(0),

    // 特殊属性
    rage_bonus: z.number().default(0),
    shield_strength: z.number().default(0),
    healing_bonus: z.number().default(0),
    //隐藏
    reborn: z.number().default(0), //复活轮数
    find_gap: z.number().default(3), //索敌间隔
});
export const CarryBuffSchema = z.record(z.object({
    id: z.string(),
    duration: z.number().optional(),
    count: z.number().default(1),
    self: z.object({
        type: z.number(),
        name: z.string(),
        id: z.string(),
    }).optional(),
}))
// import { boss_attack } from "../tatakai";
// Boss状态记录
export const BossStateSchema = z.object({
    id: z.string(),
    name: z.string(),

    // 基础属性
    maxHp: z.number(),
    currentHp: z.number(),

    // 当前回合的伤害统计
    currentTurnDamage: z.object({
        total: z.number(),
        details: z.array(z.object({
            playerId: z.number(),
            damage: z.number(),
            timestamp: z.number()
        }))
    }),

    // 战斗统计
    battleStats: z.object({
        totalDamage: z.number(),          // 总伤害
        topDamagePlayerId: z.number(),    // 最高伤害玩家
        topDamage: z.number(),            // 最高伤害值
        turnCount: z.number(),            // 回合数
    })
});

