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
import VList from "../../com/VList";
import { SkillCooldown } from "../../common/skill/cooldown";
import HealthBar from "../../com/HealthBar";
import SkillItem from "../../com/SkillItem";
import { ConfigProvider, Popover, Segmented, theme } from "antd"
import SkillForm from '../../components/SkillForm';
import ConPanel from "./ConPanel";
import { DataCon } from "../../common/data/dataCon";

function App({ dataCon, startViewData,refreshBet }) {
    const coldData = useRef<Map<number, SkillCooldown[]>>();
    const data = dataCon;
    let battleManager = useThrottledProxyRef<BattleManager>(null);
    useEffect(() => {
        battleManager.current = new BattleManager(data.current)
        console.log(battleManager.current, ' battleManager.current')
    }, [])
   
    const itemsManager = useThrottledProxyRef(battleManager.current?.ItemsManager?.ItemsData);
    const logsType = useThrottledProxyRef('event');
    const inventory = useRef<any[]>(Array(28).fill(null));
    const showTooltipContent = useRef(false);
    const currentItem = useRef(null);
    const mousePos = useRef({ x: 0, y: 0 });
    const frameEnum: z.infer<typeof CharacterDisplaySchema.shape.display>["frame_type"][] = ['equip', 'item', 'troops']
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
            {battleManager.current && <main className=" flex flex-col justify-between box-border h-100vh select-none w-full">
                <div className=" flex flex-col justify-between box-border h-100vh ">
                    <div className="flex-col gap-2 h-[200px] order-2 bottom-0 w-full md:px-6 md:py-3 border-2 border-t-solid border-t-amber bg-[rgb(0 0 0 / 67%)] z-10" style={{ background: "rgb(0 0 0 / 67%)" }}>
                        {/* 日志部分 */}
                        <div className="flex justify-between">
                            <ConPanel startViewData={startViewData} battleManager={battleManager} dataCon={data} refreshBet={refreshBet}></ConPanel>
                            <div className="flex-1 gap-2 flex pt-2" >
                                <div className="flex flex-col gap-2 text-sm">
                                    {/* <Segmented vertical options={logsTypeEnum.current}></Segmented> */}
                                    {logsTypeEnum.current.map(type => (
                                        <div key={type.value} className="cursor-pointer" style={{ writingMode: 'vertical-lr' }} onClick={() => {
                                            logsType.current = type.value;
                                        }}>
                                            {type.label}
                                        </div>
                                    ))}
                                </div>
                                <div className="text-sm text-gray-300 h-50  flex-col gap-2 items-center w-full">
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
                    <div className="flex flex-col gap-4 flex-1 overflow-y-auto overflow-x-hidden p-2">
                        {/* BOSS信息 */}
                        <div className="flex flex-col justify-center items-center gap-4 px-4">
                            <img
                                className="w-20 h-20 lg:w-20 lg:h-20 rounded-full box-border"
                                style={{
                                    objectFit: 'cover',
                                    filter: battleManager.current.cur_enemy.state ? 'saturate(0.2)' : '',
                                    border: `2px solid ${elementColors[battleManager.current.cur_enemy.element]}`,
                                    shapeOutside: 'circle(50%)',
                                    float: "right",
                                }}
                                max={battleManager.current.cur_enemy.imm_ability.hp || battleManager.current.cur_enemy?.ability.hp}
                                src={battleManager.current.cur_enemy.avatar}
                                alt=""
                            />
                            <b className="text-center text-red text-lg">{battleManager.current.cur_enemy?.name}</b>
                            <HealthBar
                                current={battleManager.current.cur_enemy.status?.hp || 0}
                                max={battleManager.current.cur_enemy.imm_ability.hp || battleManager.current.cur_enemy?.ability.hp}
                                height="12px" >
                            </HealthBar>
                        </div>
                        {/* 角色列表部分 */}
                        <div className=" flex md:flex-row flex-col justify-between  w-full md:w-99% md:py-8">
                            <div className="flex gap-8 flex-col flex-3/4 justify-evenly">
                                {data.current?.characters && Object.values(data.current?.characters).map((item, index) => (
                                    <div key={index} className="flex-1 ">
                                        <div className="flex items-center gap-4 md:gap-14 md:flex-row flex-col items-center h-full flex-wrap">
                                            {/* 角色头像 */}
                                            <div className="relative h-full w-70 " style={{ direction: 'rtl' }}>
                                                <img
                                                    className="w-20 h-20 lg:w-50 lg:h-50 rounded-full box-border"
                                                    style={{
                                                        objectFit: 'cover',
                                                        filter: item.state ? 'saturate(0.2)' : '',
                                                        border: `2px solid ${elementColors[item.element]}`,
                                                        shapeOutside: 'circle(50%)',
                                                        float: "right",

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
                                            <div className="flex flex-col h-full justify-center flex-wrap items-center gap-1 md:gap-1 w-70 text-gray-300 text-sm">
                                                <div className="relative w-full mb-1">
                                                    <div className="text-center w-full absolute top-0 left-0 -translate-y-100%" style={{ display: item.salu ? '' : 'none' }}>{`< ${item.salu} >`}</div>
                                                    <b className="text-lg w-full text-center text-amber-400 inline-block text-center">
                                                        {item.name}
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
                                            <div className="flex flex-col lg:flex-row gap-2 text-sm text-gray-300 md:gap-12 h-full items-center justify-center flex-1 overflow-hidden">
                                                {/* 技能列表 */}
                                                <div className="flex h-[12rem] flex-col gap-1.25 flex-wrap w-80">
                                                    {(item.skill || []).map((skillId, index) => (
                                                        <div key={index} className="flex items-start">
                                                            <SkillItem
                                                                skill={SkillMap[skillId]}
                                                                item={item}
                                                                round={battleManager.current.battle_data.round}
                                                                battleManager={battleManager.current}
                                                                getRemainingCooldown={() => getRemainingCooldown.current?.getRemainingCooldown(battleManager.current?.cooldownManager)}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="flex   w-fit  indent-xs  relative h-full w-80">
                                                    <div className="relative flex flex-col left-2 top-0 -translate-x-100% gap-2 select-none cursor-pointer">
                                                        {frameEnum.map((type, index) => (
                                                            <div key={index} onClick={() => item.display.frame_type = type}>{type[0].toUpperCase()}</div>
                                                        ))}
                                                    </div>
                                                    <div className="ml-1 w-80">
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
                                                <div className="w-30 text-md text-center">{item.description || (item.target?.id ? `正在攻击${item.target.name}` : `正在休息`)}</div>
                                                {/* 事件列表 */}
                                                <div className="text-sm text-gray-300 h-50 flex flex-col gap-2 items-center flex-1">
                                                    <span>造成伤害 {item.status?.damage || 0}</span>
                                                    {/* 角色攻击记录 VList */}
                                                    <VList
                                                        className="flex-1 px-4 w-full"
                                                        data={item.at || []}
                                                        height={180}
                                                        estimatedItemHeight={20}
                                                        bufferSize={10}
                                                        rowKey={record => `${record.id}-${record.timestamp}`}  // 修改 rowKey 生成方式
                                                    >
                                                        {({ at }) => (
                                                            at.skillId !== 'default' && (
                                                                <span key={`char-attack-${at.id}-${at.timestamp}`}>
                                                                    {at.attacker.name} -&gt; {at.defender.name} -&gt; <span>{SkillMap[at.skillId]?.name || ""}</span> -&gt; {at.damage.hp}
                                                                </span>
                                                            )
                                                        )}
                                                    </VList>
                                                </div>
                                            </div>
                                        </div>
                                        {/* 分割线 */}
                                        {/* <div className="h-0.25 w-120vw md:w-0 md:h-0 bg-gray mt-4" /> */}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>}
        </ConfigProvider >
    );
}

export default App;