import { NORMAL_ATTACK } from './data/normal';
import { ELEMENTAL_SKILL } from './data/elemental';
import { ELEMENTAL_BURST } from './data/burst';
import { Skill } from './types';
import { z } from 'zod';
import { keyBy } from 'lodash-es';
export * from './types';

export const SkillData = z.array(Skill).parse([
    ...NORMAL_ATTACK,
    ...ELEMENTAL_SKILL,
    ...ELEMENTAL_BURST,
]);

export const SkillMap: Record<string, Skill> = keyBy(SkillData, 'id')
export const SkillTypeMap: Record<string, Record<string, Skill>> = z.record(z.record(Skill)).parse({
    NORMAL_ATTACK:keyBy(NORMAL_ATTACK,'id'),
    ELEMENTAL_SKILL:keyBy(ELEMENTAL_SKILL,'id'),
    ELEMENTAL_BURST:keyBy(ELEMENTAL_BURST,'id'),
});

export const ScopeTypeNames = {
    ALL: '全体',
    MULTI: 'AOE',
    SINGLE: '单体',
} as const;