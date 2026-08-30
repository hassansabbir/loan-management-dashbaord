import { api } from "../api/baseApi";

const privacyPolicySlice = api.injectEndpoints({
  endpoints: (builder) => ({
    updatePricyPolicy: builder.mutation({
      query: (data) => ({
        url: `/others/privacy-policy`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Settings"],
    }),
    privacyPolicy: builder.query({
      query: (userType = "user") => ({
        url: `/others/privacy-policy/${userType}`,
        method: "GET",
      }),
      providesTags: ["Settings"],
      transformResponse: (res: any) => {
        return res?.data || res;
      },
    }),
  }),
});

export const { useUpdatePricyPolicyMutation, usePrivacyPolicyQuery } =
  privacyPolicySlice;

export default privacyPolicySlice;
