import { z } from "zod";
import { Character } from "../char/types";
import { buff_data } from "./data/buff";
import { AbilitySchema } from "../char/attr";
import assignIn from "lodash-es/assignIn";


export function BuffManage(dataCon) {
    const buff_default = {
        ...buff_data,
    }

    const add_buff = (role: Character, buffId: string, source = undefined) => {
        const buff = buff_default[buffId]
        if (!buff) {
            return
        }
        if (!role.buff[buffId]) {
            role.buff[buffId] = {
                buffId: buff.id,
                duration: buff.duration,
                count: 0,
                source,
            }
        }
        switch (buff.durationType) {
            case 'OVERLAY': {
                role.buff[buffId].count += 1
                role.buff[buffId].duration = buff.duration
                break
            }
            case 'PERMANENT-OVERLAY': {
                role.buff[buffId].count += 1
                break
            }
            case 'TURNS': {
                role.buff[buffId].count = 1
                role.buff[buffId].duration = buff.duration
                break
            }
            case 'PERMANENT': {
                role.buff[buffId].count = 1
                break
            }
        }
    }
    const load_plugins_buff = (data: any[]) => {
        data.forEach(i => {
            buff_default[i.id] = assignIn(buff_default[i.id], i)
        })
    }
    const settle_buff = (role: Character) => {
        Object.keys(role.buff || {}).forEach(k => {
            const i = role.buff[k]
            const buff = buff_default[i.buffId]
            if (!buff) {
                return
            }
            if (buff.imm_ability) {
                Object.keys(buff.imm_ability).forEach(key => {
                    role.imm_ability[key] = Math.round((role.imm_ability[key] || 0) + (buff.imm_ability[key] || 0) * i.count);
                })
            }
            //TODO 计算伤害来源 的伤害 i
            buff.effects.forEach(effect => {
                dataCon.exec_effect(role, effect, i.count)
            })
            if (buff.durationType === "TURNS" || buff.durationType === "OVERLAY" && i.duration) {
                i.duration = i.duration - 1
                if (i.duration <= 0) {
                    i.count && (i.count -= 1)
                    !i.count && Reflect.deleteProperty(role.buff!, i.buffId)
                }
            }
        })
    }
    return {
        settle_buff,
        buff_default,
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
//         description: '提升攻击力',
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
//         description: '提升元素精通',
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
//         description: '每回合受到火元素伤害',
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