import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import toast from "react-hot-toast";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import {
  getAuthToken,
  getRefreshToken,
  setAuthTokens,
  clearAuth,
} from "../../utils/auth";

export const API_BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://10.10.26.180:5004/api/v1";

export const IMAGE_BASE_URL =
  import.meta.env.VITE_IMAGE_URL || "http://10.10.26.180:5004";

// Enhanced base query with token injection, automatic refresh and 401 handling
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, apiInstance, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = getAuthToken();
      if (token && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  let result = await baseQuery(args, apiInstance, extraOptions);

  // If token is expired or unauthorized
  if (result.error && (result.error.status === 401 || result.error.status === 403)) {
    const refreshToken = getRefreshToken();

    if (refreshToken) {
      // Attempt token refresh
      const refreshResult = await baseQuery(
        {
          url: "/auth/refresh-token",
          method: "POST",
          body: { refreshToken },
        },
        apiInstance,
        extraOptions
      );

      const responseData = refreshResult.data as any;
      const newAccessToken =
        responseData?.data?.accessToken || responseData?.accessToken;

      if (newAccessToken) {
        setAuthTokens({
          accessToken: newAccessToken,
          refreshToken,
        });

        // Retry original request with new access token
        result = await baseQuery(args, apiInstance, extraOptions);
      } else {
        // Refresh token failed -> clear session and redirect to login
        clearAuth();
        toast.error("Your session has expired. Please sign in again.");
        if (window.location.pathname !== "/auth/login") {
          window.location.replace("/auth/login");
        }
      }
    } else {
      // No refresh token available
      clearAuth();
      if (window.location.pathname !== "/auth/login" && window.location.pathname !== "/auth") {
        toast.error("Please sign in to access this page.");
        window.location.replace("/auth/login");
      }
    }
  }

  return result;
};

// Create root API with full tag types
export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "AdminData",
    "DashboardOverview",
    "Applications",
    "Borrowers",
    "Transactions",
    "Payouts",
    "Settings",
    "Notifications",
    "Users",
    "Banner",
    "Faqs",
  ],
  endpoints: () => ({}),
});

export const imageUrl = IMAGE_BASE_URL;
export default api;
