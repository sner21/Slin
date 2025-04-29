
export const CharacterTranslations = {
    // 基础信息
    id: { en: 'ID', zh: '编号' },
    name: { en: 'Name', zh: '名称' },
    salu: { en: 'Title', zh: '称号' },
    type: { en: 'Type', zh: '类型' },
    avatar: { en: 'Avatar', zh: '头像' },
    count: { en: 'Count', zh: '数量' },
    element: { en: 'Element', zh: '元素' },
    gender: {
        label: { en: 'Gender', zh: '性别' },
        options: {
            '0': { en: 'None', zh: '无' },
            '1': { en: 'Male', zh: '男' },
            '2': { en: 'Female', zh: '女' }
        }
    },
    desc: { en: 'Description', zh: '描述' },

    // 状态
    status: {
        label: { en: 'Status', zh: '状态' },
        damage: { en: 'Damage', zh: '伤害' },
        hp: { en: 'HP', zh: '生命值' },
        mp: { en: 'MP', zh: '魔法值' },
        reborn: { en: 'Rebirth', zh: '重生次数' }
    },

    // 物品与装备
    carry: {
        label: { en: 'Inventory', zh: '背包' },
        items: { en: 'Items', zh: '物品' },
        currency: { en: 'Currency', zh: '货币' },
        troops: { en: 'Troops', zh: '部队' },
        equipments: {
            label: { en: 'Equipment', zh: '装备' },
            MAIN_HAND: { en: 'Main Hand', zh: '主手' },
            OFF_HAND: { en: 'Off Hand', zh: '副手' },
            HELMET: { en: 'Helmet', zh: '头盔' },
            ARMOR: { en: 'Armor', zh: '护甲' },
            GAUNTLETS: { en: 'Gauntlets', zh: '手套' },
            GREAVES: { en: 'Greaves', zh: '护腿' },
            BOOTS: { en: 'Boots', zh: '靴子' },
            NECKLACE: { en: 'Necklace', zh: '项链' },
            RING: { en: 'Ring', zh: '戒指' },
            RING_2: { en: 'Ring 2', zh: '戒指2' },
            BELT: { en: 'Belt', zh: '腰带' },
            BACK: { en: 'Back', zh: '背部' },
            MISC_1: { en: 'Misc 1', zh: '杂项1' },
            MISC_2: { en: 'Misc 2', zh: '杂项2' }
        }
    },

    // 能力值
    ability: {
        label: { en: 'Abilities', zh: '能力值' },
        strength: { en: 'Strength', zh: '力量' },
        agility: { en: 'Agility', zh: '敏捷' },
        intelligence: { en: 'Intelligence', zh: '智力' }
    },

    // 技能
    normal: { en: 'Normal Attack', zh: '普通攻击' },
    skill: { en: 'Skills', zh: '技能' },

    // 成长
    grow: {
        label: { en: 'Growth', zh: '成长' },
        level: { en: 'Level', zh: '等级' },
        exp: { en: 'Experience', zh: '经验值' },
        tem_exp: { en: 'Temporary EXP', zh: '临时经验' },
        growthRates: {
            label: { en: 'Growth Rates', zh: '成长率' },
            strength: { en: 'Strength Growth', zh: '力量成长' },
            agility: { en: 'Agility Growth', zh: '敏捷成长' },
            intelligence: { en: 'Intelligence Growth', zh: '智力成长' }
        },
        rarity: { en: 'Rarity', zh: '稀有度' }
    },

    // 显示相关
    display: {
        label: { en: 'Display', zh: '显示' },
        frame_type: {
            label: { en: 'Frame Type', zh: '框架类型' },
            options: {
                item: { en: 'Item', zh: '物品' },
                equip: { en: 'Equipment', zh: '装备' },
                troops: { en: 'Troops', zh: '部队' }
            }
        }
    },

    // 状态
    state: {
        label: { en: 'State', zh: '状态' },
        options: {
            '0': { en: 'Alive', zh: '存活' },
            '1': { en: 'Dead', zh: '死亡' },
            '2': { en: 'Resting', zh: '休息' },
            '3': { en: 'Exploring', zh: '探索' },
            '4': { en: 'Training', zh: '练级' }
        }
    }
} as const;

// 类型定义
export type TranslationKey = keyof typeof CharacterTranslations;
export type Translation = {
    en: string;
    zh: string;
};