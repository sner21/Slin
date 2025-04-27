import React, { Component, useCallback, useEffect, useMemo, useState } from 'react';
import { Form, Input, InputNumber, Select, Tabs, Card, Upload, Radio, Image } from 'antd';
import type { FormInstance } from 'antd/lib/form';
import { ElementType, getNumberConstraints } from '../common';
import { CharacterSaveSchema, CharacterSchema, Ability } from '../common/char/types';
import { getFieldComponent, renderFormItem } from '../common/zodForm';
import { CharacterTranslations } from '../translation/char';
import { assignIn, get } from 'lodash-es';
import { v4 as uuidv4 } from 'uuid';
import { PlusOutlined } from '@ant-design/icons';
import { BattleManager } from '../common/tatakai';
import { SkillMap, SkillTypeMap } from '../common/skill';

interface CharacterEditorProps {
  formRef?: React.MutableRefObject<FormInstance | undefined>;
  onSave: (values: any, id: string) => void;
  initialValues?: any
}

const CharacterEditor: React.FC<CharacterEditorProps> = ({
  formRef,
  onSave,
  initialValues = CharacterSaveSchema.parse({}),
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
    values.at = []
    onSave(CharacterSchema.parse(values), values.id);
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
  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={handleFinish}
      onChange={() => {
        console.log(form.getFieldsValue(true))
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
                <Form.Item label="头像类型">
                  <Radio.Group
                    value={avatarType}
                    onChange={e => (setAvatarType(e.target.value), setIsAvatarLocal(true))}
                  >
                    <Radio.Button value="url" onClick={()=>form.setFieldValue('avatar', '')}>URL</Radio.Button>
                    <Radio.Button value="local">本地文件</Radio.Button>
                  </Radio.Group>
                </Form.Item>

                {avatarType === 'local' ? (
                  <Form.Item
                    name="avatar"
                    label="头像"
                  >
                    <div className="flex flex-wrap gap-2" >
                      {avatars.map((avatar, index) => (
                        <div
                          key={index}
                          className="cursor-pointer  border-2 border-transparent border-solid rounded-lg w-12 h-12 overflow-hidden "
                          style={{ borderColor: form.getFieldValue('avatar') === avatar ? '#ba7749' : '' }}
                          onClick={() => (form.setFieldValue('avatar', avatar), setUpdate(update + 1))}
                        >
                          <Image
                            src={avatar}
                            alt={`avatar-${index}`}
                            className="object-cover rounded w-12 h-12"
                            preview={false}
                          />
                        </div>
                      ))}
                    </div>
                  </Form.Item>
                ) :
                  renderFormItem(CharacterSaveSchema.shape.avatar, handleField("avatar"), { onChange: () => (isAvatarLocal && form.setFieldValue('avatar', ""), setIsAvatarLocal(false)) })
                }
                {renderFormItem(CharacterSaveSchema.shape.name, handleField("name"))}
                {renderFormItem(CharacterSaveSchema.shape.gender, handleField("gender"))}
                {renderFormItem(CharacterSaveSchema.shape.type, handleField("type"))}
                {renderFormItem(CharacterSaveSchema.shape.element, handleField("element"))}
                {renderFormItem(CharacterSaveSchema.shape.salu, handleField("salu"))}
                {renderFormItem(CharacterSaveSchema.shape.normal, handleField("normal", () => {
                  return <Select mode="multiple" placeholder="普通攻击" onChange={(normal) => form.setFieldValue('normal', normal)}>
                    {Object.values(SkillMap).map((value: string) => (
                      <Select.Option value={value.id} >
                        {value.name}
                      </Select.Option>
                    ))}
                  </Select>
                }))}
                {renderFormItem(CharacterSaveSchema.shape.skill, handleField("skill", () => {
                  return <Select mode="multiple" placeholder="技能" onChange={(skill) => form.setFieldValue('skill', skill)}>
                    {Object.values(SkillMap).map((value: string) => (
                      <Select.Option value={value.id} >
                        {value.name}
                      </Select.Option>
                    ))}
                  </Select>
                }))}
                {/* {renderFormItem(CharacterSaveSchema.shape.description, handleField("description"))} */}
              </Card>
            )
          },
          {
            key: 'status',
            label: '状态',
            children: (
              <Card>
                {renderFormItem(CharacterSaveSchema.shape.grow._def.innerType.shape.level, handleField("grow.level"))}
                {renderFormItem(CharacterSaveSchema.shape.grow._def.innerType.shape.rarity, handleField("grow.rarity"))}
              </Card>
            )
          },

          {
            key: 'ability',
            label: '基础属性',
            children: (
              <Card>
                {Object.keys(CharacterSaveSchema.shape.ability._def.innerType.shape).map(key => renderFormItem(CharacterSaveSchema.shape.ability._def.innerType.shape[key], handleField("ability." + key)))}
              </Card>
            )
          }
        ]}
      />
    </Form>
  );
};

export default React.memo(CharacterEditor)