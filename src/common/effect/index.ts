import { z } from "zod";
import { Character } from "../char/types";
import { effectsInit, conditionsInit } from "./data/effect";
import { AbilitySchema } from "../char/attr";
import assignIn from "lodash-es/assignIn";
import { keyBy } from "lodash-es";
import { ConditionOp, ConditionType } from "../event/types";

export function EffectManage(dataCon) {
    const effectsData = effectsInit
    const effectsMap = keyBy(effectsData, 'id')
    const conditionsData = conditionsInit
    const conditionsMap = keyBy(conditionsData, 'id')
    const cheak_condition_global = (condition: ConditionType) => {
        return ConditionOp(condition, (condition.path ? get(dataCon, condition.path) : dataCon)[condition.attr])
    }
    const cheak_condition_role = (condition: ConditionType, roleId: Character['id']) => {

        return ConditionOp(condition, (condition.path ? get(dataCon.roles_group[roleId], condition.path) : dataCon.roles_group[roleId])[condition.attr])
    }
    const cheak_conditions = (conditions) => {
        let trigger = true
        conditions.forEach(condition => {
            if (condition.id) {
                //TODO
                const replace = condition.replace
                condition = dataCon.EffectManage.conditionMaps[condition.id]
                if (replace) {
                    condition = assignIn(condition, replace)
                }
            }
            try {
                if (condition.target === 'global') {
                    trigger = cheak_condition_global(condition)
                } else {
                    trigger = cheak_condition_role(condition, condition.targetId || target!.id!)
                }
            } catch {
                trigger = false
            }
        });
        return trigger
    }
    return {
        effectsMap,
        effectsData,
        conditionsData,
        conditionsMap,
        cheak_conditions,
        cheak_condition_role,
        cheak_condition_global,
    }
}