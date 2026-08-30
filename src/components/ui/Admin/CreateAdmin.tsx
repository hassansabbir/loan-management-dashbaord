import { Form, Input, Modal } from 'antd';

interface CreateAdminProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CreateAdmin = ({ open, setOpen }: CreateAdminProps) => { 
  const [form] = Form.useForm();

  const handleClose = () => {
    setOpen(false);
    form.resetFields();
  };

  return (
    <Modal
      centered
      open={open}
      onCancel={handleClose}
      width={500}
      footer={null}
    >
      <div className="p-6 mt-4">
        <h1 className="font-semibold text-[#555555] text-xl mb-3">Add Admin</h1>
        
        <Form form={form} layout='vertical'>
          <Form.Item
            label="Name"
            name="fullName"
            rules={[{ required: true, message: "Please enter the admin's name" }]}
            className="text-[#6D6D6D] py-1"
          >
            <Input className="w-full border outline-none px-3 py-[10px]" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter the admin's email" },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
            className="text-[#6D6D6D] py-1"
          >
            <Input className="w-full border outline-none px-3 py-[10px]" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter a password" }]}
            className="text-[#6D6D6D] py-1"
          >
            <Input.Password className="w-full border outline-none px-3 py-[10px]" />
          </Form.Item>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Admin
            </button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default CreateAdmin;
