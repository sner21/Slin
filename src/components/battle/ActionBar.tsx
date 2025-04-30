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

const ActionBar: FC<Props> = ({
    battleManager,
}) => {
    return (
        <div className="w-96% flex items-center justify-center gap-6 ">
            {/* 行动条 */}
            <div>回合：{battleManager.current.battle_data.round}</div>
            <div>轮数：{battleManager.current.battle_data.battle_round}</div>
            <div className="relative flex items-center h-10 flex-1 overflow-hidden" style={{ filter: `drop-shadow(2px 4px 4px black) ` }}>
                <div className="w-full h-0.5 bg-amber"></div>
                {[...battleManager.current?.cur_characters, ...battleManager.current?.cur_enemy].map((role, roleType) => {
                    return (
                        <>

                            {<div className="w-12 h-12 rounded-md inline-block absolute top-0 right-0 transition-all-1100 ease-linear" key={role.id} style={{
                                transform: `translateX(${((-battleManager.current?.actionGauge.gauges.get(role.id) / battleManager.current?.actionGauge.MAX_GAUGE) * 1650)}px)`,
                                willChange: "transform",
                                display: role.state === 1 ? "none" : ""
                            }}>
                                <img
                                    className="w-10 h-10 rounded-full box-border"
                                    style={{
                                        objectFit: 'cover',
                                        border: `1px solid`,
                                    }}
                                    src={role.avatar}
                                    alt=""
                                />
                            </div>}
                            {/* {<div className="w-12 h-12 rounded-md inline-block absolute top-0 right-0 transition-all-1200 ease-linear" key={role.id} style={{
                                                    left: ((1 - battleManager.current?.actionGauge.gauges.get(role.id) / battleManager.current?.actionGauge.MAX_GAUGE) * 100) + '%',
                                                    transform: 'translate3d(0,0,0)',
                                                    display: role.state === 1 ? "none" : ""
                                                }}>
                                                    <img
                                                        className="w-10 h-10 rounded-full box-border"
                                                        style={{
                                                            objectFit: 'cover',
                                                            border: `1px solid`,
                                                        }}
                                                        src={role.avatar}
                                                        alt=""
                                                    />
                                                </div>} */}
                        </>
                    )
                })}
            </div>
        </div>
    );
};

export default ActionBar; 