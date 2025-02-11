import { z } from "zod";
import { BuffSchema } from "../type";


export const buff_data = z.record(BuffSchema).parse({
    'strength_up': {
        id: "strength_up",
        name: "力量增强",
        description: "提升攻击力",
        effects: [{
            target: 'attacker',
            path: 'status',
            attr: 'attack',
            value: 15,
            operator: 'increase',
        }],
        durationType: "TURNS",
        duration: 3,
        isDebuff: false,
    },
    'speed_down': {
        id: "speed_down",
        name: "减速",
        description: "降低速度",
        effects: [{
            target: 'attacker',
            path: 'status',
            attr: 'speed',
            value: -30,
            operator: 'increase',
        }],
        durationType: "TURNS",
        duration: 2,
        isDebuff: true,
    },
    'regeneration': {
        id: "regeneration",
        name: "生命恢复",
        description: "每回合恢复生命值",
        effects: [{
            target: 'attacker',
            path: 'status',
            attr: 'hp',
            value: 8,
            operator: 'increase',
        }],
        durationType: "TURNS",
        duration: 5,
        isDebuff: false,
    }
})