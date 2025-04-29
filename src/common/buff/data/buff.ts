
export const buff_init = [
    {
        id: "ack_up",
        name: "提升攻击力",
        description: "提升攻击力",
        effects: [{
            target: 'self',
            path: 'status',
            attr: 'attack',
            value: 25,
            operator: 'increase',
        }],
        durationType: "TURNS",
        duration: 3,
        isDebuff: false,
    }, {
        id: "彼岸蝶舞",
        name: "彼岸蝶舞",
        description: "提高\${name}的攻击力",
        effects: [{
            target: 'self',
            path: 'status',
            attr: 'attack',
            value: 40,
            operator: 'increase',
        }],
        durationType: "TURNS",
        duration: 9,
        isDebuff: false,
    }, {
        id: "speed_down",
        name: "减速",
        description: "降低速度",
        effects: [{
            target: 'self',
            path: 'status',
            attr: 'speed',
            value: -30,
            operator: 'increase',
        }],
        durationType: "TURNS",
        duration: 2,
        isDebuff: true,
    }, {
        id: "regeneration",
        name: "生命恢复",
        description: "每回合恢复生命值",
        effects: [{
            target: 'self',
            path: 'status',
            attr: 'hp',
            value: 8,
            operator: 'increase',
        }],
        durationType: "TURNS",
        duration: 5,
        isDebuff: false,
    }
]

