import { Skill, targetTypeEnum } from '../types';
export const ELEMENTAL_BURST: Array<Skill> = [
    {
        id: '天然理心流奥义',
        name: '天然理心流奥义·三段突刺',
        type: 'ELEMENTAL_BURST',
        desc: '天然理心流的奥义核心为‌平青眼‌与‌无明剑‌（又称三段刺），其特点是结合精妙剑技与精神境界的极致统一。',
        scopeType: 'SINGLE',
        effectType: 'DAMAGE',
        multiplier: 500,
        // cost: { mp: 80 },
        cooldown: 10,
        level: 1,
        element: 'wind',
    },
    {
        id: '天魔反·无间',
        name: '天魔反·无间',
        type: 'ELEMENTAL_BURST',
        desc: '磨炼剑术至极所领悟出的在任何情况下都能使出的居合极意。',
        buffs: [{ id: "天魔反·无间", type: "self" }],
        scopeType: 'SINGLE',
        effectType: 'DAMAGE',
        multiplier: 280,
        // cost: { mp: 80 },
        cooldown: 10,
        level: 1,
        element: 'light',
        damageType: 'physical'
    },
    {
        id: '神罗八百万',
        name: '神罗八百万',
        type: 'ELEMENTAL_BURST',
        desc: '须佐之男把这个架势命名为“神罗八百万”，因为它攻防一体，完美无缺，就好像寄宿着800万神明一般。',
        buffs: [{ id: "神罗八百万", type: "target" }],
        scopeType: 'ALL',
        effectType: 'DAMAGE',
        multiplier: 120,
        cost: { mp: 80 },
        cooldown: 10,
        level: 1,
        element: 'dark',
        damageType: 'magic'
    },
    {
        id: '绝剑·无穹三段',
        name: '绝剑·无穹三段',
        type: 'ELEMENTAL_BURST',
        desc: '',
        scopeType: 'SINGLE',
        effectType: 'DAMAGE',
        multiplier: 500,
        cost: { mp: 80 },
        cooldown: 10,
        level: 1,
        element: 'water',
    },
    {
        id: '一刀流',
        name: '一刀流',
        type: 'ELEMENTAL_BURST',
        desc: '真正无渣滓地体现一刀流的真髓。',
        scopeType: 'SINGLE',
        effectType: 'DAMAGE',
        multiplier: 500,
        cost: { mp: 80 },
        cooldown: 10,
        level: 1,
        element: 'thunder',
    },
    {
        id: '巨斧头',
        name: '巨斧头',
        type: 'ELEMENTAL_SKILL',
        desc: '快速移动并造成伤害,降低目标防御',
        buffs: [
            { id: "巨斧头", type: "target" },
        ],
        scopeType: 'MULTI',
        effectType: 'DAMAGE',
        multiplier: 440,
        cooldown: 10,
        level: 1,
        element: 'wind',
        elemBonusBonus: 20,
        damageType: 'physical'
    },
    {
        id: '南十字之星',
        name: '南十字之星',
        type: 'ELEMENTAL_SKILL',
        desc: '',
        targetType: targetTypeEnum.ENEMY,
        scopeType: 'SINGLE',
        effectType: 'BUFF',
        multiplier: 500,
        cooldown: 10,
        level: 1,
        element: 'light',
        damageType: 'magic'
    },
    // {
    //     id: '天魔反·无间',
    //     name: '天魔反·无间',
    //     type: 'ELEMENTAL_SKILL',
    //     desc: '须佐之男把这个架势命名为“天魔反·无间”，因为它攻防一体，完美无缺，就好像寄宿着800万神明一般。',
    //     targetType: targetTypeEnum.ENEMY,
    //     scopeType: 'SINGLE',
    //     effectType: 'BUFF',
    //     multiplier: 500,
    //     cooldown: 10,
    //     level: 1,
    //     element: 'light',
    //     damageType: 'magic'
    // },
    {
        id: 'shinoa_burst',
        name: '永恒冰狱',
        type: 'ELEMENTAL_BURST',
        desc: '释放强大的冰元素力量，冻结场上所有敌人',
        scopeType: 'ALL',
        effectType: 'DAMAGE',
        multiplier: 40,
        buffs: [{ id: "永恒冰狱", type: "target" }],
        cost: { mp: 80 },
        cooldown: 4,
        level: 1,
        element: 'ice',
        damageType: 'magic'
    },
    {
        id: 'zy_burst',
        name: '赤壁战祸·地狱摇篮',
        type: 'ELEMENTAL_BURST',
        desc: '赤壁之战的具象。通过与固有结界相似但不尽相同的大魔术，将周围一带化作熊熊燃烧的赤壁战船。在自身的魔力或敌人性命其中一方耗尽之前，可自由自在地操纵烈火与爆炸，持续对敌人造成严重伤害，宛如人间炼狱。发动时，还可将与战斗无关之人弹出范围。',
        scopeType: 'ALL',
        effectType: 'DEBUFF',
        buffs: [
            {
                id: "轰鸣长江业火战船",
                type: "target",
                count: 2,
            }
        ],
        multiplier: 50,
        cost: { mp: 80 },
        cooldown: 10,
        level: 1,
        element: 'fire',
        damageType: 'magic'
    },
    {
        id: 'ayaka_skill',
        name: '神里流·霜灭',
        type: 'ELEMENTAL_SKILL',
        desc: '以倾奇之姿汇聚寒霜，放出持续行进的霜见雪关扉。',
        buffs: [
            {
                id: "霜见雪关扉",
                type: "target",
            }
        ],
        scopeType: 'ALL',
        effectType: 'DAMAGE',
        multiplier: 120,
        cost: {},
        cooldown: 10,
        level: 1,
        element: 'ice',
        damageType: 'magic'
    }, {
        id: 'tohka_skill',
        name: '最后之剑',
        type: 'ELEMENTAL_BURST',
        desc: '释放强大的能量斩击，造成巨大伤害',
        scopeType: 'SINGLE',
        effectType: 'DAMAGE',
        multiplier: 500,
        cooldown: 10,
        level: 1,
        element: 'dark',
        critDmgBonus: 50,
        damageType: 'physical'
    }, {
        id: 'raiden_burst',
        name: '奥义·梦想真说',
        type: 'ELEMENTAL_BURST',
        desc: '汇聚万千真言，竭尽诸愿百眼之愿力，斩出粉碎一切诅咒的梦想一刀，造成雷元素范围伤害',
        scopeType: 'ALL',
        effectType: 'BUFF',
        multiplier: 340,
        cost: { mp: 90 },
        cooldown: 10,
        level: 1,
        element: 'thunder',
        damageType: 'physical'
    }, {
        id: 'ai_burst',
        name: '风暴之眼',
        type: 'ELEMENTAL_BURST',
        desc: '释放巨大旋风，造成持续伤害并提升队伍速度',
        scopeType: 'ALL',
        effectType: 'DAMAGE',
        multiplier: 120,
        buffs: [{
            id: "风暴之眼",
        }
        ],
        cost: { mp: 70 },
        cooldown: 10,
        level: 1,
        element: 'wind',
        damageType: 'magic'
    },
    {
        id: 'issei_burst',
        name: '不动明王咒',
        type: 'ELEMENTAL_SKILL',
        cost: { mp: 80 },
        desc: '使用咒术符，并通过咏唱来发动效果的法术，一濑红莲对战百夜米迦尔时曾使用过的爆炸型咒术',
        buffs: [
            {
                id: "不动明王咒",
                type: "self",
            }
        ],
        scopeType: 'ALL',
        effectType: 'DAMAGE',
        multiplier: 120,
        cooldown: 10,
        level: 1,
        element: 'dark',
        critRateBonus: 15,
        damageType: 'magic'
    },
    //  {
    //     id: 'mitsuba_burst',
    //     name: '疾风之翼',
    //     type: 'ELEMENTAL_BURST',
    //     desc: '展开风之翼,大幅提升速度和闪避',
    //     targetType: targetTypeEnum.ALLY,
    //     scopeType: 'ALL',
    //     effectType: 'BUFF',
    //     buffs: [{
    //         id: "速度提升",
    //     }, {
    //         id: "闪避提升",
    //     }
    //     ],
    //     multiplier: 300,
    //     cost: { mp: 70 },
    //     cooldown: 10,
    //     level: 1,
    //     element: 'wind',
    //     damageType: 'physical'
    // }, 
    {
        id: 'themis_burst',
        name: '制裁之雷',
        type: 'ELEMENTAL_BURST',
        desc: '召唤雷霆制裁敌人,造成大量雷元素伤害',
        scopeType: 'SINGLE',
        effectType: 'DAMAGE',
        multiplier: 500,
        cost: { mp: 75 },
        cooldown: 10,
        level: 1,
        element: 'thunder',
        critDmgBonus: 40,
        damageType: 'magic'
    }
]
