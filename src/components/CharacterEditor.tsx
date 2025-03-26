import React, { useCallback, useEffect, useMemo } from 'react';
import { Form, Input, InputNumber, Select, Tabs, Card, Upload } from 'antd';
import type { FormInstance } from 'antd/lib/form';
import { ElementType, getNumberConstraints } from '../common';
import { CharacterSaveSchema } from '../common/char/types';
import { getFieldComponent, renderFormItem } from '../common/zodForm';
import { CharacterTranslations } from '../translation/char';
import { assignIn, get } from 'lodash-es';
import { v4 as uuidv4 } from 'uuid';

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
  const handleFinish = useCallback((values: any) => {
 
    if (initialValues) {
      values.id = initialValues.id
      values = assignIn(initialValues, values)
    } else {
      values.id = uuidv4();
      values = CharacterSaveSchema.parse(values);
    }
    console.log(values, 'values', initialValues)
    onSave(values, initialValues.id);
  }, [onSave]);
  const handleField = (field: string) => {
    const i = get(CharacterTranslations, field)
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
                {/* TODO 提交时加ID */}
                {!initialValues.avatar && renderFormItem(CharacterSaveSchema.shape.avatar, handleField("avatar"))}
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
                {renderFormItem(CharacterSaveSchema.shape.ability._def.innerType.shape.strength, handleField("ability.strength"))}
                {renderFormItem(CharacterSaveSchema.shape.ability._def.innerType.shape.agility, handleField("ability.agility"))}
                {renderFormItem(CharacterSaveSchema.shape.ability._def.innerType.shape.intelligence, handleField("ability.intelligence"))}
              </Card>
            )
          }
        ]), [])}
      />
    </Form>
  );
};

export default React.memo(CharacterEditor)