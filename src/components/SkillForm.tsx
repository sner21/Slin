import { Form, Input, Select, InputNumber, Card, Button } from 'antd';
import { useState } from 'react';

const { Option } = Select;

const SkillForm = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    // 处理表单提交
    const skillData = {
      ...values,
      cost: { mp: values.mpCost },
      level: 1,  // 默认值
    };
    console.log('提交的技能数据:', skillData);
  };

  return (
    <Card title="创建技能" style={{ maxWidth: 600, margin: '0 auto' }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          type: 'ELEMENTAL_BURST',
          targetType: 'ALL',
          effectType: 'DAMAGE',
          cooldown: 5,
          element: 'ice',
          damageType: 'magic',
        }}
      >
        <Form.Item
          name="id"
          label="技能ID"
          rules={[{ required: true, message: '请输入技能ID' }]}
        >
          <Input placeholder="例如: shinoa_burst" />
        </Form.Item>

        <Form.Item
          name="name"
          label="技能名称"
          rules={[{ required: true, message: '请输入技能名称' }]}
        >
          <Input placeholder="例如: 永恒冰狱" />
        </Form.Item>

        <Form.Item
          name="description"
          label="技能描述"
          rules={[{ required: true, message: '请输入技能描述' }]}
        >
          <Input.TextArea placeholder="请描述技能效果" />
        </Form.Item>

        <Form.Item
          name="type"
          label="技能类型"
        >
          <Select>
            <Option value="ELEMENTAL_BURST">元素爆发</Option>
            <Option value="ELEMENTAL_SKILL">元素战技</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="targetType"
          label="目标类型"
        >
          <Select>
            <Option value="ALL">全体</Option>
            <Option value="SINGLE">单体</Option>
            <Option value="MULTI">多目标</Option>
            <Option value="SELF">自身</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="effectType"
          label="效果类型"
        >
          <Select>
            <Option value="DAMAGE">伤害</Option>
            <Option value="BUFF">增益</Option>
            <Option value="DEBUFF">减益</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="multiplier"
          label="伤害倍率"
          rules={[{ required: true, message: '请输入伤害倍率' }]}
        >
          <InputNumber min={0} max={1000} />
        </Form.Item>

        <Form.Item
          name="mpCost"
          label="魔法消耗"
          rules={[{ required: true, message: '请输入魔法消耗' }]}
        >
          <InputNumber min={0} max={200} />
        </Form.Item>

        <Form.Item
          name="cooldown"
          label="冷却时间"
        >
          <InputNumber min={0} max={20} />
        </Form.Item>

        <Form.Item
          name="element"
          label="元素类型"
        >
          <Select>
            <Option value="ice">冰</Option>
            <Option value="fire">火</Option>
            <Option value="thunder">雷</Option>
            <Option value="wind">风</Option>
            <Option value="dark">暗</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="damageType"
          label="伤害类型"
        >
          <Select>
            <Option value="magic">魔法</Option>
            <Option value="physical">物理</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            创建技能
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SkillForm; 