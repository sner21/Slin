// import { LogsDataSchma } from "./type";
import keyBy from "lodash-es/keyBy";
import { BattleManager } from "../tatakai";
import { items_data } from "./data";
import { ItemBaseSchema } from "./type";
import { z } from "zod";
import { Character } from "../char/types";
import { ItemsDataSchema, Ability } from '../../common/char/types';
import assignIn from "lodash-es/assignIn";
import { EquipmentMap, equipments } from "../equip";
export function ItemsManager(zenkio: InstanceType<typeof BattleManager>) {
    //读取预设
    const ItemsData = z.record(ItemBaseSchema).parse(keyBy(items_data, 'id'))
    const ItemsDataArr = z.record(ItemBaseSchema).parse(keyBy(items_data, 'id'))
    const equipmentsData = equipments
    const equipmentsDataMap = EquipmentMap

    const use_item = (role: Character, id: string, index: string, cls: string) => {
        if (cls === "ITEM") {
            const item = ItemsData[id]
            item.effects.forEach(effect => {
                zenkio.exec_effect(role, effect)
            })
            item.buffs?.forEach(buff => {
                //TODO 判断是target
                zenkio.BuffManage.add_buff(role, buff.buffId)
            })
            role.carry.items[index].count -= 1
            if (role.carry.items[index].count <= 0) {
                Reflect.deleteProperty(role.carry.items, index)
            }
        } else {
            const item = equipmentsDataMap[id]
            const cache = equipmentsDataMap[role.carry.equipments[item.type]]
            role.carry.equipments[item.type] = item.id
            role.carry.items[index] = {
                id: cache.id,
                count: 1,
                cls: "EQUIP",
                type: cache.type,
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
        equipmentsData,
        equipmentsDataMap,
        use_item,
        load_plugins_item
    }
}