// import './v.css';
import VList from '../VList';
import { message, Popover } from 'antd';
import { template } from 'lodash-es';
import { elementColors, elementNames } from '../../common';
import { ScopeTypeNames, SkillMap, SkillTypeNames } from '../../common/skill';
import { BattleManager } from '../../common/tatakai';
import { FC, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import ItemShop from './ShopContent';
import { useDialog } from './DialogManager';
import { Character } from '../common/char/types';
import { useThrottledProxyRef } from '../hook';
import { levelColorClass } from '../common';
import { EquipTypeNames } from '../common/equip';

interface Props {
    battleManager: BattleManager,
    item: Character,
    curRole,
    setCurRole
}

const RecordCon = forwardRef<{ openShop }, Props>(({ battleManager, item, curRole, setCurRole }, ref) => {
    const itemsManager = useThrottledProxyRef(battleManager.current?.ItemsManager?.ItemsData);
    const inventory = useRef<any[]>(Array(28).fill(null));
    const { openDialog, updateDialog, closeDialog, dialogs } = useDialog();

    const showTooltipContent = useRef(false);
    const currentItem = useRef(null);
    useEffect(() => {
        return () => {
            closeDialog(`item-shop`)
        }
    }, []);

    useEffect(() => {
        if (curRole.id) {
            updateDialog('item-shop', {
                content: (
                    ItemShopRef
                )
            });
        }
    }, [curRole.id, curRole?.carry?.currency]);
    const ItemShopRef =
        <div><ItemShop onPurchase={(id, quantity, cls) => onPurchaseItem(id, quantity, cls)} playerCurrency={curRole?.carry?.currency} name={curRole.name} roleId={curRole.id}
            data={{
                ITEM: battleManager.current?.ItemsManager.ItemsDataGroup || [],
                EQUIP: battleManager.current?.ItemsManager.equipmentsDataGroup || [],
            }}></ItemShop></div>

    const onPurchaseItem = (itemId: string, quantity: number, cls: string) => {
        if (!curRole.carry) {
            curRole.carry = { currency: 0, items: {} };
        }
        let item
        if (cls === "ITEM") {
            item = battleManager.current?.ItemsManager.ItemsData[itemId] || {};
        } else {
            item = battleManager.current?.ItemsManager.equipmentsDataMap[itemId] || {};
        }
        const totalCost = Math.floor((item!.cost || 0) * quantity);
        let targetSlot: number | null = null;
        const MAX_SLOTS = 28;
        const MAX_STACK = 99;
        for (const [slot, item] of Object.entries(curRole.carry.items)) {
            if (item?.id === itemId && (item.count + quantity <= MAX_STACK && cls === "ITEM")) {
                targetSlot = Number(slot);
                break;
            }
        }
        if (targetSlot === null) {
            for (let i = 0; i <= MAX_SLOTS - 1; i++) {
                if (!curRole.carry.items[i]?.id) {
                    targetSlot = i;
                    break;
                }
            }
        }
        if (targetSlot === null) {
            message.error('物品栏已满');
            return;
        }
        curRole.carry.currency = Math.floor((curRole.carry.currency || 0) - totalCost);
        if (!curRole.carry.items[targetSlot]?.id) {
            curRole.carry.items[targetSlot] = {
                id: item.id,
                count: quantity,
                cls: cls,
                type: item.type
            };
        } else {
            curRole.carry.items[targetSlot].count += quantity;
        }
    }
    const openShop = (id = "") => {
        const a = dialogs?.find(i => i.id === `item-shop`)
        if (id) {
            setCurRole(battleManager.current?.roles_group[id])

        } else {
            setCurRole({ id: "" })
            if (dialogs) {
                if (a) {
                    return closeDialog(`item-shop`)
                }
            }

        }
        if (!a) {
            openDialog({
                id: `item-shop`,
                roleId: curRole.id,
                title: "商店",
                initialSize: { width: 800, height: 600 },
                initialPosition: { x: window.innerWidth - 800, y: 0 },
                minWidth: 800,
                minHeight: 500,
                content: (ItemShopRef),
            })
        }
        updateDialog('item-shop', {
            content: (
                ItemShopRef
            )
        });
    }

    const showTooltip = (item: any) => {
        currentItem.current = item;
        showTooltipContent.current = true;
    };

    const hideTooltip = () => {
        showTooltipContent.current = false;
        currentItem.current = null;
    };
    useImperativeHandle(ref, () => ({
        openShop
    }))
    return (
        <>
            <div className="p-2 bg-[#1a1a1aad] rounded-lg w-fit" style={{ display: item.display.frame_type === "item" ? "" : "none" }}>
                <div className="pb-1 flex items-center">
                    <span className="ml-auto mr-2 text-xs"> Currency：{item.carry.currency.toFixed(0) || 0}</span>
                </div>
                <div className="grid grid-cols-7 gap-2 w-fit">
                    {inventory.current.map((i, index) => {
                        const ii = item.carry.items[index] || null
                        const itemData = ii?.id ? (ii.cls === 'ITEM' ? battleManager.current?.ItemsManager.ItemsData[ii.id] : battleManager.current?.ItemsManager.equipmentsDataMap[ii.id]) : {} as any
                        // "ice_scythe"
                        return (
                            <div
                                className="relative w-8 h-8 bg-[#2a2a2a] border-2 border-[#3a3a3a] rounded cursor-pointer 
                                    flex items-center justify-center transition-all-5000
                                    hover:border-[#4a4a4a] hover:bg-[#333]"
                                key={index}
                                onContextMenu={(e) => e.preventDefault()}
                                onClick={() => openShop(item.id)}
                                onAuxClick={() => battleManager.current?.ItemsManager.use_item(item, ii.id, index + '', ii.cls)}
                            >
                                {
                                    (ii && (
                                        <Popover className="w-full w-full flex p-0" content={<div>
                                            <div>{itemsManager.current && template(ii.desc)(item)}</div>
                                            <div>
                                                {/*  数量：{itemData.count} */}   价格 :{itemData.cost}  类型 : {EquipTypeNames[itemData.type] || itemData.type}
                                            </div>
                                        </div>} title={<span style={{ color: levelColorClass(itemsManager.current && itemData?.rarity) }}>{itemData?.name}</span>} trigger="hover">
                                            {itemData?.icon ? <img
                                                src={itemData?.icon}
                                                className="object-contain"
                                                onMouseEnter={() => showTooltip(ii)}
                                                onMouseLeave={hideTooltip}
                                            /> : <div className="indent-xs text-center">{itemData.name.slice(0, 1)}</div>}
                                            {ii?.count > 1 && (
                                                <span className="absolute bottom-0.5 right-0.5 bg-black/80 text-white pr-0.5 rounded text-xs pointer-events-none">
                                                    {ii.count}
                                                </span>
                                            )}
                                        </Popover>
                                    ))
                                }
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    );
})


export default RecordCon; 