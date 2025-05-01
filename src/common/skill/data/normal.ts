import { Skill } from '../types';

export const NORMAL_ATTACK: Array<Skill> = [
    {
        id: 'physical_normal',
        name: '物普攻',
        type: 'NORMAL_ATTACK',
        desc: '物理普通物理攻击',
        scopeType: 'SINGLE',
        effectType: 'DAMAGE',
        multiplier: 100,
        cost: {},
        cooldown: 1,
        level: 1,
        damageType: 'physical'
    },
    {
        id: 'magic_normal',
        name: '魔普攻',
        type: 'NORMAL_ATTACK',
        desc: '魔法普通物理攻击',
        scopeType: 'SINGLE',
        effectType: 'DAMAGE',
        multiplier: 100,
        cost: {},
        cooldown: 1,
        level: 1,
        damageType: 'magic'
    },
    {
        id: '往生秘传枪法(重击)',
        name: '往生秘传枪法(重击)',
        type: 'NORMAL_ATTACK',
        desc: '重击会为命中的敌人施加血梅香效果。',
        buffs: [{
            id: "血梅香", type: "target"
        }],
        scopeType: 'SINGLE',
        effectType: 'DAMAGE',
        multiplier: 110,
        cost: {},
        cooldown: 1,
        level: 1,
        damageType: 'physical'
    }
]; 
