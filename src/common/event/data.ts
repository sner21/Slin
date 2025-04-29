import { z } from 'zod';
import { EventData } from './types';

// 战斗相关事件
export const BATTLE_EVENTS = z.record(EventData).parse({
  mp_re_randow: {
    id: 'mp_re_randow',
    type: 'BATTLE',
    name: '魔法回复',
    description: '${target.name}收到了魔法回复30点',
    effects: [{
      target: 'self',
      path: 'status',
      attr: 'mp',
      value: 30,
      operator: 'increase',
    }],
    conditions: []
  },
});
// 宝箱相关事件
const TREASURE_EVENTS = z.record(EventData).parse({
  common_chest: {
    id: 'common_chest',
    type: 'TREASURE',
    name: '普通宝箱',
    description: '发现一个普通宝箱',
    effects: [{
      type: 'ADD_GOLD',
      target: 'global',
      path: 'currency',
      attr: 'gold',
      value: 100,
      operator: 'increase'
    }]
  },
  rare_chest: {
    id: 'rare_chest',
    type: 'TREASURE',
    name: '稀有宝箱',
    description: '发现一个稀有宝箱',
    effects: [{
      type: 'ADD_EQUIPMENT',
      target: 'global',
      path: 'equipments',
      attr: 'items',
      value: 'rare_sword',
      operator: 'push'
    }]
  }
});

// 等级提升事件
const LEVEL_EVENTS = z.record(EventData).parse({
  level_10_milestone: {
    id: 'level_10_milestone',
    type: 'LEVEL_UP',
    name: '等级10里程碑',
    description: '达到10级获得奖励',
    effects: [{
      type: 'ADD_SKILL',
      target: 'global',
      path: 'skills',
      attr: 'learned',
      value: 'special_skill_1',
      operator: 'push'
    }]
  }
});

// 装备变更事件
const EQUIPMENT_EVENTS = z.record(EventData).parse({
  weapon_enhance: {
    id: 'weapon_enhance',
    type: 'EQUIPMENT_CHANGE',
    name: '武器强化',
    description: '武器得到强化',
    effects: [{
      type: 'MODIFY_EQUIPMENT',
      target: 'global',
      path: 'equipments.MAIN_HAND.stats',
      attr: 'attack',
      value: 5,
      operator: 'increase'
    }]
  }
});

// 合并所有事件
export const events = {
  ...BATTLE_EVENTS,
  ...TREASURE_EVENTS,
  ...LEVEL_EVENTS,
  ...EQUIPMENT_EVENTS
};

// 按类型导出
export const eventsByType = {
  BATTLE: BATTLE_EVENTS,
  TREASURE: TREASURE_EVENTS,
  LEVEL_UP: LEVEL_EVENTS,
  EQUIPMENT_CHANGE: EQUIPMENT_EVENTS
}; 