import { api } from "../api/baseApi";

const termsAndConditionSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    updateTermsAndConditions: builder.mutation({
      query: (data) => ({
        url: `/others/terms-and-condition`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Settings"],
    }),
    termsAndCondition: builder.query({
      query: (userType = "user") => ({
        url: `/others/terms-and-conditions/${userType}`,
        method: "GET",
      }),
      providesTags: ["Settings"],
      transformResponse: (res: any) => {
        return res?.data || res;
      },
    }),
  }),
});

export const {
  useTermsAndConditionQuery,
  useUpdateTermsAndConditionsMutation,
} = termsAndConditionSlice;

export default termsAndConditionSlice;
