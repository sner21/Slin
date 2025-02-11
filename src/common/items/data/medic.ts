import { get_svg_uri } from "../..";
import { ItemBaseSchema } from "../type";

export const items_medic = [
    {
        itemId: "1",
        name: "生命药水",
        effects: [{
            target: 'attacker',
            path: 'status',
            attr: 'hp',
            value: 100,
            operator: 'increase',
        }],
        buffs: [{
            buffId: 'zs',
        }],
        icon: get_svg_uri(23, import.meta.url, 'item'),
        type: 'medic',
        description: "生命药水",
    },
    {
        itemId: "4",
        name: "全能药剂",
        effects: [
            {
                target: 'attacker',
                path: 'status',
                attr: 'hp',
                value: 200,
                operator: 'increase',
            },
            {
                target: 'attacker',
                path: 'status',
                attr: 'mp',
                value: 100,
                operator: 'increase',
            }
        ],
        buffs: [{
            buffId: 'power_up',
        }],
        icon: get_svg_uri(13, import.meta.url),
        type: 'medic',
        description: "恢复大量生命值和魔法值，并提升攻击力",
    },
    {
        itemId: "med_001",
        name: "小型生命药水",
        effects: [{
            target: 'attacker',
            path: 'status',
            attr: 'hp',
            value: 50,
            operator: 'increase',
        }],
        icon: get_svg_uri(10, import.meta.url),
        type: 'medic',
        description: "恢复50点生命值",
    },
    {
        itemId: "med_002",
        name: "中型生命药水",
        effects: [{
            target: 'attacker',
            path: 'status',
            attr: 'hp',
            value: 150,
            operator: 'increase',
        }],
        buffs: [{
            buffId: 'hp_regen',
            type: 'target'
        }],
        icon: get_svg_uri(11, import.meta.url),
        type: 'medic',
        description: "恢复150点生命值，并获得持续回复效果",
    },
    {
        itemId: "med_003",
        name: "魔力恢复药剂",
        effects: [{
            target: 'attacker',
            path: 'status',
            attr: 'mp',
            value: 80,
            operator: 'increase',
        }],
        buffs: [{
            buffId: 'mp_regen',
            type: 'target'
        }],
        icon: get_svg_uri(12, import.meta.url),
        type: 'medic',
        description: "恢复80点魔法值，并获得魔力回复效果",
    },
    {
        itemId: "med_005",
        name: "战斗药剂",
        effects: [{
            target: 'attacker',
            path: 'status',
            attr: 'hp',
            value: 100,
            operator: 'increase',
        }],
        buffs: [
            {
                buffId: 'attack_up',
                type: 'target'
            },
            {
                buffId: 'defense_up',
                type: 'target'
            }
        ],
        icon: get_svg_uri(14, import.meta.url),
        type: 'medic',
        description: "恢复100点生命值，并提升攻击力和防御力",
    }
]