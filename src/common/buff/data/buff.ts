import { Buff } from "../type";

export const buff_init: Buff = [
    {
        id: "轰鸣长江业火战船",
        name: "轰鸣长江业火战船",
        desc: "每层对\${name}造成0.08倍率伤害",
        multiplier: 8,
        maxStacks: 99,
        damageType: "magic",
        durationType: "OVERLAY",
        duration: 4,
        isDebuff: true,
    },
    {
        id: "赤壁战祸",
        name: "赤壁战祸·地狱摇篮",
        desc: "每层对\${name}造成0.15倍率伤害",
        multiplier: 15,
        damageType: "magic",
        durationType: "OVERLAY",
        duration: 25,
        isDebuff: true,
    },
    {
        id: "罪钥",
        name: "罪钥",
        desc: "对\${name}造成0.2倍率伤害",
        multiplier: 20,
        damageType: "magic",
        durationType: "OVERLAY",
        duration: 3,
        isDebuff: true,
    },
    {
        id: "不动明王咒",
        name: "不动明王咒",
        desc: "提升\${name}攻击力和防御力30%",
        imm_ability: {
            attack: 1.3,
            defense: 1.3,
        },
        durationType: "TURNS",
        duration: 6,
        isDebuff: false,
    },
    {
        id: "永恒冰狱",
        name: "永恒冰狱",
        imm_ability: {
            speed: 0.5,
        },
        multiplier: 10,
        desc: "降低\${name}50%速度，并造成0.1倍率伤害",
        durationType: "TURNS",
        duration: 1,
        isDebuff: true,
    },
    {
        id: "霜见雪关扉",
        name: "霜见雪关扉",
        desc: "以刀锋般尖锐的霜风持续切割触及的敌人，造成 冰元素伤害。持续时间结束时绽放，造成 冰元素范围伤害。对\${name}造成持续冰元素伤害",
        multiplier: 30,
        durationType: "TURNS",
        duration: 4,
        isDebuff: true,
    },
    {
        id: "提升攻击力",
        name: "提升攻击力",
        desc: "提升\${name}攻击力10%",
        imm_ability: {
            attack: 1.1,
        },
        durationType: "TURNS",
        duration: 3,
        isDebuff: false,
    },
    {
        id: "彼岸蝶舞",
        name: "彼岸蝶舞",
        desc: "提高\${name}的攻击力20%，普攻变为往生秘传枪法(重击)，伤害附加血梅香。",
        cancelEffects: [
            {
                path: "",
                target: 'self',
                attr: "normal",
                value: 'physical_normal',
                operator: "equal",
            },
            {
                path: "",
                target: 'self',
                attr: "normal_name",
                value: '往生秘传枪法(普通)',
                operator: "equal",
            },
        ],
        imm_ability: {
            attack: 1.2,
        },
        durationType: "TURNS",
        duration: 3,
        isDebuff: false,
    },
    {
        id: "神罗八百万",
        name: "神罗八百万",
        desc: "降低\${name}50%魔抗",
        imm_ability: {
            elem_res: 0.5,
        },
        durationType: "TURNS",
        duration: 3,
        isDebuff: true,
    },
    {
        id: "南天",
        name: "南天",
        desc: "每层提高\${name}的暴击/暴击率",
        imm_ability: {
            crit_rate: 1.05,
            crit_dmg: 1.1,
        },
        durationType: "OVERLAY",
        duration: 3,
        isDebuff: false,
    },
    {
        id: "十字",
        name: "十字",
        desc: "每层对\${name}造成0.10倍率持续伤害",
        multiplier: 10,
        durationType: "OVERLAY",
        duration: 6,
        isDebuff: true,
    },
    {
        id: "血梅香",
        name: "血梅香",
        desc: "对\${name}造成1倍率持续伤害",
        multiplier: 100,
        durationType: "OVERLAY",
        duration: 2,
        isDebuff: true,
    },
    {
        id: "一骑当千",
        name: "一骑当千",
        imm_ability: {
            attack: 1.1,
            defense: 1.1,
            speed: 1.1,
            elem_res: 1.1,
        },
        desc: "提升\${name}攻击、防御、魔抗、速度",
        multiplier: 100,
        durationType: "OVERLAY",
        duration: 3,
        isDebuff: false,
    },
    // {
    //     id: "天魔反·无间",
    //     name: "天魔反·无间",
    //     desc: "对\${name}造成1倍率持续伤害",
    //     multiplier: 100,
    //     durationType: "OVERLAY",
    //     duration: 3,
    //     isDebuff: true,
    // },
    {
        id: "天魔反·无间",
        name: "天魔反·无间",
        imm_ability: {
            crit_rate: 10
        },
        desc: "将\${name}暴击率提升至100%1回合",
        durationType: "TURNS",
        duration: 1,
        isDebuff: false,
    },
    {
        id: "鸢飞戾天",
        name: "鸢飞戾天",
        desc: "提高\${name}30%的速度",
        imm_ability: {
            speed: 1.3,
        },
        durationType: "TURNS",
        duration: 4,
        isDebuff: false,
    },
    {
        id: "神变·恶曜开眼",
        name: "神变·恶曜开眼",
        desc: "提高\${name}的20%攻击力并恢复HP",
        imm_ability: {
            attack: 1.2,
        },
        effects: [{
            target: 'self',
            path: 'status',
            attr: 'hp',
            value: 1.1,
            operator: 'multiply',
        }
        ],
        durationType: "TURNS",
        duration: 4,
        isDebuff: false,
    },
    {
        id: "速度提升",
        name: "速度提升",
        desc: "提升\${name}速度 10",
        imm_ability: {
            speed: 1.1
        },
        durationType: "TURNS",
        duration: 3,
        isDebuff: false,
    },
    {
        id: "防御提升",
        name: "防御提升",
        desc: "提升\${name}防御40%",
        imm_ability: {
            defense: 1.4
        },
        durationType: "TURNS",
        duration: 3,
        isDebuff: false,
    },
    {
        id: "风暴之眼",
        name: "风暴之眼",
        desc: "提升\${name}速度 20%",
        imm_ability: {
            speed: 1.2
        },
        durationType: "TURNS",
        duration: 4,
        isDebuff: false,
    },
    {
        id: "闪避提升",
        name: "闪避提升",
        desc: "提升\${name}闪避 10",
        imm_ability: {
            evasion: 1.1
        },
        durationType: "TURNS",
        duration: 3,
        isDebuff: false,
    },
    {
        id: "乱气流",
        name: "乱气流",
        desc: "提高\${name}速度 20",
        imm_ability: {
            speed: 1.2
        },
        durationType: "TURNS",
        duration: 4,
        isDebuff: false,
    },
    {
        id: "暴击率提升",
        name: "暴击率提升",
        desc: "提升\${name}暴击率10%",
        imm_ability: {
            crit_rate: 1.1
        },
        durationType: "TURNS",
        duration: 3,
        isDebuff: false,
    },
    {
        id: "暴击伤害提升",
        name: "暴击伤害提升",
        desc: "提升\${name}暴击伤害30%",
        imm_ability: {
            crit_rate: 1.3
        },
        durationType: "TURNS",
        duration: 3,
        isDebuff: false,
    },
    {
        id: "减速",
        name: "减速",
        desc: "降低\${name}速度30%",
        imm_ability: {
            speed: 0.7
        },
        durationType: "TURNS",
        duration: 3,
        isDebuff: true,
    },
    {
        id: "防御降低",
        name: "防御降低",
        desc: "降低\${name}防御30%",
        imm_ability: {
            defense: 0.7
        },
        durationType: "TURNS",
        duration: 3,
        isDebuff: true,
    },
    {
        id: "巨斧头",
        name: "巨斧头",
        desc: "降低\${name}防御60%",
        imm_ability: {
            defense: 0.4
        },
        durationType: "TURNS",
        duration: 4,
        isDebuff: true,
    },
    {
        id: "无外流",
        name: "无外流",
        desc: "\${name}提升防御40%,每回合恢复生命值10%",
        imm_ability: {
            defense: 1.4
        },
        effects: [{
            id: "生命回复",
            value: 1.1,
        }
        ],
        durationType: "TURNS",
        duration: 4,
        isDebuff: false,
    },
    {
        id: "防御提升",
        name: "防御提升",
        desc: "提升\${name}防御40%",
        imm_ability: {
            defense: 1.4
        },
        durationType: "TURNS",
        duration: 3,
        isDebuff: false,
    },
    {
        id: "生命恢复",
        name: "生命恢复",
        desc: "每回合恢复生命值",
        effects: [{
            target: 'self',
            path: 'status',
            attr: 'hp',
            value: 1.1,
            operator: 'multiply',
        }],
        durationType: "TURNS",
        duration: 3,
        isDebuff: false,
    }
]

