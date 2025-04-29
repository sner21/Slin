import { markRaw, reactive } from "vue";
import { fixedPush, randomInt } from "..";
import { effectsSchema } from "../char/attr";
import { Character } from "../char/types";
import { EventSchema } from "../record/type";
import { BATTLE_EVENTS, events } from './data';
import { checkCondition, EventData, CheckCondition } from "./types";
import get from 'lodash-es/get'
import set from 'lodash-es/set'
import assignIn from "lodash-es/assignIn";
export function EventManager(dataCon) {
    const event_info = {
        round: 0,
        gap: 3,
        fluc: 2,
    }
    const events = BATTLE_EVENTS
    let event_list = Object.values(events)
    // const roles = dataCon.roles
    // const roles_group = dataCon.roles_group
    const global_effects: effectsSchema[] = []

    //随机获取事件
    const get_random_event = () => {
        const random_event = randomInt(0, event_list.length - 1)
        const event = event_list[random_event]
        return event
    }
    //随机事件
    const trigger_random_event = (round: number) => {
        const event = get_random_event()
        cheak_event(event, round)
    }
    const load_plugins_event = (data: any[]) => {
        data.forEach(i => {
            events[i.id] = assignIn(events[i.id], i)
        })
        event_list = Object.values(events)
    }
    const cheak_gap = (round: number) => {
        if (round <= event_info.gap) {
            return false
        } else {
            event_info.gap = round + event_info.gap + randomInt(0, event_info.fluc)
            return true
        }
    }
    //执行事件
    const cheak_event = (event: EventData, round: number, target: Character | null = null) => {
        if (!cheak_gap(round)) {
            return
        }
        const targets = [...dataCon.cur_characters, ...dataCon.cur_enemy].filter(i => i.type === "0")
        if (!target) {
            const index = randomInt(0, targets.length - 1)
            target = targets[index]
        }
        let trigger = true

        if (event.conditions) {
            event.conditions.forEach(condition => {
                try {
                    if (condition.target === 'global') {
                        trigger = cheak_condition_global(condition)
                    } else {
                        trigger = cheak_condition_role(condition, condition.targetId || target!.id!)
                    }
                } catch {
                    console.log('事件检查失败', event.id, target!.name);
                    trigger = false
                }

            });

        }
        if (trigger) {
            trigger_event(event, target!.id!)
            event.buffs?.forEach(e => {
                dataCon.BuffManage.add_buff(target, e.id || e)
            })
            // 添加调试日志
            //事件日志记录
            const a = EventSchema.parse({
                timestamp: Date.now(),
                round: dataCon.battle_data.round,  //回合数
                logs_type: 'event',
                description: event.description,
                eventId: event.id,
                target: {
                    type: target!.type,
                    name: target!.name,
                    id: target!.id.toString(),
                },
                hidden: event.hidden
            })
            dataCon.RecordManager.fixedPush(dataCon.RecordManager.logsDataSchma, 'event', a)
            // const at = {
            //     logs_type: 'tatakai',
            //     skillId: 'hutao_skill',
            //     skillType: 'ELEMENTAL_SKILL',
            //     skillName:'蝶引来生',
            //     sourceId: 1,          // 攻击方ID
            //     targetId: 2,          // 目标ID
            //     round: 5,
            //     damage: {
            //         hp: 20,
            //     },
            //     cost: {},
            //     isCrit:false,
            //     effectType: "DAMAGE",
            //     timestamp: Date.now(),
            //     attacker: {
            //         type: 2,
            //         id: 1
            //     },
            //     defender: {
            //         type: 2,
            //         id: 2
            //     }
            // }
            // dataCon.RecordManager.fixedPush(dataCon.RecordManager.logsDataSchma, 'tatakai', at)
            // //TODO 副作用记录 
            // global_effects.concat(event.effects)
        }
    }
    //执行事件
    const trigger_event = (event: EventData, targetId: Character['id']) => {
        event.effects.forEach(effect => {
            if (effect.target === 'global') {
                dataCon.exec_effect(dataCon, effect)
            } else {
                dataCon.exec_effect(dataCon.roles_group[effect.targetId] || dataCon.roles_group[targetId], effect)
            }
        })
    }
    //检查事件
    const cheak_condition_global = (condition: CheckCondition) => {
        return checkCondition(condition, (condition.path ? get(dataCon, condition.path) : dataCon)[condition.attr])
    }
    const cheak_condition_role = (condition: CheckCondition, roleId: Character['id']) => {

        return checkCondition(condition, (condition.path ? get(dataCon.roles_group[roleId], condition.path) : dataCon.roles_group[roleId])[condition.attr])
    }
    return {
        trigger_event,
        trigger_random_event,
        get_random_event,
        cheak_condition_global,
        cheak_condition_role,
        cheak_event,
        load_plugins_event,
        events
    }
}