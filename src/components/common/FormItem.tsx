import { Form, Input } from 'antd';
import { useEffect } from 'react';

interface FormItemProps {
  name: string;
  label: string;
}

const FormItem = ({ name, label }: FormItemProps) => {
  const form = Form.useFormInstance();

  useEffect(() => {
    form.setFieldsValue({ [name]: '' });
  }, [form, name]);

  return (
    <Form.Item 
      name={name} 
      label={<p>{label}</p>}
      rules={[
        {
          required: true,
          message: `Please Enter your ${label}`,
        }
      ]}
      style={{
        marginBottom: "12px"
      }}
    >
      <Input 
        placeholder={`Enter ${label}`}
        style={{
          border: "1px solid #E0E4EC",
          height: "52px",
          background: "white",
          borderRadius: "8px",
          outline: "none",
          width: "100%",
        }}
      />
    </Form.Item>
  );
};

export default FormItem;