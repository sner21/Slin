export const effectsInit = [
    {
        id: "initial",
        name: "initial",
        description: "initial",
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
]
export const conditionsInit = [
    {
        id: "initial",
        name: "initial",
        description: "initial",
        target: 'target',
        operator: 'EQ',
        value: '2',
        attr: 'gender',
        path: '',
    }
]