import { LogsDataSchma } from "./type";
import { BattleManager } from "../tatakai";
type ArrayHolder = {
    [key: string]: any[];
} | any[];

export function RecordManager(zenkio: InstanceType<typeof BattleManager>) {
    const logsDataSchma = LogsDataSchma.parse({})
    let id = 0
    const fixedPush = <T extends ArrayHolder>(
        obj: T,
        path: keyof T,
        params: any,
        flag: boolean = false
    ): void => {
        if (!obj[path]) {
            (obj[path] as any[]) = [];
        }
        const item = Array.isArray(params) ? { ...params[0] } : { ...params };
        (obj[path] as any[]).unshift({ ...item, id: id++ });
        obj[path].length > 100 && obj[path].pop();
        if (!flag && path !== 'global') {
            fixedPush(logsDataSchma, 'global', params)
        }

    }
    return {
        logsDataSchma,
        fixedPush
    }
}