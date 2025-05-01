// import './v.css';
import VList from '../VList';
import { Popover } from 'antd';
import { template } from 'lodash-es';
import { elementColors, elementNames } from '../../common';
import { ScopeTypeNames, SkillMap, SkillTypeNames } from '../../common/skill';
import { BattleManager } from '../../common/tatakai';
import { FC } from 'react';

interface Props {
    battleManager: BattleManager,
    logsType,
}

const RecordCon: FC<Props> = ({
    battleManager,
    logsType,
}) => {
    return (
        <>
            <VList
                className="flex-1 px-4 w-full"
                data={battleManager.current?.RecordManager?.logsDataSchma[logsType.current] || []}
                height={180}
                estimatedItemHeight={20}
                bufferSize={10}
                rowKey="id"
                gap={battleManager.current.battle_data.time}
            >
                {({ at }) => (!at.hidden && (
                    <>
                        {(logsType.current === 'tatakai' || at.logs_type === 'tatakai') && at.skillId !== 'default' && (
                            <span className="text-sm">
                                {at.self.name} -&gt;   {at.target.id !== at.self.id && <span>{at.target.name} -&gt;</span>}
                                <Popover className="inline" content={<div className='flex flex-col'>
                                    {SkillMap[at.skillId].desc && <div className='max-w-xl mb-6'>
                                        {template(SkillMap[at.skillId].desc)(battleManager.current.roles_group[at.self.id])}
                                    </div>}
                                    <div className=''>
                                        {SkillMap[at.skillId].multiplier > 0 && <span>倍率 : {SkillMap[at.skillId].multiplier}</span>} 属性 : {elementNames[SkillMap[at.skillId].element] || SkillMap[at.skillId].element} 伤害类型 : {SkillTypeNames[SkillMap[at.skillId].damageType] || SkillMap[at.skillId].damageType} 范围 : {ScopeTypeNames[SkillMap[at.skillId].scopeType] || SkillMap[at.skillId].scopeType} 类别 : {SkillTypeNames[SkillMap[at.skillId].type] || SkillMap[at.skillId].type}
                                    </div>
                                </div>} trigger="hover">
                                    <span style={{ color: elementColors[at.element] || elementColors[battleManager.current.roles_group[at.self.id]?.element] }}> {(SkillMap[at.skillId]?.type === "NORMAL_ATTACK" ? battleManager.current.roles_group[at.self.id]?.normal_name || SkillMap[at.skillId]?.name : SkillMap[at.skillId]?.name) || ""}{/* {at.effectType && at.effectType !== 'DAMAGE' && <span className="text-xs">({at.effectType})</span>} */}</span>
                                </Popover>
                                {<span style={{ display: at.elementalBonus !== 1 ? "" : "none" }}> * {at.elementalBonus}</span>}
                                &#160;-&gt;  <span style={{ color: at.isCrit ? "yellow" : "" }}> {at.isEvaded ? "被闪避" : (at.effectType === 'HEAL' ? -at.damage.hp : at.damage.hp)}</span>
                                {/* 施加BUFF */}
                                {at.buffs?.length && <span>{at.buffs.map((buff) => <span key={buff.id}>&#160;-&gt; {battleManager.current.BuffManage.buff_map[buff.id].isDebuff ? "DEBUFF" : "BUFF"} -&gt;&#160;{buff.name || battleManager.current.BuffManage.buff_map[buff.id]?.name}</span>)}</span>}
                                {/* 击杀 */}
                                {at.result === "kill" && <span>&#160;-&gt; 击败</span>}
                            </span>
                        )}
                        {(logsType.current === 'event' || at.logs_type === 'event') && (
                            <div>
                                <span className="text-sm">
                                    {at.round} 回合 -&gt; {template(at.desc)(at)}
                                </span>
                            </div>
                        )}
                    </>
                ))}
            </VList>
        </>
    );
};

export default RecordCon; 