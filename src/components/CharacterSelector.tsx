// CharacterSelector.tsx
import React from 'react';
import { Card, Button, Popconfirm, Empty } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Character } from '../common/char/types';

interface CharacterSelectorProps {
    characters: Character[];
    onEdit: (character: Character) => void;
    onDelete: (id: string) => void;
    onAdd: () => void;
}

export const CharacterSelector: React.FC<CharacterSelectorProps> = ({
    characters,
    onEdit,
    onDelete,
    onAdd,
}) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* 添加新角色卡片 */}
            <Card
                className="flex items-center justify-center cursor-pointer hover:border-blue-400"
                onClick={onAdd}
            >
                <div className="flex flex-col items-center gap-2">
                    <PlusOutlined className="text-2xl" />
                    <span>添加新角色</span>
                </div>
            </Card>

            {/* 角色卡片列表 */}
            {characters.map((character) => (
                <Card
                    key={character.id}
                    className="relative hover:border-blue-400"
                    cover={
                        <div className="h-32 flex items-center justify-center bg-gray-100">
                            {character.avatar ? (
                                <img
                                    src={character.avatar}
                                    alt={character.name}
                                    className="max-h-full max-w-full object-cover"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
                                    {character.name?.[0] || '?'}
                                </div>
                            )}
                        </div>
                    }
                >
                    <Card.Meta
                        title={
                            <div className="flex justify-between items-center">
                                <span>{character.name || '未命名'}</span>
                                <div className="flex gap-2">
                                    <EditOutlined
                                        className="cursor-pointer text-blue-500 hover:text-blue-600"
                                        onClick={() => onEdit(character)}
                                    />
                                    <Popconfirm
                                        title="确定要删除这个角色吗？"
                                        onConfirm={() => onDelete(character.id)}
                                        okText="确定"
                                        cancelText="取消"
                                    >
                                        <DeleteOutlined className="cursor-pointer text-red-500 hover:text-red-600" />
                                    </Popconfirm>
                                </div>
                            </div>
                        }
                        description={
                            <div className="text-sm text-gray-500">
                                <div>等级: {character.grow?.level || 1}</div>
                                <div>类型: {character.type === '0' ? '人物' : character.type === '1' ? 'BOSS' : '部队'}</div>
                            </div>
                        }
                    />
                </Card>
            ))}

            {characters.length === 0 && (
                <Empty description="暂无角色" />
            )}
        </div>
    );
};

