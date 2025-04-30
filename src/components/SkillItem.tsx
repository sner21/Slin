import { useEffect, useRef, useState } from 'react';
import type { Skill } from '../common/skill/types';
import type { Character } from '../common/char/types';
import { elementColors, elementNames } from '../common';
import { Popover } from 'antd';
import { template } from 'lodash-es';
import { ScopeTypeNames, SkillTypeNames } from '../common/skill';

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
        <Popover className="w-full w-full flex p-0 " trigger="hover" content={<div className='flex flex-col'>
            {skill.desc && <div className='max-w-xl mb-6'>
                {template(skill.desc)(item)}
            </div>}
            <div className=''>
                {skill.multiplier > 0 && <span>倍率 : {skill.multiplier}</span>} 属性 : {elementNames[skill.element] || skill.element} 冷却回合 : {elementNames[skill.cooldown] || skill.cooldown} 伤害类型 : {SkillTypeNames[skill.damageType] || skill.damageType} 范围 : {ScopeTypeNames[skill.scopeType] || skill.scopeType} 类别 : {SkillTypeNames[skill.type] || skill.type}
            </div>
        </div>} >
            <div
                className={`
                flex items-center w-full  gap-2  p-1  box-border relative rd-md overflow-hidden
                border-solid border-1 border-[rgba(165,164,164,0.1)]
                hover:bg-white/20  h-[42px]
                bg-[rgba(165,164,164,0.1)]
                cursor-pointer
            `}
                onClick={handleClick}
            >
                <div
                    className="bg-white/40 flex items-center  transition-all-1000  w-0 justify-center h-full absolute left-0 top-0 "
                    style={{
                        width: `${(1 - (remainingTurns || 100) / skill.cooldown) * 100}%`,
                        // ["transition-timing-function"]: "linear"
                    }}
                />
                <img
                    className="w-8 skill-icon"
                    src={skill.uri}
                    alt={skill.name}
                    style={{ filter: `drop-shadow(2px 4px 6px black) ` }}
                />
                <b
                    className="ml-0.25 text-xs indent-0 break-all  truncate text-nowrap" 
                    style={{ color: elementColors[skill.element] }}
                >
                    {skill?.name || ''}
                </b>
            </div>
        </Popover>
    );

};

export default SkillItem; 