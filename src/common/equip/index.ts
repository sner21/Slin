import { z } from 'zod';

// 装备类型枚举
export const EquipType = z.enum([
    'MAIN_HAND',   // 主手武器
    'OFF_HAND',    // 副手武器
    'HELMET',      // 头盔
    'ARMOR',       // 护甲
    'GAUNTLETS',   // 护手
    'GREAVES',     // 护腿
    'BOOTS',       // 靴子
    'NECKLACE',    // 项链
    'RING',        // 戒指
    'BELT',        // 腰带
    'BACK',        // 背部
    'MISC_1',      // 杂项1
    'MISC_2'       // 杂项2
]);

export const EquipStats = z.object({
    hp: z.number().optional(),    // 生命上限
    shield: z.number().optional(),         // 护盾值
    attack: z.number().optional(),         // 攻击力
    defense: z.number().optional(),        // 防御力
    evasion: z.number().optional(),        // 闪避率
    crit_rate: z.number().optional(),      // 暴击率
    crit_dmg: z.number().optional(),       // 暴击伤害
    speed: z.number().optional(),          // 速度
    mp: z.number().optional(),         // 能量值
    penetration: z.number().optional(),    // 护甲穿透
    description: z.string().optional(),    // 描述
    // 元素相关
    lifesteal: z.number().optional(),      // 生命偷取(%)
    elem_mastery: z.number().optional(),   // 元素精通
    elem_bonus: z.number().optional(),     // 元素伤害加成(%)
    // 抗性相关
    total_res: z.number().optional(),      // 总抗性
    fire_res: z.number().optional(),       // 火元素抗性
    ice_res: z.number().optional(),        // 冰元素抗性
    lightning_res: z.number().optional(),   // 雷元素抗性
    // 特殊属性
    rage_bonus: z.number().optional(),     // 怒气伤害加成
    healing_bonus: z.number().optional(),   // 治疗加成
    shield_strength: z.number().optional()  // 护盾强度
});


export const Equipment = z.object({
    id: z.string(),
    name: z.string(),
    cost: z.number().default(1),
    type: EquipType,
    cls: z.enum(["ITEM", "EQUIP"]).default('ITEM'),
    description: z.string().default(""),
    level: z.number().min(1).default(1),
    rarity: z.number().min(1).max(5).default(1),
    stats: EquipStats,
    isTwoHanded: z.boolean().optional()
});
export const EquipTypeNames = {
    MAIN_HAND: '主手',
    OFF_HAND: '副手',
    HELMET: '头盔',
    ARMOR: '护甲',
    GAUNTLETS: '护手',
    GREAVES: '护腿',
    BOOTS: '靴子',
    NECKLACE: '项链',
    RING: '戒指',
    BELT: '腰带',
    BACK: '背部',
    MISC_1: '杂项',
    MISC_2: '杂项'
} as const;


export type EquipTypeName = keyof typeof EquipTypeNames;
export type EquipStats = z.infer<typeof EquipStats>;
export type Equipment = z.infer<typeof Equipment>;

import { weapons } from './data/weapons';
import { armor } from './data/armor';
import { accessories } from './data/accessories';


export const equipments: Equipment[] = z.array(Equipment).parse([
    ...weapons,
    ...armor,
    ...accessories
]);

export const EquipmentMap: Record<string, Equipment> = {
    ...Object.fromEntries(equipments.map(equip => [equip.id, equip])),
};
