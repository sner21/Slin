import React from 'react';
import { Form, Input, InputNumber, Select, Tabs, Card, Upload } from 'antd';
import type { FormInstance } from 'antd/lib/form';
import { ElementType, getNumberConstraints } from '../common';
import { CharacterSaveSchema } from '../common/char/types';

interface CharacterEditorProps {
  formRef?: React.MutableRefObject<FormInstance | undefined>;
  onSave: (values: any) => void;
  initialValues?: any;
}

const CharacterEditor: React.FC<CharacterEditorProps> = ({
  formRef,
  onSave,
  initialValues
}) => {
  const [form] = Form.useForm();


  React.useEffect(() => {
    if (formRef) formRef.current = form;
  }, [form, formRef]);

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onSave}
    >
      <Tabs
        items={[
          {
            key: 'basic',
            label: '基本信息',
            children: (
              <Card>
                <Form.Item name="avatar" label="头像">
                  <Upload listType="picture-card">
                    {/* <PlusOutlined /> */}
                  </Upload>
                </Form.Item>
 {/* TODO 提交时加ID */}
                <Form.Item 
                  name="name" 
                  label="名称"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item 
                  name="gender" 
                  label="性别"
                >
                  <Select {...getNumberConstraints(CharacterSaveSchema.shape.gender)}>
                    <Select.Option value={0}>未知</Select.Option>
                    <Select.Option value={1}>男</Select.Option>
                    <Select.Option value={2}>女</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item 
                  name="type" 
                  label="类型"
                  rules={[{ required: true }]}
                >
                  <Select>
                    <Select.Option value={0}>人物</Select.Option>
                    <Select.Option value={1}>BOSS</Select.Option>
                    <Select.Option value={2}>部队</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item 
                  name="element" 
                  label="元素属性"
                  rules={[{ required: true }]}
                >
                  <Select>
                    {Object.values(ElementType._def.values).map(element => (
                      <Select.Option key={element} value={element}>
                        {element}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item name="salu" label="称号">
                  <Input />
                </Form.Item>

                <Form.Item name="description" label="描述">
                  <Input.TextArea />
                </Form.Item>
              </Card>
            )
          },
          {
            key: 'status',
            label: '状态',
            children: (
              <Card>
                <Form.Item 
                  name={['grow', 'level']} 
                  label="等级"
                >
                  <InputNumber {...getNumberConstraints(CharacterSaveSchema.shape.grow._def.innerType.shape.level)} />
                </Form.Item>

                <Form.Item 
                  name={['grow', 'exp']} 
                  label="经验值"
                >
                  <InputNumber {...getNumberConstraints(CharacterSaveSchema.shape.grow._def.innerType.shape.exp)} />
                </Form.Item>

                <Form.Item 
                  name={['grow', 'rarity']} 
                  label="稀有度"
                >
                  <InputNumber {...getNumberConstraints(CharacterSaveSchema.shape.grow._def.innerType.shape.rarity)} />
                </Form.Item>

                <Form.Item 
                  name="state" 
                  label="状态"
                >
                  <Select {...getNumberConstraints(CharacterSaveSchema.shape.state)}>
                    <Select.Option value={0}>存活</Select.Option>
                    <Select.Option value={1}>死亡</Select.Option>
                    <Select.Option value={2}>休息</Select.Option>
                    <Select.Option value={3}>探索</Select.Option>
                  </Select>
                </Form.Item>
              </Card>
            )
          },
          {
            key: 'ability',
            label: '基础属性',
            children: (
              <Card>
              <Form.Item 
                name={['ability', 'strength']} 
                label="力量"
              >
                <InputNumber {...getNumberConstraints(CharacterSaveSchema.shape.ability.shape.strength)} />
              </Form.Item>
              
              <Form.Item 
                name={['ability', 'agility']} 
                label="敏捷"
              >
                <InputNumber {...getNumberConstraints(CharacterSaveSchema.shape.ability.shape.agility)} />
              </Form.Item>
              
              <Form.Item 
                name={['ability', 'intelligence']} 
                label="智力"
              >
                <InputNumber {...getNumberConstraints(CharacterSaveSchema.shape.ability.shape.intelligence)} />
              </Form.Item>
            </Card>
            )
          }
        ]}
      />
    </Form>
  );
};

export default CharacterEditor;