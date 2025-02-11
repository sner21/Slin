import { Ability, Character } from './types';
import  cloneDeep  from 'lodash-es/cloneDeep';

// 经验值配置
const EXP_CONFIG = {
    BASE_EXP: 1000,      // 基础经验值
    LEVEL_MULTIPLIER: 1.2 // 每级经验值增长倍率
};

// 稀有度属性倍率
const RARITY_MULTIPLIER = {
    'N': 1.0,
    'R': 1.2,
    'SR': 1.5,
    'SSR': 2.0,
    'UR': 2.5
};

// 计算升级所需经验值
export function calculateRequiredExp(level: number): number {
    return Math.floor(EXP_CONFIG.BASE_EXP * Math.pow(EXP_CONFIG.LEVEL_MULTIPLIER, level - 1));
}

// 计算当前等级
export function calculateLevel(totalExp: number): number {
    let level = 1;
    let expRequired = calculateRequiredExp(level);
    
    while (totalExp >= expRequired) {
        totalExp -= expRequired;
        level++;
        expRequired = calculateRequiredExp(level);
    }
    
    return level;
}

// 计算成长后的属性
export function calculateGrowthStats(character: Character): Ability {
    const stats = cloneDeep(character.ability);
    const growthMultiplier = (character.level - 1) * RARITY_MULTIPLIER[character.rarity];
    
    // 应用成长率
    stats.hp += Math.floor(character.growthRates.hp * growthMultiplier);
    stats.atk += Math.floor(character.growthRates.atk * growthMultiplier);
    stats.def += Math.floor(character.growthRates.def * growthMultiplier);
    stats.speed += Math.floor(character.growthRates.speed * growthMultiplier);
    stats.critRate += character.growthRates.critRate * growthMultiplier;
    stats.critDmg += character.growthRates.critDmg * growthMultiplier;
    
    return stats;
}

// 添加经验值并更新等级
export function addExperience(character: Character, exp: number): Character {
    const updatedChar = cloneDeep(character);
    updatedChar.exp += exp;
    updatedChar.level = calculateLevel(updatedChar.exp);
    updatedChar.imm_ability = calculateGrowthStats(updatedChar);
    return updatedChar;
}

// 突破角色（使用重复角色提升属性）
export function breakthrough(character: Character, consumeCount: number = 1): Character {
    if (character.count < consumeCount) {
        throw new Error('角色数量不足');
    }
    
    const updatedChar = cloneDeep(character);
    updatedChar.count -= consumeCount;
    
    // 每次突破提升基础属性5%
    const multiplier = 1 + (0.05 * consumeCount);
    Object.keys(updatedChar.ability).forEach(key => {
        updatedChar.ability[key] *= multiplier;
    });
    
    // 更新当前属性
    updatedChar.imm_ability = calculateGrowthStats(updatedChar);
    return updatedChar;
}
