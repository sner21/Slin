import { Character, Action, Ability, CharacterSaveSchema, CharacterSchema } from "../char/types";
import { bb, BB, initialData } from "../char";
import { Skill, SkillMap, targetTypeEnum } from "../skill";
import { EquipmentMap } from "../equip";
import { CooldownManager } from "../skill/cooldown";
import { ActionGauge } from "./action";
import { ref, Ref } from "vue";
import { DataCon } from "../data/dataCon";
import { effectsSchema, EffectsSchema } from '../char/attr';
import { fixedPush, getMirrorPosition, randomInt } from "..";
import { EventManager } from "../event";
import { BattleActionSchema } from "../record/type";
import get from "lodash-es/get";
import keyBy from "lodash-es/keyBy";
import { RecordManager } from "../record/record";
import { ItemsManager } from "../items";
import { BuffManage } from "../buff";
import { z, number } from 'zod';
const PluginsDataSchma = z.object({
    buff: z.any().optional(),
    role: z.any().optional(),
    event: z.any().optional(),
    skill: z.any().optional(),
    equip: z.any().optional(),
    item: z.any().optional(),
})
import assignIn from "lodash-es/assignIn";
import { isNumber } from "lodash-es";
import { targetType } from '../skill/types';

// 战斗管理器
export class BattleManager {
    round_timer: any
    time_timer: any
    roles_group: Record<string, Character> = {};
    cooldownManager: CooldownManager;
    actionGauge: ActionGauge;
    EventManager
    BuffManage
    RecordManager
    ItemsManager
    enemy: Character[] = []
    cur_enemy: Character[] = []
    characters: Character[];
    cur_characters: Character[] = [];
    roles: Character[] = [];
    data: Ref<Character[]>;
    globalConfig: any = {};
    roleAarry: any = {}
    init_battle_data: any = {
        cur_time: 0,
        pause: false,
        round: 0,
        time: 5000,
        cur_boss_id: '',
        battle_round: 1,
        game_mode: "0"
    };
    battle_data: any = {
    };
    battle_id = 'init'
    targetArray = {
        "0": [],
        "1": []
    }
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
        this.roleAarry = {}
        this.init_battle_data.time = this.globalConfig.time
        const info = data.battle_data_info && data.battle_data_info[this.battle_id]
        if (info) {
            this.battle_data = info.battle_data
            this.cooldownManager.cooldowns = info.cooldowns

        } else {
            this.battle_data = { ...this.init_battle_data }
        }
        this.update_array()
        this.update_cur()

        // this.battle_data.cur_boss_id = this.cur_enemy[0].id
        // this.load_plugins_init().then(() => {
        //     this.start_round()
        // })

        // data.current = this
        // return this

    }
    destroy() {
        if (this.round_timer) {
            clearInterval(this.round_timer);
            this.round_timer = null;
        }
        if (this.time_timer) {
            clearInterval(this.time_timer);
            this.time_timer = null;
        }
        this.roles = [];
        this.characters = [];
        this.cur_characters = [];
        this.enemy = [];
        this.cur_enemy = [];
    }
    init_target_array() {
        this.targetArray = {
            "0": [],
            "1": []
        }
    }
    init_role() {
        this.enemy = this.data.enemy
        this.roles = this.data.roles
        this.roles_group = this.data.roles_group
    }
    load_plugins_role(data: Character[]) {
        data.forEach(i => {
            switch (i?.type) {
                case "0": {
                    const charIndex = this.characters.findIndex(item => item.id === i.id)
                    if (charIndex >= 0) {
                        this.characters[charIndex] = assignIn(this.characters[charIndex], i)
                        // Object.keys(i).forEach(key => {
                        //     this.characters[charIndex][key] = i[key]
                        // })
                    } else {
                        this.characters.push(i)
                    }
                    break
                }
                case "1": {
                    const charIndex = this.enemy.findIndex(i => i.id)
                    if (charIndex >= 0) {
                        this.enemy[charIndex] = assignIn(this.enemy[charIndex], i)
                    } {
                        this.enemy.push(i)
                    }
                    break
                }
            }

        })
        this.roles = [...this.characters, ...this.enemy]
        this.roles_group = keyBy(this.roles, "id")
    }
    async load_plugins_init() {
        if (!import.meta.env.BUILD_PLUGINS) return
        const plugins = await import.meta.glob('../plugins/*');
        const add_plugins = await import.meta.glob('./plugins/*');
        Object.keys({ ...plugins, ...add_plugins }).forEach(k => {
            import(k).then(res => {
                const data = PluginsDataSchma.parse(res.default)
                this.load_plugins(data)
            })
        })

        // import('../plugins/*').then(res => {
        //     const data = PluginsDataSchma.parse(res.plugins_data)
        //     this.load_plugins(data)
        // })
        Object.keys(localStorage).forEach(k => {
            if (k.startsWith('user-plugin-')) {
                const data = PluginsDataSchma.parse(JSON.parse(localStorage.getItem(k) || ""))
                this.load_plugins(data)
            }
        })
    }
    async load_plugins(data: any) {
        this.EventManager.load_plugins_event(data.event || [])
        this.BuffManage.load_plugins_buff(data.buff || [])
        this.ItemsManager.load_plugins_item(data.item || [])
        this.load_plugins_role(data.role || [])
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
        // return ne[index] || this.enemy[0]
        return this.enemy
    }
    forward_round() {
        this.battle_turn()
    }
    computed_time() {
        return setInterval(() => {
            this.battle_data.cur_time += 100
        }, 100)
    }
    // destroy() {
    //     this.pause_round()
    //     this.round_timer = null
    //     this.time_timer = null
    // }
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
    char_reborn(char: Character) {
        char.status!.hp = char.imm_ability.hp
        char.status!.mp = char.imm_ability.mp
        char.state = 0
        char.description = ""
    }
    settle_exp(char: Character) {
        const baseExp = char.grow.level * 20
        const rarityBonus = char.grow.rarity * 0.2 + 0.8
        const exp = Math.floor(baseExp * rarityBonus)

        const team = char.type === "0" ? this.cur_characters : this.cur_enemy
        const teamSizeModifier = 1 + Math.log10(team.length)
        const average_exp = Math.floor(exp / teamSizeModifier)

        team.forEach(role => {
            this.gain_exp(role, average_exp)
        })

        // 同时触发金钱获取
        this.settle_currency(char, team)
    }

    /**
     * 角色获得经验并处理升级
     */
    private gain_exp(role: Character, exp: number) {
        role.grow.exp += exp

        while (true) {
            const baseExpNeed = role.grow.level * role.grow.level * 50
            const rarityModifier = role.grow.rarity * 0.15 + 0.85
            const exp_need = Math.floor(baseExpNeed * rarityModifier)

            if (role.grow.exp >= exp_need) {
                role.grow.exp = role.grow.exp - exp_need
                role.grow.level += 1
            } else {
                break
            }
        }
    }

    private settle_currency(char: Character, team: Character[]) {
        // 基础金钱，确保是整数
        const baseCurrency = Math.floor(char.grow.level * 5)

        // 稀有度加成，转换为百分比整数计算
        const rarityBonus = 90 + char.grow.rarity * 10  // 90% - 140%

        // 队伍人数修正，转换为百分比整数计算
        const teamSizePenalty = Math.floor(100 / (1 + Math.log10(team.length)))

        // 最终金钱计算：基础金钱 * 稀有度加成 * 队伍人数修正 / 10000
        const currency = Math.floor(baseCurrency * rarityBonus * teamSizePenalty / 10000)

        // 确保至少获得1金币
        const finalCurrency = Math.max(1, currency)

        team.forEach(role => {
            role.carry.currency = Math.floor((role.carry.currency || 0) + finalCurrency)
        })
    }

    auto_gain_exp(role: Character) {
        if (role.state !== 1) {
            const baseExp = 2
            const rarityBonus = role.grow.rarity * 0.1 + 0.9
            const gainExp = Math.floor(baseExp * rarityBonus)
            //TODO
            // role.grow.exp += gainExp

            while (true) {
                const baseExpNeed = role.grow.level * role.grow.level * 50
                const rarityModifier = role.grow.rarity * 0.15 + 0.85
                const exp_need = Math.floor(baseExpNeed * rarityModifier)

                if (role.grow.exp >= exp_need) {
                    role.grow.exp = role.grow.exp - exp_need
                    role.grow.level += 1
                } else {
                    break
                }
            }
        }

    }

    //结算角色当前数据
    set_role_status(char: Character) {
        if (!char.status) return
        //判断HP是否死亡 
        //TODO 另一个模式不判断char.type
        if (char.state === 1 && char.type !== "1" && this.battle_data.game_mode === "0" && this.battle_data.game_mode === "0") {
            char.status.reborn! -= 1
            //复活
            if (char.status.reborn! <= 0) {
                this.char_reborn(char)
            }
        }
        //死亡
        if (char.status.hp! <= 1) {
            if (char.state === 0) {
                //结算经验
                if (!(this.battle_data.game_mode === "0" && char.type === "1")) {
                    this.settle_exp(char)
                }
            }
            char.status.hp = 0
            char.status.mp = 0
            char.state = 1
            char.buff = {}
            this.actionGauge.gauges.set(char.id, 0)
            this.cooldownManager.resetCharacterCooldowns(char.id)
            //cooldownManager  actionGauge
            char.description = "正在休息"
            if (!char.status.reborn || char.status?.reborn <= 0) {
                char.status.reborn = char.ability.reborn || 10
            }


        }
        if (char.state === 0) {
            // 处理所有角色的回复
            char.status.hp = Math.min(char.status.hp! + char.imm_ability.hp_re, char.imm_ability.hp)
            char.status.mp = Math.min(char.status.mp! + char.imm_ability.mp_re, char.imm_ability.mp)
        }
    }
    //随机选择1个攻击目标
    random_attack_select(data: any[], count = 0) {
        const index = randomInt(0, data.length - 1);
        const t = this.characters[index];
        while (t.status!.hp! <= 0) {
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
    get_target(role: Character, enemy: Character[]) {
        const aliveEnemies = enemy.filter(e => e.state !== 1);
        if (aliveEnemies.length === 0) return;

        const attackerPos = role.position?.index || 0;
        const attackerRow = Math.floor(attackerPos / 3);  // 0 前排, 1 中排, 2 后排

        // 获取敌方各排的存活单位
        const enemyRows = {
            front: aliveEnemies.filter(e => Math.floor((e.position?.index || 0) / 3) === 0),
            middle: aliveEnemies.filter(e => Math.floor((e.position?.index || 0) / 3) === 1),
            back: aliveEnemies.filter(e => Math.floor((e.position?.index || 0) / 3) === 2)
        };

        // 计算每列的保护情况
        const columnProtection = [0, 1, 2].map(col => {
            const hasProtection = {
                front: enemyRows.front.some(e => (e.position?.index || 0) % 3 === col),
                middle: enemyRows.middle.some(e => (e.position?.index || 0) % 3 === col),
                back: enemyRows.back.some(e => (e.position?.index || 0) % 3 === col)
            };
            return hasProtection;
        });

        let targetPool: Character[] = [];
        let weights: number[] = [];

        // 为每个存活的敌人计算权重
        aliveEnemies.forEach(enemy => {
            const enemyPos = enemy.position?.index || 0;
            const enemyRow = Math.floor(enemyPos / 3);  // 0:前排, 1:中排, 2:后排
            const enemyCol = enemyPos % 3;
            const protection = columnProtection[enemyCol];

            let weight = 0;

            // 基础权重设置
            if (enemyRow === attackerRow) {
                weight = 60; // 同排基础权重
            } else if (Math.abs(enemyRow - attackerRow) === 1) {
                weight = 30; // 相邻排基础权重
            } else {
                weight = 10; // 远排基础权重
            }

            // 根据保护情况调整权重
            if (enemyRow === 2) { // 后排
                if (!protection.front && !protection.middle) {
                    weight *= 3; // 无保护，大幅提高权重
                } else if (!protection.front || !protection.middle) {
                    weight *= 2; // 部分保护，适度提高权重
                }
            } else if (enemyRow === 1) { // 中排
                if (!protection.front) {
                    weight *= 2; // 无前排保护，提高权重
                }
            }

            // 如果是前排，保持原有权重
            targetPool.push(enemy);
            weights.push(weight);
        });

        // 根据权重随机选择目标
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;
        let target: Character | undefined;

        for (let i = 0; i < weights.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                target = targetPool[i];
                break;
            }
        }

        // 保底选择
        if (!target) {
            target = aliveEnemies[0];
        }

        return target;
    }
    update_cur() {
        this.cur_enemy = this.enemy.filter(i => i.position?.index)
        this.cur_characters = this.characters.filter(i => i.position?.index)
        // this.update_array()
    }
    update_roles() {
        this.roles = [...this.characters, ...this.enemy]
        this.roles_group = keyBy(this.roles, "id")
    }
    update_array(value = null) {
        if (value) return this.roleAarry = value
        this.roleAarry = {}
        const list = [this.characters, this.enemy]
        list.forEach((i, k) => {
            i.forEach(role => {
                if (!this.roleAarry[k]) this.roleAarry[k] = {}
                if (isNumber(role.position?.index)) {
                    const index = k === 1 ? getMirrorPosition(role.position.index) : role.position.index
                    this.roleAarry[k][index] = {
                        id: role.id,
                        type: k,
                        avatar: role.avatar,
                        index: index,
                    }
                }
            })
        });
    }
    //战斗
    battle_turn() {
        this.startTurn()
        // 获取当前回合可行动的角色
        const actionOrder = this.getActionOrder([...this.cur_characters, ...this.cur_enemy]);
        const actionOrderId = actionOrder.map(i => i.id)
        // console.log("可以行动的角色", actionOrderId)

        for (const key in actionOrder) {
            const i = actionOrder[key]
            //计算角色属性
            if (isNumber(i.status?.find_gap) && actionOrderId.includes(i.id)) {
                this.handle_target(i)
            }
            //获取所有角色事件
            this.total_event(i)
        }
        this.endTurn()
        // console.log(this.tatakai_logs, "总事件")
    }
    handle_target(i: Character) {
        if (!i.status) return
        //索敌
        if (i.ability.find_gap === i.status.find_gap || Number(i.target?.state) === 1) {
            i.target = this.get_target(i, i.type === "1" ? this.cur_characters : this.cur_enemy)
            i.status.find_gap = 0
        } else {
            i.status.find_gap = (i.status.find_gap || 0) + 1
        }
        if (!i.target) {
            return
        }
        this.useSkill(i, i.target, i.normal)
        this.get_round_ack(i, i.target)
        this.finishAction(i);

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
    get_skill_target(skill, char, bb) {
        switch (skill.targetType) {
            case targetTypeEnum.ENEMY: return bb
            case targetTypeEnum.SELF: return char
            //TODO 暂时随机
            // case targetTypeEnum.ALLY: return this.cur_characters[randomInt(0, this.cur_characters.length - 1)]
            case targetTypeEnum.ALLY: return this.get_target(char, this.cur_characters)
        }
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
            case "multiply": {
                data[attr] * value
                break
            }

        }
        if (effect.attr === 'hp' && effect.target === 'defender' && sourceId && targetId /* && target !== 'global' */) {
            this.compute_damage(sourceId, targetId, value)
        }
    }
    //计算贡献
    compute_damage(sourceId: string | number, targetId: string | number, value: number) {
        this.roles_group[sourceId].status && (this.roles_group[sourceId].status.damage += value)
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
            stats[k as keyof typeof stats] += level * rarity * 50 * (growthRates && growthRates[k as keyof typeof growthRates] || 0)
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
                if (equipId && this.ItemsManager.equipmentsDataMap[equipId]) {
                    const equip = this.ItemsManager.equipmentsDataMap[equipId];
                    // 叠加装备属性
                    (Object.entries(equip.stats) as [keyof typeof stats, string][]).forEach(([key, value]) => {
                        stats[key] = Math.round((stats[key] || 0) + Number(value));
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
            damage = attacker.imm_ability.attack * (Number(skill.multiplier) ) / 100
            damage = char_attack_physical(attacker, defender, damage)
        } else {
            damage = attacker.imm_ability.elem_bonus * (Number(skill.multiplier)) / 100
            damage = char_attack_magic(attacker, defender, damage)
        }
        //元素适应性加成
        if (skill.element === attacker.element) {
            damage *= 1.1
        }
        const ElementalRelations = {
            fire: {
                ice: 1.5,
                wind: 1.2,
                water: 0.7,
                grass: 1.5,
                thunder: 1,
                dark: 1,
                light: 1,
                default: 1
            },
            ice: {
                water: 1.2,
                thunder: 0.7,
                wind: 1.5,
                fire: 0.7,
                grass: 1.2,
                dark: 1,
                light: 1,
                default: 1
            },
            thunder: {
                water: 1.5,
                ice: 1.5,
                wind: 0.7,
                fire: 1,
                grass: 0.7,
                dark: 1.2,
                light: 0.7,
                default: 1
            },
            wind: {
                thunder: 1.5,
                fire: 0.7,
                ice: 0.7,
                water: 1.2,
                grass: 1.2,
                dark: 1,
                light: 1,
                default: 1
            },
            water: {
                fire: 1.5,
                thunder: 0.7,
                ice: 1,
                wind: 1,
                grass: 0.7,
                dark: 1,
                light: 1.2,
                default: 1
            },
            grass: {
                water: 1.5,
                thunder: 1.5,
                fire: 0.7,
                ice: 0.7,
                wind: 1,
                dark: 0.7,
                light: 1.2,
                default: 1
            },
            dark: {
                light: 1.5,
                grass: 1.5,
                thunder: 0.7,
                fire: 1,
                ice: 1,
                wind: 1,
                water: 1,
                default: 1
            },
            light: {
                dark: 1.5,
                thunder: 1.5,
                water: 0.7,
                grass: 0.7,
                fire: 1,
                ice: 1,
                wind: 1,
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
            sourceId: attacker.id,
            targetId: defender.id,
            round: this.battle_data.round,
            damage: {
                hp: damage,
            },
            cost: skill.cost || {},
            buffs:skill.buffs,
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
        this.char_attack(character, this.get_skill_target(skill, character, bb), skill)
        // 添加冷却
        this.cooldownManager.startCooldown(character.id, skillId, skill.cooldown);
    }
    //回合开始
    startTurn() {
        this.cooldownManager.updateCooldowns();
        this.init_target_array()
        this.roles.forEach(i => {
            this.calculateFinalStats(i)
            i.target?.position?.index && this.targetArray[i.target?.type]?.push(i.target.type === "1" ? getMirrorPosition(i.target.position.index) : i.target.position.index)
            // this.set_role_status(i)
        })
        this.trim_attr(this.roles)

    }
    check_enemy() {
        const check = this.cur_enemy.every(enemy => {
            return enemy.state === 1
        })
        if (check) {
            this.enemy.forEach(enemy => {
                enemy.grow.level++
                this.char_reborn(enemy)
            })
            this.battle_data.battle_round++
        }
    }
    // 回合结束
    endTurn() {
        //裁剪日志
        this.EventManager.trigger_random_event(this.battle_data.round)
        // 结算人物数据
        this.roles.forEach(char => {
            this.auto_gain_exp(char)
            //结算status
            this.set_role_status(char)
        })
        this.trim_attr(this.roles)
        this.check_enemy()
        this.update_cur()
        this.globalConfig.autosave && this.data.save()
        this.battle_data.round++

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

