import { number, z } from "zod";
import { Skill, SkillType } from "../skill";
import cloneDeep from "lodash-es/cloneDeep";
import { AbilitySchema, CarryBuffSchema, EffectsSchema } from "./attr";
import { ElementType } from "..";
import { BattleActionSchema } from "../record/type";
import css from "styled-jsx/css";
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
});
// 角色星级定义
export const RaritySchema = z.number().min(1).max(5);
// 基础属性定义
export const BaseStatSchema = z.object({
  strength: z.number(),
  agility: z.number(),
  intelligence: z.number()
});
// 成长率定义
export const GrowthRateSchema = z.object({
  strength: z.number().min(0).default(0),
  agility: z.number().min(0).default(0),
  intelligence: z.number().min(0).default(0)
}).optional();

export const CharacterDisplaySchema = z.object({
  at: ActionSchema.default([]),
});
export const CharacterType = z.number().min(0).max(2).default(0)
// 角色状态相关的Schema
export const CharacterStatusSchema = z.object({
  target: z.any(),
});

export const StatusSchema = z.object({
  damage: z.number().min(0).default(0),
  hp: z.number().min(0).optional(),
  mp: z.number().min(0).optional(),
  reborn: z.number().min(0).default(0),
});

// Save相关的Schema
export const CharacterSaveSchema = z.object({
  id: z.string(),
  name: z.string(),
  salu: z.string().optional(), //称号
  type: CharacterType, //1 boss 0人物 2部队
  avatar: z.string().optional(),
  buff: CarryBuffSchema.default({}),
  count: z.number().min(0).default(1), // 角色拥有数量
  element: ElementType,
  gender: z.number().min(0).max(2).default(0), // 1 男 2女
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
  ability: AbilitySchema.merge(BaseStatSchema),
  normal: z.string(),
  skill: z.array(z.string()).max(8).optional(),
  grow: z.object({
    level: z.number().min(0).max(50).default(1), // 角色等级
    exp: z.number().min(0).default(0), // 当前经验值
    tem_exp: z.number().min(0).default(0),
    growthRates: GrowthRateSchema, // 成长率
    rarity: RaritySchema.min(0).max(5).default(5), // 角色稀有度
  }).default({}),
  //不保存的
  display: z.object({
    frame_type: z.enum(['item', 'equip', 'troops'])
  }).default({ frame_type: 'equip' }),
  state: z.number().min(0).max(3).default(0), //存活状态 1为死亡 0为存活 2为休息 3为探索 4为练级
  imm_ability: AbilitySchema.default(AbilitySchema.parse({})),
})
console.log(CharacterSaveSchema,'CharacterSaveSchema');
//需要用户设置的
export const CharacterSchema = z.object({}).merge(CharacterSaveSchema).merge(CharacterStatusSchema).merge(CharacterDisplaySchema).transform(data => {
  if(!data.status){
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




