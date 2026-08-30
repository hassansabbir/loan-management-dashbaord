import { Form, Input } from "antd";

interface ChangePasswordFormValues {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

const ChangePassword = () => {
  const [form] = Form.useForm<ChangePasswordFormValues>();

  const handleChangePassword = (values: ChangePasswordFormValues) => {
    console.log(values);
  };

  return (
    <div className="px-6 lg:px-12 mt-8">
      <Form
        form={form}
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={handleChangePassword}
        className="w-full lg:w-1/2"
      >
        <Form.Item
          name="current_password"
          label={<p className="block">Current Password</p>}
          rules={[
            {
              required: true,
              message: "Please input your current password!",
            },
          ]}
          className="mb-5"
        >
          <Input.Password
            placeholder="Enter Password"
            className="border border-gray-300 h-[50px] bg-white rounded-lg"
          />
        </Form.Item>

        <Form.Item
          name="new_password"
          label={<p className="block">New Password</p>}
          dependencies={["current_password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("current_password") === value) {
                  return Promise.reject(
                    new Error(
                      "The new password and current password do not match!"
                    )
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}
          className="mb-5"
        >
          <Input.Password
            placeholder="Enter password"
            className="border border-gray-300 h-[50px] bg-white rounded-lg"
          />
        </Form.Item>

        <Form.Item
          name="confirm_password"
          label={<p className="block">Re-Type Password</p>}
          dependencies={["new_password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("new_password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The new password that you entered does not match!")
                );
              },
            }),
          ]}
          className="mb-10"
        >
          <Input.Password
            placeholder="Enter password"
            className="border border-gray-300 h-[50px] bg-white rounded-lg"
          />
        </Form.Item>

        <Form.Item className="flex  justify-end">
          <button
            type="submit"
            className="bg-primary text-white w-36 h-11 rounded-lg"
          >
            Save
          </button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePassword;
