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