import React from 'react';
import { Form, Input, InputNumber, Select, Tabs, Card } from 'antd';
import type { Character } from '../common/char/types';
import type { FormInstance } from 'antd';

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

  // 将 form 实例传递给父组件
  React.useEffect(() => {
    if (formRef) {
      formRef.current = form;
    }
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
                <Form.Item 
                  label="ID" 
                  name="id" 
                  rules={[{ required: true, message: '请输入ID' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item 
                  label="名称" 
                  name="name" 
                  rules={[{ required: true, message: '请输入名称' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item label="称号" name="salu">
                  <Input />
                </Form.Item>
                <Form.Item label="类型" name="type">
                  <Select>
                    <Select.Option value={0}>人物</Select.Option>
                    <Select.Option value={1}>BOSS</Select.Option>
                    <Select.Option value={2}>部队</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="性别" name="gender">
                  <Select>
                    <Select.Option value={0}>未知</Select.Option>
                    <Select.Option value={1}>男</Select.Option>
                    <Select.Option value={2}>女</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="描述" name="description">
                  <Input.TextArea />
                </Form.Item>
              </Card>
            ),
          },
          {
            key: 'ability',
            label: '属性',
            children: (
              <Card>
                <Form.Item label="力量" name={['ability', 'strength']} rules={[{ required: true }]}>
                  <InputNumber />
                </Form.Item>
                <Form.Item label="敏捷" name={['ability', 'agility']} rules={[{ required: true }]}>
                  <InputNumber />
                </Form.Item>
                <Form.Item label="智力" name={['ability', 'intelligence']} rules={[{ required: true }]}>
                  <InputNumber />
                </Form.Item>
              </Card>
            ),
          },
          {
            key: 'growth',
            label: '成长',
            children: (
              <Card>
                <Form.Item label="等级" name={['grow', 'level']}>
                  <InputNumber min={1} />
                </Form.Item>
                <Form.Item label="稀有度" name={['grow', 'rarity']}>
                  <InputNumber min={1} max={5} />
                </Form.Item>
                <Form.Item label="力量成长" name={['grow', 'growthRates', 'strength']}>
                  <InputNumber step={0.1} />
                </Form.Item>
                <Form.Item label="敏捷成长" name={['grow', 'growthRates', 'agility']}>
                  <InputNumber step={0.1} />
                </Form.Item>
                <Form.Item label="智力成长" name={['grow', 'growthRates', 'intelligence']}>
                  <InputNumber step={0.1} />
                </Form.Item>
              </Card>
            ),
          }
        ]}
      />
    </Form>
  );
};

export default CharacterEditor; 