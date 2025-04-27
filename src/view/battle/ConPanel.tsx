import { Segmented, Modal, Button, message } from 'antd';
import { useState, FC, MutableRefObject, useRef, useCallback } from 'react';
import { BattleManager } from '../../common/tatakai';
import SaveLoadModal from './SaveLoadModal';
import { DataCon } from '../../common/data/dataCon';
import CharacterEditor from '../../components/CharacterEditor';
import { plugin } from 'postcss';
import { CharacterSaveSchema } from '../../common/char/types';
import { v4 as uuidv4 } from 'uuid';
import { CharacterSelector } from '../../components/CharacterSelector';
import { cloneDeep } from 'lodash-es';
import type { DraggableData, DraggableEvent } from 'react-draggable';
import Draggable from 'react-draggable';
import { CustomP } from '../../components/ConPanel/CustomP';
import { useThrottledProxyRef } from '../../hook';
import HelpModal from './HelpModal';


type props = {
  battleManager: MutableRefObject<BattleManager>,
  dataCon: MutableRefObject<DataCon>,
  mode?: string,
  startViewData: any
  refreshBet?: () => any
}

const ConPanel: FC<props> = ({ battleManager, dataCon, startViewData, refreshBet }) => {
  const modeEnum = useRef([
    { value: 'panel', label: '面板' },
    // { value: 'shop', label: '商店' },
    { value: 'custom', label: '自定义' },
    { value: 'setting', label: '设置' }
  ])
  const [mode, setMode] = useState('panel')
  const [update, setUpdate] = useState(0)
  const [characterEditorOpen, setCharacterEditorOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [loadModalOpen, setLoadModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [saveData, setSaveData] = useState(dataCon.current.save_data);
  const characterFormRef = useRef<FormInstance>();
  const draggleRef = useRef<HTMLDivElement>(null!);
  const [disabled, setDisabled] = useState(true);
  const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
  const [curRoleEdit, setCurRoleEdit] = useState({
    visible: false,
    data: null
  })
  const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };
  const handleCharacterSave = useCallback(async (values: any, id = null, pluginId = 1) => {
    try {
      const plugin = localStorage.getItem('user-plugin-' + pluginId)
      let info: any = {}
      try {
        info = JSON.parse(plugin || '')
      } catch { }
      if (!info['role']) info['role'] = []
      if (id) {
        //ID 不一样
        const roleIndex = battleManager.current.characters.findIndex(i => i.id === id)
        if (roleIndex >= 0) {

          // values = CharacterSaveSchema.parse(values)
          const data = battleManager.current.characters[roleIndex]
          data.target = null
          data.at = null
          info.role[roleIndex] = { ...battleManager.current.characters[roleIndex], ...values }
        } else {
          info['role'].push(values)
        }
      } else {
        info['role'].push(values)
      }
      // info = { ...info, ...values }
      localStorage.setItem('user-plugin-' + pluginId, JSON.stringify(info || {}))
      // battleManager.current.load_plugins_role(info['role'])
      // message.success('保存成功');
      refreshBet && refreshBet()
      setCharacterEditorOpen(false);
    } catch (error) {
      // message.error('保存失败');
    }
  })

  const handleDeleteCharacter = (id: string) => {
    try {
      const plugin = localStorage.getItem('user-plugin-1');
      const data = JSON.parse(plugin || '{}');
      data.role = (data.role || []).filter((char: any) => char.id !== id);
      localStorage.setItem('user-plugin-1', JSON.stringify(data));
      battleManager.current.load_plugins_role(data.role);
      message.success('删除成功');
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleEditCharacter = useCallback((character: any) => {
    const data = cloneDeep({ ...character, target: null, at: null })
    setCurRoleEdit({
      visible: true,
      data: data
    });
  }, []);
  const handleSave = (slotId: string) => {
    dataCon.current?.save(slotId);
    setSaveData(dataCon.current.save_data)
  };

  const handleLoad = (slotId: string) => {
    dataCon.current?.load(slotId);
    // battleManager.current = new BattleManager(dataCon.current);
  };
  return (
    <div className='flex-1 flex flex-col gap-2 py-3'>
      <div>
        <Segmented size='middle' options={modeEnum.current} onChange={e => setMode(e)}></Segmented>
        {/* {mode.current.map((item, index) => (
          <div key={index}>{item.label}</div>
        ))} */}
      </div>
      <div className='px-1 py-1 panel'>
        {mode == 'panel' && <div className="flex gap-4 flex-1">
          {/* 战斗管理器控制部分 */}
          {/* <div>{battleManager.current.battle_data.round}</div> */}
          <span onClick={() => battleManager.current.pause_round()}>暂停</span>
          <span onClick={() => battleManager.current.forward_round()}>前进回合</span>
          <span onClick={() =>
            !battleManager.current.round_timer ||
            (battleManager.current.battle_data.pause = false) ||
            battleManager.current.start_round(battleManager.current.battle_data.cur_time)
          }>恢复</span>
          <span onClick={() => setHelpModalOpen(true)}>帮助</span>
        </div>}
        {mode == 'setting' && <div className="flex gap-4 flex-1">
          {/* 战斗管理器控制部分 */}
          <span onClick={() => setSaveModalOpen(true)}>存档</span>
          <span onClick={() => setLoadModalOpen(true)}>读档</span>
          <span onClick={() => (dataCon.current.save_global_config({
            autosave: !dataCon.current.globalConfig.autosave
          }), setUpdate(update + 1))}>{dataCon.current.globalConfig.autosave ? "关闭" : "开启"}自动存档</span>
          <span onClick={() => startViewData.mode = ''}>主菜单</span>
        </div>}
        {mode == 'custom' && <div className="flex gap-4 flex-1">

          <span onClick={() => setCharacterEditorOpen(true)}>编辑角色</span>
          <CustomP battleManager={battleManager}></CustomP>
          <Modal
            title={
              <div
                style={{ width: '100%', cursor: 'move' }}
                onMouseOver={() => {
                  if (disabled) {
                    setDisabled(false);
                  }
                }}
                onMouseOut={() => {
                  setDisabled(true);
                }}
                onFocus={() => { }}
                onBlur={() => { }}
              >
                编辑角色
              </div>
            }
            modalRender={(modal) => (
              <Draggable
                disabled={disabled}
                bounds={bounds}
                nodeRef={draggleRef}
                onStart={(event, uiData) => onStart(event, uiData)}
              >
                <div ref={draggleRef}>{modal}</div>
              </Draggable>
            )}
            open={characterEditorOpen}
            maskClosable={false}
            mask={false}
            style={{
              top: 20
            }}
            styles={{
              body: {
                maxHeight: 'calc(100vh - 200px)',
                overflowY: 'auto',
                paddingRight: '20px',
                marginTop: '30px'
              },
              header: {
                cursor: 'move' // 添加拖动指示器
              }
            }}
            onCancel={() => {
              setCharacterEditorOpen(false);
              setCurRoleEdit({ visible: false, data: null });
            }}
            width={1000}
            footer={[
              <Button
                key="back"
                style={{ display: curRoleEdit.visible ? '' : 'none' }}
                onClick={() => {
                  setCurRoleEdit({ visible: false, data: null });
                }}
              >
                返回
              </Button>,
              <Button
                key="cancel"
                onClick={() => {
                  setCharacterEditorOpen(false);
                  setCurRoleEdit({ visible: false, data: null });
                }}
              >
                取消
              </Button>,
              <Button
                key="save"
                type="primary"
                style={{ display: curRoleEdit.visible ? '' : 'none' }}
                onClick={() => {
                  characterFormRef.current?.submit();
                }}
              >
                保存
              </Button>
            ]}
          >
            {!curRoleEdit.visible ? (
              <div className="flex-1 p-4">
                <CharacterSelector
                  characters={battleManager.current.roles}
                  onEdit={handleEditCharacter}
                  onDelete={handleDeleteCharacter}
                  onAdd={() => setCurRoleEdit({
                    visible: true,
                    data: null
                  })}
                />
              </div>
            ) : (
              <CharacterEditor
                formRef={characterFormRef}
                initialValues={curRoleEdit.data}
                onSave={handleCharacterSave}
              />
            )}
          </Modal>
        </div>}
      </div>
      <SaveLoadModal
        open={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        mode="save"
        onConfirm={handleSave}
        dataCon={dataCon}
      />
      <HelpModal
        open={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
        mode="help"
        onConfirm={handleSave}
        dataCon={dataCon}
      />
      <SaveLoadModal
        open={loadModalOpen}
        onClose={() => setLoadModalOpen(false)}
        mode="load"
        onConfirm={handleLoad}
        dataCon={dataCon}
      />


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