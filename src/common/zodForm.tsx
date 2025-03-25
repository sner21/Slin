import { z } from 'zod';
import { Form, Input, InputNumber, Select } from 'antd';
import React from 'react';
import { getNumberConstraints } from '.';
 
export const getFieldComponent = (schema: z.ZodType<any>) => {
    const def = schema._def;

    // 处理默认值包装
    if (def.typeName === 'ZodDefault') {
        return getFieldComponent(def.innerType);
    }

  
    switch (def.typeName) {
        case 'ZodNumber':
            return InputNumber;
        case 'ZodEnum':
            return (props: any) => (
                <Select {...props} >
                    {Object.values(def.values).map((value: string) => (
                        <Select.Option key={value} value={value}>
                            {value}
                        </Select.Option>
                    ))}
                </Select>
            );
        case 'ZodString':
            // 根据最大长度判断是否使用 TextArea
            const maxLength = def.checks?.find((c: any) => c.kind === 'max')?.value;
            return maxLength && maxLength > 100 ? Input.TextArea : Input;
        default:
            return Input;
    }
};

export const renderFormItems = (schema: z.ZodType<any>, parentPath: string[] = []) => {
    const def = schema._def;

    if (def.typeName === 'ZodObject') {
        return Object.entries(def.shape()).map(([key, fieldSchema]: [string, any]) => {
            const path = [...parentPath, key];

            // 递归处理嵌套对象
            if (fieldSchema._def.typeName === 'ZodObject') {
                return (
                    <div key={key} style={{ marginLeft: 20 }}>
                        <h4>{key}</h4>
                        {renderFormItems(fieldSchema, path)}
                    </div>
                );
            }

            const Component = getFieldComponent(fieldSchema);
            const constraints = getNumberConstraints(fieldSchema);
  // 根据类型返回对应组件

            return (
                <Form.Item
                    key={path.join('.')}
                    name={path}
                    label={key}
                    rules={constraints.rules}
                >
                    <Component {...constraints} />
                </Form.Item>
            );
        });
    }
    return null;
};


