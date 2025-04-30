import { z } from "zod";
import { Character } from "../char/types";
import { buff_init } from "./data/buff";
import { AbilitySchema } from "../char/attr";
import assignIn from "lodash-es/assignIn";
import { keyBy } from "lodash-es";
import { BuffSchema } from "./type";


export function BuffManage(dataCon) {
    const buff_data = z.array(BuffSchema).parse(buff_init)
    const buff_map = keyBy(buff_data, 'id')
    const add_buff = (self: Character, role: Character, id: string) => {
        const buff = buff_map[id]
        if (!buff) {
            return
        }
        // if (buff.multiplier) {
        //     let { damage } = dataCon.settle_damage(self, role, {
        //         element: buff.element || self.element,
        //         damageType: buff.damageType,
        //         multiplier: buff.multiplier * i.count,
        //     })
        //     dataCon.settle_damage_role(self, role, damage, buff.not_lethal)
        // }
        if (!role.buff[id]) {
            role.buff[id] = {
                id: buff.id,
                duration: buff.duration,
                count: 0,
                self: {
                    type: Number(self.type),
                    name: self.name,
                    id: self.id
                }
            }
        }
        switch (buff.durationType) {
            case 'OVERLAY': {
                role.buff[id].count += 1
                role.buff[id].duration = buff.duration
                break
            }
            case 'PERMANENT-OVERLAY': {
                role.buff[id].count += 1
                break
            }
            case 'TURNS': {
                role.buff[id].count = 1
                role.buff[id].duration = buff.duration
                break
            }
            case 'PERMANENT': {
                role.buff[id].count = 1
                break
            }
        }

    }
    const load_plugins_buff = (data: any[]) => {
        data.forEach(i => {
            buff_map[i.id] = assignIn(buff_map[i.id], i)
        })
    }
    const settle_buff = (role: Character) => {
        Object.keys(role.buff || {}).forEach(k => {
            const i = role.buff[k]
            const buff = buff_map[i.id]
            if (!buff) {
                return
            }
            if (buff.imm_ability) {
                Object.keys(buff.imm_ability).forEach(key => {
                    role.imm_ability[key] = Math.round((role.imm_ability[key] || 0) + (buff.imm_ability[key] || 0) * i.count);
                })
            }
            if (buff.multiplier) {
           
                const self = dataCon.roles_group[i.self.id]
                let { damage } = dataCon.settle_damage(self, role, {
                    element: buff.element || self.element,
                    damageType: buff.damageType,
                    multiplier: buff.multiplier * i.count,
                })
                dataCon.settle_damage_role(self, role, damage, buff.not_lethal||true)
            }
            buff.effects.forEach(effect => {
                dataCon.exec_effect(role, effect, null, i.count)
            })
            if (buff.durationType === "TURNS" || buff.durationType === "OVERLAY" && i.duration) {
                i.duration = i.duration - 1
                if (i.duration <= 0) {
                    i.count && (i.count -= 1)
                    !i.count && Reflect.deleteProperty(role.buff!, i.id)
                }
            }
        })
    }
    return {
        settle_buff,
        buff_map,
        buff_data,
        add_buff,
        load_plugins_buff
    }
}
// Buff示例
// const buffExamples = {
//     // 攻击力提升Buff
//     attackBuff: {
//         id: 'attack_up_1',
//         name: '攻击力提升',
//         type: 'ATTACK_UP',
//         desc: '提升攻击力',
//         value: 25,
//         isPercentage: true,
//         durationType: 'TURNS',
//         duration: 3,
//         isStackable: true,
//         maxStacks: 3,
//         currentStacks: 1,
//         isDebuff: false
//     } as Buff,

//     // 元素精通提升
//     elemMasteryBuff: {
//         id: 'elem_mastery_up_1',
//         name: '元素精通提升',
//         type: 'ELEM_MASTERY_UP',
//         desc: '提升元素精通',
//         value: 50,
//         isPercentage: false,
//         durationType: 'TURNS',
//         duration: 2,
//         isStackable: false,
//         currentStacks: 1,
//         isDebuff: false
//     } as Buff,

//     // 燃烧Debuff
//     burningDebuff: {
//         id: 'burning_1',
//         name: '燃烧',
//         type: 'BURNING',
//         desc: '每回合受到火元素伤害',
//         value: 30,
//         isPercentage: false,
//         durationType: 'TURNS',
//         duration: 2,
//         isStackable: false,
//         currentStacks: 1,
//         isDebuff: true,
//         element: 'fire'
//     } as Buff
// };