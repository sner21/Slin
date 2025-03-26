import { z } from "zod";
import { EffectType, SkillType } from "../skill";
import { ElementType } from "..";
import { EffectsSchema } from "../char/attr";


export const LogsType = z.enum(['tatakai', 'global', 'event', 'status', 'settle'])

export const LogsBasicSchema = z.object({
    id:z.number().default(0),
    timestamp: z.number(),
    round: z.number(),  //回合数
    logs_type: LogsType,
    description: z.string().default(''),
    target: z.object({
        type: z.string(),
        name: z.string(),
        id: z.string(),
    }).optional(),
    source: z.object({
        type: z.string(),
        name: z.string(),
        id: z.string(),
    }).optional(),
})

// import { template } from 'lodash-es'
// template('名字是${value.name}, 血量是${value.stats.hp}')(data);

export const EventSchema = z.object({
    eventId: z.string(),
}).merge(LogsBasicSchema);
export const StatusSchema = z.object({

}).merge(LogsBasicSchema);

//结算日志
export const SettleSchema = z.object({
    roleStatus: z.record(z.object({
        damage: z.number().default(0),
        level: z.number().default(1),
        exp: z.number().default(0), // 当前经验值
    }))
}).merge(LogsBasicSchema);
//全局日志
export const GlobalSchema = z.object({

}).merge(LogsBasicSchema);
// 定义战斗行为记录结构
export const BattleActionSchema = z.object({
    // 基础信息
    skillId: z.string().optional(),          // 使用的技能ID
    skillName: z.string().default("未知"),          // 使用的技能ID
    skillType: SkillType.optional(),         // 技能类型
    elementalBonus: z.number().default(1),      // 元素克制倍率
    // 伤害相关
    damage: z.object({
        hp: z.number().default(0),
        mp: z.number().default(0),
    }),
    cost: z.object({
        hp: z.number().default(0),
        mp: z.number().default(0),
    }),
    isCrit: z.boolean().default(false),          // 是否暴击
    element: ElementType,         // 元素类型
    effectType: EffectType,       // 效果类型（伤害/治疗/护盾等）
    isEvaded: z.boolean().default(false),        // 是否被闪避
    attacker: z.object({
        type: z.string(),
        name: z.string(),
        id: z.string(),
    }),
    defender: z.object({
        type: z.string(),
        name: z.string(),
        id: z.string(),
    }),
    // 额外效果
    effects: z.array(EffectsSchema).optional(),
    // 战斗数据
    sourceHp: z.number().optional(),         // 攻击方血量
    targetHp: z.number().optional(),         // 目标血量
    energyChange: z.number().optional(),  // 能量变化
}).merge(LogsBasicSchema);
export type BattleAction = z.infer<typeof BattleActionSchema>;

// export const LogsDataSchma = z.record(LogsType, z.array(z.union([BattleActionSchema, EventSchema, GlobalSchema, SettleSchema, StatusSchema])))
export const LogsDataSchma = z.object({
    "tatakai": z.array(BattleActionSchema).default([]),
    'global': z.array(GlobalSchema).default([]),
    'event': z.array(EventSchema).default([]),
    'status': z.array(StatusSchema).default([]),
    'settle': z.array(SettleSchema).default([])
}).and(z.record(LogsType, z.array(z.any())))