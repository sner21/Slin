import { useEffect, useState, useMemo, useRef, useReducer, useCallback } from "react";
import { SkillMap } from "../../common/skill";
import { Character, Data, CharacterDisplaySchema } from '../../common/char/types';
import { bb as bbb, initialData, AttributeNameCN } from "../../common/char";
import { EquipTypeNames, EquipmentMap } from "../../common/equip";
import { BattleManager } from "../../common/tatakai/index";
import { elementColors, levelColorClass } from "../../common";
import template from "lodash-es/template";
import { LogsType } from "../../common/record/type";
import { z } from "zod";
import { useThrottledProxyRef } from "../../hook";
import VList from "../../components/VList";
import { SkillCooldown } from "../../common/skill/cooldown";
import HealthBar from "../../components/HealthBar";
import SkillItem from "../../components/SkillItem";
import { ConfigProvider, message, Popover, Segmented, theme } from "antd"
import tw, { styled } from 'twin.macro';
import ItemShop from "../../components/ShopContent";
import { useDialog } from "../../components/DialogManager";
import { v4 as uuidv4 } from 'uuid';
import RecordCon from "../../components/record/RecordCon";
import ItemCon from "../../components/ItemCon";
import ActionBar from "../../components/battle/ActionBar";
const BreatheDiv = styled.div`
${tw`flex justify-center flex-col items-center`}
animation: breathe 2s ease-in-out infinite;
/* transition: ease 0.8s all; */
@keyframes breathe {
  0%, 100% {
    border-color: rgb(247 53 53  / 0.2);
    box-shadow:  0 0 100px rgb(247 53 53 / 0.1);
  }
  50% {
    border-color: rgb(251 191 36);
    box-shadow: 0 0 20px rgb(247 53 53  / 0.4),
                inset 0 0 100px rgb(2247 53 53 / 0.4);
  }
}
`;


function App({ dataCon, startViewData, refreshBet, controlPanel, battleManageData, AarryCon, arrConOpen, setArrConOpen }) {
    const coldData = useRef<Map<number, SkillCooldown[]>>();
    const data = useThrottledProxyRef(dataCon.current);
    let battleManager = useThrottledProxyRef<BattleManager>(battleManageData.current);
    const shopRef = useRef()
    const [curRole, setCurRole] = useState<Character | { id: string, carry: any }>({
        id: "",
        name: "",
        carry: {}
    })
    useEffect(() => {
        battleManager.current = battleManageData.current
        battleManageData.current.load_plugins_init().then(() => {
            battleManageData.current.start_round()
            if (!(battleManageData.current.cur_characters.length && battleManageData.current.cur_enemy.length)) {
                setArrConOpen(true)
            }
        })
        console.log(battleManager.current, ' battleManager.current', data)
    }, [])



    const logsType = useThrottledProxyRef('tatakai');


    const mousePos = useRef({ x: 0, y: 0 });
    const frameEnum: z.infer<typeof CharacterDisplaySchema.shape.display>["frame_type"][] = ['skill', 'item', 'equip', /* 'troops', */ /* 'state',  */'logs']
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

    const logsTypeEnum = useRef<z.infer<typeof LogsType>[]>([
        { value: 'tatakai', label: '对战' },
        { value: 'event', label: '事件' },
        { value: 'status', label: '状态' },
        { value: 'settle', label: '结算' },
        { value: 'global', label: '全局' },
    ]);

    const getRemainingCooldown = useRef();


    useEffect(() => {
        coldData.current = battleManager.current?.cooldownManager.cooldowns;
        getRemainingCooldown.current = battleManager.current?.cooldownManager;

    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mousePos.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);


    return (
        <ConfigProvider theme={{
            algorithm: theme.darkAlgorithm,
        }}>
            {battleManager.current && <main className=" flex flex-col justify-between box-border h-100vh select-none w-full ">
                <div className=" flex flex-col justify-between box-border h-100vh ">
                    <div className="flex-col gap-2 h-[200px] order-2 bottom-0 w-full px-6  border-2 border-t-solid border-t-amber  bg-[rgb(0 0 0 / 24%)] z-10" style={{ background: "rgb(0 0 0 / 67%)" }}>
                        {/* 日志部分 */}
                        <div className="flex justify-between ">
                            {controlPanel({ openShop: shopRef.current && shopRef.current.openShop })}
                            <div className="flex-2/4 gap-2 flex  border-2 border-l-solid border-l-amber "  /* style={{borderLeft:'2px solid rgb(251 191 36 / 75%)'}} */>
                                <div className="w-160  gap-6 border-r-amber border-2 border-r-solid hidden lg:flex">
                                    {/* 战斗阵型图 */}
                                    {[battleManager.current.cur_characters, battleManager.current.cur_enemy].map((item, key) => (<div key={key} className='grid grid-cols-3 grid-rows-3 w-40 h-40 gap-4 p-4' onClick={(e) => (e.stopPropagation())} >
                                        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
                                            const role = battleManager.current?.roles_group[battleManager.current.roleAarry[key][i]?.id || ""]
                                            return (
                                                <div key={i} style={{ filter: `drop-shadow(2px 4px 12px black)` }} className='overflow-hidden flex justify-center relative hover:border-amber-500 items-center cursor-pointer aspect-square  border-white border-1 border-solid  rd-full'
                                                >
                                                    <div className="absolute w-full h-full bg-[rgba(165,164,164,0.3)] z-4" style={{ display: role?.status?.reborn && role.type !== "1" && battleManager.current.battle_data.game_mode === "0" ? "" : "none" }}>
                                                        <b className="absolute  left-50% top-50% text-2xl  -translate-y-50% -translate-x-50%  color-black">{role?.status?.reborn}</b>
                                                    </div>
                                                    <div className="absolute w-full h-full bg-[rgba(124,167,233,0.3)] z-3" style={{ display: !role?.status?.reborn && role?.status?.dizz ? "" : "none" }}>
                                                        <b className="absolute  left-50% top-50% text-2xl  -translate-y-50% -translate-x-50%  color-blue">{role?.status?.dizz}</b>
                                                    </div>
                                                    <BreatheDiv className="absolute w-full h-full z-2" style={{ display: battleManager.current.targetArray[key].includes(i) && role?.state !== 1 ? "" : "none" }}></BreatheDiv>
                                                    {role && battleManager.current.roleAarry[key] && battleManager.current.roleAarry[key][i] && battleManager.current.roleAarry[key][i].id &&
                                                        <img style={{ ["object-fit"]: "cover", filter: `drop-shadow(2px 4px 12px black) ${role.state === 1 ? 'saturate(0.2)' : ''}`, }} src={role.avatar} draggable={false} className='w-full h-full  rd-full' />}
                                                </div>
                                            )
                                        })}
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
                                    <RecordCon battleManager={battleManager} logsType={logsType}></RecordCon>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* 队伍 */}
                    {arrConOpen && <div className="  flex-1  z-6 w-full relative overflow-x-hidden" style={{ background: "url(/ArrayBg.jpg)" }}>
                        {AarryCon}
                    </div>}
                    <div className="overflow-x-hidden  w-full relative" style={{ height: arrConOpen ? "0" : "" }}>

                        <div className="flex flex-col gap-4 flex-1 overflow-y-auto overflow-x-hidden p-4  w-full relative">
                            <ActionBar battleManager={battleManager}></ActionBar>
                            <div className=" flex flex-row  justify-between  w-full w-99% py-8 gap-8 2xl:gap-0">
                                {[battleManager.current?.cur_characters, battleManager.current?.cur_enemy].map((i, roleType) => (<div className="flex gap-8 flex-col flex-3/4">
                                    {i && Object.values(i).map((item, index) => (
                                        <div key={index} className=" ">
                                            <div className="flex items-center h-[220px]  gap-8 flex-row items-center h-full flex-wrap " style={{ flexDirection: roleType === 0 ? 'row-reverse' : '' }}>
                                                {/* 角色头像 */}
                                                <div className="relative h-full  hidden 2xl:block flex-1 max-w-[260px] items-center" style={{ direction: 'rtl' }}>
                                                    <div>
                                                        <img
                                                            onClick={() => (setCurRole(item))}
                                                            className="w-46 h-46  aspect-square flex-1 rounded-full box-border"
                                                            draggable={false}
                                                            style={{
                                                                objectFit: 'cover',
                                                                border: `4px solid ${elementColors[item.element]}`,
                                                                shapeOutside: 'circle(50%)',
                                                                float: item.type === "0" ? "left" : "right",
                                                                filter: `drop-shadow(2px 4px 12px black) ${item.state ? 'saturate(0.2)' : ''}`,
                                                                boxShadow: `0 0 10px ${elementColors[item.element]}, inset 0 0 10px ${elementColors[item.element]} `
                                                            }}
                                                            src={item.avatar}
                                                            alt=""
                                                        />
                                                        {/* BUFF */}
                                                        {/* <div className=" gap-0.1 md:gap-0.5  scale-80   items-center text-xs text-gray-300"> */}
                                                        {Object.keys(item.buff).map((key, index) => {
                                                            const buff = battleManager.current?.BuffManage?.buff_map[item.buff[key]?.id]
                                                            return (
                                                                <div key={index} className="text-xs text-gray-300" style={{
                                                                    textAlign: item.type === "0" ? "left" : "right",
                                                                }}>
                                                                    <Popover className="w-auto  inline" content={<div>
                                                                        <div className="mb-2">{template(buff.desc)(item)}</div>
                                                                        <div>{buff.isDebuff ? "DEBUFF" : "BUFF"} &#160;剩余时间 : {item.buff[key]?.duration} &#160;层数 : {item.buff[key]?.count}</div>
                                                                    </div>} trigger="hover">
                                                                        <span>{item.buff[key]?.count > 1 && item.type === "0" && item.buff[key]?.count} <span className="">{buff?.name}</span> {item.buff[key]?.count > 1 && item.type === "1" && item.buff[key]?.count}</span>   {/*  {item.buff[key]?.duration} */}
                                                                    </Popover>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>

                                                    {/* </div> */}
                                                </div>

                                                {/* 角色状态 */}
                                                <div className="flex flex-col h-full justify-center flex-wrap w-60  gap-1  text-gray-300 text-sm HealthBar">
                                                    <div className="relative w-full mb-1">
                                                        <div className="text-center w-full absolute top-0 left-0 -translate-y-100%" style={{ display: item.salu ? '' : 'none' }}>{`< ${item.salu} >`}</div>
                                                        <b className="text-lg w-full text-center text-amber-400 inline-block text-center">
                                                            <span className="relative ">
                                                                <span>{item.name}</span>
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
                                                    <div className="group flex gap-0.5 min-w-20 flex-wrap w-full text-xs justify-center h-[88px]">
                                                        <div className="group-hover:flex  w-full text-xs justify-center hidden h-full">
                                                            <div className="text-md h-full flex items-center">{template(item.desc || (item.target?.id ? `正在攻击${item.target.name}` : `正在休息`))(item)}</div>
                                                        </div>
                                                        <div className="flex gap-0.5 min-w-20 flex-wrap w-full text-xs justify-center group-hover:hidden">
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
                                                </div>
                                                {/* 技能和装备部分 */}
                                                <div className="flex flex-row text-sm text-gray-300 gap-12  justify-evenly items-center overflow-hidden flex-1  max-w-lg ">
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
                                                                    <Popover className="basis-50% my-1 indent-sm truncate" content={equip.desc} key={kk}>
                                                                        <b>
                                                                            {equip}:
                                                                            <span style={{ color: levelColorClass(battleManager.current.ItemsManager.equipmentsDataMap[item.carry.equipments[kk]]?.rarity) }}>
                                                                                {item.carry.equipments && battleManager.current.ItemsManager.equipmentsDataMap[item.carry.equipments[kk]]?.name || "空"}
                                                                            </span>
                                                                        </b>
                                                                    </Popover>
                                                                ))}
                                                            </div>
                                                            {/* 日志*/}
                                                            <div className="flex flex-wrap indent-xs flex-1 items-center" style={{ display: item.display.frame_type === "logs" ? "" : "none" }}>
                                                                {/* 事件列表 */}
                                                                <div className="text-sm text-gray-300  flex flex-col gap-2 items-center flex-1">
                                                                    <div className="w-full text-center">
                                                                        {/* <div className="text-md">{item.desc || (item.target?.id ? `正在攻击${item.target.name}` : `正在休息`)}</div> */}
                                                                        <span className="text-center">造成伤害 {item.status?.damage || 0}</span>
                                                                    </div>
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
                                                                                    {at.self.name} &gt; {at.target.name} &gt; <span>{SkillMap[at.skillId]?.name || ""}</span> &gt; {at.damage.hp}
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
                                                                <div className="w-full text-md text-center">{item.desc || (item.target?.id ? `正在攻击${item.target.name}` : `正在休息`)}</div>
                                                            </div>
                                                            {/* 物品栏部分-&gt;转换样式 */}
                                                            <ItemCon item={item} curRole={curRole} setCurRole={setCurRole} battleManager={battleManager} ref={shopRef}></ItemCon>
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