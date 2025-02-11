import { Character } from "../char/types";

export class ActionGauge {
    private readonly MAX_GAUGE = 10000; // 行动条最大值
    private gauges: Map<number, number>; // 记录每个角色的行动条进度

    constructor() {
        this.gauges = new Map();
    }

    // 初始化角色行动条
    initCharacter(characterId: number, speed: number) {
        // 初始进度基于速度值
        const initialGauge = speed * 100;
        this.gauges.set(characterId, initialGauge);
    }

    // 更新所有角色的行动条
    updateGauges(characters: Character[]) {
        characters.forEach(char => {
            const currentGauge = this.gauges.get(char.id) || 0;
            const increment = char.imm_ability.speed * 100;
            const newGauge = Math.min(currentGauge + increment, this.MAX_GAUGE);
            this.gauges.set(char.id, newGauge);
        });
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
        this.gauges.set(characterId, 0);
    }
}