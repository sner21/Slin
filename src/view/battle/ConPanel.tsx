import { Segmented, Modal, Button, message } from 'antd';
import { useState, FC, MutableRefObject, useRef } from 'react';
import { BattleManager } from '../../common/tatakai';
import SaveLoadModal from './SaveLoadModal';
import { DataCon } from '../../common/data/dataCon';
import CharacterEditor from '../../components/CharacterEditor';

type props = {
  battleManager: MutableRefObject<BattleManager>,
  dataCon: MutableRefObject<DataCon>,
  mode?: string,
  startViewData: any
}
const ConPanel: FC<props> = ({ battleManager, dataCon, startViewData }) => {
  const modeEnum = useRef([
    { value: 'panel', label: '面板' },
    { value: 'shop', label: '商店' },
    { value: 'custom', label: '自定义' },
    { value: 'setting', label: '设置' }
  ])
  const [mode, setMode] = useState('panel')
  const [characterEditorOpen, setCharacterEditorOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [loadModalOpen, setLoadModalOpen] = useState(false);
  const [saveData, setSaveData] = useState(dataCon.current.save_data);
  const characterFormRef = useRef<FormInstance>();

  const handleCharacterSave = async (values: any) => {
    try {
      console.log('保存角色数据:', values);
      message.success('保存成功');
      setCharacterEditorOpen(false);
    } catch (error) {
      message.error('保存失败');
    }
  };

  const handleSave = (slotId: string) => {
    dataCon.current?.save(slotId);
    setSaveData(dataCon.current.save_data)
    // message.success(`已保存`);
    // setSaveModalOpen(false);
  };

  const handleLoad = (slotId: string) => {
    dataCon.current?.load(slotId);
    battleManager.current = new BattleManager(dataCon.current);
    // message.success(`加载完成`);
    // setLoadModalOpen(false);
  };
  return (
    <div className='flex-1 flex flex-col gap-2'>
      <div>
        <Segmented options={modeEnum.current} size='large' onChange={e => setMode(e)}></Segmented>
        {/* {mode.current.map((item, index) => (
          <div key={index}>{item.label}</div>
        ))} */}
      </div>
      <div className='px-4 py-1 panel'>
        {mode == 'panel' && <div className="flex gap-4 flex-1">
          {/* 战斗管理器控制部分 */}
          <div>{battleManager.current.battle_data.round}</div>
          <span onClick={() => battleManager.current.pause_round()}>暂停</span>
          <span onClick={() => battleManager.current.forward_round()}>前进1回合</span>
          <span onClick={() =>
            !battleManager.current.round_timer ||
            (battleManager.current.battle_data.pause = false) ||
            battleManager.current.start_round(battleManager.current.battle_data.cur_time)
          }>恢复</span>
        </div>}
        {mode == 'setting' && <div className="flex gap-4 flex-1">
          {/* 战斗管理器控制部分 */}
          <span onClick={() => setSaveModalOpen(true)}>存档</span>
          <span onClick={() => setLoadModalOpen(true)}>读档</span>
          <span onClick={() => (dataCon.current.save_global_config({
            autosave: !dataCon.current.globalConfig.autosave
          }))}>{dataCon.current.globalConfig.autosave ? "关闭" : "开启"}自动存档</span>
          <span onClick={() => startViewData.mode = ''}>主菜单</span>
        </div>}
        {mode == 'custom' && <div className="flex gap-4 flex-1">
          <span onClick={() => setCharacterEditorOpen(true)}>编辑角色</span>
        </div>}
      </div>
      <SaveLoadModal
        open={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        mode="save"
        onConfirm={handleSave}
        dataCon={dataCon.current}
      />

      <SaveLoadModal
        open={loadModalOpen}
        onClose={() => setLoadModalOpen(false)}
        mode="load"
        onConfirm={handleLoad}
        dataCon={dataCon.current}
      />
      <Modal
        title="编辑角色"
        open={characterEditorOpen}
        onCancel={() => setCharacterEditorOpen(false)}
        width={800}
        footer={[
          <Button 
            key="cancel" 
            onClick={() => setCharacterEditorOpen(false)}
          >
            取消
          </Button>,
          <Button 
            key="save" 
            type="primary"
            onClick={() => {
              characterFormRef.current?.submit();
            }}
          >
            保存
          </Button>
        ]}
      >
        <CharacterEditor  formRef={characterFormRef}
          onSave={handleCharacterSave}></CharacterEditor>
      </Modal>
      <style>
        {
          `
              .panel>* :hover{
              cursor:pointer;
             color: rgb(251 191 36/ var(--un-border-top-opacity) );
    }
          `
        }
      </style>
    </div>

  )
};

export default ConPanel; 