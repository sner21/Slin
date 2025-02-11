import { Equipment } from '../index';

// 防具类装备数据
export const armor: Equipment[] = [
    {
        id: 'mystic_helm_01',
        name: '秘法头冠',
        type: 'HELMET',
        level: 1,
        rarity: 4,
        description: '充满魔力的头冠，增强使用者的精神力',
        stats: {
            hp: 80,
            defense: 15,
            mp: 20,
            elem_mastery: 25
        }
    },
    {
        id: 'shadow_armor_01',
        name: '暗影战甲',
        type: 'ARMOR',
        level: 1,
        rarity: 4,
        description: '由暗影能量织就的战甲，提供优秀的防护和闪避能力',
        stats: {
            defense: 40,
            hp: 150,
            evasion: 8,
            dark_res: 15
        }
    },
    {
        id: 'thunder_gauntlets_01',
        name: '雷霆护手',
        type: 'GAUNTLETS',
        level: 1,
        rarity: 4,
        description: '蕴含雷电之力的护手，提升攻击速度',
        stats: {
            attack: 15,
            speed: 10,
            defense: 10,
            lightning_res: 12
        }
    },
    {
        id: 'flame_greaves_01',
        name: '烈焰护腿',
        type: 'GREAVES',
        level: 1,
        rarity: 4,
        description: '注入火焰之力的护腿，提供额外的攻击力',
        stats: {
            defense: 20,
            hp: 80,
            attack: 10,
            fire_res: 15
        }
    },
    {
        id: 'wind_boots_01',
        name: '疾风靴',
        type: 'BOOTS',
        level: 1,
        rarity: 4,
        description: '轻盈如风的靴子，大幅提升移动速度',
        stats: {
            speed: 15,
            evasion: 8,
            defense: 8,
            wind_res: 12
        }
    }
];
