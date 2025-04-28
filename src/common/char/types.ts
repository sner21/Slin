import { number, z } from "zod";
import { Skill, SkillType, SkillTypeMap } from "../skill";
import cloneDeep from "lodash-es/cloneDeep";
import { AbilitySchema, CarryBuffSchema, EffectsSchema } from "./attr";
import { ElementType } from "..";
import { BattleActionSchema } from "../record/type";

// 技能效果类型
export const EffectType = z.enum([
  'DAMAGE',            // 伤害
  'HEAL',             // 治疗
  'SHIELD',           // 护盾
  'BUFF',             // 增益
  'DEBUFF',            // 减益
  'REGEN',            // 回复
  'DEFAULT'
]);

export const ActionSchema = z.array(BattleActionSchema);
export const ItemsDataSchema = z.object({
  id: z.string(),
  count: z.number().default(1),
  cls: z.string(),
  type: z.string().default(""),
});
// 角色星级定义
export const RaritySchema = z.number().min(1).max(5);
// 基础属性定义
export const BaseStatSchema = z.object({
  strength: z.number().min(0).default(1),
  agility: z.number().min(0).default(1),
  intelligence: z.number().min(0).default(1)
});
// 成长率定义
export const GrowthRateSchema = z.object({
  strength: z.number().min(0).default(0.2),
  agility: z.number().min(0).default(0.2),
  intelligence: z.number().min(0).default(0.2)
}).default({});

export const CharacterDisplaySchema = z.object({
  at: ActionSchema.default([]),
});
export const CharacterType = z.enum(["0", "1", "2"]).describe('0:人物 1:boss 2:部队').default("0")
// 角色状态相关的Schema
export const CharacterStatusSchema = z.object({
  target: z.any().optional(),
});

export const StatusSchema = z.object({
  damage: z.number().min(0).default(0),
  hp: z.number().min(0).optional(),
  mp: z.number().min(0).optional(),
  reborn: z.number().min(0).optional(),
  find_gap: z.number().min(0).optional(),
});

// Save相关的Schema
export const CharacterSaveSchema = z.object({
  id: z.string(),
  name: z.string().default(""),
  salu: z.string().max(8).optional(), //称号
  type: CharacterType, //1 boss 0人物 2部队
  avatar: z.string().describe('( url )').optional(),
  buff: CarryBuffSchema.default({}),
  count: z.number().min(0).default(1), // 角色拥有数量
  element: ElementType,
  gender: z.enum(["0", "1", "2"]).describe('0:无,1:男,2:女').default("0"), // 1 男 2女
  position: z.object({ //阵型
    index: z.number().optional(),
  }).default({}),
  description: z.string().optional(),
  status: StatusSchema.optional(),
  carry: z.object({
    items: z.record(ItemsDataSchema).default({}), //物品
    currency: z.number().default(0), //货币
    troops: z.record(z.any()).optional(),
    equipments: z.object({
      MAIN_HAND: z.string().optional(),
      OFF_HAND: z.string().optional(),
      HELMET: z.string().optional(),
      ARMOR: z.string().optional(),
      GAUNTLETS: z.string().optional(),
      GREAVES: z.string().optional(),
      BOOTS: z.string().optional(),
      NECKLACE: z.string().optional(),
      RING: z.string().optional(),
      RING_2: z.string().optional(),
      BELT: z.string().optional(),
      BACK: z.string().optional(),
      MISC_1: z.string().optional(),
      MISC_2: z.string().optional()
    }).default({}),
  }).default({}),
  ability: AbilitySchema.merge(BaseStatSchema).default({}),
  normal: z.string().default(SkillTypeMap.NORMAL_ATTACK.physical_normal.id),
  skill: z.array(z.string()).max(8).optional(),
  grow: z.object({
    level: z.number().min(0).max(50).default(1), // 角色等级
    exp: z.number().min(0).default(0), // 当前经验值
    // tem_exp: z.number().min(0).default(0),
    growthRates: GrowthRateSchema, // 成长率
    rarity: RaritySchema.min(0).max(5).default(1), // 角色稀有度
  }).default({}),
  //不保存的
  display: z.object({
    frame_type: z.enum(['equip', 'item', 'troops', 'skill', 'state', 'logs'])
  }).default({ frame_type: 'skill' }),
  state: z.number().min(0).max(4).describe('1:死亡 0:存活 2:休息 3:探索 4:练级').default(0),
  imm_ability: AbilitySchema.default(AbilitySchema.parse({})),
})
//需要用户设置的
export const CharacterSchema = z.object({}).merge(CharacterSaveSchema).merge(CharacterStatusSchema).merge(CharacterDisplaySchema).transform(data => {
  (data.type === "1" && (data.display.frame_type = "logs"))
  if (!data.status) {
    data.status = StatusSchema.parse({ ...cloneDeep(data.ability) });
    data.status.reborn = 0;

  }

  return data;
});


export const DataSchema = z.array(CharacterSchema);
// 导出类型
export type Ability = z.infer<typeof AbilitySchema>;
export type Character = z.infer<typeof CharacterSchema>;
export type Data = z.infer<typeof DataSchema>;

export type Action = z.infer<typeof ActionSchema>;




