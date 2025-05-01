import { Skill, targetTypeEnum, targetType } from '../types';
import { get_svg_uri } from '../..';
export const ELEMENTAL_SKILL: Array<Skill> = [
    {
        id: 'hutao_skill',
        name: '蝶引来生',
        type: 'ELEMENTAL_SKILL',
        uri: get_svg_uri(10, import.meta.url),
        desc: ' \${name}消耗30%生命值，获得彼岸蝶舞状态，只有永不间断的烈焰可以洗净世间的不净之物。',
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
        cooldown: 4,
        level: 1,
        element: 'fire',
        damageType: 'physical'
    },
    {
        id: 'shinoa_skill',
        name: '神里流·冰华',
        type: 'ELEMENTAL_SKILL',
        desc: '\${name}召唤冰霜之矛攻击敌人，有20%冻结目标',
        effects: [
            {
                isBuff: true,
                path: "status",
                target: 'target',
                attr: "dizz",
                value: 1,
                operator: "max",
                probability: 20,
            },
        ],
        scopeType: 'SINGLE',
        effectType: 'DAMAGE',
        multiplier: 120,
        cooldown: 3,
        level: 1,
        element: 'ice',
        critRateBonus: 10,
        damageType: 'magic'
    },
    {
        id: '鸢飞戾天',
        name: '天然理心流·鸢飞戾天',
        type: 'ELEMENTAL_SKILL',
        desc: '提升\${name}的速度',
        buffs: [{
            id: "鸢飞戾天",
            type: "self"
        }],
        targetType: targetTypeEnum.ENEMY,
        scopeType: 'SINGLE',
        effectType: 'BUFF',
        multiplier: 170,
        cooldown: 2,
        level: 1,
        element: 'wind',
        damageType: 'physical'
    },
    {
        id: '无外流',
        name: '无外流',
        type: 'ELEMENTAL_SKILL',
        buffs: [
            { id: "无外流", type: "self" },
        ],
        desc: "\${name}提升防御40%,每回合恢复生命值10%，无外流是日本古流剑术的重要流派之一，以实战性和独特的技法著称。",
        targetType: targetTypeEnum.ENEMY,
        scopeType: 'SINGLE',
        effectType: 'BUFF',
        multiplier: 130,
        cooldown: 3,
        level: 1,
        element: 'thunder',
        damageType: 'physical'
    },
    {
        id: '鬼子·散',
        name: '鬼子·散',
        type: 'ELEMENTAL_SKILL',
        desc: '',
        targetType: targetTypeEnum.ENEMY,
        scopeType: 'SINGLE',
        effectType: 'BUFF',
        multiplier: 220,
        cooldown: 3,
        level: 1,
        element: 'dark',
        damageType: 'magic'
    },
    {
        id: '天翔散段',
        name: '天翔散段',
        type: 'ELEMENTAL_SKILL',
        desc: '提升\${name}的暴击率/暴击伤害,并造成持续伤害',
        targetType: targetTypeEnum.ENEMY,
        buffs: [
            { id: "天翔", type: "self" },
            { id: "散段", type: "target" },
        ],
        scopeType: 'SINGLE',
        effectType: 'BUFF',
        multiplier: 190,
        cooldown: 2,
        level: 1,
        element: 'light',
        damageType: 'physical'
    },
    {
        id: '不断',
        name: '不断',
        type: 'ELEMENTAL_SKILL',
        desc: '',
        targetType: targetTypeEnum.ENEMY,
        scopeType: 'SINGLE',
        effectType: 'BUFF',
        buffs: [{
            id: "速度提升",
        }],
        multiplier: 200,
        cooldown: 3,
        level: 1,
        element: 'water',
        damageType: 'physical'
    },
    {
        id: 'attack_flame',
        name: '烈火突袭',
        type: 'ELEMENTAL_SKILL',
        desc: '',
        targetType: targetTypeEnum.ENEMY,
        scopeType: 'SINGLE',
        effectType: 'BUFF',
        multiplier: 200,
        cooldown: 3,
        level: 1,
        element: 'fire',
        damageType: 'physical'
    },
    {
        id: 'zy_skill',
        name: '轰鸣长江业火战船',
        type: 'ELEMENTAL_SKILL',
        desc: '由稍小型的楼船与Archer所持弓组成的宝具。楼船为宝具的副产物，攻击核心为弓箭。射出的箭矢命中后将会爆炸。赤壁之战中肩负重要使命的火船化作的武器。与其说是逸闻的具象……不如说是逸闻化为了兵器。',
        buffs: [
            {
                id: "轰鸣长江业火战船",
                type: "target",
            }
        ],
        targetType: targetTypeEnum.ENEMY,
        scopeType: 'ALL',
        effectType: 'DEBUFF',
        multiplier: 10,
        cooldown: 2,
        level: 1,
        element: 'fire',
        damageType: 'magic'
    },
    {
        id: 'red_flame',
        name: '赤焰漩涡',
        type: 'ELEMENTAL_SKILL',
        desc: '',
        targetType: targetTypeEnum.ENEMY,
        scopeType: 'SINGLE',
        effectType: 'BUFF',
        multiplier: 240,
        cooldown: 8,
        level: 1,
        element: 'fire',
        damageType: 'physical'
    }, {
        id: 'eula_skill',
        name: '安神秘法',
        type: 'ELEMENTAL_SKILL',
        desc: '挥动炽热的魂灵，造成大范围火元素伤害。命中敌人时，基于\${name}的当前生命值，恢复\${name}的生命值',
        effects: [
            {
                isBuff: true,
                path: "status",
                target: 'self',
                attr: "hp",
                value: 1000,
                operator: "multiply",
                probability: 100,
            },
        ],
        scopeType: 'ALL',
        effectType: 'DAMAGE',
        multiplier: 300,
        cooldown: 10,
        level: 1,
        element: 'fire',
        damageType: 'physical'
    }, {
        id: 'makima_skill',
        name: '支配之链',
        type: 'ELEMENTAL_SKILL',
        desc: '操控敌人，使其暂时失去行动能力',
        effects: [
            {
                isBuff: true,
                path: "status",
                target: 'target',
                attr: "dizz",
                value: 1,
                operator: "max",
                probability: 20,
            },
        ],
        scopeType: 'SINGLE',
        effectType: 'DEBUFF',
        multiplier: 130,
        cooldown: 4,
        level: 1,
        element: 'dark',
        damageType: 'magic'
    }, {
        id: 'raiden_skill',
        name: '神变·恶曜开眼',
        type: 'ELEMENTAL_SKILL',
        desc: '雷电将军展开净土的一角,对周围的敌人造成雷元素伤害，为队伍中附近的所有角色授以雷罚恶曜之眼，为队友攻击附加雷元素伤害',
        buffs: [
            {
                id: "神变·恶曜开眼",
                type: "target",
            }
        ],
        targetType: targetTypeEnum.ALLY,
        scopeType: 'ALL',
        effectType: 'BUFF',
        multiplier: 0,
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
        multiplier: 200,
        cooldown: 2,
        level: 1,
        element: 'thunder',
        damageType: 'physical'
    }, {
        id: 'ai_skill',
        name: '乱气流',
        type: 'ELEMENTAL_SKILL',
        desc: '快速移动并造成风元素伤害，提升速度',
        targetType: targetTypeEnum.SELF,
        buffs: [
            {
                id: "乱气流",
                type: "self",
            }
        ],
        scopeType: 'MULTI',
        effectType: 'DAMAGE',
        multiplier: 130,
        cooldown: 3,
        level: 1,
        element: 'wind',
        damageType: 'physical'
    }, {
        id: 'lancelot_skill',
        name: '疾风突刺',
        type: 'ELEMENTAL_SKILL',
        desc: '高速突进攻击敌人，提升暴击率',
        buffs: [
            {
                id: "暴击率提升",
                type: "self",
            }
        ],
        scopeType: 'SINGLE',
        effectType: 'DAMAGE',
        multiplier: 170,
        cooldown: 3,
        level: 1,
        element: 'wind',
        critRateBonus: 15,
        damageType: 'physical'
    },
    {
        id: 'issei_skill',
        name: '罪钥',
        type: 'ELEMENTAL_BURST',
        desc: '释放强大的黑焰剑气,对敌人造成多段伤害',
        buffs: [{ id: "罪钥", type: "target" }],
        scopeType: 'SINGLE',
        effectType: 'DAMAGE',
        multiplier: 230,
        cooldown: 3,
        level: 1,
        element: 'dark',
        critDmgBonus: 50,
        damageType: 'physical'
    }, {
        id: 'mitsuba_skill',
        name: '巨斧头',
        type: 'ELEMENTAL_SKILL',
        desc: '快速移动并造成范围风元素伤害,降低目标防御',
        buffs: [
            { id: "防御降低", type: "target" },
        ],
        scopeType: 'MULTI',
        effectType: 'DAMAGE',
        multiplier: 150,
        cooldown: 3,
        level: 1,
        element: 'wind',
        elemBonusBonus: 20,
        damageType: 'physical'
    }, {
        id: 'themis_skill',
        name: '天秤制裁',
        type: 'ELEMENTAL_SKILL',
        desc: '释放神圣之力,对敌人造成伤害并降低防御',
        buffs: [
            {
                id: "防御降低",
                type: "self",
            }
        ],
        scopeType: 'MULTI',
        effectType: 'DAMAGE',
        multiplier: 50,
        cooldown: 3,
        level: 1,
        element: 'thunder',
        elemBonusBonus: 15,
        damageType: 'magic'
    }
]
