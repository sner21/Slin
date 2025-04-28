import { z } from 'zod';
import { Equipment } from '../index';

// 武器类装备数据
export const weapons: Equipment[] = [
    {
        id: 'ice_scythe',
        cost: 50,
        name: '四镰童子',
        description: "",
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
    {
        id: 'frost_crown',
        name: '冰霜王冠',
        type: 'HELMET',
        level: 1,
        rarity: 4,
        stats: {
            hp: 120,
            elem_mastery: 30,
            ice_res: 20
        }
    },

    {
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
    {
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

    {
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
    {
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

    {
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
    {
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

    {
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
    {
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

    {
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
    {
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

    {
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
    {
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


    {
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
    {
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
    },
    {
        id: 'magic_sword_01',
        name: '魔力之剑',
        type: 'MAIN_HAND',
        level: 1,
        rarity: 4,
        description: '蕴含魔力的利剑，可以增强使用者的攻击力',
        stats: {
            attack: 25,
            crit_rate: 5,
            crit_dmg: 20,
            speed: 5,
            elem_mastery: 20
        }
    },
    {
        id: 'dragon_shield_01',
        name: '龙鳞盾',
        type: 'OFF_HAND',
        level: 1,
        rarity: 4,
        description: '由龙鳞打造的盾牌，提供强大的防护能力',
        stats: {
            defense: 30,
            hp: 100,
            shield_strength: 20,
            elem_res: 10
        }
    }
];
