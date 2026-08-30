import { Checkbox, Form, Input } from "antd";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useLoginMutation } from "@/redux/apiSlices/authSlice";
import { setAuthTokens, setStoredUser } from "@/utils/auth";

interface LoginFormValues {
  email: string;
  password: string;
  remember?: boolean;
}

interface LoginResponse {
  statusCode?: number;
  success?: boolean;
  message?: string;
  data?: {
    accessToken: string;
    refreshToken: string;
    user?: any;
  };
}

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [login, { isLoading }] = useLoginMutation();

  const fromPath = (location.state as any)?.from?.pathname || "/";

  const onFinish = async (values: LoginFormValues): Promise<void> => {
    try {
      const response = (await login({
        email: values.email.trim(),
        password: values.password,
      }).unwrap()) as LoginResponse;

      const accessToken =
        response?.data?.accessToken || (response as any)?.accessToken;
      const refreshToken =
        response?.data?.refreshToken || (response as any)?.refreshToken;
      const user = response?.data?.user || (response as any)?.user;

      if (!accessToken) {
        throw new Error(
          response?.message || "Login failed: No access token returned from server."
        );
      }

      // Store tokens according to Remember Me:
      // If true -> localStorage + 30-day cookie
      // If false -> sessionStorage + session cookie
      setAuthTokens(
        {
          accessToken,
          refreshToken,
        },
        rememberMe
      );

      if (user) {
        setStoredUser(user, rememberMe);
      }

      toast.success(response?.message || "Login successful! Welcome back.");
      navigate(fromPath, { replace: true });
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage =
        error?.data?.message ||
        error?.error ||
        error?.message ||
        "Invalid email or password. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1.5">Welcome Back</h1>
        <p className="text-sm text-gray-500">
          Enter your admin credentials to access your dashboard
        </p>
      </div>

      <Form
        onFinish={onFinish}
        layout="vertical"
        initialValues={{
          remember: false,
        }}
        requiredMark={false}
      >
        {/* Email Field */}
        <Form.Item
          name="email"
          label={
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Email Address
            </span>
          }
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email address" },
          ]}
        >
          <Input
            placeholder="superadmin@gmail.com"
            className="h-11 rounded-lg border-gray-200 focus:border-[#1B64F2] focus:ring-1 focus:ring-[#1B64F2] text-sm"
          />
        </Form.Item>

        {/* Password Field */}
        <Form.Item
          name="password"
          label={
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Password
            </span>
          }
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password
            placeholder="••••••••••••"
            className="h-11 rounded-lg border-gray-200 focus:border-[#1B64F2] focus:ring-1 focus:ring-[#1B64F2] text-sm"
          />
        </Form.Item>

        {/* Remember Me and Forgot Password */}
        <Form.Item className="mb-6">
          <div className="flex justify-between items-center">
            <Checkbox
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="text-sm text-gray-600"
            >
              Remember me
            </Checkbox>

            <Link
              to="/auth/forgot-password"
              className="text-sm font-medium text-[#1B64F2] hover:text-[#1451C9] transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </Form.Item>

        {/* Submit Button */}
        <Form.Item className="mb-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-[#1B64F2] hover:bg-[#1451C9] active:scale-[0.99] text-white font-semibold text-sm rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {isLoading ? (
              <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Sign In"
            )}
          </button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
