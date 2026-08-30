import { api } from "../api/baseApi";

interface LoginData {
  email: string;
  password: string;
}

interface OtpVerifyData {
  email: string;
  oneTimeCode?: string;
  otp?: string;
}

interface ForgotPasswordData {
  email: string;
}

interface ResetPasswordData {
  newPassword?: string;
  confirmPassword?: string;
  password?: string;
  token?: string;
}

interface ChangePasswordData {
  current_password?: string;
  new_password?: string;
  confirm_password?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

interface UpdateProfileData {
  name?: string;
  email?: string;
  address?: string;
  phone?: string;
  profileImg?: any;
  image?: any;
}

export interface ProfileData {
  _id?: string;
  name: string;
  role: string;
  email: string;
  image?: string;
  profileImg?: string;
  status?: string;
  isVerified?: boolean;
  onlineStatus?: {
    isOnline: boolean;
    lastSeen: string;
    lastHeartbeat: string;
  };
  [key: string]: any;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: ProfileData;
}

const authSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<any, LoginData>({
      query: (data) => ({
        method: "POST",
        url: "/auth/login",
        body: data,
      }),
      invalidatesTags: ["AdminData"],
    }),

    otpVerify: builder.mutation<any, OtpVerifyData>({
      query: (data) => ({
        method: "POST",
        url: "/auth/verify-email",
        body: data,
      }),
    }),

    forgotPassword: builder.mutation<any, ForgotPasswordData>({
      query: (data) => ({
        method: "POST",
        url: "/auth/forget-password",
        body: data,
      }),
    }),

    resetPassword: builder.mutation<any, ResetPasswordData>({
      query: (data) => ({
        method: "POST",
        url: "/auth/reset-password",
        body: data,
      }),
    }),

    changePassword: builder.mutation<any, ChangePasswordData>({
      query: (data) => ({
        method: "POST",
        url: "/auth/change-password",
        body: data,
      }),
      invalidatesTags: ["AdminData"],
    }),

    updateProfile: builder.mutation<any, FormData | any>({
      query: (data) => ({
        method: "PATCH",
        url: "/users/profile",
        body: data,
      }),
      invalidatesTags: ["AdminData"],
    }),

    updateAdminProfile: builder.mutation<any, UpdateProfileData | FormData>({
      query: (data) => ({
        method: "PATCH",
        url: "/admin/profile",
        body: data,
      }),
      invalidatesTags: ["AdminData"],
    }),

    updateUserProfile: builder.mutation<any, UpdateProfileData | FormData>({
      query: (data) => ({
        method: "PUT",
        url: "/users/update-profile",
        body: data,
      }),
      invalidatesTags: ["AdminData"],
    }),

    fetchUserProfile: builder.query<ProfileResponse, void>({
      query: () => ({
        method: "GET",
        url: "/users/profile",
      }),
      providesTags: ["AdminData"],
    }),

    getProfile: builder.query<ProfileResponse, void>({
      query: () => ({
        method: "GET",
        url: "/users/profile",
      }),
      providesTags: ["AdminData"],
    }),

    fetchAdminProfile: builder.query<any, void>({
      query: () => ({
        method: "GET",
        url: "/admin/profile",
      }),
      providesTags: ["AdminData"],
    }),
  }),
});

export const {
  useLoginMutation,
  useOtpVerifyMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useUpdateProfileMutation,
  useUpdateAdminProfileMutation,
  useUpdateUserProfileMutation,
  useFetchUserProfileQuery,
  useGetProfileQuery,
  useFetchAdminProfileQuery,
} = authSlice;

export default authSlice;
