import { FC, useEffect, useState, useMemo, memo, useRef } from "react";
import tw, { styled } from "twin.macro";
import BattleCon from "./BattleCon";
import { DataCon } from "../../common/data/dataCon";
import SaveMenu from "../../components/SaveMenu";
import { ConfigProvider, theme } from "antd";
import { useThrottledProxyRef } from "../../hook";

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
const globalConfig: any = {
    autosave: false
};

const StartView: FC = () => {
    const [battleVisible, setBattleVisible] = useState(false);
    // const [mode, setMode] = useState('');
    const data = useThrottledProxyRef(new DataCon())
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
    }
    const handleAutoloadToggle = () => {
        data.current?.save_global_config({
            autoload: !data.current.globalConfig.autoload,
        });
    }
    const [config, setConfig] = useState(data.current?.globalConfig || {});
    const [slotId, setSlotId] = useState('')
    const load = (slotId: string) => {
        console.log(loadMode, 'loadMode.current')
        setSlotId(slotId)
        data.current.load(slotId, loadMode)
        console.log(data, '加载成功')
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
    useEffect(() => {
        if (data.current?.globalConfig.autoload) {
            load(data.current?.globalConfig.autoload)
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
                    <BackCon ></BackCon>
                </MenuContent>}
                {startViewData.mode === 'battle' && <BattleCon startViewData={startViewData} dataCon={data} refreshBet={refreshBet}>
                </BattleCon>}
                {startViewData.mode === 'load' &&
                    <div style={{ width: '20%' }}>
                        <SaveMenu dataCon={data.current} onConfirm={load}></SaveMenu>
                        <BackCon></BackCon>
                    </div>
                }
            </MenuContainer>
        </ConfigProvider >
    );
};

export default StartView;