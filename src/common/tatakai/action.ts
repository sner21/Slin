import { Character } from "../char/types";

export class ActionGauge {
    public MAX_GAUGE = 200; // 行动条最大值
    public gauges: Map<number, number>; // 记录每个角色的行动条进度

    constructor() {
        this.gauges = new Map();
    }

    // 初始化角色行动条
    initCharacter(characterId: number, speed: number) {
        const initialGauge = speed;
        this.gauges.set(characterId, initialGauge);
    }

    // 更新所有角色的行动条
    updateGauges(characters: Character[]) {
        const gauges: number[] = []
        characters.forEach(char => {
            if (char.state === 1) return
            gauges.push(char.imm_ability.speed)
            const currentGauge = this.gauges.get(char.id) || 0;
            const increment = char.imm_ability.speed;
            const newGauge = currentGauge + increment;
            this.gauges.set(char.id, newGauge);
        });
        this.MAX_GAUGE = Math.max(...gauges) * 2;
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
    resetGauge(characterId: number) {
        const currentGauge = this.gauges.get(characterId) || 0;
        this.gauges.set(characterId, currentGauge - this.MAX_GAUGE);
    }
}