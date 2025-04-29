import { Skill } from '../types';

export const NORMAL_ATTACK: Array<Skill> = [
    {
        id: 'physical_normal',
        name: '普攻',
        type: 'NORMAL_ATTACK',
        desc: '普通物理攻击',
        scopeType: 'SINGLE',
        effectType: 'DAMAGE',
        multiplier: 100,
        cost: {},
        cooldown: 1,
        level: 1,
        element: 'default',
        damageType: 'physical'
    }, {
        id: 'magic_normal',
        name: '普攻',
        type: 'NORMAL_ATTACK',
        desc: '普通魔法攻击',
        scopeType: 'SINGLE',
        effectType: 'DAMAGE',
        multiplier: 100,
        cost: {},
        cooldown: 1,
        level: 1,
        element: 'default',
        damageType: 'magic'
    }
]; 
