import { z } from 'zod';
import { Equipment } from '../index';

// 饰品类装备数据
export const accessories: Equipment[]= [
    {
        id: 'ancient_necklace_01',
        name: '远古项链',
        type: 'NECKLACE',
        level: 1,
        rarity: 4,
        cost: 50,
        desc: '蕴含远古力量的项链，提供全面的属性加成',
        stats: {
            hp: 50,
            attack: 10,
            defense: 10,
            mp: 15,
            elem_mastery: 25
        }
    },
    {
        id: 'power_ring_01',
        name: '力量之戒',
        type: 'RING',
        cost: 50,
        level: 1,
        rarity: 4,
        desc: '增强佩戴者力量的魔法戒指',
        stats: {
            attack: 15,
            crit_rate: 8,
            penetration: 10,
            elem_bonus: 8
        }
    },
    {
        id: 'guardian_belt_01',
        name: '守护者腰带',
        type: 'BELT',
        level: 1,
        cost: 50,
        rarity: 4,
        desc: '提供额外防护的魔法腰带',
        stats: {
            hp: 100,
            defense: 15,
            shield_strength: 15,
            elem_res: 10
        }
    },
    {
        id: 'wings_of_storm_01',
        name: '风暴之翼',
        type: 'BACK',
        level: 1,
        cost: 50,
        rarity: 4,
        desc: '由风暴元素凝聚而成的翅膀，提供强大的机动性',
        stats: {
            speed: 20,
            evasion: 10,
            mp: 25,
            wind_res: 15
        }
    }
];
