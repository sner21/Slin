import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Form, Input, InputNumber, Select, Tabs, Card, Upload, Radio, Image } from 'antd';
import type { FormInstance } from 'antd/lib/form';
import { ElementType, getNumberConstraints } from '../common';
import { CharacterSaveSchema } from '../common/char/types';
import { getFieldComponent, renderFormItem } from '../common/zodForm';
import { CharacterTranslations } from '../translation/char';
import { assignIn, get } from 'lodash-es';
import { v4 as uuidv4 } from 'uuid';
import { PlusOutlined } from '@ant-design/icons';

interface CharacterEditorProps {
  formRef?: React.MutableRefObject<FormInstance | undefined>;
  onSave: (values: any, id: string) => void;
  initialValues?: any
}

const CharacterEditor: React.FC<CharacterEditorProps> = ({
  formRef,
  onSave,
  initialValues = CharacterSaveSchema.parse({})
}) => {
  const [form] = Form.useForm();
  const [avatarType, setAvatarType] = useState('url');
  const [isAvatarLocal, setIsAvatarLocal] = useState(false);
  const handleFinish = useCallback((values: any) => {
    if (initialValues) {
      values.id = initialValues.id
      values = assignIn(initialValues, values)
    } else {
      values.id = uuidv4();
      values = CharacterSaveSchema.parse(values);
    }

    onSave(values, initialValues.id);
  }, [onSave]);
  const [avatars, setAvatars] = useState<string[]>([]);
  useEffect(() => {
    const loadImages = async () => {
      const images = import.meta.glob('/src/assets/*.{png,jpg,jpeg,gif,svg}');
      const paths = Object.keys(images).map(path => path);
      setAvatars(paths);
    };
    loadImages();
  }, []);



  const handleField = (field: string) => {
    const i = get(CharacterTranslations, field) || field
    return { field: field, label: i.label?.zh || i.zh }
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
    >
      <Tabs
        items={useMemo(() => ([
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
                    <Radio.Button value="url">URL</Radio.Button>
                    <Radio.Button value="local">本地文件</Radio.Button>
                  </Radio.Group>
                </Form.Item>

                {avatarType === 'local' ? (
                  <Form.Item
                    name="avatar"
                    label="头像"
                  >
                    <div className="flex flex-wrap gap-2">
                      {avatars.map((avatar, index) => (
                        <div
                          key={index}
                          className="cursor-pointer hover:border-blue-500 border-2 border-transparent rounded-lg w-12 h-12 overflow-hidden "
                          onClick={() => form.setFieldValue('avatar', avatar)}
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
                {renderFormItem(CharacterSaveSchema.shape.description, handleField("description"))}
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
        ]), [avatarType])}
      />
    </Form>
  );
};

export default React.memo(CharacterEditor)