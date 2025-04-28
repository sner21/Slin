import shinoa from "../../assets/65555.jpg?url";
import mui from "../../assets/20191117175619_qgnij.jpg?url";
import hutao from "../../assets/20221018182444_c011a.thumb.1000_0.jpg?url";
import makima from "../../assets/20220921002233_d070d.jpg?url";
import leidian from "../../assets/lGS9D3J9ux8JZ2O.thumb.1000_0.jpg?url";
import ai from "../../assets/bYS8xEdzULxapXw.thumb.1000_0.png?url";
import issei from "../../assets/issei.png?url";
import gaosupopo from "../../assets/gaosupopo.png?url";
import huang from "../../assets/huang.png?url";
import mitsuba from "../../assets/mitsuba.jpg?url";
import themis from "../../assets/themis.jpg?url";
import { z } from 'zod';
import { Data, DataSchema, Character, CharacterSchema } from "./types";
import { SkillTypeMap } from "../skill";


// 能力值结构
export const AbilitySchemaBoss = z.object({
  hp: z.number(),
  defense: z.number(),
  evasion: z.number(),
});

// 状态结构
export const StatSchema = z.object({
  blood: z.number().optional(),
}).partial();

// 完整的 BB 结构
export const BBSchema = z.object({
  ability: AbilitySchemaBoss,
  stat: StatSchema,
  name: z.string(),
});

// 导出类型
export type AbilityBoss = z.infer<typeof AbilitySchemaBoss>;
export type Stat = z.infer<typeof StatSchema>;
export type BB = z.infer<typeof BBSchema>;
export const AttributeNameCN = {
  attack: '攻击力',
  defense: '防御力',
  evasion: '闪避率',
  crit_rate: '暴击率',
  crit_dmg: '暴击伤害',
  elem_bonus: '法强',
  magic_res: '法术抗性',
  // hp: '生命上限',
  hp_re: 'HP回复',
  mp_re: 'MP回复',
  // shield: '护盾值',
  speed: '速度',
  // mp: '魔法值',
  penetration: '护甲穿透',
  // lifesteal: '生命偷取',

  element: '元素属性',
  // elem_mastery: '元素精通',

  // fire_res: '火元素抗性',
  // ice_res: '冰元素抗性',
  // lightning_res: '雷元素抗性',
  // rage_bonus: '怒气伤害加成',
  // healing_bonus: '治疗加成',
  // shield_strength: '护盾强度'
} as const;

export const ElementNameCN = {
  fire: '火',
  ice: '冰',
  thunder: '雷',
  water: '水',
  wind: '风'
} as const;
// 使用 Zod 验证的数据
export const bb: Character[] = z.array(CharacterSchema).parse([
  {
    name: "煌雷龙",
    id: "0",
    type: "1",
    avatar: huang,
    at: [],
    element: "thunder", // 角色元素属性
    ability: {
      // 基础属性
      hp: 220, // 生命上限
      shield: 0,  // 护盾
      attack: 20,    // 攻击力
      defense: 2,  // 防御力
      evasion: 8, // 闪避率
      crit_rate: 15,  // 暴击率
      crit_dmg: 150, // 暴击伤害
      speed: 110,   // 速度(影响行动顺序)
      mp: 100,   // 能量值(释放大招所需)
      penetration: 10, // 护甲穿透
      // 元素相关
      lifesteal: 5, //  生命偷取(%)
      elem_mastery: 80,  // 元素精通
      elem_bonus: 15,    // 元素伤害加成(%)
      // 抗性相关
      magic_res: 0,  // 总抗性
      fire_res: 0,  // 火元素抗性
      ice_res: 15,    // 冰元素抗性
      lightning_res: 5,  // 雷元素抗性
      // 特殊属性
      rage_bonus: 20,  // 怒气伤害加成
      healing_bonus: 0,  // 治疗加成
      shield_strength: 0, // 护盾强度
      strength: 8,    // 中等力量
      agility: 12,    // 较高敏捷
      intelligence: 10, // 
    },
    position: {
      index: 4
    },
    grow: {
      level: 1,
      rarity: 5, 
      strength: 1,
      agility: 1,
      intelligence: 1,
    },
    skill: [],
    normal: SkillTypeMap.NORMAL_ATTACK.physical_normal.id,
  },
  {
    name: "高速婆婆",
    id: "turbo_bachan",
    type: "1",
    avatar: gaosupopo,
    at: [],
    element: "fire", // 角色元素属性
    ability: {
      // 基础属性
      hp: 120, // 生命上限
      shield: 0,  // 护盾
      attack: 20,    // 攻击力
      defense: 2,  // 防御力
      evasion: 8, // 闪避率
      crit_rate: 15,  // 暴击率
      crit_dmg: 150, // 暴击伤害
      speed: 110,   // 速度(影响行动顺序)
      mp: 100,   // 能量值(释放大招所需)
      penetration: 10, // 护甲穿透
      // 元素相关
      lifesteal: 5, //  生命偷取(%)
      elem_mastery: 80,  // 元素精通
      elem_bonus: 15,    // 元素伤害加成(%)
      // 抗性相关
      magic_res: 0,  // 总抗性
      fire_res: 0,  // 火元素抗性
      ice_res: 15,    // 冰元素抗性
      lightning_res: 5,  // 雷元素抗性
      // 特殊属性
      rage_bonus: 20,  // 怒气伤害加成
      healing_bonus: 0,  // 治疗加成
      shield_strength: 0, // 护盾强度
      strength: 8,    // 中等力量
      agility: 12,    // 较高敏捷
      intelligence: 10, // 
    },
    grow: {
      level: 1,
      rarity: 5, 
      strength: 1,
      agility: 1,
      intelligence: 1,
    },
    skill: [],
    normal: SkillTypeMap.NORMAL_ATTACK.physical_normal.id,
    ee: 0,
  }
]);
// 使用 Zod 验证初始数据

export const initialData = DataSchema.parse([
  {
    name: "柊筱娅",
    id: "1",
    avatar: shinoa,
    salu: '帝鬼军',
    gender: "2",
    at: [],
    carry: {
      items: {
        "0": {
          id: "1",
          count: 3,
          cls: "ITEM",
        }
      },
      equipments: {
        MAIN_HAND: 'ice_scythe',
        HELMET: 'frost_crown'
      }
    },
    element: "ice", // 角色元素属性
    buff: {},
    skill: [
      SkillTypeMap.ELEMENTAL_BURST.shinoa_burst.id,
      SkillTypeMap.ELEMENTAL_BURST.ayaka_skill.id,
    ],
    position: {
      index: 6
    },
    normal: SkillTypeMap.NORMAL_ATTACK.physical_normal.id,
    ability: {
      // 基础属性
      hp: 160, // 生命上限
      shield: 0,  // 护盾
      attack: 18,    // 攻击力
      defense: 2,  // 防御力
      evasion: 8, // 闪避率
      crit_rate: 15,  // 暴击率
      crit_dmg: 150, // 暴击伤害
      speed: 110,   // 速度(影响行动顺序)
      mp: 100,   // 能量值(释放大招所需)
      penetration: 10, // 护甲穿透
      // 元素相关
      lifesteal: 5, //  生命偷取(%)
      elem_mastery: 80,  // 元素精通
      elem_bonus: 15,    // 元素伤害加成(%)
      // 抗性相关
      magic_res: 0,  // 总抗性
      fire_res: 0,  // 火元素抗性
      ice_res: 15,    // 冰元素抗性
      lightning_res: 5,  // 雷元素抗性
      // 特殊属性
      rage_bonus: 20,  // 怒气伤害加成
      healing_bonus: 0,  // 治疗加成
      shield_strength: 0, // 护盾强度
      // 基础三维
      strength: 8,    // 中等力量
      agility: 12,    // 较高敏捷
      intelligence: 10, // 中等智力
    },
    blood: 100,
    ee: 0,
  },
  {
    name: "宝多六花",
    id: '2',
    avatar: mui,
    salu: '',
    ac: [],
    at: [],
    gender: "2",
    element: "water", // 修正元素属性为水
    normal: SkillTypeMap.NORMAL_ATTACK.magic_normal.id,
    skill: [
      SkillTypeMap.ELEMENTAL_BURST.shinoa_burst.id,
      SkillTypeMap.ELEMENTAL_SKILL.katalina_skill.id
    ],
    position: {
      index: 4
    },
    ability: {
      hp: 180,
      shield: 40,
      attack: 15,
      mp_re: 10,
      defense: 4,
      evasion: 4,
      crit_rate: 10,
      crit_dmg: 140,
      speed: 50,
      mp: 120,
      penetration: 0,
      lifesteal: 0,
      element: "water",
      elem_mastery: 60,
      elem_bonus: 10,
      fire_res: 10,
      ice_res: 10,
      lightning_res: 10,
      magic_res: 20,
      rage_bonus: 0,
      healing_bonus: 25,
      shield_strength: 15,
      strength: 6,
      agility: 8,
      intelligence: 16,
    },
    blood: 100,
    ee: 0,
    carry: {
      items: {},
      equipments: {
        MAIN_HAND: 'healing_staff',
        OFF_HAND: 'water_shield'
      }
    },
  },
  {
    name: "胡桃",
    id: '3',
    position: {
      index: 8
    },
    avatar: hutao,
    salu: '往生堂堂主',
    gender: "2",
    element: "fire", // 修正元素属性为火
    normal: SkillTypeMap.NORMAL_ATTACK.physical_normal.id,
    skill: [
      SkillTypeMap.ELEMENTAL_SKILL.hutao_skill.id,
      SkillTypeMap.ELEMENTAL_SKILL.eula_skill.id
    ],
    ability: {
      hp: 140,
      hp_re: 7,
      shield: 0,
      attack: 25,
      defense: 2,
      evasion: 6,
      crit_rate: 20,
      crit_dmg: 180,
      speed: 105,
      mp: 90,
      penetration: 15,
      lifesteal: 8,
      element: "fire",
      elem_mastery: 100,
      elem_bonus: 20,
      magic_res: 0,
      fire_res: 20,
      ice_res: 0,
      lightning_res: 0,
      rage_bonus: 25,
      healing_bonus: 0,
      shield_strength: 0,
      strength: 14,
      agility: 12,
      intelligence: 8,
    },
    ac: [],
    at: [],
    blood: 100,
    ee: 0,
    carry: {
      items: {},
      equipments: {
        MAIN_HAND: 'soul_spear',
        NECKLACE: 'blood_pendant'
      }
    },
  },
  {
    name: "玛奇玛",
    id: '4',
    avatar: makima,
    salu: '支配恶魔',
    gender: "2",
    element: "fire",
    ac: [],
    at: [],
    normal: SkillTypeMap.NORMAL_ATTACK.physical_normal.id,
    skill: [
      SkillTypeMap.ELEMENTAL_SKILL.makima_skill.id,
      SkillTypeMap.ELEMENTAL_BURST.tohka_skill.id
    ],
    ability: {
      hp: 200,
      shield: 60,
      attack: 20,
      defense: 3,
      evasion: 2,
      crit_rate: 8,
      crit_dmg: 130,
      speed: 85,
      mp: 110,
      penetration: 5,
      lifesteal: 10,
      element: "fire",
      elem_mastery: 40,
      elem_bonus: 10,
      magic_res: 0,
      fire_res: 15,
      ice_res: 15,
      lightning_res: 15,
      rage_bonus: 15,
      healing_bonus: 10,
      shield_strength: 25,
      strength: 10,
      agility: 6,
      intelligence: 14,
    },
    blood: 100,
    ee: 0,
    carry: {
      items: {},
      equipments: {
        MAIN_HAND: 'demon_contract',
        RING1: 'control_ring'
      }
    },
  },
  {
    name: "雷电将军",
    id: '5',
    avatar: leidian,
    salu: '尘世七执政',
    element: "thunder",
    gender: "2",
    at: [],
    normal: SkillTypeMap.NORMAL_ATTACK.physical_normal.id,
    skill: [
      SkillTypeMap.ELEMENTAL_SKILL.raiden_skill.id,
      SkillTypeMap.ELEMENTAL_SKILL.keqing_skill.id
    ],
    ability: {
      hp: 180,
      shield: 30,
      attack: 22,
      defense: 5,
      evasion: 3,
      crit_rate: 12,
      crit_dmg: 160,
      speed: 100,
      mp: 150,
      penetration: 12,
      lifesteal: 5,
      element: "thunder",
      elem_mastery: 90,
      elem_bonus: 18,
      fire_res: 5,
      ice_res: 5,
      lightning_res: 25,
      magic_res: 20,
      rage_bonus: 15,
      healing_bonus: 0,
      shield_strength: 10,
      strength: 12,
      agility: 10,
      intelligence: 12,
    },
    blood: 100,
    ee: 0,
    carry: {
      items: {},
      equipments: {
        MAIN_HAND: 'engulfing_lightning',
        HELMET: 'thunder_crown'
      }
    },
  },
  {
    name: "早坂爱",
    id: '6',
    avatar: ai,
    element: "wind",
    at: [],
    gender: "2",
    normal: SkillTypeMap.NORMAL_ATTACK.physical_normal.id,
    skill: [
      SkillTypeMap.ELEMENTAL_SKILL.ai_skill.id,
      SkillTypeMap.ELEMENTAL_SKILL.lancelot_skill.id
    ],
    ability: {
      hp: 150,
      shield: 20,
      attack: 16,
      defense: 3,
      evasion: 7,
      crit_rate: 18,
      crit_dmg: 140,
      speed: 215,
      mp: 100,
      penetration: 8,
      lifesteal: 3,
      element: "wind",
      elem_mastery: 120,
      elem_bonus: 12,
      magic_res: 20,
      fire_res: 5,
      ice_res: 5,
      lightning_res: 5,
      rage_bonus: 10,
      healing_bonus: 15,
      shield_strength: 5,
      strength: 8,
      agility: 16,
      intelligence: 10,
    },
    blood: 100,
    ee: 0,
    carry: {
      items: {},
      equipments: {
        MAIN_HAND: 'wind_dagger',
        BOOTS: 'stealth_boots'
      }
    },
  },
  {
    name: "一濑红莲",
    id: '7',
    avatar: issei,
    element: "dark",
    salu: '帝之月',
    ac: [],
    at: [],
    normal: SkillTypeMap.NORMAL_ATTACK.physical_normal.id,
    skill: [
      SkillTypeMap.ELEMENTAL_SKILL.issei_skill.id,
      SkillTypeMap.ELEMENTAL_BURST.issei_burst.id
    ],
    ability: {
      hp: 170,
      shield: 0,
      attack: 24,
      defense: 4,
      evasion: 5,
      crit_rate: 15,
      crit_dmg: 170,
      speed: 105,
      mp: 120,
      penetration: 15,
      lifesteal: 5,
      element: "fire",
      elem_mastery: 85,
      elem_bonus: 18,
      magic_res: 10,
      fire_res: 25,
      ice_res: 0,
      lightning_res: 5,
      rage_bonus: 20,
      healing_bonus: 0,
      shield_strength: 0,
      strength: 14,
      agility: 10,
      intelligence: 8,
    },
    blood: 100,
    ee: 0,
    carry: {
      items: {},
      equipments: {
        MAIN_HAND: 'flame_katana',
        ARMOR: 'flame_armor'
      }
    }
  },
  {
    name: "三宫三叶",
    id: '8',
    avatar: mitsuba,
    salu: '鬼月组',
    element: "wind",
    gender: "2",
    at: [],
    normal: SkillTypeMap.NORMAL_ATTACK.physical_normal.id,
    skill: [
      SkillTypeMap.ELEMENTAL_SKILL.mitsuba_skill.id,
      SkillTypeMap.ELEMENTAL_BURST.mitsuba_burst.id
    ],
    ability: {
      hp: 140,
      shield: 0,
      attack: 18,
      defense: 3,
      evasion: 12,
      crit_rate: 10,
      crit_dmg: 150,
      speed: 120,
      mp: 100,
      penetration: 10,
      lifesteal: 0,
      element: "wind",
      elem_mastery: 95,
      elem_bonus: 15,
      magic_res: 15,
      fire_res: 5,
      ice_res: 5,
      lightning_res: 5,
      rage_bonus: 10,
      healing_bonus: 0,
      shield_strength: 0,
      strength: 6,
      agility: 16,
      intelligence: 10,
    },
    blood: 100,
    ee: 0,
    carry: {
      items: {},
      equipments: {
        MAIN_HAND: 'wind_bow',
        BACK: 'wind_cloak'
      }
    }
  },
  {
    name: "特弥斯",
    id: '9',
    avatar: themis,
    salu: '古代人',
    element: "thunder",
    ac: [],
    at: [],
    normal: SkillTypeMap.NORMAL_ATTACK.magic_normal.id,
    skill: [
      SkillTypeMap.ELEMENTAL_SKILL.themis_skill.id,
      SkillTypeMap.ELEMENTAL_BURST.themis_burst.id
    ],
    ability: {
      hp: 160,
      shield: 0,
      attack: 22,
      defense: 4,
      evasion: 5,
      crit_rate: 12,
      crit_dmg: 160,
      speed: 95,
      mp: 130,
      penetration: 10,
      lifesteal: 0,
      element: "thunder",
      elem_mastery: 90,
      elem_bonus: 20,
      magic_res: 15,
      fire_res: 5,
      ice_res: 5,
      lightning_res: 20,
      rage_bonus: 15,
      healing_bonus: 0,
      shield_strength: 0,
      strength: 8,
      agility: 8,
      intelligence: 14,
    },
    blood: 100,
    ee: 0,
    carry: {
      items: {},
      equipments: {
        MAIN_HAND: 'justice_sword',
        ARMOR: 'judge_robe'
      }
    }
  }
]);

