import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { Button, InputNumber, Popover, Switch, Tabs } from 'antd';
import { Equipment, EquipTypeNames } from '../common/equip';
import { ItemBaseSchema } from '../common/items/type';
import { template } from 'lodash-es';



interface Props {
  playerCurrency?: number;
  prop_id?: string;
  data?: (Record<string, Equipment> | Record<string, ItemBaseSchema>)[];
  onPurchase?: (id: string, quantity: number, cls: string) => void;
  id?: string
  roleId?: string
  cls?: string
  name?: string
}

const ItemShop: React.FC<Props> = ({ data = {
  ITEM: [],
  EQUIP: [],
}, playerCurrency = 0, onPurchase, id = "", roleId = "", name }) => {
  // const [quantities, setQuantities] = useState<Record<string, number>>({});
  // const getQuantity = (id: string) => quantities[id] || 1;
  // const handleQuantityChange = (id: string, value: number) => {
  //   if (value > 0) {
  //     setQuantities(prev => ({ ...prev, [id]: value }));
  //   }
  // };
  const [activeMode, setActiveMode] = useState('ITEM');
  const [activeData, setActiveData] = useState<Record<string, Equipment> | Record<string, ItemBaseSchema>>(data[activeMode]);

  useEffect(() => {
    setActiveData(data[activeMode])
  }, [activeMode])
  return (
    <div className="px-3">
      <div className="flex items-center  mb-0">
        <span className="text-sm">{roleId ? `当前金币: ${playerCurrency.toFixed(0)} (${name})` : "请先选择人物(点击人物头像)"}</span>
        <div className="flex gap-4 items-center  mb-0 ml-auto mr-8 text-sm">
          <span>物品</span>
          <Switch onChange={e => setActiveMode(e ? 'EQUIP' : 'ITEM')}></Switch>
          <span>装备</span>
        </div>
        {/* 
        [
          {
            key: 'ITEM',
            label: '物品',
            children: (<>
              <ItemMain data={data['ITEM']} playerCurrency={playerCurrency} onPurchase={onPurchase} id={roleId} cls={"ITEM"}></ItemMain>
            </>)
          },
          {
            key: 'EQUIP',
            label: '装备',
            children: (<>
              <ItemMain data={data['EQUIP']} playerCurrency={playerCurrency} onPurchase={onPurchase} id={roleId} cls={"EQUIP"}></ItemMain>
            </>)
          },
        ] 
         */}
      </div>
      <Tabs
        className='w-full h-full'
        centered={false}
        items={Object.keys(activeData).map((k) => ({
          key: k,
          label: EquipTypeNames[k] || k,
          children: (<>
            <ItemMain data={activeData[k]} name={name} playerCurrency={playerCurrency} onPurchase={onPurchase} id={roleId} cls={activeMode}></ItemMain>
          </>)
        }))
        }>
      </Tabs>
    </div>
  );
};
const ItemMain: React.FC<Props> = ({ data = [], playerCurrency = 0, onPurchase, cls = "", name }) => {
  
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const getQuantity = (id: string) => quantities[id] || 1;
  const handleQuantityChange = (id: string, value: number) => {
    if (value > 0) {
      setQuantities(prev => ({ ...prev, [id]: value }));
    }
  };

  return (
    <div className="grid grid-cols-6 gap-1">
      {data.map((item) => {
        const quantity = getQuantity(item.id);
        const totalPrice = item.cost * quantity;
        const canAfford = playerCurrency >= totalPrice;

        return (
          <div
            className="border rounded p-2 bg-transparent"
          >
            <div className="flex flex-col space-x-2 justify-center items-center overflow-hidden">
              {item.icon && <img src={item.icon} alt={item.name} className="w-6 h-6" />}
              <div className="flex-1 min-w-0 overflow-hidden w-full text-center">
                <Popover className="inline" content={template(item.desc)({ name: name })} trigger="hover">
                  <h3 className="text-sm font-medium truncate my-2">{item.name}</h3>
                  <p className="text-xs text-gray-500 truncate overflow-hidden my-0.5">{template(item.desc)({ name: name }) || "..."}</p>
                </Popover>
              </div>
            </div>
            <div >
              <p className="text-xs text-amber-600 text-center my-1">
                单: {item.cost}
              </p>
              {cls === "ITEM" && <p className="text-xs text-amber-600 text-center my-1">
                总: {totalPrice}
              </p>}
              <div className="flex  flex-col justify-center items-center space-x-1 mt-2">
                {cls === "ITEM" && <InputNumber
                  type="number"
                  min="1"
                  size='small'
                  value={quantity}
                  onChange={(e) => handleQuantityChange(item.id, parseInt(String(e || 1)))}
                  className="w-24 text-center text-xs border rounded px-1 py-0.5"
                />}
                <Button
                  size='middle'
                  className={`flex-1 text-xs rounded mt-2 ${canAfford
                    ? 'bg-amber-500 text-white hover:bg-amber-600'
                    : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  onClick={() => canAfford && onPurchase && onPurchase(item.id, quantity, cls)}
                  disabled={!canAfford}
                >
                  购买
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ItemShop;

