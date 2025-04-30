import { z } from "zod";
import { Rule } from 'antd/lib/form'
export const getMirrorPosition = (index: number): number => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    return row * 3 + (2 - col);
}
export const levelColorClass = (rarity: number) => {
    switch (rarity) {
        case 1:
            return 'gray'; 
        case 2:
            return 'green'; 
        case 3:
            return 'blue'; 
        case 4:
            return 'purple'; 
        case 5:
            return 'orange'; 
        default:
            return 'gray';
    }
};
export const getNumberConstraints = (schema: any, constraints: any = {}) => {
    const def = schema._def;
    if (def.defaultValue) {
        constraints.defaultValue = typeof def.defaultValue === 'function'
            ? def.defaultValue()
            : def.defaultValue;
    }
    if (def.checks) {
        const checks = def.checks || [];
        checks.forEach((check: any) => {
            if (check.kind === 'min') constraints.min = check.value;
            if (check.kind === 'max') constraints.max = check.value;
        });
    }
    constraints.minLength = schema.minLength
    constraints.maxLength = schema.maxLength
    if (def.typeName === 'ZodDefault' || def.typeName === 'ZodOptional') {
        return getNumberConstraints(def.innerType, constraints);
    }
    return constraints;
};
export function zodToFormRules(schema: z.ZodType<any>): Rule[] {
    const rules: Rule[] = []

    // 获取原始schema定义

    // 检查是否必填
    if (!schema?.isOptional()) {
        rules.push({ required: true, message: '此项为必填' })
    }

    return rules
}
const skill_svg_list = Object.values(import.meta.glob(`/src/assets/skill/*/*/*.svg`, { as: 'url', import: 'default', eager: true }))
const item_svg_list = Object.values(import.meta.glob(`/src/assets/items/*/*/*.svg`, { as: 'url', import: 'default', eager: true }))
const svg_list = {
    skill: skill_svg_list,
    item: item_svg_list
}
export const ElementType = z.enum(['fire', 'ice', 'thunder', 'wind', 'water', 'default', 'grass', 'dark', 'light']).default('default');
export const ElementColors = z.record(ElementType, z.string());
export type ElementColors = z.infer<typeof ElementColors>;
export const ElementalRelations = {
    fire: {
        ice: 1.5,
        wind: 1.2,
        water: 0.7,
        grass: 1.5,
        thunder: 1,
        dark: 1,
        light: 1,
        default: 1
    },
    ice: {
        water: 1.2,
        thunder: 0.7,
        wind: 1.5,
        fire: 0.7,
        grass: 1.2,
        dark: 1,
        light: 1,
        default: 1
    },
    thunder: {
        water: 1.5,
        ice: 1.5,
        wind: 0.7,
        fire: 1,
        grass: 0.7,
        dark: 1.2,
        light: 0.7,
        default: 1
    },
    wind: {
        thunder: 1.5,
        fire: 0.7,
        ice: 0.7,
        water: 1.2,
        grass: 1.2,
        dark: 1,
        light: 1,
        default: 1
    },
    water: {
        fire: 1.5,
        thunder: 0.7,
        ice: 1,
        wind: 1,
        grass: 0.7,
        dark: 1,
        light: 1.2,
        default: 1
    },
    grass: {
        water: 1.5,
        thunder: 1.5,
        fire: 0.7,
        ice: 0.7,
        wind: 1,
        dark: 0.7,
        light: 1.2,
        default: 1
    },
    dark: {
        light: 1.5,
        grass: 1.5,
        thunder: 0.7,
        fire: 1,
        ice: 1,
        wind: 1,
        water: 1,
        default: 1
    },
    light: {
        dark: 1.5,
        thunder: 1.5,
        water: 0.7,
        grass: 0.7,
        fire: 1,
        ice: 1,
        wind: 1,
        default: 1
    },
    default: {
        fire: 1,
        ice: 1,
        thunder: 1,
        wind: 1,
        water: 1,
        grass: 1,
        dark: 1,
        light: 1,
        default: 1
    }
} as const;
export const elementColors = ElementColors.parse({
    fire: '#FF4C4C',
    ice: '#99FFFF',
    thunder: 'rgb(214 223 0)',
    wind: '#80FF80',
    water: '#3399FF',
    // default: '#CCCCCC',
    grass: '#33CC33',
    dark: '#9966FF',  //#9966FF rgb(71 24 228)
    light: 'rgb(255 241 171)'
})
export const elementNames = ElementColors.parse({
    fire: '火',
    ice: '冰',
    thunder: '雷',
    wind: '风',
    water: '水',
    // default: '#CCCCCC',
    grass: '草',
    dark: '暗',  //#9966FF rgb(71 24 228)
    light: '光'
})
export const changeColor = (ov: number, nw: number): string => {
    if (ov === nw) return 'white'
    if (ov < nw) return 'red'
    else return 'green'
}

export const randomInt = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// declare const objectType: <T extends ZodRawShape>(shape: T, params?: RawCreateParams) => ZodObject<T, "strip", ZodTypeAny, { [k in keyof objectUtil.addQuestionMarks<baseObjectOutputType<T>, any>]: objectUtil.addQuestionMarks<baseObjectOutputType<T>, any>[k]; }, { [k_1 in keyof baseObjectInputType<T>]: baseObjectInputType<T>[k_1]; }>;

type ArrayHolder = {
    [key: string]: any[];
} | any[];

export const fixedPush = <T extends ArrayHolder>(
    obj: T,
    path: keyof T,
    ...params: any[]
): void => {
    if (!obj[path]) {
        (obj[path] as any[]) = [];
    }
    (obj[path] as any[]).push(...params);
    obj[path].length > 100 && obj[path].splice(-1, 1);
}
export const get_svg_uri = (index: number, meta_url: string, type = 'skill'): string => {
    return get_uri(svg_list[type][index], meta_url)
}
export const get_uri = (uri: string, meta_url: string): string => {
    return uri
}