import { useForgotPasswordMutation } from "@/redux/apiSlices/authSlice";
import { Form, Input } from "antd";

import { useNavigate } from "react-router-dom";

interface ForgotPasswordFormValues {
  email: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
}

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [forgotPassword] = useForgotPasswordMutation(); // RTK Query hook

  const onFinish = async (values: ForgotPasswordFormValues): Promise<void> => {
    try {
      // Trigger the RTK Query mutation with the email value
      const response = (await forgotPassword({
        email: values.email,
      }).unwrap()) as ApiResponse;

      // If the response is successful, navigate to the OTP page with email
      if (response?.success) {
        navigate(`/auth/verify-otp?email=${values.email}`);
      } else {
        // Handle failure, display error message if needed
        console.error("Failed to send OTP:", response?.message);
      }
    } catch (error) {
      // Handle RTK Query mutation error
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-[25px] font-semibold mb-6">Forgot Password</h1>
        <p className="w-[90%] mx-auto text-base">
          Enter your email below to reset your password
        </p>
      </div>

      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label={<p>Email</p>}
          name="email"
          id="email"
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
          ]}
        >
          <Input
            placeholder="Enter your email address"
            style={{
              height: 40,
              border: "1px solid #d9d9d9",
              outline: "none",
              boxShadow: "none",
            }}
          />
        </Form.Item>

        <Form.Item>
          <button
            type="submit"
            style={{
              width: "100%",
              height: 45,
              fontWeight: "400px",
              fontSize: "18px",
              marginTop: 20,
            }}
            className="flex items-center justify-center bg-primary text-white rounded-lg"
          >
            Send OTP
          </button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ForgotPassword;
