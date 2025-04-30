// import { LogsDataSchma } from "./type";
import keyBy from "lodash-es/keyBy";
import groupBy from "lodash-es/groupBy";
import { BattleManager } from "../tatakai";
import { items_data } from "./data";
import { ItemBaseSchema } from "./type";
import { z } from "zod";
import { Character } from "../char/types";
import { ItemsDataSchema, Ability } from '../../common/char/types';
import assignIn from "lodash-es/assignIn";
import { EquipmentMap, equipments } from "../equip";
import { SkillData } from "../skill";
import { get_svg_uri } from "..";
export function ItemsManager(zenkio: InstanceType<typeof BattleManager>) {
    const a = SkillData.filter(i => i.type !== 'NORMAL_ATTACK').map(i => {
        return {
            id: i.id + '_book',
            name: i.name + "技能书",
            type: 'skill_book',
            cost: 100,
            effects: [{
                target: 'self',
                attr: 'skill',
                value: i.id,
                operator: 'push',
            }],
            icon: get_svg_uri(1, import.meta.url, 'item'),
        }
    })
    //读取预设
    const ItemsData = z.record(ItemBaseSchema).parse(keyBy(items_data.concat(a), 'id'))
    const ItemsDataGroup = z.record(z.array(ItemBaseSchema)).parse(groupBy(items_data.concat(a), 'type'))
    //TODO 
    const equipmentsData = equipments
    const equipmentsDataGroup = groupBy(equipments, 'type')


    const equipmentsDataMap = EquipmentMap

    const use_item = (role: Character, id: string, index: string, cls: string) => {
        if (cls === "ITEM") {
            const item = ItemsData[id]
            item.effects.forEach(effect => {
                //对自己使用
                zenkio.exec_effect(role, effect, role)
            })
            item.buffs?.forEach(buff => {
                //TODO 判断是target
                zenkio.BuffManage.add_buff(role, buff.id)
            })
            role.carry.items[index].count -= 1
            if (role.carry.items[index].count <= 0) {
                Reflect.deleteProperty(role.carry.items, index)
            }
        } else {
            const item = equipmentsDataMap[id]
            const cache = equipmentsDataMap[role.carry.equipments[item.type]]
            console.log(cache, 11)
            role.carry.equipments[item.type] = item.id
            if (cache?.id) {
                role.carry.items[index] = {
                    id: cache.id,
                    count: 1,
                    cls: "EQUIP",
                    type: cache.type,
                }
            } else {
                role.carry.items[index] = null
            }

        }

    }
    // buy_
    const load_plugins_item = (data: ItemBaseSchema[]) => {
        data.forEach(i => {
            ItemsData[i.id] = assignIn(ItemsData[i.id], i)
        })
    }
    return {
        ItemsData,
        ItemsDataGroup,
        equipmentsData,
        equipmentsDataMap,
        use_item,
        load_plugins_item,
        equipmentsDataGroup
    }
}