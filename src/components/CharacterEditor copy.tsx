import React from 'react';
import { Form, Input, InputNumber, Select, Tabs, Card, Upload } from 'antd';
import type { FormInstance } from 'antd/lib/form';
import { ElementType, getNumberConstraints } from '../common';
import { CharacterSaveSchema } from '../common/char/types';
import { renderFormItems } from '../common/zodForm';
const ZodForm: React.FC<{
  schema: z.ZodType<any>;
  onFinish: (values: any) => void;
  initialValues?: any;
}> = ({ schema, onFinish, initialValues }) => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onFinish}
    >
      {renderFormItems(schema)}
    </Form>
  );
};

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
    <Card>
    <ZodForm
      schema={CharacterSaveSchema}
      onFinish={onSave}
      initialValues={initialValues}
    />
  </Card>
  );
};

export default CharacterEditor;