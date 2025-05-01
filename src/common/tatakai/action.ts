import { Character } from "../char/types";

export class ActionGauge {
    public MAX_GAUGE = 200; // 行动条最大值
    public gauges: Map<string, number>; // 记录每个角色的行动条进度

    constructor() {
        this.gauges = new Map();
    }

    // 初始化角色行动条
    initCharacter(characterId: string, speed: number) {
        const initialGauge = speed;
        this.gauges.set(characterId, initialGauge);
    }
    // 计算下一个角色行动所需的时间（毫秒）
    getNextActionTime(characters: Character[]): number {
        let minTime = Infinity;

        characters.forEach(char => {
            if (char.state === 1) return;

            const currentGauge = this.gauges.get(char.id) || 0;
            const speed = char.imm_ability.speed;

            if (speed > 0) {
                // 计算到达 MAX_GAUGE 还需要多少点数
                const remainingGauge = this.MAX_GAUGE - currentGauge;
                if (remainingGauge > 0) {
                    // 计算需要多少毫秒
                    // 1000ms 增加 speed 点数，那么增加 remainingGauge 需要多少毫秒
                    const timeNeeded = (remainingGauge / speed) * 1000;
                    minTime = Math.min(minTime, timeNeeded);
                } else {
                    // 已经可以行动，立即触发
                    minTime = 0;
                }
            }
        });

        return Math.max(Math.ceil(minTime), 100); // 最小间隔100ms
    }
    // 更新所有角色的行动条
    updateGauges(characters: Character[], time = 500) {
        const gauges: number[] = []
        characters.forEach(char => {
            if (char.state === 1) return
            gauges.push(char.imm_ability.speed)
            const currentGauge = this.gauges.get(char.id) || 0;
            const increment = char.imm_ability.speed;
            const newGauge = currentGauge + increment;
            this.gauges.set(char.id, newGauge);
        });
        console.log(Math.max(...gauges) * 14 * 500 / time, 11)
        this.MAX_GAUGE = Math.max(...gauges) * 14 * 500 / time;
    }


    // 获取当前可以行动的角色
    getReadyCharacters(characters: Character[]): Character[] {
        return characters.filter(char => {
            const gauge = this.gauges.get(char.id) || 0;
            return !char.state && gauge >= this.MAX_GAUGE;
        });
    }
    // 获取当前可以行动的角色Id
    getReadyCharactersId(characters: Character[]): Character["id"][] {
        return this.getReadyCharacters(characters).map(i => i.id)
    }
    // 角色行动后重置其行动条
    resetGauge(characterId: string) {
        const currentGauge = this.gauges.get(characterId) || 0;
        this.gauges.set(characterId, currentGauge - this.MAX_GAUGE);
    }
}