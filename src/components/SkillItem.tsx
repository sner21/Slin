import { useEffect, useRef, useState } from 'react';
import type { Skill } from '../common/skill/types';
import type { Character } from '../common/char/types';
import { elementColors } from '../common';
import { Popover } from 'antd';
import { template } from 'lodash-es';

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
        onUseSkill && onUseSkill(item, bb, skill?.id);
        updateRemaining();
    };

    return (
        <Popover className="w-full w-full flex p-0" content={template(skill.desc)(item)}  trigger="hover">
            <div
                className={`
                flex items-center w-full   gap-2  p-1 box-border relative rd-md overflow-hidden
                border-solid border-1 border-[rgba(165,164,164,0.1)]
                hover:bg-white/20 h-full
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
                    style={{ filter: `drop-shadow(2px 4px 6px black) ` }}
                />
                <b
                    className="text-xs indent-0 break-all"
                    style={{ color: elementColors[skill.element] }}
                >
                    {skill?.name || ''}
                </b>
            </div>
        </Popover>
    );

};

export default SkillItem; 