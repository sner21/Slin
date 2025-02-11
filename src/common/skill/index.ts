import { NORMAL_ATTACK } from './data/normal';
import { ELEMENTAL_SKILL } from './data/elemental';
import { ELEMENTAL_BURST } from './data/burst';
import { Skill } from './types';
import { z } from 'zod';
export * from './types';

// 合并所有技能
export const SkillMap: Record<string, Skill> = z.record(Skill).parse({
    ...NORMAL_ATTACK,
    ...ELEMENTAL_SKILL,
    ...ELEMENTAL_BURST,
});
// 合并所有技能
export const SkillTypeMap: Record<string, Record<string, Skill>> = z.record(z.record(Skill)).parse({
    NORMAL_ATTACK,
    ELEMENTAL_SKILL,
    ELEMENTAL_BURST,
});
export const SkillTypeNames = {
    NORMAL_ATTACK: '普通攻击',
    ELEMENTAL_SKILL: '元素战技',
    ELEMENTAL_BURST: '元素爆发',
    PASSIVE: '被动技能'
} as const;