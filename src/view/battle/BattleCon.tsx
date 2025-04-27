import { useEffect, useState, useMemo, useRef, useReducer, useCallback } from "react";
import { SkillMap } from "../../common/skill";
import { Character, Data, CharacterDisplaySchema } from '../../common/char/types';
import { bb as bbb, initialData, AttributeNameCN } from "../../common/char";
import { EquipTypeNames, EquipmentMap } from "../../common/equip";
import { BattleManager } from "../../common/tatakai/index";
import { elementColors } from "../../common";
import template from "lodash-es/template";
import { LogsType } from "../../common/record/type";
import { z } from "zod";
import { useThrottledProxyRef } from "../../hook";
import VList from "../../components/VList";
import { SkillCooldown } from "../../common/skill/cooldown";
import HealthBar from "../../components/HealthBar";
import SkillItem from "../../components/SkillItem";
import { ConfigProvider, Popover, Segmented, theme } from "antd"
import SkillForm from '../../components/SkillForm';
import ConPanel from "./ConPanel";
import { DataCon } from "../../common/data/dataCon";
import AarryCon from "../../components/battle/AarryCon";

function App({ dataCon, startViewData, refreshBet, controlPanel, battleManageData, AarryCon, arrConOpen }) {
    const coldData = useRef<Map<number, SkillCooldown[]>>();
    const data = useThrottledProxyRef(dataCon.current);
    let battleManager = useThrottledProxyRef<BattleManager>(battleManageData.current);
    useEffect(() => {
        // battleManager.current = battleManageData.current
        battleManageData.current.load_plugins_init().then(() => {
            battleManageData.current.start_round()
        })
        console.log(battleManager.current, ' battleManager.current', data)
    }, [])

    const itemsManager = useThrottledProxyRef(battleManager.current?.ItemsManager?.ItemsData);
    const logsType = useThrottledProxyRef('event');
    const inventory = useRef<any[]>(Array(28).fill(null));
    const showTooltipContent = useRef(false);
    const currentItem = useRef(null);
    const mousePos = useRef({ x: 0, y: 0 });
    const frameEnum: z.infer<typeof CharacterDisplaySchema.shape.display>["frame_type"][] = ['skill', 'equip', 'item', 'troops', 'state', 'logs']
    // function windowResize() {
    //     const devicewidth = document.documentElement.clientWidth;//获取当前分辨率下的可是区域宽度
    //     const clientHeight = document.documentElement.clientHeight;
    //     const scale = Math.max(devicewidth / 1920, clientHeight / 1080); // 分母——设计稿的尺寸
    //     // document.body.style.zoom = scale;//放大缩小相应倍数
    //     document.body.style.zoom = scale + '';//放大缩小相应倍数
    // }
    // useEffect(() => {
    //     windowResize()
    //     window.addEventListener('resize', () => {
    //         windowResize()
    //     })
    // })
    // 添加新的 ref
    const logsTypeEnum = useRef<z.infer<typeof LogsType>[]>([
        { value: 'event', label: '事件' },
        { value: 'tatakai', label: '对战' },
        { value: 'status', label: '状态' },
        { value: 'settle', label: '结算' },
        { value: 'global', label: '全局' },
    ]);
    const getRemainingCooldown = useRef();
    useEffect(() => {
        coldData.current = battleManager.current?.cooldownManager.cooldowns;
        getRemainingCooldown.current = battleManager.current?.cooldownManager;
    }, []);
    // 鼠标位置追踪
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mousePos.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);
    const levelColorClass = (level: number) => {
        switch (level) {
            case 1:
                return 'gray'; // 普通
            case 2:
                return 'green'; // 优秀
            case 3:
                return 'blue'; // 稀有
            case 4:
                return 'purple'; // 史诗
            case 5:
                return 'orange'; // 传说
            default:
                return 'gray';
        }
    };

    const showTooltip = (item: any) => {
        currentItem.current = item;
        showTooltipContent.current = true;
    };

    const hideTooltip = () => {
        showTooltipContent.current = false;
        currentItem.current = null;
    };


    return (
        <ConfigProvider theme={{
            algorithm: theme.darkAlgorithm,
        }}>
            {battleManager.current && <main className=" flex flex-col justify-between box-border h-100vh select-none w-full ">
                <div className=" flex flex-col justify-between box-border h-100vh ">
                    <div className="flex-col gap-2 h-[200px] order-2 bottom-0 w-full px-6  border-2 border-t-solid border-t-amber  bg-[rgb(0 0 0 / 24%)] z-10" style={{ background: "rgb(0 0 0 / 67%)" }}>
                        {/* 日志部分 */}
                        <div className="flex justify-between ">
                            {controlPanel}
                            <div className="flex-2/4 gap-2 flex  border-2 border-l-solid border-l-amber "  /* style={{borderLeft:'2px solid rgb(251 191 36 / 75%)'}} */>
                                <div className="w-160 flex gap-6 border-r-amber border-2 border-r-solid">
                                    {[battleManager.current.characters, battleManager.current.enemy].map((item, key) => (<div className='grid grid-cols-3 grid-rows-3 w-40 h-40 gap-4 p-4' onClick={(e) => (e.stopPropagation())} >
                                        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                            <div style={{ filter: `drop-shadow(2px 4px 12px black)` }} className=' flex justify-center hover:border-amber-500 items-center cursor-pointer aspect-square  border-white border-1 border-solid  rd-full'
                                            >
                                                {battleManager.current.roleAarry[key] && battleManager.current.roleAarry[key][i] && battleManager.current.roleAarry[key][i].id &&
                                                    <img style={{ ["object-fit"]: "cover", filter: `drop-shadow(2px 4px 12px black) ${battleManager.current?.roles_group[battleManager.current.roleAarry[key][i].id].state === 1 ? 'saturate(0.2)' : ''}`, }} src={battleManager.current.roleAarry[key][i].avatar} draggable={false} className='w-full h-full  rd-full' />}
                                            </div>
                                        ))}
                                    </div>))}
                                </div>
                                <div className="flex flex-col gap-2 text-sm p-3">
                                    {logsTypeEnum.current.map(type => (
                                        <div key={type.value} className="cursor-pointer hover:color-amber" style={{ writingMode: 'vertical-lr' }} onClick={() => {
                                            logsType.current = type.value;
                                        }}>
                                            {type.label}
                                        </div>
                                    ))}
                                </div>
                                <div className="text-sm text-gray-300 h-50  flex-col gap-2 items-center w-full p-3">
                                    {/* 战斗日志 VList */}
                                    <VList
                                        className="flex-1 px-4 w-full"
                                        data={battleManager.current?.RecordManager?.logsDataSchma[logsType.current] || []}
                                        height={180}
                                        estimatedItemHeight={20}
                                        bufferSize={10}
                                        rowKey="id"
                                    >
                                        {({ at }) => (
                                            <>
                                                {(logsType.current === 'tatakai' || at.logs_type === 'tatakai') && at.skillId !== 'default' && (
                                                    <span className="text-base">
                                                        {at.attacker.name} -&gt; {at.defender.name} -&gt; <span>{SkillMap[at.skillId]?.name || ""}</span> -&gt; {at.damage.hp}点
                                                    </span>
                                                )}
                                                {(logsType.current === 'event' || at.logs_type === 'event') && (
                                                    <div>
                                                        <span className="text-base">
                                                            {at.round} 回合 -&gt; {template(at.description)(at)}
                                                        </span>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </VList>
                                </div>
                            </div>
                        </div>
                    </div>
                    {arrConOpen && <div className="  flex-1 bg-gray z-6 w-full relativ overflow-x-hiddene">
                        {AarryCon}
                    </div>}
                    <div className="overflow-x-hidden  w-full relative" style={{ height: arrConOpen ? "0" : "" }}>

                        <div className="flex flex-col gap-4 flex-1 overflow-y-auto overflow-x-hidden p-4  w-full relative">
                            <div className="w-96% flex items-center justify-center gap-6 ">
                                <div>回合：{battleManager.current.battle_data.round}</div>
                                <div>轮数：{battleManager.current.battle_data.battle_round}</div>
                                <div className="relative flex items-center h-10 flex-1 overflow-hidden" style={{ filter: `drop-shadow(2px 4px 4px black) ` }}>
                                    <div className="w-full h-0.5 bg-amber"></div>
                                    {[...battleManager.current?.cur_characters, ...battleManager.current?.cur_enemy].map((role, roleType) => {
                                        return (
                                            <>
                                                {<div className="w-12 h-12 rounded-md inline-block absolute top-0 right-0 transition-all-1000" key={role.id} style={{ left: ((1 - battleManager.current?.actionGauge.gauges.get(role.id) / battleManager.current?.actionGauge.MAX_GAUGE) * 100) + '%' }}>
                                                    <img
                                                        className="w-10 h-10  rounded-full box-border"
                                                        style={{
                                                            objectFit: 'cover',
                                                            // filter: role.state ? 'saturate(0.2)' : '',
                                                            border: `1px solid `,
                                                            // filter:`drop-shadow(2px 4px 6px black) `
                                                            // shapeOutside: 'circle(50%)',
                                                        }}
                                                        src={role.avatar}
                                                        alt=""

                                                    />
                                                </div >}
                                            </>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className=" flex flex-row  justify-between  w-full w-99% py-8 gap-8 2xl:gap-0">


                                {[battleManager.current?.cur_characters, battleManager.current?.cur_enemy].map((i, roleType) => (<div className="flex gap-8 flex-col flex-3/4">
                                    {i && Object.values(i).map((item, index) => (
                                        <div key={index} className=" ">
                                            <div className="flex items-center h-[220px]  gap-8 flex-row items-center h-full flex-wrap  " style={{ flexDirection: roleType === 0 ? 'row-reverse' : '' }}>
                                                {/* 角色头像 */}
                                                <div className="relative h-full w-64 hidden 2xl:block" style={{ direction: 'rtl' }}>
                                                    <img
                                                        className="w-20 h-20 w-46 h-46 rounded-full box-border  "
                                                        style={{
                                                            objectFit: 'cover',
                                                            border: `4px solid ${elementColors[item.element]}`,
                                                            shapeOutside: 'circle(50%)',
                                                            float: "right",
                                                            filter: `drop-shadow(2px 4px 12px black) ${item.state ? 'saturate(0.2)' : ''}`

                                                        }}
                                                        src={item.avatar}
                                                        alt=""

                                                    />
                                                    {/* BUFF */}
                                                    {/* <div className=" gap-0.1 md:gap-0.5  scale-80   items-center text-xs text-gray-300"> */}
                                                    {Object.keys(item.buff).map((key, index) => (
                                                        <div key={index} className="text-xs text-gray-300">
                                                            {battleManager.current?.BuffManage?.buff_default[item.buff[key]?.buffId]?.name} {item.buff[key]?.count > 1 && item.buff[key]?.count}
                                                        </div>
                                                    ))}
                                                    {/* </div> */}
                                                </div>

                                                {/* 角色状态 */}
                                                <div className="flex flex-col h-full justify-center flex-wrap items-center gap-1 w-70 text-gray-300 text-sm">
                                                    <div className="relative w-full mb-1">
                                                        <div className="text-center w-full absolute top-0 left-0 -translate-y-100%" style={{ display: item.salu ? '' : 'none' }}>{`< ${item.salu} >`}</div>
                                                        <b className="text-lg w-full text-center text-amber-400 inline-block text-center">
                                                            <span className="relative ">
                                                                <span>    {item.name}</span>
                                                                <span className=" absolute right-0 bottom-0 translate-x-[120%] text-xs text-gray">Lv {item.grow.level}</span>
                                                            </span>
                                                        </b>

                                                    </div>
                                                    <div className="w-full">
                                                        <div className="flex flex-col gap-1">
                                                            <HealthBar
                                                                current={item.status?.hp === undefined ? item.imm_ability.hp || item.ability.hp : item.status.hp}
                                                                max={item.imm_ability.hp || item.ability.hp}
                                                                width="150px"
                                                                height="12px"
                                                            >
                                                                <span className="text-sm text-gray-300 flex flex-col gap-2 flex-wrap items-center">
                                                                    <span>已被{battleManager.current.cur_enemy.name}</span>
                                                                </span>
                                                            </HealthBar>
                                                            <HealthBar
                                                                type="mp"
                                                                current={item.status?.mp === undefined ? item.imm_ability.mp || item.ability.mp : item.status.mp}
                                                                max={item.imm_ability.mp || item.ability.mp}
                                                                width="150px"
                                                                height="12px"
                                                            >
                                                                <span className="text-sm text-gray-300 flex flex-col gap-2 flex-wrap items-center">
                                                                    <span>已被{battleManager.current.cur_enemy.name}</span>
                                                                </span>
                                                            </HealthBar>
                                                        </div>
                                                    </div>
                                                    {/* 属性列表 */}
                                                    <div className="flex gap-0.5 min-w-20 flex-wrap w-full text-xs justify-center">
                                                        {item.ability && Object.entries(item.ability).map(([attr, ability]) => (
                                                            attr !== 'hp' && AttributeNameCN[attr as keyof typeof AttributeNameCN] && (
                                                                <b key={attr} className="basis-45% indent-sm">
                                                                    {AttributeNameCN[attr as keyof typeof AttributeNameCN]}:
                                                                    <span>
                                                                        {item.imm_ability[attr] || ability || 0}
                                                                    </span>
                                                                </b>
                                                            )
                                                        ))}
                                                    </div>
                                                </div>
                                                {/* 技能和装备部分 */}
                                                <div className="flex flex-row text-sm text-gray-300 gap-12  justify-evenly items-center overflow-hidden flex-1">
                                                    <div className="flex   w-full  indent-xs  relative h-50 ">
                                                        <div className="relative flex flex-col left-2 top-0 -translate-x-100% gap-2 select-none cursor-pointer">
                                                            {frameEnum.map((type, index) => (
                                                                <div key={index} onClick={() => item.display.frame_type = type}>{type[0].toUpperCase()}</div>
                                                            ))}
                                                        </div>
                                                        <div className="ml-1 flex-1">
                                                            {/* 装备列表 */}
                                                            <div className="flex flex-wrap indent-xs flex-1 items-center" style={{ display: item.display.frame_type === "equip" ? "" : "none" }}>
                                                                {Object.entries(EquipTypeNames).map(([kk, equip]) => (
                                                                    <b key={kk} className="basis-50% my-1 indent-sm">
                                                                        {equip}:
                                                                        <span style={{ color: levelColorClass(EquipmentMap[item.carry.equipments[kk]]?.level) }}>
                                                                            {item.carry.equipments && EquipmentMap[item.carry.equipments[kk]]?.name || "空"}
                                                                        </span>
                                                                    </b>
                                                                ))}
                                                            </div>
                                                            {/* 日志*/}
                                                            <div className="flex flex-wrap indent-xs flex-1 items-center" style={{ display: item.display.frame_type === "logs" ? "" : "none" }}>
                                                                {/* 事件列表 */}
                                                                <div className="text-sm text-gray-300  flex flex-col gap-2 items-center flex-1">
                                                                    <span>造成伤害 {item.status?.damage || 0}</span>
                                                                    {/* 角色攻击记录 VList */}
                                                                    <VList
                                                                        className="flex-1 px-4 w-full"
                                                                        data={item.at || []}
                                                                        height={160}
                                                                        estimatedItemHeight={20}
                                                                        bufferSize={10}
                                                                        rowKey={record => `${record.id}-${record.timestamp}`}  // 修改 rowKey 生成方式
                                                                    >
                                                                        {({ at }) => (
                                                                            at.skillId !== 'default' && (
                                                                                <span key={`char-attack-${at.id}-${at.timestamp}`}>
                                                                                    {at.attacker.name} &gt; {at.defender.name} &gt; <span>{SkillMap[at.skillId]?.name || ""}</span> &gt; {at.damage.hp}
                                                                                </span>
                                                                            )
                                                                        )}
                                                                    </VList>
                                                                </div>
                                                            </div>
                                                            {/* 技能 */}
                                                            <div className="flex flex-wrap indent-xs flex-1 items-center " style={{ display: item.display.frame_type === "skill" ? "" : "none" }}>
                                                                {/* 技能列表 */}
                                                                <div className=" gap-1.25 flex-wrap w-100% grid grid-cols-2">
                                                                    {(item.skill || []).map((skillId, index) => (
                                                                        <div key={index} className="flex items-start w-full" style={{ justifyContent: item.skill?.length <= 4 ? 'center' : '' }}>
                                                                            <SkillItem
                                                                                skill={SkillMap[skillId]}
                                                                                className="w-full"
                                                                                item={item}
                                                                                round={battleManager.current.battle_data.round}
                                                                                battleManager={battleManager.current}
                                                                                getRemainingCooldown={() => getRemainingCooldown.current?.getRemainingCooldown(battleManager.current?.cooldownManager)}
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            {/* 状态 */}
                                                            <div className="flex flex-wrap indent-xs w-full h-full flex-1 items-center" style={{ display: item.display.frame_type === "state" ? "" : "none" }}>

                                                                <div className="w-full text-md text-center">{item.description || (item.target?.id ? `正在攻击${item.target.name}` : `正在休息`)}</div>

                                                            </div>
                                                            {/* 物品栏部分-&gt;转换样式 */}
                                                            <div className="p-2 bg-[#1a1a1aad] rounded-lg w-fit" style={{ display: item.display.frame_type === "item" ? "" : "none" }}>
                                                                <div className="grid grid-cols-7 gap-2 w-fit">
                                                                    {inventory.current.map((i, index) => {
                                                                        const ii = item.carry.items[index] || null
                                                                        return (
                                                                            <div
                                                                                className="relative w-8 h-8 bg-[#2a2a2a] border-2 border-[#3a3a3a] rounded cursor-pointer 
                                    flex items-center justify-center transition-all-5000
                                    hover:border-[#4a4a4a] hover:bg-[#333]"
                                                                                key={index}
                                                                                onContextMenu={(e) => e.preventDefault()}
                                                                                onAuxClick={() => battleManager.current?.ItemsManager.use_item(item, ii.id, index + '')}
                                                                            >
                                                                                {ii && (
                                                                                    <Popover className="w-full w-full flex p-1" content={itemsManager.current && ii.description} title={itemsManager.current && itemsManager.current[ii.id]?.name} trigger="hover">
                                                                                        <img
                                                                                            src={itemsManager.current && itemsManager.current[ii.id]?.icon}
                                                                                            alt={itemsManager.current && itemsManager.current[ii.id]?.name}
                                                                                            className="object-contain"
                                                                                            onMouseEnter={() => showTooltip(ii)}
                                                                                            onMouseLeave={hideTooltip}
                                                                                        />
                                                                                        {ii?.count > 1 && (
                                                                                            <span className="absolute bottom-0.5 right-0.5 bg-black/80 text-white pr-0.5 rounded text-xs pointer-events-none">
                                                                                                {ii.count}
                                                                                            </span>
                                                                                        )}
                                                                                    </Popover>
                                                                                )}
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>}
        </ConfigProvider >
    );
}

export default App;