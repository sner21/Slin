import { Modal, Card } from 'antd';
import { FC } from 'react';
import { BattleManager } from '../../common/tatakai';
import dayjs from 'dayjs';
import SaveMenu from '../../components/SaveMenu';
interface SaveLoadModalProps {
  open: boolean;
  onClose: () => void;
  mode: 'save' | 'load';
  onConfirm: (slotId: string) => void;
  dataCon: any; // 存档数据
}

const SaveLoadModal: FC<SaveLoadModalProps> = ({
  open,
  onClose,
  mode,
  onConfirm,
  dataCon
}) => {
  const saveSlots = [
    { id: 'auto', name: '自动存档' },
    { id: 'slot1', name: '存档位置 1' },
    { id: 'slot2', name: '存档位置 2' },
    { id: 'slot3', name: '存档位置 3' },
    { id: 'slot4', name: '存档位置 4' },
    { id: 'slot5', name: '存档位置 5' },
    { id: 'slot6', name: '存档位置 6' },
  ];

  return (
    <Modal
      title={mode === 'save' ? "保存游戏" : "读取游戏"}
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <SaveMenu onConfirm={onConfirm} dataCon={dataCon}></SaveMenu>
    </Modal>
  );
};

export default SaveLoadModal; 