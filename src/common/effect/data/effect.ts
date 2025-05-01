import { effectsSchema } from "../../char/attr"


export const effectsInit: effectsSchema = [
    {
        id: "initial",
        name: "initial",
        desc: "initial",
        isBuff: true,
        path: "status",
        target: 'self',
        attr: "hp",
        value: 0.8,
        operator: "multiply",
        conditions: [
            {
                operator: 'GT',
                path: "status",
                target: 'self',
                attr: "hp",
                value: 100
            }
        ]
    },
    {
        id: "dizz",
        name: "dizz",
        desc: "dizz",
        isBuff: true,
        path: "status",
        target: 'target',
        attr: "dizz",
        value: 1,
        operator: "equal",
    },
    {
        id: "暴击率提升",
        name: "暴击率提升",
        desc: "暴击率提升",
        isBuff: true,
        path: "status",
        target: 'target',
        attr: "crit_rate",
        value: 1.1,
        operator: "multiply",
    },
    {
        id: "暴击伤害提升",
        name: "暴击伤害提升",
        desc: "暴击伤害提升",
        isBuff: true,
        path: "status",
        target: 'target',
        attr: "crit_rate",
        value: 1.2,
        operator: "multiply",
    },
    {
        id: "速度提升",
        name: "速度提升",
        desc: "速度提升",
        isBuff: true,
        path: "status",
        target: 'target',
        attr: "speed",
        value: 1.1,
        operator: "multiply",
    },
    {
        id: "防御提升",
        name: "防御提升",
        isBuff: true,
        path: "imm_ability",
        target: 'self',
        attr: "defense",
        value: 1.4,
        operator: "multiply",
    },
    {
        id: "生命回复",
        name: "生命回复",
        target: 'self',
        path: 'status',
        attr: 'hp',
        value: 1.1,
        operator: 'multiply',
    }
]
export const conditionsInit = [
    {
        id: "initial",
        name: "initial",
        desc: "initial",
        target: 'target',
        operator: 'EQ',
        value: '2',
        attr: 'gender',
        path: '',
    }
]