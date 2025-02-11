// 冷却管理器
export interface SkillCooldown {
    skillId: string;
    remainingTurns: number;
}

// 角色技能冷却状态
export interface CharacterCooldowns {
    characterId: number;
    cooldowns: SkillCooldown[];
}

export class CooldownManager {
    public cooldowns: Map<number, SkillCooldown[]> = new Map();

    // 初始化角色的冷却管理
    initCharacter(characterId: number) {
        if (!this.cooldowns.has(characterId)) {
            this.cooldowns.set(characterId, []);
        }
    }

    // 使用技能时添加冷却
    startCooldown(characterId: number, skillId: string, duration: number) {
        const charCooldowns = this.cooldowns.get(characterId) || [];
        charCooldowns.push({
            skillId,
            remainingTurns: duration
        });
        this.cooldowns.set(characterId, charCooldowns);
    }

    // 检查技能是否在冷却中
    isOnCooldown(characterId: number, skillId: string): boolean {
        const charCooldowns = this.cooldowns.get(characterId) || [];
        return charCooldowns.some(cd => cd.skillId === skillId && cd.remainingTurns > 0);
    }

    // 获取技能剩余冷却回合
    getRemainingCooldown(characterId: number, skillId: string): number {
        const charCooldowns = this.cooldowns?.get(characterId) || [];
        const cooldown = charCooldowns.find(cd => cd.skillId === skillId);
        return cooldown?.remainingTurns || 0;
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

    // 重置指定角色的所有冷却
    resetCharacterCooldowns(characterId: number) {
        this.cooldowns.set(characterId, []);
    }

    // 重置所有冷却
    resetAllCooldowns() {
        this.cooldowns.clear();
    }
} 