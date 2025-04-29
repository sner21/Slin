import { Skill, targetTypeEnum } from '../types';
import { get_svg_uri } from '../..';
export const ELEMENTAL_SKILL: Array< Skill> = [
    {
        id: 'hutao_skill',
        name: '蝶引来生',
        type: 'ELEMENTAL_SKILL',
        uri: get_svg_uri(10, import.meta.url),
        desc: '\${name}消耗30%生命值，获得彼岸蝶舞状态',
        scopeType: 'SINGLE',
        effectType: 'BUFF',
        targetType: targetTypeEnum.SELF,
        multiplier: 0,
        not_lethal: true,
        buffs: [
            {
                id: "彼岸蝶舞",
                type: "self",
            }
        ],
        effects: [
            {
                isBuff: true,
                path: "status",
                target: 'self',
                attr: "hp",
                value: 0.7,
                operator: "multiply",
                // conditions:[
                //     {
                //         operator: 'GT',
                //         path: "status",
                //         target: 'self',
                //         attr: "hp",
                //         value: 100
                //     }
                // ]
            },
        ],
        cooldown: 16,
        level: 1,
        element: 'fire',
        damageType: 'physical'
    },{
        id: 'shinoa_skill',
        name: '神里流·冰华',
        type: 'ELEMENTAL_SKILL',
        desc: '召唤冰霜之矛攻击敌人，有几率冻结目标',
        scopeType: 'SINGLE',
        effectType: 'DAMAGE',
        multiplier: 120,
        cooldown: 3,
        level: 1,
        element: 'ice',
        critRateBonus: 10,
        damageType: 'magic'
    }, {
        id: 'attack_flame',
        name: '烈火突袭',
        type: 'ELEMENTAL_SKILL',
        desc: '',
        targetType: targetTypeEnum.ALLY,
        scopeType: 'SINGLE',
        effectType: 'BUFF',
        multiplier: 160,
        cooldown: 4,
        level: 1,
        element: 'water',
        damageType: 'magic'
    },{
        id: 'red_flame',
        name: '赤焰漩涡',
        type: 'ELEMENTAL_SKILL',
        desc: '',
        targetType: targetTypeEnum.ALLY,
        scopeType: 'SINGLE',
        effectType: 'BUFF',
        multiplier: 160,
        cooldown: 4,
        level: 1,
        element: 'water',
        damageType: 'magic'
    }, {
        id: 'eula_skill',
        name: '安神秘法',
        type: 'ELEMENTAL_SKILL',
        desc: '挥动炽热的魂灵，造成大范围火元素伤害。命中敌人时，基于\${name}的生命值上限，恢复\${name}的生命值',
        scopeType: 'MULTI',
        effectType: 'DAMAGE',
        multiplier: 150,
        cooldown: 15,
        level: 1,
        element: 'fire',
        damageType: 'physical'
    },{
        id: 'makima_skill',
        name: '支配之链',
        type: 'ELEMENTAL_SKILL',
        desc: '操控敌人，使其暂时失去行动能力',
        scopeType: 'SINGLE',
        effectType: 'DEBUFF',
        multiplier: 130,
        cooldown: 4,
        level: 1,
        element: 'fire',
        damageType: 'magic'
    },{
        id: 'raiden_skill',
        name: '神变·恶曜开眼',
        type: 'ELEMENTAL_SKILL',
        desc: '召唤雷电之眼，为队友攻击附加雷元素伤害',
        targetType: targetTypeEnum.ALLY,
        scopeType: 'ALL',
        effectType: 'BUFF',
        multiplier: 140,
        cooldown: 3,
        level: 1,
        element: 'thunder',
        damageType: 'magic'
    }, {
        id: 'keqing_skill',
        name: '星斗归位',
        type: 'ELEMENTAL_SKILL',
        desc: '投掷雷元素印记，可二段释放进行闪现',
        scopeType: 'SINGLE',
        effectType: 'DAMAGE',
        multiplier: 160,
        cooldown: 3,
        level: 1,
        element: 'thunder',
        damageType: 'physical'
    },{
        id: 'ai_skill',
        name: '乱气流',
        type: 'ELEMENTAL_SKILL',
        desc: '快速移动并造成风元素伤害，提升速度',
        targetType: targetTypeEnum.SELF,
        scopeType: 'MULTI',
        effectType: 'DAMAGE',
        multiplier: 130,
        cooldown: 3,
        level: 1,
        element: 'wind',
        damageType: 'physical'
    },{
        id: 'lancelot_skill',
        name: '疾风突刺',
        type: 'ELEMENTAL_SKILL',
        desc: '高速突进攻击敌人，提升暴击率',
        scopeType: 'SINGLE',
        effectType: 'DAMAGE',
        multiplier: 170,
        cooldown: 3,
        level: 1,
        element: 'wind',
        critRateBonus: 15,
        damageType: 'physical'
    },{
        id: 'issei_skill',
        name: '不动明王咒',
        type: 'ELEMENTAL_SKILL',
        desc: '释放强大的火焰斩击,提升自身攻击力',
        scopeType: 'MULTI',
        effectType: 'DAMAGE',
        multiplier: 180,
        cooldown: 3,
        level: 1,
        element: 'dark',
        critRateBonus: 15,
        damageType: 'physical'
    },{
        id: 'mitsuba_skill',
        name: '巨斧头',
        type: 'ELEMENTAL_SKILL',
        desc: '快速移动并造成范围风元素伤害',
        scopeType: 'MULTI',
        effectType: 'DAMAGE',
        multiplier: 150,
        cooldown: 3,
        level: 1,
        element: 'wind',
        elemBonusBonus: 20,
        damageType: 'physical'
    },{
        id: 'themis_skill',
        name: '天秤制裁',
        type: 'ELEMENTAL_SKILL',
        desc: '释放神圣之力,对敌人造成伤害并降低防御',
        scopeType: 'MULTI',
        effectType: 'DAMAGE',
        multiplier: 160,
        cooldown: 3,
        level: 1,
        element: 'thunder',
        elemBonusBonus: 15,
        damageType: 'magic'
    }
]
