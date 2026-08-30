import { Button, Form, Input } from "antd";
import { useState } from "react";
import rentMeLogo from "../../assets/navLogo.png";

import toast from "react-hot-toast";
import { useChangePasswordMutation } from "@/redux/apiSlices/authSlice";

interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ErrorMessages {
  newPassError?: string;
  conPassError?: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
}

const ChangePassword = () => {
  const [form] = Form.useForm<ChangePasswordFormValues>();
  const [errorMessages, setErrorMessages] = useState<ErrorMessages>({
    newPassError: "",
    conPassError: "",
  });

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <img src={rentMeLogo} alt="" />
      </div>
    );
  }

  const validatePasswordChange = (
    values: ChangePasswordFormValues
  ): ErrorMessages => {
    let errors: ErrorMessages = {};

    if (values.currentPassword === values.newPassword) {
      errors.newPassError = "The New password is similar to the old Password";
    }

    if (values.newPassword !== values.confirmPassword) {
      errors.conPassError = "New Password and Confirm Password don't match";
    }

    setErrorMessages(errors);
    return errors;
  };

  const onFinish = async (values: ChangePasswordFormValues): Promise<void> => {
    const errors = validatePasswordChange(values);

    if (Object.keys(errors).length === 0) {
      try {
        const res = (await changePassword({
          current_password: values.currentPassword,
          new_password: values.newPassword,
          confirm_password: values.confirmPassword,
        }).unwrap()) as ApiResponse; // Use `.unwrap()` to get the resolved value or error
        if (res.success) {
          toast.success("Password changed successfully");
        } else {
          toast.error("Password change failed");
        }
      } catch (err) {
        console.error("Error changing password:", err);
        toast.error("An error occurred while changing the password");
      }
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl h-[700px]">
      <Form
        layout="vertical"
        form={form} // Connect the form instance
        onFinish={onFinish}
        className="w-[50%] mx-auto mt-20"
      >
        <Form.Item
          name="currentPassword"
          label={<p>Current Password</p>}
          rules={[
            {
              required: true,
              message: "Please Enter Current Password!",
            },
          ]}
        >
          <Input.Password
            style={{ background: "transparent" }}
            placeholder="Enter current password"
            className="h-12 bg-transparent hover:bg-transparent focus:bg-transparent placeholder:text-gray-500"
          />
        </Form.Item>

        {errorMessages.newPassError && (
          <p style={{ color: "red" }}>{errorMessages.newPassError}</p>
        )}

        <Form.Item
          name="newPassword"
          rules={[
            {
              required: true,
              message: "Please Enter New Password!",
            },
          ]}
          label={<p>New Password</p>}
        >
          <Input.Password
            style={{ background: "transparent" }}
            placeholder="Enter new password"
            className="h-12 bg-transparent hover:bg-transparent focus:bg-transparent placeholder:text-gray-500"
          />
        </Form.Item>

        {errorMessages.conPassError && (
          <p style={{ color: "red" }}>{errorMessages.conPassError}</p>
        )}

        <Form.Item
          label={<p>Confirm Password</p>}
          name="confirmPassword"
          rules={[
            {
              required: true,
              message: "Please Enter Confirm Password!",
            },
          ]}
        >
          <Input.Password
            style={{ background: "transparent" }}
            placeholder="Enter confirm password"
            className="h-12 bg-transparent hover:bg-transparent focus:bg-transparent placeholder:text-gray-500"
          />
        </Form.Item>

        <Form.Item
          style={{
            marginBottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            htmlType="submit"
            block
            style={{
              width: 178,
              height: 48,
              fontWeight: "400px",
              background: "#6DBD44",
              color: "black",
            }}
            className="roboto-medium text-sm leading-4"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePassword;
