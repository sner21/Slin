import { Character, Action, Ability, CharacterSaveSchema, CharacterSchema } from "../char/types";
import { bb, BB, initialData } from "../char";
import { Skill, SkillMap } from "../skill";
import { EquipmentMap } from "../equip";
import { CooldownManager } from "../skill/cooldown";
import { ActionGauge } from "./action";
import { ref, Ref } from "vue";
import { DataCon } from "../data/dataCon";
import { effectsSchema, EffectsSchema } from '../char/attr';
import { fixedPush, randomInt } from "..";
import { EventManager } from "../event";
import { BattleActionSchema } from "../record/type";
import get from "lodash-es/get";
import keyBy from "lodash-es/keyBy";
import { RecordManager } from "../record/record";
import { ItemsManager } from "../items";
import { BuffManage } from "../buff";
import { PluginsDataSchma } from "../plugins/";


import assignIn from "lodash-es/assignIn";
// 战斗管理器
export class BattleManager {
    round_timer: any
    time_timer: any
    roles_group;
    cooldownManager: CooldownManager;
    actionGauge: ActionGauge;
    EventManager
    BuffManage
    RecordManager
    ItemsManager
    enemy: Character[]
    cur_enemy: Character
    characters: Character[];
    roles: Character[] = [];
    data: Ref<Character[]>;
    globalConfig: any = {};
    battle_data: any = {
        cur_time: 0,
        pause: false,
        round: 0,
        time: 5000,
        cur_boss_id: '',
    };
    battle_id = 'init'

    constructor(data: DataCon) {
        this.data = data
        this.characters = data.characters
        //TODO 改为从ID
        this.init_role()
        this.RecordManager = RecordManager(this)
        this.BuffManage = BuffManage(this)
        this.EventManager = EventManager(this)
        this.cooldownManager = new CooldownManager();
        this.actionGauge = new ActionGauge();
        this.ItemsManager = ItemsManager(this);
        this.globalConfig = data.globalConfig;
        this.data.battleManagerGourp[this.battle_id] = this
        const info = data.battle_data_info && data.battle_data_info[this.battle_id]
        if (info) {
            this.battle_data = info.battle_data
            this.cooldownManager.cooldowns = info.cooldowns
            this.cur_enemy = info.cur_enemy || data.enemy[0]
        }
        this.cur_enemy = this.battle_data.cur_boss_id ? this.roles_group[this.battle_data.cur_boss_id] : this.get_boss()
        this.battle_data.cur_boss_id = this.cur_enemy.id
        this.load_plugins_init().then(() => {
            this.start_round()
        })
        console.log(this.roles, this.enemy, 'boss');

        // data.current = this
        // return this

    }
    init_role() {
        this.enemy = this.data.enemy
        this.roles = this.data.roles
        this.roles_group = this.data.roles_group
    }
    load_plugins_role(data) {
        data.forEach(i => {
            console.log(i, 11);
            this.characters[i.id] = assignIn(this.characters[i.id], i)
            switch (i.type) {
                case "0": {
                    this.roles[i.id] = assignIn(this.roles[i.id], i)
                    break
                }
                case "1": {
                    this.enemy[i.id] = assignIn(this.enemy[i.id], i)
                    break
                }
            }

        })

        this.roles_group = keyBy(this.roles, "id")
    }
    async load_plugins_init() {
        import('../plugins/').then(res => {
            const data = res.plugins_data
            this.EventManager.load_plugins_event(data.event)
            this.BuffManage.load_plugins_buff(data.buff)
            this.ItemsManager.load_plugins_item(data.item)
        })
        Object.keys(localStorage).forEach(k => {
            if (k.startsWith('plugin-')) {
                const data = PluginsDataSchma.parse(JSON.parse(localStorage.getItem(k)))
                this.EventManager.load_plugins_event(data.event || [])
                this.BuffManage.load_plugins_buff(data.buff || [])
                this.ItemsManager.load_plugins_item(data.item || [])
                this.load_plugins_role(data.role || [])
            }
        })
    }
    async load_plugins(data: any) {

        this.EventManager.load_plugins_event(data.event || [])
        this.BuffManage.load_plugins_buff(data.buff || [])
        this.ItemsManager.load_plugins_item(data.item || [])
        this.init_role(data.role)
    }
    start_round(time = this.battle_data.time) {
        if (!this.battle_data.pause) {
            this.battle_turn()
            this.battle_data.cur_time = 0
            if (!this.time_timer) {
                this.time_timer = this.computed_time()
            }

            if (typeof this.round_timer === 'number') {
                clearTimeout(this.round_timer)
            }

            this.round_timer = setTimeout(() => {
                if (!this.battle_data.pause) {
                    this.start_round()
                }
            }, time)
        }
    }
    get_boss(filterId: string = '') {
        const ne = this.enemy.filter((i: { id: string; }) => i.id !== filterId)
        const index = randomInt(0, ne.length - 1)
        return ne[index] || this.enemy[0]
    }
    forward_round() {
        this.battle_turn()
    }
    computed_time() {
        return setInterval(() => {
            this.battle_data.cur_time += 100
        }, 100)
    }
    destroy() {
        this.pause_round()
        this.round_timer = null
        this.time_timer = null
    }
    pause_round() {
        this.battle_data.pause = true
        clearTimeout(this.round_timer)
        clearInterval(this.time_timer)
    }
    // 初始化战斗
    initBattle(characters: Character[]) {
        this.enemy.forEach(i => {
            this.calculateFinalStats(i)
            this.actionGauge.initCharacter(i.id, i.imm_ability.speed);
            this.cooldownManager.initCharacter(i.id);
        })
        characters.forEach(char => {
            this.calculateFinalStats(char)
            this.actionGauge.initCharacter(char.id, char.imm_ability.speed);
            this.cooldownManager.initCharacter(char.id);
        });
    }
    //结算角色当前数据
    set_role_status(char: Character) {
        if (!char.status) return
        //判断HP是否死亡
        if (char.state === 1) {
            char.status.reborn -= 1
            if (char.status.reborn <= 0) {
                char.status.hp = char.imm_ability.hp
                char.state = 0
            }
            if (char.type === 1) {
                this.cur_enemy = this.get_boss(this.cur_enemy.id)
                this.cur_enemy.status.hp = char.imm_ability.hp
                this.cur_enemy.state = 0
            }
        }
        //判断HP是否归0
        if (!char.ability.reborn && char.status.hp <= 0) {
            char.status.hp = 0
            char.state = 1
            char.status.reborn = char.ability.reborn
        }
        if (char.state === 0) {
            // 处理所有角色的回复
            char.status.hp = Math.min(char.status.hp + char.imm_ability.hp_re, char.imm_ability.hp)
            char.status.mp = Math.min(char.status.mp + char.imm_ability.mp_re, char.imm_ability.mp)
        }
    }
    //随机选择1个攻击目标
    random_attack_select(data: any[], count = 0) {
        const index = randomInt(0, data.length - 1);
        const t = this.characters[index];
        while (t.status.hp <= 0) {
            count += 1
            if (count >= data.length) {
                return {
                    char: null,
                    index: 0
                }
            }
            this.random_attack_select(data, count)
        }
        return t
    }
    //随机搜寻目标
    get_target(role: Character, enmey: Character[]) {
        const e = enmey[randomInt(0, enmey.length - 1)]
        role.target = e
    }
    //战斗
    battle_turn() {
        this.startTurn()
        // 获取当前回合可行动的角色
        const actionOrder = this.getActionOrder(this.roles);
        const actionOrderId = actionOrder.map(i => i.id)
        // console.log("可以行动的角色", actionOrderId)

        for (const key in actionOrder) {
            const i = actionOrder[key]

            //计算角色属性
            if (actionOrderId.includes(i.id)) {

                if (i.type === 1) { // boss
                    this.get_target(i, this.characters)
                    this.useSkill(i, i.target, i.normal)
                } else {
                    if (bb.state === 1) break
                    this.get_target(i, this.enemy)
                    //普攻
                    this.useSkill(i, i.target, i.normal)
                    //释放技能
                    this.get_round_ack(i, i.target)
                }
                // 标记行动完成
                this.finishAction(i);
            }
            console.log(444);
            //获取所有角色事件
            this.total_event(i)
        }
        this.endTurn()
        // console.log(this.tatakai_logs, "总事件")
    }

    // 获取当前回合可行动的角色
    getActionOrder(characters: Character[]): Character[] {
        // 更新所有角色的行动条
        this.actionGauge.updateGauges(characters);
        // 获取可以行动的角色

        const readyCharacters = this.actionGauge.getReadyCharacters(characters);
        // 按速度排序
        return readyCharacters.sort((a, b) => b.imm_ability.speed - a.imm_ability.speed);
    }

    //检查并更新cost 获取当前一轮要释放的技能
    get_round_ack(char: Character, bb: Character) {
        char.skill?.forEach(id => {
            this.useSkill(char, bb, id)
        })
    }
    // 计算所有角色最终属性的函数
    calculateFinalStatsAll(type = 'all') {
        this.characters.forEach(i => {
            this.calculateFinalStats(i)
        })
    }
    //计算副作用
    exec_effect(target: Character | typeof this, effect: effectsSchema, count = 1) {
        let { path, find, operator, attr, value, sourceId, targetId } = effect
        let data = path ? get(target, path) : target
        if (find) {
            data = data.find((i: any) => i[find.attr] === find.value)
        }
        if (!data) return console.log(target + "没有属性" + path, data);
        if (typeof value === "number") {
            value = value * count
        }
        // console.log(target?.name + operator + path + attr + value);
        switch (operator) {
            case "increase": {
                data[attr] += value
                break
            }
            case "decrease": {
                data[attr] -= value
                break
            }
            case "push": {
                data.push(value)
                break
            }
            case "assign": {
                data[attr] = value
                break
            }
            case "equal": {
                data[attr] = value
                break
            }
            case "splice": {
                data[attr](value)
                break
            }
        }
        if (effect.attr === 'hp' && effect.target === 'defender' && sourceId && targetId && target !== 'global') {
            this.compute_damage(sourceId, targetId, value)
        }
    }
    //计算贡献
    compute_damage(sourceId: string | number, targetId: string | number, value: number) {
        this.roles_group[sourceId].status.damage += value
        this.roles_group[sourceId].carry.currency += (value * this.roles_group[targetId].grow.rarity * this.roles_group[targetId].grow.level / 1000000)
        //TODO ? 临时经验
        // this.roles_group[sourceId].grow.tem_exp += (value * this.roles_group[targetId].grow.rarity)
    }
    // 计算角色最终属性的函数
    calculateFinalStats(character: Character) {
        // 基础属性
        let stats: Character['ability'] = { ...character.ability };
        const { level, rarity, growthRates } = character.grow
        // 先计算基础三维属性影响的派生属性
        growthRates && Object.keys(growthRates).forEach(k => {
            stats[k] += level * rarity / 50 * (growthRates && growthRates[k] || 0)
        })
        // 计算派生属性
        stats = {
            ...stats,
            // 生命相关
            hp: stats.hp + stats.strength * 1.5,                    // 力量影响生命上限
            hp_re: stats.hp_re + stats.strength * 0.02,            // 力量影响生命回复
            // 攻击相关
            attack: stats.attack + stats.strength * 0.2,            // 法术攻击加成
            defense: stats.defense + stats.strength * 0.1,           // 力量影响防御
            // 敏捷相关
            speed: stats.speed + stats.agility * 0.2,               // 敏捷影响速度
            evasion: stats.evasion + stats.agility * 0.015,        // 敏捷影响闪避
            crit_rate: stats.crit_rate + stats.agility * 0.02,     // 敏捷影响暴击率
            crit_dmg: stats.crit_dmg + stats.agility * 0.05,       // 敏捷影响暴击伤害
            // 智力相关
            mp: stats.mp + stats.intelligence * 1,        // 智力影响能量值
            mp_re: stats.mp_re + stats.intelligence * 0.03, // 智力影响能量回复
            elem_bonus: stats.elem_bonus + stats.intelligence * 0.05,   // 智力影响元素伤害
            // 抗性相关
            fire_res: stats.fire_res + stats.strength * 0.02,      // 力量影响火抗
            ice_res: stats.ice_res + stats.strength * 0.02,        // 力量影响冰抗
            lightning_res: stats.lightning_res + stats.strength * 0.02, // 力量影响雷抗
            // 特殊加成
            healing_bonus: stats.healing_bonus + stats.intelligence * 0.05, // 智力影响治疗加成
            shield_strength: stats.shield_strength + stats.strength * 0.03  // 力量影响护盾强度
        };
        // 叠加装备属性
        if (character.carry.equipments) {
            Object.values(character.carry.equipments).forEach(equipId => {
                if (equipId && EquipmentMap[equipId]) {
                    const equip = EquipmentMap[equipId];
                    // 叠加装备属性
                    Object.entries(equip.stats).forEach(([key, value]) => {
                        stats[key] = Math.round((stats[key] || 0) + value);
                    });
                }
            });
        }

        for (let key in stats) {
            stats[key] = Math.round((stats[key] || 0));
        }
        let key: keyof typeof character.status
        for (key in character.status) {
            if (key === 'description') continue
            const rate = character.status[key] / (character.imm_ability[key] || character.ability[key] || 0)
            character.status[key] += ((stats[key] - (character.imm_ability[key] || character.ability[key])) * rate) || 0
            // stats[key] = Math.round((stats[key] || 0));
        }
        character.imm_ability = stats
        //叠加BUFF属性
        this.BuffManage.settle_buff(character)
    }
    // 结算攻击
    char_attack(attacker: Character, defender: Character, skill: Skill) {
        //削减当前数值 ?  除了boss可以删掉
        let damage = 0
        let isEvaded = false
        let isCrit = false
        isCrit = Math.random() * 100 <= attacker.ability.crit_rate;
        //计算伤害
        if (skill.damageType === 'physical') {
            damage = attacker.imm_ability.attack * (skill.multiplier || 100) / 100
            damage = char_attack_physical(attacker, defender, damage)
        } else {
            damage = attacker.imm_ability.elem_bonus * (skill.multiplier || 100) / 100
            damage = char_attack_magic(attacker, defender, damage)
        }
        //元素适应性加成
        if (skill.element === attacker.element) {
            damage *= 1.1
        }
        const ElementalRelations = {
            fire: {
                ice: 1.5,    // 火克冰
                wind: 1.2,   // 火增强风
                water: 0.7,  // 火被水克制
                grass: 1.5,  // 火克草
                thunder: 1,  // 普通
                dark: 1,     // 普通
                light: 1,    // 普通
                default: 1   // 普通
            },
            ice: {
                water: 1.2,  // 冰增强水
                thunder: 0.7,// 冰被雷克制
                wind: 1.5,   // 冰克风
                fire: 0.7,   // 冰被火克制
                grass: 1.2,  // 冰增强草
                dark: 1,     // 普通
                light: 1,    // 普通
                default: 1
            },
            thunder: {
                water: 1.5,  // 雷克水
                ice: 1.5,    // 雷克冰
                wind: 0.7,   // 雷被风克制
                fire: 1,     // 普通
                grass: 0.7,  // 雷被草克制
                dark: 1.2,   // 雷增强暗
                light: 0.7,  // 雷被光克制
                default: 1
            },
            wind: {
                thunder: 1.5,// 风克雷
                fire: 0.7,   // 风被火克制
                ice: 0.7,    // 风被冰克制
                water: 1.2,  // 风增强水
                grass: 1.2,  // 风增强草
                dark: 1,     // 普通
                light: 1,    // 普通
                default: 1
            },
            water: {
                fire: 1.5,   // 水克火
                thunder: 0.7,// 水被雷克制
                ice: 1,      // 普通
                wind: 1,     // 普通
                grass: 0.7,  // 水被草克制
                dark: 1,     // 普通
                light: 1.2,  // 水增强光
                default: 1
            },
            grass: {
                water: 1.5,  // 草克水
                thunder: 1.5,// 草克雷
                fire: 0.7,   // 草被火克制
                ice: 0.7,    // 草被冰克制
                wind: 1,     // 普通
                dark: 0.7,   // 草被暗克制
                light: 1.2,  // 草增强光
                default: 1
            },
            dark: {
                light: 1.5,  // 暗克光
                grass: 1.5,  // 暗克草
                thunder: 0.7,// 暗被雷克制
                fire: 1,     // 普通
                ice: 1,      // 普通
                wind: 1,     // 普通
                water: 1,    // 普通
                default: 1
            },
            light: {
                dark: 1.5,   // 光克暗
                thunder: 1.5,// 光克雷
                water: 0.7,  // 光被水克制
                grass: 0.7,  // 光被草克制
                fire: 1,     // 普通
                ice: 1,      // 普通
                wind: 1,     // 普通
                default: 1
            },
            default: {
                fire: 1,
                ice: 1,
                thunder: 1,
                wind: 1,
                water: 1,
                grass: 1,
                dark: 1,
                light: 1,
                default: 1
            }
        } as const;
        const elementalBonus = ElementalRelations[skill.element] && ElementalRelations[skill.element][defender.element] || 1;
        damage *= elementalBonus;
        // 暴击判定
        if (isCrit) {
            damage *= attacker.imm_ability.crit_dmg / 100;
        }
        //闪避概率
        if (skill.type === "NORMAL_ATTACK") {
            const r = randomInt(0, 100)
            if (r <= defender.imm_ability?.evasion) {
                isEvaded = true
                damage = 0 // ! 闪避 damage归0
            }
        }

        !isEvaded && skill.buffs?.forEach(buff => {
            this.BuffManage.add_buff(buff.type === "target" ? defender : attacker, buff.buffId)
        })
        damage = Math.round(damage)
        defender.status.hp -= damage || 0
        if (defender.status.hp <= 0) defender.status.hp = 0
        //记录
        const at = BattleActionSchema.parse({
            logs_type: 'tatakai',
            skillId: skill.id,
            skillType: skill.type,
            skillName: skill.name,
            sourceId: attacker.id,          // 攻击方ID
            targetId: defender.id,          // 目标ID
            round: this.battle_data.round,
            damage: {
                hp: damage,
            },
            cost: skill.cost || {},
            isCrit,
            elementalBonus,
            element: skill.element,
            effectType: "DAMAGE",
            timestamp: Date.now(),
            isEvaded,
            attacker: {
                type: attacker.type || 2,
                name: attacker.name,
                id: attacker.id.toString()
            },
            defender: {
                type: defender.type || 2,
                name: defender.name,
                id: defender.id.toString()
            }
        })
        this.RecordManager.fixedPush(defender as any, 'at', at, true)
        this.RecordManager.fixedPush(attacker as any, 'at', at, true)
        this.RecordManager.fixedPush(this.RecordManager.logsDataSchma, 'tatakai', at)
        this.compute_damage(attacker.id, defender.id, damage || 0)
        return damage
    }
    // 角色行动完成
    finishAction(character: Character) {
        this.actionGauge.resetGauge(character.id);
    }
    //使用技能 
    useSkill(character: Character, bb: Character, skillId: string) {
        if (character.state === 1) return
        const skill: Skill = SkillMap[skillId];

        if (!skill) {
            throw new Error('技能不存在');
        }
        // 检查技能是否在冷却中
        if (this.cooldownManager.isOnCooldown(character.id, skillId)) {
            this.cooldownManager.getRemainingCooldown(character.id, skillId);
            return
            // throw new Error(`技能冷却中，还需${remainingTurns}回合`);
        }
        // 检查cost
        if (skill.cost) {
            for (const key in skill.cost) {
                if (character.status[key] <= skill.cost[key] || character.status.hp - skill.cost.hp < 0) {
                    return
                } else {
                    character.status[key] -= skill.cost[key]
                }
            }
        }
        //使用技能
        this.char_attack(character, bb, skill)
        // 添加冷却
        this.cooldownManager.startCooldown(character.id, skillId, skill.cooldown);
    }
    //回合开始
    startTurn() {
        this.battle_data.round++
        this.cooldownManager.updateCooldowns();
        this.roles.forEach(i => {
            this.calculateFinalStats(i)
            // this.set_role_status(i)
        })
        this.trim_attr(this.roles)
    }
    // 回合结束
    endTurn() {
        //裁剪日志
        this.EventManager.trigger_random_event()
        // 结算人物数据
        this.roles.forEach(char => {
            //结算status
            this.set_role_status(char)
        })
        this.trim_attr(this.roles)
        this.globalConfig.autosave && this.data.save()
    }
    //修整所有的溢出属性
    trim_attr(roles: Character[]) {
        roles.forEach(role => {
            role.status.hp = Math.max(Math.min(role.status.hp, role.imm_ability.hp), 0)
            role.status.mp = Math.max(Math.min(role.status.mp, role.imm_ability.mp), 0)
        })
    }
    // 角色总事件
    total_event(char: Character) {
        char.at.filter(i => i.round === this.battle_data.round).sort((a, b) => a.timestamp - b.timestamp)
    }
}




//角色伤害结算
export function char_damage_total(data: any[], bb: { ability: { defense: number } }) {
    const damage = 10
    return data.reduce((a, b) => {
        b.damage_total = b.at[0] * (damage - bb.ability?.defense)
        const res = a + b.damage_total || 0
        return res <= 0 ? 0 : res
    }, 0)
}
export function settle_attack_boss(damage: number, boss: { blood: number }) {
    boss.blood = boss.blood - damage
}


//  物理伤害计算
export function char_attack_physical(attacker: Character, defender: Character | BB, damage: number) {
    // 护甲穿透
    const effectiveDefense = Math.max(0, defender.imm_ability.defense * (1 - attacker.imm_ability.penetration / 100));
    // 防御计算 (常见公式：实际伤害 = 原始伤害 * (1 - 防御系数))
    // 防御系数 = 防御力 / (防御力 + 等级系数)
    const defense = defender.imm_ability.defense - effectiveDefense
    const defenseRatio = defense / (defense + 100);
    damage *= (1 - defenseRatio);
    // 元素伤害加成
    // if (attacker.ability.element) {
    //     damage *= (1 + attacker.ability.elem_bonus / 100);
    // }

    // 元素抗性计算
    const elementResistance = getElementResistance(defender, attacker.imm_ability.element);
    damage *= (1 - elementResistance / 100);
    return Math.round(damage);
}
// 魔法伤害计算
export function char_attack_magic(attacker: Character, defender: Character | BB, damage: number) {
    // 护甲穿透
    const effectiveDefense = Math.max(0, defender.imm_ability.defense * (1 - attacker.imm_ability.penetration / 100));
    const defense = defender.imm_ability.defense - effectiveDefense
    const defenseRatio = defense / (defense + 100);
    damage *= (1 - defenseRatio);
    // 元素伤害加成
    // if (attacker.ability.element) {
    //     damage *= (1 + attacker.ability.elem_bonus / 100);
    // }

    // 元素抗性计算
    const elementResistance = getElementResistance(defender, attacker.imm_ability.element);
    damage *= (1 - elementResistance / 100);
    return Math.round(damage);
}
// 获取元素抗性
function getElementResistance(defender: Character, attackerElement: string): number {
    // 默认抗性为0
    if (!defender.imm_ability.total_res || !attackerElement) return 0;

    // 返回对应元素抗性，如果没有则返回0
    return defender.imm_ability.total_res[attackerElement] || 0;
}
// // 生命偷取计算
// function calculateLifesteal(damage: number, attacker: Character) {
//     return damage * (attacker.imm_ability.lifesteal / 100);
// }

