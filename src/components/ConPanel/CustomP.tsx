// ShopEditor.tsx
import React, { MutableRefObject, useCallback, useRef, useState } from 'react';
import { Button, Form, message, Modal } from 'antd';
import type { FormInstance } from 'antd/lib/form';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import ItemEditor from '../ItemEditor';
import { BattleManager } from '../../common/tatakai';
import { cloneDeep } from 'lodash-es';

interface ShopEditorProps {
    formRef?: React.MutableRefObject<FormInstance | undefined>;
    onSave?: (values: any) => void;
    initialValues?: any;
    battleManager: MutableRefObject<BattleManager>
    refreshBet?: () => void
}

export const CustomP: React.FC<ShopEditorProps> = ({
    battleManager,
    refreshBet
    // formRef,
    // onSave,
    // initialValues
}) => {
    const [itemEditorOpen, setItemEditorOpen] = useState(false);
    const FormRef = useRef<FormInstance>();
    const [disabled, setDisabled] = useState(true);
    const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
    const draggleRef = useRef<HTMLDivElement>(null!);
    const [characterEditorOpen, setCharacterEditorOpen] = useState(false);
    const modalInfo = useRef<any>({
        mode: 'item',
        title: '编辑物品',
    });

    const [curRoleEdit, setCurRoleEdit] = useState({
        visible: false,
        data: null
    })
    const handleCharacterSave = async (values: any, id = null, type = "item", pluginId = 1) => {
        try {
            const plugin = localStorage.getItem('user-plugin-' + pluginId)
            let info: any = {}
            try {
                info = JSON.parse(plugin || '')
            } catch { }
            info[type] = values

            // info = { ...info, ...values }
            localStorage.setItem('user-plugin-' + pluginId, JSON.stringify(info || {}))
            // battleManager.current.load_plugins_role(info['role'])
            // message.success('保存成功');
            refreshBet && refreshBet()
            setCharacterEditorOpen(false);
        } catch (error) {
            // message.error('保存失败');
        }
    };
    const handleDeleteCharacter = (id: string, type = "item", pluginId = 1) => {
        try {
            const plugin = localStorage.getItem('user-plugin-' + pluginId);
            const data = JSON.parse(plugin || '{}');
            data[type] = (data[type] || []).filter((char: any) => char.id !== id);
            localStorage.setItem('user-plugin-' + pluginId, JSON.stringify(data));
            battleManager.current.load_plugins_role(data[type]);
            message.success('删除成功');
        } catch (error) {
            message.error('删除失败');
        }
    };
    const handleEditCharacter = useCallback((character: any) => {
        const data = cloneDeep({ ...character, target: null, at: null })
        console.log('handleEditCharacter', data)
        setCurRoleEdit({
            visible: true,
            data: data
        });
    }, []);
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
    return (
        <>
            <span onClick={() => (modalInfo.current.title = '编辑物品', setCharacterEditorOpen(true))}>编辑物品</span>
            <span onClick={() => (modalInfo.current.title = '编辑事件', setCharacterEditorOpen(true))} style={{textDecoration: "line-through"}}>编辑事件</span>
            <span onClick={() => (modalInfo.current.title = '编辑技能', setCharacterEditorOpen(true))} style={{textDecoration: "line-through"}}>编辑技能</span>
            <span onClick={() => (modalInfo.current.title = '编辑装备', setCharacterEditorOpen(true))} style={{textDecoration: "line-through"}}>编辑装备</span>

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
                        {modalInfo.current.title}
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
                            FormRef.current?.submit();
                        }}
                    >
                        保存
                    </Button>
                ]}
            >

                <ItemEditor
                    formRef={FormRef}
                    items={battleManager.current.ItemsManager.ItemsData}
                    initialValues={curRoleEdit.data}
                    handleEditCharacter={handleEditCharacter}
                    handleDeleteCharacter={handleDeleteCharacter}
                    onSave={handleCharacterSave}
                    curRoleEdit={curRoleEdit}
                    setCurRoleEdit={setCurRoleEdit}
                />

            </Modal>
        </>
        // <Form
        //     form={form}
        //     layout="vertical"
        //     initialValues={initialValues}
        //     onFinish={onSave}
        // >
        //     {/* 商店表单内容 */}
        // </Form>
    );
};




interface DraggableModalProps {
    title: string;
    open: boolean;
    onCancel: () => void;
    children: React.ReactNode;
    footer?: React.ReactNode[];
}

