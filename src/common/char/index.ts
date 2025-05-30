// import shinoa from "../../assets/65555.jpg?url";
import shinoa from "../../assets/img/shinoa.jpg?url";
import mui from "../../assets/20191117175619_qgnij.jpg?url";
import hutao from "../../assets/20221018182444_c011a.thumb.1000_0.jpg?url";
import makima from "../../assets/20220921002233_d070d.jpg?url";
import leidian from "../../assets/lGS9D3J9ux8JZ2O.thumb.1000_0.jpg?url";
import ai from "../../assets/bYS8xEdzULxapXw.thumb.1000_0.png?url";
import issei from "../../assets/issei.png?url";
import gaosupopo from "../../assets/gaosupopo.png?url";
import huang from "../../assets/huang.png?url";
// import mitsuba from "../../assets/mitsuba.jpg?url";
import mitsuba from "../../assets/img/mitsuba.jpg?url";
import themis from "../../assets/themis.jpg?url";
import by2 from "../../assets/img/by2.png?url";
import kll from "../../assets/img/kll.png?url";
import zy from "../../assets/img/zy.png?url";
import zty from "../../assets/img/zty.png?url";
import ctzs from "../../assets/img/ctzs.png?url";
import ctct from "../../assets/img/ctct.png?url";
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
    name: "周瑜",
    id: '12',
    position: {
      index: 0
    },
    avatar: zy,
    salu: '盈月之仪',
    gender: "2",
    element: "fire",
    normal: SkillTypeMap.NORMAL_ATTACK.physical_normal.id,
    normal_name: "火矢",
    skill: [
      SkillTypeMap.ELEMENTAL_SKILL.zy_skill.id,
      SkillTypeMap.ELEMENTAL_BURST.zy_burst.id
    ],
    ability: {
      hp: 100,
      hp_re: 5,
      shield: 0,
      attack: 25,
      elem_bonus: 23,
      defense: 0,
      evasion: 6,
      crit_rate: 15,
      crit_dmg: 55,
      speed: 54,
      mp: 90,
      penetration: 15,
      lifesteal: 8,
      element: "fire",
      elem_mastery: 100,
      magic_res: 0,
      fire_res: 20,
      ice_res: 0,
      lightning_res: 0,
      rage_bonus: 25,
      healing_bonus: 0,
      shield_strength: 0,
      strength: 3,
      agility: 14,
      intelligence: 14,
    },
    ac: [],
    at: [],
    blood: 100,
    ee: 0,
  },
  {
    name: "高速婆婆",
    id: "turbo_bachan",
    type: "1",
    avatar: gaosupopo,
    position: {
      index: 2
    },
    at: [],
    element: "fire", // 角色元素属性
    ability: {
      // 基础属性
      hp: 120, // 生命上限
      shield: 0,  // 护盾
      attack: 18,    // 攻击力
      defense: 4,  // 防御力
      evasion: 8, // 闪避率
      crit_rate: 10, // 暴击率
      crit_dmg: 50,
      speed: 65, // 速度(影响行动顺序)
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
      shield_strength: 0, 
      strength: 8,    
      agility: 15,    
      intelligence: 7, 
    },
    salu: '六甲山的妖怪',
    grow: {
      level: 1,
      rarity: 1,
      strength: 1,
      agility: 1,
      intelligence: 1,
    },
    skill: [
      "attack_flame", "red_flame"
    ],
    normal: SkillTypeMap.NORMAL_ATTACK.physical_normal.id,
    ee: 0,
  },
  {
    name: "克鲁鲁·采佩西",
    id: '11',
    position: {
      index: 6
    },
    avatar: kll,
    salu: '第三位始祖',
    gender: "2",
    element: "dark",
    normal: SkillTypeMap.NORMAL_ATTACK.magic_normal.id,
    normal_name: "血刃",
    skill: [
      SkillTypeMap.ELEMENTAL_SKILL.makima_skill.id,
      // SkillTypeMap.ELEMENTAL_BURST.tohka_skill.id
      "神罗八百万"
    ],
    ability: {
      hp: 140,
      hp_re: 7,
      shield: 0,
      attack: 25,
      defense: 2,
      evasion: 6,
      crit_rate: 10,
      crit_dmg: 50,
      speed: 50,
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
      strength: 6,
      agility: 8,
      intelligence: 16,
    },
    ac: [],
    at: [],
    blood: 100,
    ee: 0,
  },
  {
    name: "煌雷龙",
    id: "0",
    type: "1",
    avatar: huang,
    at: [],
    salu: ' 天堑沙原霸主',
    element: "thunder", // 角色元素属性
    normal_name: "落雷",
    ability: {
      hp: 260,
      shield: 0,
      attack: 9,
      defense: 17,
      evasion: 8,
      crit_rate: 10,
      crit_dmg: 50,
      speed: 50,
      mp: 100,
      penetration: 10,
      lifesteal: 5,
      elem_mastery: 80,
      elem_bonus: 15,
      magic_res: 0,
      fire_res: 0,
      ice_res: 15,
      lightning_res: 5,
      rage_bonus: 20,
      healing_bonus: 0,
      shield_strength: 0,
      strength: 20,
      agility: 4,
      intelligence: 2,
    },
    position: {
      index: 5
    },
    grow: {
      level: 1,
      rarity: 1,
      strength: 1,
      agility: 1,
      intelligence: 1,
    },
    skill: [
      SkillTypeMap.ELEMENTAL_SKILL.themis_skill.id,
      SkillTypeMap.ELEMENTAL_BURST.themis_burst.id
    ],
    normal: SkillTypeMap.NORMAL_ATTACK.physical_normal.id,
  },
  {
    name: "斋藤一",
    id: 'zty',
    avatar: zty,
    salu: '新选组三番组长',
    type: "1",
    element: "water",
    ac: [],
    at: [],
    normal: SkillTypeMap.NORMAL_ATTACK.physical_normal.id,
    normal_name: "居合术",
    position: {
      index: 7,
    },
    skill: [  // 无外流、一刀流
      "无外流",
      "一刀流",
      // SkillTypeMap.ELEMENTAL_SKILL.themis_skill.id,
      // SkillTypeMap.ELEMENTAL_BURST.themis_burst.id
    ],
    ability: {
      hp: 200,
      shield: 0,
      attack: 9,
      defense: 15,
      evasion: 5,
      crit_rate: 10,
      crit_dmg: 50,
      speed: 50,
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
      strength: 16,
      agility: 8,
      intelligence: 8,
    },
    blood: 100,
    ee: 0,
  },
  {
    name: "玛奇玛",
    id: '4',
    avatar: makima,
    salu: '支配恶魔',
    gender: "2",
    element: "fire",
    type: "1",
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
      crit_rate: 10,
      crit_dmg: 50,
      speed: 50,
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
  }
]);

export const initialData = DataSchema.parse([
  {
    name: "一濑红莲",
    id: '7',
    avatar: issei,
    element: "dark",
    salu: '帝之月',
    position: {
      index: 5
    },
    ac: [],
    at: [],
    normal: SkillTypeMap.NORMAL_ATTACK.physical_normal.id,
    skill: [
      SkillTypeMap.ELEMENTAL_SKILL.issei_skill.id,
      SkillTypeMap.ELEMENTAL_BURST.issei_burst.id
    ],
    ability: {
      hp: 200,
      shield: 0,
      attack: 16,
      defense: 10,
      evasion: 5,
      crit_rate: 10,
      crit_dmg: 60,
      speed: 50,
      mp: 120,
      penetration: 15,
      lifesteal: 5,
      elem_mastery: 85,
      elem_bonus: 18,
      magic_res: 10,
      fire_res: 25,
      ice_res: 0,
      lightning_res: 5,
      rage_bonus: 20,
      healing_bonus: 0,
      shield_strength: 0,
      strength: 16,
      agility: 11,
      intelligence: 8,
    },
    blood: 100,
    ee: 0,
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
    element: "fire",
    normal: SkillTypeMap.NORMAL_ATTACK.physical_normal.id,
    normal_name: "往生秘传枪法(普通)",
    skill: [
      SkillTypeMap.ELEMENTAL_SKILL.hutao_skill.id,
      SkillTypeMap.ELEMENTAL_SKILL.eula_skill.id
    ],
    ability: {
      hp: 120,
      hp_re: 7,
      shield: 0,
      attack: 22,
      defense: 4,
      evasion: 6,
      crit_rate: 20,
      crit_dmg: 65,
      speed: 60,
      mp: 90,
      penetration: 15,
      lifesteal: 8,
      elem_mastery: 100,
      elem_bonus: 20,
      magic_res: 0,
      fire_res: 20,
      ice_res: 0,
      lightning_res: 0,
      rage_bonus: 25,
      healing_bonus: 0,
      shield_strength: 0,
      strength: 6,
      agility: 15,
      intelligence: 8,
    },
    ac: [],
    at: [],
    blood: 100,
    ee: 0,
  },

  {
    name: "百夜米迦尔",
    id: '10',
    position: {
      index: 2
    },
    avatar: by2,
    salu: '吸血鬼都市防卫队',
    gender: "2",
    element: "light",
    normal: SkillTypeMap.NORMAL_ATTACK.physical_normal.id,
    normal_name: "夜刃突袭",
    skill: [
      "南天十字", "天魔反·无间"
    ],
    ability: {
      hp: 170,
      hp_re: 7,
      shield: 0,
      attack: 18,
      defense: 8,
      evasion: 6,
      crit_rate: 20,
      crit_dmg: 70,
      speed: 60,
      mp: 90,
      penetration: 15,
      lifesteal: 8,
      elem_mastery: 100,
      elem_bonus: 20,
      magic_res: 0,
      fire_res: 20,
      ice_res: 0,
      lightning_res: 0,
      rage_bonus: 25,
      healing_bonus: 0,
      shield_strength: 0,
      strength: 10,
      agility: 12,
      intelligence: 8,
    },
    ac: [],
    at: [],
    blood: 100,
    ee: 0,
  },
  {
    name: "柊筱娅",
    id: "1",
    avatar: shinoa,
    salu: '帝鬼军',
    gender: "2",
    at: [],
    element: "ice", // 角色元素属性
    buff: {},
    skill: [
      SkillTypeMap.ELEMENTAL_BURST.shinoa_burst.id,
      SkillTypeMap.ELEMENTAL_BURST.ayaka_skill.id,
    ],
    position: {
      index: 3
    },
    normal: SkillTypeMap.NORMAL_ATTACK.physical_normal.id,
    ability: {
      hp: 160,
      shield: 0,
      attack: 18,
      defense: 10,
      evasion: 8,
      crit_rate: 10,
      crit_dmg: 50,
      speed: 50,
      mp: 100,
      penetration: 10,
      lifesteal: 5,
      elem_mastery: 80,
      elem_bonus: 15,
      magic_res: 0,
      fire_res: 0,
      ice_res: 15,
      lightning_res: 5,
      rage_bonus: 20,
      healing_bonus: 0,
      shield_strength: 0,
      strength: 8,
      agility: 12,
      intelligence: 10,
    },
    blood: 100,
    ee: 0,
  },
  {
    name: "冲田总司",
    id: 'ctzs',
    avatar: ctzs,
    salu: '新选组一番组长',
    element: "wind",
    ac: [],
    at: [],
    position: {
      index: 4
    },
    normal_name: "天然理心流·三段突刺",
    normal: SkillTypeMap.NORMAL_ATTACK.physical_normal.id,
    skill: [  //  鬼子·散  无装剑 天
      "鸢飞戾天",
      "天然理心流奥义",
      // SkillTypeMap.ELEMENTAL_SKILL.themis_skill.id,
      // SkillTypeMap.ELEMENTAL_BURST.themis_burst.id
    ],
    ability: {
      hp: 160,
      shield: 0,
      attack: 16,
      defense: 8,
      evasion: 5,
      crit_rate: 10,
      crit_dmg: 50,
      speed: 61,
      mp: 130,
      penetration: 10,
      lifesteal: 0,
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
      agility: 15,
      intelligence: 6,
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
    ],
    ability: {
      hp: 180,
      shield: 40,
      attack: 15,
      mp_re: 10,
      defense: 4,
      evasion: 4,
      crit_rate: 10,
      crit_dmg: 50,
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
  },
  {
    name: "雷电影",
    id: '5',
    avatar: leidian,
    salu: '尘世七执政',
    element: "thunder",
    gender: "2",
    at: [],
    position: {
      index: 0
    },
    normal: SkillTypeMap.NORMAL_ATTACK.physical_normal.id,
    skill: [
      SkillTypeMap.ELEMENTAL_SKILL.raiden_skill.id,
      "raiden_burst"
    ],
    ability: {
      hp: 190,
      shield: 30,
      attack: 10,
      defense: 17,
      evasion: 3,
      crit_rate: 10,
      crit_dmg: 50,
      speed: 50,
      mp: 150,
      penetration: 10,
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
      strength: 17,
      agility: 3,
      intelligence: 6,
    },
    blood: 100,
    ee: 0,
  },
  {
    name: "冲田总司",
    id: 'ctct',
    avatar: ctct,
    salu: '终末魔神',
    element: "water",
    ac: [],
    at: [],  //   极地 不断  炼狱剑
    normal_name: "无边",
    normal: SkillTypeMap.NORMAL_ATTACK.physical_normal.id,
    skill: [
      "不断", "绝剑·无穹三段"
    ],
    ability: {
      hp: 160,
      shield: 0,
      attack: 22,
      defense: 4,
      evasion: 5,
      crit_rate: 10,
      crit_dmg: 50,
      speed: 50,
      mp: 130,
      penetration: 10,
      lifesteal: 0,
      elem_mastery: 90,
      elem_bonus: 20,
      magic_res: 15,
      fire_res: 5,
      ice_res: 5,
      lightning_res: 20,
      rage_bonus: 15,
      healing_bonus: 0,
      shield_strength: 0,
      strength: 10,
      agility: 12,
      intelligence: 8,
    },
    blood: 100,
    ee: 0,
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
      crit_dmg: 50,
      speed: 50,
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
      strength: 4,
      agility: 7,
      intelligence: 16,
    },
    blood: 100,
    ee: 0,
  },
  {
    name: "三宫三叶",
    id: '8',
    avatar: mitsuba,
    salu: '月鬼组',
    element: "wind",
    gender: "2",
    at: [],
    normal: SkillTypeMap.NORMAL_ATTACK.physical_normal.id,
    skill: [
      '一骑当千',
      '巨斧头'
    ],
    position: { index: 6 },
    ability: {
      hp: 180,
      shield: 0,
      attack: 13,
      defense: 13,
      evasion: 12,
      crit_rate: 10,
      crit_dmg: 50,
      speed: 50,
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
      strength: 13,
      agility: 9,
      intelligence: 7,
    },
    blood: 100,
    ee: 0,
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
      attack: 14,
      defense: 12,
      evasion: 5,
      crit_rate: 10,
      crit_dmg: 50,
      speed: 50,
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
  }

]);

