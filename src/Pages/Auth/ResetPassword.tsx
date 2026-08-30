import { useResetPasswordMutation } from "@/redux/apiSlices/authSlice";
import { Button, Form, Input, message } from "antd";

import { useNavigate, useLocation } from "react-router-dom";

interface ResetPasswordFormValues {
  newPassword: string;
  confirmPassword: string;
}

interface ResetPasswordRequest {
  email: string | null;
  newPassword: string;
  confirmPassword: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
}

const ResetPassword = () => {
  const location = useLocation();
  const email = new URLSearchParams(location.search).get("email"); // Get email from query params
  const navigate = useNavigate();
  // const [changePassword] = useChangePasswordMutation(); // Destructure mutation with loading state
  const [resetPassword] = useResetPasswordMutation(); // Destructure mutation with loading state

  const onFinish = async (values: ResetPasswordFormValues): Promise<void> => {
    console.log({ email, ...values });
    const data: ResetPasswordRequest = { email, ...values }; // Combine email and new password values into an object

    try {
      const response = (await resetPassword(data).unwrap()) as ApiResponse;
      console.log(response);
      if (response?.success) {
        message.success("Password updated successfully!");
        navigate(`/auth/login`);
      } else {
        message.error(response?.message || "Failed to update password.");
      }
    } catch (error: any) {
      message.error(
        error?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-[25px] font-semibold mb-6">Reset Password</h1>
        <p className="w-[80%] mx-auto">
          Please enter your new password to reset your account credentials.
        </p>
      </div>

      <Form layout="vertical" onFinish={onFinish}>
        {/* New Password */}
        <Form.Item
          name="newPassword"
          label={<p className="font-semibold text-[#5C5C5C]">New Password</p>}
          rules={[
            { required: true, message: "Please input your new password!" },
            { min: 6, message: "Password must be at least 6 characters!" },
          ]}
          style={{ marginBottom: 0 }}
        >
          <Input.Password
            placeholder="Enter new password"
            style={{
              border: "1px solid #E0E4EC",
              height: "52px",
              background: "white",
              borderRadius: "8px",
              outline: "none",
            }}
            className="mb-6"
          />
        </Form.Item>

        {/* Confirm Password */}
        <Form.Item
          name="confirmPassword"
          label={
            <p className="font-semibold text-[#5C5C5C]">Confirm Password</p>
          }
          dependencies={["newPassword"]}
          hasFeedback
          rules={[
            { required: true, message: "Please confirm your password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The new password that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="Confirm new password"
            style={{
              border: "1px solid #E0E4EC",
              height: "52px",
              background: "white",
              borderRadius: "8px",
              outline: "none",
            }}
            className="mb-6"
          />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item style={{ marginBottom: 0 }}>
          <Button
            htmlType="submit"
            style={{
              width: "100%",
              height: 45,
              fontWeight: "400px",
              fontSize: "18px",
              background: "#8b0000",
              marginTop: 20,
              borderRadius: "8px",
              color: "white",
            }}
          >
            Update
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ResetPassword;
