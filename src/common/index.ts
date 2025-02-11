import { z } from "zod";

const skill_svg_list = Object.values(import.meta.glob(`/src/assets/skill/*/*/*.svg`,{as:'url',import:'default',eager:true}))
const item_svg_list = Object.values(import.meta.glob(`/src/assets/items/*/*/*.svg`,{as:'url',import:'default',eager:true}))
const svg_list = {
    skill: skill_svg_list,
    item: item_svg_list
}
export const ElementType = z.enum(['fire', 'ice', 'thunder', 'wind', 'water', 'default', 'grass', 'dark', 'light']);
export const ElementColors = z.record(ElementType, z.string());
export type ElementColors = z.infer<typeof ElementColors>;
export const elementColors = ElementColors.parse({
    fire: '#FF4C4C',
    ice: '#99FFFF',
    thunder: '#9966FF',
    wind: '#80FF80',
    water: '#3399FF',
    default: '#CCCCCC',
    grass: '#33CC33',
    dark: '#000',
    light: '#FFE666'
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

let id = 0
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