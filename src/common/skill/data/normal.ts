import { Skill } from '../types';
import { get_svg_uri } from '../..';

export const NORMAL_ATTACK: Record<string, Skill> = {
    // default: {
    //     id: 'default',
    //     name: '默认',
    //     type: 'PASSIVE',
    //     description: '回复',
    //     targetType: 'SINGLE',
    //     effectType: 'DEFAULT',
    //     multiplier: 100,
    //     cost: {},
    //     cooldown: 0,
    //     level: 1,
    //     element: 'default',
    //     damageType: 'physical'
    // },
    physical_normal: {
        id: 'physical_normal',
        name: '物理普攻',
        type: 'NORMAL_ATTACK',
        description: '普通物理攻击',
        targetType: 'SINGLE',
        effectType: 'DAMAGE',
        multiplier: 100,
        cost: {},
        cooldown: 1,
        level: 1,
        element: 'default',
        damageType: 'physical'
    },
    magic_normal: {
        id: 'magic_normal',
        name: '魔法普攻',
        type: 'NORMAL_ATTACK',
        description: '普通魔法攻击',
        targetType: 'SINGLE',
        effectType: 'DAMAGE',
        multiplier: 100,
        cost: {},
        cooldown: 1,
        level: 1,
        element: 'default',
        damageType: 'magic'
    }
}; 