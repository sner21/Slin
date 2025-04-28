// import { LogsDataSchma } from "./type";
import keyBy from "lodash-es/keyBy";
import { BattleManager } from "../tatakai";
import { items_data } from "./data";
import { ItemBaseSchema } from "./type";
import { z } from "zod";
import { Character } from "../char/types";
import assignIn from "lodash-es/assignIn";
export function ItemsManager(zenkio: InstanceType<typeof BattleManager>) {
    //读取预设
    const ItemsData = z.record(ItemBaseSchema).parse(keyBy(items_data, 'id'))
    const use_item = (role: Character, id: string, index: string) => {
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
    }
    const load_plugins_item = (data: ItemBaseSchema[]) => {
        data.forEach(i => {
            ItemsData[i.id] = assignIn(ItemsData[i.id], i)
        })
    }
    return {
        ItemsData,
        use_item,
        load_plugins_item
    }
}