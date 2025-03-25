import { z } from 'zod';
import { Card, Form, Input, InputNumber, Select } from 'antd';
import React from 'react';
import { getNumberConstraints, zodToFormRules } from '.';
import { get } from 'lodash-es';

export const getFieldComponent = (schema: z.ZodType<any>, type?: string) => {
    const def = schema._def;

    if (def.typeName === 'ZodDefault') {
        return getFieldComponent(def.innerType);
    }

    if (type) def.typeName = type
    switch (def.typeName) {
        case 'ZodNumber':
            return InputNumber;
        case 'ZodEnum':
            return (props: any) => (
                <Select {...props} >
                    {Object.values(def.values).map((value: string) => (
                        <Select.Option value={value}>
                            {value}
                        </Select.Option>
                    ))}
                </Select>
            );
        case 'ZodString':
            const maxLength = def.checks?.find((c: any) => c.kind === 'max')?.value;
            return maxLength && maxLength > 100 ? Input.TextArea : Input;
        default:
            return Input;
    }
};
const convertFieldPath = (path: string): string[] => {
    return path.includes('.') ? path.split('.') : [path];
};
export const renderFormItem = (schema: z.ZodType<any>, info: { field: string, label?: string, type?: string, parentPath?: string[] }) => {
    if (!info.field) return null;
    const def = schema._def;

    if (def.typeName === 'ZodObject') {
        return Object.entries(def.shape()).map(([key, fieldSchema]: [string, any]) => {
            return (<Card>{renderFormItem(fieldSchema, {
                field: key,
                label: get(fieldSchema, '_def.description', key),
                parentPath: info.parentPath ? [...info.parentPath, info.field] : [info.field]
            })}</Card>);
        });
    } else {
        const Component = getFieldComponent(schema, info.type);
        const constraints = getNumberConstraints(schema);
        const description = schema._def?.description || '';

        // 根据类型返回对应组件
        return (
            <Form.Item
                name={convertFieldPath(info.field)}
                label={(info.label || info.field) + ` ${description}`}
                rules={zodToFormRules(schema)}
                key={info.field}
            >
                <Component {...constraints}/>
            </Form.Item>
        );
    }
};



