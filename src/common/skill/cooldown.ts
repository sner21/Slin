import { SkillMap } from ".";
import { Character } from "../char/types";
import { BattleManager } from "../tatakai";

// 冷却管理器
export interface SkillCooldown {
    skillId: string;
    remainingTurns: number;
}

// 角色技能冷却状态
export interface CharacterCooldowns {
    characterId: string;
    cooldowns: SkillCooldown[];
}

export class CooldownManager {
    public cooldowns: Map<string, SkillCooldown[]> = new Map();
    private dataCon: BattleManager
    constructor(dataCon) {
        this.dataCon = dataCon
    }
    // 初始化角色的冷却管理
    initCharacter(characterId: string) {
        if (!this.cooldowns.has(characterId)) {
            this.cooldowns.set(characterId, []);
        }
    }

    // 使用技能时添加冷却
    startCooldown(characterId: string, skillId: string, duration: number) {
        const charCooldowns = this.cooldowns.get(characterId) || [];
        charCooldowns.push({
            skillId,
            remainingTurns: duration
        });
        this.cooldowns.set(characterId, charCooldowns);
    }

    // 检查技能是否在冷却中
    isOnCooldown(characterId: string, skillId: string): boolean {
        const charCooldowns = this.cooldowns.get(characterId) || [];
        return charCooldowns.some(cd => cd.skillId === skillId && cd.remainingTurns > 0);
    }

    // 获取技能剩余冷却回合
    getRemainingCooldown(characterId: string, skillId: string): number {
        const charCooldowns = this.cooldowns?.get(characterId) || [];
        const cooldown = charCooldowns.find(cd => cd.skillId === skillId);
        return cooldown?.remainingTurns || 0;
    }
    updateCooldownsRole(characterId) {
        const charCooldowns = this.cooldowns?.get(characterId) || [];
        charCooldowns.forEach(cd => {
            if (cd.remainingTurns > 0) {
                cd.remainingTurns--;
            }
        });
        const activeCooldowns = charCooldowns.filter(cd => cd.remainingTurns > 0);
        this.cooldowns.set(characterId, activeCooldowns);
    }
    // 回合结束时更新冷却时间
    updateCooldowns() {
        this.cooldowns.forEach((charCooldowns, characterId) => {
            // 减少所有技能的冷却时间
            charCooldowns.forEach(cd => {
                if (cd.remainingTurns > 0) {
                    cd.remainingTurns--;
                }
            });
            // 移除已结束的冷却
            const activeCooldowns = charCooldowns.filter(cd => cd.remainingTurns > 0);
            this.cooldowns.set(characterId, activeCooldowns);
        });
    }

    // 填满指定角色的所有冷却
    fullCharacterCooldowns(characterId: string) {
        this.cooldowns.set(characterId, []);
    }
    // 指定角色的所有冷却
    resetCharacterCooldowns(char: Character) {
        this.cooldowns.set(char.id, char.skill.map(skillId => ({ remainingTurns: SkillMap[skillId].cooldown, skillId: skillId })));
    }
    // 重置所有冷却
    resetAllCooldowns() {
        this.cooldowns.clear();
    }
} 