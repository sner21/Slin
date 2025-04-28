import { FC, useEffect, useState, useMemo, memo, useRef } from "react";
import tw, { styled } from "twin.macro";
import BattleCon from "./BattleCon";
import { DataCon } from "../../common/data/dataCon";
import SaveMenu from "../../components/SaveMenu";
import { ConfigProvider, theme, InputNumber } from 'antd';
import { useThrottledProxyRef } from "../../hook";
import { BattleManager } from "../../common/tatakai";
import ConPanel from "./ConPanel";
import AarryCon from "../../components/battle/AarryCon";
import { getMirrorPosition } from "../../common";

const MenuContainer = styled.div`
  ${tw`w-full h-[100vh] flex items-center justify-center`}
`;

const MenuContent = styled.div`
  ${tw`w-full flex justify-center flex-col items-center gap-6`}
  animation: fadeIn 0.5s ease-in-out;

  @keyframes fadeIn {  
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  > * {
    ${tw`text-2xl font-bold cursor-pointer transition-all duration-200`}
    ${tw`text-gray-200 hover:text-white hover:scale-110`}
    ${tw`py-3 px-8`}
   text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);

    &:hover {
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    }
  }
`;


const StartView: FC = () => {
    const [battleVisible, setBattleVisible] = useState(false);

    // const [mode, setMode] = useState('');
    const data = useRef(new DataCon())
    let battleManager = useRef<BattleManager>(null);
    const [update, setUpdate] = useState(0)
    const [arrConOpen, setArrConOpen] = useState(false)
    const [loadMode, setLoadMode] = useState(false)
    const startViewData = useThrottledProxyRef({
        mode: ''
    }).current || {}
    // const [mode, setMode] = useState(startViewData.mode)
    const BackCon = useMemo<{
        mode: string;
    }>(() => {
        return memo(
            () => (<MenuContent className="mt-2">
                <div onClick={() => setMode('')}> 返回</div>
            </MenuContent>)
        )
    }, [startViewData.mode])
    const handleAutosaveToggle = () => {
        data.current?.save_global_config({
            autosave: !data.current.globalConfig.autosave,
        });
        setUpdate(update + 1)
    }
    const handleAutoloadToggle = () => {
        data.current?.save_global_config({
            autoload: !data.current.globalConfig.autoload,
        });
        setUpdate(update + 1)
    }
    const [config, setConfig] = useState(data.current?.globalConfig || {});
    const [slotId, setSlotId] = useState('')
    const load = (slotId: string) => {
        setSlotId(slotId)
        if (battleManager.current) {
            battleManager.current.destroy();
            battleManager.current = null;
        }
        if (loadMode) {
            data.current = new DataCon()
        }
        data.current.load(slotId, loadMode)
        console.log(data, '加载成功', slotId)
        battleManager.current = new BattleManager(data.current)
        setLoadMode(false)
        setMode('battle')
    }
    const refreshBet = () => {
        setMode("")
        setTimeout(() => setMode("battle"), 1)
    }
    const newData = () => {
        setLoadMode(true)
        setMode('load')
    }
    const setMode = (v) => {
        startViewData.mode = v
    }

    const confirmArr = (v1, v2) => {
        if (battleManager.current) {
            // battleManager.current.characters = v1[0]
            // battleManager.current.enemy = v1[1]
            // battleManager.current.update_roles()
            Object.keys(v2).forEach(type => {
                Object.keys(v2[type]).forEach(k => {
                    const role = v2[type][k]
                    console.log('role.id',role.id)
                    if (!role.id) return
                    if (!battleManager.current.roles_group[role.id].position) battleManager.current.roles_group[role.id].position = {}
                    const index = type == "1" ? getMirrorPosition(role.index) : role.index
                    battleManager.current.roles_group[role.id].position.index = index
                    // if (type == "1") {
                    //     battleManager.current.enemy.find(i => i.id === role.id).position.index = index
                    // } else {
                    //     battleManager.current.characters.find(i => i.id === role.id).position.index = index
                    // }
                })
            })

            battleManager.current.update_cur()
            battleManager.current.update_array()
            setArrConOpen(false)
        }
    }
    const changeTime = (v: number | null) => {
        data.current.globalConfig.time = v || 5000
        setUpdate(update + 1)
    }
    // battle_data_info
    useEffect(() => {
        if (data.current?.globalConfig.autoload) {
            load(data.current?.globalConfig.autoload)

            // battleManager.current = new BattleManager(data.current)
            setMode('battle')
        }
    }, [])
    return (
        <ConfigProvider theme={{
            algorithm: theme.darkAlgorithm,
        }}>
            <MenuContainer>
                {!startViewData.mode && <MenuContent>
                    <div onClick={() => newData()}>新游戏</div>
                    <div onClick={() => (setLoadMode(false), setMode('load'))}>继续游戏</div>
                    <div>数据集</div>
                    <div onClick={() => setMode('config')}>设置</div>
                    <div onClick={() => setBattleVisible(true)}>退出</div>
                </MenuContent>}
                {startViewData.mode === 'config' && <MenuContent>
                    <span onClick={() => handleAutosaveToggle()}>{data.current.globalConfig.autosave ? "关闭" : "开启"}自动存档</span>
                    <span onClick={() => handleAutoloadToggle()}>{data.current.globalConfig.autoload ? "关闭" : "开启"}自动读档</span>
                    <div className="flex items-center gap-6">
                        <span>初始回合时间 </span>
                        <InputNumber size="large" style={{ background: 'transparent' }} value={data.current.globalConfig.time} onChange={v => changeTime(v)}></InputNumber>
                    </div>

                    <BackCon ></BackCon>
                </MenuContent>}
                {startViewData.mode === 'battle' &&
                    <BattleCon
                        AarryCon={
                            arrConOpen && <AarryCon roleAarryData={battleManager.current?.roleAarry} onConfirm={confirmArr} roles={[battleManager.current?.characters, battleManager.current?.enemy]}></AarryCon>
                        }
                        arrConOpen={arrConOpen}
                        battleManageData={battleManager}
                        controlPanel={
                            <ConPanel
                                AarryCon={
                                    <AarryCon onConfirm={confirmArr} roles={[battleManager.current?.characters, battleManager.current?.enemy]}></AarryCon>
                                }
                                battleManager={battleManager}
                                startViewData={startViewData}
                                dataCon={data}
                                setArrConOpen={setArrConOpen}
                                refreshBet={refreshBet}></ConPanel>
                        }
                        startViewData={startViewData}
                        dataCon={data}
                        refreshBet={refreshBet}>
                    </BattleCon>}
                {startViewData.mode === 'load' &&
                    <div style={{ width: '20%' }}>
                        <SaveMenu dataCon={data} onConfirm={load}></SaveMenu>
                        <BackCon></BackCon>
                    </div>
                }
            </MenuContainer>
        </ConfigProvider >
    );
};

export default StartView;