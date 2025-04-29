import React, { Component, useCallback, useEffect, useMemo, useState } from 'react';
import { Form, Input, InputNumber, Select, Tabs, Card, Upload, Radio, Image, Popconfirm, Empty, Button } from 'antd';
import type { FormInstance } from 'antd/lib/form';
import { ElementType, getNumberConstraints } from '../common';
import { CharacterSchema, Ability } from '../common/char/types';
import { getFieldComponent, renderFormItem } from '../common/zodForm';
import { CharacterTranslations } from '../translation/char';
import { assignIn, get } from 'lodash-es';
import { v4 as uuidv4 } from 'uuid';
import { DeleteOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { BattleManager } from '../common/tatakai';
import { SkillMap, SkillTypeMap } from '../common/skill';
import { FC } from 'react';
import { EffectsSchema } from '../common/char/attr';
import { ItemBaseSchema } from '../common/items/type';

interface CharacterEditorProps {
  formRef?: React.MutableRefObject<FormInstance | undefined>;
  onSave: (values: any, id: string) => void;
  initialValues?: any
  curRoleEdit: any
  items: any
  handleEditCharacter
  handleDeleteCharacter
  setCurRoleEdit
}

const ItemsEditor: React.FC<CharacterEditorProps> = ({
  formRef,
  onSave,
  curRoleEdit,
  initialValues = ItemBaseSchema.parse({}),
  items = [],
  handleEditCharacter,
  handleDeleteCharacter,
  setCurRoleEdit,
}) => {
  const [form] = Form.useForm();
  const [avatarType, setAvatarType] = useState('local');
  const [update, setUpdate] = useState(0);
  const [formValues, setFormValues] = useState({});

  const [isAvatarLocal, setIsAvatarLocal] = useState(false);
  const handleFinish = useCallback((values: any) => {
    if (initialValues?.id) {
      values.id = initialValues.id
      values = assignIn(initialValues, values)
    } else {
      values.id = uuidv4();
    }
    onSave(ItemBaseSchema.parse(values), values.id);
  }, [onSave]);
  const [avatars, setAvatars] = useState<string[]>([]);
  useEffect(() => {
    const loadImages = async () => {
      const images = import.meta.glob('/src/assets/*.{png,jpg,jpeg,gif,svg}');
      const paths = Object.keys(images).map(path => path);
      setAvatars(paths);
    };
    loadImages();
    setUpdate(update + 1)
  }, []);

  const handleField = (field: string, slot?: Component) => {
    const i = get(CharacterTranslations, field) || field
    return { field: field, label: i.label?.zh || i.zh, slot }
  }
  useEffect(() => {
    if (formRef) formRef.current = form;
  }, [form, formRef]);
  return useMemo(() => (<>{curRoleEdit.visible ? (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleFinish}
      onChange={() => {
        setFormValues({ ...form.getFieldsValue(true) });
      }}
    >
      <Tabs
        items={[
          {
            key: 'basic',
            label: '基本信息',
            children: (
              <Card>
                {/* <Form.Item label="头像类型">
                  <Radio.Group
                    value={avatarType}
                    onChange={e => (setAvatarType(e.target.value), setIsAvatarLocal(true))}
                  >
                    <Radio.Button value="url">URL</Radio.Button>
                    <Radio.Button value="local">本地文件</Radio.Button>
                  </Radio.Group>
                </Form.Item> */}

                {renderFormItem(ItemBaseSchema.shape.name, handleField("name"))}
                {/* {renderFormItem(ItemBaseSchema.shape.effects, handleField("effects"))} */}
                {renderFormItem(ItemBaseSchema.shape.type, handleField("type"))}
                {renderFormItem(ItemBaseSchema.shape.desc, handleField("desc"))}
                {/* {renderFormItem(ItemBaseSchema.shape.buffs, handleField("buffs"))} */}
                {/* {renderFormItem(ItemBaseSchema.shape.normal, handleField("normal", () => {
                  return <Select mode="multiple" placeholder="普通攻击" onChange={(normal) => form.setFieldValue('normal', normal)}>
                    {Object.values(SkillMap).map((value: string) => (
                      <Select.Option value={value.id} >
                        {value.name}
                      </Select.Option>
                    ))}
                  </Select>
                }))} */}

                {/* {renderFormItem(ItemBaseSchema.shape.desc, handleField("desc"))} */}
              </Card>
            )
          },
          {
            key: 'status',
            label: '图标',
            children: (
              <Card>
                <Form.Item name="icon" label="">
                  <FolderSelector form={form} />
                </Form.Item>
              </Card>
            )
          },
          {
            key: 'effects',
            label: '副作用',
            children: (
              <EffectsFormList className="relative" handleField={handleField}></EffectsFormList>
            )
          }
        ]}
      />
    </Form>
  ) : <CharacterSelector
    data={items}
    onEdit={handleEditCharacter}
    onDelete={handleDeleteCharacter}
    onAdd={() => setCurRoleEdit({
      visible: true,
      data: null
    })}
  />}</>), [curRoleEdit])

}
const EffectsFormList: React.FC<EffectsFormListProps> = ({ handleField }) => {
  return (

    <Form.List name="effects" >
      {(fields, { add, remove }) => (
        <>
          <Button
            type="dashed"
            onClick={() => add()}
            className='mb-4'
            block
            icon={<PlusOutlined />}
          >
            添加效果
          </Button>
          {fields.map((field, index) => (
            <Card
              key={field.key}
              className="mb-4"
              extra={
                <MinusCircleOutlined
                  onClick={() => remove(field.name)}
                  className="text-amber-500 hover:text-amber-600"
                />
              }
              title={`效果 ${index + 1}`}
            >
              <Form.Item {...field}>
                {renderFormItem(EffectsSchema.shape.isBuff, handleField("isBuff"))}
                {renderFormItem(EffectsSchema.shape.target, handleField("target"))}
                {renderFormItem(EffectsSchema.shape.attr, handleField("attr"))}
                {renderFormItem(EffectsSchema.shape.path, handleField("path"))}
                {renderFormItem(EffectsSchema.shape.value, handleField("value"))}
                {renderFormItem(EffectsSchema.shape.operator, handleField("operator"))}
                {renderFormItem(EffectsSchema.shape.probability, handleField("probability"))}
                {renderFormItem(EffectsSchema.shape.duration, handleField("effects"))}
                {renderFormItem(EffectsSchema.shape.conditions, handleField("conditions"))}
              </Form.Item>
            </Card>
          ))}

        </>
      )}
    </Form.List>

  );
};
const FolderSelector: FC = ({ form }) => {
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  // 从表单获取当前选中的图标
  const selectedIcon = Form.useWatch('icon', form);

  useEffect(() => {
    const loadImages = async () => {
      const basePath = '/src/assets/items';
      const images = import.meta.glob('/src/assets/items/**/*.{png,jpg,jpeg,gif,svg}');
      const paths = Object.keys(images);

      if (selectedPath.length === 0) {
        // 根目录下：获取第一层目录名
        const firstLevelDirs = [...new Set(paths.map(path => {
          const parts = path.replace(basePath + '/', '').split('/');
          return parts[0];
        }))];
        setCurrentImages(firstLevelDirs);
        return;
      }

      // 子目录下：获取当前路径下的所有文件和文件夹
      const currentDir = selectedPath.join('/');
      const filteredPaths = paths.filter(path => {
        const relativePath = path.replace(basePath + '/', '');
        return relativePath.startsWith(currentDir + '/');
      });

      setCurrentImages(filteredPaths);
    };

    loadImages();
  }, [selectedPath]);

  return (
    <div>
      {/* 面包屑导航 */}
      <div className="flex items-center gap-2 mb-4">
        <span
          className="cursor-pointer hover:text-blue-500"
          onClick={() => setSelectedPath([])}
        >
          根目录
        </span>

        {selectedPath.map((folder, index) => (
          <React.Fragment key={folder}>
            <span>/</span>
            <span
              className="cursor-pointer hover:text-blue-500"
              onClick={() => setSelectedPath(prev => prev.slice(0, index + 1))}
            >
              {folder}
            </span>
          </React.Fragment>
        ))}
      </div>
      {/* 文件和文件夹网格 */}
      <div className="grid grid-cols-8 gap-4">
        {currentImages.map((path) => {
          const isFolder = !path.match(/\.(png|jpg|jpeg|gif|svg)$/);
          const name = path.split('/').pop() || '';

          return isFolder ? (
            // 文件夹
            <div
              key={path}
              className="cursor-pointer border rounded p-4 hover:border-orange-500 text-center"
              onClick={() => setSelectedPath(prev => [...prev, name])}
            >
              <div>📁</div>
              {name}
            </div>
          ) : (
            // 图片
            <div
              key={path}
              className={`
                cursor-pointer border-2 rounded p-2 hover:border-orange-500
                ${selectedIcon === path ? 'border-v-500 ring-2 ring-orange-300' : 'border-transparent'}
              `}
              onClick={() => form.setFieldValue('icon', path)}
            >
              <Image
                src={path}
                alt={name}
                className={`
                  w-full h-16 object-cover
                  ${selectedIcon === path ? 'opacity-90' : ''}
                `}
                preview={false}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CharacterSelector: React.FC<any> = ({
  data,
  onEdit,
  onDelete,
  onAdd,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {/* 添加新物品卡片 */}
      <Card
        className="flex items-center justify-center cursor-pointer hover:border-orange-400"
        onClick={onAdd}
      >
        <div className="flex flex-col items-center gap-2">
          <PlusOutlined className="text-2xl" />
          <span>添加新物品</span>
        </div>
      </Card>

      {/* 物品卡片列表 */}
      {Object.values(data).map((character) => (
        <Card
          key={character.id}
          className="relative hover:border-orange-400 cursor-pointer"
          onClick={() => onEdit(character)}
          cover={
            <div className="h-32 flex items-center justify-center ">
              {character.icon ? (
                <img
                  src={character.icon}
                  alt={character.name}
                  style={{ objectFit: 'cover', width: '100%' }}
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
          <div style={{ position: 'absolute', right: '0px', top: '0px' }} onClick={e => e.stopPropagation()}>
            <Popconfirm
              title="确定要删除这个物品吗？"
              onConfirm={() => onDelete(character.id)}
              okText="确定"
              cancelText="取消"

            >
              <DeleteOutlined className="cursor-pointer text-amber-500 hover:text-amber-600 text-6 mr-1 mt-1" />
            </Popconfirm>
          </div>

          <Card.Meta
            title={
              <div className="flex justify-between items-center">
                <span>{character.name || '未命名'}</span>
                <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                  {/* <EditOutlined
                                      className="cursor-pointer text-blue-500 hover:text-blue-600"
                                      onClick={() => onEdit(character)}
                                  /> */}
                  {/* <Popconfirm
                                      title="确定要删除这个物品吗？"
                                      onConfirm={() => onDelete(character.id)}
                                      okText="确定"
                                      cancelText="取消"
                                  >
                                      <DeleteOutlined className="cursor-pointer text-red-500 hover:text-red-600" />
                                  </Popconfirm> */}
                </div>
              </div>
            }
            description={
              <div className="text-sm text-gray-500">
                <div>类型: {character.type}</div>
                <div>{character.desc}</div>
              </div>
            }
          />
        </Card>
      ))}

      {data.length === 0 && (
        <Empty description="暂无物品" />
      )}
    </div>
  );
};


export default React.memo(ItemsEditor)
