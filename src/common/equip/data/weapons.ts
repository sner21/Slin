import { Equipment } from '../index';

// 武器类装备数据
export const weapons: Equipment[] = [
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
