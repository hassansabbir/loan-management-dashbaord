import {
  useForgotPasswordMutation,
  useOtpVerifyMutation,
} from "@/redux/apiSlices/authSlice";
import { Button, Form, Typography } from "antd";
import { useState } from "react";
import OTPInput from "react-otp-input";
import { useNavigate, useLocation } from "react-router-dom";

const { Text } = Typography;

interface ApiResponse {
  success: boolean;
  data?: string;
  message?: string;
}

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState<string>("");
  const email = new URLSearchParams(location.search).get("email"); // Get email from query params

  console.log(typeof otp);

  const [otpVerify] = useOtpVerifyMutation();
  const [resendOtp] = useForgotPasswordMutation(); // RTK Query mutation for resending OTP

  const onFinish = async (): Promise<void> => {
    try {
      const response = (await otpVerify({
        email: email || "",
        oneTimeCode: otp,
      }).unwrap()) as ApiResponse;

      if (response?.success) {
        localStorage.setItem("Authorization", response.data || "");
        navigate(`/auth/reset-password?email=${email}`);
      } else {
        console.error("OTP verification failed");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  const handleResendEmail = async (): Promise<void> => {
    try {
      // Trigger resend OTP API call with the email
      const response = (await resendOtp({
        email: email || "",
      }).unwrap()) as ApiResponse;

      if (response?.success) {
        console.log("OTP resent successfully");
      } else {
        console.error("Failed to resend OTP");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="text-[25px] font-semibold mb-6">Verify OTP</h1>
        <p className="w-[80%] mx-auto">
          We've sent a verification code to your email. Please check your inbox
          and enter the code here.
        </p>
      </div>

      <Form layout="vertical" onFinish={onFinish}>
        <div className="flex items-center justify-center mb-6">
          <OTPInput
            value={otp}
            onChange={(otp: string) => setOtp(otp)}
            numInputs={6}
            inputStyle={{
              height: 50,
              width: 50,
              borderRadius: "8px",
              margin: "16px",
              fontSize: "20px",
              border: "1px solid #8b0000",
              color: "#2B2A2A",
              outline: "none",
              marginBottom: 10,
            }}
            renderInput={(props) => <input {...props} />}
          />
        </div>

        <div className="flex items-center justify-between mb-6">
          <Text>Didn't receive the code?</Text>

          <p
            onClick={handleResendEmail}
            className="login-form-forgot"
            style={{ color: "black", cursor: "pointer" }}
          >
            Resend
          </p>
        </div>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button
            htmlType="submit"
            style={{
              width: "100%",
              height: 40,
              border: "1px solid #d9d9d9",
              outline: "none",
              boxShadow: "none",
              background: "#8b0000",
              color: "white",
            }}
          >
            Verify
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default VerifyOtp;
