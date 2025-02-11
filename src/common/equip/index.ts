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

// 装备属性
export const EquipStats = z.object({
    // 基础属性
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
    level: z.number().default(1), // 装备等级
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

// 装备模式
export const Equipment = z.object({
    id: z.string(),
    name: z.string(),
    type: EquipType,
    level: z.number().min(1),
    rarity: z.number().min(1).max(5),
    stats: EquipStats,
    isTwoHanded: z.boolean().optional()
});
export const EquipTypeNames = {
    // 武器类
    MAIN_HAND: '主手',
    OFF_HAND: '副手',

    // 防具类
    HELMET: '头盔',
    ARMOR: '护甲',
    GAUNTLETS: '护手',
    GREAVES: '护腿',
    BOOTS: '靴子',

    // 饰品类
    NECKLACE: '项链',
    RING: '戒指',
    BELT: '腰带',
    BACK: '背部',

    // 杂项
    MISC_1: '杂项',
    MISC_2: '杂项'
} as const;

// 导出类型
export type EquipTypeName = keyof typeof EquipTypeNames;
// 导出类型
export type EquipStats = z.infer<typeof EquipStats>;
export type Equipment = z.infer<typeof Equipment>;

import { weapons } from './data/weapons';
import { armor } from './data/armor';
import { accessories } from './data/accessories';

// 装备数据
export const equipments: Equipment[] = [
    ...weapons,
    ...armor,
    ...accessories
];

// 装备映射表
export const EquipmentMap: Record<string, Equipment> = {
    ...Object.fromEntries(equipments.map(equip => [equip.id, equip])),
    // 柊筱娅的装备
    ice_scythe: {
        id: 'ice_scythe',
        name: '四镰童子',
        type: 'MAIN_HAND',
        level: 5,
        rarity: 4,
        stats: {
            attack: 25,
            crit_rate: 8,
            elem_mastery: 40,
            ice_res: 15,
            elem_bonus: 12
        }
    },
    frost_crown: {
        id: 'frost_crown',
        name: '冰霜王冠',
        type: 'HELMET',
        slot: 'helmet',
        level: 1,
        rarity: 4,
        stats: {
            hp: 120,
            elem_mastery: 30,
            ice_res: 20
        }
    },

    // 宝多六花的装备
    healing_staff: {
        id: 'healing_staff',
        name: '治愈法杖',
        type: 'MAIN_HAND',
        level: 1,
        rarity: 4,
        stats: {
            attack: 15,
            healing_bonus: 20,
            elem_mastery: 35,
            mp: 50
        }
    },
    water_shield: {
        id: 'water_shield',
        name: '流水之盾',
        type: 'OFF_HAND',
        level: 1,
        rarity: 4,
        stats: {
            defense: 15,
            shield_strength: 20,
            water_res: 15
        }
    },

    // 胡桃的装备
    soul_spear: {
        id: 'soul_spear',
        name: '护摩之杖',
        type: 'MAIN_HAND',
        level: 1,
        rarity: 5,
        stats: {
            attack: 30,
            crit_dmg: 40,
            elem_bonus: 15,
            lifesteal: 8
        }
    },
    blood_pendant: {
        id: 'blood_pendant',
        name: '血蝶之链',
        type: 'NECKLACE',
        level: 1,
        rarity: 4,
        stats: {
            hp: 200,
            elem_mastery: 45,
            fire_res: 15
        }
    },

    // 玛奇玛的装备
    demon_contract: {
        id: 'demon_contract',
        name: '恶魔契约书',
        type: 'MAIN_HAND',
        level: 1,
        rarity: 5,
        stats: {
            attack: 35,
            crit_rate: 12,
            elem_bonus: 18,
            hp: -100  // 负面效果
        }
    },
    control_ring: {
        id: 'control_ring',
        name: '支配之戒',
        type: 'RING',
        level: 1,
        rarity: 4,
        stats: {
            elem_mastery: 50,
            rage_bonus: 15,
            penetration: 10
        }
    },

    // 雷电将军的装备
    engulfing_lightning: {
        id: 'engulfing_lightning',
        name: '薙草之稻光',
        type: 'MAIN_HAND',
        level: 1,
        rarity: 5,
        stats: {
            attack: 28,
            mp: 80,
            elem_bonus: 20,
            lightning_res: 15
        }
    },
    thunder_crown: {
        id: 'thunder_crown',
        name: '雷罚之冠',
        type: 'HELMET',
        level: 1,
        rarity: 4,
        stats: {
            elem_mastery: 55,
            crit_rate: 10,
            lightning_res: 20
        }
    },

    // 早坂爱的装备
    wind_dagger: {
        id: 'wind_dagger',
        name: '疾风短刃',
        type: 'MAIN_HAND',
        level: 1,
        rarity: 4,
        stats: {
            attack: 20,
            speed: 15,
            evasion: 10,
            elem_mastery: 40
        }
    },
    stealth_boots: {
        id: 'stealth_boots',
        name: '隐秘之靴',
        type: 'BOOTS',
        level: 1,
        rarity: 4,
        stats: {
            speed: 20,
            evasion: 8,
            elem_bonus: 10
        }
    },

    // 一濑红莲的装备
    flame_katana: {
        id: 'flame_katana',
        name: '真昼之夜',
        type: 'MAIN_HAND',
        level: 1,
        rarity: 5,
        stats: {
            attack: 32,
            crit_rate: 15,
            elem_bonus: 20,
            fire_res: 20,
            elem_mastery: 45
        }
    },
    flame_armor: {
        id: 'flame_armor',
        name: '炎武者之铠',
        type: 'ARMOR',
        level: 1,
        rarity: 4,
        stats: {
            hp: 150,
            defense: 20,
            fire_res: 25,
            elem_bonus: 15
        }
    },

    // 三宫三叶的装备
    wind_bow: {
        id: 'wind_bow',
        name: '天字龙',
        type: 'MAIN_HAND',
        level: 1,
        rarity: 4,
        stats: {
            attack: 25,
            speed: 20,
            elem_mastery: 50,
            elem_bonus: 15,
            evasion: 12
        }
    },
    wind_cloak: {
        id: 'wind_cloak',
        name: '风行者披风',
        type: 'BACK',
        level: 1,
        rarity: 4,
        stats: {
            speed: 25,
            evasion: 15,
            elem_bonus: 12,
            elem_mastery: 35
        }
    }
};
