import React, { useState } from 'react';
import { z } from 'zod';
import { InputNumber } from 'antd';
import { Equipment } from '../common/equip';
import { ItemBaseSchema } from '../common/items/type';


interface Props {
  playerCurrency: number;
  prop_id: string;
  data: (Equipment | ItemBaseSchema)[];
  onPurchase: (id: string, quantity: number) => void;
}

const ItemShop: React.FC<Props> = ({ data = [], playerCurrency = 0, onPurchase }) => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const getQuantity = (id: string) => quantities[id] || 1;
  const handleQuantityChange = (id: string, value: number) => {
    if (value > 0) {
      setQuantities(prev => ({ ...prev, [id]: value }));
    }
  };

  return (
    <div className="p-3">
      <h2 className="text-xl font-bold mb-2">商店</h2>
      <div className="mb-2">
        <span className="text-sm">当前金币: {playerCurrency}</span>
      </div>

      <div className="grid grid-cols-10 gap-2">
        {data.map((item) => {
          const quantity = getQuantity(item.id);

          const totalPrice = item.cost * quantity;
          const canAfford = playerCurrency >= totalPrice;

          return (
            <div
              key={item.id}
              className="border rounded p-2 bg-transparent"
            >
              <div className="flex flex-col space-x-2">
                <img src={item.icon} alt={item.name} className="w-8 h-8" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium truncate">{item.name}</h3>
                  <p className="text-xs text-gray-500 truncate">{item.description}</p>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-xs text-amber-600">
                  单价: {item.cost} 金币
                </p>
                <p className="text-xs font-medium text-amber-700">
                  总价: {totalPrice} 金币
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  <InputNumber
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(item.id, parseInt(String(e || 1)))}
                    className="w-24 text-center text-xs border rounded px-1 py-0.5"
                  />
                  <button
                    className={`flex-1 px-2 py-0.5 text-xs rounded ${canAfford
                      ? 'bg-amber-500 text-white hover:bg-amber-600'
                      : 'bg-gray-300 cursor-not-allowed'
                      }`}
                    onClick={() => canAfford && onPurchase(item.id, quantity)}
                    disabled={!canAfford}
                  >
                    购买
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ItemShop; 