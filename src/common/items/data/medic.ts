import { get_svg_uri } from "../..";
import { ItemBaseSchema } from "../type";

export const items_medic = [
    // {
    //     id: "uuid",
    //     name: "技能",
    //     cost: 50,
    //     effects: [{
    //         target: 'self',
    //         attr: 'skill',
    //         value: "skill_id",
    //         operator: 'push',
    //     }],
    //     icon: get_svg_uri(1, import.meta.url, 'item'),
    //     type: 'skill_book',
    //     desc: "技能书",
    // },
    {
        id: "1",
        name: "生命药水",
        cost: 50,
        effects: [{
            target: 'self',
            path: 'status',
            attr: 'hp',
            value: 100,
            operator: 'increase',
        }],
        buffs: [{
            id: 'zs',
        }],
        icon: get_svg_uri(23, import.meta.url, 'item'),
        type: 'medic',
        desc: "生命药水",
    },
    {
        id: "4",
        name: "全能药剂",
        cost: 50,
        effects: [
            {
                target: 'self',
                path: 'status',
                attr: 'hp',
                value: 200,
                operator: 'increase',
            },
            {
                target: 'self',
                path: 'status',
                attr: 'mp',
                value: 100,
                operator: 'increase',
            }
        ],
        buffs: [{
            id: 'power_up',
        }],
        icon: get_svg_uri(13, import.meta.url),
        type: 'medic',
        desc: "恢复大量生命值和魔法值，并提升攻击力",
    },
    {
        id: "med_001",
        name: "小型生命药水",
        cost: 50,
        effects: [{
            target: 'self',
            path: 'status',
            attr: 'hp',
            value: 50,
            operator: 'increase',
        }],
        icon: get_svg_uri(10, import.meta.url),
        type: 'medic',
        desc: "恢复50点生命值",
    },
    {
        id: "med_002",
        name: "中型生命药水",
        cost: 50,
        effects: [{
            target: 'self',
            path: 'status',
            attr: 'hp',
            value: 150,
            operator: 'increase',
        }],
        buffs: [{
            id: 'hp_regen',
            type: 'target'
        }],
        icon: get_svg_uri(11, import.meta.url),
        type: 'medic',
        desc: "恢复150点生命值，并获得持续回复效果",
    },
    {
        id: "med_003",
        name: "魔力恢复药剂",
        cost: 50,
        effects: [{
            target: 'self',
            path: 'status',
            attr: 'mp',
            value: 80,
            operator: 'increase',
        }],
        buffs: [{
            id: 'mp_regen',
            type: 'target'
        }],
        icon: get_svg_uri(12, import.meta.url),
        type: 'medic',
        desc: "恢复80点魔法值，并获得魔力回复效果",
    },
    {
        id: "med_005",
        name: "战斗药剂",
        cost: 50,
        effects: [{
            target: 'self',
            path: 'status',
            attr: 'hp',
            value: 100,
            operator: 'increase',
        }],
        buffs: [
            {
                id: 'attack_up',
                type: 'target'
            },
            {
                id: 'defense_up',
                type: 'target'
            }
        ],
        icon: get_svg_uri(14, import.meta.url),
        type: 'medic',
        desc: "恢复100点生命值，并提升攻击力和防御力",
    }
]