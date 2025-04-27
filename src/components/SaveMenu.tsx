import { Card } from 'antd';
import dayjs from 'dayjs';
import { FC, useEffect } from 'react';
interface SaveLoadModalProps {
    open: boolean;
    onClose: () => void;
    mode: 'save' | 'load';
    onConfirm: (slotId: string, loadMode: boolean) => void;
    dataCon: any; // 存档数据
}

const SaveMenu: FC<SaveLoadModalProps> = ({
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
    useEffect(() => {
        dataCon.current?.get_save_data()
        console.log('获取存档数据', dataCon.current?.save_data)
    }, [open]);
    return (
        <div className="grid grid-cols-1 gap-4 w-full">
            {saveSlots.map(slot => (
                <Card
                    key={slot.id}
                    hoverable
                    onClick={() => onConfirm && onConfirm(slot.id, dataCon.current?.save_data[`${slot.id}:save`])}
                    className="cursor-pointer"
                >
                    <div className="flex justify-between items-center">
                        <span>{slot.name}</span>
                        <span className="text-gray-500">
                            {/* 这里可以显示存档时间等信息 */}
                            {dataCon.current?.save_data[`${slot.id}:save`] ? dayjs(dataCon.current?.save_data[`${slot.id}:save`]?.time).format('YYYY-MM-DD HH:mm:ss') : '空存档'}
                        </span>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default SaveMenu; 