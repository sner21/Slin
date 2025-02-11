import { useEffect, useRef, useState } from 'react';
import type { Skill } from '../common/skill/types';
import type { Character } from '../common/char/types';
import { elementColors } from '../common';

interface SkillItemProps {
    skill: Skill;
    item: Character;
    bb: Character;
    battleManager: any;
    getRemainingCooldown?: any;
    round: number;
    onUseSkill: (char: Character, target: Character, skillId: number) => void;
}

const SkillItem: React.FC<SkillItemProps> = ({
    skill,
    item,
    bb,
    battleManager,
    round,
    onUseSkill
}) => {
    const [remainingTurns, setRemainingTurns] = useState(0);
    const el = useRef(null);

    const updateRemaining = () => {
        setRemainingTurns(
            battleManager.cooldownManager?.getRemainingCooldown(item.id, skill.id)
        );
    };

    useEffect(() => {
        updateRemaining();
    }, [round]);

    if (!skill?.id) return null;

    const handleClick = () => {
        onUseSkill(item, bb, skill?.id);
        updateRemaining();
    };

    return (
        <div
            className={`
                flex items-center w-40 gap-2 py-1.2 px-3 box-border relative rd-xl overflow-hidden
                border-solid border-1 border-[rgba(165,164,164,0.1)]
                hover:bg-white/20
                bg-[rgba(165,164,164,0.1)]
                cursor-pointer
            `}
            onClick={handleClick}
        >
            <div
                className="bg-white/40 flex items-center transition-all-1000  justify-center h-full absolute left-0 top-0"
                style={{
                    width: `${(1 - (remainingTurns || 0) / skill.cooldown) * 100}%`,
                    // ["transition-timing-function"]: "linear"
                }}
            />
            <img
                className="w-8"
                src={skill.uri}
                alt={skill.name}
            />
            <b
                className="text-xs"
                style={{ color: elementColors[skill.element] }}
            >
                {skill?.name || ''}
            </b>
        </div>
    );
};

export default SkillItem; 